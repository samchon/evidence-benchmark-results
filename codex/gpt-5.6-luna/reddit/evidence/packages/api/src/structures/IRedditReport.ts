import { tags } from "typia";
import type { IRedditComment } from "./IRedditComment";
import type { IRedditPost } from "./IRedditPost";
import type { IRedditUser } from "./IRedditUser";

/** Private pending or resolved content report. */
/** @evidence prisma:reddit_reports Represents persisted report queue state. */
/** @evidenceReview prisma:reddit_reports Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-report-content-report-model Defines report output. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-content-report-model Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/02-domain-model.md#req-dom-report-life-content-report-lifecycle Carries unresolved and terminal outcomes. */
/** @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-content-report-lifecycle Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution Defines report submission and resolution payloads. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-report-001-submit-a-post-or-comment-report Carries report creation input. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-001-submit-a-post-or-comment-report Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-report-002-view-unresolved-community-reports Carries queue items. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-002-view-unresolved-community-reports Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-report-003-approve-a-report Represents the approval target boundary. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-003-approve-a-report Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/03-functional-requirements.md#req-func-report-004-dismiss-a-report Represents the dismissal target boundary. */
/** @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-004-dismiss-a-report Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-report-reporting-rules Carries report validation and outcome fields. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-reporting-rules Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-report-001-require-a-valid-report-target-and-reason Carries bounded reason and target input. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-001-require-a-valid-report-target-and-reason Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-report-002-refuse-duplicate-unresolved-reports Carries the reporter-target conflict fields. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-002-refuse-duplicate-unresolved-reports Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-report-003-restrict-report-queue-visibility-and-resolution Carries private queue output. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-003-restrict-report-queue-visibility-and-resolution Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/04-business-rules.md#req-rule-report-004-refuse-repeat-report-resolution Carries terminal outcome state. */
/** @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-004-refuse-repeat-report-resolution Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy Carries private report output. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
/** @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private Carries reporter and reason only in the private response. */
/** @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private Read the cited requirement and compared this DTO with the generated contract and backend journey; verified it carries the required public shape. */
export interface IRedditReport {
  /**
   * Report identifier.
   * @evidence prisma:reddit_reports.id Carries the report key.
   * @evidenceReview prisma:reddit_reports.id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Target kind, derived from the target relation.
   * @evidence prisma:reddit_reports.post_id Carries the post-side target discriminator.
   * @evidenceReview prisma:reddit_reports.post_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  targetType: "post" | "comment";
  /**
   * Reported post, when applicable.
   * @evidence prisma:reddit_reports.post_id Carries the post target relation.
   * @evidenceReview prisma:reddit_reports.post_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  post: null | IRedditPost;
  /**
   * Reported comment, when applicable.
   * @evidence prisma:reddit_reports.comment_id Carries the comment target relation.
   * @evidenceReview prisma:reddit_reports.comment_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  comment: null | IRedditComment;
  /**
   * Reporting account.
   * @evidence prisma:reddit_reports.reporter_id Carries the reporter relation.
   * @evidenceReview prisma:reddit_reports.reporter_id Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  reporter: null | IRedditUser.ISummary;
  /**
   * Trimmed report reason.
   * @evidence prisma:reddit_reports.reason Carries the persisted reason.
   * @evidenceReview prisma:reddit_reports.reason Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  reason: string;
  /**
   * Unresolved, approved, or dismissed.
   * @evidence prisma:reddit_reports.outcome Carries the resolution state.
   * @evidenceReview prisma:reddit_reports.outcome Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  outcome: null | "approved" | "dismissed";
  /**
   * Submission instant.
   * @evidence prisma:reddit_reports.created_at Carries the report creation time.
   * @evidenceReview prisma:reddit_reports.created_at Compared this DTO type or property with the cited Prisma model or column and the generated API contract; verified the public shape is the one exposed by the backend.
   */
  createdAt: string & tags.Format<"date-time">;
}

export namespace IRedditReport {
  /** Report submission input. */
  export interface ICreate {
    /** Target kind. */
    targetType: "post" | "comment";
    /** Target identifier. */
    targetId: string & tags.Format<"uuid">;
    /** Nonblank bounded reason. */
    reason: string & tags.MinLength<1> & tags.MaxLength<2000>;
  }
}
