import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-001-write-a-top-level-comment Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-001-write-a-top-level-comment Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.comment.post.create} Calls the generated operation.
 * @evidenceReview {@link api.functional.comment.post.create} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_comment_create(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const community = await RedditJourney.community(actor); const post = await RedditJourney.post(actor, community); const result = await api.functional.comment.post.create(actor.connection, post.id, { text: "A top-level comment." }); typia.assert(result);
}
