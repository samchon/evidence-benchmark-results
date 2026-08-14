import { useState } from "react";

import { Button, EmptyState, ErrorState, Field, LoadingState, PageHeader, Panel, Metric } from "@/components/ui/primitives";
import { useMrpActions, useMrpRecommendations, useMrpRuns, useReport } from "@/lib/erp/hooks";
import { errorMessage, formatDate, formatMoney } from "@/lib/utils";

function quantity(value: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
}

function horizon(): { horizonFrom: string; horizonTo: string } {
  const from = new Date();
  const to = new Date(from);
  to.setUTCDate(to.getUTCDate() + 30);
  return { horizonFrom: from.toISOString(), horizonTo: to.toISOString() };
}

export function PlanningPage() {
  const mrpReport = useReport("mrp_recommendations");
  const production = useReport("production_order_status");
  const quality = useReport("inspection_failures");
  const maintenance = useReport("maintenance_backlog");
  const runs = useMrpRuns();
  const latestRun = runs.data?.data[0] ?? null;
  const recommendations = useMrpRecommendations(latestRun?.id ?? null);
  const actions = useMrpActions();
  const [dismissReason, setDismissReason] = useState("Demand no longer requires this recommendation.");
  const queries = [mrpReport, production, quality, maintenance, runs, recommendations];

  if (queries.some((query) => query.isPending)) return <LoadingState />;
  if (queries.some((query) => query.error)) return <ErrorState message="Planning data could not be loaded." retry={() => { queries.forEach((query) => { void query.refetch(); }); }} />;
  const reportQueries = [mrpReport, production, quality, maintenance];
  const rows = reportQueries.flatMap((query) => query.data?.rows ?? []).slice(0, 16);

  return <div className="page">
    <PageHeader
      eyebrow="Planning / quality / maintenance"
      title="Planning workbench"
      description="Connect demand, production, inspection, and maintenance signals before they become blockers."
      action={<Button onPress={() => actions.run.mutate(horizon())} disabled={actions.run.isPending}>{actions.run.isPending ? "Running MRP..." : "Run MRP"}</Button>}
    />
    <div className="metric-grid"><Metric label="Recommendations" value={String(mrpReport.data?.rows.length ?? 0)} detail="MRP view" /><Metric label="Production rows" value={String(production.data?.rows.length ?? 0)} detail="Current order status" /><Metric label="Quality exceptions" value={String(quality.data?.rows.length ?? 0)} detail="Inspection failures" /><Metric label="Maintenance backlog" value={String(maintenance.data?.rows.length ?? 0)} detail="Open work" /></div>
    {actions.run.error === null ? null : <p className="state state-error" role="alert">{errorMessage(actions.run.error)}</p>}
    <Panel title="Latest MRP recommendations" eyebrow={latestRun === null ? "No run recorded" : `Run completed ${formatDate(latestRun.horizonTo)}`}>
      {latestRun === null || recommendations.data?.data.length === 0 ? <EmptyState title="No open recommendations" message="Run MRP to create source-linked purchase or production recommendations." /> : <div className="signal-list">
        {recommendations.data?.data.map((recommendation) => <div className="signal-row" key={recommendation.id}>
          <span><strong>{recommendation.recommendationType.replaceAll("_", " ")}</strong><small className="muted">{recommendation.rationale}</small></span>
          <span className="signal-actions"><strong>{quantity(recommendation.quantity)}</strong>{recommendation.recommendationType === "planned_purchase" ? <Button tone="quiet" onPress={() => actions.acceptPurchase.mutate(recommendation.id)} disabled={actions.acceptPurchase.isPending}>Create PO</Button> : recommendation.recommendationType === "planned_production" ? <Button tone="quiet" onPress={() => actions.acceptProduction.mutate(recommendation.id)} disabled={actions.acceptProduction.isPending}>Create production</Button> : null}<Button tone="danger" onPress={() => actions.dismiss.mutate({ id: recommendation.id, reason: dismissReason })} disabled={actions.dismiss.isPending}>Dismiss</Button></span>
        </div>)}
        <Field label="Dismissal reason"><input aria-label="Dismissal reason" value={dismissReason} onChange={(event) => setDismissReason(event.target.value)} /></Field>
      </div>}
    </Panel>
    <Panel title="Planning signals" eyebrow="Source-linked operational reports">
      {rows.length === 0 ? <EmptyState title="No planning signals" message="Run planning or create an operational record to populate this view." /> : <div className="signal-list">{rows.map((row, index) => <div className="signal-row" key={`${row.label}-${index}`}><span>{row.label}</span><strong>{formatMoney(row.value)}</strong></div>)}<small className="muted">{mrpReport.data?.generatedAt ? `Updated ${formatDate(mrpReport.data.generatedAt)}` : "Reports are loading from the live backend."}</small></div>}
    </Panel>
  </div>;
}
