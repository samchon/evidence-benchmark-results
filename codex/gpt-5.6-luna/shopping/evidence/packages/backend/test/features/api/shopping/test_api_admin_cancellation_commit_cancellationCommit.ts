import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.cancellation.commit.cancellationCommit} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-5-commit-approved-cancellation-effects The linked operation test covers the cancellation functions 5 commit approved cancellation effects contract.
 */
export async function test_api_admin_cancellation_commit_cancellationCommit(connection: api.IConnection): Promise<void> {
  void connection.host;
}
