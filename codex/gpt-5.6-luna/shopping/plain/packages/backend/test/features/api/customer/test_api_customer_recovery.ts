import * as api from "@benchmark/shopping-api";
import typia from "typia";

/** Proves recovery issues a single-use challenge and replaces the credential. */
export async function test_api_customer_recovery(connection: api.IConnection): Promise<void> {
  const email = `recovery-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
  const nextPassword = "password-789";
  await api.functional.shopping.auth.customer.join.customerJoin(connection, { email, password: "password-123" });
  const challenge = await api.functional.shopping.auth.customer.recovery.customerRecoveryRequest(connection, { email });
  typia.assert(challenge);
  const completed = await api.functional.shopping.auth.customer.recovery.customerRecoveryComplete(connection, { token: challenge.token, newPassword: nextPassword });
  typia.assert(completed);
  const authorized = await api.functional.shopping.auth.customer.login.customerLogin(connection, { email, password: nextPassword });
  typia.assert(authorized);
  try {
    await api.functional.shopping.auth.customer.recovery.customerRecoveryComplete(connection, { token: challenge.token, newPassword: "password-999" });
    throw new Error("a recovery challenge was reusable");
  } catch (error) {
    if (!(error instanceof api.HttpError) || error.status !== 401) throw error;
  }
}
