/* Native controls are rendered by the design-system Button wrapper. */
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import { useState } from "react";

import { Button, Card, EmptyState, ErrorState, Field, LoadingState, PageHeader, StatusPill } from "@/components/ui";
import { useSellerApplications, useSellerStatus, useShoppingOperations } from "@/lib/shopping/hooks";
import { formatDate, toErrorMessage } from "@/lib/utils";

export function SellerApplicationsReviewPage() {
  const [page, setPage] = useState(1);
  const query = useSellerApplications({ page, limit: 20 });
  const status = useSellerStatus();
  const operations = useShoppingOperations();
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const run = async (action: () => Promise<unknown>, success: string) => { if (busy) return; setBusy(true); setError(null); setMessage(null); try { await action(); setMessage(success); } catch (caught) { setError(toErrorMessage(caught)); } finally { setBusy(false); } };
  if (query.isPending || status.isPending) return <section className="page"><LoadingState /></section>;
  const queryError = query.error ?? status.error;
  if (queryError !== null && queryError !== undefined) return <section className="page"><ErrorState error={queryError} onRetry={() => void Promise.all([query.refetch(), status.refetch()])} /></section>;
  return <section className="page"><PageHeader eyebrow="Seller / approval" title="Approval and applications" detail="Rejection stays visible as history; resubmission and administrator applications create explicit new decisions." action={<StatusPill value={status.data?.approvalState ?? "unknown"} />} /><Card className="form-card"><h2>Seller approval</h2><p>{status.data?.rejectionReason ?? "No current rejection reason."}</p>{status.data?.approvalState === "rejected" ? <><Field label="Resubmission note" value={reason} onChange={(event) => setReason(event.target.value)} required /><Button disabled={reason.trim() === ""} onClick={() => void run(() => operations.seller.resubmit(), "Seller approval resubmitted.")}>Resubmit approval</Button></> : null}</Card><Card className="form-card"><h2>Administrator application</h2><Field label="Reason" value={reason} onChange={(event) => setReason(event.target.value)} required /><Button disabled={reason.trim() === ""} onClick={() => void run(() => operations.seller.applicationApply({ reason }), "Administrator application submitted.")}>Apply for administrator authority</Button></Card><Card><h2>Decision history</h2>{query.data?.data.length === 0 ? <EmptyState title="No applications" detail="No administrator application has been submitted." /> : query.data?.data.map((application) => <div className="request-row" key={application.id}><div><strong>{application.status}</strong><small>{formatDate(application.createdAt)}{application.decidedAt === null ? "" : ` - decided ${formatDate(application.decidedAt)}`}</small><p>{application.reason}</p></div><StatusPill value={application.status} /></div>)}<Pagination current={query.data?.pagination.current ?? page} pages={query.data?.pagination.pages ?? 1} onChange={setPage} /></Card>{error === null ? null : <p className="form-message error" role="alert">{error}</p>}{message === null ? null : <p className="form-message success" role="status">{message}</p>}</section>;
}

function Pagination(props: { current: number; pages: number; onChange: (page: number) => void }) {
  return <div className="pagination"><Button tone="quiet" disabled={props.current <= 1} onClick={() => props.onChange(props.current - 1)}>Previous</Button><span>Page {props.current} of {Math.max(props.pages, 1)}</span><Button tone="quiet" disabled={props.current >= props.pages} onClick={() => props.onChange(props.current + 1)}>Next</Button></div>;
}

export default SellerApplicationsReviewPage;
