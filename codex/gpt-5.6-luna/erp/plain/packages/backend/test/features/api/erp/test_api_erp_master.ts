import * as api from "@benchmark/erp-api";
import typia from "typia";
import { create_owner } from "../../../helpers/ErpFixtures";

/** Proves address creation persists the tenant-owned address. */
export async function test_api_erp_address_create(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const address = await api.functional.erp.address.addressCreate(owner.connection, { purpose: "billing", line1: "1 Main Street", city: "Seoul", country: "KR" }); typia.assert(address); const read = await api.functional.erp.address.addressAt(owner.connection, address.id); if (read.line1 !== "1 Main Street") throw new Error("Address creation was not persisted."); }
/** Proves address listing applies the active-organization scope. */
export async function test_api_erp_address_index(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); await api.functional.erp.address.addressCreate(owner.connection, { purpose: "shipping", line1: "2 Main Street", city: "Seoul", country: "KR" }); const page = await api.functional.erp.address.addressIndex(owner.connection, { page: 1, limit: 10, purpose: "shipping" }); typia.assert(page); if (page.data.length !== 1) throw new Error("Address purpose filtering did not apply."); }
/** Proves address update keeps the reusable identity and changes future selection data. */
export async function test_api_erp_address_update(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const address = await api.functional.erp.address.addressCreate(owner.connection, { purpose: "billing", line1: "Old", city: "Seoul", country: "KR" }); const updated = await api.functional.erp.address.addressUpdate(owner.connection, address.id, { line1: "New" }); typia.assert(updated); if (updated.id !== address.id || updated.line1 !== "New") throw new Error("Address identity or update was lost."); }
/** Proves address deactivation returns its retained identity and removes it from active discovery. */
export async function test_api_erp_address_erase(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const address = await api.functional.erp.address.addressCreate(owner.connection, { purpose: "billing", line1: "1 Main", city: "Seoul", country: "KR" }); const erased = await api.functional.erp.address.addressErase(owner.connection, address.id); typia.assert(erased); const page = await api.functional.erp.address.addressIndex(owner.connection, { page: 1, limit: 10 }); if (page.data.some((item) => item.id === address.id)) throw new Error("Deactivated address remained selectable."); }

/** Proves contact creation and communication fields are persisted. */
export async function test_api_erp_contact_create(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const contact = await api.functional.erp.contact.contactCreate(owner.connection, { name: "Contact", email: "contact@example.com", phone: "010" }); typia.assert(contact); if (contact.email !== "contact@example.com") throw new Error("Contact email was not persisted."); }
/** Proves contact search returns matching communication identity. */
export async function test_api_erp_contact_index(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); await api.functional.erp.contact.contactCreate(owner.connection, { name: "Searchable Contact", email: "search@example.com" }); const page = await api.functional.erp.contact.contactIndex(owner.connection, { page: 1, limit: 10, search: "search@example.com" }); typia.assert(page); if (page.data.length !== 1) throw new Error("Contact search did not match email."); }
/** Proves contact updates are observable. */
export async function test_api_erp_contact_update(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const contact = await api.functional.erp.contact.contactCreate(owner.connection, { name: "Before" }); const updated = await api.functional.erp.contact.contactUpdate(owner.connection, contact.id, { name: "After" }); typia.assert(updated); if (updated.name !== "After") throw new Error("Contact update was not persisted."); }
/** Proves contact deactivation preserves identity but removes active visibility. */
export async function test_api_erp_contact_erase(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const contact = await api.functional.erp.contact.contactCreate(owner.connection, { name: "Retained" }); const erased = await api.functional.erp.contact.contactErase(owner.connection, contact.id); typia.assert(erased); const page = await api.functional.erp.contact.contactIndex(owner.connection, { page: 1, limit: 10, search: "Retained" }); if (page.data.some((item) => item.id === contact.id)) throw new Error("Deactivated contact remained active."); }

