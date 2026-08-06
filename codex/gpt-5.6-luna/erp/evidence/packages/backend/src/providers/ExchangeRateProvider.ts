import { randomUUID } from "node:crypto";
import type { IAuth, IExchangeRate, IPage } from "@benchmark/erp-api";
import { Prisma } from "@prisma/sdk";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { AuthProvider } from "./AuthProvider";

/** Owns effective-dated organization exchange rates. */
export namespace ExchangeRateProvider {
  export async function record(headers: IAuth.IHeaders, input: IExchangeRate.ICreate): Promise<IExchangeRate> {
    const oid = await organization(headers);
    const source = await currency(oid, input.sourceCode);
    const target = await currency(oid, input.targetCode);
    if (!source.active || !target.active) throw ErrorUtil.conflict("Exchange rates require active currencies.");
    const effectiveAt = new Date(input.effectiveAt);
    const row = await MyGlobal.prisma.exchange_rates.upsert({ where: { organization_id_source_currency_id_target_currency_id_effective_at: { organization_id: oid, source_currency_id: source.id, target_currency_id: target.id, effective_at: effectiveAt } }, create: { id: randomUUID(), organization_id: oid, source_currency_id: source.id, target_currency_id: target.id, effective_at: effectiveAt, rate: input.rate, origin: input.origin ?? "manual", created_at: new Date() }, update: { rate: input.rate, origin: input.origin ?? "manual" }, include: { source_currency: true, target_currency: true } });
    return transform(row);
  }
  export async function index(headers: IAuth.IHeaders, input: IExchangeRate.IRequest): Promise<IPage<IExchangeRate>> {
    const oid = await organization(headers);
    const where: Prisma.exchange_ratesWhereInput = { organization_id: oid, ...(input.sourceCode ? { source_currency: { code: input.sourceCode.toUpperCase() } } : {}), ...(input.targetCode ? { target_currency: { code: input.targetCode.toUpperCase() } } : {}) };
    const rows = await MyGlobal.prisma.exchange_rates.findMany({ where, include: { source_currency: true, target_currency: true }, orderBy: { effective_at: "desc" } });
    return { pagination: { current: 1, limit: 0, records: rows.length, pages: 1 }, data: rows.map(transform) };
  }
  export async function resolve(headers: IAuth.IHeaders, input: IExchangeRate.IResolve): Promise<IExchangeRate> {
    const oid = await organization(headers);
    const source = await currency(oid, input.sourceCode);
    const target = await currency(oid, input.targetCode);
    const row = await MyGlobal.prisma.exchange_rates.findFirst({ where: { organization_id: oid, source_currency_id: source.id, target_currency_id: target.id, effective_at: { lte: new Date(input.at) } }, include: { source_currency: true, target_currency: true }, orderBy: { effective_at: "desc" } });
    if (row === null) throw ErrorUtil.notFound("No effective exchange rate exists for the requested date.");
    return transform(row);
  }
  /**
   * @evidence docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-003-the-organization-system-principal-refreshes-exchange-rates-from-configured-sources Refreshes configured source rates under the organization system principal and records one audit event in the same transaction.
   * Refreshes configured source values in one tenant-scoped, system-attributed transaction.
   */
  export async function refresh(headers: IAuth.IHeaders, input: IExchangeRate.IRefresh): Promise<IExchangeRate[]> {
    const oid = await organization(headers);
    const principal = await MyGlobal.prisma.system_principals.findUnique({ where: { organization_id: oid } });
    if (principal === null) throw ErrorUtil.notFound("No system principal is configured for this organization.");
    const now = new Date();
    const rows = await MyGlobal.prisma.$transaction(async (tx) => {
      const result: IExchangeRate[] = [];
      for (const item of input.rates) {
        const source = await currency(oid, item.sourceCode, tx);
        const target = await currency(oid, item.targetCode, tx);
        if (!source.active || !target.active) throw ErrorUtil.conflict("Exchange rates require active currencies.");
        const effectiveAt = new Date(item.effectiveAt);
        const row = await tx.exchange_rates.upsert({
          where: { organization_id_source_currency_id_target_currency_id_effective_at: { organization_id: oid, source_currency_id: source.id, target_currency_id: target.id, effective_at: effectiveAt } },
          create: { id: randomUUID(), organization_id: oid, source_currency_id: source.id, target_currency_id: target.id, effective_at: effectiveAt, rate: item.rate, origin: item.origin ?? "system", created_at: now },
          update: { rate: item.rate, origin: item.origin ?? "system" },
          include: { source_currency: true, target_currency: true },
        });
        result.push(transform(row));
      }
      await tx.audit_events.create({ data: { id: randomUUID(), organization_id: oid, user_id: null, system_principal_id: principal.id, action: "exchange_rate.refresh", target_type: "exchange_rate_batch", target_id: oid, before_value: null, after_value: String(result.length), reason: "Configured source refresh", created_at: now } });
      return result;
    });
    return rows;
  }
  function transform(row: Prisma.exchange_ratesGetPayload<{ include: { source_currency: true; target_currency: true } }>): IExchangeRate { return { id: row.id as IExchangeRate["id"], sourceCode: row.source_currency.code, targetCode: row.target_currency.code, effectiveAt: row.effective_at.toISOString(), rate: Number(row.rate), origin: row.origin, createdAt: row.created_at.toISOString() }; }
  async function organization(headers: IAuth.IHeaders): Promise<string> { const actor = await AuthProvider.authorize(headers); const session = await MyGlobal.prisma.sessions.findUnique({ where: { id: actor.sessionId }, select: { selected_organization_id: true } }); if (session?.selected_organization_id === null || session === null) throw ErrorUtil.forbidden("Select an active organization before exchange-rate work."); return session.selected_organization_id; }
  async function currency(oid: string, code: string, client: { currencies: typeof MyGlobal.prisma.currencies } = MyGlobal.prisma) { const row = await client.currencies.findUnique({ where: { organization_id_code: { organization_id: oid, code: code.toUpperCase() } } }); if (row === null) throw ErrorUtil.notFound(`Currency ${code} is not configured.`); return row; }
}
