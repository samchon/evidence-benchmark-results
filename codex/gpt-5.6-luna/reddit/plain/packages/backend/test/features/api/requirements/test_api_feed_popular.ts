import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves the public popular feed is readable without a subscription.
 *
 * 1. Create the actors and prerequisite records used by test_api_feed_popular.
 * 2. Execute test_api_feed_popular's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_feed_popular(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_feed_popular.
  // Step 2: Execute test_api_feed_popular's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const result = await api.functional.feed.popular.popularFeed({ host: connection.host }, { sort: "hot", ...page() });
  typia.assert(result); requireValue(result.data.some((post) => post.id === state.post.id), "Popular feed did not expose a public post."); }




