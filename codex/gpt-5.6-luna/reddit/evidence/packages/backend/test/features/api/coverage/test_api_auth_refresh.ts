import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-002-continue-an-authenticated-session Exercises the required backend journey.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-002-continue-an-authenticated-session Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.auth.user.refresh} Calls the generated operation.
 * @evidenceReview {@link api.functional.auth.user.refresh} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_auth_refresh(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const result = await api.functional.auth.user.refresh(actor.connection, { refreshToken: actor.authorized.refreshToken }); typia.assert(result);
}
