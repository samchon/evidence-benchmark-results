import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorizeDetailed, image } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves avatar replacement, public presentation, and explicit removal are persisted.
 *
 * 1. Create the actors and prerequisite records used by test_api_profile_avatar_lifecycle.
 * 2. Execute test_api_profile_avatar_lifecycle's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_profile_avatar_lifecycle(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_profile_avatar_lifecycle.
  // Step 2: Execute test_api_profile_avatar_lifecycle's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const account = await authorizeDetailed(connection.host); const withAvatar = await api.functional.profile.updateProfile(account.connection, { avatar: image() });
  typia.assert(withAvatar); requireValue(withAvatar.avatar?.mimeType === "image/png" && withAvatar.avatar.data.length > 0, "Profile avatar replacement was not publicly visible."); const viewed = await api.functional.profile.profile({ host: connection.host }, account.user.username, { posts: page(), comments: page() });
  typia.assert(viewed); requireValue(viewed.avatar?.id === withAvatar.avatar?.id, "Profile avatar replacement was not retained by the public profile."); const removed = await api.functional.profile.updateProfile(account.connection, { avatar: null });
  typia.assert(removed); requireValue(removed.avatar === null, "Profile avatar removal did not remove the public presentation."); const cleared = await api.functional.profile.profile({ host: connection.host }, account.user.username, { posts: page(), comments: page() });
  typia.assert(cleared); requireValue(cleared.avatar === null, "Profile avatar removal was not retained by the public profile."); }




