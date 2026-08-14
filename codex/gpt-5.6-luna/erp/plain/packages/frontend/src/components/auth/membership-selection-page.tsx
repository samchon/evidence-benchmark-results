import { Button, EmptyState, ErrorState, Field } from "@/components/ui/primitives";
import { useAuthActions } from "@/lib/erp/hooks";
import { useSession } from "@/lib/session-hooks";
import { errorMessage } from "@/lib/utils";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export function MembershipSelectionPage() {
  const { auth } = useSession();
  const actions = useAuthActions();
  const navigate = useNavigate();
  const active = auth?.memberships.filter((membership) => membership.status === "active") ?? [];
  const [membershipId, setMembershipId] = useState(active[0]?.id ?? "");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (membershipId !== "") actions.selectMembership.mutate(membershipId, { onSuccess: () => { void navigate("/app", { replace: true }); } });
  };
  if (active.length === 0) return <main className="auth-layout"><section className="auth-card"><p className="eyebrow">Access required</p><h1>No active organization</h1><EmptyState title="Membership selection unavailable" message="An Owner must invite you or reactivate your organization membership before you can enter the ERP." /></section></main>;
  return <main className="auth-layout"><section className="auth-copy"><p className="eyebrow">Choose your operating context</p><h1>One identity, one active workspace at a time.</h1><p>Your organization selection scopes every query, command, report, approval, and audit event in this session.</p></section><section className="auth-card"><p className="eyebrow">Organization context</p><h2>Select a workspace</h2><form onSubmit={submit}><Field label="Active organization"><select aria-label="Active organization" value={membershipId} onChange={(event) => setMembershipId(event.target.value)}>{active.map((membership) => <option key={membership.id} value={membership.id}>{membership.organizationId} · {membership.roles.join(", ")}</option>)}</select></Field>{actions.selectMembership.error ? <ErrorState message={errorMessage(actions.selectMembership.error)} /> : null}<Button type="submit" disabled={actions.selectMembership.isPending || membershipId === ""}>{actions.selectMembership.isPending ? "Opening workspace..." : "Continue to workspace"}</Button></form></section></main>;
}
