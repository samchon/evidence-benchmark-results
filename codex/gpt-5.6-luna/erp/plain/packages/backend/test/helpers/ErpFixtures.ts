import * as api from "@benchmark/erp-api";

/** An authenticated test actor and its created organization. */
export interface OwnerFixture {
  /** Authenticated connection with an active organization context. */
  connection: api.IConnection;
  /** Login email. */
  email: string;
  /** Password used only to authenticate setup actors. */
  password: string;
  /** Owner membership identifier. */
  membershipId: string;
}

/** Creates an isolated owner through the public organization operation. */
export async function create_owner(base: api.IConnection): Promise<OwnerFixture> {
  const suffix = Math.random().toString(36).slice(2, 10);
  const email = `owner-${suffix}@example.com`;
  const password = "owner-password-123";
  const connection: api.IConnection = { host: base.host };
  const result = await api.functional.erp.auth.organization(connection, {
    name: `Organization ${suffix}`,
    email,
    password,
    displayName: "Organization Owner",
    baseCurrency: "USD",
    timezone: "UTC",
    fiscalStartMonth: 1,
  });
  connection.headers = { authorization: `Bearer ${result.accessToken}` };
  const membership = result.memberships[0];
  if (membership === undefined) throw new Error("Organization creation did not return its Owner membership.");
  return { connection, email, password, membershipId: membership.id };
}

/** Logs in without relying on the previous session's selected context. */
export async function login_owner(base: api.IConnection, fixture: OwnerFixture): Promise<api.IConnection> {
  const connection: api.IConnection = { host: base.host };
  const result = await api.functional.erp.auth.login(connection, { email: fixture.email, password: fixture.password });
  connection.headers = { authorization: `Bearer ${result.accessToken}` };
  return connection;
}
