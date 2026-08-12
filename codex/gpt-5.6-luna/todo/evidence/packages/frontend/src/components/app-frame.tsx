import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "@/lib/auth/session";
import { useLogout } from "@/lib/auth/hooks";
import { errorMessage } from "@/lib/utils";

export function AppFrame() {
  const session = useSession();
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    logout.mutate(undefined, { onSuccess: () => { void navigate("/login", { replace: true }); } });
  };
  return <div className="app-shell"><a className="skip-link" href="#main-content">Skip to content</a><header className="topbar"><Link className="brand" to="/todos"><span className="brand-mark">bt</span><span>benchmark<span className="brand-muted">/todo</span></span></Link><nav className="primary-nav" aria-label="Primary navigation"><NavLink to="/todos" className={({ isActive }) => isActive ? "active" : undefined}>Todos</NavLink><NavLink to="/trash" className={({ isActive }) => isActive ? "active" : undefined}>Trash</NavLink><NavLink to="/profile" className={({ isActive }) => isActive ? "active" : undefined}>Profile</NavLink></nav><div className="account-menu"><span className="account-id" title={session.session?.id}>{session.status === "authenticated" ? "Signed in" : "Guest"}</span><button type="button" className="button button-ghost" onClick={handleLogout} disabled={logout.isPending || location.pathname === "/login"}>{logout.isPending ? "Signing out" : "Sign out"}</button></div></header>{logout.error !== null && <div className="shell-alert"><p>{errorMessage(logout.error)}</p></div>}<main id="main-content" className="main-content"><Outlet /></main><footer className="footer"><span>Private workspace</span><span>Built for focused work</span></footer></div>;
}
