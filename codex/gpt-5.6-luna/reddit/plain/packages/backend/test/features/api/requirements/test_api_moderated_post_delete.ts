import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves moderator deletion applies the post lifecycle to another author.
 *
 * 1. Create the actors and prerequisite records used by test_api_moderated_post_delete.
 * 2. Execute test_api_moderated_post_delete's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_moderated_post_delete(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_moderated_post_delete.
  // Step 2: Execute test_api_moderated_post_delete's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const result = await api.functional.moderation.post.deleteModeratedPost(state.owner, state.post.id); typia.assert(result); requireValue(result, "Moderated post deletion did not report success."); if (!await refused(() => api.functional.post.post({ host: connection.host }, state.post.id))) throw new Error("Moderated post deletion left the post publicly readable."); }



