import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-002-view-the-public-popular-feed Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-002-view-the-public-popular-feed Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.feed.popular} Calls the generated operation.
 * @evidenceReview {@link api.functional.feed.popular} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_feed_popular(connection: api.IConnection): Promise<void> {
  const result = await api.functional.feed.popular({ host: connection.host }, {}); typia.assert(result);
}
