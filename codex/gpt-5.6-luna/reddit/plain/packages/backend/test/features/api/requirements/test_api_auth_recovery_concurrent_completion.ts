import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { MyGlobal } from "../../../../src/MyGlobal";
import { authorizeDetailed } from "../../../helpers/RedditScenario";
import { refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves concurrent recovery completion attempts consume one proof exactly once.
 *
 * 1. Create the actors and prerequisite records used by test_api_auth_recovery_concurrent_completion.
 * 2. Execute test_api_auth_recovery_concurrent_completion's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_auth_recovery_concurrent_completion(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_auth_recovery_concurrent_completion.
  // Step 2: Execute test_api_auth_recovery_concurrent_completion's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const account = await authorizeDetailed(connection.host); const email = `${account.user.username}@example.com`; const requested = await api.functional.auth.recovery.request.recoveryRequest({ host: connection.host }, { email }); typia.assert(requested); const delivery = await MyGlobal.prisma.recovery_proofs.findFirst({ where: { recipient_email: email }, orderBy: { created_at: "desc" }, select: { proof_payload: true } }); requireValue(delivery?.proof_payload !== undefined, "Recovery delivery did not preserve a consumable proof."); const outcomes = await Promise.allSettled([api.functional.auth.recovery.complete.recoveryComplete({ host: connection.host }, { proof: delivery.proof_payload, newPassword: "password-456" }), api.functional.auth.recovery.complete.recoveryComplete({ host: connection.host }, { proof: delivery.proof_payload, newPassword: "password-789" })]); for (const outcome of outcomes) if (outcome.status === "fulfilled") typia.assert(outcome.value); requireValue(outcomes.filter((outcome) => outcome.status === "fulfilled").length === 1 && outcomes.filter((outcome) => outcome.status === "rejected").length === 1, "Concurrent recovery completion did not produce exactly one accepted proof consumption."); const first = await refused(() => api.functional.auth.login({ host: connection.host }, { email, password: "password-456" })); const second = await refused(() => api.functional.auth.login({ host: connection.host }, { email, password: "password-789" })); requireValue(first !== second, "Concurrent recovery completion did not leave exactly one replacement password active."); }



