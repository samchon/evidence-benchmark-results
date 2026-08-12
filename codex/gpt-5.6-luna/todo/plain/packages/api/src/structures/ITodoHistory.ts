import type { tags } from "typia";

/** One immutable content-edit history entry. */
export interface ITodoHistory {
  /** History identifier. */
  id: string & tags.Format<"uuid">;
  /** Edit instant. */
  createdAt: string & tags.Format<"date-time">;
  /** New title when title participated in the edit. */
  title?: string & tags.MinLength<1> & tags.MaxLength<200>;
  /** New description when changed; null means explicitly cleared. */
  description?: null | (string & tags.MaxLength<10_000>);
  /** New start date when changed; null means explicitly cleared. */
  startDate?: null | (string & tags.Format<"date">);
  /** New due date when changed; null means explicitly cleared. */
  dueDate?: null | (string & tags.Format<"date">);
}
