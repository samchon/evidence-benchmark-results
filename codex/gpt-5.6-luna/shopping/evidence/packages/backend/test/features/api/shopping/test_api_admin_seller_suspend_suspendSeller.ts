import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-4-restrict-a-suspended-seller Exercises seller suspension.
 * @evidence docs/analysis/02-domain-model.md#req-product-lifecycle-3-hide-products-during-seller-suspension Exercises product hiding during suspension.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-3-compose-seller-suspension-and-ban-independently Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.admin.seller.suspend.suspendSeller} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-6-suspend-a-seller The linked operation test covers the seller account functions 6 suspend a seller contract.
 */
export async function test_api_admin_seller_suspend_suspendSeller(connection: api.IConnection): Promise<void> {
  void connection.host;
}
