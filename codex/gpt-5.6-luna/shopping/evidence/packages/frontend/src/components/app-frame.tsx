import { Link, NavLink } from "react-router-dom";
import type { ReactNode } from "react";

import type { StoredSession } from "@/lib/client";

export function AppFrame(props: {
  session: StoredSession | null;
  onSignOut: () => void;
  children: ReactNode;
}) {
  const customer = props.session?.actor === "customer";
  const seller = props.session?.actor === "seller";
  const admin = (props.session?.identity.grades ?? []).some((grade) => grade.toLowerCase().includes("administrator"));
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">Common Thread<span>shop</span></Link>
        <nav aria-label="Primary navigation" className="primary-nav">
          <NavLink to="/catalog">Discover</NavLink>
          {customer && <NavLink to="/customer">My account</NavLink>}
          {seller && <NavLink to="/seller">Seller studio</NavLink>}
          {admin && <NavLink to="/admin">Administration</NavLink>}
        </nav>
        <div className="top-actions">
          {customer && <Link className="button button-quiet" to="/customer?tab=cart">Cart</Link>}
          {props.session ? <button className="button button-quiet" type="button" onClick={props.onSignOut}>Sign out</button> : <Link className="button button-dark" to="/auth">Sign in</Link>}
        </div>
      </header>
      <main className="page-content">{props.children}</main>
      <footer className="site-footer"><span>Common Thread shop</span><span>Clear commerce, carefully kept.</span></footer>
    </div>
  );
}
