import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-001-create-a-post Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-001-create-a-post Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.post.community.create} Calls the generated operation.
 * @evidenceReview {@link api.functional.post.community.create} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_post_create(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const community = await RedditJourney.community(actor); const result = await api.functional.post.community.create(actor.connection, community.id, { title: "A created post", type: "text", text: "A created post body." }); typia.assert(result);
}
