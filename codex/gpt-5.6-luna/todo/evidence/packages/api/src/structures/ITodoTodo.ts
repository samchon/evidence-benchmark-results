import type { IPage } from "../typings";
import type { tags } from "typia";

/**
 * A complete private Todo detail.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Represents a privately owned task.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Carries all caller-visible Todo facts.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Represents permanent ownership.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Represents completion and availability together.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Carries completion status.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Carries availability state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-3-move-an-active-todo-to-trash Represents the retained trash instant.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-3-move-an-active-todo-to-trash Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-4-restore-a-trashed-todo Preserves the stable Todo identity.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-4-restore-a-trashed-todo Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-5-permanently-delete-a-trashed-todo Represents the terminally absent lifecycle target.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-5-permanently-delete-a-trashed-todo Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Represents the normal Todo surface.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-1-create-a-todo Carries creation content.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-1-create-a-todo Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-2-browse-active-todos Represents active list items.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-2-browse-active-todos Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-3-view-an-active-todo Carries full active detail.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-3-view-an-active-todo Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-4-edit-todo-content Represents editable content and version.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-4-edit-todo-content Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-5-mark-a-todo-complete Carries completion state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-5-mark-a-todo-complete Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-6-mark-a-todo-incomplete Carries completion state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-6-mark-a-todo-incomplete Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-7-move-a-todo-to-trash Carries trash availability.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-7-move-a-todo-to-trash Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Represents retained Todo detail.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-1-browse-trashed-todos Represents trash list items.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-1-browse-trashed-todos Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-2-view-a-trashed-todo Carries trashed detail.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-2-view-a-trashed-todo Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-3-restore-a-todo-from-trash Preserves restored detail.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-3-restore-a-todo-from-trash Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-4-permanently-delete-a-todo-from-trash Represents the terminal target.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-4-permanently-delete-a-todo-from-trash Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Carries content constraints.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-1-validate-todo-title-and-description Carries title and description.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-content-1-validate-todo-title-and-description Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-content-2-validate-todo-planning-dates Carries independent calendar dates.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-content-2-validate-todo-planning-dates Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Represents list controls.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Carries page controls.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-2-filter-active-todos-by-completion Carries completion filters.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-2-filter-active-todos-by-completion Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-3-sort-active-todos-by-supported-dates Carries date sort keys.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-3-sort-active-todos-by-supported-dates Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Represents deterministic ordering.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Carries edit version and lifecycle state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Represents active/trash qualification.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-2-make-repeated-completion-requests-idempotent Carries completion result state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-2-make-repeated-completion-requests-idempotent Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-3-refuse-no-op-and-stale-content-edits Carries the optimistic version.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-3-refuse-no-op-and-stale-content-edits Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Carries the accepted content version.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Represents owner-only Todo data.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Represents private Todo isolation.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Represents owner-scoped detail and lists.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Represents complete Todo transitions.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Represents stable content across trash and restore.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Represents terminal deletion.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Read the cited requirement and checked this host fields and behavior against its obligation.
 * @evidence prisma:todo_todos Represents the persisted Todo model.
 * @evidenceReview prisma:todo_todos Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
 */
