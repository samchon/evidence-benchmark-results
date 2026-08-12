import crypto from "node:crypto";
import type { IPage, IShoppingCart, IShoppingCustomer, IShoppingWishlist } from "@benchmark/shopping-api";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Persists customer-owned addresses, carts, and wishlists. */
export namespace ShoppingCustomerCommerceProvider {
  /** Lists saved addresses owned by the acting customer. */
  export async function addressIndex(customerId: string, input: IPage.IRequest): Promise<IPage<IShoppingCustomer.IAddress>> {
    const rows = await MyGlobal.prisma.shopping_customer_addresses.findMany({ where: { customer_id: customerId }, orderBy: [{ is_default: "desc" }, { created_at: "desc" }] });
    return page(input, rows.map(address));
  }

  /** Adds a saved address and atomically maintains one default. */
  export async function addressCreate(customerId: string, input: IShoppingCustomer.IAddressCreate): Promise<IShoppingCustomer.IAddress> {
    const now = new Date();
    return MyGlobal.prisma.$transaction(async (tx) => {
      if (input.isDefault === true) await tx.shopping_customer_addresses.updateMany({ where: { customer_id: customerId }, data: { is_default: false, updated_at: now } });
      return address(await tx.shopping_customer_addresses.create({ data: { id: crypto.randomUUID(), customer_id: customerId, recipient_name: input.recipientName, recipient_phone: input.recipientPhone, street_address: input.streetAddress, city: input.city, state_or_province: input.stateOrProvince, postal_code: input.postalCode, country: input.country, is_default: input.isDefault === true, created_at: now, updated_at: now } }));
    });
  }

  /** Reads one address only when it belongs to the acting customer. */
  export async function addressAt(customerId: string, id: string): Promise<IShoppingCustomer.IAddress> {
    const row = await MyGlobal.prisma.shopping_customer_addresses.findFirst({ where: { id, customer_id: customerId } });
    if (row === null) throw ErrorUtil.notFound("The shipping address does not exist.");
    return address(row);
  }

  /** Edits one owned address. */
  export async function addressUpdate(customerId: string, id: string, input: IShoppingCustomer.IAddressUpdate): Promise<IShoppingCustomer.IAddress> {
    await addressAt(customerId, id);
    const now = new Date();
    return MyGlobal.prisma.$transaction(async (tx) => {
      if (input.isDefault === true) await tx.shopping_customer_addresses.updateMany({ where: { customer_id: customerId }, data: { is_default: false, updated_at: now } });
    return address(await tx.shopping_customer_addresses.update({ where: { id }, data: { recipient_name: input.recipientName, recipient_phone: input.recipientPhone, street_address: input.streetAddress, city: input.city, state_or_province: input.stateOrProvince, postal_code: input.postalCode, country: input.country, is_default: input.isDefault === undefined ? undefined : input.isDefault === true, updated_at: now } }));
    });
  }

  /** Deletes one owned address. */
  export async function addressErase(customerId: string, id: string): Promise<IShoppingCustomer.IResult> {
    await addressAt(customerId, id);
    await MyGlobal.prisma.shopping_customer_addresses.delete({ where: { id } });
    return { success: true };
  }

