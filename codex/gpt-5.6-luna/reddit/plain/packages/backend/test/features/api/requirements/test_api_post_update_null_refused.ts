import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { refused } from "../../../helpers/RequirementTest";

/**
 * Proves a null post edit is refused without changing the stored post.
 *
 * 1. Create the actors and prerequisite records used by test_api_post_update_null_refused.
 * 2. Execute test_api_post_update_null_refused's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_post_update_null_refused(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_post_update_null_refused.
  // Step 2: Execute test_api_post_update_null_refused's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host);
  if (!await refused(() => api.functional.post.updatePost(state.member, state.post.id, { text: null }))) throw new Error("A null post edit was accepted.");
  const unchanged = await api.functional.post.post({ host: connection.host }, state.post.id);
  typia.assert(unchanged);
  if (unchanged.text !== state.post.text) throw new Error("A refused null post edit changed the post.");
}




