import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { scenario } from "../../../helpers/RedditScenario";
import { page } from "../../../helpers/RequirementTest";

/**
 * Proves a vote direction change replaces the prior signed contribution.
 *
 * 1. Create the actors and prerequisite records used by test_api_vote_direction_change.
 * 2. Execute test_api_vote_direction_change's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_vote_direction_change(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_vote_direction_change.
  // Step 2: Execute test_api_vote_direction_change's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const state = await scenario(connection.host);
  const firstVote = await api.functional.votes.vote(state.member, { postId: state.post.id, value: 1 });
  typia.assert(firstVote);
  const firstPost = await api.functional.post.post({ host: connection.host }, state.post.id);
  typia.assert(firstPost);
  if (firstPost.score !== 1) throw new Error("Upvote score was not applied.");
  const firstProfile = await api.functional.profile.profile({ host: connection.host }, state.memberUser.username, { posts: page(), comments: page() });
  typia.assert(firstProfile);
  if (firstProfile.karma !== 1) throw new Error("Upvote karma was not applied to the post author.");
  const secondVote = await api.functional.votes.vote(state.member, { postId: state.post.id, value: -1 });
  typia.assert(secondVote);
  const secondPost = await api.functional.post.post({ host: connection.host }, state.post.id);
  typia.assert(secondPost);
  if (secondPost.score !== -1) throw new Error("Vote direction did not replace the prior vote.");
  const secondProfile = await api.functional.profile.profile({ host: connection.host }, state.memberUser.username, { posts: page(), comments: page() });
  typia.assert(secondProfile);
  if (secondProfile.karma !== -1) throw new Error("Reversed vote karma was not applied to the post author.");
}



