import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { IUser } from "@benchmark/todo-api";

import { PageHeader } from "@/components/common/app-shell";
import { useAuth } from "@/lib/auth-hooks";
import {
  formatError,
  useChangePassword,
  useDeleteAccount,
  useLogout,
  useLogoutAll,
  useProfile,
  useUpdateProfile,
  validationMessage,
} from "@/lib/api-hooks";

export function SettingsPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const profile = useProfile();
  const update = useUpdateProfile();
  const password = useChangePassword();
  const logout = useLogout();
  const logoutAll = useLogoutAll();
  const deletion = useDeleteAccount();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const leave = () => {
    signOut();
    void navigate("/auth?mode=login", { replace: true });
  };

  const submitProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const body = { displayName: (displayName ?? profile.data?.displayName ?? "").trim() } satisfies IUser.IUpdateProfile;
    const message = validationMessage(body);
    if (message) {
      setFormError(message);
      return;
    }
    try {
      const user = await update.mutateAsync(body);
      setDisplayName(user.displayName);
      toast.success("Profile updated");
    } catch (error) {
      setFormError(formatError(error));
    }
  };

  const submitPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const body = { currentPassword, newPassword } satisfies IUser.IChangePassword;
    const message = validationMessage(body);
    if (message) {
      setFormError(message);
      return;
    }
    try {
      await password.mutateAsync(body);
      toast.success("Password changed. Sign in again with the new password.");
      leave();
    } catch (error) {
      setFormError(formatError(error));
    }
  };

  const doLogout = async () => {
    setFormError(null);
    try {
      await logout.mutateAsync();
      leave();
    } catch (error) {
      setFormError(formatError(error));
    }
  };

  const doLogoutAll = async () => {
    setFormError(null);
    try {
      await logoutAll.mutateAsync();
      leave();
    } catch (error) {
      setFormError(formatError(error));
    }
  };

  const doDelete = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const body = { currentPassword: deletePassword } satisfies IUser.IDeleteAccount;
    const message = validationMessage(body);
    if (message) {
      setFormError(message);
      return;
    }
    if (!window.confirm("Delete this account and every todo permanently?")) return;
    try {
      await deletion.mutateAsync(body);
      leave();
    } catch (error) {
      setFormError(formatError(error));
    }
  };

  const sessionPending = logout.isPending || logoutAll.isPending;
  return (
    <div className="content-wrap settings-page">
      <PageHeader eyebrow="Your private profile" title="Account settings" description="Keep your identity current and your access under control." />
      {formError && <p className="inline-error" role="alert">{formError}</p>}
      <div className="settings-grid">
        <section className="settings-card card">
          <div className="section-heading"><span className="section-icon">◉</span><div><h2>Profile</h2><p>Only you can see this profile.</p></div></div>
          {profile.isPending ? <p className="muted">Loading profile…</p> : profile.isError ? <div className="error-state"><p>We couldn’t load your profile.</p><button type="button" className="button secondary" onClick={() => void profile.refetch()}>Try again</button></div> : <form className="form-stack" onSubmit={(event) => void submitProfile(event)}><label className="field"><span>Display name</span><input aria-label="Display name" required maxLength={100} value={displayName ?? profile.data?.displayName ?? ""} onChange={(event) => setDisplayName(event.target.value)} /></label><button type="submit" className="button primary align-start" disabled={update.isPending}>{update.isPending ? "Saving…" : "Save profile"}</button></form>}
        </section>
        <section className="settings-card card">
          <div className="section-heading"><span className="section-icon">⌁</span><div><h2>Password</h2><p>Use eight or more characters.</p></div></div>
          <form className="form-stack" onSubmit={(event) => void submitPassword(event)}><label className="field"><span>Current password</span><input aria-label="Current password" required type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label><label className="field"><span>New password</span><input aria-label="New password" required minLength={8} type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label><button type="submit" className="button secondary align-start" disabled={password.isPending}>{password.isPending ? "Changing…" : "Change password"}</button></form>
        </section>
        <section className="settings-card card security-card">
          <div className="section-heading"><span className="section-icon">◌</span><div><h2>Sessions</h2><p>End access on this device or everywhere.</p></div></div>
          <div className="security-actions"><button type="button" className="button secondary" disabled={sessionPending} onClick={() => void doLogout()}>Sign out here</button><button type="button" className="button secondary" disabled={sessionPending} onClick={() => void doLogoutAll()}>Sign out everywhere</button></div>
        </section>
        <section className="settings-card card danger-card">
          <div className="section-heading"><span className="section-icon">!</span><div><h2>Delete account</h2><p>This permanently erases your profile, todos, and history.</p></div></div>
          <form className="form-stack" onSubmit={(event) => void doDelete(event)}><label className="field"><span>Confirm with current password</span><input aria-label="Confirm with current password" required type="password" value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} /></label><button type="submit" className="button danger align-start" disabled={deletion.isPending}>{deletion.isPending ? "Deleting…" : "Permanently delete account"}</button></form>
        </section>
      </div>
    </div>
  );
}
