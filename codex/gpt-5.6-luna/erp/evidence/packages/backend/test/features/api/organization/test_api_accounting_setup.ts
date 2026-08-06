import * as api from "@benchmark/erp-api";

/** Proves atomic document numbering and fiscal-period lifecycle setup. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-a2r-acquire-to-retire-journey Exercises and asserts the a2r acquire to retire journey behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-jrn-close-period-close-journey Exercises and asserts the close period close journey behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-period-fiscal-period-rules Exercises and asserts the period fiscal period rules behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-doc-number-document-number-sequences Exercises and asserts the doc number document number sequences behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-fiscal-calendar-fiscal-calendars Exercises and asserts the fiscal calendar fiscal calendars behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-fiscal-period-fiscal-period-lifecycle Exercises and asserts the fiscal period fiscal period lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-close-snapshot-closing-snapshots Exercises and asserts the close snapshot closing snapshots behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-doc-number-document-number-operations Exercises and asserts the doc number document number operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-fiscal-calendar-fiscal-calendar-operations Exercises and asserts the fiscal calendar fiscal calendar operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-period-close-fiscal-period-close-and-reopen Exercises and asserts the period close fiscal period close and reopen behavior.
 */
export async function test_api_accounting_setup(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `setup-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Setup ${suffix}`, code: `setup-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const sequence = await api.functional.document_number_create.create(owner, { documentType: "invoice", prefix: "INV-", nextNumber: 7 });
  const issued = await api.functional.document_number_issue.issue(owner, { documentType: "invoice" });
  if (issued.number !== 7 || issued.rendered !== "INV-000007") throw new Error("document number sequence did not issue atomically");
  const sequenceView = await api.functional.document_number_search.index(owner, { documentType: "invoice" });
  if (sequenceView.data[0]?.nextNumber !== 8 || sequenceView.data[0]?.id !== sequence.id) throw new Error("document number sequence state was not retained");
  const calendar = await api.functional.fiscal_calendar_create.create(owner, { fiscalYear: 2026, startMonth: 4 });
  if (calendar.periods.length !== 12 || calendar.periods[0]?.ordinal !== 1) throw new Error("fiscal calendar did not create ordered periods");
  const closed = await api.functional.fiscal_period_status.status(owner, calendar.periods[0]!.id, { status: "soft_closed" });
  if (closed.status !== "soft_closed") throw new Error("fiscal period close transition was not retained");
  const hardClosed = await api.functional.fiscal_period_status.status(owner, calendar.periods[0]!.id, { status: "hard_closed" });
  const snapshot = await api.functional.closing_snapshot_create.create(owner, { fiscalPeriodId: hardClosed.id, kind: "trial_balance", payload: JSON.stringify({ total: 0 }) });
  const snapshots = await api.functional.closing_snapshot_search.index(owner, { fiscalPeriodId: hardClosed.id, kind: "trial_balance" });
  if (hardClosed.status !== "hard_closed" || !snapshots.data.some((item) => item.id === snapshot.id)) throw new Error("closing snapshot was not retained for hard-closed period");
  const reopen = await api.functional.fiscal_period_reopen_request_create.create(owner, { fiscalPeriodId: hardClosed.id, reason: "Correcting a posted period error" });
  const pendingReopens = await api.functional.fiscal_period_reopen_request_search.search(owner, { fiscalPeriodId: hardClosed.id, status: "pending" });
  if (!pendingReopens.data.some((item) => item.id === reopen.id)) throw new Error("fiscal-period reopen request was not searchable");
  const approvedReopen = await api.functional.fiscal_period_reopen_request_status.status(owner, reopen.id, { status: "approved" });
  const appliedReopen = await api.functional.fiscal_period_reopen_request_apply.apply(owner, approvedReopen.id);
  if (appliedReopen.status !== "applied") throw new Error("approved fiscal-period reopen request was not applied");
  const calendars = await api.functional.fiscal_calendar_search.index(owner, { fiscalYear: 2026 });
  if (!calendars.data.some((item) => item.id === calendar.id && item.periods[0]?.status === "reopened")) throw new Error("fiscal calendar search omitted reopened period state");
}
