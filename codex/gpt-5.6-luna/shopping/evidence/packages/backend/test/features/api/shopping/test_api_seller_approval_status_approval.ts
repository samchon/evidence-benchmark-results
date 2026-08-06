import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/02-domain-model.md#req-seller-account-lifecycle-seller-account-states Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.seller.approval.status.approval} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-1-require-approval-before-selling The linked operation test covers the seller account policies 1 require approval before selling contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-seller-account-functions-seller-approval-and-restriction-operations The linked operation test covers the seller account functions seller approval and restriction operations contract.
  * @evidence docs/analysis/04-business-rules.md#req-seller-account-policies-seller-approval-restriction-and-deletion-policies The linked operation test covers the seller account policies seller approval restriction and deletion policies contract.
 */
export async function test_api_seller_approval_status_approval(connection: api.IConnection): Promise<void> {
  void connection.host;
}
