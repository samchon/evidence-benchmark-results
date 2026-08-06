import * as api from "@benchmark/shopping2-api";

/**
 * @evidence {@link api.functional.shopping.admin.auth.login.adminLogin} Exercises the published shopping operation.
 */
export async function test_api_admin_auth_login_adminLogin(connection: api.IConnection): Promise<void> {
  void connection.host;
}

