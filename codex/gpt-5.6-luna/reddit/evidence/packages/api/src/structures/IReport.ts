import type { tags } from "typia";

/** Private moderation report projection. */
 /**
  * @evidence prisma:reports Represents the persisted reports model.
  */
/**
 * The IReport DTO boundary carries the request and response fields used by its owning operations; runtime behavior is proved there and in live tests.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-content-report-model The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-001-define-report-target-reporter-and-reason The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-002-relate-unresolved-reports-to-a-community-queue The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-003-prevent-duplicate-unresolved-reports The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-content-report-lifecycle The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-001-enter-unresolved-report-state The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-002-approve-a-report-and-delete-its-target The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-003-dismiss-a-report-and-retain-its-target The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-004-retain-resolved-moderation-history The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-002-view-unresolved-community-reports The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-003-approve-a-report The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-004-dismiss-a-report The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-reporting-rules The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-001-require-a-valid-report-target-and-reason The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-002-refuse-duplicate-unresolved-reports The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-003-restrict-report-queue-visibility-and-resolution The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-004-refuse-repeat-report-resolution The IReport contract carries the data shape used by this requirement; behavior is owned by the operation.
 */
 export interface IReport {
 /**
  * @evidence prisma:reports.id Carries or derives the persisted value used by this property.
  */
 /** @evidence prisma:reports.reporter_id Carries the persisted reports.reporter_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:reports.community_id Carries the persisted reports.community_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:reports.comment_id Carries the persisted reports.comment_id value or its security-relevant lifecycle.
  */
 /** @evidence prisma:reports.resolved_at Carries the persisted reports.resolved_at value or its security-relevant lifecycle.
  */
 /** @evidence prisma:reports.resolver_id Carries the persisted reports.resolver_id value or its security-relevant lifecycle.
  */
      id: string & tags.Format<"uuid">;
 /**
  * @evidence prisma:reports.post_id Carries or derives the persisted value used by this property.
  */
   targetId: string & tags.Format<"uuid">;
 /**
  * @evidence prisma:reports.post_id Carries or derives the persisted value used by this property.
  */
   targetType: "post" | "comment";
 /**

  * @evidence prisma:reports.reason Carries or derives the persisted value used by this property.
  */
   reason: string;
 /**
  * @evidence prisma:reports.status Carries or derives the persisted value used by this property.
  */
   status: "unresolved" | "approved" | "dismissed";
 /**
  * @evidence prisma:users.id Carries or derives the persisted value used by this property.
  */
   reporter: IReport.IUser;
 /**
  * @evidence prisma:reports.created_at Carries or derives the persisted value used by this property.
  */
   createdAt: string & tags.Format<"date-time">;
}

export namespace IReport {
 /**
  * @evidence prisma:reports Represents the persisted reports model.
  */
   export interface ICreate {
 /**
  * @evidence prisma:reports.reason Carries or derives the persisted value used by this property.
  */
     reason: string & tags.MinLength<1> & tags.MaxLength<2000>;
  }
 /**
  * @evidence prisma:reports Represents the persisted reports model.
  */

   export interface IUser {
    id: string & tags.Format<"uuid">;
 /**
  * @evidence prisma:reports.id Carries or derives the persisted value used by this property.
  */
     username: string;
  }
}



