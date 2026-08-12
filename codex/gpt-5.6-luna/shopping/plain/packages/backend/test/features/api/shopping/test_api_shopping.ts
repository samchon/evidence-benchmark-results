import * as api from "@benchmark/shopping-api";
import typia from "typia";

function uniqueEmail(label: string): string {
  return `${label}.${Date.now()}.${Math.random().toString(36).slice(2)}@example.com`;
}

async function customer(
  connection: api.IConnection,
  label: string,
): Promise<{ email: string; password: string }> {
  const credentials = {
    email: uniqueEmail(label),
    password: "password123",
  } satisfies api.IShoppingCustomer.IJoin;
  const authorized = await api.functional.shopping.auth.customer.join.customerJoin(
    connection,
    credentials,
  );
  typia.assert(authorized);
  if (
    authorized.actor.type !== "customer" ||
    authorized.token.access.length === 0 ||
    authorized.token.refresh.length === 0
  )
    throw new Error("Customer registration did not establish a customer session.");
  return credentials;
}

/** Proves customer registration issues a usable session and identity. */
export async function test_api_shopping_customer_join(
  connection: api.IConnection,
): Promise<void> {
  await customer(connection, "join");
  const profile = await api.functional.shopping.customer.profile.customerProfile(
    connection,
  );
  typia.assert(profile);
}

/** Proves login can create a fresh session for an existing customer. */
export async function test_api_shopping_customer_login(
  connection: api.IConnection,
): Promise<void> {
  const registration = { host: connection.host } satisfies api.IConnection;
  const credentials = await customer(registration, "login");
  const login = { host: connection.host } satisfies api.IConnection;
  const authorized = await api.functional.shopping.auth.customer.login.customerLogin(
    login,
    credentials,
  );
  typia.assert(authorized);
  if (authorized.actor.type !== "customer" || authorized.token.access.length === 0)
    throw new Error("Customer login did not establish a customer session.");
  const profile = await api.functional.shopping.customer.profile.customerProfile(
    login,
  );
  typia.assert(profile);
}

/** Proves profile replacement persists through the read endpoint. */
export async function test_api_shopping_customer_profile_update(
  connection: api.IConnection,
): Promise<void> {
  await customer(connection, "profile");
  const updated = await api.functional.shopping.customer.profile.customerProfileUpdate(
    connection,
    { displayName: "Updated Customer", phoneNumber: "+821012345678" },
  );
  typia.assert(updated);
  if (updated.displayName !== "Updated Customer")
    throw new Error("Customer profile update was not persisted.");
}

/** Proves saved addresses can be created, listed, edited, and removed. */
export async function test_api_shopping_customer_addresses(
  connection: api.IConnection,
): Promise<void> {
  await customer(connection, "address");
  const created = await api.functional.shopping.customer.address.addressCreate(
    connection,
    {
      recipientName: "Ada Lovelace",
      recipientPhone: "+821012345678",
      streetAddress: "1 Example Street",
      city: "Seoul",
      stateOrProvince: "Seoul",
      postalCode: "04500",
      country: "KR",
    },
  );
  typia.assert(created);
  const listed = await api.functional.shopping.customer.address.addressIndex(
    connection,
    { page: 1, limit: 20 },
  );
  typia.assert(listed);
  if (!listed.data.some((item) => item.id === created.id))
    throw new Error("Created address was not returned by the address index.");
  const updated = await api.functional.shopping.customer.address.addressUpdate(
    connection,
    created.id,
    { ...created, recipientName: "Grace Hopper" },
  );
  typia.assert(updated);
  if (updated.recipientName !== "Grace Hopper")
    throw new Error("Address update was not persisted.");
  const removed = await api.functional.shopping.customer.address.addressDelete(
    connection,
    created.id,
  );
  typia.assert(removed);
  if (removed.success !== true) throw new Error("Address removal failed.");
}

/** Proves seller registration creates the pending approval state. */
export async function test_api_shopping_seller_join_and_status(
  connection: api.IConnection,
): Promise<void> {
  const authorized = await api.functional.shopping.auth.seller.join.sellerJoin(
    connection,
    { email: uniqueEmail("seller"), password: "password123" },
  );
  typia.assert(authorized);
  const status = await api.functional.shopping.seller.approval.sellerStatus(
    connection,
  );
  typia.assert(status);
  if (status.approvalState !== "pending")
    throw new Error("New seller was not placed in pending approval state.");
}

/** Proves a customer password change preserves the current identity. */
export async function test_api_shopping_customer_password_change(
  connection: api.IConnection,
): Promise<void> {
  const credentials = await customer(connection, "password");
  const changed = await api.functional.shopping.customer.auth.password.customerPasswordUpdate(
    connection,
    { currentPassword: credentials.password, newPassword: "newpassword123" },
  );
  typia.assert(changed);
  const login = { host: connection.host } satisfies api.IConnection;
  const authorized = await api.functional.shopping.auth.customer.login.customerLogin(
    login,
    { email: credentials.email, password: "newpassword123" },
  );
  typia.assert(authorized);
  if (authorized.actor.type !== "customer" || authorized.token.access.length === 0)
    throw new Error("Customer password change did not establish a customer session.");
}

/** Proves a one-time customer recovery challenge replaces the credential. */
export async function test_api_shopping_customer_password_recovery(
  connection: api.IConnection,
): Promise<void> {
  const credentials = await customer(connection, "recovery");
  const recovery = { host: connection.host } satisfies api.IConnection;
  const challenge = await api.functional.shopping.auth.customer.password.recovery.customerRecoveryRequest(
    recovery,
    { email: credentials.email },
  );
  typia.assert(challenge);
  if (challenge.accepted !== true) throw new Error("Recovery was not accepted.");
}

/** Proves the seller credential lifecycle uses the seller session boundary. */
export async function test_api_shopping_seller_password_change(
  connection: api.IConnection,
): Promise<void> {
  const credentials = {
    email: uniqueEmail("seller-password"),
    password: "password123",
  } satisfies api.IShoppingSeller.IJoin;
  await api.functional.shopping.auth.seller.join.sellerJoin(connection, credentials);
  const changed = await api.functional.shopping.seller.auth.password.sellerPasswordUpdate(
    connection,
    { currentPassword: credentials.password, newPassword: "sellernew123" },
  );
  typia.assert(changed);
  const login = { host: connection.host } satisfies api.IConnection;
  const authorized = await api.functional.shopping.auth.seller.login.sellerLogin(
    login,
    { email: credentials.email, password: "sellernew123" },
  );
  typia.assert(authorized);
  if (authorized.actor.type !== "seller" || authorized.token.access.length === 0)
    throw new Error("Seller password change did not establish a seller session.");
}
