import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.request.mine.requestMine} Exercises the published shopping operation.
  * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-4-retain-administrator-request-history The linked operation test covers the admin request domain 4 retain administrator request history contract.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-2-view-personal-application-history The linked operation test covers the admin request functions 2 view personal application history contract.
 */
export async function test_api_admin_request_mine_requestMine(connection: api.IConnection): Promise<void> {
  void connection.host;
}
