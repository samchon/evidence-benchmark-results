import { TypedBody, TypedHeaders, TypedRoute as Route } from "@nestia/core";
import { Controller } from "@nestjs/common";
import type * as api from "@benchmark/shopping2-api";
import { ShoppingProvider } from "../providers/ShoppingProvider";
import { AuthUtil } from "../utils/AuthUtil";

/** Seller dashboard and order-item reports. */
@Controller("shopping/seller")
export class ShoppingSellerReportsController {
  /**
   * View the shop summary.
   * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-2-count-all-retained-seller-order-items This controller operation realizes the seller dashboard policies 2 count all retained seller order items contract through summary.
   * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-3-count-unresolved-seller-requests This controller operation realizes the seller dashboard policies 3 count unresolved seller requests contract through summary.
   * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-seller-dashboard-calculation-policies This controller operation realizes the seller dashboard policies seller dashboard calculation policies contract through summary.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-seller-dashboard-and-order-item-reports This controller operation realizes the seller dashboard seller dashboard and order item reports contract through summary.
   * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-1-count-the-sellers-current-products This controller operation realizes the seller dashboard policies 1 count the sellers current products contract through summary.
   * @evidence docs/analysis/04-business-rules.md#req-seller-dashboard-policies-4-filter-seller-order-items-by-one-exact-status This controller operation realizes the seller dashboard policies 4 filter seller order items by one exact status contract through summary.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-1-view-the-shop-summary This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_products This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Get("dashboard-summary")
  public async summary(@TypedHeaders() headers: { authorization?: string }): Promise<api.IShoppingSeller.IDashboard> { return ShoppingProvider.sellerDashboard(AuthUtil.parse(headers.authorization).id); }
  /**
   * List shop order items.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-dashboard-2-list-shop-order-items This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_order_items This controller method reads or writes the referenced persistence model for the endpoint.
   */
  @Route.Patch("dashboard-orders")
  public async orders(@TypedHeaders() headers: { authorization?: string }, @TypedBody() input: api.IShoppingOrder.IRequest): Promise<api.IPage<api.IShoppingSeller.IOrderItem>> { return ShoppingProvider.sellerOrderItems(AuthUtil.parse(headers.authorization).id, input); }
}


