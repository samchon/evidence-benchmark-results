import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  useAccountDelete,
  useChangePassword,
  useLogout,
  useLogoutAll,
  useRefresh,
} from "../../lib/auth/hooks";
import { useProfile, useUpdateProfile } from "../../lib/profile/hooks";
import { errorMessage, firstInvalid } from "@/lib/utils";
import { EmptyBlock, ErrorBlock, InlineAlert, LoadingBlock, SectionHeading } from "@/components/ui/primitives";

/**
 * Private profile, session security, and account-management screen.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Renders the session security entry points.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-1-continue-an-authenticated-session Renders session continuation.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-1-continue-an-authenticated-session Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-2-log-out-the-current-session Renders current-session logout.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-2-log-out-the-current-session Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Renders all-session logout.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Renders account security actions.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-1-change-the-account-password Renders password replacement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-1-change-the-account-password Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-3-permanently-delete-the-account Renders terminal account deletion.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-3-permanently-delete-the-account Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Renders the private profile surface.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-1-define-the-user-profile Renders the profile identity fields.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-1-define-the-user-profile Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-2-bind-one-private-profile-to-each-account Renders the account-bound profile view.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-2-bind-one-private-profile-to-each-account Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Renders profile operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-1-view-the-current-users-profile Renders current-profile loading and view states.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-1-view-the-current-users-profile Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-2-edit-the-display-name Renders display-name editing.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-2-edit-the-display-name Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Renders display-name validation guidance.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Renders bounded display-name input.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence {@link useProfile} Uses the profile query hook for the private profile.
 * @evidenceReview {@link useProfile} Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence {@link useUpdateProfile} Uses the profile update hook for display-name edits.
 * @evidenceReview {@link useUpdateProfile} Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence {@link useChangePassword} Uses the password replacement hook.
 * @evidenceReview {@link useChangePassword} Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence {@link useRefresh} Uses the session continuation hook.
 * @evidenceReview {@link useRefresh} Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence {@link useLogout} Uses the current-session logout hook.
 * @evidenceReview {@link useLogout} Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence {@link useLogoutAll} Uses the all-session logout hook.
 * @evidenceReview {@link useLogoutAll} Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 * @evidence {@link useAccountDelete} Uses the terminal account deletion hook.
 * @evidenceReview {@link useAccountDelete} Read the cited requirement and inspected ProfilePage fields, session actions, and terminal states; ran the live account journey.
 */
