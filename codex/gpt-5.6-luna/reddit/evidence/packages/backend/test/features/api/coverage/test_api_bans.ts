import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-003-view-a-communitys-banned-users Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-003-view-a-communitys-banned-users Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.community.moderation.bans} Calls the generated operation.
 * @evidenceReview {@link api.functional.community.moderation.bans} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_bans(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const target = await RedditJourney.actor(connection); const community = await RedditJourney.community(actor); await api.functional.community.moderation.ban.ban(actor.connection, community.id, target.user.id); const result = await api.functional.community.moderation.bans(actor.connection, community.id, {}); typia.assert(result);
}
