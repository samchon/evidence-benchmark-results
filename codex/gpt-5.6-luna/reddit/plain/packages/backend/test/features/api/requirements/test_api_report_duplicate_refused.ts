import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves duplicate reports and non-moderator queue access are refused.
 *
 * 1. Create the actors and prerequisite records used by test_api_report_duplicate_refused.
 * 2. Execute test_api_report_duplicate_refused's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_report_duplicate_refused(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_report_duplicate_refused.
  // Step 2: Execute test_api_report_duplicate_refused's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host);
  const first = await api.functional.reports.report(state.member, { postId: state.post.id, reason: "First report" });
  typia.assert(first);
  requireValue(first.targetId === state.post.id && first.status === "unresolved", "The initial report was not created as unresolved.");
  if (!await refused(() => api.functional.reports.report(state.member, { postId: state.post.id, reason: "Second report" }))) throw new Error("A duplicate unresolved report was accepted.");
  const queue = await api.functional.community.reports(state.owner, state.community.id, page()); typia.assert(queue); requireValue(queue.data.filter((report) => report.targetId === state.post.id).length === 1, "A refused duplicate report changed the unresolved queue.");
}

