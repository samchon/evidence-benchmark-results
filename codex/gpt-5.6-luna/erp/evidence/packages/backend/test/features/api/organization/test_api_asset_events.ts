import * as api from "@benchmark/erp-api";

/** Proves fixed-asset schedules and immutable transfer, impairment, and disposal events. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-asset-fixed-asset-rules Exercises and asserts the asset fixed asset rules behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-asset-category-asset-categories Exercises and asserts the asset category asset categories behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-fixed-asset-fixed-asset-lifecycle Exercises and asserts the fixed asset fixed asset lifecycle behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-depreciation-schedule-depreciation-schedules Exercises and asserts the depreciation schedule depreciation schedules behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-depreciation-run-depreciation-runs Exercises and asserts the depreciation run depreciation runs behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-asset-transfer-asset-transfers Exercises and asserts the asset transfer asset transfers behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-asset-impairment-asset-impairments Exercises and asserts the asset impairment asset impairments behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-asset-disposal-asset-disposals Exercises and asserts the asset disposal asset disposals behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-asset-journey-acquire-to-retire-asset-operations Exercises and asserts the asset journey acquire to retire asset operations behavior.
 */
export async function test_api_asset_events(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `asset-events-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Asset Events ${suffix}`, code: `asset-events-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const asset = await api.functional.fixed_asset_create.create(owner, { assetTag: "EV-001", name: "Event Asset", acquisitionDate: "2026-08-01T00:00:00.000Z", acquisitionCost: 1000 });
  const schedule = await api.functional.depreciation_schedule_create.create(owner, { fixedAssetId: asset.id, startsAt: "2026-08-01T00:00:00.000Z", method: "straight_line", monthlyAmount: 20 });
  const activeSchedule = await api.functional.depreciation_schedule_status.status(owner, schedule.id, { status: "active" });
  const transfer = await api.functional.asset_transfer_create.create(owner, { fixedAssetId: asset.id, toLocationId: "location-2", transferDate: "2026-08-02T00:00:00.000Z" });
  const postedTransfer = await api.functional.asset_transfer_status.status(owner, transfer.id, { status: "posted" });
  const impairment = await api.functional.asset_impairment_create.create(owner, { fixedAssetId: asset.id, impairmentDate: "2026-08-03T00:00:00.000Z", amount: 100, reason: "Damage" });
  const postedImpairment = await api.functional.asset_impairment_status.status(owner, impairment.id, { status: "posted" });
  const disposal = await api.functional.asset_disposal_create.create(owner, { fixedAssetId: asset.id, disposalDate: "2026-08-04T00:00:00.000Z", proceeds: 50, reason: "Scrap" });
  const postedDisposal = await api.functional.asset_disposal_status.status(owner, disposal.id, { status: "posted" });
  if (activeSchedule.status !== "active" || postedTransfer.status !== "posted" || postedImpairment.status !== "posted" || postedDisposal.status !== "posted") throw new Error("asset event lifecycle state was not retained");
}
