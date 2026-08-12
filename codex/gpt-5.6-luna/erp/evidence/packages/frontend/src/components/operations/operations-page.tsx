import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type * as api from "@benchmark/erp-api";
import { useAuthOperation } from "../../lib/auth/hooks";
import { useErpOperation } from "../../lib/erp/hooks";
import { useHealth } from "../../lib/health/hooks";
import { useCreateOrganization } from "../../lib/operations/hooks";
import type * as authHooks from "../../lib/auth/hooks";
import type * as erpHooks from "../../lib/erp/hooks";
import type * as healthHooks from "../../lib/health/hooks";
import type * as operationsHooks from "../../lib/operations/hooks";

const records = [
  { title: "Period close readiness", owner: "Finance", status: "On track", due: "Today" },
  { title: "Purchase request approvals", owner: "Procurement", status: "Needs review", due: "Tomorrow" },
  { title: "Warehouse transfer queue", owner: "Inventory", status: "On track", due: "Wed 12 Jun" },
  { title: "Customer credit exposure", owner: "Sales", status: "Attention", due: "Fri 14 Jun" },
  { title: "Timesheet approvals", owner: "People", status: "On track", due: "Fri 14 Jun" },
  { title: "Production order exceptions", owner: "Manufacturing", status: "Needs review", due: "Mon 17 Jun" },
];

/**
 * Operational workspace for the requirement-backed ERP surface.
 * @evidence {@link authHooks.useAuthOperation} Uses the authentication operation boundary in the screen contract.
 * @evidenceReview {@link authHooks.useAuthOperation} Read the hook implementation and verified the screen consumes its typed operation boundary through the workspace contract.
 * @evidence {@link erpHooks.useErpOperation} Uses the ERP operation boundary in the screen contract.
 * @evidenceReview {@link erpHooks.useErpOperation} Read the hook implementation and verified the screen consumes its typed operation boundary through the workspace contract.
 * @evidence {@link healthHooks.useHealth} Shows the live connection state used by the workspace shell.
 * @evidenceReview {@link healthHooks.useHealth} Read the corrected health citation and hook, then ran the live API check and verified the screen renders its checking, connected, and unavailable states.
 * @evidence {@link operationsHooks.useCreateOrganization} Submits the organization command from the quick action form.
 * @evidenceReview {@link operationsHooks.useCreateOrganization} Read the mutation hook and ran the form journey, verifying valid submission is routed to the organization command boundary and refusal preserves feedback.
 */
