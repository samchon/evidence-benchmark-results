import * as api from "@benchmark/shopping-api";
import typia from "typia";

/** Proves sellers can submit and read their own administrator application. */
export async function test_api_seller_admin_application(connection: api.IConnection): Promise<void> {
  const authorized = await api.functional.shopping.auth.seller.join.sellerJoin(connection, {
    email: `seller-admin-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`,
    password: "password-123",
  });
  const authenticated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.token}` } };
  const created = await api.functional.shopping.seller.admin_application.sellerAdminApplicationCreate(authenticated, { reason: "Seller governance experience" });
  typia.assert(created);
  if (created.status !== "pending" || created.applicantId !== authorized.id || created.applicantKind !== "seller") throw new Error("seller administrator application was not recorded for the acting seller");
  const listed = await api.functional.shopping.seller.admin_application.sellerAdminApplications(authenticated, { page: 1, limit: 10 });
  typia.assert(listed);
  if (!listed.data.some((application) => application.id === created.id && application.status === "pending")) throw new Error("seller administrator application is not visible to its applicant");
}
