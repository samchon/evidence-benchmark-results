import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves public post detail returns the complete current post.
 *
 * 1. Create the actors and prerequisite records used by test_api_post_detail.
 * 2. Execute test_api_post_detail's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_post_detail(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_post_detail.
  // Step 2: Execute test_api_post_detail's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const result = await api.functional.post.post({ host: connection.host }, state.post.id);
  typia.assert(result); requireValue(result.id === state.post.id && result.title === "Requirement test post" && result.text === "A persisted text payload" && result.commentCount === 1, "Post detail did not expose the persisted post and comment state."); }




