import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorize, scenario } from "../../../helpers/RedditScenario";
import { page, refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves posting remains restricted to active community subscribers.
 *
 * 1. Create the actors and prerequisite records used by test_api_participation_non_subscriber_post.
 * 2. Execute test_api_participation_non_subscriber_post's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_participation_non_subscriber_post(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_participation_non_subscriber_post.
  // Step 2: Execute test_api_participation_non_subscriber_post's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const visitor = await authorize(connection.host); if (!await refused(() => api.functional.posts.createPost(visitor, { communityId: state.community.id, title: "No membership", type: "text", text: "Should fail" }))) throw new Error("A non-subscriber created a post."); const feed = await api.functional.community.feed.communityFeed({ host: connection.host }, state.community.id, { sort: "new", ...page() }); typia.assert(feed); requireValue(!feed.data.some((post) => post.title === "No membership"), "A refused non-subscriber post changed the public feed."); }



