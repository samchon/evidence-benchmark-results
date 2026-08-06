import * as api from "@benchmark/erp-api";
import typia from "typia";

/** Proves global self-service credentials and Owner role composition. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-membership-membership-and-role-rules Exercises and asserts the membership membership and role rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-role-role-integrity-rules Exercises and asserts the role role integrity rules behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Exercises and asserts the role organization roles and permissions behavior.
 */
/**
 */
export async function test_api_account_and_roles(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `account-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Account ${suffix}`, code: `account-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });

  const profile = await api.functional.auth_profile.profile(owner);
  if (profile.displayName !== "Owner") throw new Error("profile did not expose the global identity");
  const revisedProfile = await api.functional.auth_profile_update.update(owner, { displayName: "Updated Owner", locale: "ko-KR" });
  typia.assert(revisedProfile);
  if (revisedProfile.displayName !== "Updated Owner" || revisedProfile.locale !== "ko-KR") throw new Error("profile update was not retained");
  await api.functional.auth_password.change(owner, { currentPassword: password, newPassword: "new-correct-horse-battery" });

  const role = await api.functional.role_create.create(owner, { name: "Reporting Analyst", permissions: ["report.read", "report.export"] });
  typia.assert(role);
  const updatedRole = await api.functional.role_update.update(owner, role.id, { permissions: ["report.read"] });
  if (updatedRole.permissions.length !== 1 || updatedRole.permissions[0] !== "report.read") throw new Error("custom role composition was not updated");
  const roles = await api.functional.role_search.index(owner);
  const ownerRole = roles.data.find((item) => item.name === "Owner");
  if (ownerRole === undefined || !ownerRole.permissions.includes("finance.manage")) throw new Error("seeded Owner permissions were not retained");
  if (!roles.data.some((item) => item.id === role.id)) throw new Error("custom role was not discoverable");
  const membershipId = authorized.memberships[0]!.id;
  const assigned = await api.functional.role_assign.assign(owner, { membershipId, roleId: role.id });
  if (!assigned.roles.includes("Reporting Analyst")) throw new Error("role assignment was not reflected in membership");
  const revoked = await api.functional.role_revoke.revoke(owner, { membershipId, roleId: role.id });
  if (revoked.roles.includes("Reporting Analyst")) throw new Error("role revocation was not reflected in membership");
  await api.functional.role_delete.remove(owner, role.id);
}
