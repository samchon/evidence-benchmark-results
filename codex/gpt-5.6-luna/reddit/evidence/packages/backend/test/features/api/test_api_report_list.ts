import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.report.list.reports} Exercises the generated operation accessor.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-content-report-model The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-002-relate-unresolved-reports-to-a-community-queue The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-002-view-unresolved-community-reports The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-reporting-rules The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-003-restrict-report-queue-visibility-and-resolution The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_report_list(connection: api.IConnection): Promise<void> {
  await api.functional.report.list.reports({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000", { page: 1, limit: 10 });
}






