import { NavLink, Outlet } from "react-router-dom";

import { Button } from "@/components/ui/primitives";
import { useAuthActions, useOrganization } from "@/lib/erp/hooks";
import { useSession } from "@/lib/session-hooks";

const links = [
  ["/app", "Overview"],
  ["/app/finance/accounts", "Accounts"],
  ["/app/finance/journals", "Journals"],
  ["/app/finance/reports", "Reports"],
  ["/app/operations", "Operations"],
  ["/app/people", "People & projects"],
  ["/app/controls", "Controls"],
  ["/app/planning", "Planning"],
  ["/app/settings", "Settings"],
] as const;

export function AppFrame() {
  const { auth, selectedMembershipId } = useSession();
  const organization = useOrganization();
  const { logout, selectMembership } = useAuthActions();
  return <div className="app-frame">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">E</span><div><strong>Ledgerline</strong><small>ERP workspace</small></div></div>
      <div className="org-switcher"><span>Active organization</span><strong>{organization.data?.name ?? "Loading organization"}</strong><small>{organization.data?.baseCurrency ?? "Current context"}</small><label className="sr-only" htmlFor="organization-switcher">Switch organization</label><select id="organization-switcher" aria-label="Switch organization" value={selectedMembershipId ?? ""} onChange={(event) => { if (event.target.value !== "") void selectMembership.mutateAsync(event.target.value); }}>{auth?.memberships.filter((membership) => membership.status === "active").map((membership) => <option key={membership.id} value={membership.id}>{membership.organizationId}</option>)}</select></div>
      <nav aria-label="Main navigation">{links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/app"} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>{label}</NavLink>)}</nav>
      <div className="sidebar-footer"><span className="avatar">{auth?.user.displayName.slice(0, 1).toUpperCase() ?? "U"}</span><div className="user-name"><strong>{auth?.user.displayName ?? "Signed-in user"}</strong><small>{auth?.user.email}</small></div><Button tone="quiet" aria-label="Sign out" onPress={() => { void logout.mutateAsync(); }}>Sign out</Button></div>
    </aside>
    <main className="content"><Outlet /></main>
  </div>;
}
