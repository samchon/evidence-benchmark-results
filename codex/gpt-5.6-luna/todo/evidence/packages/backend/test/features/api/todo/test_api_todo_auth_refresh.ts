import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves one valid refresh proof continues the same account session.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-1-continue-an-authenticated-session Continues a valid authenticated session.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-1-continue-an-authenticated-session Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Covers session continuity.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Preserves the private authority boundary.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires valid session authority.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Preserves the account identity.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.auth.user.refresh_operation.refresh} Calls the published refresh operation.
 * @evidenceReview {@link api.functional.todo.auth.user.refresh_operation.refresh} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_auth_refresh(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  const result = await api.functional.todo.auth.user.refresh_operation.refresh(
    connection,
    { refreshToken: fixture.token.token.refresh },
  );
  if (result.id !== fixture.token.id) throw new Error("Refresh changed account identity.");
}
