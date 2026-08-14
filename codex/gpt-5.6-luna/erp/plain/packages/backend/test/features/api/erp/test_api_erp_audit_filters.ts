import * as api from "@benchmark/erp-api";
import { create_owner } from "../../../helpers/ErpFixtures";

/** Proves audit history filters by actor and target identity and returns request metadata fields. */
export async function test_api_erp_audit_filters_and_metadata(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const organization = await api.functional.erp.organization.at(owner.connection);
  const events = await api.functional.erp.control.audit.auditIndex(owner.connection, { page: 1, limit: 20, actorId: owner.membershipId, targetType: "organization", targetId: organization.id, action: null, risk: null });
  const event = events.data[0];
  if (event === undefined || event.actorId !== owner.membershipId || event.targetId !== organization.id || event.ipAddress !== null || event.userAgent !== null) throw new Error("Audit actor, target, or request metadata was not preserved.");
}
