import { tags } from "typia";

/**
 * User public identity and lifecycle shape.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Exposes the caller-visible user contract.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:users Represents the persisted users model.
 * @evidenceReview prisma:users Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IUser {
  /** id.
   * @evidence prisma:users.id Carries the persisted id value.
   * @evidenceReview prisma:users.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** email.
   * @evidence prisma:users.email Carries the persisted email value.
   * @evidenceReview prisma:users.email Read the DTO property and compared its type with the cited Prisma column.
   */
  email: string & tags.Format<"email">;
  /** displayName.
   * @evidence prisma:users.display_name Carries the persisted display_name value.
   * @evidenceReview prisma:users.display_name Read the DTO property and compared its type with the cited Prisma column.
   */
  displayName: string;
  /** avatar.
   * @evidence prisma:users.avatar Carries the persisted avatar value.
   * @evidenceReview prisma:users.avatar Read the DTO property and compared its type with the cited Prisma column.
   */
  avatar: null | string;
  /** phone.
   * @evidence prisma:users.phone Carries the persisted phone value.
   * @evidenceReview prisma:users.phone Read the DTO property and compared its type with the cited Prisma column.
   */
  phone: null | string;
  /** locale.
   * @evidence prisma:users.locale Carries the persisted locale value.
   * @evidenceReview prisma:users.locale Read the DTO property and compared its type with the cited Prisma column.
   */
  locale: string;
  /** timezone.
   * @evidence prisma:users.timezone Carries the persisted timezone value.
   * @evidenceReview prisma:users.timezone Read the DTO property and compared its type with the cited Prisma column.
   */
  timezone: string;
  /** status.
   * @evidence prisma:users.status Carries the persisted status value.
   * @evidenceReview prisma:users.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: string;
  /** createdAt.
   * @evidence prisma:users.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:users.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:users.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:users.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:users.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:users.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | (string & tags.Format<"date-time">);
}
