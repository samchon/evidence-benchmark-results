import crypto from "node:crypto";
import type { IShoppingCustomer, IShoppingSeller } from "@benchmark/shopping-api";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Owns credential hashing, session persistence, and issued authorization. */
export namespace ShoppingAuthProvider {
  /** Registers a customer and starts its first session. */
  export async function customerJoin(
    input: IShoppingCustomer.IJoin,
  ): Promise<IShoppingCustomer.IAuthorized> {
    if (await MyGlobal.prisma.shopping_customers.findFirst({ where: { email: input.email.toLowerCase() } }) !== null || await MyGlobal.prisma.shopping_sellers.findFirst({ where: { email: input.email.toLowerCase() } }) !== null)
      throw ErrorUtil.conflict("An identity with this email already exists.");
    const now = new Date();
    const customer = await MyGlobal.prisma.shopping_customers.create({
      data: {
        id: crypto.randomUUID(),
        email: input.email.toLowerCase(),
        password_hash: hash(input.password),
        login_status: "active",
        created_at: now,
        updated_at: now,
        display_name: input.email.split("@")[0] ?? "Customer",
        phone_number: null,
        profile: {
          create: {
            id: crypto.randomUUID(),
            display_name: input.email.split("@")[0] ?? "Customer",
            phone_number: "",
            created_at: now,
            updated_at: now,
          },
        },
        carts: { create: { id: crypto.randomUUID(), created_at: now, updated_at: now } },
      },
    });
    return authorizeCustomer(customer.id);
  }

  /** Registers a seller in pending approval state and starts its first session. */
  export async function sellerJoin(
    input: IShoppingSeller.IJoin,
  ): Promise<IShoppingSeller.IAuthorized> {
    if (await MyGlobal.prisma.shopping_customers.findFirst({ where: { email: input.email.toLowerCase() } }) !== null || await MyGlobal.prisma.shopping_sellers.findFirst({ where: { email: input.email.toLowerCase() } }) !== null)
      throw ErrorUtil.conflict("An identity with this email already exists.");
    const now = new Date();
    const seller = await MyGlobal.prisma.shopping_sellers.create({
      data: {
        id: crypto.randomUUID(),
        email: input.email.toLowerCase(),
        password_hash: hash(input.password),
        approval_status: "pending",
        login_status: "active",
        created_at: now,
        updated_at: now,
        suspended_at: null,
        deleted_at: null,
        shop_name: input.email.split("@")[0] ?? "Shop",
        shop_description: "",
        logo_image: "",
        profile: {
          create: {
            id: crypto.randomUUID(),
            shop_name: input.email.split("@")[0] ?? "Shop",
            shop_description: "",
            logo_image: "",
            created_at: now,
            updated_at: now,
          },
        },
      },
    });
    return authorizeSeller(seller.id);
  }

  /** Authenticates a customer by email and password. */
  export async function customerLogin(
    input: IShoppingCustomer.ILogin,
  ): Promise<IShoppingCustomer.IAuthorized> {
    const customer = await MyGlobal.prisma.shopping_customers.findFirst({
      where: { email: input.email.toLowerCase(), deleted_at: null },
    });
    if (customer === null || customer.login_status !== "active" || !verify(input.password, customer.password_hash))
      throw ErrorUtil.unauthorized("The email or password is incorrect.");
    return authorizeCustomer(customer.id);
  }

  /** Authenticates a seller by email and password. */
  export async function sellerLogin(
    input: IShoppingSeller.ILogin,
  ): Promise<IShoppingSeller.IAuthorized> {
    const seller = await MyGlobal.prisma.shopping_sellers.findFirst({
      where: { email: input.email.toLowerCase(), deleted_at: null },
    });
    if (seller === null || seller.login_status !== "active" || !verify(input.password, seller.password_hash))
      throw ErrorUtil.unauthorized("The email or password is incorrect.");
    return authorizeSeller(seller.id);
  }

  /** Renews only a customer refresh session. */
  export async function customerRefresh(input: IShoppingCustomer.IRefresh): Promise<IShoppingCustomer.IAuthorized> {
    const result = await refresh(input);
    if ("customer" in result) return result;
    throw ErrorUtil.unauthorized("The refresh token is not a customer session.");
  }

  /** Renews only a seller refresh session. */
  export async function sellerRefresh(input: IShoppingSeller.IRefresh): Promise<IShoppingSeller.IAuthorized> {
    const result = await refresh(input);
    if ("seller" in result) return result;
    throw ErrorUtil.unauthorized("The refresh token is not a seller session.");
  }

