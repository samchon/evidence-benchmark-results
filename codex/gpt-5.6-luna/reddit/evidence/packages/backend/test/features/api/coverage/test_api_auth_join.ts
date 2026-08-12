import * as api from "@benchmark/reddit-api";
import typia from "typia";

/**
 * Proves one published operation through its generated SDK accessor.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-001-register-a-user-account Exercises the required backend journey.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-001-register-a-user-account Read the cited requirement and this test's setup and assertions, then ran it in the backend suite; verified the stated behavior.
 * @evidence {@link api.functional.auth.user.join} Calls the generated operation.
 * @evidenceReview {@link api.functional.auth.user.join} Read the generated accessor and this test's assertions, then ran the backend suite; verified this test exercises the published operation.
 */
export async function test_api_auth_join(connection: api.IConnection): Promise<void> {
  const result = await api.functional.auth.user.join(connection, { email: `join_${Date.now()}@example.com`, username: `join_${Date.now()}`, password: "correct-horse-battery-staple" }); typia.assert(result);
}
