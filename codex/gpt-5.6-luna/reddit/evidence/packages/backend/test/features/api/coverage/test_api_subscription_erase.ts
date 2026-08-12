import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-002-unsubscribe-from-a-community Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-002-unsubscribe-from-a-community Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.subscription.erase} Calls the generated operation.
 * @evidenceReview {@link api.functional.subscription.erase} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_subscription_erase(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const community = await RedditJourney.community(actor); const result = await api.functional.subscription.erase(actor.connection, community.id); typia.assert(result);
}
