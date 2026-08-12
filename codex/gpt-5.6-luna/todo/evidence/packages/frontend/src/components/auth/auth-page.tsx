import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useSession } from "../../lib/auth/session";
import {
  useJoin,
  useLogin,
  useRecoveryReset,
  useRecoveryStart,
} from "../../lib/auth/hooks";
import { errorMessage, firstInvalid } from "@/lib/utils";
import { InlineAlert } from "@/components/ui/primitives";

type AuthMode = "login" | "register" | "recover" | "reset";

/**
 * Public registration, login, and password-recovery screen.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Renders the account entry boundary.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Read the cited requirement and inspected AuthPage form, route, validation, and error-state behavior; ran the live account journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-1-register-a-private-account Renders private account registration.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-1-register-a-private-account Read the cited requirement and inspected AuthPage form, route, validation, and error-state behavior; ran the live account journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-2-log-in-with-email-and-password Renders credential login.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-2-log-in-with-email-and-password Read the cited requirement and inspected AuthPage form, route, validation, and error-state behavior; ran the live account journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Renders non-disclosing recovery entry.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Read the cited requirement and inspected AuthPage form, route, validation, and error-state behavior; ran the live account journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Renders public account entry and redirects authenticated users away from it; ProtectedLayout supplies private-route enforcement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Read the cited requirement and inspected AuthPage's authenticated redirect and ProtectedLayout's private-route guard; ran the live account journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Renders the public side of the public/private route boundary; ProtectedLayout supplies the private side.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Read the cited requirement and inspected AuthPage's authenticated redirect and ProtectedLayout's private-route guard; ran the live account journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Renders credential validation controls.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Read the cited requirement and inspected AuthPage form, route, validation, and error-state behavior; ran the live account journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Renders canonical email input.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Read the cited requirement and inspected AuthPage form, route, validation, and error-state behavior; ran the live account journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Renders bounded password inputs.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Read the cited requirement and inspected AuthPage form, route, validation, and error-state behavior; ran the live account journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-3-conceal-login-credential-failure Renders a single login error surface.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-3-conceal-login-credential-failure Read the cited requirement and inspected AuthPage form, route, validation, and error-state behavior; ran the live account journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Renders one-time recovery proof entry.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Read the cited requirement and inspected AuthPage form, route, validation, and error-state behavior; ran the live account journey.
 * @evidence {@link useJoin} Uses registration hook for the account entry form.
 * @evidenceReview {@link useJoin} Read the cited requirement and inspected AuthPage form, route, validation, and error-state behavior; ran the live account journey.
 * @evidence {@link useLogin} Uses login hook for the account entry form.
 * @evidenceReview {@link useLogin} Read the cited requirement and inspected AuthPage form, route, validation, and error-state behavior; ran the live account journey.
 * @evidence {@link useRecoveryStart} Uses recovery-start hook for non-disclosing recovery.
 * @evidenceReview {@link useRecoveryStart} Read the cited requirement and inspected AuthPage form, route, validation, and error-state behavior; ran the live account journey.
 * @evidence {@link useRecoveryReset} Uses recovery-reset hook for delivered proof consumption.
 * @evidenceReview {@link useRecoveryReset} Read the cited requirement and inspected AuthPage form, route, validation, and error-state behavior; ran the live account journey.
 */
