import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorizeDetailed } from "../../../helpers/RedditScenario";
import { page, refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves permanent account deletion requires and accepts current-password confirmation.
 *
 * 1. Create the actors and prerequisite records used by test_api_auth_account_delete.
 * 2. Execute test_api_auth_account_delete's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_auth_account_delete(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_auth_account_delete.
  // Step 2: Execute test_api_auth_account_delete's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const account = await authorizeDetailed(connection.host); const result = await api.functional.auth.account._delete.deleteAccount(account.connection, { password: "password-123" }); typia.assert(result); requireValue(result, "Account deletion did not report success."); if (!await refused(() => api.functional.auth.login({ host: connection.host }, { email: `${account.user.username}@example.com`, password: "password-123" }))) throw new Error("Deleted account credentials remained valid."); if (!await refused(() => api.functional.profile.profile({ host: connection.host }, account.user.username, { posts: page(), comments: page() }))) throw new Error("Deleted account remained publicly visible."); }



