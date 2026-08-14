import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button, Field } from "@/components/ui/primitives";
import { useAuthActions } from "@/lib/erp/hooks";
import { errorMessage } from "@/lib/utils";

export function LoginPage() {
  const actions = useAuthActions();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState("");
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/app";
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (email.trim() === "" || password.length < 8) { setValidation("Enter a valid email and a password with at least 8 characters."); return; }
    setValidation("");
    actions.login.mutate({ email, password }, { onSuccess: () => { void navigate(from, { replace: true }); } });
  };
  return <main className="auth-layout"><section className="auth-copy"><p className="eyebrow">Finance operations, in one place</p><h1>Make every business decision traceable.</h1><p>Ledgerline brings your organization, controls, inventory, people, and financial history into one calm operating view.</p><div className="auth-note"><span>01</span><p>Post with context. Review with confidence.</p></div><div className="auth-note"><span>02</span><p>Keep the history that makes tomorrow explainable.</p></div></section><section className="auth-card"><p className="eyebrow">Welcome back</p><h2>Sign in to your workspace</h2><p className="muted">Use an invitation-issued organization account to continue.</p><form onSubmit={(event) => { submit(event); }}><Field label="Work email"><input aria-label="Work email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></Field><Field label="Password"><input aria-label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" minLength={8} required /></Field>{validation || actions.login.error ? <p className="form-error" role="alert">{validation || errorMessage(actions.login.error)}</p> : null}<Button type="submit" disabled={actions.login.isPending}>{actions.login.isPending ? "Signing in..." : "Sign in"}</Button></form><p className="auth-switch">Have an invitation? <Link to="/invitation">Accept it here</Link></p></section></main>;
}
