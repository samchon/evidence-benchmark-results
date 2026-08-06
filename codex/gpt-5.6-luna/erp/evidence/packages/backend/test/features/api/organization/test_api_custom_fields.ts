import * as api from "@benchmark/erp-api";
import typia from "typia";

/** Proves custom-field definitions and typed target values are tenant-scoped. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-customfield-custom-fields Exercises and asserts the customfield custom fields behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-customfield-custom-field-operations Exercises and asserts the customfield custom field operations behavior.
 */
export async function test_api_custom_fields(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `fields-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Fields ${suffix}`, code: `fields-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const targetId = authorized.memberships[0]!.organizationId;
  const definition = await api.functional.custom_field_definition_create.create(owner, { targetConcept: "organization", label: "External reference", valueKind: "text" });
  const revised = await api.functional.custom_field_definition_update.update(owner, definition.id, { label: "External reference code" });
  typia.assert(revised);
  const value = await api.functional.custom_field_value_set.set(owner, { definitionId: definition.id, targetType: "organization", targetId, valueText: "ERP-001" });
  typia.assert(value);
  const values = await api.functional.custom_field_value_search.index(owner, { targetType: "organization", targetId });
  if (!values.data.some((item) => item.id === value.id && item.valueText === "ERP-001")) throw new Error("custom-field value was not discoverable");
  const definitions = await api.functional.custom_field_definition_search.index(owner, { targetConcept: "organization", search: "External" });
  if (!definitions.data.some((item) => item.id === definition.id && item.label === "External reference code")) throw new Error("custom-field definition was not discoverable");
  await api.functional.custom_field_definition_status.status(owner, definition.id, { active: false });
}
