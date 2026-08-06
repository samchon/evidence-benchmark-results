import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the public bootstrap, organization selection, and finance-reference lifecycle.
 *
 * 1. Creates and authenticates a user.
 * 2. Creates an organization and selects its active membership.
 * 3. Adds and discovers a supported currency and payment term.
 */
export async function test_api_core_lifecycle(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-core`, email = `owner-${suffix}@example.com`, password = "correct-horse-battery-staple";
  const user = await api.functional.auth.user.createUser(connection, { email, password, displayName: "Owner" });
  typia.assert(user);
  const authorized = await api.functional.auth.user.login(connection, { email, password });
  typia.assert(authorized);
  const authenticated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  const organization = await api.functional.organization.create(authenticated, { name: `Core ${suffix}`, code: `core-${suffix}`, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  typia.assert(organization);
  const refreshed = await api.functional.auth.user.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${refreshed.accessToken}` } };
  const membership = refreshed.memberships.find((item) => item.organization.id === organization.id);
  if (membership === undefined) throw new Error("organization membership was not returned");
  const selected = await api.functional.auth.user.organization.select(owner, { membershipId: membership.id });
  owner.headers = { Authorization: `Bearer ${selected.accessToken}` };
  const roles = await api.functional.organization.role.roles(owner, { page: 1, limit: 0 });
  const employeeRole = roles.data.find((role) => role.key === "Employee");
  const financeRole = roles.data.find((role) => role.key === "Finance Manager");
  if (!employeeRole || employeeRole.permissions.includes("*") || !employeeRole.permissions.includes("organization:read")) throw new Error("Employee role did not receive its scoped permission set");
  if (!financeRole || financeRole.permissions.includes("*") || !financeRole.permissions.includes("finance:*")) throw new Error("Finance Manager role did not receive its scoped permission set");
  const currency = await api.functional.organization.currency.createCurrency(owner, { code: "EUR", name: "Euro", precision: 2 });
  typia.assert(currency);
  const currencies = await api.functional.organization.currency.listCurrencies(owner, { search: "EUR", active: true, page: 1, limit: 0 });
  if (!currencies.data.some((item) => item.id === currency.id)) throw new Error("currency discovery omitted the created currency");
  const term = await api.functional.organization.payment_term.createTerm(owner, { name: "Net 30", dueDays: 30 });
  typia.assert(term);
  await api.functional.organization.payment_term.deactivate.deactivateTerm(owner, term.id);
  const concurrent = await api.functional.auth.user.login(connection, { email, password });
  const concurrentConnection: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${concurrent.accessToken}` } };
  await api.functional.auth.user.logout(owner);
  let currentRejected = false;
  try { await api.functional.auth.user.profile.profile(owner); } catch { currentRejected = true; }
  if (!currentRejected) throw new Error("logout did not revoke the current session");
  await api.functional.auth.user.profile.profile(concurrentConnection);
  await api.functional.auth.user.logout_all.logoutAll(concurrentConnection);
  let allRejected = false;
  try { await api.functional.auth.user.profile.profile(concurrentConnection); } catch { allRejected = true; }
  if (!allRejected) throw new Error("logout-all did not revoke every session");
  const recovery = await api.functional.auth.user.recovery.request.requestRecovery(connection, { email: `missing-${suffix}@example.com` });
  typia.assert(recovery);
}
