import * as api from "@benchmark/erp-api";
import typia from "typia";

/** Proves BOM activation and production-order release/completion. */
export async function test_api_manufacturing(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-mfg`, email = `owner-${suffix}@example.com`, password = "correct-horse-battery-staple";
  await api.functional.auth.user.createUser(connection, { email, password, displayName: "Owner" });
  const first = await api.functional.auth.user.login(connection, { email, password });
  const unaffiliated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${first.accessToken}` } };
  const org = await api.functional.organization.create(unaffiliated, { name: `Mfg ${suffix}`, code: `mfg-${suffix}`, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const second = await api.functional.auth.user.login(connection, { email, password });
  const membership = second.memberships.find((item) => item.organization.id === org.id); if (!membership) throw new Error("manufacturing membership missing");
  const selected = await api.functional.auth.user.organization.select({ host: connection.host, headers: { Authorization: `Bearer ${second.accessToken}` } }, { membershipId: membership.id });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${selected.accessToken}` } };
  const unit = await api.functional.organization.unit.createUnit(owner, { code: "EA", name: "Each", category: "quantity" });
  const item = await api.functional.organization.item.createItem(owner, { sku: `M-${suffix}`, name: "Assembly", item_type: "inventory", unit_id: unit.id });
  const bom = await api.functional.organization.bom.createBom(owner, { item_id: item.id, components_json: "[]" }); typia.assert(bom);
  const active = await api.functional.organization.bom.activate.activateBom(owner, bom.id); if (active.status !== "active") throw new Error("BOM did not activate");
  const order = await api.functional.organization.production_order.createOrder(owner, { bom_id: bom.id, item_id: item.id, planned_quantity: 5 });
  await api.functional.organization.production_order.release.releaseOrder(owner, order.id);
  const completed = await api.functional.organization.production_order.complete.completeOrder(owner, order.id, { quantity: 5 }); if (completed.status !== "completed") throw new Error("production order did not complete");
}
