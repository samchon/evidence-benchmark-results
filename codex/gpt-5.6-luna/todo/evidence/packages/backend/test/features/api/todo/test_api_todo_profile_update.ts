import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves profile editing replaces only the normalized display name.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-2-edit-the-display-name Updates the current profile name.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-2-edit-the-display-name Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Applies the display-name rule.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.profile.update_operation.update} Calls the published profile update operation.
 * @evidenceReview {@link api.functional.todo.user.profile.update_operation.update} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_profile_update(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  const profile = await api.functional.todo.user.profile.update_operation.update(fixture.connection, { displayName: "  Updated User  " });
  if (profile.displayName !== "Updated User") throw new Error("Profile name was not normalized.");
}
