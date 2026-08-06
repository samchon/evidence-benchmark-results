import * as api from "@benchmark/shopping-api";
import typia from "typia";

/** Proves customer password replacement and terminal account closure. */
export async function test_api_customer_credential_lifecycle(connection: api.IConnection): Promise<void> {
  const email = `lifecycle-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
  const original = "password-123";
  const replacement = "password-456";
  const authorized = await api.functional.shopping.auth.customer.join.customerJoin(connection, { email, password: original });
  const authenticated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.token}` } };

  const changed = await api.functional.shopping.customer.password.customerPassword(authenticated, { currentPassword: original, newPassword: replacement });
  typia.assert(changed);
  const relogged = await api.functional.shopping.auth.customer.login.customerLogin(connection, { email, password: replacement });
  typia.assert(relogged);
  const reloggedConnection: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${relogged.token}` } };

  const deleted = await api.functional.shopping.customer.account.customerAccountDelete(reloggedConnection, { password: replacement });
  typia.assert(deleted);
  try {
    await api.functional.shopping.auth.customer.login.customerLogin(connection, { email, password: replacement });
    throw new Error("deleted customer was allowed to log in");
  } catch (error) {
    if (!(error instanceof api.HttpError) || error.status !== 401) throw error;
  }
  try {
    await api.functional.shopping.auth.customer.login.customerLogin(connection, { email, password: original });
    throw new Error("the replaced customer password remained valid");
  } catch (error) {
    if (!(error instanceof api.HttpError) || error.status !== 401) throw error;
  }
}
