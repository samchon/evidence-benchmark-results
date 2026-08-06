import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useCreateDomain, useDomainRows, type DomainKey, type DomainRow } from "@/lib/domain/hooks";

const titles: Record<DomainKey, [string, string]> = {
  account: ["Ledger accounts", "Your chart of accounts and reporting dimensions."],
  budget: ["Budgets", "Plan, approve and monitor spending by period and dimension."],
  vendor: ["Vendors", "Supplier identity, contacts, terms and controlled changes."],
  item: ["Item catalog", "Inventory and service items with commercial and planning controls."],
  warehouse: ["Warehouses", "Sites, locations and the stock they hold."],
  customer: ["Customers", "Customer identity, credit and commercial relationships."],
  employee: ["Employees", "People, contracts, departments and self-service records."],
  project: ["Projects", "Projects, tasks, assignments and time evidence."],
  "purchase-order": ["Purchase orders", "Turn approved demand into controlled supplier commitments."],
  "sales-order": ["Sales orders", "Manage customer commitments from approval to fulfillment."],
  journal: ["Journal entries", "Draft, approve, post and preserve accounting evidence."],
  stock: ["Stock on hand", "Immutable movements roll up to available stock across locations."],
  payroll: ["Payroll runs", "Calculate, approve and post each concrete pay period."],
  assets: ["Fixed assets", "Acquire, capitalize, depreciate and retire owned assets."],
  manufacturing: ["Production orders", "Plan materials, operations and production cost evidence."],
  quality: ["Quality inspections", "Inspect, quarantine and disposition incoming goods."],
  service: ["Service cases", "Coordinate customer issues, work orders and resolution history."],
  reports: ["Reports", "Reconciled views derived from posted, immutable records."],
};

const value = (input: unknown): string =>
  input === undefined || input === null ? "Not set" : String(input).replaceAll("_", " ");

const creatableDomains = new Set<DomainKey>(["account", "vendor", "item", "warehouse", "customer"]);

export function ModulePage() {
  const { module = "account" } = useParams();
  const key = (module in titles ? module : "account") as DomainKey;
  const [title, description] = titles[key]!;
  const canCreate = creatableDomains.has(key);
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const [notice, setNotice] = useState("");
  const query = useDomainRows(key, search);
  const create = useCreateDomain(key);
  const rows: DomainRow[] = query.data ?? [];

  const searchChanged = (next: string) => {
    const nextParams = new URLSearchParams(params);
    if (next) nextParams.set("search", next);
    else nextParams.delete("search");
    setParams(nextParams, { replace: true });
  };

  const exportRows = () => {
    const csv = [
      ["reference", "record", "state", "status"],
      ...rows.map((row, index) => [
        row.code ?? row.number ?? row.name ?? row.id ?? `${title} ${index + 1}`,
        row.name ?? row.type ?? row.category ?? row.currencyCode ?? row.customer ?? row.vendor ?? "",
        row.quantity ?? row.total ?? row.amount ?? "Active",
        row.status ?? "active",
      ]),
    ]
      .map((line) => line.map((cell) => JSON.stringify(String(cell))).join(","))
      .join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = `${key}-export.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const createRecord = () =>
    create.mutate(undefined, {
      onSuccess: () => setNotice(`Created a ${title.toLowerCase()} record.`),
      onError: (error) =>
        setNotice(error instanceof Error ? error.message : `Unable to create ${title.toLowerCase()}.`),
    });

  return (
    <div className="page-stack">
      <div className="page-heading compact">
        <div>
          <p className="eyebrow">
            <Link aria-label="Return to workspace" to="/">Workspace</Link> / {title}
          </p>
          <h1>{title}</h1>
          <p className="lede">{description}</p>
        </div>
        {canCreate && <button
          type="button"
          className="button primary"
          aria-label={`Create ${title}`}
          onClick={createRecord}
          disabled={create.isPending}
        >
          New {title}
        </button>}
      </div>
      <div className="toolbar">
        <label aria-label="Search records" className="search-field" htmlFor="module-search">
          <input
            id="module-search"
            aria-label="Search records"
            placeholder={`Search ${title.toLowerCase()}`}
            value={search}
            onChange={(event) => searchChanged(event.target.value)}
          />
        </label>
        <div className="toolbar-actions">
          <button type="button" className="button secondary" aria-label="Filter records" onClick={() => setNotice("Filters are applied to the active organization and remain in this URL.")}>Filter</button>
          <button type="button" className="button secondary" aria-label="Export records" onClick={exportRows}>Export</button>
        </div>
      </div>
      {notice && <div className="notice" role="status">{notice}<button type="button" className="text-link" onClick={() => setNotice("")}>Dismiss</button></div>}
      <section className="card list-card">
        <div className="list-meta">
          <span>{rows.length} records</span>
          <span className="sync-state">{query.isFetching ? "Refreshing" : "Synced just now"}</span>
        </div>
        {query.isPending && <div className="loading-state" role="status">Loading {title.toLowerCase()}</div>}
        {query.error && <div className="error-state" role="alert"><strong>We could not load this view.</strong><button aria-label="Retry loading" type="button" className="text-link" onClick={() => { void query.refetch(); }}>Try again</button></div>}
        {!query.isPending && !query.error && rows.length === 0 && <div className="empty-state"><span className="empty-icon">Search</span><h2>No matches</h2><p>Sign in and select an organization to load records.</p></div>}
        {rows.length > 0 && <div className="table-wrap"><table><thead><tr><th>Reference</th><th>Record</th><th>State</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{rows.map((row, index) => <tr key={String(row.id ?? row.code ?? row.number ?? index)}><td><strong>{value(row.code ?? row.number ?? row.name ?? row.id ?? `${title} ${index + 1}`)}</strong></td><td>{value(row.name ?? row.type ?? row.category ?? row.currencyCode ?? row.customer ?? row.vendor)}</td><td>{value(row.quantity ?? row.total ?? row.amount ?? "Active")}</td><td><span className={`status status-${String(row.status ?? "active")}`}>{value(row.status ?? "active")}</span></td><td><button type="button" className="row-menu" aria-label={`Actions for ${value(row.name ?? row.code ?? row.id ?? index)}`} onClick={() => setNotice(`Lifecycle commands for this ${title.toLowerCase()} require an authenticated organization context.`)}>More</button></td></tr>)}</tbody></table></div>}
      </section>
    </div>
  );
}
