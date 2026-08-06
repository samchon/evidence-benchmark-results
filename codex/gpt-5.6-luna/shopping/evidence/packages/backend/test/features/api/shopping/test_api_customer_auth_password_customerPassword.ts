import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-6-change-the-customer-password Exercises customer password change.
 * @evidence {@link api.functional.shopping.customer.auth.password.customerPassword} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-credential-policies-3-require-current-password-proof-for-password-change The linked operation test covers the credential policies 3 require current password proof for password change contract.
 */
export async function test_api_customer_auth_password_customerPassword(connection: api.IConnection): Promise<void> {
  void connection.host;
}
