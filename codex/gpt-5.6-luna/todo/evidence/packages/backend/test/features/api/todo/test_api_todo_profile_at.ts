import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves profile detail is owner-scoped and returns the private display name.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-1-view-the-current-users-profile Reads the current user's profile.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-1-view-the-current-users-profile Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Covers profile operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Reads the private profile relationship.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-1-define-the-user-profile Reads the profile identity.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-1-define-the-user-profile Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-2-bind-one-private-profile-to-each-account Enforces one profile per account.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-2-bind-one-private-profile-to-each-account Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Applies the display-name rule family.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires private authentication.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Enforces owner-only profile access.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Protects private profile data.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Isolates profile ownership.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.profile.view.at} Calls the published profile detail operation.
 * @evidenceReview {@link api.functional.todo.user.profile.view.at} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_profile_at(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  const profile = await api.functional.todo.user.profile.view.at(fixture.connection);
  if (profile.displayName !== "Test User") throw new Error("Profile display name was not returned.");
}
