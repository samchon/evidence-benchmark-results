import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/hooks";

export function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@benchmark.erp");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    auth.login.mutate({ email, password }, {
      onSuccess: () => { void navigate("/"); },
      onError: (cause) => setError(cause instanceof Error ? cause.message : "Sign in was refused."),
    });
  };
  return <main className="auth-shell"><div className="auth-brand"><span className="brand-mark">b</span> benchmark<span className="brand-muted">/erp</span></div><section className="auth-card"><p className="eyebrow">Welcome back</p><h1>Sign in to your workspace</h1><p className="lede">Use your global identity, then choose an active organization.</p><form onSubmit={submit}><label htmlFor="login-email">Email address</label><input id="login-email" aria-label="Email address" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /><label htmlFor="login-password">Password</label><input id="login-password" aria-label="Password" type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />{error && <p className="field-error" role="alert">{error}</p>}<button type="submit" className="button primary button-wide" disabled={auth.login.isPending}>{auth.login.isPending ? "Signing in" : "Sign in"}</button></form><p className="auth-foot"><Link to="/recover">Forgot your password?</Link> · <Link aria-label="Accept an invitation" to="/invite">Accept an invitation</Link></p></section><p className="auth-note">Private by organization. Every action is attributable.</p></main>;
}
