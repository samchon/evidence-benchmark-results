import { TypedBody, TypedHeaders, TypedParam, TypedRoute as Route } from "@nestia/core";
import { Controller } from "@nestjs/common";
import type * as api from "@benchmark/shopping2-api";
import type { tags } from "typia";

import { ShoppingProvider } from "../providers/ShoppingProvider";
import { AuthUtil } from "../utils/AuthUtil";

/** Administrator taxonomy and seller governance operations. */
@Controller("shopping/admin")
export class ShoppingAdminController {
  /**
   * Create a category.
   * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-1-create-a-category Curates the two-level taxonomy.
   * @evidence prisma:shopping_categories Persists a live category.
   */
  @Route.Post("category/create")
  public async createCategory(@TypedHeaders() headers: { authorization?: string }, @TypedBody() body: api.IShoppingCategory.ICreate): Promise<api.IShoppingCategory> { await ShoppingProvider.requireAdmin(AuthUtil.parse(headers.authorization).id); return ShoppingProvider.createCategory(body); }
  /**
   * Edit a category.
   * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-2-edit-a-category Updates administrator-curated metadata.
   * @evidence prisma:shopping_categories Persists the edit.
   */
  @Route.Put("category/:id/update")
  public async updateCategory(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">, @TypedBody() body: api.IShoppingCategory.IUpdate): Promise<api.IShoppingCategory> { await ShoppingProvider.requireAdmin(AuthUtil.parse(headers.authorization).id); return ShoppingProvider.updateCategory(id, body); }
  /**
   * Delete a category and uncategorize products.
   * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-3-delete-a-category Retires taxonomy without deleting products.
   * @evidence prisma:shopping_categories Changes lifecycle and clears product links.
   */
  @Route.Delete("category/:id/delete")
  public async deleteCategory(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { await ShoppingProvider.requireAdmin(AuthUtil.parse(headers.authorization).id); return ShoppingProvider.deleteCategory(id); }
  /**
   * List pending seller approvals.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-3-list-pending-seller-approvals Provides oldest-first governance queue.
   * @evidence prisma:shopping_seller_approval_requests Reads pending requests.
   */
  @Route.Patch("seller/approval")
  public async pendingSellers(@TypedHeaders() headers: { authorization?: string }, @TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingSeller>> { return ShoppingProvider.pendingSellers(AuthUtil.parse(headers.authorization).id, input); }
  /**
   * Approve a pending seller.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-4-approve-a-seller-registration Transitions approval to approved.
   * @evidence prisma:shopping_sellers Persists the decision.
   */
  @Route.Put("seller/:id/approve")
  public async approveSeller(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingSeller.IApproval> { return ShoppingProvider.approveSeller(AuthUtil.parse(headers.authorization).id, id); }
  /**
   * Reject a pending seller with a reason.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-5-reject-a-seller-registration Retains the refusal explanation.
   * @evidence prisma:shopping_seller_approval_requests Preserves decision history.
   */
  @Route.Put("seller/:id/reject")
  public async rejectSeller(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">, @TypedBody() body: api.IShoppingAdmin.IRequest): Promise<api.IShoppingSeller.IApproval> { return ShoppingProvider.rejectSeller(AuthUtil.parse(headers.authorization).id, id, body.reason); }
  /**
   * Suspend an approved seller.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-6-suspend-a-seller Hides live catalog while retaining fulfillment duties.
   * @evidence prisma:shopping_sellers Persists suspension state.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-3-compose-seller-suspension-and-ban-independently Keeps seller suspension independent from login ban.
   */
  @Route.Put("seller/:id/suspend")
  public async suspendSeller(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.suspendSeller(AuthUtil.parse(headers.authorization).id, id); }
  /**
   * Unsuspend a seller.
   * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-7-unsuspend-a-seller Restores approved catalog visibility.
   * @evidence prisma:shopping_sellers Persists the restored state.
   */
  @Route.Put("seller/:id/unsuspend")
  public async unsuspendSeller(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.unsuspendSeller(AuthUtil.parse(headers.authorization).id, id); }
  /**
   * Delete a policy-violating product.
   * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-7-delete-a-policy-violating-product This controller method implements the referenced requirement through the live backend endpoint.
   * @evidence prisma:shopping_products This controller method reads or writes the referenced persistence model for the endpoint.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-administrator-moderation-and-force-resolution-policies This operation realizes administrator moderation and force-resolution policies through policyDeleteProduct.
   * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-4-retire-a-policy-violating-product-without-rewriting-orders This operation realizes policy-violating product retirement through policyDeleteProduct.
   */
  @Route.Delete("product/:id/policy-delete")
  public async policyDeleteProduct(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.forceDeleteProduct(AuthUtil.parse(headers.authorization).id, id); }
}


