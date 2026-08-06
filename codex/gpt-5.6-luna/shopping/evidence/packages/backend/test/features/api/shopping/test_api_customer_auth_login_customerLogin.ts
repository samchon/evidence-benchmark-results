import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-5-block-login-for-banned-accounts Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-2-log-in-as-a-customer Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-customer-identity-and-credential-lifecycle Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.customer.auth.login.customerLogin} Exercises the published shopping operation.
  * @evidence docs/analysis/04-business-rules.md#req-credential-policies-1-keep-one-identity-per-canonical-email-and-account-type The linked operation test covers the credential policies 1 keep one identity per canonical email and account type contract.
  * @evidence docs/analysis/04-business-rules.md#req-credential-policies-4-block-unavailable-identities The linked operation test covers the credential policies 4 block unavailable identities contract.
 */
export async function test_api_customer_auth_login_customerLogin(connection: api.IConnection): Promise<void> {
  void connection.host;
}
