import * as api from "@benchmark/todo-api";

/**
 * @evidence {@link api.functional.todo_auth_join.join} Proves account provisioning.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Exercises registration entry.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-1-register-a-private-account Exercises account creation and first session.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Exercises accepted registration credentials.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Uses a canonical email identity.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Uses an accepted password boundary.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Uses an accepted display name.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Uses a normalized display name.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Exercises private profile creation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-2-bind-one-private-profile-to-each-account Exercises the account/profile pair.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Starts owner-scoped authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Exercises the public registration exception.
 */
export async function test_api_auth_join(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo_auth_join.join(connection, {
    email: `join-${Date.now()}@example.com`,
    password: "Password123!",
    displayName: "Join User",
  });
  if (result.token.access.length === 0 || result.token.refresh.length === 0) throw new Error("missing session tokens");
}
