import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves an owner or moderator can ban a non-owner user.
 *
 * 1. Create the actors and prerequisite records used by test_api_ban_enter.
 * 2. Execute test_api_ban_enter's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_ban_enter(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_ban_enter.
  // Step 2: Execute test_api_ban_enter's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const result = await api.functional.community.bans.ban(state.owner, state.community.id, state.memberUser.id); typia.assert(result); requireValue(result, "Ban activation did not report success."); if (!await refused(() => api.functional.posts.createPost(state.member, { communityId: state.community.id, title: "Blocked", type: "text", text: "Blocked body" }))) throw new Error("An active ban did not block participation.");
  const feed = await api.functional.community.feed.communityFeed({ host: connection.host }, state.community.id, { sort: "new", ...page() });
  typia.assert(feed);
  requireValue(!feed.data.some((post) => post.title === "Blocked"), "A refused banned post changed the community feed.");
}


