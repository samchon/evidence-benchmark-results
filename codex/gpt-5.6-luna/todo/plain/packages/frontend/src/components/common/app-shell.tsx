import { useEffect } from "react";
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth-hooks";
import { useHealth, useLogout } from "@/lib/api-hooks";

export function AppShell() {
  const { session, status, signOut } = useAuth();
  const logout = useLogout();
  const health = useHealth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (logout.isSuccess) {
      signOut();
      void navigate("/auth?mode=login", { replace: true });
    }
  }, [logout.isSuccess, navigate, signOut]);

  if (status === "restoring")
    return <div className="boot-screen" role="status" aria-live="polite"><span className="spinner" />Restoring your private workspace...</div>;
  if (status === "anonymous" || session === null)
    return <Navigate replace to={`/auth?returnTo=${encodeURIComponent(location.pathname + location.search)}`} />;

  const initials = session.user.displayName.slice(0, 2).toUpperCase();
  return (
    <div className="app-frame">
      <aside className="sidebar">
        <div className="brand-mark">
          <span aria-hidden="true">✦</span>
          <div><strong>daymark</strong><small>private workroom</small></div>
        </div>
        <nav className="primary-nav" aria-label="Workspace">
          <NavLink to="/app" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <span aria-hidden="true">•</span>Active todos
          </NavLink>
          <NavLink to="/trash" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <span aria-hidden="true">□</span>Trash
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <span aria-hidden="true">○</span>Account
          </NavLink>
        </nav>
        <div className="sidebar-foot">
          <div className="avatar" aria-hidden="true">{initials}</div>
          <div className="person"><strong>{session.user.displayName}</strong><span>Private profile</span></div>
          <button
            type="button"
            className="icon-button"
            aria-label="Sign out"
            title="Sign out"
            disabled={logout.isPending}
            onClick={() => { void logout.mutateAsync().catch((error: unknown) => toast.error(String(error))); }}
          >
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span aria-hidden="true">/</span> {location.pathname === "/app" ? "Active todos" : location.pathname === "/trash" ? "Trash" : "Account"}</div>
          <div className="connection-state"><span aria-hidden="true" className={health.isSuccess ? "status-dot" : "status-dot muted"} />{health.isSuccess ? "Synced just now" : "Checking sync"}</div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}

export function PageHeader(props: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="page-header"><div><p className="eyebrow">{props.eyebrow}</p><h1>{props.title}</h1><p className="lede">{props.description}</p></div>{props.action}</div>;
}
