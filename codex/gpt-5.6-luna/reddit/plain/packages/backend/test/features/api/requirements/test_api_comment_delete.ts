import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves a comment author can delete content.
 *
 * 1. Create the actors and prerequisite records used by test_api_comment_delete.
 * 2. Execute test_api_comment_delete's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_comment_delete(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_comment_delete.
  // Step 2: Execute test_api_comment_delete's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const result = await api.functional.comment.deleteOwnComment(state.owner, state.comment.id); typia.assert(result); requireValue(result, "Comment deletion did not report success."); const thread = await api.functional.post.comments({ host: connection.host }, state.post.id, { sort: "best" });
  typia.assert(thread); requireValue(!thread.data.some((comment) => comment.id === state.comment.id), "A reply-free deleted comment remained visible."); }



