import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves current moderators can inspect private resolved moderation history.
 *
 * 1. Create the actors and prerequisite records used by test_api_moderation_history.
 * 2. Execute test_api_moderation_history's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_moderation_history(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_moderation_history.
  // Step 2: Execute test_api_moderation_history's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const report = await api.functional.reports.report(state.owner, { postId: state.post.id, reason: "History proof" });
  typia.assert(report); const dismissed = await api.functional.report.dismiss.dismissReport(state.owner, report.id); typia.assert(dismissed); const result = await api.functional.community.moderation_history.history(state.owner, state.community.id, page());
  typia.assert(result); requireValue(result.data.some((item) => item.kind === "dismissed" && item.reason === "History proof" && item.actor === state.ownerUser.username && item.target === state.post.title), "Moderation history did not record the resolved report."); const deleted = await api.functional.post.deleteOwnPost(state.member, state.post.id); typia.assert(deleted); requireValue(deleted, "The history cleanup setup could not delete the dismissed target."); const afterDeletion = await api.functional.community.moderation_history.history(state.owner, state.community.id, page()); typia.assert(afterDeletion); requireValue(afterDeletion.data.some((item) => item.kind === "dismissed" && item.reason === "History proof" && item.target === null), "Deleting a post retained a removed target in moderation history."); }



