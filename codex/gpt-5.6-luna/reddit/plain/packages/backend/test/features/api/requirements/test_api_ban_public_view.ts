import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";

/**
 * Proves an active ban leaves existing public post and comment reads available.
 *
 * 1. Create the actors and prerequisite records used by test_api_ban_public_view.
 * 2. Execute test_api_ban_public_view's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_ban_public_view(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_ban_public_view.
  // Step 2: Execute test_api_ban_public_view's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host);
  const banned = await api.functional.community.bans.ban(state.owner, state.community.id, state.memberUser.id);
  typia.assert(banned);
  if (!banned) throw new Error("Ban operation did not report the active ban.");
  const post = await api.functional.post.post({ host: connection.host }, state.post.id);
  typia.assert(post);
  if (post.id !== state.post.id || post.text !== state.post.text) throw new Error("A banned user's public post view was not preserved.");
  const thread = await api.functional.post.comments({ host: connection.host }, state.post.id, { sort: "best" });
  typia.assert(thread);
  if (!thread.data.some((comment) => comment.id === state.comment.id)) throw new Error("A banned user's public comment view was not preserved.");
}



