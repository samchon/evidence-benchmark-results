import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page } from "../../../helpers/RequirementTest";

/**
 * Proves removing a signed vote reverses both score and author karma.
 *
 * 1. Create the actors and prerequisite records used by test_api_vote_removal_reverses_karma.
 * 2. Execute test_api_vote_removal_reverses_karma's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_vote_removal_reverses_karma(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_vote_removal_reverses_karma.
  // Step 2: Execute test_api_vote_removal_reverses_karma's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host);
  const vote = await api.functional.votes.vote(state.member, { postId: state.post.id, value: -1 });
  typia.assert(vote);
  const removed = await api.functional.votes.post.removePostVote(state.member, state.post.id);
  typia.assert(removed);
  const post = await api.functional.post.post({ host: connection.host }, state.post.id);
  typia.assert(post);
  if (post.score !== 0) throw new Error("Vote removal did not reverse the score.");
  const profile = await api.functional.profile.profile({ host: connection.host }, state.memberUser.username, { posts: page(), comments: page() });
  typia.assert(profile);
  if (profile.karma !== 0) throw new Error("Vote removal did not reverse the post author's karma.");
}



