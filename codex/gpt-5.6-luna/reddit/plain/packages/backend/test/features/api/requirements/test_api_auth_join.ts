import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorizeDetailed } from "../../../helpers/RedditScenario";
import { page, requireValue, refused } from "../../../helpers/RequirementTest";

/**
 * Proves registration returns an authenticated public identity.
 *
 * 1. Create the actors and prerequisite records used by test_api_auth_join.
 * 2. Execute test_api_auth_join's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_auth_join(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_auth_join.
  // Step 2: Execute test_api_auth_join's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const shortPassword = await refused(() => api.functional.auth.join({ host: connection.host }, { email: `short-${Date.now()}@example.com`, username: `short_${Date.now().toString(36).slice(-8)}`, password: "short" }));
  requireValue(shortPassword, "Registration accepted a password shorter than eight characters.");
  const longPassword = await refused(() => api.functional.auth.join({ host: connection.host }, { email: `long-${Date.now()}@example.com`, username: `long_${Date.now().toString(36).slice(-8)}`, password: "x".repeat(129) }));
  requireValue(longPassword, "Registration accepted a password longer than 128 characters.");
  const account = await authorizeDetailed(connection.host);
  requireValue(account.user.username.length > 0, "Registration did not return the public identity.");
  requireValue(typeof account.connection.headers?.Authorization === "string" && account.connection.headers.Authorization.length > 0, "Registration did not establish an authenticated session.");
  const profile = await api.functional.profile.profile({ host: connection.host }, account.user.username, { posts: page(), comments: page() });
  typia.assert(profile);
  requireValue(profile.username === account.user.username && profile.displayName === account.user.username && profile.bio === "", "Registration did not create the documented initial profile.");
}

