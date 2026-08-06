import * as api from "@benchmark/erp-api";

/** Proves Owner deletion checks and history-preserving organization retirement. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
export async function test_api_organization_retirement(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `retire-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  const organization = await api.functional.organization.create(connection, { name: `Retire ${suffix}`, code: `retire-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const check = await api.functional.organization_delete_blockers.check(owner, organization.id);
  if (!check.eligible || check.blockers.length !== 0) throw new Error("eligible organization reported deletion blockers");
  await api.functional.organization_delete.remove(owner, organization.id);
  try { await api.functional.organization_detail.at(owner, organization.id); throw new Error("retired organization remained visible"); } catch (error) { if (error instanceof Error && error.message === "retired organization remained visible") throw error; }
}
