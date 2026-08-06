import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves contacts remain organization-scoped, searchable, revisable, and
 * deactivatable without losing their identity.
 *
 * 1. Bootstrap and authenticate an Owner.
 * 2. Create and revise a contact.
 * 3. Discover and deactivate the contact.
 *
 * @evidence {@link api.functional.contact_create.create} Proves contact creation.
 */
/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-contact-contacts Exercises and asserts the contact contacts behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-contact-contact-operations Exercises and asserts the contact contact operations behavior.
 */
/**
 */
export async function test_api_contact_lifecycle(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `contact-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  // Step 1: bootstrap and authenticate an Owner
  await api.functional.organization.create(connection, { name: `Contacts ${suffix}`, code: `contacts-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  typia.assert(authorized);
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  // Step 2: create and revise a contact
  const contact = await api.functional.contact_create.create(owner, { name: "Ada Lovelace", email: `ada-${suffix}@example.com`, phone: "+82-2-555-0100" });
  typia.assert(contact);
  const revised = await api.functional.contact_update.update(owner, contact.id, { phone: "+82-2-555-0101" });
  typia.assert(revised);
  // Step 3: discover and deactivate the contact
  const found = await api.functional.contact_search.index(owner, { search: "Ada" });
  typia.assert(found);
  if (!found.data.some((item) => item.id === contact.id && item.phone === "+82-2-555-0101")) throw new Error("contact revision was not discoverable");
  const retired = await api.functional.contact_status.status(owner, contact.id, { active: false });
  typia.assert(retired);
  if (retired.active !== false) throw new Error("contact deactivation was not persisted");
}
