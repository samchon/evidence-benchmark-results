import * as api from "@benchmark/erp-api";

/** Proves draft budget approval and independent finance dimensions. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-cost-center-cost-centers Exercises and asserts the cost center cost centers behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profit-center-profit-centers Exercises and asserts the profit center profit centers behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-cost-center-cost-center-operations Exercises and asserts the cost center cost center operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-profit-center-profit-center-operations Exercises and asserts the profit center profit center operations behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-budget-budget-rules Exercises budget creation, approval, and revision state changes.
 * @evidence docs/analysis/02-domain-model.md#req-dom-budget-budget-lifecycle Exercises the budget lifecycle and revision history.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-budget-budget-operations Exercises budget and budget-line operations.
 */
export async function test_api_finance_dimensions(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `finance-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Finance ${suffix}`, code: `finance-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const cost = await api.functional.cost_center_create.create(owner, { code: "CC-001", name: "Operations" });
  const inactiveCost = await api.functional.cost_center_status.status(owner, cost.id, { status: "inactive" });
  const profit = await api.functional.profit_center_create.create(owner, { code: "PC-001", name: "Retail" });
  const inactiveProfit = await api.functional.profit_center_status.status(owner, profit.id, { status: "inactive" });
  const budget = await api.functional.budget_create.create(owner, { name: "FY2026 Plan", fiscalYear: 2026, currencyCode: "USD", totalAmount: 10000 });
  const line = await api.functional.budget_line_create.create(owner, { budgetId: budget.id, costCenterId: cost.id, periodStart: "2026-01-01T00:00:00.000Z", periodEnd: "2026-12-31T00:00:00.000Z", amount: 10000 });
  await api.functional.budget_status.status(owner, budget.id, { status: "submitted" });
  const approved = await api.functional.budget_status.status(owner, budget.id, { status: "approved" });
  const revision = await api.functional.budget_revision_create.create(owner, { budgetId: budget.id, reason: "Updated demand plan", totalAmount: 12000 });
  const submittedRevision = await api.functional.budget_revision_status.status(owner, revision.id, { status: "submitted" });
  const approvedRevision = await api.functional.budget_revision_status.status(owner, revision.id, { status: "approved" });
  if (inactiveCost.status !== "inactive" || inactiveProfit.status !== "inactive" || line.amount !== 10000 || approved.status !== "approved" || submittedRevision.status !== "submitted" || approvedRevision.status !== "approved") throw new Error("finance dimension lifecycle state was not retained");
}
