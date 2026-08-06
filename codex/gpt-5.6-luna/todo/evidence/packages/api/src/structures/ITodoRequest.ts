import type { IPage } from "../typings/IPage";

/**
 * Active and trash list request.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Represents active list input.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Represents trash list input.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Represents browse parameters.
 */
export interface ITodoRequest extends IPage.IRequest {
  /** Completion filter selects the visible completion scope. */
  filter?: null | "all" | "complete-only" | "incomplete-only";
  /** Sort field selects the supported ordering key. */
  sort?: null | "createdAt" | "startDate" | "dueDate";
  /** Sort direction selects ascending or descending ordering. */
  direction?: null | "asc" | "desc";
}
