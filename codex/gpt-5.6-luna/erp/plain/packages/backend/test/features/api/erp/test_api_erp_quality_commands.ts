import * as api from "@benchmark/erp-api";
import { create_owner } from "../../../helpers/ErpFixtures";

/** Proves that quality waiver is a reasoned, terminal inspection decision. */
export async function test_api_erp_inspection_waiver(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `IW${suffix.slice(-6)}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `IW-${suffix}`, name: "Waiver Item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const inspection = await api.functional.erp.operations.inspection.inspectionCreate(owner.connection, { itemId: item.id, sourceType: "receipt", sourceId: null });
  const started = await api.functional.erp.operations.inspection.start.inspectionStart(owner.connection, inspection.id);
  const waived = await api.functional.erp.operations.inspection.waive.inspectionWaive(owner.connection, started.id, { reason: "Supplier certificate accepted by quality manager" });
  if (waived.status !== "waived" || waived.reason !== "Supplier certificate accepted by quality manager" || waived.finalizedAt === null) throw new Error("Inspection waiver reason or finalization was not retained.");
}
