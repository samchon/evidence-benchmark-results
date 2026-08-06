import * as api from "@benchmark/erp-api";

/** Proves MRP run and recommendation approval lifecycles. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-mrp-recommendation-mrp-recommendation-operations Exercises and asserts the mrp recommendation mrp recommendation operations behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-mrp-run-mrp-runs Exercises and asserts the mrp run mrp runs behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-mrp-recommendation-mrp-recommendations Exercises and asserts the mrp recommendation mrp recommendations behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-mrp-mrp-run-operations Exercises and asserts the mrp mrp run operations behavior.
 */
export async function test_api_mrp(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `mrp-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `MRP ${suffix}`, code: `mrp-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const item = await api.functional.item_create.create(owner, { sku: "MRP-001", name: "MRP Item", itemType: "stock", trackingMode: "none" });
  const mrp = await api.functional.mrp_run_create.create(owner, { runDate: "2026-08-05T00:00:00.000Z", horizonEnd: "2026-09-05T00:00:00.000Z" });
  await api.functional.mrp_run_status.status(owner, mrp.id, { status: "running" });
  const completed = await api.functional.mrp_run_status.status(owner, mrp.id, { status: "completed" });
  const recommendation = await api.functional.mrp_recommendation_create.create(owner, { mrpRunId: mrp.id, itemId: item.id, recommendationType: "purchase", quantity: 20, neededBy: "2026-08-20T00:00:00.000Z" });
  await api.functional.mrp_recommendation_status.status(owner, recommendation.id, { status: "accepted" });
  const converted = await api.functional.mrp_recommendation_status.status(owner, recommendation.id, { status: "converted" });
  if (completed.status !== "completed" || converted.status !== "converted") throw new Error("MRP lifecycle state was not retained");
}
