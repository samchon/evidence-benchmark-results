import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves overlong report reasons are refused.
 *
 * 1. Create the actors and prerequisite records used by test_api_report_reason_refused.
 * 2. Execute test_api_report_reason_refused's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_report_reason_refused(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_report_reason_refused.
  // Step 2: Execute test_api_report_reason_refused's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host);
  if (!await refused(() => api.functional.reports.report(state.member, { commentId: state.comment.id, reason: "x".repeat(2001) }))) throw new Error("An overlong report reason was accepted.");
  const queue = await api.functional.community.reports(state.owner, state.community.id, page()); typia.assert(queue); requireValue(!queue.data.some((report) => report.targetId === state.comment.id), "A refused report reason changed the unresolved queue.");
}



