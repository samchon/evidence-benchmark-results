import { randomUUID } from "node:crypto";
import type { IAuth, IFiscalPeriodReopenRequest, IPage } from "@benchmark/erp-api";
import { Prisma } from "@prisma/sdk";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { AuthProvider } from "./AuthProvider";

/** Owns controlled fiscal-period reopen requests and their immutable decision trail. */
export namespace FiscalPeriodReopenProvider {
  export async function create(h: IAuth.IHeaders, input: IFiscalPeriodReopenRequest.ICreate): Promise<IFiscalPeriodReopenRequest> {
    const actor = await context(h);
    const period = await periodEnsure(input.fiscalPeriodId, actor.organizationId);
    if (period.status !== "hard_closed" && period.status !== "soft_closed") throw ErrorUtil.conflict("Only a closed fiscal period can be reopened.");
    const pending = await MyGlobal.prisma.period_reopen_requests.findFirst({ where: { organization_id: actor.organizationId, fiscal_period_id: period.id, status: "pending" } });
    if (pending !== null) throw ErrorUtil.conflict("A reopen request is already pending for this fiscal period.");
    const now = new Date();
    return map(await MyGlobal.prisma.period_reopen_requests.create({ data: { id: randomUUID(), organization_id: actor.organizationId, fiscal_period_id: period.id, reason: input.reason, status: "pending", requested_by_user_id: actor.userId, decided_by_user_id: null, applied_at: null, created_at: now, updated_at: now } }));
  }
  export async function index(h: IAuth.IHeaders, input: IFiscalPeriodReopenRequest.IRequest): Promise<IPage<IFiscalPeriodReopenRequest>> {
    const actor = await context(h);
    const rows = await MyGlobal.prisma.period_reopen_requests.findMany({ where: { organization_id: actor.organizationId, ...(input.fiscalPeriodId ? { fiscal_period_id: input.fiscalPeriodId } : {}), ...(input.status ? { status: input.status } : {}) }, orderBy: { created_at: "desc" } });
    return { pagination: { current: 1, limit: 0, records: rows.length, pages: 1 }, data: rows.map(map) };
  }
  export async function status(h: IAuth.IHeaders, id: string, input: IFiscalPeriodReopenRequest.IStatus): Promise<IFiscalPeriodReopenRequest> {
    const actor = await context(h);
    const row = await ensure(id, actor.organizationId);
    if (row.status !== "pending") throw ErrorUtil.conflict("Only a pending reopen request can be decided.");
    return map(await MyGlobal.prisma.period_reopen_requests.update({ where: { id }, data: { status: input.status, decided_by_user_id: actor.userId, updated_at: new Date() } }));
  }
  export async function apply(h: IAuth.IHeaders, id: string): Promise<IFiscalPeriodReopenRequest> {
    const actor = await context(h);
    const row = await ensure(id, actor.organizationId);
    if (row.status !== "approved") throw ErrorUtil.conflict("Only an approved reopen request can be applied.");
    const period = await periodEnsure(row.fiscal_period_id, actor.organizationId);
    if (period.status !== "hard_closed" && period.status !== "soft_closed") throw ErrorUtil.conflict("The fiscal period is no longer reopenable.");
    const now = new Date();
    const updated = await MyGlobal.prisma.$transaction(async (tx) => {
      const request = await tx.period_reopen_requests.update({ where: { id }, data: { status: "applied", applied_at: now, updated_at: now } });
      await tx.fiscal_periods.update({ where: { id: period.id }, data: { status: "reopened" } });
      await tx.audit_events.create({ data: { id: randomUUID(), organization_id: actor.organizationId, user_id: actor.userId, system_principal_id: null, action: "fiscal_period.reopen", target_type: "fiscal_period", target_id: period.id, before_value: period.status, after_value: "reopened", reason: row.reason, created_at: now } });
      return request;
    });
    return map(updated);
  }
  function map(r: Prisma.period_reopen_requestsGetPayload<{}>): IFiscalPeriodReopenRequest { return { id: r.id as IFiscalPeriodReopenRequest["id"], fiscalPeriodId: r.fiscal_period_id as IFiscalPeriodReopenRequest["fiscalPeriodId"], reason: r.reason, status: r.status as IFiscalPeriodReopenRequest["status"], requestedByUserId: r.requested_by_user_id as IFiscalPeriodReopenRequest["requestedByUserId"], decidedByUserId: r.decided_by_user_id as IFiscalPeriodReopenRequest["decidedByUserId"], appliedAt: r.applied_at?.toISOString() ?? null, createdAt: r.created_at.toISOString(), updatedAt: r.updated_at.toISOString() }; }
  async function context(h: IAuth.IHeaders) { const actor = await AuthProvider.authorize(h); const session = await MyGlobal.prisma.sessions.findUnique({ where: { id: actor.sessionId }, select: { selected_organization_id: true } }); if (!session?.selected_organization_id) throw ErrorUtil.forbidden("Select an active organization before fiscal-period work."); return { userId: actor.id, organizationId: session.selected_organization_id }; }
  async function periodEnsure(id: string, organizationId: string) { const period = await MyGlobal.prisma.fiscal_periods.findFirst({ where: { id, calendar: { organization_id: organizationId } } }); if (period === null) throw ErrorUtil.notFound("No fiscal period has this identifier."); return period; }
  async function ensure(id: string, organizationId: string) { const row = await MyGlobal.prisma.period_reopen_requests.findFirst({ where: { id, organization_id: organizationId } }); if (row === null) throw ErrorUtil.notFound("No fiscal-period reopen request has this identifier."); return row; }
}
