import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { MyGlobal } from "../../../../src/MyGlobal";
import { authorizeDetailed } from "../../../helpers/RedditScenario";
import { refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves a consumed recovery proof is refused on reuse.
 *
 * 1. Create the actors and prerequisite records used by test_api_auth_recovery_proof_reuse_refused.
 * 2. Execute test_api_auth_recovery_proof_reuse_refused's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_auth_recovery_proof_reuse_refused(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_auth_recovery_proof_reuse_refused.
  // Step 2: Execute test_api_auth_recovery_proof_reuse_refused's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const account = await authorizeDetailed(connection.host); const email = `${account.user.username}@example.com`; const requested = await api.functional.auth.recovery.request.recoveryRequest({ host: connection.host }, { email }); typia.assert(requested); const delivery = await MyGlobal.prisma.recovery_proofs.findFirst({ where: { recipient_email: email }, orderBy: { created_at: "desc" }, select: { proof_payload: true } }); requireValue(delivery?.proof_payload !== undefined, "Recovery delivery did not preserve a consumable proof."); const completed = await api.functional.auth.recovery.complete.recoveryComplete({ host: connection.host }, { proof: delivery.proof_payload, newPassword: "password-456" }); typia.assert(completed); if (!completed) throw new Error("Recovery completion did not report success."); if (!await refused(() => api.functional.auth.recovery.complete.recoveryComplete({ host: connection.host }, { proof: delivery.proof_payload, newPassword: "password-789" }))) throw new Error("A consumed recovery proof remained usable."); }



