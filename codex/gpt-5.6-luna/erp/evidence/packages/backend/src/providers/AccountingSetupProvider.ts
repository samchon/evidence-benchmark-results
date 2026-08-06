import { randomUUID } from "node:crypto";
import type { IAuth, IDocumentNumber, IFiscalCalendar, IFiscalPeriod, IPage } from "@benchmark/erp-api";
import { Prisma } from "@prisma/sdk";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { AuthProvider } from "./AuthProvider";

/** Owns tenant document-number sequences and fiscal calendars. */
export namespace AccountingSetupProvider {
  export async function numberCreate(h: IAuth.IHeaders, input: IDocumentNumber.ICreate): Promise<IDocumentNumber> { const oid = await organization(h); const now = new Date(); return number(await MyGlobal.prisma.document_number_sequences.create({ data: { id: randomUUID(), organization_id: oid, document_type: input.documentType, prefix: input.prefix, next_number: input.nextNumber ?? 1, active: true, created_at: now, updated_at: now } })); }
  export async function numberIndex(h: IAuth.IHeaders, input: IDocumentNumber.IRequest): Promise<IPage<IDocumentNumber>> { const oid = await organization(h); const rows = await MyGlobal.prisma.document_number_sequences.findMany({ where: { organization_id: oid, ...(input.documentType ? { document_type: input.documentType } : {}), ...(input.includeInactive ? {} : { active: true }) }, orderBy: { document_type: "asc" } }); return page(rows.map(number)); }
  export async function numberUpdate(h: IAuth.IHeaders, id: string, input: IDocumentNumber.IUpdate): Promise<IDocumentNumber> { const oid = await organization(h); await numberEnsure(id, oid); return number(await MyGlobal.prisma.document_number_sequences.update({ where: { id }, data: { ...(input.prefix !== undefined ? { prefix: input.prefix } : {}), ...(input.active !== undefined ? { active: input.active } : {}), updated_at: new Date() } })); }
  export async function issue(h: IAuth.IHeaders, input: IDocumentNumber.IIssue): Promise<IDocumentNumber.IIssued> { const oid = await organization(h); const row = await MyGlobal.prisma.document_number_sequences.findUnique({ where: { organization_id_document_type: { organization_id: oid, document_type: input.documentType } } }); if (row === null || !row.active) throw ErrorUtil.notFound("No active number sequence exists for this document type."); const updated = await MyGlobal.prisma.document_number_sequences.update({ where: { id: row.id }, data: { next_number: { increment: 1 }, updated_at: new Date() } }); return { documentType: row.document_type, number: row.next_number, rendered: `${row.prefix}${String(row.next_number).padStart(6, "0")}` }; }

  export async function calendarCreate(h: IAuth.IHeaders, input: IFiscalCalendar.ICreate): Promise<IFiscalCalendar> { const oid = await organization(h); const now = new Date(); return MyGlobal.prisma.$transaction(async (tx) => { const calendar = await tx.fiscal_calendars.create({ data: { id: randomUUID(), organization_id: oid, start_month: input.startMonth, fiscal_year: input.fiscalYear, created_at: now } }); await tx.fiscal_periods.createMany({ data: Array.from({ length: 12 }, (_, index) => { const startsAt = new Date(Date.UTC(input.fiscalYear, input.startMonth - 1 + index, 1)); const endsAt = new Date(Date.UTC(input.fiscalYear, input.startMonth + index, 1)); return { id: randomUUID(), calendar_id: calendar.id, ordinal: index + 1, starts_at: startsAt, ends_at: endsAt, status: "open", created_at: now }; }) }); const row = await tx.fiscal_calendars.findUniqueOrThrow({ where: { id: calendar.id }, include: { periods: { orderBy: { ordinal: "asc" } } } }); return fiscal(row); }); }
  export async function calendarIndex(h: IAuth.IHeaders, input: IFiscalCalendar.IRequest): Promise<IPage<IFiscalCalendar>> { const oid = await organization(h); const rows = await MyGlobal.prisma.fiscal_calendars.findMany({ where: { organization_id: oid, ...(input.fiscalYear !== undefined ? { fiscal_year: input.fiscalYear } : {}) }, include: { periods: { orderBy: { ordinal: "asc" } } }, orderBy: { fiscal_year: "desc" } }); return page(rows.map(fiscal)); }
  export async function periodStatus(h: IAuth.IHeaders, id: string, status: IFiscalPeriod["status"]): Promise<IFiscalPeriod> {
    const oid = await organization(h);
    const current = await MyGlobal.prisma.fiscal_periods.findFirst({ where: { id, calendar: { organization_id: oid } } });
    if (current === null) throw ErrorUtil.notFound("No fiscal period has this identifier.");
    const valid = (current.status === "open" && status === "soft_closed") || (current.status === "soft_closed" && (status === "hard_closed" || status === "reopened")) || (current.status === "hard_closed" && status === "reopened") || (current.status === "reopened" && status === "soft_closed");
    if (!valid && status !== current.status) throw ErrorUtil.conflict(`Cannot transition fiscal period from ${current.status} to ${status}.`);
    if (status === "hard_closed" && current.status !== "hard_closed") {
      const blockers = await closeBlockers(oid, current.starts_at, current.ends_at);
      if (blockers.length > 0) throw ErrorUtil.conflict(`Fiscal period close is blocked by: ${blockers.join(", ")}.`);
    }
    const row = await MyGlobal.prisma.$transaction(async (tx) => {
      const updated = await tx.fiscal_periods.update({ where: { id }, data: { status } });
      if (status === "hard_closed") {
        for (const kind of ["trial_balance", "inventory_valuation", "tax_summary"] as const) {
          const existing = await tx.closing_snapshots.findFirst({ where: { organization_id: oid, fiscal_period_id: id, kind } });
          if (existing === null) await tx.closing_snapshots.create({ data: { id: randomUUID(), organization_id: oid, fiscal_period_id: id, kind, payload: JSON.stringify({ fiscalPeriodId: id, kind, frozenAt: new Date().toISOString() }), created_at: new Date() } });
        }
      }
      return updated;
    });
    return period(row);
  }

