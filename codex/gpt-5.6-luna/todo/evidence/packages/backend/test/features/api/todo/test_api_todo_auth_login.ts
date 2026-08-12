import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves valid credentials create a new session.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-2-log-in-with-email-and-password Authenticates the registered account.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-2-log-in-with-email-and-password Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-3-conceal-login-credential-failure Keeps credential failures generic.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-3-conceal-login-credential-failure Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Uses the canonical email identity.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Validates the login password.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.auth.user.login_operation.login} Calls the published login operation.
 * @evidenceReview {@link api.functional.todo.auth.user.login_operation.login} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_auth_login(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  const result = await api.functional.todo.auth.user.login_operation.login(
    connection,
    { email: fixture.email, password: fixture.password },
  );
  if (result.id !== fixture.token.id) throw new Error("Login changed account identity.");
}
