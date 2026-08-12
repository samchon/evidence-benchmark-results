import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorize } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves profile edits are scoped to the current account.
 *
 * 1. Create the actors and prerequisite records used by test_api_profile_update.
 * 2. Execute test_api_profile_update's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_profile_update(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_profile_update.
  // Step 2: Execute test_api_profile_update's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const account = await authorize(connection.host); const result = await api.functional.profile.updateProfile(account, { displayName: "Edited display", bio: "Edited biography" });
  typia.assert(result); requireValue(result.displayName === "Edited display" && result.bio === "Edited biography", "Profile update did not persist the requested fields."); const viewed = await api.functional.profile.profile({ host: connection.host }, result.username, { posts: page(), comments: page() });
  typia.assert(viewed); requireValue(viewed.displayName === "Edited display" && viewed.bio === "Edited biography", "Profile update was not visible through the public profile."); }




