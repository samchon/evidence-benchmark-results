import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";

/**
 * Proves comment deletion preserves a descendant under a neutral marker.
 *
 * 1. Create the actors and prerequisite records used by test_api_comment_deleted_marker.
 * 2. Execute test_api_comment_deleted_marker's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_comment_deleted_marker(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_comment_deleted_marker.
  // Step 2: Execute test_api_comment_deleted_marker's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host);
  const reply = await api.functional.comments.createComment(state.member, { postId: state.post.id, parentId: state.comment.id, text: "Surviving reply" });
  typia.assert(reply);
  const deleted = await api.functional.comment.deleteOwnComment(state.owner, state.comment.id);
  typia.assert(deleted);
  if (!deleted) throw new Error("Comment deletion did not report success.");
  const thread = await api.functional.post.comments({ host: connection.host }, state.post.id, { sort: "best" });
  typia.assert(thread);
  const marker = thread.data.find((comment) => comment.id === state.comment.id);
  if (marker === undefined || marker.text !== null || marker.author !== null || marker.replies.length !== 1) throw new Error("Deleted comment marker did not preserve its reply.");
}



