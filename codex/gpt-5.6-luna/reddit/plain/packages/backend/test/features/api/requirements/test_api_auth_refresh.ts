import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { refreshDetailed } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves refresh continues the same active session.
 *
 * 1. Create the actors and prerequisite records used by test_api_auth_refresh.
 * 2. Execute test_api_auth_refresh's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_auth_refresh(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_auth_refresh.
  // Step 2: Execute test_api_auth_refresh's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const anonymous: api.IConnection = { host: connection.host };
  const username = `refresh_${Date.now().toString(36)}`.slice(0, 30);
  const joined = await api.functional.auth.join(anonymous, { email: `${username}@example.com`, username, password: "password-123" });
  typia.assert(joined);
  const continued = await refreshDetailed(connection.host, joined.refreshToken);
  requireValue(continued.auth.user.username === username && continued.auth.accessToken.length > 0 && continued.auth.refreshToken.length > 0, "Refresh did not continue the registered session.");
  const subscriptions = await api.functional.subscriptions(continued.connection, page());
  typia.assert(subscriptions);
  requireValue(subscriptions.data.length === 0, "The refreshed session could not perform an authenticated follow-up read.");
}



