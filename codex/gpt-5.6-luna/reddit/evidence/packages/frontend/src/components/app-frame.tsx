import { useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearSession, storedRefreshToken } from "@/lib/client";
import { useAuth, useSession } from "@/lib/reddit/hooks";

const navClass = ({ isActive }: { isActive: boolean }) => isActive ? "nav-link active" : "nav-link";

/** Provides the persistent navigation, session affordances, and responsive content frame. */
export function AppFrame() {
  const session = useSession();
  const auth = useAuth();
  const navigate = useNavigate();
  const signedIn = session === "authenticated";

  useEffect(() => {
    if (session !== "authenticated") return;
    const refreshToken = storedRefreshToken();
    if (refreshToken === null) return;
    auth.refresh.mutate({ refreshToken }, { onError: () => clearSession() });
  }, [session, auth, storedRefreshToken]);

  const signOut = () => {
    auth.logout.mutate(undefined, { onSettled: () => { void navigate("/feed"); } });
  };

  return <div className="app-shell"><header className="topbar"><Link className="brand" to="/feed" aria-label="Reddit home"><span className="brand-mark">r/</span><span>field notes</span></Link><nav className="primary-nav" aria-label="Primary navigation"><NavLink className={navClass} to="/feed">Feed</NavLink><NavLink className={navClass} to="/communities">Communities</NavLink>{signedIn && <NavLink className={navClass} to="/subscriptions">Subscriptions</NavLink>}{signedIn && <NavLink className={navClass} to="/settings">Settings</NavLink>}</nav><div className="topbar-actions">{session === "restoring" && <span className="muted">Restoring session…</span>}{!signedIn && session !== "restoring" && <Link className="button button-small" to="/auth">Sign in</Link>}{signedIn && <button type="button" className="button button-small button-quiet" onClick={signOut} disabled={auth.logout.isPending}>Sign out</button>}</div></header><main className="content-shell"><Outlet /></main><footer className="site-footer"><span>Thoughtful conversations, durable context.</span><Link to="/health">Service status</Link></footer></div>;
}
