import { EmptyState, ErrorState, LoadingState, PageHeader, Panel, Metric } from "@/components/ui/primitives";
import { useReport } from "@/lib/erp/hooks";
import { formatDate } from "@/lib/utils";

export function PeoplePage() {
  const people = useReport("headcount");
  const contracts = useReport("contract_history");
  const projects = useReport("timesheet_status");
  const queries = [people, contracts, projects];
  if (queries.some((query) => query.isPending)) return <LoadingState />;
  if (queries.some((query) => query.error)) return <ErrorState message="People reports could not be loaded." retry={() => { queries.forEach((query) => { void query.refetch(); }); }} />;
  const rows = queries.flatMap((query) => query.data?.rows ?? []).slice(0, 12);
  return <div className="page"><PageHeader eyebrow="People and projects" title="People workbench" description="Keep employee, contract, project, and time signals visible to the people responsible for them." /><div className="metric-grid"><Metric label="Headcount rows" value={String(people.data?.rows.length ?? 0)} detail="Organization scope" /><Metric label="Contract records" value={String(contracts.data?.rows.length ?? 0)} detail="History retained" /><Metric label="Time status" value={String(projects.data?.rows.length ?? 0)} detail="Current report" /></div><Panel title="People signals" eyebrow="Live reporting">{rows.length === 0 ? <EmptyState title="No people signals" message="Create an employee or approved timesheet to populate this view." /> : <div className="signal-list">{rows.map((row, index) => <div className="signal-row" key={`${row.label}-${index}`}><span>{row.label}</span><strong>{row.value}</strong></div>)}<small className="muted">Report timestamps are selected by the backend; the workspace does not recompute totals.</small>{people.data?.generatedAt ? <small className="muted">Updated {formatDate(people.data.generatedAt)}</small> : null}</div>}</Panel></div>;
}
