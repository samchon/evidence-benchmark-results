import type { tags } from "typia";
import type { IPage } from "../typings";
/** Comment attached to a visible organization record. */
/**
 * @evidence prisma:comments Exposes the persisted comments record.
 */
export interface IComment {
  /** @evidence prisma:comments.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:comments.target_type Carries the persisted targetType value. */
  targetType: string;
/** @evidence prisma:comments.target_id Carries the persisted targetId value. */
  targetId: string & tags.Format<"uuid">;
/** @evidence prisma:comments.author_user_id Carries the persisted authorUserId value. */
  authorUserId: string & tags.Format<"uuid">;
  /** @evidence prisma:comments.body Carries the persisted body value. */
  body: string;
/** @evidence prisma:comments.edited_at Carries the persisted editedAt value. */
  editedAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:comments.deleted_at Carries the persisted deletedAt value. */
  deletedAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:comments.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
}
export namespace IComment { export interface ICreate { targetType: string & tags.MinLength<1>; targetId: string & tags.Format<"uuid">; body: string & tags.MinLength<1>; } export interface IUpdate { body: string & tags.MinLength<1>; } export interface IRequest extends IPage.IRequest { targetType: string; targetId: string; includeDeleted?: boolean; } }
