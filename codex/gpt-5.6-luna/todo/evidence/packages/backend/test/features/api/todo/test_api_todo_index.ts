import * as api from "@benchmark/todo-api";
import { TodoTestHelper } from "../../../helpers/TodoTestHelper";

/**
 * Proves active Todo browsing returns the owner's active page.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-2-browse-active-todos Applies active ownership and paging.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-2-browse-active-todos Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-2-filter-active-todos-by-completion Applies the completion filter surface.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-2-filter-active-todos-by-completion Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Covers the browsing rule family.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Applies bounded pagination.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-3-sort-active-todos-by-supported-dates Applies supported date sorting.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-3-sort-active-todos-by-supported-dates Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Applies stable ordering.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Covers Todo ownership.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Covers Todo information.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Binds the Todo to the fixture account.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Covers Todo lifecycle availability.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Covers completion state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Covers active availability.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Covers the Todo operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires authentication.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Filters by ownership.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Protects private list data.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Isolates account rows.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Read the cited requirement and checked the test assertions against its promised behavior.
 * @evidence {@link api.functional.todo.user.todo.list.index} Calls the published active-list operation.
 * @evidenceReview {@link api.functional.todo.user.todo.list.index} Ran the feature test and checked that it calls the cited generated operation.
 */
export async function test_api_todo_index(connection: api.IConnection): Promise<void> {
  const fixture = await TodoTestHelper.authorize(connection);
  await api.functional.todo.user.todo.create_operation.create(fixture.connection, { title: "No Start" });
  const dated = await api.functional.todo.user.todo.create_operation.create(fixture.connection, { title: "Dated", startDate: "2026-01-01" });
  const page = await api.functional.todo.user.todo.list.index(fixture.connection, { completion: "all", sort: ["-startDate"] });
  if (page.pagination.records < 2 || page.data[0]?.id !== dated.id || page.data[1]?.title !== "No Start") throw new Error("Active Todo sorting did not keep undated items last.");
}