export function AuthPage() {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const join = useJoin();
  const login = useLogin();
  const recoveryStart = useRecoveryStart();
  const recoveryReset = useRecoveryReset();

  if (session.status === "authenticated") return <Navigate replace to="/todos" />;

  const destination = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/todos";
  const submit = (event: FormEvent<HTMLFormElement>, action: () => void) => {
    event.preventDefault();
    const form = event.currentTarget;
    setError(null);
    setNotice(null);
    if (form.reportValidity() === false) {
      firstInvalid(form);
      return;
    }
    action();
  };
  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };
  const busy = join.isPending || login.isPending || recoveryStart.isPending || recoveryReset.isPending;
  return <main className="auth-layout"><section className="auth-intro"><div className="brand brand-large"><span className="brand-mark">bt</span><span>benchmark<span className="brand-muted">/todo</span></span></div><div className="intro-copy"><p className="eyebrow">A quieter way to finish</p><h1>Keep the next thing visible.</h1><p>One private workspace for small tasks, honest progress, and a reliable trail of what changed.</p></div><div className="intro-foot"><span className="status-dot" /> Private by default <span className="intro-divider" /> Built for focus</div></section><section className="auth-card" aria-labelledby="auth-title"><div className="auth-card-head"><p className="eyebrow">Welcome back</p><h2 id="auth-title">{mode === "register" ? "Create your workspace" : mode === "recover" ? "Find your way back" : mode === "reset" ? "Set a new password" : "Sign in to your workspace"}</h2><p className="muted">{mode === "register" ? "Start with a private account and your first profile." : mode === "recover" ? "We will not reveal whether an address is registered." : mode === "reset" ? "Use the one-time proof sent to your registered email." : "Your todos stay inside your account boundary."}</p></div>{error !== null && <InlineAlert tone="error">{error}</InlineAlert>}{notice !== null && <InlineAlert tone="success">{notice}</InlineAlert>}{(mode === "login" || mode === "register") && <form className="stack-form" onSubmit={(event) => submit(event, () => { const values = new FormData(event.currentTarget); if (mode === "register") { join.mutate({ email: String(values.get("email")), password: String(values.get("password")), displayName: String(values.get("displayName")) }, { onSuccess: () => { void navigate(destination, { replace: true }); }, onError: (reason) => setError(errorMessage(reason)) }); } else { login.mutate({ email: String(values.get("email")), password: String(values.get("password")) }, { onSuccess: () => { void navigate(destination, { replace: true }); }, onError: (reason) => setError(errorMessage(reason)) }); } })}>{mode === "register" && <label>Display name<input aria-label="Display name" name="displayName" required minLength={1} maxLength={100} autoComplete="name" placeholder="Your name" /></label>}<label>Email<input aria-label="Email" name="email" required type="email" autoComplete="email" placeholder="you@example.com" /></label><label>Password<input aria-label="Password" name="password" required minLength={8} maxLength={128} type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} placeholder="8 to 128 characters" /></label><button className="button button-primary button-wide" type="submit" disabled={busy}>{busy ? "Working" : mode === "register" ? "Create account" : "Sign in"}</button></form>}{mode === "recover" && <form className="stack-form" onSubmit={(event) => submit(event, () => { const values = new FormData(event.currentTarget); recoveryStart.mutate({ email: String(values.get("email")) }, { onSuccess: () => { setNotice("If that address is registered, a one-time proof has been sent."); setMode("reset"); }, onError: (reason) => setError(errorMessage(reason)) }); })}><label>Email<input aria-label="Email" name="email" required type="email" autoComplete="email" placeholder="you@example.com" /></label><button className="button button-primary button-wide" type="submit" disabled={busy}>{busy ? "Sending" : "Send recovery proof"}</button></form>}{mode === "reset" && <form className="stack-form" onSubmit={(event) => submit(event, () => { const values = new FormData(event.currentTarget); recoveryReset.mutate({ token: String(values.get("token")), newPassword: String(values.get("newPassword")) }, { onSuccess: () => { setNotice("Password replaced. Sign in with the new password."); setMode("login"); }, onError: (reason) => setError(errorMessage(reason)) }); })}><label>Recovery proof<input aria-label="Recovery proof" name="token" required minLength={1} autoComplete="one-time-code" placeholder="Paste the proof" /></label><label>New password<input aria-label="New password" name="newPassword" required minLength={8} maxLength={128} type="password" autoComplete="new-password" placeholder="8 to 128 characters" /></label><button className="button button-primary button-wide" type="submit" disabled={busy}>{busy ? "Replacing" : "Replace password"}</button></form>}<div className="auth-links">{mode === "login" && <><button type="button" className="text-button" onClick={() => switchMode("register")}>Create an account</button><button type="button" className="text-button" onClick={() => switchMode("recover")}>Forgot password?</button></>}{mode === "register" && <button type="button" className="text-button" onClick={() => switchMode("login")}>Already have an account? Sign in</button>}{mode === "recover" && <button type="button" className="text-button" onClick={() => switchMode("login")}>Back to sign in</button>}{mode === "reset" && <button type="button" className="text-button" onClick={() => switchMode("login")}>Back to sign in</button>}</div></section></main>;
}
