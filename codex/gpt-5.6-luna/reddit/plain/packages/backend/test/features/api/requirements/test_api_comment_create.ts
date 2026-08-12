import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves top-level comments and replies are persisted in a public thread.
 *
 * 1. Create the actors and prerequisite records used by test_api_comment_create.
 * 2. Execute test_api_comment_create's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_comment_create(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_comment_create.
  // Step 2: Execute test_api_comment_create's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const result = await api.functional.comments.createComment(state.member, { postId: state.post.id, parentId: state.comment.id, text: "A nested reply" });
  typia.assert(result); requireValue(result.text === "A nested reply" && result.replies.length === 0, "Comment creation did not persist the reply content."); const thread = await api.functional.post.comments({ host: connection.host }, state.post.id, { sort: "best" });
  typia.assert(thread); requireValue(thread.data.some((comment) => comment.id === state.comment.id && comment.replies.some((reply) => reply.id === result.id)), "Created reply was not attached to its requested parent."); }