  /** Revokes the current customer session or every customer session. */
  export async function customerLogout(authorization: string, all: boolean): Promise<IShoppingCustomer.IResult> {
    const payload = decode(authorization.replace(/^Bearer\s+/i, ""));
    if (payload?.type !== "customer") throw ErrorUtil.unauthorized("Authentication is required.");
    if (all) await MyGlobal.prisma.shopping_customer_sessions.updateMany({ where: { customer_id: payload.actorId, revoked_at: null }, data: { revoked_at: new Date() } });
    else await MyGlobal.prisma.shopping_customer_sessions.updateMany({ where: { id: payload.sessionId, revoked_at: null }, data: { revoked_at: new Date() } });
    return { success: true };
  }

  /** Revokes the current seller session or every seller session. */
  export async function sellerLogout(authorization: string, all: boolean): Promise<IShoppingCustomer.IResult> {
    const payload = decode(authorization.replace(/^Bearer\s+/i, ""));
    if (payload?.type !== "seller") throw ErrorUtil.unauthorized("Authentication is required.");
    if (all) await MyGlobal.prisma.shopping_seller_sessions.updateMany({ where: { seller_id: payload.actorId, revoked_at: null }, data: { revoked_at: new Date() } });
    else await MyGlobal.prisma.shopping_seller_sessions.updateMany({ where: { id: payload.sessionId, revoked_at: null }, data: { revoked_at: new Date() } });
    return { success: true };
  }

