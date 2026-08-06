import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth/hooks";

export function RecoveryPage() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const request = (event: FormEvent) => {
    event.preventDefault();
    auth.requestRecovery.mutate({ email }, {
      onSuccess: () => setMessage("If the address is eligible, recovery instructions have been sent."),
    });
  };
  const complete = (event: FormEvent) => {
    event.preventDefault();
    auth.completeRecovery.mutate({ token, newPassword: password }, {
      onSuccess: () => setMessage("Password reset. You can sign in with the new credential."),
      onError: () => setMessage("That recovery proof is invalid or expired."),
    });
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Account recovery</p>
        <h1>Restore access</h1>
        <p className="lede">Request a short-lived proof, then complete the reset without selecting an organization.</p>
        <form aria-label="Request recovery proof" onSubmit={request}>
          <label htmlFor="recovery-email">Email address</label>
          <input aria-label="Email address" id="recovery-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          <button aria-label="Send recovery proof" className="button primary button-wide" type="submit">Send recovery proof</button>
        </form>
        <form aria-label="Complete account recovery" onSubmit={complete}>
          <label htmlFor="recovery-token">Recovery proof</label>
          <input aria-label="Recovery proof" id="recovery-token" required value={token} onChange={(event) => setToken(event.target.value)} />
          <label htmlFor="recovery-password">New password</label>
          <input aria-label="New password" id="recovery-password" type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} />
          <button aria-label="Complete account recovery" className="button secondary button-wide" type="submit">Complete recovery</button>
        </form>
        {message && <p className="notice" role="status">{message}</p>}
        <Link to="/login">Return to sign in</Link>
      </section>
    </main>
  );
}
