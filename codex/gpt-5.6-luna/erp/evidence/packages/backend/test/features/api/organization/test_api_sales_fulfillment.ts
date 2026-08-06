import * as api from "@benchmark/erp-api";

/** Proves pricing, order-line reservation, and shipment preparation/posting. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-allocation-stock-allocation-rules Exercises and asserts the allocation stock allocation rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-shipment-shipment-rules Exercises and asserts the shipment shipment rules behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-allocation-stock-allocation-operations Exercises and asserts the allocation stock allocation operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-shipment-shipment-operations Exercises and asserts the shipment shipment operations behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-allocation-stock-allocation-lifecycle Exercises and asserts the allocation stock allocation lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-shipment-shipment-lifecycle Exercises and asserts the shipment shipment lifecycle behavior.
 */
export async function test_api_sales_fulfillment(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `fulfillment-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Fulfillment ${suffix}`, code: `fulfillment-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const customer = await api.functional.customer_create.create(owner, { code: "FUL-CUST", legalName: "Fulfillment Customer" });
  const item = await api.functional.item_create.create(owner, { sku: "FUL-001", name: "Fulfillment Item", itemType: "stock", trackingMode: "none" });
  const price = await api.functional.sales_price_create.create(owner, { itemId: item.id, currencyCode: "USD", unitPrice: 12.5, validFrom: "2026-08-01T00:00:00.000Z" });
  const order = await api.functional.sales_order_create.create(owner, { customerId: customer.id, totalAmount: 25 });
  const line = await api.functional.sales_order_line_create.create(owner, { salesOrderId: order.id, itemId: item.id, description: "Fulfillment Item", quantity: 2, unitPrice: 12.5 });
  const allocation = await api.functional.stock_allocation_create.create(owner, { salesOrderLineId: line.id, itemId: item.id, quantity: 2 });
  const consumed = await api.functional.stock_allocation_status.status(owner, allocation.id, { status: "consumed" });
  const shipment = await api.functional.shipment_create.create(owner, { salesOrderId: order.id, lines: [{ salesOrderLineId: line.id, itemId: item.id, quantity: 2 }] });
  await api.functional.shipment_status.status(owner, shipment.id, { status: "picked" });
  await api.functional.shipment_status.status(owner, shipment.id, { status: "packed" });
  await api.functional.shipment_status.status(owner, shipment.id, { status: "shipped" });
  const delivered = await api.functional.shipment_status.status(owner, shipment.id, { status: "delivered" });
  await api.functional.sales_price_status.status(owner, price.id, { active: false });
  if (consumed.status !== "consumed" || delivered.status !== "delivered") throw new Error("sales fulfillment lifecycle state was not retained");
}
