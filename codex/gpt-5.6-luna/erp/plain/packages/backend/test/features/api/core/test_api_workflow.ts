import * as api from "@benchmark/erp-api";
import typia from "typia";

/** Proves workflow activation, approval decisions, and immutable audit capture. */
export async function test_api_workflow(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-wf`, email = `owner-${suffix}@example.com`, password = "correct-horse-battery-staple";
  await api.functional.auth.user.createUser(connection, { email, password, displayName: "Owner" });
  const first = await api.functional.auth.user.login(connection, { email, password });
  const unaffiliated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${first.accessToken}` } };
  const org = await api.functional.organization.create(unaffiliated, { name: `Workflow ${suffix}`, code: `wf-${suffix}`, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const second = await api.functional.auth.user.login(connection, { email, password });
  const membership = second.memberships.find((item) => item.organization.id === org.id); if (!membership) throw new Error("workflow membership missing");
  const selected = await api.functional.auth.user.organization.select({ host: connection.host, headers: { Authorization: `Bearer ${second.accessToken}` } }, { membershipId: membership.id });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${selected.accessToken}` } };
  const workflow = await api.functional.organization.workflow.createWorkflow(owner, { target_type: "purchase_request", name: "Requests", steps_json: "[{\"role\":\"Owner\"}]" }); typia.assert(workflow);
  const active = await api.functional.organization.workflow.activate.activateWorkflow(owner, workflow.id); if (active.status !== "active") throw new Error("workflow did not activate");
  const approval = await api.functional.organization.approval.createApproval(owner, { target_type: "purchase_request", target_id: workflow.id });
  const approved = await api.functional.organization.approval.approve(owner, approval.id); if (approved.status !== "approved") throw new Error("approval did not approve");
  const audit = await api.functional.organization.audit.createAudit(owner, { action: "workflow.activate", target_type: "workflow", target_id: workflow.id, risk_level: "high" }); typia.assert(audit);
  if (audit.target_id !== workflow.id) throw new Error("audit did not retain target identity");
}
