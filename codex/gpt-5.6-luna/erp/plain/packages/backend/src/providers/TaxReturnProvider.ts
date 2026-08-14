import type * as api from "@benchmark/erp-api";
import { randomUUID } from "node:crypto";
import { AuthProvider } from "./AuthProvider";
import type { ErpPayload } from "../decorators/ErpAuth";
import { ErrorUtil } from "../utils/ErrorUtil";
import { MyGlobal } from "../MyGlobal";

/** Tax-return preparation, reconciliation, filing, and amendment. */
export namespace TaxReturnProvider {
  export async function create(p: { actor: ErpPayload; body: api.ITaxReturn.ICreate }): Promise<api.ITaxReturn> {
    const org = await AuthProvider.organizationId(p.actor);
    const jurisdiction = await MyGlobal.prisma.tax_jurisdictions.findFirst({ where: { id: p.body.jurisdictionId, organization_id: org, active: true } });
    if (jurisdiction === null) throw ErrorUtil.notFound("No active tax jurisdiction exists in the active organization.");
    const linesInput = await deriveLines(org, jurisdiction.id, p.body.period);
    validateLines(linesInput);
    await validateCodes(org, jurisdiction.id, linesInput);
    const id = randomUUID(); const totalTax = linesInput.reduce((sum, line) => sum + line.amount, 0); const now = new Date();
    const row = await MyGlobal.prisma.$transaction(async (tx) => {
      const created = await tx.tax_returns.create({ data: { id, organization_id: org, jurisdiction_id: jurisdiction.id, period: p.body.period, status: "draft", total_tax: totalTax, original_return_id: null, created_at: now, filed_at: null } });
      for (const line of linesInput) await tx.tax_return_lines.create({ data: { id: randomUUID(), return_id: id, tax_code_id: line.taxCodeId, amount: line.amount, reconciled_amount: line.reconciledAmount ?? line.amount, created_at: now } });
      return created;
    });
    return taxReturn(row, await lines(id));
  }

