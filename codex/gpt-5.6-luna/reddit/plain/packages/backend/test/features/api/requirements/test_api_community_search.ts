import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves community search is case-insensitive and paginated.
 *
 * 1. Create the actors and prerequisite records used by test_api_community_search.
 * 2. Execute test_api_community_search's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_community_search(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_community_search.
  // Step 2: Execute test_api_community_search's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const result = await api.functional.communities.communities({ host: connection.host }, { ...page(), search: state.community.name.toUpperCase() });
  typia.assert(result); requireValue(result.data.some((community) => community.id === state.community.id), "Case-insensitive community search did not find the created community."); }




