import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import typia from "typia";
import * as api from "@benchmark/todo-api";

import { useAuthAccount, useAuthLogout, useAuthLogoutAll, useAuthPassword, useAuthRefresh } from "../../lib/auth/hooks";
import { useSession } from "../../lib/auth/session";
import { diagnoses, firstDiagnosis } from "@/lib/utils";
import { Button, DiagnosisList, Field, Notice, Panel } from "@/components/ui/ui";

/**
 * Account security and session continuity controls.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Delivers session controls.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-1-continue-an-authenticated-session Renews a session.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-2-log-out-the-current-session Ends the current session.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Ends every account session.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Delivers account security controls.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-1-change-the-account-password Changes the password.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-3-permanently-delete-the-account Deletes the account.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Keeps security inside the account boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires the current session.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Presents credential validation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Preserves password limits.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Explains session invalidation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Keeps terminal actions explicit.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Shows account deletion as terminal.
 * @evidence {@link useAuthRefresh} Uses refresh hook.
 * @evidence {@link useAuthLogout} Uses current-session logout hook.
 * @evidence {@link useAuthLogoutAll} Uses all-session logout hook.
 * @evidence {@link useAuthPassword} Uses password hook.
 * @evidence {@link useAuthAccount} Uses account deletion hook.
 */
export function SecurityPage() {
  const navigate = useNavigate();
  const session = useSession();
  const refresh = useAuthRefresh();
  const logout = useAuthLogout();
  const logoutAll = useAuthLogoutAll();
  const password = useAuthPassword();
  const account = useAuthAccount();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [errors, setErrors] = useState<api.IDiagnosis[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const submitPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = { currentPassword, newPassword } satisfies api.IAuth.IChangePassword;
    const result = typia.validate<api.IAuth.IChangePassword>(body);
    if (!result.success) { setErrors(result.errors.map((item) => ({ accessor: item.path.replace(/^\$input(?:\.|$)/, ""), message: item.expected }))); return; }
    void password.mutate(body, { onSuccess: () => { setMessage("Password changed. Sign in again with the new password."); setErrors([]); void navigate("/auth"); }, onError: (error) => setErrors(diagnoses(error)) });
  };
  const submitDelete = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = { currentPassword: deletePassword } satisfies api.IAuth.IDeleteAccount;
    const result = typia.validate<api.IAuth.IDeleteAccount>(body);
    if (!result.success) { setErrors(result.errors.map((item) => ({ accessor: item.path.replace(/^\$input(?:\.|$)/, ""), message: item.expected }))); return; }
    void account.mutate(body, { onSuccess: () => { void navigate("/auth"); }, onError: (error) => setErrors(diagnoses(error)) });
  };
  const refreshSession = () => {
    const token = session.session?.token.refresh;
    if (token === undefined) { setErrors([{ accessor: "", message: "No refresh proof is available." }]); return; }
    void refresh.mutate(token, { onSuccess: () => setMessage("Session renewed."), onError: (error) => setErrors(diagnoses(error)) });
  };
  const leave = (all: boolean) => {
    const mutation = all ? logoutAll : logout;
    void mutation.mutate(undefined, { onSuccess: () => { void navigate("/auth"); } });
  };
  return <div className="page-stack"><header className="page-heading"><div><p className="eyebrow">Account security</p><h1>Keep control</h1><p className="lede">Refresh access, end sessions, replace credentials, or close the account permanently.</p></div></header><DiagnosisList items={errors} />{message === null ? null : <Notice tone="success">{message}</Notice>}<div className="security-grid"><Panel title="Session continuity" eyebrow="Access"><p className="muted">The server decides when your session expires. Renew it with the stored refresh proof.</p><div className="button-row" role="group" aria-label="Session actions"><Button role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") event.currentTarget.click(); }} type="button" disabled={refresh.isPending} onClick={refreshSession}>{refresh.isPending ? "Refreshing" : "Refresh session"}</Button><Button role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") event.currentTarget.click(); }} tone="quiet" type="button" disabled={logout.isPending} onClick={() => leave(false)}>Log out this session</Button><Button role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") event.currentTarget.click(); }} tone="quiet" type="button" disabled={logoutAll.isPending} onClick={() => leave(true)}>Log out all sessions</Button></div></Panel><Panel title="Change password" eyebrow="Known credential"><form className="stack-form" onSubmit={submitPassword}><Field label="Current password" type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} error={firstDiagnosis(errors, "currentPassword")} required /><Field label="New password" type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} error={firstDiagnosis(errors, "newPassword")} required /><Button type="submit" disabled={password.isPending}>{password.isPending ? "Changing" : "Change password"}</Button></form></Panel><Panel title="Close account" eyebrow="Terminal action" className="danger-card"><p className="muted">This permanently removes the profile, active and trashed Todos, histories, and sessions. There is no restore path.</p><form className="stack-form" onSubmit={submitDelete}><Field label="Confirm with current password" type="password" autoComplete="current-password" value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} error={firstDiagnosis(errors, "currentPassword")} required /><Button tone="danger" type="submit" disabled={account.isPending}>{account.isPending ? "Closing" : "Permanently close account"}</Button></form></Panel></div></div>;
}
