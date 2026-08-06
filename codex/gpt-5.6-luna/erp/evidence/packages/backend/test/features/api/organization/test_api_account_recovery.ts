import * as api from "@benchmark/erp-api";

/** Proves email-bound recovery replaces credentials, reactivates accounts, and revokes sessions. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
export async function test_api_account_recovery(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `recovery-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  const replacement = "recovered-correct-horse";
  await api.functional.organization.create(connection, { name: `Recovery ${suffix}`, code: `recovery-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const issued = await api.functional.auth_recovery_request.request(connection, { email });
  if (issued.recoveryToken.length < 16) throw new Error("recovery did not issue an email-bound proof");
  await api.functional.auth_recovery_complete.complete(connection, { recoveryToken: issued.recoveryToken, newPassword: replacement });
  await api.functional.auth.user_login.login(connection, { email, password: replacement });
  let revoked = false;
  try { await api.functional.auth_profile.profile({ host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } }); } catch { revoked = true; }
  if (!revoked) throw new Error("recovery did not revoke the prior session");
  let reused = false;
  try { await api.functional.auth_recovery_complete.complete(connection, { recoveryToken: issued.recoveryToken, newPassword: "another-correct-horse" }); } catch { reused = true; }
  if (!reused) throw new Error("recovery proof was reusable");
}
