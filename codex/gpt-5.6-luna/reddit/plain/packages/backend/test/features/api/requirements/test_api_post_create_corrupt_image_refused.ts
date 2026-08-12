import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { image, scenario } from "../../../helpers/RedditScenario";
import { page, refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves corrupt image data is refused before a post is created.
 *
 * 1. Create the actors and prerequisite records used by test_api_post_create_corrupt_image_refused.
 * 2. Execute test_api_post_create_corrupt_image_refused's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_post_create_corrupt_image_refused(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_post_create_corrupt_image_refused.
  // Step 2: Execute test_api_post_create_corrupt_image_refused's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host);
  if (!await refused(() => api.functional.posts.createPost(state.member, { communityId: state.community.id, title: "Bad image", type: "image", image: { ...image(), data: "data:image/png;base64,not-an-image" } }))) throw new Error("Corrupt image data was accepted.");
  const feed = await api.functional.community.feed.communityFeed({ host: connection.host }, state.community.id, { sort: "new", ...page() }); typia.assert(feed); requireValue(!feed.data.some((post) => post.title === "Bad image"), "A refused corrupt-image post changed the public feed.");
}



