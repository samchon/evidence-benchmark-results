import * as api from "@benchmark/erp-api";

/** Proves workflow activation/versioning, request decisions, delegation, escalation, and notification state.
 */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-approval-approval-workflow-rules Exercises and asserts the approval approval workflow rules behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-workflow-approval-workflow-administration Exercises and asserts the workflow approval workflow administration behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-approval-workflow-approval-workflow-lifecycle Exercises and asserts the approval workflow approval workflow lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-approval-request-approval-request-lifecycle Exercises and asserts the approval request approval request lifecycle behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-approval-approval-request-operations Exercises and asserts the approval approval request operations behavior.
 */
export async function test_api_approval(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `approval-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Approval ${suffix}`, code: `approval-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const workflow = await api.functional.approval_workflow_create.create(owner, { name: "Expense Approval", targetType: "expense", steps: "owner" });
  const active = await api.functional.approval_workflow_status.status(owner, workflow.id, { status: "active" });
  const version = await api.functional.approval_workflow_version.version(owner, workflow.id, { steps: "owner,finance" });
  if (version.status !== "draft" || version.steps !== "owner,finance") throw new Error("active approval workflow did not create a draft version");
  const request = await api.functional.approval_request_create.create(owner, { workflowId: workflow.id, targetType: "expense", targetId: "00000000-0000-0000-0000-000000000001" });
  const approved = await api.functional.approval_request_status.status(owner, request.id, { status: "approved" });
  const delegatedRequest = await api.functional.approval_request_create.create(owner, { workflowId: workflow.id, targetType: "expense", targetId: "00000000-0000-0000-0000-000000000002" });
  const delegated = await api.functional.approval_request_delegate.delegate(owner, delegatedRequest.id, { userId: authorized.user.id });
  const escalated = await api.functional.approval_request_escalate.escalate(owner, delegated.id);
  const notification = await api.functional.notification_create.create(owner, { userId: authorized.user.id, notificationType: "approval", title: "Approved", body: "Your expense was approved." });
  const read = await api.functional.notification_status.status(owner, notification.id, { status: "read" });
  if (active.status !== "active" || approved.status !== "approved" || delegated.delegatedUserId !== authorized.user.id || escalated.escalatedAt === null || read.status !== "read" || read.readAt === null) throw new Error("approval or notification lifecycle was not retained");
}
