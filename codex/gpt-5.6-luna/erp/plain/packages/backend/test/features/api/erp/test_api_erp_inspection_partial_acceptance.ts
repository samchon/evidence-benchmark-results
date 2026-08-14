import * as api from "@benchmark/erp-api";
import { create_owner } from "../../../helpers/ErpFixtures";

/** Proves partial inspection acceptance freezes accepted and rejected quantities. */
export async function test_api_erp_inspection_partial_acceptance(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `IA${suffix.slice(-6)}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `IA-${suffix}`, name: "Inspection Item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const inspection = await api.functional.erp.operations.inspection.inspectionCreate(owner.connection, { itemId: item.id, sourceType: "receipt", sourceId: null });
  const started = await api.functional.erp.operations.inspection.start.inspectionStart(owner.connection, inspection.id);
  const partial = await api.functional.erp.operations.inspection.partial_accept.inspectionPartialAccept(owner.connection, started.id, { acceptedQuantity: 7, rejectedQuantity: 3, reason: "Three units failed visual inspection." });
  if (partial.status !== "partially_accepted" || partial.acceptedQuantity !== 7 || partial.rejectedQuantity !== 3 || partial.finalizedAt === null) throw new Error("Partial inspection acceptance was not finalized.");
}
