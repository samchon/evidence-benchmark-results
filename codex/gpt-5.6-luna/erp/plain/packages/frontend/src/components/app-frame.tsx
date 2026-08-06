import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/hooks";

const groups = [
  { label: "Overview", items: [{ key: "dashboard", label: "Dashboard", icon: "D" }] },
  { label: "Finance", items: [{ key: "account", label: "Ledger accounts", icon: "A" }, { key: "journal", label: "Journals", icon: "J" }, { key: "reports", label: "Reports", icon: "R" }] },
  { label: "Operations", items: [{ key: "vendor", label: "Vendors", icon: "V" }, { key: "purchase-order", label: "Purchase orders", icon: "P" }, { key: "customer", label: "Customers", icon: "C" }, { key: "sales-order", label: "Sales orders", icon: "S" }] },
  { label: "Inventory", items: [{ key: "item", label: "Items", icon: "I" }, { key: "warehouse", label: "Warehouses", icon: "W" }, { key: "stock", label: "Stock on hand", icon: "Q" }] },
  { label: "People and work", items: [{ key: "employee", label: "Employees", icon: "E" }, { key: "project", label: "Projects", icon: "P" }, { key: "payroll", label: "Payroll", icon: "Y" }] },
  { label: "Manufacturing and service", items: [{ key: "manufacturing", label: "Production", icon: "M" }, { key: "quality", label: "Quality", icon: "Q" }, { key: "assets", label: "Assets", icon: "F" }, { key: "service", label: "Service cases", icon: "T" }] },
] as const;

export function AppFrame() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  if (auth.status === "anonymous") return <Navigate replace to="/login" />;
  if (auth.status === "restoring") return <main className="content"><div className="loading-state" role="status">Restoring your session</div></main>;
  if (!auth.activeMembershipId && location.pathname !== "/profile") return <main className="content"><div className="error-state" role="alert"><strong>Select an active organization</strong><p>Choose the organization you want to operate before opening ERP data.</p><button type="button" className="button secondary" onClick={() => { void navigate("/profile"); }}>Choose organization</button></div></main>;
  const signOut = () => { void auth.logout.mutateAsync().catch(() => undefined); void navigate("/login"); };
  return <div className="app-frame"><aside className="sidebar"><div className="brand"><span className="brand-mark">b</span><span>benchmark<span className="brand-muted">/erp</span></span></div><div className="workspace-switcher"><span className="avatar">{(auth.user?.displayName ?? "D").slice(0, 1)}</span><span><strong>{auth.user?.displayName ?? "Demo workspace"}</strong><small>Operations team</small></span><span className="chevron">v</span></div><nav aria-label="Primary navigation" className="side-nav">{groups.map((group) => <div className="nav-group" key={group.label}><span className="nav-label">{group.label}</span>{group.items.map((item) => <NavLink key={item.key} to={item.key === "dashboard" ? "/" : `/modules/${item.key}`} className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}><span className="nav-icon">{item.icon}</span>{item.label}</NavLink>)}</div>)}</nav><div className="sidebar-footer"><NavLink to="/profile" className="nav-item"><span className="nav-icon">U</span>Profile and access</NavLink><button className="nav-item nav-button" type="button" onClick={signOut}><span className="nav-icon">X</span>Sign out</button></div></aside><div className="main-column"><header className="topbar"><button className="mobile-menu" type="button" aria-label="Open navigation">Menu</button><div className="breadcrumbs">Workspace <span>/</span> <strong>FY 2026</strong></div><div className="top-actions"><button className="icon-button" type="button" aria-label="Search">Search</button><button className="icon-button" type="button" aria-label="Notifications">Alerts</button><button className="top-user" type="button" aria-label="Open profile" onClick={() => { void navigate("/profile"); }}><span className="avatar avatar-small">{(auth.user?.displayName ?? "D").slice(0, 1)}</span><span>{auth.user?.displayName ?? "Demo"}</span><span>v</span></button></div></header><main className="content"><Outlet /></main></div></div>;
}
