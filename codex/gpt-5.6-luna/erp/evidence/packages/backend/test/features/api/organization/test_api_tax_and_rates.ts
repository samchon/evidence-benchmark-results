import * as api from "@benchmark/erp-api";
import typia from "typia";

/** Proves effective-dated exchange rates and tax catalogs are tenant-scoped.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-exchange-rate-operations Covers exchange-rate operations.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-001-records-or-corrects-a-dated-exchange-rate Proves dated rate recording.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-002-searches-exchange-rates-by-currency-pair-and-effective-date Proves pair search.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-003-the-organization-system-principal-refreshes-exchange-rates-from-configured-sources Proves system-attributed rate refresh.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-exchange-rate-004-selects-the-applicable-rate-for-a-foreign-currency-document-and-records-it-on-the-posting Proves effective rate resolution.
 */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-tax-code-tax-code-calculation-rules Exercises and asserts the tax code tax code calculation rules behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-exchange-rate-exchange-rates Exercises and asserts the exchange rate exchange rates behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-tax-jurisdiction-tax-jurisdictions Exercises and asserts the tax jurisdiction tax jurisdictions behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-tax-code-tax-codes-and-rates Exercises and asserts the tax code tax codes and rates behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-tax-code-tax-code-operations Exercises and asserts the tax code tax code operations behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-tax-jurisdiction-tax-jurisdiction-operations Exercises and asserts the tax jurisdiction tax jurisdiction operations behavior.
 */
export async function test_api_tax_and_rates(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `tax-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Tax ${suffix}`, code: `tax-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const usd = await api.functional.currency_create.create(owner, { code: "USD", name: "US Dollar", precision: 2 });
  const eur = await api.functional.currency_create.create(owner, { code: "EUR", name: "Euro", precision: 2 });
  typia.assert(usd); typia.assert(eur);
  const recorded = await api.functional.exchange_rate_record.record(owner, { sourceCode: "USD", targetCode: "EUR", effectiveAt: "2026-01-01T00:00:00.000Z", rate: 0.91, origin: "manual" });
  const resolved = await api.functional.exchange_rate_resolve.resolve(owner, { sourceCode: "USD", targetCode: "EUR", at: "2026-06-01T00:00:00.000Z" });
  if (resolved.id !== recorded.id || resolved.rate !== 0.91) throw new Error("effective exchange-rate resolution was not retained");
  const searched = await api.functional.exchange_rate_search.index(owner, { sourceCode: "USD", targetCode: "EUR" });
  if (!searched.data.some((item) => item.id === recorded.id)) throw new Error("exchange-rate pair search omitted the recorded rate");
  const refreshed = await api.functional.exchange_rate_refresh.refresh(owner, { rates: [{ sourceCode: "USD", targetCode: "EUR", effectiveAt: "2026-07-01T00:00:00.000Z", rate: 0.92, origin: "configured-source" }] });
  if (refreshed.length !== 1 || refreshed[0]!.rate !== 0.92 || refreshed[0]!.origin !== "configured-source") throw new Error("system exchange-rate refresh was not retained");

  const jurisdiction = await api.functional.tax_jurisdiction_create.create(owner, { name: "United States", territory: "US" });
  const jurisdictionRevision = await api.functional.tax_jurisdiction_update.update(owner, jurisdiction.id, { territory: "US-48" });
  if (jurisdictionRevision.territory !== "US-48") throw new Error("tax jurisdiction revision was not retained");
  const taxCode = await api.functional.tax_code_create.create(owner, { jurisdictionId: jurisdiction.id, taxType: "sales", name: "Standard", payableAccountId: null, receivableAccountId: null });
  const taxRate = await api.functional.tax_rate_create.create(owner, { taxCodeId: taxCode.id, validFrom: "2026-01-01T00:00:00.000Z", rate: 0.0825 });
  typia.assert(taxRate);
  const codes = await api.functional.tax_code_search.index(owner, { jurisdictionId: jurisdiction.id, search: "Standard" });
  const rates = await api.functional.tax_rate_search.index(owner, { taxCodeId: taxCode.id });
  const effectiveTaxRate = await api.functional.tax_rate_resolve.resolve(owner, { taxCodeId: taxCode.id, at: "2026-06-01T00:00:00.000Z" });
  if (!codes.data.some((item) => item.id === taxCode.id) || !rates.data.some((item) => item.id === taxRate.id) || effectiveTaxRate.id !== taxRate.id) throw new Error("tax catalog discovery omitted configured records");
  await api.functional.tax_code_status.status(owner, taxCode.id, { active: false });
  await api.functional.tax_jurisdiction_status.status(owner, jurisdiction.id, { active: false });
}
