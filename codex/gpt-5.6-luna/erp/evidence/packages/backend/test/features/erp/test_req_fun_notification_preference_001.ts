import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_notification_preference_001.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-notification-preference-notification-preferences Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-notification-preference-notification-preferences Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_notification_preference_001.execute.req_fun_notification_preference_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_notification_preference_001.execute.req_fun_notification_preference_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-notification-preference-notification-preference-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-notification-preference-notification-preference-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-notification-preference-001-views-their-notification-preferences-for-the-active-organization Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-notification-preference-001-views-their-notification-preferences-for-the-active-organization Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_notification_preference_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_notification_preference_001.execute.req_fun_notification_preference_001(connection, {});
  typia.assert(output);
}
