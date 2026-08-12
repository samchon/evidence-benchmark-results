import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves an author can permanently delete their post.
 *
 * 1. Create the actors and prerequisite records used by test_api_post_delete.
 * 2. Execute test_api_post_delete's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_post_delete(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_post_delete.
  // Step 2: Execute test_api_post_delete's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const result = await api.functional.post.deleteOwnPost(state.member, state.post.id); typia.assert(result); requireValue(result, "Post deletion did not report success."); if (!await refused(() => api.functional.post.post({ host: connection.host }, state.post.id))) throw new Error("Deleted post remained publicly readable."); }



