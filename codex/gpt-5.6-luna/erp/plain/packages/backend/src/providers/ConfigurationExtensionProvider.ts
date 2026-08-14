import type * as api from "@benchmark/erp-api";
import { randomUUID } from "node:crypto";
import { AuthProvider } from "./AuthProvider";
import type { ErpPayload } from "../decorators/ErpAuth";
import { ErrorUtil } from "../utils/ErrorUtil";
import { MyGlobal } from "../MyGlobal";

/** Document numbering, generated fiscal calendars, and membership preferences. */
export namespace ConfigurationExtensionProvider {
  export async function numberCreate(p: { actor: ErpPayload; body: api.IDocumentNumber.ICreate }): Promise<api.IDocumentNumber> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    await owner(p.actor, organizationId);
    const existing = await MyGlobal.prisma.document_number_sequences.findFirst({ where: { organization_id: organizationId, document_type: p.body.documentType } });
    const data = { prefix: p.body.prefix, padding: p.body.padding, next_value: p.body.nextValue ?? existing?.next_value ?? 1, active: true, updated_at: new Date() };
    const row = existing === null
      ? await MyGlobal.prisma.document_number_sequences.create({ data: { id: randomUUID(), organization_id: organizationId, document_type: p.body.documentType, ...data, created_at: new Date() } })
      : await MyGlobal.prisma.document_number_sequences.update({ where: { id: existing.id }, data });
    return number(row);
  }

  export async function numberIndex(p: { actor: ErpPayload; input: api.IDocumentNumber.IIndex }): Promise<api.IPage<api.IDocumentNumber>> {
    const organizationId = await AuthProvider.organizationId(p.actor); const page = p.input.page ?? 1; const limit = p.input.limit || 100;
    const where = { organization_id: organizationId, ...(p.input.documentType ? { document_type: p.input.documentType } : {}) };
    const [records, rows] = await Promise.all([MyGlobal.prisma.document_number_sequences.count({ where }), MyGlobal.prisma.document_number_sequences.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { document_type: "asc" } })]);
    return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(number) };
  }

  export async function numberIssue(p: { actor: ErpPayload; body: api.IDocumentNumber.IIssue }): Promise<api.IDocumentNumber.IIssued> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    const sequence = await MyGlobal.prisma.document_number_sequences.findFirst({ where: { organization_id: organizationId, document_type: p.body.documentType, active: true } });
    if (sequence === null) throw ErrorUtil.notFound("No active document-number sequence exists for this document type.");
    const row = await MyGlobal.prisma.document_number_sequences.update({ where: { id: sequence.id }, data: { next_value: { increment: 1 }, updated_at: new Date() } });
    return { documentType: row.document_type, number: `${row.prefix}${String(row.next_value - 1).padStart(row.padding, "0")}` };
  }

  export async function fiscalYearCreate(p: { actor: ErpPayload; body: api.IFiscalYear.ICreate }): Promise<api.IFiscalYear> {
    const organizationId = await AuthProvider.organizationId(p.actor); const organization = await MyGlobal.prisma.organizations.findUniqueOrThrow({ where: { id: organizationId } });
    const startsAt = new Date(Date.UTC(p.body.year, organization.fiscal_start_month - 1, 1)); const endsAt = new Date(Date.UTC(p.body.year + 1, organization.fiscal_start_month - 1, 0, 23, 59, 59, 999));
    const existing = await MyGlobal.prisma.fiscal_years.findFirst({ where: { organization_id: organizationId, name: p.body.name } }); if (existing !== null) throw ErrorUtil.conflict("A fiscal year with this name already exists.");
    const yearId = randomUUID(); const now = new Date();
    await MyGlobal.prisma.$transaction(async (tx) => {
      await tx.fiscal_years.create({ data: { id: yearId, organization_id: organizationId, name: p.body.name, starts_at: startsAt, ends_at: endsAt, status: "open", created_at: now } });
      for (let index = 0; index < 12; index++) { const periodStart = new Date(Date.UTC(p.body.year, organization.fiscal_start_month - 1 + index, 1)); const periodEnd = new Date(Date.UTC(p.body.year, organization.fiscal_start_month + index, 0, 23, 59, 59, 999)); await tx.fiscal_periods.create({ data: { id: randomUUID(), organization_id: organizationId, fiscal_year_id: yearId, name: `${p.body.name}-${String(index + 1).padStart(2, "0")}`, starts_at: periodStart, ends_at: periodEnd, status: "open", close_cycle: 0, created_at: now } }); }
    });
    return fiscalYear(await MyGlobal.prisma.fiscal_years.findUniqueOrThrow({ where: { id: yearId } }), await MyGlobal.prisma.fiscal_periods.findMany({ where: { fiscal_year_id: yearId }, orderBy: { starts_at: "asc" } }));
  }

  export async function fiscalYearIndex(p: { actor: ErpPayload; input: api.IFiscalYear.IIndex }): Promise<api.IPage<api.IFiscalYear>> {
    const organizationId = await AuthProvider.organizationId(p.actor); const page = p.input.page ?? 1; const limit = p.input.limit || 100; const where = { organization_id: organizationId, ...(p.input.status ? { status: p.input.status } : {}) };
    const [records, rows] = await Promise.all([MyGlobal.prisma.fiscal_years.count({ where }), MyGlobal.prisma.fiscal_years.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { starts_at: "desc" } })]);
    const data = await Promise.all(rows.map(async (row) => fiscalYear(row, await MyGlobal.prisma.fiscal_periods.findMany({ where: { fiscal_year_id: row.id }, orderBy: { starts_at: "asc" } }))));
    return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data };
  }

  export async function preferenceAt(p: { actor: ErpPayload }): Promise<api.INotificationPreference> {
    const organizationId = await AuthProvider.organizationId(p.actor); const membershipId = p.actor.membership_id!;
    const row = await preference(organizationId, membershipId); return preferenceDto(row);
  }

  export async function preferenceUpdate(p: { actor: ErpPayload; body: api.INotificationPreference.IUpdate }): Promise<api.INotificationPreference> {
    validatePreferenceUpdate(p.body); const organizationId = await AuthProvider.organizationId(p.actor); const membershipId = p.actor.membership_id!; const current = await preference(organizationId, membershipId);
    const categories = { ...JSON.parse(current.categories) as Record<string, boolean>, ...p.body.categories }; const delivery = { ...JSON.parse(current.delivery) as Record<string, boolean>, ...p.body.delivery };
    const row = await MyGlobal.prisma.notification_preferences.update({ where: { id: current.id }, data: { categories: JSON.stringify(categories), delivery: JSON.stringify(delivery), updated_at: new Date() } }); return preferenceDto(row);
  }

  async function preference(organizationId: string, membershipId: string) { const row = await MyGlobal.prisma.notification_preferences.findFirst({ where: { organization_id: organizationId, membership_id: membershipId } }); if (row !== null) return row; return MyGlobal.prisma.notification_preferences.create({ data: { id: randomUUID(), organization_id: organizationId, membership_id: membershipId, categories: JSON.stringify({ approvals: true, assignments: true, reminders: true }), delivery: JSON.stringify({ inApp: true, email: true }), created_at: new Date(), updated_at: new Date() } }); }
  function validatePreferenceUpdate(body: api.INotificationPreference.IUpdate): void { const values = { ...(body.categories ?? {}), ...(body.delivery ?? {}) }; for (const [key, value] of Object.entries(values)) if (value === false && /(risk|owner|manager|security)/i.test(key)) throw ErrorUtil.unprocessable("Mandatory high-risk owner and manager notices cannot be suppressed."); }
  async function owner(actor: ErpPayload, organizationId: string): Promise<void> { if (actor.membership_id === null) throw ErrorUtil.forbidden("An active organization context is required."); const membership = await MyGlobal.prisma.memberships.findFirst({ where: { id: actor.membership_id, user_id: actor.id, organization_id: organizationId, status: "active" } }); if (membership === null) throw ErrorUtil.forbidden("An active organization context is required."); const assignments = await MyGlobal.prisma.role_assignments.findMany({ where: { membership_id: membership.id } }); const roles = await MyGlobal.prisma.roles.findMany({ where: { organization_id: organizationId, name: "Owner", active: true }, select: { id: true } }); if (!assignments.some((assignment) => roles.some((role) => role.id === assignment.role_id))) throw ErrorUtil.forbidden("Only an organization Owner may configure numbering."); }
  function number(row: { id: string; document_type: string; prefix: string; padding: number; next_value: number; active: boolean }): api.IDocumentNumber { return { id: row.id, documentType: row.document_type, prefix: row.prefix, padding: row.padding, nextValue: row.next_value, active: row.active }; }
  function fiscalYear(row: { id: string; name: string; starts_at: Date; ends_at: Date; status: string }, periods: { id: string; name: string; starts_at: Date; ends_at: Date; status: string }[]): api.IFiscalYear { return { id: row.id, name: row.name, startsAt: row.starts_at.toISOString(), endsAt: row.ends_at.toISOString(), status: row.status as api.IFiscalYear["status"], periods: periods.map((period) => ({ id: period.id, name: period.name, startsAt: period.starts_at.toISOString(), endsAt: period.ends_at.toISOString(), status: period.status })) }; }
  function preferenceDto(row: { membership_id: string; categories: string; delivery: string }): api.INotificationPreference { return { membershipId: row.membership_id, categories: JSON.parse(row.categories) as Record<string, boolean>, delivery: JSON.parse(row.delivery) as Record<string, boolean>, mandatoryRiskNotices: true }; }
}
