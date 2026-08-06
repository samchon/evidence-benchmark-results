import crypto from "node:crypto";

import type * as api from "@benchmark/shopping2-api";
import type { Prisma } from "@prisma/sdk";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { AuthUtil } from "../utils/AuthUtil";

/** Business operations for the shopping domain. */
export namespace ShoppingProvider {
  function hash(value: string): string {
    return crypto.createHash("sha256").update(value).digest("hex");
  }
  function token(type: AuthUtil.Type, id: string, sessionId: string): api.IShoppingCustomer.IAuthorized {
    return { id, accessToken: AuthUtil.issue({ type, id, sessionId }), refreshToken: AuthUtil.issue({ type, id, sessionId }) };
  }
  function sellerToken(id: string, sessionId: string): api.IShoppingSeller.IAuthorized {
    return { id, accessToken: AuthUtil.issue({ type: "seller", id, sessionId }), refreshToken: AuthUtil.issue({ type: "seller", id, sessionId }) };
  }
  function adminToken(id: string, sessionId: string): api.IShoppingAdmin.IAuthorized {
    return { id, accessToken: AuthUtil.issue({ type: "admin", id, sessionId }), refreshToken: AuthUtil.issue({ type: "admin", id, sessionId }) };
  }
  function page<T extends object>(data: T[], total: number, input: { page?: null | number; limit?: null | number }): api.IPage<T> {
    const current = input.page ?? 1;
    const limit = input.limit ?? 100;
    return { pagination: { current, limit, records: total, pages: limit === 0 ? 1 : Math.max(1, Math.ceil(total / limit)) }, data };
  }
  function parseOptions(value: string): Record<string, string> {
    try {
      const parsed: unknown = JSON.parse(value);
      if (typeof parsed === "object" && parsed !== null) return parsed as Record<string, string>;
    } catch { /* malformed historical option values are exposed as an empty object */ }
    return {};
  }
  async function customer(id: string) {
    const row = await MyGlobal.prisma.shopping_customers.findUnique({ where: { id } });
    if (row === null || row.status !== "active") throw ErrorUtil.forbidden("Customer account is unavailable.");
    return row;
  }
  async function seller(id: string, selling = false) {
    const row = await MyGlobal.prisma.shopping_sellers.findUnique({ where: { id } });
    if (row === null || row.status === "deleted" || row.status === "banned") throw ErrorUtil.forbidden("Seller account is unavailable.");
    if (selling && row.status !== "approved") throw ErrorUtil.forbidden("Seller approval is required for catalog work.");
    return row;
  }
  async function admin(id: string) {
    const row = await MyGlobal.prisma.shopping_administrators.findUnique({ where: { id } });
    if (row === null || row.status !== "active") throw ErrorUtil.forbidden("Administrator account is unavailable.");
    return row;
  }
  /** Verifies administrator identity for controller-level moderation operations. */
  export async function requireAdmin(id: string): Promise<{ id: string; grade: string }> {
    const row = await admin(id);
    return { id: row.id, grade: row.grade };
  }
  function profile(row: { display_name: string; phone_number: string }): api.IShoppingCustomer.IProfile {
    return { displayName: row.display_name, phoneNumber: row.phone_number };
  }
  function toSellerProfile(row: { shop_name: string; shop_description: string; logo_image: string }): api.IShoppingSeller.IProfile {
    return { shopName: row.shop_name, shopDescription: row.shop_description, logoImage: row.logo_image };
  }
  function address(row: api.IShoppingCustomer.IAddress & { id: string }): api.IShoppingCustomer.IAddress {
    return row;
  }
  function productSummary(row: { id: string; name: string; description: string; base_price: number; status: string; shopping_category_id: string | null; created_at: Date; }): api.IShoppingProduct.ISummary {
    return { id: row.id, name: row.name, basePrice: row.base_price, status: row.status, categoryId: row.shopping_category_id, createdAt: row.created_at.toISOString() };
  }
  async function productDetail(id: string, includeDeleted = false): Promise<api.IShoppingProduct> {
    const row = await MyGlobal.prisma.shopping_products.findUnique({ where: { id }, include: { images: { orderBy: { sort_order: "asc" } }, variants: { include: { inventory: true }, orderBy: { created_at: "asc" } } } });
    if (row === null || (!includeDeleted && row.status === "deleted")) throw ErrorUtil.notFound("Product was not found.");
    return {
      id: row.id,
      sellerId: row.shopping_seller_id,
      name: row.name,
      description: row.description,
      basePrice: row.base_price,
      status: row.status,
      categoryId: row.shopping_category_id,
      createdAt: row.created_at.toISOString(),
      images: row.images.map((image) => ({ id: image.id, url: image.url, sortOrder: image.sort_order })),
      variants: row.variants.map((variant) => ({ id: variant.id, sku: variant.sku, options: parseOptions(variant.options_json), price: variant.price_override ?? row.base_price, stock: variant.inventory.reduce((sum, item) => sum + item.quantity, 0), status: variant.status })),
    };
  }

  /** Registers a customer and starts its first session. */
  export async function customerJoin(body: api.IShoppingCustomer.IJoin): Promise<api.IShoppingCustomer.IAuthorized> {
    const exists = await MyGlobal.prisma.shopping_customers.findUnique({ where: { email: body.email } });
    if (exists !== null) throw ErrorUtil.conflict("Customer email is already registered.");
    const id = crypto.randomUUID();
    const sessionId = crypto.randomUUID();
    await MyGlobal.prisma.shopping_customers.create({ data: { id, email: body.email, password_hash: hash(body.password), status: "active", created_at: new Date(), profile: { create: { id: crypto.randomUUID(), display_name: body.displayName, phone_number: body.phoneNumber, created_at: new Date(), updated_at: new Date() } }, sessions: { create: { id: sessionId, token_hash: hash(sessionId), expired_at: new Date(Date.now() + 2_592_000_000), created_at: new Date() } } } });
    return token("customer", id, sessionId);
  }
  /** Authenticates a customer. */
  export async function customerLogin(body: api.IShoppingCustomer.ILogin): Promise<api.IShoppingCustomer.IAuthorized> {
    const row = await MyGlobal.prisma.shopping_customers.findUnique({ where: { email: body.email } });
    if (row === null || row.status !== "active" || row.password_hash !== hash(body.password)) throw ErrorUtil.unauthorized("Invalid customer credentials.");
    const sessionId = crypto.randomUUID();
    await MyGlobal.prisma.shopping_customer_sessions.create({ data: { id: sessionId, shopping_customer_id: row.id, token_hash: hash(sessionId), expired_at: new Date(Date.now() + 2_592_000_000), created_at: new Date() } });
    return token("customer", row.id, sessionId);
  }
  /** Continues a customer session. */
  export async function customerRefresh(body: api.IShoppingCustomer.IRefresh): Promise<api.IShoppingCustomer.IAuthorized> {
    const payload = AuthUtil.parse(body.refreshToken);
    if (payload.type !== "customer") throw ErrorUtil.unauthorized("Refresh token actor mismatch.");
    const row = await MyGlobal.prisma.shopping_customer_sessions.findFirst({ where: { id: payload.sessionId, shopping_customer_id: payload.id, revoked_at: null, expired_at: { gt: new Date() } } });
    if (row === null) throw ErrorUtil.unauthorized("Session is no longer active.");
    return token("customer", payload.id, payload.sessionId);
  }
  /** Registers a seller in pending approval state. */
  export async function sellerJoin(body: api.IShoppingSeller.IJoin): Promise<api.IShoppingSeller.IAuthorized> {
    const exists = await MyGlobal.prisma.shopping_sellers.findUnique({ where: { email: body.email } });
    if (exists !== null) throw ErrorUtil.conflict("Seller email is already registered.");
    const id = crypto.randomUUID();
    const sessionId = crypto.randomUUID();
    await MyGlobal.prisma.shopping_sellers.create({ data: { id, email: body.email, password_hash: hash(body.password), status: "pending", created_at: new Date(), profile: { create: { id: crypto.randomUUID(), shop_name: body.shopName, shop_description: body.shopDescription, logo_image: body.logoImage, created_at: new Date(), updated_at: new Date() } }, sessions: { create: { id: sessionId, token_hash: hash(sessionId), expired_at: new Date(Date.now() + 2_592_000_000), created_at: new Date() } }, approvals: { create: { id: crypto.randomUUID(), status: "pending", created_at: new Date() } } } });
    return sellerToken(id, sessionId);
  }
  /** Authenticates an approved or pending seller. */
  export async function sellerLogin(body: api.IShoppingSeller.ILogin): Promise<api.IShoppingSeller.IAuthorized> {
    const row = await MyGlobal.prisma.shopping_sellers.findUnique({ where: { email: body.email } });
    if (row === null || row.status === "banned" || row.status === "deleted" || row.password_hash !== hash(body.password)) throw ErrorUtil.unauthorized("Invalid seller credentials.");
    const sessionId = crypto.randomUUID();
    await MyGlobal.prisma.shopping_seller_sessions.create({ data: { id: sessionId, shopping_seller_id: row.id, token_hash: hash(sessionId), expired_at: new Date(Date.now() + 2_592_000_000), created_at: new Date() } });
    return sellerToken(row.id, sessionId);
  }
  /** Continues a seller session. */
  export async function sellerRefresh(body: api.IShoppingSeller.IRefresh): Promise<api.IShoppingSeller.IAuthorized> {
    const payload = AuthUtil.parse(body.refreshToken);
    if (payload.type !== "seller") throw ErrorUtil.unauthorized("Refresh token actor mismatch.");
    await seller(payload.id);
    const row = await MyGlobal.prisma.shopping_seller_sessions.findFirst({ where: { id: payload.sessionId, shopping_seller_id: payload.id, revoked_at: null, expired_at: { gt: new Date() } } });
    if (row === null) throw ErrorUtil.unauthorized("Session is no longer active.");
    return sellerToken(payload.id, payload.sessionId);
  }
  /** Registers an administrator; the first account is the super administrator. */
  export async function adminJoin(body: api.IShoppingAdmin.IJoin): Promise<api.IShoppingAdmin.IAuthorized> {
    const exists = await MyGlobal.prisma.shopping_administrators.findUnique({ where: { email: body.email } });
    if (exists !== null) throw ErrorUtil.conflict("Administrator email is already registered.");
    const count = await MyGlobal.prisma.shopping_administrators.count();
    const id = crypto.randomUUID();
    const sessionId = crypto.randomUUID();
    await MyGlobal.prisma.shopping_administrators.create({ data: { id, email: body.email, password_hash: hash(body.password), grade: count === 0 ? "super" : "regular", status: "active", created_at: new Date(), sessions: { create: { id: sessionId, token_hash: hash(sessionId), expired_at: new Date(Date.now() + 2_592_000_000), created_at: new Date() } } } });
    return adminToken(id, sessionId);
  }
  /** Authenticates an administrator. */
  export async function adminLogin(body: api.IShoppingAdmin.ILogin): Promise<api.IShoppingAdmin.IAuthorized> {
    const row = await MyGlobal.prisma.shopping_administrators.findUnique({ where: { email: body.email } });
    if (row === null || row.status !== "active" || row.password_hash !== hash(body.password)) throw ErrorUtil.unauthorized("Invalid administrator credentials.");
    const sessionId = crypto.randomUUID();
    await MyGlobal.prisma.shopping_administrator_sessions.create({ data: { id: sessionId, shopping_administrator_id: row.id, token_hash: hash(sessionId), expired_at: new Date(Date.now() + 2_592_000_000), created_at: new Date() } });
    return adminToken(row.id, sessionId);
  }
  /** Continues an administrator session. */
  export async function adminRefresh(body: api.IShoppingAdmin.IRefresh): Promise<api.IShoppingAdmin.IAuthorized> {
    const payload = AuthUtil.parse(body.refreshToken);
    if (payload.type !== "admin") throw ErrorUtil.unauthorized("Refresh token actor mismatch.");
    await admin(payload.id);
    const row = await MyGlobal.prisma.shopping_administrator_sessions.findFirst({ where: { id: payload.sessionId, shopping_administrator_id: payload.id, revoked_at: null, expired_at: { gt: new Date() } } });
    if (row === null) throw ErrorUtil.unauthorized("Session is no longer active.");
    return adminToken(payload.id, payload.sessionId);
  }

