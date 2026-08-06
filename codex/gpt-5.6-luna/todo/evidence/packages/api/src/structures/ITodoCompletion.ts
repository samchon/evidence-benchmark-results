/**
 * Completion command body.
 * Completion state command body.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Represents a Todo state command.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Represents completion as an independent dimension.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Represents completion input.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Represents completion state input.
 */
export interface ITodoCompletion {
  /**
   * Requested completion state.
   * @evidence prisma:todo_todos.completed Carries state transition.
   */
  completed: boolean;
}
