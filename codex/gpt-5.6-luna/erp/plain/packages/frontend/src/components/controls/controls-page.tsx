import { useState } from "react";
import { Button, EmptyState, ErrorState, Field, LoadingState, PageHeader, Panel } from "@/components/ui/primitives";
import { useApprovalActions, useApprovalHistory, useApprovals, useAudit } from "@/lib/erp/hooks";
import { formatDate } from "@/lib/utils";

export function ControlsPage() {
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [delegateTo, setDelegateTo] = useState("");
  const audit = useAudit(1);
  const approvals = useApprovals(1);
  const history = useApprovalHistory(historyId);
  const actions = useApprovalActions();
  const actionError = actions.resolve.error ?? actions.delegate.error ?? actions.escalate.error;
  return <div className="page">
    <PageHeader eyebrow="Controls / approvals" title="Controls and approvals" description="Make authority, risk, and immutable activity visible before a decision becomes a surprise." />
    <div className="content-grid">
      <Panel title="Approval inbox" eyebrow="Assigned decisions">
        {actionError ? <p className="form-error" role="alert">{actionError.message}</p> : actions.resolve.isSuccess || actions.delegate.isSuccess || actions.escalate.isSuccess ? <p className="form-hint" role="status">Approval activity was recorded and the inbox refreshed.</p> : null}
        {approvals.isPending ? <LoadingState /> : approvals.error ? <ErrorState message={approvals.error.message} retry={() => { void approvals.refetch(); }} /> : approvals.data?.data.length === 0 ? <EmptyState title="No approval requests" message="Requests assigned to this organization will appear here." /> : <div className="activity-list">{approvals.data?.data.map((approval) => <div className="activity-row" key={approval.id}>
          <div><strong>{approval.targetType}</strong><small>{approval.status} · step {approval.currentStep}</small>{approval.status === "pending" ? <Field label="Delegate to membership ID"><input aria-label="Delegate approval membership ID" value={delegateTo} onChange={(event) => setDelegateTo(event.target.value)} placeholder="Optional membership ID" /></Field> : null}</div>
          <div className="button-row">{approval.status === "pending" ? <>
            <Button aria-label={`Approve ${approval.targetType}`} disabled={actions.resolve.isPending} onPress={() => { setHistoryId(approval.id); actions.resolve.mutate({ id: approval.id, action: "approved" }); }}>Approve</Button>
            <Button aria-label={`Request changes for ${approval.targetType}`} tone="quiet" disabled={actions.resolve.isPending} onPress={() => { setHistoryId(approval.id); actions.resolve.mutate({ id: approval.id, action: "changes", reason: "Changes requested from controls" }); }}>Request changes</Button>
            <Button aria-label={`Reject ${approval.targetType}`} tone="danger" disabled={actions.resolve.isPending} onPress={() => { setHistoryId(approval.id); actions.resolve.mutate({ id: approval.id, action: "rejected", reason: "Rejected from controls" }); }}>Reject</Button>
            <Button aria-label={`Delegate ${approval.targetType}`} tone="quiet" disabled={actions.delegate.isPending || delegateTo.trim().length === 0} onPress={() => { actions.delegate.mutate({ id: approval.id, delegateTo: delegateTo.trim() }); }}>Delegate</Button>
            <Button aria-label={`Escalate ${approval.targetType}`} tone="quiet" disabled={actions.escalate.isPending} onPress={() => { actions.escalate.mutate(approval.id); }}>Escalate</Button>
          </> : null}<Button aria-label={`View history for ${approval.targetType}`} tone="quiet" onPress={() => { setHistoryId(approval.id); }}>View history</Button></div>
        </div>)}</div>}
        {historyId !== null ? <Panel title="Approval history" eyebrow="Immutable decision record">{history.isPending ? <LoadingState /> : history.error ? <ErrorState message={history.error.message} retry={() => { void history.refetch(); }} /> : history.data?.length === 0 ? <EmptyState title="No history recorded" message="This approval has not recorded a decision yet." /> : <div className="activity-list">{history.data?.map((entry) => <div className="activity-row" key={entry.id}><div><strong>{entry.action}</strong><small>{entry.reason ?? "No reason provided"} · {formatDate(entry.createdAt)}</small></div><span className="mono">{entry.actorMembershipId.slice(0, 8)}</span></div>)}</div>}</Panel> : null}
      </Panel>
      <Panel title="Audit trail" eyebrow="Immutable organization record">{audit.isPending ? <LoadingState /> : audit.error ? <ErrorState message={audit.error.message} retry={() => { void audit.refetch(); }} /> : audit.data?.data.length === 0 ? <EmptyState title="No audit events" message="Sensitive activity will be recorded here." /> : <div className="activity-list">{audit.data?.data.map((event) => <div className="activity-row" key={event.id}><span className={`risk risk-${event.risk}`}>{event.risk}</span><div><strong>{event.action}</strong><small>{event.targetType} · {formatDate(event.createdAt)}</small></div><span className="mono">{event.actorId.slice(0, 8)}</span></div>)}</div>}<Button aria-label="Refresh audit trail" tone="quiet" onPress={() => { void audit.refetch(); }}>Refresh audit trail</Button></Panel>
      <Panel title="Control posture" eyebrow="Owner review"><p className="panel-copy">Posted history is retained, organization scope is explicit, and approval actions retain their reason and actor history.</p></Panel>
    </div>
  </div>;
}
