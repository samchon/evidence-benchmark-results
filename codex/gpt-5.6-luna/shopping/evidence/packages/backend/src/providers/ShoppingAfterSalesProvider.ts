import crypto from "node:crypto";
import type { IPage, IShoppingCancellationRequest, IShoppingCustomer, IShoppingOrder, IShoppingRefundRequest, IShoppingReview } from "@benchmark/shopping-api";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Owns fulfillment, cancellation, refund, and review transitions. */
export namespace ShoppingAfterSalesProvider {
  interface OrderItemRow { id: string; seller_id: string; product_name: string; product_description: string; sku_code: string; option_values: string; seller_shop_name: string; seller_logo_image: string; quantity: number; unit_price: number; status: string; purchased_at: Date; }
  interface CancellationRow { id: string; order_item_id: string; reason: string; status: string; created_at: Date; decided_at: Date | null; }
  interface RefundRow { id: string; order_item_id: string; reason: string; status: string; deadline_at: Date; created_at: Date; decided_at: Date | null; }
  interface ReviewRow { id: string; anonymized: boolean; customer_id: string; product_id: string; order_id: string; rating: number; text: string | null; published_at: Date; }
  /** Applies the documented fourteen-day delivery transition to due shipments. */
  export async function autoConfirmExpiredShipments(): Promise<void> {
    const threshold = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const rows = await MyGlobal.prisma.shopping_shipments.findMany({ where: { delivered_at: null, shipped_at: { lte: threshold } }, include: { items: true } });
    for (const row of rows) {
      const now = new Date();
      await MyGlobal.prisma.$transaction(async (tx) => {
        const current = await tx.shopping_shipments.findUnique({ where: { id: row.id }, include: { items: true } });
        if (current === null || current.delivered_at !== null) return;
        await tx.shopping_shipments.update({ where: { id: row.id }, data: { delivered_at: now } });
        for (const item of current.items) {
          const orderItem = await tx.shopping_order_items.findUniqueOrThrow({ where: { id: item.order_item_id } });
          if (orderItem.status !== "shipped") continue;
          await tx.shopping_order_items.update({ where: { id: item.order_item_id }, data: { status: "delivered" } });
          await tx.shopping_order_item_snapshots.create({ data: { id: crypto.randomUUID(), order_item_id: item.order_item_id, kind: "automatic delivery", before_state: "shipped", after_state: "delivered", payload: JSON.stringify({ shipmentId: row.id, reason: "fourteen-day confirmation" }), created_at: now } });
        }
      });
    }
  }

  export async function shipmentItems(sellerId: string, input: IPage.IRequest): Promise<IPage<IShoppingOrder.IItem>> {
    await autoConfirmExpiredShipments();
    const rows = await MyGlobal.prisma.shopping_order_items.findMany({ where: { seller_id: sellerId, status: "paid", shipment_items: { none: {} } }, orderBy: [{ purchased_at: "asc" }, { id: "asc" }] });
    return page(input, rows.map(item));
  }

  export async function shipmentCreate(sellerId: string, input: IShoppingOrder.IShipmentCreate): Promise<IShoppingOrder.IShipment> {
    if (input.itemIds.length === 0) throw ErrorUtil.badRequest("A shipment must contain at least one item.");
    const rows = await MyGlobal.prisma.shopping_order_items.findMany({ where: { id: { in: input.itemIds } }, include: { shipment_items: true } });
    if (rows.length !== input.itemIds.length || rows.some((row) => row.seller_id !== sellerId || row.status !== "paid" || row.shipment_items.length !== 0)) throw ErrorUtil.forbidden("Every shipment item must be an unshipped paid item owned by the seller.");
    const orderId = rows[0]!.order_id;
    if (rows.some((row) => row.order_id !== orderId)) throw ErrorUtil.badRequest("A shipment cannot combine items from different orders.");
    const now = new Date();
    const shipmentId = crypto.randomUUID();
    await MyGlobal.prisma.$transaction(async (tx) => {
      await tx.shopping_shipments.create({ data: { id: shipmentId, order_id: orderId, seller_id: sellerId, carrier: input.carrier, tracking_number: input.trackingNumber, shipped_at: now } });
      for (const row of rows) {
        await tx.shopping_shipment_items.create({ data: { id: crypto.randomUUID(), shipment_id: shipmentId, order_item_id: row.id } });
        await tx.shopping_order_items.update({ where: { id: row.id }, data: { status: "shipped" } });
        await tx.shopping_order_item_snapshots.create({ data: { id: crypto.randomUUID(), order_item_id: row.id, kind: "shipment", before_state: "paid", after_state: "shipped", payload: JSON.stringify({ shipmentId, carrier: input.carrier, trackingNumber: input.trackingNumber }), created_at: now } });
      }
    });
    return shipmentAt(shipmentId);
  }

