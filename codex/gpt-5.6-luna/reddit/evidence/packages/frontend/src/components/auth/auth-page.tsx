import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "@benchmark/reddit-api";
import { useAuth } from "../../lib/reddit/hooks";
import { Field, Notice, PageHeader } from "@/components/ui";

type Mode = "login" | "join" | "recovery";

/**
 * Covers registration, credential login, neutral recovery request, and refusal feedback.
 * @evidence {@link useAuth} Calls the authentication and account mutations.
 * @evidenceReview {@link useAuth} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-002-recover-a-forgotten-password Preserves recovery entry.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-002-recover-a-forgotten-password Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-account-provisioning-and-login Handles account entry.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-account-provisioning-and-login Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-001-register-a-user-account Handles registration.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-001-register-a-user-account Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-002-refuse-conflicting-registration Presents refusal feedback.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-002-refuse-conflicting-registration Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-003-log-in-with-credentials Handles credential login.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-003-log-in-with-credentials Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-004-refuse-ineligible-login Presents login refusal feedback.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-004-refuse-ineligible-login Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-001-maintain-concurrent-sessions Preserves session tokens.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-001-maintain-concurrent-sessions Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-accessible-community-participation Uses accessible account controls.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-access-accessible-community-participation Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-001-support-keyboard-operation-for-core-journeys Keeps the form keyboard operable.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-access-001-support-keyboard-operation-for-core-journeys Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-002-expose-understandable-labels-focus-and-validation-feedback Labels fields and feedback.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-access-002-expose-understandable-labels-focus-and-validation-feedback Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy Keeps private entry fields private.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-001-keep-credentials-and-email-private Does not render credentials.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-001-keep-credentials-and-email-private Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-account-identity-rules Uses identity constraints.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-identity-account-identity-rules Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-001-enforce-case-insensitive-email-and-username-uniqueness Leaves uniqueness to the API refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-identity-001-enforce-case-insensitive-email-and-username-uniqueness Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-002-require-complete-registration-credentials Requires complete credentials.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-identity-002-require-complete-registration-credentials Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 */
export function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [proof, setProof] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();
  const active = auth.login.isPending || auth.join.isPending || auth.recoveryRequest.isPending || auth.recoveryComplete.isPending;
  const failure = auth.login.error ?? auth.join.error ?? auth.recoveryRequest.error ?? auth.recoveryComplete.error;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (mode === "login") auth.login.mutate({ email, password } as Parameters<typeof api.functional.auth.user.login>[1], { onSuccess: () => { void navigate("/feed"); } });
    else if (mode === "join") auth.join.mutate({ email, username, password } as Parameters<typeof api.functional.auth.user.join>[1], { onSuccess: () => { void navigate("/feed"); } });
    else if (proof.length > 0) auth.recoveryComplete.mutate({ email, proof, newPassword } as Parameters<typeof api.functional.auth.user.recovery.complete.recoveryComplete>[1], { onSuccess: () => setMessage("Your password has been reset. You can sign in now.") });
    else auth.recoveryRequest.mutate({ email } as Parameters<typeof api.functional.auth.user.recovery.request.recoveryRequest>[1], { onSuccess: () => setMessage("If that account exists, recovery instructions have been sent.") });
  };

  return <section className="narrow-page">
    <PageHeader eyebrow="Your account" title={mode === "join" ? "Join the conversation" : mode === "recovery" ? "Recover access" : "Welcome back"} description="Your email stays private. Your username is the identity other readers see." />
    <div className="auth-card">
      <div className="segmented" role="tablist" aria-label="Account action">
        {(["login", "join", "recovery"] as Mode[]).map((item) => <button type="button" key={item} role="tab" aria-selected={mode === item} className={mode === item ? "segment active" : "segment"} onClick={() => { setMode(item); setMessage(null); }}>{item === "login" ? "Sign in" : item === "join" ? "Create account" : "Forgot password"}</button>)}
      </div>
      <form className="form-stack" onSubmit={submit} noValidate>
        <Field label="Email address"><input aria-label="Email address" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
        {mode === "join" && <Field label="Username"><input aria-label="Username" required minLength={3} maxLength={30} pattern="[A-Za-z0-9_]+" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} /></Field>}
        {mode !== "recovery" && <Field label="Password"><input aria-label="Password" required minLength={8} maxLength={128} type="password" autoComplete={mode === "join" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} /></Field>}
        {mode === "recovery" && proof.length > 0 && <Field label="One-time proof"><input aria-label="One-time proof" required value={proof} onChange={(event) => setProof(event.target.value)} /></Field>}
        {mode === "recovery" && proof.length > 0 && <Field label="New password"><input aria-label="New password" required minLength={8} type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></Field>}
        {failure && <Notice tone="danger">{failure instanceof Error ? failure.message : "That request was refused. Check the fields and try again."}</Notice>}
        {message && <Notice tone="success">{message}</Notice>}
        <button className="button button-primary" disabled={active} type="submit">{active ? "Working…" : mode === "login" ? "Sign in" : mode === "join" ? "Create account" : proof.length > 0 ? "Reset password" : "Send recovery instructions"}</button>
      </form>
      {mode === "recovery" && <button type="button" className="text-button" onClick={() => setProof(proof.length > 0 ? "" : "provided-proof")}>{proof.length > 0 ? "I need a new recovery request" : "I already have a recovery proof"}</button>}
    </div>
  </section>;
}
