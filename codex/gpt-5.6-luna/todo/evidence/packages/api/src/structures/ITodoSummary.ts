import type { tags } from "typia";

/**
 * Compact item returned by active and trash lists.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Represents the task list projection.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Represents list availability state.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Represents active list output.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Represents trash list output.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Represents list projection fields.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Represents private list output.
 * @evidence prisma:todo_todos Represents list projections.
 */
export interface ITodoSummary {
  /**
   * Stable item identity.
   * @evidence prisma:todo_todos.id Carries list identity.
   */
  id: string & tags.Format<"uuid">;
  /**
   * User-authored title.
   * @evidence prisma:todo_todos.title Carries list title.
   */
  title: string & tags.MinLength<1> & tags.MaxLength<200>;
  /**
   * Completion state.
   * @evidence prisma:todo_todos.completed Carries list state.
   */
  completed: boolean;
  /**
   * Optional start instant.
   * @evidence prisma:todo_todos.start_date Carries list schedule.
   */
  startDate: null | (string & tags.Format<"date-time">);
  /**
   * Optional due instant.
   * @evidence prisma:todo_todos.due_date Carries list schedule.
   */
  dueDate: null | (string & tags.Format<"date-time">);
  /**
   * Creation instant.
   * @evidence prisma:todo_todos.created_at Carries stable ordering.
   */
  createdAt: string & tags.Format<"date-time">;
  /**
   * Soft-delete instant.
   * @evidence prisma:todo_todos.trashed_at Carries availability state.
   */
  trashedAt: null | (string & tags.Format<"date-time">);
}
