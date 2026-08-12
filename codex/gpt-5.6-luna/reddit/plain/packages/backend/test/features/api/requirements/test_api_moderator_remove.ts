import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves only the owner can remove a scoped moderator.
 *
 * 1. Create the actors and prerequisite records used by test_api_moderator_remove.
 * 2. Execute test_api_moderator_remove's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_moderator_remove(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_moderator_remove.
  // Step 2: Execute test_api_moderator_remove's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const assigned = await api.functional.community.moderators.assignModerator(state.owner, state.community.id, state.memberUser.id); typia.assert(assigned); requireValue(assigned, "Moderator setup did not report success."); const result = await api.functional.community.moderators.removeModerator(state.owner, state.community.id, state.memberUser.id); typia.assert(result); requireValue(result, "Moderator removal did not report success."); if (!await refused(() => api.functional.community.reports(state.member, state.community.id, page()))) throw new Error("Removed moderator retained scoped access."); }



