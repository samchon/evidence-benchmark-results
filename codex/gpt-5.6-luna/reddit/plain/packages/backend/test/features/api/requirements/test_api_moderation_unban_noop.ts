import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";

/**
 * Proves absent moderation removals are explicit no-op outcomes.
 *
 * 1. Create the actors and prerequisite records used by test_api_moderation_unban_noop.
 * 2. Execute test_api_moderation_unban_noop's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_moderation_unban_noop(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_moderation_unban_noop.
  // Step 2: Execute test_api_moderation_unban_noop's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host);
  const result = await api.functional.community.bans.unban(state.owner, state.community.id, state.memberUser.id); typia.assert(result);
  if (result) throw new Error("Absent unban was not reported as a no-op.");
}