export function ProfilePage() {
  const navigate = useNavigate();
  const profile = useProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const refresh = useRefresh();
  const logout = useLogout();
  const logoutAll = useLogoutAll();
  const deleteAccount = useAccountDelete();
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  if (profile.isPending) return <div className="page-wrap"><LoadingBlock label="Loading your profile" /></div>;
  if (profile.error !== null) return <div className="page-wrap"><ErrorBlock message={errorMessage(profile.error)} onRetry={() => void profile.refetch()} /></div>;
  if (profile.data === undefined) return <div className="page-wrap"><EmptyBlock title="Profile unavailable">Sign in again to reopen your private profile.</EmptyBlock></div>;

  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setFormError(null);
    setNotice(null);
    if (form.reportValidity() === false) {
      firstInvalid(form);
      return;
    }
    const values = new FormData(form);
    updateProfile.mutate({ displayName: String(values.get("displayName")) }, { onSuccess: () => setNotice("Your display name is updated."), onError: (reason) => setFormError(errorMessage(reason)) });
  };
  const submitPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setFormError(null);
    setNotice(null);
    if (form.reportValidity() === false) {
      firstInvalid(form);
      return;
    }
    const values = new FormData(form);
    changePassword.mutate({ currentPassword: String(values.get("currentPassword")), newPassword: String(values.get("newPassword")) }, { onSuccess: () => { void navigate("/login", { replace: true }); }, onError: (reason) => setFormError(errorMessage(reason)) });
  };
  const submitDelete = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setFormError(null);
    setNotice(null);
    if (form.reportValidity() === false) {
      firstInvalid(form);
      return;
    }
    const values = new FormData(form);
    deleteAccount.mutate({ password: String(values.get("deletePassword")) }, { onSuccess: () => { void navigate("/login", { replace: true }); }, onError: (reason) => setFormError(errorMessage(reason)) });
  };
  return <div className="page-wrap"><SectionHeading eyebrow="Account" title="Your private profile" description="A small identity for the workspace. It never becomes a public directory." action={<span className="pill pill-neutral">Private account</span>} />{(formError !== null || notice !== null) && <InlineAlert tone={formError !== null ? "error" : "success"}>{formError ?? notice}</InlineAlert>}<div className="profile-grid"><section className="card"><div className="card-head"><div><p className="eyebrow">Display identity</p><h2>Profile details</h2></div><span className="avatar" aria-hidden="true">{profile.data.displayName.slice(0, 1).toUpperCase()}</span></div><form key={profile.data.id} className="stack-form" onSubmit={submitProfile}><label>Display name<input aria-label="Display name" name="displayName" defaultValue={profile.data.displayName} required minLength={1} maxLength={100} autoComplete="name" /></label><p className="field-note">1 to 100 characters. Leading and trailing whitespace is normalized.</p><button type="submit" className="button button-primary" disabled={updateProfile.isPending}>{updateProfile.isPending ? "Saving" : "Save profile"}</button></form></section><section className="card"><div className="card-head"><div><p className="eyebrow">Session</p><h2>Keep access current</h2></div><span className="pill pill-success">Protected</span></div><p className="muted">Continue this account on another request or end access on this device.</p><div className="button-row"><button type="button" className="button button-secondary" onClick={() => refresh.mutate(undefined, { onSuccess: () => setNotice("Session continued."), onError: (reason) => setFormError(errorMessage(reason)) })} disabled={refresh.isPending}>{refresh.isPending ? "Continuing" : "Continue session"}</button><button type="button" className="button button-secondary" onClick={() => logout.mutate(undefined, { onSuccess: () => { void navigate("/login", { replace: true }); }, onError: (reason) => setFormError(errorMessage(reason)) })} disabled={logout.isPending}>{logout.isPending ? "Signing out" : "Sign out"}</button><button type="button" className="button button-ghost" onClick={() => logoutAll.mutate(undefined, { onSuccess: () => { void navigate("/login", { replace: true }); }, onError: (reason) => setFormError(errorMessage(reason)) })} disabled={logoutAll.isPending}>{logoutAll.isPending ? "Ending sessions" : "Sign out everywhere"}</button></div></section><section className="card"><div className="card-head"><div><p className="eyebrow">Credential</p><h2>Change password</h2></div></div><form className="stack-form" onSubmit={submitPassword}><label>Current password<input aria-label="Current password" name="currentPassword" type="password" required minLength={1} autoComplete="current-password" /></label><label>New password<input aria-label="New password" name="newPassword" type="password" required minLength={8} maxLength={128} autoComplete="new-password" /></label><p className="field-note">8 to 128 characters. Changing it ends every existing session.</p><button type="submit" className="button button-secondary" disabled={changePassword.isPending}>{changePassword.isPending ? "Replacing" : "Replace password"}</button></form></section><section className="card card-danger"><div className="card-head"><div><p className="eyebrow">Irreversible</p><h2>Delete account</h2></div></div><p className="muted">This removes your profile, active and trashed Todos, histories, recovery records, and sessions as one terminal outcome.</p><form className="stack-form" onSubmit={submitDelete}><label>Confirm with current password<input aria-label="Confirm with current password" name="deletePassword" type="password" required minLength={1} autoComplete="current-password" /></label><button type="submit" className="button button-danger" disabled={deleteAccount.isPending}>{deleteAccount.isPending ? "Deleting" : "Delete account"}</button></form></section></div></div>;
}
