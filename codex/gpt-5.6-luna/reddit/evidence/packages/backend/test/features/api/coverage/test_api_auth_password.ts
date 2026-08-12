import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-001-change-the-current-password Exercises the required backend journey.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-001-change-the-current-password Read the final password journey and ran it in the backend suite; verified same-password refusal, old-password rejection, and successful new-password login.
 * @evidence {@link api.functional.auth.user.password} Calls the generated operation.
 * @evidenceReview {@link api.functional.auth.user.password} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_auth_password(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); const nextPassword = "new-correct-horse-password"; const result = await api.functional.auth.user.password(actor.connection, { currentPassword: actor.password, newPassword: nextPassword }); typia.assert(result);
  let rejected = false;
  try { await api.functional.auth.user.password(actor.connection, { currentPassword: nextPassword, newPassword: nextPassword }); } catch { rejected = true; }
  if (rejected === false) throw new Error("Password reuse was not refused.");
  try { await api.functional.auth.user.login({ host: connection.host }, { email: actor.email, password: actor.password }); throw new Error("The old password still authenticates."); } catch (error) { if (error instanceof Error && error.message === "The old password still authenticates.") throw error; }
  typia.assert(await api.functional.auth.user.login({ host: connection.host }, { email: actor.email, password: nextPassword }));
}
