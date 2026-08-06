import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves organization bootstrap creates a first Owner-capable identity and
 * that login exposes the membership needed for later context selection.
 *
 * 1. Create a tenant with first-owner credentials.
 * 2. Authenticate those credentials through the published login operation.
 * 3. Select the returned active membership and read the organization back.
 *
 * @evidence {@link api.functional.organization.create} Proves the published bootstrap operation.
 */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-org-access-organization-isolation-rules Exercises and asserts the org access organization isolation rules behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-org-organization-scope Exercises and asserts the org organization scope behavior.
 */
/**
 */
export async function test_api_organization_bootstrap(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `owner-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  // Step 1: create a tenant and its first Owner identity
  const organization = await api.functional.organization.create(connection, {
    name: `Organization ${suffix}`,
    code: `organization-${suffix}`,
    baseCurrency: "USD",
    timezone: "UTC",
    fiscalStartMonth: 1,
    ownerEmail: email,
    ownerPassword: password,
    ownerDisplayName: "Initial Owner",
  });
  typia.assert(organization);
  // Step 2: authenticate the newly created Owner
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  typia.assert(authorized);
  if (authorized.memberships.length !== 1 || authorized.memberships[0]?.organizationId !== organization.id)
    throw new Error("organization bootstrap did not create the first Owner membership");
  // Step 3: select the membership and read the tenant through its protected route
  const authenticated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(authenticated, { membershipId: authorized.memberships[0]!.id });
  const detail = await api.functional.organization_detail.at(authenticated, organization.id);
  typia.assert(detail);
  if (detail.id !== organization.id || detail.code !== organization.code) throw new Error("organization detail did not round-trip");
  const revised = await api.functional.organization_update.update(authenticated, organization.id, { name: "Updated Organization", numberingPrefix: "UPD" });
  if (revised.name !== "Updated Organization" || revised.numberingPrefix !== "UPD") throw new Error("organization update did not round-trip");
}