export interface ITodoTodo {
  /**
   * Todo UUID, stable across edits, trash, and restoration.
   * @evidence prisma:todo_todos.id Carries the Todo primary key.
   * @evidenceReview prisma:todo_todos.id Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Current required normalized title.
   * @evidence prisma:todo_todos.title Carries current content.
   * @evidenceReview prisma:todo_todos.title Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  title: string & tags.MinLength<1> & tags.MaxLength<200>;
  /**
   * Full optional description; null means it is empty.
   * @evidence prisma:todo_todos.description Carries optional content.
   * @evidenceReview prisma:todo_todos.description Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  description: null | string;
  /**
   * Optional calendar start date, represented without a time of day.
   * @evidence prisma:todo_todos.start_date Carries the stored calendar date.
   * @evidenceReview prisma:todo_todos.start_date Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  startDate: null | (string & tags.Format<"date">);
  /**
   * Optional calendar due date, represented without a time of day.
   * @evidence prisma:todo_todos.due_date Carries the stored calendar date.
   * @evidenceReview prisma:todo_todos.due_date Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  dueDate: null | (string & tags.Format<"date">);
  /**
   * Completion state preserved independently from availability.
   * @evidence prisma:todo_todos.completed Derives the public completion state.
   * @evidenceReview prisma:todo_todos.completed Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  status: "incomplete" | "complete";
  /**
   * Availability state: active work or retained trash.
   * @evidence prisma:todo_todos.trashed Derives the public availability state.
   * @evidenceReview prisma:todo_todos.trashed Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  availability: "active" | "trashed";
  /**
   * Original creation instant, unchanged by later lifecycle actions.
   * @evidence prisma:todo_todos.created_at Carries the original creation fact.
   * @evidenceReview prisma:todo_todos.created_at Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  createdAt: string & tags.Format<"date-time">;
  /**
   * Most recent move into trash, or null while not currently retained there.
   * @evidence prisma:todo_todos.trashed_at Carries the lifecycle timestamp.
   * @evidenceReview prisma:todo_todos.trashed_at Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  trashedAt: null | (string & tags.Format<"date-time">);
  /**
   * Content version used to refuse stale edits.
   * @evidence prisma:todo_todos.content_version Carries the optimistic edit version.
   * @evidenceReview prisma:todo_todos.content_version Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  version: number & tags.Type<"uint32">;
}

export namespace ITodoTodo {
  /** Compact active-list or trash-list item. */
  export interface ISummary {
    /** Todo UUID. */
    id: string & tags.Format<"uuid">;
    /** Current normalized title. */
    title: string & tags.MinLength<1> & tags.MaxLength<200>;
    /** Current completion state. */
    status: "incomplete" | "complete";
    /** Optional calendar start date. */
    startDate: null | (string & tags.Format<"date">);
    /** Optional calendar due date. */
    dueDate: null | (string & tags.Format<"date">);
    /** Original creation instant. */
    createdAt: string & tags.Format<"date-time">;
    /** Most recent trash-entry instant, only populated in trash results. */
    trashedAt: null | (string & tags.Format<"date-time">);
  }

  /** Required and optional content accepted when creating a new active Todo. */
  export interface ICreate {
    /** Required title, normalized by the server. */
    title: string & tags.MinLength<1> & tags.MaxLength<200>;
    /** Optional description; null or omission creates an empty description. */
    description?: null | (string & tags.MaxLength<10000>);
    /** Optional calendar start date. */
    startDate?: null | (string & tags.Format<"date">);
    /** Optional calendar due date. */
    dueDate?: null | (string & tags.Format<"date">);
  }

  /** Partial content replacement guarded by the version read from detail. */
  export interface IUpdate {
    /** Version observed when the user began editing. */
    version: number & tags.Type<"uint32">;
    /** New title when supplied. */
    title?: null | (string & tags.MinLength<1> & tags.MaxLength<200>);
    /** New description; null explicitly clears it. */
    description?: null | (string & tags.MaxLength<10000>);
    /** New start date; null explicitly clears it. */
    startDate?: null | (string & tags.Format<"date">);
    /** New due date; null explicitly clears it. */
    dueDate?: null | (string & tags.Format<"date">);
  }

  /** Active-list filters and stable date sort controls. */
  export interface IRequest extends IPage.IRequest {
    /** Completion scope, defaulting to all. */
    completion?: null | "all" | "complete-only" | "incomplete-only";
    /** One supported date key and direction. */
    sort?: null | IPage.Sort<IRequest.SortableColumns>;
  }

  export namespace IRequest {
    /** Public date keys accepted by active browsing. */
    export type SortableColumns = "createdAt" | "startDate" | "dueDate";
  }
}
