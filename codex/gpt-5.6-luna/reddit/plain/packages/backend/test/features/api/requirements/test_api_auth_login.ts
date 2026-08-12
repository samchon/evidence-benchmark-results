import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { loginDetailed } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves an existing active account can log in with its credentials.
 *
 * 1. Create the actors and prerequisite records used by test_api_auth_login.
 * 2. Execute test_api_auth_login's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_auth_login(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_auth_login.
  // Step 2: Execute test_api_auth_login's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const username = `login_${Date.now().toString(36)}`.slice(0, 30);
  const created = { host: connection.host } satisfies api.IConnection;
  const joined = await api.functional.auth.join(created, { email: `${username}@example.com`, username, password: "password-123" });
  typia.assert(joined);
  const loggedIn = await loginDetailed(connection.host, `${username}@example.com`, "password-123");
  requireValue(loggedIn.auth.user.username === username && loggedIn.auth.accessToken.length > 0 && loggedIn.auth.refreshToken.length > 0, "Login did not return the requested identity and session material.");
  const subscriptions = await api.functional.subscriptions(loggedIn.connection, page());
  typia.assert(subscriptions);
  requireValue(subscriptions.data.length === 0, "The login session could not perform an authenticated follow-up read.");
}


