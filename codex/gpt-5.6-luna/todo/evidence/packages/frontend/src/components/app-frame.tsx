import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAuthLogout } from "@/lib/auth/hooks";
import { useSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/ui";

/** Shared navigation and authenticated route boundary. */
export function AppFrame() {
  const session = useSession();
  const logout = useAuthLogout();
  const navigate = useNavigate();
  const location = useLocation();
  if (session.status === "restoring") return <main className="shell"><div className="page-loading">Restoring your private workspace</div></main>;
  if (session.status === "anonymous") return <Outlet />;
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/app">benchmark<span>/todo</span></Link>
        <nav aria-label="Primary navigation" className="nav-links">
          <NavLink to="/app" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Workspace</NavLink>
          <NavLink to="/trash" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Trash</NavLink>
          <NavLink to="/security" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Security</NavLink>
        </nav>
        <div className="topbar-actions" role="group" aria-label="Account actions">
          <span className="identity-chip">Signed in</span>
          <Button role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") event.currentTarget.click(); }} tone="quiet" disabled={logout.isPending} onClick={() => { void logout.mutate(undefined, { onSuccess: () => { void navigate(`/auth?from=${encodeURIComponent(location.pathname)}`); } }); }}>Sign out</Button>
        </div>
      </header>
      <main className="content"><Outlet /></main>
    </div>
  );
}
