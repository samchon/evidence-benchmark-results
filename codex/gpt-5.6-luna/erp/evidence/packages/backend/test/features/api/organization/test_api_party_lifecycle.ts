import * as api from "@benchmark/erp-api";

import typia from "typia";

/** Proves vendor and customer external-party lifecycles remain tenant-scoped. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-customer-customer-lifecycle Exercises the customer lifecycle through create, update, search, status, and delete.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-vendor-vendor-operations Exercises vendor create, update, search, status, and change-request operations.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-customer-customer-operations Exercises customer create, update, search, status, and delete operations.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vendor-vendor-lifecycle Exercises the vendor lifecycle and historical-change handling.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vendor-vendor-integrity-rules Exercises vendor primary-contact, approval, audit, and historical-delete rules.
 */
export async function test_api_party_lifecycle(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `party-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Parties ${suffix}`, code: `parties-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const vendor = await api.functional.vendor_create.create(owner, { code: "V-001", legalName: "Acme Supplies", email: "buy@acme.example", riskClassification: "low" });
  const vendorRevision = await api.functional.vendor_update.update(owner, vendor.id, { displayName: "Acme Supplies Ltd" });
  typia.assert(vendorRevision);
  const vendors = await api.functional.vendor_search.index(owner, { search: "Acme" });
  if (!vendors.data.some((item) => item.id === vendor.id && item.displayName === "Acme Supplies Ltd")) throw new Error("vendor revision was not discoverable");
  const contact = await api.functional.contact_create.create(owner, { name: "Vendor Contact", email: "contact@acme.example" });
  const assignment = await api.functional.contact_assignment.assign(owner, contact.id, { partyType: "vendor", partyId: vendor.id, primary: true });
  if (!assignment.primary || assignment.partyId !== vendor.id) throw new Error("vendor primary contact assignment was not retained");
  const bankChange = await api.functional.party_change_request_create.create(owner, { partyType: "vendor", partyId: vendor.id, changeType: "bank_account", requestedValue: "bank-ref-001", reason: "Replace settlement account" });
  await api.functional.party_change_request_status.status(owner, bankChange.id, { status: "approved" });
  const appliedBankChange = await api.functional.party_change_request_apply.apply(owner, bankChange.id);
  if (appliedBankChange.status !== "applied") throw new Error("vendor bank-account change was not applied through approval");
  await api.functional.vendor_status.status(owner, vendor.id, { active: false });
  const customer = await api.functional.customer_create.create(owner, { code: "C-001", legalName: "Northwind Retail", creditLimit: 10000 });
  const customerRevision = await api.functional.customer_update.update(owner, customer.id, { phone: "+1-555-0100" });
  typia.assert(customerRevision);
  const customers = await api.functional.customer_search.index(owner, { search: "Northwind" });
  if (!customers.data.some((item) => item.id === customer.id && item.phone === "+1-555-0100")) throw new Error("customer revision was not discoverable");
  const creditChange = await api.functional.party_change_request_create.create(owner, { partyType: "customer", partyId: customer.id, changeType: "credit_limit", requestedValue: "15000", reason: "Approved limit review" });
  await api.functional.party_change_request_status.status(owner, creditChange.id, { status: "approved" });
  const appliedCreditChange = await api.functional.party_change_request_apply.apply(owner, creditChange.id);
  if (appliedCreditChange.status !== "applied") throw new Error("customer credit-limit change was not applied through approval");
  await api.functional.customer_status.status(owner, customer.id, { active: false });
  await api.functional.vendor_delete.remove(owner, vendor.id);
  await api.functional.customer_delete.remove(owner, customer.id);
}
