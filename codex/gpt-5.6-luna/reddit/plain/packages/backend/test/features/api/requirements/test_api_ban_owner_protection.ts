import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves the current owner cannot be banned by community moderation.
 *
 * 1. Create the actors and prerequisite records used by test_api_ban_owner_protection.
 * 2. Execute test_api_ban_owner_protection's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_ban_owner_protection(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_ban_owner_protection.
  // Step 2: Execute test_api_ban_owner_protection's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host);
  if (!await refused(() => api.functional.community.bans.ban(state.owner, state.community.id, state.ownerUser.id))) throw new Error("The community owner was ban-able in their own community.");
  const bans = await api.functional.community.bans.banned(state.owner, state.community.id, page());
  typia.assert(bans);
  requireValue(!bans.data.some((ban) => ban.username === state.ownerUser.username), "A refused owner ban changed the public ban list.");
}