  function page<T extends object>(data: T[]): IPage<T> { return { pagination: { current: 1, limit: 0, records: data.length, pages: 1 }, data }; }
  function number(r: Prisma.document_number_sequencesGetPayload<{}>): IDocumentNumber { return { id: r.id as IDocumentNumber["id"], documentType: r.document_type, prefix: r.prefix, nextNumber: r.next_number, active: r.active, createdAt: r.created_at.toISOString(), updatedAt: r.updated_at.toISOString() }; }
  function period(r: Prisma.fiscal_periodsGetPayload<{}>): IFiscalPeriod { return { id: r.id as IFiscalPeriod["id"], ordinal: r.ordinal, startsAt: r.starts_at.toISOString(), endsAt: r.ends_at.toISOString(), status: r.status as IFiscalPeriod["status"] }; }
  function fiscal(r: Prisma.fiscal_calendarsGetPayload<{ include: { periods: { orderBy: { ordinal: "asc" } } } }>): IFiscalCalendar { return { id: r.id as IFiscalCalendar["id"], fiscalYear: r.fiscal_year, startMonth: r.start_month, createdAt: r.created_at.toISOString(), periods: r.periods.map(period) }; }
  async function organization(h: IAuth.IHeaders): Promise<string> { const actor = await AuthProvider.authorize(h); const session = await MyGlobal.prisma.sessions.findUnique({ where: { id: actor.sessionId }, select: { selected_organization_id: true } }); if (session?.selected_organization_id === null || session === null) throw ErrorUtil.forbidden("Select an active organization before accounting setup work."); return session.selected_organization_id; }
  async function numberEnsure(id: string, oid: string) { if (await MyGlobal.prisma.document_number_sequences.findFirst({ where: { id, organization_id: oid } }) === null) throw ErrorUtil.notFound("No number sequence has this identifier."); }
  async function closeBlockers(oid: string, startsAt: Date, endsAt: Date): Promise<string[]> {
    const [draftJournals, pendingApprovals, openReconciliations] = await Promise.all([
      MyGlobal.prisma.journal_entries.count({ where: { organization_id: oid, status: { in: ["draft", "pending_approval"] }, entry_date: { gte: startsAt, lt: endsAt } } }),
      MyGlobal.prisma.approval_requests.count({ where: { organization_id: oid, status: "pending" } }),
      MyGlobal.prisma.reconciliations.count({ where: { organization_id: oid, status: "in_progress" } }),
    ]);
    return [draftJournals > 0 ? "draft_journals" : null, pendingApprovals > 0 ? "pending_approvals" : null, openReconciliations > 0 ? "open_reconciliations" : null].filter((value): value is string => value !== null);
  }
}
