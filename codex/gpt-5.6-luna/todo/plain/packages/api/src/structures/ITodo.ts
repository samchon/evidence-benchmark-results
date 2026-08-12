import type { IPage } from "../typings/IPage";
import type { tags } from "typia";

/** One private Todo, including its current lifecycle state. */
export interface ITodo {
  /** Todo identifier. */
  id: string & tags.Format<"uuid">;
  /** Current trimmed title. */
  title: string & tags.MinLength<1> & tags.MaxLength<200>;
  /** Full description, or null when empty. */
  description: null | (string & tags.MaxLength<10_000>);
  /** Date-only planning start, or null. */
  startDate: null | (string & tags.Format<"date">);
  /** Date-only planning due date, or null. */
  dueDate: null | (string & tags.Format<"date">);
  /** Completion state. */
  completion: "incomplete" | "complete";
  /** Availability state. */
  availability: "active" | "trashed";
  /** Original creation instant. */
  createdAt: string & tags.Format<"date-time">;
  /** Most recent trash-entry instant, or null. */
  trashedAt: null | (string & tags.Format<"date-time">);
  /** Content version used to reject stale edits. */
  version: number & tags.Type<"uint32">;
}

export namespace ITodo {
  /** Compact active/trash list projection. */
  export interface ISummary {
    /** Todo identifier. */
    id: string & tags.Format<"uuid">;
    /** Current title. */
    title: string & tags.MinLength<1> & tags.MaxLength<200>;
    /** Completion state. */
    completion: "incomplete" | "complete";
    /** Optional start date. */
    startDate: null | (string & tags.Format<"date">);
    /** Optional due date. */
    dueDate: null | (string & tags.Format<"date">);
    /** Original creation instant. */
    createdAt: string & tags.Format<"date-time">;
  }

  /** Compact trash-list projection, including the recovery timestamp. */
  export interface ITrashSummary extends ISummary {
    /** Most recent trash-entry instant. */
    trashedAt: null | (string & tags.Format<"date-time">);
  }

  /** Creation input. */
  export interface ICreate {
    /** Required title; provider trims it. */
    title: string & tags.MinLength<1>;
    /** Optional description; null clears it. */
    description?: null | (string & tags.MaxLength<10_000>);
    /** Optional date-only start. */
    startDate?: null | (string & tags.Format<"date">);
    /** Optional date-only due date. */
    dueDate?: null | (string & tags.Format<"date">);
  }

  /** Partial content edit with optimistic version. */
  export interface IUpdate {
    /** New title when supplied. */
    title?: string & tags.MinLength<1>;
    /** New description, including null to clear. */
    description?: null | (string & tags.MaxLength<10_000>);
    /** New start date, including null to clear. */
    startDate?: null | (string & tags.Format<"date">);
    /** New due date, including null to clear. */
    dueDate?: null | (string & tags.Format<"date">);
    /** Version read when the edit began. */
    version: number & tags.Type<"uint32">;
  }

  /** Active list request. */
  export interface IRequest extends IPage.IRequest {
    /** Completion scope. */
    completion?: null | "all" | "complete-only" | "incomplete-only";
    /** One supported date sort token. */
    sort?: null | "created-desc" | "created-asc" | "start-asc" | "start-desc" | "due-asc" | "due-desc";
  }

  /** Completion transition input. */
  export interface ICompletion {
    /** Required target state. */
    completion: "complete" | "incomplete";
  }
}