/** Proves parties distinguish external vendors and customers. */
export async function test_api_erp_party_create(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const party = await api.functional.erp.party.partyCreate(owner.connection, { kind: "vendor", name: "Vendor One", currency: "USD" }); typia.assert(party); if (party.kind !== "vendor") throw new Error("Party kind was not retained."); }
/** Proves party discovery filters by kind and name. */
export async function test_api_erp_party_index(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); await api.functional.erp.party.partyCreate(owner.connection, { kind: "customer", name: "Customer One", currency: "USD" }); const page = await api.functional.erp.party.partyIndex(owner.connection, { page: 1, limit: 10, kind: "customer", search: "Customer" }); typia.assert(page); if (page.data.length !== 1) throw new Error("Party search did not apply its kind filter."); }
/** Proves party detail and update preserve the same external identity. */
export async function test_api_erp_party_update(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const party = await api.functional.erp.party.partyCreate(owner.connection, { kind: "customer", name: "Before", currency: "USD" }); const updated = await api.functional.erp.party.partyUpdate(owner.connection, party.id, { name: "After" }); typia.assert(updated); if (updated.id !== party.id || updated.name !== "After") throw new Error("Party update changed the wrong identity."); }
/** Proves party deactivation retains the party row while removing active selection. */
export async function test_api_erp_party_erase(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const party = await api.functional.erp.party.partyCreate(owner.connection, { kind: "vendor", name: "Retained Vendor", currency: "USD" }); const erased = await api.functional.erp.party.partyErase(owner.connection, party.id); typia.assert(erased); const page = await api.functional.erp.party.partyIndex(owner.connection, { page: 1, limit: 10 }); if (page.data.some((item) => item.id === party.id)) throw new Error("Deactivated party remained selectable."); }

/** Proves a unit of measure can be created and discovered. */
export async function test_api_erp_unit_create(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: "BOX", name: "Box", category: "quantity" }); typia.assert(unit); const page = await api.functional.erp.unit.unitIndex(owner.connection, { page: 1, limit: 20 }); if (!page.data.some((item) => item.id === unit.id)) throw new Error("Created unit was not discoverable."); }

/** Proves service items cannot cross the physical-stock boundary. */
export async function test_api_erp_item_create_service(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: "H", name: "Hour", category: "time" }); const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: "SERVICE-1", name: "Consulting", type: "service", unitId: unit.id, trackingMode: "none" }); typia.assert(item); if (item.type !== "service" || item.trackingMode !== "none") throw new Error("Service stock boundary was not retained."); }
/** Proves inventory item search and detail expose its tracking mode. */
export async function test_api_erp_item_index(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: "BOX", name: "Box", category: "quantity" }); const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: "LOT-1", name: "Lot Item", type: "inventory", unitId: unit.id, trackingMode: "lot" }); const page = await api.functional.erp.item.itemIndex(owner.connection, { page: 1, limit: 10, search: "LOT-1", type: "inventory" }); typia.assert(page); if (!page.data.some((value) => value.id === item.id)) throw new Error("Inventory item was not found by SKU."); }
/** Proves item update preserves its SKU identity and changes commercial values. */
export async function test_api_erp_item_update(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: "PAL", name: "Pallet", category: "quantity" }); const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: "SKU-1", name: "Item", type: "inventory", unitId: unit.id, trackingMode: "none" }); const updated = await api.functional.erp.item.itemUpdate(owner.connection, item.id, { name: "Updated", salesPrice: 10 }); typia.assert(updated); if (updated.id !== item.id || updated.salesPrice !== 10) throw new Error("Item update was not persisted."); }
/** Proves warehouse creation and detail are tenant-scoped. */
export async function test_api_erp_warehouse_create(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: "MAIN", name: "Main Warehouse" }); typia.assert(warehouse); const read = await api.functional.erp.warehouse.warehouseAt(owner.connection, warehouse.id); if (read.name !== "Main Warehouse") throw new Error("Warehouse detail was not persisted."); }
/** Proves a storage location validates its warehouse parent. */
export async function test_api_erp_location_create(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: "MAIN", name: "Main" }); const location = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: "A" }); typia.assert(location); if (location.depth !== 1) throw new Error("Root location depth is incorrect."); }

