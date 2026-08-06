import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves tax treatment, units, numbering, and fiscal-period generation.
 *
 * 1. Creates an owner and selects a fresh organization.
 * 2. Creates a jurisdiction, tax code, and effective rate, then resolves it.
 * 3. Creates a unit, sequence, and fiscal year and observes generated state.
 */
export async function test_api_finance_control(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-control`, email = `owner-${suffix}@example.com`, password = "correct-horse-battery-staple";
  await api.functional.auth.user.createUser(connection, { email, password, displayName: "Owner" });
  const first = await api.functional.auth.user.login(connection, { email, password });
  const unaffiliated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${first.accessToken}` } };
  const organization = await api.functional.organization.create(unaffiliated, { name: `Control ${suffix}`, code: `control-${suffix}`, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const second = await api.functional.auth.user.login(connection, { email, password });
  const membership = second.memberships.find((item) => item.organization.id === organization.id);
  if (membership === undefined) throw new Error("control organization membership was not returned");
  const selected = await api.functional.auth.user.organization.select({ host: connection.host, headers: { Authorization: `Bearer ${second.accessToken}` } }, { membershipId: membership.id });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${selected.accessToken}` } };
  const jurisdiction = await api.functional.organization.tax_jurisdiction.createJurisdiction(owner, { name: `VAT ${suffix}`, territoryCode: "KR" }); typia.assert(jurisdiction);
  const code = await api.functional.organization.tax_code.createTaxCode(owner, { jurisdictionId: jurisdiction.id, codeType: "output_vat", name: "VAT 10%" }); typia.assert(code);
  await api.functional.organization.tax_code.rate.addTaxRate(owner, code.id, { effectiveFrom: "2026-01-01T00:00:00.000Z", rate: 0.1 });
  const rate = await api.functional.organization.tax_code.rate.resolve.resolveTaxRate(owner, code.id, { businessDate: "2026-06-01T00:00:00.000Z" });
  if (rate.rate !== 0.1) throw new Error("effective tax rate was not resolved");
  const unit = await api.functional.organization.unit.createUnit(owner, { code: "EA", name: "Each", category: "quantity" }); typia.assert(unit);
  const sequence = await api.functional.organization.document_number.createSequence(owner, { documentType: "purchase_order", prefix: "PO-", nextValue: 1, width: 4 }); typia.assert(sequence);
  const issued = await api.functional.organization.document_number.next.nextNumber(owner, { documentType: "purchase_order" });
  if (issued.number !== "PO-0001") throw new Error("document sequence did not issue the configured number");
  const year = await api.functional.organization.fiscal_year.createFiscalYear(owner, { year: 2026, fiscalStartMonth: 1 }); typia.assert(year);
  if (year.periods.length !== 12) throw new Error("fiscal year did not generate twelve periods");
}
