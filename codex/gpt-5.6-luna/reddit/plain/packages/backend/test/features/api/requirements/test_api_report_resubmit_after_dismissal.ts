import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves a resolved report may be submitted again only after its prior terminal outcome.
 *
 * 1. Create the actors and prerequisite records used by test_api_report_resubmit_after_dismissal.
 * 2. Execute test_api_report_resubmit_after_dismissal's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_report_resubmit_after_dismissal(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_report_resubmit_after_dismissal.
  // Step 2: Execute test_api_report_resubmit_after_dismissal's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const first = await api.functional.reports.report(state.owner, { postId: state.post.id, reason: "First terminal report" });
  typia.assert(first); const dismissed = await api.functional.report.dismiss.dismissReport(state.owner, first.id); typia.assert(dismissed); if (!dismissed) throw new Error("Report dismissal did not report success."); const second = await api.functional.reports.report(state.owner, { postId: state.post.id, reason: "Second unresolved report" });
  typia.assert(second); requireValue(second.status === "unresolved" && second.reason === "Second unresolved report", "A resolved report could not be resubmitted on available content."); const queue = await api.functional.community.reports(state.owner, state.community.id, page());
  typia.assert(queue); requireValue(queue.data.some((item) => item.id === second.id && item.reason === "Second unresolved report"), "The resubmitted report was not retained in the unresolved queue."); }



