import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves an active comment vote can return to no-vote state.
 *
 * 1. Create the actors and prerequisite records used by test_api_vote_remove_comment.
 * 2. Execute test_api_vote_remove_comment's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_vote_remove_comment(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_vote_remove_comment.
  // Step 2: Execute test_api_vote_remove_comment's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const vote = await api.functional.votes.vote(state.owner, { commentId: state.comment.id, value: -1 }); typia.assert(vote); const result = await api.functional.votes.comment.removeCommentVote(state.owner, state.comment.id); typia.assert(result); requireValue(result, "Comment vote removal did not report success."); const thread = await api.functional.post.comments({ host: connection.host }, state.post.id, { sort: "best" });
  typia.assert(thread); requireValue(thread.data.find((comment) => comment.id === state.comment.id)?.score === 0, "Comment vote removal did not restore the comment score."); }



