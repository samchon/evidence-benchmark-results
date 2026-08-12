import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves current community moderators can inspect unresolved reports.
 *
 * 1. Create the actors and prerequisite records used by test_api_report_queue.
 * 2. Execute test_api_report_queue's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_report_queue(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_report_queue.
  // Step 2: Execute test_api_report_queue's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const report = await api.functional.reports.report(state.member, { postId: state.post.id, reason: "Queue proof" });
  typia.assert(report); const result = await api.functional.community.reports(state.owner, state.community.id, page());
  typia.assert(result); requireValue(result.data.some((item) => item.id === report.id && item.reason === "Queue proof" && item.status === "unresolved"), "Moderator report queue did not expose the unresolved report."); }




