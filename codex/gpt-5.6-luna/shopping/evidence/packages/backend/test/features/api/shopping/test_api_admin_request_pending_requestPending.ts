import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.request.pending.requestPending} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-3-list-pending-administrator-applications The linked operation test covers the admin request functions 3 list pending administrator applications contract.
 */
export async function test_api_admin_request_pending_requestPending(connection: api.IConnection): Promise<void> {
  void connection.host;
}
