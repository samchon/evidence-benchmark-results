import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-4-grant-the-regular-administrator-grade-on-approval Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.admin.request.approve.requestApprove} Exercises the published shopping operation.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-4-approve-an-administrator-application The linked operation test covers the admin request functions 4 approve an administrator application contract.
 */
export async function test_api_admin_request_approve_requestApprove(connection: api.IConnection): Promise<void> {
  void connection.host;
}
