/* Native controls are rendered by the design-system Button wrapper. */
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button, StatusPill } from "./ui";

const customerLinks = [
  ["/app", "Overview"], ["/app/catalog", "Catalog"], ["/app/wishlist", "Wishlist"],
  ["/app/cart", "Cart"], ["/app/orders", "Orders"], ["/app/profile", "Profile"], ["/app/addresses", "Addresses"], ["/app/applications", "Applications"], ["/app/reviews", "Reviews"], ["/app/account", "Account"],
] as const;
const sellerLinks = [
  ["/app/seller", "Seller desk"], ["/app/seller/products", "Products"], ["/app/seller/fulfillment", "Fulfillment"],
  ["/app/seller/profile", "Shop profile"], ["/app/seller/applications", "Applications"], ["/app/seller/account", "Account"],
] as const;

export function AppFrame() {
  const { session, actorType, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  if (session === null || actorType === null) return <Outlet />;
  const links = actorType === "customer" ? customerLinks : sellerLinks;
  return <div className="app-shell">
    <aside className="sidebar">
      <Link className="brand" to="/app"><span className="brand-mark">B</span><span><strong>bench / shop</strong><small>commerce desk</small></span></Link>
      <div className="actor-card"><span className="actor-label">Signed in as</span><strong>{actorType === "customer" ? "Customer" : "Seller"}</strong><StatusPill value="Live" tone="good" /></div>
      <nav aria-label="Primary navigation">
        <p className="nav-label">Workspace</p>
        {links.map(([href, label]) => <NavLink className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} to={href} key={href}>{label}</NavLink>)}
      </nav>
      <div className="sidebar-footer"><p className="muted">{location.pathname}</p><Button tone="quiet" onClick={() => void signOut().then(() => navigate("/login"))}>Sign out</Button></div>
    </aside>
    <main className="main-content"><div className="mobile-bar"><Link className="brand" to="/app"><span className="brand-mark">B</span><strong>bench / shop</strong></Link><Button tone="quiet" onClick={() => void signOut().then(() => navigate("/login"))}>Sign out</Button></div><Outlet /></main>
  </div>;
}
