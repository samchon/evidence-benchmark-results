import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves an active post vote can return to no-vote state.
 *
 * 1. Create the actors and prerequisite records used by test_api_vote_remove_post.
 * 2. Execute test_api_vote_remove_post's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_vote_remove_post(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_vote_remove_post.
  // Step 2: Execute test_api_vote_remove_post's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const vote = await api.functional.votes.vote(state.owner, { postId: state.post.id, value: 1 }); typia.assert(vote); const result = await api.functional.votes.post.removePostVote(state.owner, state.post.id); typia.assert(result); requireValue(result, "Post vote removal did not report success."); const post = await api.functional.post.post({ host: connection.host }, state.post.id); typia.assert(post); requireValue(post.score === 0, "Post vote removal did not restore the score."); }



