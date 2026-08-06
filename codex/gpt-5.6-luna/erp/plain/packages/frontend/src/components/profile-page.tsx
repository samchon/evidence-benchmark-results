import { useState } from "react";
import { useAuth } from "@/lib/auth/hooks";
import { useCreateOrganization, useOrganizations } from "@/lib/organization/hooks";

export function ProfilePage() {
  const auth = useAuth();
  const [name, setName] = useState(auth.user?.displayName ?? "Demo workspace");
  const [locale, setLocale] = useState(auth.user?.locale ?? "en");
  const [timezone, setTimezone] = useState(auth.user?.timezone ?? "UTC");
  const organizations = useOrganizations("");
  const createOrganization = useCreateOrganization();
  const save = () => {
    const next = name.trim() || "Demo workspace";
    setName(next);
    auth.updateProfile.mutate({ displayName: next, locale, timezone });
  };
  const create = () => {
    createOrganization.mutate({ name: "New organization", code: "NEW", ownerEmail: auth.user?.email ?? "demo@benchmark.erp", ownerPassword: "Password123!", ownerDisplayName: nextName(name) });
  };
  return <div className="page-stack"><div className="page-heading compact"><div><p className="eyebrow">Account</p><h1>Profile and access</h1><p className="lede">Your global identity and the organizations you can operate.</p></div><button type="button" className="button primary" aria-label="Save profile changes" onClick={save} disabled={auth.updateProfile.isPending}>Save changes</button></div><div className="profile-grid"><section className="card form-card"><div className="card-header"><div><h2>Personal profile</h2><p>Visible across every organization membership.</p></div></div><div className="form-grid"><label htmlFor="profile-name">Display name</label><input id="profile-name" aria-label="Display name" value={name} onChange={(event) => setName(event.target.value)} /><label htmlFor="profile-email">Email</label><input id="profile-email" aria-label="Email" value={auth.user?.email ?? "demo@benchmark.erp"} readOnly /><label htmlFor="profile-locale">Locale</label><select id="profile-locale" aria-label="Locale" value={locale} onChange={(event) => setLocale(event.target.value)}><option value="en">English</option><option value="ko">Korean</option></select><label htmlFor="profile-timezone">Timezone</label><select id="profile-timezone" aria-label="Timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)}><option value="UTC">UTC</option><option value="Asia/Seoul">Asia/Seoul</option></select></div></section><section className="card form-card"><div className="card-header"><div><h2>Organization memberships</h2><p>Switching context changes every subsequent query and command.</p></div><button type="button" className="button secondary" aria-label="Create organization" onClick={create}>New organization</button></div><p className="muted">{organizations.data?.data.length ?? 0} organizations available.</p><div className="membership-list">{auth.memberships.map((membership) => <div className="membership-row" key={membership.id}><span className="org-mark">O</span><span><strong>{membership.organization.id}</strong><small>{membership.roles.join(" /")}</small></span><span className={`status status-${membership.status}`}>{membership.status}</span>{membership.status === "active" && <button type="button" className="button tertiary" aria-label={`Use ${membership.organization.id}`} onClick={() => auth.selectOrganization.mutate(membership.id)} disabled={auth.selectOrganization.isPending}>Use</button>}</div>)}</div></section></div></div>;
}

function nextName(value: string): string {
  return value.trim() || "Demo workspace";
}
