import { randomUUID } from "node:crypto";
import type { IAuth, IPage, IPartyChangeRequest } from "@benchmark/erp-api";
import { Prisma } from "@prisma/sdk";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { AuthProvider } from "./AuthProvider";

/** Owns approval and application of sensitive vendor/customer master changes. */
export namespace PartyChangeProvider {
  export async function create(h: IAuth.IHeaders, input: IPartyChangeRequest.ICreate): Promise<IPartyChangeRequest> {
    const actor = await context(h);
    if ((input.partyType === "vendor" && input.changeType !== "bank_account") || (input.partyType === "customer" && input.changeType !== "credit_limit")) throw ErrorUtil.conflict("The requested change type does not match the party type.");
    if (input.partyType === "vendor") {
      if (await MyGlobal.prisma.vendors.findFirst({ where: { id: input.partyId, organization_id: actor.organizationId } }) === null) throw ErrorUtil.notFound("No vendor has this identifier.");
    } else {
      if (await MyGlobal.prisma.customers.findFirst({ where: { id: input.partyId, organization_id: actor.organizationId } }) === null) throw ErrorUtil.notFound("No customer has this identifier.");
      if (!Number.isFinite(Number(input.requestedValue)) || Number(input.requestedValue) < 0) throw ErrorUtil.badRequest("A credit limit must be a non-negative number.");
    }
    const now = new Date();
    return map(await MyGlobal.prisma.party_change_requests.create({ data: { id: randomUUID(), organization_id: actor.organizationId, party_type: input.partyType, party_id: input.partyId, change_type: input.changeType, requested_value: input.requestedValue, reason: input.reason, status: "pending", requested_by_user_id: actor.userId, decided_by_user_id: null, applied_at: null, created_at: now, updated_at: now } }));
  }

  export async function index(h: IAuth.IHeaders, input: IPartyChangeRequest.IRequest): Promise<IPage<IPartyChangeRequest>> {
    const actor = await context(h);
    const rows = await MyGlobal.prisma.party_change_requests.findMany({ where: { organization_id: actor.organizationId, ...(input.partyType ? { party_type: input.partyType } : {}), ...(input.partyId ? { party_id: input.partyId } : {}), ...(input.status ? { status: input.status } : {}) }, orderBy: { created_at: "desc" } });
    return { pagination: { current: 1, limit: 0, records: rows.length, pages: 1 }, data: rows.map(map) };
  }

  export async function status(h: IAuth.IHeaders, id: string, input: IPartyChangeRequest.IStatus): Promise<IPartyChangeRequest> {
    const actor = await context(h);
    const row = await ensure(id, actor.organizationId);
    if (row.status !== "pending") throw ErrorUtil.conflict("Only a pending party change can be decided.");
    return map(await MyGlobal.prisma.party_change_requests.update({ where: { id }, data: { status: input.status, decided_by_user_id: actor.userId, updated_at: new Date() } }));
  }

  export async function apply(h: IAuth.IHeaders, id: string): Promise<IPartyChangeRequest> {
    const actor = await context(h);
    const row = await ensure(id, actor.organizationId);
    if (row.status !== "approved") throw ErrorUtil.conflict("Only an approved party change can be applied.");
    const now = new Date();
    await MyGlobal.prisma.$transaction(async (tx) => {
      if (row.party_type === "vendor") await tx.vendors.update({ where: { id: row.party_id }, data: { bank_account_reference: row.requested_value, updated_at: now } });
      else await tx.customers.update({ where: { id: row.party_id }, data: { credit_limit: Number(row.requested_value), updated_at: now } });
      await tx.party_change_requests.update({ where: { id }, data: { status: "applied", applied_at: now, updated_at: now } });
      await tx.audit_events.create({ data: { id: randomUUID(), organization_id: actor.organizationId, user_id: actor.userId, system_principal_id: null, action: `party.${row.change_type}.apply`, target_type: row.party_type, target_id: row.party_id, before_value: null, after_value: row.requested_value, reason: row.reason, created_at: now } });
    });
    return map(await MyGlobal.prisma.party_change_requests.findUniqueOrThrow({ where: { id } }));
  }

  function map(row: Prisma.party_change_requestsGetPayload<{}>): IPartyChangeRequest { return { id: row.id as IPartyChangeRequest["id"], partyType: row.party_type as IPartyChangeRequest["partyType"], partyId: row.party_id as IPartyChangeRequest["partyId"], changeType: row.change_type as IPartyChangeRequest["changeType"], requestedValue: row.requested_value, reason: row.reason, status: row.status as IPartyChangeRequest["status"], requestedByUserId: row.requested_by_user_id as IPartyChangeRequest["requestedByUserId"], decidedByUserId: row.decided_by_user_id as IPartyChangeRequest["decidedByUserId"], appliedAt: row.applied_at?.toISOString() ?? null, createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString() }; }
  async function ensure(id: string, organizationId: string) { const row = await MyGlobal.prisma.party_change_requests.findFirst({ where: { id, organization_id: organizationId } }); if (row === null) throw ErrorUtil.notFound("No party change request has this identifier."); return row; }
  async function context(h: IAuth.IHeaders): Promise<{ userId: string; organizationId: string }> { const actor = await AuthProvider.authorize(h); const session = await MyGlobal.prisma.sessions.findUnique({ where: { id: actor.sessionId }, select: { selected_organization_id: true } }); if (!session?.selected_organization_id) throw ErrorUtil.forbidden("Select an active organization before party change work."); return { userId: actor.id, organizationId: session.selected_organization_id }; }
}
