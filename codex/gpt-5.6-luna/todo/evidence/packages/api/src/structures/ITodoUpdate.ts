import type { tags } from "typia";

/**
 * Todo content edit body.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Represents editable task input.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Represents input to history-producing edits.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Represents edit input.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Represents the history-producing edit boundary.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Represents editable content rules.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Represents conflict input.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Represents consistency input.
 * @evidence prisma:todo_todos Represents mutable content.
 */
export interface ITodoUpdate {
  /**
   * Replacement title.
   * @evidence prisma:todo_todos.title Carries edited content.
   */
  title?: string & tags.MinLength<1> & tags.MaxLength<200>;
  /**
   * Replacement description.
   * @evidence prisma:todo_todos.description Carries edited content.
   */
  description?: null | (string & tags.MaxLength<10000>);
  /**
   * Replacement start instant.
   * @evidence prisma:todo_todos.start_date Carries edited schedule.
   */
  startDate?: null | (string & tags.Format<"date-time">);
  /**
   * Replacement due instant.
   * @evidence prisma:todo_todos.due_date Carries edited schedule.
   */
  dueDate?: null | (string & tags.Format<"date-time">);
  /**
   * Optimistic concurrency marker.
   * @evidence prisma:todo_todos.updated_at Guards stale edits.
   */
  expectedUpdatedAt?: null | (string & tags.Format<"date-time">);
}