  /** Makes one owned address the sole default. */
  export async function addressDefault(customerId: string, id: string): Promise<IShoppingCustomer.IAddress> {
    await addressAt(customerId, id);
    const now = new Date();
    await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_customer_addresses.updateMany({ where: { customer_id: customerId }, data: { is_default: false, updated_at: now } }), MyGlobal.prisma.shopping_customer_addresses.update({ where: { id }, data: { is_default: true, updated_at: now } })]);
    return addressAt(customerId, id);
  }

  /** Reads the acting customer's cart projection. */
  export async function cart(customerId: string): Promise<IShoppingCart> {
    const row = await MyGlobal.prisma.shopping_carts.findUnique({ where: { customer_id: customerId }, include: { lines: { include: { variant: { include: { product: { include: { seller: true } }, inventory_movements: true } } } } } });
    if (row === null) throw ErrorUtil.notFound("The cart does not exist.");
    const lines = row.lines.map((line) => { const unitPrice = line.variant.price_override ?? line.variant.product.base_price; const stock = line.variant.inventory_movements.reduce((sum, movement) => sum + movement.quantity_delta, 0); const available = line.variant.deleted_at === null && line.variant.product.deleted_at === null && line.variant.product.seller.deleted_at === null && line.variant.product.seller.login_status === "active" && line.variant.product.seller.approval_status === "approved" && line.variant.product.seller.suspended_at === null; return { id: line.id, variantId: line.variant_id, productId: line.variant.product_id, productName: line.variant.product.name, optionValues: JSON.parse(line.variant.option_values) as Record<string, string>, unitPrice, quantity: line.quantity, subtotal: unitPrice * line.quantity, availability: available && stock >= line.quantity ? "available" : "unavailable" }; });
    return { id: row.id, lines, total: lines.reduce((sum, line) => sum + line.subtotal, 0) };
  }

  /** Adds or merges a cart line after validating the variant. */
  export async function cartCreate(customerId: string, input: IShoppingCart.ICreate): Promise<IShoppingCart> {
    if (input.quantity < 1) throw ErrorUtil.badRequest("Cart quantity must be positive.");
    const cartRow = await MyGlobal.prisma.shopping_carts.findUnique({ where: { customer_id: customerId } });
    if (cartRow === null) throw ErrorUtil.notFound("The cart does not exist.");
    const variant = await MyGlobal.prisma.shopping_product_variants.findUnique({ where: { id: input.variantId }, include: { product: { include: { seller: true } }, inventory_movements: true } });
    if (variant === null || variant.deleted_at !== null || variant.product.deleted_at !== null || variant.product.seller.deleted_at !== null || variant.product.seller.login_status !== "active" || variant.product.seller.approval_status !== "approved" || variant.product.seller.suspended_at !== null || variant.inventory_movements.reduce((sum, movement) => sum + movement.quantity_delta, 0) <= 0) throw ErrorUtil.badRequest("The variant is not available for the requested quantity.");
    await MyGlobal.prisma.shopping_cart_lines.upsert({ where: { cart_id_variant_id: { cart_id: cartRow.id, variant_id: input.variantId } }, create: { id: crypto.randomUUID(), cart_id: cartRow.id, variant_id: input.variantId, quantity: input.quantity, created_at: new Date(), updated_at: new Date() }, update: { quantity: { increment: input.quantity }, updated_at: new Date() } });
    return cart(customerId);
  }

  /** Replaces a cart line quantity. */
  export async function cartUpdate(customerId: string, id: string, input: IShoppingCart.IUpdate): Promise<IShoppingCart> {
    if (input.quantity < 1) throw ErrorUtil.badRequest("Cart quantity must be positive.");
    const cartRow = await MyGlobal.prisma.shopping_carts.findUnique({ where: { customer_id: customerId } });
    if (cartRow === null) throw ErrorUtil.notFound("The cart does not exist.");
    const line = await MyGlobal.prisma.shopping_cart_lines.findFirst({ where: { id, cart_id: cartRow.id } });
    if (line === null) throw ErrorUtil.notFound("The cart line does not exist.");
    await MyGlobal.prisma.shopping_cart_lines.update({ where: { id }, data: { quantity: input.quantity, updated_at: new Date() } });
    return cart(customerId);
  }

  /** Removes one owned cart line. */
  export async function cartErase(customerId: string, id: string): Promise<IShoppingCart> {
    const cartRow = await MyGlobal.prisma.shopping_carts.findUnique({ where: { customer_id: customerId } });
    if (cartRow === null) throw ErrorUtil.notFound("The cart does not exist.");
    const line = await MyGlobal.prisma.shopping_cart_lines.findFirst({ where: { id, cart_id: cartRow.id } });
    if (line === null) throw ErrorUtil.notFound("The cart line does not exist.");
    await MyGlobal.prisma.shopping_cart_lines.delete({ where: { id } });
    return cart(customerId);
  }

  /** Lists wishlist entries owned by the acting customer. */
  export async function wishlistIndex(customerId: string, input: IPage.IRequest): Promise<IPage<IShoppingWishlist>> {
    const rows = await MyGlobal.prisma.shopping_wishlist_entries.findMany({ where: { customer_id: customerId }, orderBy: { created_at: "desc" } });
    return page(input, rows.map((row) => ({ id: row.id, productId: row.product_id, createdAt: row.created_at.toISOString() })));
  }

  /** Saves a product once for the acting customer. */
  export async function wishlistCreate(customerId: string, input: IShoppingWishlist.ICreate): Promise<IShoppingWishlist> {
    if (await MyGlobal.prisma.shopping_products.findFirst({ where: { id: input.productId, deleted_at: null } }) === null) throw ErrorUtil.notFound("The product does not exist.");
    const row = await MyGlobal.prisma.shopping_wishlist_entries.upsert({ where: { customer_id_product_id: { customer_id: customerId, product_id: input.productId } }, create: { id: crypto.randomUUID(), customer_id: customerId, product_id: input.productId, created_at: new Date() }, update: {} });
    return { id: row.id, productId: row.product_id, createdAt: row.created_at.toISOString() };
  }

  /** Removes one wishlist entry owned by the acting customer. */
  export async function wishlistErase(customerId: string, id: string): Promise<IShoppingCustomer.IResult> {
    const row = await MyGlobal.prisma.shopping_wishlist_entries.findFirst({ where: { id, customer_id: customerId } });
    if (row === null) throw ErrorUtil.notFound("The wishlist entry does not exist.");
    await MyGlobal.prisma.shopping_wishlist_entries.delete({ where: { id } });
    return { success: true };
  }

  function address(row: { id: string; recipient_name: string; recipient_phone: string; street_address: string; city: string; state_or_province: string; postal_code: string; country: string; is_default: boolean; created_at: Date }): IShoppingCustomer.IAddress { return { id: row.id, recipientName: row.recipient_name, recipientPhone: row.recipient_phone, streetAddress: row.street_address, city: row.city, stateOrProvince: row.state_or_province, postalCode: row.postal_code, country: row.country, isDefault: row.is_default, createdAt: row.created_at.toISOString() }; }
  function page<T extends object>(input: IPage.IRequest, data: T[]): IPage<T> { const current = input.page ?? 1; const limit = input.limit ?? 100; const records = data.length; const pages = limit === 0 ? (records === 0 ? 0 : 1) : Math.ceil(records / limit); const slice = limit === 0 ? data : data.slice((current - 1) * limit, current * limit); return { pagination: { current, limit, records, pages }, data: slice }; }
}
