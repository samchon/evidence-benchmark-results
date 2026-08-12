import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useSession } from "@/lib/session";
import { Button, Card, Field, PageState } from "@/components/ui";
import { errorMessage, useAuthActions } from "@/lib/hooks";

export function SettingsPage() {
  const { session } = useSession();
  const auth = useAuthActions();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  if (session === null) return <PageState title="Sign in required" message="Account settings belong to the authenticated account." />;
  const changePassword = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    auth.password.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () =>
          toast.success("Password changed; other sessions were revoked."),
      },
    );
  };
  return <div className="narrow-page"><div className="page-heading"><div><p className="eyebrow">Account controls</p><h1>Settings</h1></div></div><Card><h2>Session lifecycle</h2><p className="muted">Signed in as {session.user.username}. Ending every session leaves the account active.</p><Button variant="quiet" disabled={auth.logoutAll.isPending} action={() => auth.logoutAll.mutate(undefined, { onSuccess: () => { void navigate("/auth"); } })}>Sign out everywhere</Button>{auth.logoutAll.error !== null ? <p className="form-error" role="alert">{errorMessage(auth.logoutAll.error)}</p> : null}</Card><Card><h2>Change password</h2><form className="form-stack" onSubmit={changePassword}><Field label="Current password" type="password" value={currentPassword} onChange={setCurrentPassword} required /><Field label="New password" type="password" value={newPassword} onChange={setNewPassword} required /><Button type="submit" disabled={auth.password.isPending}>Replace password</Button>{auth.password.error !== null ? <p className="form-error" role="alert">{errorMessage(auth.password.error)}</p> : null}</form></Card><Card className="danger-zone"><h2>Delete account permanently</h2><p>This removes authored content, sessions, votes, subscriptions, bans, and unresolved reports. It cannot be undone.</p><form className="form-stack" onSubmit={(event) => {
    event.preventDefault();
    auth.deleteAccount.mutate(deletePassword, { onSuccess: () => { void navigate("/auth"); } });
  }}><Field label="Current password to confirm deletion" type="password" value={deletePassword} onChange={setDeletePassword} required /><Button type="submit" variant="danger" disabled={auth.deleteAccount.isPending}>Delete my account</Button>{auth.deleteAccount.error !== null ? <p className="form-error" role="alert">{errorMessage(auth.deleteAccount.error)}</p> : null}</form></Card></div>;
}
