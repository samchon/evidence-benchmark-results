import { randomUUID } from "node:crypto";
import type { IAuth, IPage, IPurchaseOrderChangeRequest } from "@benchmark/erp-api";
import { Prisma } from "@prisma/sdk";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { AuthProvider } from "./AuthProvider";

/** Owns controlled purchase-order changes and preserves the approval trail. */
export namespace PurchaseOrderChangeProvider {
  export async function create(h: IAuth.IHeaders, input: IPurchaseOrderChangeRequest.ICreate): Promise<IPurchaseOrderChangeRequest> {
    const actor = await context(h);
    const order = await orderEnsure(input.purchaseOrderId, actor.organizationId);
    if (!["draft", "routed", "approved", "sent"].includes(order.status)) throw ErrorUtil.conflict("This purchase order cannot receive a controlled change.");
    if (!Number.isFinite(input.requestedTotalAmount) || input.requestedTotalAmount < 0) throw ErrorUtil.badRequest("Requested total amount must be non-negative.");
    const now = new Date();
    return map(await MyGlobal.prisma.purchase_order_change_requests.create({ data: { id: randomUUID(), organization_id: actor.organizationId, purchase_order_id: order.id, requested_total_amount: input.requestedTotalAmount, reason: input.reason, status: "pending", requested_by_user_id: actor.userId, decided_by_user_id: null, applied_at: null, created_at: now, updated_at: now } }));
  }
  export async function index(h: IAuth.IHeaders, input: IPurchaseOrderChangeRequest.IRequest): Promise<IPage<IPurchaseOrderChangeRequest>> {
    const actor = await context(h);
    const rows = await MyGlobal.prisma.purchase_order_change_requests.findMany({ where: { organization_id: actor.organizationId, ...(input.purchaseOrderId ? { purchase_order_id: input.purchaseOrderId } : {}), ...(input.status ? { status: input.status } : {}) }, orderBy: { created_at: "desc" } });
    return { pagination: { current: 1, limit: 0, records: rows.length, pages: 1 }, data: rows.map(map) };
  }
  export async function status(h: IAuth.IHeaders, id: string, input: IPurchaseOrderChangeRequest.IStatus): Promise<IPurchaseOrderChangeRequest> {
    const actor = await context(h); const row = await ensure(id, actor.organizationId); if (row.status !== "pending") throw ErrorUtil.conflict("Only a pending purchase-order change can be decided.");
    return map(await MyGlobal.prisma.purchase_order_change_requests.update({ where: { id }, data: { status: input.status, decided_by_user_id: actor.userId, updated_at: new Date() } }));
  }
  export async function apply(h: IAuth.IHeaders, id: string): Promise<IPurchaseOrderChangeRequest> {
    const actor = await context(h); const row = await ensure(id, actor.organizationId); if (row.status !== "approved") throw ErrorUtil.conflict("Only an approved purchase-order change can be applied.");
    const order = await orderEnsure(row.purchase_order_id, actor.organizationId); const now = new Date();
    const updated = await MyGlobal.prisma.$transaction(async (tx) => {
      const before = String(order.total_amount);
      const request = await tx.purchase_order_change_requests.update({ where: { id }, data: { status: "applied", applied_at: now, updated_at: now } });
      await tx.purchase_orders.update({ where: { id: order.id }, data: { total_amount: row.requested_total_amount, updated_at: now } });
      await tx.audit_events.create({ data: { id: randomUUID(), organization_id: actor.organizationId, user_id: actor.userId, system_principal_id: null, action: "purchase_order.change.apply", target_type: "purchase_order", target_id: order.id, before_value: before, after_value: String(row.requested_total_amount), reason: row.reason, created_at: now } });
      return request;
    });
    return map(updated);
  }
  function map(r: Prisma.purchase_order_change_requestsGetPayload<{}>): IPurchaseOrderChangeRequest { return { id: r.id as IPurchaseOrderChangeRequest["id"], purchaseOrderId: r.purchase_order_id as IPurchaseOrderChangeRequest["purchaseOrderId"], requestedTotalAmount: Number(r.requested_total_amount), reason: r.reason, status: r.status as IPurchaseOrderChangeRequest["status"], requestedByUserId: r.requested_by_user_id as IPurchaseOrderChangeRequest["requestedByUserId"], decidedByUserId: r.decided_by_user_id as IPurchaseOrderChangeRequest["decidedByUserId"], appliedAt: r.applied_at?.toISOString() ?? null, createdAt: r.created_at.toISOString(), updatedAt: r.updated_at.toISOString() }; }
  async function context(h: IAuth.IHeaders) { const actor = await AuthProvider.authorize(h); const session = await MyGlobal.prisma.sessions.findUnique({ where: { id: actor.sessionId }, select: { selected_organization_id: true } }); if (!session?.selected_organization_id) throw ErrorUtil.forbidden("Select an active organization before purchase-order change work."); return { userId: actor.id, organizationId: session.selected_organization_id }; }
  async function orderEnsure(id: string, organizationId: string) { const row = await MyGlobal.prisma.purchase_orders.findFirst({ where: { id, organization_id: organizationId } }); if (row === null) throw ErrorUtil.notFound("No purchase order has this identifier."); return row; }
  async function ensure(id: string, organizationId: string) { const row = await MyGlobal.prisma.purchase_order_change_requests.findFirst({ where: { id, organization_id: organizationId } }); if (row === null) throw ErrorUtil.notFound("No purchase-order change request has this identifier."); return row; }
}
