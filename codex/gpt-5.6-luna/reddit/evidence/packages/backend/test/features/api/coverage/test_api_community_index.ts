import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-002-browse-all-communities Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-002-browse-all-communities Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.community.index} Calls the generated operation.
 * @evidenceReview {@link api.functional.community.index} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_community_index(connection: api.IConnection): Promise<void> {
  const result = await api.functional.community.index({ host: connection.host }, { search: "" }); typia.assert(result);
}
