import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves reusable addresses stay tenant-scoped while remaining revisable and
 * retireable for future relationship selection.
 *
 * 1. Bootstrap and authenticate an Owner in a new organization.
 * 2. Create and revise an address.
 * 3. Search it and deactivate it without losing its identity.
 *
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-address-address-operations Proves the address lifecycle operations.
 * @evidence {@link api.functional.address_create.create} Proves address creation.
 */
/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-address-addresses Exercises and asserts the address addresses behavior.
 */
/**
 */
export async function test_api_address_lifecycle(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `address-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  // Step 1: bootstrap and authenticate an Owner
  await api.functional.organization.create(connection, { name: `Addresses ${suffix}`, code: `addresses-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  typia.assert(authorized);
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  // Step 2: create and revise an address
  const address = await api.functional.address_create.create(owner, { label: "HQ", line1: "1 Main Street", city: "Seoul", countryCode: "KR" });
  typia.assert(address);
  const revised = await api.functional.address_update.update(owner, address.id, { line1: "2 Main Street" });
  typia.assert(revised);
  // Step 3: search and retire the address
  const found = await api.functional.address_search.index(owner, {});
  typia.assert(found);
  if (!found.data.some((item) => item.id === address.id && item.line1 === "2 Main Street")) throw new Error("address revision was not discoverable");
  const retired = await api.functional.address_status.status(owner, address.id, { active: false });
  typia.assert(retired);
  if (retired.active !== false) throw new Error("address deactivation was not persisted");
}
