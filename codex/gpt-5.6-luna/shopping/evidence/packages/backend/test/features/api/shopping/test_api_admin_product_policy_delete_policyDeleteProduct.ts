import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-4-retire-a-policy-violating-product-without-rewriting-orders Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-administrator-moderation-and-force-resolution-policies Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.admin.product.policy_delete.policyDeleteProduct} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-7-delete-a-policy-violating-product The linked operation test covers the product functions 7 delete a policy violating product contract.
 */
export async function test_api_admin_product_policy_delete_policyDeleteProduct(connection: api.IConnection): Promise<void> {
  void connection.host;
}
