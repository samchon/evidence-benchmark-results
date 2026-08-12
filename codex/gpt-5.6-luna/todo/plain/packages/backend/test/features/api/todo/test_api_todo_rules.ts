import * as api from "@benchmark/todo-api";
import { TestValidator } from "@nestia/e2e";
import typia from "typia";

import { createTodo, joinUser } from "../../../helpers/TodoSetup";

/**
 * Proves canonical email identity prevents a case-and-whitespace duplicate.
 *
 * 1. Register an account.
 * 2. Attempt registration with the same email in another case and whitespace.
 * 3. Log in using the canonical variant and assert the original account remains.
 */
export async function test_api_todo_rules_canonical_email(connection: api.IConnection): Promise<void> {
  // Step 1: Register an account
  const user = await joinUser(connection);
  // Step 2: Attempt registration with the same email in another case and whitespace
  await TestValidator.error("canonical duplicate email is refused", () => api.functional.todo.auth.user.join({ host: connection.host }, { email: `  ${user.email.toUpperCase()}  `, password: "another valid password", displayName: "Second Owner" }));
  // Step 3: Log in using the canonical variant and assert the original account remains
  const logged = await api.functional.todo.auth.user.login({ host: connection.host }, { email: ` ${user.email.toUpperCase()} `, password: user.password });
  typia.assert(logged);
}

/**
 * Proves display-name normalization and the whitespace-only boundary.
 *
 * 1. Join an account and update its display name with outer whitespace.
 * 2. Attempt whitespace-only and overlong profile updates.
 * 3. Read the profile and assert the accepted name survived the refusals.
 */
export async function test_api_todo_rules_display_name(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and update its display name with outer whitespace
  const user = await joinUser(connection);
  const updated = await api.functional.todo.user.profile.update(user.connection, { displayName: "  Trimmed Owner  " });
  typia.assert(updated);
  TestValidator.equals("display name is trimmed", updated.displayName, "Trimmed Owner");
  // Step 2: Attempt whitespace-only and overlong profile updates
  await TestValidator.error("whitespace-only display name is refused", () => api.functional.todo.user.profile.update(user.connection, { displayName: "    " }));
  const current = await api.functional.todo.user.profile.at(user.connection);
  // Step 3: Read the profile and assert the accepted name survived the refusals
  TestValidator.equals("refused profile edit preserves the prior name", current.displayName, "Trimmed Owner");
  await TestValidator.error("overlong display name is refused", () => api.functional.todo.user.profile.update(user.connection, { displayName: "x".repeat(101) }));
}

/**
 * Proves registration rejects passwords outside the shared length boundary.
 *
 * 1. Submit a registration with a short password.
 * 2. Submit a registration with an overlong password.
 * 3. Assert both boundary violations are refused.
 */
export async function test_api_todo_rules_password_boundary(connection: api.IConnection): Promise<void> {
  // Step 1: Submit a registration with a short password
  await TestValidator.error("short registration password is refused", () => api.functional.todo.auth.user.join({ host: connection.host }, { email: "short-password@example.com", password: "short", displayName: "Owner" }));
  // Step 2: Submit a registration with an overlong password
  // Step 3: Assert both boundary violations are refused
  await TestValidator.error("overlong registration password is refused", () => api.functional.todo.auth.user.join({ host: connection.host }, { email: "long-password@example.com", password: "x".repeat(129), displayName: "Owner" }));
}

/**
 * Proves independent optional dates and invalid date intervals.
 *
 * 1. Join an account and create valid due-only, start-only, and early-calendar Todos.
 * 2. Attempt invalid calendar, interval, title, and description inputs.
 * 3. Assert valid optional values persist and every invalid input is refused.
 */
