import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves a community feed remains publicly readable.
 *
 * 1. Create the actors and prerequisite records used by test_api_feed_community.
 * 2. Execute test_api_feed_community's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_feed_community(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_feed_community.
  // Step 2: Execute test_api_feed_community's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const result = await api.functional.community.feed.communityFeed({ host: connection.host }, state.community.id, { sort: "top", range: "all", ...page() });
  typia.assert(result); requireValue(result.data.some((post) => post.id === state.post.id) && result.pagination.limit === 25, "Community feed did not expose the public post in the requested order/page."); }




