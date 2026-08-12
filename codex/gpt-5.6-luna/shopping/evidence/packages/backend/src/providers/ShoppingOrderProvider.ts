import crypto from "node:crypto";
import type { IPage, IShoppingOrder } from "@benchmark/shopping-api";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { ShoppingAfterSalesProvider } from "./ShoppingAfterSalesProvider";

/** Owns checkout atomicity and retained order presentation. */
export namespace ShoppingOrderProvider {
  interface OrderItemRow { id: string; seller_id: string; product_name: string; product_description: string; sku_code: string; option_values: string; seller_shop_name: string; seller_logo_image: string; quantity: number; unit_price: number; status: string; purchased_at: Date; variant_id: string | null; }
  interface ShipmentItemRow { order_item_id: string; }
  interface ShipmentRow { id: string; seller_id: string; carrier: string; tracking_number: string; shipped_at: Date; delivered_at: Date | null; items: ShipmentItemRow[]; }
  interface OrderRow { id: string; order_number: string; customer_id: string; purchased_at: Date; total_price: number; shipping_recipient_name: string; shipping_recipient_phone: string; shipping_street_address: string; shipping_city: string; shipping_state_or_province: string; shipping_postal_code: string; shipping_country: string; items: OrderItemRow[]; shipments: ShipmentRow[]; }
  export async function index(customerId: string, input: IShoppingOrder.IRequest): Promise<IPage<IShoppingOrder>> {
    await ShoppingAfterSalesProvider.autoConfirmExpiredShipments();
    const rows = await MyGlobal.prisma.shopping_orders.findMany({ where: { customer_id: customerId, ...(input.status === null || input.status === undefined ? {} : {}) }, orderBy: { purchased_at: "desc" }, include: orderInclude });
    const data = rows.map(dto);
    return page(input, input.status === null || input.status === undefined ? data : data.filter((row) => row.status === input.status));
  }

  export async function at(customerId: string, id: string): Promise<IShoppingOrder> {
    await ShoppingAfterSalesProvider.autoConfirmExpiredShipments();
    const row = await MyGlobal.prisma.shopping_orders.findFirst({ where: { id, customer_id: customerId }, include: orderInclude });
    if (row === null) throw ErrorUtil.notFound("The order does not exist.");
    return dto(row);
  }

  export async function adminIndex(input: IShoppingOrder.IRequest): Promise<IPage<IShoppingOrder>> { await ShoppingAfterSalesProvider.autoConfirmExpiredShipments(); const rows = await MyGlobal.prisma.shopping_orders.findMany({ orderBy: [{ purchased_at: "desc" }, { id: "desc" }], include: orderInclude }); const data = rows.map(dto); return page(input, input.status === null || input.status === undefined ? data : data.filter((row) => row.status === input.status)); }
  export async function adminAt(id: string): Promise<IShoppingOrder> { await ShoppingAfterSalesProvider.autoConfirmExpiredShipments(); const row = await MyGlobal.prisma.shopping_orders.findUnique({ where: { id }, include: orderInclude }); if (row === null) throw ErrorUtil.notFound("The order does not exist."); return dto(row); }
  export async function forceItem(id: string, next: "cancelled" | "refunded", reason: string, administratorId: string): Promise<IShoppingOrder> { const row = await MyGlobal.prisma.shopping_order_items.findUnique({ where: { id } }); if (row === null) throw ErrorUtil.notFound("The order item does not exist."); const allowed = next === "cancelled" ? ["paid", "shipped"] : ["paid", "shipped", "delivered"]; if (!allowed.includes(row.status)) throw ErrorUtil.conflict("The order item is not eligible for this force action."); await transition(id, row.order_id, row.status, next, reason, administratorId); return adminAt(row.order_id); }
  export async function forceOrder(id: string, next: "cancelled" | "refunded", reason: string, administratorId: string): Promise<IShoppingOrder> { const row = await MyGlobal.prisma.shopping_orders.findUnique({ where: { id }, include: { items: true } }); if (row === null) throw ErrorUtil.notFound("The order does not exist."); if (reason.trim().length === 0) throw ErrorUtil.badRequest("A force-action reason is required."); const allowed = next === "cancelled" ? ["paid", "shipped"] : ["paid", "shipped", "delivered"]; const targets = row.items.filter((item) => allowed.includes(item.status)); if (targets.length === 0) throw ErrorUtil.conflict("The order has no eligible items."); const now = new Date(); await MyGlobal.prisma.$transaction(targets.flatMap((item) => [MyGlobal.prisma.shopping_order_items.update({ where: { id: item.id }, data: { status: next } }), MyGlobal.prisma.shopping_order_item_snapshots.create({ data: { id: crypto.randomUUID(), order_item_id: item.id, kind: `administrator ${next}`, before_state: item.status, after_state: next, payload: JSON.stringify({ reason, administratorId }), created_at: now } }), ...(item.variant_id === null ? [] : [MyGlobal.prisma.shopping_inventory_movements.create({ data: { id: crypto.randomUUID(), variant_id: item.variant_id, quantity_delta: item.quantity, reason: `${next} restoration`, order_item_id: item.id, created_at: now } })])])); return adminAt(id); }

