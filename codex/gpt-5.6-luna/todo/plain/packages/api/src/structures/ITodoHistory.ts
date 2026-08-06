import type { tags } from "typia";

/** One immutable accepted content-edit entry. */
export interface ITodoHistory {
  /** Stable history identifier. */
  id: string & tags.Format<"uuid">;
  /** Edit instant. */
  editedAt: string & tags.Format<"date-time">;
  /** Changed-to title when title participated. */
  title?: string & tags.MinLength<1> & tags.MaxLength<200>;
  /** Changed-to description; null explicitly records clearing. */
  description?: (string & tags.MaxLength<10000>) | null;
  /** Changed-to start date; null explicitly records clearing. */
  startDate?: (string & tags.Format<"date">) | null;
  /** Changed-to due date; null explicitly records clearing. */
  dueDate?: (string & tags.Format<"date">) | null;
}
