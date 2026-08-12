import * as api from "@benchmark/reddit-api";
import typia from "typia";
import { authorizeDetailed } from "../../../helpers/RedditScenario";
import { refused, requireValue } from "../../../helpers/RequirementTest";

/**
 * Proves a password replaced through the authenticated password operation no longer works.
 *
 * 1. Create an account and successfully replace its password through the public operation.
 * 2. Attempt login with the superseded password.
 * 3. Assert that the obsolete credential is refused.
 */
export async function test_api_auth_password_old_refused(connection: api.IConnection): Promise<void> {
  // Step 1: Create an account and successfully replace its password through the public operation.
  const account = await authorizeDetailed(connection.host);
  const changed = await api.functional.auth.password(account.connection, { currentPassword: "password-123", newPassword: "password-456" });
  typia.assert(changed);
  requireValue(changed, "Password replacement setup did not report success.");
  // Step 2: Attempt login with the superseded password.
  // Step 3: Assert that the obsolete credential is refused.
  if (!await refused(() => api.functional.auth.login({ host: connection.host }, { email: `${account.user.username}@example.com`, password: "password-123" }))) throw new Error("The superseded password remained valid.");
}