  export async function checkout(customerId: string, input: IShoppingOrder.ICheckout): Promise<IShoppingOrder> {
    const previous = await MyGlobal.prisma.shopping_payment_attempts.findUnique({ where: { idempotency_key: input.idempotencyKey } });
    if (previous !== null && previous.customer_id !== customerId) throw ErrorUtil.forbidden("The payment attempt belongs to another customer.");
    if (previous?.status === "failed") throw ErrorUtil.paymentRequired("The payment attempt already failed; retry with a new idempotency key.");
    if (previous?.status === "succeeded" && previous.gateway_reference !== null) return at(customerId, previous.gateway_reference);
    const address = await MyGlobal.prisma.shopping_customer_addresses.findFirst({ where: { id: input.addressId, customer_id: customerId } });
    if (address === null) throw ErrorUtil.notFound("The shipping address does not belong to the customer.");
    const cart = await MyGlobal.prisma.shopping_carts.findUnique({ where: { customer_id: customerId }, include: { lines: { include: { variant: { include: { product: { include: { seller: true }, }, inventory_movements: true } } } } } });
    if (cart === null || cart.lines.length === 0) throw ErrorUtil.badRequest("The cart has no purchasable lines.");
    const lines = cart.lines.filter((line) => {
      const stock = line.variant.inventory_movements.reduce((sum, movement) => sum + movement.quantity_delta, 0);
      return line.variant.deleted_at === null && line.variant.product.deleted_at === null && line.variant.product.seller.deleted_at === null && line.variant.product.seller.login_status === "active" && line.variant.product.seller.approval_status === "approved" && line.variant.product.seller.suspended_at === null && line.quantity >= 1 && stock >= line.quantity;
    });
    if (lines.length === 0) throw ErrorUtil.badRequest("The cart has no purchasable lines.");
    const now = new Date();
    const total = lines.reduce((sum, line) => sum + (line.variant.price_override ?? line.variant.product.base_price) * line.quantity, 0);
    const orderId = crypto.randomUUID();
    if (input.paymentOutcome === "failure") {
      await MyGlobal.prisma.shopping_payment_attempts.create({ data: { id: crypto.randomUUID(), customer_id: customerId, idempotency_key: input.idempotencyKey, status: "failed", amount: total, gateway_reference: null, detail: "The external payment gateway reported failure.", created_at: now, completed_at: now } });
      throw ErrorUtil.paymentRequired("The payment gateway reported failure; the cart remains available for retry.");
    }
    await MyGlobal.prisma.$transaction(async (tx) => {
      const payment = await tx.shopping_payment_attempts.upsert({ where: { idempotency_key: input.idempotencyKey }, create: { id: crypto.randomUUID(), customer_id: customerId, idempotency_key: input.idempotencyKey, status: "succeeded", amount: total, gateway_reference: orderId, detail: null, created_at: now, completed_at: now }, update: { status: "succeeded", amount: total, gateway_reference: orderId, completed_at: now } });
      if (payment.gateway_reference !== orderId && payment.gateway_reference !== null) return;
      await tx.shopping_orders.create({ data: { id: orderId, order_number: `ORD-${now.getTime()}-${crypto.randomBytes(3).toString("hex")}`, customer_id: customerId, purchased_at: now, total_price: total, shipping_recipient_name: address.recipient_name, shipping_recipient_phone: address.recipient_phone, shipping_street_address: address.street_address, shipping_city: address.city, shipping_state_or_province: address.state_or_province, shipping_postal_code: address.postal_code, shipping_country: address.country, created_at: now } });
      for (const line of lines) {
        const product = line.variant.product;
        const price = line.variant.price_override ?? product.base_price;
        const itemId = crypto.randomUUID();
        await tx.shopping_order_items.create({ data: { id: itemId, order_id: orderId, seller_id: product.seller_id, variant_id: line.variant_id, product_id: product.id, product_name: product.name, product_description: product.description, sku_code: line.variant.sku_code, option_values: line.variant.option_values, seller_shop_name: product.seller.shop_name ?? "", seller_logo_image: product.seller.logo_image ?? "", quantity: line.quantity, unit_price: price, status: "paid", purchased_at: now } });
        await tx.shopping_order_item_snapshots.create({ data: { id: crypto.randomUUID(), order_item_id: itemId, kind: "purchase", before_state: "", after_state: "paid", payload: JSON.stringify({ product, variant: line.variant }), created_at: now } });
        await tx.shopping_inventory_movements.create({ data: { id: crypto.randomUUID(), variant_id: line.variant_id, quantity_delta: -line.quantity, reason: "checkout", order_item_id: itemId, created_at: now } });
        await tx.shopping_cart_lines.delete({ where: { id: line.id } });
      }
    });
    return at(customerId, orderId);
  }

