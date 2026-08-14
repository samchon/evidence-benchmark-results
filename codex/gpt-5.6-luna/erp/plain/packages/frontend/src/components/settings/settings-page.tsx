import { useState, type FormEvent } from "react";
import { Button, ErrorState, Field, LoadingState, PageHeader, Panel } from "@/components/ui/primitives";
import { useAuthActions, useOrganization, useProfile } from "@/lib/erp/hooks";
import { useSession } from "@/lib/session-hooks";
import { errorMessage } from "@/lib/utils";

export function SettingsPage() {
  const { auth } = useSession();
  const profile = useProfile();
  const organization = useOrganization();
  const actions = useAuthActions();
  const [displayName, setDisplayName] = useState<string | undefined>();
  const [avatar, setAvatar] = useState<string | undefined>();
  const [phone, setPhone] = useState<string | undefined>();
  const [locale, setLocale] = useState<string | undefined>();
  const [timezone, setTimezone] = useState<string | undefined>();
  const [organizationName, setOrganizationName] = useState<string | undefined>();
  const [organizationTimezone, setOrganizationTimezone] = useState<string | undefined>();
  const [fiscalStartMonth, setFiscalStartMonth] = useState<string | undefined>();
  const [approvalThreshold, setApprovalThreshold] = useState<string | undefined>();
  const [negativeStockAllowed, setNegativeStockAllowed] = useState<boolean | undefined>();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState(auth?.user.email ?? "");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Employee");
  const [notice, setNotice] = useState<string | null>(null);

  if (profile.isPending || organization.isPending) return <LoadingState />;
  if (profile.error) return <ErrorState message={profile.error.message} retry={() => { void profile.refetch(); }} />;
  if (organization.error) return <ErrorState message={organization.error.message} retry={() => { void organization.refetch(); }} />;

  const profileName = displayName ?? profile.data?.displayName ?? auth?.user.displayName ?? "";
  const profileAvatar = avatar ?? profile.data?.avatar ?? "";
  const profilePhone = phone ?? profile.data?.phone ?? "";
  const profileLocale = locale ?? profile.data?.locale ?? "";
  const profileTimezone = timezone ?? profile.data?.timezone ?? "";
  const orgName = organizationName ?? organization.data?.name ?? "";
  const orgTimezone = organizationTimezone ?? organization.data?.timezone ?? "";
  const orgMonth = fiscalStartMonth ?? String(organization.data?.fiscalStartMonth ?? 1);
  const orgThreshold = approvalThreshold ?? String(organization.data?.approvalThreshold ?? 0);
  const allowNegativeStock = negativeStockAllowed ?? organization.data?.negativeStockAllowed ?? false;

  const saveProfile = (event: FormEvent) => {
    event.preventDefault();
    actions.updateProfile.mutate({ displayName: profileName, avatar: profileAvatar || null, phone: profilePhone || null, locale: profileLocale || null, timezone: profileTimezone || null }, {
      onSuccess: () => setNotice("Profile saved."),
      onError: () => setNotice(null),
    });
  };
  const saveOrganization = (event: FormEvent) => {
    event.preventDefault();
    actions.updateOrganization.mutate({ name: orgName, timezone: orgTimezone, fiscalStartMonth: Number(orgMonth), approvalThreshold: Number(orgThreshold), negativeStockAllowed: allowNegativeStock }, {
      onSuccess: () => setNotice("Organization settings saved."),
      onError: () => setNotice(null),
    });
  };
  const changePassword = (event: FormEvent) => {
    event.preventDefault();
    actions.changePassword.mutate({ currentPassword, newPassword }, {
      onSuccess: () => {
        setCurrentPassword("");
        setNewPassword("");
        setNotice("Password changed.");
      },
      onError: () => setNotice(null),
    });
  };
  const requestRecovery = (event: FormEvent) => {
    event.preventDefault();
    actions.recoveryRequest.mutate({ email: recoveryEmail });
  };
  const inviteMember = (event: FormEvent) => {
    event.preventDefault();
    actions.invite.mutate({ email: inviteEmail, role: inviteRole }, { onSuccess: () => setInviteEmail("") });
  };

  return <div className="page">
    <PageHeader eyebrow="Workspace / settings" title="Settings" description="Manage identity, membership entry, and organization defaults that shape every request." />
    {notice ? <p className="form-hint" role="status">{notice}</p> : null}
    <div className="content-grid">
      <Panel title="Your profile" eyebrow="Global account">
        <form onSubmit={saveProfile}>
          <Field label="Display name"><input aria-label="Display name" value={profileName} onChange={(event) => setDisplayName(event.target.value)} /></Field>
          <Field label="Avatar reference"><input aria-label="Avatar reference" value={profileAvatar} onChange={(event) => setAvatar(event.target.value)} /></Field>
          <Field label="Email"><input aria-label="Profile email" value={profile.data?.email ?? auth?.user.email ?? ""} readOnly /></Field>
          <Field label="Phone"><input aria-label="Phone" value={profilePhone} onChange={(event) => setPhone(event.target.value)} /></Field>
          <Field label="Locale"><input aria-label="Locale" value={profileLocale} onChange={(event) => setLocale(event.target.value)} /></Field>
          <Field label="Timezone preference"><input aria-label="Timezone preference" value={profileTimezone} onChange={(event) => setTimezone(event.target.value)} /></Field>
          {actions.updateProfile.error ? <p className="form-error" role="alert">{errorMessage(actions.updateProfile.error)}</p> : null}
          <Button type="submit" disabled={actions.updateProfile.isPending}>Save profile</Button>
        </form>
      </Panel>
      <Panel title="Organization settings" eyebrow="Owner-controlled configuration">
        <form onSubmit={saveOrganization}>
          <Field label="Organization name"><input aria-label="Organization name" value={orgName} onChange={(event) => setOrganizationName(event.target.value)} /></Field>
          <Field label="Base currency"><input aria-label="Base currency" value={organization.data?.baseCurrency ?? ""} readOnly /></Field>
          <Field label="Organization timezone"><input aria-label="Organization timezone" value={orgTimezone} onChange={(event) => setOrganizationTimezone(event.target.value)} /></Field>
          <Field label="Fiscal start month"><input aria-label="Fiscal start month" type="number" min="1" max="12" value={orgMonth} onChange={(event) => setFiscalStartMonth(event.target.value)} /></Field>
          <Field label="Approval threshold"><input aria-label="Approval threshold" type="number" min="0" step="0.01" value={orgThreshold} onChange={(event) => setApprovalThreshold(event.target.value)} /></Field>
          <label><input aria-label="Allow negative stock" type="checkbox" checked={allowNegativeStock} onChange={(event) => setNegativeStockAllowed(event.target.checked)} /> Allow negative stock</label>
          {actions.updateOrganization.error ? <p className="form-error" role="alert">{errorMessage(actions.updateOrganization.error)}</p> : null}
          <Button type="submit" disabled={actions.updateOrganization.isPending}>Save organization</Button>
        </form>
      </Panel>
      <Panel title="Invite a member" eyebrow="Owner-issued entry">
        <form onSubmit={inviteMember}>
          <Field label="Member email"><input aria-label="Member email" type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} required /></Field>
          <Field label="Initial role"><select aria-label="Initial role" value={inviteRole} onChange={(event) => setInviteRole(event.target.value)}><option>Employee</option><option>Finance Manager</option><option>Procurement Manager</option><option>HR Manager</option></select></Field>
          {actions.invite.error ? <p className="form-error" role="alert">{errorMessage(actions.invite.error)}</p> : null}
          {actions.invite.isSuccess ? <p className="form-hint">Invitation issued. The recipient must accept it before access begins.</p> : null}
          <Button type="submit" disabled={actions.invite.isPending}>Send invitation</Button>
        </form>
      </Panel>
      <Panel title="Password and account" eyebrow="Credential security">
        <form onSubmit={changePassword}>
          <Field label="Current password"><input aria-label="Current password" type="password" minLength={8} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /></Field>
          <Field label="New password"><input aria-label="New password" type="password" minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required /></Field>
          {actions.changePassword.error ? <p className="form-error" role="alert">{errorMessage(actions.changePassword.error)}</p> : null}
          <Button type="submit" disabled={actions.changePassword.isPending}>Change password</Button>
        </form>
        <form onSubmit={requestRecovery}>
          <Field label="Recovery email"><input aria-label="Recovery email" type="email" value={recoveryEmail} onChange={(event) => setRecoveryEmail(event.target.value)} required /></Field>
          {actions.recoveryRequest.isSuccess ? <p className="form-hint">If the account exists, recovery instructions were sent.</p> : null}
          <Button tone="quiet" type="submit" disabled={actions.recoveryRequest.isPending}>Request recovery email</Button>
        </form>
        {actions.deactivateAccount.error ? <p className="form-error" role="alert">{errorMessage(actions.deactivateAccount.error)}</p> : null}
        <Button tone="danger" disabled={currentPassword.length < 8 || actions.deactivateAccount.isPending} onPress={() => { actions.deactivateAccount.mutate({ currentPassword }); }}>Deactivate global account</Button>
      </Panel>
      <Panel title="Sessions" eyebrow="Security">
        <p className="panel-copy">Sign out this browser or revoke every active session after a credential concern.</p>
        <div className="button-row"><Button tone="quiet" onPress={() => { void actions.logout.mutateAsync(); }}>Sign out this session</Button><Button tone="danger" onPress={() => { void actions.logoutAll.mutateAsync(); }}>Sign out everywhere</Button></div>
      </Panel>
    </div>
  </div>;
}
