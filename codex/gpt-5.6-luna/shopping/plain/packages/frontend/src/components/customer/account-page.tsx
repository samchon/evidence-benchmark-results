/* Native controls are rendered by the design-system Button wrapper. */
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Card, Field, PageHeader } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { toErrorMessage } from "@/lib/utils";
import { useShoppingOperations } from "@/lib/shopping/hooks";

export function AccountPage() {
  const auth = useAuth();
  const operations = useShoppingOperations();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const run = async (action: () => Promise<unknown>, success: string) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try { await action(); setMessage(success); } catch (caught) { setError(toErrorMessage(caught)); } finally { setBusy(false); }
  };
  const leave = async () => { if (busy) return; setBusy(true); try { await auth.signOut(); void navigate("/login"); } finally { setBusy(false); } };
  const close = async () => { await operations.customer.accountDelete({ password: deletePassword }); await auth.signOut(); void navigate("/login"); };
  return <section className="page"><PageHeader eyebrow="Customer / account" title="Account security" detail="Credentials and sessions are separate from your customer profile and retained order history." />
    <div className="split-layout"><Card className="form-card"><h2>Change password</h2><Field label="Current password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" required /><Field label="New password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" minLength={8} required /><Button disabled={busy} onClick={() => void run(() => operations.customer.passwordUpdate({ currentPassword, newPassword }), "Password updated; other sessions were revoked.")}>{busy ? "Working..." : "Change password"}</Button></Card>
      <Card className="form-card"><h2>Session control</h2><p className="muted">End every other customer session when a device is lost or access needs to be reset.</p><Button disabled={busy} tone="quiet" onClick={() => void run(() => operations.customer.logoutAll(), "All other sessions were ended.")}>Sign out all other sessions</Button><Button disabled={busy} tone="quiet" onClick={() => void leave()}>Sign out this session</Button></Card></div>
    <Card className="form-card"><h2>Close customer account</h2><p className="muted">This permanently closes access. Retained purchase records remain governed by platform history rules.</p><Field label="Password to confirm closure" type="password" value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} autoComplete="current-password" required /><Button disabled={busy} tone="danger" onClick={() => void run(close, "Account closed.")}>Close account</Button></Card>
    {error === null ? null : <p className="form-message error" role="alert">{error}</p>}{message === null ? null : <p className="form-message success" role="status">{message}</p>}
  </section>;
}

export default AccountPage;