  export async function shipmentAt(id: string, sellerId?: string): Promise<IShoppingOrder.IShipment> {
    await autoConfirmExpiredShipments();
    const row = await MyGlobal.prisma.shopping_shipments.findUnique({ where: { id }, include: { items: true } });
    if (row === null) throw ErrorUtil.notFound("The shipment does not exist.");
    if (sellerId !== undefined && row.seller_id !== sellerId) throw ErrorUtil.forbidden("The shipment is owned by another seller.");
    return { id: row.id, sellerId: row.seller_id, carrier: row.carrier, trackingNumber: row.tracking_number, shippedAt: row.shipped_at.toISOString(), deliveredAt: row.delivered_at?.toISOString() ?? null, itemIds: row.items.map((item) => item.order_item_id) };
  }

  export async function shipmentDeliver(sellerId: string, id: string): Promise<IShoppingOrder.IShipment> {
    const row = await MyGlobal.prisma.shopping_shipments.findUnique({ where: { id }, include: { items: true } });
    if (row === null) throw ErrorUtil.notFound("The shipment does not exist.");
    if (row.seller_id !== sellerId) throw ErrorUtil.forbidden("The shipment is owned by another seller.");
    if (row.delivered_at !== null) return shipmentAt(id, sellerId);
    const now = new Date();
    await MyGlobal.prisma.$transaction(async (tx) => {
      await tx.shopping_shipments.update({ where: { id }, data: { delivered_at: now } });
      for (const item of row.items) {
        const current = await tx.shopping_order_items.findUniqueOrThrow({ where: { id: item.order_item_id } });
        if (current.status === "shipped") {
          await tx.shopping_order_items.update({ where: { id: item.order_item_id }, data: { status: "delivered" } });
          await tx.shopping_order_item_snapshots.create({ data: { id: crypto.randomUUID(), order_item_id: item.order_item_id, kind: "delivery", before_state: "shipped", after_state: "delivered", payload: JSON.stringify({ shipmentId: id }), created_at: now } });
        }
      }
    });
    return shipmentAt(id, sellerId);
  }

  export async function cancellationCreate(customerId: string, input: IShoppingCancellationRequest.ICreate): Promise<IShoppingCancellationRequest> {
    const item = await MyGlobal.prisma.shopping_order_items.findFirst({ where: { id: input.orderItemId, order: { customer_id: customerId }, status: "paid" } });
    if (item === null) throw ErrorUtil.badRequest("Only a paid item owned by the customer can be cancelled.");
    if (await MyGlobal.prisma.shopping_cancellation_requests.findFirst({ where: { order_item_id: item.id, status: "pending" } }) !== null) throw ErrorUtil.conflict("A cancellation request is already pending for this item.");
    const row = await MyGlobal.prisma.shopping_cancellation_requests.create({ data: { id: crypto.randomUUID(), order_item_id: item.id, customer_id: customerId, seller_id: item.seller_id, reason: input.reason, status: "pending", created_at: new Date(), decided_at: null, decided_by: null } });
    return cancellation(row);
  }

  export async function cancellationIndex(customerId: string, input: IPage.IRequest): Promise<IPage<IShoppingCancellationRequest>> { const rows = await MyGlobal.prisma.shopping_cancellation_requests.findMany({ where: { customer_id: customerId }, orderBy: [{ created_at: "desc" }, { id: "desc" }] }); return page(input, rows.map(cancellation)); }
  export async function cancellationSellerIndex(sellerId: string, input: IPage.IRequest): Promise<IPage<IShoppingCancellationRequest>> { const rows = await MyGlobal.prisma.shopping_cancellation_requests.findMany({ where: { seller_id: sellerId }, orderBy: [{ created_at: "asc" }, { id: "asc" }] }); return page(input, rows.map(cancellation)); }

