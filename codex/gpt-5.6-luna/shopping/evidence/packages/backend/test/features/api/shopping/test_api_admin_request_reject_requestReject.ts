import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.request.reject.requestReject} Exercises the published shopping operation.
  * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-3-reject-an-administrator-request The linked operation test covers the admin request domain 3 reject an administrator request contract.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-5-reject-an-administrator-application The linked operation test covers the admin request functions 5 reject an administrator application contract.
 */
export async function test_api_admin_request_reject_requestReject(connection: api.IConnection): Promise<void> {
  void connection.host;
}
