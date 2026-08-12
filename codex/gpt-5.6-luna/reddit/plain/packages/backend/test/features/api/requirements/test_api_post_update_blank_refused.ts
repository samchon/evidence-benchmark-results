import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves a whitespace-only post edit is refused.
 *
 * 1. Create the actors and prerequisite records used by test_api_post_update_blank_refused.
 * 2. Execute test_api_post_update_blank_refused's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_post_update_blank_refused(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_post_update_blank_refused.
  // Step 2: Execute test_api_post_update_blank_refused's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host);
  if (!await refused(() => api.functional.post.updatePost(state.member, state.post.id, { text: "   " }))) throw new Error("A whitespace-only post edit was accepted.");
  const detail = await api.functional.post.post({ host: connection.host }, state.post.id); typia.assert(detail); requireValue(detail.text === state.post.text && detail.title === state.post.title, "A refused blank post edit changed the post.");
}



