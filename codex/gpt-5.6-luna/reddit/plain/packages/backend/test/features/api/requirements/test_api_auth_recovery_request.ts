import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { MyGlobal } from "../../../../src/MyGlobal";
import { authorizeDetailed } from "../../../helpers/RedditScenario";
import { requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves recovery requests record a private delivery effect and keep a neutral response.
 *
 * 1. Create the actors and prerequisite records used by test_api_auth_recovery_request.
 * 2. Execute test_api_auth_recovery_request's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_auth_recovery_request(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_auth_recovery_request.
  // Step 2: Execute test_api_auth_recovery_request's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const account = await authorizeDetailed(connection.host); const email = `${account.user.username}@example.com`; const result = await api.functional.auth.recovery.request.recoveryRequest({ host: connection.host }, { email }); typia.assert(result); requireValue(result, "Recovery request did not return the neutral success outcome."); const delivery = await MyGlobal.prisma.recovery_proofs.findFirst({ where: { recipient_email: email }, orderBy: { created_at: "desc" }, select: { recipient_email: true, proof_payload: true, used_at: true } }); requireValue(delivery?.recipient_email === email && (delivery.proof_payload?.length ?? 0) > 0 && delivery.used_at === null, "Recovery request did not record the recipient and proof delivery effect."); const unknown = await api.functional.auth.recovery.request.recoveryRequest({ host: connection.host }, { email: "unknown@example.com" }); typia.assert(unknown); requireValue(unknown, "Unknown recovery request did not preserve the neutral outcome."); }


