import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { MyGlobal } from "../../../../src/MyGlobal";
import { authorizeDetailed, loginDetailed } from "../../../helpers/RedditScenario";
import { page, refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves the recorded recovery proof resets the password and revokes prior sessions.
 *
 * 1. Create the actors and prerequisite records used by test_api_auth_recovery_complete.
 * 2. Execute test_api_auth_recovery_complete's primary generated API operation for the documented scenario.
 * 3. Assert the returned business outcome and the public follow-up state when the requirement names one.
 */ 
export async function test_api_auth_recovery_complete(connection: api.IConnection): Promise<void> {
  // Step 1: Create the actors and prerequisite records used by test_api_auth_recovery_complete.
  // Step 2: Execute test_api_auth_recovery_complete's primary generated API operation for the documented scenario.
  // Step 3: Assert the returned business outcome and the public follow-up state when the requirement names one.
  const account = await authorizeDetailed(connection.host); const email = `${account.user.username}@example.com`;
  const other = await loginDetailed(connection.host, email, "password-123");
  const requested = await api.functional.auth.recovery.request.recoveryRequest({ host: connection.host }, { email }); typia.assert(requested); requireValue(requested, "Recovery request did not return success.");
  const delivery = await MyGlobal.prisma.recovery_proofs.findFirst({ where: { recipient_email: email }, orderBy: { created_at: "desc" }, select: { proof_payload: true } }); requireValue(delivery?.proof_payload !== undefined, "Recovery delivery did not preserve a consumable proof.");
  if (!await refused(() => api.functional.auth.recovery.complete.recoveryComplete({ host: connection.host }, { proof: delivery.proof_payload, newPassword: "short" }))) throw new Error("Recovery accepted a password shorter than eight characters.");
  if (!await refused(() => api.functional.auth.recovery.complete.recoveryComplete({ host: connection.host }, { proof: delivery.proof_payload, newPassword: "x".repeat(129) }))) throw new Error("Recovery accepted a password longer than 128 characters.");
  const result = await api.functional.auth.recovery.complete.recoveryComplete({ host: connection.host }, { proof: delivery.proof_payload, newPassword: "password-456" }); typia.assert(result); requireValue(result, "Valid recovery proof was not accepted.");
  if (!await refused(() => api.functional.subscriptions(account.connection, page())) || !await refused(() => api.functional.subscriptions(other.connection, page()))) throw new Error("Recovery did not revoke every prior session.");
  const login = await api.functional.auth.login({ host: connection.host }, { email, password: "password-456" });
  typia.assert(login); requireValue(login.user.username === account.user.username, "Recovery did not replace the account password.");
}
