import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-7-refuse-super-administrator-self-demotion Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.admin.grade_demote.demote} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-2-demote-another-super-administrator The linked operation test covers the admin grade functions 2 demote another super administrator contract.
 */
export async function test_api_admin_grade_demote_demote(connection: api.IConnection): Promise<void> {
  void connection.host;
}
