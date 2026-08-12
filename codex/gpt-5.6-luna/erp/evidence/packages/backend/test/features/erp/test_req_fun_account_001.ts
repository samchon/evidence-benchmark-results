import * as api from "@benchmark/erp-api";
import typia from "typia";
import { MyGlobal } from "../../../src/MyGlobal";

/**
 * Proves the generated ERP accessor req_fun_account_001.
 *
 * @evidence docs/analysis/02-domain-model.md#req-dom-account-ledger-account-lifecycle Exercises the persisted aggregate lifecycle through the generated operation.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-account-ledger-account-lifecycle Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence {@link api.functional.erp.req_fun_account_001.execute.req_fun_account_001} Calls the generated public operation accessor.
 * @evidenceReview {@link api.functional.erp.req_fun_account_001.execute.req_fun_account_001} Read the generated accessor reference and ran the test, confirming it invokes the named operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-account-ledger-account-operations Exercises the operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-account-ledger-account-operations Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-account-001-organization-setup-seeds-the-standard-asset-liability-equity-revenue Exercises the exact requirement.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-account-001-organization-setup-seeds-the-standard-asset-liability-equity-revenue Read the test body and ran it, confirming the cited operation boundary is exercised by this test.
 */
export async function test_req_fun_account_001(
  connection: api.IConnection,
): Promise<void> {
  const output = await api.functional.erp.req_fun_account_001.execute.req_fun_account_001(connection, {});
  typia.assert(output);
  const seeded = await MyGlobal.prisma.ledger_accounts.count({
    where: { organization_id: output.organizationId },
  });
  if (seeded < 5)
    throw new Error("Organization setup did not seed the five standard account categories.");
}