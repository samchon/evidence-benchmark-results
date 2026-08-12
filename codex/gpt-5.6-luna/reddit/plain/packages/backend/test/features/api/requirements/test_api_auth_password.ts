import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorizeDetailed, loginDetailed } from "../../../helpers/RedditScenario";
import { page, requireValue, refused } from "../../../helpers/RequirementTest";

/**
 * Proves an authenticated account can replace its password.
 *
 * 1. Create the actors and prerequisite records used by test_api_auth_password.
 * 2. Execute test_api_auth_password's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_auth_password(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_auth_password.
  // Step 2: Execute test_api_auth_password's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const account = await authorizeDetailed(connection.host);
  const other = await loginDetailed(connection.host, `${account.user.username}@example.com`, "password-123");
  if (!await refused(() => api.functional.auth.password(account.connection, { currentPassword: "password-123", newPassword: "short" }))) throw new Error("Password change accepted a password shorter than eight characters.");
  if (!await refused(() => api.functional.auth.password(account.connection, { currentPassword: "password-123", newPassword: "x".repeat(129) }))) throw new Error("Password change accepted a password longer than 128 characters.");
  const result = await api.functional.auth.password(account.connection, { currentPassword: "password-123", newPassword: "password-456" });
  typia.assert(result);
  requireValue(result, "Password change did not report success.");
  const current = await api.functional.subscriptions(account.connection, page());
  typia.assert(current);
  requireValue(current.data.length === 0, "The session that changed the password was revoked.");
  if (!await refused(() => api.functional.subscriptions(other.connection, page()))) throw new Error("Password change left another session active.");
  const login = await api.functional.auth.login({ host: connection.host }, { email: `${account.user.username}@example.com`, password: "password-456" });
  typia.assert(login);
  requireValue(login.user.username === account.user.username, "The new password could not authenticate the account.");
}

