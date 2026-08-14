import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button, Field } from "@/components/ui/primitives";
import { useAuthActions } from "@/lib/erp/hooks";
import { errorMessage } from "@/lib/utils";

export function InvitationPage() {
  const actions = useAuthActions();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [token, setToken] = useState(params.get("token") ?? "");
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    actions.acceptInvitation.mutate({ token, email, displayName, password }, { onSuccess: () => { void navigate("/select-organization", { replace: true }); } });
  };
  return <main className="auth-layout"><section className="auth-copy"><p className="eyebrow">Membership invitation</p><h1>Join the organization that invited you.</h1><p>An invitation creates or extends one organization membership; it never creates a public registration path.</p></section><section className="auth-card"><p className="eyebrow">Accept invitation</p><h2>Set up your access</h2><form onSubmit={submit}><Field label="Invitation token"><input aria-label="Invitation token" value={token} onChange={(event) => setToken(event.target.value)} required minLength={16} /></Field><Field label="Invitation email"><input aria-label="Invitation email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></Field><Field label="Display name"><input aria-label="Display name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} required /></Field><Field label="Password"><input aria-label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} /></Field>{actions.acceptInvitation.error ? <p className="form-error" role="alert">{errorMessage(actions.acceptInvitation.error)}</p> : null}<Button type="submit" disabled={actions.acceptInvitation.isPending}>{actions.acceptInvitation.isPending ? "Accepting invitation..." : "Accept invitation"}</Button></form><p className="auth-switch">Already have access? <Link to="/login">Sign in</Link></p></section></main>;
}
