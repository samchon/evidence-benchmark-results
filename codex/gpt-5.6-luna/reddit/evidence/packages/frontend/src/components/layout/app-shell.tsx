import { Link, useNavigate } from "react-router-dom";

import { useAuthSession, useHealth, useLogout, useLogoutAll } from "@/lib/auth/hooks";

export function AppShell(props: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { session, authenticated } = useAuthSession();
  const health = useHealth();
  const logout = useLogout();
  const logoutAll = useLogoutAll();
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">reddit2</Link>
        <nav aria-label="Primary navigation">
          <Link to="/communities">Communities</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/settings">Settings</Link>
          {authenticated ? (
            <>
              <button type="button" onClick={() => { void logout.mutateAsync().then(() => navigate("/login")); }}>Log out</button>
              <button type="button" onClick={() => { void logoutAll.mutateAsync().then(() => navigate("/login")); }}>Revoke all</button>
            </>
          ) : <Link to="/login">Log in</Link>}
        </nav>
        <span className={health.isError ? "status error" : "status"} aria-live="polite">
          {health.isPending ? "Checking API" : health.isError ? "API unavailable" : "API ready"}
        </span>
        {session ? <span className="identity">@{session.username}</span> : null}
      </header>
      <main className="content">{props.children}</main>
    </div>
  );
}
