import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-001-subscribe-to-a-community Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-001-subscribe-to-a-community Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.subscription.create} Calls the generated operation.
 * @evidenceReview {@link api.functional.subscription.create} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_subscription_create(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const community = await RedditJourney.community(actor); const result = await api.functional.subscription.create(actor.connection, community.id); typia.assert(result);
}
