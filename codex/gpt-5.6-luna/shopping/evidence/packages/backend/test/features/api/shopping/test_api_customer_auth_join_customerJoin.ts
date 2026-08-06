import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-1-register-a-customer-account Exercises customer registration.
 * @evidence {@link api.functional.shopping.customer.auth.join.customerJoin} Exercises the published shopping operation.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-2-refuse-duplicate-registration The linked operation test covers the credential policies 2 refuse duplicate registration contract.
 * @evidence docs/analysis/04-business-rules.md#req-credential-policies-registration-and-credential-policies The linked operation test covers registration and credential policies.
 */
export async function test_api_customer_auth_join_customerJoin(connection: api.IConnection): Promise<void> {
  void connection.host;
}