  export async function index(p: { actor: ErpPayload; input: api.ITaxReturn.IIndex }): Promise<api.IPage<api.ITaxReturn>> {
    const org = await AuthProvider.organizationId(p.actor); const page = p.input.page ?? 1; const limit = p.input.limit ?? 100;
    const where = { organization_id: org, ...(p.input.jurisdictionId === undefined ? {} : { jurisdiction_id: p.input.jurisdictionId }), ...(p.input.period === undefined ? {} : { period: p.input.period }) };
    const [records, rows] = await Promise.all([MyGlobal.prisma.tax_returns.count({ where }), MyGlobal.prisma.tax_returns.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { created_at: "desc" } })]);
    return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: await Promise.all(rows.map(async (row) => taxReturn(row, await lines(row.id)))) };
  }

  export async function reconcile(p: { actor: ErpPayload; id: string }): Promise<api.ITaxReturn> {
    const org = await AuthProvider.organizationId(p.actor); const row = await MyGlobal.prisma.tax_returns.findFirst({ where: { id: p.id, organization_id: org, status: "draft" } });
    if (row === null) throw ErrorUtil.conflict("Only a draft tax return can be reconciled.");
    const returnLines = await lines(row.id); if (returnLines.length === 0) throw ErrorUtil.conflict("A tax return requires at least one reconciliation line.");
    const actual = await postedTaxByCode(org, row.period, returnLines.map((line) => line.taxCodeId));
    for (const line of returnLines) { const posted = actual.get(line.taxCodeId) ?? 0; if (Math.abs(line.amount - posted) > 0.000001 || Math.abs(line.reconciledAmount - posted) > 0.000001) throw ErrorUtil.conflict(`Tax return line ${line.taxCodeId} does not reconcile to posted tax activity: expected ${posted}, received ${line.amount}.`); }
    const updated = await MyGlobal.prisma.tax_returns.updateMany({ where: { id: row.id, organization_id: org, status: "draft" }, data: { status: "prepared" } });
    if (updated.count !== 1) throw ErrorUtil.conflict("The tax return changed while it was being reconciled.");
    return taxReturn(await MyGlobal.prisma.tax_returns.findUniqueOrThrow({ where: { id: row.id } }), returnLines);
  }

  export async function approve(p: { actor: ErpPayload; id: string }): Promise<api.ITaxReturn> { return transition(p, "approved", "prepared"); }
  export async function reject(p: { actor: ErpPayload; id: string; reason: string }): Promise<api.ITaxReturn> { const org = await AuthProvider.organizationId(p.actor); if (p.reason.trim().length === 0) throw ErrorUtil.unprocessable("Rejecting a tax return requires a reason."); const changed = await MyGlobal.prisma.tax_returns.updateMany({ where: { id: p.id, organization_id: org, status: "prepared" }, data: { status: "draft" } }); if (changed.count !== 1) throw ErrorUtil.conflict("Only a prepared tax return can be rejected."); const row = await MyGlobal.prisma.tax_returns.findUniqueOrThrow({ where: { id: p.id } }); return taxReturn(row, await lines(row.id)); }
  export async function file(p: { actor: ErpPayload; id: string }): Promise<api.ITaxReturn> { const org = await AuthProvider.organizationId(p.actor); const row = await MyGlobal.prisma.tax_returns.findFirst({ where: { id: p.id, organization_id: org, status: "approved" } }); if (row === null) throw ErrorUtil.conflict("Only an approved tax return can be filed."); return taxReturn(await MyGlobal.prisma.tax_returns.update({ where: { id: row.id }, data: { status: "filed", filed_at: new Date() } }), await lines(row.id)); }
  export async function amend(p: { actor: ErpPayload; id: string; body: api.ITaxReturn.IAmend }): Promise<api.ITaxReturn> { const org = await AuthProvider.organizationId(p.actor); const original = await MyGlobal.prisma.tax_returns.findFirst({ where: { id: p.id, organization_id: org, status: "filed" } }); if (original === null) throw ErrorUtil.conflict("Only a filed tax return can be amended."); const jurisdiction = await MyGlobal.prisma.tax_jurisdictions.findFirst({ where: { id: p.body.jurisdictionId, organization_id: org, active: true } }); if (jurisdiction === null) throw ErrorUtil.notFound("No active tax jurisdiction exists in the active organization."); validateLines(p.body.lines); await validateCodes(org, jurisdiction.id, p.body.lines); const id = randomUUID(); const totalTax = p.body.lines.reduce((sum, line) => sum + line.amount, 0); const now = new Date(); const row = await MyGlobal.prisma.$transaction(async (tx) => { const created = await tx.tax_returns.create({ data: { id, organization_id: org, jurisdiction_id: jurisdiction.id, period: p.body.period, status: "draft", total_tax: totalTax, original_return_id: original.id, created_at: now, filed_at: null } }); for (const line of p.body.lines) await tx.tax_return_lines.create({ data: { id: randomUUID(), return_id: id, tax_code_id: line.taxCodeId, amount: line.amount, reconciled_amount: line.reconciledAmount ?? 0, created_at: now } }); return created; }); return taxReturn(row, await lines(id)); }

  async function transition(p: { actor: ErpPayload; id: string }, status: "approved", expected: "prepared"): Promise<api.ITaxReturn> { const org = await AuthProvider.organizationId(p.actor); const changed = await MyGlobal.prisma.tax_returns.updateMany({ where: { id: p.id, organization_id: org, status: expected }, data: { status } }); if (changed.count !== 1) throw ErrorUtil.conflict(`Only a ${expected} tax return can become ${status}.`); const row = await MyGlobal.prisma.tax_returns.findUniqueOrThrow({ where: { id: p.id } }); return taxReturn(row, await lines(row.id)); }
  async function validateCodes(org: string, jurisdictionId: string, input: api.ITaxReturn.ILineCreate[]): Promise<void> { for (const line of input) if (await MyGlobal.prisma.tax_codes.findFirst({ where: { id: line.taxCodeId, organization_id: org, jurisdiction_id: jurisdictionId, active: true } }) === null) throw ErrorUtil.conflict("Every tax return line must use an active code in its jurisdiction."); }
  async function deriveLines(org: string, jurisdictionId: string, period: string): Promise<api.ITaxReturn.ILineCreate[]> { const codes = await MyGlobal.prisma.tax_codes.findMany({ where: { organization_id: org, jurisdiction_id: jurisdictionId, active: true }, select: { id: true } }); const actual = await postedTaxByCode(org, period, codes.map((code) => code.id)); return codes.map((code) => { const amount = actual.get(code.id) ?? 0; return { taxCodeId: code.id, amount, reconciledAmount: amount }; }); }
  function validateLines(input: api.ITaxReturn.ILineCreate[]): void { if (input.length === 0 || input.some((line) => !Number.isFinite(line.amount) || line.amount < 0 || (line.reconciledAmount !== undefined && (!Number.isFinite(line.reconciledAmount) || line.reconciledAmount < 0)))) throw ErrorUtil.unprocessable("Tax return amounts must be finite and non-negative, with at least one line."); }
  async function postedTaxByCode(org: string, period: string, codeIds: string[]): Promise<Map<string, number>> {
    const range = periodRange(period); const codes = await MyGlobal.prisma.tax_codes.findMany({ where: { id: { in: codeIds }, organization_id: org }, select: { id: true, account_id: true, type: true } });
    if (codes.length !== codeIds.length) throw ErrorUtil.conflict("Every tax return line must use a tax code in the active organization.");
    const fallback = codes.filter((code) => code.account_id === null); if (fallback.length > 1) throw ErrorUtil.conflict("Posted tax journals do not retain enough tax-code identity to reconcile multiple unassigned tax codes.");
    const taxAccount = await MyGlobal.prisma.accounts.findFirst({ where: { organization_id: org, code: "2100", active: true }, select: { id: true } });
    const journals = await MyGlobal.prisma.journals.findMany({ where: { organization_id: org, status: "posted", journal_date: range, source_module: { in: ["sales_invoice", "vendor_bill", "payroll", "duty", "withholding"] }, source_id: { not: null } }, select: { id: true, source_module: true } });
    const accountIds = [...new Set([...codes.map((code) => code.account_id).filter((id): id is string => id !== null), ...(taxAccount === null ? [] : [taxAccount.id])])];
    const journalLines = journals.length === 0 ? [] : await MyGlobal.prisma.journal_lines.findMany({ where: { journal_id: { in: journals.map((journal) => journal.id) }, ...(accountIds.length === 0 ? {} : { account_id: { in: accountIds } }) }, select: { journal_id: true, account_id: true, tax_code_id: true, debit: true, credit: true } });
    const byJournal = new Map(journals.map((journal) => [journal.id, journal.source_module])); const result = new Map(codeIds.map((id) => [id, 0]));
    for (const line of journalLines) { const source = byJournal.get(line.journal_id); if (source === undefined) continue; const code = (line.tax_code_id === null ? undefined : codes.find((candidate) => candidate.id === line.tax_code_id)) ?? codes.find((candidate) => candidate.account_id === line.account_id) ?? (fallback.length === 1 && line.account_id === taxAccount?.id ? fallback[0] : undefined); if (code === undefined) continue; const sales = source === "sales_invoice"; if (code.account_id === null && code.type.toLowerCase().includes("sales") !== sales) continue; result.set(code.id, (result.get(code.id) ?? 0) + Math.abs(line.debit - line.credit)); }
    return result;
  }
  function periodRange(period: string): { gte: Date; lt: Date } { const quarter = /^(\d{4})-Q([1-4])$/i.exec(period); if (quarter !== null) { const year = Number(quarter[1]); const month = (Number(quarter[2]) - 1) * 3; return { gte: new Date(Date.UTC(year, month, 1)), lt: new Date(Date.UTC(year, month + 3, 1)) }; } const month = /^(\d{4})-(\d{2})$/.exec(period); if (month !== null) { const year = Number(month[1]); const value = Number(month[2]); return { gte: new Date(Date.UTC(year, value - 1, 1)), lt: new Date(Date.UTC(year, value, 1)) }; } throw ErrorUtil.unprocessable("A tax return period must use YYYY-MM or YYYY-Qn format."); }
  async function lines(id: string): Promise<api.ITaxReturn.ILine[]> { return (await MyGlobal.prisma.tax_return_lines.findMany({ where: { return_id: id }, orderBy: { created_at: "asc" } })).map((line) => ({ id: line.id, taxCodeId: line.tax_code_id, amount: line.amount, reconciledAmount: line.reconciled_amount })); }
  function taxReturn(row: { id: string; jurisdiction_id: string; period: string; status: string; total_tax: number; original_return_id: string | null; filed_at: Date | null }, returnLines: api.ITaxReturn.ILine[]): api.ITaxReturn { return { id: row.id, jurisdictionId: row.jurisdiction_id, period: row.period, status: row.status as api.ITaxReturn["status"], totalTax: row.total_tax, originalReturnId: row.original_return_id, filedAt: row.filed_at?.toISOString() ?? null, lines: returnLines }; }
}
