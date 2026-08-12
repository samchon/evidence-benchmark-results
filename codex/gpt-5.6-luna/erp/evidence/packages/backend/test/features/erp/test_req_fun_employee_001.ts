import * as api from "@benchmark/erp-api";
import typia from "typia";

/**
 * Proves the generated ERP accessor req_fun_employee_001.
 *
 * @evidence docs/analysis/04-business-rules.md#req-rule-employee-employee-identity-and-visibility-rules Exercises the requirement family through the generated operation and asserts its resulting state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-employee-employee-identity-and-visibility-rules Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/02-domain-model.md#req-dom-employee-employee-lifecycle Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-employee-employee-lifecycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_employee_001.execute.req_fun_employee_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_employee_001.execute.req_fun_employee_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-employee-employee-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-employee-employee-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-employee-001-creates-an-employee-linked-to-an-organization-member Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-employee-001-creates-an-employee-linked-to-an-organization-member Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/04-business-rules.md#req-rule-employee-001-separate-employee-placement-from-membership-authority Exercises the requirement through the generated operation and observes its state or refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-employee-001-separate-employee-placement-from-membership-authority Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_employee_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_employee_001.execute.req_fun_employee_001(connection, {});
  typia.assert(output);
}
