import * as api from "@benchmark/erp-api";
import typia from "typia";

/** Proves budget draft, approval, revision, and archive versioning. */
export async function test_api_budget(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-budget`, email = `owner-${suffix}@example.com`, password = "correct-horse-battery-staple";
  await api.functional.auth.user.createUser(connection, { email, password, displayName: "Owner" });
  const first = await api.functional.auth.user.login(connection, { email, password });
  const unaffiliated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${first.accessToken}` } };
  const org = await api.functional.organization.create(unaffiliated, { name: `Budget ${suffix}`, code: `budget-${suffix}`, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const second = await api.functional.auth.user.login(connection, { email, password });
  const membership = second.memberships.find((item) => item.organization.id === org.id); if (!membership) throw new Error("budget membership missing");
  const selected = await api.functional.auth.user.organization.select({ host: connection.host, headers: { Authorization: `Bearer ${second.accessToken}` } }, { membershipId: membership.id });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${selected.accessToken}` } };
  const budget = await api.functional.organization.budget.create(owner, { name: "Operating", fiscal_year: 2026, total: 10000, lines_json: "[]" }); typia.assert(budget);
  await api.functional.organization.budget.submit(owner, budget.id);
  const active = await api.functional.organization.budget.approve(owner, budget.id); if (active.status !== "active") throw new Error("budget did not activate");
  const revision = await api.functional.organization.budget.revise(owner, budget.id, { reason: "Updated forecast" }); if (revision.version !== 2) throw new Error("budget revision did not increment version");
  const archived = await api.functional.organization.budget.archive(owner, revision.id); if (archived.status !== "archived") throw new Error("budget did not archive");
}
