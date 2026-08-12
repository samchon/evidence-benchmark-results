import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves a report enters the private unresolved queue.
 *
 * 1. Create the actors and prerequisite records used by test_api_report_create.
 * 2. Execute test_api_report_create's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_report_create(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_report_create.
  // Step 2: Execute test_api_report_create's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const result = await api.functional.reports.report(state.owner, { postId: state.post.id, reason: "The content needs moderation" });
  typia.assert(result); requireValue(result.targetKind === "post" && result.targetId === state.post.id && result.status === "unresolved" && result.reason === "The content needs moderation", "Report creation did not persist the unresolved target and reason."); const queue = await api.functional.community.reports(state.owner, state.community.id, page());
  typia.assert(queue); requireValue(queue.data.some((report) => report.id === result.id && report.reason === "The content needs moderation"), "Created report was not retained in the private queue."); }




