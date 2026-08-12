import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorizeDetailed, loginDetailed } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves current-session logout returns a successful state transition.
 *
 * 1. Create the actors and prerequisite records used by test_api_auth_logout.
 * 2. Execute test_api_auth_logout's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_auth_logout(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_auth_logout.
  // Step 2: Execute test_api_auth_logout's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const account = await authorizeDetailed(connection.host);
  const other = await loginDetailed(connection.host, `${account.user.username}@example.com`, "password-123");
  const result = await api.functional.auth.logout(account.connection);
  typia.assert(result);
  requireValue(result, "Logout did not report a state transition.");
  const subscriptions = await api.functional.subscriptions(other.connection, page());
  typia.assert(subscriptions);
  requireValue(subscriptions.data.length === 0, "Current-session logout revoked another active session.");
}


