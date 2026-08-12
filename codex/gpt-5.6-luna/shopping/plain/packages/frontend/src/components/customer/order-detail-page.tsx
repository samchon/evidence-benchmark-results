/* Native controls are rendered by the design-system Button wrapper. */
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button, Card, EmptyState, ErrorState, Field, LoadingState, PageHeader, StatusPill } from "@/components/ui";
import { useOrder, useOrderSnapshots, useShoppingOperations } from "@/lib/shopping/hooks";
import { formatDate, formatMoney, toErrorMessage } from "@/lib/utils";

export function OrderDetailPage() {
  const { id = "" } = useParams();
  const query = useOrder(id);
  const snapshots = useOrderSnapshots(id, { page: 1, limit: 20 });
  const operations = useShoppingOperations();
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const run = async (action: () => Promise<unknown>, success: string) => {
    if (busy) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await action();
      setMessage(success);
      void query.refetch();
      void snapshots.refetch();
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setBusy(false);
    }
  };
  if (query.isPending || snapshots.isPending) return <section className="page"><LoadingState /></section>;
  if (query.error !== null && query.error !== undefined) return <section className="page"><ErrorState error={query.error} onRetry={() => void query.refetch()} /></section>;
  if (snapshots.error !== null && snapshots.error !== undefined) return <section className="page"><ErrorState error={snapshots.error} onRetry={() => void snapshots.refetch()} /></section>;
  const order = query.data;
  if (order === undefined) return <section className="page"><EmptyState title="Order not found" detail="This order is not available to the signed-in customer." /></section>;
  return <section className="page">
    <Link className="back-link" to="/app/orders">All orders</Link>
    <PageHeader eyebrow="Customer / order detail" title={order.orderNumber} detail={formatDate(order.purchasedAt) + " · " + formatMoney(order.totalPrice)} action={<StatusPill value={order.status} />} />
    <Card><h2>Shipping destination</h2><p>{order.address.recipientName} · {order.address.recipientPhone}</p><p>{order.address.streetAddress}, {order.address.city}, {order.address.stateOrProvince} {order.address.postalCode}, {order.address.country}</p></Card>
    <div className="stack">{order.items.map((item) => <Card key={item.id}>
      <div className="split"><div><h2>{item.productName}</h2><p className="muted">{item.variantSku} · {Object.entries(item.variantOptions).map(([key, value]) => key + ": " + value).join(", ")}</p></div><StatusPill value={item.status} /></div>
      <p>{item.quantity} × {formatMoney(item.unitPrice)} = {formatMoney(item.quantity * item.unitPrice)}</p>
      {item.status === "paid" ? <div className="inline-form"><Field label="Cancellation reason" value={reason} onChange={(event) => setReason(event.target.value)} /><Button tone="quiet" disabled={reason.trim() === ""} onClick={() => void run(() => operations.customer.cancellationCreate(item.id, { reason }), "Cancellation request submitted.")}>Request cancellation</Button></div> : null}
      {item.status === "delivered" ? <div className="inline-form"><Field label="Refund reason" value={reason} onChange={(event) => setReason(event.target.value)} /><Button tone="quiet" disabled={reason.trim() === ""} onClick={() => void run(() => operations.customer.refundCreate(item.id, { reason }), "Refund request submitted.")}>Request refund</Button></div> : null}
      {item.cancellationRequests?.length === 0 && item.refundRequests?.length === 0 && item.restorations?.length === 0 ? null : <div className="stack"><h3>Resolution history</h3>{item.cancellationRequests?.map((request) => <p className="muted" key={request.id}>Cancellation {request.status} · {request.reason} · {formatDate(request.createdAt)}{request.decidedAt === null ? "" : " · decided " + formatDate(request.decidedAt)}</p>)}{item.refundRequests?.map((request) => <p className="muted" key={request.id}>Refund {request.status} · {request.reason} · {formatDate(request.createdAt)}{request.decidedAt === null ? "" : " · decided " + formatDate(request.decidedAt)}</p>)}{item.restorations?.map((restoration) => <p className="muted" key={restoration.id}>Inventory restoration {restoration.quantityChange} · {restoration.reason} · {formatDate(restoration.createdAt)}</p>)}</div>}
    </Card>)}</div>
    <Card><h2>Immutable resolution evidence</h2>{snapshots.data?.data.length === 0 ? <p className="muted">No cancellation or refund snapshots recorded.</p> : snapshots.data?.data.map((snapshot) => <div className="request-row" key={snapshot.id}><div><strong>{snapshot.kind}</strong><small>{snapshot.changed.join(", ")} · {snapshot.createdAt}</small><pre>{JSON.stringify({ before: snapshot.before, after: snapshot.after }, null, 2)}</pre></div></div>)}</Card>
    {order.shipments.map((shipment) => <Card key={shipment.id}><div className="split"><h2>{shipment.carrier} · {shipment.trackingNumber}</h2><StatusPill value={shipment.deliveredAt === null ? "In transit" : "Delivered"} /></div><p className="muted">Shipped {formatDate(shipment.shippedAt)} · {shipment.itemIds.length} item(s)</p>{shipment.deliveredAt === null ? <Button onClick={() => void run(() => operations.customer.shipmentDeliver(shipment.id), "Delivery confirmed.")}>Confirm delivery</Button> : null}</Card>)}
    {error === null ? null : <p className="form-message error" role="alert">{error}</p>}{message === null ? null : <p className="form-message success" role="status">{message}</p>}
  </section>;
}

export default OrderDetailPage;
