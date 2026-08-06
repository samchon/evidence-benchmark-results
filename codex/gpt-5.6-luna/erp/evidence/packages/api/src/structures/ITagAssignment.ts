import type { tags } from "typia";
import type { IPage } from "../typings";
/** Persisted tag assignment on a visible business record.
 */
/**
 * @evidence prisma:tag_assignments Exposes the persisted tag_assignments record.
 */
export interface ITagAssignment {
  /** @evidence prisma:tag_assignments.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:tag_assignments.tag_id Carries the persisted tagId value. */
  tagId: string & tags.Format<"uuid">;
  /** @evidence prisma:tag_assignments.target_type Carries the persisted targetType value. */
  targetType: string;
  /** @evidence prisma:tag_assignments.target_id Carries the persisted targetId value. */
  targetId: string;
  /** @evidence prisma:tag_assignments.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
}
export namespace ITagAssignment { export interface ICreate { tagId: string & tags.Format<"uuid">; targetType: string; targetId: string; } export interface IRequest extends IPage.IRequest { tagId?: string; targetType?: string; targetId?: string; } }
