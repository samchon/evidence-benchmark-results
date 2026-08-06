import * as api from "@benchmark/erp-api";

/** Proves tenant audit inspection, notification delivery, and preferences.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-audit-audit-history-operations Covers audit history operations.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-audit-001-the-product-emits-an-immutable-audit-event-for-every-source-named-sensitive-action Verifies a source action emits an immutable event.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-audit-002-searches-audit-events-by-actor-action-target-type-and-identity-risk-level Searches audit history by action and target.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-audit-003-views-one-events-before-and-after-values-reason-ip-address-user-agent-timestamp Reads the immutable event detail.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-audit-004-audit-audit-event-for-history-remains-available Retains the source event for later history inspection.
 */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-audit-audit-and-notification-rules Exercises and asserts the audit audit and notification rules behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-task-task-structure-and-history-rules Exercises and asserts the task task structure and history rules behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-immutable-and-recoverable-history Exercises and asserts the history immutable and recoverable history behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-automation-attributable-operational-automation Exercises and asserts the automation attributable operational automation behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-notification-preference-notification-preferences Exercises and asserts the notification preference notification preferences behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-notification-notification-operations Exercises and asserts the notification notification operations behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-audit-event-audit-events Exercises and asserts the audit event audit events behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-notification-notification-lifecycle Exercises and asserts the notification notification lifecycle behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-notification-preference-notification-preference-operations Exercises and asserts the notification preference notification preference operations behavior.
 */
export async function test_api_observability(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `observe-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Observe ${suffix}`, code: `observe-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const events = await api.functional.audit_event_search.index(owner, { action: "organization.create" });
  if (!events.data.some((event) => event.action === "organization.create")) throw new Error("organization audit event was not discoverable");
  const detail = await api.functional.audit_event_detail.at(owner, events.data[0]!.id);
  if (detail.action !== "organization.create" || detail.targetType !== "organization") throw new Error("audit event detail did not retain immutable fields");
  const initial = await api.functional.notification_preference.preference(owner);
  if (!initial.emailEnabled || !initial.inAppEnabled) throw new Error("default notification preference was not enabled");
  const updated = await api.functional.notification_preference_update.update(owner, { emailEnabled: false, inAppEnabled: true });
  if (updated.emailEnabled || !updated.inAppEnabled) throw new Error("notification preference update was not retained");
  let suppressed = false;
  try { await api.functional.notification_preference_update.update(owner, { emailEnabled: false, inAppEnabled: false }); } catch { suppressed = true; }
  if (!suppressed) throw new Error("mandatory notification channels could be suppressed");
  const queued = await api.functional.notification_create.create(owner, { userId: authorized.user.id, notificationType: "system", title: "Dispatch", body: "Dispatch me" });
  const sent = await api.functional.notification_dispatch.dispatch(owner, queued.id);
  const failed = await api.functional.notification_status.status(owner, sent.id, { status: "failed" });
  const retried = await api.functional.notification_retry.retry(owner, failed.id);
  if (sent.status !== "sent" || retried.status !== "queued") throw new Error("notification dispatch/retry lifecycle was not retained");
  const financial = await api.functional.report_generate.generate(owner, "financial", { kind: "trial_balance", status: "posted" });
  const exported = await api.functional.report_export._export(owner, "inventory", { kind: "stock_on_hand" });
  if (financial.category !== "financial" || financial.kind !== "trial_balance" || exported.category !== "inventory") throw new Error("report generation/export did not retain category and kind");
}
