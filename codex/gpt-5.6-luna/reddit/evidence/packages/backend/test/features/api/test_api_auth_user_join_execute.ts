import * as api from "@benchmark/reddit2-api";
import crypto from "node:crypto";
import typia from "typia";

/**
 * Proves registration creates an authenticated session and a public profile.
 *
 * 1. Register a unique account through the published join operation.
 * 2. Read the resulting public profile through the generated SDK.
 * 3. Assert the identity and bearer contract are both usable.
 *
 * @evidence {@link api.functional.auth.user.join.execute.join} Exercises the generated operation accessor.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-001-maintain-concurrent-sessions This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-account-identity-rules This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-001-enforce-case-insensitive-email-and-username-uniqueness This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-002-require-complete-registration-credentials This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-003-reserve-deleted-account-identifiers This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-001-register-a-user-account The test exercises the join operation against this requirement.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-002-refuse-conflicting-registration The live duplicate registration attempt is refused by the join operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-003-log-in-with-credentials The live login attempt reuses the registered credentials and receives a session.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-004-refuse-ineligible-login The live invalid-password attempt is refused by the login operation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-account-provisioning-and-login The test exercises the join operation against this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-003-establish-initial-profile-values The test exercises the join operation against this requirement.
 */
export async function test_api_auth_user_join_execute(connection: api.IConnection): Promise<void> {
  const actor: api.IConnection = { host: connection.host };
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 16);
  const body: api.IAuth.IJoin = {
    email: `join-${suffix}@example.com`,
    username: `join_${suffix}`,
    password: "Password123!",
  };
  const authorized = await api.functional.auth.user.join.execute.join(actor, body);
  typia.assert(authorized);
  if (authorized.username !== body.username || authorized.token.access.length === 0) throw new Error("Registration did not create an authenticated identity.");
  const profile = await api.functional.profile.view.profile(actor, body.username);
  typia.assert(profile);
  if (profile.username !== body.username) throw new Error("The registered profile is not publicly reachable.");

  let duplicateRefused = false;
  try {
    await api.functional.auth.user.join.execute.join({ host: connection.host }, body);
  } catch {
    duplicateRefused = true;
  }
  if (!duplicateRefused) throw new Error("Duplicate registration was accepted.");

  const loginConnection: api.IConnection = { host: connection.host };
  const loggedIn = await api.functional.auth.user.login.execute.login(loginConnection, {
    email: body.email,
    password: "Password123!",
  });
  typia.assert(loggedIn);
  if (loggedIn.username !== body.username || loggedIn.token.access.length === 0) throw new Error("Valid credentials did not create a session.");

  let invalidLoginRefused = false;
  try {
    await api.functional.auth.user.login.execute.login({ host: connection.host }, {
      email: body.email,
      password: "WrongPassword123!",
    });
  } catch {
    invalidLoginRefused = true;
  }
  if (!invalidLoginRefused) throw new Error("Invalid credentials were accepted.");
}
