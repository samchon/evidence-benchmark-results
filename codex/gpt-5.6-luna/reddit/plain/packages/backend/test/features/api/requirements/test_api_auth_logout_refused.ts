import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorize } from "../../../helpers/RedditScenario";
import { refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves a session cannot log out again after it has already been revoked.
 *
 * 1. Create an authenticated session and revoke it through the public logout operation.
 * 2. Invoke logout again with the now-revoked session.
 * 3. Assert that the repeated operation is refused and changes nothing further.
 */
export async function test_api_auth_logout_refused(connection: api.IConnection): Promise<void> {
  // Step 1: Create an authenticated session and revoke it through the public logout operation.
  const account = await authorize(connection.host);
  const first = await api.functional.auth.logout(account);
  typia.assert(first);
  requireValue(first, "Logout setup did not revoke the session.");
  // Step 2: Invoke logout again with the now-revoked session.
  // Step 3: Assert that the repeated operation is refused and changes nothing further.
  if (!await refused(() => api.functional.auth.logout(account))) throw new Error("A repeated logout was accepted.");
}
