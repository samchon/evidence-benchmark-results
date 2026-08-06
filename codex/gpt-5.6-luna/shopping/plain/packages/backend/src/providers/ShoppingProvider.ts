import type {
  IEntity,
  IPage,
  IShoppingAddress,
  IShoppingAdmin,
  IShoppingAdminApplication,
  IShoppingAuth,
  IShoppingCart,
  IShoppingCheckout,
  IShoppingCategory,
  IShoppingCustomerProfile,
  IShoppingInventory,
  IShoppingOrder,
  IShoppingProduct,
  IShoppingRequest,
  IShoppingReview,
  IShoppingSellerApproval,
  IShoppingSellerProfile,
  IShoppingShipment,
  IShoppingWishlist,
  IShoppingHeaders,
} from "@benchmark/shopping-api";
import { randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { ErrorUtil } from "../utils/ErrorUtil";
import { MyGlobal } from "../MyGlobal";
import type { Prisma } from "@prisma/sdk";

type User = { id: string; kind: string; email: string; password_hash: string; display_name: string | null; phone: string | null; shop_name: string | null; shop_description: string | null; shop_logo: string | null; approval_status: string | null; rejection_reason: string | null; suspended: boolean; banned: boolean; deleted_at: Date | null; grades: string; created_at: Date; updated_at: Date; };
type ProductListRow = Prisma.shopping_productsGetPayload<{ include: { seller: true; images: true; variants: { include: { movements: true } }; reviews: true } }>;
type ProductDetailRow = Prisma.shopping_productsGetPayload<{ include: { seller: true; category: true; images: true; variants: { include: { movements: true } }; reviews: { include: { user: true } } } }>;
type CartLineRow = Prisma.shopping_cart_linesGetPayload<{ include: { variant: { include: { product: { include: { seller: true } }; movements: true } } } }>;
type OrderItemRow = {
  id: string; product_id: string; product_name: string; product_description: string; variant_sku: string; variant_options_json: string;
  shopping_seller_id: string; seller_shop_name: string; unit_price: number; quantity: number; status: string; refunded_amount: number | null;
  purchased_at: Date; delivered_at: Date | null;
  order?: { id: string; order_number: string; recipient_name: string; phone: string; street_address: string; city: string; state: string; postal_code: string; country: string };
};
type OrderDetailRow = Prisma.shopping_ordersGetPayload<{ include: { items: { include: { requests: { include: { snapshots: true } } } }; shipments: { include: { items: true } } } }>;
export interface AuthPayload {
  id: string;
  session_id: string;
  type: IShoppingAuth.Actor;
}
export type HeaderInput = IShoppingHeaders;

const now = (): Date => new Date();
const uuid = (): string => randomUUID();
const hash = (value: string): string => scryptSync(value, "benchmark-shopping", 32).toString(
  "hex",
);
const verify = (value: string, stored: string): boolean => {
  const actual = Buffer.from(hash(value), "hex");
  const expected = Buffer.from(stored, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
};
const page = <T extends object>(data: T[], total: number, input?: IPage.IRequest): IPage<T> => {
  const limit = input?.limit ?? 100;
  const current = input?.page ?? 1;
  return {
    data,
    pagination: {
      current,
      limit,
      records: total,
      pages: limit === 0 ? 1 : Math.ceil(total / limit),
    },
  };
};
const paginationContexts = new Map<string, string>();
const bindPaginationContext = (ownerId: string, scope: string, input: IPage.IRequest, context: object): void => {
  const current = input.page ?? 1;
  const key = `${ownerId}:${scope}`;
  const fingerprint = JSON.stringify(context);
  if (current === 1) {
    paginationContexts.set(key, fingerprint);
    return;
  }
  if (paginationContexts.get(key) !== fingerprint)
    throw ErrorUtil.conflict("This page position belongs to a different query context; restart at page one.");
};
const parseGrades = (value: string): string[] => value
  ? value.split(",").filter(Boolean)
  : [];
const requireHeader = (headers: HeaderInput): string => {
  const token = headers.authorization?.replace(/^Bearer\s+/i, "").trim();
  if (!token) throw ErrorUtil.unauthorized("Authentication is required.");
  return token;
};

export namespace ShoppingProvider {
  export async function authenticate(headers: HeaderInput, kind: IShoppingAuth.Actor): Promise<AuthPayload> {
    const token = requireHeader(headers);
    const session = await MyGlobal.prisma.shopping_sessions.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!session || session.revoked || session.expires_at <= now() || session.user.kind !== kind || session.user.deleted_at || session.user.banned)
      throw ErrorUtil.unauthorized("The session is invalid or unavailable.");
    return { id: session.user.id, session_id: session.id, type: kind };
  }
  export async function authenticateAny(headers: HeaderInput): Promise<AuthPayload> {
    const token = requireHeader(headers);
    const session = await MyGlobal.prisma.shopping_sessions.findUnique({ where: { token }, include: { user: true } });
    if (!session || session.revoked || session.expires_at <= now() || session.user.deleted_at || session.user.banned)
      throw ErrorUtil.unauthorized("The session is invalid or unavailable.");
    return { id: session.user.id, session_id: session.id, type: session.user.kind as IShoppingAuth.Actor };
  }
  export async function join(kind: IShoppingAuth.Actor, body: IShoppingAuth.IJoin): Promise<IShoppingAuth.IAuthorized> {
    const email = body.email.trim().toLowerCase();
    if (await MyGlobal.prisma.shopping_users.findUnique({
      where: { kind_email: { kind, email } },
    }))
      throw ErrorUtil.conflict("That email is already registered.");
    const user = await MyGlobal.prisma.shopping_users.create({
      data: {
        id: uuid(),
        kind,
        email,
        password_hash: hash(body.password),
        approval_status: kind === "seller" ? "pending" : null,
        // Registration never grants governance.  A controlled provisioning
        // process assigns the initial super administrator separately.
        grades: "",
        created_at: now(),
        updated_at: now(),
      },
    });
    if (kind === "seller") await MyGlobal.prisma.shopping_seller_approvals.create(
      {
        data: {
          id: uuid(),
          shopping_seller_id: user.id,
          status: "pending",
          created_at: now(),
        },
      },
    );
    return issue(user, kind);
  }
  export async function login(kind: IShoppingAuth.Actor, body: IShoppingAuth.ILogin): Promise<IShoppingAuth.IAuthorized> {
    const user = await MyGlobal.prisma.shopping_users.findUnique({
      where: { kind_email: { kind, email: body.email.trim().toLowerCase() } },
    });
    if (!user || user.deleted_at || user.banned || !verify(
      body.password,
      user.password_hash,
    )) throw ErrorUtil.unauthorized("Invalid credentials.");
    return issue(user, kind);
  }
  export async function refresh(kind: IShoppingAuth.Actor, body: IShoppingAuth.IRefresh): Promise<IShoppingAuth.IAuthorized> {
    const session = await MyGlobal.prisma.shopping_sessions.findUnique({
      where: { refresh_token: body.refreshToken },
      include: { user: true },
    });
    if (!session || session.revoked || session.expires_at <= now() || session.user.kind !== kind || session.user.deleted_at || session.user.banned) throw ErrorUtil.unauthorized(
      "The refresh session is invalid.",
    );
    const claimed = await MyGlobal.prisma.shopping_sessions.updateMany({
      where: { id: session.id, revoked: false },
      data: { revoked: true },
    });
    if (claimed.count !== 1) throw ErrorUtil.unauthorized("The refresh session is invalid.");
    return issue(session.user, kind);
  }
  export async function recoveryRequest(kind: IShoppingAuth.Actor, body: IShoppingAuth.IRecoveryRequest): Promise<IShoppingAuth.IRecoveryChallenge> {
    const user = await MyGlobal.prisma.shopping_users.findUnique({ where: { kind_email: { kind, email: body.email.trim().toLowerCase() } } });
    if (!user || user.deleted_at || user.banned) throw ErrorUtil.unauthorized("Recovery is unavailable for these credentials.");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const token = uuid();
    await MyGlobal.prisma.shopping_recovery_tokens.create({ data: { id: uuid(), shopping_user_id: user.id, token, expires_at: expiresAt, created_at: now() } });
    return { token, expiresAt: expiresAt.toISOString() };
  }
  export async function recoveryComplete(kind: IShoppingAuth.Actor, body: IShoppingAuth.IRecoveryComplete): Promise<IEntity> {
    const challenge = await MyGlobal.prisma.shopping_recovery_tokens.findUnique({ where: { token: body.token }, include: { user: true } });
    if (!challenge || challenge.used || challenge.expires_at <= now() || challenge.user.kind !== kind || challenge.user.deleted_at || challenge.user.banned) throw ErrorUtil.unauthorized("The recovery challenge is invalid or expired.");
    await MyGlobal.prisma.$transaction(async (tx) => {
      const claimed = await tx.shopping_recovery_tokens.updateMany({
        where: { id: challenge.id, used: false, expires_at: { gt: now() } },
        data: { used: true },
      });
      if (claimed.count !== 1) throw ErrorUtil.unauthorized("The recovery challenge is invalid or expired.");
      const current = await tx.shopping_users.findUnique({ where: { id: challenge.user.id } });
      if (!current || current.kind !== kind || current.deleted_at || current.banned) throw ErrorUtil.unauthorized("The recovery identity is unavailable.");
      await tx.shopping_users.update({ where: { id: current.id }, data: { password_hash: hash(body.newPassword), updated_at: now() } });
      await tx.shopping_sessions.updateMany({ where: { shopping_user_id: current.id }, data: { revoked: true } });
    });
    return { id: challenge.user.id };
  }
  export async function logout(payload: AuthPayload): Promise<IEntity> {
    await MyGlobal.prisma.shopping_sessions.updateMany({
      where: { id: payload.session_id },
      data: { revoked: true },
    });
    return { id: payload.id };
  }
  export async function logoutAll(payload: AuthPayload): Promise<IEntity> {
    await MyGlobal.prisma.shopping_sessions.updateMany({
      where: { shopping_user_id: payload.id },
      data: { revoked: true },
    });
    return { id: payload.id };
  }
  export async function changePassword(payload: AuthPayload, body: IShoppingAuth.IPasswordChange): Promise<IEntity> {
    const user = await userById(payload.id, payload.type);
    if (!verify(body.currentPassword, user.password_hash))
      throw ErrorUtil.unauthorized("The current password is incorrect.");
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.shopping_users.update({
        where: { id: user.id },
        data: { password_hash: hash(body.newPassword), updated_at: now() },
      }),
      MyGlobal.prisma.shopping_sessions.updateMany({
        where: { shopping_user_id: user.id, id: { not: payload.session_id } },
        data: { revoked: true },
      }),
    ]);
    return { id: user.id };
  }
  export async function deleteAccount(payload: AuthPayload, body: IShoppingAuth.IAccountDelete): Promise<IEntity> {
    const user = await userById(payload.id, payload.type);
    if (!verify(body.password, user.password_hash))
      throw ErrorUtil.unauthorized("The current password is incorrect.");
    const grades = parseGrades(user.grades);
    if (grades.includes("superAdministrator")) {
      const remaining = await MyGlobal.prisma.shopping_users.count({
        where: {
          id: { not: user.id },
          deleted_at: null,
          banned: false,
          grades: { contains: "superAdministrator" },
        },
      });
      if (remaining === 0) throw ErrorUtil.conflict("The final super administrator cannot be deleted.");
    }
    if (user.kind === "seller") {
      const [activeItems, pendingRequests] = await Promise.all([
        MyGlobal.prisma.shopping_order_items.count({
          where: { shopping_seller_id: user.id, status: { in: ["paid", "shipped"] } },
        }),
        MyGlobal.prisma.shopping_requests.count({
          where: { status: "pending", item: { shopping_seller_id: user.id } },
        }),
      ]);
      if (activeItems || pendingRequests)
        throw ErrorUtil.conflict("Commercial obligations must be resolved before seller closure.");
    }
    const retiredEmail = `deleted-${user.id}@deleted.invalid`;
    await MyGlobal.prisma.$transaction(async (tx) => {
      const current = await tx.shopping_users.findUnique({ where: { id: user.id } });
      if (!current || current.deleted_at || current.banned) throw ErrorUtil.conflict("The identity is unavailable.");
      if (!verify(body.password, current.password_hash))
        throw ErrorUtil.unauthorized("The current password is incorrect.");
      const gradesNow = parseGrades(current.grades);
      if (gradesNow.includes("superAdministrator")) {
        const remaining = await tx.shopping_users.count({ where: { id: { not: current.id }, deleted_at: null, banned: false, grades: { contains: "superAdministrator" } } });
        if (remaining === 0) throw ErrorUtil.conflict("The final super administrator cannot be deleted.");
      }
      if (current.kind === "seller") {
        const [active, pending] = await Promise.all([
          tx.shopping_order_items.count({ where: { shopping_seller_id: current.id, status: { in: ["paid", "shipped"] } } }),
          tx.shopping_requests.count({ where: { status: "pending", item: { shopping_seller_id: current.id } } }),
        ]);
        if (active || pending) throw ErrorUtil.conflict("Commercial obligations must be resolved before seller closure.");
      }
      await tx.shopping_sessions.updateMany({ where: { shopping_user_id: user.id }, data: { revoked: true } });
      if (current.kind === "customer") {
        await tx.shopping_addresses.deleteMany({ where: { shopping_user_id: user.id } });
        await tx.shopping_cart_lines.deleteMany({ where: { shopping_user_id: user.id } });
        await tx.shopping_wishlists.deleteMany({ where: { shopping_user_id: user.id } });
      } else {
        await tx.shopping_seller_profile_snapshots.create({ data: { id: uuid(), shopping_seller_id: user.id, before_json: JSON.stringify({ shopName: current.shop_name ?? "", shopDescription: current.shop_description ?? "", shopLogo: current.shop_logo }), after_json: JSON.stringify({ deleted: true }), changed_fields: "deleted", created_at: now() } });
        const sellerProducts = await tx.shopping_products.findMany({ where: { shopping_seller_id: user.id, deleted_at: null }, include: { images: true, variants: { where: { deleted_at: null } } } });
        for (const product of sellerProducts) {
          const variantIds = product.variants.map((v) => v.id);
          if (variantIds.length) await tx.shopping_inventory_movements.deleteMany({ where: { shopping_variant_id: { in: variantIds } } });
          await tx.shopping_product_images.deleteMany({ where: { shopping_product_id: product.id } });
          await tx.shopping_variants.updateMany({ where: { shopping_product_id: product.id, deleted_at: null }, data: { deleted_at: now(), updated_at: now() } });
          await tx.shopping_products.update({ where: { id: product.id }, data: { deleted_at: now(), updated_at: now() } });
          await tx.shopping_product_snapshots.create({ data: { id: uuid(), shopping_product_id: product.id, before_json: JSON.stringify(product), after_json: JSON.stringify({ deleted: true }), changed_fields: "seller_deleted", created_at: now() } });
        }
        await tx.shopping_wishlists.deleteMany({ where: { product: { shopping_seller_id: user.id } } });
      }
      await tx.shopping_users.update({
        where: { id: user.id },
        data: {
          email: retiredEmail,
          password_hash: hash(uuid()),
          display_name: null,
          phone: null,
          shop_name: null,
          shop_description: null,
          shop_logo: null,
          grades: "",
          deleted_at: now(),
          updated_at: now(),
        },
      });
    });
    return { id: user.id };
  }
  async function issue(user: User, kind: IShoppingAuth.Actor): Promise<IShoppingAuth.IAuthorized> {
    const access = uuid();
    const refreshToken = uuid();
    await MyGlobal.prisma.shopping_sessions.create({
      data: {
        id: uuid(),
        shopping_user_id: user.id,
        token: access,
        refresh_token: refreshToken,
        created_at: now(),
        expires_at: new Date(
          Date.now() + Number(MyGlobal.env.JWT_REFRESH_TTL_SECONDS) * 1000,
        ),
      },
    });
    return { id: user.id, type: kind, token: access, refreshToken };
  }

  export async function customerProfile(payload: AuthPayload): Promise<IShoppingCustomerProfile.IDetail> {
    const user = await userById(payload.id, "customer");
    return {
      id: user.id,
      displayName: user.display_name ?? "",
      phone: user.phone ?? "",
    };
  }
  export async function updateCustomerProfile(payload: AuthPayload, body: IShoppingCustomerProfile.IUpdate): Promise<IShoppingCustomerProfile.IDetail> {
    const user = await userById(payload.id, "customer");
    const result = await MyGlobal.prisma.shopping_users.update({
      where: { id: user.id },
      data: {
        display_name: body.displayName,
        phone: body.phone,
        updated_at: now(),
      },
    });
    return {
      id: result.id,
      displayName: result.display_name ?? "",
      phone: result.phone ?? "",
    };
  }
  export async function addresses(payload: AuthPayload, input: IPage.IRequest = {}): Promise<IPage<IShoppingAddress.IDetail>> {
    await userById(payload.id, "customer");
    const [total, rows] = await Promise.all([
      MyGlobal.prisma.shopping_addresses.count({
        where: { shopping_user_id: payload.id },
      }),
      MyGlobal.prisma.shopping_addresses.findMany({
        where: { shopping_user_id: payload.id },
        orderBy: [{ created_at: "asc" }, { id: "asc" }],
        skip: ((input.page ?? 1) - 1) * (input.limit ?? 100),
        take: input.limit === 0 ? undefined : (input.limit ?? 100),
      }),
    ]);
    return page(rows.map(address), total, input);
  }
  export async function addressCreate(payload: AuthPayload, body: IShoppingAddress.ICreate): Promise<IShoppingAddress.IDetail> {
    await userById(payload.id, "customer");
    const data = completeAddress(body);
    const row = await MyGlobal.prisma.shopping_addresses.create({
      data: {
        id: uuid(),
        shopping_user_id: payload.id,
        ...data,
        created_at: now(),
        updated_at: now(),
      },
    });
    return address(row);
  }
  export async function addressUpdate(payload: AuthPayload, id: string, body: IShoppingAddress.IUpdate): Promise<IShoppingAddress.IDetail> {
    await userById(payload.id, "customer");
    const row = await ownedAddress(payload.id, id);
    const data = completeAddress(body);
    return address(
      await MyGlobal.prisma.shopping_addresses.update({ where: { id: row.id }, data: { ...data, updated_at: now() } }),
    );
  }
  export async function addressDelete(payload: AuthPayload, id: string): Promise<IEntity> {
    await userById(payload.id, "customer");
    await ownedAddress(payload.id, id);
    await MyGlobal.prisma.shopping_addresses.delete({ where: { id } });
    return { id };
  }
  export async function addressDefault(payload: AuthPayload, id: string): Promise<IShoppingAddress.IDetail> {
    await userById(payload.id, "customer");
    const row = await ownedAddress(payload.id, id);
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.shopping_addresses.updateMany({
        where: { shopping_user_id: payload.id },
        data: { is_default: false },
      }),
      MyGlobal.prisma.shopping_addresses.update({
        where: { id: row.id },
        data: { is_default: true },
      }),
    ]);
    return address({ ...row, is_default: true });
  }

  export async function sellerProfile(payload: AuthPayload): Promise<IShoppingSellerProfile.IDetail> {
    const u = await userById(payload.id, "seller");
    return seller(u);
  }
  export async function updateSellerProfile(payload: AuthPayload, body: IShoppingSellerProfile.IUpdate): Promise<IShoppingSellerProfile.IDetail> {
    const u = await userById(payload.id, "seller");
    if (!body.shopName.trim() || !body.shopDescription.trim()) throw ErrorUtil.unprocessable("Seller profile fields cannot be blank.");
    const before = { shopName: u.shop_name ?? "", shopDescription: u.shop_description ?? "", shopLogo: u.shop_logo };
    const after = { shopName: body.shopName.trim(), shopDescription: body.shopDescription.trim(), shopLogo: body.shopLogo?.trim() || null };
    const changedFields = (Object.keys(before) as (keyof typeof before)[])
      .filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]))
      .map((key) => key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`))
      .join(",");
    if (!changedFields) return seller(u);
    const r = await MyGlobal.prisma.$transaction(async (tx) => {
      const updated = await tx.shopping_users.update({ where: { id: u.id }, data: { shop_name: after.shopName, shop_description: after.shopDescription, shop_logo: after.shopLogo, updated_at: now() } });
      await tx.shopping_seller_profile_snapshots.create({ data: { id: uuid(), shopping_seller_id: u.id, before_json: JSON.stringify(before), after_json: JSON.stringify(after), changed_fields: changedFields, created_at: now() } });
      return updated;
    });
    return seller(r);
  }
  export async function sellerProfileSnapshots(payload: AuthPayload, input: IPage.IRequest, sellerId?: string): Promise<IPage<IShoppingSellerProfile.ISnapshot>> {
    const actor = await userById(payload.id);
    const targetId = sellerId ?? actor.id;
    if (sellerId) await requireAdminInternal(payload);
    else if (actor.kind !== "seller") throw ErrorUtil.forbidden("Only the owning seller may inspect these snapshots.");
    const target = await MyGlobal.prisma.shopping_users.findUnique({ where: { id: targetId } });
    if (!target || target.kind !== "seller") throw ErrorUtil.notFound("No such seller.");
    const [total, rows] = await Promise.all([
      MyGlobal.prisma.shopping_seller_profile_snapshots.count({ where: { shopping_seller_id: targetId } }),
      MyGlobal.prisma.shopping_seller_profile_snapshots.findMany({ where: { shopping_seller_id: targetId }, orderBy: [{ created_at: "desc" }, { id: "desc" }], skip: ((input.page ?? 1) - 1) * (input.limit ?? 100), take: input.limit === 0 ? undefined : (input.limit ?? 100) }),
    ]);
    return page(rows.map((row) => ({ id: row.id, sellerId: row.shopping_seller_id, changedFields: row.changed_fields, before: row.before_json, after: row.after_json, createdAt: row.created_at.toISOString() })), total, input);
  }
  export async function publicSeller(payload: AuthPayload, id: string): Promise<IShoppingSellerProfile.IDetail> {
    await userById(payload.id, "customer");
    const selected = await userById(id, "seller", false);
    if (selected.deleted_at) throw ErrorUtil.notFound("No such seller profile.");
    return seller(selected);
  }
  export async function sellerApproval(payload: AuthPayload): Promise<IShoppingSellerApproval.IDetail> {
    const u = await userById(payload.id, "seller");
    const a = await MyGlobal.prisma.shopping_seller_approvals.findFirst({
      where: { shopping_seller_id: u.id },
      orderBy: { created_at: "desc" },
      include: { seller: true },
    });
    if (!a) throw ErrorUtil.notFound("No approval request.");
    return approval(a);
  }
  export async function sellerResubmit(payload: AuthPayload): Promise<IShoppingSellerApproval.IDetail> {
    const u = await userById(payload.id, "seller");
    if (u.approval_status !== "rejected") throw ErrorUtil.conflict(
      "Only a rejected seller may resubmit.",
    );
    const a = await MyGlobal.prisma.$transaction(async (tx) => {
      const changed = await tx.shopping_users.updateMany({
        where: { id: u.id, approval_status: "rejected", deleted_at: null, banned: false },
        data: { approval_status: "pending", rejection_reason: null, updated_at: now() },
      });
      if (changed.count !== 1) throw ErrorUtil.conflict("Only a rejected seller may resubmit.");
      return tx.shopping_seller_approvals.create({
        data: { id: uuid(), shopping_seller_id: u.id, status: "pending", created_at: now() },
        include: { seller: true },
      });
    });
    return approval(a);
  }
  export async function sellerApprovals(payload: AuthPayload, input: IPage.IRequest): Promise<IPage<IShoppingSellerApproval.IDetail>> {
    await requireAdmin(payload);
    const [total, rows] = await Promise.all([
      MyGlobal.prisma.shopping_seller_approvals.count({ where: { status: "pending" } }),
      MyGlobal.prisma.shopping_seller_approvals.findMany({ where: { status: "pending" }, include: { seller: true }, orderBy: [{ created_at: "asc" }, { id: "asc" }], skip: ((input.page ?? 1) - 1) * (input.limit ?? 100), take: input.limit === 0 ? undefined : (input.limit ?? 100) }),
    ]);
    return page(rows.map(approval), total, input);
  }
  export async function sellerDecision(payload: AuthPayload, id: string, approve: boolean, reason?: string): Promise<IShoppingSellerApproval.IDetail> {
    await requireAdmin(payload);
    const row = await MyGlobal.prisma.shopping_seller_approvals.findUnique({ where: { id }, include: { seller: true } });
    if (!row || row.status !== "pending") throw ErrorUtil.notFound("No pending seller approval.");
    if (!approve && !reason?.trim()) throw ErrorUtil.unprocessable("A rejection reason is required.");
    const status = approve ? "approved" : "rejected";
    const decisionReason = approve ? null : reason!.trim();
    const updated = await MyGlobal.prisma.$transaction(async (tx) => {
      const resultRows = await tx.shopping_seller_approvals.updateMany({ where: { id, status: "pending" }, data: { status, reason: decisionReason, decided_at: now(), decided_by_id: payload.id } });
      if (resultRows.count !== 1) throw ErrorUtil.conflict("The seller approval has already been decided.");
      const result = await tx.shopping_seller_approvals.findUniqueOrThrow({ where: { id }, include: { seller: true } });
      await tx.shopping_users.update({ where: { id: row.shopping_seller_id }, data: { approval_status: status, rejection_reason: decisionReason, updated_at: now() } });
      return result;
    });
    return approval(updated);
  }
  export async function sellerSuspend(payload: AuthPayload, id: string, suspended: boolean): Promise<IShoppingSellerProfile.IDetail> {
    await requireAdmin(payload);
    const sellerUser = await userById(id, "seller", false);
    if (sellerUser.deleted_at) throw ErrorUtil.notFound("No such seller.");
    if (sellerUser.suspended === suspended) throw ErrorUtil.conflict(suspended ? "The seller is already suspended." : "The seller is not suspended.");
    if (suspended && sellerUser.approval_status !== "approved") throw ErrorUtil.conflict("Only an approved seller may be suspended.");
    const updated = await MyGlobal.prisma.$transaction(async (tx) => {
      const changed = await tx.shopping_users.updateMany({ where: { id, suspended: !suspended, deleted_at: null, ...(suspended ? { approval_status: "approved" } : {}) }, data: { suspended, updated_at: now() } });
      if (changed.count !== 1) throw ErrorUtil.conflict("The seller suspension state changed during moderation.");
      return tx.shopping_users.findUniqueOrThrow({ where: { id } });
    });
    return seller(updated);
  }

  export async function categoryCreate(payload: AuthPayload, body: IShoppingCategory.ICreate): Promise<IShoppingCategory.IDetail> {
    await requireAdmin(payload);
    const name = body.name.trim();
    const description = body.description.trim();
    if (!name || !description) throw ErrorUtil.unprocessable("Category name and description are required.");
    if (body.parentId) {
      const parent = await MyGlobal.prisma.shopping_categories.findUnique({
        where: { id: body.parentId },
      });
      if (!parent || parent.parent_id) throw ErrorUtil.unprocessable(
        "Categories may only be nested one level deep.",
      );
    }
    const r = await MyGlobal.prisma.shopping_categories.create({
      data: {
        id: uuid(),
        name,
        description,
        parent_id: body.parentId ?? null,
        created_at: now(),
        updated_at: now(),
      },
    });
    return category(r, []);
  }
  export async function categoryUpdate(payload: AuthPayload, id: string, body: IShoppingCategory.IUpdate): Promise<IShoppingCategory.IDetail> {
    await requireAdmin(payload);
    await categoryExists(id);
    const name = body.name.trim();
    const description = body.description.trim();
    if (!name || !description) throw ErrorUtil.unprocessable("Category name and description are required.");
    const r = await MyGlobal.prisma.shopping_categories.update({
      where: { id },
      data: {
        name,
        description,
        updated_at: now(),
      },
    });
    return category(r, []);
  }
  export async function categoryDelete(payload: AuthPayload, id: string): Promise<IEntity> {
    await requireAdmin(payload);
    await categoryExists(id);
    await MyGlobal.prisma.$transaction(async (tx) => {
      const descendants = await tx.shopping_categories.findMany({
        where: { parent_id: id },
        select: { id: true },
      });
      await tx.shopping_products.updateMany({
        where: { shopping_category_id: { in: [id, ...descendants.map((row) => row.id)] } },
        data: { shopping_category_id: null, updated_at: now() },
      });
      await tx.shopping_categories.delete({ where: { id } });
    });
    return { id };
  }
  export async function categories(payload: AuthPayload): Promise<IShoppingCategory.IDetail[]> {
    await userById(payload.id, "customer");
    const rows = await MyGlobal.prisma.shopping_categories.findMany({
      where: { parent_id: null },
      include: { children: true },
      orderBy: [{ name: "asc" }, { id: "asc" }],
    });
    return rows.map((r) => category(r, r.children));
  }
  export async function categoryProducts(payload: AuthPayload, categoryId: string, input: IShoppingProduct.IRequest): Promise<IPage<IShoppingProduct.ISummary>> {
    await categoryExists(categoryId);
    return products(payload, { ...input, categoryId });
  }

  export async function productCreate(payload: AuthPayload, body: IShoppingProduct.ICreate): Promise<IShoppingProduct.IDetail> {
    const seller = await eligibleSeller(payload);
    const productInput = completeProduct(body);
    if (!productInput.categoryId) throw ErrorUtil.unprocessable("A live category is required.");
    await categoryExists(productInput.categoryId);
    const r = await MyGlobal.prisma.shopping_products.create({
      data: {
        id: uuid(),
        shopping_seller_id: seller.id,
        shopping_category_id: productInput.categoryId ?? null,
        name: productInput.name,
        description: productInput.description,
        base_price: productInput.basePrice,
        created_at: now(),
        updated_at: now(),
      },
    });
    return productDetail(r.id);
  }
  export async function productUpdate(payload: AuthPayload, id: string, body: IShoppingProduct.IUpdate): Promise<IShoppingProduct.IDetail> {
    const seller = await eligibleSeller(payload);
    const p = await ownedProduct(seller.id, id);
    const before = JSON.stringify(await productAggregate(p.id));
    const productInput = completeProduct(body);
    if (!productInput.categoryId) throw ErrorUtil.unprocessable("A live category is required.");
    await categoryExists(productInput.categoryId);
    await MyGlobal.prisma.$transaction(async (tx) => {
      await tx.shopping_products.update({
        where: { id: p.id },
        data: {
          name: productInput.name,
          description: productInput.description,
          base_price: productInput.basePrice,
          shopping_category_id: productInput.categoryId,
          updated_at: now(),
        },
      });
      await snapshotTx(tx, p.id, "name,description,basePrice,categoryId", before);
    });
    return productDetail(p.id);
  }
  export async function imageUpload(payload: AuthPayload, productId: string, body: IShoppingProduct.IImageCreate): Promise<IShoppingProduct.IDetail> {
    const seller = await eligibleSeller(payload);
    const p = await ownedProduct(seller.id, productId);
    const before = JSON.stringify(await productAggregate(p.id));
    const uri = body.uri.trim();
    if (!uri) throw ErrorUtil.unprocessable("Image URI is required.");
    await MyGlobal.prisma.$transaction(async (tx) => {
      const last = await tx.shopping_product_images.findFirst({ where: { shopping_product_id: p.id }, orderBy: { sequence: "desc" } });
      await tx.shopping_product_images.create({ data: { id: uuid(), shopping_product_id: p.id, uri, sequence: (last?.sequence ?? -1) + 1, created_at: now() } });
      await snapshotTx(tx, p.id, "images", before);
    });
    return productDetail(p.id);
  }
  export async function imageReorder(payload: AuthPayload, productId: string, body: IShoppingProduct.IImageReorder): Promise<IShoppingProduct.IDetail> {
    const seller = await eligibleSeller(payload);
    const p = await ownedProduct(seller.id, productId);
    const before = JSON.stringify(await productAggregate(p.id));
    await MyGlobal.prisma.$transaction(async (tx) => {
      const rows = await tx.shopping_product_images.findMany({ where: { shopping_product_id: p.id } });
      if (rows.length !== body.imageIds.length || new Set(body.imageIds).size !== rows.length || rows.some((r) => !body.imageIds.includes(r.id))) throw ErrorUtil.unprocessable("The image order must contain every image exactly once.");
      await tx.shopping_product_images.updateMany({ where: { shopping_product_id: p.id }, data: { sequence: { increment: 1000000 } } });
      for (const [sequence, id] of body.imageIds.entries()) await tx.shopping_product_images.update({ where: { id }, data: { sequence } });
      await snapshotTx(tx, p.id, "images", before);
    });
    return productDetail(p.id);
  }
  export async function imageDelete(payload: AuthPayload, productId: string, imageId: string): Promise<IShoppingProduct.IDetail> {
    const seller = await eligibleSeller(payload);
    const p = productId
      ? await ownedProduct(seller.id, productId)
      : await MyGlobal.prisma.shopping_products.findFirst({ where: { seller: { id: seller.id }, images: { some: { id: imageId } }, deleted_at: null } })
        ?? (() => { throw ErrorUtil.notFound("No such product."); })();
    const before = JSON.stringify(await productAggregate(p.id));
    const image = await MyGlobal.prisma.shopping_product_images.findFirst({ where: { id: imageId, shopping_product_id: p.id } });
    if (!image) throw ErrorUtil.notFound("No such product image.");
    await MyGlobal.prisma.$transaction(async (tx) => {
      await tx.shopping_product_images.delete({ where: { id: image.id } });
      const remaining = await tx.shopping_product_images.findMany({ where: { shopping_product_id: p.id }, orderBy: { sequence: "asc" } });
      await tx.shopping_product_images.updateMany({ where: { shopping_product_id: p.id }, data: { sequence: { increment: 1000000 } } });
      for (const [sequence, row] of remaining.entries()) await tx.shopping_product_images.update({ where: { id: row.id }, data: { sequence } });
      await snapshotTx(tx, p.id, "images", before);
    });
    return productDetail(p.id);
  }
  export async function productDelete(payload: AuthPayload, id: string): Promise<IEntity> {
    const seller = await eligibleSeller(payload);
    const product = await ownedProduct(seller.id, id);
    const before = JSON.stringify(await productAggregate(product.id));
    const [activeItems, pendingRequests] = await Promise.all([
      MyGlobal.prisma.shopping_order_items.count({ where: { product_id: product.id, status: { in: ["paid", "shipped"] } } }),
      MyGlobal.prisma.shopping_requests.count({ where: { status: "pending", item: { product_id: product.id } } }),
    ]);
    if (activeItems || pendingRequests) throw ErrorUtil.conflict("Commercial obligations must be resolved before product deletion.");
    await MyGlobal.prisma.$transaction(async (tx) => {
      const [activeAtCommit, pendingAtCommit] = await Promise.all([
        tx.shopping_order_items.count({ where: { product_id: product.id, status: { in: ["paid", "shipped"] } } }),
        tx.shopping_requests.count({ where: { status: "pending", item: { product_id: product.id } } }),
      ]);
      if (activeAtCommit || pendingAtCommit) throw ErrorUtil.conflict("Commercial obligations must be resolved before product deletion.");
      const variantIds = (await tx.shopping_variants.findMany({ where: { shopping_product_id: product.id, deleted_at: null }, select: { id: true } })).map((v) => v.id);
      if (variantIds.length) await tx.shopping_inventory_movements.deleteMany({ where: { shopping_variant_id: { in: variantIds } } });
      await tx.shopping_product_images.deleteMany({ where: { shopping_product_id: product.id } });
      await tx.shopping_variants.updateMany({ where: { shopping_product_id: product.id, deleted_at: null }, data: { deleted_at: now(), updated_at: now() } });
      await tx.shopping_products.update({ where: { id: product.id }, data: { deleted_at: now(), updated_at: now() } });
      await tx.shopping_wishlists.deleteMany({ where: { shopping_product_id: product.id } });
      await snapshotTx(tx, product.id, "deleted", before);
    });
    return { id };
  }
  export async function policyDeleteProduct(payload: AuthPayload, id: string, body: IShoppingAdmin.IReason): Promise<IEntity> {
    await requireAdminInternal(payload);
    if (!body.reason.trim()) throw ErrorUtil.badRequest("A nonempty policy reason is required.");
    const product = await MyGlobal.prisma.shopping_products.findFirst({ where: { id, deleted_at: null } });
    if (!product) throw ErrorUtil.notFound("No such product.");
    const before = JSON.stringify(await productAggregate(product.id));
    await MyGlobal.prisma.$transaction(async (tx) => {
      const variantIds = (await tx.shopping_variants.findMany({ where: { shopping_product_id: id, deleted_at: null }, select: { id: true } })).map((v) => v.id);
      if (variantIds.length) await tx.shopping_inventory_movements.deleteMany({ where: { shopping_variant_id: { in: variantIds } } });
      await tx.shopping_product_images.deleteMany({ where: { shopping_product_id: id } });
      await tx.shopping_variants.updateMany({ where: { shopping_product_id: id, deleted_at: null }, data: { deleted_at: now(), updated_at: now() } });
      await tx.shopping_products.update({ where: { id }, data: { deleted_at: now(), updated_at: now() } });
      await tx.shopping_wishlists.deleteMany({ where: { shopping_product_id: id } });
      await snapshotTx(tx, product.id, "deleted", before);
      await tx.shopping_admin_actions.create({ data: {
        id: uuid(), actor_id: payload.id, target_kind: "product", target_id: id,
        action: "policy_delete_product", reason: body.reason.trim(), outcome_json: JSON.stringify({ productId: id, deleted: true }), created_at: now(),
      } });
    });
    return { id };
  }
  export async function productAt(payload: AuthPayload, id: string): Promise<IShoppingProduct.IDetail> {
    await userById(payload.id, "customer");
    return productDetail(id);
  }
  export async function productSnapshots(payload: AuthPayload, id: string, input: IPage.IRequest, admin: boolean): Promise<IPage<IShoppingProduct.ISnapshot>> {
    const actor = await userById(payload.id);
    const product = await MyGlobal.prisma.shopping_products.findUnique({ where: { id } });
    if (!product) throw ErrorUtil.notFound("No such product.");
    if (admin) await requireAdminInternal(payload);
    else if (actor.kind !== "seller" || product.shopping_seller_id !== actor.id) throw ErrorUtil.forbidden("Only the owning seller may inspect these snapshots.");
    const [total, rows] = await Promise.all([
      MyGlobal.prisma.shopping_product_snapshots.count({ where: { shopping_product_id: id } }),
      MyGlobal.prisma.shopping_product_snapshots.findMany({
        where: { shopping_product_id: id },
        orderBy: [{ created_at: "desc" }, { id: "desc" }],
        skip: ((input.page ?? 1) - 1) * (input.limit ?? 100),
        take: input.limit === 0 ? undefined : (input.limit ?? 100),
      }),
    ]);
    return page(rows.map((row) => ({ id: row.id, productId: row.shopping_product_id, changedFields: row.changed_fields, createdAt: row.created_at.toISOString(), before: row.before_json, after: row.after_json, payload: row.after_json })), total, input);
  }
  export async function adminProducts(payload: AuthPayload, input: IShoppingProduct.IRequest): Promise<IPage<IShoppingProduct.ISummary>> {
    await requireAdminInternal(payload);
    const where: Prisma.shopping_productsWhereInput = {
      deleted_at: null,
      ...(input.search ? { OR: [{ name: { contains: input.search } }, { description: { contains: input.search } }] } : {}),
      ...(input.categoryId ? { shopping_category_id: input.categoryId } : {}),
      ...(input.sellerId ? { shopping_seller_id: input.sellerId } : {}),
    };
    const [total, rows] = await Promise.all([
      MyGlobal.prisma.shopping_products.count({ where }),
      MyGlobal.prisma.shopping_products.findMany({ where, include: { seller: true, images: { orderBy: { sequence: "asc" } }, variants: { where: { deleted_at: null }, include: { movements: true } }, reviews: { where: { deleted_at: null } } }, orderBy: [{ created_at: "desc" }, { id: "desc" }], skip: ((input.page ?? 1) - 1) * (input.limit ?? 100), take: input.limit === 0 ? undefined : (input.limit ?? 100) }),
    ]);
    return page(rows.map(summary), total, input);
  }
  export async function adminProductAt(payload: AuthPayload, id: string): Promise<IShoppingProduct.IDetail> {
    await requireAdminInternal(payload);
    return productDetail(id);
  }
  export async function products(payload: AuthPayload, input: IShoppingProduct.IRequest): Promise<IPage<IShoppingProduct.ISummary>> {
    await userById(payload.id, "customer");
    validateDiscoveryInput(input);
    if (input.categoryId) await categoryExists(input.categoryId);
    bindPaginationContext(payload.id, "products", input, {
      search: input.search?.trim().toLocaleLowerCase() ?? null,
      categoryId: input.categoryId ?? null,
      sellerId: input.sellerId ?? null,
      minPrice: input.minPrice ?? null,
      maxPrice: input.maxPrice ?? null,
      inStock: input.inStock ?? null,
      sort: input.sort ?? "newest",
      limit: input.limit ?? 100,
    });
    const where: Prisma.shopping_productsWhereInput = {
    deleted_at: null,
      seller: { banned: false, suspended: false, deleted_at: null, approval_status: "approved" },
    ...(input.categoryId ? { shopping_category_id: input.categoryId } : {}),
    ...(input.sellerId ? { shopping_seller_id: input.sellerId } : {}),
  };
    const rows = await MyGlobal.prisma.shopping_products.findMany({
        where,
        include: {
          seller: true,
          images: { orderBy: { sequence: "asc" } },
          variants: {
            where: { deleted_at: null },
            include: { movements: true },
          },
          reviews: { where: { deleted_at: null } },
        },
      });
    return discoverPage(rows, input);
  }
  export async function variantCreate(payload: AuthPayload, productId: string, body: IShoppingProduct.IVariantCreate): Promise<IShoppingProduct.IDetail> {
    const seller = await eligibleSeller(payload);
    const p = await ownedProduct(seller.id, productId);
    const before = JSON.stringify(await productAggregate(p.id));
    const variantInput = normalizeVariant(body);
    await validateVariantInput(p.id, variantInput);
    await MyGlobal.prisma.$transaction(async (tx) => {
      await tx.shopping_variants.create({
        data: {
          id: uuid(),
          shopping_product_id: p.id,
          sku: variantInput.sku,
          options_json: JSON.stringify(variantInput.options),
          price_override: variantInput.priceOverride ?? null,
          created_at: now(),
          updated_at: now(),
        },
      });
      await snapshotTx(tx, p.id, "variant", before);
    });
    return productDetail(p.id);
  }
  export async function variantUpdate(payload: AuthPayload, productId: string, variantId: string, body: IShoppingProduct.IVariantUpdate): Promise<IShoppingProduct.IDetail> {
    const seller = await eligibleSeller(payload);
    const p = await ownedProduct(seller.id, productId);
    await variantOwned(p.id, variantId);
    const before = JSON.stringify(await productAggregate(p.id));
    const variantInput = normalizeVariant(body);
    await validateVariantInput(p.id, variantInput, variantId);
    await MyGlobal.prisma.$transaction(async (tx) => {
      await tx.shopping_variants.update({
        where: { id: variantId },
        data: {
          sku: variantInput.sku,
          options_json: JSON.stringify(variantInput.options),
          price_override: variantInput.priceOverride ?? null,
          updated_at: now(),
        },
      });
      await snapshotTx(tx, p.id, "variant", before);
    });
    return productDetail(p.id);
  }
  export async function variantDelete(payload: AuthPayload, productId: string, variantId: string): Promise<IShoppingProduct.IDetail> {
    const seller = await eligibleSeller(payload);
    const p = await ownedProduct(seller.id, productId);
    const variant = await variantOwned(p.id, variantId);
    const before = JSON.stringify(await productAggregate(p.id));
    const [activeItems, pendingRequests] = await Promise.all([
      MyGlobal.prisma.shopping_order_items.count({ where: { shopping_variant_id: variant.id, status: { in: ["paid", "shipped"] } } }),
      MyGlobal.prisma.shopping_requests.count({ where: { status: "pending", item: { shopping_variant_id: variant.id } } }),
    ]);
    if (activeItems || pendingRequests) throw ErrorUtil.conflict("Fulfillment or unresolved requests block variant deletion.");
    await MyGlobal.prisma.$transaction(async (tx) => {
      const [activeAtCommit, pendingAtCommit] = await Promise.all([
        tx.shopping_order_items.count({ where: { shopping_variant_id: variant.id, status: { in: ["paid", "shipped"] } } }),
        tx.shopping_requests.count({ where: { status: "pending", item: { shopping_variant_id: variant.id } } }),
      ]);
      if (activeAtCommit || pendingAtCommit) throw ErrorUtil.conflict("Fulfillment or unresolved requests block variant deletion.");
      await tx.shopping_variants.update({ where: { id: variant.id }, data: { deleted_at: now(), updated_at: now() } });
      await tx.shopping_inventory_movements.deleteMany({ where: { shopping_variant_id: variant.id } });
      await snapshotTx(tx, p.id, "variant", before);
    });
    return productDetail(p.id);
  }
  export async function inventory(payload: AuthPayload, productId: string, variantId: string, input: IShoppingInventory.ICreate): Promise<IShoppingProduct.IDetail> {
    const seller = await eligibleSeller(payload, true);
    const v = productId
      ? await variantOwned(productId, variantId)
      : await variantOwnedBySeller(seller.id, variantId);
    const p = await ownedProduct(seller.id, v.shopping_product_id);
    if (!Number.isInteger(input.quantity) || input.quantity < 1) throw ErrorUtil.unprocessable("Inventory quantity must be a positive whole-number magnitude.");
    const operation = input.operation ?? "restock";
    if (!(operation === "restock" || operation === "adjustment" || operation === "loss")) throw ErrorUtil.unprocessable("The inventory operation is unsupported.");
    const quantity = operation === "restock" ? input.quantity : -input.quantity;
    const reason = input.reason.trim();
    if (!reason || /^(purchase|cancellation|refund|admin)\b/i.test(reason)) throw ErrorUtil.unprocessable("Inventory reason is invalid or reserved for an automatic movement.");
    await MyGlobal.prisma.$transaction(async (tx) => {
      const movements = await tx.shopping_inventory_movements.findMany({ where: { shopping_variant_id: v.id }, select: { quantity: true } });
      const holds = await tx.shopping_inventory_holds.findMany({ where: { shopping_variant_id: v.id, status: "held", payment: { status: { in: ["pending", "unknown"] } } }, select: { quantity: true } });
      const stock = movements.reduce((sum, row) => sum + row.quantity, 0);
      const held = holds.reduce((sum, row) => sum + row.quantity, 0);
      if (stock + quantity < held || stock + quantity < 0) throw ErrorUtil.unprocessable("Inventory cannot become negative and movement must be nonzero.");
      await tx.shopping_inventory_movements.create({ data: { id: uuid(), shopping_variant_id: v.id, quantity, reason, created_at: now() } });
    });
    return productDetail(p.id);
  }
  export async function inventoryHistory(payload: AuthPayload, productId: string, variantId: string, input: IPage.IRequest): Promise<IShoppingInventory.IHistory> {
    const seller = await eligibleSeller(payload, true);
    const v = productId
      ? await variantOwned(productId, variantId)
      : await variantOwnedBySeller(seller.id, variantId);
    const p = await ownedProduct(seller.id, v.shopping_product_id);
    const [total, rows, movementTotals] = await Promise.all([
      MyGlobal.prisma.shopping_inventory_movements.count({
        where: { shopping_variant_id: v.id },
      }),
      MyGlobal.prisma.shopping_inventory_movements.findMany({
        where: { shopping_variant_id: v.id },
        orderBy: [{ created_at: "desc" }, { id: "desc" }],
        skip: ((input.page ?? 1) - 1) * (input.limit ?? 100),
        take: input.limit === 0 ? undefined : (input.limit ?? 100),
      }),
      MyGlobal.prisma.shopping_inventory_movements.aggregate({
        where: { shopping_variant_id: v.id },
        _sum: { quantity: true },
      }),
    ]);
    return {
      ...page(
      rows.map((r) => ({
        id: r.id,
        quantity: r.quantity,
        reason: r.reason,
        createdAt: r.created_at.toISOString(),
      })),
      total,
      input,
      ),
      currentStock: movementTotals._sum.quantity ?? 0,
    };
  }

  export async function cart(payload: AuthPayload): Promise<IShoppingCart.ISummary> {
    const u = await userById(payload.id, "customer");
    const rows = await MyGlobal.prisma.shopping_cart_lines.findMany({
      where: { shopping_user_id: u.id },
      include: {
        variant: {
          include: { product: { include: { seller: true } }, movements: true },
        },
      },
      orderBy: { created_at: "asc" },
    });
    const lines = rows.map(cartLine);
    return { lines, total: lines.reduce((sum, line) => sum + line.subtotal, 0) };
  }
  export async function cartAdd(payload: AuthPayload, body: IShoppingCart.ICreate): Promise<IShoppingCart.ISummary> {
    await userById(payload.id, "customer");
    const v = await MyGlobal.prisma.shopping_variants.findUnique({
      where: { id: body.variantId },
      include: { product: { include: { seller: true } }, movements: true },
    });
    if (!v || v.deleted_at || v.product.deleted_at || v.product.seller.approval_status !== "approved" || v.product.seller.banned || v.product.seller.suspended || stockFromMovements(v.movements) <= 0) throw ErrorUtil.unprocessable(
      "That variant is unavailable.",
    );
    await MyGlobal.prisma.shopping_cart_lines.upsert({
      where: {
        shopping_user_id_shopping_variant_id: {
          shopping_user_id: payload.id,
          shopping_variant_id: v.id,
        },
      },
      create: {
        id: uuid(),
        shopping_user_id: payload.id,
        shopping_variant_id: v.id,
        quantity: body.quantity,
        created_at: now(),
        updated_at: now(),
      },
      update: { quantity: { increment: body.quantity }, updated_at: now() },
    });
    return cart(payload);
  }
  export async function cartUpdate(payload: AuthPayload, id: string, body: IShoppingCart.IUpdate): Promise<IShoppingCart.ISummary> {
    await userById(payload.id, "customer");
    const line = await MyGlobal.prisma.shopping_cart_lines.findFirst({
      where: { id, shopping_user_id: payload.id },
    });
    if (!line) throw ErrorUtil.notFound("No such cart line.");
    // A retained unavailable line is deliberately correctable: customers may
    // reduce its quantity or remove it even after catalog retirement,
    // suspension, or stock loss.  Availability is reported by `cart`, not a
    // precondition on this mutation.
    await MyGlobal.prisma.shopping_cart_lines.update({
      where: { id },
      data: { quantity: body.quantity, updated_at: now() },
    });
    return cart(payload);
  }
  export async function cartDelete(payload: AuthPayload, id: string): Promise<IEntity> {
    await userById(payload.id, "customer");
    const line = await MyGlobal.prisma.shopping_cart_lines.findFirst({
      where: { id, shopping_user_id: payload.id },
    });
    if (!line) throw ErrorUtil.notFound("No such cart line.");
    await MyGlobal.prisma.shopping_cart_lines.delete({ where: { id } });
    return { id };
  }
  export async function wishlist(payload: AuthPayload, input: IPage.IRequest): Promise<IPage<IShoppingWishlist.ISummary>> {
    await userById(payload.id, "customer");
    bindPaginationContext(payload.id, "wishlist", input, { limit: input.limit ?? 100 });
    const where = { shopping_user_id: payload.id };
    const [total, rows] = await Promise.all([
      MyGlobal.prisma.shopping_wishlists.count({ where }),
      MyGlobal.prisma.shopping_wishlists.findMany({
        where,
        include: {
          product: {
            include: {
              seller: true,
              images: { orderBy: { sequence: "asc" } },
              variants: {
                where: { deleted_at: null },
                include: { movements: true },
              },
              reviews: { where: { deleted_at: null } },
            },
          },
        },
        orderBy: [{ created_at: "desc" }, { id: "desc" }],
        skip: ((input.page ?? 1) - 1) * (input.limit ?? 100),
        take: input.limit === 0 ? undefined : (input.limit ?? 100),
      }),
    ]);
    return page(
      rows.map((r) => ({
        id: r.id,
        productId: r.product.id,
        product: summary(r.product),
        createdAt: r.created_at.toISOString(),
      })),
      total,
      input,
    );
  }
  export async function wishlistAdd(payload: AuthPayload, productId: string): Promise<IEntity> {
    await userById(payload.id, "customer");
    await productExists(productId);
    await MyGlobal.prisma.shopping_wishlists.upsert({
      where: {
        shopping_user_id_shopping_product_id: {
          shopping_user_id: payload.id,
          shopping_product_id: productId,
        },
      },
      create: {
        id: uuid(),
        shopping_user_id: payload.id,
        shopping_product_id: productId,
        created_at: now(),
      },
      update: {},
    });
    return { id: productId };
  }
  export async function wishlistDelete(payload: AuthPayload, productId: string): Promise<IEntity> {
    await userById(payload.id, "customer");
    const r = await MyGlobal.prisma.shopping_wishlists.findUnique({
      where: {
        shopping_user_id_shopping_product_id: {
          shopping_user_id: payload.id,
          shopping_product_id: productId,
        },
      },
    });
    if (!r) throw ErrorUtil.notFound("No such wishlist product.");
    await MyGlobal.prisma.shopping_wishlists.delete({ where: { id: r.id } });
    return { id: productId };
  }

  export async function orderList(payload: AuthPayload, input: IPage.IRequest): Promise<IPage<IShoppingOrder.ISummary>> {
    await userById(payload.id, "customer");
    const [total, rows] = await Promise.all([
      MyGlobal.prisma.shopping_orders.count({
        where: { shopping_customer_id: payload.id },
      }),
      MyGlobal.prisma.shopping_orders.findMany({
        where: { shopping_customer_id: payload.id },
        include: { items: true },
        orderBy: [{ created_at: "desc" }, { id: "desc" }],
        skip: ((input.page ?? 1) - 1) * (input.limit ?? 100),
        take: input.limit === 0 ? undefined : (input.limit ?? 100),
      }),
    ]);
    return page(
      rows.map((r) => ({
        id: r.id,
        orderNumber: r.order_number,
        total: r.total,
        status: deriveStatus(r.items.map((i) => i.status)),
        createdAt: r.created_at.toISOString(),
        itemCount: r.items.length,
      })),
      total,
      input,
    );
  }
  export async function orderAt(payload: AuthPayload, id: string): Promise<IShoppingOrder.IDetail> {
    await userById(payload.id, "customer");
    return orderDetail(id, payload.id);
  }
  export async function adminOrderList(payload: AuthPayload, input: IShoppingOrder.IAdminRequest): Promise<IPage<IShoppingAdmin.IOrderSummary>> {
    await requireAdminInternal(payload);
    if (input.createdFrom && input.createdTo && new Date(input.createdFrom).getTime() > new Date(input.createdTo).getTime()) throw ErrorUtil.unprocessable("The order date range is invalid.");
    if (input.status && !["paid", "shipped", "delivered", "cancelled", "refunded", "partially completed"].includes(input.status)) throw ErrorUtil.unprocessable("The order status filter is invalid.");
    const createdAt: Prisma.DateTimeFilter = {
      ...(input.createdFrom ? { gte: new Date(input.createdFrom) } : {}),
      ...(input.createdTo ? { lte: new Date(input.createdTo) } : {}),
    };
    const where: Prisma.shopping_ordersWhereInput = {
      ...(Object.keys(createdAt).length ? { created_at: createdAt } : {}),
      ...(input.customerId ? { shopping_customer_id: input.customerId } : {}),
      ...(input.sellerId ? { items: { some: { shopping_seller_id: input.sellerId } } } : {}),
    };
    const [total, rows] = await Promise.all([
      MyGlobal.prisma.shopping_orders.count({ where }),
      MyGlobal.prisma.shopping_orders.findMany({ where, include: { items: true }, orderBy: [{ created_at: "desc" }, { id: "desc" }], ...(input.status ? {} : { skip: ((input.page ?? 1) - 1) * (input.limit ?? 100), take: input.limit === 0 ? undefined : (input.limit ?? 100) }) }),
    ]);
    const filtered = input.status ? rows.filter((row) => deriveStatus(row.items.map((item) => item.status)) === input.status) : rows;
    const selected = input.status && input.limit !== 0 ? filtered.slice(((input.page ?? 1) - 1) * (input.limit ?? 100), (input.page ?? 1) * (input.limit ?? 100)) : filtered;
    return page(selected.map((row) => ({ id: row.id, orderNumber: row.order_number, total: row.total, status: deriveStatus(row.items.map((item) => item.status)), createdAt: row.created_at.toISOString(), itemCount: row.items.length, customerId: row.shopping_customer_id, sellerCount: new Set(row.items.map((item) => item.shopping_seller_id)).size })), input.status ? filtered.length : total, input);
  }
  export async function adminOrderAt(payload: AuthPayload, id: string): Promise<IShoppingOrder.IDetail> {
    await requireAdminInternal(payload);
    return orderDetail(id, undefined, true);
  }
  export async function adminActions(payload: AuthPayload, input: IShoppingAdmin.IActionRequest): Promise<IPage<IShoppingAdmin.IAction>> {
    await requireAdminInternal(payload);
    const where: Prisma.shopping_admin_actionsWhereInput = {
      ...(input.targetKind ? { target_kind: input.targetKind } : {}),
      ...(input.targetId ? { target_id: input.targetId } : {}),
      ...(input.action ? { action: input.action } : {}),
    };
    const [total, rows] = await Promise.all([
      MyGlobal.prisma.shopping_admin_actions.count({ where }),
      MyGlobal.prisma.shopping_admin_actions.findMany({ where, orderBy: [{ created_at: "desc" }, { id: "desc" }], skip: ((input.page ?? 1) - 1) * (input.limit ?? 100), take: input.limit === 0 ? undefined : (input.limit ?? 100) }),
    ]);
    return page(rows.map((row) => ({ id: row.id, actorId: row.actor_id, targetKind: row.target_kind, targetId: row.target_id, action: row.action, reason: row.reason, outcome: row.outcome_json, createdAt: row.created_at.toISOString() })), total, input);
  }
  export async function forceCancelItem(payload: AuthPayload, id: string, body: IShoppingAdmin.IReason): Promise<IShoppingOrder.IDetail> {
    await requireAdminInternal(payload);
    await forceTransition([id], "cancelled", body.reason, payload.id, "order_item", id);
    const itemRow = await MyGlobal.prisma.shopping_order_items.findUnique({ where: { id }, select: { shopping_order_id: true } });
    if (!itemRow) throw ErrorUtil.notFound("No such order item.");
    return orderDetail(itemRow.shopping_order_id);
  }
  export async function forceCancelOrder(payload: AuthPayload, orderId: string, body: IShoppingAdmin.IReason): Promise<IShoppingOrder.IDetail> {
    await requireAdminInternal(payload);
    const order = await MyGlobal.prisma.shopping_orders.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) throw ErrorUtil.notFound("No such order.");
    const ids = order.items.filter((item) => item.status === "paid" || item.status === "shipped").map((item) => item.id);
    if (!ids.length) throw ErrorUtil.conflict("No order item is eligible for cancellation.");
    await forceTransition(ids, "cancelled", body.reason, payload.id, "order", orderId);
    return orderDetail(order.id);
  }
  export async function forceRefundItem(payload: AuthPayload, id: string, body: IShoppingAdmin.IReason): Promise<IShoppingOrder.IDetail> {
    await requireAdminInternal(payload);
    await forceTransition([id], "refunded", body.reason, payload.id, "order_item", id);
    const itemRow = await MyGlobal.prisma.shopping_order_items.findUnique({ where: { id }, select: { shopping_order_id: true } });
    if (!itemRow) throw ErrorUtil.notFound("No such order item.");
    return orderDetail(itemRow.shopping_order_id);
  }
  export async function forceRefundOrder(payload: AuthPayload, orderId: string, body: IShoppingAdmin.IReason): Promise<IShoppingOrder.IDetail> {
    await requireAdminInternal(payload);
    const order = await MyGlobal.prisma.shopping_orders.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) throw ErrorUtil.notFound("No such order.");
    const ids = order.items.filter((item) => item.status === "paid" || item.status === "shipped" || item.status === "delivered").map((item) => item.id);
    if (!ids.length) throw ErrorUtil.conflict("No order item is eligible for refund.");
    await forceTransition(ids, "refunded", body.reason, payload.id, "order", orderId);
    return orderDetail(order.id);
  }
  export async function checkoutStart(payload: AuthPayload, body: IShoppingCheckout.IStart): Promise<IShoppingCheckout.ISummary> {
    const customer = await userById(payload.id, "customer");
    const address = body.addressId
      ? await ownedAddress(customer.id, body.addressId)
      : await MyGlobal.prisma.shopping_addresses.findFirst({ where: { shopping_user_id: customer.id, is_default: true } })
        ?? (() => { throw ErrorUtil.conflict("A default address is required."); })();
    const lines = await MyGlobal.prisma.shopping_cart_lines.findMany({ where: { shopping_user_id: customer.id }, include: { variant: { include: { product: { include: { seller: true } }, movements: true } } } });
    const eligible = [] as typeof lines;
    for (const line of lines) {
      const held = await heldQuantity(line.variant.id);
      const stock = stockFromMovements(line.variant.movements) - held;
      if (!line.variant.deleted_at && !line.variant.product.deleted_at && !line.variant.product.seller.deleted_at && !line.variant.product.seller.banned && !line.variant.product.seller.suspended && line.variant.product.seller.approval_status === "approved" && stock >= line.quantity) eligible.push(line);
    }
    if (!eligible.length) throw ErrorUtil.unprocessable("The cart has no purchasable lines.");
    const total = eligible.reduce((sum, line) => sum + effectivePrice(line.variant) * line.quantity, 0);
    const sessionId = uuid();
    await MyGlobal.prisma.$transaction(async (tx) => {
      await tx.shopping_checkout_sessions.create({ data: { id: sessionId, shopping_user_id: customer.id, shopping_address_id: address.id, recipient_name: address.recipient_name, phone: address.phone, street_address: address.street_address, city: address.city, state: address.state, postal_code: address.postal_code, country: address.country, total, status: "review", created_at: now(), updated_at: now() } });
      await tx.shopping_checkout_lines.createMany({ data: eligible.map((line) => ({ id: uuid(), shopping_checkout_id: sessionId, shopping_variant_id: line.variant.id, product_id: line.variant.product.id, product_name: line.variant.product.name, variant_sku: line.variant.sku, unit_price: effectivePrice(line.variant), quantity: line.quantity })) });
    });
    return checkoutSummary(sessionId, customer.id);
  }
  export async function checkoutReview(payload: AuthPayload, id: string): Promise<IShoppingCheckout.ISummary> {
    await userById(payload.id, "customer");
    return refreshCheckout(id, payload.id);
  }
  export async function checkoutPayment(payload: AuthPayload, id: string, body: IShoppingCheckout.IPayment): Promise<IShoppingCheckout.IPaymentResult> {
    const customer = await userById(payload.id, "customer");
    const session = await MyGlobal.prisma.shopping_checkout_sessions.findFirst({ where: { id, shopping_user_id: customer.id }, include: { lines: true } });
    if (!session) throw ErrorUtil.notFound("No such checkout.");
    if (body.amount === undefined || body.amount !== session.total) throw ErrorUtil.conflict("The payment amount does not match the reviewed total.");
    const outcome: "failed" | "succeeded" | "unknown" = body.status
      ?? (body.succeeded === undefined ? "unknown" : body.succeeded ? "succeeded" : "failed");
    const existing = await MyGlobal.prisma.shopping_payment_attempts.findUnique({ where: { attempt_key: body.paymentAttemptId } });
    if (existing && existing.shopping_checkout_id !== session.id) throw ErrorUtil.conflict("That payment attempt belongs to another checkout.");
    if (existing?.status === "succeeded") {
      if (outcome !== "succeeded") throw ErrorUtil.conflict("The payment attempt already succeeded with an incompatible outcome.");
      if (existing.order_id) return { status: "succeeded", checkout: await checkoutSummary(session.id, customer.id), order: await orderDetail(existing.order_id, customer.id) };
    }
    if (session.status === "completed") throw ErrorUtil.conflict("That checkout has already completed.");
    if (existing?.status === "failed") throw ErrorUtil.conflict("That payment attempt is final.");
    // A terminal failure must always reconcile an existing unknown attempt,
    // even when the customer's cart has changed since the attempt was held.
    if (outcome === "failed" && existing?.status === "unknown") {
      await MyGlobal.prisma.$transaction(async (tx) => {
        await tx.shopping_payment_attempts.update({ where: { id: existing.id }, data: { status: "failed", amount: body.amount, finalized_at: now() } });
        await tx.shopping_inventory_holds.updateMany({ where: { shopping_payment_id: existing.id, status: "held" }, data: { status: "released" } });
        await tx.shopping_checkout_sessions.update({ where: { id: session.id }, data: { status: "payment_failed", updated_at: now() } });
      });
      return { status: "failed", checkout: await checkoutSummary(session.id, customer.id) };
    }
    const reconcilingUnknown = existing?.status === "unknown";
    const otherUnresolved = await MyGlobal.prisma.shopping_payment_attempts.findFirst({ where: { shopping_checkout_id: session.id, status: { in: ["unknown", "pending"] }, ...(existing ? { id: { not: existing.id } } : {}) } });
    if (otherUnresolved) throw ErrorUtil.conflict("Another payment attempt is unresolved; reconcile it before retrying.");
    const attemptId = existing?.id ?? uuid();
    const lines = await MyGlobal.prisma.shopping_checkout_lines.findMany({ where: { shopping_checkout_id: session.id }, include: { variant: { include: { product: { include: { seller: true } }, movements: true } } } });
    if (!lines.length) throw ErrorUtil.conflict("The checkout has no lines.");
    const cartLines = await MyGlobal.prisma.shopping_cart_lines.findMany({ where: { shopping_user_id: customer.id } });
    const cartByVariant = new Map(cartLines.map((line) => [line.shopping_variant_id, line.quantity]));
    if (!reconcilingUnknown && lines.some((line) => cartByVariant.get(line.shopping_variant_id ?? "") !== line.quantity)) {
      await refreshCheckout(session.id, customer.id);
      throw ErrorUtil.conflict("The reviewed cart quantities are stale; review the refreshed checkout.");
    }
    if (outcome === "failed") {
      await MyGlobal.prisma.$transaction(async (tx) => {
        await tx.shopping_payment_attempts.upsert({ where: { attempt_key: body.paymentAttemptId }, create: { id: attemptId, shopping_checkout_id: session.id, attempt_key: body.paymentAttemptId, status: "failed", amount: body.amount, created_at: now(), finalized_at: now() }, update: { status: "failed", amount: body.amount, finalized_at: now() } });
        await tx.shopping_inventory_holds.updateMany({ where: { shopping_payment_id: attemptId, status: "held" }, data: { status: "released" } });
        await tx.shopping_checkout_sessions.update({ where: { id: session.id }, data: { status: "payment_failed", updated_at: now() } });
      });
      return { status: "failed", checkout: await checkoutSummary(session.id, customer.id) };
    }
    if (session.shopping_address_id) {
      const liveAddress = await MyGlobal.prisma.shopping_addresses.findFirst({ where: { id: session.shopping_address_id, shopping_user_id: customer.id } });
      if (!liveAddress || liveAddress.recipient_name !== session.recipient_name || liveAddress.phone !== session.phone || liveAddress.street_address !== session.street_address || liveAddress.city !== session.city || liveAddress.state !== session.state || liveAddress.postal_code !== session.postal_code || liveAddress.country !== session.country) {
        await refreshCheckout(session.id, customer.id);
        throw ErrorUtil.conflict("The reviewed address is stale; review the refreshed checkout.");
      }
    }
    for (const line of lines) {
      const allHeld = await heldQuantity(line.variant?.id ?? "");
      const ownHeld = existing ? (await MyGlobal.prisma.shopping_inventory_holds.findFirst({ where: { shopping_payment_id: existing.id, shopping_variant_id: line.shopping_variant_id!, status: "held" } }))?.quantity ?? 0 : 0;
      if (!line.variant || line.variant.deleted_at || line.variant.product.deleted_at || line.variant.product.seller.deleted_at || line.variant.product.seller.approval_status !== "approved" || line.variant.product.seller.banned || line.variant.product.seller.suspended || effectivePrice(line.variant) !== line.unit_price || stockFromMovements(line.variant.movements) - allHeld + ownHeld < line.quantity) {
        await refreshCheckout(session.id, customer.id);
        throw ErrorUtil.conflict("The reviewed checkout is stale; review the refreshed checkout.");
      }
    }
    if (outcome === "unknown") {
      await MyGlobal.prisma.$transaction(async (tx) => {
        await tx.shopping_payment_attempts.upsert({ where: { attempt_key: body.paymentAttemptId }, create: { id: attemptId, shopping_checkout_id: session.id, attempt_key: body.paymentAttemptId, status: "unknown", amount: body.amount, created_at: now() }, update: { status: "unknown", amount: body.amount, finalized_at: null } });
        for (const line of lines) {
          const held = await tx.shopping_inventory_holds.findFirst({ where: { shopping_payment_id: attemptId, shopping_variant_id: line.shopping_variant_id!, status: "held" } });
          if (!held) await tx.shopping_inventory_holds.create({ data: { id: uuid(), shopping_payment_id: attemptId, shopping_variant_id: line.shopping_variant_id!, quantity: line.quantity, status: "held", created_at: now() } });
        }
        await tx.shopping_checkout_sessions.update({ where: { id: session.id }, data: { status: "payment_unknown", updated_at: now() } });
      });
      return { status: "unknown", checkout: await checkoutSummary(session.id, customer.id) };
    }
    const orderId = uuid();
    const committed = await MyGlobal.prisma.$transaction(async (tx) => {
      const attempt = await tx.shopping_payment_attempts.upsert({ where: { attempt_key: body.paymentAttemptId }, create: { id: attemptId, shopping_checkout_id: session.id, attempt_key: body.paymentAttemptId, status: "pending", amount: body.amount, created_at: now() }, update: { amount: body.amount } });
      // A concurrent notification may have committed the same attempt while
      // this request was validating its checkout. Return that order rather
      // than creating a second commercial outcome.
      if (attempt.status === "succeeded" && attempt.order_id) return { orderId: attempt.order_id };
      for (const line of lines) {
        const current = await tx.shopping_checkout_lines.findUnique({ where: { id: line.id }, include: { variant: { include: { product: { include: { seller: true } }, movements: true } } } });
        if (!current?.variant || current.variant.deleted_at || current.variant.product.deleted_at || current.variant.product.seller.deleted_at || current.variant.product.seller.approval_status !== "approved" || current.variant.product.seller.banned || current.variant.product.seller.suspended || effectivePrice(current.variant) !== line.unit_price || current.variant.product.id !== line.product_id || current.variant.sku !== line.variant_sku) throw ErrorUtil.conflict("The reviewed checkout is stale.");
        const heldRows = await tx.shopping_inventory_holds.findMany({ where: { shopping_variant_id: current.variant.id, status: "held", payment: { status: { in: ["pending", "unknown"] } } }, select: { quantity: true, shopping_payment_id: true } });
        const held = heldRows.reduce((sum, row) => sum + row.quantity, 0);
        const ownHeld = heldRows.filter((row) => row.shopping_payment_id === attemptId).reduce((sum, row) => sum + row.quantity, 0);
        if (stockFromMovements(current.variant.movements) - held + ownHeld < line.quantity) throw ErrorUtil.conflict("The reviewed checkout is stale.");
        if (!ownHeld) await tx.shopping_inventory_holds.create({ data: { id: uuid(), shopping_payment_id: attemptId, shopping_variant_id: current.variant.id, quantity: line.quantity, status: "held", created_at: now() } });
      }
      await tx.shopping_orders.create({ data: { id: orderId, order_number: `ORD-${uuid()}`, shopping_customer_id: customer.id, total: session.total, status: "paid", recipient_name: session.recipient_name, phone: session.phone, street_address: session.street_address, city: session.city, state: session.state, postal_code: session.postal_code, country: session.country, created_at: now() } });
      for (const line of lines) {
        const product = line.variant!.product;
        await tx.shopping_order_items.create({ data: { id: uuid(), shopping_order_id: orderId, shopping_variant_id: line.variant!.id, shopping_seller_id: product.shopping_seller_id, product_id: product.id, product_name: product.name, product_description: product.description, variant_sku: line.variant!.sku, variant_options_json: line.variant!.options_json, seller_shop_name: product.seller.shop_name ?? "", seller_shop_logo: product.seller.shop_logo, unit_price: line.unit_price, quantity: line.quantity, status: "paid", refunded_amount: null, purchased_at: now() } });
        await tx.shopping_inventory_movements.create({ data: { id: uuid(), shopping_variant_id: line.variant!.id, quantity: -line.quantity, reason: `purchase:${orderId}`, created_at: now() } });
        await tx.shopping_cart_lines.deleteMany({ where: { shopping_user_id: customer.id, shopping_variant_id: line.variant!.id } });
        await tx.shopping_inventory_holds.updateMany({ where: { shopping_payment_id: attemptId, shopping_variant_id: line.variant!.id, status: "held" }, data: { status: "consumed" } });
      }
      await tx.shopping_payment_attempts.update({ where: { id: attemptId }, data: { status: "succeeded", order_id: orderId, finalized_at: now() } });
      await tx.shopping_checkout_sessions.update({ where: { id: session.id }, data: { status: "completed", updated_at: now() } });
      return { orderId };
    });
    return { status: "succeeded", checkout: await checkoutSummary(session.id, customer.id), order: await orderDetail(committed.orderId, customer.id) };
  }
  export async function shipmentCreate(payload: AuthPayload, orderId: string, body: IShoppingShipment.ICreate): Promise<IShoppingOrder.IDetail> {
    const seller = await eligibleSeller(payload, true);
    const carrier = body.carrier.trim();
    const trackingNumber = body.trackingNumber.trim();
    if (!carrier || !trackingNumber) throw ErrorUtil.unprocessable("Carrier and tracking number are required.");
    const items = await MyGlobal.prisma.shopping_order_items.findMany({
      where: {
        id: { in: body.itemIds },
        shopping_order_id: orderId,
        shopping_seller_id: seller.id,
        status: "paid",
        shipment_items: { none: {} },
        requests: { none: { kind: "cancellation", status: "pending" } },
      },
    });
    if (items.length !== body.itemIds.length || !items.length) throw ErrorUtil.unprocessable(
      "All selected items must be paid items owned by the seller.",
    );
    const shipmentId = uuid();
    await MyGlobal.prisma.$transaction(async (tx) => {
      const current = await tx.shopping_order_items.findMany({
        where: {
          id: { in: body.itemIds },
          shopping_order_id: orderId,
          shopping_seller_id: seller.id,
          status: "paid",
          shipment_items: { none: {} },
          requests: { none: { kind: "cancellation", status: "pending" } },
        },
      });
      if (current.length !== body.itemIds.length || !current.length) throw ErrorUtil.conflict("Selected items changed before shipment creation.");
      const shippedAt = now();
      await tx.shopping_shipments.create({ data: { id: shipmentId, shopping_order_id: orderId, shopping_seller_id: seller.id, carrier, tracking_number: trackingNumber, shipped_at: shippedAt } });
      for (const item of current) {
        const updated = await tx.shopping_order_items.updateMany({ where: { id: item.id, status: "paid", shipment_items: { none: {} }, requests: { none: { kind: "cancellation", status: "pending" } } }, data: { status: "shipped" } });
        if (updated.count !== 1) throw ErrorUtil.conflict("Selected items changed before shipment creation.");
        await tx.shopping_shipment_items.create({ data: { id: uuid(), shopping_shipment_id: shipmentId, shopping_order_item_id: item.id } });
      }
    });
    return orderDetail(orderId, undefined, false, seller.id);
  }
  export async function shipmentDeliver(payload: AuthPayload, shipmentId: string): Promise<IShoppingOrder.IDetail> {
    const customer = await userById(payload.id, "customer");
    const shipment = await MyGlobal.prisma.shopping_shipments.findUnique({
      where: { id: shipmentId },
      include: { order: true, items: true },
    });
    if (!shipment || shipment.order.shopping_customer_id !== customer.id) throw ErrorUtil.notFound(
      "No such shipment.",
    );
    await MyGlobal.prisma.$transaction(async (tx) => {
      const current = await tx.shopping_shipments.findUnique({ where: { id: shipmentId }, include: { order: true, items: true } });
      if (!current || current.order.shopping_customer_id !== customer.id) throw ErrorUtil.notFound("No such shipment.");
      if (current.delivered_at) throw ErrorUtil.conflict("The shipment is no longer awaiting delivery confirmation.");
      const itemIds = current.items.map((item) => item.shopping_order_item_id);
      const deliveredAt = now();
      const shipmentUpdate = await tx.shopping_shipments.updateMany({ where: { id: shipmentId, delivered_at: null }, data: { delivered_at: deliveredAt } });
      if (shipmentUpdate.count !== 1) throw ErrorUtil.conflict("The shipment is no longer awaiting delivery confirmation.");
      const itemUpdate = await tx.shopping_order_items.updateMany({ where: { id: { in: itemIds }, status: "shipped" }, data: { status: "delivered", delivered_at: deliveredAt } });
      if (itemUpdate.count !== itemIds.length) throw ErrorUtil.conflict("Every shipment item must still be shipped.");
    });
    return orderDetail(shipment.order.id, customer.id);
  }
  export async function shipmentTrack(payload: AuthPayload, shipmentId: string): Promise<IShoppingOrder.IDetail> {
    const customer = await userById(payload.id, "customer");
    await autoConfirmDue(customer.id, shipmentId);
    const shipment = await MyGlobal.prisma.shopping_shipments.findUnique({ where: { id: shipmentId }, select: { shopping_order_id: true } });
    if (!shipment) throw ErrorUtil.notFound("No such shipment.");
    return orderDetail(shipment.shopping_order_id, customer.id);
  }
  export async function shipmentAutoConfirm(payload: AuthPayload, shipmentId: string): Promise<IShoppingOrder.IDetail> {
    const customer = await userById(payload.id, "customer");
    const shipment = await MyGlobal.prisma.shopping_shipments.findUnique({ where: { id: shipmentId }, include: { order: true } });
    if (!shipment || shipment.order.shopping_customer_id !== customer.id) throw ErrorUtil.notFound("No such shipment.");
    await autoConfirmDue(customer.id, shipmentId, true);
    return orderDetail(shipment.order.id, customer.id);
  }
  export async function sellerQueue(payload: AuthPayload, input: IShoppingOrder.ISellerRequest): Promise<IPage<IShoppingOrder.IItem>> {
    const seller = await eligibleSeller(payload, true);
    if (input.status && !["paid", "shipped", "delivered", "cancelled", "refunded"].includes(input.status)) throw ErrorUtil.unprocessable("The order-item status filter is invalid.");
    const where: Prisma.shopping_order_itemsWhereInput = { shopping_seller_id: seller.id, ...(input.status ? { status: input.status } : {}) };
    const [total, rows] = await Promise.all([
      MyGlobal.prisma.shopping_order_items.count({ where }),
      MyGlobal.prisma.shopping_order_items.findMany({
        where,
        include: { order: true },
        orderBy: [{ purchased_at: "asc" }, { id: "asc" }],
        skip: ((input.page ?? 1) - 1) * (input.limit ?? 100),
        take: input.limit === 0 ? undefined : (input.limit ?? 100),
      }),
    ]);
    return page(rows.map(item), total, input);
  }
  export async function requestCreate(payload: AuthPayload, itemId: string, kind: "cancellation" | "refund", body: IShoppingRequest.ICreate): Promise<IShoppingRequest.IDetail> {
    const customer = await userById(payload.id, "customer");
    if (!body.reason.trim()) throw ErrorUtil.badRequest("A nonempty request reason is required.");
    const item = await MyGlobal.prisma.shopping_order_items.findUnique({
      where: { id: itemId },
      include: { order: true },
    });
    if (!item || item.order.shopping_customer_id !== customer.id) throw ErrorUtil.notFound(
      "No such order item.",
    );
    const expected = kind === "cancellation" ? "paid" : "delivered";
    if (item.status !== expected) throw ErrorUtil.conflict(
      `Only ${expected} items may be requested.`,
    );
    if (kind === "cancellation") {
      const shipment = await MyGlobal.prisma.shopping_shipment_items.findUnique({ where: { shopping_order_item_id: itemId } });
      if (shipment) throw ErrorUtil.conflict("A shipped item cannot be cancelled.");
    } else if (!item.delivered_at || now().getTime() > item.delivered_at.getTime() + 7 * 24 * 60 * 60 * 1000) {
      throw ErrorUtil.conflict("The refund window has closed.");
    }
    const r = await MyGlobal.prisma.$transaction(async (tx) => {
      // Serialize the check and insert so concurrent submissions converge on
      // one pending request for this item/kind.
      const current = await tx.shopping_order_items.findUnique({
        where: { id: itemId },
        include: { order: true },
      });
      if (!current || current.order.shopping_customer_id !== customer.id || current.status !== expected)
        throw ErrorUtil.conflict(`Only ${expected} items may be requested.`);
      if (kind === "cancellation") {
        const shipment = await tx.shopping_shipment_items.findUnique({ where: { shopping_order_item_id: itemId } });
        if (shipment) throw ErrorUtil.conflict("A shipped item cannot be cancelled.");
      } else if (!current.delivered_at || now().getTime() > current.delivered_at.getTime() + 7 * 24 * 60 * 60 * 1000) {
        throw ErrorUtil.conflict("The refund window has closed.");
      }
      const duplicate = await tx.shopping_requests.findFirst({ where: { shopping_order_item_id: itemId, kind, status: "pending" } });
      if (duplicate) throw ErrorUtil.conflict("A pending request already exists.");
      return tx.shopping_requests.create({
        data: {
          id: uuid(),
          shopping_order_item_id: itemId,
          kind,
          reason: body.reason.trim(),
          status: "pending",
          created_at: now(),
        },
      });
    });
    return request(r);
  }
  export async function sellerRequests(payload: AuthPayload, kind: "cancellation" | "refund", input: IPage.IRequest): Promise<IPage<IShoppingRequest.IDetail>> {
    const seller = await eligibleSeller(payload, true);
    const [total, rows] = await Promise.all([
      MyGlobal.prisma.shopping_requests.count({
        where: {
          kind,
          status: "pending",
          item: { shopping_seller_id: seller.id },
        },
      }),
      MyGlobal.prisma.shopping_requests.findMany({
        where: {
          kind,
          status: "pending",
          item: { shopping_seller_id: seller.id },
        },
        orderBy: [{ created_at: "asc" }, { id: "asc" }],
        include: { item: { include: { order: true } }, snapshots: { orderBy: [{ created_at: "asc" }, { id: "asc" }] } },
        skip: ((input.page ?? 1) - 1) * (input.limit ?? 100),
        take: input.limit === 0 ? undefined : (input.limit ?? 100),
      }),
    ]);
    return page(rows.map(request), total, input);
  }
  export async function decideRequest(payload: AuthPayload, id: string, approve: boolean): Promise<IShoppingRequest.IDetail> {
    const seller = await eligibleSeller(payload, true);
    const r = await MyGlobal.prisma.shopping_requests.findUnique({
      where: { id },
      include: { item: true },
    });
    if (!r || r.item.shopping_seller_id !== seller.id || r.status !== "pending") throw ErrorUtil.notFound(
      "No pending request.",
    );
    const expected = r.kind === "cancellation" ? "paid" : "delivered";
    if (r.item.status !== expected) throw ErrorUtil.conflict(`Only ${expected} items may be decided.`);
    const target = r.kind === "cancellation" ? "cancelled" : "refunded";
    const decisionAt = now();
    const decisionSnapshotId = uuid();
    await MyGlobal.prisma.$transaction(async (tx) => {
      const changed = await tx.shopping_requests.updateMany({ where: { id, status: "pending" }, data: { status: approve ? "approved" : "rejected", decided_at: decisionAt } });
      if (changed.count !== 1) throw ErrorUtil.conflict("The request has already been decided.");
      const itemChanged = await tx.shopping_order_items.updateMany({ where: { id: r.item.id, status: expected }, data: { status: approve ? target : expected } });
      if (itemChanged.count !== 1) throw ErrorUtil.conflict(`Only ${expected} items may be decided.`);
      await tx.shopping_request_snapshots.create({ data: { id: decisionSnapshotId, shopping_request_id: id, actor_id: seller.id, actor_kind: "seller", before_status: r.status, after_status: approve ? "approved" : "rejected", before_reason: r.reason, after_reason: r.reason, created_at: decisionAt } });
      if (approve) {
        await tx.shopping_order_items.update({ where: { id: r.item.id }, data: { refunded_amount: r.item.unit_price * r.item.quantity } });
        if (r.item.shopping_variant_id)
          // Retired variants remain as non-purchasable identity rows.  Keep
          // the restoration movement attached to that identity as obligation
          // evidence; live-stock projections already exclude retired rows.
          await tx.shopping_inventory_movements.create({ data: { id: uuid(), shopping_variant_id: r.item.shopping_variant_id, quantity: r.item.quantity, reason: `${r.kind}:${id}`, created_at: decisionAt } });
      }
    });
    return request({
      ...r,
      status: approve ? "approved" : "rejected",
      decided_at: decisionAt,
      snapshots: [{ id: decisionSnapshotId, actor_id: seller.id, actor_kind: "seller", before_status: r.status, after_status: approve ? "approved" : "rejected", before_reason: r.reason, after_reason: r.reason, created_at: decisionAt }],
    });
  }
  export async function reviewCreate(payload: AuthPayload, body: IShoppingReview.ICreate): Promise<IShoppingReview.IDetail> {
    const customer = await userById(payload.id, "customer");
    await productExists(body.productId);
    const item = await MyGlobal.prisma.shopping_order_items.findFirst({
      where: {
        order: { id: body.orderId, shopping_customer_id: customer.id },
        product_id: body.productId,
        status: "delivered",
      },
    });
    if (!item) throw ErrorUtil.forbidden("A delivered purchase is required.");
    const existing = await MyGlobal.prisma.shopping_reviews.findUnique({ where: { shopping_user_id_shopping_product_id_shopping_order_id: { shopping_user_id: customer.id, shopping_product_id: body.productId, shopping_order_id: body.orderId } } });
    if (existing) throw ErrorUtil.conflict("A review already exists for this purchase.");
    const r = await MyGlobal.prisma.shopping_reviews.create({
      data: {
        id: uuid(),
        shopping_user_id: customer.id,
        shopping_product_id: body.productId,
        shopping_order_id: body.orderId,
        rating: body.rating,
        text: body.text?.trim() || null,
        created_at: now(),
        updated_at: now(),
      },
    });
    return review(r, customer);
  }
  export async function reviewUpdate(payload: AuthPayload, id: string, body: IShoppingReview.IUpdate): Promise<IShoppingReview.IDetail> {
    const customer = await userById(payload.id, "customer");
    const r = await MyGlobal.prisma.shopping_reviews.findFirst({
      where: { id, shopping_user_id: customer.id, deleted_at: null },
    });
    if (!r) throw ErrorUtil.notFound("No such review.");
    // A retired product may retain its review evidence, but its live review
    // cannot be edited after the product leaves the catalog.
    await productExists(r.shopping_product_id);
    const n = await MyGlobal.prisma.$transaction(async (tx) => {
      const changed = await tx.shopping_reviews.updateMany({
        where: { id, shopping_user_id: customer.id, deleted_at: null, rating: r.rating, text: r.text },
        data: { rating: body.rating, text: body.text ?? null, updated_at: now() },
      });
      if (changed.count !== 1) throw ErrorUtil.conflict("The review changed during editing.");
      await tx.shopping_review_snapshots.create({
        data: {
          id: uuid(),
          shopping_review_id: id,
          before_rating: r.rating,
          after_rating: body.rating,
          before_text: r.text,
          after_text: body.text ?? null,
          created_at: now(),
        },
      });
      return tx.shopping_reviews.findUniqueOrThrow({ where: { id } });
    });
    return review(n, customer);
  }
  export async function reviewDelete(payload: AuthPayload, id: string): Promise<IEntity> {
    const customer = await userById(payload.id, "customer");
    const r = await MyGlobal.prisma.shopping_reviews.findFirst({
      where: { id, shopping_user_id: customer.id, deleted_at: null },
    });
    if (!r) throw ErrorUtil.notFound("No such review.");
    await MyGlobal.prisma.shopping_reviews.update({
      where: { id },
      data: { deleted_at: now() },
    });
    return { id };
  }

  export async function adminApplicationCreate(payload: AuthPayload, body: IShoppingAdminApplication.ICreate): Promise<IShoppingAdminApplication.IDetail> {
    const u = await userById(payload.id, undefined);
    if (!body.reason.trim()) throw ErrorUtil.unprocessable("An application reason is required.");
    if (parseGrades(u.grades).length)
      throw ErrorUtil.conflict("The identity is not eligible for another application.");
    const r = await MyGlobal.prisma.$transaction(async (tx) => {
      // Keep the eligibility check in the same serialized write transaction
      // as the insert; two simultaneous submissions cannot both become
      // pending applications.
      const pending = await tx.shopping_admin_applications.findFirst({ where: { shopping_user_id: u.id, status: "pending" } });
      if (pending) throw ErrorUtil.conflict("The identity is not eligible for another application.");
      const current = await tx.shopping_users.findUnique({ where: { id: u.id } });
      if (!current || current.deleted_at || current.banned || parseGrades(current.grades).length)
        throw ErrorUtil.conflict("The identity is not eligible for another application.");
      return tx.shopping_admin_applications.create({
        data: {
          id: uuid(),
          shopping_user_id: u.id,
          reason: body.reason.trim(),
          status: "pending",
          created_at: now(),
        },
      });
    });
    return adminApplication({ ...r, applicant_kind: u.kind });
  }
  export async function adminApplications(payload: AuthPayload, input: IPage.IRequest): Promise<IPage<IShoppingAdminApplication.IDetail>> {
    const u = await userById(payload.id, undefined);
    const [total, rows] = await Promise.all([
      MyGlobal.prisma.shopping_admin_applications.count({
        where: { shopping_user_id: u.id },
      }),
      MyGlobal.prisma.shopping_admin_applications.findMany({
        where: { shopping_user_id: u.id },
        include: { user: { select: { kind: true } } },
        orderBy: [{ created_at: "desc" }, { id: "desc" }],
        skip: ((input.page ?? 1) - 1) * (input.limit ?? 100),
        take: input.limit === 0 ? undefined : (input.limit ?? 100),
      }),
    ]);
    return page(rows.map((row) => adminApplication({ ...row, applicant_kind: row.user.kind })), total, input);
  }
  export async function adminApplicationsPending(payload: AuthPayload, input: IPage.IRequest): Promise<IPage<IShoppingAdminApplication.IDetail>> {
    await requireSuperAdmin(payload);
    const [total, rows] = await Promise.all([
      MyGlobal.prisma.shopping_admin_applications.count({ where: { status: "pending" } }),
      MyGlobal.prisma.shopping_admin_applications.findMany({
        where: { status: "pending" },
        include: { user: { select: { kind: true } } },
        orderBy: [{ created_at: "asc" }, { id: "asc" }],
        skip: ((input.page ?? 1) - 1) * (input.limit ?? 100),
        take: input.limit === 0 ? undefined : (input.limit ?? 100),
      }),
    ]);
    return page(rows.map((row) => adminApplication({ ...row, applicant_kind: row.user.kind })), total, input);
  }
  export async function adminApplicationDecision(payload: AuthPayload, id: string, approve: boolean): Promise<IShoppingAdminApplication.IDetail> {
    await requireSuperAdmin(payload);
    const application = await MyGlobal.prisma.shopping_admin_applications.findUnique({ where: { id } });
    if (!application || application.status !== "pending") throw ErrorUtil.notFound("No pending administrator application.");
    const applicant = await MyGlobal.prisma.shopping_users.findUnique({ where: { id: application.shopping_user_id } });
    if (!applicant || applicant.deleted_at || applicant.banned) throw ErrorUtil.conflict("The applicant identity is unavailable.");
    const result = await MyGlobal.prisma.$transaction(async (tx) => {
      const decidedRows = await tx.shopping_admin_applications.updateMany({ where: { id, status: "pending" }, data: { status: approve ? "approved" : "rejected", decided_at: now(), decided_by_id: payload.id } });
      if (decidedRows.count !== 1) throw ErrorUtil.conflict("The administrator application has already been decided.");
      const decided = await tx.shopping_admin_applications.findUniqueOrThrow({ where: { id } });
      const currentApplicant = await tx.shopping_users.findUnique({ where: { id: application.shopping_user_id } });
      if (!currentApplicant || currentApplicant.deleted_at || currentApplicant.banned) throw ErrorUtil.conflict("The applicant identity is unavailable.");
      if (approve) {
        const grades = parseGrades(currentApplicant.grades);
        if (!grades.includes("regularAdministrator")) grades.push("regularAdministrator");
        await tx.shopping_users.update({ where: { id: currentApplicant.id }, data: { grades: grades.join(","), updated_at: now() } });
      }
      return decided;
    });
    return adminApplication({ ...result, applicant_kind: applicant.kind });
  }
  export async function adminGrade(payload: AuthPayload, targetId: string, promote: boolean): Promise<IShoppingAdmin.IUserSummary> {
    const actor = await requireSuperAdmin(payload);
    if (actor.id === targetId && !promote) throw ErrorUtil.conflict("A super administrator cannot demote itself.");
    return MyGlobal.prisma.$transaction(async (tx) => {
      const target = await tx.shopping_users.findUnique({ where: { id: targetId } });
      if (!target || target.deleted_at || (promote && target.banned)) throw ErrorUtil.conflict("The target identity is unavailable for this grade change.");
      const grades = parseGrades(target.grades);
      const beforeGrades = [...grades];
      if (promote) {
        if (!grades.includes("regularAdministrator")) throw ErrorUtil.conflict("Only a regular administrator can be promoted.");
        if (grades.includes("superAdministrator")) throw ErrorUtil.conflict("The target is already a super administrator.");
        grades.push("superAdministrator");
      } else {
        if (!grades.includes("superAdministrator")) throw ErrorUtil.conflict("The target is not a super administrator.");
        const otherSupers = await tx.shopping_users.count({ where: { id: { not: target.id }, deleted_at: null, banned: false, grades: { contains: "superAdministrator" } } });
        if (otherSupers === 0) throw ErrorUtil.conflict("At least one active super administrator must remain.");
        grades.splice(grades.indexOf("superAdministrator"), 1);
      }
      const updated = await tx.shopping_users.update({ where: { id: target.id }, data: { grades: grades.join(","), updated_at: now() } });
      await tx.shopping_admin_actions.create({ data: { id: uuid(), actor_id: actor.id, target_kind: "user", target_id: target.id, action: promote ? "promote_admin" : "demote_admin", reason: "administrator grade change", outcome_json: JSON.stringify({ beforeGrades, afterGrades: parseGrades(updated.grades) }), created_at: now() } });
      return userSummary(updated);
    });
  }
  export async function users(payload: AuthPayload, kind: IShoppingAuth.Actor, input: IPage.IRequest): Promise<IPage<IShoppingAdmin.IUserSummary>> {
    await requireAdminInternal(payload);
    const where = { kind, deleted_at: null };
    const [total, rows] = await Promise.all([
      MyGlobal.prisma.shopping_users.count({ where }),
      MyGlobal.prisma.shopping_users.findMany({ where, orderBy: [{ created_at: "desc" }, { id: "desc" }], skip: ((input.page ?? 1) - 1) * (input.limit ?? 100), take: input.limit === 0 ? undefined : (input.limit ?? 100) }),
    ]);
    return page(rows.map(userSummary), total, input);
  }
  export async function userBan(payload: AuthPayload, targetId: string, banned: boolean, expectedKind?: IShoppingAuth.Actor): Promise<IShoppingAdmin.IUserSummary> {
    const actor = await requireAdminInternal(payload);
    if (actor.id === targetId) throw ErrorUtil.conflict("An administrator cannot change its own ban state.");
    const target = await userById(targetId, undefined, false);
    if (target.deleted_at) throw ErrorUtil.notFound("No such user.");
    if (expectedKind && target.kind !== expectedKind) throw ErrorUtil.notFound("No such user.");
    if (target.banned === banned) throw ErrorUtil.conflict(banned ? "The user is already banned." : "The user is not banned.");
    if (!parseGrades(actor.grades).includes("superAdministrator") && parseGrades(target.grades).includes("superAdministrator")) throw ErrorUtil.forbidden("A regular administrator cannot moderate a super administrator.");
    const beforeBanned = target.banned;
    return MyGlobal.prisma.$transaction(async (tx) => {
      const changed = await tx.shopping_users.updateMany({ where: { id: target.id, banned: beforeBanned, deleted_at: null }, data: { banned, updated_at: now() } });
      if (changed.count !== 1) throw ErrorUtil.conflict("The user ban state changed during moderation.");
      if (banned) await tx.shopping_sessions.updateMany({ where: { shopping_user_id: target.id }, data: { revoked: true } });
      const updated = await tx.shopping_users.findUniqueOrThrow({ where: { id: target.id } });
      await tx.shopping_admin_actions.create({ data: { id: uuid(), actor_id: actor.id, target_kind: "user", target_id: target.id, action: banned ? "ban_user" : "unban_user", reason: "administrator account action", outcome_json: JSON.stringify({ beforeBanned, afterBanned: banned }), created_at: now() } });
      return userSummary(updated);
    });
  }
  export async function requireAdmin(payload: AuthPayload): Promise<User> {
    return requireAdminInternal(payload);
  }
  export async function dashboard(payload: AuthPayload): Promise<IShoppingAdmin.ISummary> {
    const seller = await eligibleSeller(payload, true);
    const [products, orderItems, pendingCancellations, pendingRefunds] = await Promise.all(
      [
        MyGlobal.prisma.shopping_products.count({
          where: { shopping_seller_id: seller.id, deleted_at: null },
        }),
        MyGlobal.prisma.shopping_order_items.count({
          where: { shopping_seller_id: seller.id },
        }),
        MyGlobal.prisma.shopping_requests.count({
          where: {
            kind: "cancellation",
            status: "pending",
            item: { shopping_seller_id: seller.id },
          },
        }),
        MyGlobal.prisma.shopping_requests.count({
          where: {
            kind: "refund",
            status: "pending",
            item: { shopping_seller_id: seller.id },
          },
        }),
      ],
    );
    return {
      products,
      orderItems,
      pendingCancellations,
      pendingRefunds,
    };
  }

  async function userById(id: string, kind?: string, requireActive = true): Promise<User> {
    const u = await MyGlobal.prisma.shopping_users.findUnique({
      where: { id },
    });
    if (!u || (kind && u.kind !== kind) || (requireActive && (u.deleted_at || u.banned))) throw ErrorUtil.unauthorized(
      "The identity is unavailable.",
    );
    return u;
  }
  async function ownedAddress(userId: string, id: string) {
    const r = await MyGlobal.prisma.shopping_addresses.findFirst({
      where: { id, shopping_user_id: userId },
    });
    if (!r) throw ErrorUtil.notFound("No such address.");
    return r;
  }
  async function eligibleSeller(payload: AuthPayload, allowSuspended = false): Promise<User> {
    const u = await userById(payload.id, "seller");
    if (u.approval_status !== "approved") throw ErrorUtil.forbidden(
      "Seller approval is required.",
    );
    if (!allowSuspended && u.suspended) throw ErrorUtil.forbidden(
      "The seller is suspended.",
    );
    return u;
  }
  async function requireAdminInternal(payload: AuthPayload): Promise<User> {
    const u = await userById(payload.id);
    if (!parseGrades(u.grades).some(
      (g) => g === "regularAdministrator" || g === "superAdministrator",
    )) throw ErrorUtil.forbidden("Administrator authority is required.");
    return u;
  }
  async function requireSuperAdmin(payload: AuthPayload): Promise<User> {
    const u = await requireAdminInternal(payload);
    if (!parseGrades(u.grades).includes("superAdministrator")) throw ErrorUtil.forbidden("Super administrator authority is required.");
    return u;
  }
  async function forceTransition(ids: string[], target: "cancelled" | "refunded", reason: string, actorId: string, targetKind: "order" | "order_item", targetId: string): Promise<void> {
    if (!reason.trim()) throw ErrorUtil.badRequest("A nonempty policy reason is required.");
    const transitionAt = now();
    await MyGlobal.prisma.$transaction(async (tx) => {
      const items = await tx.shopping_order_items.findMany({ where: { id: { in: ids } } });
      if (items.length !== ids.length) throw ErrorUtil.notFound("No such order item.");
      for (const item of items) {
        const allowed = target === "cancelled"
          ? item.status === "paid" || item.status === "shipped"
          : item.status === "paid" || item.status === "shipped" || item.status === "delivered";
        if (!allowed) throw ErrorUtil.conflict("The order item is not eligible for this transition.");
        if (target === "refunded") {
          const blocking = await tx.shopping_requests.findFirst({ where: { shopping_order_item_id: item.id, kind: "cancellation", status: "pending" } });
          if (blocking) throw ErrorUtil.conflict("A pending cancellation blocks this refund.");
        }
        const transitioned = await tx.shopping_order_items.updateMany({ where: { id: item.id, status: item.status }, data: { status: target, delivered_at: target === "cancelled" ? null : item.delivered_at } });
        if (transitioned.count !== 1) throw ErrorUtil.conflict("The order item changed during force resolution.");
        const requestKind = target === "cancelled" ? "cancellation" : "refund";
        const pendingRequest = await tx.shopping_requests.findFirst({ where: { shopping_order_item_id: item.id, kind: requestKind, status: "pending" } });
        if (pendingRequest) {
          await tx.shopping_requests.update({ where: { id: pendingRequest.id }, data: { status: "approved", decided_at: transitionAt } });
          await tx.shopping_request_snapshots.create({ data: { id: uuid(), shopping_request_id: pendingRequest.id, actor_id: actorId, actor_kind: "administrator", before_status: pendingRequest.status, after_status: "approved", before_reason: pendingRequest.reason, after_reason: pendingRequest.reason, created_at: transitionAt } });
        }
        await tx.shopping_order_items.update({ where: { id: item.id }, data: { refunded_amount: item.unit_price * item.quantity } });
        if (item.shopping_variant_id)
          await tx.shopping_inventory_movements.create({ data: { id: uuid(), shopping_variant_id: item.shopping_variant_id, quantity: item.quantity, reason: `admin ${target}: ${reason.trim()}`, created_at: transitionAt } });
      }
      await tx.shopping_admin_actions.create({ data: {
        id: uuid(), actor_id: actorId, target_kind: targetKind, target_id: targetId,
        action: `force_${target}`, reason: reason.trim(),
        outcome_json: JSON.stringify({ itemIds: ids, status: target }), created_at: transitionAt,
      } });
    });
  }
  async function autoConfirmDue(customerId: string, shipmentId: string, strict = false): Promise<void> {
    const shipment = await MyGlobal.prisma.shopping_shipments.findUnique({ where: { id: shipmentId }, include: { order: true, items: true } });
    if (!shipment || shipment.order.shopping_customer_id !== customerId) throw ErrorUtil.notFound("No such shipment.");
    if (shipment.delivered_at) return;
    const due = shipment.shipped_at.getTime() + 14 * 24 * 60 * 60 * 1000 <= Date.now();
    if (!due) {
      if (strict) throw ErrorUtil.conflict("Shipment auto-confirmation is not due yet.");
      return;
    }
    await MyGlobal.prisma.$transaction(async (tx) => {
      const current = await tx.shopping_shipments.findUnique({ where: { id: shipment.id }, include: { order: true, items: true } });
      if (!current || current.order.shopping_customer_id !== customerId) throw ErrorUtil.notFound("No such shipment.");
      if (current.delivered_at) return;
      const deliveredAt = now();
      const dueAt = new Date(deliveredAt.getTime() - 14 * 24 * 60 * 60 * 1000);
      const shipmentUpdate = await tx.shopping_shipments.updateMany({ where: { id: shipment.id, delivered_at: null, shipped_at: { lte: dueAt } }, data: { delivered_at: deliveredAt } });
      if (shipmentUpdate.count !== 1) return;
      const itemIds = current.items.map((item) => item.shopping_order_item_id);
      const itemUpdate = await tx.shopping_order_items.updateMany({ where: { id: { in: itemIds }, status: "shipped" }, data: { status: "delivered", delivered_at: deliveredAt } });
      if (itemUpdate.count !== itemIds.length) throw ErrorUtil.conflict("Every shipment item must still be shipped.");
    });
  }
  async function categoryExists(id: string) {
    const r = await MyGlobal.prisma.shopping_categories.findUnique({
      where: { id },
    });
    if (!r) throw ErrorUtil.notFound("No such category.");
    return r;
  }
  const completeProduct = (body: IShoppingProduct.ICreate): { name: string; description: string; categoryId: string | null | undefined; basePrice: number } => {
    const name = body.name.trim();
    const description = body.description.trim();
    if (!name || !description || !Number.isFinite(body.basePrice) || body.basePrice < 0) throw ErrorUtil.unprocessable("Product name, description, and nonnegative price are required.");
    return { name, description, categoryId: body.categoryId, basePrice: body.basePrice };
  };
  async function productExists(id: string) {
    const r = await MyGlobal.prisma.shopping_products.findFirst({
      where: { id, deleted_at: null },
    });
    if (!r) throw ErrorUtil.notFound("No such product.");
    return r;
  }
  async function ownedProduct(sellerId: string, id: string) {
    const r = await MyGlobal.prisma.shopping_products.findFirst({
      where: { id, shopping_seller_id: sellerId, deleted_at: null },
    });
    if (!r) throw ErrorUtil.notFound("No such product.");
    return r;
  }
  async function variantOwned(productId: string, id: string) {
    const r = await MyGlobal.prisma.shopping_variants.findFirst({
      where: { id, shopping_product_id: productId, deleted_at: null },
      include: { movements: true },
    });
    if (!r) throw ErrorUtil.notFound("No such variant.");
    return r;
  }
  async function variantOwnedBySeller(sellerId: string, id: string) {
    const r = await MyGlobal.prisma.shopping_variants.findFirst({
      where: { id, deleted_at: null, product: { shopping_seller_id: sellerId, deleted_at: null } },
      include: { movements: true },
    });
    if (!r) throw ErrorUtil.notFound("No such variant.");
    return r;
  }
  async function validateVariantInput(productId: string, body: IShoppingProduct.IVariantCreate, excludeId?: string): Promise<void> {
    const sku = body.sku.trim().toLowerCase();
    const entries = Object.entries(body.options).map(([name, value]) => [name.trim().toLowerCase(), value.trim().toLowerCase()] as const);
    if (!sku || !entries.length || entries.some(([name, value]) => !name || !value) || new Set(entries.map(([name]) => name)).size !== entries.length) throw ErrorUtil.unprocessable("A variant requires a unique SKU and nonempty option pairs.");
    if (body.priceOverride !== undefined && body.priceOverride !== null && body.priceOverride < 0) throw ErrorUtil.unprocessable("Variant price override cannot be negative.");
    const rows = await MyGlobal.prisma.shopping_variants.findMany({ where: {} });
    for (const row of rows) {
      if (row.id === excludeId) continue;
      if (row.sku.trim().toLowerCase() === sku) throw ErrorUtil.conflict("That SKU is already used on the platform.");
      if (row.shopping_product_id !== productId || row.deleted_at) continue;
      const existing = Object.entries(JSON.parse(row.options_json) as Record<string, string>).map(([name, value]) => `${name.trim().toLowerCase()}=${value.trim().toLowerCase()}`).sort((a, b) => a.localeCompare(b)).join("|");
      const next = entries.map(([name, value]) => `${name}=${value}`).sort((a, b) => a.localeCompare(b)).join("|");
      if (existing === next) throw ErrorUtil.conflict("That option combination is already used by this product.");
    }
  }
  function normalizeVariant(body: IShoppingProduct.IVariantCreate): IShoppingProduct.IVariantCreate {
    return {
      sku: body.sku.trim(),
      options: Object.fromEntries(Object.entries(body.options).map(([name, value]) => [name.trim(), value.trim()])),
      priceOverride: body.priceOverride ?? null,
    };
  }
  async function stockOf(id: string) {
    const rows = await MyGlobal.prisma.shopping_inventory_movements.findMany({
      where: { shopping_variant_id: id },
    });
    return rows.reduce((sum, r) => sum + r.quantity, 0);
  }
  async function heldQuantity(variantId: string): Promise<number> {
    const rows = await MyGlobal.prisma.shopping_inventory_holds.findMany({ where: { shopping_variant_id: variantId, status: "held", payment: { status: { in: ["pending", "unknown"] } } } });
    return rows.reduce((sum, row) => sum + row.quantity, 0);
  }
  const stockFromMovements = (rows: { quantity: number }[]): number => rows.reduce(
    (sum, r) => sum + r.quantity,
    0,
  );
  const effectivePrice = (v: { price_override: number | null; product?: { base_price: number } }): number => v.price_override ?? v.product?.base_price ?? 0;
  async function checkoutSummary(id: string, customerId: string): Promise<IShoppingCheckout.ISummary> {
    const session = await MyGlobal.prisma.shopping_checkout_sessions.findFirst({ where: { id, shopping_user_id: customerId }, include: { lines: true } });
    if (!session) throw ErrorUtil.notFound("No such checkout.");
    return {
      id: session.id,
      status: session.status,
      total: session.total,
      recipientName: session.recipient_name,
      phone: session.phone,
      streetAddress: session.street_address,
      city: session.city,
      state: session.state,
      postalCode: session.postal_code,
      country: session.country,
      lines: session.lines.map((line) => ({ variantId: line.shopping_variant_id ?? "", productId: line.product_id, productName: line.product_name, variantSku: line.variant_sku, unitPrice: line.unit_price, quantity: line.quantity, subtotal: line.unit_price * line.quantity })),
    };
  }
  async function refreshCheckout(id: string, customerId: string): Promise<IShoppingCheckout.ISummary> {
    const session = await MyGlobal.prisma.shopping_checkout_sessions.findFirst({ where: { id, shopping_user_id: customerId }, include: { lines: true } });
    if (!session) throw ErrorUtil.notFound("No such checkout.");
    if (session.status === "completed" || session.status === "payment_unknown") return checkoutSummary(id, customerId);
    const addressRow = session.shopping_address_id
      ? await MyGlobal.prisma.shopping_addresses.findFirst({ where: { id: session.shopping_address_id, shopping_user_id: customerId } })
      : null;
    if (!addressRow) throw ErrorUtil.conflict("The checkout address is no longer available.");
    const cart = await MyGlobal.prisma.shopping_cart_lines.findMany({ where: { shopping_user_id: customerId }, include: { variant: { include: { product: { include: { seller: true } }, movements: true } } } });
    const eligible = [] as typeof cart;
    for (const line of cart) {
      const held = await heldQuantity(line.variant.id);
      const stock = stockFromMovements(line.variant.movements) - held;
      if (!line.variant.deleted_at && !line.variant.product.deleted_at && !line.variant.product.seller.deleted_at && !line.variant.product.seller.banned && !line.variant.product.seller.suspended && line.variant.product.seller.approval_status === "approved" && stock >= line.quantity) eligible.push(line);
    }
    if (!eligible.length) throw ErrorUtil.unprocessable("The cart has no purchasable lines.");
    const total = eligible.reduce((sum, line) => sum + effectivePrice(line.variant) * line.quantity, 0);
    await MyGlobal.prisma.$transaction(async (tx) => {
      await tx.shopping_checkout_lines.deleteMany({ where: { shopping_checkout_id: session.id } });
      await tx.shopping_checkout_lines.createMany({ data: eligible.map((line) => ({ id: uuid(), shopping_checkout_id: session.id, shopping_variant_id: line.variant.id, product_id: line.variant.product.id, product_name: line.variant.product.name, variant_sku: line.variant.sku, unit_price: effectivePrice(line.variant), quantity: line.quantity })) });
      await tx.shopping_checkout_sessions.update({ where: { id: session.id }, data: { shopping_address_id: addressRow.id, recipient_name: addressRow.recipient_name, phone: addressRow.phone, street_address: addressRow.street_address, city: addressRow.city, state: addressRow.state, postal_code: addressRow.postal_code, country: addressRow.country, total, status: "review", updated_at: now() } });
    });
    return checkoutSummary(id, customerId);
  }
  async function productAggregate(productId: string) {
    return MyGlobal.prisma.shopping_products.findUnique({
      where: { id: productId },
      include: {
        images: { orderBy: { sequence: "asc" } },
        variants: { where: { deleted_at: null } },
      },
    });
  }
  async function productAggregateTx(tx: Prisma.TransactionClient, productId: string) {
    return tx.shopping_products.findUnique({
      where: { id: productId },
      include: {
        images: { orderBy: { sequence: "asc" } },
        variants: { where: { deleted_at: null } },
      },
    });
  }
  async function snapshotTx(tx: Prisma.TransactionClient, productId: string, fields: string, beforeJson?: string) {
    const p = await productAggregateTx(tx, productId);
    if (p) await tx.shopping_product_snapshots.create({
      data: {
        id: uuid(),
        shopping_product_id: productId,
        before_json: beforeJson ?? JSON.stringify(p),
        after_json: JSON.stringify(p),
        changed_fields: fields,
        created_at: now(),
      },
    });
  }
  async function snapshot(productId: string, fields: string, beforeJson?: string) {
    await MyGlobal.prisma.$transaction((tx) => snapshotTx(tx, productId, fields, beforeJson));
  }
  const completeAddress = (b: IShoppingAddress.ICreate) => {
    const values = {
      recipient_name: b.recipientName?.trim(),
      phone: b.phone?.trim(),
      street_address: b.streetAddress?.trim(),
      city: b.city?.trim(),
      state: b.state?.trim(),
      postal_code: b.postalCode?.trim(),
      country: b.country?.trim(),
    };
    if (Object.values(values).some((value) => !value)) throw ErrorUtil.unprocessable("All shipping address fields are required.");
    return values as { recipient_name: string; phone: string; street_address: string; city: string; state: string; postal_code: string; country: string };
  };
  const address = (r: { id: string; recipient_name: string; phone: string; street_address: string; city: string; state: string; postal_code: string; country: string; is_default: boolean }): IShoppingAddress.IDetail => ({
    id: r.id,
    recipientName: r.recipient_name,
    phone: r.phone,
    streetAddress: r.street_address,
    city: r.city,
    state: r.state,
    postalCode: r.postal_code,
    country: r.country,
    isDefault: r.is_default,
  });
  const seller = (u: User): IShoppingSellerProfile.IDetail => ({
    id: u.id,
    shopName: u.shop_name ?? "",
    shopDescription: u.shop_description ?? "",
    shopLogo: u.shop_logo,
    approvalStatus: u.approval_status ?? "pending",
    suspended: u.suspended,
    banned: u.banned,
  });
  const userSummary = (u: User): IShoppingAdmin.IUserSummary => ({
    id: u.id,
    email: u.email,
    displayName: u.display_name,
    kind: u.kind,
    banned: u.banned,
    grades: parseGrades(u.grades),
    createdAt: u.created_at.toISOString(),
  });
  const approval = (a: { id: string; shopping_seller_id: string; status: string; reason: string | null; created_at: Date; decided_at: Date | null; decided_by_id?: string | null; seller?: User }): IShoppingSellerApproval.IDetail => ({
    id: a.id,
    sellerId: a.shopping_seller_id,
    seller: seller(a.seller ?? { id: a.shopping_seller_id, shop_name: "", shop_description: "", shop_logo: null, approval_status: a.status, suspended: false, banned: false } as User),
    status: a.status,
    reason: a.reason,
    createdAt: a.created_at.toISOString(),
    decidedAt: a.decided_at?.toISOString() ?? null,
    decidedById: a.decided_by_id ?? null,
  });
  const category = (r: { id: string; name: string; description: string; parent_id: string | null }, children: { id: string; name: string; description: string; parent_id: string | null }[]): IShoppingCategory.IDetail => ({
    id: r.id,
    name: r.name,
    description: r.description,
    parentId: r.parent_id,
    children: children.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      parentId: c.parent_id,
      children: [],
    })),
  });
  const summary = (r: ProductListRow): IShoppingProduct.ISummary => ({
    id: r.id,
    sellerId: r.shopping_seller_id,
    sellerName: r.seller?.shop_name ?? "",
    name: r.name,
    description: r.description,
    basePrice: r.base_price,
    priceMin: (r.variants?.length ? Math.min(...r.variants.map((v) => effectivePrice({ ...v, product: r }))) : r.base_price),
    priceMax: (r.variants?.length ? Math.max(...r.variants.map((v) => effectivePrice({ ...v, product: r }))) : r.base_price),
    thumbnail: r.images?.[0]?.uri ?? null,
    available: (r.variants ?? []).some(
      (v) => stockFromMovements(v.movements ?? []) > 0,
    ) && !r.deleted_at && !r.seller?.banned && !r.seller?.suspended && r.seller?.approval_status === "approved",
    averageRating: r.reviews?.length ? Math.round((r.reviews.reduce((sum, x) => sum + x.rating, 0) / r.reviews.length) * 10) / 10 : null,
    reviewCount: r.reviews?.length ?? 0,
    createdAt: r.created_at.toISOString(),
  });
  const validateDiscoveryInput = (input: IShoppingProduct.IRequest): void => {
    if (input.minPrice !== undefined && input.minPrice !== null && (!Number.isFinite(input.minPrice) || input.minPrice < 0)) throw ErrorUtil.unprocessable("The minimum price is invalid.");
    if (input.maxPrice !== undefined && input.maxPrice !== null && (!Number.isFinite(input.maxPrice) || input.maxPrice < 0)) throw ErrorUtil.unprocessable("The maximum price is invalid.");
    if (input.minPrice !== undefined && input.minPrice !== null && input.maxPrice !== undefined && input.maxPrice !== null && input.minPrice > input.maxPrice) throw ErrorUtil.unprocessable("The price interval is invalid.");
    if (input.sort && !["newest", "priceAsc", "priceDesc"].includes(input.sort)) throw ErrorUtil.unprocessable("The product sort is unsupported.");
  };
  const discoverPage = (rows: ProductListRow[], input: IShoppingProduct.IRequest): IPage<IShoppingProduct.ISummary> => {
    const needle = input.search?.trim().toLocaleLowerCase();
    const matches = rows.filter((r) => {
      if (needle && !r.name.toLocaleLowerCase().includes(needle)) return false;
      const variants = r.variants ?? [];
      const prices = variants.length ? variants.map((v) => effectivePrice({ ...v, product: r })) : [r.base_price];
      if (input.minPrice !== undefined && input.minPrice !== null && input.maxPrice !== undefined && input.maxPrice !== null && !prices.some((price: number) => price >= input.minPrice! && price <= input.maxPrice!)) return false;
      if (input.minPrice !== undefined && input.minPrice !== null && (input.maxPrice === undefined || input.maxPrice === null) && !prices.some((price: number) => price >= input.minPrice!)) return false;
      if (input.maxPrice !== undefined && input.maxPrice !== null && (input.minPrice === undefined || input.minPrice === null) && !prices.some((price: number) => price <= input.maxPrice!)) return false;
      if (input.inStock === true && !variants.some((v) => stockFromMovements(v.movements ?? []) > 0)) return false;
      return true;
    });
    const sort = input.sort ?? "newest";
    matches.sort((a, b) => {
      if (sort === "newest") return b.created_at.getTime() - a.created_at.getTime() || b.id.localeCompare(a.id);
      const ap = a.variants?.length ? Math.min(...a.variants.map((v) => effectivePrice({ ...v, product: a }))) : a.base_price;
      const bp = b.variants?.length ? Math.min(...b.variants.map((v) => effectivePrice({ ...v, product: b }))) : b.base_price;
      const compared = ap - bp;
      return (sort === "priceAsc" ? compared : -compared) || (sort === "priceAsc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id));
    });
    const current = input.page ?? 1;
    const limit = input.limit ?? 100;
    const sliced = limit === 0 ? matches : matches.slice((current - 1) * limit, current * limit);
    return page(sliced.map(summary), matches.length, input);
  };
  async function productDetail(id: string): Promise<IShoppingProduct.IDetail> {
    const r: ProductDetailRow | null = await MyGlobal.prisma.shopping_products.findFirst({
      where: { id, deleted_at: null },
      include: {
        seller: true,
        category: true,
        images: { orderBy: { sequence: "asc" } },
        variants: { where: { deleted_at: null }, include: { movements: true } },
        reviews: { where: { deleted_at: null }, include: { user: true }, orderBy: [{ created_at: "desc" }, { id: "desc" }] },
      },
    });
    if (!r) throw ErrorUtil.notFound("No such product.");
    return {
    ...summary(r),
    categoryId: r.shopping_category_id,
    images: r.images.map((i) => ({
      id: i.id,
      uri: i.uri,
      sequence: i.sequence,
    })),
    variants: r.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      options: JSON.parse(v.options_json),
      priceOverride: v.price_override,
      stock: stockFromMovements(v.movements),
    })),
    averageRating: r.reviews.length ? Math.round((r.reviews.reduce((sum, x) => sum + x.rating, 0) / r.reviews.length) * 10) / 10 : null,
    reviewCount: r.reviews.length,
    reviews: r.reviews.map((x) => review(x, x.user)),
  };
  }
  const cartLine = (r: CartLineRow): IShoppingCart.ILine => ({
    id: r.id,
    variantId: r.shopping_variant_id,
    productId: r.variant.product.id,
    productName: r.variant.product.name,
    sku: r.variant.sku,
    options: JSON.parse(r.variant.options_json),
    unitPrice: effectivePrice(r.variant),
    quantity: r.quantity,
    subtotal: effectivePrice(r.variant) * r.quantity,
    available: !r.variant.deleted_at && stockFromMovements(r.variant.movements) >= r.quantity && !r.variant.product.deleted_at && !r.variant.product.seller.deleted_at && r.variant.product.seller.approval_status === "approved" && !r.variant.product.seller.banned && !r.variant.product.seller.suspended,
    shortage: !r.variant.deleted_at && stockFromMovements(r.variant.movements) > 0 && stockFromMovements(r.variant.movements) < r.quantity,
  });
  const item = (r: OrderItemRow): IShoppingOrder.IItem => ({
    id: r.id,
    productId: r.product_id,
    productName: r.product_name,
    variantSku: r.variant_sku,
    options: JSON.parse(r.variant_options_json),
    sellerId: r.shopping_seller_id,
    sellerName: r.seller_shop_name,
    unitPrice: r.unit_price,
    quantity: r.quantity,
    status: r.status as IShoppingOrder.IItem["status"],
    refundAmount: r.refunded_amount ?? null,
    purchasedAt: r.purchased_at.toISOString(),
    deliveredAt: r.delivered_at?.toISOString() ?? null,
    ...(r.order ? { orderId: r.order.id, orderNumber: r.order.order_number, recipientName: r.order.recipient_name, phone: r.order.phone, streetAddress: r.order.street_address, city: r.order.city, state: r.order.state, postalCode: r.order.postal_code, country: r.order.country } : {}),
    ...(r.product_description !== undefined ? { productDescription: r.product_description } : {}),
  });
  const deriveStatus = (statuses: string[]): string => {
    if (!statuses.length || statuses.every((s) => s === "paid")) return "paid";
    if (statuses.every((s) => s === "refunded")) return "refunded";
    if (statuses.every((s) => s === "cancelled")) return "cancelled";
    if (statuses.every((s) => s === "delivered")) return "delivered";
    if (statuses.some((s) => s === "delivered" || s === "refunded" || s === "cancelled") && new Set(statuses).size > 1) return "partially completed";
    return statuses.some((s) => s === "shipped") ? "shipped" : "partially completed";
  };
  async function orderDetail(id: string, customerId?: string, includeAdmin = false, sellerId?: string): Promise<IShoppingOrder.IDetail> {
    const r: OrderDetailRow | null = await MyGlobal.prisma.shopping_orders.findFirst({
      where: { id, ...(customerId ? { shopping_customer_id: customerId } : {}) },
      include: { items: { include: { requests: { include: { snapshots: { orderBy: [{ created_at: "asc" }, { id: "asc" }] } } } } }, shipments: { include: { items: true } } },
    });
    if (!r) throw ErrorUtil.notFound("No such order.");
    const visibleItems = sellerId ? r.items.filter((i) => i.shopping_seller_id === sellerId) : r.items;
    if (sellerId && visibleItems.length === 0) throw ErrorUtil.forbidden("The seller does not own any item in this order.");
    const requests = visibleItems.flatMap((i) => i.requests ?? []).map(request);
    const actions = includeAdmin
      ? await MyGlobal.prisma.shopping_admin_actions.findMany({ where: { OR: [{ target_kind: "order", target_id: r.id }, { target_kind: "order_item", target_id: { in: visibleItems.map((i) => i.id) } }] }, orderBy: [{ created_at: "asc" }, { id: "asc" }] })
      : [];
    return {
      id: r.id,
      orderNumber: r.order_number,
      total: r.total,
      status: deriveStatus(visibleItems.map((i) => i.status)),
      createdAt: r.created_at.toISOString(),
      itemCount: visibleItems.length,
      recipientName: r.recipient_name,
      phone: r.phone,
      streetAddress: r.street_address,
      city: r.city,
      state: r.state,
      postalCode: r.postal_code,
      country: r.country,
      items: visibleItems.map(item),
      requests,
      shipments: r.shipments.filter((s) => !sellerId || s.shopping_seller_id === sellerId).map((s) => ({
        id: s.id,
        sellerId: s.shopping_seller_id,
        carrier: s.carrier,
        trackingNumber: s.tracking_number,
        shippedAt: s.shipped_at.toISOString(),
        deliveredAt: s.delivered_at?.toISOString() ?? null,
        itemIds: s.items.map((i) => i.shopping_order_item_id),
      })),
      ...(includeAdmin ? { adminActions: actions.map((a) => ({ id: a.id, actorId: a.actor_id, targetKind: a.target_kind, targetId: a.target_id, action: a.action, reason: a.reason, outcome: a.outcome_json, createdAt: a.created_at.toISOString() })) } : {}),
    };
  }
  const request = (r: { id: string; shopping_order_item_id: string; kind: string; reason: string; status: string; created_at: Date; decided_at: Date | null; snapshots?: { id: string; before_status: string; after_status: string; before_reason: string; after_reason: string; actor_id: string; actor_kind: string; created_at: Date }[]; item?: { quantity: number; product_name: string; variant_sku: string; shopping_seller_id: string; delivered_at: Date | null; order?: { id: string; order_number: string } } }): IShoppingRequest.IDetail => ({
    id: r.id,
    itemId: r.shopping_order_item_id,
    kind: r.kind as "cancellation" | "refund",
    reason: r.reason,
    status: r.status,
    createdAt: r.created_at.toISOString(),
    decidedAt: r.decided_at?.toISOString() ?? null,
    ...(r.item ? { orderId: r.item.order?.id, orderNumber: r.item.order?.order_number, quantity: r.item.quantity, deliveredAt: r.item.delivered_at?.toISOString() ?? null, productName: r.item.product_name, variantSku: r.item.variant_sku, sellerId: r.item.shopping_seller_id } : {}),
    ...(r.snapshots ? { snapshots: r.snapshots.map((s) => ({ id: s.id, beforeStatus: s.before_status, afterStatus: s.after_status, beforeReason: s.before_reason, afterReason: s.after_reason, actorId: s.actor_id, actorKind: s.actor_kind, createdAt: s.created_at.toISOString() })) } : {}),
  });
  const review = (r: { id: string; shopping_product_id: string; shopping_user_id: string; rating: number; text: string | null; created_at: Date }, u: User): IShoppingReview.IDetail => ({
    id: r.id,
    productId: r.shopping_product_id,
    authorId: u.deleted_at ? null : r.shopping_user_id,
    authorName: u.deleted_at ? "deleted user" : (u.display_name ?? ""),
    rating: r.rating,
    text: r.text,
    createdAt: r.created_at.toISOString(),
  });
  const adminApplication = (r: { id: string; shopping_user_id: string; reason: string; status: string; created_at: Date; decided_at: Date | null; decided_by_id?: string | null; applicant_kind?: string }): IShoppingAdminApplication.IDetail => ({
    id: r.id,
    applicantId: r.shopping_user_id,
    applicantKind: (r.applicant_kind ?? "customer") as IShoppingAuth.Actor,
    reason: r.reason,
    status: r.status,
    createdAt: r.created_at.toISOString(),
    decidedAt: r.decided_at?.toISOString() ?? null,
    decidedById: r.decided_by_id ?? null,
  });
}

