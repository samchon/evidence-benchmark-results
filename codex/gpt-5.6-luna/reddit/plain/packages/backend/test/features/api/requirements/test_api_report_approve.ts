import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves report approval removes the reported target.
 *
 * 1. Create the actors and prerequisite records used by test_api_report_approve.
 * 2. Execute test_api_report_approve's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_report_approve(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_report_approve.
  // Step 2: Execute test_api_report_approve's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const report = await api.functional.reports.report(state.owner, { postId: state.post.id, reason: "Approval proof" });
  typia.assert(report); const result = await api.functional.report.approve.approveReport(state.owner, report.id); typia.assert(result); requireValue(result, "Report approval did not report success."); if (!await refused(() => api.functional.post.post({ host: connection.host }, state.post.id))) throw new Error("Approved post remained publicly readable."); const history = await api.functional.community.moderation_history.history(state.owner, state.community.id, page());
  typia.assert(history); requireValue(history.data.some((item) => item.kind === "approved" && item.reason === "Approval proof" && item.target === null), "Approved report did not create deletion moderation history."); }