  /** Changes a customer's password after current-password proof and revokes old sessions. */
  export async function customerPassword(authorization: string, input: IShoppingCustomer.IPasswordUpdate): Promise<IShoppingCustomer.IResult> {
    const id = await sessionId(authorization, "customer");
    const row = await MyGlobal.prisma.shopping_customers.findUniqueOrThrow({ where: { id } });
    if (!verify(input.currentPassword, row.password_hash)) throw ErrorUtil.unauthorized("The current password is incorrect.");
    await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_customers.update({ where: { id }, data: { password_hash: hash(input.newPassword), updated_at: new Date() } }), MyGlobal.prisma.shopping_customer_sessions.updateMany({ where: { customer_id: id, revoked_at: null }, data: { revoked_at: new Date() } })]);
    return { success: true };
  }

  /** Changes a seller password after current-password proof and revokes old sessions. */
  export async function sellerPassword(authorization: string, input: IShoppingSeller.IPasswordUpdate): Promise<IShoppingCustomer.IResult> {
    const id = await sessionId(authorization, "seller");
    const row = await MyGlobal.prisma.shopping_sellers.findUniqueOrThrow({ where: { id } });
    if (!verify(input.currentPassword, row.password_hash)) throw ErrorUtil.unauthorized("The current password is incorrect.");
    await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_sellers.update({ where: { id }, data: { password_hash: hash(input.newPassword), updated_at: new Date() } }), MyGlobal.prisma.shopping_seller_sessions.updateMany({ where: { seller_id: id, revoked_at: null }, data: { revoked_at: new Date() } })]);
    return { success: true };
  }

  /** Irreversibly closes a customer account while retaining commercial history. */
  export async function customerClose(authorization: string, input: IShoppingCustomer.IClose): Promise<IShoppingCustomer.IResult> {
    const id = await sessionId(authorization, "customer");
    const row = await MyGlobal.prisma.shopping_customers.findUniqueOrThrow({ where: { id } });
    if (!verify(input.currentPassword, row.password_hash)) throw ErrorUtil.unauthorized("The current password is incorrect.");
    if (await MyGlobal.prisma.shopping_administrator_grades.count({ where: { actor_type: "customer", actor_id: id, grade: "superAdministrator" } }) > 0 && await MyGlobal.prisma.shopping_administrator_grades.count({ where: { grade: "superAdministrator" } }) <= 1)
      throw ErrorUtil.conflict("The final active super administrator cannot close the account.");
    const now = new Date();
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.shopping_reviews.updateMany({ where: { customer_id: id, deleted_at: null }, data: { anonymized: true } }),
      MyGlobal.prisma.shopping_customer_profiles.deleteMany({ where: { customer_id: id } }),
      MyGlobal.prisma.shopping_customer_addresses.deleteMany({ where: { customer_id: id } }),
      MyGlobal.prisma.shopping_wishlist_entries.deleteMany({ where: { customer_id: id } }),
      MyGlobal.prisma.shopping_cart_lines.deleteMany({ where: { cart: { customer_id: id } } }),
      MyGlobal.prisma.shopping_carts.deleteMany({ where: { customer_id: id } }),
      MyGlobal.prisma.shopping_customers.update({ where: { id }, data: { login_status: "closed", deleted_at: now, password_hash: hash(crypto.randomUUID()), display_name: null, phone_number: null, updated_at: now } }),
      MyGlobal.prisma.shopping_customer_sessions.updateMany({ where: { customer_id: id, revoked_at: null }, data: { revoked_at: now } }),
    ]);
    return { success: true };
  }

  /** Records an out-of-band customer recovery challenge without returning its secret. */
  export async function customerRecover(input: IShoppingCustomer.IRecover): Promise<IShoppingCustomer.IResult> {
    const row = await MyGlobal.prisma.shopping_customers.findFirst({ where: { email: input.email.toLowerCase(), deleted_at: null } });
    if (row === null) return { success: true };
    const secret = crypto.randomBytes(32).toString("base64url");
    const now = new Date();
    await MyGlobal.prisma.shopping_delivery_challenges.create({ data: { id: crypto.randomUUID(), actor_type: "customer", actor_id: row.id, recipient: row.email, kind: "customer-recovery", payload: hash(secret), created_at: now, expired_at: new Date(now.getTime() + 15 * 60 * 1000), consumed_at: null } });
    return { success: true };
  }

  /** Consumes a delivered customer recovery challenge and revokes prior sessions. */
  export async function customerRecoverComplete(input: IShoppingCustomer.IRecoverComplete): Promise<IShoppingCustomer.IResult> {
    const challenge = await MyGlobal.prisma.shopping_delivery_challenges.findFirst({ where: { actor_type: "customer", kind: "customer-recovery", consumed_at: null, expired_at: { gt: new Date() }, payload: hash(input.challenge) }, orderBy: { created_at: "desc" } });
    if (challenge === null) throw ErrorUtil.unauthorized("The recovery challenge is invalid or expired.");
    const now = new Date();
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.shopping_customers.update({ where: { id: challenge.actor_id }, data: { password_hash: hash(input.newPassword), login_status: "active", updated_at: now } }),
      MyGlobal.prisma.shopping_customer_sessions.updateMany({ where: { customer_id: challenge.actor_id, revoked_at: null }, data: { revoked_at: now } }),
      MyGlobal.prisma.shopping_delivery_challenges.update({ where: { id: challenge.id }, data: { consumed_at: now } }),
    ]);
    return { success: true };
  }

  /** Records an out-of-band seller recovery challenge without returning its secret. */
  export async function sellerRecover(input: IShoppingSeller.IRecover): Promise<IShoppingCustomer.IResult> {
    const row = await MyGlobal.prisma.shopping_sellers.findFirst({ where: { email: input.email.toLowerCase(), deleted_at: null } });
    if (row === null) return { success: true };
    const secret = crypto.randomBytes(32).toString("base64url");
    const now = new Date();
    await MyGlobal.prisma.shopping_delivery_challenges.create({ data: { id: crypto.randomUUID(), actor_type: "seller", actor_id: row.id, recipient: row.email, kind: "seller-recovery", payload: hash(secret), created_at: now, expired_at: new Date(now.getTime() + 15 * 60 * 1000), consumed_at: null } });
    return { success: true };
  }

  /** Consumes a delivered seller recovery challenge and revokes prior sessions. */
  export async function sellerRecoverComplete(input: IShoppingSeller.IRecoverComplete): Promise<IShoppingCustomer.IResult> {
    const challenge = await MyGlobal.prisma.shopping_delivery_challenges.findFirst({ where: { actor_type: "seller", kind: "seller-recovery", consumed_at: null, expired_at: { gt: new Date() }, payload: hash(input.challenge) }, orderBy: { created_at: "desc" } });
    if (challenge === null) throw ErrorUtil.unauthorized("The recovery challenge is invalid or expired.");
    const now = new Date();
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.shopping_sellers.update({ where: { id: challenge.actor_id }, data: { password_hash: hash(input.newPassword), login_status: "active", updated_at: now } }),
      MyGlobal.prisma.shopping_seller_sessions.updateMany({ where: { seller_id: challenge.actor_id, revoked_at: null }, data: { revoked_at: now } }),
      MyGlobal.prisma.shopping_delivery_challenges.update({ where: { id: challenge.id }, data: { consumed_at: now } }),
    ]);
    return { success: true };
  }

  /** Closes a seller after all commercial blockers and governance safeguards pass. */
  export async function sellerClose(authorization: string, input: IShoppingSeller.IClose): Promise<IShoppingCustomer.IResult> {
    const id = await sessionId(authorization, "seller");
    const seller = await MyGlobal.prisma.shopping_sellers.findUniqueOrThrow({ where: { id } });
    if (!verify(input.currentPassword, seller.password_hash)) throw ErrorUtil.unauthorized("The current password is incorrect.");
    if (await MyGlobal.prisma.shopping_order_items.findFirst({ where: { seller_id: id, status: { in: ["paid", "shipped"] } } }) !== null) throw ErrorUtil.conflict("The seller has unresolved fulfillment obligations.");
    if (await MyGlobal.prisma.shopping_cancellation_requests.findFirst({ where: { seller_id: id, status: "pending" } }) !== null || await MyGlobal.prisma.shopping_refund_requests.findFirst({ where: { seller_id: id, status: "pending" } }) !== null) throw ErrorUtil.conflict("The seller has unresolved after-sales requests.");
    if (await MyGlobal.prisma.shopping_administrator_grades.count({ where: { actor_type: "seller", actor_id: id, grade: "superAdministrator" } }) > 0 && await MyGlobal.prisma.shopping_administrator_grades.count({ where: { grade: "superAdministrator" } }) <= 1) throw ErrorUtil.conflict("The final active super administrator cannot close the account.");
    const now = new Date();
    const products = await MyGlobal.prisma.shopping_products.findMany({ where: { seller_id: id, deleted_at: null }, select: { id: true } });
    const variants = await MyGlobal.prisma.shopping_product_variants.findMany({ where: { product_id: { in: products.map((product) => product.id) }, deleted_at: null }, select: { id: true } });
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.shopping_wishlist_entries.deleteMany({ where: { product_id: { in: products.map((product) => product.id) } } }),
      MyGlobal.prisma.shopping_inventory_movements.deleteMany({ where: { variant_id: { in: variants.map((variant) => variant.id) } } }),
      MyGlobal.prisma.shopping_product_variants.updateMany({ where: { id: { in: variants.map((variant) => variant.id) } }, data: { deleted_at: now, updated_at: now } }),
      MyGlobal.prisma.shopping_product_images.deleteMany({ where: { product_id: { in: products.map((product) => product.id) } } }),
      MyGlobal.prisma.shopping_products.updateMany({ where: { id: { in: products.map((product) => product.id) } }, data: { deleted_at: now, updated_at: now } }),
      MyGlobal.prisma.shopping_seller_profiles.deleteMany({ where: { seller_id: id } }),
      MyGlobal.prisma.shopping_sellers.update({ where: { id }, data: { login_status: "closed", deleted_at: now, shop_name: null, shop_description: null, logo_image: null, password_hash: hash(crypto.randomUUID()), updated_at: now } }),
      MyGlobal.prisma.shopping_seller_sessions.updateMany({ where: { seller_id: id, revoked_at: null }, data: { revoked_at: now } }),
    ]);
    return { success: true };
  }

  /** Renews the identity represented by a refresh token. */
  export async function refresh(
    input: IShoppingCustomer.IRefresh,
  ): Promise<IShoppingCustomer.IAuthorized | IShoppingSeller.IAuthorized> {
    const payload = decode(input.refreshToken);
    if (payload === null) throw ErrorUtil.unauthorized("The refresh token is invalid.");
    if (payload.type === "customer") {
      const session = await MyGlobal.prisma.shopping_customer_sessions.findFirst({ where: { id: payload.sessionId, revoked_at: null } });
      if (session === null || session.expired_at <= new Date() || session.refresh_token_hash !== hash(input.refreshToken)) throw ErrorUtil.unauthorized("The refresh session is no longer valid.");
      return authorizeCustomer(session.customer_id);
    }
    const session = await MyGlobal.prisma.shopping_seller_sessions.findFirst({ where: { id: payload.sessionId, revoked_at: null } });
    if (session === null || session.expired_at <= new Date() || session.refresh_token_hash !== hash(input.refreshToken)) throw ErrorUtil.unauthorized("The refresh session is no longer valid.");
    return authorizeSeller(session.seller_id);
  }

  /** Creates a new customer access and refresh pair. */
  async function authorizeCustomer(id: string): Promise<IShoppingCustomer.IAuthorized> {
    const customer = await MyGlobal.prisma.shopping_customers.findFirst({ where: { id, deleted_at: null, login_status: "active" } });
    if (customer === null) throw ErrorUtil.unauthorized("The customer session is no longer valid.");
    const sessionId = crypto.randomUUID();
    const refreshToken = token({ type: "customer", actorId: id, sessionId });
    const now = new Date();
    await MyGlobal.prisma.shopping_customer_sessions.create({
      data: { id: sessionId, customer_id: id, refresh_token_hash: hash(refreshToken), created_at: now, expired_at: new Date(now.getTime() + Number(MyGlobal.env.JWT_REFRESH_TTL_SECONDS) * 1000) },
    });
    return { customer: customerDto(customer), accessToken: token({ type: "customer", actorId: id, sessionId }), refreshToken };
  }

  /** Creates a new seller access and refresh pair. */
  async function authorizeSeller(id: string): Promise<IShoppingSeller.IAuthorized> {
    const seller = await MyGlobal.prisma.shopping_sellers.findFirst({ where: { id, deleted_at: null, login_status: "active" } });
    if (seller === null) throw ErrorUtil.unauthorized("The seller session is no longer valid.");
    const sessionId = crypto.randomUUID();
    const refreshToken = token({ type: "seller", actorId: id, sessionId });
    const now = new Date();
    await MyGlobal.prisma.shopping_seller_sessions.create({
      data: { id: sessionId, seller_id: id, refresh_token_hash: hash(refreshToken), created_at: now, expired_at: new Date(now.getTime() + Number(MyGlobal.env.JWT_REFRESH_TTL_SECONDS) * 1000) },
    });
    return { seller: sellerDto(seller), accessToken: token({ type: "seller", actorId: id, sessionId }), refreshToken };
  }

  function customerDto(input: { id: string; email: string; login_status: string; display_name: string | null; phone_number: string | null; created_at: Date }): IShoppingCustomer {
    return { id: input.id, email: input.email, loginStatus: input.login_status, displayName: input.display_name, phoneNumber: input.phone_number, createdAt: input.created_at.toISOString(), grades: [] };
  }
  function sellerDto(input: { id: string; email: string; approval_status: string; login_status: string; suspended_at: Date | null; shop_name: string | null; shop_description: string | null; logo_image: string | null; created_at: Date }): IShoppingSeller {
    return { id: input.id, email: input.email, approvalStatus: input.approval_status, loginStatus: input.login_status, suspended: input.suspended_at !== null, shopName: input.shop_name, shopDescription: input.shop_description, logoImage: input.logo_image, createdAt: input.created_at.toISOString(), grades: [] };
  }
  function hash(value: string): string { return crypto.createHash("sha256").update(value).digest("hex"); }
  function verify(value: string, expected: string): boolean { return crypto.timingSafeEqual(Buffer.from(hash(value)), Buffer.from(expected)); }
  function token(input: { type: "customer" | "seller"; actorId: string; sessionId: string }): string {
    const body = Buffer.from(JSON.stringify(input)).toString("base64url");
    const signature = crypto.createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url");
    return `${body}.${signature}`;
  }
  function decode(value: string): { type: "customer" | "seller"; actorId: string; sessionId: string } | null {
    const [body, signature] = value.split(".");
    if (body === undefined || signature === undefined) return null;
    const expected = crypto.createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url");
    if (signature !== expected) return null;
    try { return JSON.parse(Buffer.from(body, "base64url").toString()) as { type: "customer" | "seller"; actorId: string; sessionId: string }; } catch { return null; }
  }

  async function sessionId(authorization: string, type: "customer" | "seller"): Promise<string> {
    const payload = decode(authorization.replace(/^Bearer\s+/i, ""));
    if (payload?.type !== type) throw ErrorUtil.unauthorized("Authentication is required.");
    if (type === "customer") {
      const row = await MyGlobal.prisma.shopping_customer_sessions.findFirst({ where: { id: payload.sessionId, customer_id: payload.actorId, revoked_at: null, expired_at: { gt: new Date() } } });
      if (row === null) throw ErrorUtil.unauthorized("The session is no longer valid.");
    } else {
      const row = await MyGlobal.prisma.shopping_seller_sessions.findFirst({ where: { id: payload.sessionId, seller_id: payload.actorId, revoked_at: null, expired_at: { gt: new Date() } } });
      if (row === null) throw ErrorUtil.unauthorized("The session is no longer valid.");
    }
    return payload.actorId;
  }
}
