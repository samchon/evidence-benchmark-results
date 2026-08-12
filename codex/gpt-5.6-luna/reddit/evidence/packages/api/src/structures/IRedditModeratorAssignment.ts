import { tags } from "typia";
import type { IRedditUser } from "./IRedditUser";

/** Private scoped moderator assignment projection. */
/** @evidence prisma:reddit_moderator_assignments Represents persisted scoped assignment state. */
/** @evidenceReview prisma:reddit_moderator_assignments Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend. */
/** @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority Defines scoped moderator output. */
/** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations Defines moderator assignment payloads. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-role-001-add-a-moderator-as-community-owner Carries owner appointment result. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-001-add-a-moderator-as-community-owner Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-role-002-add-a-moderator-as-community-moderator Carries moderator appointment result. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-002-add-a-moderator-as-community-moderator Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
export interface IRedditModeratorAssignment {
  /**
   * Assignment identifier.
   * @evidence prisma:reddit_moderator_assignments.id Carries the assignment key.
   * @evidenceReview prisma:reddit_moderator_assignments.id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Assigned moderator.
   * @evidence prisma:reddit_moderator_assignments.user_id Carries the assigned account relation.
   * @evidenceReview prisma:reddit_moderator_assignments.user_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  user: IRedditUser.ISummary;
  /**
   * Current assignment state.
   * @evidence prisma:reddit_moderator_assignments.active Carries active state.
   * @evidenceReview prisma:reddit_moderator_assignments.active Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  active: boolean;
  /**
   * Assignment start instant.
   * @evidence prisma:reddit_moderator_assignments.started_at Carries moderator tenure.
   * @evidenceReview prisma:reddit_moderator_assignments.started_at Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  startedAt: string & tags.Format<"date-time">;
}
