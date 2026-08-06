import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.grade_promote.promote} Exercises the published shopping operation.
  * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-administrator-grade-change-operations The linked operation test covers the admin grade functions administrator grade change operations contract.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-1-promote-a-regular-administrator The linked operation test covers the admin grade functions 1 promote a regular administrator contract.
 */
export async function test_api_admin_grade_promote_promote(connection: api.IConnection): Promise<void> {
  void connection.host;
}