  export async function cancellationDecide(sellerId: string, id: string, input: IShoppingCancellationRequest.IDecision): Promise<IShoppingCancellationRequest> {
    const row = await MyGlobal.prisma.shopping_cancellation_requests.findUnique({ where: { id }, include: { order_item: true } });
    if (row === null) throw ErrorUtil.notFound("The cancellation request does not exist.");
    if (row.seller_id !== sellerId || row.status !== "pending" || row.order_item.status !== "paid") throw ErrorUtil.forbidden("The cancellation request is not eligible for this seller decision.");
    const after = input.approve ? "approved" : "rejected";
    const now = new Date();
    await MyGlobal.prisma.$transaction(async (tx) => {
      await tx.shopping_cancellation_requests.update({ where: { id }, data: { status: after, decided_at: now, decided_by: sellerId } });
      await tx.shopping_cancellation_snapshots.create({ data: { id: crypto.randomUUID(), request_id: id, reason: row.reason, before_status: "pending", after_status: after, decided_by: sellerId, created_at: now } });
      if (input.approve) {
        await tx.shopping_order_items.update({ where: { id: row.order_item_id }, data: { status: "cancelled" } });
        if (row.order_item.variant_id !== null) await tx.shopping_inventory_movements.create({ data: { id: crypto.randomUUID(), variant_id: row.order_item.variant_id, quantity_delta: row.order_item.quantity, reason: "cancellation restoration", order_item_id: row.order_item_id, created_at: now } });
      }
    });
    return cancellation(await MyGlobal.prisma.shopping_cancellation_requests.findUniqueOrThrow({ where: { id } }));
  }

  export async function refundCreate(customerId: string, input: IShoppingRefundRequest.ICreate): Promise<IShoppingRefundRequest> {
    const item = await MyGlobal.prisma.shopping_order_items.findFirst({ where: { id: input.orderItemId, order: { customer_id: customerId }, status: "delivered" }, include: { shipment_items: { include: { shipment: true } } } });
    const deliveredAt = item?.shipment_items.at(-1)?.shipment.delivered_at;
    if (item === null || deliveredAt === null || deliveredAt === undefined || Date.now() > deliveredAt.getTime() + 7 * 24 * 60 * 60 * 1000) throw ErrorUtil.badRequest("The item is outside the seven-day refund window.");
    if (await MyGlobal.prisma.shopping_refund_requests.findFirst({ where: { order_item_id: item.id, status: "pending" } }) !== null) throw ErrorUtil.conflict("A refund request is already pending for this item.");
    const deadline = new Date(deliveredAt.getTime() + 7 * 24 * 60 * 60 * 1000);
    const row = await MyGlobal.prisma.shopping_refund_requests.create({ data: { id: crypto.randomUUID(), order_item_id: item.id, customer_id: customerId, seller_id: item.seller_id, reason: input.reason, status: "pending", deadline_at: deadline, created_at: new Date(), decided_at: null, decided_by: null } });
    return refund(row);
  }

  export async function refundIndex(customerId: string, input: IPage.IRequest): Promise<IPage<IShoppingRefundRequest>> { const rows = await MyGlobal.prisma.shopping_refund_requests.findMany({ where: { customer_id: customerId }, orderBy: [{ created_at: "desc" }, { id: "desc" }] }); return page(input, rows.map(refund)); }
  export async function refundSellerIndex(sellerId: string, input: IPage.IRequest): Promise<IPage<IShoppingRefundRequest>> { const rows = await MyGlobal.prisma.shopping_refund_requests.findMany({ where: { seller_id: sellerId }, orderBy: [{ created_at: "asc" }, { id: "asc" }] }); return page(input, rows.map(refund)); }

  export async function refundDecide(sellerId: string, id: string, input: IShoppingRefundRequest.IDecision): Promise<IShoppingRefundRequest> {
    const row = await MyGlobal.prisma.shopping_refund_requests.findUnique({ where: { id }, include: { order_item: true } });
    if (row === null) throw ErrorUtil.notFound("The refund request does not exist.");
    if (row.seller_id !== sellerId || row.status !== "pending" || row.order_item.status !== "delivered" || row.deadline_at < new Date()) throw ErrorUtil.forbidden("The refund request is not eligible for this seller decision.");
    const after = input.approve ? "approved" : "rejected";
    const now = new Date();
    await MyGlobal.prisma.$transaction(async (tx) => {
      await tx.shopping_refund_requests.update({ where: { id }, data: { status: after, decided_at: now, decided_by: sellerId } });
      await tx.shopping_refund_snapshots.create({ data: { id: crypto.randomUUID(), request_id: id, reason: row.reason, before_status: "pending", after_status: after, decided_by: sellerId, created_at: now } });
      if (input.approve) {
        await tx.shopping_order_items.update({ where: { id: row.order_item_id }, data: { status: "refunded" } });
        if (row.order_item.variant_id !== null) await tx.shopping_inventory_movements.create({ data: { id: crypto.randomUUID(), variant_id: row.order_item.variant_id, quantity_delta: row.order_item.quantity, reason: "refund restoration", order_item_id: row.order_item_id, created_at: now } });
      }
    });
    return refund(await MyGlobal.prisma.shopping_refund_requests.findUniqueOrThrow({ where: { id } }));
  }

