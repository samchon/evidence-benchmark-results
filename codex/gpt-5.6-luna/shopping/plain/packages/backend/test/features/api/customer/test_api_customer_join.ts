import * as api from "@benchmark/shopping-api";
import typia from "typia";

/**
 * Proves customer registration creates an authenticated customer identity.
 *
 * 1. Submit a unique email and password to the customer join operation.
 * 2. Validate the authorization response and use its token on a profile read.
 * 3. Assert that the new identity owns the returned profile.
 */
export async function test_api_customer_join(connection: api.IConnection): Promise<void> {
  // Step 1: Submit a unique registration.
  const email = `customer-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
  const authorized = await api.functional.shopping.auth.customer.join.customerJoin(connection, { email, password: "password-123" });
  typia.assert(authorized);

  // Step 2: Read the profile with the issued access token.
  const authenticated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.token}` } };
  const profile = await api.functional.shopping.customer.profile.customerProfile(authenticated);

  // Step 3: The profile belongs to the newly created identity.
  typia.assert(profile);
  if (profile.id !== authorized.id) throw new Error("joined customer profile has the wrong owner");
}
