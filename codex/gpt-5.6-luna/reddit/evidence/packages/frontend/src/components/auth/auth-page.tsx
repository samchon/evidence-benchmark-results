import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuthSession, useChangePassword, useErase, useJoin, useLogin, useRecoveryComplete, useRecoveryRequest, useRefresh } from "@/lib/auth/hooks";
import type * as AuthHooks from "../../lib/auth/hooks";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-account-provisioning-and-login Login, registration, and recovery forms expose the account entry boundary.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-002-require-complete-registration-credentials Registration requires email, username, and password fields before submission.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-account-identity-rules Authentication errors are shown as mutation feedback rather than silently accepting invalid identity data.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-001-enforce-case-insensitive-email-and-username-uniqueness The registration mutation surfaces the API's uniqueness refusal to the user.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-003-reserve-deleted-account-identifiers The registration mutation surfaces the API's reserved-identifier refusal to the user.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle The page surfaces session errors and routes authenticated users to account controls.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle The auth form preserves the account-management route and mutation feedback.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy No private account or moderation data is rendered on the public auth surface.
 * @evidence {@link AuthHooks.useJoin} Used by this screen.
 * @evidence {@link AuthHooks.useLogin} Used by this screen.
 * @evidence {@link AuthHooks.useRefresh} Used by this screen.
 * @evidence {@link AuthHooks.useChangePassword} Used by this screen.
 * @evidence {@link AuthHooks.useRecoveryRequest} Used by this screen.
 * @evidence {@link AuthHooks.useRecoveryComplete} Used by this screen.
 * @evidence {@link AuthHooks.useErase} Used by this screen.
 */
export function AuthPage(props: { mode?: "login" | "register" | "recovery" | "settings" }) {
  const location = useLocation();
  const mode = props.mode ?? (location.pathname.includes("register") ? "register" : location.pathname.includes("recovery") ? "recovery" : "login");
  const navigate = useNavigate();
  const { session } = useAuthSession();
  const join = useJoin(); const login = useLogin(); const refresh = useRefresh(); const change = useChangePassword(); const request = useRecoveryRequest(); const complete = useRecoveryComplete(); const erase = useErase();
  const errorMessage = [join.error, login.error, refresh.error, change.error, request.error, complete.error, erase.error].find((error): error is Error => error instanceof Error)?.message;
  const [message, setMessage] = useState("");
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (mode === "register") void join.mutateAsync({ email: String(data.email), username: String(data.username), password: String(data.password) }).then(() => navigate("/"));
    else if (mode === "login") void login.mutateAsync({ email: String(data.email), password: String(data.password) }).then(() => navigate("/"));
    else if (mode === "recovery" && data.proof) void complete.mutateAsync({ email: String(data.email), proof: String(data.proof), newPassword: String(data.newPassword) }).then(() => setMessage("Password updated. You can sign in."));
    else void request.mutateAsync({ email: String(data.email) }).then(() => setMessage("If the account exists, recovery instructions are ready."));
    event.currentTarget.reset();
  };
  const settingsSubmit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); void change.mutateAsync({ currentPassword: String(data.currentPassword), newPassword: String(data.newPassword) }).then(() => setMessage("Password changed.")); };
  const deleteAccount = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); const password = String(new FormData(event.currentTarget).get("password") ?? ""); void erase.mutateAsync({ password }).then(() => navigate("/login")); };
  if (mode === "settings") return <div className="narrow panel"><p className="eyebrow">Account</p><h1>Security settings</h1><form className="stack" onSubmit={settingsSubmit}><label>Current password<input aria-label="Current password" name="currentPassword" type="password" required /></label><label>New password<input aria-label="New password" name="newPassword" type="password" minLength={8} required /></label><button aria-label="Change password" type="submit">Change password</button></form><button aria-label="Refresh session" type="button" disabled={session === null} onClick={() => session === null ? undefined : void refresh.mutateAsync({ refreshToken: session.token.refresh }).then(() => setMessage("Session refreshed."))}>Refresh session</button><hr /><h2>Delete account</h2><form className="stack" onSubmit={deleteAccount}><label>Confirm with password<input aria-label="Delete account password" name="password" type="password" required /></label><button aria-label="Delete account permanently" className="danger" type="submit">Delete account permanently</button></form>{message ? <p role="status">{message}</p> : null}{errorMessage ? <p className="error" role="alert">{errorMessage}</p> : null}</div>;
  return <div className="narrow panel"><p className="eyebrow">Identity</p><h1>{mode === "register" ? "Create your account" : mode === "recovery" ? "Recover access" : "Welcome back"}</h1><form className="stack" onSubmit={submit}><label>Email<input aria-label="Email" name="email" type="email" autoComplete="email" required /></label>{mode === "register" ? <label>Username<input aria-label="Username" name="username" minLength={3} maxLength={30} autoComplete="username" required /></label> : null}<label>{mode === "recovery" ? "New password" : "Password"}<input aria-label="Password" name={mode === "recovery" ? "newPassword" : "password"} type="password" minLength={mode === "register" || mode === "recovery" ? 8 : 1} required /></label>{mode === "recovery" ? <label>Proof (after requesting)<input aria-label="Recovery proof" name="proof" /></label> : null}<button aria-label="Submit authentication form" type="submit">{mode === "register" ? "Register" : mode === "recovery" ? "Request or complete recovery" : "Log in"}</button></form>{message ? <p role="status">{message}</p> : null}{errorMessage ? <p className="error" role="alert">{errorMessage}</p> : null}<p className="meta"><Link to="/login">Log in</Link> · <Link to="/register">Register</Link> · <Link to="/recovery">Forgot password?</Link></p></div>;
}
