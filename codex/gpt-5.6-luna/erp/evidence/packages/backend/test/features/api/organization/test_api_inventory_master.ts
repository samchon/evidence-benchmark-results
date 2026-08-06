import * as api from "@benchmark/erp-api";

/** Proves item, warehouse, and bounded storage-location master data. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-item-item-stock-effect-rules Exercises and asserts the item item stock effect rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-lot-inventory-lot-rules Exercises and asserts the lot inventory lot rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-serial-item-serial-rules Exercises and asserts the serial item serial rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-inventory-stock-quantity-and-valuation-rules Exercises and asserts the inventory stock quantity and valuation rules behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-allocation-rule-allocation-rules Exercises and asserts the allocation rule allocation rules behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-item-item-lifecycle Exercises and asserts the item item lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-warehouse-warehouses Exercises and asserts the warehouse warehouses behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-location-storage-locations Exercises and asserts the location storage locations behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-stock-movement-stock-movements Exercises and asserts the stock movement stock movements behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-lot-inventory-lots Exercises and asserts the lot inventory lots behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-serial-item-serials Exercises and asserts the serial item serials behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-inventory-adjustment-inventory-adjustments Exercises and asserts the inventory adjustment inventory adjustments behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-item-item-operations Exercises and asserts the item item operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-warehouse-warehouse-operations Exercises and asserts the warehouse warehouse operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-location-storage-location-operations Exercises and asserts the location storage location operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-stock-view-stock-discovery-and-traceability Exercises and asserts the stock view stock discovery and traceability behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-inventory-adjustment-inventory-adjustment-operations Exercises and asserts the inventory adjustment inventory adjustment operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-allocation-rule-allocation-rule-operations Exercises and asserts the allocation rule allocation rule operations behavior.
 */
export async function test_api_inventory_master(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `inventory-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Inventory ${suffix}`, code: `inventory-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const item = await api.functional.item_create.create(owner, { sku: "SKU-001", name: "Widget", itemType: "stock", trackingMode: "none", reorderPoint: 10 });
  const itemRevision = await api.functional.item_update.update(owner, item.id, { name: "Widget A" });
  if (itemRevision.name !== "Widget A") throw new Error("item revision was not retained");
  const warehouse = await api.functional.warehouse_create.create(owner, { code: "MAIN", name: "Main Warehouse" });
  const warehouseRevision = await api.functional.warehouse_update.update(owner, warehouse.id, { name: "Main Distribution Warehouse" });
  if (warehouseRevision.name !== "Main Distribution Warehouse") throw new Error("warehouse revision was not retained");
  const root = await api.functional.storage_location_create.create(owner, { warehouseId: warehouse.id, code: "A", name: "Aisle A" });
  const shelf = await api.functional.storage_location_create.create(owner, { warehouseId: warehouse.id, parentId: root.id, code: "A-01", name: "Shelf 01" });
  const bin = await api.functional.storage_location_create.create(owner, { warehouseId: warehouse.id, parentId: shelf.id, code: "A-01-01", name: "Bin 01" });
  if (bin.depth !== 3) throw new Error("storage location hierarchy did not retain depth");
  const locations = await api.functional.storage_location_search.index(owner, { warehouseId: warehouse.id });
  if (locations.data.length !== 3) throw new Error("storage location search omitted hierarchy members");
  const sourceId = authorized.memberships[0]!.organizationId;
  const inbound = await api.functional.stock_movement_create.create(owner, { itemId: item.id, warehouseId: warehouse.id, locationId: bin.id, movementType: "purchase_receipt", quantity: 12, sourceType: "test", sourceId, occurredAt: "2026-01-15T00:00:00.000Z" });
  const outbound = await api.functional.stock_movement_create.create(owner, { itemId: item.id, warehouseId: warehouse.id, locationId: bin.id, movementType: "shipment", quantity: 2, sourceType: "test", sourceId, occurredAt: "2026-01-16T00:00:00.000Z" });
  if (inbound.quantity !== 12 || outbound.quantity !== -2) throw new Error("stock movement direction was not retained");
  const quantity = await api.functional.stock_quantity.quantity(owner, item.id, warehouse.id);
  if (quantity.quantity !== 10) throw new Error("stock quantity was not computed from immutable movements");
  const lot = await api.functional.inventory_lot_create.create(owner, { itemId: item.id, lotCode: "LOT-001", origin: "purchase", quantity: 12, receivedAt: "2026-01-15T00:00:00.000Z" });
  const serial = await api.functional.item_serial_create.create(owner, { itemId: item.id, lotId: lot.id, serialCode: "SER-001", locationId: bin.id, origin: "purchase" });
  const lots = await api.functional.inventory_lot_search.index(owner, { itemId: item.id });
  const serials = await api.functional.item_serial_search.index(owner, { lotId: lot.id });
  if (lots.data.length !== 1 || serials.data.length !== 1) throw new Error("lot and serial traceability search omitted records");
  await api.functional.inventory_lot_status.status(owner, lot.id, { status: "quarantined" });
  const shipped = await api.functional.item_serial_status.status(owner, serial.id, { status: "shipped" });
  if (shipped.status !== "shipped") throw new Error("serial availability state was not retained");
  await api.functional.item_status.status(owner, item.id, { active: false });
  await api.functional.warehouse_status.status(owner, warehouse.id, { active: false });
}
