import * as api from "@benchmark/shopping-api";
import typia from "typia";

/**
 * Exercises the seller-owned public journey before administrator approval.
 * @evidence {@link api.functional.shopping.auth.seller.join.sellerJoin} Proves seller registration, session ownership, profile access, approval visibility, retained dashboard access, recovery, and logout through public HTTP operations.
 * @evidenceReview {@link api.functional.shopping.auth.seller.join.sellerJoin} Read the complete journey and generated accessors; the test asserts pending seller state, seller ownership, profile mutation, dashboard/report pagination, approval status, recovery, refresh, and logout behavior.
 */
export async function test_backend_public_seller_journey(connection: api.IConnection): Promise<void> {
  const sellerConnection: api.IConnection = { host: connection.host };
  const email = `journey-seller-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
  const password = "correct-horse-battery-staple";
  const authorized = await api.functional.shopping.auth.seller.join.sellerJoin(sellerConnection, { email, password });
  typia.assert(authorized);
  if (authorized.seller.approvalStatus !== "pending") throw new Error("Seller registration did not begin pending approval.");
  sellerConnection.headers = { Authorization: `Bearer ${authorized.accessToken}` };
  const profile = await api.functional.shopping.seller.profile.read.profile(sellerConnection);
  if (profile.id !== authorized.seller.id) throw new Error("Seller profile escaped its owning identity.");
  const edited = await api.functional.shopping.seller.profile.update.profileUpdate(sellerConnection, { shopName: "Journey Shop", shopDescription: "Evidence shop", logoImage: "https://example.com/logo.png" });
  if (edited.shopName !== "Journey Shop") throw new Error("Seller profile update was not visible.");
  const approval = await api.functional.shopping.seller.approval.status.approval(sellerConnection);
  if (approval.approvalStatus !== "pending") throw new Error("Seller approval status was not retained.");
  const dashboard = await api.functional.shopping.seller.dashboard.summary.dashboard(sellerConnection);
  if (dashboard.productCount !== 0 || dashboard.orderItemCount !== 0) throw new Error("Empty seller dashboard reported retained commerce.");
  const items = await api.functional.shopping.seller.dashboard.order_item.dashboardItems(sellerConnection, { page: 1, limit: 20 });
  if (items.pagination.current !== 1) throw new Error("Seller order-item pagination was not returned.");
  const shipments = await api.functional.shopping.seller.shipment.items.shipmentItems(sellerConnection, { page: 1, limit: 20 });
  if (shipments.pagination.current !== 1) throw new Error("Seller shipment pagination was not returned.");
  const recovery = await api.functional.shopping.auth.seller.recover.request.sellerRecover({ host: connection.host }, { email: `unknown-seller-${Date.now()}@example.com` });
  typia.assert(recovery);
  const refreshed = await api.functional.shopping.auth.seller.refresh.sellerRefresh({ host: connection.host }, { refreshToken: authorized.refreshToken });
  typia.assert(refreshed);
  sellerConnection.headers = { Authorization: `Bearer ${refreshed.accessToken}` };
  await api.functional.shopping.auth.seller.logout.sellerLogout(sellerConnection);
}
