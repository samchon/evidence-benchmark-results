import { useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { useSession } from "@/lib/session";
import { useAuthActions, useHealth } from "@/lib/hooks";
import { Button } from "@/components/ui";

export function AppFrame() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const { session } = useSession();
  const auth = useAuthActions();
  const health = useHealth();
  useEffect(() => {
    mainRef.current?.focus();
  }, [location.pathname, location.search, mainRef]);
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">reddit / requirements</Link>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/popular">Popular</NavLink>
          <NavLink to="/communities">Communities</NavLink>
          {session !== null ? <NavLink to="/subscriptions">Subscriptions</NavLink> : null}
        </nav>
        <div className="account-nav">
          {session === null ? <NavLink to="/auth">Sign in</NavLink> : <>
            <NavLink to={`/u/${encodeURIComponent(session.user.username)}`}>{session.user.username}</NavLink>
            <NavLink to="/settings">Settings</NavLink>
            <Button variant="quiet" disabled={auth.logout.isPending} action={() => auth.logout.mutate()}>
              Sign out
            </Button>
          </>}
        </div>
      </header>
      <div className="connection-strip" role="status">
        <span className={`health-dot ${health.isError ? "offline" : ""}`} aria-hidden="true" />
        {health.isPending ? "Connecting to the API" : health.isError ? "API connection unavailable" : "API connected"}
      </div>
      <main className="content" ref={mainRef} tabIndex={-1}><Outlet /></main>
      <footer className="footer">Public discussion with scoped community authority.</footer>
    </div>
  );
}
