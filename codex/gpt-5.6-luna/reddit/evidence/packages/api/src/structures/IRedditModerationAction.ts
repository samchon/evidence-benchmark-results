import { tags } from "typia";
import type { IRedditUser } from "./IRedditUser";

/** Private resolved moderation history record. */
/** @evidence prisma:reddit_moderation_actions Represents persisted private moderation history. */
/** @evidenceReview prisma:reddit_moderation_actions Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-report-life-004-retain-resolved-moderation-history Carries resolved history output. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-004-retain-resolved-moderation-history Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private Keeps history within its community scope. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-report-reporting-rules Carries private resolved report outcome fields. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-reporting-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-report-003-restrict-report-queue-visibility-and-resolution Carries scoped moderation history output. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-003-restrict-report-queue-visibility-and-resolution Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-report-004-refuse-repeat-report-resolution Carries terminal decision state. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-004-refuse-repeat-report-resolution Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
export interface IRedditModerationAction {
  /**
   * History identifier.
   * @evidence prisma:reddit_moderation_actions.id Carries the history key.
   * @evidenceReview prisma:reddit_moderation_actions.id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Approved or dismissed outcome.
   * @evidence prisma:reddit_moderation_actions.outcome Carries the terminal outcome.
   * @evidenceReview prisma:reddit_moderation_actions.outcome Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  outcome: "approved" | "dismissed";
  /**
   * Target kind.
   * @evidence prisma:reddit_moderation_actions.target_type Carries the target discriminator.
   * @evidenceReview prisma:reddit_moderation_actions.target_type Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  targetType: "post" | "comment";
  /**
   * Former reporter, when still identifiable.
   * @evidence prisma:reddit_moderation_actions.reporter_id Carries the reporter relation.
   * @evidenceReview prisma:reddit_moderation_actions.reporter_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  reporter: null | IRedditUser.ISummary;
  /**
   * Acting moderator, when still identifiable.
   * @evidence prisma:reddit_moderation_actions.moderator_id Carries the moderator relation.
   * @evidenceReview prisma:reddit_moderation_actions.moderator_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  moderator: null | IRedditUser.ISummary;
  /**
   * Original report reason.
   * @evidence prisma:reddit_moderation_actions.reason Carries the stored reason.
   * @evidenceReview prisma:reddit_moderation_actions.reason Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  reason: string;
  /**
   * Decision instant.
   * @evidence prisma:reddit_moderation_actions.decided_at Carries the decision time.
   * @evidenceReview prisma:reddit_moderation_actions.decided_at Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  decidedAt: string & tags.Format<"date-time">;
}
