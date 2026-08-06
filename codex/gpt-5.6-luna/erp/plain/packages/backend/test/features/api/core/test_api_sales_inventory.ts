import * as api from "@benchmark/erp-api";
import typia from "typia";

/** Proves sales-order/invoice transitions and immutable stock movement capture. */
export async function test_api_sales_inventory(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-sales`, email = `owner-${suffix}@example.com`, password = "correct-horse-battery-staple";
  await api.functional.auth.user.createUser(connection, { email, password, displayName: "Owner" });
  const first = await api.functional.auth.user.login(connection, { email, password });
  const unaffiliated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${first.accessToken}` } };
  const org = await api.functional.organization.create(unaffiliated, { name: `Sales ${suffix}`, code: `sales-${suffix}`, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const second = await api.functional.auth.user.login(connection, { email, password });
  const membership = second.memberships.find((item) => item.organization.id === org.id); if (!membership) throw new Error("sales membership missing");
  const selected = await api.functional.auth.user.organization.select({ host: connection.host, headers: { Authorization: `Bearer ${second.accessToken}` } }, { membershipId: membership.id });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${selected.accessToken}` } };
  const customer = await api.functional.organization.customer.createCustomer(owner, { name: `Customer ${suffix}` });
  const unit = await api.functional.organization.unit.createUnit(owner, { code: "EA", name: "Each", category: "quantity" });
  const item = await api.functional.organization.item.createItem(owner, { sku: `S-${suffix}`, name: "Widget", item_type: "inventory", unit_id: unit.id });
  const warehouse = await api.functional.organization.warehouse.createWarehouse(owner, { code: `W-${suffix}`, name: "Main" });
  const order = await api.functional.organization.sales_order.createOrder(owner, { customer_id: customer.id, total: 80, lines_json: `[{\"itemId\":\"${item.id}\",\"quantity\":2}]` }); typia.assert(order);
  await api.functional.organization.sales_order.submit.submitOrder(owner, order.id);
  const approved = await api.functional.organization.sales_order.approve.approveOrder(owner, order.id); if (approved.status !== "approved") throw new Error("sales order did not approve");
  const invoice = await api.functional.organization.sales_invoice.createInvoice(owner, { customer_id: customer.id, order_id: order.id, total: 80 });
  const posted = await api.functional.organization.sales_invoice.post.postInvoice(owner, invoice.id); if (posted.status !== "posted") throw new Error("sales invoice did not post");
  const movement = await api.functional.organization.stock_movement.createMovement(owner, { item_id: item.id, warehouse_id: warehouse.id, quantity: 2, movement_type: "sale", source_document_id: order.id }); typia.assert(movement);
  if (movement.quantity !== 2 || movement.item_id !== item.id) throw new Error("stock movement did not retain source dimensions");
}
