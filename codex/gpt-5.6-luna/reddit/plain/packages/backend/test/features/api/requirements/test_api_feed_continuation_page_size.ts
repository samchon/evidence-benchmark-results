import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves feed continuation keeps its original page size when the next request omits it.
 *
 * 1. Create the actors and prerequisite records used by test_api_feed_continuation_page_size.
 * 2. Execute test_api_feed_continuation_page_size's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_feed_continuation_page_size(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_feed_continuation_page_size.
  // Step 2: Execute test_api_feed_continuation_page_size's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host);
  const secondPost = await api.functional.posts.createPost(state.member, { communityId: state.community.id, title: "Second feed post", type: "text", text: "Second body" });
  typia.assert(secondPost);
  requireValue(secondPost.title === "Second feed post", "Feed setup did not create the second post.");
  const first = await api.functional.community.feed.communityFeed({ host: connection.host }, state.community.id, { sort: "new", limit: 1 });
  typia.assert(first);
  requireValue(first.pagination.continuation !== null, "The feed setup did not establish a continuation.");
  const next = await api.functional.community.feed.communityFeed({ host: connection.host }, state.community.id, { sort: "new", continuation: first.pagination.continuation });
  typia.assert(next);
  requireValue(next.pagination.current === 2 && next.pagination.limit === 1 && next.pagination.reset !== true, "Feed continuation did not preserve page size.");
}
