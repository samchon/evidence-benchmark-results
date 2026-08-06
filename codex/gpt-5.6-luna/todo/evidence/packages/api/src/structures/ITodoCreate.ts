import type { tags } from "typia";

/**
 * Todo creation body.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Represents new task input.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Represents initial lifecycle state.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Represents creation input.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Represents content and date input.
 * @evidence prisma:todo_todos Represents creation fields.
 */
export interface ITodoCreate {
  /**
   * User-authored title.
   * @evidence prisma:todo_todos.title Carries new content.
   */
  title: string & tags.MinLength<1> & tags.MaxLength<200>;
  /**
   * Optional description.
   * @evidence prisma:todo_todos.description Carries new content.
   */
  description?: null | (string & tags.MaxLength<10000>);
  /**
   * Optional start instant.
   * @evidence prisma:todo_todos.start_date Carries new schedule.
   */
  startDate?: null | (string & tags.Format<"date-time">);
  /**
   * Optional due instant.
   * @evidence prisma:todo_todos.due_date Carries new schedule.
   */
  dueDate?: null | (string & tags.Format<"date-time">);
}
