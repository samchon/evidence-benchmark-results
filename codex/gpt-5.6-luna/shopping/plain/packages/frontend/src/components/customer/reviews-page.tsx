/* Native controls are rendered by the design-system Button wrapper. */
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import * as api from "@benchmark/shopping-api";
import { useState } from "react";

import { Button, Card, Field, PageHeader } from "@/components/ui";
import { toErrorMessage } from "@/lib/utils";
import { useReviewSnapshots, useShoppingOperations } from "@/lib/shopping/hooks";

export function ReviewsPage() {
  const operations = useShoppingOperations();
  const [orderId, setOrderId] = useState("");
  const [productId, setProductId] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [rating, setRating] = useState<api.IShoppingReview["rating"]>(5);
  const [reviewText, setReviewText] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const snapshots = useReviewSnapshots(reviewId, { page: 1, limit: 20 }, reviewId !== "");
  const run = async (action: () => Promise<unknown>, success: string) => { if (busy) return; setBusy(true); setError(null); setMessage(null); try { await action(); setMessage(success); } catch (caught) { setError(toErrorMessage(caught)); } finally { setBusy(false); } };
  const body: api.IShoppingReview.ICreate = { rating, text: reviewText || null };
  const publish = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const review = await operations.customer.reviewCreate(orderId, productId, body);
      setReviewId(review.id);
      setMessage("Review published. Its ID is ready for later edits or retirement.");
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  return <section className="page"><PageHeader eyebrow="Customer / reviews" title="Verified feedback" detail="Reviews are available only for delivered purchases and remain editable or retireable by their author." /><Card className="form-card"><Field label="Order ID" value={orderId} onChange={(event) => setOrderId(event.target.value)} required /><Field label="Product ID" value={productId} onChange={(event) => setProductId(event.target.value)} required /><Field label="Existing review ID (for edit or retire)" value={reviewId} onChange={(event) => setReviewId(event.target.value)} hint="After publishing, the review ID is filled here so you can edit or retire your own review." /><label className="field"><span>Rating</span><select value={rating} onChange={(event) => setRating(Number(event.target.value) as api.IShoppingReview["rating"])}><option value={5}>5</option><option value={4}>4</option><option value={3}>3</option><option value={2}>2</option><option value={1}>1</option></select></label><Field label="Review text" value={reviewText} onChange={(event) => setReviewText(event.target.value)} /><div className="button-row"><Button disabled={orderId === "" || productId === ""} onClick={() => void publish()}>Publish review</Button><Button tone="quiet" disabled={reviewId === ""} onClick={() => void run(() => operations.customer.reviewUpdate(reviewId, body), "Review updated.")}>Update review</Button><Button tone="danger" disabled={reviewId === ""} onClick={() => void run(() => operations.customer.reviewDelete(reviewId), "Review retired.")}>Retire review</Button></div></Card>{reviewId === "" ? null : <Card><h2>Immutable review evidence</h2>{snapshots.isPending ? <p className="muted">Loading review history...</p> : snapshots.error !== null && snapshots.error !== undefined ? <p className="form-message error">{toErrorMessage(snapshots.error)}</p> : snapshots.data?.data.length === 0 ? <p className="muted">No review snapshots recorded.</p> : snapshots.data?.data.map((snapshot) => <div className="request-row" key={snapshot.id}><div><strong>{snapshot.kind}</strong><small>{snapshot.changed.join(", ")} - {snapshot.createdAt}</small><pre>{JSON.stringify({ before: snapshot.before, after: snapshot.after }, null, 2)}</pre></div></div>)}</Card>}{error === null ? null : <p className="form-message error" role="alert">{error}</p>}{message === null ? null : <p className="form-message success" role="status">{message}</p>}</section>;
}

export default ReviewsPage;