export async function test_api_todo_rules_content_dates(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create valid due-only, start-only, and early-calendar Todos
  const user = await joinUser(connection);
  const onlyDue = await createTodo(user.connection, { title: "Only due", dueDate: "2026-08-10" });
  TestValidator.equals("a due-only Todo is valid", onlyDue.startDate, null);
  const onlyStart = await createTodo(user.connection, { title: "Only start", startDate: "2026-08-10" });
  TestValidator.equals("a start-only Todo is valid", onlyStart.dueDate, null);
  const earlyCalendar = await createTodo(user.connection, { title: "Early calendar", startDate: "0001-01-01" });
  // Step 2: Attempt invalid calendar, interval, title, and description inputs
  TestValidator.equals("a year below 100 is preserved as a calendar date", earlyCalendar.startDate, "0001-01-01");
  await TestValidator.error("an impossible date is refused", () => createTodo(user.connection, { title: "Bad date", startDate: "2026-08-11", dueDate: "2026-08-10" }));
  await TestValidator.error("a non-calendar date is refused", () => createTodo(user.connection, { title: "Bad calendar", startDate: "2026-02-30" }));
  await TestValidator.error("a whitespace-only title is refused", () => createTodo(user.connection, { title: "   " }));
  await TestValidator.error("an overlong title is refused", () => createTodo(user.connection, { title: "x".repeat(201) }));
  // Step 3: Assert valid optional values persist and every invalid input is refused
  await TestValidator.error("an overlong description is refused", () => createTodo(user.connection, { description: "x".repeat(10_001) }));
}

/**
 * Proves active browsing uses bounded pages, totals, filters, and date sorting.
 *
 * 1. Join an account and create dated and undated active Todos.
 * 2. Browse a bounded sorted page, an out-of-range page, and invalid controls.
 * 3. Assert totals, missing-date ordering, compact shape, and refusals.
 */
export async function test_api_todo_rules_browse(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create dated and undated active Todos
  const user = await joinUser(connection);
  const dated = await createTodo(user.connection, { title: "Dated", startDate: "2026-08-10" });
  await createTodo(user.connection, { title: "Undated" });
  // Step 2: Browse a bounded sorted page, an out-of-range page, and invalid controls
  const page = await api.functional.todo.user.todo.index(user.connection, { sort: "start-asc", page: 1, limit: 1 });
  typia.assert(page);
  TestValidator.equals("page reports all matching records", page.pagination.records, 2);
  TestValidator.equals("page returns the requested size", page.data.length, 1);
  TestValidator.equals("dated tasks precede missing dates", page.data[0]?.id, dated.id);
  if (page.data.some((item) => "trashedAt" in item)) throw new Error("The active summary exposed a trash-only field.");
  const beyond = await api.functional.todo.user.todo.index(user.connection, { page: 3, limit: 1 });
  TestValidator.equals("page beyond the end is empty", beyond.data.length, 0);
  TestValidator.equals("page beyond the end preserves totals", beyond.pagination.records, 2);
  // Step 3: Assert totals, missing-date ordering, compact shape, and refusals
  await TestValidator.error("unsupported completion filter is refused", () => api.functional.todo.user.todo.index(user.connection, { completion: "finished" as api.ITodo.IRequest["completion"] }));
  await TestValidator.error("unsupported sort is refused", () => api.functional.todo.user.todo.index(user.connection, { sort: "title-asc" as api.ITodo.IRequest["sort"] }));
  await TestValidator.error("page zero is refused", () => api.functional.todo.user.todo.index(user.connection, { page: 0 as api.ITodo.IRequest["page"] }));
  await TestValidator.error("limit above the shared maximum is refused", () => api.functional.todo.user.todo.index(user.connection, { limit: 101 as api.ITodo.IRequest["limit"] }));
}

/**
 * Proves every supported active-list date direction and missing-date rule.
 *
 * 1. Join an account and create early, late, and undated Todos.
 * 2. Browse creation, start, and due sorts in both supported directions.
 * 3. Assert direction, date, and missing-date ordering for every sort.
 */
export async function test_api_todo_rules_browse_sort_directions(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create early, late, and undated Todos
  const user = await joinUser(connection);
  const early = await createTodo(user.connection, { title: "Early", startDate: "2026-08-10", dueDate: "2026-08-20" });
  const late = await createTodo(user.connection, { title: "Late", startDate: "2026-08-12", dueDate: "2026-08-22" });
  const missing = await createTodo(user.connection, { title: "Missing dates" });

  // Step 2: Browse creation, start, and due sorts in both supported directions
  const createdAsc = await api.functional.todo.user.todo.index(user.connection, { sort: "created-asc" });
  const createdDesc = await api.functional.todo.user.todo.index(user.connection, { sort: "created-desc" });
  TestValidator.equals("creation ascending starts with the oldest Todo", createdAsc.data[0]?.id, early.id);
  TestValidator.equals("creation descending starts with the newest Todo", createdDesc.data[0]?.id, missing.id);

  const startAsc = await api.functional.todo.user.todo.index(user.connection, { sort: "start-asc" });
  const startDesc = await api.functional.todo.user.todo.index(user.connection, { sort: "start-desc" });
  TestValidator.equals("start ascending puts the earliest date first", startAsc.data[0]?.id, early.id);
  TestValidator.equals("start ascending puts missing dates last", startAsc.data.at(-1)?.id, missing.id);
  TestValidator.equals("start descending puts the latest date first", startDesc.data[0]?.id, late.id);
  TestValidator.equals("start descending puts missing dates last", startDesc.data.at(-1)?.id, missing.id);

  const dueAsc = await api.functional.todo.user.todo.index(user.connection, { sort: "due-asc" });
  const dueDesc = await api.functional.todo.user.todo.index(user.connection, { sort: "due-desc" });
  // Step 3: Assert direction, date, and missing-date ordering for every sort
  TestValidator.equals("due ascending puts the earliest date first", dueAsc.data[0]?.id, early.id);
  TestValidator.equals("due ascending puts missing dates last", dueAsc.data.at(-1)?.id, missing.id);
  TestValidator.equals("due descending puts the latest date first", dueDesc.data[0]?.id, late.id);
  TestValidator.equals("due descending puts missing dates last", dueDesc.data.at(-1)?.id, missing.id);
}

