import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import type { ActorKind, StoredSession } from "@/lib/client";
import { saveSession } from "@/lib/client";
import { diagnosis } from "@/lib/utils";
import { useShoppingOperations } from "../../lib/shopping/hooks";

type AuthMode = "sign-in" | "join" | "recover";

/**
 * Customer and seller identity entry, registration, and seller recovery.
 * @evidence {@link useShoppingOperations} Calls the generated authentication operations through the shared hook.
 * @evidenceReview {@link useShoppingOperations} Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-customer-identity-and-credential-lifecycle Renders customer registration and sign-in entry, plus the available recovery state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-customer-identity-and-credential-lifecycle Read the customer mode, registration, sign-in, and recovery branches; confirmed the page exposes the implemented customer identity entry and reports unsupported recovery rather than claiming a mutation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-seller-identity-seller-identity-and-credential-lifecycle Renders seller registration, sign-in, and recovery controls.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-seller-identity-seller-identity-and-credential-lifecycle Read the seller mode and recovery forms; confirmed the page exposes seller identity entry and recovery operations.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-identity-and-permission-boundaries Renders actor selection and protected-session entry.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-identity-and-permission-boundaries Read this page and the cited requirement; confirmed the page renders the cited state or control through its shared operations hook.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies Renders credential validation, registration, sign-in, and recovery feedback.
 * @evidenceReview docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies Read the form validation and mutation error/success branches; confirmed the page preserves API feedback and does not invent unsupported customer recovery.
 */
export function AuthPage(props: { onSession: (session: StoredSession) => void }) {
  const operations = useShoppingOperations();
  const navigate = useNavigate();
  const [actor, setActor] = useState<ActorKind>("customer");
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [challenge, setChallenge] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [recoveryRequested, setRecoveryRequested] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "recover") {
        if (actor !== "seller") {
          setMessage("Customer recovery is handled by the account support boundary.");
        } else if (challenge.length === 0) {
          await operations.AuthSellerRecoverRequestSellerRecover({ email });
          setRecoveryRequested(true);
          setMessage("A recovery challenge was requested. Enter the delivered challenge to continue.");
        } else {
          await operations.AuthSellerRecoverCompleteSellerRecoverComplete({ challenge, newPassword });
          setMessage("Recovery completed. You can sign in with the new password.");
          setMode("sign-in");
        }
        return;
      }
      const input = { email, password };
      let session: StoredSession;
      if (actor === "customer") {
        const authorized = mode === "join" ? await operations.AuthCustomerJoinCustomerJoin(input) : await operations.AuthCustomerLoginCustomerLogin(input);
        session = { actor, accessToken: authorized.accessToken, refreshToken: authorized.refreshToken, identity: authorized.customer };
      } else {
        const authorized = mode === "join" ? await operations.AuthSellerJoinSellerJoin(input) : await operations.AuthSellerLoginSellerLogin(input);
        session = { actor, accessToken: authorized.accessToken, refreshToken: authorized.refreshToken, identity: authorized.seller };
      }
      saveSession(session);
      props.onSession(session);
      void navigate(actor === "customer" ? "/customer" : "/seller", { replace: true });
    } catch (reason) {
      setError(diagnosis(reason));
    } finally {
      setBusy(false);
    }
  };

  return <section className="auth-page page-stack">
    <div className="section-heading narrow-heading"><p className="eyebrow">A clear way in</p><h1>{mode === "join" ? "Start your account" : mode === "recover" ? "Recover seller access" : "Welcome back"}</h1><p>Choose the identity boundary that owns your session. Each account type keeps its duties separate.</p></div>
    <div className="auth-layout">
      <form className="card form-card auth-card" onSubmit={(event) => { void submit(event); }}>
        <div className="segmented-control" role="group" aria-label="Account type"><button className={actor === "customer" ? "active" : ""} type="button" onClick={() => setActor("customer")}>Customer</button><button className={actor === "seller" ? "active" : ""} type="button" onClick={() => setActor("seller")}>Seller</button></div>
        {mode !== "recover" && <label>Email<input aria-label="Email address" autoComplete="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>}
        {mode !== "recover" && <label>Password<input aria-label="Password" autoComplete={mode === "join" ? "new-password" : "current-password"} minLength={mode === "join" ? 8 : undefined} required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>}
        {mode === "recover" && <label>Email<input aria-label="Recovery email address" autoComplete="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>}
        {mode === "recover" && recoveryRequested && <><label>Challenge<input aria-label="Recovery challenge" required value={challenge} onChange={(event) => setChallenge(event.target.value)} /></label><label>New password<input aria-label="New password" minLength={8} required type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label></>}
        {error && <p className="error-panel" role="alert">{error}</p>}
        {message && <p className="success-message" role="status">{message}</p>}
        <button className="button button-dark full-width" disabled={busy} type="submit">{busy ? "Working…" : mode === "join" ? "Create account" : mode === "recover" ? recoveryRequested ? "Complete recovery" : "Request recovery" : "Sign in"}</button>
        <div className="button-row auth-links"><button className="text-button" type="button" onClick={() => { setMode(mode === "join" ? "sign-in" : "join"); setRecoveryRequested(false); setMessage(null); setError(null); }}>{mode === "join" ? "Already have an account? Sign in" : "Need an account? Join"}</button>{actor === "seller" && <button className="text-button" type="button" onClick={() => { setMode("recover"); setRecoveryRequested(false); setMessage(null); setError(null); }}>Recover seller access</button>}</div>
      </form>
      <aside className="card editorial-card"><span className="card-kicker">Session promise</span><h2>Identity stays legible.</h2><p>Customers own addresses, carts, orders, and saved products. Sellers own their catalog and fulfillment duties. Administration appears only when the signed-in identity has the required grade.</p></aside>
    </div>
  </section>;
}
