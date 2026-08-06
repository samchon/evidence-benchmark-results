import { Link } from "react-router-dom";
import { useDomainRows } from "@/lib/domain/hooks";
import { usePublishedOperations } from "@/lib/operations/hooks";

export function DashboardPage() {
  const operations = usePublishedOperations();
  const accounts = useDomainRows("account", "");
  const vendors = useDomainRows("vendor", "");
  const customers = useDomainRows("customer", "");
  const warehouses = useDomainRows("warehouse", "");
  const liveCounts = [
    ["Ledger accounts", accounts.data?.length ?? 0, "/modules/account"],
    ["Vendors", vendors.data?.length ?? 0, "/modules/vendor"],
    ["Customers", customers.data?.length ?? 0, "/modules/customer"],
    ["Warehouses", warehouses.data?.length ?? 0, "/modules/warehouse"],
  ] as const;
  const records = [
    ...(vendors.data ?? []).slice(0, 2).map((row) => [row.id ?? row.code ?? row.name ?? "Vendor", "Vendor record", row.name ?? "", row.status ?? "active"] as const),
    ...(customers.data ?? []).slice(0, 2).map((row) => [row.id ?? row.code ?? row.name ?? "Customer", "Customer record", row.name ?? "", row.status ?? "active"] as const),
  ];
  const loading = accounts.isPending || vendors.isPending || customers.isPending || warehouses.isPending;
  return <div className="page-stack">
    <div className="page-heading"><div><p className="eyebrow">Live organization workspace</p><h1>Good morning, your workspace is in rhythm.</h1><p className="lede">Operational counts and activity are loaded from the selected organization.</p></div><div className="heading-actions"><button className="button secondary" type="button" disabled={operations.length === 0}>Export snapshot</button><Link className="button primary" to="/modules/purchase-order">Purchase orders</Link></div></div>
    <section className="kpi-grid" aria-label="Live organization counts">{liveCounts.map(([label, count, href]) => <Link className="kpi-card" to={href} key={label}><div className="kpi-label"><span>{label}</span></div><strong>{loading ? "Loading" : count}</strong><div className="kpi-foot"><span className="trend neutral">Live</span><span>selected organization</span></div></Link>)}</section>
    <div className="dashboard-grid"><section className="card activity-card"><div className="card-header"><div><h2>Recent records</h2><p>From live organization data</p></div><Link to="/modules/reports" className="text-link">View reports</Link></div>{records.length === 0 ? <div className="empty-state" role="status">{loading ? "Loading live records…" : "Sign in and select an organization to load records."}</div> : <div className="table-wrap"><table><thead><tr><th>Reference</th><th>Event</th><th>Context</th><th>Status</th></tr></thead><tbody>{records.map((row) => <tr key={String(row[0])}><td><strong>{row[0]}</strong></td><td>{row[1]}</td><td className="muted">{row[2]}</td><td><span className={`status status-${row[3]}`}>{row[3]}</span></td></tr>)}</tbody></table></div>}</section><aside className="card attention-card"><div className="card-header"><div><h2>Published operations</h2><p>Typed SDK operations available to this app</p></div><span className="count-badge">{operations.length}</span></div><Link to="/operations" className="button secondary">Inspect operation contracts</Link></aside></div>
    <section className="quick-section"><div className="section-title"><div><h2>Continue your work</h2><p>Open a live module workspace.</p></div></div><div className="quick-grid"><Link to="/modules/vendor" className="quick-card"><span><strong>Vendors</strong><small>Supplier records and payment terms</small></span></Link><Link to="/modules/item" className="quick-card"><span><strong>Item catalog</strong><small>Inventory and service items</small></span></Link><Link to="/modules/project" className="quick-card"><span><strong>Projects</strong><small>Tasks and time evidence</small></span></Link></div></section>
  </div>;
}
