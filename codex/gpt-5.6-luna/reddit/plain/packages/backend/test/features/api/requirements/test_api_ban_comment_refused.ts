import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves an active ban refuses a new comment.
 *
 * 1. Create the actors and prerequisite records used by test_api_ban_comment_refused.
 * 2. Execute test_api_ban_comment_refused's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_ban_comment_refused(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_ban_comment_refused.
  // Step 2: Execute test_api_ban_comment_refused's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host);
  const banned = await api.functional.community.bans.ban(state.owner, state.community.id, state.memberUser.id);
  typia.assert(banned);
  if (!banned) throw new Error("Ban setup did not report success.");
  if (!await refused(() => api.functional.comments.createComment(state.member, { postId: state.post.id, text: "Blocked comment" }))) throw new Error("A banned user created a comment.");
  const thread = await api.functional.post.comments({ host: connection.host }, state.post.id, { sort: "best", ...page() });
  typia.assert(thread);
  requireValue(!thread.data.some((comment) => comment.text === "Blocked comment"), "A refused banned comment changed the public thread.");
}

