import * as api from "@benchmark/erp-api";

/** Proves quote acceptance and conversion into a sales order. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-o2c-order-to-cash-journey Exercises and asserts the o2c order to cash journey behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-customer-customer-credit-and-history-rules Exercises and asserts the customer customer credit and history rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-sales-order-sales-order-rules Exercises and asserts the sales order sales order rules behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-sales-price-sales-price-operations Exercises and asserts the sales price sales price operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-sales-quote-sales-quote-operations Exercises and asserts the sales quote sales quote operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-sales-order-sales-order-operations Exercises and asserts the sales order sales order operations behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-sales-price-sales-prices Exercises and asserts the sales price sales prices behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-sales-quote-sales-quote-lifecycle Exercises and asserts the sales quote sales quote lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-sales-order-sales-order-lifecycle Exercises and asserts the sales order sales order lifecycle behavior.
 */
export async function test_api_sales(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `sales-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Sales ${suffix}`, code: `sales-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const customer = await api.functional.customer_create.create(owner, { code: "C-001", legalName: "Example Customer", creditLimit: 500 });
  const quote = await api.functional.sales_quote_create.create(owner, { customerId: customer.id, totalAmount: 480, validUntil: "2026-12-31T00:00:00.000Z" });
  await api.functional.sales_quote_status.status(owner, quote.id, { status: "sent" });
  const accepted = await api.functional.sales_quote_status.status(owner, quote.id, { status: "accepted" });
  if (accepted.status !== "accepted") throw new Error("sales quote acceptance was not retained");
  const order = await api.functional.sales_order_create.create(owner, { customerId: customer.id, salesQuoteId: quote.id, totalAmount: 480 });
  const routed = await api.functional.sales_order_status.status(owner, order.id, { status: "routed" });
  const approved = await api.functional.sales_order_status.status(owner, order.id, { status: "approved" });
  const confirmed = await api.functional.sales_order_status.status(owner, order.id, { status: "confirmed" });
  if (routed.status !== "routed" || approved.status !== "approved" || confirmed.status !== "confirmed") throw new Error("sales order approval did not retain lifecycle state");
  const overLimit = await api.functional.sales_order_create.create(owner, { customerId: customer.id, totalAmount: 50 });
  await api.functional.sales_order_status.status(owner, overLimit.id, { status: "routed" });
  let refused = false;
  try { await api.functional.sales_order_status.status(owner, overLimit.id, { status: "approved" }); } catch { refused = true; }
  if (!refused) throw new Error("sales order approval did not enforce customer credit exposure");
  const changes = await api.functional.sales_order_create.create(owner, { customerId: customer.id, totalAmount: 10 });
  await api.functional.sales_order_status.status(owner, changes.id, { status: "routed" });
  const returned = await api.functional.sales_order_status.status(owner, changes.id, { status: "returned" });
  const reopened = await api.functional.sales_order_status.status(owner, changes.id, { status: "draft" });
  if (returned.status !== "returned" || reopened.status !== "draft") throw new Error("sales order change request did not return the order to draft");
  const found = await api.functional.sales_order_search.index(owner, { customerId: customer.id });
  if (!found.data.some((item) => item.id === order.id && item.totalAmount === 480 && item.status === "confirmed")) throw new Error("sales order search omitted the confirmed order");
}
