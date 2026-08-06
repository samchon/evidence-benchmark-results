import * as api from "@benchmark/erp-api";

/** Proves tax-return review, filing, and amendment version lifecycle. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-tax-tax-return-filing-rules Exercises and asserts the tax tax return filing rules behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-tax-return-tax-return-lifecycle Exercises and asserts the tax return tax return lifecycle behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-tax-return-tax-return-operations Exercises and asserts the tax return tax return operations behavior.
 */
export async function test_api_tax_return(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `tax-return-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Tax Return ${suffix}`, code: `tax-return-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const jurisdiction = await api.functional.tax_jurisdiction_create.create(owner, { name: "Federal", territory: "US" });
  const prepared = await api.functional.tax_return_create.create(owner, { jurisdictionId: jurisdiction.id, periodStart: "2026-01-01T00:00:00.000Z", periodEnd: "2026-03-31T00:00:00.000Z", totalTax: 1250, notes: "Q1" });
  const review = await api.functional.tax_return_status.status(owner, prepared.id, { status: "under_review" });
  if (review.status !== "under_review") throw new Error("tax return did not enter review");
  const filed = await api.functional.tax_return_status.status(owner, prepared.id, { status: "filed" });
  if (filed.status !== "filed" || filed.filedAt === null) throw new Error("tax return did not become filed");
  const amendment = await api.functional.tax_return_amend.amend(owner, prepared.id, { totalTax: 1300, notes: "Corrected Q1" });
  if (amendment.version !== 2 || amendment.originalReturnId !== prepared.id || amendment.status !== "amended") throw new Error("filed tax return amendment did not preserve version history");
  const found = await api.functional.tax_return_search.index(owner, { jurisdictionId: jurisdiction.id });
  if (found.data.length !== 2) throw new Error("tax return search omitted amendment history");
}
