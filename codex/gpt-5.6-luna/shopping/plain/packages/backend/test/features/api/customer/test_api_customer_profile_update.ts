import * as api from "@benchmark/shopping-api";
import typia from "typia";

/**
 * Proves a customer profile edit persists through the public profile read.
 *
 * 1. Register a customer and authenticate a connection.
 * 2. Replace the display name and phone through the update operation.
 * 3. Read the profile and assert both edited values are persisted.
 */
export async function test_api_customer_profile_update(connection: api.IConnection): Promise<void> {
  // Step 1: Register and authenticate one customer.
  const authorized = await api.functional.shopping.auth.customer.join.customerJoin(connection, { email: `profile-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`, password: "password-123" });
  const authenticated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.token}` } };

  // Step 2: Replace both profile fields.
  const updated = await api.functional.shopping.customer.profile.customerProfileUpdate(authenticated, { displayName: "Updated Shopper", phone: "+1-555-0100" });
  typia.assert(updated);

  // Step 3: Observe the mutation through the read operation.
  const read = await api.functional.shopping.customer.profile.customerProfile(authenticated);
  typia.assert(read);
  if (read.displayName !== "Updated Shopper" || read.phone !== "+1-555-0100") throw new Error("profile update was not persisted");
}
