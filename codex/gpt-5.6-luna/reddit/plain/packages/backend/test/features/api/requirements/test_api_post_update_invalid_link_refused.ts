import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { refused } from "../../../helpers/RequirementTest";

/**
 * Proves an invalid link edit is refused while the link remains unchanged.
 *
 * 1. Create the actors and prerequisite records used by test_api_post_update_invalid_link_refused.
 * 2. Execute test_api_post_update_invalid_link_refused's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_post_update_invalid_link_refused(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_post_update_invalid_link_refused.
  // Step 2: Execute test_api_post_update_invalid_link_refused's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host);
  const link = await api.functional.posts.createPost(state.member, { communityId: state.community.id, title: "A link", type: "link", url: "https://example.com" });
  typia.assert(link);
  if (!await refused(() => api.functional.post.updatePost(state.member, link.id, { url: "http://" }))) throw new Error("An invalid link edit was accepted.");
  const unchanged = await api.functional.post.post({ host: connection.host }, link.id);
  typia.assert(unchanged);
  if (unchanged.url !== "https://example.com") throw new Error("A refused invalid link edit changed the post.");
}