  const orderInclude = { items: true, shipments: { include: { items: true } } } as const;
  async function transition(itemId: string, orderId: string, before: string, after: "cancelled" | "refunded", reason: string, administratorId: string): Promise<void> { if (reason.trim().length === 0) throw ErrorUtil.badRequest("A force-action reason is required."); const item = await MyGlobal.prisma.shopping_order_items.findUniqueOrThrow({ where: { id: itemId } }); const now = new Date(); await MyGlobal.prisma.$transaction(async (tx) => { await tx.shopping_order_items.update({ where: { id: itemId }, data: { status: after } }); await tx.shopping_order_item_snapshots.create({ data: { id: crypto.randomUUID(), order_item_id: itemId, kind: `administrator ${after}`, before_state: before, after_state: after, payload: JSON.stringify({ reason, administratorId }), created_at: now } }); if (item.variant_id !== null) await tx.shopping_inventory_movements.create({ data: { id: crypto.randomUUID(), variant_id: item.variant_id, quantity_delta: item.quantity, reason: `${after} restoration`, order_item_id: itemId, created_at: now } }); }); }
  function dto(row: OrderRow): IShoppingOrder { const items = row.items.map((item) => ({ id: item.id, sellerId: item.seller_id, productName: item.product_name, productDescription: item.product_description, skuCode: item.sku_code, optionValues: JSON.parse(item.option_values) as Record<string, string>, sellerShopName: item.seller_shop_name, sellerLogoImage: item.seller_logo_image, quantity: item.quantity, unitPrice: item.unit_price, status: item.status, purchasedAt: item.purchased_at.toISOString() })); return { id: row.id, orderNumber: row.order_number, customerId: row.customer_id, purchasedAt: row.purchased_at.toISOString(), totalPrice: row.total_price, status: status(items), shippingAddress: { recipientName: row.shipping_recipient_name, recipientPhone: row.shipping_recipient_phone, streetAddress: row.shipping_street_address, city: row.shipping_city, stateOrProvince: row.shipping_state_or_province, postalCode: row.shipping_postal_code, country: row.shipping_country }, items, shipments: row.shipments.map((shipment) => ({ id: shipment.id, sellerId: shipment.seller_id, carrier: shipment.carrier, trackingNumber: shipment.tracking_number, shippedAt: shipment.shipped_at.toISOString(), deliveredAt: shipment.delivered_at?.toISOString() ?? null, itemIds: shipment.items.map((item) => item.order_item_id) })) }; }
  function status(items: Array<{ status: string }>): string { if (items.length === 0) return "cancelled"; if (items.every((item) => item.status === "refunded")) return "refunded"; if (items.every((item) => item.status === "cancelled")) return "cancelled"; if (items.every((item) => item.status === "delivered")) return "delivered"; if (items.some((item) => item.status === "shipped" || item.status === "delivered")) return "shipped"; return "paid"; }
  function page(input: IPage.IRequest, rows: IShoppingOrder[]): IPage<IShoppingOrder> { const current = input.page ?? 1; const limit = input.limit ?? 100; const records = rows.length; const pages = limit === 0 ? (records === 0 ? 0 : 1) : Math.ceil(records / limit); return { pagination: { current, limit, records, pages }, data: limit === 0 ? rows : rows.slice((current - 1) * limit, current * limit) }; }
}