  export async function reviewIndex(customerId: string, productId: string, input: IPage.IRequest): Promise<IPage<IShoppingReview>> { await customer(customerId); const rows = await MyGlobal.prisma.shopping_reviews.findMany({ where: { product_id: productId, deleted_at: null }, orderBy: [{ published_at: "desc" }, { id: "desc" }] }); return page(input, rows.map(review)); }
  export async function reviewCreate(customerId: string, input: IShoppingReview.ICreate): Promise<IShoppingReview> {
    const item = await MyGlobal.prisma.shopping_order_items.findFirst({ where: { order_id: input.orderId, product_id: input.productId, order: { customer_id: customerId }, status: "delivered" } });
    if (item === null) throw ErrorUtil.forbidden("A delivered purchase of the product is required to publish a review.");
    validateRating(input.rating);
    if (await MyGlobal.prisma.shopping_reviews.findFirst({ where: { customer_id: customerId, product_id: input.productId, order_id: input.orderId } }) !== null) throw ErrorUtil.conflict("A review already exists for this customer, product, and order.");
    const now = new Date();
    const row = await MyGlobal.prisma.shopping_reviews.create({ data: { id: crypto.randomUUID(), customer_id: customerId, product_id: input.productId, order_id: input.orderId, rating: input.rating, text: input.text ?? null, published_at: now, updated_at: now, deleted_at: null, anonymized: false } });
    return review(row);
  }
  export async function reviewUpdate(customerId: string, id: string, input: IShoppingReview.IUpdate): Promise<IShoppingReview> { const row = await MyGlobal.prisma.shopping_reviews.findFirst({ where: { id, customer_id: customerId, deleted_at: null } }); if (row === null) throw ErrorUtil.notFound("The review does not exist."); validateRating(input.rating); const now = new Date(); await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_reviews.update({ where: { id }, data: { rating: input.rating, text: input.text ?? null, updated_at: now } }), MyGlobal.prisma.shopping_review_snapshots.create({ data: { id: crypto.randomUUID(), review_id: id, before_rating: row.rating, after_rating: input.rating, before_text: row.text, after_text: input.text ?? null, changed_fields: JSON.stringify({ rating: true, text: true }), created_at: now } })]); return review(await MyGlobal.prisma.shopping_reviews.findUniqueOrThrow({ where: { id } })); }
  export async function reviewErase(customerId: string, id: string): Promise<IShoppingCustomer.IResult> { const row = await MyGlobal.prisma.shopping_reviews.findFirst({ where: { id, customer_id: customerId, deleted_at: null } }); if (row === null) throw ErrorUtil.notFound("The review does not exist."); await MyGlobal.prisma.shopping_reviews.update({ where: { id }, data: { deleted_at: new Date() } }); return { success: true }; }

  function item(row: OrderItemRow): IShoppingOrder.IItem { return { id: row.id, sellerId: row.seller_id, productName: row.product_name, productDescription: row.product_description, skuCode: row.sku_code, optionValues: JSON.parse(row.option_values) as Record<string, string>, sellerShopName: row.seller_shop_name, sellerLogoImage: row.seller_logo_image, quantity: row.quantity, unitPrice: row.unit_price, status: row.status, purchasedAt: row.purchased_at.toISOString() }; }
  function cancellation(row: CancellationRow): IShoppingCancellationRequest { return { id: row.id, orderItemId: row.order_item_id, reason: row.reason, status: row.status, createdAt: row.created_at.toISOString(), decidedAt: row.decided_at?.toISOString() ?? null }; }
  function refund(row: RefundRow): IShoppingRefundRequest { return { id: row.id, orderItemId: row.order_item_id, reason: row.reason, status: row.status, deadlineAt: row.deadline_at.toISOString(), createdAt: row.created_at.toISOString(), decidedAt: row.decided_at?.toISOString() ?? null }; }
  function review(row: ReviewRow): IShoppingReview { return { id: row.id, customerId: row.anonymized ? null : row.customer_id, productId: row.product_id, orderId: row.order_id, rating: row.rating, text: row.text, publishedAt: row.published_at.toISOString(), anonymized: row.anonymized }; }
  async function customer(id: string) { const row = await MyGlobal.prisma.shopping_customers.findFirst({ where: { id, deleted_at: null, login_status: "active" } }); if (row === null) throw ErrorUtil.unauthorized("The customer session is no longer valid."); return row; }
  function validateRating(rating: number): void { if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw ErrorUtil.badRequest("A review rating must be an integer from 1 through 5."); }
  function page<T extends object>(input: IPage.IRequest, rows: T[]): IPage<T> { const current = input.page ?? 1; const limit = input.limit ?? 100; const records = rows.length; const pages = limit === 0 ? (records === 0 ? 0 : 1) : Math.ceil(records / limit); return { pagination: { current, limit, records, pages }, data: limit === 0 ? rows : rows.slice((current - 1) * limit, current * limit) }; }
}
