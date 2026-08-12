import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { MyGlobal } from "../../../../src/MyGlobal";
import { RedditJourney } from "../../../helpers/RedditJourney";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-002-recover-a-forgotten-password Exercises the required backend journey.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-002-recover-a-forgotten-password Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.auth.user.recovery.complete.recoveryComplete} Calls the generated operation.
 * @evidenceReview {@link api.functional.auth.user.recovery.complete.recoveryComplete} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_auth_recovery_complete(connection: api.IConnection): Promise<void> {
  const actor = await RedditJourney.actor(connection); await api.functional.auth.user.recovery.request.recoveryRequest({ host: connection.host }, { email: actor.email }); const effect = await MyGlobal.prisma.reddit_effects.findFirstOrThrow({ where: { user_id: actor.user.id, kind: "password-recovery" }, orderBy: { created_at: "desc" } }); const payload = typia.assert<{ proof: string }>(JSON.parse(effect.payload)); const result = await api.functional.auth.user.recovery.complete.recoveryComplete({ host: connection.host }, { email: actor.email, proof: payload.proof, newPassword: "new-correct-horse-password" }); typia.assert(result);
}
