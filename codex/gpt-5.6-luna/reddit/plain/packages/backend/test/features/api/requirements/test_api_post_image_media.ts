import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { image, scenario } from "../../../helpers/RedditScenario";
import { requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves image posts retain the full media and an owning thumbnail presentation.
 *
 * 1. Create the actors and prerequisite records used by test_api_post_image_media.
 * 2. Execute test_api_post_image_media's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_post_image_media(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_post_image_media.
  // Step 2: Execute test_api_post_image_media's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const media = image(); const result = await api.functional.posts.createPost(state.member, { communityId: state.community.id, title: "Image post", type: "image", image: media });
  typia.assert(result); requireValue(result.image?.mimeType === "image/png" && result.image.data === media.data && result.image.thumbnail === media.data && result.title === "Image post", "Image post media was not retained with its public presentation."); const detail = await api.functional.post.post({ host: connection.host }, result.id);
  typia.assert(detail); requireValue(detail.image?.id === result.image?.id && detail.image?.thumbnail === media.data, "Image post media was not retained by public post detail."); }