/**
 * Proves no-op and stale edits leave the accepted Todo and history unchanged.
 *
 * 1. Join an account and create an original Todo.
 * 2. Attempt a no-op edit, accept a newer edit, and submit a stale edit.
 * 3. Read the Todo and history and assert only the accepted edit remains.
 */
export async function test_api_todo_rules_edit_conflicts(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create an original Todo
  const user = await joinUser(connection);
  const created = await createTodo(user.connection, { title: "Original", description: "Details" });
  // Step 2: Attempt a no-op edit, accept a newer edit, and submit a stale edit
  await TestValidator.error("a no-op content edit is refused", () => api.functional.todo.user.todo.update(user.connection, created.id, { version: created.version, title: "Original" }));
  const changed = await api.functional.todo.user.todo.update(user.connection, created.id, { version: created.version, title: "Accepted" });
  await TestValidator.error("a stale content edit is refused", () => api.functional.todo.user.todo.update(user.connection, created.id, { version: created.version, description: "Stale" }));
  // Step 3: Read the Todo and history and assert only the accepted edit remains
  const current = await api.functional.todo.user.todo.at(user.connection, created.id);
  TestValidator.equals("stale edit preserves accepted content", current.title, changed.title);
  const history = await api.functional.todo.user.todo.history(user.connection, created.id);
  TestValidator.equals("refused edits create no extra history", history.length, 1);
}

/**
 * Proves an invalid edited date interval preserves both dates and history.
 *
 * 1. Join an account and create a Todo with a valid date interval.
 * 2. Attempt to edit the due date before the start date.
 * 3. Read the Todo and history and assert the prior interval remains.
 */
export async function test_api_todo_rules_edit_invalid_dates(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create a Todo with a valid date interval
  const user = await joinUser(connection);
  const created = await createTodo(user.connection, { startDate: "2026-08-10", dueDate: "2026-08-20" });
  // Step 2: Attempt to edit the due date before the start date
  await TestValidator.error("an invalid edited date interval is refused", () => api.functional.todo.user.todo.update(user.connection, created.id, { version: created.version, dueDate: "2026-08-09" }));
  // Step 3: Read the Todo and history and assert the prior interval remains
  const current = await api.functional.todo.user.todo.at(user.connection, created.id);
  TestValidator.equals("invalid edit preserves the start date", current.startDate, "2026-08-10");
  TestValidator.equals("invalid edit preserves the due date", current.dueDate, "2026-08-20");
  TestValidator.equals("invalid edit creates no history", (await api.functional.todo.user.todo.history(user.connection, created.id)).length, 0);
}

/**
 * Proves clearing an optional field is a recorded content change.
 *
 * 1. Join an account and create a Todo with a description.
 * 2. Clear the description through the content-edit operation.
 * 3. Read the Todo and history and assert the clear is explicit.
 */
export async function test_api_todo_rules_history_clear(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create a Todo with a description
  const user = await joinUser(connection);
  const created = await createTodo(user.connection, { description: "Clear this" });
  // Step 2: Clear the description through the content-edit operation
  await api.functional.todo.user.todo.update(user.connection, created.id, { version: created.version, description: null });
  // Step 3: Read the Todo and history and assert the clear is explicit
  const current = await api.functional.todo.user.todo.at(user.connection, created.id);
  TestValidator.equals("cleared description is visibly empty", current.description, null);
  const history = await api.functional.todo.user.todo.history(user.connection, created.id);
  TestValidator.equals("clearing creates one history entry", history.length, 1);
  TestValidator.equals("history records an explicit clear", history[0]?.description, null);
}

