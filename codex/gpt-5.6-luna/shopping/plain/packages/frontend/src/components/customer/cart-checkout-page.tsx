/* Native controls are rendered by the design-system Button wrapper. */
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import * as api from "@benchmark/shopping-api";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Button, Card, EmptyState, ErrorState, Field, LoadingState, PageHeader, SelectField, StatusPill } from "@/components/ui";
import { useAddresses, useCart, useShoppingOperations } from "@/lib/shopping/hooks";
import { formatMoney, toErrorMessage } from "@/lib/utils";

export function CartCheckoutPage() {
  const cart = useCart();
  const addresses = useAddresses();
  const operations = useShoppingOperations();
  const [addressId, setAddressId] = useState("");
  const [summary, setSummary] = useState<api.IShoppingOrder.ICheckoutSummary | null>(null);
  const [paymentResult, setPaymentResult] = useState<api.IShoppingOrder.IPayment["success"]>(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (cart.isPending || addresses.isPending) return <section className="page"><LoadingState /></section>;
  const queryError = cart.error ?? addresses.error;
  if (queryError !== null && queryError !== undefined) return <section className="page"><ErrorState error={queryError} onRetry={() => void Promise.all([cart.refetch(), addresses.refetch()])} /></section>;
  const lines = cart.data?.lines ?? [];
  const eligible = lines.filter((line) => line.available && !line.shortage);
  const runCartAction = async (action: () => Promise<unknown>) => { if (busy) return; setBusy(true); setError(null); setSummary(null); try { await action(); } catch (caught) { setError(toErrorMessage(caught)); } finally { setBusy(false); } };
  const runPayment = async () => { if (summary === null || busy) return; setBusy(true); setError(null); try { const result = await operations.customer.payment({ attemptId: summary.attemptId, success: paymentResult, amount: summary.totalPrice }); if ("status" in result) setMessage(`Payment ${result.status}; no order was created.`); else setMessage("Payment confirmed and the order was retained."); } catch (caught) { setError(toErrorMessage(caught)); } finally { setBusy(false); } };
  return <section className="page"><PageHeader eyebrow="Customer / cart" title="Your cart" detail="Current prices and stock are checked at checkout; failed and unresolved payment outcomes stay explicit." action={<Link className="button button-quiet" to="/app/catalog">Continue shopping</Link>} />{lines.length === 0 ? <EmptyState title="Your cart is empty" detail="Choose a specific in-stock variant from the catalog." /> : <div className="split-layout"><div className="stack">{lines.map((line) => <Card key={line.id} className={line.available && !line.shortage ? "" : "line-unavailable"}><div className="split"><div><h2>{line.variant.product.name}</h2><p className="muted">{line.variant.sku}</p></div><StatusPill value={line.available ? line.shortage ? "Short on stock" : "Ready" : "Unavailable"} tone={line.available ? line.shortage ? "warn" : "good" : "bad"} /></div><div className="line-controls"><Field label="Quantity" type="number" min={1} value={line.quantity} onChange={(event) => void runCartAction(() => operations.customer.cartUpdate(line.id, { quantity: Number(event.target.value) }))} /><strong>{formatMoney(line.subtotal)}</strong><Button disabled={busy} tone="quiet" onClick={() => void runCartAction(() => operations.customer.cartDelete(line.id))}>Remove</Button></div></Card>)}</div><Card className="checkout-card"><p className="eyebrow">Checkout</p><h2>Review eligible lines</h2><p className="muted">{eligible.length} of {lines.length} lines are currently eligible.</p><SelectField label="Shipping address" value={addressId} onChange={(value) => { setSummary(null); setAddressId(value); }} options={[{ label: "Choose a saved address", value: "" }, ...(addresses.data?.data ?? []).map((address) => ({ label: `${address.recipientName} · ${address.city}`, value: address.id }))]} /><Button disabled={busy || addressId === "" || eligible.length === 0} onClick={() => void runCartAction(async () => { setSummary(await operations.customer.checkout({ addressId })); })}>{busy ? "Working..." : "Start checkout"}</Button>{summary === null ? null : <div className="summary"><h3>Payment attempt</h3><div className="stack">{summary.items.map((item) => <div className="request-row" key={item.id}><div><strong>{item.productName}</strong><small>{item.seller.shopName} · {item.variantSku} · {Object.entries(item.variantOptions).map(([key, value]) => `${key}: ${value}`).join(", ")}</small></div><span>{item.quantity} × {formatMoney(item.unitPrice)} = {formatMoney(item.quantity * item.unitPrice)}</span></div>)}</div><p><strong>Total {formatMoney(summary.totalPrice)}</strong></p><p className="muted">Shipping to {summary.address.recipientName} · {summary.address.recipientPhone}<br />{summary.address.streetAddress}, {summary.address.city}, {summary.address.stateOrProvince} {summary.address.postalCode}, {summary.address.country}</p><SelectField label="Gateway outcome" value={String(paymentResult)} onChange={(value) => setPaymentResult(value === "unknown" ? "unknown" : value === "true")} options={[{ label: "Success", value: "true" }, { label: "Failed", value: "false" }, { label: "Unknown / unresolved", value: "unknown" }]} /><Button disabled={busy} onClick={() => void runPayment()}>{busy ? "Submitting..." : "Submit payment result"}</Button></div>}{error === null ? null : <p className="form-message error" role="alert">{error}</p>}{message === null ? null : <p className="form-message success" role="status">{message}</p>}</Card></div>}</section>;
}

export default CartCheckoutPage;
