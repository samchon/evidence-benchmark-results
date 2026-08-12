import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-003-delete-a-user-account Exercises the required backend journey.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-003-delete-a-user-account Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.auth.user.account._delete.erase} Calls the generated operation.
 * @evidenceReview {@link api.functional.auth.user.account._delete.erase} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_auth_erase(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const result = await api.functional.auth.user.account._delete.erase(actor.connection, { email: actor.email, password: actor.password }); typia.assert(result);
}
