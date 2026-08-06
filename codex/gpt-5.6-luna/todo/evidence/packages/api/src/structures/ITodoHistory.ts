import type { tags } from "typia";

/**
 * Immutable content-edit history item.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Represents history output.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Represents immutable state output.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Represents retained edit integrity.
 * @evidence prisma:todo_todo_histories Represents retained history.
 */
export interface ITodoHistory {
  /**
   * Stable history identity.
   * @evidence prisma:todo_todo_histories.id Carries history identity.
   */
  id: string & tags.Format<"uuid">;
  /**
   * History creation instant.
   * @evidence prisma:todo_todo_histories.created_at Carries append order.
   */
  createdAt: string & tags.Format<"date-time">;
  /**
   * Historical title value.
   * @evidence prisma:todo_todo_histories.title Carries changed content.
   */
  title?: string & tags.MinLength<1> & tags.MaxLength<200>;
  /**
   * Historical description value.
   * @evidence prisma:todo_todo_histories.description Carries changed content.
   */
  description?: null | (string & tags.MaxLength<10000>);
  /**
   * Historical start instant.
   * @evidence prisma:todo_todo_histories.start_date Carries changed schedule.
   */
  startDate?: null | (string & tags.Format<"date-time">);
  /**
   * Historical due instant.
   * @evidence prisma:todo_todo_histories.due_date Carries changed schedule.
   */
  dueDate?: null | (string & tags.Format<"date-time">);
}
