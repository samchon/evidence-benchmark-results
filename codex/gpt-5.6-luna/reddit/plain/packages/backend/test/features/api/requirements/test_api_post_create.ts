import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves post creation persists its type-specific payload.
 *
 * 1. Create the actors and prerequisite records used by test_api_post_create.
 * 2. Execute test_api_post_create's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_post_create(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_post_create.
  // Step 2: Execute test_api_post_create's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const result = await api.functional.posts.createPost(state.member, { communityId: state.community.id, title: "Another post", type: "text", text: "Another body" });
  typia.assert(result); requireValue(result.title === "Another post" && result.type === "text" && result.text === "Another body" && result.url === null && result.image === null && result.author?.username === state.memberUser.username && result.community.id === state.community.id, "Post creation did not persist its type-specific payload and ownership."); const detail = await api.functional.post.post({ host: connection.host }, result.id);
  typia.assert(detail); requireValue(detail.title === "Another post" && detail.text === "Another body", "Created post was not retained by public post detail."); }




