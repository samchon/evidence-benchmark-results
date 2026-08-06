import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export function PageFrame(props: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="shell app-shell">
      <header className="topbar">
        <Link className="brand" to="/">benchmark-shopping2</Link>
        <nav aria-label="Primary navigation">
          <Link to="/customer">Customer</Link>
          <Link to="/seller">Seller</Link>
          <Link to="/admin">Admin</Link>
          <Link to="/operations">Operations</Link>
        </nav>
      </header>
      <section className="panel page-panel">
        <p className="eyebrow">Live workspace</p>
        <h1>{props.title}</h1>
        <p className="muted">{props.subtitle}</p>
        {props.children}
      </section>
    </main>
  );
}

export function StatusCard(props: { label: string; value: string; action?: ReactNode }) {
  return <article className="status-card"><span>{props.label}</span><strong>{props.value}</strong>{props.action}</article>;
}
