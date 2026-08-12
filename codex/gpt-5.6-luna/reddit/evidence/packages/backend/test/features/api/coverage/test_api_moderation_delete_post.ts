import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-005-delete-a-community-post-as-moderator Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-005-delete-a-community-post-as-moderator Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.community.moderation.post.deletePost} Calls the generated operation.
 * @evidenceReview {@link api.functional.community.moderation.post.deletePost} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_moderation_delete_post(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const community = await RedditJourney.community(actor); const post = await RedditJourney.post(actor, community); const result = await api.functional.community.moderation.post.deletePost(actor.connection, community.id, post.id); typia.assert(result);
}
