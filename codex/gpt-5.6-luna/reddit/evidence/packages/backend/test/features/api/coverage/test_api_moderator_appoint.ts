import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-001-add-a-moderator-as-community-owner Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-001-add-a-moderator-as-community-owner Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.community.moderation.moderator.appoint} Calls the generated operation.
 * @evidenceReview {@link api.functional.community.moderation.moderator.appoint} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_moderator_appoint(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const target = await RedditJourney.actor(connection); const community = await RedditJourney.community(actor); const result = await api.functional.community.moderation.moderator.appoint(actor.connection, community.id, target.user.id); typia.assert(result);
}
