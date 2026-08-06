import * as api from "@benchmark/erp-api";

/** Proves asset category, register, and depreciation-run lifecycle. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
export async function test_api_assets(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `assets-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Assets ${suffix}`, code: `assets-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const category = await api.functional.asset_category_create.create(owner, { code: "EQUIP", name: "Equipment", usefulLifeMonths: 60, depreciationMethod: "straight_line" });
  const asset = await api.functional.fixed_asset_create.create(owner, { assetCategoryId: category.id, assetTag: "FA-001", name: "Laptop", acquisitionDate: "2026-08-01T00:00:00.000Z", acquisitionCost: 1200 });
  const inService = await api.functional.fixed_asset_status.status(owner, asset.id, { status: "in_service" });
  const run = await api.functional.depreciation_run_create.create(owner, { periodStart: "2026-08-01T00:00:00.000Z", periodEnd: "2026-08-31T00:00:00.000Z", totalAmount: 20 });
  await api.functional.depreciation_run_status.status(owner, run.id, { status: "calculated" });
  const posted = await api.functional.depreciation_run_status.status(owner, run.id, { status: "posted" });
  const assets = await api.functional.fixed_asset_search.index(owner, { assetCategoryId: category.id });
  if (inService.status !== "in_service" || posted.status !== "posted" || assets.data.length !== 1) throw new Error("asset register or depreciation lifecycle was not retained");
}
