import { Link } from "react-router-dom";

import { useAccounts, useAudit, useOrganization } from "@/lib/erp/hooks";
import { formatDate, formatMoney } from "@/lib/utils";
import { EmptyState, ErrorState, LoadingState, Metric, PageHeader, Panel } from "@/components/ui/primitives";

export function DashboardPage() {
  const organization = useOrganization();
  const accounts = useAccounts("", 1);
  const audit = useAudit(1);
  if (organization.isPending || accounts.isPending) return <LoadingState />;
  if (organization.error) return <ErrorState message={organization.error.message} retry={() => { void organization.refetch(); }} />;
  if (accounts.error) return <ErrorState message={accounts.error.message} retry={() => { void accounts.refetch(); }} />;
  const accountRows = accounts.data?.data ?? [];
  return <div className="page">
    <PageHeader eyebrow="Overview / operating pulse" title={`Good morning, ${organization.data?.name ?? "workspace"}.`} description="A clear view of the records, decisions, and next actions keeping the organization moving." action={<Link className="button button-primary" to="/app/finance/accounts">Open chart of accounts</Link>} />
    <div className="metric-grid"><Metric label="Active accounts" value={String(accounts.data?.pagination.records ?? 0)} detail="Current chart" /><Metric label="Base currency" value={organization.data?.baseCurrency ?? "USD"} detail="Organization setting" /><Metric label="Recent controls" value={String(audit.data?.data.length ?? 0)} detail="Latest audit events" /></div>
    <div className="content-grid"><Panel title="Recent activity" eyebrow="What changed"><div className="activity-list">{audit.isPending ? <LoadingState /> : audit.error ? <ErrorState message={audit.error.message} retry={() => { void audit.refetch(); }} /> : audit.data?.data.length === 0 ? <EmptyState title="No activity yet" message="Your first organization action will appear here." /> : audit.data?.data.slice(0, 5).map((event) => <div className="activity-row" key={event.id}><span className={`risk risk-${event.risk}`}>{event.risk}</span><div><strong>{event.action}</strong><small>{event.targetType} · {formatDate(event.createdAt)}</small></div><span className="mono">{event.actorId.slice(0, 8)}</span></div>)}</div></Panel><Panel title="Chart preview" eyebrow="Fast orientation" action={<Link className="text-link" to="/app/finance/accounts">View all</Link>}>{accountRows.length === 0 ? <EmptyState title="Start with an account" message="Build the chart that gives every posting a home." /> : <div className="preview-list">{accountRows.slice(0, 4).map((account) => <div className="preview-row" key={account.id}><span className="mono">{account.code}</span><strong>{account.name}</strong><span>{formatMoney(0, account.currency)}</span></div>)}</div>}</Panel></div>
  </div>;
}
