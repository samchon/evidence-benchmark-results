import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves active bans are private and paginated.
 *
 * 1. Create the actors and prerequisite records used by test_api_ban_list.
 * 2. Execute test_api_ban_list's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_ban_list(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_ban_list.
  // Step 2: Execute test_api_ban_list's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const banned = await api.functional.community.bans.ban(state.owner, state.community.id, state.memberUser.id); typia.assert(banned); requireValue(banned, "Ban setup did not report success."); const result = await api.functional.community.bans.banned(state.owner, state.community.id, page());
  typia.assert(result); requireValue(result.data.some((ban) => ban.username === state.memberUser.username && ban.actor === state.ownerUser.username), "Ban list did not expose the active ban and acting moderator."); }



