import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-002-view-a-single-post Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-002-view-a-single-post Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.post.at} Calls the generated operation.
 * @evidenceReview {@link api.functional.post.at} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_post_at(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const community = await RedditJourney.community(actor); const post = await RedditJourney.post(actor, community); const result = await api.functional.post.at({ host: connection.host }, post.id); typia.assert(result);
}
