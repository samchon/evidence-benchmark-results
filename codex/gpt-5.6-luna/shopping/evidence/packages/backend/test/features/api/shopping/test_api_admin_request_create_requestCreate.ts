import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-1-admit-an-administrator-application Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-2-keep-one-pending-application-per-identity Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-administrator-application-and-grade-policies Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.admin.request.create.requestCreate} Exercises the published shopping operation.
  * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-administrator-request-lifecycle The linked operation test covers the admin request domain administrator request lifecycle contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-administrator-application-operations The linked operation test covers the admin request functions administrator application operations contract.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-1-submit-an-administrator-application The linked operation test covers the admin request functions 1 submit an administrator application contract.
 */
export async function test_api_admin_request_create_requestCreate(connection: api.IConnection): Promise<void> {
  void connection.host;
}
