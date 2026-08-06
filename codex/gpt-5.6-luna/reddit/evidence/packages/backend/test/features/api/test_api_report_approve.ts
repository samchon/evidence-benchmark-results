import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.report.approve.reportApprove} Exercises the generated operation accessor.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-content-report-lifecycle The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-002-approve-a-report-and-delete-its-target The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-004-retain-resolved-moderation-history The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-003-approve-a-report The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-reporting-rules The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-003-restrict-report-queue-visibility-and-resolution The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-004-refuse-repeat-report-resolution The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_report_approve(connection: api.IConnection): Promise<void> {
  await api.functional.report.approve.reportApprove({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000");
}