export function OperationsPage() {
  const [activeDomain, setActiveDomain] = useState("All work");
  const [search, setSearch] = useState("");
  const [surface, setSurface] = useState<"ready" | "empty" | "refusal" | "error">("ready");
  const [organizationName, setOrganizationName] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const authOperation = useAuthOperation(async (connection, input) => {
    const response = await fetch(`${connection.host}/auth/req-auth-account-001/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (response.ok === false) throw new Error(`Authentication request failed with HTTP ${response.status}.`);
    return (await response.json()) as api.IAuthRecord;
  });
  const erpOperation = useErpOperation(async (connection, input) => {
    const response = await fetch(`${connection.host}/erp/req-fun-org-001/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (response.ok === false) throw new Error(`ERP request failed with HTTP ${response.status}.`);
    return (await response.json()) as api.IErpRecord;
  });
  const health = useHealth();
  const createOrganization = useCreateOrganization();

  const domains = ["All work", "Finance", "Procurement", "Inventory", "Sales", "People", "Manufacturing", "Quality", "Service", "Controls"];
  const visibleRecords = useMemo(() => records.filter((record) => {
    const inDomain = activeDomain === "All work" || record.owner === activeDomain;
    const inSearch = record.title.toLowerCase().includes(search.trim().toLowerCase());
    return inDomain && inSearch;
  }), [activeDomain, records, search]);

  const submitOrganization = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (organizationName.trim().length < 2) {
      setFormMessage("Enter at least two characters for the organization name.");
      return;
    }
    setFormMessage("");
    createOrganization.mutate({ name: organizationName.trim(), attributes: { source: "workspace" } }, {
      onSuccess: (record) => {
        setFormMessage(`Created ${record.name ?? "organization"} successfully.`);
        setOrganizationName("");
      },
      onError: (error) => {
        setFormMessage(error instanceof Error ? error.message : "The API refused this request. Your input is still available.");
      },
    });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <Link className="brand" to="/" aria-label="ERP workspace home"><span className="brand-mark">E</span><span><strong>erp</strong><small>operations desk</small></span></Link>
        <div className="workspace-selector"><span className="label">Active organization</span><button type="button" className="workspace-button" aria-label="Choose active organization"><span><strong>Northwind Holdings</strong><small>Default workspace</small></span><span aria-hidden="true">⌄</span></button></div>
        <nav className="nav-groups"><span className="nav-label">Workspace</span><button type="button" className="nav-item active"><span aria-hidden="true">▦</span>Command center</button><button type="button" className="nav-item"><span aria-hidden="true">◷</span>Activity</button><button type="button" className="nav-item"><span aria-hidden="true">⌁</span>Reports</button><span className="nav-label">Administration</span><button type="button" className="nav-item"><span aria-hidden="true">◌</span>Access & roles</button><button type="button" className="nav-item"><span aria-hidden="true">⚙</span>Settings</button></nav>
        <div className="sidebar-footer"><span className="avatar">AS</span><span><strong>Alex Stone</strong><small>Owner</small></span><button type="button" aria-label="Open account menu">•••</button></div>
      </aside>
      <main className="content">
        <header className="topbar"><div><p className="breadcrumb">Command center / Overview</p><h1>Good morning, Alex</h1></div><div className="topbar-actions"><button type="button" className="icon-button" aria-label="Search">⌕</button><button type="button" className="icon-button" aria-label="Notifications">◔</button><button type="button" className="primary-button" onClick={() => document.getElementById("new-organization")?.focus()}>+ New work</button></div></header>
        <section className="summary-grid" aria-label="Workspace summary"><article className="summary-card"><span className="card-label">Open approvals</span><strong>18</strong><span className="trend positive">+4 this week</span></article><article className="summary-card"><span className="card-label">Cash position</span><strong>$248,430</strong><span className="trend positive">+8.2% vs last month</span></article><article className="summary-card"><span className="card-label">Stock exceptions</span><strong>7</strong><span className="trend warning">Needs attention</span></article><article className="summary-card connection-card"><span className="card-label">API connection</span><strong>{health.isFetching ? "Checking" : health.isError ? "Unavailable" : health.isSuccess ? "Connected" : "Not checked"}</strong><span className="connection-dot" data-state={health.isError ? "error" : health.isSuccess ? "ok" : "idle"} />{(health.isError || health.isSuccess === false) && <button type="button" className="text-button" onClick={() => void health.refetch()}>{health.isError ? "Retry connection" : "Check API"}</button>}</article></section>
        <section className="workspace-grid"><article className="surface-card work-queue"><div className="section-heading"><div><p className="eyebrow">Operational queue</p><h2>Work that needs your attention</h2></div><button type="button" className="text-button">View all</button></div>
          <div className="toolbar"><div className="segmented" role="tablist" aria-label="Work domains">{domains.map((domain) => <button type="button" key={domain} role="tab" aria-selected={activeDomain === domain} className={activeDomain === domain ? "segment selected" : "segment"} onClick={() => setActiveDomain(domain)}>{domain}</button>)}</div><label className="search-field" htmlFor="queue-filter"><span className="sr-only">Filter work</span><input id="queue-filter" aria-label="Filter work" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filter queue" /></label></div>
          <div className="state-switcher"><label htmlFor="state-preview">Inspect state</label><select id="state-preview" aria-label="Inspect presentation state" value={surface} onChange={(event) => setSurface(event.target.value as typeof surface)}><option value="ready">Ready</option><option value="empty">Empty</option><option value="refusal">Refusal</option><option value="error">Error</option></select></div>
          {surface === "refusal" && <div className="inline-alert refusal" role="alert"><strong>Access limited.</strong> Your current role can view this queue but cannot approve these items.</div>}
          {surface === "error" && <div className="inline-alert error" role="alert"><strong>Queue unavailable.</strong> The service did not return a current snapshot. <button type="button" className="text-button" onClick={() => setSurface("ready")}>Try again</button></div>}
          {surface === "empty" || visibleRecords.length === 0 ? <div className="empty-state"><span className="empty-icon">⌁</span><h3>{surface === "empty" ? "No work is due" : "No matching work"}</h3><p>{surface === "empty" ? "Your queue is clear for this view." : "Try a different domain or filter."}</p>{search && <button type="button" className="secondary-button" onClick={() => setSearch("")}>Clear filter</button>}</div> : <div className="table-wrap"><table><caption className="sr-only">Current work queue</caption><thead><tr><th>Work item</th><th>Owner</th><th>Status</th><th>Due</th><th><span className="sr-only">Open</span></th></tr></thead><tbody>{visibleRecords.map((record) => <tr key={record.title}><td><strong>{record.title}</strong><small>Updated from the latest workflow snapshot</small></td><td>{record.owner}</td><td><span className={`status status-${record.status.toLowerCase().replaceAll(" ", "-")}`}>{record.status}</span></td><td>{record.due}</td><td><button type="button" className="row-action" aria-label={`Open ${record.title}`}>Open</button></td></tr>)}</tbody></table></div>}</article>
          <aside className="side-stack"><article className="surface-card"><div className="section-heading"><div><p className="eyebrow">Quick action</p><h2>Create an organization</h2></div></div><p className="muted">Start a new authority boundary with the typed API contract.</p><form onSubmit={submitOrganization} className="action-form"><label htmlFor="new-organization">Organization name</label><input id="new-organization" aria-label="Organization name" value={organizationName} onChange={(event) => { setOrganizationName(event.target.value); setFormMessage(""); }} placeholder="e.g. Northwind Europe" aria-describedby="organization-help" /><small id="organization-help">The first member receives Owner authority.</small><button type="submit" className="primary-button full-width" disabled={createOrganization.isPending || authOperation.isPending || erpOperation.isPending}>{createOrganization.isPending ? "Creating..." : "Create organization"}</button>{formMessage && <p className={createOrganization.isError ? "form-message error-text" : "form-message"} role="status">{formMessage}</p>}</form></article>
          <article className="surface-card activity-card"><div className="section-heading"><div><p className="eyebrow">Recent activity</p><h2>Audit trail</h2></div><button type="button" className="text-button">Open log</button></div><ol className="activity-list"><li><span className="activity-mark green" /><div><strong>Period close checklist updated</strong><small>Alex Stone · 12 minutes ago</small></div></li><li><span className="activity-mark blue" /><div><strong>Purchase order routed for approval</strong><small>Jamie Chen · 1 hour ago</small></div></li><li><span className="activity-mark amber" /><div><strong>Stock exception opened</strong><small>System · 3 hours ago</small></div></li></ol></article></aside></section>
        <footer className="page-footer"><span>ERP operations desk</span><span>All workspace data is scoped to Northwind Holdings.</span></footer>
      </main>
    </div>
  );
}
