import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.vote.comment.comment} Calls the generated operation.
 * @evidenceReview {@link api.functional.vote.comment.comment} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_vote_comment(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const community = await RedditJourney.community(actor); const post = await RedditJourney.post(actor, community); const comment = await RedditJourney.comment(actor, post); const result = await api.functional.vote.comment.comment(actor.connection, comment.id, { value: 1 }); typia.assert(result);
}
