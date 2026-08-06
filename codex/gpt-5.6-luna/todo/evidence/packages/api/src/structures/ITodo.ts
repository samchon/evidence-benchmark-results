import type { tags } from "typia";

/**
 * Complete private Todo detail.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Represents persisted task state.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Represents independent task lifecycle state.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Represents full Todo responses.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Represents the same response in trash.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Represents state and freshness facts.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Represents private Todo output.
 * @evidence prisma:todo_todos Exposes the Todo row.
 */
export interface ITodo {
  /**
   * Stable Todo identity.
   * @evidence prisma:todo_todos.id Carries task identity.
   */
  id: string & tags.Format<"uuid">;
  /**
   * User-authored title.
   * @evidence prisma:todo_todos.title Carries task content.
   */
  title: string & tags.MinLength<1> & tags.MaxLength<200>;
  /**
   * Optional description.
   * @evidence prisma:todo_todos.description Carries task content.
   */
  description: null | (string & tags.MaxLength<10000>);
  /**
   * Optional start instant.
   * @evidence prisma:todo_todos.start_date Carries task schedule.
   */
  startDate: null | (string & tags.Format<"date-time">);
  /**
   * Optional due instant.
   * @evidence prisma:todo_todos.due_date Carries task schedule.
   */
  dueDate: null | (string & tags.Format<"date-time">);
  /**
   * Completion state.
   * @evidence prisma:todo_todos.completed Carries task state.
   */
  completed: boolean;
  /**
   * Creation instant.
   * @evidence prisma:todo_todos.created_at Carries task history.
   */
  createdAt: string & tags.Format<"date-time">;
  /**
   * Last accepted content or completion edit.
   * @evidence prisma:todo_todos.updated_at Carries freshness for concurrency.
   */
  updatedAt: string & tags.Format<"date-time">;
  /**
   * Active or trashed availability.
   * @evidence prisma:todo_todos.trashed_at Carries lifecycle state.
   */
  availability: "active" | "trashed";
  /**
   * Soft-delete instant.
   * @evidence prisma:todo_todos.trashed_at Carries lifecycle state.
   */
  trashedAt: null | (string & tags.Format<"date-time">);
}
