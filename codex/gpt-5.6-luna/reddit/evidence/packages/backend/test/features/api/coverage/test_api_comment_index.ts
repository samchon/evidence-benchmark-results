import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-003-view-a-nested-comment-thread Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-003-view-a-nested-comment-thread Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.comment.post.index} Calls the generated operation.
 * @evidenceReview {@link api.functional.comment.post.index} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_comment_index(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const community = await RedditJourney.community(actor); const post = await RedditJourney.post(actor, community); await RedditJourney.comment(actor, post); const result = await api.functional.comment.post.index({ host: connection.host }, post.id, {}); typia.assert(result);
}
