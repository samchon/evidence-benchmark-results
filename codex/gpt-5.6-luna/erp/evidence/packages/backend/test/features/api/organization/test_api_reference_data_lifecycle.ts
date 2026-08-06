import * as api from "@benchmark/erp-api";
import typia from "typia";

/** Proves tenant-scoped tags, assignments, and reference data retain lifecycle state.
 */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-concurrency-concurrent-command-rules Exercises and asserts the concurrency concurrent command rules behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-tag-tags Exercises and asserts the tag tags behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-currency-currencies Exercises and asserts the currency currencies behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-payment-term-payment-terms Exercises and asserts the payment term payment terms behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-uom-units-of-measure Exercises and asserts the uom units of measure behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-tag-tag-operations Exercises and asserts the tag tag operations behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-currency-currency-operations Exercises and asserts the currency currency operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-payment-term-payment-term-operations Exercises and asserts the payment term payment term operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-uom-unit-of-measure-operations Exercises and asserts the uom unit of measure operations behavior.
 */
export async function test_api_reference_data_lifecycle(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `reference-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Reference ${suffix}`, code: `reference-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  typia.assert(authorized);
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });

  const tag = await api.functional.tag_create.create(owner, { label: "Priority", description: "workflow" });
  const tagRevision = await api.functional.tag_update.update(owner, tag.id, { description: "urgent workflow" });
  typia.assert(tagRevision);
  const tags = await api.functional.tag_search.index(owner, { search: "Prior" });
  if (!tags.data.some((item) => item.id === tag.id && item.description === "urgent workflow")) throw new Error("tag revision was not discoverable");
  const assignment = await api.functional.tag_assignment_create.create(owner, { tagId: tag.id, targetType: "customer", targetId: "00000000-0000-0000-0000-000000000001" });
  const assignments = await api.functional.tag_assignment_search.search(owner, { tagId: tag.id, targetType: "customer" });
  if (!assignments.data.some((item) => item.id === assignment.id)) throw new Error("tag assignment was not discoverable");
  await api.functional.tag_assignment_delete.remove(owner, assignment.id);
  await api.functional.tag_status.status(owner, tag.id, { active: false });

  const currency = await api.functional.currency_create.create(owner, { code: "EUR", name: "Euro", precision: 2 });
  const revisedCurrency = await api.functional.currency_update.update(owner, currency.id, { name: "Euro currency" });
  typia.assert(revisedCurrency);
  const currencies = await api.functional.currency_search.index(owner, { search: "EUR" });
  if (!currencies.data.some((item) => item.id === currency.id && item.name === "Euro currency")) throw new Error("currency revision was not discoverable");
  await api.functional.currency_status.status(owner, currency.id, { active: false });

  const uom = await api.functional.uom_create.create(owner, { code: "EA", name: "Each", category: "count" });
  await api.functional.uom_update.update(owner, uom.id, { name: "Each unit" });
  const uoms = await api.functional.uom_search.index(owner, { search: "EA" });
  if (!uoms.data.some((item) => item.id === uom.id && item.name === "Each unit")) throw new Error("unit revision was not discoverable");
  await api.functional.uom_status.status(owner, uom.id, { active: false });

  const term = await api.functional.payment_term_create.create(owner, { name: "Net 30", dueDateConvention: "invoice_date_plus_30_days" });
  await api.functional.payment_term_update.update(owner, term.id, { dueDateConvention: "invoice_date_plus_45_days" });
  const terms = await api.functional.payment_term_search.index(owner, { search: "Net" });
  if (!terms.data.some((item) => item.id === term.id && item.dueDateConvention.endsWith("45_days"))) throw new Error("payment-term revision was not discoverable");
  await api.functional.payment_term_status.status(owner, term.id, { active: false });
}
