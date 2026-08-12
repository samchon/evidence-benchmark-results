import crypto from "node:crypto";
import type { IPage, IShoppingSeller } from "@benchmark/shopping-api";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { ShoppingSellerProvider } from "./ShoppingSellerProvider";

/** Owns seller approval submissions and administrator approval state. */
export namespace ShoppingSellerWorkflowProvider {
  export async function approval(sellerId: string): Promise<IShoppingSeller> { return ShoppingSellerProvider.at(sellerId); }
  export async function approvalCreate(sellerId: string, input: IShoppingSeller.IApprovalCreate): Promise<IShoppingSeller> {
    const seller = await MyGlobal.prisma.shopping_sellers.findFirst({ where: { id: sellerId, deleted_at: null } });
    if (seller === null || seller.login_status === "banned" || seller.approval_status !== "rejected") throw ErrorUtil.forbidden("Only a rejected seller may resubmit approval.");
    await MyGlobal.prisma.shopping_seller_approval_requests.create({ data: { id: crypto.randomUUID(), seller_id: sellerId, reason: input.reason, status: "pending", decision_reason: null, created_at: new Date(), decided_at: null, decided_by: null } });
    await MyGlobal.prisma.shopping_sellers.update({ where: { id: sellerId }, data: { approval_status: "pending", updated_at: new Date() } });
    return ShoppingSellerProvider.at(sellerId);
  }
  export async function approvalIndex(input: IPage.IRequest): Promise<IPage<IShoppingSeller>> { const rows = await MyGlobal.prisma.shopping_seller_approval_requests.findMany({ where: { status: "pending" }, orderBy: [{ created_at: "asc" }, { id: "asc" }], include: { seller: true } }); return page(input, rows.map((row) => ({ id: row.seller.id, email: row.seller.email, approvalStatus: row.seller.approval_status, loginStatus: row.seller.login_status, suspended: row.seller.suspended_at !== null, shopName: row.seller.shop_name, shopDescription: row.seller.shop_description, logoImage: row.seller.logo_image, createdAt: row.seller.created_at.toISOString(), grades: [] })) ); }
  export async function approvalDecide(administratorId: string, id: string, approve: boolean, reason?: string | null): Promise<IShoppingSeller> {
    const request = await MyGlobal.prisma.shopping_seller_approval_requests.findUnique({ where: { id } });
    if (request === null) throw ErrorUtil.notFound("The seller approval request does not exist.");
    if (request.status !== "pending") throw ErrorUtil.conflict("The seller approval request was already decided.");
    if (!approve && (reason === null || reason === undefined || reason.length === 0)) throw ErrorUtil.badRequest("A rejection reason is required.");
    const now = new Date();
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.shopping_seller_approval_requests.update({ where: { id }, data: { status: approve ? "approved" : "rejected", decision_reason: approve ? null : reason, decided_at: now, decided_by: administratorId } }),
      MyGlobal.prisma.shopping_sellers.update({ where: { id: request.seller_id }, data: { approval_status: approve ? "approved" : "rejected", updated_at: now } }),
    ]);
    return ShoppingSellerProvider.at(request.seller_id);
  }
  function page<T extends object>(input: IPage.IRequest, rows: T[]): IPage<T> { const current = input.page ?? 1; const limit = input.limit ?? 100; const records = rows.length; const pages = limit === 0 ? (records === 0 ? 0 : 1) : Math.ceil(records / limit); return { pagination: { current, limit, records, pages }, data: limit === 0 ? rows : rows.slice((current - 1) * limit, current * limit) }; }
}
