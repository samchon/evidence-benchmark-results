import crypto from "node:crypto";
import type { IPage, IShoppingDashboard, IShoppingOrder, IShoppingSeller } from "@benchmark/shopping-api";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Owns seller profile reads and edits. */
export namespace ShoppingSellerProvider {
  /** Reads one public seller profile. */
  export async function at(id: string): Promise<IShoppingSeller> {
    const row = await MyGlobal.prisma.shopping_sellers.findFirst({ where: { id, deleted_at: null } });
    if (row === null) throw ErrorUtil.notFound("The seller account does not exist.");
    return dto(row);
  }

  /** Replaces the acting seller's public shop profile. */
  export async function update(id: string, input: IShoppingSeller.IProfileUpdate): Promise<IShoppingSeller> {
    const now = new Date();
    await MyGlobal.prisma.$transaction(async (tx) => {
      const current = await tx.shopping_sellers.findUniqueOrThrow({ where: { id } });
      await tx.shopping_sellers.update({ where: { id }, data: { shop_name: input.shopName, shop_description: input.shopDescription, logo_image: input.logoImage, updated_at: now } });
      await tx.shopping_seller_profiles.update({ where: { seller_id: id }, data: { shop_name: input.shopName, shop_description: input.shopDescription, logo_image: input.logoImage, updated_at: now } });
      await tx.shopping_seller_profile_snapshots.create({ data: { id: crypto.randomUUID(), seller_id: id, changed_fields: JSON.stringify({ before: current.shop_name, after: input.shopName }), before_shop_name: current.shop_name ?? "", after_shop_name: input.shopName, before_shop_description: current.shop_description ?? "", after_shop_description: input.shopDescription, before_logo_image: current.logo_image ?? "", after_logo_image: input.logoImage, created_at: now } });
    });
    return at(id);
  }

  /** Returns retained seller reporting counts. */
  export async function dashboard(id: string): Promise<IShoppingDashboard> {
    const [productCount, orderItemCount, pendingCancellationCount, pendingRefundCount] = await Promise.all([
      MyGlobal.prisma.shopping_products.count({ where: { seller_id: id, deleted_at: null } }),
      MyGlobal.prisma.shopping_order_items.count({ where: { seller_id: id } }),
      MyGlobal.prisma.shopping_cancellation_requests.count({ where: { seller_id: id, status: "pending" } }),
      MyGlobal.prisma.shopping_refund_requests.count({ where: { seller_id: id, status: "pending" } }),
    ]);
    return { productCount, orderItemCount, pendingCancellationCount, pendingRefundCount, observedAt: new Date().toISOString() };
  }

  /** Lists retained seller-owned order items by exact status when requested. */
  export async function dashboardItems(id: string, input: IShoppingDashboard.IRequest): Promise<IPage<IShoppingOrder.IItem>> {
    const rows = await MyGlobal.prisma.shopping_order_items.findMany({ where: { seller_id: id, ...(input.status === null || input.status === undefined ? {} : { status: input.status }) }, orderBy: [{ purchased_at: "desc" }, { id: "desc" }] });
    return page(input, rows.map((row) => ({ id: row.id, sellerId: row.seller_id, productName: row.product_name, productDescription: row.product_description, skuCode: row.sku_code, optionValues: JSON.parse(row.option_values) as Record<string, string>, sellerShopName: row.seller_shop_name, sellerLogoImage: row.seller_logo_image, quantity: row.quantity, unitPrice: row.unit_price, status: row.status, purchasedAt: row.purchased_at.toISOString() })));
  }

  function dto(row: { id: string; email: string; approval_status: string; login_status: string; suspended_at: Date | null; shop_name: string | null; shop_description: string | null; logo_image: string | null; created_at: Date }): IShoppingSeller {
    return { id: row.id, email: row.email, approvalStatus: row.approval_status, loginStatus: row.login_status, suspended: row.suspended_at !== null, shopName: row.shop_name, shopDescription: row.shop_description, logoImage: row.logo_image, createdAt: row.created_at.toISOString(), grades: [] };
  }
  function page<T extends object>(input: IPage.IRequest, rows: T[]): IPage<T> { const current = input.page ?? 1; const limit = input.limit ?? 100; const records = rows.length; const pages = limit === 0 ? (records === 0 ? 0 : 1) : Math.ceil(records / limit); return { pagination: { current, limit, records, pages }, data: limit === 0 ? rows : rows.slice((current - 1) * limit, current * limit) }; }
}
