import * as api from "@benchmark/shopping-api";
import typia from "typia";

/**
 * Proves seller profile edits produce immutable evidence readable by the owner.
 *
 * 1. Register and authenticate a seller.
 * 2. Update the profile with normalized values.
 * 3. Read the snapshot page and verify the changed fields and after image.
 */
export async function test_api_seller_profile_snapshot(
  connection: api.IConnection,
): Promise<void> {
  const authorized = await api.functional.shopping.auth.seller.join.sellerJoin(
    connection,
    {
      email: `profile-snapshot-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`,
      password: "password-123",
    },
  );
  const authenticated: api.IConnection = {
    host: connection.host,
    headers: { Authorization: `Bearer ${authorized.token}` },
  };

  const updated = await api.functional.shopping.seller.profile.sellerProfileUpdate(
    authenticated,
    {
      shopName: "  Snapshot Shop  ",
      shopDescription: "  Durable seller evidence  ",
      shopLogo: "https://example.com/logo.png",
    },
  );
  typia.assert(updated);
  if (updated.shopName !== "Snapshot Shop") throw new Error("profile input was not normalized");

  const snapshots = await api.functional.shopping.seller.profile.snapshot.sellerProfileSnapshots(
    authenticated,
    { page: 1, limit: 10 },
  );
  typia.assert(snapshots);
  const latest = snapshots.data[0];
  if (latest === undefined) throw new Error("profile snapshot was not recorded");
  if (!latest.changedFields.includes("shop_name")) throw new Error("shop_name change was not recorded");
  if (!latest.after.includes("Snapshot Shop")) throw new Error("snapshot after image is incorrect");
}
