import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves an owner can appoint a scoped moderator.
 *
 * 1. Create the actors and prerequisite records used by test_api_moderator_assign.
 * 2. Execute test_api_moderator_assign's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_moderator_assign(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_moderator_assign.
  // Step 2: Execute test_api_moderator_assign's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const report = await api.functional.reports.report(state.owner, { postId: state.post.id, reason: "Moderator scope proof" });
  typia.assert(report); const result = await api.functional.community.moderators.assignModerator(state.owner, state.community.id, state.memberUser.id); typia.assert(result); requireValue(result, "Moderator assignment did not report success."); const queue = await api.functional.community.reports(state.member, state.community.id, page());
  typia.assert(queue); requireValue(queue.data.some((item) => item.id === report.id && item.reason === "Moderator scope proof"), "Assigned moderator could not access the scoped report queue."); }