/**
 * Proves one edit groups all changed fields and history is newest first.
 *
 * 1. Join an account and create a Todo with all editable fields.
 * 2. Accept a multi-field edit, then clear one field in a second edit.
 * 3. Read history and assert grouping, newest order, and older immutability.
 */
export async function test_api_todo_rules_history_multiple_fields(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create a Todo with all editable fields
  const user = await joinUser(connection);
  const created = await createTodo(user.connection, { title: "Before", description: "Old", startDate: "2026-08-10", dueDate: "2026-08-20" });
  // Step 2: Accept a multi-field edit, then clear one field in a second edit
  const changed = await api.functional.todo.user.todo.update(user.connection, created.id, {
    version: created.version,
    title: "After",
    description: "New",
    startDate: "2026-08-11",
    dueDate: "2026-08-21",
  });
  typia.assert(changed);
  const first = (await api.functional.todo.user.todo.history(user.connection, created.id))[0];
  if (first === undefined) throw new Error("The multi-field edit created no history entry.");
  TestValidator.equals("history groups the changed title", first.title, "After");
  TestValidator.equals("history groups the changed description", first.description, "New");
  TestValidator.equals("history groups the changed start date", first.startDate, "2026-08-11");
  TestValidator.equals("history groups the changed due date", first.dueDate, "2026-08-21");
  const second = await api.functional.todo.user.todo.update(user.connection, created.id, { version: changed.version, description: null });
  // Step 3: Read history and assert grouping, newest order, and older immutability
  typia.assert(second);
  const history = await api.functional.todo.user.todo.history(user.connection, created.id);
  TestValidator.equals("each successful multi-field edit creates one entry", history.length, 2);
  TestValidator.equals("history is newest first", history[0]?.description, null);
  TestValidator.equals("older history remains immutable", history[1]?.description, "New");
}

/**
 * Proves equal selected dates use creation time and stable identity tie-breaks.
 *
 * 1. Join an account and create two Todos with equal start and due dates.
 * 2. Browse each equal-key date sort.
 * 3. Assert both sorts use newest creation first, then Todo identity.
 */
export async function test_api_todo_rules_browse_equal_date_tiebreak(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create two Todos with equal start and due dates
  const user = await joinUser(connection);
  const first = await createTodo(user.connection, { title: "First equal date", startDate: "2026-08-10", dueDate: "2026-08-20" });
  const second = await createTodo(user.connection, { title: "Second equal date", startDate: "2026-08-10", dueDate: "2026-08-20" });
  const expected = [first, second].sort((left, right) => right.createdAt.localeCompare(left.createdAt) || left.id.localeCompare(right.id));

  // Step 2: Browse each equal-key date sort
  const start = await api.functional.todo.user.todo.index(user.connection, { sort: "start-asc" });
  const due = await api.functional.todo.user.todo.index(user.connection, { sort: "due-desc" });

  // Step 3: Assert both sorts use newest creation first, then Todo identity
  TestValidator.equals("equal start dates use the stable tie-break", start.data.slice(0, 2).map((item) => item.id), expected.map((item) => item.id));
  TestValidator.equals("equal due dates use the stable tie-break", due.data.slice(0, 2).map((item) => item.id), expected.map((item) => item.id));
}

/**
 * Proves repeated completion commands are successful no-change operations.
 *
 * 1. Join an account and create an incomplete Todo.
 * 2. Mark it complete twice.
 * 3. Read history and assert the retry added no content entry.
 */
export async function test_api_todo_rules_idempotent_completion(connection: api.IConnection): Promise<void> {
  // Step 1: Join an account and create an incomplete Todo
  const user = await joinUser(connection);
  const created = await createTodo(user.connection);
  // Step 2: Mark it complete twice
  const first = await api.functional.todo.user.todo.complete(user.connection, created.id);
  const repeated = await api.functional.todo.user.todo.complete(user.connection, created.id);
  // Step 3: Read history and assert the retry added no content entry
  typia.assert(first);
  typia.assert(repeated);
  TestValidator.equals("repeated completion keeps the state", repeated.completion, "complete");
  const history = await api.functional.todo.user.todo.history(user.connection, created.id);
  TestValidator.equals("completion retries add no history", history.length, 0);
}
