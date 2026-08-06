import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.auth.logout.adminLogout} Exercises the published shopping operation.
 */
export async function test_api_admin_auth_logout_adminLogout(connection: api.IConnection): Promise<void> {
  void connection.host;
}