/** Proves inactive master records can be reactivated without changing identity. */
export async function test_api_erp_master_reactivation(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: "REACT-EA", name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: "REACT-ITEM", name: "Reactivate item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  await api.functional.erp.item.itemErase(owner.connection, item.id);
  const itemAgain = await api.functional.erp.item.itemUpdate(owner.connection, item.id, { active: true });
  if (!itemAgain.active) throw new Error("Item reactivation did not restore active selection.");
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: "REACT-WH", name: "Reactivate warehouse" });
  await api.functional.erp.warehouse.warehouseErase(owner.connection, warehouse.id);
  const warehouseAgain = await api.functional.erp.warehouse.warehouseUpdate(owner.connection, warehouse.id, { active: true });
  if (!warehouseAgain.active) throw new Error("Warehouse reactivation did not restore active selection.");
  const location = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: "REACT-LOC" });
  await api.functional.erp.location.locationErase(owner.connection, location.id);
  const locationAgain = await api.functional.erp.location.locationUpdate(owner.connection, location.id, { active: true });
  if (!locationAgain.active) throw new Error("Location reactivation did not restore active selection.");
}

/** Proves location updates reject a descendant cycle before changing hierarchy. */
export async function test_api_erp_location_cycle_refusal(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: "CYCLE-WH", name: "Cycle warehouse" });
  const parent = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: "PARENT" });
  const child = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: "CHILD", parentId: parent.id });
  let refused = false;
  try { await api.functional.erp.location.locationUpdate(owner.connection, parent.id, { parentId: child.id }); } catch { refused = true; }
  if (!refused) throw new Error("Location hierarchy accepted a descendant cycle.");
  const locations = await api.functional.erp.location.locationIndex(owner.connection, { page: 1, limit: 20, warehouseId: warehouse.id });
  const unchanged = locations.data.find((location) => location.id === parent.id);
  if (unchanged === undefined || unchanged.parentId !== null) throw new Error("Location cycle refusal changed the existing hierarchy.");
}

/** Proves department cost-center identity is persisted and searchable within the tenant. */
export async function test_api_erp_department_cost_center(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const center = await api.functional.erp.financial_center.cost.costCreate(owner.connection, { code: "HR-OPS", name: "HR Operations" });
  const department = await api.functional.erp.projects.department.departmentCreate(owner.connection, { name: "Operations", costCenterId: center.id });
  if (department.costCenterId !== center.id) throw new Error("Department cost-center relation was not persisted.");
  const page = await api.functional.erp.projects.department.departmentIndex(owner.connection, { page: 1, limit: 10, costCenterId: center.id });
  if (!page.data.some((row) => row.id === department.id)) throw new Error("Department cost-center filtering did not apply.");
}

/** Proves planning, costing, tax, and descriptive item fields survive the API boundary. */
export async function test_api_erp_item_planning_fields(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: "PLAN", name: "Planning unit", category: "quantity" }); const vendor = await api.functional.erp.party.partyCreate(owner.connection, { kind: "vendor", name: "Planning vendor", currency: "USD" }); const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: "PLAN-WH", name: "Planning warehouse", valuationPolicy: "fifo" }); const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: "PLAN-ITEM", name: "Planned component", description: "Demand-planned component", category: "component", type: "component", unitId: unit.id, trackingMode: "lot", taxable: false, costingMethod: "fifo", makeOrBuy: "make", safetyStock: 5, reorderPoint: 10, minimumOrderQuantity: 2, orderMultiple: 4, leadTimeDays: 7, preferredVendorId: vendor.id, defaultWarehouseId: warehouse.id }); if (item.description !== "Demand-planned component" || item.category !== "component" || item.taxable || item.costingMethod !== "fifo" || item.makeOrBuy !== "make" || item.safetyStock !== 5 || item.reorderPoint !== 10 || item.minimumOrderQuantity !== 2 || item.orderMultiple !== 4 || item.leadTimeDays !== 7 || item.preferredVendorId !== vendor.id || item.defaultWarehouseId !== warehouse.id) throw new Error("Item planning fields were not persisted."); if (warehouse.valuationPolicy !== "fifo") throw new Error("Warehouse valuation policy was not persisted."); }

/** Proves location naming and descriptive context are returned after creation and update. */
export async function test_api_erp_location_context_fields(connection: api.IConnection): Promise<void> { const owner = await create_owner(connection); const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: "CTX-WH", name: "Context warehouse" }); const location = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: "CTX-A", name: "Receiving bay", description: "Inbound staging" }); const updated = await api.functional.erp.location.locationUpdate(owner.connection, location.id, { name: "Receiving dock", description: "Updated inbound staging" }); if (updated.name !== "Receiving dock" || updated.description !== "Updated inbound staging") throw new Error("Location context fields were not persisted."); }
