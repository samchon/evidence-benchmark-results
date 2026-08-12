import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves an active vote is entered and returned.
 *
 * 1. Create the actors and prerequisite records used by test_api_vote_enter.
 * 2. Execute test_api_vote_enter's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_vote_enter(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_vote_enter.
  // Step 2: Execute test_api_vote_enter's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host); const result = await api.functional.votes.vote(state.owner, { postId: state.post.id, value: 1 });
  typia.assert(result); const post = await api.functional.post.post({ host: connection.host }, state.post.id); typia.assert(post); requireValue(result.postId === state.post.id && result.value === 1 && result.commentId === null, "Post vote did not return its target and direction."); requireValue(post.score === 1, "Post vote did not change the public score."); }



