/* Native controls are rendered by the design-system Button wrapper. */
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import * as api from "@benchmark/shopping-api";
import { useState } from "react";

import { formatDate, formatMoney, toErrorMessage } from "@/lib/utils";
import { useAdminApplications, useAdminCustomers, useAdminOrders, useAdminProducts, useAdminSellerApprovals, useAdminSellers, useShoppingOperations } from "@/lib/shopping/hooks";
import { Button, Card, EmptyState, ErrorState, Field, LoadingState, PageHeader, Stat, StatusPill } from "@/components/ui";

export function AdminPage() {
  const approvals = useAdminSellerApprovals({ page: 1, limit: 10 });
  const applications = useAdminApplications({ page: 1, limit: 10 });
  const customers = useAdminCustomers({ page: 1, limit: 10 });
  const sellers = useAdminSellers({ page: 1, limit: 10 });
  const products = useAdminProducts({ page: 1, limit: 10 });
  const orders = useAdminOrders({ page: 1, limit: 10 });
  const operations = useShoppingOperations();
  const [category, setCategory] = useState({ name: "", description: "" });
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const loading = approvals.isPending || applications.isPending || customers.isPending || sellers.isPending || products.isPending || orders.isPending;
  if (loading) return <section className="page"><LoadingState label="Loading platform oversight" /></section>;
  const error = approvals.error ?? applications.error ?? customers.error ?? sellers.error ?? products.error ?? orders.error;
  if (error !== null && error !== undefined) return <section className="page"><ErrorState error={error} onRetry={() => void approvals.refetch()} /></section>;
  return <section className="page"><PageHeader eyebrow="Administrator / oversight" title="Platform control room" detail="Moderate across ownership boundaries while keeping account, catalog, order, and evidence history intact." /><div className="stat-grid"><Stat label="Seller approvals" value={approvals.data?.pagination.records ?? 0} detail="Pending queue" /><Stat label="Admin applications" value={applications.data?.pagination.records ?? 0} detail="Super-grade queue" /><Stat label="Customers" value={customers.data?.pagination.records ?? 0} detail="Non-deleted accounts" /><Stat label="Sellers" value={sellers.data?.pagination.records ?? 0} detail="Non-deleted accounts" /></div><div className="admin-grid"><Card><p className="eyebrow">Seller approvals</p><h2>Review pending sellers</h2>{approvals.data?.data.length === 0 ? <p className="muted">No pending seller approvals.</p> : approvals.data?.data.map((approval) => <div className="request-row" key={approval.id}><div><strong>{approval.shopName}</strong><small>{formatDate(approval.createdAt)}</small></div><div className="button-row"><Button tone="quiet" onClick={() => void operations.admin.sellerApprove(approval.id)}>Approve</Button><Button tone="danger" onClick={() => void operations.admin.sellerReject(approval.id, { reason: reason || "Application does not meet current platform requirements." })}>Reject</Button></div></div>)}</Card><Card><p className="eyebrow">Governance</p><h2>Administrator applications</h2>{applications.data?.data.length === 0 ? <p className="muted">No pending applications.</p> : applications.data?.data.map((application) => <div className="request-row" key={application.id}><div><strong>{application.actorType} applicant</strong><small>{application.reason}</small></div><div className="button-row"><Button tone="quiet" onClick={() => void operations.admin.applicationApprove(application.id)}>Approve</Button><Button tone="danger" onClick={() => void operations.admin.applicationReject(application.id)}>Reject</Button></div></div>)}<Field label="Moderation reason" value={reason} onChange={(event) => setReason(event.target.value)} /></Card><Card className="form-card"><p className="eyebrow">Category curation</p><h2>Create a top-level category</h2><Field label="Name" value={category.name} onChange={(event) => setCategory((current) => ({ ...current, name: event.target.value }))} /><Field label="Description" value={category.description} onChange={(event) => setCategory((current) => ({ ...current, description: event.target.value }))} /><Button onClick={() => void operations.admin.categoryCreate(category).then(() => setMessage("Category created.")).catch((caught: unknown) => setMessage(toErrorMessage(caught)))}>Create category</Button>{message === null ? null : <p className="form-message" role="status">{message}</p>}</Card><Card><p className="eyebrow">Live products</p><h2>Catalog oversight</h2>{products.data?.data.length === 0 ? <p className="muted">No live products.</p> : products.data?.data.map((product) => <div className="request-row" key={product.id}><div><strong>{product.name}</strong><small>{product.seller.shopName} · {formatPrice(product.displayedPrice)}</small></div><Button tone="danger" onClick={() => void operations.admin.productPolicyDelete(product.id, { reason: reason || "Policy review required." })}>Retire</Button></div>)}</Card><Card><p className="eyebrow">Orders</p><h2>Order directory</h2>{orders.data?.data.length === 0 ? <p className="muted">No orders.</p> : orders.data?.data.map((order) => <div className="request-row" key={order.id}><div><strong>{order.orderNumber}</strong><small>{formatDate(order.purchasedAt)} · {formatMoney(order.totalPrice)}</small></div><StatusPill value={order.status} /></div>)}</Card></div></section>;
}

function formatPrice(value: api.IShoppingProduct["displayedPrice"]): string {
  return typeof value === "number" ? formatMoney(value) : `${formatMoney(value.min)} to ${formatMoney(value.max)}`;
}
