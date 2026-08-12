import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves unbanning removes only the active participation restriction.
 *
 * 1. Create the actors and prerequisite records used by test_api_ban_end.
 * 2. Execute test_api_ban_end's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_ban_end(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_ban_end.
  // Step 2: Execute test_api_ban_end's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const banned = await api.functional.community.bans.ban(state.owner, state.community.id, state.memberUser.id); typia.assert(banned); requireValue(banned, "Ban setup did not report success."); const result = await api.functional.community.bans.unban(state.owner, state.community.id, state.memberUser.id); typia.assert(result); requireValue(result, "Ban termination did not report success."); const post = await api.functional.posts.createPost(state.member, { communityId: state.community.id, title: "Unblocked", type: "text", text: "Participation restored" });
  typia.assert(post); requireValue(post.author?.username === state.memberUser.username, "Unbanning did not restore participation."); const detail = await api.functional.post.post({ host: connection.host }, post.id);
  typia.assert(detail); requireValue(detail.text === "Participation restored", "Post created after unbanning was not publicly retained."); }


