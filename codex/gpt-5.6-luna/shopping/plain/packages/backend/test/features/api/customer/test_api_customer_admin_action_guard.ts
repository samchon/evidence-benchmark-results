import * as api from "@benchmark/shopping-api";

/** Proves the immutable administrator-action ledger is not exposed to ordinary customers. */
export async function test_api_customer_admin_action_guard(connection: api.IConnection): Promise<void> {
  const authorized = await api.functional.shopping.auth.customer.join.customerJoin(connection, {
    email: `action-guard-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`,
    password: "password-123",
  });
  const authenticated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.token}` } };
  try {
    await api.functional.shopping.admin.action.adminActions(authenticated, { page: 1, limit: 10 });
    throw new Error("ordinary customer unexpectedly accessed administrator action history");
  } catch (error) {
    if (!(error instanceof Error) || !/403|administrator/i.test(error.message)) throw error;
  }
}
