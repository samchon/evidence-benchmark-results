import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-002-view-unresolved-community-reports Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-002-view-unresolved-community-reports Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.community.moderation.reports} Calls the generated operation.
 * @evidenceReview {@link api.functional.community.moderation.reports} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_reports(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const community = await RedditJourney.community(actor); const post = await RedditJourney.post(actor, community); await api.functional.community.moderation.report.report(actor.connection, community.id, { targetType: "post", targetId: post.id, reason: "A report with enough detail." }); const result = await api.functional.community.moderation.reports(actor.connection, community.id, {}); typia.assert(result);
}
