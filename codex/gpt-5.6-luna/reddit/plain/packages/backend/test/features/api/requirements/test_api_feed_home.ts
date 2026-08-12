import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves home feed is scoped to active subscriptions.
 *
 * 1. Create the actors and prerequisite records used by test_api_feed_home.
 * 2. Execute test_api_feed_home's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_feed_home(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_feed_home.
  // Step 2: Execute test_api_feed_home's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const result = await api.functional.feed.home.homeFeed(state.member, { sort: "new", ...page() });
  typia.assert(result); requireValue(result.data.some((post) => post.id === state.post.id && post.community === state.community.name), "Home feed did not include content from an active subscription."); }




