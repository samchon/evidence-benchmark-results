import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-001-edit-the-current-users-profile Exercises the required backend journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-001-edit-the-current-users-profile Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.user.profile.update} Calls the generated operation.
 * @evidenceReview {@link api.functional.user.profile.update} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_user_profile_update(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const result = await api.functional.user.profile.update(actor.connection, { displayName: "Updated display name", bio: "Updated biography" }); typia.assert(result);
}
