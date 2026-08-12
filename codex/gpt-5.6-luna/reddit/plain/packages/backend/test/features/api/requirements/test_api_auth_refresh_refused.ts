import * as api from "@benchmark/reddit-api";
import { refused } from "../../../helpers/RequirementTest";

/**
 * Proves a missing refresh proof cannot establish an authenticated session.
 *
 * 1. Create an anonymous connection without a refresh proof.
 * 2. Invoke the refresh operation with an invalid proof.
 * 3. Assert that continuation is refused.
 */
export async function test_api_auth_refresh_refused(connection: api.IConnection): Promise<void> {
  // Step 1: Create an anonymous connection without a refresh proof.
  const anonymous: api.IConnection = { host: connection.host };
  // Step 2: Invoke the refresh operation with an invalid proof.
  // Step 3: Assert that continuation is refused.
  if (!await refused(() => api.functional.auth.refresh(anonymous, { refreshToken: "invalid-refresh-proof" }))) throw new Error("An invalid refresh proof was accepted.");
}
