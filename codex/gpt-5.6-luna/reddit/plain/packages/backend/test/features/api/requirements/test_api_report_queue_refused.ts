import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, refused } from "../../../helpers/RequirementTest";

/**
 * Proves non-moderators cannot inspect the private report queue.
 *
 * 1. Create the actors and prerequisite records used by test_api_report_queue_refused.
 * 2. Execute test_api_report_queue_refused's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_report_queue_refused(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_report_queue_refused.
  // Step 2: Execute test_api_report_queue_refused's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host);
  const report = await api.functional.reports.report(state.member, { postId: state.post.id, reason: "Private queue" });
  typia.assert(report);
  if (!await refused(() => api.functional.community.reports(state.member, state.community.id, page()))) throw new Error("A non-moderator read the private report queue.");
}



