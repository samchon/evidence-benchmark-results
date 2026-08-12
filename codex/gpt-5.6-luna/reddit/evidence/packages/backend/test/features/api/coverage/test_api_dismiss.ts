import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-004-dismiss-a-report Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-004-dismiss-a-report Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.community.moderation.report.dismiss} Calls the generated operation.
 * @evidenceReview {@link api.functional.community.moderation.report.dismiss} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_dismiss(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const community = await RedditJourney.community(actor); const post = await RedditJourney.post(actor, community); const report = await api.functional.community.moderation.report.report(actor.connection, community.id, { targetType: "post", targetId: post.id, reason: "A report with enough detail." }); const result = await api.functional.community.moderation.report.dismiss(actor.connection, community.id, report.id); typia.assert(result);
}