  /** Reads the authenticated customer profile. */
  export async function customerProfile(id: string): Promise<api.IShoppingCustomer.IProfile> {
    await customer(id);
    const row = await MyGlobal.prisma.shopping_customer_profiles.findUnique({ where: { shopping_customer_id: id } });
    if (row === null) throw ErrorUtil.notFound("Customer profile was not found.");
    return profile(row);
  }
  /** Updates the authenticated customer profile. */
  export async function updateCustomerProfile(id: string, body: api.IShoppingCustomer.IProfileUpdate): Promise<api.IShoppingCustomer.IProfile> {
    await customer(id);
    const row = await MyGlobal.prisma.shopping_customer_profiles.update({ where: { shopping_customer_id: id }, data: { display_name: body.displayName, phone_number: body.phoneNumber, updated_at: new Date() } });
    return profile(row);
  }
  /** Lists owned addresses. */
  export async function addresses(id: string): Promise<api.IShoppingCustomer.IAddress[]> {
    await customer(id);
    const rows = await MyGlobal.prisma.shopping_shipping_addresses.findMany({ where: { shopping_customer_id: id }, orderBy: [{ is_default: "desc" }, { created_at: "asc" }] });
    return rows.map((row) => ({ id: row.id, recipientName: row.recipient_name, recipientPhone: row.recipient_phone, streetAddress: row.street_address, city: row.city, state: row.state, postalCode: row.postal_code, country: row.country, isDefault: row.is_default }));
  }
  /** Creates an owned address. */
  export async function createAddress(id: string, body: api.IShoppingCustomer.IAddressCreate): Promise<api.IShoppingCustomer.IAddress> {
    await customer(id);
    const row = await MyGlobal.prisma.shopping_shipping_addresses.create({ data: { id: crypto.randomUUID(), shopping_customer_id: id, recipient_name: body.recipientName, recipient_phone: body.recipientPhone, street_address: body.streetAddress, city: body.city, state: body.state, postal_code: body.postalCode, country: body.country, is_default: false, created_at: new Date(), updated_at: new Date() } });
    return { id: row.id, recipientName: row.recipient_name, recipientPhone: row.recipient_phone, streetAddress: row.street_address, city: row.city, state: row.state, postalCode: row.postal_code, country: row.country, isDefault: row.is_default };
  }
  /** Updates an owned address. */
  export async function updateAddress(id: string, addressId: string, body: api.IShoppingCustomer.IAddressUpdate): Promise<api.IShoppingCustomer.IAddress> {
    await customer(id);
    const existing = await MyGlobal.prisma.shopping_shipping_addresses.findFirst({ where: { id: addressId, shopping_customer_id: id } });
    if (existing === null) throw ErrorUtil.notFound("Address was not found.");
    const row = await MyGlobal.prisma.shopping_shipping_addresses.update({ where: { id: addressId }, data: { recipient_name: body.recipientName, recipient_phone: body.recipientPhone, street_address: body.streetAddress, city: body.city, state: body.state, postal_code: body.postalCode, country: body.country, updated_at: new Date() } });
    return { id: row.id, recipientName: row.recipient_name, recipientPhone: row.recipient_phone, streetAddress: row.street_address, city: row.city, state: row.state, postalCode: row.postal_code, country: row.country, isDefault: row.is_default };
  }
  /** Deletes an owned address. */
  export async function deleteAddress(id: string, addressId: string): Promise<api.IShoppingResult> {
    await customer(id);
    const existing = await MyGlobal.prisma.shopping_shipping_addresses.findFirst({ where: { id: addressId, shopping_customer_id: id } });
    if (existing === null) throw ErrorUtil.notFound("Address was not found.");
    await MyGlobal.prisma.shopping_shipping_addresses.delete({ where: { id: addressId } });
    return { status: "deleted" };
  }
  /** Selects the sole default address. */
  export async function setDefaultAddress(id: string, addressId: string): Promise<api.IShoppingCustomer.IAddress> {
    await customer(id);
    const existing = await MyGlobal.prisma.shopping_shipping_addresses.findFirst({ where: { id: addressId, shopping_customer_id: id } });
    if (existing === null) throw ErrorUtil.notFound("Address was not found.");
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.shopping_shipping_addresses.updateMany({ where: { shopping_customer_id: id }, data: { is_default: false } }),
      MyGlobal.prisma.shopping_shipping_addresses.update({ where: { id: addressId }, data: { is_default: true, updated_at: new Date() } }),
    ]);
    return { id: existing.id, recipientName: existing.recipient_name, recipientPhone: existing.recipient_phone, streetAddress: existing.street_address, city: existing.city, state: existing.state, postalCode: existing.postal_code, country: existing.country, isDefault: true };
  }

  /** Reads the authenticated seller profile. */
  export async function sellerProfile(id: string): Promise<api.IShoppingSeller.IProfile> {
    await seller(id);
    const row = await MyGlobal.prisma.shopping_seller_profiles.findUnique({ where: { shopping_seller_id: id } });
    if (row === null) throw ErrorUtil.notFound("Seller profile was not found.");
    return toSellerProfile(row);
  }
  /** Reads a public seller profile. */
  export async function publicSellerProfile(id: string): Promise<api.IShoppingSeller.IProfile> {
    const row = await MyGlobal.prisma.shopping_seller_profiles.findUnique({ where: { shopping_seller_id: id } });
    if (row === null) throw ErrorUtil.notFound("Seller profile was not found.");
    return toSellerProfile(row);
  }
  /** Updates a seller profile and records an immutable revision. */
  export async function updateSellerProfile(id: string, body: api.IShoppingSeller.IProfileUpdate): Promise<api.IShoppingSeller.IProfile> {
    const owner = await seller(id);
    if (owner.status === "suspended") throw ErrorUtil.forbidden("Suspended sellers cannot edit catalog or profile evidence.");
    const row = await MyGlobal.prisma.shopping_seller_profiles.findUniqueOrThrow({ where: { shopping_seller_id: id } });
    const next = await MyGlobal.prisma.$transaction(async (tx) => {
      const updated = await tx.shopping_seller_profiles.update({ where: { id: row.id }, data: { shop_name: body.shopName, shop_description: body.shopDescription, logo_image: body.logoImage, updated_at: new Date() } });
      await tx.shopping_seller_profile_snapshots.create({ data: { id: crypto.randomUUID(), shopping_seller_profile_id: row.id, shop_name: updated.shop_name, shop_description: updated.shop_description, logo_image: updated.logo_image, changed_fields: "shop_name,shop_description,logo_image", created_at: new Date() } });
      return updated;
    });
    return toSellerProfile(next);
  }
  /** Reads seller approval state. */
  export async function sellerApproval(id: string): Promise<api.IShoppingSeller.IApproval> {
    const row = await seller(id);
    return { status: row.status, reason: row.rejection_reason };
  }
  /** Resubmits a rejected seller approval. */
  export async function sellerResubmit(id: string): Promise<api.IShoppingSeller.IApproval> {
    const row = await seller(id);
    if (row.status !== "rejected") throw ErrorUtil.conflict("Only a rejected seller may resubmit.");
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.shopping_sellers.update({ where: { id }, data: { status: "pending", rejection_reason: null } }),
      MyGlobal.prisma.shopping_seller_approval_requests.create({ data: { id: crypto.randomUUID(), shopping_seller_id: id, status: "pending", created_at: new Date() } }),
    ]);
    return { status: "pending", reason: null };
  }

  /** Creates a category. */
  export async function createCategory(body: api.IShoppingCategory.ICreate): Promise<api.IShoppingCategory> {
    if (body.parentId !== undefined && body.parentId !== null) {
      const parent = await MyGlobal.prisma.shopping_categories.findUnique({ where: { id: body.parentId } });
      if (parent === null || parent.parent_id !== null || parent.status !== "active") throw ErrorUtil.unprocessable("A category child must use a live top-level category.");
    }
    const row = await MyGlobal.prisma.shopping_categories.create({ data: { id: crypto.randomUUID(), name: body.name, description: body.description, parent_id: body.parentId ?? null, status: "active", created_at: new Date(), updated_at: new Date() } });
    return { id: row.id, name: row.name, description: row.description, parentId: row.parent_id, status: row.status, children: [] };
  }
  /** Updates a category. */
  export async function updateCategory(id: string, body: api.IShoppingCategory.IUpdate): Promise<api.IShoppingCategory> {
    const row = await MyGlobal.prisma.shopping_categories.update({ where: { id }, data: { name: body.name, description: body.description, updated_at: new Date() } });
    return { id: row.id, name: row.name, description: row.description, parentId: row.parent_id, status: row.status, children: [] };
  }
  /** Retires a category and uncategorizes its products. */
  export async function deleteCategory(id: string): Promise<api.IShoppingResult> {
    const row = await MyGlobal.prisma.shopping_categories.findUnique({ where: { id } });
    if (row === null) throw ErrorUtil.notFound("Category was not found.");
    const ids = row.parent_id === null ? [id, ...(await MyGlobal.prisma.shopping_categories.findMany({ where: { parent_id: id }, select: { id: true } })).map((child) => child.id)] : [id];
    await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_products.updateMany({ where: { shopping_category_id: { in: ids } }, data: { shopping_category_id: null } }), MyGlobal.prisma.shopping_categories.updateMany({ where: { id: { in: ids } }, data: { status: "deleted", updated_at: new Date() } })]);
    return { status: "deleted" };
  }
  /** Lists the complete two-level category tree. */
  export async function listCategories(): Promise<api.IShoppingCategory[]> {
    const rows = await MyGlobal.prisma.shopping_categories.findMany({ where: { status: "active", parent_id: null }, include: { children: { where: { status: "active" }, orderBy: [{ name: "asc" }, { id: "asc" }] } }, orderBy: [{ name: "asc" }, { id: "asc" }] });
    return rows.map((row) => ({ id: row.id, name: row.name, description: row.description, parentId: row.parent_id, status: row.status, children: row.children.map((child) => ({ id: child.id, name: child.name, description: child.description, parentId: child.parent_id, status: child.status, children: [] })) }));
  }

  /** Creates a seller product and an initial immutable snapshot. */
  export async function createProduct(sellerId: string, body: api.IShoppingProduct.ICreate): Promise<api.IShoppingProduct> {
    await seller(sellerId, true);
    if (body.categoryId !== undefined && body.categoryId !== null) {
      const category = await MyGlobal.prisma.shopping_categories.findUnique({ where: { id: body.categoryId } });
      if (category === null || category.status !== "active") throw ErrorUtil.unprocessable("Category is unavailable.");
    }
    const id = crypto.randomUUID();
    await MyGlobal.prisma.shopping_products.create({ data: { id, shopping_seller_id: sellerId, shopping_category_id: body.categoryId ?? null, name: body.name, description: body.description, base_price: body.basePrice, status: "active", created_at: new Date(), updated_at: new Date() } });
    return productDetail(id);
  }
  /** Updates an owned product and records a complete snapshot. */
  export async function updateProduct(sellerId: string, id: string, body: api.IShoppingProduct.IUpdate): Promise<api.IShoppingProduct> {
    await seller(sellerId, true);
    const existing = await MyGlobal.prisma.shopping_products.findFirst({ where: { id, shopping_seller_id: sellerId, status: "active" } });
    if (existing === null) throw ErrorUtil.notFound("Product was not found.");
    if (body.categoryId !== undefined && body.categoryId !== null) {
      const category = await MyGlobal.prisma.shopping_categories.findUnique({ where: { id: body.categoryId } });
      if (category === null || category.status !== "active") throw ErrorUtil.unprocessable("Category is unavailable.");
    }
    await MyGlobal.prisma.$transaction(async (tx) => {
      const updated = await tx.shopping_products.update({ where: { id }, data: { name: body.name, description: body.description, base_price: body.basePrice, shopping_category_id: body.categoryId ?? null, updated_at: new Date() } });
      const aggregate = await tx.shopping_products.findUniqueOrThrow({ where: { id }, include: { images: { orderBy: { sort_order: "asc" } }, variants: { include: { inventory: true } } } });
      await tx.shopping_product_snapshots.create({ data: { id: crypto.randomUUID(), shopping_product_id: id, name: updated.name, description: updated.description, category_id: updated.shopping_category_id, base_price: updated.base_price, aggregate_json: JSON.stringify({ images: aggregate.images, variants: aggregate.variants }), changed_fields: "name,description,base_price,category", created_at: new Date() } });
    });
    return productDetail(id);
  }
  /** Soft-deletes an owned product when no open commerce obligation exists. */
  export async function deleteProduct(sellerId: string, id: string): Promise<api.IShoppingResult> {
    await seller(sellerId, true);
    const existing = await MyGlobal.prisma.shopping_products.findFirst({ where: { id, shopping_seller_id: sellerId, status: "active" }, include: { variants: { include: { order_items: true } } } });
    if (existing === null) throw ErrorUtil.notFound("Product was not found.");
    if (existing.variants.some((variant) => variant.order_items.some((item) => item.status === "paid" || item.status === "shipped"))) throw ErrorUtil.conflict("Product has active fulfillment obligations.");
    await MyGlobal.prisma.shopping_products.update({ where: { id }, data: { status: "deleted", deleted_at: new Date(), updated_at: new Date() } });
    await MyGlobal.prisma.shopping_wishlist_entries.deleteMany({ where: { shopping_product_id: id } });
    return { status: "deleted" };
  }
  /** Lists visible catalog products. */
  export async function listProducts(input: api.IShoppingProduct.IRequest): Promise<api.IPage<api.IShoppingProduct.ISummary>> {
    const where: Prisma.shopping_productsWhereInput = { status: "active", seller: { status: "approved" }, ...(input.categoryId !== undefined && input.categoryId !== null ? { shopping_category_id: input.categoryId } : {}), ...(input.search !== undefined && input.search !== null ? { OR: [{ name: { contains: input.search } }, { description: { contains: input.search } }] } : {}) };
    const current = input.page ?? 1; const limit = input.limit ?? 100; const [records, rows] = await Promise.all([MyGlobal.prisma.shopping_products.count({ where }), MyGlobal.prisma.shopping_products.findMany({ where, orderBy: [{ created_at: "desc" }, { id: "desc" }], skip: limit === 0 ? undefined : (current - 1) * limit, take: limit === 0 ? undefined : limit })]);
    return page(rows.map(productSummary), records, input);
  }
  /** Reads one visible product. */
  export async function getProduct(id: string): Promise<api.IShoppingProduct> { return productDetail(id); }
  /** Lists product snapshots visible to the owner or an administrator. */
  export async function productSnapshots(actor: { type: "seller" | "admin"; id: string }, productId: string): Promise<api.IShoppingProduct.ISnapshot[]> {
    const row = await MyGlobal.prisma.shopping_products.findUnique({ where: { id: productId } }); if (row === null) throw ErrorUtil.notFound("Product was not found."); if (actor.type === "seller" && row.shopping_seller_id !== actor.id) throw ErrorUtil.forbidden("Product ownership is required.");
    const rows = await MyGlobal.prisma.shopping_product_snapshots.findMany({ where: { shopping_product_id: productId }, orderBy: { created_at: "desc" } }); return rows.map((item) => ({ id: item.id, name: item.name, description: item.description, basePrice: item.base_price, changedFields: item.changed_fields, createdAt: item.created_at.toISOString() }));
  }
  /** Adds an ordered product image. */
  export async function addProductImage(sellerId: string, productId: string, body: api.IShoppingProduct.IImageCreate): Promise<api.IShoppingProduct.IImage> { await seller(sellerId, true); const product = await MyGlobal.prisma.shopping_products.findFirst({ where: { id: productId, shopping_seller_id: sellerId, status: "active" }, include: { images: true } }); if (product === null) throw ErrorUtil.notFound("Product was not found."); const row = await MyGlobal.prisma.shopping_product_images.create({ data: { id: crypto.randomUUID(), shopping_product_id: productId, url: body.url, sort_order: product.images.length, created_at: new Date() } }); return { id: row.id, url: row.url, sortOrder: row.sort_order }; }
  /** Reorders product images. */
  export async function reorderProductImages(sellerId: string, productId: string, body: api.IShoppingProduct.IImageReorder): Promise<api.IShoppingProduct.IImage[]> { await seller(sellerId, true); const product = await MyGlobal.prisma.shopping_products.findFirst({ where: { id: productId, shopping_seller_id: sellerId, status: "active" }, include: { images: true } }); if (product === null) throw ErrorUtil.notFound("Product was not found."); const owned = new Set(product.images.map((image) => image.id)); if (body.imageIds.length !== product.images.length || body.imageIds.some((id) => !owned.has(id))) throw ErrorUtil.unprocessable("Image ordering must contain each owned image exactly once."); await MyGlobal.prisma.$transaction(body.imageIds.map((id, index) => MyGlobal.prisma.shopping_product_images.update({ where: { id }, data: { sort_order: index } }))); const rows = await MyGlobal.prisma.shopping_product_images.findMany({ where: { shopping_product_id: productId }, orderBy: { sort_order: "asc" } }); return rows.map((row) => ({ id: row.id, url: row.url, sortOrder: row.sort_order })); }
  /** Deletes one owned product image. */
  export async function deleteProductImage(sellerId: string, imageId: string): Promise<api.IShoppingResult> { await seller(sellerId, true); const image = await MyGlobal.prisma.shopping_product_images.findUnique({ where: { id: imageId }, include: { product: true } }); if (image === null || image.product.shopping_seller_id !== sellerId) throw ErrorUtil.notFound("Product image was not found."); await MyGlobal.prisma.shopping_product_images.delete({ where: { id: imageId } }); return { status: "deleted" }; }
  /** Retires a policy-violating product while preserving order evidence. */
  export async function forceDeleteProduct(adminId: string, productId: string): Promise<api.IShoppingResult> { await admin(adminId); const row = await MyGlobal.prisma.shopping_products.findUnique({ where: { id: productId } }); if (row === null) throw ErrorUtil.notFound("Product was not found."); await MyGlobal.prisma.shopping_products.update({ where: { id: productId }, data: { status: "deleted", deleted_at: new Date(), updated_at: new Date() } }); return { status: "deleted" }; }
  /** Adds a variant to an owned product. */
  export async function createVariant(sellerId: string, productId: string, body: api.IShoppingProduct.IVariantCreate): Promise<api.IShoppingProduct.IVariant> {
    await seller(sellerId, true);
    const product = await MyGlobal.prisma.shopping_products.findFirst({ where: { id: productId, shopping_seller_id: sellerId, status: "active" } });
    if (product === null) throw ErrorUtil.notFound("Product was not found.");
    const id = crypto.randomUUID();
    const row = await MyGlobal.prisma.shopping_product_variants.create({ data: { id, shopping_product_id: productId, sku: body.sku, options_json: JSON.stringify(body.options), price_override: body.priceOverride ?? null, status: "active", created_at: new Date(), updated_at: new Date() } });
    return { id: row.id, sku: row.sku, options: body.options, price: row.price_override ?? product.base_price, stock: 0, status: row.status };
  }
  /** Updates an owned variant. */
  export async function updateVariant(sellerId: string, id: string, body: api.IShoppingProduct.IVariantUpdate): Promise<api.IShoppingProduct.IVariant> {
    await seller(sellerId, true);
    const existing = await MyGlobal.prisma.shopping_product_variants.findFirst({ where: { id, status: "active" }, include: { product: true, inventory: true } });
    if (existing === null || existing.product.shopping_seller_id !== sellerId) throw ErrorUtil.notFound("Variant was not found.");
    const row = await MyGlobal.prisma.shopping_product_variants.update({ where: { id }, data: { sku: body.sku, options_json: JSON.stringify(body.options), price_override: body.priceOverride ?? null, updated_at: new Date() } });
    return { id: row.id, sku: row.sku, options: body.options, price: row.price_override ?? existing.product.base_price, stock: existing.inventory.reduce((sum, item) => sum + item.quantity, 0), status: row.status };
  }
  /** Retires an owned variant. */
  export async function deleteVariant(sellerId: string, id: string): Promise<api.IShoppingResult> {
    await seller(sellerId, true);
    const existing = await MyGlobal.prisma.shopping_product_variants.findFirst({ where: { id, status: "active" }, include: { product: true, order_items: true } });
    if (existing === null || existing.product.shopping_seller_id !== sellerId) throw ErrorUtil.notFound("Variant was not found.");
    if (existing.order_items.some((item) => item.status === "paid" || item.status === "shipped")) throw ErrorUtil.conflict("Variant has active fulfillment obligations.");
    await MyGlobal.prisma.shopping_product_variants.update({ where: { id }, data: { status: "deleted", deleted_at: new Date(), updated_at: new Date() } });
    return { status: "deleted" };
  }
  /** Appends an inventory movement and returns current stock. */
  export async function inventory(sellerId: string, variantId: string, body: api.IShoppingProduct.IInventoryCreate): Promise<api.IShoppingProduct.IVariant> {
    await seller(sellerId, true);
    const variant = await MyGlobal.prisma.shopping_product_variants.findFirst({ where: { id: variantId, status: "active" }, include: { product: true, inventory: true } });
    if (variant === null || variant.product.shopping_seller_id !== sellerId) throw ErrorUtil.notFound("Variant was not found.");
    const stock = variant.inventory.reduce((sum, item) => sum + item.quantity, 0) + body.quantity;
    if (stock < 0) throw ErrorUtil.conflict("Inventory cannot become negative.");
    await MyGlobal.prisma.shopping_inventory_movements.create({ data: { id: crypto.randomUUID(), shopping_product_variant_id: variantId, quantity: body.quantity, actor_id: sellerId, reason: body.reason, created_at: new Date() } });
    return { id: variant.id, sku: variant.sku, options: parseOptions(variant.options_json), price: variant.price_override ?? variant.product.base_price, stock, status: variant.status };
  }
  /** Reads inventory movement history. */
  export async function inventoryHistory(sellerId: string, variantId: string): Promise<api.IShoppingProduct.IInventory[]> {
    await seller(sellerId);
    const variant = await MyGlobal.prisma.shopping_product_variants.findFirst({ where: { id: variantId }, include: { product: true } });
    if (variant === null || variant.product.shopping_seller_id !== sellerId) throw ErrorUtil.notFound("Variant was not found.");
    const rows = await MyGlobal.prisma.shopping_inventory_movements.findMany({ where: { shopping_product_variant_id: variantId }, orderBy: { created_at: "asc" } });
    return rows.map((row) => ({ id: row.id, quantity: row.quantity, reason: row.reason, createdAt: row.created_at.toISOString() }));
  }

  /** Lists pending seller approvals for administrators. */
  export async function pendingSellers(adminId: string, input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingSeller>> {
    await admin(adminId);
    const current = input.page ?? 1; const limit = input.limit ?? 100;
    const [records, rows] = await Promise.all([MyGlobal.prisma.shopping_sellers.count({ where: { status: "pending" } }), MyGlobal.prisma.shopping_sellers.findMany({ where: { status: "pending" }, include: { profile: true }, orderBy: [{ created_at: "asc" }, { id: "asc" }], skip: limit === 0 ? undefined : (current - 1) * limit, take: limit === 0 ? undefined : limit })]);
    return page(rows.map((row) => ({ id: row.id, email: row.email, status: row.status, rejectionReason: row.rejection_reason, profile: row.profile === null ? { shopName: "", shopDescription: "", logoImage: "" } : toSellerProfile(row.profile) })), records, input);
  }
  /** Approves one pending seller request. */
  export async function approveSeller(adminId: string, sellerId: string): Promise<api.IShoppingSeller.IApproval> {
    await admin(adminId);
    const row = await MyGlobal.prisma.shopping_sellers.findUnique({ where: { id: sellerId } });
    if (row === null || row.status !== "pending") throw ErrorUtil.conflict("Seller is not pending approval.");
    await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_sellers.update({ where: { id: sellerId }, data: { status: "approved", rejection_reason: null } }), MyGlobal.prisma.shopping_seller_approval_requests.updateMany({ where: { shopping_seller_id: sellerId, status: "pending" }, data: { status: "approved", decided_by: adminId, decided_at: new Date() } })]);
    return { status: "approved", reason: null };
  }
  /** Rejects one pending seller request with a retained reason. */
  export async function rejectSeller(adminId: string, sellerId: string, reason: string): Promise<api.IShoppingSeller.IApproval> {
    await admin(adminId);
    if (reason.trim().length === 0) throw ErrorUtil.unprocessable("A rejection reason is required.");
    const row = await MyGlobal.prisma.shopping_sellers.findUnique({ where: { id: sellerId } });
    if (row === null || row.status !== "pending") throw ErrorUtil.conflict("Seller is not pending approval.");
    await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_sellers.update({ where: { id: sellerId }, data: { status: "rejected", rejection_reason: reason } }), MyGlobal.prisma.shopping_seller_approval_requests.updateMany({ where: { shopping_seller_id: sellerId, status: "pending" }, data: { status: "rejected", reason, decided_by: adminId, decided_at: new Date() } })]);
    return { status: "rejected", reason };
  }
  /** Suspends an approved seller without deleting order duties. */
  export async function suspendSeller(adminId: string, sellerId: string): Promise<api.IShoppingResult> {
    await admin(adminId);
    const row = await MyGlobal.prisma.shopping_sellers.findUnique({ where: { id: sellerId } });
    if (row === null || row.status !== "approved") throw ErrorUtil.conflict("Only an approved seller may be suspended.");
    await MyGlobal.prisma.shopping_sellers.update({ where: { id: sellerId }, data: { status: "suspended" } });
    return { status: "suspended" };
  }
  /** Restores a suspended seller to approved state. */
  export async function unsuspendSeller(adminId: string, sellerId: string): Promise<api.IShoppingResult> {
    await admin(adminId);
    const row = await MyGlobal.prisma.shopping_sellers.findUnique({ where: { id: sellerId } });
    if (row === null || row.status !== "suspended") throw ErrorUtil.conflict("Seller is not suspended.");
    await MyGlobal.prisma.shopping_sellers.update({ where: { id: sellerId }, data: { status: "approved" } });
    return { status: "approved" };
  }

  /** Adds or merges one live product in the customer's wishlist. */
  export async function addWishlist(customerId: string, productId: string): Promise<api.IShoppingCustomer.IWishlistEntry> {
    await customer(customerId);
    const product = await MyGlobal.prisma.shopping_products.findFirst({ where: { id: productId, status: "active", seller: { status: "approved" } } });
    if (product === null) throw ErrorUtil.notFound("Product was not found.");
    let wishlist = await MyGlobal.prisma.shopping_wishlists.findUnique({ where: { shopping_customer_id: customerId } });
    if (wishlist === null) wishlist = await MyGlobal.prisma.shopping_wishlists.create({ data: { id: crypto.randomUUID(), shopping_customer_id: customerId, created_at: new Date() } });
    const row = await MyGlobal.prisma.shopping_wishlist_entries.upsert({ where: { shopping_wishlist_id_shopping_product_id: { shopping_wishlist_id: wishlist.id, shopping_product_id: productId } }, create: { id: crypto.randomUUID(), shopping_wishlist_id: wishlist.id, shopping_product_id: productId, created_at: new Date() }, update: {} });
    return { id: row.id, product: productSummary(product), createdAt: row.created_at.toISOString() };
  }
  /** Lists a customer's retained wishlist. */
  export async function listWishlist(customerId: string, input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingCustomer.IWishlistEntry>> {
    await customer(customerId);
    const wishlist = await MyGlobal.prisma.shopping_wishlists.findUnique({ where: { shopping_customer_id: customerId } });
    if (wishlist === null) return page([], 0, input);
    const where = { shopping_wishlist_id: wishlist.id, product: { status: "active" } };
    const current = input.page ?? 1; const limit = input.limit ?? 100;
    const [records, rows] = await Promise.all([MyGlobal.prisma.shopping_wishlist_entries.count({ where }), MyGlobal.prisma.shopping_wishlist_entries.findMany({ where, include: { product: true }, orderBy: [{ created_at: "desc" }, { id: "desc" }], skip: limit === 0 ? undefined : (current - 1) * limit, take: limit === 0 ? undefined : limit })]);
    return page(rows.map((row) => ({ id: row.id, product: productSummary(row.product), createdAt: row.created_at.toISOString() })), records, input);
  }
  /** Removes one wishlist entry. */
  export async function removeWishlist(customerId: string, productId: string): Promise<api.IShoppingResult> {
    await customer(customerId);
    const wishlist = await MyGlobal.prisma.shopping_wishlists.findUnique({ where: { shopping_customer_id: customerId } });
    if (wishlist !== null) await MyGlobal.prisma.shopping_wishlist_entries.deleteMany({ where: { shopping_wishlist_id: wishlist.id, shopping_product_id: productId } });
    return { status: "deleted" };
  }
  function cartView(row: { id: string; shopping_customer_id: string; lines: Array<{ id: string; quantity: number; variant: { id: string; status: string; price_override: number | null; product: { base_price: number; status: string }; inventory: Array<{ quantity: number }> } }> }): api.IShoppingCart {
    const lines = row.lines.map((line) => { const price = line.variant.price_override ?? line.variant.product.base_price; const stock = line.variant.inventory.reduce((sum, movement) => sum + movement.quantity, 0); return { id: line.id, variantId: line.variant.id, quantity: line.quantity, price, available: line.variant.product.status === "active" && line.variant.status === "active" && stock >= line.quantity }; });
    return { id: row.id, lines, total: lines.reduce((sum, line) => sum + line.price * line.quantity, 0) };
  }
  async function getOrCreateCart(customerId: string) {
    let cart = await MyGlobal.prisma.shopping_carts.findUnique({ where: { shopping_customer_id: customerId } });
    if (cart === null) cart = await MyGlobal.prisma.shopping_carts.create({ data: { id: crypto.randomUUID(), shopping_customer_id: customerId, created_at: new Date(), updated_at: new Date() } });
    return cart;
  }
  /** Adds or merges a live variant in the cart. */
  export async function addCart(customerId: string, body: api.IShoppingCart.ICreate): Promise<api.IShoppingCart> {
    await customer(customerId); if (body.quantity < 1) throw ErrorUtil.unprocessable("Quantity must be positive.");
    const variant = await MyGlobal.prisma.shopping_product_variants.findFirst({ where: { id: body.variantId, status: "active", product: { status: "active", seller: { status: "approved" } } } });
    if (variant === null) throw ErrorUtil.notFound("Variant was not found.");
    const cart = await getOrCreateCart(customerId); const line = await MyGlobal.prisma.shopping_cart_lines.findUnique({ where: { shopping_cart_id_shopping_product_variant_id: { shopping_cart_id: cart.id, shopping_product_variant_id: body.variantId } } });
    if (line === null) await MyGlobal.prisma.shopping_cart_lines.create({ data: { id: crypto.randomUUID(), shopping_cart_id: cart.id, shopping_product_variant_id: body.variantId, quantity: body.quantity, created_at: new Date(), updated_at: new Date() } });
    else await MyGlobal.prisma.shopping_cart_lines.update({ where: { id: line.id }, data: { quantity: line.quantity + body.quantity, updated_at: new Date() } });
    await MyGlobal.prisma.shopping_carts.update({ where: { id: cart.id }, data: { updated_at: new Date() } });
    return getCart(customerId);
  }
  /** Reads the current cart and derived availability. */
  export async function getCart(customerId: string): Promise<api.IShoppingCart> {
    await customer(customerId); const cart = await getOrCreateCart(customerId);
    const row = await MyGlobal.prisma.shopping_carts.findUniqueOrThrow({ where: { id: cart.id }, include: { lines: { include: { variant: { include: { product: true, inventory: true } } }, orderBy: { created_at: "asc" } } } });
    return cartView(row);
  }
  /** Changes one cart line quantity. */
  export async function updateCart(customerId: string, lineId: string, body: api.IShoppingCart.IUpdate): Promise<api.IShoppingCart> {
    await customer(customerId); const cart = await getOrCreateCart(customerId); const line = await MyGlobal.prisma.shopping_cart_lines.findFirst({ where: { id: lineId, shopping_cart_id: cart.id } }); if (line === null) throw ErrorUtil.notFound("Cart line was not found.");
    await MyGlobal.prisma.shopping_cart_lines.update({ where: { id: lineId }, data: { quantity: body.quantity, updated_at: new Date() } }); return getCart(customerId);
  }
  /** Removes one cart line. */
  export async function removeCart(customerId: string, lineId: string): Promise<api.IShoppingCart> {
    await customer(customerId); const cart = await getOrCreateCart(customerId); await MyGlobal.prisma.shopping_cart_lines.deleteMany({ where: { id: lineId, shopping_cart_id: cart.id } }); return getCart(customerId);
  }
  /** Creates a paid order from all eligible cart lines and decrements stock atomically. */
  export async function checkout(customerId: string, body: api.IShoppingOrder.ICreate): Promise<api.IShoppingOrder> {
    await customer(customerId); const addressRow = await MyGlobal.prisma.shopping_shipping_addresses.findFirst({ where: { id: body.addressId, shopping_customer_id: customerId } }); if (addressRow === null) throw ErrorUtil.unprocessable("The shipping address is not owned by this customer.");
    const cart = await getOrCreateCart(customerId); const rows = await MyGlobal.prisma.shopping_cart_lines.findMany({ where: { shopping_cart_id: cart.id }, include: { variant: { include: { product: { include: { seller: { include: { profile: true } } } }, inventory: true } } } }); if (rows.length === 0) throw ErrorUtil.conflict("The cart is empty.");
    const eligible = rows.filter((line) => line.variant.status === "active" && line.variant.product.status === "active" && ["approved", "suspended"].includes(line.variant.product.seller.status) && line.variant.inventory.reduce((sum, m) => sum + m.quantity, 0) >= line.quantity); if (eligible.length === 0) throw ErrorUtil.conflict("The cart has no purchasable lines.");
    const total = eligible.reduce((sum, line) => sum + (line.variant.price_override ?? line.variant.product.base_price) * line.quantity, 0); const now = new Date(); const orderId = crypto.randomUUID();
    await MyGlobal.prisma.$transaction(async (tx) => {
      for (const line of eligible) { await tx.shopping_inventory_movements.create({ data: { id: crypto.randomUUID(), shopping_product_variant_id: line.variant.id, quantity: -line.quantity, actor_id: customerId, reason: "checkout", created_at: now } }); }
      await tx.shopping_orders.create({ data: { id: orderId, shopping_customer_id: customerId, total_price: total, shipping_recipient_name: addressRow.recipient_name, shipping_recipient_phone: addressRow.recipient_phone, shipping_street_address: addressRow.street_address, shipping_city: addressRow.city, shipping_state: addressRow.state, shipping_postal_code: addressRow.postal_code, shipping_country: addressRow.country, created_at: now, items: { create: eligible.map((line) => ({ id: crypto.randomUUID(), shopping_product_variant_id: line.variant.id, shopping_seller_id: line.variant.product.shopping_seller_id, product_name: line.variant.product.name, sku: line.variant.sku, shop_name: line.variant.product.seller.profile?.shop_name ?? "", shop_logo: line.variant.product.seller.profile?.logo_image ?? "", unit_price: line.variant.price_override ?? line.variant.product.base_price, quantity: line.quantity, status: "paid", created_at: now })) } } });
      await tx.shopping_cart_lines.deleteMany({ where: { id: { in: eligible.map((line) => line.id) } } }); await tx.shopping_carts.update({ where: { id: cart.id }, data: { updated_at: now } });
    });
    return getOrder(customerId, orderId);
  }
  function orderView(row: any): api.IShoppingOrder { return { id: row.id, total: row.total_price, status: row.items.every((item: any) => item.status === "refunded") ? "refunded" : row.items.every((item: any) => item.status === "delivered") ? "delivered" : row.items.some((item: any) => item.status === "shipped") ? "shipped" : "paid", shipping: { recipientName: row.shipping_recipient_name, recipientPhone: row.shipping_recipient_phone, streetAddress: row.shipping_street_address, city: row.shipping_city, state: row.shipping_state, postalCode: row.shipping_postal_code, country: row.shipping_country }, items: row.items.map((item: any) => ({ id: item.id, variantId: item.shopping_product_variant_id, sellerId: item.shopping_seller_id, productName: item.product_name, sku: item.sku, shopName: item.shop_name, shopLogo: item.shop_logo, unitPrice: item.unit_price, quantity: item.quantity, status: item.status })), createdAt: row.created_at.toISOString() }; }
  /** Lists customer orders. */
  export async function listOrders(customerId: string, input: api.IShoppingOrder.IRequest): Promise<api.IPage<api.IShoppingOrder>> { await customer(customerId); const where: any = { shopping_customer_id: customerId, ...(input.status ? { items: { some: { status: input.status } } } : {}) }; const current = input.page ?? 1; const limit = input.limit ?? 100; const [records, rows] = await Promise.all([MyGlobal.prisma.shopping_orders.count({ where }), MyGlobal.prisma.shopping_orders.findMany({ where, include: { items: true }, orderBy: { created_at: "desc" }, skip: limit === 0 ? undefined : (current - 1) * limit, take: limit === 0 ? undefined : limit })]); return page(rows.map(orderView), records, input); }
  /** Reads one customer order. */
  export async function getOrder(customerId: string, orderId: string): Promise<api.IShoppingOrder> { await customer(customerId); const row = await MyGlobal.prisma.shopping_orders.findFirst({ where: { id: orderId, shopping_customer_id: customerId }, include: { items: true } }); if (row === null) throw ErrorUtil.notFound("Order was not found."); return orderView(row); }
  /** Lists shipments attached to one customer order. */
  export async function orderShipments(customerId: string, orderId: string): Promise<api.IShoppingOrder.IShipment[]> { await getOrder(customerId, orderId); const rows = await MyGlobal.prisma.shopping_shipment_items.findMany({ where: { item: { shopping_order_id: orderId } }, include: { shipment: { include: { items: true } } } }); return rows.map((join) => ({ id: join.shipment.id, trackingNumber: join.shipment.tracking_number, carrier: join.shipment.carrier, destinationSummary: join.shipment.destination_summary, status: join.shipment.delivered_at ? "delivered" : join.shipment.shipped_at ? "shipped" : "created", itemIds: join.shipment.items.map((item) => item.shopping_order_item_id), shippedAt: join.shipment.shipped_at?.toISOString() ?? null, deliveredAt: join.shipment.delivered_at?.toISOString() ?? null })); }
  /** Publishes an eligible review. */
  export async function createReview(customerId: string, body: api.IShoppingReview.ICreate): Promise<api.IShoppingReview> { await customer(customerId); const item = await MyGlobal.prisma.shopping_order_items.findFirst({ where: { id: body.orderItemId, order: { shopping_customer_id: customerId }, status: "delivered" }, include: { variant: true } }); if (item === null) throw ErrorUtil.conflict("Only delivered purchases can be reviewed."); const product = await MyGlobal.prisma.shopping_product_variants.findUniqueOrThrow({ where: { id: item.shopping_product_variant_id } }); const row = await MyGlobal.prisma.shopping_reviews.create({ data: { id: crypto.randomUUID(), shopping_customer_id: customerId, shopping_order_item_id: item.id, product_id: product.shopping_product_id, rating: body.rating, text: body.text ?? null, author_name: "Customer", status: "published", created_at: new Date(), updated_at: new Date() } }); return { id: row.id, productId: row.product_id, rating: row.rating, text: row.text, authorName: row.author_name, status: row.status, createdAt: row.created_at.toISOString() }; }
  /** Edits an authored review. */
  export async function updateReview(customerId: string, reviewId: string, body: api.IShoppingReview.IUpdate): Promise<api.IShoppingReview> { await customer(customerId); const row = await MyGlobal.prisma.shopping_reviews.updateMany({ where: { id: reviewId, shopping_customer_id: customerId, status: "published" }, data: { rating: body.rating, text: body.text ?? null, updated_at: new Date() } }); if (row.count === 0) throw ErrorUtil.notFound("Review was not found."); const review = await MyGlobal.prisma.shopping_reviews.findUniqueOrThrow({ where: { id: reviewId } }); return { id: review.id, productId: review.product_id, rating: review.rating, text: review.text, authorName: review.author_name, status: review.status, createdAt: review.created_at.toISOString() }; }
  /** Retires an authored review. */
  export async function deleteReview(customerId: string, reviewId: string): Promise<api.IShoppingResult> { await customer(customerId); const row = await MyGlobal.prisma.shopping_reviews.updateMany({ where: { id: reviewId, shopping_customer_id: customerId, status: "published" }, data: { status: "deleted", updated_at: new Date() } }); if (row.count === 0) throw ErrorUtil.notFound("Review was not found."); return { status: "deleted" }; }
  function orderItemView(item: { id: string; shopping_product_variant_id: string; shopping_seller_id: string; product_name: string; sku: string; shop_name: string; shop_logo: string; unit_price: number; quantity: number; status: string }): api.IShoppingOrder.IItem { return { id: item.id, variantId: item.shopping_product_variant_id, sellerId: item.shopping_seller_id, productName: item.product_name, sku: item.sku, shopName: item.shop_name, shopLogo: item.shop_logo, unitPrice: item.unit_price, quantity: item.quantity, status: item.status }; }
  /** Lists seller items awaiting shipment. */
  export async function awaitingShipment(sellerId: string, input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingOrder.IItem>> { await seller(sellerId); const where = { shopping_seller_id: sellerId, status: "paid" }; const current = input.page ?? 1; const limit = input.limit ?? 100; const [records, rows] = await Promise.all([MyGlobal.prisma.shopping_order_items.count({ where }), MyGlobal.prisma.shopping_order_items.findMany({ where, orderBy: { created_at: "asc" }, skip: limit === 0 ? undefined : (current - 1) * limit, take: limit === 0 ? undefined : limit })]); return page(rows.map(orderItemView), records, input); }
  /** Creates a shipment for one seller and marks all package items shipped. */
  export async function createShipment(sellerId: string, body: api.IShoppingOrder.IShipmentCreate): Promise<api.IShoppingOrder.IShipment> { await seller(sellerId); if (body.itemIds.length === 0) throw ErrorUtil.unprocessable("A shipment requires at least one item."); const items = await MyGlobal.prisma.shopping_order_items.findMany({ where: { id: { in: body.itemIds }, shopping_seller_id: sellerId }, include: { order: true } }); if (items.length !== body.itemIds.length || items.some((item) => item.status !== "paid")) throw ErrorUtil.conflict("Every shipment item must be a paid item owned by this seller."); const row = await MyGlobal.prisma.shopping_shipments.create({ data: { id: crypto.randomUUID(), shopping_seller_id: sellerId, tracking_number: body.trackingNumber, carrier: body.carrier, destination_summary: `${items[0]!.order.shipping_city}, ${items[0]!.order.shipping_country}`, created_at: new Date(), shipped_at: new Date(), items: { create: items.map((item) => ({ id: crypto.randomUUID(), shopping_order_item_id: item.id, created_at: new Date() })) } } }); await MyGlobal.prisma.shopping_order_items.updateMany({ where: { id: { in: body.itemIds } }, data: { status: "shipped" } }); return { id: row.id, trackingNumber: row.tracking_number, carrier: row.carrier, destinationSummary: row.destination_summary, status: "shipped", itemIds: body.itemIds, shippedAt: row.shipped_at?.toISOString() ?? null, deliveredAt: null };
  }
  /** Reads shipment tracking. */
  export async function tracking(actorId: string, shipmentId: string): Promise<api.IShoppingOrder.IShipment> { const row = await MyGlobal.prisma.shopping_shipments.findUnique({ where: { id: shipmentId }, include: { items: true } }); if (row === null) throw ErrorUtil.notFound("Shipment was not found."); const sellerRow = await MyGlobal.prisma.shopping_sellers.findUnique({ where: { id: row.shopping_seller_id } }); const owns = sellerRow?.id === actorId || (await MyGlobal.prisma.shopping_orders.count({ where: { id: { in: (await MyGlobal.prisma.shopping_order_items.findMany({ where: { id: { in: row.items.map((item) => item.shopping_order_item_id) } }, select: { shopping_order_id: true } })).map((item) => item.shopping_order_id) }, shopping_customer_id: actorId } })) > 0; if (!owns) throw ErrorUtil.forbidden("Shipment is outside the actor scope."); return { id: row.id, trackingNumber: row.tracking_number, carrier: row.carrier, destinationSummary: row.destination_summary, status: row.delivered_at ? "delivered" : row.shipped_at ? "shipped" : "created", itemIds: row.items.map((item) => item.shopping_order_item_id), shippedAt: row.shipped_at?.toISOString() ?? null, deliveredAt: row.delivered_at?.toISOString() ?? null }; }
  /** Confirms delivery for the whole shipment. */
  export async function confirmShipment(sellerId: string, shipmentId: string): Promise<api.IShoppingOrder.IShipment> { await seller(sellerId); const row = await MyGlobal.prisma.shopping_shipments.findFirst({ where: { id: shipmentId, shopping_seller_id: sellerId }, include: { items: true } }); if (row === null) throw ErrorUtil.notFound("Shipment was not found."); const delivered = new Date(); await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_shipments.update({ where: { id: shipmentId }, data: { delivered_at: delivered } }), MyGlobal.prisma.shopping_order_items.updateMany({ where: { id: { in: row.items.map((item) => item.shopping_order_item_id) } }, data: { status: "delivered" } })]); return { id: row.id, trackingNumber: row.tracking_number, carrier: row.carrier, destinationSummary: row.destination_summary, status: "delivered", itemIds: row.items.map((item) => item.shopping_order_item_id), shippedAt: row.shipped_at?.toISOString() ?? null, deliveredAt: delivered.toISOString() }; }
  /** Auto-confirms shipments whose delivery period elapsed. */
  export async function autoConfirmShipments(): Promise<api.IShoppingResult> { const cutoff = new Date(Date.now() - 14 * 86400000); const rows = await MyGlobal.prisma.shopping_shipments.findMany({ where: { delivered_at: null, shipped_at: { lt: cutoff } }, include: { items: true } }); for (const row of rows) { const delivered = new Date(); await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_shipments.update({ where: { id: row.id }, data: { delivered_at: delivered } }), MyGlobal.prisma.shopping_order_items.updateMany({ where: { id: { in: row.items.map((item) => item.shopping_order_item_id) }, status: "shipped" }, data: { status: "delivered" } })]); } return { status: `confirmed:${rows.length}` }; }
  async function requestItem(customerId: string, itemId: string, reason: string, kind: "cancellation" | "refund"): Promise<api.IShoppingResult> { await customer(customerId); const item = await MyGlobal.prisma.shopping_order_items.findFirst({ where: { id: itemId, order: { shopping_customer_id: customerId } } }); if (item === null) throw ErrorUtil.notFound("Order item was not found."); const existing = kind === "cancellation" ? await MyGlobal.prisma.shopping_cancellation_requests.findFirst({ where: { shopping_order_item_id: itemId, status: "pending" } }) : await MyGlobal.prisma.shopping_refund_requests.findFirst({ where: { shopping_order_item_id: itemId, status: "pending" } }); if (existing !== null) throw ErrorUtil.conflict("A pending request already exists."); if (kind === "cancellation") await MyGlobal.prisma.shopping_cancellation_requests.create({ data: { id: crypto.randomUUID(), shopping_order_item_id: itemId, customer_id: customerId, status: "pending", reason, created_at: new Date() } }); else await MyGlobal.prisma.shopping_refund_requests.create({ data: { id: crypto.randomUUID(), shopping_order_item_id: itemId, customer_id: customerId, status: "pending", reason, created_at: new Date() } }); return { status: "pending" }; }
  export async function requestCancellation(customerId: string, itemId: string, body: api.IShoppingOrder.IItemAction): Promise<api.IShoppingResult> { return requestItem(customerId, itemId, body.reason, "cancellation"); }
  export async function requestRefund(customerId: string, itemId: string, body: api.IShoppingOrder.IItemAction): Promise<api.IShoppingResult> { return requestItem(customerId, itemId, body.reason, "refund"); }
  async function decideRequest(adminId: string, requestId: string, approve: boolean, kind: "cancellation" | "refund"): Promise<api.IShoppingResult> { const actor = await admin(adminId); const now = new Date(); if (kind === "cancellation") { const req = await MyGlobal.prisma.shopping_cancellation_requests.findUnique({ where: { id: requestId } }); if (req === null || req.status !== "pending") throw ErrorUtil.notFound("Cancellation request was not found."); await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_cancellation_requests.update({ where: { id: requestId }, data: { status: approve ? "approved" : "rejected", decided_by: actor.id, decided_at: now } }), ...(approve ? [MyGlobal.prisma.shopping_order_items.update({ where: { id: req.shopping_order_item_id }, data: { status: "cancelled" } })] : [])]); return { status: approve ? "approved" : "rejected" }; }
    const req = await MyGlobal.prisma.shopping_refund_requests.findUnique({ where: { id: requestId } }); if (req === null || req.status !== "pending") throw ErrorUtil.notFound("Refund request was not found."); await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_refund_requests.update({ where: { id: requestId }, data: { status: approve ? "approved" : "rejected", decided_by: actor.id, decided_at: now } }), ...(approve ? [MyGlobal.prisma.shopping_order_items.update({ where: { id: req.shopping_order_item_id }, data: { status: "refunded" } })] : [])]); return { status: approve ? "approved" : "rejected" };
  }
  export async function decideCancellation(adminId: string, id: string, approve: boolean): Promise<api.IShoppingResult> { return decideRequest(adminId, id, approve, "cancellation"); }
  export async function decideRefund(adminId: string, id: string, approve: boolean): Promise<api.IShoppingResult> { return decideRequest(adminId, id, approve, "refund"); }
  /** Seller dashboard summary. */
  export async function sellerDashboard(sellerId: string): Promise<api.IShoppingSeller.IDashboard> { await seller(sellerId); const [productCount, orderItemCount, unresolvedRequestCount] = await Promise.all([MyGlobal.prisma.shopping_products.count({ where: { shopping_seller_id: sellerId, status: { not: "deleted" } } }), MyGlobal.prisma.shopping_order_items.count({ where: { shopping_seller_id: sellerId } }), MyGlobal.prisma.shopping_cancellation_requests.count({ where: { item: { shopping_seller_id: sellerId }, status: "pending" } })]); return { productCount, orderItemCount, unresolvedRequestCount }; }
  /** Seller order-item report. */
  export async function sellerOrderItems(sellerId: string, input: api.IShoppingOrder.IRequest): Promise<api.IPage<api.IShoppingSeller.IOrderItem>> { await seller(sellerId); const where: any = { shopping_seller_id: sellerId, ...(input.status ? { status: input.status } : {}) }; const current = input.page ?? 1; const limit = input.limit ?? 100; const [records, rows] = await Promise.all([MyGlobal.prisma.shopping_order_items.count({ where }), MyGlobal.prisma.shopping_order_items.findMany({ where, orderBy: { created_at: "desc" }, skip: limit === 0 ? undefined : (current - 1) * limit, take: limit === 0 ? undefined : limit })]); return page(rows.map((row) => ({ id: row.id, orderId: row.shopping_order_id, productName: row.product_name, sku: row.sku, quantity: row.quantity, unitPrice: row.unit_price, status: row.status })), records, input); }
  /** Submits an administrator application. */
  export async function submitAdminApplication(adminId: string, body: api.IShoppingAdmin.IRequest): Promise<api.IShoppingAdmin.IApplication> { const actor = await admin(adminId); const pending = await MyGlobal.prisma.shopping_administrator_requests.findFirst({ where: { shopping_administrator_id: actor.id, status: "pending" } }); if (pending !== null) throw ErrorUtil.conflict("An administrator application is already pending."); const row = await MyGlobal.prisma.shopping_administrator_requests.create({ data: { id: crypto.randomUUID(), shopping_administrator_id: actor.id, status: "pending", reason: body.reason, created_at: new Date() } }); return { id: row.id, administratorId: row.shopping_administrator_id, status: row.status, reason: row.reason, createdAt: row.created_at.toISOString(), decidedAt: null }; }
  /** Lists an administrator's applications. */
  export async function adminApplications(adminId: string): Promise<api.IShoppingAdmin.IApplication[]> { await admin(adminId); const rows = await MyGlobal.prisma.shopping_administrator_requests.findMany({ where: { shopping_administrator_id: adminId }, orderBy: { created_at: "desc" } }); return rows.map((row) => ({ id: row.id, administratorId: row.shopping_administrator_id, status: row.status, reason: row.reason, createdAt: row.created_at.toISOString(), decidedAt: row.decided_at?.toISOString() ?? null })); }
  /** Lists pending administrator applications. */
  export async function pendingAdminApplications(adminId: string, input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingAdmin.IApplication>> { const actor = await admin(adminId); if (actor.grade !== "super") throw ErrorUtil.forbidden("Super administrator authority is required."); const current = input.page ?? 1; const limit = input.limit ?? 100; const where = { status: "pending" }; const [records, rows] = await Promise.all([MyGlobal.prisma.shopping_administrator_requests.count({ where }), MyGlobal.prisma.shopping_administrator_requests.findMany({ where, orderBy: { created_at: "asc" }, skip: limit === 0 ? undefined : (current - 1) * limit, take: limit === 0 ? undefined : limit })]); return page(rows.map((row) => ({ id: row.id, administratorId: row.shopping_administrator_id, status: row.status, reason: row.reason, createdAt: row.created_at.toISOString(), decidedAt: null })), records, input); }
  /** Approves or rejects an administrator application. */
  export async function decideAdminApplication(adminId: string, requestId: string, approve: boolean, body?: api.IShoppingAdmin.IRequest): Promise<api.IShoppingResult> { const actor = await admin(adminId); if (actor.grade !== "super") throw ErrorUtil.forbidden("Super administrator authority is required."); const req = await MyGlobal.prisma.shopping_administrator_requests.findUnique({ where: { id: requestId } }); if (req === null || req.status !== "pending") throw ErrorUtil.notFound("Administrator application was not found."); await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_administrator_requests.update({ where: { id: requestId }, data: { status: approve ? "approved" : "rejected", reason: body?.reason ?? req.reason, decided_by: adminId, decided_at: new Date() } }), ...(approve ? [MyGlobal.prisma.shopping_administrators.update({ where: { id: req.shopping_administrator_id }, data: { grade: "regular" } })] : [])]); return { status: approve ? "approved" : "rejected" }; }
  /** Promotes a regular administrator. */
  export async function changeAdminGrade(adminId: string, targetId: string, grade: "regular" | "super"): Promise<api.IShoppingResult> { const actor = await admin(adminId); if (actor.grade !== "super" || (grade === "regular" && actor.id === targetId)) throw ErrorUtil.forbidden("Super administrator grade authority is required."); await MyGlobal.prisma.shopping_administrators.update({ where: { id: targetId }, data: { grade } }); return { status: grade }; }
  /** Lists customer accounts for oversight. */
  export async function listCustomers(adminId: string, input: api.IShoppingAdmin.IPageRequest): Promise<api.IPage<api.IShoppingCustomer>> { await admin(adminId); const where: any = input.search ? { email: { contains: input.search } } : {}; const current = input.page ?? 1; const limit = input.limit ?? 100; const [records, rows] = await Promise.all([MyGlobal.prisma.shopping_customers.count({ where }), MyGlobal.prisma.shopping_customers.findMany({ where, include: { profile: true }, orderBy: { created_at: "desc" }, skip: limit === 0 ? undefined : (current - 1) * limit, take: limit === 0 ? undefined : limit })]); return page(rows.map((row) => ({ id: row.id, email: row.email, status: row.status, createdAt: row.created_at.toISOString(), profile: row.profile ? { displayName: row.profile.display_name, phoneNumber: row.profile.phone_number } : { displayName: "", phoneNumber: "" } })), records, input); }
  /** Lists seller accounts for oversight. */
  export async function listSellers(adminId: string, input: api.IShoppingAdmin.IPageRequest): Promise<api.IPage<api.IShoppingSeller>> { await admin(adminId); const where: any = input.search ? { email: { contains: input.search } } : {}; const current = input.page ?? 1; const limit = input.limit ?? 100; const [records, rows] = await Promise.all([MyGlobal.prisma.shopping_sellers.count({ where }), MyGlobal.prisma.shopping_sellers.findMany({ where, include: { profile: true }, orderBy: { created_at: "desc" }, skip: limit === 0 ? undefined : (current - 1) * limit, take: limit === 0 ? undefined : limit })]); return page(rows.map((row) => ({ id: row.id, email: row.email, status: row.status, rejectionReason: row.rejection_reason, profile: row.profile ? toSellerProfile(row.profile) : { shopName: "", shopDescription: "", logoImage: "" } })), records, input); }
  /** Applies account bans without deleting history. */
  export async function setAccountBan(adminId: string, targetId: string, type: "customer" | "seller", banned: boolean): Promise<api.IShoppingResult> { await admin(adminId); if (type === "customer") await MyGlobal.prisma.shopping_customers.update({ where: { id: targetId }, data: { status: banned ? "banned" : "active" } }); else await MyGlobal.prisma.shopping_sellers.update({ where: { id: targetId }, data: { status: banned ? "banned" : "approved" } }); return { status: banned ? "banned" : "active" }; }
  /** Lists all platform orders. */
  export async function platformOrders(adminId: string, input: api.IShoppingOrder.IRequest): Promise<api.IPage<api.IShoppingOrder>> { await admin(adminId); const current = input.page ?? 1; const limit = input.limit ?? 100; const [records, rows] = await Promise.all([MyGlobal.prisma.shopping_orders.count(), MyGlobal.prisma.shopping_orders.findMany({ include: { items: true }, orderBy: { created_at: "desc" }, skip: limit === 0 ? undefined : (current - 1) * limit, take: limit === 0 ? undefined : limit })]); return page(rows.map(orderView), records, input); }
  /** Views one platform order by an administrator. */
  export async function platformOrder(adminId: string, orderId: string): Promise<api.IShoppingOrder> { await admin(adminId); const row = await MyGlobal.prisma.shopping_orders.findUnique({ where: { id: orderId }, include: { items: true } }); if (row === null) throw ErrorUtil.notFound("Order was not found."); return orderView(row); }
  /** Applies a force status to one eligible order item. */
  export async function forceItemStatus(adminId: string, itemId: string, status: "cancelled" | "refunded"): Promise<api.IShoppingResult> { await admin(adminId); const row = await MyGlobal.prisma.shopping_order_items.updateMany({ where: { id: itemId, status: { in: status === "cancelled" ? ["paid", "shipped"] : ["delivered"] } }, data: { status } }); if (row.count === 0) throw ErrorUtil.conflict("Order item is not eligible for this force action."); return { status }; }
  /** Applies a force status across one order's eligible items. */
  export async function forceOrderStatus(adminId: string, orderId: string, status: "cancelled" | "refunded"): Promise<api.IShoppingResult> { await admin(adminId); const result = await MyGlobal.prisma.shopping_order_items.updateMany({ where: { shopping_order_id: orderId, status: { in: status === "cancelled" ? ["paid", "shipped"] : ["delivered"] } }, data: { status } }); return { status: `${status}:${result.count}` }; }
  /** Lists pending cancellation requests for a seller or administrator. */
  export async function pendingCancellations(actorId: string, input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingResult>> { const sellerRow = await MyGlobal.prisma.shopping_sellers.findUnique({ where: { id: actorId } }); const where: any = sellerRow ? { status: "pending", item: { shopping_seller_id: actorId } } : { status: "pending" }; if (!sellerRow) await admin(actorId); const rows = await MyGlobal.prisma.shopping_cancellation_requests.findMany({ where, orderBy: { created_at: "asc" } }); return page(rows.map((row) => ({ status: `${row.id}:${row.reason}` })), rows.length, input); }
  /** Lists pending refund requests for a seller or administrator. */
  export async function pendingRefunds(actorId: string, input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingResult>> { const sellerRow = await MyGlobal.prisma.shopping_sellers.findUnique({ where: { id: actorId } }); const where: any = sellerRow ? { status: "pending", item: { shopping_seller_id: actorId } } : { status: "pending" }; if (!sellerRow) await admin(actorId); const rows = await MyGlobal.prisma.shopping_refund_requests.findMany({ where, orderBy: { created_at: "asc" } }); return page(rows.map((row) => ({ status: `${row.id}:${row.reason}` })), rows.length, input); }
  /** Commits an already approved request idempotently. */
  export async function commitRequest(adminId: string, requestId: string, kind: "cancellation" | "refund"): Promise<api.IShoppingResult> { await admin(adminId); if (kind === "cancellation") { const row = await MyGlobal.prisma.shopping_cancellation_requests.findUnique({ where: { id: requestId } }); if (row === null) throw ErrorUtil.notFound("Cancellation request was not found."); if (row.status === "approved") await MyGlobal.prisma.shopping_order_items.update({ where: { id: row.shopping_order_item_id }, data: { status: "cancelled" } }); return { status: row.status }; } const row = await MyGlobal.prisma.shopping_refund_requests.findUnique({ where: { id: requestId } }); if (row === null) throw ErrorUtil.notFound("Refund request was not found."); if (row.status === "approved") await MyGlobal.prisma.shopping_order_items.update({ where: { id: row.shopping_order_item_id }, data: { status: "refunded" } }); return { status: row.status }; }
  /** Revokes the current customer session. */
  export async function customerLogout(customerId: string, sessionId: string): Promise<api.IShoppingResult> { await customer(customerId); await MyGlobal.prisma.shopping_customer_sessions.updateMany({ where: { id: sessionId, shopping_customer_id: customerId }, data: { revoked_at: new Date() } }); return { status: "logged-out" }; }
  /** Revokes all customer sessions. */
  export async function customerLogoutAll(customerId: string): Promise<api.IShoppingResult> { await customer(customerId); await MyGlobal.prisma.shopping_customer_sessions.updateMany({ where: { shopping_customer_id: customerId, revoked_at: null }, data: { revoked_at: new Date() } }); return { status: "logged-out-all" }; }
  /** Changes a customer password after current-password proof. */
  export async function customerPassword(customerId: string, body: api.IShoppingCustomer.IPasswordChange): Promise<api.IShoppingResult> { const row = await customer(customerId); if (row.password_hash !== hash(body.currentPassword)) throw ErrorUtil.unauthorized("Current password is incorrect."); await MyGlobal.prisma.shopping_customers.update({ where: { id: customerId }, data: { password_hash: hash(body.newPassword) } }); return { status: "changed" }; }
  /** Permanently closes a customer and anonymizes retained reviews. */
  export async function closeCustomer(customerId: string, body: api.IShoppingCustomer.IClose): Promise<api.IShoppingResult> { const row = await customer(customerId); if (row.password_hash !== hash(body.password)) throw ErrorUtil.unauthorized("Password proof is required."); await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_customers.update({ where: { id: customerId }, data: { status: "deleted", deleted_at: new Date() } }), MyGlobal.prisma.shopping_customer_profiles.deleteMany({ where: { shopping_customer_id: customerId } }), MyGlobal.prisma.shopping_customer_sessions.updateMany({ where: { shopping_customer_id: customerId }, data: { revoked_at: new Date() } }), MyGlobal.prisma.shopping_reviews.updateMany({ where: { shopping_customer_id: customerId }, data: { shopping_customer_id: null, author_name: "Deleted customer" } })]); return { status: "deleted" }; }
  /** Revokes the current seller session. */
  export async function sellerLogout(sellerId: string, sessionId: string): Promise<api.IShoppingResult> { await seller(sellerId); await MyGlobal.prisma.shopping_seller_sessions.updateMany({ where: { id: sessionId, shopping_seller_id: sellerId }, data: { revoked_at: new Date() } }); return { status: "logged-out" }; }
  /** Revokes all seller sessions. */
  export async function sellerLogoutAll(sellerId: string): Promise<api.IShoppingResult> { await seller(sellerId); await MyGlobal.prisma.shopping_seller_sessions.updateMany({ where: { shopping_seller_id: sellerId, revoked_at: null }, data: { revoked_at: new Date() } }); return { status: "logged-out-all" }; }
  /** Changes a seller password. */
  export async function sellerPassword(sellerId: string, body: api.IShoppingSeller.IPasswordChange): Promise<api.IShoppingResult> { const row = await seller(sellerId); if (row.password_hash !== hash(body.currentPassword)) throw ErrorUtil.unauthorized("Current password is incorrect."); await MyGlobal.prisma.shopping_sellers.update({ where: { id: sellerId }, data: { password_hash: hash(body.newPassword) } }); return { status: "changed" }; }
  /** Closes a seller while retaining obligations. */
  export async function closeSeller(sellerId: string, body: api.IShoppingSeller.IClose): Promise<api.IShoppingResult> { const row = await seller(sellerId); if (row.password_hash !== hash(body.password)) throw ErrorUtil.unauthorized("Password proof is required."); await MyGlobal.prisma.shopping_sellers.update({ where: { id: sellerId }, data: { status: "deleted", deleted_at: new Date() } }); return { status: "deleted" }; }
  /** Revokes the current administrator session. */
  export async function adminLogout(adminId: string, sessionId: string): Promise<api.IShoppingResult> { await admin(adminId); await MyGlobal.prisma.shopping_administrator_sessions.updateMany({ where: { id: sessionId, shopping_administrator_id: adminId }, data: { revoked_at: new Date() } }); return { status: "logged-out" }; }
}
