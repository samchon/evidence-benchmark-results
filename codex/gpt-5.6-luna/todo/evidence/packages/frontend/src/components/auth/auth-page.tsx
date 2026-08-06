import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import typia from "typia";
import * as api from "@benchmark/todo-api";

import { useAuthJoin, useAuthLogin, useAuthRecover } from "../../lib/auth/hooks";
import { diagnoses, firstDiagnosis } from "@/lib/utils";
import { Button, DiagnosisList, Field, Notice, Panel } from "@/components/ui/ui";

/**
 * Public account entry with registration, login, and non-disclosing recovery.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Delivers public account entry.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-1-register-a-private-account Delivers account registration.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-2-log-in-with-email-and-password Delivers returning-user login.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Starts the account boundary.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Creates the private profile entry.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-2-bind-one-private-profile-to-each-account Binds registration to one profile.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Presents credential boundaries.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Preserves canonical email input.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Validates accepted password length.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-3-conceal-login-credential-failure Renders generic login refusal.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Presents display-name input.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Reports display-name refusal.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Links forgotten-password recovery.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Delivers the recovery form.
 * @evidence {@link useAuthJoin} Calls registration hook.
 * @evidence {@link useAuthLogin} Calls login hook.
 * @evidence {@link useAuthRecover} Calls recovery hook.
 */
export function AuthPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [mode, setMode] = useState<"login" | "join" | "recover">((params.get("mode") as "login" | "join" | "recover" | null) ?? "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<api.IDiagnosis[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const join = useAuthJoin();
  const login = useAuthLogin();
  const recover = useAuthRecover();

  const selectMode = (next: "login" | "join" | "recover") => {
    setMode(next);
    setParams((current) => {
      current.set("mode", next);
      return current;
    });
    setErrors([]);
    setSuccess(null);
  };

  const normalizedEmail = email.trim().toLowerCase();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);
    setSuccess(null);
    if (mode === "join") {
      const body = { email: normalizedEmail, password, displayName } satisfies api.IAuth.IJoin;
      const result = typia.validate<api.IAuth.IJoin>(body);
      if (!result.success) {
        setErrors(result.errors.map((item) => ({ accessor: item.path.replace(/^\$input(?:\.|$)/, ""), message: item.expected })));
        return;
      }
      void join.mutate(body, { onSuccess: () => { void navigate("/app"); }, onError: (error) => setErrors(diagnoses(error)) });
      return;
    }
    if (mode === "login") {
      const body = { email: normalizedEmail, password } satisfies api.IAuth.ILogin;
      const result = typia.validate<api.IAuth.ILogin>(body);
      if (!result.success) {
        setErrors(result.errors.map((item) => ({ accessor: item.path.replace(/^\$input(?:\.|$)/, ""), message: item.expected })));
        return;
      }
      void login.mutate(body, { onSuccess: () => { void navigate("/app"); }, onError: () => setErrors([{ accessor: "", message: "Unable to sign in with those credentials." }]) });
      return;
    }
    const body = { email: normalizedEmail, newPassword } satisfies api.IAuth.IRecover;
    const result = typia.validate<api.IAuth.IRecover>(body);
    if (!result.success) {
      setErrors(result.errors.map((item) => ({ accessor: item.path.replace(/^\$input(?:\.|$)/, ""), message: item.expected })));
      return;
    }
    recover.mutate(body, { onSuccess: () => setSuccess("If that email belongs to an account, its password has been replaced. You can sign in with the new password."), onError: (error) => setErrors(diagnoses(error)) });
  };

  const pending = join.isPending || login.isPending || recover.isPending;
  return (
    <main className="auth-layout">
      <section className="auth-intro">
        <p className="eyebrow">Private task workspace</p>
        <h1>Make room for the work that matters.</h1>
        <p className="lede">A calm, account-scoped Todo desk for planning, editing, and recovering tasks without exposing another person's work.</p>
        <div className="intro-rule" />
        <p className="muted">Your email is used only for your private account identity.</p>
      </section>
      <Panel title={mode === "join" ? "Create your account" : mode === "recover" ? "Recover access" : "Welcome back"} eyebrow="Account entry" className="auth-card">
        <div className="mode-tabs" role="tablist" aria-label="Account entry mode">
          <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "tab active" : "tab"} onClick={() => selectMode("login")}>Sign in</button>
          <button type="button" role="tab" aria-selected={mode === "join"} className={mode === "join" ? "tab active" : "tab"} onClick={() => selectMode("join")}>Register</button>
          <button type="button" role="tab" aria-selected={mode === "recover"} className={mode === "recover" ? "tab active" : "tab"} onClick={() => selectMode("recover")}>Recover</button>
        </div>
        {success === null ? null : <Notice tone="success">{success}</Notice>}
        <DiagnosisList items={errors} />
        <form className="stack-form" onSubmit={submit} noValidate>
          <Field label="Email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} error={firstDiagnosis(errors, "email")} required />
          {mode === "join" ? <Field label="Display name" name="displayName" autoComplete="name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} error={firstDiagnosis(errors, "displayName")} required /> : null}
          {mode === "recover" ? <Field label="New password" name="newPassword" type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} error={firstDiagnosis(errors, "newPassword")} required /> : <Field label="Password" name="password" type="password" autoComplete={mode === "join" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} error={firstDiagnosis(errors, "password")} required />}
          <Button type="submit" disabled={pending}>{pending ? "Working" : mode === "join" ? "Create account" : mode === "recover" ? "Replace password" : "Sign in"}</Button>
        </form>
        <p className="form-footnote">By continuing, you keep your tasks inside one authenticated account boundary.</p>
        <Link className="quiet-link" to="/">Return to overview</Link>
      </Panel>
    </main>
  );
}
