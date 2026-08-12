import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import type { IUser } from "@benchmark/todo-api";

import { useAuthRequest } from "@/lib/auth-hooks";
import {
  formatError,
  useRecoveryConfirm,
  useRecoveryRequest,
  validationMessage,
} from "@/lib/api-hooks";

type Mode = "login" | "join" | "recover" | "confirm";

function modeFromParams(value: string | null): Mode {
  return value === "join" || value === "recover" || value === "confirm"
    ? value
    : "login";
}

function safeReturnTo(value: string | null): string {
  return value !== null && value.startsWith("/") && value.startsWith("//") === false
    ? value
    : "/app";
}

export function AuthPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = modeFromParams(params.get("mode"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [proof, setProof] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const auth = useAuthRequest();
  const request = useRecoveryRequest();
  const confirm = useRecoveryConfirm();
  const returnTo = safeReturnTo(params.get("returnTo"));

  const changeMode = (next: Mode) => {
    setFormError(null);
    setParams((current) => {
      current.set("mode", next);
      return current;
    });
  };

  const submitAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const body = mode === "join"
      ? { email: email.trim(), password, displayName: displayName.trim() }
      : { email: email.trim(), password };
    const message = validationMessage(body);
    if (message !== null) {
      setFormError(message);
      return;
    }
    try {
      if (mode === "join") await auth.join(body as IUser.IJoin);
      else await auth.login(body as IUser.ILogin);
      void navigate(returnTo, { replace: true });
    } catch (error) {
      setFormError(formatError(error));
    }
  };

  const submitRecoveryRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const body = { email: email.trim() } satisfies IUser.IRecoveryRequest;
    const message = validationMessage(body);
    if (message !== null) {
      setFormError(message);
      return;
    }
    try {
      await request.mutateAsync(body);
      toast.success("If that account exists, recovery instructions have been sent.");
      changeMode("confirm");
    } catch (error) {
      setFormError(formatError(error));
    }
  };

  const submitRecoveryConfirm = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const body = { email: email.trim(), proof, newPassword } satisfies IUser.IRecoveryConfirm;
    const message = validationMessage(body);
    if (message !== null) {
      setFormError(message);
      return;
    }
    try {
      await confirm.mutateAsync(body);
      toast.success("Password updated. Your private workspace is ready.");
      void navigate(returnTo, { replace: true });
    } catch (error) {
      setFormError(formatError(error));
    }
  };

  const isRecovery = mode === "recover" || mode === "confirm";
  return (
    <main className="auth-page">
      <section className="auth-intro">
        <div className="brand-mark large">
          <span>✓</span>
          <div><strong>daymark</strong><small>private workroom</small></div>
        </div>
        <div className="intro-copy">
          <p className="eyebrow">A calmer place to finish things</p>
          <h1>Your day, held lightly.</h1>
          <p>Keep the work that matters close. Daymark is a private todo workspace with a clear history and a safe way back from mistakes.</p>
        </div>
        <div className="intro-note"><span>✦</span><p>“The smallest useful next step is still progress.”</p></div>
      </section>
      <section className="auth-card">
        <div className="auth-card-head">
          <p className="eyebrow">Private workspace</p>
          <h2>{isRecovery ? mode === "confirm" ? "Set a new password" : "Recover your account" : mode === "join" ? "Create your workspace" : "Welcome back"}</h2>
          <p>{isRecovery ? "We never reveal whether an email is registered." : mode === "join" ? "Your todos belong only to you." : "Sign in to continue where you left off."}</p>
        </div>
        {!isRecovery && (
          <div className="segmented">
            <button type="button" className={mode === "login" ? "selected" : ""} onClick={() => changeMode("login")}>Sign in</button>
            <button type="button" className={mode === "join" ? "selected" : ""} onClick={() => changeMode("join")}>Create account</button>
          </div>
        )}
        {mode === "recover" && (
          <form onSubmit={(event) => void submitRecoveryRequest(event)} className="form-stack">
            <Field label="Email" value={email} onChange={setEmail} type="email" autoComplete="email" />
            {formError && <p className="inline-error" role="alert">{formError}</p>}
            <button type="submit" className="button primary" disabled={request.isPending}>{request.isPending ? "Sending…" : "Send recovery instructions"}</button>
            <button type="button" className="text-button" onClick={() => changeMode("login")}>Back to sign in</button>
          </form>
        )}
        {mode === "confirm" && (
          <form onSubmit={(event) => void submitRecoveryConfirm(event)} className="form-stack">
            <Field label="Email" value={email} onChange={setEmail} type="email" autoComplete="email" />
            <Field label="Recovery proof" value={proof} onChange={setProof} placeholder="Paste the one-time proof" />
            <Field label="New password" value={newPassword} onChange={setNewPassword} type="password" autoComplete="new-password" />
            {formError && <p className="inline-error" role="alert">{formError}</p>}
            <button type="submit" className="button primary" disabled={confirm.isPending}>{confirm.isPending ? "Updating…" : "Update password"}</button>
            <button type="button" className="text-button" onClick={() => changeMode("recover")}>Request another proof</button>
          </form>
        )}
        {!isRecovery && (
          <form onSubmit={(event) => void submitAuth(event)} className="form-stack">
            {mode === "join" && <Field label="Display name" value={displayName} onChange={setDisplayName} autoComplete="name" />}
            <Field label="Email" value={email} onChange={setEmail} type="email" autoComplete="email" />
            <Field label="Password" value={password} onChange={setPassword} type="password" autoComplete={mode === "join" ? "new-password" : "current-password"} />
            {(formError ?? auth.error) && <p className="inline-error" role="alert">{formError ?? auth.error}</p>}
            <button type="submit" className="button primary" disabled={auth.pending}>{auth.pending ? "Opening workspace…" : mode === "join" ? "Create private workspace" : "Sign in"}</button>
            {mode === "login" && <button type="button" className="text-button" onClick={() => changeMode("recover")}>Forgot your password?</button>}
          </form>
        )}
        <p className="auth-foot">By continuing, you agree to keep this workspace private. <Link to="/auth?mode=login">Need help?</Link></p>
      </section>
    </main>
  );
}

function Field(props: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; autoComplete?: string }) {
  const id = props.label.toLowerCase().replaceAll(" ", "-");
  const inputProps = { id, required: true, value: props.value, type: props.type ?? "text", placeholder: props.placeholder, autoComplete: props.autoComplete, onChange: (event: React.ChangeEvent<HTMLInputElement>) => props.onChange(event.target.value) };
  const control = props.label === "Email" ? <input aria-label="Email" {...inputProps} /> : props.label === "Password" ? <input aria-label="Password" {...inputProps} /> : props.label === "Display name" ? <input aria-label="Display name" {...inputProps} /> : props.label === "Recovery proof" ? <input aria-label="Recovery proof" {...inputProps} /> : <input aria-label="New password" {...inputProps} />;
  return (
    <label className="field" htmlFor={id}>
      <span id={`${id}-label`}>{props.label}</span>
      {control}
    </label>
  );
}
