import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useInvitation } from "@/lib/auth/hooks";

export function InvitationPage() {
  const accept = useInvitation();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    accept.mutate(
      { token, password: password || undefined, displayName: displayName || undefined },
      {
        onSuccess: () => setMessage("Invitation accepted. You can now sign in."),
        onError: () => setMessage("This invitation is invalid, expired, or already used."),
      },
    );
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Membership invitation</p>
        <h1>Join your organization</h1>
        <p className="lede">
          Accepting an invitation creates or extends one global identity with an
          organization-scoped Employee baseline.
        </p>
        <form aria-label="Accept invitation" onSubmit={submit}>
          <label htmlFor="invite-token">Invitation token</label>
          <input aria-label="Invitation token" id="invite-token" required value={token} onChange={(event) => setToken(event.target.value)} />
          <label htmlFor="invite-name">Display name</label>
          <input aria-label="Display name" id="invite-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          <label htmlFor="invite-password">Password (new accounts)</label>
          <input aria-label="Password (new accounts)" id="invite-password" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} />
          <button aria-label="Accept invitation" className="button primary button-wide" type="submit" disabled={accept.isPending}>
            Accept invitation
          </button>
        </form>
        {message && <p className="notice" role="status">{message}</p>}
        <Link to="/login">Return to sign in</Link>
      </section>
    </main>
  );
}
