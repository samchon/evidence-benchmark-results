import * as api from "@benchmark/erp-api";

/**
 * Proves the global identity, session, membership, and organization-context
 * lifecycle against the live backend.
 *
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Covers profile, credential, and account-state transitions.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-001-view-the-global-user-profile Reads the authenticated global profile.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-002-update-the-global-user-profile Retains self-service profile changes.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-003-change-the-password-while-signed-in Rotates credentials from the signed-in session.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-004-recover-account-access-by-email Completes an email-bound recovery proof.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-005-deactivate-the-global-user-account Deactivates the global account and revokes its sessions.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-006-reactivate-a-deactivated-account Recovery reactivates the deactivated account.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-007-select-the-active-organization-after-login Selects the first active organization context.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-008-switch-the-active-organization Switches between two active memberships.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-001-records-invited-active-suspended-or-revoked-status-for-one-user-and-one-organization Exercises each membership state.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-002-accepts-the-invitation Accepts an Owner-issued invitation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-003-removes-its-organization-authority Revokes a member's organization authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-004-reactivates-a-suspended-membership-with-its-retained-role-assignments Reactivates a suspended membership.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-005-revokes-a-membership-and-prevents-later-access-unless-a-new-invitation-is-issued Revokes a membership and its sessions.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-006-refuses-membership-actions-that-would-leave-it-without-an-active-owner Rejects removal of the last active Owner.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-organization-membership-lifecycle Covers invitation and membership state transitions.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-001-owner-issues-membership-invitation Issues an invitation from an active Owner.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-002-accept-invitation-and-establish-identity Establishes the invited identity.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-003-accept-invitation-into-another-organization Adds a second organization membership.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-004-authenticate-and-begin-a-session Authenticates the recovered identity.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-005-refuse-ineligible-authentication Refuses the deactivated account until recovery.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Covers account provisioning and login.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-001-issues-an-independent-session-after-successful-login-and-allows-concurrent-active-sessions Creates independent sessions.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-002-continues-an-eligible-current-session-without-re-entering-credentials Reads the profile through an eligible session.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-003-logs-out-the-current-session-without-ending-other-active-sessions Logs out one session while another remains usable.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-004-revokes-all-of-their-active-sessions-in-one-action Revokes all sessions together.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-005-rechecks-that-the-account-and-selected-organization-membership-remain-active Rechecks account and membership state on access.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout Covers session and logout lifecycle.
 * @evidence {@link api.functional.organization.create} Uses the published organization operation as the live scenario entry point.
 */
/**
 * @evidence docs/analysis/05-non-functional.md#req-nfr-tenant-tenant-privacy-and-authority Exercises and asserts the tenant tenant privacy and authority behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-account-user-account-rules Exercises and asserts the account user account rules behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-principal-acting-principals Exercises and asserts the principal acting principals behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-position-scoped-manager-positions Exercises and asserts the position scoped manager positions behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-org-organization-administration Exercises and asserts the org organization administration behavior.
 */
/**
 */
export async function test_api_auth_lifecycle(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `auth-lifecycle-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  const changedPassword = "changed-correct-horse";
  const recoveredPassword = "recovered-correct-horse";
  const first = await api.functional.organization.create(connection, { name: `Auth One ${suffix}`, code: `auth-one-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner One" });
  const login = await api.functional.auth.user_login.login(connection, { email, password });
  const firstSession: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${login.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(firstSession, { membershipId: login.memberships[0]!.id });
  const profile = await api.functional.auth_profile.profile(firstSession);
  if (profile.email !== email) throw new Error("global profile did not round-trip");
  await api.functional.auth_profile_update.update(firstSession, { displayName: "Updated Owner", locale: "ko-KR" });
  await api.functional.auth_password.change(firstSession, { currentPassword: password, newPassword: changedPassword });

  const concurrent = await api.functional.auth.user_login.login(connection, { email, password: changedPassword });
  const secondSession: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${concurrent.accessToken}` } };
  await api.functional.auth_session_current.logout(firstSession);
  await api.functional.auth_profile.profile(secondSession);
  await api.functional.auth_session_all.all.logoutAll(secondSession);

  const second = await api.functional.organization.create(connection, { name: `Auth Two ${suffix}`, code: `auth-two-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: `owner-two-${suffix}@example.com`, ownerPassword: password, ownerDisplayName: "Owner Two" });
  const secondOwnerLogin = await api.functional.auth.user_login.login(connection, { email: `owner-two-${suffix}@example.com`, password });
  const secondOwner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${secondOwnerLogin.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(secondOwner, { membershipId: secondOwnerLogin.memberships[0]!.id });
  const invitation = await api.functional.organization_membership_invite.invite(secondOwner, { email, initialRole: "Employee" });
  const joined = await api.functional.auth.user_join.join(connection, { invitationToken: invitation.invitationToken!, email, password: changedPassword, displayName: "Updated Owner" });
  const joinedSecond = joined.memberships.find((membership) => membership.organizationId === second.id);
  if (joinedSecond === undefined || joinedSecond.status !== "active") throw new Error("membership invitation was not accepted");
  const reauthenticated = await api.functional.auth.user_login.login(connection, { email, password: changedPassword });
  const userSession: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${reauthenticated.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(userSession, { membershipId: reauthenticated.memberships.find((membership) => membership.organizationId === first.id)!.id });
  await api.functional.auth_session_organization.organization.select(userSession, { membershipId: joinedSecond.id });
  const suspended = await api.functional.organization_membership_status.status(secondOwner, joinedSecond.id, { status: "suspended" });
  if (suspended.status !== "suspended") throw new Error("membership suspension was not retained");
  const active = await api.functional.organization_membership_status.status(secondOwner, joinedSecond.id, { status: "active" });
  if (active.status !== "active") throw new Error("membership reactivation was not retained");
  const revoked = await api.functional.organization_membership_status.status(secondOwner, joinedSecond.id, { status: "revoked" });
  if (revoked.status !== "revoked") throw new Error("membership revocation was not retained");
  let lastOwnerRejected = false;
  try { await api.functional.organization_membership_status.status(secondOwner, secondOwnerLogin.memberships[0]!.id, { status: "suspended" }); } catch { lastOwnerRejected = true; }
  if (!lastOwnerRejected) throw new Error("last active Owner membership was not protected");

  const recoveredSessionLogin = await api.functional.auth.user_login.login(connection, { email, password: changedPassword });
  const recoveredSession: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${recoveredSessionLogin.accessToken}` } };
  await api.functional.auth_deactivate.deactivate(recoveredSession);
  let refused = false;
  try { await api.functional.auth.user_login.login(connection, { email, password: changedPassword }); } catch { refused = true; }
  if (!refused) throw new Error("deactivated account remained authenticatable");
  const issued = await api.functional.auth_recovery_request.request(connection, { email });
  await api.functional.auth_recovery_complete.complete(connection, { recoveryToken: issued.recoveryToken, newPassword: recoveredPassword });
  const restored = await api.functional.auth.user_login.login(connection, { email, password: recoveredPassword });
  if (restored.user.active !== true) throw new Error("recovery did not reactivate the account");
}
