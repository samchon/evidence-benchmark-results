import { createHash, randomBytes, randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/sdk";
import type * as api from "@benchmark/shopping-api";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Actor identity resolved from a live access session. */
export interface ShoppingActor {
  id: string;
  type: "customer" | "seller";
  sessionId: string;
}

/** Central business implementation for the shopping API. */
export namespace ShoppingProvider {
  const db = (): PrismaClient => MyGlobal.prisma;
  type SnapshotClient = Pick<PrismaClient, "shopping_products" | "shopping_product_images" | "shopping_variants">;
  type IdentityClient = Pick<PrismaClient, "shopping_customers" | "shopping_sellers">;
  type SessionClient = Pick<PrismaClient, "shopping_customer_sessions" | "shopping_seller_sessions">;
  type AuthorityClient = IdentityClient & Pick<PrismaClient, "shopping_administrator_grades">;
  const now = (): Date => new Date();
  const id = (): string => randomUUID();
  const text = (value: string, label: string): string => {
    if (value.trim().length === 0) throw ErrorUtil.unprocessable(`${label} must not be blank.`);
    return value.trim();
  };
  const date = (value: Date | null): string | null => value?.toISOString() ?? null;
  const hash = (value: string): string => createHash("sha256").update(value).digest("hex");
  const token = (): string => `${randomUUID()}.${randomBytes(24).toString("hex")}`;
  const parseAuth = (authorization?: string): string => {
    if (authorization === undefined || authorization.trim().length === 0)
      throw ErrorUtil.unauthorized("Authentication is required.");
    return authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : authorization;
  };

  function actorResult(actor: ShoppingActor, accessToken: string, refreshToken: string): api.IShoppingAuthorized {
    return { actor: { id: actor.id, type: actor.type }, token: { access: accessToken, refresh: refreshToken } };
  }

  /** Registers one customer and starts its session. Administrator provisioning is explicit. */
  export async function customerJoin(body: api.IShoppingCustomer.IJoin): Promise<api.IShoppingAuthorized> {
    const email = text(body.email, "email");
    const normalized = email.trim().toLowerCase();
    if (await db().shopping_customers.findUnique({ where: { email_normalized: normalized } })) throw ErrorUtil.conflict("That customer email is already registered.");
    const result = await db().$transaction(async (tx) => {
      const customer = await tx.shopping_customers.create({ data: { id: id(), email, email_normalized: normalized, password_hash: hash(body.password), login_state: "active", created_at: now() } });
      await tx.shopping_customer_profiles.create({ data: { id: id(), customer_id: customer.id, display_name: "New customer", phone_number: "", updated_at: now() } });
      const session = await createSession("customer", customer.id, tx);
      return { customer, session };
    });
    const customer = result.customer;
    const session = result.session;
    return actorResult({ id: customer.id, type: "customer", sessionId: session.id }, session.access, session.refresh);
  }

  /** Authenticates a customer without disclosing whether email or password failed. */
  export async function customerLogin(body: api.IShoppingCustomer.ILogin): Promise<api.IShoppingAuthorized> {
    const result = await db().$transaction(async (tx) => {
      const customer = await tx.shopping_customers.findUnique({ where: { email_normalized: body.email.trim().toLowerCase() } });
      if (customer === null || customer.deleted_at !== null || customer.login_state !== "active" || customer.password_hash !== hash(body.password)) throw ErrorUtil.unauthorized("Invalid credentials.");
      const session = await createSession("customer", customer.id, tx);
      return { customer, session };
    });
    const customer = result.customer;
    const session = result.session;
    return actorResult({ id: customer.id, type: "customer", sessionId: session.id }, session.access, session.refresh);
  }

  /** Registers one seller in pending approval state and starts its session. */
  export async function sellerJoin(body: api.IShoppingSeller.IJoin): Promise<api.IShoppingAuthorized> {
    const email = text(body.email, "email");
    const normalized = email.trim().toLowerCase();
    if (await db().shopping_sellers.findUnique({ where: { email_normalized: normalized } })) throw ErrorUtil.conflict("That seller email is already registered.");
    const result = await db().$transaction(async (tx) => {
      const seller = await tx.shopping_sellers.create({ data: { id: id(), email, email_normalized: normalized, password_hash: hash(body.password), approval_state: "pending", rejection_reason: null, suspended: false, login_state: "active", created_at: now() } });
      await tx.shopping_seller_profiles.create({ data: { id: id(), seller_id: seller.id, shop_name: "New shop", shop_description: "", logo: null, updated_at: now() } });
      await tx.shopping_seller_approval_requests.create({ data: { id: id(), seller_id: seller.id, status: "pending", pending_key: seller.id, reason: null, decided_by: null, decided_at: null, created_at: now() } });
      const session = await createSession("seller", seller.id, tx);
      return { seller, session };
    });
    const seller = result.seller;
    const session = result.session;
    return actorResult({ id: seller.id, type: "seller", sessionId: session.id }, session.access, session.refresh);
  }

  /** Authenticates a seller in any non-banned, non-deleted approval state. */
  export async function sellerLogin(body: api.IShoppingSeller.ILogin): Promise<api.IShoppingAuthorized> {
    const result = await db().$transaction(async (tx) => {
      const seller = await tx.shopping_sellers.findUnique({ where: { email_normalized: body.email.trim().toLowerCase() } });
      if (seller === null || seller.deleted_at !== null || seller.login_state !== "active" || seller.password_hash !== hash(body.password)) throw ErrorUtil.unauthorized("Invalid credentials.");
      const session = await createSession("seller", seller.id, tx);
      return { seller, session };
    });
    const seller = result.seller;
    const session = result.session;
    return actorResult({ id: seller.id, type: "seller", sessionId: session.id }, session.access, session.refresh);
  }

  /** Changes one actor's password while retaining only the current session. */
  export async function updatePassword(
    actor: ShoppingActor,
    body: api.IShoppingCustomer.IPasswordUpdate,
  ): Promise<void> {
    const passwordHash = hash(body.currentPassword);
    if (actor.type === "customer") {
      await db().$transaction(async (tx) => {
        const customer = await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } });
        if (customer === null || customer.password_hash !== passwordHash)
          throw ErrorUtil.forbidden("The current password is incorrect.");
        const changedAt = now();
        const changed = await tx.shopping_customers.updateMany({ where: { id: actor.id, deleted_at: null, login_state: "active", password_hash: passwordHash }, data: { password_hash: hash(body.newPassword) } });
        if (changed.count !== 1) throw ErrorUtil.forbidden("The customer account is no longer available.");
        await tx.shopping_customer_sessions.updateMany({ where: { customer_id: actor.id, id: { not: actor.sessionId }, revoked_at: null }, data: { revoked_at: changedAt } });
      });
      return;
    }
    await db().$transaction(async (tx) => {
      const seller = await tx.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } });
      if (seller === null || seller.password_hash !== passwordHash)
        throw ErrorUtil.forbidden("The current password is incorrect.");
      const changedAt = now();
      const changed = await tx.shopping_sellers.updateMany({ where: { id: actor.id, deleted_at: null, login_state: "active", password_hash: passwordHash }, data: { password_hash: hash(body.newPassword) } });
      if (changed.count !== 1) throw ErrorUtil.forbidden("The seller account is no longer available.");
      await tx.shopping_seller_sessions.updateMany({ where: { seller_id: actor.id, id: { not: actor.sessionId }, revoked_at: null }, data: { revoked_at: changedAt } });
    });
  }

  /** Issues a one-time recovery challenge for an existing identity. */
  export async function requestRecovery(
    type: ShoppingActor["type"],
    body: api.IShoppingCustomer.IRecoveryRequest,
  ): Promise<api.IShoppingRecovery> {
    const challenge = token();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const email = text(body.email, "email");
    await db().$transaction(async (tx) => {
      if (type === "customer") {
        const customer = await tx.shopping_customers.findUnique({ where: { email_normalized: email.toLowerCase() } });
        if (customer !== null && customer.deleted_at === null && customer.login_state === "active")
          await tx.shopping_recovery_deliveries.create({ data: { id: id(), actor_type: type, actor_id: customer.id, recipient: customer.email, kind: "passwordRecovery", payload: JSON.stringify({ token: challenge, expiresAt: expiresAt.toISOString() }), secret_hash: hash(challenge), created_at: now(), expires_at: expiresAt, consumed_at: null } });
      } else {
        const seller = await tx.shopping_sellers.findUnique({ where: { email_normalized: email.toLowerCase() } });
        if (seller !== null && seller.deleted_at === null && seller.login_state === "active")
          await tx.shopping_recovery_deliveries.create({ data: { id: id(), actor_type: type, actor_id: seller.id, recipient: seller.email, kind: "passwordRecovery", payload: JSON.stringify({ token: challenge, expiresAt: expiresAt.toISOString() }), secret_hash: hash(challenge), created_at: now(), expires_at: expiresAt, consumed_at: null } });
      }
    });
    return { accepted: true, expiresAt: expiresAt.toISOString() };
  }

  /** Consumes a recovery challenge and revokes every earlier session. */
  export async function completeRecovery(
    type: ShoppingActor["type"],
    body: api.IShoppingCustomer.IRecoveryComplete,
  ): Promise<void> {
    const challengeHash = hash(body.token);
    const delivery = await db().shopping_recovery_deliveries.findFirst({ where: { actor_type: type, secret_hash: challengeHash, consumed_at: null } });
    if (delivery === null || delivery.expires_at <= now())
      throw ErrorUtil.unauthorized("The recovery challenge is invalid or expired.");
    const consumedAt = now();
    await db().$transaction(async (tx) => {
      const consumed = await tx.shopping_recovery_deliveries.updateMany({ where: { id: delivery.id, consumed_at: null, expires_at: { gt: consumedAt } }, data: { consumed_at: consumedAt } });
      if (consumed.count !== 1) throw ErrorUtil.unauthorized("The recovery challenge is invalid or expired.");
      if (type === "customer") {
        const customer = await tx.shopping_customers.findFirst({ where: { id: delivery.actor_id, deleted_at: null, login_state: "active" } });
        if (customer === null) throw ErrorUtil.unauthorized("The recovery challenge is invalid or expired.");
        await tx.shopping_customers.update({ where: { id: customer.id }, data: { password_hash: hash(body.newPassword) } });
        await tx.shopping_customer_sessions.updateMany({ where: { customer_id: customer.id, revoked_at: null }, data: { revoked_at: consumedAt } });
      } else {
        const seller = await tx.shopping_sellers.findFirst({ where: { id: delivery.actor_id, deleted_at: null, login_state: "active" } });
        if (seller === null) throw ErrorUtil.unauthorized("The recovery challenge is invalid or expired.");
        await tx.shopping_sellers.update({ where: { id: seller.id }, data: { password_hash: hash(body.newPassword) } });
        await tx.shopping_seller_sessions.updateMany({ where: { seller_id: seller.id, revoked_at: null }, data: { revoked_at: consumedAt } });
      }
    });
  }

  /** Continues one customer or seller session with a new access token. */
  export async function refresh(type: ShoppingActor["type"], body: api.IShoppingCustomer.IRefresh): Promise<api.IShoppingAuthorized> {
    const refreshHash = hash(body.refreshToken);
    if (type === "customer") {
      return db().$transaction(async (tx) => {
        const session = await tx.shopping_customer_sessions.findUnique({ where: { refresh_hash: refreshHash } });
        if (session === null || session.revoked_at !== null || session.expired_at <= now()) throw ErrorUtil.unauthorized("The refresh session is no longer valid.");
        const customer = await tx.shopping_customers.findUnique({ where: { id: session.customer_id } });
        if (customer === null || customer.login_state !== "active" || customer.deleted_at !== null) throw ErrorUtil.unauthorized("The account is unavailable.");
        const access = token(); await tx.shopping_customer_sessions.update({ where: { id: session.id }, data: { access_hash: hash(access) } });
        return actorResult({ id: customer.id, type, sessionId: session.id }, access, body.refreshToken);
      });
    }
    return db().$transaction(async (tx) => {
      const session = await tx.shopping_seller_sessions.findUnique({ where: { refresh_hash: refreshHash } });
      if (session === null || session.revoked_at !== null || session.expired_at <= now()) throw ErrorUtil.unauthorized("The refresh session is no longer valid.");
      const seller = await tx.shopping_sellers.findUnique({ where: { id: session.seller_id } });
      if (seller === null || seller.login_state !== "active" || seller.deleted_at !== null) throw ErrorUtil.unauthorized("The account is unavailable.");
      const access = token(); await tx.shopping_seller_sessions.update({ where: { id: session.id }, data: { access_hash: hash(access) } });
      return actorResult({ id: seller.id, type, sessionId: session.id }, access, body.refreshToken);
    });
  }

  interface SessionTokens { id: string; access: string; refresh: string; }
  async function createSession(type: ShoppingActor["type"], actorId: string, client: Pick<PrismaClient, "shopping_customer_sessions" | "shopping_seller_sessions"> = db()): Promise<SessionTokens> {
    const access = token(); const refreshToken = token(); const expiry = new Date(Date.now() + Number(MyGlobal.env.JWT_REFRESH_TTL_SECONDS) * 1000);
    if (type === "customer") {
      const row = await client.shopping_customer_sessions.create({ data: { id: id(), customer_id: actorId, access_hash: hash(access), refresh_hash: hash(refreshToken), expired_at: expiry, revoked_at: null, created_at: now() } });
      return { id: row.id, access, refresh: refreshToken };
    }
    const row = await client.shopping_seller_sessions.create({ data: { id: id(), seller_id: actorId, access_hash: hash(access), refresh_hash: hash(refreshToken), expired_at: expiry, revoked_at: null, created_at: now() } });
    return { id: row.id, access, refresh: refreshToken };
  }

  /** Resolves a current bearer session and its actor type. */
  export async function authenticate(authorization: string | undefined, type: ShoppingActor["type"]): Promise<ShoppingActor> {
    const access = hash(parseAuth(authorization));
    if (type === "customer") {
      return db().$transaction(async (tx) => {
        const session = await tx.shopping_customer_sessions.findUnique({ where: { access_hash: access } });
        if (session === null || session.revoked_at !== null || session.expired_at <= now()) throw ErrorUtil.unauthorized("The session is no longer valid.");
        const customer = await tx.shopping_customers.findUnique({ where: { id: session.customer_id } });
        if (customer === null || customer.login_state !== "active" || customer.deleted_at !== null) throw ErrorUtil.unauthorized("The account is unavailable.");
        return { id: customer.id, type, sessionId: session.id };
      });
    }
    return db().$transaction(async (tx) => {
      const session = await tx.shopping_seller_sessions.findUnique({ where: { access_hash: access } });
      if (session === null || session.revoked_at !== null || session.expired_at <= now()) throw ErrorUtil.unauthorized("The session is no longer valid.");
      const seller = await tx.shopping_sellers.findUnique({ where: { id: session.seller_id } });
      if (seller === null || seller.login_state !== "active" || seller.deleted_at !== null) throw ErrorUtil.unauthorized("The account is unavailable.");
      return { id: seller.id, type, sessionId: session.id };
    });
  }

  /** Resolves either authenticated commerce identity for shared taxonomy browsing. */
  export async function authenticateBrowse(authorization: string | undefined): Promise<ShoppingActor> {
    try {
      return await authenticate(authorization, "customer");
    } catch {
      return authenticate(authorization, "seller");
    }
  }

  /** Resolves a logout token without making repeated logout an error. */
  export async function authenticateForLogout(authorization: string | undefined, type: ShoppingActor["type"]): Promise<ShoppingActor | null> {
    if (authorization === undefined || authorization.trim().length === 0) return null;
    const access = hash(parseAuth(authorization));
    if (type === "customer") {
      const session = await db().shopping_customer_sessions.findUnique({ where: { access_hash: access } });
      return session === null ? null : { id: session.customer_id, type, sessionId: session.id };
    }
    const session = await db().shopping_seller_sessions.findUnique({ where: { access_hash: access } });
    return session === null ? null : { id: session.seller_id, type, sessionId: session.id };
  }

  /** Resolves either underlying identity type for platform-wide administrator routes. */
  export async function authenticateAdmin(authorization: string | undefined): Promise<ShoppingActor> {
    try {
      return await authenticate(authorization, "customer");
    } catch {
      return authenticate(authorization, "seller");
    }
  }

  /** Revokes one current session. */
  export async function logout(actor: ShoppingActor): Promise<void> {
    if (actor.type === "customer") await db().shopping_customer_sessions.updateMany({ where: { id: actor.sessionId }, data: { revoked_at: now() } });
    else await db().shopping_seller_sessions.updateMany({ where: { id: actor.sessionId }, data: { revoked_at: now() } });
  }
  /** Revokes every session for one actor. */
  export async function logoutAll(actor: ShoppingActor): Promise<void> {
    if (actor.type === "customer") await db().shopping_customer_sessions.updateMany({ where: { customer_id: actor.id, revoked_at: null }, data: { revoked_at: now() } });
    else await db().shopping_seller_sessions.updateMany({ where: { seller_id: actor.id, revoked_at: null }, data: { revoked_at: now() } });
  }

  /** Returns a customer profile. */
  export async function customerProfile(actor: ShoppingActor): Promise<api.IShoppingCustomerProfile> {
    const profile = await db().shopping_customer_profiles.findUnique({ where: { customer_id: actor.id } });
    if (profile === null) throw ErrorUtil.notFound("The customer profile does not exist.");
    return { displayName: profile.display_name, phoneNumber: profile.phone_number };
  }
  /** Replaces a customer profile. */
  export async function updateCustomerProfile(actor: ShoppingActor, body: api.IShoppingCustomerProfile.IUpdate): Promise<api.IShoppingCustomerProfile> {
    const profile = await db().$transaction(async (tx) => {
      const customer = await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } });
      if (customer === null) throw ErrorUtil.forbidden("The customer account is no longer available.");
      const changed = await tx.shopping_customer_profiles.updateMany({ where: { customer_id: actor.id }, data: { display_name: text(body.displayName, "displayName"), phone_number: text(body.phoneNumber, "phoneNumber"), updated_at: now() } });
      if (changed.count !== 1) throw ErrorUtil.notFound("The customer profile does not exist.");
      const row = await tx.shopping_customer_profiles.findUnique({ where: { customer_id: actor.id } });
      if (row === null) throw ErrorUtil.notFound("The customer profile does not exist.");
      return row;
    });
    return { displayName: profile.display_name, phoneNumber: profile.phone_number };
  }
  /** Returns a seller profile, either as owner or public customer view. */
  export async function sellerProfile(sellerId: string): Promise<api.IShoppingSellerProfile & { id: string }> {
    const profile = await db().shopping_seller_profiles.findUnique({ where: { seller_id: sellerId } });
    const seller = await db().shopping_sellers.findUnique({ where: { id: sellerId } });
    if (profile === null || seller === null || seller.deleted_at !== null) throw ErrorUtil.notFound("The seller profile does not exist.");
    return { id: sellerId, shopName: profile.shop_name, shopDescription: profile.shop_description, logo: profile.logo };
  }
  /** Replaces a seller profile and records immutable evidence. */
  export async function updateSellerProfile(actor: ShoppingActor, body: api.IShoppingSellerProfile.IUpdate): Promise<api.IShoppingSellerProfile> {
    const current = await db().shopping_seller_profiles.findUnique({ where: { seller_id: actor.id } });
    if (current === null) throw ErrorUtil.notFound("The seller profile does not exist.");
    const shopName = text(body.shopName, "shopName");
    const shopDescription = text(body.shopDescription, "shopDescription");
    const changedAt = now();
    const updated = await db().$transaction(async (tx) => { const seller = await tx.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } }); if (seller === null) throw ErrorUtil.forbidden("The seller account is no longer available."); const current = await tx.shopping_seller_profiles.findUnique({ where: { seller_id: actor.id } }); if (current === null) throw ErrorUtil.notFound("The seller profile does not exist."); const before = { shopName: current.shop_name, shopDescription: current.shop_description, logo: current.logo }; const after = { shopName, shopDescription, logo: body.logo === undefined ? current.logo : body.logo }; const changed = [before.shopName === after.shopName ? null : "shopName", before.shopDescription === after.shopDescription ? null : "shopDescription", before.logo === after.logo ? null : "logo"].filter((field): field is string => field !== null); const result = await tx.shopping_seller_profiles.update({ where: { seller_id: actor.id }, data: { shop_name: after.shopName, shop_description: after.shopDescription, logo: after.logo, updated_at: changedAt } }); await tx.shopping_snapshots.create({ data: { id: id(), kind: "sellerProfile", subject_type: "seller", subject_id: actor.id, changed: JSON.stringify(changed), before_data: JSON.stringify(before), after_data: JSON.stringify({ shopName: result.shop_name, shopDescription: result.shop_description, logo: result.logo }), created_at: changedAt } }); return result; });
    return { shopName: updated.shop_name, shopDescription: updated.shop_description, logo: updated.logo };
  }

  /** Returns all owned saved addresses. */
  export async function addresses(actor: ShoppingActor): Promise<api.IShoppingShippingAddress[]> {
    const rows = await db().shopping_shipping_addresses.findMany({ where: { customer_id: actor.id }, orderBy: [{ is_default: "desc" }, { created_at: "asc" }] });
    return rows.map(addressDto);
  }
  /** Adds a non-default saved address. */
  export async function createAddress(actor: ShoppingActor, body: api.IShoppingShippingAddress.ICreate): Promise<api.IShoppingShippingAddress> {
    const row = await db().$transaction(async (tx) => { const customer = await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } }); if (customer === null) throw ErrorUtil.forbidden("The customer account is no longer available."); return tx.shopping_shipping_addresses.create({ data: { id: id(), customer_id: actor.id, ...addressData(body), is_default: false, created_at: now() } }); });
    return addressDto(row);
  }
  /** Replaces an owned saved address. */
  export async function updateAddress(actor: ShoppingActor, addressId: string, body: api.IShoppingShippingAddress.IUpdate): Promise<api.IShoppingShippingAddress> {
    const row = await db().$transaction(async (tx) => {
      const customer = await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } });
      if (customer === null) throw ErrorUtil.forbidden("The customer account is no longer available.");
      const changed = await tx.shopping_shipping_addresses.updateMany({ where: { id: addressId, customer_id: actor.id }, data: addressData(body) });
      if (changed.count !== 1) throw ErrorUtil.notFound("The shipping address does not exist.");
      const updated = await tx.shopping_shipping_addresses.findUnique({ where: { id: addressId } });
      if (updated === null) throw ErrorUtil.notFound("The shipping address does not exist.");
      return updated;
    });
    return addressDto(row);
  }
  /** Deletes an owned saved address. */
  export async function deleteAddress(actor: ShoppingActor, addressId: string): Promise<void> {
    await db().$transaction(async (tx) => {
      const customer = await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } });
      if (customer === null) throw ErrorUtil.forbidden("The customer account is no longer available.");
      const deleted = await tx.shopping_shipping_addresses.deleteMany({ where: { id: addressId, customer_id: actor.id } });
      if (deleted.count !== 1) throw ErrorUtil.notFound("The shipping address does not exist.");
    });
  }
  /** Makes one owned address the only default. */
  export async function defaultAddress(actor: ShoppingActor, addressId: string): Promise<api.IShoppingShippingAddress> {
    return addressDto(await db().$transaction(async (tx) => { const customer = await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } }); if (customer === null) throw ErrorUtil.forbidden("The customer account is no longer available."); const owned = await tx.shopping_shipping_addresses.findFirst({ where: { id: addressId, customer_id: actor.id } }); if (owned === null) throw ErrorUtil.notFound("The shipping address does not exist."); await tx.shopping_shipping_addresses.updateMany({ where: { customer_id: actor.id }, data: { is_default: false } }); return tx.shopping_shipping_addresses.update({ where: { id: addressId, customer_id: actor.id }, data: { is_default: true } }); }));
  }

  function addressData(body: api.IShoppingShippingAddress.ICreate) {
    return { recipient_name: text(body.recipientName, "recipientName"), recipient_phone: text(body.recipientPhone, "recipientPhone"), street_address: text(body.streetAddress, "streetAddress"), city: text(body.city, "city"), state_or_province: text(body.stateOrProvince, "stateOrProvince"), postal_code: text(body.postalCode, "postalCode"), country: text(body.country, "country") };
  }
  function addressDto(row: { id: string; recipient_name: string; recipient_phone: string; street_address: string; city: string; state_or_province: string; postal_code: string; country: string; is_default: boolean }): api.IShoppingShippingAddress {
    return { id: row.id, recipientName: row.recipient_name, recipientPhone: row.recipient_phone, streetAddress: row.street_address, city: row.city, stateOrProvince: row.state_or_province, postalCode: row.postal_code, country: row.country, isDefault: row.is_default };
  }

  async function grantGrade(actorType: string, actorId: string, grade: string): Promise<void> {
    await db().shopping_administrator_grades.create({ data: { id: id(), actor_type: actorType, actor_id: actorId, grade, created_at: now() } });
  }
  async function hasGrade(actor: ShoppingActor, grade?: string): Promise<boolean> {
    const rows = await db().shopping_administrator_grades.findMany({ where: { actor_type: actor.type, actor_id: actor.id } });
    return grade === undefined ? rows.length > 0 : rows.some((row) => row.grade === grade || (grade === "regularAdministrator" && row.grade === "superAdministrator"));
  }
  async function requireAdmin(actor: ShoppingActor, superOnly = false): Promise<void> {
    if (!(await hasGrade(actor, superOnly ? "superAdministrator" : "regularAdministrator"))) throw ErrorUtil.forbidden("Administrator authority is required.");
  }
  async function requireCustomerAtCommit(actor: ShoppingActor, client: IdentityClient): Promise<void> {
    if (actor.type !== "customer") throw ErrorUtil.forbidden("Customer authority is required.");
    const customer = await client.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } });
    if (customer === null) throw ErrorUtil.forbidden("The customer account is no longer available.");
  }
  async function requireSellerAtCommit(actor: ShoppingActor, client: IdentityClient, catalog = false): Promise<void> {
    if (actor.type !== "seller") throw ErrorUtil.forbidden("Seller authority is required.");
    const seller = await client.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } });
    if (seller === null) throw ErrorUtil.forbidden("The seller account is unavailable.");
    if (catalog && (seller.approval_state !== "approved" || seller.suspended)) throw ErrorUtil.forbidden("The seller is not eligible for catalog changes.");
  }
  async function requireSessionAtCommit(actor: ShoppingActor, client: SessionClient): Promise<void> {
    const session = actor.type === "customer"
      ? await client.shopping_customer_sessions.findFirst({ where: { id: actor.sessionId, customer_id: actor.id, revoked_at: null, expired_at: { gt: now() } } })
      : await client.shopping_seller_sessions.findFirst({ where: { id: actor.sessionId, seller_id: actor.id, revoked_at: null, expired_at: { gt: now() } } });
    if (session === null) throw ErrorUtil.unauthorized("The session is no longer valid.");
  }
  async function requireAdminAtCommit(actor: ShoppingActor, client: AuthorityClient, superOnly = false): Promise<void> {
    const identity = actor.type === "customer"
      ? await client.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } })
      : await client.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } });
    if (identity === null) throw ErrorUtil.forbidden("Administrator authority is no longer available.");
    const grades = await client.shopping_administrator_grades.findMany({ where: { actor_type: actor.type, actor_id: actor.id } });
    if (!grades.some((grade) => grade.grade === (superOnly ? "superAdministrator" : "regularAdministrator") || (!superOnly && grade.grade === "superAdministrator"))) throw ErrorUtil.forbidden("Administrator authority is required.");
  }
  async function requireTargetModeration(actor: ShoppingActor, targetType: ShoppingActor["type"], targetId: string): Promise<void> { if (actor.type === targetType && actor.id === targetId) throw ErrorUtil.forbidden("An administrator cannot target itself."); if (await hasGrade({ id: targetId, type: targetType, sessionId: "" }, "superAdministrator") && !(await hasGrade(actor, "superAdministrator"))) throw ErrorUtil.forbidden("A regular administrator cannot target a super administrator."); }
  async function requireTargetModerationAtCommit(actor: ShoppingActor, targetType: ShoppingActor["type"], targetId: string, client: AuthorityClient): Promise<void> {
    if (actor.type === targetType && actor.id === targetId) throw ErrorUtil.forbidden("An administrator cannot target itself.");
    const targetGrades = await client.shopping_administrator_grades.findMany({ where: { actor_type: targetType, actor_id: targetId } });
    const actorGrades = await client.shopping_administrator_grades.findMany({ where: { actor_type: actor.type, actor_id: actor.id } });
    if (targetGrades.some((grade) => grade.grade === "superAdministrator") && !actorGrades.some((grade) => grade.grade === "superAdministrator"))
      throw ErrorUtil.forbidden("A regular administrator cannot target a super administrator.");
  }
  async function snapshot(kind: string, subjectType: string, subjectId: string, before: unknown, after: unknown): Promise<void> {
    await db().shopping_snapshots.create({ data: { id: id(), kind, subject_type: subjectType, subject_id: subjectId, changed: JSON.stringify([kind]), before_data: JSON.stringify(before), after_data: JSON.stringify(after), created_at: now() } });
  }

  /** Lists immutable product evidence for its owner or an administrator. */
  export async function productSnapshots(
    actor: ShoppingActor,
    productId: string,
    input: api.IPage.IRequest,
    admin: boolean,
  ): Promise<api.IPage<api.IShoppingProduct.ISnapshot>> {
    const productRow = await db().shopping_products.findUnique({ where: { id: productId } });
    if (productRow === null) throw ErrorUtil.notFound("The product does not exist.");
    if (admin) await requireAdmin(actor);
    else if (actor.type !== "seller" || productRow.seller_id !== actor.id)
      throw ErrorUtil.forbidden("Only the product owner may view these snapshots.");
    const rows = await db().shopping_snapshots.findMany({ where: { subject_type: "product", subject_id: productId }, orderBy: [{ created_at: "desc" }, { id: "desc" }] });
    return page(rows.map((row) => ({ id: row.id, changed: JSON.parse(row.changed) as string[], before: JSON.parse(row.before_data) as api.IShoppingProduct.ISnapshot.IState, after: JSON.parse(row.after_data) as api.IShoppingProduct.ISnapshot.IState, createdAt: row.created_at.toISOString() })), input);
  }

  /** Lists immutable seller-profile evidence for its owner or an administrator. */
  export async function sellerProfileSnapshots(actor: ShoppingActor, input: api.IPage.IRequest, admin: boolean, sellerId = actor.id): Promise<api.IPage<api.IShoppingSnapshot>> {
    const seller = await db().shopping_sellers.findUnique({ where: { id: sellerId } });
    if (seller === null) throw ErrorUtil.notFound("The seller does not exist.");
    if (admin) await requireAdmin(actor);
    else if (actor.type !== "seller" || actor.id !== sellerId) throw ErrorUtil.forbidden("Only the seller owner may view these snapshots.");
    const rows = await db().shopping_snapshots.findMany({ where: { kind: "sellerProfile", subject_type: "seller", subject_id: sellerId }, orderBy: [{ created_at: "desc" }, { id: "desc" }] });
    return snapshotPage(rows, input);
  }

  /** Lists immutable review evidence for its author or an administrator. */
  export async function reviewSnapshots(actor: ShoppingActor, reviewId: string, input: api.IPage.IRequest, admin: boolean): Promise<api.IPage<api.IShoppingSnapshot>> {
    const review = await db().shopping_reviews.findUnique({ where: { id: reviewId } });
    if (review === null) throw ErrorUtil.notFound("The review does not exist.");
    if (admin) await requireAdmin(actor);
    else if (actor.type !== "customer" || review.customer_id !== actor.id) throw ErrorUtil.forbidden("Only the review author may view these snapshots.");
    const rows = await db().shopping_snapshots.findMany({ where: { subject_type: "review", subject_id: reviewId }, orderBy: [{ created_at: "desc" }, { id: "desc" }] });
    return snapshotPage(rows, input);
  }

  /** Lists cancellation and refund evidence visible within one order scope. */
  export async function orderSnapshots(actor: ShoppingActor, orderId: string, input: api.IPage.IRequest, scope: "customer" | "seller" | "admin"): Promise<api.IPage<api.IShoppingSnapshot>> {
    const order = await db().shopping_orders.findUnique({ where: { id: orderId } });
    if (order === null) throw ErrorUtil.notFound("The order does not exist.");
    if (scope === "admin") await requireAdmin(actor);
    else if (scope === "customer" && (actor.type !== "customer" || order.customer_id !== actor.id)) throw ErrorUtil.forbidden("The order belongs to another customer.");
    const items = await db().shopping_order_items.findMany({ where: { order_id: orderId, ...(scope === "seller" ? { seller_id: actor.id } : {}) }, select: { id: true } });
    if (scope === "seller" && items.length === 0) throw ErrorUtil.forbidden("The order has no item owned by this seller.");
    const itemIds = items.map((item) => item.id);
    const [cancellations, refunds] = await Promise.all([
      db().shopping_cancellation_requests.findMany({ where: { order_item_id: { in: itemIds } }, select: { id: true } }),
      db().shopping_refund_requests.findMany({ where: { order_item_id: { in: itemIds } }, select: { id: true } }),
    ]);
    const subjectIds = [...cancellations, ...refunds].map((request) => request.id);
    const rows = subjectIds.length === 0 ? [] : await db().shopping_snapshots.findMany({ where: { subject_type: { in: ["cancellation", "refund"] }, subject_id: { in: subjectIds } }, orderBy: [{ created_at: "desc" }, { id: "desc" }] });
    return snapshotPage(rows, input);
  }

  function snapshotPage(rows: Array<{ id: string; kind: string; subject_type: string; subject_id: string; changed: string; before_data: string; after_data: string; created_at: Date }>, input: api.IPage.IRequest): api.IPage<api.IShoppingSnapshot> {
    return page(rows.map((row) => ({ id: row.id, kind: row.kind, subjectType: row.subject_type, subjectId: row.subject_id, changed: JSON.parse(row.changed) as string[], before: JSON.parse(row.before_data) as Record<string, unknown>, after: JSON.parse(row.after_data) as Record<string, unknown>, createdAt: row.created_at.toISOString() })), input);
  }

  /** Creates a top-level category or a direct child category. */
  export async function createCategory(actor: ShoppingActor, body: api.IShoppingCategory.ICreate): Promise<api.IShoppingCategory> {
    await requireAdmin(actor);
    const result = await db().$transaction(async (tx) => {
      await requireAdminAtCommit(actor, tx);
      let parent: { id: string; name: string; description: string } | null = null;
      if (body.parentId !== undefined) {
        parent = await tx.shopping_categories.findFirst({ where: { id: body.parentId, deleted_at: null, parent_id: null }, select: { id: true, name: true, description: true } });
        if (parent === null) throw ErrorUtil.unprocessable("A category parent must be a live top-level category.");
      }
      const row = await tx.shopping_categories.create({ data: { id: id(), name: text(body.name, "name"), description: text(body.description, "description"), parent_id: parent?.id ?? null, created_at: now(), deleted_at: null } });
      return { row, parent };
    });
    return categoryDto(result.row, result.parent, []);
  }
  /** Lists the complete two-level live category tree. */
  export async function categories(actor: ShoppingActor): Promise<api.IShoppingCategory[]> {
    if (actor.type !== "customer" && actor.type !== "seller") throw ErrorUtil.forbidden("Only commerce identities browse categories.");
    const rows = await db().shopping_categories.findMany({ where: { deleted_at: null, parent_id: null }, orderBy: [{ name: "asc" }, { id: "asc" }] });
    const children = await db().shopping_categories.findMany({ where: { deleted_at: null, parent_id: { not: null } }, orderBy: [{ name: "asc" }, { id: "asc" }] });
    return rows.map((row) => categoryDto(row, null, children.filter((child) => child.parent_id === row.id).map((child) => ({ id: child.id, name: child.name, description: child.description }))));
  }
  /** Replaces a category's name and description. */
  export async function updateCategory(actor: ShoppingActor, categoryId: string, body: api.IShoppingCategory.IUpdate): Promise<api.IShoppingCategory> {
    await requireAdmin(actor);
    const result = await db().$transaction(async (tx) => { await requireAdminAtCommit(actor, tx); const existing = await tx.shopping_categories.findFirst({ where: { id: categoryId, deleted_at: null } }); if (existing === null) throw ErrorUtil.notFound("The category does not exist."); const changed = await tx.shopping_categories.updateMany({ where: { id: categoryId, deleted_at: null }, data: { name: text(body.name, "name"), description: text(body.description, "description") } }); if (changed.count !== 1) throw ErrorUtil.conflict("The category is no longer live."); const row = await tx.shopping_categories.findUnique({ where: { id: categoryId } }); if (row === null) throw ErrorUtil.conflict("The category is no longer live."); const parent = existing.parent_id === null ? null : await tx.shopping_categories.findFirst({ where: { id: existing.parent_id, deleted_at: null }, select: { id: true, name: true, description: true } }); return { row, parent }; });
    return categoryDto(result.row, result.parent, []);
  }
  /** Retires a category and uncategorizes its products. */
  export async function deleteCategory(actor: ShoppingActor, categoryId: string): Promise<void> {
    await requireAdmin(actor);
    const deletedAt = now();
    await db().$transaction(async (tx) => {
      await requireAdminAtCommit(actor, tx);
      const existing = await tx.shopping_categories.findFirst({ where: { id: categoryId, deleted_at: null } });
      if (existing === null) throw ErrorUtil.notFound("The category does not exist.");
      const ids = existing.parent_id === null ? [categoryId, ...(await tx.shopping_categories.findMany({ where: { parent_id: categoryId, deleted_at: null }, select: { id: true } })).map((row) => row.id)] : [categoryId];
      await tx.shopping_products.updateMany({ where: { category_id: { in: ids }, deleted_at: null }, data: { category_id: null } });
      const deleted = await tx.shopping_categories.updateMany({ where: { id: { in: ids }, deleted_at: null }, data: { deleted_at: deletedAt } });
      if (deleted.count !== ids.length) throw ErrorUtil.conflict("The category changed before retirement committed.");
    });
  }
  /** Lists products assigned directly to one live category. */
  export async function categoryProducts(actor: ShoppingActor, categoryId: string, input: api.IShoppingProduct.IRequest): Promise<api.IPage<api.IShoppingProduct.ISummary>> {
    if (actor.type !== "customer" && actor.type !== "seller") throw ErrorUtil.forbidden("Only commerce identities browse catalog categories.");
    if (await db().shopping_categories.findFirst({ where: { id: categoryId, deleted_at: null } }) === null) throw ErrorUtil.notFound("The category does not exist.");
    return productPage({ categoryId }, input);
  }
  function categoryDto(row: { id: string; name: string; description: string }, parent: { id: string; name: string; description: string } | null, children: api.IShoppingCategory.ISummary[]): api.IShoppingCategory {
    return { id: row.id, name: row.name, description: row.description, parent: parent === null ? null : { ...parent }, children };
  }

  /** Creates an approved seller product with no variants or images. */
  export async function createProduct(actor: ShoppingActor, body: api.IShoppingProduct.ICreate): Promise<api.IShoppingProduct> {
    await requireSellerCatalog(actor);
    const row = await db().$transaction(async (tx) => {
      const seller = await tx.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active", approval_state: "approved", suspended: false } });
      if (seller === null) throw ErrorUtil.forbidden("The seller is not eligible for catalog changes.");
      const category = await tx.shopping_categories.findFirst({ where: { id: body.categoryId, deleted_at: null } });
      if (category === null) throw ErrorUtil.unprocessable("The category does not exist.");
      return tx.shopping_products.create({ data: { id: id(), seller_id: actor.id, category_id: category.id, name: text(body.name, "name"), description: text(body.description, "description"), base_price: nonnegative(body.basePrice, "basePrice"), created_at: now(), deleted_at: null } });
    });
    return product(actor, row.id, false);
  }
  /** Replaces product catalog fields and records complete evidence. */
  export async function updateProduct(actor: ShoppingActor, productId: string, body: api.IShoppingProduct.IUpdate): Promise<api.IShoppingProduct> {
    await requireSellerCatalog(actor);
    const changedAt = now();
    await db().$transaction(async (tx) => {
      const seller = await tx.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active", approval_state: "approved", suspended: false } });
      if (seller === null) throw ErrorUtil.forbidden("The seller is not eligible for catalog changes.");
      const existing = await tx.shopping_products.findFirst({ where: { id: productId, seller_id: actor.id, deleted_at: null } });
      if (existing === null) throw ErrorUtil.notFound("The product does not exist.");
      const category = await tx.shopping_categories.findFirst({ where: { id: body.categoryId, deleted_at: null } });
      if (category === null) throw ErrorUtil.unprocessable("The category does not exist.");
      const before = await productSnapshotData(tx, productId);
      const afterFields = { name: text(body.name, "name"), description: text(body.description, "description"), categoryId: category.id, basePrice: nonnegative(body.basePrice, "basePrice") };
      const changed = [before.name === afterFields.name ? null : "name", before.description === afterFields.description ? null : "description", before.categoryId === afterFields.categoryId ? null : "categoryId", before.basePrice === afterFields.basePrice ? null : "basePrice"].filter((field): field is string => field !== null);
      const updated = await tx.shopping_products.updateMany({ where: { id: productId, seller_id: actor.id, deleted_at: null }, data: { name: afterFields.name, description: afterFields.description, category_id: afterFields.categoryId, base_price: afterFields.basePrice } });
      if (updated.count !== 1) throw ErrorUtil.conflict("The product changed before the edit committed.");
      const after = await tx.shopping_products.findUnique({ where: { id: productId } });
      const [images, variants] = await Promise.all([tx.shopping_product_images.findMany({ where: { product_id: productId }, orderBy: { display_order: "asc" } }), tx.shopping_variants.findMany({ where: { product_id: productId, deleted_at: null } })]);
      await tx.shopping_snapshots.create({ data: { id: id(), kind: "product", subject_type: "product", subject_id: existing.id, changed: JSON.stringify(changed), before_data: JSON.stringify(before), after_data: JSON.stringify({ name: after?.name, description: after?.description, categoryId: after?.category_id, basePrice: after?.base_price, images: images.map((image) => ({ id: image.id, url: image.url, order: image.display_order })), variants: variants.map((variant) => ({ id: variant.id, sku: variant.sku, options: JSON.parse(variant.options), priceOverride: variant.price_override })) }), created_at: changedAt } });
    });
    return product(actor, productId, false);
  }
  /** Deletes an owned product after live order/request blockers clear. */
  export async function deleteProduct(actor: ShoppingActor, productId: string): Promise<void> {
    await requireSellerCatalog(actor);
    const existing = await ownedProduct(actor, productId);
    await assertProductClear(existing.id);
    await retireProduct(existing.id, undefined, true, actor);
  }
  /** Retires any live product for an administrator policy reason. */
  export async function policyDeleteProduct(actor: ShoppingActor, productId: string, body: api.IShoppingModeration): Promise<void> {
    await requireAdmin(actor); const reason = text(body.reason, "reason");
    const productRow = await db().shopping_products.findFirst({ where: { id: productId, deleted_at: null } });
    if (productRow === null) throw ErrorUtil.notFound("The product does not exist.");
    await retireProduct(productId, { actorId: actor.id, actorType: actor.type, reason });
  }
  async function retireProduct(productId: string, action?: { actorId: string; actorType: ShoppingActor["type"]; reason: string }, enforceClear = false, owner?: ShoppingActor): Promise<void> {
    const retiredAt = now();
    await db().$transaction(async (tx) => {
      if (action !== undefined) await requireAdminAtCommit({ id: action.actorId, type: action.actorType, sessionId: "" }, tx);
      const product = await tx.shopping_products.findFirst({ where: { id: productId, deleted_at: null } });
      if (product === null) throw ErrorUtil.notFound("The product does not exist.");
      if (owner !== undefined) {
        await requireSellerAtCommit(owner, tx, true);
        if (product.seller_id !== owner.id) throw ErrorUtil.forbidden("Only the product owner may retire this product.");
      }
      const variants = await tx.shopping_variants.findMany({ where: { product_id: productId, deleted_at: null }, select: { id: true } });
      const variantIds = variants.map((variant) => variant.id);
      if (enforceClear && variantIds.length > 0) {
        if (await tx.shopping_order_items.findFirst({ where: { variant_id: { in: variantIds }, status: { in: ["paid", "shipped"] } } })) throw ErrorUtil.conflict("The product has active fulfillment obligations.");
        const itemIds = (await tx.shopping_order_items.findMany({ where: { variant_id: { in: variantIds } }, select: { id: true } })).map((item) => item.id);
        if (await tx.shopping_cancellation_requests.findFirst({ where: { order_item_id: { in: itemIds }, status: "pending" } })) throw ErrorUtil.conflict("The product has a pending cancellation.");
        if (await tx.shopping_refund_requests.findFirst({ where: { order_item_id: { in: itemIds }, status: "pending" } })) throw ErrorUtil.conflict("The product has a pending refund.");
      }
      const before = await productSnapshotData(tx, productId);
      await tx.shopping_product_images.deleteMany({ where: { product_id: productId } });
      await tx.shopping_inventory_movements.deleteMany({ where: { variant_id: { in: variantIds } } });
      await tx.shopping_variants.updateMany({ where: { product_id: productId, deleted_at: null }, data: { deleted_at: retiredAt } });
      const updated = await tx.shopping_products.updateMany({ where: { id: productId, deleted_at: null }, data: { deleted_at: retiredAt, category_id: null } });
      if (updated.count !== 1) throw ErrorUtil.conflict("The product changed before retirement committed.");
      await tx.shopping_snapshots.create({ data: { id: id(), kind: "productDelete", subject_type: "product", subject_id: productId, changed: JSON.stringify(["deletedAt"]), before_data: JSON.stringify(before), after_data: JSON.stringify({ name: product.name, description: product.description, categoryId: null, basePrice: product.base_price, images: [], variants: [] }), created_at: retiredAt } });
      await tx.shopping_wishlist_entries.deleteMany({ where: { product_id: productId } });
      if (action !== undefined) await tx.shopping_admin_actions.create({ data: { id: id(), kind: "productDeletion", actor_id: action.actorId, target_id: productId, reason: action.reason, created_at: retiredAt } });
    });
  }
  async function assertProductClear(productId: string): Promise<void> {
    const variants = await db().shopping_variants.findMany({ where: { product_id: productId }, select: { id: true } });
    const ids = variants.map((row) => row.id);
    if (ids.length === 0) return;
    if (await db().shopping_order_items.findFirst({ where: { variant_id: { in: ids }, status: { in: ["paid", "shipped"] } } })) throw ErrorUtil.conflict("The product has active fulfillment obligations.");
    if (await db().shopping_cancellation_requests.findFirst({ where: { order_item_id: { in: (await db().shopping_order_items.findMany({ where: { variant_id: { in: ids } }, select: { id: true } })).map((row) => row.id) }, status: "pending" } })) throw ErrorUtil.conflict("The product has a pending cancellation.");
    if (await db().shopping_refund_requests.findFirst({ where: { order_item_id: { in: (await db().shopping_order_items.findMany({ where: { variant_id: { in: ids } }, select: { id: true } })).map((row) => row.id) }, status: "pending" } })) throw ErrorUtil.conflict("The product has a pending refund.");
  }

  /** Searches visible customer catalog products. */
  export async function products(actor: ShoppingActor, input: api.IShoppingProduct.IRequest): Promise<api.IPage<api.IShoppingProduct.ISummary>> { if (actor.type !== "customer") throw ErrorUtil.forbidden("Only customers browse products."); return productPage({ categoryId: input.categoryId ?? undefined }, input); }
  /** Lists live products across seller boundaries for administrators. */
  export async function adminProducts(actor: ShoppingActor, input: api.IShoppingProduct.IRequest): Promise<api.IPage<api.IShoppingProduct.ISummary>> { await requireAdmin(actor); return productPage({ categoryId: input.categoryId ?? undefined }, input, true); }
  /** Opens a live product detail, including unavailable moderated products. */
  export async function product(actor: ShoppingActor, productId: string, admin: boolean): Promise<api.IShoppingProduct> {
    const row = await db().shopping_products.findFirst({ where: { id: productId, ...(admin ? {} : { deleted_at: null }) } });
    if (row === null) throw ErrorUtil.notFound("The product does not exist.");
    const seller = await db().shopping_sellers.findUnique({ where: { id: row.seller_id } });
    const profile = await db().shopping_seller_profiles.findUnique({ where: { seller_id: row.seller_id } });
    if (seller === null || profile === null) throw ErrorUtil.notFound("The seller no longer exists.");
    const [images, variants, reviews, category] = await Promise.all([
      db().shopping_product_images.findMany({ where: { product_id: row.id }, orderBy: { display_order: "asc" } }),
      db().shopping_variants.findMany({ where: { product_id: row.id, deleted_at: null } }),
      db().shopping_reviews.findMany({ where: { product_id: row.id, deleted_at: null }, orderBy: [{ published_at: "desc" }, { id: "desc" }] }),
      row.category_id === null ? null : db().shopping_categories.findFirst({ where: { id: row.category_id, deleted_at: null } }),
    ]);
    const stock = await stocks(variants.map((variant) => variant.id));
    const variantDtos = variants.map((variant) => variantDto(variant, row.base_price, stock.get(variant.id) ?? 0));
    const prices = variantDtos.map((variant) => variant.price); const average = reviews.length === 0 ? null : Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10; const displayedPrice: number | { min: number; max: number } = prices.length === 0 ? row.base_price : prices.every((price) => price === (prices[0] ?? row.base_price)) ? (prices[0] ?? row.base_price) : { min: Math.min(...prices), max: Math.max(...prices) };
    const reviewDtos = await Promise.all(reviews.map(async (review) => reviewDto(review, await customerName(review.customer_id ?? ""))));
    const productDtoValue: api.IShoppingProduct = { id: row.id, name: row.name, description: row.description, basePrice: row.base_price, category: category === null ? null : { id: category.id, name: category.name, description: category.description }, seller: { id: row.seller_id, shopName: profile.shop_name, shopDescription: profile.shop_description, logo: profile.logo }, moderation: admin ? { approvalState: seller.approval_state as "pending"|"approved"|"rejected", suspended: seller.suspended, banned: seller.login_state === "banned" } : undefined, images: images.map((image) => ({ id: image.id, url: image.url, order: image.display_order })), variants: variantDtos, displayedPrice, averageRating: average, reviewCount: reviews.length, reviews: reviewDtos, available: seller.approval_state === "approved" && seller.suspended === false && seller.login_state === "active" && variantDtos.some((variant) => variant.available), createdAt: row.created_at.toISOString() };
    return productDtoValue;
  }
  async function productPage(filter: { categoryId?: string }, input: api.IShoppingProduct.IRequest, admin = false): Promise<api.IPage<api.IShoppingProduct.ISummary>> {
    if (input.minPrice !== undefined && input.minPrice !== null && (!Number.isFinite(input.minPrice) || input.minPrice < 0)) throw ErrorUtil.unprocessable("minPrice must be nonnegative.");
    if (input.maxPrice !== undefined && input.maxPrice !== null && (!Number.isFinite(input.maxPrice) || input.maxPrice < 0)) throw ErrorUtil.unprocessable("maxPrice must be nonnegative.");
    if (input.minPrice !== undefined && input.minPrice !== null && input.maxPrice !== undefined && input.maxPrice !== null && input.minPrice > input.maxPrice) throw ErrorUtil.unprocessable("minPrice must not exceed maxPrice.");
    if (input.sort !== undefined && input.sort !== null && !["createdAt", "priceAsc", "priceDesc"].includes(input.sort)) throw ErrorUtil.unprocessable("Unsupported product sort.");
    if (filter.categoryId !== undefined && await db().shopping_categories.findFirst({ where: { id: filter.categoryId, deleted_at: null } }) === null) throw ErrorUtil.notFound("The category does not exist.");
    const rows = await db().shopping_products.findMany({ where: { ...(filter.categoryId === undefined ? {} : { category_id: filter.categoryId }), deleted_at: null }, orderBy: [{ created_at: "desc" }, { id: "desc" }] });
    const visible: api.IShoppingProduct[] = [];
    for (const row of rows) {
      const seller = await db().shopping_sellers.findUnique({ where: { id: row.seller_id } });
      if (seller === null || seller.deleted_at !== null || (!admin && (seller.login_state !== "active" || seller.approval_state !== "approved" || seller.suspended))) continue;
      if (input.search !== undefined && input.search !== null && !row.name.toLowerCase().includes(input.search.trim().toLowerCase())) continue;
      const value = await product({ id: "", type: "customer", sessionId: "" }, row.id, admin);
      const effectivePrices = value.variants.length === 0 ? [value.basePrice] : value.variants.map((variant) => variant.price);
      if (input.minPrice !== undefined && input.minPrice !== null && !effectivePrices.some((price) => price >= input.minPrice!)) continue;
      if (input.maxPrice !== undefined && input.maxPrice !== null && !effectivePrices.some((price) => price <= input.maxPrice!)) continue;
      if (input.minPrice !== undefined && input.minPrice !== null && input.maxPrice !== undefined && input.maxPrice !== null && !effectivePrices.some((price) => price >= input.minPrice! && price <= input.maxPrice!)) continue;
      if (input.inStock === true && value.variants.every((variant) => variant.stock <= 0)) continue;
      visible.push(value);
    }
    if (input.sort === "priceAsc" || input.sort === "priceDesc") visible.sort((a, b) => priceValue(a) - priceValue(b) || a.id.localeCompare(b.id));
    if (input.sort === "priceDesc") visible.reverse();
    return page(visible.map(productSummary), input);
  }
  const priceValue = (value: api.IShoppingProduct): number => typeof value.displayedPrice === "number" ? value.displayedPrice : value.displayedPrice.min;
  function productSummary(value: api.IShoppingProduct): api.IShoppingProduct.ISummary {
    return { id: value.id, name: value.name, basePrice: value.basePrice, category: value.category, seller: { id: value.seller.id, shopName: value.seller.shopName, logo: value.seller.logo }, thumbnail: value.images[0] ?? null, displayedPrice: value.displayedPrice, averageRating: value.averageRating, reviewCount: value.reviewCount, available: value.available, createdAt: value.createdAt, moderation: value.moderation };
  }
  function nonnegative(value: number, label: string): number { if (!Number.isFinite(value) || value < 0) throw ErrorUtil.unprocessable(`${label} must be nonnegative.`); return value; }
  function optionalNonnegative(value: number | null | undefined, label: string): number | null { return value === undefined || value === null ? null : nonnegative(value, label); }
  function variantDto(row: { id: string; sku: string; options: string; price_override: number | null }, base: number, currentStock: number): api.IShoppingVariant {
    const options = JSON.parse(row.options) as Record<string, string>; const price = row.price_override ?? base;
    return { id: row.id, sku: row.sku, options, price, priceOverride: row.price_override, stock: currentStock, available: currentStock > 0 };
  }
  async function productSnapshotData(first: string | SnapshotClient, second?: string | SnapshotClient): Promise<api.IShoppingProduct.ISnapshot.IState> {
    const client: SnapshotClient = typeof first === "string" ? (second as SnapshotClient | undefined) ?? db() : first;
    const productId: string = typeof first === "string" ? first : second as string;
    const row = await client.shopping_products.findUnique({ where: { id: productId } }); if (row === null) throw ErrorUtil.notFound("The product does not exist.");
    const [images, variants] = await Promise.all([client.shopping_product_images.findMany({ where: { product_id: productId }, orderBy: { display_order: "asc" } }), client.shopping_variants.findMany({ where: { product_id: productId, deleted_at: null } })]);
    return { name: row.name, description: row.description, categoryId: row.category_id, basePrice: row.base_price, images: images.map((image) => ({ id: image.id, url: image.url, order: image.display_order })), variants: variants.map((variant) => ({ id: variant.id, sku: variant.sku, options: JSON.parse(variant.options) as Record<string, string>, priceOverride: variant.price_override })) };
  }
  async function ownedProduct(actor: ShoppingActor, productId: string) { const row = await db().shopping_products.findFirst({ where: { id: productId, seller_id: actor.id, deleted_at: null } }); if (row === null) throw ErrorUtil.notFound("The product does not exist."); return row; }
  async function requireSeller(actor: ShoppingActor): Promise<void> { if (actor.type !== "seller") throw ErrorUtil.forbidden("Seller authority is required."); const seller = await db().shopping_sellers.findUnique({ where: { id: actor.id } }); if (seller === null || seller.deleted_at !== null || seller.login_state !== "active") throw ErrorUtil.forbidden("The seller account is unavailable."); }
  async function requireSellerCatalog(actor: ShoppingActor): Promise<void> { await requireSeller(actor); const seller = await db().shopping_sellers.findUnique({ where: { id: actor.id } }); if (seller === null || seller.approval_state !== "approved" || seller.suspended) throw ErrorUtil.forbidden("The seller is not eligible for catalog changes."); }

  /** Appends product images and captures aggregate evidence. */
  export async function uploadImages(actor: ShoppingActor, productId: string, body: api.IShoppingProduct.IImages): Promise<api.IShoppingProduct> {
    await requireSellerCatalog(actor); const urls = body.urls.map((url) => text(url, "url")); const changedAt = now();
    await db().$transaction(async (tx) => {
      const seller = await tx.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active", approval_state: "approved", suspended: false } });
      const product = await tx.shopping_products.findFirst({ where: { id: productId, seller_id: actor.id, deleted_at: null } });
      if (seller === null) throw ErrorUtil.forbidden("The seller is not eligible for catalog changes.");
      if (product === null) throw ErrorUtil.notFound("The product does not exist.");
      const before = await productSnapshotData(tx, productId); const count = await tx.shopping_product_images.count({ where: { product_id: productId } });
      for (const [index, url] of urls.entries()) await tx.shopping_product_images.create({ data: { id: id(), product_id: productId, url, display_order: count + index, created_at: changedAt } });
      const [images, variants] = await Promise.all([tx.shopping_product_images.findMany({ where: { product_id: productId }, orderBy: { display_order: "asc" } }), tx.shopping_variants.findMany({ where: { product_id: productId, deleted_at: null } })]);
      await tx.shopping_snapshots.create({ data: { id: id(), kind: "productImages", subject_type: "product", subject_id: productId, changed: JSON.stringify(["images"]), before_data: JSON.stringify(before), after_data: JSON.stringify({ name: product.name, description: product.description, categoryId: product.category_id, basePrice: product.base_price, images: images.map((image) => ({ id: image.id, url: image.url, order: image.display_order })), variants: variants.map((variant) => ({ id: variant.id, sku: variant.sku, options: JSON.parse(variant.options), priceOverride: variant.price_override })) }), created_at: changedAt } });
    });
    return product(actor, productId, false);
  }
  /** Reorders every retained product image. */
  export async function reorderImages(actor: ShoppingActor, productId: string, body: api.IShoppingProduct.IImageOrder): Promise<api.IShoppingProduct> {
    await requireSellerCatalog(actor); const changedAt = now(); await db().$transaction(async (tx) => {
      const seller = await tx.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active", approval_state: "approved", suspended: false } });
      const row = await tx.shopping_products.findFirst({ where: { id: productId, seller_id: actor.id, deleted_at: null } });
      if (seller === null) throw ErrorUtil.forbidden("The seller is not eligible for catalog changes.");
      if (row === null) throw ErrorUtil.notFound("The product does not exist.");
      const current = await tx.shopping_product_images.findMany({ where: { product_id: productId } });
      if (body.imageIds.length !== current.length || new Set(body.imageIds).size !== current.length || current.some((image) => !body.imageIds.includes(image.id))) throw ErrorUtil.unprocessable("The image order must contain each retained image exactly once.");
      const before = await productSnapshotData(tx, productId); for (const [index, imageId] of body.imageIds.entries()) await tx.shopping_product_images.update({ where: { id: imageId }, data: { display_order: index } });
      const [images, variants] = await Promise.all([tx.shopping_product_images.findMany({ where: { product_id: productId }, orderBy: { display_order: "asc" } }), tx.shopping_variants.findMany({ where: { product_id: productId, deleted_at: null } })]);
      await tx.shopping_snapshots.create({ data: { id: id(), kind: "productImageOrder", subject_type: "product", subject_id: productId, changed: JSON.stringify(["images"]), before_data: JSON.stringify(before), after_data: JSON.stringify({ name: row.name, description: row.description, categoryId: row.category_id, basePrice: row.base_price, images: images.map((image) => ({ id: image.id, url: image.url, order: image.display_order })), variants: variants.map((variant) => ({ id: variant.id, sku: variant.sku, options: JSON.parse(variant.options), priceOverride: variant.price_override })) }), created_at: changedAt } });
    });
    return product(actor, productId, false);
  }
  /** Deletes one product image. */
  export async function deleteImage(actor: ShoppingActor, productId: string, imageId: string): Promise<api.IShoppingProduct> {
    await requireSellerCatalog(actor); const changedAt = now(); await db().$transaction(async (tx) => {
      const seller = await tx.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active", approval_state: "approved", suspended: false } });
      const row = await tx.shopping_products.findFirst({ where: { id: productId, seller_id: actor.id, deleted_at: null } });
      if (seller === null) throw ErrorUtil.forbidden("The seller is not eligible for catalog changes.");
      if (row === null) throw ErrorUtil.notFound("The product does not exist.");
      const image = await tx.shopping_product_images.findFirst({ where: { id: imageId, product_id: productId } }); if (image === null) throw ErrorUtil.notFound("The product image does not exist.");
      const before = await productSnapshotData(tx, productId); const deleted = await tx.shopping_product_images.deleteMany({ where: { id: imageId, product_id: productId } }); if (deleted.count !== 1) throw ErrorUtil.conflict("The product image changed before deletion committed.");
      const rest = await tx.shopping_product_images.findMany({ where: { product_id: productId }, orderBy: { display_order: "asc" } }); for (const [index, current] of rest.entries()) await tx.shopping_product_images.update({ where: { id: current.id }, data: { display_order: index } });
      const [images, variants] = await Promise.all([tx.shopping_product_images.findMany({ where: { product_id: productId }, orderBy: { display_order: "asc" } }), tx.shopping_variants.findMany({ where: { product_id: productId, deleted_at: null } })]);
      await tx.shopping_snapshots.create({ data: { id: id(), kind: "productImageDelete", subject_type: "product", subject_id: productId, changed: JSON.stringify(["images"]), before_data: JSON.stringify(before), after_data: JSON.stringify({ name: row.name, description: row.description, categoryId: row.category_id, basePrice: row.base_price, images: images.map((current) => ({ id: current.id, url: current.url, order: current.display_order })), variants: variants.map((variant) => ({ id: variant.id, sku: variant.sku, options: JSON.parse(variant.options), priceOverride: variant.price_override })) }), created_at: changedAt } });
    });
    return product(actor, productId, false);
  }
  /** Adds one unique option combination variant. */
  export async function createVariant(actor: ShoppingActor, productId: string, body: api.IShoppingVariant.ICreate): Promise<api.IShoppingVariant> {
    await requireSellerCatalog(actor); const options = normalizeOptions(body.options); const sku = text(body.sku, "sku"); const normalized = sku.toLowerCase(); const serializedOptions = JSON.stringify(options); const priceOverride = optionalNonnegative(body.priceOverride, "priceOverride");
    const changedAt = now(); const result = await db().$transaction(async (tx) => {
      const seller = await tx.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active", approval_state: "approved", suspended: false } });
      const parent = await tx.shopping_products.findFirst({ where: { id: productId, seller_id: actor.id, deleted_at: null } });
      if (seller === null) throw ErrorUtil.forbidden("The seller is not eligible for catalog changes.");
      if (parent === null) throw ErrorUtil.notFound("The product does not exist.");
      if (await tx.shopping_variants.findUnique({ where: { sku_normalized: normalized } })) throw ErrorUtil.conflict("The SKU is already reserved.");
      const siblings = await tx.shopping_variants.findMany({ where: { product_id: productId, deleted_at: null } }); if (siblings.some((variant) => optionSignature(JSON.parse(variant.options) as Record<string, string>) === optionSignature(options))) throw ErrorUtil.conflict("The option combination already exists.");
      const before = await productSnapshotData(tx, productId); const created = await tx.shopping_variants.create({ data: { id: id(), product_id: productId, seller_id: actor.id, sku, sku_normalized: normalized, options: serializedOptions, price_override: priceOverride, deleted_at: null, created_at: changedAt } }); const [images, variants] = await Promise.all([tx.shopping_product_images.findMany({ where: { product_id: productId }, orderBy: { display_order: "asc" } }), tx.shopping_variants.findMany({ where: { product_id: productId, deleted_at: null } })]); await tx.shopping_snapshots.create({ data: { id: id(), kind: "variantCreate", subject_type: "product", subject_id: productId, changed: JSON.stringify(["variants"]), before_data: JSON.stringify(before), after_data: JSON.stringify({ name: parent.name, description: parent.description, categoryId: parent.category_id, basePrice: parent.base_price, images: images.map((image) => ({ id: image.id, url: image.url, order: image.display_order })), variants: variants.map((variant) => ({ id: variant.id, sku: variant.sku, options: JSON.parse(variant.options), priceOverride: variant.price_override })) }), created_at: changedAt } }); return { created, parent };
    }); return variantDto(result.created, result.parent.base_price, 0);
  }
  /** Edits one variant and creates a complete product snapshot. */
  export async function updateVariant(actor: ShoppingActor, variantId: string, body: api.IShoppingVariant.IUpdate): Promise<api.IShoppingVariant> {
    await requireSellerCatalog(actor); const options = normalizeOptions(body.options); const sku = text(body.sku, "sku"); const normalized = sku.toLowerCase(); const serializedOptions = JSON.stringify(options); const priceOverride = optionalNonnegative(body.priceOverride, "priceOverride");
    const changedAt = now(); const result = await db().$transaction(async (tx) => {
      const seller = await tx.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active", approval_state: "approved", suspended: false } });
      const variant = await tx.shopping_variants.findFirst({ where: { id: variantId, seller_id: actor.id, deleted_at: null } });
      if (seller === null) throw ErrorUtil.forbidden("The seller is not eligible for catalog changes.");
      if (variant === null) throw ErrorUtil.notFound("The variant does not exist.");
      const parent = await tx.shopping_products.findFirst({ where: { id: variant.product_id, seller_id: actor.id, deleted_at: null } });
      if (parent === null) throw ErrorUtil.notFound("The product does not exist.");
      const duplicate = await tx.shopping_variants.findFirst({ where: { sku_normalized: normalized, id: { not: variantId } } }); if (duplicate !== null) throw ErrorUtil.conflict("The SKU is already reserved.");
      const siblings = await tx.shopping_variants.findMany({ where: { product_id: parent.id, deleted_at: null, id: { not: variantId } } }); if (siblings.some((sibling) => optionSignature(JSON.parse(sibling.options) as Record<string, string>) === optionSignature(options))) throw ErrorUtil.conflict("The option combination already exists.");
      const before = await productSnapshotData(tx, parent.id); const updated = await tx.shopping_variants.updateMany({ where: { id: variantId, seller_id: actor.id, deleted_at: null }, data: { sku, sku_normalized: normalized, options: serializedOptions, price_override: priceOverride } }); if (updated.count !== 1) throw ErrorUtil.conflict("The variant changed before the edit committed.");
      const [images, variants] = await Promise.all([tx.shopping_product_images.findMany({ where: { product_id: parent.id }, orderBy: { display_order: "asc" } }), tx.shopping_variants.findMany({ where: { product_id: parent.id, deleted_at: null } })]); await tx.shopping_snapshots.create({ data: { id: id(), kind: "variantUpdate", subject_type: "product", subject_id: parent.id, changed: JSON.stringify(["variants"]), before_data: JSON.stringify(before), after_data: JSON.stringify({ name: parent.name, description: parent.description, categoryId: parent.category_id, basePrice: parent.base_price, images: images.map((image) => ({ id: image.id, url: image.url, order: image.display_order })), variants: variants.map((variant) => ({ id: variant.id, sku: variant.sku, options: JSON.parse(variant.options), priceOverride: variant.price_override })) }), created_at: changedAt } }); return { variant: await tx.shopping_variants.findUnique({ where: { id: variantId } }), parent };
    }); return variantDto(result.variant!, result.parent.base_price, await stockOf(variantId));
  }
  /** Deletes a variant after its fulfillment blockers clear. */
  export async function deleteVariant(actor: ShoppingActor, variantId: string): Promise<void> {
    await requireSellerCatalog(actor);
    const variant = await db().shopping_variants.findFirst({ where: { id: variantId, seller_id: actor.id, deleted_at: null } });
    if (variant === null) throw ErrorUtil.notFound("The variant does not exist.");
    if (await db().shopping_order_items.findFirst({ where: { variant_id: variantId, status: { in: ["paid", "shipped"] } } })) throw ErrorUtil.conflict("The variant has active fulfillment obligations.");
    const itemIds = (await db().shopping_order_items.findMany({ where: { variant_id: variantId }, select: { id: true } })).map((row) => row.id);
    if (await db().shopping_cancellation_requests.findFirst({ where: { order_item_id: { in: itemIds }, status: "pending" } })) throw ErrorUtil.conflict("The variant has a pending cancellation.");
    if (await db().shopping_refund_requests.findFirst({ where: { order_item_id: { in: itemIds }, status: "pending" } })) throw ErrorUtil.conflict("The variant has a pending refund.");
    const deletedAt = now();
    await db().$transaction(async (tx) => {
      const seller = await tx.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active", approval_state: "approved", suspended: false } });
      const currentVariant = await tx.shopping_variants.findFirst({ where: { id: variantId, seller_id: actor.id, deleted_at: null } });
      if (seller === null) throw ErrorUtil.forbidden("The seller is not eligible for catalog changes.");
      if (currentVariant === null) throw ErrorUtil.notFound("The variant does not exist.");
      const before = await productSnapshotData(tx, variant.product_id);
      if (await tx.shopping_order_items.findFirst({ where: { variant_id: variantId, status: { in: ["paid", "shipped"] } } })) throw ErrorUtil.conflict("The variant has active fulfillment obligations.");
      const itemIdsAtCommit = (await tx.shopping_order_items.findMany({ where: { variant_id: variantId }, select: { id: true } })).map((row) => row.id);
      if (await tx.shopping_cancellation_requests.findFirst({ where: { order_item_id: { in: itemIdsAtCommit }, status: "pending" } })) throw ErrorUtil.conflict("The variant has a pending cancellation.");
      if (await tx.shopping_refund_requests.findFirst({ where: { order_item_id: { in: itemIdsAtCommit }, status: "pending" } })) throw ErrorUtil.conflict("The variant has a pending refund.");
      const updated = await tx.shopping_variants.updateMany({ where: { id: variantId, seller_id: actor.id, deleted_at: null }, data: { deleted_at: deletedAt } });
      if (updated.count !== 1) throw ErrorUtil.notFound("The variant does not exist.");
      await tx.shopping_inventory_movements.deleteMany({ where: { variant_id: variantId } });
      const [productRow, images, variants] = await Promise.all([tx.shopping_products.findUnique({ where: { id: variant.product_id } }), tx.shopping_product_images.findMany({ where: { product_id: variant.product_id }, orderBy: { display_order: "asc" } }), tx.shopping_variants.findMany({ where: { product_id: variant.product_id, deleted_at: null } })]);
      if (productRow !== null) await tx.shopping_snapshots.create({ data: { id: id(), kind: "variantDelete", subject_type: "product", subject_id: variant.product_id, changed: JSON.stringify(["variants"]), before_data: JSON.stringify(before), after_data: JSON.stringify({ name: productRow.name, description: productRow.description, categoryId: productRow.category_id, basePrice: productRow.base_price, images: images.map((image) => ({ id: image.id, url: image.url, order: image.display_order })), variants: variants.map((current) => ({ id: current.id, sku: current.sku, options: JSON.parse(current.options), priceOverride: current.price_override })) }), created_at: deletedAt } });
    });
  }
  function normalizeOptions(options: Record<string, string>): Record<string, string> { const entries = Object.entries(options).map(([name, value]) => [text(name, "option name"), text(value, "option value")] as const); const names = entries.map(([name]) => name.toLowerCase()); if (entries.length === 0 || new Set(names).size !== names.length) throw ErrorUtil.unprocessable("A variant needs unique nonblank option pairs."); return Object.fromEntries(entries.sort(([left], [right]) => left.toLowerCase().localeCompare(right.toLowerCase()))); }
  function optionSignature(options: Record<string, string>): string { return JSON.stringify(Object.entries(options).map(([name, value]) => [name.trim().toLowerCase(), value.trim()] as const).sort((left, right) => left[0]!.localeCompare(right[0]!))); }
  /** Adds positive restock inventory. */
  export async function restock(actor: ShoppingActor, variantId: string, body: api.IShoppingVariant.IInventory): Promise<api.IShoppingVariant> { await requireSeller(actor); const quantity = wholePositive(body.quantity, "quantity"); const reason = text(body.reason, "reason"); const variant = await db().$transaction(async (tx) => { const seller = await tx.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } }); if (seller === null) throw ErrorUtil.forbidden("The seller account is unavailable."); const current = await tx.shopping_variants.findFirst({ where: { id: variantId, seller_id: actor.id, deleted_at: null } }); if (current === null) throw ErrorUtil.notFound("The variant does not exist."); await tx.shopping_inventory_movements.create({ data: { id: id(), variant_id: variantId, quantity_change: quantity, reason, order_item_id: null, created_at: now() } }); return current; }); return variantView(variant); }
  /** Adds negative seller inventory adjustment. */
  export async function subtract(actor: ShoppingActor, variantId: string, body: api.IShoppingVariant.IInventory): Promise<api.IShoppingVariant> { await requireSeller(actor); const quantity = wholePositive(body.quantity, "quantity"); const reason = text(body.reason, "reason"); const variant = await db().$transaction(async (tx) => { const seller = await tx.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } }); if (seller === null) throw ErrorUtil.forbidden("The seller account is unavailable."); const current = await tx.shopping_variants.findFirst({ where: { id: variantId, seller_id: actor.id, deleted_at: null } }); if (current === null) throw ErrorUtil.notFound("The variant does not exist."); const movements = await tx.shopping_inventory_movements.findMany({ where: { variant_id: variantId }, select: { quantity_change: true } }); const holds = await tx.shopping_checkout_holds.findMany({ where: { variant_id: variantId }, select: { quantity: true } }); const stock = movements.reduce((sum, movement) => sum + movement.quantity_change, 0); const held = holds.reduce((sum, hold) => sum + hold.quantity, 0); if (stock - held < quantity) throw ErrorUtil.conflict("The adjustment would consume reserved or unavailable stock."); await tx.shopping_inventory_movements.create({ data: { id: id(), variant_id: variantId, quantity_change: -quantity, reason, order_item_id: null, created_at: now() } }); return current; }); return variantView(variant); }
  /** Lists the complete inventory ledger newest first. */
  export async function inventory(actor: ShoppingActor, variantId: string, input: api.IPage.IRequest): Promise<api.IPage<{ id: string; quantityChange: number; reason: string; createdAt: string }>> { await requireSeller(actor); await ownedVariant(actor, variantId); const rows = await db().shopping_inventory_movements.findMany({ where: { variant_id: variantId }, orderBy: [{ created_at: "desc" }, { id: "desc" }] }); return page(rows.map((row) => ({ id: row.id, quantityChange: row.quantity_change, reason: row.reason, createdAt: row.created_at.toISOString() })), input); }
  async function ownedVariant(actor: ShoppingActor, variantId: string) { const row = await db().shopping_variants.findFirst({ where: { id: variantId, seller_id: actor.id, deleted_at: null } }); if (row === null) throw ErrorUtil.notFound("The variant does not exist."); return row; }
  async function variantView(row: { id: string; sku: string; options: string; price_override: number | null; product_id: string }): Promise<api.IShoppingVariant> { const parent = await db().shopping_products.findUnique({ where: { id: row.product_id } }); if (parent === null) throw ErrorUtil.notFound("The product does not exist."); return variantDto(row, parent.base_price, await stockOf(row.id)); }
  async function stockOf(variantId: string): Promise<number> { const rows = await db().shopping_inventory_movements.findMany({ where: { variant_id: variantId }, select: { quantity_change: true } }); return rows.reduce((sum, row) => sum + row.quantity_change, 0); }
  async function stocks(variantIds: string[]): Promise<Map<string, number>> { const rows = await db().shopping_inventory_movements.findMany({ where: { variant_id: { in: variantIds } }, select: { variant_id: true, quantity_change: true } }); const result = new Map<string, number>(); for (const row of rows) result.set(row.variant_id, (result.get(row.variant_id) ?? 0) + row.quantity_change); return result; }
  async function isPurchasableVariant(variant: { product_id: string; deleted_at: Date | null }): Promise<boolean> { if (variant.deleted_at !== null) return false; const parent = await db().shopping_products.findUnique({ where: { id: variant.product_id } }); if (parent === null || parent.deleted_at !== null) return false; const seller = await db().shopping_sellers.findUnique({ where: { id: parent.seller_id } }); return seller !== null && seller.deleted_at === null && seller.approval_state === "approved" && seller.suspended === false && seller.login_state === "active"; }
  function wholePositive(value: number, label: string): number { if (!Number.isInteger(value) || value < 1) throw ErrorUtil.unprocessable(`${label} must be a positive whole number.`); return value; }

  /** Adds or merges one wishlist product. */
  export async function addWishlist(actor: ShoppingActor, productId: string): Promise<api.IShoppingWishlistEntry> { const row = await db().$transaction(async (tx) => { const customer = await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } }); if (customer === null) throw ErrorUtil.forbidden("The customer account is no longer available."); const productRow = await tx.shopping_products.findFirst({ where: { id: productId, deleted_at: null } }); if (productRow === null) throw ErrorUtil.notFound("The product does not exist."); return tx.shopping_wishlist_entries.upsert({ where: { customer_id_product_id: { customer_id: actor.id, product_id: productId } }, create: { id: id(), customer_id: actor.id, product_id: productId, created_at: now() }, update: {} }); }); return { id: row.id, product: productSummary(await product({ id: "", type: "customer", sessionId: "" }, productId, false)), savedAt: row.created_at.toISOString() };
  }
  /** Lists one customer's wishlist. */
  export async function wishlist(actor: ShoppingActor, input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingWishlistEntry>> { const rows = await db().shopping_wishlist_entries.findMany({ where: { customer_id: actor.id }, orderBy: [{ created_at: "desc" }, { id: "desc" }] }); const values: api.IShoppingWishlistEntry[] = []; for (const row of rows) { try { values.push({ id: row.id, product: productSummary(await product(actor, row.product_id, false)), savedAt: row.created_at.toISOString() }); } catch { /* a concurrent retirement removes the entry below */ } } return page(values, input); }
  /** Removes one wishlist relation. */
  export async function removeWishlist(actor: ShoppingActor, productId: string): Promise<void> { await db().$transaction(async (tx) => { const customer = await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } }); if (customer === null) throw ErrorUtil.forbidden("The customer account is no longer available."); const deleted = await tx.shopping_wishlist_entries.deleteMany({ where: { customer_id: actor.id, product_id: productId } }); if (deleted.count !== 1) throw ErrorUtil.notFound("The wishlist entry does not exist."); }); }
  /** Adds or merges one cart line when the variant is currently purchasable. */
  export async function addCart(actor: ShoppingActor, variantId: string, quantity: number): Promise<api.IShoppingCart> { const qty = wholePositive(quantity, "quantity"); await db().$transaction(async (tx) => { const customer = await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } }); if (customer === null) throw ErrorUtil.forbidden("The customer account is no longer available."); const variant = await tx.shopping_variants.findFirst({ where: { id: variantId, deleted_at: null } }); if (variant === null) throw ErrorUtil.conflict("The variant is not currently purchasable."); const movements = await tx.shopping_inventory_movements.findMany({ where: { variant_id: variantId }, select: { quantity_change: true } }); if (movements.reduce((sum, movement) => sum + movement.quantity_change, 0) <= 0) throw ErrorUtil.conflict("The variant is not currently purchasable."); const productRow = await tx.shopping_products.findFirst({ where: { id: variant.product_id, deleted_at: null } }); const seller = productRow === null ? null : await tx.shopping_sellers.findFirst({ where: { id: productRow.seller_id, deleted_at: null, approval_state: "approved", suspended: false, login_state: "active" } }); if (productRow === null || seller === null) throw ErrorUtil.conflict("The variant is not currently purchasable."); await tx.shopping_cart_lines.upsert({ where: { customer_id_variant_id: { customer_id: actor.id, variant_id: variantId } }, create: { id: id(), customer_id: actor.id, variant_id: variantId, quantity: qty, created_at: now() }, update: { quantity: { increment: qty } } }); }); return cart(actor); }
  /** Returns current cart prices and availability. */
  export async function cart(actor: ShoppingActor): Promise<api.IShoppingCart> { const rows = await db().shopping_cart_lines.findMany({ where: { customer_id: actor.id }, orderBy: [{ created_at: "asc" }, { id: "asc" }] }); const lines: api.IShoppingCartLine[] = []; for (const row of rows) { const variant = await db().shopping_variants.findUnique({ where: { id: row.variant_id } }); if (variant === null) continue; const parent = await db().shopping_products.findUnique({ where: { id: variant.product_id } }); if (parent === null) continue; let value: api.IShoppingVariant; let summary: api.IShoppingProduct.ISummary; try { const detail = await product(actor, parent.id, true); value = detail.variants.find((item) => item.id === variant.id) ?? variantDto(variant, parent.base_price, await stockOf(variant.id)); summary = productSummary(detail); } catch { value = variantDto(variant, parent.base_price, await stockOf(variant.id)); summary = { id: parent.id, name: parent.name, basePrice: parent.base_price, category: null, seller: { id: parent.seller_id, shopName: "deleted shop", logo: null }, thumbnail: null, displayedPrice: value.price, averageRating: null, reviewCount: 0, available: false, createdAt: parent.created_at.toISOString() }; } const available = variant.deleted_at === null && parent.deleted_at === null && value.stock > 0 && await isPurchasableVariant(variant); lines.push({ id: row.id, variant: { ...value, product: summary }, quantity: row.quantity, subtotal: value.price * row.quantity, available, shortage: available && value.stock < row.quantity }); } return { lines, total: lines.reduce((sum, line) => sum + line.subtotal, 0) }; }
  /** Replaces one owned cart quantity. */
  export async function updateCart(actor: ShoppingActor, lineId: string, quantity: number): Promise<api.IShoppingCart> { const qty = wholePositive(quantity, "quantity"); await db().$transaction(async (tx) => { const customer = await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } }); if (customer === null) throw ErrorUtil.forbidden("The customer account is no longer available."); const changed = await tx.shopping_cart_lines.updateMany({ where: { id: lineId, customer_id: actor.id }, data: { quantity: qty } }); if (changed.count !== 1) throw ErrorUtil.notFound("The cart line does not exist."); }); return cart(actor); }
  /** Removes one owned cart line. */
  export async function removeCart(actor: ShoppingActor, lineId: string): Promise<void> { await db().$transaction(async (tx) => { const customer = await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } }); if (customer === null) throw ErrorUtil.forbidden("The customer account is no longer available."); const deleted = await tx.shopping_cart_lines.deleteMany({ where: { id: lineId, customer_id: actor.id } }); if (deleted.count !== 1) throw ErrorUtil.notFound("The cart line does not exist."); }); }

  /** Returns seller approval and restriction state. */
  export async function sellerStatus(actor: ShoppingActor): Promise<api.IShoppingSeller.IStatus> { const seller = await db().shopping_sellers.findUnique({ where: { id: actor.id } }); if (seller === null) throw ErrorUtil.notFound("The seller does not exist."); return { approvalState: seller.approval_state as api.IShoppingSeller["approvalState"], rejectionReason: seller.rejection_reason, suspended: seller.suspended, banned: seller.login_state === "banned" }; }
  /** Resubmits a rejected seller approval request. */
  export async function resubmitSeller(actor: ShoppingActor): Promise<api.IShoppingSeller.IStatus> { const seller = await db().shopping_sellers.findUnique({ where: { id: actor.id } }); if (seller === null || seller.deleted_at !== null || seller.login_state !== "active" || seller.approval_state !== "rejected") throw ErrorUtil.conflict("Only a rejected seller may reapply."); const createdAt = now(); await db().$transaction(async (tx) => { const current = await tx.shopping_sellers.findFirst({ where: { id: actor.id, approval_state: "rejected", deleted_at: null, login_state: "active" } }); if (current === null) throw ErrorUtil.conflict("Only a rejected seller may reapply."); const updated = await tx.shopping_sellers.updateMany({ where: { id: actor.id, approval_state: "rejected", deleted_at: null, login_state: "active" }, data: { approval_state: "pending", rejection_reason: null } }); if (updated.count !== 1) throw ErrorUtil.conflict("Only a rejected seller may reapply."); await tx.shopping_seller_approval_requests.create({ data: { id: id(), seller_id: actor.id, status: "pending", pending_key: actor.id, reason: null, decided_by: null, decided_at: null, created_at: createdAt } }); }); return sellerStatus(actor); }
  /** Lists pending seller approvals for administrators. */
  export async function sellerApprovals(actor: ShoppingActor, input: api.IPage.IRequest): Promise<api.IPage<IShoppingApproval>> { await requireAdmin(actor); const rows = await db().shopping_seller_approval_requests.findMany({ where: { status: "pending" }, orderBy: [{ created_at: "asc" }, { id: "asc" }] }); const values: IShoppingApproval[] = []; for (const row of rows) { const seller = await db().shopping_sellers.findUnique({ where: { id: row.seller_id } }); const profile = await db().shopping_seller_profiles.findUnique({ where: { seller_id: row.seller_id } }); if (seller !== null && profile !== null) values.push({ id: row.id, sellerId: seller.id, shopName: profile.shop_name, createdAt: row.created_at.toISOString() }); } return page(values, input); }
  /** Approves one seller application. */
  export async function approveSeller(actor: ShoppingActor, requestId: string): Promise<api.IShoppingSeller.IStatus> {
    await requireAdmin(actor);
    const request = await db().shopping_seller_approval_requests.findFirst({ where: { id: requestId, status: "pending" } });
    if (request === null) throw ErrorUtil.notFound("The seller approval request is not pending.");
    const decidedAt = now();
    await db().$transaction(async (tx) => {
      await requireAdminAtCommit(actor, tx);
      const seller = await tx.shopping_sellers.findFirst({ where: { id: request.seller_id, deleted_at: null, login_state: "active", approval_state: "pending" } });
      if (seller === null) throw ErrorUtil.conflict("The seller identity is unavailable.");
      const changed = await tx.shopping_sellers.updateMany({ where: { id: request.seller_id, deleted_at: null, login_state: "active", approval_state: "pending" }, data: { approval_state: "approved", rejection_reason: null } });
      if (changed.count !== 1) throw ErrorUtil.conflict("The seller identity is unavailable.");
      const updated = await tx.shopping_seller_approval_requests.updateMany({ where: { id: requestId, status: "pending" }, data: { status: "approved", pending_key: null, decided_by: actor.id, decided_at: decidedAt } });
      if (updated.count !== 1) throw ErrorUtil.conflict("The seller approval request is no longer pending.");
      await tx.shopping_admin_actions.create({ data: { id: id(), kind: "sellerApproval", actor_id: actor.id, target_id: request.seller_id, reason: "approved", created_at: decidedAt } });
    });
    return sellerStatus({ id: request.seller_id, type: "seller", sessionId: "" });
  }
  /** Rejects one seller application with a reason. */
  export async function rejectSeller(actor: ShoppingActor, requestId: string, body: api.IShoppingModeration): Promise<api.IShoppingSeller.IStatus> {
    await requireAdmin(actor);
    const reason = text(body.reason, "reason");
    const request = await db().shopping_seller_approval_requests.findFirst({ where: { id: requestId, status: "pending" } });
    if (request === null) throw ErrorUtil.notFound("The seller approval request is not pending.");
    const decidedAt = now();
    await db().$transaction(async (tx) => {
      await requireAdminAtCommit(actor, tx);
      const seller = await tx.shopping_sellers.findFirst({ where: { id: request.seller_id, deleted_at: null, login_state: "active", approval_state: "pending" } });
      if (seller === null) throw ErrorUtil.conflict("The seller identity is unavailable.");
      const changed = await tx.shopping_sellers.updateMany({ where: { id: request.seller_id, deleted_at: null, login_state: "active", approval_state: "pending" }, data: { approval_state: "rejected", rejection_reason: reason } });
      if (changed.count !== 1) throw ErrorUtil.conflict("The seller identity is unavailable.");
      const updated = await tx.shopping_seller_approval_requests.updateMany({ where: { id: requestId, status: "pending" }, data: { status: "rejected", pending_key: null, reason, decided_by: actor.id, decided_at: decidedAt } });
      if (updated.count !== 1) throw ErrorUtil.conflict("The seller approval request is no longer pending.");
      await tx.shopping_admin_actions.create({ data: { id: id(), kind: "sellerApproval", actor_id: actor.id, target_id: request.seller_id, reason: `rejected: ${reason}`, created_at: decidedAt } });
    });
    return sellerStatus({ id: request.seller_id, type: "seller", sessionId: "" });
  }
  /** Suspends an approved seller's catalog. */
  export async function suspendSeller(actor: ShoppingActor, sellerId: string): Promise<void> { await requireAdmin(actor); await requireTargetModeration(actor, "seller", sellerId); const seller = await db().shopping_sellers.findFirst({ where: { id: sellerId, deleted_at: null, approval_state: "approved", suspended: false } }); if (seller === null) throw ErrorUtil.conflict("The seller is not eligible for suspension."); const changedAt = now(); await db().$transaction(async (tx) => { await requireAdminAtCommit(actor, tx); await requireTargetModerationAtCommit(actor, "seller", sellerId, tx); const current = await tx.shopping_sellers.findFirst({ where: { id: sellerId, deleted_at: null, approval_state: "approved", suspended: false } }); if (current === null) throw ErrorUtil.conflict("The seller is not eligible for suspension."); const updated = await tx.shopping_sellers.updateMany({ where: { id: sellerId, deleted_at: null, approval_state: "approved", suspended: false }, data: { suspended: true } }); if (updated.count !== 1) throw ErrorUtil.conflict("The seller is not eligible for suspension."); await tx.shopping_admin_actions.create({ data: { id: id(), kind: "sellerSuspension", actor_id: actor.id, target_id: sellerId, reason: "suspended", before_state: "active", after_state: "suspended", created_at: changedAt } }); }); }
  /** Clears one seller catalog suspension. */
  export async function unsuspendSeller(actor: ShoppingActor, sellerId: string): Promise<void> { await requireAdmin(actor); await requireTargetModeration(actor, "seller", sellerId); const seller = await db().shopping_sellers.findFirst({ where: { id: sellerId, deleted_at: null, suspended: true } }); if (seller === null) throw ErrorUtil.conflict("The seller is not suspended."); const changedAt = now(); await db().$transaction(async (tx) => { await requireAdminAtCommit(actor, tx); await requireTargetModerationAtCommit(actor, "seller", sellerId, tx); const current = await tx.shopping_sellers.findFirst({ where: { id: sellerId, deleted_at: null, suspended: true } }); if (current === null) throw ErrorUtil.conflict("The seller is not suspended."); const updated = await tx.shopping_sellers.updateMany({ where: { id: sellerId, deleted_at: null, suspended: true }, data: { suspended: false } }); if (updated.count !== 1) throw ErrorUtil.conflict("The seller is not suspended."); await tx.shopping_admin_actions.create({ data: { id: id(), kind: "sellerSuspension", actor_id: actor.id, target_id: sellerId, reason: "unsuspended", before_state: "suspended", after_state: "active", created_at: changedAt } }); }); }

  /** Starts a checkout review from all currently eligible cart lines. */
  export async function checkoutStart(actor: ShoppingActor, body: api.IShoppingOrder.ICheckout): Promise<api.IShoppingOrder.ICheckoutSummary> {
    const address = body.addressId === undefined ? await db().shopping_shipping_addresses.findFirst({ where: { customer_id: actor.id, is_default: true } }) : await db().shopping_shipping_addresses.findFirst({ where: { id: body.addressId, customer_id: actor.id } });
    if (address === null) throw ErrorUtil.unprocessable("A retained owned shipping address is required."); const cartValue = await cart(actor); const eligible = cartValue.lines.filter((line) => line.available && !line.shortage); if (eligible.length === 0) throw ErrorUtil.conflict("The cart has no eligible line.");
    if (await db().shopping_checkout_attempts.findFirst({ where: { customer_id: actor.id, status: "unknown" } }) !== null) throw ErrorUtil.conflict("An unresolved payment attempt must be reconciled before starting another checkout.");
    const attemptId = id(); const items = await Promise.all(eligible.map((line) => orderItemPreview(line))); const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0); await db().$transaction(async (tx) => { const customer = await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } }); if (customer === null) throw ErrorUtil.forbidden("The customer account is no longer available."); const currentAddress = await tx.shopping_shipping_addresses.findFirst({ where: { id: address.id, customer_id: actor.id, recipient_name: address.recipient_name, recipient_phone: address.recipient_phone, street_address: address.street_address, city: address.city, state_or_province: address.state_or_province, postal_code: address.postal_code, country: address.country } }); if (currentAddress === null) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary."); if (await tx.shopping_checkout_attempts.findFirst({ where: { customer_id: actor.id, status: "unknown" } }) !== null) throw ErrorUtil.conflict("An unresolved payment attempt must be reconciled before starting another checkout."); await tx.shopping_checkout_attempts.create({ data: { id: id(), attempt_id: attemptId, customer_id: actor.id, lines: JSON.stringify(eligible.map((line) => ({ variantId: line.variant.id, lineId: line.id, quantity: line.quantity, unitPrice: line.variant.price }))), address: JSON.stringify(address), amount: total, status: "pending", order_id: null, created_at: now() } }); }); return { attemptId, address: addressDto(address), items, totalPrice: total };
  }
  /** Confirms or fails one payment attempt idempotently. */
  export async function payment(actor: ShoppingActor, body: api.IShoppingOrder.IPayment): Promise<api.IShoppingOrder | { status: "failed" | "unknown" }> {
    const attempt = await db().shopping_checkout_attempts.findFirst({ where: { attempt_id: body.attemptId, customer_id: actor.id } });
    if (attempt === null) throw ErrorUtil.notFound("The payment attempt does not exist.");
    if (attempt.status === "succeeded" && attempt.order_id !== null) {
      if (body.success !== true || body.amount !== attempt.amount)
        throw ErrorUtil.conflict("The payment attempt already has an incompatible terminal outcome.");
      return order(actor, attempt.order_id);
    }
    if (attempt.status === "failed") {
      if (body.success === false) return { status: "failed" };
      throw ErrorUtil.conflict("The payment attempt is already final.");
    }
    if (attempt.status === "unknown" && body.success === "unknown") return { status: "unknown" };
    if (!body.success) {
      await db().$transaction(async (tx) => {
        await requireCustomerAtCommit(actor, tx);
        const current = await tx.shopping_checkout_attempts.findUnique({ where: { id: attempt.id } });
        if (current === null || !["pending", "unknown"].includes(current.status)) throw ErrorUtil.conflict("The payment attempt is already final.");
        await tx.shopping_checkout_holds.deleteMany({ where: { attempt_id: attempt.attempt_id } });
        const updated = await tx.shopping_checkout_attempts.updateMany({ where: { id: attempt.id, status: { in: ["pending", "unknown"] } }, data: { status: "failed" } });
        if (updated.count !== 1) throw ErrorUtil.conflict("The payment attempt is already final.");
      });
      return { status: "failed" };
    }
    if (body.success === "unknown") {
      if (attempt.status === "pending") await preparePaymentAttempt(actor, attempt);
      const updated = await db().$transaction(async (tx) => { await requireCustomerAtCommit(actor, tx); return tx.shopping_checkout_attempts.updateMany({ where: { id: attempt.id, status: "pending" }, data: { status: "unknown" } }); });
      if (updated.count !== 1) throw ErrorUtil.conflict("The payment attempt is already final.");
      return { status: "unknown" };
    }
    if (body.amount !== attempt.amount) throw ErrorUtil.conflict("The charged amount does not match the reviewed total.");
    const lines = JSON.parse(attempt.lines) as Array<{ variantId: string; lineId: string; quantity: number; unitPrice: number }>;
    const address = JSON.parse(attempt.address) as { id: string; recipient_name: string; recipient_phone: string; street_address: string; city: string; state_or_province: string; postal_code: string; country: string };
    const orderId = await db().$transaction(async (tx) => {
      await requireCustomerAtCommit(actor, tx);
      const currentAttempt = await tx.shopping_checkout_attempts.findUnique({ where: { id: attempt.id } });
      if (currentAttempt === null) throw ErrorUtil.notFound("The payment attempt does not exist.");
      if (currentAttempt.status === "succeeded" && currentAttempt.order_id !== null) return currentAttempt.order_id;
      if (!["pending", "unknown"].includes(currentAttempt.status)) throw ErrorUtil.conflict("The payment attempt is already final.");
      const customer = await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } });
      if (customer === null) throw ErrorUtil.forbidden("The customer account is no longer available.");
      const createdAt = now();
      const orderId = id();
      const orderNumber = `ORD-${createdAt.getTime()}-${orderId.slice(0, 8).toUpperCase()}`;
      const orderItems: Array<{ line: typeof lines[number]; variant: { id: string; product_id: string; sku: string; options: string; price_override: number | null }; product: { id: string; seller_id: string; name: string; description: string; base_price: number }; profile: { shop_name: string; logo: string | null }; price: number }> = [];
      const addressRow = await tx.shopping_shipping_addresses.findFirst({ where: { id: address.id, customer_id: actor.id, recipient_name: address.recipient_name, recipient_phone: address.recipient_phone, street_address: address.street_address, city: address.city, state_or_province: address.state_or_province, postal_code: address.postal_code, country: address.country } });
      if (addressRow === null) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
      for (const line of lines) {
        const cartLine = await tx.shopping_cart_lines.findFirst({ where: { id: line.lineId, customer_id: actor.id, variant_id: line.variantId } });
        const variant = await tx.shopping_variants.findFirst({ where: { id: line.variantId, deleted_at: null } });
        if (cartLine === null || cartLine.quantity !== line.quantity || variant === null) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
        const productRow = await tx.shopping_products.findFirst({ where: { id: variant.product_id, deleted_at: null } });
        if (productRow === null) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
        const seller = await tx.shopping_sellers.findUnique({ where: { id: productRow.seller_id } });
        const profile = await tx.shopping_seller_profiles.findUnique({ where: { seller_id: productRow.seller_id } });
        if (seller === null || profile === null || seller.approval_state !== "approved" || seller.suspended || seller.login_state !== "active") throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
        const movements = await tx.shopping_inventory_movements.findMany({ where: { variant_id: variant.id }, select: { quantity_change: true } });
        const holds = await tx.shopping_checkout_holds.findMany({ where: { variant_id: variant.id, attempt_id: { not: attempt.attempt_id } }, select: { quantity: true } });
        const stock = movements.reduce((sum, movement) => sum + movement.quantity_change, 0) - holds.reduce((sum, hold) => sum + hold.quantity, 0);
        if (stock < line.quantity) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
        const price = variant.price_override ?? productRow.base_price;
        if (price !== line.unitPrice) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
        orderItems.push({ line, variant, product: productRow, profile, price });
        const existingHold = await tx.shopping_checkout_holds.findUnique({ where: { attempt_id_variant_id: { attempt_id: attempt.attempt_id, variant_id: variant.id } } });
        if (existingHold === null) await tx.shopping_checkout_holds.create({ data: { id: id(), attempt_id: attempt.attempt_id, variant_id: variant.id, quantity: line.quantity, created_at: createdAt } });
        else if (existingHold.quantity !== line.quantity) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
      }
      const total = orderItems.reduce((sum, item) => sum + item.price * item.line.quantity, 0);
      if (total !== attempt.amount) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
      const created = await tx.shopping_orders.create({ data: { id: orderId, order_number: orderNumber, customer_id: actor.id, purchased_at: createdAt, total_price: total, recipient_name: address.recipient_name, recipient_phone: address.recipient_phone, street_address: address.street_address, city: address.city, state_or_province: address.state_or_province, postal_code: address.postal_code, country: address.country, status: "paid", created_at: createdAt } });
      for (const item of orderItems) {
        const orderItemId = id();
        await tx.shopping_order_items.create({ data: { id: orderItemId, order_id: created.id, variant_id: item.variant.id, seller_id: item.product.seller_id, product_name: item.product.name, product_description: item.product.description, variant_sku: item.variant.sku, variant_options: item.variant.options, seller_shop_name: item.profile.shop_name, seller_logo: item.profile.logo, unit_price: item.price, quantity: item.line.quantity, status: "paid", delivered_at: null, shipment_id: null, purchased_at: createdAt } });
        await tx.shopping_inventory_movements.create({ data: { id: id(), variant_id: item.variant.id, quantity_change: -item.line.quantity, reason: "purchase", order_item_id: orderItemId, created_at: createdAt } });
        await tx.shopping_cart_lines.deleteMany({ where: { id: item.line.lineId, customer_id: actor.id } });
      }
      await tx.shopping_payment_transactions.create({ data: { id: id(), reference_id: attempt.attempt_id, kind: "payment", order_id: created.id, order_item_id: null, amount: total, created_at: createdAt } });
      await tx.shopping_checkout_holds.deleteMany({ where: { attempt_id: attempt.attempt_id } });
      const updatedAttempt = await tx.shopping_checkout_attempts.updateMany({ where: { id: attempt.id, status: { in: ["pending", "unknown"] } }, data: { status: "succeeded", order_id: created.id } });
      if (updatedAttempt.count !== 1) throw ErrorUtil.conflict("The payment attempt is already final.");
      return created.id;
    });
    return order(actor, orderId);
  }
  async function preparePaymentAttempt(
    actor: ShoppingActor,
    attempt: { attempt_id: string; amount: number; lines: string; address: string },
  ): Promise<void> {
    const lines = JSON.parse(attempt.lines) as Array<{ variantId: string; lineId: string; quantity: number; unitPrice: number }>;
    const address = JSON.parse(attempt.address) as { id: string; recipient_name: string; recipient_phone: string; street_address: string; city: string; state_or_province: string; postal_code: string; country: string };
    await db().$transaction(async (tx) => {
      await requireCustomerAtCommit(actor, tx);
      const currentAttempt = await tx.shopping_checkout_attempts.findUnique({ where: { attempt_id: attempt.attempt_id } });
      if (currentAttempt === null || currentAttempt.status !== "pending") throw ErrorUtil.conflict("The payment attempt is already final.");
      const addressRow = await tx.shopping_shipping_addresses.findFirst({ where: { id: address.id, customer_id: actor.id, recipient_name: address.recipient_name, recipient_phone: address.recipient_phone, street_address: address.street_address, city: address.city, state_or_province: address.state_or_province, postal_code: address.postal_code, country: address.country } });
      if (addressRow === null) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
      for (const line of lines) {
        const cartLine = await tx.shopping_cart_lines.findFirst({ where: { id: line.lineId, customer_id: actor.id, variant_id: line.variantId } });
        const variant = await tx.shopping_variants.findFirst({ where: { id: line.variantId, deleted_at: null } });
        if (cartLine === null || cartLine.quantity !== line.quantity || variant === null) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
        const productRow = await tx.shopping_products.findFirst({ where: { id: variant.product_id, deleted_at: null } });
        if (productRow === null) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
        const seller = await tx.shopping_sellers.findUnique({ where: { id: productRow.seller_id } });
        const profile = await tx.shopping_seller_profiles.findUnique({ where: { seller_id: productRow.seller_id } });
        if (seller === null || profile === null || seller.approval_state !== "approved" || seller.suspended || seller.login_state !== "active") throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
        const movements = await tx.shopping_inventory_movements.findMany({ where: { variant_id: variant.id }, select: { quantity_change: true } });
        const holds = await tx.shopping_checkout_holds.findMany({ where: { variant_id: variant.id }, select: { quantity: true } });
        const stock = movements.reduce((sum, movement) => sum + movement.quantity_change, 0) - holds.reduce((sum, hold) => sum + hold.quantity, 0);
        if (stock < line.quantity) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
        const price = variant.price_override ?? productRow.base_price;
        if (!Number.isFinite(price)) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
        if (price !== line.unitPrice) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
        await tx.shopping_checkout_holds.create({ data: { id: id(), attempt_id: attempt.attempt_id, variant_id: variant.id, quantity: line.quantity, created_at: now() } });
      }
      const total = await tx.shopping_checkout_holds.findMany({ where: { attempt_id: attempt.attempt_id } });
      if (total.reduce((sum, hold) => sum + hold.quantity, 0) <= 0 || lines.reduce((sum, line) => sum + line.quantity, 0) <= 0) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
      const prices = await Promise.all(lines.map(async (line) => {
        const variant = await tx.shopping_variants.findUnique({ where: { id: line.variantId } });
        const productRow = variant === null ? null : await tx.shopping_products.findUnique({ where: { id: variant.product_id } });
        return variant === null || productRow === null || variant.price_override !== null && variant.price_override !== undefined && variant.price_override !== line.unitPrice || variant !== null && productRow !== null && variant.price_override === null && productRow.base_price !== line.unitPrice ? NaN : (variant.price_override ?? productRow.base_price) * line.quantity;
      }));
      if (prices.reduce((sum, price) => sum + price, 0) !== attempt.amount) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary.");
    });
  }
  async function orderItemPreview(line: api.IShoppingCartLine): Promise<api.IShoppingOrderItem> { const productRow = await db().shopping_products.findUnique({ where: { id: line.variant.product.id } }); if (productRow === null) throw ErrorUtil.conflict("Checkout facts are stale; refresh the summary."); return { id: line.id, productName: line.variant.product.name, productDescription: productRow.description, variantSku: line.variant.sku, variantOptions: line.variant.options, seller: { id: line.variant.product.seller.id, shopName: line.variant.product.seller.shopName, logo: line.variant.product.seller.logo }, unitPrice: line.variant.price, quantity: line.quantity, status: "paid", deliveredAt: null, shipmentId: null }; }

  /** Lists customer orders or administrator orders according to caller scope. */
  export function orders(actor: ShoppingActor, input: api.IPage.IRequest, all?: false): Promise<api.IPage<api.IShoppingOrder.ISummary>>;
  /** Lists the filtered platform order directory. */
  export function orders(actor: ShoppingActor, input: api.IShoppingOrder.IAdminRequest, all: true): Promise<api.IPage<api.IShoppingOrder.IAdminSummary>>;
  export async function orders(actor: ShoppingActor, input: api.IPage.IRequest | api.IShoppingOrder.IAdminRequest, all = false): Promise<api.IPage<api.IShoppingOrder.ISummary | api.IShoppingOrder.IAdminSummary>> {
    await autoDeliverExpired();
    if (!all && actor.type !== "customer") throw ErrorUtil.forbidden("Customer authority is required.");
    if (all) await requireAdmin(actor);
    const adminInput = input as api.IShoppingOrder.IAdminRequest;
    const createdFrom = all && adminInput.createdFrom !== undefined && adminInput.createdFrom !== null ? new Date(adminInput.createdFrom) : undefined;
    const createdTo = all && adminInput.createdTo !== undefined && adminInput.createdTo !== null ? new Date(adminInput.createdTo) : undefined;
    if ((createdFrom !== undefined && Number.isNaN(createdFrom.getTime())) || (createdTo !== undefined && Number.isNaN(createdTo.getTime())) || (createdFrom !== undefined && createdTo !== undefined && createdFrom > createdTo)) throw ErrorUtil.unprocessable("Invalid order date range.");
    if (all && adminInput.status !== undefined && adminInput.status !== null && !["paid", "shipped", "delivered", "cancelled", "refunded", "partially completed"].includes(adminInput.status)) throw ErrorUtil.unprocessable("Unsupported order status.");
    const rows = await db().shopping_orders.findMany({ where: all ? { ...(adminInput.customerId ? { customer_id: adminInput.customerId } : {}), ...(createdFrom || createdTo ? { created_at: { ...(createdFrom ? { gte: createdFrom } : {}), ...(createdTo ? { lte: createdTo } : {}) } } : {}) } : { customer_id: actor.id }, orderBy: [{ purchased_at: "desc" }, { order_number: "desc" }] });
    const values: (api.IShoppingOrder.ISummary | api.IShoppingOrder.IAdminSummary)[] = [];
    for (const row of rows) {
      if (all && adminInput.status !== undefined && adminInput.status !== null && row.status !== adminInput.status) continue;
      const items = all ? await db().shopping_order_items.findMany({ where: { order_id: row.id }, select: { seller_id: true } }) : [];
      if (all && adminInput.sellerId !== undefined && adminInput.sellerId !== null && !items.some((item) => item.seller_id === adminInput.sellerId)) continue;
      if (all) {
        const customer = await db().shopping_customers.findUnique({ where: { id: row.customer_id }, select: { login_state: true } });
        values.push({ id: row.id, orderNumber: row.order_number, purchasedAt: row.purchased_at.toISOString(), totalPrice: row.total_price, status: row.status as api.IShoppingOrder["status"], customerId: customer?.login_state === "deleted" ? null : row.customer_id, itemCount: items.length, sellerCount: new Set(items.map((item) => item.seller_id)).size });
      } else values.push({ id: row.id, orderNumber: row.order_number, purchasedAt: row.purchased_at.toISOString(), totalPrice: row.total_price, status: row.status as api.IShoppingOrder["status"] });
    }
    return page(values, input);
  }
  /** Opens one retained order detail. */
  export async function order(actor: ShoppingActor, orderId: string, admin = false): Promise<api.IShoppingOrder> { await autoDeliverExpired(); const row = await db().shopping_orders.findUnique({ where: { id: orderId } }); if (row === null) throw ErrorUtil.notFound("The order does not exist."); if (admin) await requireAdmin(actor); else if (actor.type !== "customer" || row.customer_id !== actor.id) throw ErrorUtil.forbidden("The order belongs to another customer."); return hydrateOrder(row); }
  async function hydrateOrder(row: { id: string; order_number: string; purchased_at: Date; total_price: number; status: string; recipient_name: string; recipient_phone: string; street_address: string; city: string; state_or_province: string; postal_code: string; country: string }): Promise<api.IShoppingOrder> { const items = await db().shopping_order_items.findMany({ where: { order_id: row.id }, orderBy: { id: "asc" } }); const itemIds = items.map((item) => item.id); const cancellations = await db().shopping_cancellation_requests.findMany({ where: { order_item_id: { in: itemIds } }, orderBy: [{ created_at: "asc" }, { id: "asc" }] }); const refunds = await db().shopping_refund_requests.findMany({ where: { order_item_id: { in: itemIds } }, orderBy: [{ created_at: "asc" }, { id: "asc" }] }); const restorations = await db().shopping_inventory_movements.findMany({ where: { order_item_id: { in: itemIds }, quantity_change: { gt: 0 } }, orderBy: [{ created_at: "asc" }, { id: "asc" }] }); const actions = await db().shopping_admin_actions.findMany({ where: { target_id: { in: itemIds } }, orderBy: [{ created_at: "asc" }, { id: "asc" }] }); const shipments = await db().shopping_shipments.findMany({ where: { order_id: row.id }, orderBy: [{ shipped_at: "asc" }, { id: "asc" }] }); const shipmentDtos: api.IShoppingShipment[] = []; for (const shipment of shipments) { const profile = await db().shopping_seller_profiles.findUnique({ where: { seller_id: shipment.seller_id } }); const members = await db().shopping_order_items.findMany({ where: { shipment_id: shipment.id }, select: { id: true } }); shipmentDtos.push({ id: shipment.id, seller: { id: shipment.seller_id, shopName: profile?.shop_name ?? "deleted shop" }, carrier: shipment.carrier, trackingNumber: shipment.tracking_number, shippedAt: shipment.shipped_at.toISOString(), deliveredAt: date(shipment.delivered_at), itemIds: members.map((member) => member.id) }); }
    return { id: row.id, orderNumber: row.order_number, purchasedAt: row.purchased_at.toISOString(), totalPrice: row.total_price, status: row.status as api.IShoppingOrder["status"], address: { recipientName: row.recipient_name, recipientPhone: row.recipient_phone, streetAddress: row.street_address, city: row.city, stateOrProvince: row.state_or_province, postalCode: row.postal_code, country: row.country }, items: items.map((item) => ({ id: item.id, productName: item.product_name, productDescription: item.product_description, variantSku: item.variant_sku, variantOptions: JSON.parse(item.variant_options) as Record<string, string>, seller: { id: item.seller_id, shopName: item.seller_shop_name, logo: item.seller_logo }, unitPrice: item.unit_price, quantity: item.quantity, status: item.status as api.IShoppingOrderItem["status"], deliveredAt: date(item.delivered_at), shipmentId: item.shipment_id, purchasedAt: item.purchased_at.toISOString(), cancellationRequests: cancellations.filter((request) => request.order_item_id === item.id).map(requestDto), refundRequests: refunds.filter((request) => request.order_item_id === item.id).map(requestDto), restorations: restorations.filter((movement) => movement.order_item_id === item.id).map((movement) => ({ id: movement.id, quantityChange: movement.quantity_change, reason: movement.reason, createdAt: movement.created_at.toISOString() })) })), shipments: shipmentDtos, forcedActions: actions.map((action) => ({ id: action.id, kind: action.kind, actorId: action.actor_id, reason: action.reason, beforeStatus: (action.before_state ?? "paid") as api.IShoppingOrderItem["status"], afterStatus: (action.after_state ?? "paid") as api.IShoppingOrderItem["status"], createdAt: action.created_at.toISOString() })) };
  }
  /** Lists paid order items awaiting shipment for one seller. */
  export async function shippingQueue(actor: ShoppingActor, input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingOrderItem>> { await requireSeller(actor); const rows = await db().shopping_order_items.findMany({ where: { seller_id: actor.id, status: "paid", shipment_id: null }, orderBy: [{ purchased_at: "asc" }, { id: "asc" }] }); return page(await Promise.all(rows.map(sellerOrderItemDto)), input); }
  /** Creates one same-seller shipment and transitions all selected items. */
  export async function createShipment(actor: ShoppingActor, body: api.IShoppingShipment.ICreate): Promise<api.IShoppingShipment> { await requireSeller(actor); const itemIds = body.itemIds; if (itemIds.length === 0 || new Set(itemIds).size !== itemIds.length) throw ErrorUtil.unprocessable("At least one unique item is required."); const rows = await db().shopping_order_items.findMany({ where: { id: { in: itemIds } } }); const orderId = rows[0]?.order_id; if (rows.length !== itemIds.length || orderId === undefined || rows.some((row) => row.order_id !== orderId || row.seller_id !== actor.id || row.status !== "paid" || row.shipment_id !== null)) throw ErrorUtil.conflict("Every selected item must be an unshipped paid item from one order owned by this seller."); const carrier = text(body.carrier, "carrier"); const trackingNumber = text(body.trackingNumber, "trackingNumber"); const shipmentId = id(); const shippedAt = now(); await db().$transaction(async (tx) => { await requireSellerAtCommit(actor, tx); const pending = await tx.shopping_cancellation_requests.findFirst({ where: { order_item_id: { in: itemIds }, status: "pending" } }); if (pending !== null) throw ErrorUtil.conflict("A pending cancellation must be decided before shipping."); const shipment = await tx.shopping_shipments.create({ data: { id: shipmentId, order_id: orderId, seller_id: actor.id, carrier, tracking_number: trackingNumber, shipped_at: shippedAt, delivered_at: null, created_at: shippedAt } }); const updated = await tx.shopping_order_items.updateMany({ where: { id: { in: itemIds }, seller_id: actor.id, status: "paid", shipment_id: null }, data: { status: "shipped", shipment_id: shipment.id } }); if (updated.count !== itemIds.length) throw ErrorUtil.conflict("The selected items changed before shipment commit."); const statuses = (await tx.shopping_order_items.findMany({ where: { order_id: orderId }, select: { status: true } })).map((item) => item.status); await tx.shopping_orders.update({ where: { id: orderId }, data: { status: deriveStatus(statuses) } }); }); return hydrateShipment(shipmentId); }
  /** Customer confirms one currently shipped package. */
  export async function deliverShipment(actor: ShoppingActor, shipmentId: string): Promise<api.IShoppingShipment> { if (actor.type !== "customer") throw ErrorUtil.forbidden("Customer authority is required."); const shipment = await db().shopping_shipments.findUnique({ where: { id: shipmentId } }); if (shipment === null) throw ErrorUtil.notFound("The shipment does not exist."); const orderRow = await db().shopping_orders.findUnique({ where: { id: shipment.order_id } }); if (orderRow === null || orderRow.customer_id !== actor.id) throw ErrorUtil.forbidden("The shipment belongs to another customer."); const items = await db().shopping_order_items.findMany({ where: { shipment_id: shipmentId } }); if (items.length === 0 || shipment.delivered_at !== null || !items.every((item) => item.status === "shipped")) throw ErrorUtil.conflict("The shipment is not currently awaiting delivery."); const delivered = now(); await db().$transaction(async (tx) => { await requireCustomerAtCommit(actor, tx); const currentShipment = await tx.shopping_shipments.findUnique({ where: { id: shipmentId } }); const currentOrder = currentShipment === null ? null : await tx.shopping_orders.findUnique({ where: { id: currentShipment.order_id } }); if (currentShipment === null || currentOrder === null || currentOrder.customer_id !== actor.id) throw ErrorUtil.forbidden("The shipment belongs to another customer."); const currentItems = await tx.shopping_order_items.findMany({ where: { shipment_id: shipmentId }, select: { id: true, status: true } }); if (currentItems.length === 0 || currentShipment.delivered_at !== null || currentItems.some((item) => item.status !== "shipped")) throw ErrorUtil.conflict("The shipment is not currently awaiting delivery."); const claimed = await tx.shopping_shipments.updateMany({ where: { id: shipmentId, delivered_at: null }, data: { delivered_at: delivered } }); if (claimed.count !== 1) throw ErrorUtil.conflict("The shipment is no longer awaiting delivery."); const updatedItems = await tx.shopping_order_items.updateMany({ where: { shipment_id: shipmentId, status: "shipped" }, data: { status: "delivered", delivered_at: delivered } }); if (updatedItems.count !== currentItems.length) throw ErrorUtil.conflict("The shipment changed before delivery commit."); const statuses = (await tx.shopping_order_items.findMany({ where: { order_id: currentShipment.order_id }, select: { status: true } })).map((item) => item.status); await tx.shopping_orders.update({ where: { id: currentShipment.order_id }, data: { status: deriveStatus(statuses) } }); }); return hydrateShipment(shipmentId); }
  async function hydrateShipment(shipmentId: string): Promise<api.IShoppingShipment> { const row = await db().shopping_shipments.findUnique({ where: { id: shipmentId } }); if (row === null) throw ErrorUtil.notFound("The shipment does not exist."); const profile = await db().shopping_seller_profiles.findUnique({ where: { seller_id: row.seller_id } }); const members = await db().shopping_order_items.findMany({ where: { shipment_id: row.id }, select: { id: true } }); return { id: row.id, seller: { id: row.seller_id, shopName: profile?.shop_name ?? "deleted shop" }, carrier: row.carrier, trackingNumber: row.tracking_number, shippedAt: row.shipped_at.toISOString(), deliveredAt: date(row.delivered_at), itemIds: members.map((member) => member.id) }; }
  /** Applies the deadline-based delivery transition for the resident worker. */
  export async function autoDeliverExpired(): Promise<void> {
    const cutoff = new Date(Date.now() - 14 * 86_400_000);
    const shipments = await db().shopping_shipments.findMany({ where: { delivered_at: null, shipped_at: { lte: cutoff } }, select: { id: true, order_id: true, shipped_at: true } });
    for (const shipment of shipments) {
      const delivered = new Date(shipment.shipped_at.getTime() + 14 * 86_400_000);
      await db().$transaction(async (tx) => {
        const claimed = await tx.shopping_shipments.updateMany({ where: { id: shipment.id, delivered_at: null }, data: { delivered_at: delivered } });
        if (claimed.count !== 1) return;
        await tx.shopping_order_items.updateMany({ where: { shipment_id: shipment.id, status: "shipped" }, data: { status: "delivered", delivered_at: delivered } });
        const items = await tx.shopping_order_items.findMany({ where: { order_id: shipment.order_id }, select: { status: true } });
        await tx.shopping_orders.update({ where: { id: shipment.order_id }, data: { status: deriveStatus(items.map((item) => item.status)) } });
      });
    }
  }
  async function recalculate(orderId: string): Promise<void> { const items = await db().shopping_order_items.findMany({ where: { order_id: orderId }, select: { status: true } }); await db().shopping_orders.update({ where: { id: orderId }, data: { status: deriveStatus(items.map((item) => item.status)) } }); }
  function deriveStatus(statuses: string[]): string { return statuses.every((value) => value === "paid") ? "paid" : statuses.every((value) => value === "delivered") ? "delivered" : statuses.every((value) => value === "cancelled") ? "cancelled" : statuses.every((value) => value === "refunded") ? "refunded" : statuses.some((value) => value === "shipped") && !statuses.some((value) => value === "delivered") ? "shipped" : "partially completed"; }

  /** Force-cancels one eligible item under an administrator policy reason. */
  export async function forceCancelItem(actor: ShoppingActor, itemId: string, body: api.IShoppingOrder.IForce): Promise<api.IShoppingOrder> {
    await requireAdmin(actor);
    const reason = text(body.reason, "reason");
    const item = await db().shopping_order_items.findUnique({ where: { id: itemId } });
    if (item === null) throw ErrorUtil.notFound("The order item does not exist.");
    if (item.status !== "paid" && item.status !== "shipped") throw ErrorUtil.conflict("The order item is not eligible for force cancellation.");
    const actionAt = now();
    await db().$transaction(async (tx) => {
      await requireAdminAtCommit(actor, tx);
      const currentItem = await tx.shopping_order_items.findUnique({ where: { id: item.id } });
      if (currentItem === null || (currentItem.status !== "paid" && currentItem.status !== "shipped")) throw ErrorUtil.conflict("The order item is no longer eligible for force cancellation.");
      const pending = await tx.shopping_cancellation_requests.findFirst({ where: { order_item_id: currentItem.id, status: "pending" } });
      if (pending !== null) {
        const decided = await tx.shopping_cancellation_requests.updateMany({ where: { id: pending.id, status: "pending" }, data: { status: "approved", pending_key: null, decided_by: actor.id, decided_at: actionAt } });
        if (decided.count !== 1) throw ErrorUtil.conflict("The cancellation request is no longer pending.");
        await tx.shopping_snapshots.create({ data: { id: id(), kind: "forceCancellationDecision", subject_type: "cancellation", subject_id: pending.id, changed: JSON.stringify(["status"]), before_data: JSON.stringify({ status: "pending" }), after_data: JSON.stringify({ status: "approved", reason }), created_at: actionAt } });
      }
      const statuses = (await tx.shopping_order_items.findMany({ where: { order_id: currentItem.order_id }, select: { id: true, status: true } })).map((current) => current.id === currentItem.id ? "cancelled" : current.status);
      const updated = await tx.shopping_order_items.updateMany({ where: { id: currentItem.id, status: { in: ["paid", "shipped"] } }, data: { status: "cancelled" } });
      if (updated.count !== 1) throw ErrorUtil.conflict("The order item is no longer eligible for force cancellation.");
      await tx.shopping_inventory_movements.create({ data: { id: id(), variant_id: currentItem.variant_id, quantity_change: currentItem.quantity, reason: `administrator cancellation: ${reason}`, order_item_id: currentItem.id, created_at: actionAt } });
      await tx.shopping_payment_transactions.create({ data: { id: id(), reference_id: `cancellation:${currentItem.id}`, kind: "refund", order_id: currentItem.order_id, order_item_id: currentItem.id, amount: currentItem.unit_price * currentItem.quantity, created_at: actionAt } });
      await tx.shopping_admin_actions.create({ data: { id: id(), kind: "forceCancellation", actor_id: actor.id, target_id: currentItem.id, reason, before_state: currentItem.status, after_state: "cancelled", created_at: actionAt } });
      await tx.shopping_orders.update({ where: { id: currentItem.order_id }, data: { status: deriveStatus(statuses) } });
    });
    return order(actor, item.order_id, true);
  }

  /** Force-cancels every currently eligible item in one order. */
  export async function forceCancelOrder(actor: ShoppingActor, orderId: string, body: api.IShoppingOrder.IForce): Promise<api.IShoppingOrder> {
    await requireAdmin(actor);
    const reason = text(body.reason, "reason");
    if (await db().shopping_order_items.findFirst({ where: { order_id: orderId, status: { in: ["paid", "shipped"] } } }) === null) throw ErrorUtil.conflict("The order has no item eligible for force cancellation.");
    const actionAt = now();
    await db().$transaction(async (tx) => {
      await requireAdminAtCommit(actor, tx);
      const items = await tx.shopping_order_items.findMany({ where: { order_id: orderId, status: { in: ["paid", "shipped"] } } });
      if (items.length === 0) throw ErrorUtil.conflict("The order has no item eligible for force cancellation.");
      for (const item of items) {
        const pending = await tx.shopping_cancellation_requests.findFirst({ where: { order_item_id: item.id, status: "pending" } });
        if (pending !== null) {
          await tx.shopping_cancellation_requests.update({ where: { id: pending.id, status: "pending" }, data: { status: "approved", pending_key: null, decided_by: actor.id, decided_at: actionAt } });
          await tx.shopping_snapshots.create({ data: { id: id(), kind: "forceCancellationDecision", subject_type: "cancellation", subject_id: pending.id, changed: JSON.stringify(["status"]), before_data: JSON.stringify({ status: "pending" }), after_data: JSON.stringify({ status: "approved", reason }), created_at: actionAt } });
        }
        const updated = await tx.shopping_order_items.updateMany({ where: { id: item.id, status: { in: ["paid", "shipped"] } }, data: { status: "cancelled" } });
        if (updated.count !== 1) throw ErrorUtil.conflict("The order item is no longer eligible for force cancellation.");
        await tx.shopping_inventory_movements.create({ data: { id: id(), variant_id: item.variant_id, quantity_change: item.quantity, reason: `administrator cancellation: ${reason}`, order_item_id: item.id, created_at: actionAt } });
        await tx.shopping_payment_transactions.create({ data: { id: id(), reference_id: `cancellation:${item.id}`, kind: "refund", order_id: orderId, order_item_id: item.id, amount: item.unit_price * item.quantity, created_at: actionAt } });
        await tx.shopping_admin_actions.create({ data: { id: id(), kind: "forceCancellation", actor_id: actor.id, target_id: item.id, reason, before_state: item.status, after_state: "cancelled", created_at: actionAt } });
      }
      const statuses = (await tx.shopping_order_items.findMany({ where: { order_id: orderId }, select: { status: true } })).map((item) => item.status);
      await tx.shopping_orders.update({ where: { id: orderId }, data: { status: deriveStatus(statuses) } });
    });
    return order(actor, orderId, true);
  }

  /** Force-refunds one eligible item under an administrator policy reason. */
  export async function forceRefundItem(actor: ShoppingActor, itemId: string, body: api.IShoppingOrder.IForce): Promise<api.IShoppingOrder> {
    await requireAdmin(actor);
    const reason = text(body.reason, "reason");
    const item = await db().shopping_order_items.findUnique({ where: { id: itemId } });
    if (item === null) throw ErrorUtil.notFound("The order item does not exist.");
    if (!["paid", "shipped", "delivered"].includes(item.status)) throw ErrorUtil.conflict("The order item is not eligible for force refund.");
    if (await db().shopping_cancellation_requests.findFirst({ where: { order_item_id: item.id, status: "pending" } })) throw ErrorUtil.conflict("A pending cancellation blocks force refund.");
    const actionAt = now();
    await db().$transaction(async (tx) => {
      await requireAdminAtCommit(actor, tx);
      if (await tx.shopping_cancellation_requests.findFirst({ where: { order_item_id: item.id, status: "pending" } })) throw ErrorUtil.conflict("A pending cancellation blocks force refund.");
      const currentItem = await tx.shopping_order_items.findUnique({ where: { id: item.id } });
      if (currentItem === null || !["paid", "shipped", "delivered"].includes(currentItem.status)) throw ErrorUtil.conflict("The order item is no longer eligible for force refund.");
      const pending = await tx.shopping_refund_requests.findFirst({ where: { order_item_id: currentItem.id, status: "pending" } });
      if (pending !== null) {
        const decided = await tx.shopping_refund_requests.updateMany({ where: { id: pending.id, status: "pending" }, data: { status: "approved", pending_key: null, decided_by: actor.id, decided_at: actionAt } });
        if (decided.count !== 1) throw ErrorUtil.conflict("The refund request is no longer pending.");
        await tx.shopping_snapshots.create({ data: { id: id(), kind: "forceRefundDecision", subject_type: "refund", subject_id: pending.id, changed: JSON.stringify(["status"]), before_data: JSON.stringify({ status: "pending" }), after_data: JSON.stringify({ status: "approved", reason }), created_at: actionAt } });
      }
      const statuses = (await tx.shopping_order_items.findMany({ where: { order_id: currentItem.order_id }, select: { id: true, status: true } })).map((current) => current.id === currentItem.id ? "refunded" : current.status);
      const updated = await tx.shopping_order_items.updateMany({ where: { id: currentItem.id, status: { in: ["paid", "shipped", "delivered"] } }, data: { status: "refunded" } });
      if (updated.count !== 1) throw ErrorUtil.conflict("The order item is no longer eligible for force refund.");
      await tx.shopping_inventory_movements.create({ data: { id: id(), variant_id: currentItem.variant_id, quantity_change: currentItem.quantity, reason: `administrator refund: ${reason}`, order_item_id: currentItem.id, created_at: actionAt } });
      await tx.shopping_payment_transactions.create({ data: { id: id(), reference_id: `refund:${currentItem.id}`, kind: "refund", order_id: currentItem.order_id, order_item_id: currentItem.id, amount: currentItem.unit_price * currentItem.quantity, created_at: actionAt } });
      await tx.shopping_admin_actions.create({ data: { id: id(), kind: "forceRefund", actor_id: actor.id, target_id: currentItem.id, reason, before_state: currentItem.status, after_state: "refunded", created_at: actionAt } });
      await tx.shopping_orders.update({ where: { id: currentItem.order_id }, data: { status: deriveStatus(statuses) } });
    });
    return order(actor, item.order_id, true);
  }

  /** Force-refunds every currently eligible item in one order. */
  export async function forceRefundOrder(actor: ShoppingActor, orderId: string, body: api.IShoppingOrder.IForce): Promise<api.IShoppingOrder> {
    await requireAdmin(actor);
    const reason = text(body.reason, "reason");
    if (await db().shopping_order_items.findFirst({ where: { order_id: orderId, status: { in: ["paid", "shipped", "delivered"] } } }) === null) throw ErrorUtil.conflict("The order has no item eligible for force refund.");
    const actionAt = now();
    await db().$transaction(async (tx) => {
      await requireAdminAtCommit(actor, tx);
      const items = await tx.shopping_order_items.findMany({ where: { order_id: orderId, status: { in: ["paid", "shipped", "delivered"] } } });
      if (items.length === 0) throw ErrorUtil.conflict("The order has no item eligible for force refund.");
      for (const item of items) {
        if (await tx.shopping_cancellation_requests.findFirst({ where: { order_item_id: item.id, status: "pending" } })) throw ErrorUtil.conflict("A pending cancellation blocks force refund.");
        const pending = await tx.shopping_refund_requests.findFirst({ where: { order_item_id: item.id, status: "pending" } });
        if (pending !== null) {
          await tx.shopping_refund_requests.update({ where: { id: pending.id, status: "pending" }, data: { status: "approved", pending_key: null, decided_by: actor.id, decided_at: actionAt } });
          await tx.shopping_snapshots.create({ data: { id: id(), kind: "forceRefundDecision", subject_type: "refund", subject_id: pending.id, changed: JSON.stringify(["status"]), before_data: JSON.stringify({ status: "pending" }), after_data: JSON.stringify({ status: "approved", reason }), created_at: actionAt } });
        }
        const updated = await tx.shopping_order_items.updateMany({ where: { id: item.id, status: { in: ["paid", "shipped", "delivered"] } }, data: { status: "refunded" } });
        if (updated.count !== 1) throw ErrorUtil.conflict("The order item is no longer eligible for force refund.");
        await tx.shopping_inventory_movements.create({ data: { id: id(), variant_id: item.variant_id, quantity_change: item.quantity, reason: `administrator refund: ${reason}`, order_item_id: item.id, created_at: actionAt } });
        await tx.shopping_payment_transactions.create({ data: { id: id(), reference_id: `refund:${item.id}`, kind: "refund", order_id: orderId, order_item_id: item.id, amount: item.unit_price * item.quantity, created_at: actionAt } });
        await tx.shopping_admin_actions.create({ data: { id: id(), kind: "forceRefund", actor_id: actor.id, target_id: item.id, reason, before_state: item.status, after_state: "refunded", created_at: actionAt } });
      }
      const statuses = (await tx.shopping_order_items.findMany({ where: { order_id: orderId }, select: { status: true } })).map((item) => item.status);
      await tx.shopping_orders.update({ where: { id: orderId }, data: { status: deriveStatus(statuses) } });
    });
    return order(actor, orderId, true);
  }
  type OrderItemRow = { id: string; product_name: string; product_description: string; variant_sku: string; variant_options: string; seller_id: string; seller_shop_name: string; seller_logo: string | null; unit_price: number; quantity: number; status: string; delivered_at: Date | null; shipment_id: string | null };
  type SellerOrderItemRow = OrderItemRow & { order_id: string };
  function orderItemDto(item: OrderItemRow): api.IShoppingOrderItem { return { id: item.id, productName: item.product_name, productDescription: item.product_description, variantSku: item.variant_sku, variantOptions: JSON.parse(item.variant_options) as Record<string, string>, seller: { id: item.seller_id, shopName: item.seller_shop_name, logo: item.seller_logo }, unitPrice: item.unit_price, quantity: item.quantity, status: item.status as api.IShoppingOrderItem["status"], deliveredAt: date(item.delivered_at), shipmentId: item.shipment_id }; }
  async function sellerOrderItemDto(item: SellerOrderItemRow): Promise<api.IShoppingOrderItem> { const order = await db().shopping_orders.findUnique({ where: { id: item.order_id } }); if (order === null) throw ErrorUtil.notFound("The order does not exist."); return { ...orderItemDto(item), orderId: order.id, customerId: order.customer_id, address: { recipientName: order.recipient_name, recipientPhone: order.recipient_phone, streetAddress: order.street_address, city: order.city, stateOrProvince: order.state_or_province, postalCode: order.postal_code, country: order.country } }; }

  /** Creates a pending cancellation request for one paid item. */
  export async function requestCancellation(actor: ShoppingActor, itemId: string, body: api.IShoppingRequest.ICreate): Promise<api.IShoppingRequest> { await customerItem(actor, itemId, "paid"); const reason = text(body.reason, "reason"); const row = await db().$transaction(async (tx) => { const customer = await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } }); if (customer === null) throw ErrorUtil.forbidden("The customer account is no longer available."); const current = await tx.shopping_order_items.findUnique({ where: { id: itemId } }); const order = current === null ? null : await tx.shopping_orders.findUnique({ where: { id: current.order_id } }); if (current === null || order === null || order.customer_id !== actor.id) throw ErrorUtil.forbidden("The order item belongs to another customer."); if (current.status !== "paid" || current.shipment_id !== null) throw ErrorUtil.conflict("A shipped item cannot be cancelled."); return tx.shopping_cancellation_requests.create({ data: { id: id(), order_item_id: itemId, customer_id: actor.id, seller_id: current.seller_id, reason, status: "pending", pending_key: itemId, decided_by: null, decided_at: null, created_at: now() } }); }); return requestDto(row); }
  /** Lists a seller's pending cancellations. */
  export async function cancellationQueue(actor: ShoppingActor, input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingRequest>> { await requireSeller(actor); const rows = await db().shopping_cancellation_requests.findMany({ where: { seller_id: actor.id, status: "pending" }, orderBy: [{ created_at: "asc" }, { id: "asc" }] }); return page(await Promise.all(rows.map(sellerRequestDto)), input); }
  /** Approves or rejects one cancellation as its item seller. */
  export async function decideCancellation(actor: ShoppingActor, requestId: string, approve: boolean): Promise<api.IShoppingRequest> {
    await requireSeller(actor);
    const row = await db().shopping_cancellation_requests.findFirst({ where: { id: requestId, seller_id: actor.id, status: "pending" } });
    if (row === null) throw ErrorUtil.notFound("The cancellation request is not pending.");
    const item = await db().shopping_order_items.findUnique({ where: { id: row.order_item_id } });
    if (item === null || item.status !== "paid") throw ErrorUtil.conflict("The order item is no longer cancellable.");
    const status = approve ? "approved" : "rejected";
    const decidedAt = now();
    await db().$transaction(async (tx) => {
      await requireSellerAtCommit(actor, tx);
      const currentRequest = await tx.shopping_cancellation_requests.findFirst({ where: { id: requestId, seller_id: actor.id, status: "pending" } });
      if (currentRequest === null) throw ErrorUtil.conflict("The cancellation request is no longer pending.");
      const currentItem = await tx.shopping_order_items.findUnique({ where: { id: row.order_item_id } });
      if (currentItem === null || currentItem.status !== "paid") throw ErrorUtil.conflict("The order item is no longer cancellable.");
      const updatedRequest = await tx.shopping_cancellation_requests.updateMany({ where: { id: requestId, seller_id: actor.id, status: "pending" }, data: { status, pending_key: null, decided_by: actor.id, decided_at: decidedAt } });
      if (updatedRequest.count !== 1) throw ErrorUtil.conflict("The cancellation request is no longer pending.");
      await tx.shopping_snapshots.create({ data: { id: id(), kind: "cancellationDecision", subject_type: "cancellation", subject_id: row.id, changed: JSON.stringify(["status"]), before_data: JSON.stringify({ status: "pending", reason: row.reason }), after_data: JSON.stringify({ status, reason: row.reason }), created_at: decidedAt } });
      if (approve) {
        const statuses = (await tx.shopping_order_items.findMany({ where: { order_id: currentItem.order_id }, select: { id: true, status: true } })).map((current) => current.id === currentItem.id ? "cancelled" : current.status);
        const updatedItem = await tx.shopping_order_items.updateMany({ where: { id: currentItem.id, status: "paid" }, data: { status: "cancelled" } });
        if (updatedItem.count !== 1) throw ErrorUtil.conflict("The order item is no longer cancellable.");
        await tx.shopping_inventory_movements.create({ data: { id: id(), variant_id: currentItem.variant_id, quantity_change: currentItem.quantity, reason: "cancellation restoration", order_item_id: currentItem.id, created_at: decidedAt } });
        await tx.shopping_payment_transactions.create({ data: { id: id(), reference_id: `cancellation:${currentItem.id}`, kind: "refund", order_id: currentItem.order_id, order_item_id: currentItem.id, amount: currentItem.unit_price * currentItem.quantity, created_at: decidedAt } });
        await tx.shopping_orders.update({ where: { id: currentItem.order_id }, data: { status: deriveStatus(statuses) } });
      }
    });
    return requestDto((await db().shopping_cancellation_requests.findUnique({ where: { id: row.id } }))!);
  }
  /** Creates a pending refund request for one delivered item. */
  export async function requestRefund(actor: ShoppingActor, itemId: string, body: api.IShoppingRequest.ICreate): Promise<api.IShoppingRequest> { await customerItem(actor, itemId, "delivered"); const reason = text(body.reason, "reason"); const row = await db().$transaction(async (tx) => { const customer = await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } }); if (customer === null) throw ErrorUtil.forbidden("The customer account is no longer available."); const current = await tx.shopping_order_items.findUnique({ where: { id: itemId } }); const order = current === null ? null : await tx.shopping_orders.findUnique({ where: { id: current.order_id } }); if (current === null || order === null || order.customer_id !== actor.id) throw ErrorUtil.forbidden("The order item belongs to another customer."); if (current.status !== "delivered" || current.delivered_at === null || current.delivered_at.getTime() + 7 * 86_400_000 < Date.now()) throw ErrorUtil.conflict("The refund window has expired."); return tx.shopping_refund_requests.create({ data: { id: id(), order_item_id: itemId, customer_id: actor.id, seller_id: current.seller_id, reason, status: "pending", pending_key: itemId, decided_by: null, decided_at: null, created_at: now() } }); }); return requestDto(row); }
  /** Lists a seller's pending refunds. */
  export async function refundQueue(actor: ShoppingActor, input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingRequest>> { await requireSeller(actor); const rows = await db().shopping_refund_requests.findMany({ where: { seller_id: actor.id, status: "pending" }, orderBy: [{ created_at: "asc" }, { id: "asc" }] }); return page(await Promise.all(rows.map(sellerRequestDto)), input); }
  /** Approves or rejects one refund as its item seller. */
  export async function decideRefund(actor: ShoppingActor, requestId: string, approve: boolean): Promise<api.IShoppingRequest> {
    await requireSeller(actor);
    const row = await db().shopping_refund_requests.findFirst({ where: { id: requestId, seller_id: actor.id, status: "pending" } });
    if (row === null) throw ErrorUtil.notFound("The refund request is not pending.");
    const item = await db().shopping_order_items.findUnique({ where: { id: row.order_item_id } });
    if (item === null || item.status !== "delivered") throw ErrorUtil.conflict("The order item is no longer refundable.");
    const status = approve ? "approved" : "rejected";
    const decidedAt = now();
    await db().$transaction(async (tx) => {
      await requireSellerAtCommit(actor, tx);
      const currentRequest = await tx.shopping_refund_requests.findFirst({ where: { id: requestId, seller_id: actor.id, status: "pending" } });
      if (currentRequest === null) throw ErrorUtil.conflict("The refund request is no longer pending.");
      const currentItem = await tx.shopping_order_items.findUnique({ where: { id: row.order_item_id } });
      if (currentItem === null || currentItem.status !== "delivered") throw ErrorUtil.conflict("The order item is no longer refundable.");
      const updatedRequest = await tx.shopping_refund_requests.updateMany({ where: { id: requestId, seller_id: actor.id, status: "pending" }, data: { status, pending_key: null, decided_by: actor.id, decided_at: decidedAt } });
      if (updatedRequest.count !== 1) throw ErrorUtil.conflict("The refund request is no longer pending.");
      await tx.shopping_snapshots.create({ data: { id: id(), kind: "refundDecision", subject_type: "refund", subject_id: row.id, changed: JSON.stringify(["status"]), before_data: JSON.stringify({ status: "pending", reason: row.reason }), after_data: JSON.stringify({ status, reason: row.reason }), created_at: decidedAt } });
      if (approve) {
        const statuses = (await tx.shopping_order_items.findMany({ where: { order_id: currentItem.order_id }, select: { id: true, status: true } })).map((current) => current.id === currentItem.id ? "refunded" : current.status);
        const updatedItem = await tx.shopping_order_items.updateMany({ where: { id: currentItem.id, status: "delivered" }, data: { status: "refunded" } });
        if (updatedItem.count !== 1) throw ErrorUtil.conflict("The order item is no longer refundable.");
        await tx.shopping_inventory_movements.create({ data: { id: id(), variant_id: currentItem.variant_id, quantity_change: currentItem.quantity, reason: "refund restoration", order_item_id: currentItem.id, created_at: decidedAt } });
        await tx.shopping_payment_transactions.create({ data: { id: id(), reference_id: `refund:${currentItem.id}`, kind: "refund", order_id: currentItem.order_id, order_item_id: currentItem.id, amount: currentItem.unit_price * currentItem.quantity, created_at: decidedAt } });
        await tx.shopping_orders.update({ where: { id: currentItem.order_id }, data: { status: deriveStatus(statuses) } });
      }
    });
    return requestDto((await db().shopping_refund_requests.findUnique({ where: { id: row.id } }))!);
  }
  async function customerItem(actor: ShoppingActor, itemId: string, status: string) { if (actor.type !== "customer") throw ErrorUtil.forbidden("Customer authority is required."); const item = await db().shopping_order_items.findUnique({ where: { id: itemId } }); if (item === null) throw ErrorUtil.notFound("The order item does not exist."); const orderRow = await db().shopping_orders.findUnique({ where: { id: item.order_id } }); if (orderRow === null || orderRow.customer_id !== actor.id) throw ErrorUtil.forbidden("The order item belongs to another customer."); if (item.status !== status) throw ErrorUtil.conflict("The order item is not in the required state."); return item; }
  function requestDto(row: { id: string; reason: string; status: string; order_item_id: string; created_at: Date; decided_at: Date | null }): api.IShoppingRequest { return { id: row.id, reason: row.reason, status: row.status as api.IShoppingRequest["status"], orderItemId: row.order_item_id, createdAt: row.created_at.toISOString(), decidedAt: date(row.decided_at) }; }
  async function sellerRequestDto(row: Parameters<typeof requestDto>[0]): Promise<api.IShoppingRequest> { const item = await db().shopping_order_items.findUnique({ where: { id: row.order_item_id } }); if (item === null) throw ErrorUtil.notFound("The order item does not exist."); const order = await db().shopping_orders.findUnique({ where: { id: item.order_id } }); if (order === null) throw ErrorUtil.notFound("The order does not exist."); return { ...requestDto(row), orderId: order.id, customerId: order.customer_id, productName: item.product_name, variantSku: item.variant_sku, quantity: item.quantity, deliveredAt: date(item.delivered_at), address: { recipientName: order.recipient_name, recipientPhone: order.recipient_phone, streetAddress: order.street_address, city: order.city, stateOrProvince: order.state_or_province, postalCode: order.postal_code, country: order.country } }; }

  /** Publishes one review after a delivered purchase. */
  export async function createReview(actor: ShoppingActor, productId: string, orderId: string, body: api.IShoppingReview.ICreate): Promise<api.IShoppingReview> {
    if (actor.type !== "customer") throw ErrorUtil.forbidden("Customer authority is required.");
    if (body.rating < 1 || body.rating > 5 || !Number.isInteger(body.rating)) throw ErrorUtil.unprocessable("Rating must be an integer from one through five.");
    const row = await db().$transaction(async (tx) => {
      await requireCustomerAtCommit(actor, tx);
      const productRow = await tx.shopping_products.findFirst({ where: { id: productId, deleted_at: null } });
      const orderRow = await tx.shopping_orders.findFirst({ where: { id: orderId, customer_id: actor.id } });
      if (productRow === null || orderRow === null) throw ErrorUtil.forbidden("The qualifying purchase does not exist.");
      const variants = await tx.shopping_variants.findMany({ where: { product_id: productId }, select: { id: true } });
      const items = await tx.shopping_order_items.findMany({ where: { order_id: orderId, variant_id: { in: variants.map((variant) => variant.id) }, status: "delivered" } });
      if (items.length === 0) throw ErrorUtil.conflict("A delivered qualifying item is required.");
      if (await tx.shopping_reviews.findFirst({ where: { customer_id: actor.id, product_id: productId, order_id: orderId } }) !== null) throw ErrorUtil.conflict("This purchase already has a review.");
      return tx.shopping_reviews.create({ data: { id: id(), customer_id: actor.id, product_id: productId, order_id: orderId, rating: body.rating, text: body.text ?? null, published_at: now(), deleted_at: null } });
    });
    return reviewDto(row, await customerName(actor.id));
  }
  /** Edits one authored live review and retains before/after evidence. */
  export async function updateReview(actor: ShoppingActor, reviewId: string, body: api.IShoppingReview.IUpdate): Promise<api.IShoppingReview> {
    const row = await db().shopping_reviews.findFirst({ where: { id: reviewId, customer_id: actor.id, deleted_at: null } });
    if (row === null) throw ErrorUtil.notFound("The review does not exist.");
    if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) throw ErrorUtil.unprocessable("Rating must be an integer from one through five.");
    const changedAt = now();
    const updated = await db().$transaction(async (tx) => {
      await requireCustomerAtCommit(actor, tx);
      const current = await tx.shopping_reviews.findFirst({ where: { id: reviewId, customer_id: actor.id, deleted_at: null } });
      if (current === null) throw ErrorUtil.notFound("The review does not exist.");
      if (await tx.shopping_products.findFirst({ where: { id: current.product_id, deleted_at: null } }) === null) throw ErrorUtil.conflict("Reviews for a deleted product cannot be edited.");
      const nextText = body.text ?? null;
      const changedFields = [current.rating === body.rating ? null : "rating", current.text === nextText ? null : "text"].filter((field): field is string => field !== null);
      const changed = await tx.shopping_reviews.updateMany({ where: { id: reviewId, customer_id: actor.id, deleted_at: null }, data: { rating: body.rating, text: nextText } });
      if (changed.count !== 1) throw ErrorUtil.conflict("The review is no longer editable.");
      const result = await tx.shopping_reviews.findUnique({ where: { id: reviewId } });
      await tx.shopping_snapshots.create({ data: { id: id(), kind: "review", subject_type: "review", subject_id: reviewId, changed: JSON.stringify(changedFields), before_data: JSON.stringify({ rating: current.rating, text: current.text }), after_data: JSON.stringify({ rating: body.rating, text: nextText }), created_at: changedAt } });
      return result!;
    });
    return reviewDto(updated, await customerName(actor.id));
  }
  /** Retires one authored live review without deleting its evidence. */
  export async function deleteReview(actor: ShoppingActor, reviewId: string): Promise<void> {
    const row = await db().shopping_reviews.findFirst({ where: { id: reviewId, customer_id: actor.id, deleted_at: null } });
    if (row === null) throw ErrorUtil.notFound("The review does not exist.");
    const deletedAt = now();
    await db().$transaction(async (tx) => {
      await requireCustomerAtCommit(actor, tx);
      const current = await tx.shopping_reviews.findFirst({ where: { id: reviewId, customer_id: actor.id, deleted_at: null } });
      if (current === null) throw ErrorUtil.notFound("The review does not exist.");
      if (await tx.shopping_products.findFirst({ where: { id: current.product_id, deleted_at: null } }) === null) throw ErrorUtil.conflict("Reviews for a deleted product cannot be edited.");
      const deleted = await tx.shopping_reviews.updateMany({ where: { id: reviewId, customer_id: actor.id, deleted_at: null }, data: { deleted_at: deletedAt } });
      if (deleted.count !== 1) throw ErrorUtil.conflict("The review is no longer available.");
      await tx.shopping_snapshots.create({ data: { id: id(), kind: "reviewDelete", subject_type: "review", subject_id: reviewId, changed: JSON.stringify(["deleted_at"]), before_data: JSON.stringify({ rating: current.rating, text: current.text, deleted: false }), after_data: JSON.stringify({ rating: current.rating, text: current.text, deleted: true }), created_at: deletedAt } });
    });
  }
  async function customerName(customerId: string): Promise<string> { const profile = await db().shopping_customer_profiles.findUnique({ where: { customer_id: customerId } }); return profile?.display_name ?? "deleted user"; }
  function reviewDto(row: { id: string; customer_id: string | null; rating: number; text: string | null; published_at: Date }, displayName: string): api.IShoppingReview { return { id: row.id, rating: row.rating as 1|2|3|4|5, text: row.text, author: { id: row.customer_id, displayName }, publishedAt: row.published_at.toISOString() }; }

  /** Submits an administrator application for an ordinary actor. */
  export async function applyAdministrator(actor: ShoppingActor, body: api.IShoppingAdministratorApplication.ICreate): Promise<api.IShoppingAdministratorApplication> { const reason = text(body.reason, "reason"); const row = await db().$transaction(async (tx) => { const usable = actor.type === "customer" ? await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } }) : await tx.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } }); if (usable === null) throw ErrorUtil.forbidden("The account is no longer available."); if (await tx.shopping_administrator_grades.findFirst({ where: { actor_type: actor.type, actor_id: actor.id } })) throw ErrorUtil.conflict("An administrator cannot apply again."); if (await tx.shopping_administrator_applications.findFirst({ where: { actor_type: actor.type, actor_id: actor.id, status: "pending" } })) throw ErrorUtil.conflict("An application is already pending."); return tx.shopping_administrator_applications.create({ data: { id: id(), actor_type: actor.type, actor_id: actor.id, reason, status: "pending", pending_key: `${actor.type}:${actor.id}`, decided_by: null, decided_at: null, created_at: now() } }); }); return applicationDto(row); }
  /** Lists the acting identity's administrator applications. */
  export async function applications(actor: ShoppingActor, input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingAdministratorApplication>> { const rows = await db().shopping_administrator_applications.findMany({ where: { actor_type: actor.type, actor_id: actor.id }, orderBy: [{ created_at: "desc" }, { id: "desc" }] }); return page(rows.map(applicationDto), input); }
  /** Lists pending applications for super administrators. */
  export async function pendingApplications(actor: ShoppingActor, input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingAdministratorApplication>> { await requireAdmin(actor, true); const rows = await db().shopping_administrator_applications.findMany({ where: { status: "pending" }, orderBy: [{ created_at: "asc" }, { id: "asc" }] }); return page(rows.map(applicationDto), input); }
  /** Approves one administrator application and grants regular authority. */
  export async function approveApplication(actor: ShoppingActor, applicationId: string): Promise<api.IShoppingAdministratorApplication> { await requireAdmin(actor, true); const row = await db().shopping_administrator_applications.findFirst({ where: { id: applicationId, status: "pending" } }); if (row === null) throw ErrorUtil.notFound("The application is not pending."); const decidedAt = now(); await db().$transaction(async (tx) => { await requireAdminAtCommit(actor, tx, true); const usable = row.actor_type === "customer" ? await tx.shopping_customers.findFirst({ where: { id: row.actor_id, deleted_at: null, login_state: "active" } }) : await tx.shopping_sellers.findFirst({ where: { id: row.actor_id, deleted_at: null, login_state: "active" } }); if (usable === null) throw ErrorUtil.conflict("The applicant identity is unavailable."); const grade = await tx.shopping_administrator_grades.findFirst({ where: { actor_type: row.actor_type, actor_id: row.actor_id, grade: "regularAdministrator" } }); await tx.shopping_administrator_applications.update({ where: { id: applicationId, status: "pending" }, data: { status: "approved", pending_key: null, decided_by: actor.id, decided_at: decidedAt } }); if (grade === null) await tx.shopping_administrator_grades.create({ data: { id: id(), actor_type: row.actor_type, actor_id: row.actor_id, grade: "regularAdministrator", created_at: decidedAt } }); await tx.shopping_admin_actions.create({ data: { id: id(), kind: "administratorApproval", actor_id: actor.id, target_id: row.actor_id, reason: "approved", created_at: decidedAt } }); }); return applicationDto((await db().shopping_administrator_applications.findUnique({ where: { id: applicationId } }))!); }
  /** Rejects one administrator application. */
  export async function rejectApplication(actor: ShoppingActor, applicationId: string): Promise<api.IShoppingAdministratorApplication> { await requireAdmin(actor, true); const row = await db().shopping_administrator_applications.findFirst({ where: { id: applicationId, status: "pending" } }); if (row === null) throw ErrorUtil.notFound("The application is not pending."); const decidedAt = now(); await db().$transaction(async (tx) => { await requireAdminAtCommit(actor, tx, true); await tx.shopping_administrator_applications.update({ where: { id: applicationId, status: "pending" }, data: { status: "rejected", pending_key: null, decided_by: actor.id, decided_at: decidedAt } }); await tx.shopping_admin_actions.create({ data: { id: id(), kind: "administratorApproval", actor_id: actor.id, target_id: row.actor_id, reason: "rejected", created_at: decidedAt } }); }); return applicationDto((await db().shopping_administrator_applications.findUnique({ where: { id: applicationId } }))!); }
  /** Promotes a regular administrator to super administrator. */
  export async function promote(actor: ShoppingActor, targetId: string, targetType: ShoppingActor["type"]): Promise<void> { await requireAdmin(actor, true); const createdAt = now(); await db().$transaction(async (tx) => { await requireAdminAtCommit(actor, tx, true); const regular = await tx.shopping_administrator_grades.findFirst({ where: { actor_type: targetType, actor_id: targetId, grade: "regularAdministrator" } }); const superGrade = await tx.shopping_administrator_grades.findFirst({ where: { actor_type: targetType, actor_id: targetId, grade: "superAdministrator" } }); const usable = targetType === "customer" ? await tx.shopping_customers.findFirst({ where: { id: targetId, deleted_at: null, login_state: "active" } }) : await tx.shopping_sellers.findFirst({ where: { id: targetId, deleted_at: null, login_state: "active" } }); if (regular === null || superGrade !== null) throw ErrorUtil.conflict("The target is not a current regular administrator."); if (usable === null) throw ErrorUtil.conflict("The target identity is unavailable."); await tx.shopping_administrator_grades.create({ data: { id: id(), actor_type: targetType, actor_id: targetId, grade: "superAdministrator", created_at: createdAt } }); await tx.shopping_admin_actions.create({ data: { id: id(), kind: "promotion", actor_id: actor.id, target_id: targetId, reason: targetType, created_at: createdAt } }); }); }
  /** Demotes another super administrator while preserving regular authority. */
  export async function demote(actor: ShoppingActor, targetId: string, targetType: ShoppingActor["type"]): Promise<void> { await requireAdmin(actor, true); if (actor.id === targetId && actor.type === targetType) throw ErrorUtil.forbidden("Self-demotion is not allowed."); const createdAt = now(); await db().$transaction(async (tx) => { await requireAdminAtCommit(actor, tx, true); const grade = await tx.shopping_administrator_grades.findFirst({ where: { actor_type: targetType, actor_id: targetId, grade: "superAdministrator" } }); const usable = targetType === "customer" ? await tx.shopping_customers.findFirst({ where: { id: targetId, deleted_at: null } }) : await tx.shopping_sellers.findFirst({ where: { id: targetId, deleted_at: null } }); if (grade === null || usable === null) throw ErrorUtil.conflict("The target is not a super administrator."); const deleted = await tx.shopping_administrator_grades.deleteMany({ where: { id: grade.id, grade: "superAdministrator" } }); if (deleted.count !== 1) throw ErrorUtil.conflict("The target is no longer a super administrator."); await tx.shopping_admin_actions.create({ data: { id: id(), kind: "demotion", actor_id: actor.id, target_id: targetId, reason: targetType, created_at: createdAt } }); }); }
  async function usableIdentity(type: ShoppingActor["type"], actorId: string, allowBanned = false): Promise<boolean> { if (type === "customer") { const row = await db().shopping_customers.findUnique({ where: { id: actorId } }); return row !== null && row.deleted_at === null && (allowBanned || row.login_state === "active"); } const row = await db().shopping_sellers.findUnique({ where: { id: actorId } }); return row !== null && row.deleted_at === null && (allowBanned || row.login_state === "active"); }
  function applicationDto(row: { id: string; actor_type: string; actor_id: string; reason: string; status: string; created_at: Date; decided_at: Date | null }): api.IShoppingAdministratorApplication { return { id: row.id, actorType: row.actor_type as "customer"|"seller", actorId: row.actor_id, reason: row.reason, status: row.status as "pending"|"approved"|"rejected", createdAt: row.created_at.toISOString(), decidedAt: date(row.decided_at) }; }

  /** Returns seller dashboard counts at one read moment. */
  export async function dashboard(actor: ShoppingActor): Promise<api.IShoppingDashboard> { await requireSeller(actor); const [products, orderItems, pendingCancellations, pendingRefunds] = await db().$transaction([db().shopping_products.count({ where: { seller_id: actor.id, deleted_at: null } }), db().shopping_order_items.count({ where: { seller_id: actor.id } }), db().shopping_cancellation_requests.count({ where: { seller_id: actor.id, status: "pending" } }), db().shopping_refund_requests.count({ where: { seller_id: actor.id, status: "pending" } })]); return { products, orderItems, pendingCancellations, pendingRefunds }; }
  /** Lists seller-attributed historical order items. */
  export async function sellerOrderItems(actor: ShoppingActor, input: api.IPage.IRequest, status?: string): Promise<api.IPage<api.IShoppingOrderItem>> { await requireSeller(actor); if (status !== undefined && !["paid", "shipped", "delivered", "cancelled", "refunded"].includes(status)) throw ErrorUtil.unprocessable("Unsupported order-item status."); const rows = await db().shopping_order_items.findMany({ where: { seller_id: actor.id, ...(status === undefined ? {} : { status }) }, orderBy: [{ purchased_at: "desc" }, { id: "desc" }] }); return page(await Promise.all(rows.map(sellerOrderItemDto)), input); }

  /** Bans one customer and terminates every session. */
  export async function banCustomer(actor: ShoppingActor, targetId: string): Promise<void> { await requireAdmin(actor); await requireTargetModeration(actor, "customer", targetId); const target = await db().shopping_customers.findFirst({ where: { id: targetId, deleted_at: null, login_state: "active" } }); if (target === null) throw ErrorUtil.conflict("The customer is not eligible for banning."); const createdAt = now(); await db().$transaction(async (tx) => { await requireAdminAtCommit(actor, tx); await requireTargetModerationAtCommit(actor, "customer", targetId, tx); const current = await tx.shopping_customers.findFirst({ where: { id: targetId, deleted_at: null, login_state: "active" } }); if (current === null) throw ErrorUtil.conflict("The customer is not eligible for banning."); const changed = await tx.shopping_customers.updateMany({ where: { id: targetId, deleted_at: null, login_state: "active" }, data: { login_state: "banned" } }); if (changed.count !== 1) throw ErrorUtil.conflict("The customer is not eligible for banning."); await tx.shopping_customer_sessions.updateMany({ where: { customer_id: targetId, revoked_at: null }, data: { revoked_at: createdAt } }); await tx.shopping_admin_actions.create({ data: { id: id(), kind: "customerBan", actor_id: actor.id, target_id: targetId, reason: "active to banned", before_state: current.login_state, after_state: "banned", created_at: createdAt } }); }); }
  /** Removes a customer ban. */
  export async function unbanCustomer(actor: ShoppingActor, targetId: string): Promise<void> { await requireAdmin(actor); await requireTargetModeration(actor, "customer", targetId); const target = await db().shopping_customers.findFirst({ where: { id: targetId, login_state: "banned", deleted_at: null } }); if (target === null) throw ErrorUtil.conflict("The customer is not banned."); const createdAt = now(); await db().$transaction(async (tx) => { await requireAdminAtCommit(actor, tx); await requireTargetModerationAtCommit(actor, "customer", targetId, tx); const current = await tx.shopping_customers.findFirst({ where: { id: targetId, login_state: "banned", deleted_at: null } }); if (current === null) throw ErrorUtil.conflict("The customer is not banned."); const changed = await tx.shopping_customers.updateMany({ where: { id: targetId, login_state: "banned", deleted_at: null }, data: { login_state: "active" } }); if (changed.count !== 1) throw ErrorUtil.conflict("The customer is not banned."); await tx.shopping_admin_actions.create({ data: { id: id(), kind: "customerUnban", actor_id: actor.id, target_id: targetId, reason: "banned to active", before_state: current.login_state, after_state: "active", created_at: createdAt } }); }); }
  /** Bans one seller and terminates every session. */
  export async function banSeller(actor: ShoppingActor, targetId: string): Promise<void> { await requireAdmin(actor); await requireTargetModeration(actor, "seller", targetId); const target = await db().shopping_sellers.findFirst({ where: { id: targetId, deleted_at: null, login_state: "active" } }); if (target === null) throw ErrorUtil.conflict("The seller is not eligible for banning."); const createdAt = now(); await db().$transaction(async (tx) => { await requireAdminAtCommit(actor, tx); await requireTargetModerationAtCommit(actor, "seller", targetId, tx); const current = await tx.shopping_sellers.findFirst({ where: { id: targetId, deleted_at: null, login_state: "active" } }); if (current === null) throw ErrorUtil.conflict("The seller is not eligible for banning."); const changed = await tx.shopping_sellers.updateMany({ where: { id: targetId, deleted_at: null, login_state: "active" }, data: { login_state: "banned" } }); if (changed.count !== 1) throw ErrorUtil.conflict("The seller is not eligible for banning."); await tx.shopping_seller_sessions.updateMany({ where: { seller_id: targetId, revoked_at: null }, data: { revoked_at: createdAt } }); await tx.shopping_admin_actions.create({ data: { id: id(), kind: "sellerBan", actor_id: actor.id, target_id: targetId, reason: "active to banned", before_state: current.login_state, after_state: "banned", created_at: createdAt } }); }); }
  /** Removes a seller ban. */
  export async function unbanSeller(actor: ShoppingActor, targetId: string): Promise<void> { await requireAdmin(actor); await requireTargetModeration(actor, "seller", targetId); const target = await db().shopping_sellers.findFirst({ where: { id: targetId, login_state: "banned", deleted_at: null } }); if (target === null) throw ErrorUtil.conflict("The seller is not banned."); const createdAt = now(); await db().$transaction(async (tx) => { await requireAdminAtCommit(actor, tx); await requireTargetModerationAtCommit(actor, "seller", targetId, tx); const current = await tx.shopping_sellers.findFirst({ where: { id: targetId, login_state: "banned", deleted_at: null } }); if (current === null) throw ErrorUtil.conflict("The seller is not banned."); const changed = await tx.shopping_sellers.updateMany({ where: { id: targetId, login_state: "banned", deleted_at: null }, data: { login_state: "active" } }); if (changed.count !== 1) throw ErrorUtil.conflict("The seller is not banned."); await tx.shopping_admin_actions.create({ data: { id: id(), kind: "sellerUnban", actor_id: actor.id, target_id: targetId, reason: "banned to active", before_state: current.login_state, after_state: "active", created_at: createdAt } }); }); }
  /** Deletes a customer working identity while retaining commercial rows. */
  export async function deleteCustomer(actor: ShoppingActor, body: api.IShoppingCustomer.IDelete): Promise<void> { const customer = await db().shopping_customers.findUnique({ where: { id: actor.id } }); const passwordHash = hash(body.password); if (customer === null || customer.login_state !== "active" || customer.password_hash !== passwordHash) throw ErrorUtil.forbidden("The current password is incorrect."); const deletedAt = now(); await db().$transaction(async (tx) => { const current = await tx.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } }); if (current === null || current.password_hash !== passwordHash) throw ErrorUtil.forbidden("The current password is incorrect."); await requireSessionAtCommit(actor, tx); const superGrades = await tx.shopping_administrator_grades.findMany({ where: { grade: "superAdministrator" } }); const activeSuperCount = (await Promise.all(superGrades.map(async (grade) => grade.actor_type === "customer" ? (await tx.shopping_customers.findFirst({ where: { id: grade.actor_id, deleted_at: null, login_state: "active" } })) !== null : (await tx.shopping_sellers.findFirst({ where: { id: grade.actor_id, deleted_at: null, login_state: "active" } })) !== null))).filter(Boolean).length; const isSuper = superGrades.some((grade) => grade.actor_type === "customer" && grade.actor_id === actor.id); if (activeSuperCount <= 1 && isSuper) throw ErrorUtil.conflict("The final super administrator cannot be deleted."); const updated = await tx.shopping_customers.updateMany({ where: { id: actor.id, deleted_at: null, login_state: "active", password_hash: passwordHash }, data: { email: "deleted", email_normalized: `${actor.id}:deleted`, login_state: "deleted", deleted_at: deletedAt, password_hash: "deleted" } }); if (updated.count !== 1) throw ErrorUtil.forbidden("The customer account is no longer available."); await tx.shopping_customer_profiles.deleteMany({ where: { customer_id: actor.id } }); await tx.shopping_shipping_addresses.deleteMany({ where: { customer_id: actor.id } }); await tx.shopping_wishlist_entries.deleteMany({ where: { customer_id: actor.id } }); await tx.shopping_cart_lines.deleteMany({ where: { customer_id: actor.id } }); await tx.shopping_customer_sessions.updateMany({ where: { customer_id: actor.id }, data: { revoked_at: deletedAt } }); await tx.shopping_reviews.updateMany({ where: { customer_id: actor.id, deleted_at: null }, data: { customer_id: null } }); await tx.shopping_administrator_grades.deleteMany({ where: { actor_type: "customer", actor_id: actor.id } }); }); }
  /** Deletes a seller after active order/request blockers clear. */
  export async function deleteSeller(actor: ShoppingActor, body: api.IShoppingSeller.IDelete): Promise<void> {
    const seller = await db().shopping_sellers.findUnique({ where: { id: actor.id } });
    const passwordHash = hash(body.password);
    if (seller === null || seller.login_state !== "active" || seller.password_hash !== passwordHash) throw ErrorUtil.forbidden("The current password is incorrect.");
    const deletedAt = now();
    await db().$transaction(async (tx) => {
      const current = await tx.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_state: "active" } });
      if (current === null || current.password_hash !== passwordHash) throw ErrorUtil.forbidden("The current password is incorrect.");
      await requireSessionAtCommit(actor, tx);
      if (await tx.shopping_order_items.findFirst({ where: { seller_id: actor.id, status: { in: ["paid", "shipped"] } } })) throw ErrorUtil.conflict("Active fulfillment obligations prevent deletion.");
      if (await tx.shopping_cancellation_requests.findFirst({ where: { seller_id: actor.id, status: "pending" } }) || await tx.shopping_refund_requests.findFirst({ where: { seller_id: actor.id, status: "pending" } })) throw ErrorUtil.conflict("Pending requests prevent deletion.");
      const superGrades = await tx.shopping_administrator_grades.findMany({ where: { grade: "superAdministrator" } });
      const activeSuperCount = (await Promise.all(superGrades.map(async (grade) => grade.actor_type === "customer" ? (await tx.shopping_customers.findFirst({ where: { id: grade.actor_id, deleted_at: null, login_state: "active" } })) !== null : (await tx.shopping_sellers.findFirst({ where: { id: grade.actor_id, deleted_at: null, login_state: "active" } })) !== null))).filter(Boolean).length;
      const isSuper = superGrades.some((grade) => grade.actor_type === "seller" && grade.actor_id === actor.id);
      if (activeSuperCount <= 1 && isSuper) throw ErrorUtil.conflict("The final super administrator cannot be deleted.");
      const productsRows = await tx.shopping_products.findMany({ where: { seller_id: actor.id, deleted_at: null }, select: { id: true, name: true, description: true, category_id: true, base_price: true } });
      const productEvidence = await Promise.all(productsRows.map(async (product) => ({ product, before: await productSnapshotData(tx, product.id) })));
      const productIds = productsRows.map((row) => row.id);
      const variantIds = (await tx.shopping_variants.findMany({ where: { product_id: { in: productIds }, deleted_at: null }, select: { id: true } })).map((row) => row.id);
      await tx.shopping_product_images.deleteMany({ where: { product_id: { in: productIds } } });
      await tx.shopping_inventory_movements.deleteMany({ where: { variant_id: { in: variantIds } } });
      await tx.shopping_variants.updateMany({ where: { product_id: { in: productIds }, deleted_at: null }, data: { deleted_at: deletedAt } });
      await tx.shopping_products.updateMany({ where: { seller_id: actor.id, deleted_at: null }, data: { deleted_at: deletedAt, category_id: null } });
      for (const evidence of productEvidence) await tx.shopping_snapshots.create({ data: { id: id(), kind: "productDelete", subject_type: "product", subject_id: evidence.product.id, changed: JSON.stringify(["deletedAt"]), before_data: JSON.stringify(evidence.before), after_data: JSON.stringify({ name: evidence.product.name, description: evidence.product.description, categoryId: null, basePrice: evidence.product.base_price, images: [], variants: [] }), created_at: deletedAt } });
      await tx.shopping_wishlist_entries.deleteMany({ where: { product_id: { in: productIds } } });
      const updated = await tx.shopping_sellers.updateMany({ where: { id: actor.id, deleted_at: null, login_state: "active", password_hash: passwordHash }, data: { email: "deleted", email_normalized: `${actor.id}:deleted`, login_state: "deleted", deleted_at: deletedAt, password_hash: "deleted" } });
      if (updated.count !== 1) throw ErrorUtil.forbidden("The seller account is no longer available.");
      await tx.shopping_seller_profiles.deleteMany({ where: { seller_id: actor.id } });
      await tx.shopping_seller_sessions.updateMany({ where: { seller_id: actor.id }, data: { revoked_at: deletedAt } });
      await tx.shopping_administrator_grades.deleteMany({ where: { actor_type: "seller", actor_id: actor.id } });
    });
  }
  /** Lists administrators' current customers. */
  export async function customerDirectory(actor: ShoppingActor, input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingCustomer>> { await requireAdmin(actor); const rows = await db().shopping_customers.findMany({ where: { deleted_at: null }, orderBy: [{ created_at: "desc" }, { id: "desc" }] }); const values: api.IShoppingCustomer[] = []; for (const row of rows) values.push(await customerDto(row)); return page(values, input); }
  /** Lists administrators' current sellers. */
  export async function sellerDirectory(actor: ShoppingActor, input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingSeller>> { await requireAdmin(actor); const rows = await db().shopping_sellers.findMany({ where: { deleted_at: null }, orderBy: [{ created_at: "desc" }, { id: "desc" }] }); const values: api.IShoppingSeller[] = []; for (const row of rows) values.push(await sellerDto(row)); return page(values, input); }
  async function customerDto(row: { id: string; email: string; login_state: string; created_at: Date }): Promise<api.IShoppingCustomer> { const grades = (await db().shopping_administrator_grades.findMany({ where: { actor_type: "customer", actor_id: row.id } })).map((grade) => grade.grade); const profile = await db().shopping_customer_profiles.findUnique({ where: { customer_id: row.id } }); return { id: row.id, email: row.email, state: row.login_state as "active"|"banned", createdAt: row.created_at.toISOString(), grades, profile: profile === null ? null : { displayName: profile.display_name, phoneNumber: profile.phone_number } }; }
  async function sellerDto(row: { id: string; email: string; approval_state: string; suspended: boolean; login_state: string; created_at: Date }): Promise<api.IShoppingSeller> { const grades = (await db().shopping_administrator_grades.findMany({ where: { actor_type: "seller", actor_id: row.id } })).map((grade) => grade.grade); const profile = await db().shopping_seller_profiles.findUnique({ where: { seller_id: row.id } }); return { id: row.id, email: row.email, approvalState: row.approval_state as api.IShoppingSeller["approvalState"], suspended: row.suspended, state: row.login_state as "active"|"banned", createdAt: row.created_at.toISOString(), grades, profile: profile === null ? null : { shopName: profile.shop_name, shopDescription: profile.shop_description, logo: profile.logo } }; }

  interface IShoppingApproval { id: string; sellerId: string; shopName: string; createdAt: string; }
  function page<T extends object>(values: T[], input: api.IPage.IRequest): api.IPage<T> { const limit = input.limit ?? 100; const current = input.page ?? 1; if (!Number.isInteger(limit) || limit < 0 || !Number.isInteger(current) || current < 1) throw ErrorUtil.unprocessable("Invalid pagination."); const records = values.length; const pages = limit === 0 ? 1 : Math.max(1, Math.ceil(records / limit)); if (current > pages) throw ErrorUtil.unprocessable("The requested page is outside the result set."); const data = limit === 0 ? values : values.slice((current - 1) * limit, current * limit); return { data, pagination: { current, limit, records, pages } }; }
}
