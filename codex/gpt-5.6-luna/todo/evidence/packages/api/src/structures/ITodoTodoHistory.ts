import type { tags } from "typia";

/**
 * One immutable changed-to content entry for an owned Todo.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Represents the private content chronology.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-1-define-an-edit-history-entry Carries changed-to values and their participation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-1-define-an-edit-history-entry Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Remains attached to the Todo lifecycle.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Represents the history inspection surface.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Carries the full newest-first result.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Carries one immutable accepted edit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Represents the matching history record.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Represents owner-scoped history.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence prisma:todo_todo_histories Represents the persisted history model.
 * @evidenceReview prisma:todo_todo_histories Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
 */
export interface ITodoTodoHistory {
  /**
   * History entry UUID.
   * @evidence prisma:todo_todo_histories.id Carries the history primary key.
   * @evidenceReview prisma:todo_todo_histories.id Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Edit instant.
   * @evidence prisma:todo_todo_histories.created_at Carries the immutable edit time.
   * @evidenceReview prisma:todo_todo_histories.created_at Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  createdAt: string & tags.Format<"date-time">;
  /**
   * New title when title participated in the edit.
   * @evidence prisma:todo_todo_histories.title Carries changed-to title.
   * @evidenceReview prisma:todo_todo_histories.title Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  title?: string & tags.MinLength<1> & tags.MaxLength<200>;
  /**
   * New description, including null when the edit explicitly cleared it.
   * @evidence prisma:todo_todo_histories.description Carries changed-to description.
   * @evidenceReview prisma:todo_todo_histories.description Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_todo_histories.description_changed Distinguishes an explicit clear from an unchanged field.
   * @evidenceReview prisma:todo_todo_histories.description_changed Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  description?: null | string;
  /**
   * New start date, including null when explicitly cleared.
   * @evidence prisma:todo_todo_histories.start_date Carries changed-to start date.
   * @evidenceReview prisma:todo_todo_histories.start_date Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_todo_histories.start_date_changed Distinguishes an explicit clear from an unchanged field.
   * @evidenceReview prisma:todo_todo_histories.start_date_changed Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  startDate?: null | (string & tags.Format<"date">);
  /**
   * New due date, including null when explicitly cleared.
   * @evidence prisma:todo_todo_histories.due_date Carries changed-to due date.
   * @evidenceReview prisma:todo_todo_histories.due_date Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_todo_histories.due_date_changed Distinguishes an explicit clear from an unchanged field.
   * @evidenceReview prisma:todo_todo_histories.due_date_changed Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  dueDate?: null | (string & tags.Format<"date">);
}
