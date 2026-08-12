import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorizeDetailed } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves the public profile includes the initial profile values.
 *
 * 1. Create the actors and prerequisite records used by test_api_profile_view.
 * 2. Execute test_api_profile_view's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_profile_view(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_profile_view.
  // Step 2: Execute test_api_profile_view's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const account = await authorizeDetailed(connection.host); const result = await api.functional.profile.profile({ host: connection.host }, account.user.username, { posts: page(), comments: page() });
  typia.assert(result); requireValue(result.username === account.user.username && result.displayName === account.user.username && result.bio === "" && result.posts.data.length === 0 && result.comments.data.length === 0, "A new profile did not expose its documented initial values."); }




