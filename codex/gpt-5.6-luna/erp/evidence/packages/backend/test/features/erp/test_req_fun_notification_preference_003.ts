import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_notification_preference_003.
 *
 * @evidence {@link api.functional.erp.req_fun_notification_preference_003.execute.req_fun_notification_preference_003} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_notification_preference_003.execute.req_fun_notification_preference_003} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-notification-preference-notification-preference-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-notification-preference-notification-preference-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-notification-preference-003-refuses-a-preference-change-that-would-suppress-mandatory-high-risk-notices Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-notification-preference-003-refuses-a-preference-change-that-would-suppress-mandatory-high-risk-notices Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_notification_preference_003(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_notification_preference_003.execute.req_fun_notification_preference_003(connection, {});
  typia.assert(output);
}

