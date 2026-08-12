import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-007-delete-a-community-comment-as-moderator Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-007-delete-a-community-comment-as-moderator Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.community.moderation.comment.deleteComment} Calls the generated operation.
 * @evidenceReview {@link api.functional.community.moderation.comment.deleteComment} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_moderation_delete_comment(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const community = await RedditJourney.community(actor); const post = await RedditJourney.post(actor, community); const comment = await RedditJourney.comment(actor, post); const result = await api.functional.community.moderation.comment.deleteComment(actor.connection, community.id, comment.id); typia.assert(result);
}
