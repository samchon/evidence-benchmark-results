import type { tags } from "typia";
import type { IPage } from "../typings";

/** Complete private todo detail. */
export interface ITodo {
  /** Stable todo identifier. */
  id: string & tags.Format<"uuid">;
  /** Required trimmed title. */
  title: string & tags.MinLength<1> & tags.MaxLength<200>;
  /** Optional full description; null means empty. */
  description: (string & tags.MaxLength<10000>) | null;
  /** Optional start calendar date. */
  startDate: (string & tags.Format<"date">) | null;
  /** Optional due calendar date. */
  dueDate: (string & tags.Format<"date">) | null;
  /** Completion state. */
  status: "incomplete" | "complete";
  /** Availability state. */
  availability: "active" | "trashed";
  /** Original creation instant. */
  createdAt: string & tags.Format<"date-time">;
  /** Most recent trash instant, or null while active. */
  trashedAt: (string & tags.Format<"date-time">) | null;
  /** Latest content revision instant, used for stale-edit detection. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ITodo {
  /** Caller-supplied creation fields. */
  export interface ICreate {
    title: string & tags.MinLength<1> & tags.MaxLength<200>;
    description?: (string & tags.MaxLength<10000>) | null;
    startDate?: (string & tags.Format<"date">) | null;
    dueDate?: (string & tags.Format<"date">) | null;
  }
  /** Partial content edit. Omitted differs from explicit null. */
  export interface IUpdate {
    title?: string & tags.MinLength<1> & tags.MaxLength<200>;
    description?: (string & tags.MaxLength<10000>) | null;
    startDate?: (string & tags.Format<"date">) | null;
    dueDate?: (string & tags.Format<"date">) | null;
    /** Detail revision read before editing, required for stale-write refusal. */
    updatedAt: string & tags.Format<"date-time">;
  }
  /** Active-list request. */
  export interface IRequest extends IPage.IRequest {
    filter?: "all" | "complete-only" | "incomplete-only";
    sort?: "createdAt" | "startDate" | "dueDate";
    direction?: "asc" | "desc";
  }
  /** Compact active-list item. */
  export interface ISummary {
    id: string & tags.Format<"uuid">;
    title: string & tags.MinLength<1> & tags.MaxLength<200>;
    startDate: (string & tags.Format<"date">) | null;
    dueDate: (string & tags.Format<"date">) | null;
    status: "incomplete" | "complete";
    createdAt: string & tags.Format<"date-time">;
  }
  /** Compact trash-list item, including the most recent trash instant. */
  export interface ITrashSummary extends ISummary {
    /** Most recent move into trash. */
    trashedAt: string & tags.Format<"date-time">;
  }
}
