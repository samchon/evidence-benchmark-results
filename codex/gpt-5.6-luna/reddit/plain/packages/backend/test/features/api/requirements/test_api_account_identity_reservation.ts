import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorizeDetailed } from "../../../helpers/RedditScenario";
import { refused } from "../../../helpers/RequirementTest";

/**
 * Proves deleted identity reservation survives account deletion.
 *
 * 1. Create the actors and prerequisite records used by test_api_account_identity_reservation.
 * 2. Execute test_api_account_identity_reservation's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_account_identity_reservation(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_account_identity_reservation.
  // Step 2: Execute test_api_account_identity_reservation's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const account = await authorizeDetailed(connection.host);
  const deleted = await api.functional.auth.account._delete.deleteAccount(account.connection, { password: "password-123" });
  typia.assert(deleted);
  if (!deleted) throw new Error("Account deletion did not report success.");
  if (!await refused(() => api.functional.auth.join({ host: connection.host }, { email: `${account.user.username}@example.com`, username: account.user.username, password: "password-123" }))) throw new Error("A deleted identity was reused.");
}



