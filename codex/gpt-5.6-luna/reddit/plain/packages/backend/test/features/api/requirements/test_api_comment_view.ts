import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves nested comment threads return all descendants.
 *
 * 1. Create the actors and prerequisite records used by test_api_comment_view.
 * 2. Execute test_api_comment_view's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_comment_view(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_comment_view.
  // Step 2: Execute test_api_comment_view's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host);
  const child = await api.functional.comments.createComment(state.member, { postId: state.post.id, parentId: state.comment.id, text: "A child reply" });
  typia.assert(child);
  const grandchild = await api.functional.comments.createComment(state.owner, { postId: state.post.id, parentId: child.id, text: "A grandchild reply" });
  typia.assert(grandchild);
  const result = await api.functional.post.comments(state.owner, state.post.id, { sort: "best", ...page() });
  typia.assert(result);
  const root = result.data.find((comment) => comment.id === state.comment.id);
  requireValue(root?.text === "A persisted comment", "Comment view did not return the persisted root comment.");
  const reply = root?.replies.find((comment) => comment.id === child.id);
  requireValue(reply?.text === "A child reply", "Comment view did not return the child reply.");
  requireValue(reply?.replies.some((comment) => comment.id === grandchild.id && comment.text === "A grandchild reply"), "Comment view did not return the grandchild reply.");
}



