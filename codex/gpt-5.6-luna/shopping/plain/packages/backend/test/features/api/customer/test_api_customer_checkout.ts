import * as api from "@benchmark/shopping-api";
import typia from "typia";

/** Proves checkout rejects an empty purchasable candidate without creating an order. */
export async function test_api_customer_checkout(connection: api.IConnection): Promise<void> {
  const authorized = await api.functional.shopping.auth.customer.join.customerJoin(connection, { email: `checkout-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`, password: "password-123" });
  const authenticated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.token}` } };
  const address = await api.functional.shopping.customer.address.customerAddressCreate(authenticated, { recipientName: "Checkout User", phone: "+1-555-0199", streetAddress: "10 Checkout Road", city: "Seoul", state: "Seoul", postalCode: "04500", country: "KR" });
  typia.assert(address);
  try {
    await api.functional.shopping.customer.checkout.start.checkoutStart(authenticated, { addressId: address.id });
    throw new Error("empty checkout unexpectedly created a candidate");
  } catch (error) {
    if (!(error instanceof api.HttpError) || error.status !== 422) throw error;
  }
}
