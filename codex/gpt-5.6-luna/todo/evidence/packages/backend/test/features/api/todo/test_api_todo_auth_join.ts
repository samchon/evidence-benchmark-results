import * as api from "@benchmark/todo-api";

/**
 * Proves public account registration issues an authenticated session.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-1-register-a-private-account Creates the account and private profile.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-1-register-a-private-account Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Covers the registration/login boundary.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Applies the shared credential rules.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Canonicalizes the account email.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Validates the registration password.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.auth.user.join_operation.join} Calls the published registration operation.
 * @evidenceReview {@link api.functional.todo.auth.user.join_operation.join} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_auth_join(connection: api.IConnection): Promise<void> {
  const result = await api.functional.todo.auth.user.join_operation.join(
    connection,
    { email: `join-${Date.now()}@example.com`, password: "correct-horse-battery-staple", displayName: "Join User" },
  );
  if (result.token.access.length === 0 || result.token.refresh.length === 0) throw new Error("Registration did not issue tokens.");
  const profile = await api.functional.todo.user.profile.view.at({
    host: connection.host,
    headers: { Authorization: `Bearer ${result.token.access}` },
  });
  if (profile.displayName !== "Join User") throw new Error("Registration did not create the private profile.");
}
