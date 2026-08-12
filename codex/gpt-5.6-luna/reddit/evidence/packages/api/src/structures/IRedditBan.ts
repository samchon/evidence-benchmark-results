import { tags } from "typia";
import type { IRedditUser } from "./IRedditUser";

/** Private active community ban projection. */
/** @evidence prisma:reddit_bans Represents persisted active ban state. */
/** @evidenceReview prisma:reddit_bans Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend. Represents persisted active ban state. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle Defines ban output. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. Defines ban output. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations Defines ban lifecycle payloads. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. Defines ban lifecycle payloads. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-ban-001-ban-a-user-from-a-community Carries ban activation result. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-001-ban-a-user-from-a-community Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. Carries ban activation result. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-ban-003-view-a-communitys-banned-users Carries active ban list items. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-003-view-a-communitys-banned-users Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. Carries active ban list items. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules Carries private scoped ban output. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. Carries private scoped ban output. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community Carries the community-scoped actor identities. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. Carries the community-scoped actor identities. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-moderation-003-protect-the-owner-from-community-bans Carries the ban target identity. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-003-protect-the-owner-from-community-bans Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. Carries the ban target identity. */
export interface IRedditBan {
  /**
   * Ban identifier.
   * @evidence prisma:reddit_bans.id Carries the ban key.
   * @evidenceReview prisma:reddit_bans.id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend. Carries the ban key.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Banned account.
   * @evidence prisma:reddit_bans.user_id Carries the banned account relation.
   * @evidenceReview prisma:reddit_bans.user_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend. Carries the banned account relation.
   */
  user: IRedditUser.ISummary;
  /**
   * Moderator who activated it.
   * @evidence prisma:reddit_bans.moderator_id Carries the acting moderator relation.
   * @evidenceReview prisma:reddit_bans.moderator_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend. Carries the acting moderator relation.
   */
  moderator: IRedditUser.ISummary;
  /**
   * Activation instant.
   * @evidence prisma:reddit_bans.activated_at Carries ban activation time.
   * @evidenceReview prisma:reddit_bans.activated_at Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend. Carries ban activation time.
   */
  activatedAt: string & tags.Format<"date-time">;
}
