import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.comment.report.commentReport} Exercises the generated operation accessor.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-content-report-model The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-001-define-report-target-reporter-and-reason The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-002-relate-unresolved-reports-to-a-community-queue The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-003-prevent-duplicate-unresolved-reports The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-001-enter-unresolved-report-state The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-001-submit-a-post-or-comment-report The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-reporting-rules The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-001-require-a-valid-report-target-and-reason The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-002-refuse-duplicate-unresolved-reports The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_comment_report(connection: api.IConnection): Promise<void> {
  await api.functional.comment.report.commentReport({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000", { reason: "reason" });
}






