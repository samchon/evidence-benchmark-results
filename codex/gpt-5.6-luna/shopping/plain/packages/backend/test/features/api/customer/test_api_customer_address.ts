import * as api from "@benchmark/shopping-api";
import typia from "typia";

/**
 * Proves an owned saved address can be created and explicitly selected as default.
 *
 * 1. Register a customer and authenticate a connection.
 * 2. Create a complete saved address.
 * 3. Select it as default and list addresses to observe the designation.
 */
export async function test_api_customer_address(connection: api.IConnection): Promise<void> {
  // Step 1: Register and authenticate one customer.
  const authorized = await api.functional.shopping.auth.customer.join.customerJoin(connection, { email: `address-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`, password: "password-123" });
  const authenticated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.token}` } };

  // Step 2: Create all seven required destination fields.
  const created = await api.functional.shopping.customer.address.customerAddressCreate(authenticated, { recipientName: "Recipient", phone: "+1-555-0111", streetAddress: "1 Main Street", city: "Seoul", state: "Seoul", postalCode: "04500", country: "KR" });
  typia.assert(created);

  // Step 3: Select and observe the default address.
  const selected = await api.functional.shopping.customer.address._default.customerAddressDefault(authenticated, created.id);
  typia.assert(selected);
  if (!selected.isDefault) throw new Error("address was not selected as default");
  const listed = await api.functional.shopping.customer.address.customerAddresses(authenticated, {});
  typia.assert(listed);
  if (!listed.data.some((address) => address.id === created.id && address.isDefault)) throw new Error("default address is missing from the list");
}
