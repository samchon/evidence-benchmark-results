/* Native controls are rendered by the design-system Button wrapper. */
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import type * as api from "@benchmark/shopping-api";
import { useAuth } from "@/lib/auth";
import { toErrorMessage } from "@/lib/utils";
import { Button, Card, Field, PageHeader, SelectField } from "@/components/ui";
import { useShoppingOperations } from "@/lib/shopping/hooks";

type Kind = "customer" | "seller";
type Mode = "login" | "register" | "recover";

function errorText(error: unknown): string | null {
  return error === null || error === undefined ? null : toErrorMessage(error);
}

export function AuthPage(props: { mode: Mode; initialKind?: Kind }) {
  const auth = useAuth();
  const operations = useShoppingOperations();
  const navigate = useNavigate();
  const location = useLocation();
  const [kind, setKind] = useState<Kind>(props.initialKind ?? "customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [recoveryToken, setRecoveryToken] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (email.trim() === "" || (props.mode !== "recover" && password.length < 8)) {
      setError("Enter a valid email and a password with at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      if (props.mode === "login") {
        await auth.signIn(kind, { email, password });
        void navigate("/app", { replace: true, state: { from: location.state } });
      } else if (props.mode === "register") {
        await auth.register(kind, { email, password });
        void navigate("/app", { replace: true });
      } else if (recoveryToken === "") {
        const result = kind === "customer"
          ? await operations.auth.customerRecoveryRequest({ email })
          : await operations.auth.sellerRecoveryRequest({ email });
        setMessage(`Challenge accepted. It expires ${new Date(result.expiresAt).toLocaleString()}. Paste the token to choose a new password.`);
      } else {
        if (newPassword.length < 8) throw new Error("Choose a new password with at least 8 characters.");
        if (kind === "customer") await operations.auth.customerRecoveryComplete({ token: recoveryToken, newPassword });
        else await operations.auth.sellerRecoveryComplete({ token: recoveryToken, newPassword });
        setMessage("Password updated. You can sign in now.");
      }
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  const title = props.mode === "login" ? "Welcome back" : props.mode === "register" ? "Create your account" : "Recover access";
  return <main className="auth-layout">
    <section className="auth-intro"><Link className="brand brand-light" to="/"><span className="brand-mark">B</span><span><strong>bench / shop</strong><small>commerce desk</small></span></Link><div><p className="eyebrow">A calmer commerce workspace</p><h1>Make every order legible.</h1><p>Search, purchase, fulfill, and resolve the full record from one clear working surface.</p></div><p className="auth-note">Every feature is protected by the account and permission rules in the shopping contract.</p></section>
    <section className="auth-panel"><PageHeader eyebrow="Account access" title={title} detail={props.mode === "recover" ? "Use the registered email challenge, then set a new password." : "Your account determines the workspace and controls available after sign-in."} />
      <form className="stack" onSubmit={(event) => void submit(event)}>
        <SelectField label="Account type" value={kind} onChange={(value) => setKind(value as Kind)} options={[{ label: "Customer", value: "customer" }, { label: "Seller", value: "seller" }]} />
        <Field label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
        {props.mode === "login" || props.mode === "register" ? <Field label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={props.mode === "login" ? "current-password" : "new-password"} minLength={8} required /> : null}
        {props.mode === "recover" && recoveryToken !== "" ? <Field label="New password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} minLength={8} required /> : null}
        {props.mode === "recover" && message !== null && recoveryToken === "" ? <Field label="Challenge token" value={recoveryToken} onChange={(event) => setRecoveryToken(event.target.value)} required /> : null}
        {error === null ? null : <p className="form-message error" role="alert">{error}</p>}
        {message === null ? null : <p className="form-message success" role="status">{message}</p>}
        <Button type="submit" disabled={busy}>{busy ? "Working..." : props.mode === "login" ? "Sign in" : props.mode === "register" ? "Create account" : recoveryToken === "" ? "Send challenge" : "Set new password"}</Button>
      </form>
      <div className="auth-links">{props.mode !== "login" ? <Link to="/login">Already have an account?</Link> : <Link to="/register/customer">Create a customer account</Link>}{props.mode !== "register" ? <Link to="/register/customer">Register</Link> : null}{props.mode !== "recover" ? <Link to="/recover">Forgot password?</Link> : null}</div>
    </section>
  </main>;
}
