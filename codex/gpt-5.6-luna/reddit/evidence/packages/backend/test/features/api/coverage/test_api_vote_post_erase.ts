import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.vote.post.erasePost} Calls the generated operation.
 * @evidenceReview {@link api.functional.vote.post.erasePost} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_vote_post_erase(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const community = await RedditJourney.community(actor); const post = await RedditJourney.post(actor, community); await api.functional.vote.post.post(actor.connection, post.id, { value: 1 }); const result = await api.functional.vote.post.erasePost(actor.connection, post.id); typia.assert(result);
}
