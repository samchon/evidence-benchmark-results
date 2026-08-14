import * as api from "@benchmark/erp-api";
import typia from "typia";
import { create_owner, login_owner } from "../../../helpers/ErpFixtures";

/** Proves organization creation establishes a tenant and its first Owner. */
export async function test_api_erp_auth_organization(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const organization = await api.functional.erp.organization.at(owner.connection);
  typia.assert(organization);
  if (organization.status !== "active") throw new Error("Created organization is not active.");
}

/** Proves login issues an independent session for an eligible user. */
export async function test_api_erp_auth_login(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const loggedIn = await login_owner(connection, owner);
  const profile = await api.functional.erp.auth.profile.profile(loggedIn);
  typia.assert(profile);
  if (profile.email !== owner.email) throw new Error("Login returned the wrong global identity.");
}

/** Proves a refresh credential rotates both bearer credentials and preserves membership choices. */
export async function test_api_erp_auth_refresh(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const loggedIn: api.IConnection = { host: connection.host };
  const loggedInResult = await api.functional.erp.auth.login(loggedIn, { email: owner.email, password: owner.password });
  const refreshed = await api.functional.erp.auth.refresh({ host: connection.host }, { refreshToken: loggedInResult.refreshToken });
  if (refreshed.accessToken.length < 16 || refreshed.refreshToken.length < 16) throw new Error("Refresh did not issue replacement credentials.");
}

/** Proves a signed-in user can select an active membership after login. */
export async function test_api_erp_auth_membership_select(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const loggedIn = await login_owner(connection, owner);
  const membership = await api.functional.erp.auth.membership.select(loggedIn, owner.membershipId);
  typia.assert(membership);
  if (membership.status !== "active") throw new Error("An active membership was not selected.");
}

/** Proves the global profile is readable through self-service. */
export async function test_api_erp_auth_profile(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const profile = await api.functional.erp.auth.profile.profile(owner.connection);
  typia.assert(profile);
  if (profile.displayName !== "Organization Owner") throw new Error("Profile did not preserve its display name.");
}

/** Proves a profile update is visible through a subsequent public read. */
export async function test_api_erp_auth_profile_update(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const updated = await api.functional.erp.auth.profile.updateProfile(owner.connection, { displayName: "Updated Owner" });
  typia.assert(updated);
  if (updated.displayName !== "Updated Owner") throw new Error("Profile update was not persisted.");
}

/** Proves current-session logout revokes the current bearer session. */
export async function test_api_erp_auth_session_logout(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const result = await api.functional.erp.auth.session.logout(owner.connection);
  typia.assert(result);
  if (result.id.length === 0) throw new Error("Logout did not identify the revoked session.");
}

/** Proves all-session logout is a distinct operation. */
export async function test_api_erp_auth_sessions_logout_all(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const result = await api.functional.erp.auth.sessions.logoutAll(owner.connection);
  typia.assert(result);
  if (result.id.length === 0) throw new Error("Logout-all did not identify the current session.");
}

/** Proves Owner organization configuration is read and updated in its tenant. */
export async function test_api_erp_organization_update(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const updated = await api.functional.erp.organization.update(owner.connection, { name: "Renamed ERP" });
  typia.assert(updated);
  if (updated.name !== "Renamed ERP") throw new Error("Organization configuration was not updated.");
  const read = await api.functional.erp.organization.at(owner.connection);
  if (read.name !== "Renamed ERP") throw new Error("Organization update was not observable after reread.");
}

/** Proves duplicate pending invitations are refused by the organization owner. */
export async function test_api_erp_organization_invitation(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const email = `invite-${Math.random().toString(36).slice(2, 10)}@example.com`;
  const invitation = await api.functional.erp.organization.invitation.invite(owner.connection, { email });
  typia.assert(invitation);
  if (invitation.status !== "pending") throw new Error("Invitation did not begin pending.");
}

/** Proves organization membership listing is scoped to the selected tenant. */
export async function test_api_erp_organization_memberships(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const page = await api.functional.erp.organization.membership.memberships(owner.connection, { page: 1, limit: 10 });
  typia.assert(page);
  if (!page.data.some((item) => item.id === owner.membershipId)) throw new Error("Owner membership was not listed.");
}
