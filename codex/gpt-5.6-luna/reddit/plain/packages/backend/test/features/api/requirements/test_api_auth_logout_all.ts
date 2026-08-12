import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorizeDetailed, loginDetailed } from "../../../helpers/RedditScenario";
import { page, refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves sign-out-everywhere revokes all sessions.
 *
 * 1. Create the actors and prerequisite records used by test_api_auth_logout_all.
 * 2. Execute test_api_auth_logout_all's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_auth_logout_all(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_auth_logout_all.
  // Step 2: Execute test_api_auth_logout_all's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const account = await authorizeDetailed(connection.host);
  const second = await loginDetailed(connection.host, `${account.user.username}@example.com`, "password-123");
  const revoked = await api.functional.auth.logout_all.logoutAll(account.connection);
  typia.assert(revoked);
  requireValue(revoked, "Logout-all did not report a state transition.");
  if (!await refused(() => api.functional.subscriptions(account.connection, page())) || !await refused(() => api.functional.subscriptions(second.connection, page()))) throw new Error("Logout-all left an active session.");
}



