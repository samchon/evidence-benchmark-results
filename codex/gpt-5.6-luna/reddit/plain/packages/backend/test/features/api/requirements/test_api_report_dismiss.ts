import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves report dismissal retains the reported target.
 *
 * 1. Create the actors and prerequisite records used by test_api_report_dismiss.
 * 2. Execute test_api_report_dismiss's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_report_dismiss(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_report_dismiss.
  // Step 2: Execute test_api_report_dismiss's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const report = await api.functional.reports.report(state.owner, { postId: state.post.id, reason: "Dismissal proof" });
  typia.assert(report); const result = await api.functional.report.dismiss.dismissReport(state.owner, report.id); typia.assert(result); requireValue(result, "Report dismissal did not report success."); const post = await api.functional.post.post({ host: connection.host }, state.post.id);
  typia.assert(post); requireValue(post.id === state.post.id, "Dismissed report removed its target."); const history = await api.functional.community.moderation_history.history(state.owner, state.community.id, page());
  typia.assert(history); requireValue(history.data.some((item) => item.kind === "dismissed" && item.reason === "Dismissal proof"), "Dismissed report did not create moderation history."); }



