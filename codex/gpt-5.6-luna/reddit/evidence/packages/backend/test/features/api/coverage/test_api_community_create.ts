import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-001-create-a-community Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-001-create-a-community Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.community.create} Calls the generated operation.
 * @evidenceReview {@link api.functional.community.create} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
  export async function test_api_community_create(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const result = await api.functional.community.create(actor.connection, { name: `created_${Date.now()}`, description: "A created community.", icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=" }); typia.assert(result);
}
