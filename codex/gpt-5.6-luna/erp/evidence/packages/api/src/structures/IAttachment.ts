import type { tags } from "typia";
import type { IPage } from "../typings";

/** File metadata attached to a visible organization record.
 * @evidence prisma:attachments Exposes the persisted attachments record.
 */
export interface IAttachment {
  /** @evidence prisma:attachments.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:attachments.target_type Carries the persisted targetType value. */
  targetType: string;
/** @evidence prisma:attachments.target_id Carries the persisted targetId value. */
  targetId: string & tags.Format<"uuid">;
/** @evidence prisma:attachments.uploader_user_id Carries the persisted uploaderUserId value. */
  uploaderUserId: string & tags.Format<"uuid">;
/** @evidence prisma:attachments.file_name Carries the persisted fileName value. */
  fileName: string;
/** @evidence prisma:attachments.mime_type Carries the persisted mimeType value. */
  mimeType: string;
/** @evidence prisma:attachments.size_bytes Carries the persisted sizeBytes value. */
  sizeBytes: number;
/** @evidence prisma:attachments.storage_key Carries the persisted storageKey value. */
  storageKey: string;
/** @evidence prisma:attachments.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
}
export namespace IAttachment {
  export interface ICreate {
    targetType: string & tags.MinLength<1>;
    targetId: string & tags.Format<"uuid">;
    fileName: string & tags.MinLength<1>;
    mimeType: string & tags.MinLength<1>;
    sizeBytes: number & tags.Type<"int32"> & tags.Minimum<0>;
    storageKey: string & tags.MinLength<1>;
  }
  export interface IRequest extends IPage.IRequest { targetType: string; targetId: string; }
}
