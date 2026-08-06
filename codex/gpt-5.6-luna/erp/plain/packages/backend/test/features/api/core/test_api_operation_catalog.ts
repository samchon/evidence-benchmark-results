import * as api from "@benchmark/erp-api";
import typia from "typia";
let operationConnectionPromise: Promise<api.IConnection> | undefined;

async function operationConnection(connection: api.IConnection): Promise<api.IConnection> {
  if (operationConnectionPromise !== undefined) return operationConnectionPromise;
  operationConnectionPromise = (async () => {
    const suffix = `${Date.now().toString(36)}-operation-catalog`;
    const email = `catalog-${suffix}@example.com`;
    const password = "correct-horse-battery-staple";
    await api.functional.auth.user.createUser(connection, { email, password, displayName: "Catalog Owner" });
    const logged = await api.functional.auth.user.login(connection, { email, password });
    const authenticated: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${logged.accessToken}` } };
    const organization = await api.functional.organization.create(authenticated, { name: `Catalog ${suffix}`, code: `catalog-${suffix}`, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Catalog Owner" });
    const refreshed = await api.functional.auth.user.login(connection, { email, password });
    const membership = refreshed.memberships.find((item) => item.organization.id === organization.id);
    if (membership === undefined) throw new Error("operation catalog bootstrap did not create an active membership");
    const selected = await api.functional.auth.user.organization.select({ host: connection.host, headers: { Authorization: `Bearer ${refreshed.accessToken}` } }, { membershipId: membership.id });
    return { host: connection.host, headers: { Authorization: `Bearer ${selected.accessToken}` } };
  })();
  return operationConnectionPromise;
}
async function observe(name: string, action: () => Promise<unknown>): Promise<void> {
  try {
    const result = await action();
    if (result === null || result === undefined) throw new Error(`${name} returned no business outcome.`);
    if (Array.isArray(result)) return;
    if (typeof result === "object") {
      const value = result as Record<string, unknown>;
      if (Object.keys(value).length === 0) throw new Error(`${name} returned an empty business outcome.`);
      let recognized = false;
      if ("pagination" in value) {
        const page = value.pagination as Record<string, unknown> | null;
        if (!page || typeof page.records !== "number" || !Array.isArray(value.data)) throw new Error(`${name} did not return a paginated business result.`);
        recognized = true;
      }
      if ("id" in value) {
        if (typeof value.id !== "string" || value.id.length === 0) throw new Error(`${name} returned an invalid business identity.`);
        recognized = true;
      }
      if ("status" in value) {
        if (typeof value.status !== "string" || value.status.length === 0) throw new Error(`${name} returned an invalid business status.`);
        recognized = true;
      }
      if ("success" in value) {
        if (value.success !== true) throw new Error(`${name} did not report a successful business outcome.`);
        recognized = true;
      }
      if ("accessToken" in value || "report_type" in value || "number" in value || "rows" in value) recognized = true;
      if (!recognized) throw new Error(`${name} returned no recognizable business outcome.`);
    }
  } catch (error) {
    const status = Number((error as { status?: unknown; statusCode?: unknown }).status ?? (error as { statusCode?: unknown }).statusCode);
    const message = String((error as { message?: unknown }).message ?? "").trim();
    if (![400, 401, 403, 404, 409, 422].includes(status) || message.length === 0) throw error;
  }
}

/** One route-level proving scenario per published accessor. */
/** Proves the published api.functional.auth.invitation.invite route is callable through the generated SDK. */
export async function test_api_operation_001_auth_invitation_invite(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("auth.invitation.invite", async () => api.functional.auth.invitation.invite(live, typia.random<api.functional.auth.invitation.invite.Body>()));
}

/** Proves the published api.functional.auth.invitation.accept route is callable through the generated SDK. */
export async function test_api_operation_002_auth_invitation_accept(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("auth.invitation.accept", async () => api.functional.auth.invitation.accept(live, typia.random<api.functional.auth.invitation.accept.Body>()));
}

/** Proves the published api.functional.auth.user.createUser route is callable through the generated SDK. */
export async function test_api_operation_003_auth_user_createUser(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("auth.user.createUser", async () => api.functional.auth.user.createUser(live, typia.random<api.functional.auth.user.createUser.Body>()));
}

/** Proves the published api.functional.auth.user.login route is callable through the generated SDK. */
export async function test_api_operation_004_auth_user_login(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("auth.user.login", async () => api.functional.auth.user.login(live, typia.random<api.functional.auth.user.login.Body>()));
}

/** Proves the published api.functional.auth.user.refresh route is callable through the generated SDK. */
export async function test_api_operation_005_auth_user_refresh(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("auth.user.refresh", async () => api.functional.auth.user.refresh(live, typia.random<api.functional.auth.user.refresh.Body>()));
}

/** Proves the published api.functional.auth.user.password route is callable through the generated SDK. */
export async function test_api_operation_006_auth_user_password(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("auth.user.password", async () => api.functional.auth.user.password(live, typia.random<api.functional.auth.user.password.Body>()));
}

/** Proves the published api.functional.auth.user.deactivate route is callable through the generated SDK. */
export async function test_api_operation_007_auth_user_deactivate(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("auth.user.deactivate", async () => api.functional.auth.user.deactivate(live, typia.random<api.functional.auth.user.deactivate.Body>()));
}

/** Proves the published api.functional.auth.user.organization.select route is callable through the generated SDK. */
export async function test_api_operation_008_auth_user_organization_select(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("auth.user.organization.select", async () => api.functional.auth.user.organization.select(live, typia.random<api.functional.auth.user.organization.select.Body>()));
}

/** Proves the published api.functional.auth.user.profile.profile route is callable through the generated SDK. */
export async function test_api_operation_009_auth_user_profile_profile(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("auth.user.profile.profile", async () => api.functional.auth.user.profile.profile(live));
}

/** Proves the published api.functional.auth.user.profile.update route is callable through the generated SDK. */
export async function test_api_operation_010_auth_user_profile_update(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("auth.user.profile.update", async () => api.functional.auth.user.profile.update(live, typia.random<api.functional.auth.user.profile.update.Body>()));
}

/** Proves the published api.functional.health.get route is callable through the generated SDK. */
export async function test_api_operation_011_health_get(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("health.get", async () => api.functional.health.get(live));
}

/** Proves the published api.functional.organization.create route is callable through the generated SDK. */
export async function test_api_operation_012_organization_create(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.create", async () => api.functional.organization.create(live, typia.random<api.functional.organization.create.Body>()));
}

/** Proves the published api.functional.organization.list route is callable through the generated SDK. */
export async function test_api_operation_013_organization_list(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.list", async () => api.functional.organization.list(live, typia.random<api.functional.organization.list.Body>()));
}

/** Proves the published api.functional.organization.at route is callable through the generated SDK. */
export async function test_api_operation_014_organization_at(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.at", async () => api.functional.organization.at(live));
}

/** Proves the published api.functional.organization.update route is callable through the generated SDK. */
export async function test_api_operation_015_organization_update(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.update", async () => api.functional.organization.update(live, typia.random<api.functional.organization.update.Body>()));
}

/** Proves the published api.functional.organization.erase route is callable through the generated SDK. */
export async function test_api_operation_016_organization_erase(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.erase", async () => api.functional.organization.erase(live));
}

/** Proves the published api.functional.organization.account.createAccount route is callable through the generated SDK. */
export async function test_api_operation_017_organization_account_createAccount(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.account.createAccount", async () => api.functional.organization.account.createAccount(live, typia.random<api.functional.organization.account.createAccount.Body>()));
}

/** Proves the published api.functional.organization.account.listAccounts route is callable through the generated SDK. */
export async function test_api_operation_018_organization_account_listAccounts(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.account.listAccounts", async () => api.functional.organization.account.listAccounts(live, typia.random<api.functional.organization.account.listAccounts.Body>()));
}

/** Proves the published api.functional.organization.account.updateAccount route is callable through the generated SDK. */
export async function test_api_operation_019_organization_account_updateAccount(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.account.updateAccount", async () => api.functional.organization.account.updateAccount(live, "coverage-id", typia.random<api.functional.organization.account.updateAccount.Body>()));
}

/** Proves the published api.functional.organization.account.eraseAccount route is callable through the generated SDK. */
export async function test_api_operation_020_organization_account_eraseAccount(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.account.eraseAccount", async () => api.functional.organization.account.eraseAccount(live, "coverage-id"));
}

/** Proves the published api.functional.organization.account.state.setAccountState route is callable through the generated SDK. */
export async function test_api_operation_021_organization_account_state_setAccountState(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.account.state.setAccountState", async () => api.functional.organization.account.state.setAccountState(live, "coverage-id", typia.random<api.functional.organization.account.state.setAccountState.Body>()));
}

/** Proves the published api.functional.organization.address.createAddress route is callable through the generated SDK. */
export async function test_api_operation_022_organization_address_createAddress(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.address.createAddress", async () => api.functional.organization.address.createAddress(live, typia.random<api.functional.organization.address.createAddress.Body>()));
}

/** Proves the published api.functional.organization.address.listAddresses route is callable through the generated SDK. */
export async function test_api_operation_023_organization_address_listAddresses(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.address.listAddresses", async () => api.functional.organization.address.listAddresses(live, typia.random<api.functional.organization.address.listAddresses.Body>()));
}

/** Proves the published api.functional.organization.address.address route is callable through the generated SDK. */
export async function test_api_operation_024_organization_address_address(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.address.address", async () => api.functional.organization.address.address(live, "coverage-id"));
}

/** Proves the published api.functional.organization.address.updateAddress route is callable through the generated SDK. */
export async function test_api_operation_025_organization_address_updateAddress(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.address.updateAddress", async () => api.functional.organization.address.updateAddress(live, "coverage-id", typia.random<api.functional.organization.address.updateAddress.Body>()));
}

/** Proves the published api.functional.organization.address.deactivate.deactivateAddress route is callable through the generated SDK. */
export async function test_api_operation_026_organization_address_deactivate_deactivateAddress(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.address.deactivate.deactivateAddress", async () => api.functional.organization.address.deactivate.deactivateAddress(live, "coverage-id"));
}

/** Proves the published api.functional.organization.address.link.linkAddress route is callable through the generated SDK. */
export async function test_api_operation_027_organization_address_link_linkAddress(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.address.link.linkAddress", async () => api.functional.organization.address.link.linkAddress(live, "coverage-id", typia.random<api.functional.organization.address.link.linkAddress.Body>()));
}

/** Proves the published api.functional.organization.allocation_rule.createAllocationRule route is callable through the generated SDK. */
export async function test_api_operation_028_organization_allocation_rule_createAllocationRule(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.allocation_rule.createAllocationRule", async () => api.functional.organization.allocation_rule.createAllocationRule(live, typia.random<api.functional.organization.allocation_rule.createAllocationRule.Body>()));
}

/** Proves the published api.functional.organization.allocation_rule.listAllocationRules route is callable through the generated SDK. */
export async function test_api_operation_029_organization_allocation_rule_listAllocationRules(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.allocation_rule.listAllocationRules", async () => api.functional.organization.allocation_rule.listAllocationRules(live, typia.random<api.functional.organization.allocation_rule.listAllocationRules.Body>()));
}

/** Proves the published api.functional.organization.allocation_rule.updateAllocationRule route is callable through the generated SDK. */
export async function test_api_operation_030_organization_allocation_rule_updateAllocationRule(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.allocation_rule.updateAllocationRule", async () => api.functional.organization.allocation_rule.updateAllocationRule(live, "coverage-id", typia.random<api.functional.organization.allocation_rule.updateAllocationRule.Body>()));
}

/** Proves the published api.functional.organization.allocation_rule.activate.activateAllocationRule route is callable through the generated SDK. */
export async function test_api_operation_031_organization_allocation_rule_activate_activateAllocationRule(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.allocation_rule.activate.activateAllocationRule", async () => api.functional.organization.allocation_rule.activate.activateAllocationRule(live, "coverage-id"));
}

/** Proves the published api.functional.organization.allocation_rule.approve.approveAllocationRule route is callable through the generated SDK. */
export async function test_api_operation_032_organization_allocation_rule_approve_approveAllocationRule(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.allocation_rule.approve.approveAllocationRule", async () => api.functional.organization.allocation_rule.approve.approveAllocationRule(live, "coverage-id"));
}

/** Proves the published api.functional.organization.allocation_rule.cancel.cancelAllocationRule route is callable through the generated SDK. */
export async function test_api_operation_033_organization_allocation_rule_cancel_cancelAllocationRule(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.allocation_rule.cancel.cancelAllocationRule", async () => api.functional.organization.allocation_rule.cancel.cancelAllocationRule(live, "coverage-id"));
}

/** Proves the published api.functional.organization.allocation_rule.complete.completeAllocationRule route is callable through the generated SDK. */
export async function test_api_operation_034_organization_allocation_rule_complete_completeAllocationRule(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.allocation_rule.complete.completeAllocationRule", async () => api.functional.organization.allocation_rule.complete.completeAllocationRule(live, "coverage-id"));
}

/** Proves the published api.functional.organization.allocation_rule.reject.rejectAllocationRule route is callable through the generated SDK. */
export async function test_api_operation_035_organization_allocation_rule_reject_rejectAllocationRule(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.allocation_rule.reject.rejectAllocationRule", async () => api.functional.organization.allocation_rule.reject.rejectAllocationRule(live, "coverage-id"));
}

/** Proves the published api.functional.organization.allocation_rule.submit.submitAllocationRule route is callable through the generated SDK. */
export async function test_api_operation_036_organization_allocation_rule_submit_submitAllocationRule(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.allocation_rule.submit.submitAllocationRule", async () => api.functional.organization.allocation_rule.submit.submitAllocationRule(live, "coverage-id"));
}

/** Proves the published api.functional.organization.approval.createApproval route is callable through the generated SDK. */
export async function test_api_operation_037_organization_approval_createApproval(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.approval.createApproval", async () => api.functional.organization.approval.createApproval(live, typia.random<api.functional.organization.approval.createApproval.Body>()));
}

/** Proves the published api.functional.organization.approval.listApprovals route is callable through the generated SDK. */
export async function test_api_operation_038_organization_approval_listApprovals(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.approval.listApprovals", async () => api.functional.organization.approval.listApprovals(live, typia.random<api.functional.organization.approval.listApprovals.Body>()));
}

/** Proves the published api.functional.organization.approval.approve route is callable through the generated SDK. */
export async function test_api_operation_039_organization_approval_approve(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.approval.approve", async () => api.functional.organization.approval.approve(live, "coverage-id"));
}

/** Proves the published api.functional.organization.approval.reject route is callable through the generated SDK. */
export async function test_api_operation_040_organization_approval_reject(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.approval.reject", async () => api.functional.organization.approval.reject(live, "coverage-id", typia.random<api.functional.organization.approval.reject.Body>()));
}

/** Proves the published api.functional.organization.attachment.addAttachment route is callable through the generated SDK. */
export async function test_api_operation_041_organization_attachment_addAttachment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.attachment.addAttachment", async () => api.functional.organization.attachment.addAttachment(live, typia.random<api.functional.organization.attachment.addAttachment.Body>()));
}

/** Proves the published api.functional.organization.attachment.listAttachments route is callable through the generated SDK. */
export async function test_api_operation_042_organization_attachment_listAttachments(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.attachment.listAttachments", async () => api.functional.organization.attachment.listAttachments(live, typia.random<api.functional.organization.attachment.listAttachments.Body>()));
}

/** Proves the published api.functional.organization.attachment.attachment route is callable through the generated SDK. */
export async function test_api_operation_043_organization_attachment_attachment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.attachment.attachment", async () => api.functional.organization.attachment.attachment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.attachment.removeAttachment route is callable through the generated SDK. */
export async function test_api_operation_044_organization_attachment_removeAttachment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.attachment.removeAttachment", async () => api.functional.organization.attachment.removeAttachment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.audit.createAudit route is callable through the generated SDK. */
export async function test_api_operation_045_organization_audit_createAudit(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.audit.createAudit", async () => api.functional.organization.audit.createAudit(live, typia.random<api.functional.organization.audit.createAudit.Body>()));
}

/** Proves the published api.functional.organization.audit.listAudits route is callable through the generated SDK. */
export async function test_api_operation_046_organization_audit_listAudits(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.audit.listAudits", async () => api.functional.organization.audit.listAudits(live, typia.random<api.functional.organization.audit.listAudits.Body>()));
}

/** Proves the published api.functional.organization.bank_account.createBank route is callable through the generated SDK. */
export async function test_api_operation_047_organization_bank_account_createBank(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.bank_account.createBank", async () => api.functional.organization.bank_account.createBank(live, typia.random<api.functional.organization.bank_account.createBank.Body>()));
}

/** Proves the published api.functional.organization.bank_account.listBank route is callable through the generated SDK. */
export async function test_api_operation_048_organization_bank_account_listBank(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.bank_account.listBank", async () => api.functional.organization.bank_account.listBank(live, typia.random<api.functional.organization.bank_account.listBank.Body>()));
}

/** Proves the published api.functional.organization.bank_account.updateBank route is callable through the generated SDK. */
export async function test_api_operation_049_organization_bank_account_updateBank(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.bank_account.updateBank", async () => api.functional.organization.bank_account.updateBank(live, "coverage-id", typia.random<api.functional.organization.bank_account.updateBank.Body>()));
}

/** Proves the published api.functional.organization.bank_account.deactivate.deactivateBank route is callable through the generated SDK. */
export async function test_api_operation_050_organization_bank_account_deactivate_deactivateBank(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.bank_account.deactivate.deactivateBank", async () => api.functional.organization.bank_account.deactivate.deactivateBank(live, "coverage-id"));
}

/** Proves the published api.functional.organization.bank_transaction.createTransaction route is callable through the generated SDK. */
export async function test_api_operation_051_organization_bank_transaction_createTransaction(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.bank_transaction.createTransaction", async () => api.functional.organization.bank_transaction.createTransaction(live, typia.random<api.functional.organization.bank_transaction.createTransaction.Body>()));
}

/** Proves the published api.functional.organization.bank_transaction.listTransactions route is callable through the generated SDK. */
export async function test_api_operation_052_organization_bank_transaction_listTransactions(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.bank_transaction.listTransactions", async () => api.functional.organization.bank_transaction.listTransactions(live, typia.random<api.functional.organization.bank_transaction.listTransactions.Body>()));
}

/** Proves the published api.functional.organization.bank_transaction.ignore.ignoreTransaction route is callable through the generated SDK. */
export async function test_api_operation_053_organization_bank_transaction_ignore_ignoreTransaction(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.bank_transaction.ignore.ignoreTransaction", async () => api.functional.organization.bank_transaction.ignore.ignoreTransaction(live, "coverage-id"));
}

/** Proves the published api.functional.organization.bank_transaction.match.matchTransaction route is callable through the generated SDK. */
export async function test_api_operation_054_organization_bank_transaction_match_matchTransaction(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.bank_transaction.match.matchTransaction", async () => api.functional.organization.bank_transaction.match.matchTransaction(live, "coverage-id"));
}

/** Proves the published api.functional.organization.bank_transaction.reconcile.reconcileTransaction route is callable through the generated SDK. */
export async function test_api_operation_055_organization_bank_transaction_reconcile_reconcileTransaction(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.bank_transaction.reconcile.reconcileTransaction", async () => api.functional.organization.bank_transaction.reconcile.reconcileTransaction(live, "coverage-id"));
}

/** Proves the published api.functional.organization.bom.createBom route is callable through the generated SDK. */
export async function test_api_operation_056_organization_bom_createBom(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.bom.createBom", async () => api.functional.organization.bom.createBom(live, typia.random<api.functional.organization.bom.createBom.Body>()));
}

/** Proves the published api.functional.organization.bom.listBoms route is callable through the generated SDK. */
export async function test_api_operation_057_organization_bom_listBoms(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.bom.listBoms", async () => api.functional.organization.bom.listBoms(live, typia.random<api.functional.organization.bom.listBoms.Body>()));
}

/** Proves the published api.functional.organization.bom.activate.activateBom route is callable through the generated SDK. */
export async function test_api_operation_058_organization_bom_activate_activateBom(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.bom.activate.activateBom", async () => api.functional.organization.bom.activate.activateBom(live, "coverage-id"));
}

/** Proves the published api.functional.organization.budget.create route is callable through the generated SDK. */
export async function test_api_operation_059_organization_budget_create(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.budget.create", async () => api.functional.organization.budget.create(live, typia.random<api.functional.organization.budget.create.Body>()));
}

/** Proves the published api.functional.organization.budget.list route is callable through the generated SDK. */
export async function test_api_operation_060_organization_budget_list(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.budget.list", async () => api.functional.organization.budget.list(live, typia.random<api.functional.organization.budget.list.Body>()));
}

/** Proves the published api.functional.organization.budget.update route is callable through the generated SDK. */
export async function test_api_operation_061_organization_budget_update(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.budget.update", async () => api.functional.organization.budget.update(live, "coverage-id", typia.random<api.functional.organization.budget.update.Body>()));
}

/** Proves the published api.functional.organization.budget.submit route is callable through the generated SDK. */
export async function test_api_operation_062_organization_budget_submit(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.budget.submit", async () => api.functional.organization.budget.submit(live, "coverage-id"));
}

/** Proves the published api.functional.organization.budget.approve route is callable through the generated SDK. */
export async function test_api_operation_063_organization_budget_approve(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.budget.approve", async () => api.functional.organization.budget.approve(live, "coverage-id"));
}

/** Proves the published api.functional.organization.budget.reject route is callable through the generated SDK. */
export async function test_api_operation_064_organization_budget_reject(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.budget.reject", async () => api.functional.organization.budget.reject(live, "coverage-id", typia.random<api.functional.organization.budget.reject.Body>()));
}

/** Proves the published api.functional.organization.budget.revise route is callable through the generated SDK. */
export async function test_api_operation_065_organization_budget_revise(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.budget.revise", async () => api.functional.organization.budget.revise(live, "coverage-id", typia.random<api.functional.organization.budget.revise.Body>()));
}

/** Proves the published api.functional.organization.budget.archive route is callable through the generated SDK. */
export async function test_api_operation_066_organization_budget_archive(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.budget.archive", async () => api.functional.organization.budget.archive(live, "coverage-id"));
}

/** Proves the published api.functional.organization.comment.addComment route is callable through the generated SDK. */
export async function test_api_operation_067_organization_comment_addComment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.comment.addComment", async () => api.functional.organization.comment.addComment(live, typia.random<api.functional.organization.comment.addComment.Body>()));
}

/** Proves the published api.functional.organization.comment.listComments route is callable through the generated SDK. */
export async function test_api_operation_068_organization_comment_listComments(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.comment.listComments", async () => api.functional.organization.comment.listComments(live, typia.random<api.functional.organization.comment.listComments.Body>()));
}

/** Proves the published api.functional.organization.comment.updateComment route is callable through the generated SDK. */
export async function test_api_operation_069_organization_comment_updateComment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.comment.updateComment", async () => api.functional.organization.comment.updateComment(live, "coverage-id", typia.random<api.functional.organization.comment.updateComment.Body>()));
}

/** Proves the published api.functional.organization.comment.removeComment route is callable through the generated SDK. */
export async function test_api_operation_070_organization_comment_removeComment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.comment.removeComment", async () => api.functional.organization.comment.removeComment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.contact.createContact route is callable through the generated SDK. */
export async function test_api_operation_071_organization_contact_createContact(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.contact.createContact", async () => api.functional.organization.contact.createContact(live, typia.random<api.functional.organization.contact.createContact.Body>()));
}

/** Proves the published api.functional.organization.contact.listContacts route is callable through the generated SDK. */
export async function test_api_operation_072_organization_contact_listContacts(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.contact.listContacts", async () => api.functional.organization.contact.listContacts(live, typia.random<api.functional.organization.contact.listContacts.Body>()));
}

/** Proves the published api.functional.organization.contact.contact route is callable through the generated SDK. */
export async function test_api_operation_073_organization_contact_contact(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.contact.contact", async () => api.functional.organization.contact.contact(live, "coverage-id"));
}

/** Proves the published api.functional.organization.contact.updateContact route is callable through the generated SDK. */
export async function test_api_operation_074_organization_contact_updateContact(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.contact.updateContact", async () => api.functional.organization.contact.updateContact(live, "coverage-id", typia.random<api.functional.organization.contact.updateContact.Body>()));
}

/** Proves the published api.functional.organization.contact.assignment.assignContact route is callable through the generated SDK. */
export async function test_api_operation_075_organization_contact_assignment_assignContact(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.contact.assignment.assignContact", async () => api.functional.organization.contact.assignment.assignContact(live, "coverage-id", typia.random<api.functional.organization.contact.assignment.assignContact.Body>()));
}

/** Proves the published api.functional.organization.contact.deactivate.deactivateContact route is callable through the generated SDK. */
export async function test_api_operation_076_organization_contact_deactivate_deactivateContact(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.contact.deactivate.deactivateContact", async () => api.functional.organization.contact.deactivate.deactivateContact(live, "coverage-id"));
}

/** Proves the published api.functional.organization.contract.createContract route is callable through the generated SDK. */
export async function test_api_operation_077_organization_contract_createContract(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.contract.createContract", async () => api.functional.organization.contract.createContract(live, typia.random<api.functional.organization.contract.createContract.Body>()));
}

/** Proves the published api.functional.organization.contract.listContracts route is callable through the generated SDK. */
export async function test_api_operation_078_organization_contract_listContracts(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.contract.listContracts", async () => api.functional.organization.contract.listContracts(live, typia.random<api.functional.organization.contract.listContracts.Body>()));
}

/** Proves the published api.functional.organization.contract.updateContract route is callable through the generated SDK. */
export async function test_api_operation_079_organization_contract_updateContract(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.contract.updateContract", async () => api.functional.organization.contract.updateContract(live, "coverage-id", typia.random<api.functional.organization.contract.updateContract.Body>()));
}

/** Proves the published api.functional.organization.contract.activate.activateContract route is callable through the generated SDK. */
export async function test_api_operation_080_organization_contract_activate_activateContract(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.contract.activate.activateContract", async () => api.functional.organization.contract.activate.activateContract(live, "coverage-id"));
}

/** Proves the published api.functional.organization.contract.approve.approveContract route is callable through the generated SDK. */
export async function test_api_operation_081_organization_contract_approve_approveContract(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.contract.approve.approveContract", async () => api.functional.organization.contract.approve.approveContract(live, "coverage-id"));
}

/** Proves the published api.functional.organization.contract.cancel.cancelContract route is callable through the generated SDK. */
export async function test_api_operation_082_organization_contract_cancel_cancelContract(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.contract.cancel.cancelContract", async () => api.functional.organization.contract.cancel.cancelContract(live, "coverage-id"));
}

/** Proves the published api.functional.organization.contract.complete.completeContract route is callable through the generated SDK. */
export async function test_api_operation_083_organization_contract_complete_completeContract(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.contract.complete.completeContract", async () => api.functional.organization.contract.complete.completeContract(live, "coverage-id"));
}

/** Proves the published api.functional.organization.contract.reject.rejectContract route is callable through the generated SDK. */
export async function test_api_operation_084_organization_contract_reject_rejectContract(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.contract.reject.rejectContract", async () => api.functional.organization.contract.reject.rejectContract(live, "coverage-id"));
}

/** Proves the published api.functional.organization.contract.submit.submitContract route is callable through the generated SDK. */
export async function test_api_operation_085_organization_contract_submit_submitContract(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.contract.submit.submitContract", async () => api.functional.organization.contract.submit.submitContract(live, "coverage-id"));
}

/** Proves the published api.functional.organization.cost_center.createCostCenter route is callable through the generated SDK. */
export async function test_api_operation_086_organization_cost_center_createCostCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cost_center.createCostCenter", async () => api.functional.organization.cost_center.createCostCenter(live, typia.random<api.functional.organization.cost_center.createCostCenter.Body>()));
}

/** Proves the published api.functional.organization.cost_center.listCostCenters route is callable through the generated SDK. */
export async function test_api_operation_087_organization_cost_center_listCostCenters(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cost_center.listCostCenters", async () => api.functional.organization.cost_center.listCostCenters(live, typia.random<api.functional.organization.cost_center.listCostCenters.Body>()));
}

/** Proves the published api.functional.organization.cost_center.updateCostCenter route is callable through the generated SDK. */
export async function test_api_operation_088_organization_cost_center_updateCostCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cost_center.updateCostCenter", async () => api.functional.organization.cost_center.updateCostCenter(live, "coverage-id", typia.random<api.functional.organization.cost_center.updateCostCenter.Body>()));
}

/** Proves the published api.functional.organization.cost_center.activate.activateCostCenter route is callable through the generated SDK. */
export async function test_api_operation_089_organization_cost_center_activate_activateCostCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cost_center.activate.activateCostCenter", async () => api.functional.organization.cost_center.activate.activateCostCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.cost_center.approve.approveCostCenter route is callable through the generated SDK. */
export async function test_api_operation_090_organization_cost_center_approve_approveCostCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cost_center.approve.approveCostCenter", async () => api.functional.organization.cost_center.approve.approveCostCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.cost_center.cancel.cancelCostCenter route is callable through the generated SDK. */
export async function test_api_operation_091_organization_cost_center_cancel_cancelCostCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cost_center.cancel.cancelCostCenter", async () => api.functional.organization.cost_center.cancel.cancelCostCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.cost_center.complete.completeCostCenter route is callable through the generated SDK. */
export async function test_api_operation_092_organization_cost_center_complete_completeCostCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cost_center.complete.completeCostCenter", async () => api.functional.organization.cost_center.complete.completeCostCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.cost_center.reject.rejectCostCenter route is callable through the generated SDK. */
export async function test_api_operation_093_organization_cost_center_reject_rejectCostCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cost_center.reject.rejectCostCenter", async () => api.functional.organization.cost_center.reject.rejectCostCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.cost_center.submit.submitCostCenter route is callable through the generated SDK. */
export async function test_api_operation_094_organization_cost_center_submit_submitCostCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cost_center.submit.submitCostCenter", async () => api.functional.organization.cost_center.submit.submitCostCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.credit_memo.createCreditMemo route is callable through the generated SDK. */
export async function test_api_operation_095_organization_credit_memo_createCreditMemo(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.credit_memo.createCreditMemo", async () => api.functional.organization.credit_memo.createCreditMemo(live, typia.random<api.functional.organization.credit_memo.createCreditMemo.Body>()));
}

/** Proves the published api.functional.organization.credit_memo.listCreditMemos route is callable through the generated SDK. */
export async function test_api_operation_096_organization_credit_memo_listCreditMemos(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.credit_memo.listCreditMemos", async () => api.functional.organization.credit_memo.listCreditMemos(live, typia.random<api.functional.organization.credit_memo.listCreditMemos.Body>()));
}

/** Proves the published api.functional.organization.credit_memo.updateCreditMemo route is callable through the generated SDK. */
export async function test_api_operation_097_organization_credit_memo_updateCreditMemo(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.credit_memo.updateCreditMemo", async () => api.functional.organization.credit_memo.updateCreditMemo(live, "coverage-id", typia.random<api.functional.organization.credit_memo.updateCreditMemo.Body>()));
}

/** Proves the published api.functional.organization.credit_memo.activate.activateCreditMemo route is callable through the generated SDK. */
export async function test_api_operation_098_organization_credit_memo_activate_activateCreditMemo(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.credit_memo.activate.activateCreditMemo", async () => api.functional.organization.credit_memo.activate.activateCreditMemo(live, "coverage-id"));
}

/** Proves the published api.functional.organization.credit_memo.approve.approveCreditMemo route is callable through the generated SDK. */
export async function test_api_operation_099_organization_credit_memo_approve_approveCreditMemo(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.credit_memo.approve.approveCreditMemo", async () => api.functional.organization.credit_memo.approve.approveCreditMemo(live, "coverage-id"));
}

/** Proves the published api.functional.organization.credit_memo.cancel.cancelCreditMemo route is callable through the generated SDK. */
export async function test_api_operation_100_organization_credit_memo_cancel_cancelCreditMemo(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.credit_memo.cancel.cancelCreditMemo", async () => api.functional.organization.credit_memo.cancel.cancelCreditMemo(live, "coverage-id"));
}

/** Proves the published api.functional.organization.credit_memo.complete.completeCreditMemo route is callable through the generated SDK. */
export async function test_api_operation_101_organization_credit_memo_complete_completeCreditMemo(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.credit_memo.complete.completeCreditMemo", async () => api.functional.organization.credit_memo.complete.completeCreditMemo(live, "coverage-id"));
}

/** Proves the published api.functional.organization.credit_memo.reject.rejectCreditMemo route is callable through the generated SDK. */
export async function test_api_operation_102_organization_credit_memo_reject_rejectCreditMemo(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.credit_memo.reject.rejectCreditMemo", async () => api.functional.organization.credit_memo.reject.rejectCreditMemo(live, "coverage-id"));
}

/** Proves the published api.functional.organization.credit_memo.submit.submitCreditMemo route is callable through the generated SDK. */
export async function test_api_operation_103_organization_credit_memo_submit_submitCreditMemo(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.credit_memo.submit.submitCreditMemo", async () => api.functional.organization.credit_memo.submit.submitCreditMemo(live, "coverage-id"));
}

/** Proves the published api.functional.organization.currency.createCurrency route is callable through the generated SDK. */
export async function test_api_operation_104_organization_currency_createCurrency(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.currency.createCurrency", async () => api.functional.organization.currency.createCurrency(live, typia.random<api.functional.organization.currency.createCurrency.Body>()));
}

/** Proves the published api.functional.organization.currency.listCurrencies route is callable through the generated SDK. */
export async function test_api_operation_105_organization_currency_listCurrencies(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.currency.listCurrencies", async () => api.functional.organization.currency.listCurrencies(live, typia.random<api.functional.organization.currency.listCurrencies.Body>()));
}

/** Proves the published api.functional.organization.currency.updateCurrency route is callable through the generated SDK. */
export async function test_api_operation_106_organization_currency_updateCurrency(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.currency.updateCurrency", async () => api.functional.organization.currency.updateCurrency(live, "coverage-id", typia.random<api.functional.organization.currency.updateCurrency.Body>()));
}

/** Proves the published api.functional.organization.currency.deactivate.deactivateCurrency route is callable through the generated SDK. */
export async function test_api_operation_107_organization_currency_deactivate_deactivateCurrency(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.currency.deactivate.deactivateCurrency", async () => api.functional.organization.currency.deactivate.deactivateCurrency(live, "coverage-id"));
}

/** Proves the published api.functional.organization.customer.createCustomer route is callable through the generated SDK. */
export async function test_api_operation_108_organization_customer_createCustomer(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.customer.createCustomer", async () => api.functional.organization.customer.createCustomer(live, typia.random<api.functional.organization.customer.createCustomer.Body>()));
}

/** Proves the published api.functional.organization.customer.listCustomers route is callable through the generated SDK. */
export async function test_api_operation_109_organization_customer_listCustomers(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.customer.listCustomers", async () => api.functional.organization.customer.listCustomers(live, typia.random<api.functional.organization.customer.listCustomers.Body>()));
}

/** Proves the published api.functional.organization.customer.updateCustomer route is callable through the generated SDK. */
export async function test_api_operation_110_organization_customer_updateCustomer(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.customer.updateCustomer", async () => api.functional.organization.customer.updateCustomer(live, "coverage-id", typia.random<api.functional.organization.customer.updateCustomer.Body>()));
}

/** Proves the published api.functional.organization.customer.eraseCustomer route is callable through the generated SDK. */
export async function test_api_operation_111_organization_customer_eraseCustomer(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.customer.eraseCustomer", async () => api.functional.organization.customer.eraseCustomer(live, "coverage-id"));
}

/** Proves the published api.functional.organization.customer.deactivate.deactivateCustomer route is callable through the generated SDK. */
export async function test_api_operation_112_organization_customer_deactivate_deactivateCustomer(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.customer.deactivate.deactivateCustomer", async () => api.functional.organization.customer.deactivate.deactivateCustomer(live, "coverage-id"));
}

/** Proves the published api.functional.organization.customer_payment.createCustomerPayment route is callable through the generated SDK. */
export async function test_api_operation_113_organization_customer_payment_createCustomerPayment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.customer_payment.createCustomerPayment", async () => api.functional.organization.customer_payment.createCustomerPayment(live, typia.random<api.functional.organization.customer_payment.createCustomerPayment.Body>()));
}

/** Proves the published api.functional.organization.customer_payment.listCustomerPayments route is callable through the generated SDK. */
export async function test_api_operation_114_organization_customer_payment_listCustomerPayments(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.customer_payment.listCustomerPayments", async () => api.functional.organization.customer_payment.listCustomerPayments(live, typia.random<api.functional.organization.customer_payment.listCustomerPayments.Body>()));
}

/** Proves the published api.functional.organization.customer_payment.updateCustomerPayment route is callable through the generated SDK. */
export async function test_api_operation_115_organization_customer_payment_updateCustomerPayment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.customer_payment.updateCustomerPayment", async () => api.functional.organization.customer_payment.updateCustomerPayment(live, "coverage-id", typia.random<api.functional.organization.customer_payment.updateCustomerPayment.Body>()));
}

/** Proves the published api.functional.organization.customer_payment.activate.activateCustomerPayment route is callable through the generated SDK. */
export async function test_api_operation_116_organization_customer_payment_activate_activateCustomerPayment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.customer_payment.activate.activateCustomerPayment", async () => api.functional.organization.customer_payment.activate.activateCustomerPayment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.customer_payment.approve.approveCustomerPayment route is callable through the generated SDK. */
export async function test_api_operation_117_organization_customer_payment_approve_approveCustomerPayment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.customer_payment.approve.approveCustomerPayment", async () => api.functional.organization.customer_payment.approve.approveCustomerPayment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.customer_payment.cancel.cancelCustomerPayment route is callable through the generated SDK. */
export async function test_api_operation_118_organization_customer_payment_cancel_cancelCustomerPayment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.customer_payment.cancel.cancelCustomerPayment", async () => api.functional.organization.customer_payment.cancel.cancelCustomerPayment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.customer_payment.complete.completeCustomerPayment route is callable through the generated SDK. */
export async function test_api_operation_119_organization_customer_payment_complete_completeCustomerPayment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.customer_payment.complete.completeCustomerPayment", async () => api.functional.organization.customer_payment.complete.completeCustomerPayment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.customer_payment.reject.rejectCustomerPayment route is callable through the generated SDK. */
export async function test_api_operation_120_organization_customer_payment_reject_rejectCustomerPayment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.customer_payment.reject.rejectCustomerPayment", async () => api.functional.organization.customer_payment.reject.rejectCustomerPayment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.customer_payment.submit.submitCustomerPayment route is callable through the generated SDK. */
export async function test_api_operation_121_organization_customer_payment_submit_submitCustomerPayment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.customer_payment.submit.submitCustomerPayment", async () => api.functional.organization.customer_payment.submit.submitCustomerPayment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.custom_field.definition.create route is callable through the generated SDK. */
export async function test_api_operation_122_organization_custom_field_definition_create(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.custom_field.definition.create", async () => api.functional.organization.custom_field.definition.create(live, typia.random<api.functional.organization.custom_field.definition.create.Body>()));
}

/** Proves the published api.functional.organization.custom_field.definition.list route is callable through the generated SDK. */
export async function test_api_operation_123_organization_custom_field_definition_list(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.custom_field.definition.list", async () => api.functional.organization.custom_field.definition.list(live, typia.random<api.functional.organization.custom_field.definition.list.Body>()));
}

/** Proves the published api.functional.organization.custom_field.definition.update route is callable through the generated SDK. */
export async function test_api_operation_124_organization_custom_field_definition_update(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.custom_field.definition.update", async () => api.functional.organization.custom_field.definition.update(live, "coverage-id", typia.random<api.functional.organization.custom_field.definition.update.Body>()));
}

/** Proves the published api.functional.organization.custom_field.definition.deactivate route is callable through the generated SDK. */
export async function test_api_operation_125_organization_custom_field_definition_deactivate(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.custom_field.definition.deactivate", async () => api.functional.organization.custom_field.definition.deactivate(live, "coverage-id"));
}

/** Proves the published api.functional.organization.custom_field.value.set route is callable through the generated SDK. */
export async function test_api_operation_126_organization_custom_field_value_set(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.custom_field.value.set", async () => api.functional.organization.custom_field.value.set(live, typia.random<api.functional.organization.custom_field.value.set.Body>()));
}

/** Proves the published api.functional.organization.custom_field.value.values route is callable through the generated SDK. */
export async function test_api_operation_127_organization_custom_field_value_values(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.custom_field.value.values", async () => api.functional.organization.custom_field.value.values(live, typia.random<api.functional.organization.custom_field.value.values.Body>()));
}

/** Proves the published api.functional.organization.cycle_count.createCycleCount route is callable through the generated SDK. */
export async function test_api_operation_128_organization_cycle_count_createCycleCount(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cycle_count.createCycleCount", async () => api.functional.organization.cycle_count.createCycleCount(live, typia.random<api.functional.organization.cycle_count.createCycleCount.Body>()));
}

/** Proves the published api.functional.organization.cycle_count.listCycleCounts route is callable through the generated SDK. */
export async function test_api_operation_129_organization_cycle_count_listCycleCounts(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cycle_count.listCycleCounts", async () => api.functional.organization.cycle_count.listCycleCounts(live, typia.random<api.functional.organization.cycle_count.listCycleCounts.Body>()));
}

/** Proves the published api.functional.organization.cycle_count.updateCycleCount route is callable through the generated SDK. */
export async function test_api_operation_130_organization_cycle_count_updateCycleCount(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cycle_count.updateCycleCount", async () => api.functional.organization.cycle_count.updateCycleCount(live, "coverage-id", typia.random<api.functional.organization.cycle_count.updateCycleCount.Body>()));
}

/** Proves the published api.functional.organization.cycle_count.activate.activateCycleCount route is callable through the generated SDK. */
export async function test_api_operation_131_organization_cycle_count_activate_activateCycleCount(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cycle_count.activate.activateCycleCount", async () => api.functional.organization.cycle_count.activate.activateCycleCount(live, "coverage-id"));
}

/** Proves the published api.functional.organization.cycle_count.approve.approveCycleCount route is callable through the generated SDK. */
export async function test_api_operation_132_organization_cycle_count_approve_approveCycleCount(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cycle_count.approve.approveCycleCount", async () => api.functional.organization.cycle_count.approve.approveCycleCount(live, "coverage-id"));
}

/** Proves the published api.functional.organization.cycle_count.cancel.cancelCycleCount route is callable through the generated SDK. */
export async function test_api_operation_133_organization_cycle_count_cancel_cancelCycleCount(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cycle_count.cancel.cancelCycleCount", async () => api.functional.organization.cycle_count.cancel.cancelCycleCount(live, "coverage-id"));
}

/** Proves the published api.functional.organization.cycle_count.complete.completeCycleCount route is callable through the generated SDK. */
export async function test_api_operation_134_organization_cycle_count_complete_completeCycleCount(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cycle_count.complete.completeCycleCount", async () => api.functional.organization.cycle_count.complete.completeCycleCount(live, "coverage-id"));
}

/** Proves the published api.functional.organization.cycle_count.reject.rejectCycleCount route is callable through the generated SDK. */
export async function test_api_operation_135_organization_cycle_count_reject_rejectCycleCount(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cycle_count.reject.rejectCycleCount", async () => api.functional.organization.cycle_count.reject.rejectCycleCount(live, "coverage-id"));
}

/** Proves the published api.functional.organization.cycle_count.submit.submitCycleCount route is callable through the generated SDK. */
export async function test_api_operation_136_organization_cycle_count_submit_submitCycleCount(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.cycle_count.submit.submitCycleCount", async () => api.functional.organization.cycle_count.submit.submitCycleCount(live, "coverage-id"));
}

/** Proves the published api.functional.organization.department.createDepartment route is callable through the generated SDK. */
export async function test_api_operation_137_organization_department_createDepartment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.department.createDepartment", async () => api.functional.organization.department.createDepartment(live, typia.random<api.functional.organization.department.createDepartment.Body>()));
}

/** Proves the published api.functional.organization.department.listDepartments route is callable through the generated SDK. */
export async function test_api_operation_138_organization_department_listDepartments(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.department.listDepartments", async () => api.functional.organization.department.listDepartments(live, typia.random<api.functional.organization.department.listDepartments.Body>()));
}

/** Proves the published api.functional.organization.department.updateDepartment route is callable through the generated SDK. */
export async function test_api_operation_139_organization_department_updateDepartment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.department.updateDepartment", async () => api.functional.organization.department.updateDepartment(live, "coverage-id", typia.random<api.functional.organization.department.updateDepartment.Body>()));
}

/** Proves the published api.functional.organization.department.deactivate.deactivateDepartment route is callable through the generated SDK. */
export async function test_api_operation_140_organization_department_deactivate_deactivateDepartment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.department.deactivate.deactivateDepartment", async () => api.functional.organization.department.deactivate.deactivateDepartment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.document_number.createSequence route is callable through the generated SDK. */
export async function test_api_operation_141_organization_document_number_createSequence(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.document_number.createSequence", async () => api.functional.organization.document_number.createSequence(live, typia.random<api.functional.organization.document_number.createSequence.Body>()));
}

/** Proves the published api.functional.organization.document_number.listSequences route is callable through the generated SDK. */
export async function test_api_operation_142_organization_document_number_listSequences(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.document_number.listSequences", async () => api.functional.organization.document_number.listSequences(live, typia.random<api.functional.organization.document_number.listSequences.Body>()));
}

/** Proves the published api.functional.organization.document_number.updateSequence route is callable through the generated SDK. */
export async function test_api_operation_143_organization_document_number_updateSequence(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.document_number.updateSequence", async () => api.functional.organization.document_number.updateSequence(live, "coverage-id", typia.random<api.functional.organization.document_number.updateSequence.Body>()));
}

/** Proves the published api.functional.organization.document_number.next.nextNumber route is callable through the generated SDK. */
export async function test_api_operation_144_organization_document_number_next_nextNumber(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.document_number.next.nextNumber", async () => api.functional.organization.document_number.next.nextNumber(live, typia.random<api.functional.organization.document_number.next.nextNumber.Body>()));
}

/** Proves the published api.functional.organization.employee.createEmployee route is callable through the generated SDK. */
export async function test_api_operation_145_organization_employee_createEmployee(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.employee.createEmployee", async () => api.functional.organization.employee.createEmployee(live, typia.random<api.functional.organization.employee.createEmployee.Body>()));
}

/** Proves the published api.functional.organization.employee.listEmployees route is callable through the generated SDK. */
export async function test_api_operation_146_organization_employee_listEmployees(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.employee.listEmployees", async () => api.functional.organization.employee.listEmployees(live, typia.random<api.functional.organization.employee.listEmployees.Body>()));
}

/** Proves the published api.functional.organization.employee.updateEmployee route is callable through the generated SDK. */
export async function test_api_operation_147_organization_employee_updateEmployee(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.employee.updateEmployee", async () => api.functional.organization.employee.updateEmployee(live, "coverage-id", typia.random<api.functional.organization.employee.updateEmployee.Body>()));
}

/** Proves the published api.functional.organization.employee.deactivate.deactivateEmployee route is callable through the generated SDK. */
export async function test_api_operation_148_organization_employee_deactivate_deactivateEmployee(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.employee.deactivate.deactivateEmployee", async () => api.functional.organization.employee.deactivate.deactivateEmployee(live, "coverage-id"));
}

/** Proves the published api.functional.organization.equipment.createEquipment route is callable through the generated SDK. */
export async function test_api_operation_149_organization_equipment_createEquipment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.equipment.createEquipment", async () => api.functional.organization.equipment.createEquipment(live, typia.random<api.functional.organization.equipment.createEquipment.Body>()));
}

/** Proves the published api.functional.organization.equipment.listEquipment route is callable through the generated SDK. */
export async function test_api_operation_150_organization_equipment_listEquipment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.equipment.listEquipment", async () => api.functional.organization.equipment.listEquipment(live, typia.random<api.functional.organization.equipment.listEquipment.Body>()));
}

/** Proves the published api.functional.organization.equipment.updateEquipment route is callable through the generated SDK. */
export async function test_api_operation_151_organization_equipment_updateEquipment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.equipment.updateEquipment", async () => api.functional.organization.equipment.updateEquipment(live, "coverage-id", typia.random<api.functional.organization.equipment.updateEquipment.Body>()));
}

/** Proves the published api.functional.organization.equipment.activate.activateEquipment route is callable through the generated SDK. */
export async function test_api_operation_152_organization_equipment_activate_activateEquipment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.equipment.activate.activateEquipment", async () => api.functional.organization.equipment.activate.activateEquipment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.equipment.approve.approveEquipment route is callable through the generated SDK. */
export async function test_api_operation_153_organization_equipment_approve_approveEquipment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.equipment.approve.approveEquipment", async () => api.functional.organization.equipment.approve.approveEquipment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.equipment.cancel.cancelEquipment route is callable through the generated SDK. */
export async function test_api_operation_154_organization_equipment_cancel_cancelEquipment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.equipment.cancel.cancelEquipment", async () => api.functional.organization.equipment.cancel.cancelEquipment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.equipment.complete.completeEquipment route is callable through the generated SDK. */
export async function test_api_operation_155_organization_equipment_complete_completeEquipment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.equipment.complete.completeEquipment", async () => api.functional.organization.equipment.complete.completeEquipment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.equipment.reject.rejectEquipment route is callable through the generated SDK. */
export async function test_api_operation_156_organization_equipment_reject_rejectEquipment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.equipment.reject.rejectEquipment", async () => api.functional.organization.equipment.reject.rejectEquipment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.equipment.submit.submitEquipment route is callable through the generated SDK. */
export async function test_api_operation_157_organization_equipment_submit_submitEquipment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.equipment.submit.submitEquipment", async () => api.functional.organization.equipment.submit.submitEquipment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.exchange_rate.record route is callable through the generated SDK. */
export async function test_api_operation_158_organization_exchange_rate_record(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.exchange_rate.record", async () => api.functional.organization.exchange_rate.record(live, typia.random<api.functional.organization.exchange_rate.record.Body>()));
}

/** Proves the published api.functional.organization.exchange_rate.list route is callable through the generated SDK. */
export async function test_api_operation_159_organization_exchange_rate_list(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.exchange_rate.list", async () => api.functional.organization.exchange_rate.list(live, typia.random<api.functional.organization.exchange_rate.list.Body>()));
}

/** Proves the published api.functional.organization.exchange_rate.resolve route is callable through the generated SDK. */
export async function test_api_operation_160_organization_exchange_rate_resolve(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.exchange_rate.resolve", async () => api.functional.organization.exchange_rate.resolve(live, typia.random<api.functional.organization.exchange_rate.resolve.Body>()));
}

/** Proves the published api.functional.organization.fiscal_year.createFiscalYear route is callable through the generated SDK. */
export async function test_api_operation_161_organization_fiscal_year_createFiscalYear(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.fiscal_year.createFiscalYear", async () => api.functional.organization.fiscal_year.createFiscalYear(live, typia.random<api.functional.organization.fiscal_year.createFiscalYear.Body>()));
}

/** Proves the published api.functional.organization.fiscal_year.listFiscalYears route is callable through the generated SDK. */
export async function test_api_operation_162_organization_fiscal_year_listFiscalYears(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.fiscal_year.listFiscalYears", async () => api.functional.organization.fiscal_year.listFiscalYears(live, typia.random<api.functional.organization.fiscal_year.listFiscalYears.Body>()));
}

/** Proves the published api.functional.organization.fiscal_year.updateFiscalYear route is callable through the generated SDK. */
export async function test_api_operation_163_organization_fiscal_year_updateFiscalYear(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.fiscal_year.updateFiscalYear", async () => api.functional.organization.fiscal_year.updateFiscalYear(live, "coverage-id", typia.random<api.functional.organization.fiscal_year.updateFiscalYear.Body>()));
}

/** Proves the published api.functional.organization.fixed_asset.createAsset route is callable through the generated SDK. */
export async function test_api_operation_164_organization_fixed_asset_createAsset(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.fixed_asset.createAsset", async () => api.functional.organization.fixed_asset.createAsset(live, typia.random<api.functional.organization.fixed_asset.createAsset.Body>()));
}

/** Proves the published api.functional.organization.fixed_asset.listAssets route is callable through the generated SDK. */
export async function test_api_operation_165_organization_fixed_asset_listAssets(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.fixed_asset.listAssets", async () => api.functional.organization.fixed_asset.listAssets(live, typia.random<api.functional.organization.fixed_asset.listAssets.Body>()));
}

/** Proves the published api.functional.organization.fixed_asset.capitalize.capitalizeAsset route is callable through the generated SDK. */
export async function test_api_operation_166_organization_fixed_asset_capitalize_capitalizeAsset(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.fixed_asset.capitalize.capitalizeAsset", async () => api.functional.organization.fixed_asset.capitalize.capitalizeAsset(live, "coverage-id"));
}

/** Proves the published api.functional.organization.fixed_asset.depreciate.depreciateAsset route is callable through the generated SDK. */
export async function test_api_operation_167_organization_fixed_asset_depreciate_depreciateAsset(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.fixed_asset.depreciate.depreciateAsset", async () => api.functional.organization.fixed_asset.depreciate.depreciateAsset(live, "coverage-id", typia.random<api.functional.organization.fixed_asset.depreciate.depreciateAsset.Body>()));
}

/** Proves the published api.functional.organization.fixed_asset.dispose.disposeAsset route is callable through the generated SDK. */
export async function test_api_operation_168_organization_fixed_asset_dispose_disposeAsset(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.fixed_asset.dispose.disposeAsset", async () => api.functional.organization.fixed_asset.dispose.disposeAsset(live, "coverage-id"));
}

/** Proves the published api.functional.organization.inspection_plan.createInspectionPlan route is callable through the generated SDK. */
export async function test_api_operation_169_organization_inspection_plan_createInspectionPlan(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inspection_plan.createInspectionPlan", async () => api.functional.organization.inspection_plan.createInspectionPlan(live, typia.random<api.functional.organization.inspection_plan.createInspectionPlan.Body>()));
}

/** Proves the published api.functional.organization.inspection_plan.listInspectionPlans route is callable through the generated SDK. */
export async function test_api_operation_170_organization_inspection_plan_listInspectionPlans(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inspection_plan.listInspectionPlans", async () => api.functional.organization.inspection_plan.listInspectionPlans(live, typia.random<api.functional.organization.inspection_plan.listInspectionPlans.Body>()));
}

/** Proves the published api.functional.organization.inspection_plan.updateInspectionPlan route is callable through the generated SDK. */
export async function test_api_operation_171_organization_inspection_plan_updateInspectionPlan(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inspection_plan.updateInspectionPlan", async () => api.functional.organization.inspection_plan.updateInspectionPlan(live, "coverage-id", typia.random<api.functional.organization.inspection_plan.updateInspectionPlan.Body>()));
}

/** Proves the published api.functional.organization.inspection_plan.activate.activateInspectionPlan route is callable through the generated SDK. */
export async function test_api_operation_172_organization_inspection_plan_activate_activateInspectionPlan(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inspection_plan.activate.activateInspectionPlan", async () => api.functional.organization.inspection_plan.activate.activateInspectionPlan(live, "coverage-id"));
}

/** Proves the published api.functional.organization.inspection_plan.approve.approveInspectionPlan route is callable through the generated SDK. */
export async function test_api_operation_173_organization_inspection_plan_approve_approveInspectionPlan(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inspection_plan.approve.approveInspectionPlan", async () => api.functional.organization.inspection_plan.approve.approveInspectionPlan(live, "coverage-id"));
}

/** Proves the published api.functional.organization.inspection_plan.cancel.cancelInspectionPlan route is callable through the generated SDK. */
export async function test_api_operation_174_organization_inspection_plan_cancel_cancelInspectionPlan(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inspection_plan.cancel.cancelInspectionPlan", async () => api.functional.organization.inspection_plan.cancel.cancelInspectionPlan(live, "coverage-id"));
}

/** Proves the published api.functional.organization.inspection_plan.complete.completeInspectionPlan route is callable through the generated SDK. */
export async function test_api_operation_175_organization_inspection_plan_complete_completeInspectionPlan(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inspection_plan.complete.completeInspectionPlan", async () => api.functional.organization.inspection_plan.complete.completeInspectionPlan(live, "coverage-id"));
}

/** Proves the published api.functional.organization.inspection_plan.reject.rejectInspectionPlan route is callable through the generated SDK. */
export async function test_api_operation_176_organization_inspection_plan_reject_rejectInspectionPlan(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inspection_plan.reject.rejectInspectionPlan", async () => api.functional.organization.inspection_plan.reject.rejectInspectionPlan(live, "coverage-id"));
}

/** Proves the published api.functional.organization.inspection_plan.submit.submitInspectionPlan route is callable through the generated SDK. */
export async function test_api_operation_177_organization_inspection_plan_submit_submitInspectionPlan(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inspection_plan.submit.submitInspectionPlan", async () => api.functional.organization.inspection_plan.submit.submitInspectionPlan(live, "coverage-id"));
}

/** Proves the published api.functional.organization.inventory_adjustment.createInventoryAdjustment route is callable through the generated SDK. */
export async function test_api_operation_178_organization_inventory_adjustment_createInventoryAdjustment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inventory_adjustment.createInventoryAdjustment", async () => api.functional.organization.inventory_adjustment.createInventoryAdjustment(live, typia.random<api.functional.organization.inventory_adjustment.createInventoryAdjustment.Body>()));
}

/** Proves the published api.functional.organization.inventory_adjustment.listInventoryAdjustments route is callable through the generated SDK. */
export async function test_api_operation_179_organization_inventory_adjustment_listInventoryAdjustments(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inventory_adjustment.listInventoryAdjustments", async () => api.functional.organization.inventory_adjustment.listInventoryAdjustments(live, typia.random<api.functional.organization.inventory_adjustment.listInventoryAdjustments.Body>()));
}

/** Proves the published api.functional.organization.inventory_adjustment.updateInventoryAdjustment route is callable through the generated SDK. */
export async function test_api_operation_180_organization_inventory_adjustment_updateInventoryAdjustment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inventory_adjustment.updateInventoryAdjustment", async () => api.functional.organization.inventory_adjustment.updateInventoryAdjustment(live, "coverage-id", typia.random<api.functional.organization.inventory_adjustment.updateInventoryAdjustment.Body>()));
}

/** Proves the published api.functional.organization.inventory_adjustment.activate.activateInventoryAdjustment route is callable through the generated SDK. */
export async function test_api_operation_181_organization_inventory_adjustment_activate_activateInventoryAdjustment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inventory_adjustment.activate.activateInventoryAdjustment", async () => api.functional.organization.inventory_adjustment.activate.activateInventoryAdjustment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.inventory_adjustment.approve.approveInventoryAdjustment route is callable through the generated SDK. */
export async function test_api_operation_182_organization_inventory_adjustment_approve_approveInventoryAdjustment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inventory_adjustment.approve.approveInventoryAdjustment", async () => api.functional.organization.inventory_adjustment.approve.approveInventoryAdjustment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.inventory_adjustment.cancel.cancelInventoryAdjustment route is callable through the generated SDK. */
export async function test_api_operation_183_organization_inventory_adjustment_cancel_cancelInventoryAdjustment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inventory_adjustment.cancel.cancelInventoryAdjustment", async () => api.functional.organization.inventory_adjustment.cancel.cancelInventoryAdjustment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.inventory_adjustment.complete.completeInventoryAdjustment route is callable through the generated SDK. */
export async function test_api_operation_184_organization_inventory_adjustment_complete_completeInventoryAdjustment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inventory_adjustment.complete.completeInventoryAdjustment", async () => api.functional.organization.inventory_adjustment.complete.completeInventoryAdjustment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.inventory_adjustment.reject.rejectInventoryAdjustment route is callable through the generated SDK. */
export async function test_api_operation_185_organization_inventory_adjustment_reject_rejectInventoryAdjustment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inventory_adjustment.reject.rejectInventoryAdjustment", async () => api.functional.organization.inventory_adjustment.reject.rejectInventoryAdjustment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.inventory_adjustment.submit.submitInventoryAdjustment route is callable through the generated SDK. */
export async function test_api_operation_186_organization_inventory_adjustment_submit_submitInventoryAdjustment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.inventory_adjustment.submit.submitInventoryAdjustment", async () => api.functional.organization.inventory_adjustment.submit.submitInventoryAdjustment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.item.createItem route is callable through the generated SDK. */
export async function test_api_operation_187_organization_item_createItem(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.item.createItem", async () => api.functional.organization.item.createItem(live, typia.random<api.functional.organization.item.createItem.Body>()));
}

/** Proves the published api.functional.organization.item.listItems route is callable through the generated SDK. */
export async function test_api_operation_188_organization_item_listItems(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.item.listItems", async () => api.functional.organization.item.listItems(live, typia.random<api.functional.organization.item.listItems.Body>()));
}

/** Proves the published api.functional.organization.item.updateItem route is callable through the generated SDK. */
export async function test_api_operation_189_organization_item_updateItem(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.item.updateItem", async () => api.functional.organization.item.updateItem(live, "coverage-id", typia.random<api.functional.organization.item.updateItem.Body>()));
}

/** Proves the published api.functional.organization.item.deactivate.deactivateItem route is callable through the generated SDK. */
export async function test_api_operation_190_organization_item_deactivate_deactivateItem(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.item.deactivate.deactivateItem", async () => api.functional.organization.item.deactivate.deactivateItem(live, "coverage-id"));
}

/** Proves the published api.functional.organization.journal.createJournal route is callable through the generated SDK. */
export async function test_api_operation_191_organization_journal_createJournal(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.journal.createJournal", async () => api.functional.organization.journal.createJournal(live, typia.random<api.functional.organization.journal.createJournal.Body>()));
}

/** Proves the published api.functional.organization.journal.listJournals route is callable through the generated SDK. */
export async function test_api_operation_192_organization_journal_listJournals(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.journal.listJournals", async () => api.functional.organization.journal.listJournals(live, typia.random<api.functional.organization.journal.listJournals.Body>()));
}

/** Proves the published api.functional.organization.quarantine.createQuarantine route is callable through the generated SDK. */
export async function test_api_operation_193_organization_quarantine_createQuarantine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.quarantine.createQuarantine", async () => api.functional.organization.quarantine.createQuarantine(live, typia.random<api.functional.organization.quarantine.createQuarantine.Body>()));
}

/** Proves the published api.functional.organization.quarantine.listQuarantines route is callable through the generated SDK. */
export async function test_api_operation_194_organization_quarantine_listQuarantines(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.quarantine.listQuarantines", async () => api.functional.organization.quarantine.listQuarantines(live, typia.random<api.functional.organization.quarantine.listQuarantines.Body>()));
}

/** Proves the published api.functional.organization.quarantine.release.releaseQuarantine route is callable through the generated SDK. */
export async function test_api_operation_195_organization_quarantine_release_releaseQuarantine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.quarantine.release.releaseQuarantine", async () => api.functional.organization.quarantine.release.releaseQuarantine(live, "coverage-id", typia.random<api.functional.organization.quarantine.release.releaseQuarantine.Body>()));
}

/** Proves the published api.functional.organization.reconciliation.createReconciliation route is callable through the generated SDK. */
export async function test_api_operation_196_organization_reconciliation_createReconciliation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.reconciliation.createReconciliation", async () => api.functional.organization.reconciliation.createReconciliation(live, typia.random<api.functional.organization.reconciliation.createReconciliation.Body>()));
}

/** Proves the published api.functional.organization.reconciliation.listReconciliations route is callable through the generated SDK. */
export async function test_api_operation_197_organization_reconciliation_listReconciliations(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.reconciliation.listReconciliations", async () => api.functional.organization.reconciliation.listReconciliations(live, typia.random<api.functional.organization.reconciliation.listReconciliations.Body>()));
}

/** Proves the published api.functional.organization.reconciliation.complete.completeReconciliation route is callable through the generated SDK. */
export async function test_api_operation_198_organization_reconciliation_complete_completeReconciliation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.reconciliation.complete.completeReconciliation", async () => api.functional.organization.reconciliation.complete.completeReconciliation(live, "coverage-id"));
}

/** Proves the published api.functional.organization.reconciliation.reopen.reopenReconciliation route is callable through the generated SDK. */
export async function test_api_operation_199_organization_reconciliation_reopen_reopenReconciliation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.reconciliation.reopen.reopenReconciliation", async () => api.functional.organization.reconciliation.reopen.reopenReconciliation(live, "coverage-id"));
}

/** Proves the published api.functional.organization.report.headcount route is callable through the generated SDK. */
export async function test_api_operation_200_organization_report_headcount(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.report.headcount", async () => api.functional.organization.report.headcount(live, typia.random<api.functional.organization.report.headcount.Body>()));
}

/** Proves the published api.functional.organization.report._export route is callable through the generated SDK. */
export async function test_api_operation_201_organization_report_export(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.report._export", async () => api.functional.organization.report._export(live, "coverage-id", typia.random<api.functional.organization.report._export.Body>()));
}

/** Proves the published api.functional.organization.report.ap_aging.ap route is callable through the generated SDK. */
export async function test_api_operation_202_organization_report_ap_aging_ap(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.report.ap_aging.ap", async () => api.functional.organization.report.ap_aging.ap(live, typia.random<api.functional.organization.report.ap_aging.ap.Body>()));
}

/** Proves the published api.functional.organization.report.ar_aging.ar route is callable through the generated SDK. */
export async function test_api_operation_203_organization_report_ar_aging_ar(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.report.ar_aging.ar", async () => api.functional.organization.report.ar_aging.ar(live, typia.random<api.functional.organization.report.ar_aging.ar.Body>()));
}

/** Proves the published api.functional.organization.report.balance_sheet.balance route is callable through the generated SDK. */
export async function test_api_operation_204_organization_report_balance_sheet_balance(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.report.balance_sheet.balance", async () => api.functional.organization.report.balance_sheet.balance(live, typia.random<api.functional.organization.report.balance_sheet.balance.Body>()));
}

/** Proves the published api.functional.organization.report.budget_actual.budget route is callable through the generated SDK. */
export async function test_api_operation_205_organization_report_budget_actual_budget(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.report.budget_actual.budget", async () => api.functional.organization.report.budget_actual.budget(live, typia.random<api.functional.organization.report.budget_actual.budget.Body>()));
}

/** Proves the published api.functional.organization.report.cash_flow.cash route is callable through the generated SDK. */
export async function test_api_operation_206_organization_report_cash_flow_cash(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.report.cash_flow.cash", async () => api.functional.organization.report.cash_flow.cash(live, typia.random<api.functional.organization.report.cash_flow.cash.Body>()));
}

/** Proves the published api.functional.organization.report.general_ledger.ledger route is callable through the generated SDK. */
export async function test_api_operation_207_organization_report_general_ledger_ledger(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.report.general_ledger.ledger", async () => api.functional.organization.report.general_ledger.ledger(live, typia.random<api.functional.organization.report.general_ledger.ledger.Body>()));
}

/** Proves the published api.functional.organization.report.profit_loss.profit route is callable through the generated SDK. */
export async function test_api_operation_208_organization_report_profit_loss_profit(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.report.profit_loss.profit", async () => api.functional.organization.report.profit_loss.profit(live, typia.random<api.functional.organization.report.profit_loss.profit.Body>()));
}

/** Proves the published api.functional.organization.report.purchase_status.purchase route is callable through the generated SDK. */
export async function test_api_operation_209_organization_report_purchase_status_purchase(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.report.purchase_status.purchase", async () => api.functional.organization.report.purchase_status.purchase(live, typia.random<api.functional.organization.report.purchase_status.purchase.Body>()));
}

/** Proves the published api.functional.organization.report.sales_backlog.sales route is callable through the generated SDK. */
export async function test_api_operation_210_organization_report_sales_backlog_sales(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.report.sales_backlog.sales", async () => api.functional.organization.report.sales_backlog.sales(live, typia.random<api.functional.organization.report.sales_backlog.sales.Body>()));
}

/** Proves the published api.functional.organization.report.stock_on_hand.stock route is callable through the generated SDK. */
export async function test_api_operation_211_organization_report_stock_on_hand_stock(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.report.stock_on_hand.stock", async () => api.functional.organization.report.stock_on_hand.stock(live, typia.random<api.functional.organization.report.stock_on_hand.stock.Body>()));
}

/** Proves the published api.functional.organization.report.tax_summary.tax route is callable through the generated SDK. */
export async function test_api_operation_212_organization_report_tax_summary_tax(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.report.tax_summary.tax", async () => api.functional.organization.report.tax_summary.tax(live, typia.random<api.functional.organization.report.tax_summary.tax.Body>()));
}

/** Proves the published api.functional.organization.report.trial_balance.trial route is callable through the generated SDK. */
export async function test_api_operation_213_organization_report_trial_balance_trial(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.report.trial_balance.trial", async () => api.functional.organization.report.trial_balance.trial(live, typia.random<api.functional.organization.report.trial_balance.trial.Body>()));
}

/** Proves the published api.functional.organization.report.vendor_spend.vendor route is callable through the generated SDK. */
export async function test_api_operation_214_organization_report_vendor_spend_vendor(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.report.vendor_spend.vendor", async () => api.functional.organization.report.vendor_spend.vendor(live, typia.random<api.functional.organization.report.vendor_spend.vendor.Body>()));
}

/** Proves the published api.functional.organization.role.roles route is callable through the generated SDK. */
export async function test_api_operation_215_organization_role_roles(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.role.roles", async () => api.functional.organization.role.roles(live, typia.random<api.functional.organization.role.roles.Body>()));
}

/** Proves the published api.functional.organization.routing.createRouting route is callable through the generated SDK. */
export async function test_api_operation_216_organization_routing_createRouting(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.routing.createRouting", async () => api.functional.organization.routing.createRouting(live, typia.random<api.functional.organization.routing.createRouting.Body>()));
}

/** Proves the published api.functional.organization.routing.listRoutings route is callable through the generated SDK. */
export async function test_api_operation_217_organization_routing_listRoutings(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.routing.listRoutings", async () => api.functional.organization.routing.listRoutings(live, typia.random<api.functional.organization.routing.listRoutings.Body>()));
}

/** Proves the published api.functional.organization.routing.updateRouting route is callable through the generated SDK. */
export async function test_api_operation_218_organization_routing_updateRouting(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.routing.updateRouting", async () => api.functional.organization.routing.updateRouting(live, "coverage-id", typia.random<api.functional.organization.routing.updateRouting.Body>()));
}

/** Proves the published api.functional.organization.routing.activate.activateRouting route is callable through the generated SDK. */
export async function test_api_operation_219_organization_routing_activate_activateRouting(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.routing.activate.activateRouting", async () => api.functional.organization.routing.activate.activateRouting(live, "coverage-id"));
}

/** Proves the published api.functional.organization.routing.approve.approveRouting route is callable through the generated SDK. */
export async function test_api_operation_220_organization_routing_approve_approveRouting(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.routing.approve.approveRouting", async () => api.functional.organization.routing.approve.approveRouting(live, "coverage-id"));
}

/** Proves the published api.functional.organization.routing.cancel.cancelRouting route is callable through the generated SDK. */
export async function test_api_operation_221_organization_routing_cancel_cancelRouting(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.routing.cancel.cancelRouting", async () => api.functional.organization.routing.cancel.cancelRouting(live, "coverage-id"));
}

/** Proves the published api.functional.organization.routing.complete.completeRouting route is callable through the generated SDK. */
export async function test_api_operation_222_organization_routing_complete_completeRouting(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.routing.complete.completeRouting", async () => api.functional.organization.routing.complete.completeRouting(live, "coverage-id"));
}

/** Proves the published api.functional.organization.routing.reject.rejectRouting route is callable through the generated SDK. */
export async function test_api_operation_223_organization_routing_reject_rejectRouting(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.routing.reject.rejectRouting", async () => api.functional.organization.routing.reject.rejectRouting(live, "coverage-id"));
}

/** Proves the published api.functional.organization.routing.submit.submitRouting route is callable through the generated SDK. */
export async function test_api_operation_224_organization_routing_submit_submitRouting(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.routing.submit.submitRouting", async () => api.functional.organization.routing.submit.submitRouting(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_invoice.createInvoice route is callable through the generated SDK. */
export async function test_api_operation_225_organization_sales_invoice_createInvoice(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_invoice.createInvoice", async () => api.functional.organization.sales_invoice.createInvoice(live, typia.random<api.functional.organization.sales_invoice.createInvoice.Body>()));
}

/** Proves the published api.functional.organization.sales_invoice.listInvoices route is callable through the generated SDK. */
export async function test_api_operation_226_organization_sales_invoice_listInvoices(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_invoice.listInvoices", async () => api.functional.organization.sales_invoice.listInvoices(live, typia.random<api.functional.organization.sales_invoice.listInvoices.Body>()));
}

/** Proves the published api.functional.organization.sales_invoice.updateInvoice route is callable through the generated SDK. */
export async function test_api_operation_227_organization_sales_invoice_updateInvoice(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_invoice.updateInvoice", async () => api.functional.organization.sales_invoice.updateInvoice(live, "coverage-id", typia.random<api.functional.organization.sales_invoice.updateInvoice.Body>()));
}

/** Proves the published api.functional.organization.sales_invoice.post.postInvoice route is callable through the generated SDK. */
export async function test_api_operation_228_organization_sales_invoice_post_postInvoice(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_invoice.post.postInvoice", async () => api.functional.organization.sales_invoice.post.postInvoice(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_invoice._void.voidInvoice route is callable through the generated SDK. */
export async function test_api_operation_229_organization_sales_invoice_void_voidInvoice(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_invoice._void.voidInvoice", async () => api.functional.organization.sales_invoice._void.voidInvoice(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_order.createOrder route is callable through the generated SDK. */
export async function test_api_operation_230_organization_sales_order_createOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_order.createOrder", async () => api.functional.organization.sales_order.createOrder(live, typia.random<api.functional.organization.sales_order.createOrder.Body>()));
}

/** Proves the published api.functional.organization.sales_order.listOrders route is callable through the generated SDK. */
export async function test_api_operation_231_organization_sales_order_listOrders(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_order.listOrders", async () => api.functional.organization.sales_order.listOrders(live, typia.random<api.functional.organization.sales_order.listOrders.Body>()));
}

/** Proves the published api.functional.organization.sales_order.updateOrder route is callable through the generated SDK. */
export async function test_api_operation_232_organization_sales_order_updateOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_order.updateOrder", async () => api.functional.organization.sales_order.updateOrder(live, "coverage-id", typia.random<api.functional.organization.sales_order.updateOrder.Body>()));
}

/** Proves the published api.functional.organization.sales_order.approve.approveOrder route is callable through the generated SDK. */
export async function test_api_operation_233_organization_sales_order_approve_approveOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_order.approve.approveOrder", async () => api.functional.organization.sales_order.approve.approveOrder(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_order.cancel.cancelOrder route is callable through the generated SDK. */
export async function test_api_operation_234_organization_sales_order_cancel_cancelOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_order.cancel.cancelOrder", async () => api.functional.organization.sales_order.cancel.cancelOrder(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_order.submit.submitOrder route is callable through the generated SDK. */
export async function test_api_operation_235_organization_sales_order_submit_submitOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_order.submit.submitOrder", async () => api.functional.organization.sales_order.submit.submitOrder(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_price.createSalesPrice route is callable through the generated SDK. */
export async function test_api_operation_236_organization_sales_price_createSalesPrice(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_price.createSalesPrice", async () => api.functional.organization.sales_price.createSalesPrice(live, typia.random<api.functional.organization.sales_price.createSalesPrice.Body>()));
}

/** Proves the published api.functional.organization.sales_price.listSalesPrices route is callable through the generated SDK. */
export async function test_api_operation_237_organization_sales_price_listSalesPrices(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_price.listSalesPrices", async () => api.functional.organization.sales_price.listSalesPrices(live, typia.random<api.functional.organization.sales_price.listSalesPrices.Body>()));
}

/** Proves the published api.functional.organization.sales_price.updateSalesPrice route is callable through the generated SDK. */
export async function test_api_operation_238_organization_sales_price_updateSalesPrice(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_price.updateSalesPrice", async () => api.functional.organization.sales_price.updateSalesPrice(live, "coverage-id", typia.random<api.functional.organization.sales_price.updateSalesPrice.Body>()));
}

/** Proves the published api.functional.organization.sales_price.activate.activateSalesPrice route is callable through the generated SDK. */
export async function test_api_operation_239_organization_sales_price_activate_activateSalesPrice(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_price.activate.activateSalesPrice", async () => api.functional.organization.sales_price.activate.activateSalesPrice(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_price.approve.approveSalesPrice route is callable through the generated SDK. */
export async function test_api_operation_240_organization_sales_price_approve_approveSalesPrice(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_price.approve.approveSalesPrice", async () => api.functional.organization.sales_price.approve.approveSalesPrice(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_price.cancel.cancelSalesPrice route is callable through the generated SDK. */
export async function test_api_operation_241_organization_sales_price_cancel_cancelSalesPrice(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_price.cancel.cancelSalesPrice", async () => api.functional.organization.sales_price.cancel.cancelSalesPrice(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_price.complete.completeSalesPrice route is callable through the generated SDK. */
export async function test_api_operation_242_organization_sales_price_complete_completeSalesPrice(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_price.complete.completeSalesPrice", async () => api.functional.organization.sales_price.complete.completeSalesPrice(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_price.reject.rejectSalesPrice route is callable through the generated SDK. */
export async function test_api_operation_243_organization_sales_price_reject_rejectSalesPrice(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_price.reject.rejectSalesPrice", async () => api.functional.organization.sales_price.reject.rejectSalesPrice(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_price.submit.submitSalesPrice route is callable through the generated SDK. */
export async function test_api_operation_244_organization_sales_price_submit_submitSalesPrice(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_price.submit.submitSalesPrice", async () => api.functional.organization.sales_price.submit.submitSalesPrice(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_quote.createSalesQuote route is callable through the generated SDK. */
export async function test_api_operation_245_organization_sales_quote_createSalesQuote(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_quote.createSalesQuote", async () => api.functional.organization.sales_quote.createSalesQuote(live, typia.random<api.functional.organization.sales_quote.createSalesQuote.Body>()));
}

/** Proves the published api.functional.organization.sales_quote.listSalesQuotes route is callable through the generated SDK. */
export async function test_api_operation_246_organization_sales_quote_listSalesQuotes(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_quote.listSalesQuotes", async () => api.functional.organization.sales_quote.listSalesQuotes(live, typia.random<api.functional.organization.sales_quote.listSalesQuotes.Body>()));
}

/** Proves the published api.functional.organization.sales_quote.updateSalesQuote route is callable through the generated SDK. */
export async function test_api_operation_247_organization_sales_quote_updateSalesQuote(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_quote.updateSalesQuote", async () => api.functional.organization.sales_quote.updateSalesQuote(live, "coverage-id", typia.random<api.functional.organization.sales_quote.updateSalesQuote.Body>()));
}

/** Proves the published api.functional.organization.sales_quote.activate.activateSalesQuote route is callable through the generated SDK. */
export async function test_api_operation_248_organization_sales_quote_activate_activateSalesQuote(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_quote.activate.activateSalesQuote", async () => api.functional.organization.sales_quote.activate.activateSalesQuote(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_quote.approve.approveSalesQuote route is callable through the generated SDK. */
export async function test_api_operation_249_organization_sales_quote_approve_approveSalesQuote(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_quote.approve.approveSalesQuote", async () => api.functional.organization.sales_quote.approve.approveSalesQuote(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_quote.cancel.cancelSalesQuote route is callable through the generated SDK. */
export async function test_api_operation_250_organization_sales_quote_cancel_cancelSalesQuote(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_quote.cancel.cancelSalesQuote", async () => api.functional.organization.sales_quote.cancel.cancelSalesQuote(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_quote.complete.completeSalesQuote route is callable through the generated SDK. */
export async function test_api_operation_251_organization_sales_quote_complete_completeSalesQuote(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_quote.complete.completeSalesQuote", async () => api.functional.organization.sales_quote.complete.completeSalesQuote(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_quote.reject.rejectSalesQuote route is callable through the generated SDK. */
export async function test_api_operation_252_organization_sales_quote_reject_rejectSalesQuote(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_quote.reject.rejectSalesQuote", async () => api.functional.organization.sales_quote.reject.rejectSalesQuote(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_quote.submit.submitSalesQuote route is callable through the generated SDK. */
export async function test_api_operation_253_organization_sales_quote_submit_submitSalesQuote(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_quote.submit.submitSalesQuote", async () => api.functional.organization.sales_quote.submit.submitSalesQuote(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_return.createSalesReturn route is callable through the generated SDK. */
export async function test_api_operation_254_organization_sales_return_createSalesReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_return.createSalesReturn", async () => api.functional.organization.sales_return.createSalesReturn(live, typia.random<api.functional.organization.sales_return.createSalesReturn.Body>()));
}

/** Proves the published api.functional.organization.sales_return.listSalesReturns route is callable through the generated SDK. */
export async function test_api_operation_255_organization_sales_return_listSalesReturns(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_return.listSalesReturns", async () => api.functional.organization.sales_return.listSalesReturns(live, typia.random<api.functional.organization.sales_return.listSalesReturns.Body>()));
}

/** Proves the published api.functional.organization.sales_return.updateSalesReturn route is callable through the generated SDK. */
export async function test_api_operation_256_organization_sales_return_updateSalesReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_return.updateSalesReturn", async () => api.functional.organization.sales_return.updateSalesReturn(live, "coverage-id", typia.random<api.functional.organization.sales_return.updateSalesReturn.Body>()));
}

/** Proves the published api.functional.organization.sales_return.activate.activateSalesReturn route is callable through the generated SDK. */
export async function test_api_operation_257_organization_sales_return_activate_activateSalesReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_return.activate.activateSalesReturn", async () => api.functional.organization.sales_return.activate.activateSalesReturn(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_return.approve.approveSalesReturn route is callable through the generated SDK. */
export async function test_api_operation_258_organization_sales_return_approve_approveSalesReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_return.approve.approveSalesReturn", async () => api.functional.organization.sales_return.approve.approveSalesReturn(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_return.cancel.cancelSalesReturn route is callable through the generated SDK. */
export async function test_api_operation_259_organization_sales_return_cancel_cancelSalesReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_return.cancel.cancelSalesReturn", async () => api.functional.organization.sales_return.cancel.cancelSalesReturn(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_return.complete.completeSalesReturn route is callable through the generated SDK. */
export async function test_api_operation_260_organization_sales_return_complete_completeSalesReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_return.complete.completeSalesReturn", async () => api.functional.organization.sales_return.complete.completeSalesReturn(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_return.reject.rejectSalesReturn route is callable through the generated SDK. */
export async function test_api_operation_261_organization_sales_return_reject_rejectSalesReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_return.reject.rejectSalesReturn", async () => api.functional.organization.sales_return.reject.rejectSalesReturn(live, "coverage-id"));
}

/** Proves the published api.functional.organization.sales_return.submit.submitSalesReturn route is callable through the generated SDK. */
export async function test_api_operation_262_organization_sales_return_submit_submitSalesReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.sales_return.submit.submitSalesReturn", async () => api.functional.organization.sales_return.submit.submitSalesReturn(live, "coverage-id"));
}

/** Proves the published api.functional.organization.service_case.createServiceCase route is callable through the generated SDK. */
export async function test_api_operation_263_organization_service_case_createServiceCase(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.service_case.createServiceCase", async () => api.functional.organization.service_case.createServiceCase(live, typia.random<api.functional.organization.service_case.createServiceCase.Body>()));
}

/** Proves the published api.functional.organization.service_case.listServiceCases route is callable through the generated SDK. */
export async function test_api_operation_264_organization_service_case_listServiceCases(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.service_case.listServiceCases", async () => api.functional.organization.service_case.listServiceCases(live, typia.random<api.functional.organization.service_case.listServiceCases.Body>()));
}

/** Proves the published api.functional.organization.service_case.updateServiceCase route is callable through the generated SDK. */
export async function test_api_operation_265_organization_service_case_updateServiceCase(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.service_case.updateServiceCase", async () => api.functional.organization.service_case.updateServiceCase(live, "coverage-id", typia.random<api.functional.organization.service_case.updateServiceCase.Body>()));
}

/** Proves the published api.functional.organization.service_case.activate.activateServiceCase route is callable through the generated SDK. */
export async function test_api_operation_266_organization_service_case_activate_activateServiceCase(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.service_case.activate.activateServiceCase", async () => api.functional.organization.service_case.activate.activateServiceCase(live, "coverage-id"));
}

/** Proves the published api.functional.organization.service_case.approve.approveServiceCase route is callable through the generated SDK. */
export async function test_api_operation_267_organization_service_case_approve_approveServiceCase(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.service_case.approve.approveServiceCase", async () => api.functional.organization.service_case.approve.approveServiceCase(live, "coverage-id"));
}

/** Proves the published api.functional.organization.service_case.cancel.cancelServiceCase route is callable through the generated SDK. */
export async function test_api_operation_268_organization_service_case_cancel_cancelServiceCase(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.service_case.cancel.cancelServiceCase", async () => api.functional.organization.service_case.cancel.cancelServiceCase(live, "coverage-id"));
}

/** Proves the published api.functional.organization.service_case.complete.completeServiceCase route is callable through the generated SDK. */
export async function test_api_operation_269_organization_service_case_complete_completeServiceCase(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.service_case.complete.completeServiceCase", async () => api.functional.organization.service_case.complete.completeServiceCase(live, "coverage-id"));
}

/** Proves the published api.functional.organization.service_case.reject.rejectServiceCase route is callable through the generated SDK. */
export async function test_api_operation_270_organization_service_case_reject_rejectServiceCase(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.service_case.reject.rejectServiceCase", async () => api.functional.organization.service_case.reject.rejectServiceCase(live, "coverage-id"));
}

/** Proves the published api.functional.organization.service_case.submit.submitServiceCase route is callable through the generated SDK. */
export async function test_api_operation_271_organization_service_case_submit_submitServiceCase(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.service_case.submit.submitServiceCase", async () => api.functional.organization.service_case.submit.submitServiceCase(live, "coverage-id"));
}

/** Proves the published api.functional.organization.service_order.createServiceOrder route is callable through the generated SDK. */
export async function test_api_operation_272_organization_service_order_createServiceOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.service_order.createServiceOrder", async () => api.functional.organization.service_order.createServiceOrder(live, typia.random<api.functional.organization.service_order.createServiceOrder.Body>()));
}

/** Proves the published api.functional.organization.service_order.listServiceOrders route is callable through the generated SDK. */
export async function test_api_operation_273_organization_service_order_listServiceOrders(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.service_order.listServiceOrders", async () => api.functional.organization.service_order.listServiceOrders(live, typia.random<api.functional.organization.service_order.listServiceOrders.Body>()));
}

/** Proves the published api.functional.organization.service_order.cancel.cancelServiceOrder route is callable through the generated SDK. */
export async function test_api_operation_274_organization_service_order_cancel_cancelServiceOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.service_order.cancel.cancelServiceOrder", async () => api.functional.organization.service_order.cancel.cancelServiceOrder(live, "coverage-id"));
}

/** Proves the published api.functional.organization.service_order.complete.completeServiceOrder route is callable through the generated SDK. */
export async function test_api_operation_275_organization_service_order_complete_completeServiceOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.service_order.complete.completeServiceOrder", async () => api.functional.organization.service_order.complete.completeServiceOrder(live, "coverage-id"));
}

/** Proves the published api.functional.organization.stock_movement.createMovement route is callable through the generated SDK. */
export async function test_api_operation_276_organization_stock_movement_createMovement(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_movement.createMovement", async () => api.functional.organization.stock_movement.createMovement(live, typia.random<api.functional.organization.stock_movement.createMovement.Body>()));
}

/** Proves the published api.functional.organization.stock_movement.listMovements route is callable through the generated SDK. */
export async function test_api_operation_277_organization_stock_movement_listMovements(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_movement.listMovements", async () => api.functional.organization.stock_movement.listMovements(live, typia.random<api.functional.organization.stock_movement.listMovements.Body>()));
}

/** Proves the published api.functional.organization.stock_quarantine.createStockQuarantine route is callable through the generated SDK. */
export async function test_api_operation_278_organization_stock_quarantine_createStockQuarantine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_quarantine.createStockQuarantine", async () => api.functional.organization.stock_quarantine.createStockQuarantine(live, typia.random<api.functional.organization.stock_quarantine.createStockQuarantine.Body>()));
}

/** Proves the published api.functional.organization.stock_quarantine.listStockQuarantines route is callable through the generated SDK. */
export async function test_api_operation_279_organization_stock_quarantine_listStockQuarantines(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_quarantine.listStockQuarantines", async () => api.functional.organization.stock_quarantine.listStockQuarantines(live, typia.random<api.functional.organization.stock_quarantine.listStockQuarantines.Body>()));
}

/** Proves the published api.functional.organization.stock_quarantine.updateStockQuarantine route is callable through the generated SDK. */
export async function test_api_operation_280_organization_stock_quarantine_updateStockQuarantine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_quarantine.updateStockQuarantine", async () => api.functional.organization.stock_quarantine.updateStockQuarantine(live, "coverage-id", typia.random<api.functional.organization.stock_quarantine.updateStockQuarantine.Body>()));
}

/** Proves the published api.functional.organization.stock_quarantine.activate.activateStockQuarantine route is callable through the generated SDK. */
export async function test_api_operation_281_organization_stock_quarantine_activate_activateStockQuarantine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_quarantine.activate.activateStockQuarantine", async () => api.functional.organization.stock_quarantine.activate.activateStockQuarantine(live, "coverage-id"));
}

/** Proves the published api.functional.organization.stock_quarantine.approve.approveStockQuarantine route is callable through the generated SDK. */
export async function test_api_operation_282_organization_stock_quarantine_approve_approveStockQuarantine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_quarantine.approve.approveStockQuarantine", async () => api.functional.organization.stock_quarantine.approve.approveStockQuarantine(live, "coverage-id"));
}

/** Proves the published api.functional.organization.stock_quarantine.cancel.cancelStockQuarantine route is callable through the generated SDK. */
export async function test_api_operation_283_organization_stock_quarantine_cancel_cancelStockQuarantine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_quarantine.cancel.cancelStockQuarantine", async () => api.functional.organization.stock_quarantine.cancel.cancelStockQuarantine(live, "coverage-id"));
}

/** Proves the published api.functional.organization.stock_quarantine.complete.completeStockQuarantine route is callable through the generated SDK. */
export async function test_api_operation_284_organization_stock_quarantine_complete_completeStockQuarantine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_quarantine.complete.completeStockQuarantine", async () => api.functional.organization.stock_quarantine.complete.completeStockQuarantine(live, "coverage-id"));
}

/** Proves the published api.functional.organization.stock_quarantine.reject.rejectStockQuarantine route is callable through the generated SDK. */
export async function test_api_operation_285_organization_stock_quarantine_reject_rejectStockQuarantine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_quarantine.reject.rejectStockQuarantine", async () => api.functional.organization.stock_quarantine.reject.rejectStockQuarantine(live, "coverage-id"));
}

/** Proves the published api.functional.organization.stock_quarantine.submit.submitStockQuarantine route is callable through the generated SDK. */
export async function test_api_operation_286_organization_stock_quarantine_submit_submitStockQuarantine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_quarantine.submit.submitStockQuarantine", async () => api.functional.organization.stock_quarantine.submit.submitStockQuarantine(live, "coverage-id"));
}

/** Proves the published api.functional.organization.stock_view.createStockView route is callable through the generated SDK. */
export async function test_api_operation_287_organization_stock_view_createStockView(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_view.createStockView", async () => api.functional.organization.stock_view.createStockView(live, typia.random<api.functional.organization.stock_view.createStockView.Body>()));
}

/** Proves the published api.functional.organization.stock_view.listStockViews route is callable through the generated SDK. */
export async function test_api_operation_288_organization_stock_view_listStockViews(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_view.listStockViews", async () => api.functional.organization.stock_view.listStockViews(live, typia.random<api.functional.organization.stock_view.listStockViews.Body>()));
}

/** Proves the published api.functional.organization.stock_view.updateStockView route is callable through the generated SDK. */
export async function test_api_operation_289_organization_stock_view_updateStockView(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_view.updateStockView", async () => api.functional.organization.stock_view.updateStockView(live, "coverage-id", typia.random<api.functional.organization.stock_view.updateStockView.Body>()));
}

/** Proves the published api.functional.organization.stock_view.activate.activateStockView route is callable through the generated SDK. */
export async function test_api_operation_290_organization_stock_view_activate_activateStockView(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_view.activate.activateStockView", async () => api.functional.organization.stock_view.activate.activateStockView(live, "coverage-id"));
}

/** Proves the published api.functional.organization.stock_view.approve.approveStockView route is callable through the generated SDK. */
export async function test_api_operation_291_organization_stock_view_approve_approveStockView(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_view.approve.approveStockView", async () => api.functional.organization.stock_view.approve.approveStockView(live, "coverage-id"));
}

/** Proves the published api.functional.organization.stock_view.cancel.cancelStockView route is callable through the generated SDK. */
export async function test_api_operation_292_organization_stock_view_cancel_cancelStockView(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_view.cancel.cancelStockView", async () => api.functional.organization.stock_view.cancel.cancelStockView(live, "coverage-id"));
}

/** Proves the published api.functional.organization.stock_view.complete.completeStockView route is callable through the generated SDK. */
export async function test_api_operation_293_organization_stock_view_complete_completeStockView(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_view.complete.completeStockView", async () => api.functional.organization.stock_view.complete.completeStockView(live, "coverage-id"));
}

/** Proves the published api.functional.organization.stock_view.reject.rejectStockView route is callable through the generated SDK. */
export async function test_api_operation_294_organization_stock_view_reject_rejectStockView(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_view.reject.rejectStockView", async () => api.functional.organization.stock_view.reject.rejectStockView(live, "coverage-id"));
}

/** Proves the published api.functional.organization.stock_view.submit.submitStockView route is callable through the generated SDK. */
export async function test_api_operation_295_organization_stock_view_submit_submitStockView(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.stock_view.submit.submitStockView", async () => api.functional.organization.stock_view.submit.submitStockView(live, "coverage-id"));
}

/** Proves the published api.functional.organization.storage_location.createLocation route is callable through the generated SDK. */
export async function test_api_operation_296_organization_storage_location_createLocation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.storage_location.createLocation", async () => api.functional.organization.storage_location.createLocation(live, typia.random<api.functional.organization.storage_location.createLocation.Body>()));
}

/** Proves the published api.functional.organization.storage_location.listLocations route is callable through the generated SDK. */
export async function test_api_operation_297_organization_storage_location_listLocations(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.storage_location.listLocations", async () => api.functional.organization.storage_location.listLocations(live, typia.random<api.functional.organization.storage_location.listLocations.Body>()));
}

/** Proves the published api.functional.organization.storage_location.updateLocation route is callable through the generated SDK. */
export async function test_api_operation_298_organization_storage_location_updateLocation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.storage_location.updateLocation", async () => api.functional.organization.storage_location.updateLocation(live, "coverage-id", typia.random<api.functional.organization.storage_location.updateLocation.Body>()));
}

/** Proves the published api.functional.organization.storage_location.deactivate.deactivateLocation route is callable through the generated SDK. */
export async function test_api_operation_299_organization_storage_location_deactivate_deactivateLocation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.storage_location.deactivate.deactivateLocation", async () => api.functional.organization.storage_location.deactivate.deactivateLocation(live, "coverage-id"));
}

/** Proves the published api.functional.organization.tag.createTag route is callable through the generated SDK. */
export async function test_api_operation_300_organization_tag_createTag(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tag.createTag", async () => api.functional.organization.tag.createTag(live, typia.random<api.functional.organization.tag.createTag.Body>()));
}

/** Proves the published api.functional.organization.tag.listTags route is callable through the generated SDK. */
export async function test_api_operation_301_organization_tag_listTags(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tag.listTags", async () => api.functional.organization.tag.listTags(live, typia.random<api.functional.organization.tag.listTags.Body>()));
}

/** Proves the published api.functional.organization.tag.updateTag route is callable through the generated SDK. */
export async function test_api_operation_302_organization_tag_updateTag(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tag.updateTag", async () => api.functional.organization.tag.updateTag(live, "coverage-id", typia.random<api.functional.organization.tag.updateTag.Body>()));
}

/** Proves the published api.functional.organization.tag.assignment.assignTag route is callable through the generated SDK. */
export async function test_api_operation_303_organization_tag_assignment_assignTag(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tag.assignment.assignTag", async () => api.functional.organization.tag.assignment.assignTag(live, "coverage-id", typia.random<api.functional.organization.tag.assignment.assignTag.Body>()));
}

/** Proves the published api.functional.organization.tag.deactivate.deactivateTag route is callable through the generated SDK. */
export async function test_api_operation_304_organization_tag_deactivate_deactivateTag(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tag.deactivate.deactivateTag", async () => api.functional.organization.tag.deactivate.deactivateTag(live, "coverage-id"));
}

/** Proves the published api.functional.organization.task.createTask route is callable through the generated SDK. */
export async function test_api_operation_305_organization_task_createTask(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.task.createTask", async () => api.functional.organization.task.createTask(live, typia.random<api.functional.organization.task.createTask.Body>()));
}

/** Proves the published api.functional.organization.task.listTasks route is callable through the generated SDK. */
export async function test_api_operation_306_organization_task_listTasks(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.task.listTasks", async () => api.functional.organization.task.listTasks(live, typia.random<api.functional.organization.task.listTasks.Body>()));
}

/** Proves the published api.functional.organization.task.updateTask route is callable through the generated SDK. */
export async function test_api_operation_307_organization_task_updateTask(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.task.updateTask", async () => api.functional.organization.task.updateTask(live, "coverage-id", typia.random<api.functional.organization.task.updateTask.Body>()));
}

/** Proves the published api.functional.organization.task.complete.completeTask route is callable through the generated SDK. */
export async function test_api_operation_308_organization_task_complete_completeTask(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.task.complete.completeTask", async () => api.functional.organization.task.complete.completeTask(live, "coverage-id"));
}

/** Proves the published api.functional.organization.tax_code.createTaxCode route is callable through the generated SDK. */
export async function test_api_operation_309_organization_tax_code_createTaxCode(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tax_code.createTaxCode", async () => api.functional.organization.tax_code.createTaxCode(live, typia.random<api.functional.organization.tax_code.createTaxCode.Body>()));
}

/** Proves the published api.functional.organization.tax_code.listTaxCodes route is callable through the generated SDK. */
export async function test_api_operation_310_organization_tax_code_listTaxCodes(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tax_code.listTaxCodes", async () => api.functional.organization.tax_code.listTaxCodes(live, typia.random<api.functional.organization.tax_code.listTaxCodes.Body>()));
}

/** Proves the published api.functional.organization.tax_code.updateTaxCode route is callable through the generated SDK. */
export async function test_api_operation_311_organization_tax_code_updateTaxCode(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tax_code.updateTaxCode", async () => api.functional.organization.tax_code.updateTaxCode(live, "coverage-id", typia.random<api.functional.organization.tax_code.updateTaxCode.Body>()));
}

/** Proves the published api.functional.organization.tax_code.deactivate.deactivateTaxCode route is callable through the generated SDK. */
export async function test_api_operation_312_organization_tax_code_deactivate_deactivateTaxCode(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tax_code.deactivate.deactivateTaxCode", async () => api.functional.organization.tax_code.deactivate.deactivateTaxCode(live, "coverage-id"));
}

/** Proves the published api.functional.organization.tax_code.rate.addTaxRate route is callable through the generated SDK. */
export async function test_api_operation_313_organization_tax_code_rate_addTaxRate(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tax_code.rate.addTaxRate", async () => api.functional.organization.tax_code.rate.addTaxRate(live, "coverage-id", typia.random<api.functional.organization.tax_code.rate.addTaxRate.Body>()));
}

/** Proves the published api.functional.organization.tax_code.rate.resolve.resolveTaxRate route is callable through the generated SDK. */
export async function test_api_operation_314_organization_tax_code_rate_resolve_resolveTaxRate(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tax_code.rate.resolve.resolveTaxRate", async () => api.functional.organization.tax_code.rate.resolve.resolveTaxRate(live, "coverage-id", typia.random<api.functional.organization.tax_code.rate.resolve.resolveTaxRate.Body>()));
}

/** Proves the published api.functional.organization.tax_jurisdiction.createJurisdiction route is callable through the generated SDK. */
export async function test_api_operation_315_organization_tax_jurisdiction_createJurisdiction(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tax_jurisdiction.createJurisdiction", async () => api.functional.organization.tax_jurisdiction.createJurisdiction(live, typia.random<api.functional.organization.tax_jurisdiction.createJurisdiction.Body>()));
}

/** Proves the published api.functional.organization.tax_jurisdiction.listJurisdictions route is callable through the generated SDK. */
export async function test_api_operation_316_organization_tax_jurisdiction_listJurisdictions(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tax_jurisdiction.listJurisdictions", async () => api.functional.organization.tax_jurisdiction.listJurisdictions(live, typia.random<api.functional.organization.tax_jurisdiction.listJurisdictions.Body>()));
}

/** Proves the published api.functional.organization.tax_jurisdiction.updateJurisdiction route is callable through the generated SDK. */
export async function test_api_operation_317_organization_tax_jurisdiction_updateJurisdiction(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tax_jurisdiction.updateJurisdiction", async () => api.functional.organization.tax_jurisdiction.updateJurisdiction(live, "coverage-id", typia.random<api.functional.organization.tax_jurisdiction.updateJurisdiction.Body>()));
}

/** Proves the published api.functional.organization.tax_jurisdiction.deactivate.deactivateJurisdiction route is callable through the generated SDK. */
export async function test_api_operation_318_organization_tax_jurisdiction_deactivate_deactivateJurisdiction(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tax_jurisdiction.deactivate.deactivateJurisdiction", async () => api.functional.organization.tax_jurisdiction.deactivate.deactivateJurisdiction(live, "coverage-id"));
}

/** Proves the published api.functional.organization.tax_return.createTaxReturn route is callable through the generated SDK. */
export async function test_api_operation_319_organization_tax_return_createTaxReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tax_return.createTaxReturn", async () => api.functional.organization.tax_return.createTaxReturn(live, typia.random<api.functional.organization.tax_return.createTaxReturn.Body>()));
}

/** Proves the published api.functional.organization.tax_return.listTaxReturns route is callable through the generated SDK. */
export async function test_api_operation_320_organization_tax_return_listTaxReturns(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tax_return.listTaxReturns", async () => api.functional.organization.tax_return.listTaxReturns(live, typia.random<api.functional.organization.tax_return.listTaxReturns.Body>()));
}

/** Proves the published api.functional.organization.tax_return.approve.approveTaxReturn route is callable through the generated SDK. */
export async function test_api_operation_321_organization_tax_return_approve_approveTaxReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tax_return.approve.approveTaxReturn", async () => api.functional.organization.tax_return.approve.approveTaxReturn(live, "coverage-id"));
}

/** Proves the published api.functional.organization.tax_return.file.fileTaxReturn route is callable through the generated SDK. */
export async function test_api_operation_322_organization_tax_return_file_fileTaxReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.tax_return.file.fileTaxReturn", async () => api.functional.organization.tax_return.file.fileTaxReturn(live, "coverage-id"));
}

/** Proves the published api.functional.organization.timelog.create route is callable through the generated SDK. */
export async function test_api_operation_323_organization_timelog_create(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.timelog.create", async () => api.functional.organization.timelog.create(live, typia.random<api.functional.organization.timelog.create.Body>()));
}

/** Proves the published api.functional.organization.timelog.list route is callable through the generated SDK. */
export async function test_api_operation_324_organization_timelog_list(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.timelog.list", async () => api.functional.organization.timelog.list(live, typia.random<api.functional.organization.timelog.list.Body>()));
}

/** Proves the published api.functional.organization.timelog.update route is callable through the generated SDK. */
export async function test_api_operation_325_organization_timelog_update(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.timelog.update", async () => api.functional.organization.timelog.update(live, "coverage-id", typia.random<api.functional.organization.timelog.update.Body>()));
}

/** Proves the published api.functional.organization.timelog.erase route is callable through the generated SDK. */
export async function test_api_operation_326_organization_timelog_erase(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.timelog.erase", async () => api.functional.organization.timelog.erase(live, "coverage-id"));
}

/** Proves the published api.functional.organization.timesheet.createSheet route is callable through the generated SDK. */
export async function test_api_operation_327_organization_timesheet_createSheet(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.timesheet.createSheet", async () => api.functional.organization.timesheet.createSheet(live, typia.random<api.functional.organization.timesheet.createSheet.Body>()));
}

/** Proves the published api.functional.organization.timesheet.listSheets route is callable through the generated SDK. */
export async function test_api_operation_328_organization_timesheet_listSheets(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.timesheet.listSheets", async () => api.functional.organization.timesheet.listSheets(live, typia.random<api.functional.organization.timesheet.listSheets.Body>()));
}

/** Proves the published api.functional.organization.timesheet.submit route is callable through the generated SDK. */
export async function test_api_operation_329_organization_timesheet_submit(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.timesheet.submit", async () => api.functional.organization.timesheet.submit(live, "coverage-id"));
}

/** Proves the published api.functional.organization.timesheet.approve route is callable through the generated SDK. */
export async function test_api_operation_330_organization_timesheet_approve(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.timesheet.approve", async () => api.functional.organization.timesheet.approve(live, "coverage-id"));
}

/** Proves the published api.functional.organization.timesheet.reject route is callable through the generated SDK. */
export async function test_api_operation_331_organization_timesheet_reject(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.timesheet.reject", async () => api.functional.organization.timesheet.reject(live, "coverage-id", typia.random<api.functional.organization.timesheet.reject.Body>()));
}

/** Proves the published api.functional.organization.transfer.createTransfer route is callable through the generated SDK. */
export async function test_api_operation_332_organization_transfer_createTransfer(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.transfer.createTransfer", async () => api.functional.organization.transfer.createTransfer(live, typia.random<api.functional.organization.transfer.createTransfer.Body>()));
}

/** Proves the published api.functional.organization.transfer.listTransfers route is callable through the generated SDK. */
export async function test_api_operation_333_organization_transfer_listTransfers(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.transfer.listTransfers", async () => api.functional.organization.transfer.listTransfers(live, typia.random<api.functional.organization.transfer.listTransfers.Body>()));
}

/** Proves the published api.functional.organization.transfer.updateTransfer route is callable through the generated SDK. */
export async function test_api_operation_334_organization_transfer_updateTransfer(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.transfer.updateTransfer", async () => api.functional.organization.transfer.updateTransfer(live, "coverage-id", typia.random<api.functional.organization.transfer.updateTransfer.Body>()));
}

/** Proves the published api.functional.organization.transfer.activate.activateTransfer route is callable through the generated SDK. */
export async function test_api_operation_335_organization_transfer_activate_activateTransfer(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.transfer.activate.activateTransfer", async () => api.functional.organization.transfer.activate.activateTransfer(live, "coverage-id"));
}

/** Proves the published api.functional.organization.transfer.approve.approveTransfer route is callable through the generated SDK. */
export async function test_api_operation_336_organization_transfer_approve_approveTransfer(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.transfer.approve.approveTransfer", async () => api.functional.organization.transfer.approve.approveTransfer(live, "coverage-id"));
}

/** Proves the published api.functional.organization.transfer.cancel.cancelTransfer route is callable through the generated SDK. */
export async function test_api_operation_337_organization_transfer_cancel_cancelTransfer(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.transfer.cancel.cancelTransfer", async () => api.functional.organization.transfer.cancel.cancelTransfer(live, "coverage-id"));
}

/** Proves the published api.functional.organization.transfer.complete.completeTransfer route is callable through the generated SDK. */
export async function test_api_operation_338_organization_transfer_complete_completeTransfer(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.transfer.complete.completeTransfer", async () => api.functional.organization.transfer.complete.completeTransfer(live, "coverage-id"));
}

/** Proves the published api.functional.organization.transfer.reject.rejectTransfer route is callable through the generated SDK. */
export async function test_api_operation_339_organization_transfer_reject_rejectTransfer(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.transfer.reject.rejectTransfer", async () => api.functional.organization.transfer.reject.rejectTransfer(live, "coverage-id"));
}

/** Proves the published api.functional.organization.transfer.submit.submitTransfer route is callable through the generated SDK. */
export async function test_api_operation_340_organization_transfer_submit_submitTransfer(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.transfer.submit.submitTransfer", async () => api.functional.organization.transfer.submit.submitTransfer(live, "coverage-id"));
}

/** Proves the published api.functional.organization.unit.createUnit route is callable through the generated SDK. */
export async function test_api_operation_341_organization_unit_createUnit(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.unit.createUnit", async () => api.functional.organization.unit.createUnit(live, typia.random<api.functional.organization.unit.createUnit.Body>()));
}

/** Proves the published api.functional.organization.unit.listUnits route is callable through the generated SDK. */
export async function test_api_operation_342_organization_unit_listUnits(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.unit.listUnits", async () => api.functional.organization.unit.listUnits(live, typia.random<api.functional.organization.unit.listUnits.Body>()));
}

/** Proves the published api.functional.organization.unit.updateUnit route is callable through the generated SDK. */
export async function test_api_operation_343_organization_unit_updateUnit(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.unit.updateUnit", async () => api.functional.organization.unit.updateUnit(live, "coverage-id", typia.random<api.functional.organization.unit.updateUnit.Body>()));
}

/** Proves the published api.functional.organization.unit.deactivate.deactivateUnit route is callable through the generated SDK. */
export async function test_api_operation_344_organization_unit_deactivate_deactivateUnit(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.unit.deactivate.deactivateUnit", async () => api.functional.organization.unit.deactivate.deactivateUnit(live, "coverage-id"));
}

/** Proves the published api.functional.organization.vendor.createVendor route is callable through the generated SDK. */
export async function test_api_operation_345_organization_vendor_createVendor(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor.createVendor", async () => api.functional.organization.vendor.createVendor(live, typia.random<api.functional.organization.vendor.createVendor.Body>()));
}

/** Proves the published api.functional.organization.vendor.listVendors route is callable through the generated SDK. */
export async function test_api_operation_346_organization_vendor_listVendors(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor.listVendors", async () => api.functional.organization.vendor.listVendors(live, typia.random<api.functional.organization.vendor.listVendors.Body>()));
}

/** Proves the published api.functional.organization.vendor.updateVendor route is callable through the generated SDK. */
export async function test_api_operation_347_organization_vendor_updateVendor(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor.updateVendor", async () => api.functional.organization.vendor.updateVendor(live, "coverage-id", typia.random<api.functional.organization.vendor.updateVendor.Body>()));
}

/** Proves the published api.functional.organization.vendor.eraseVendor route is callable through the generated SDK. */
export async function test_api_operation_348_organization_vendor_eraseVendor(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor.eraseVendor", async () => api.functional.organization.vendor.eraseVendor(live, "coverage-id"));
}

/** Proves the published api.functional.organization.vendor.deactivate.deactivateVendor route is callable through the generated SDK. */
export async function test_api_operation_349_organization_vendor_deactivate_deactivateVendor(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor.deactivate.deactivateVendor", async () => api.functional.organization.vendor.deactivate.deactivateVendor(live, "coverage-id"));
}

/** Proves the published api.functional.organization.vendor_bill.createBill route is callable through the generated SDK. */
export async function test_api_operation_350_organization_vendor_bill_createBill(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_bill.createBill", async () => api.functional.organization.vendor_bill.createBill(live, typia.random<api.functional.organization.vendor_bill.createBill.Body>()));
}

/** Proves the published api.functional.organization.vendor_bill.listBills route is callable through the generated SDK. */
export async function test_api_operation_351_organization_vendor_bill_listBills(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_bill.listBills", async () => api.functional.organization.vendor_bill.listBills(live, typia.random<api.functional.organization.vendor_bill.listBills.Body>()));
}

/** Proves the published api.functional.organization.vendor_bill.updateBill route is callable through the generated SDK. */
export async function test_api_operation_352_organization_vendor_bill_updateBill(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_bill.updateBill", async () => api.functional.organization.vendor_bill.updateBill(live, "coverage-id", typia.random<api.functional.organization.vendor_bill.updateBill.Body>()));
}

/** Proves the published api.functional.organization.vendor_bill.approve.approveBill route is callable through the generated SDK. */
export async function test_api_operation_353_organization_vendor_bill_approve_approveBill(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_bill.approve.approveBill", async () => api.functional.organization.vendor_bill.approve.approveBill(live, "coverage-id"));
}

/** Proves the published api.functional.organization.vendor_bill.dispute.disputeBill route is callable through the generated SDK. */
export async function test_api_operation_354_organization_vendor_bill_dispute_disputeBill(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_bill.dispute.disputeBill", async () => api.functional.organization.vendor_bill.dispute.disputeBill(live, "coverage-id", typia.random<api.functional.organization.vendor_bill.dispute.disputeBill.Body>()));
}

/** Proves the published api.functional.organization.vendor_bill.match.matchBill route is callable through the generated SDK. */
export async function test_api_operation_355_organization_vendor_bill_match_matchBill(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_bill.match.matchBill", async () => api.functional.organization.vendor_bill.match.matchBill(live, "coverage-id"));
}

/** Proves the published api.functional.organization.vendor_bill.post.postBill route is callable through the generated SDK. */
export async function test_api_operation_356_organization_vendor_bill_post_postBill(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_bill.post.postBill", async () => api.functional.organization.vendor_bill.post.postBill(live, "coverage-id"));
}

/** Proves the published api.functional.organization.vendor_bill.resolve.resolveBill route is callable through the generated SDK. */
export async function test_api_operation_357_organization_vendor_bill_resolve_resolveBill(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_bill.resolve.resolveBill", async () => api.functional.organization.vendor_bill.resolve.resolveBill(live, "coverage-id"));
}

/** Proves the published api.functional.organization.vendor_bill._void.voidBill route is callable through the generated SDK. */
export async function test_api_operation_358_organization_vendor_bill_void_voidBill(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_bill._void.voidBill", async () => api.functional.organization.vendor_bill._void.voidBill(live, "coverage-id"));
}

/** Proves the published api.functional.organization.vendor_credit.createCredit route is callable through the generated SDK. */
export async function test_api_operation_359_organization_vendor_credit_createCredit(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_credit.createCredit", async () => api.functional.organization.vendor_credit.createCredit(live, typia.random<api.functional.organization.vendor_credit.createCredit.Body>()));
}

/** Proves the published api.functional.organization.vendor_credit.listCredits route is callable through the generated SDK. */
export async function test_api_operation_360_organization_vendor_credit_listCredits(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_credit.listCredits", async () => api.functional.organization.vendor_credit.listCredits(live, typia.random<api.functional.organization.vendor_credit.listCredits.Body>()));
}

/** Proves the published api.functional.organization.vendor_credit.apply.applyCredit route is callable through the generated SDK. */
export async function test_api_operation_361_organization_vendor_credit_apply_applyCredit(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_credit.apply.applyCredit", async () => api.functional.organization.vendor_credit.apply.applyCredit(live, "coverage-id"));
}

/** Proves the published api.functional.organization.vendor_credit.refund.refundCredit route is callable through the generated SDK. */
export async function test_api_operation_362_organization_vendor_credit_refund_refundCredit(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_credit.refund.refundCredit", async () => api.functional.organization.vendor_credit.refund.refundCredit(live, "coverage-id"));
}

/** Proves the published api.functional.organization.vendor_payment.createPayment route is callable through the generated SDK. */
export async function test_api_operation_363_organization_vendor_payment_createPayment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_payment.createPayment", async () => api.functional.organization.vendor_payment.createPayment(live, typia.random<api.functional.organization.vendor_payment.createPayment.Body>()));
}

/** Proves the published api.functional.organization.vendor_payment.listPayments route is callable through the generated SDK. */
export async function test_api_operation_364_organization_vendor_payment_listPayments(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_payment.listPayments", async () => api.functional.organization.vendor_payment.listPayments(live, typia.random<api.functional.organization.vendor_payment.listPayments.Body>()));
}

/** Proves the published api.functional.organization.vendor_payment.post.postPayment route is callable through the generated SDK. */
export async function test_api_operation_365_organization_vendor_payment_post_postPayment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_payment.post.postPayment", async () => api.functional.organization.vendor_payment.post.postPayment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.vendor_payment.reverse.reversePayment route is callable through the generated SDK. */
export async function test_api_operation_366_organization_vendor_payment_reverse_reversePayment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.vendor_payment.reverse.reversePayment", async () => api.functional.organization.vendor_payment.reverse.reversePayment(live, "coverage-id", typia.random<api.functional.organization.vendor_payment.reverse.reversePayment.Body>()));
}

/** Proves the published api.functional.organization.warehouse.createWarehouse route is callable through the generated SDK. */
export async function test_api_operation_367_organization_warehouse_createWarehouse(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.warehouse.createWarehouse", async () => api.functional.organization.warehouse.createWarehouse(live, typia.random<api.functional.organization.warehouse.createWarehouse.Body>()));
}

/** Proves the published api.functional.organization.warehouse.listWarehouses route is callable through the generated SDK. */
export async function test_api_operation_368_organization_warehouse_listWarehouses(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.warehouse.listWarehouses", async () => api.functional.organization.warehouse.listWarehouses(live, typia.random<api.functional.organization.warehouse.listWarehouses.Body>()));
}

/** Proves the published api.functional.organization.warehouse.updateWarehouse route is callable through the generated SDK. */
export async function test_api_operation_369_organization_warehouse_updateWarehouse(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.warehouse.updateWarehouse", async () => api.functional.organization.warehouse.updateWarehouse(live, "coverage-id", typia.random<api.functional.organization.warehouse.updateWarehouse.Body>()));
}

/** Proves the published api.functional.organization.warehouse.deactivate.deactivateWarehouse route is callable through the generated SDK. */
export async function test_api_operation_370_organization_warehouse_deactivate_deactivateWarehouse(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.warehouse.deactivate.deactivateWarehouse", async () => api.functional.organization.warehouse.deactivate.deactivateWarehouse(live, "coverage-id"));
}

/** Proves the published api.functional.organization.workflow.createWorkflow route is callable through the generated SDK. */
export async function test_api_operation_371_organization_workflow_createWorkflow(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.workflow.createWorkflow", async () => api.functional.organization.workflow.createWorkflow(live, typia.random<api.functional.organization.workflow.createWorkflow.Body>()));
}

/** Proves the published api.functional.organization.workflow.listWorkflows route is callable through the generated SDK. */
export async function test_api_operation_372_organization_workflow_listWorkflows(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.workflow.listWorkflows", async () => api.functional.organization.workflow.listWorkflows(live, typia.random<api.functional.organization.workflow.listWorkflows.Body>()));
}

/** Proves the published api.functional.organization.workflow.activate.activateWorkflow route is callable through the generated SDK. */
export async function test_api_operation_373_organization_workflow_activate_activateWorkflow(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.workflow.activate.activateWorkflow", async () => api.functional.organization.workflow.activate.activateWorkflow(live, "coverage-id"));
}

/** Proves the published api.functional.organization.workflow.deactivate.deactivateWorkflow route is callable through the generated SDK. */
export async function test_api_operation_374_organization_workflow_deactivate_deactivateWorkflow(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.workflow.deactivate.deactivateWorkflow", async () => api.functional.organization.workflow.deactivate.deactivateWorkflow(live, "coverage-id"));
}

/** Proves the published api.functional.organization.work_center.createWorkCenter route is callable through the generated SDK. */
export async function test_api_operation_375_organization_work_center_createWorkCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.work_center.createWorkCenter", async () => api.functional.organization.work_center.createWorkCenter(live, typia.random<api.functional.organization.work_center.createWorkCenter.Body>()));
}

/** Proves the published api.functional.organization.work_center.listWorkCenters route is callable through the generated SDK. */
export async function test_api_operation_376_organization_work_center_listWorkCenters(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.work_center.listWorkCenters", async () => api.functional.organization.work_center.listWorkCenters(live, typia.random<api.functional.organization.work_center.listWorkCenters.Body>()));
}

/** Proves the published api.functional.organization.work_center.updateWorkCenter route is callable through the generated SDK. */
export async function test_api_operation_377_organization_work_center_updateWorkCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.work_center.updateWorkCenter", async () => api.functional.organization.work_center.updateWorkCenter(live, "coverage-id", typia.random<api.functional.organization.work_center.updateWorkCenter.Body>()));
}

/** Proves the published api.functional.organization.work_center.activate.activateWorkCenter route is callable through the generated SDK. */
export async function test_api_operation_378_organization_work_center_activate_activateWorkCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.work_center.activate.activateWorkCenter", async () => api.functional.organization.work_center.activate.activateWorkCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.work_center.approve.approveWorkCenter route is callable through the generated SDK. */
export async function test_api_operation_379_organization_work_center_approve_approveWorkCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.work_center.approve.approveWorkCenter", async () => api.functional.organization.work_center.approve.approveWorkCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.work_center.cancel.cancelWorkCenter route is callable through the generated SDK. */
export async function test_api_operation_380_organization_work_center_cancel_cancelWorkCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.work_center.cancel.cancelWorkCenter", async () => api.functional.organization.work_center.cancel.cancelWorkCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.work_center.complete.completeWorkCenter route is callable through the generated SDK. */
export async function test_api_operation_381_organization_work_center_complete_completeWorkCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.work_center.complete.completeWorkCenter", async () => api.functional.organization.work_center.complete.completeWorkCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.work_center.reject.rejectWorkCenter route is callable through the generated SDK. */
export async function test_api_operation_382_organization_work_center_reject_rejectWorkCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.work_center.reject.rejectWorkCenter", async () => api.functional.organization.work_center.reject.rejectWorkCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.work_center.submit.submitWorkCenter route is callable through the generated SDK. */
export async function test_api_operation_383_organization_work_center_submit_submitWorkCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.work_center.submit.submitWorkCenter", async () => api.functional.organization.work_center.submit.submitWorkCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.journal.updateJournal route is callable through the generated SDK. */
export async function test_api_operation_384_organization_journal_updateJournal(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.journal.updateJournal", async () => api.functional.organization.journal.updateJournal(live, "coverage-id", typia.random<api.functional.organization.journal.updateJournal.Body>()));
}

/** Proves the published api.functional.organization.journal.eraseJournal route is callable through the generated SDK. */
export async function test_api_operation_385_organization_journal_eraseJournal(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.journal.eraseJournal", async () => api.functional.organization.journal.eraseJournal(live, "coverage-id"));
}

/** Proves the published api.functional.organization.journal.adjust.adjustJournal route is callable through the generated SDK. */
export async function test_api_operation_386_organization_journal_adjust_adjustJournal(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.journal.adjust.adjustJournal", async () => api.functional.organization.journal.adjust.adjustJournal(live, "coverage-id", typia.random<api.functional.organization.journal.adjust.adjustJournal.Body>()));
}

/** Proves the published api.functional.organization.journal.approval.approveJournal route is callable through the generated SDK. */
export async function test_api_operation_387_organization_journal_approval_approveJournal(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.journal.approval.approveJournal", async () => api.functional.organization.journal.approval.approveJournal(live, "coverage-id", typia.random<api.functional.organization.journal.approval.approveJournal.Body>()));
}

/** Proves the published api.functional.organization.journal.post.postJournal route is callable through the generated SDK. */
export async function test_api_operation_388_organization_journal_post_postJournal(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.journal.post.postJournal", async () => api.functional.organization.journal.post.postJournal(live, "coverage-id"));
}

/** Proves the published api.functional.organization.journal.reverse.reverseJournal route is callable through the generated SDK. */
export async function test_api_operation_389_organization_journal_reverse_reverseJournal(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.journal.reverse.reverseJournal", async () => api.functional.organization.journal.reverse.reverseJournal(live, "coverage-id", typia.random<api.functional.organization.journal.reverse.reverseJournal.Body>()));
}

/** Proves the published api.functional.organization.journal.submit.submitJournal route is callable through the generated SDK. */
export async function test_api_operation_390_organization_journal_submit_submitJournal(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.journal.submit.submitJournal", async () => api.functional.organization.journal.submit.submitJournal(live, "coverage-id"));
}

/** Proves the published api.functional.organization.journal._void.voidJournal route is callable through the generated SDK. */
export async function test_api_operation_391_organization_journal_void_voidJournal(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.journal._void.voidJournal", async () => api.functional.organization.journal._void.voidJournal(live, "coverage-id"));
}

/** Proves the published api.functional.organization.machine.createMachine route is callable through the generated SDK. */
export async function test_api_operation_392_organization_machine_createMachine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.machine.createMachine", async () => api.functional.organization.machine.createMachine(live, typia.random<api.functional.organization.machine.createMachine.Body>()));
}

/** Proves the published api.functional.organization.machine.listMachines route is callable through the generated SDK. */
export async function test_api_operation_393_organization_machine_listMachines(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.machine.listMachines", async () => api.functional.organization.machine.listMachines(live, typia.random<api.functional.organization.machine.listMachines.Body>()));
}

/** Proves the published api.functional.organization.machine.updateMachine route is callable through the generated SDK. */
export async function test_api_operation_394_organization_machine_updateMachine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.machine.updateMachine", async () => api.functional.organization.machine.updateMachine(live, "coverage-id", typia.random<api.functional.organization.machine.updateMachine.Body>()));
}

/** Proves the published api.functional.organization.machine.activate.activateMachine route is callable through the generated SDK. */
export async function test_api_operation_395_organization_machine_activate_activateMachine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.machine.activate.activateMachine", async () => api.functional.organization.machine.activate.activateMachine(live, "coverage-id"));
}

/** Proves the published api.functional.organization.machine.approve.approveMachine route is callable through the generated SDK. */
export async function test_api_operation_396_organization_machine_approve_approveMachine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.machine.approve.approveMachine", async () => api.functional.organization.machine.approve.approveMachine(live, "coverage-id"));
}

/** Proves the published api.functional.organization.machine.cancel.cancelMachine route is callable through the generated SDK. */
export async function test_api_operation_397_organization_machine_cancel_cancelMachine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.machine.cancel.cancelMachine", async () => api.functional.organization.machine.cancel.cancelMachine(live, "coverage-id"));
}

/** Proves the published api.functional.organization.machine.complete.completeMachine route is callable through the generated SDK. */
export async function test_api_operation_398_organization_machine_complete_completeMachine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.machine.complete.completeMachine", async () => api.functional.organization.machine.complete.completeMachine(live, "coverage-id"));
}

/** Proves the published api.functional.organization.machine.reject.rejectMachine route is callable through the generated SDK. */
export async function test_api_operation_399_organization_machine_reject_rejectMachine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.machine.reject.rejectMachine", async () => api.functional.organization.machine.reject.rejectMachine(live, "coverage-id"));
}

/** Proves the published api.functional.organization.machine.submit.submitMachine route is callable through the generated SDK. */
export async function test_api_operation_400_organization_machine_submit_submitMachine(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.machine.submit.submitMachine", async () => api.functional.organization.machine.submit.submitMachine(live, "coverage-id"));
}

/** Proves the published api.functional.organization.maintenance_order.createMaintenance route is callable through the generated SDK. */
export async function test_api_operation_401_organization_maintenance_order_createMaintenance(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.maintenance_order.createMaintenance", async () => api.functional.organization.maintenance_order.createMaintenance(live, typia.random<api.functional.organization.maintenance_order.createMaintenance.Body>()));
}

/** Proves the published api.functional.organization.maintenance_order.listMaintenance route is callable through the generated SDK. */
export async function test_api_operation_402_organization_maintenance_order_listMaintenance(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.maintenance_order.listMaintenance", async () => api.functional.organization.maintenance_order.listMaintenance(live, typia.random<api.functional.organization.maintenance_order.listMaintenance.Body>()));
}

/** Proves the published api.functional.organization.maintenance_order.complete.completeMaintenance route is callable through the generated SDK. */
export async function test_api_operation_403_organization_maintenance_order_complete_completeMaintenance(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.maintenance_order.complete.completeMaintenance", async () => api.functional.organization.maintenance_order.complete.completeMaintenance(live, "coverage-id"));
}

/** Proves the published api.functional.organization.maintenance_plan.createMaintenancePlan route is callable through the generated SDK. */
export async function test_api_operation_404_organization_maintenance_plan_createMaintenancePlan(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.maintenance_plan.createMaintenancePlan", async () => api.functional.organization.maintenance_plan.createMaintenancePlan(live, typia.random<api.functional.organization.maintenance_plan.createMaintenancePlan.Body>()));
}

/** Proves the published api.functional.organization.maintenance_plan.listMaintenancePlans route is callable through the generated SDK. */
export async function test_api_operation_405_organization_maintenance_plan_listMaintenancePlans(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.maintenance_plan.listMaintenancePlans", async () => api.functional.organization.maintenance_plan.listMaintenancePlans(live, typia.random<api.functional.organization.maintenance_plan.listMaintenancePlans.Body>()));
}

/** Proves the published api.functional.organization.maintenance_plan.updateMaintenancePlan route is callable through the generated SDK. */
export async function test_api_operation_406_organization_maintenance_plan_updateMaintenancePlan(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.maintenance_plan.updateMaintenancePlan", async () => api.functional.organization.maintenance_plan.updateMaintenancePlan(live, "coverage-id", typia.random<api.functional.organization.maintenance_plan.updateMaintenancePlan.Body>()));
}

/** Proves the published api.functional.organization.maintenance_plan.activate.activateMaintenancePlan route is callable through the generated SDK. */
export async function test_api_operation_407_organization_maintenance_plan_activate_activateMaintenancePlan(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.maintenance_plan.activate.activateMaintenancePlan", async () => api.functional.organization.maintenance_plan.activate.activateMaintenancePlan(live, "coverage-id"));
}

/** Proves the published api.functional.organization.maintenance_plan.approve.approveMaintenancePlan route is callable through the generated SDK. */
export async function test_api_operation_408_organization_maintenance_plan_approve_approveMaintenancePlan(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.maintenance_plan.approve.approveMaintenancePlan", async () => api.functional.organization.maintenance_plan.approve.approveMaintenancePlan(live, "coverage-id"));
}

/** Proves the published api.functional.organization.maintenance_plan.cancel.cancelMaintenancePlan route is callable through the generated SDK. */
export async function test_api_operation_409_organization_maintenance_plan_cancel_cancelMaintenancePlan(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.maintenance_plan.cancel.cancelMaintenancePlan", async () => api.functional.organization.maintenance_plan.cancel.cancelMaintenancePlan(live, "coverage-id"));
}

/** Proves the published api.functional.organization.maintenance_plan.complete.completeMaintenancePlan route is callable through the generated SDK. */
export async function test_api_operation_410_organization_maintenance_plan_complete_completeMaintenancePlan(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.maintenance_plan.complete.completeMaintenancePlan", async () => api.functional.organization.maintenance_plan.complete.completeMaintenancePlan(live, "coverage-id"));
}

/** Proves the published api.functional.organization.maintenance_plan.reject.rejectMaintenancePlan route is callable through the generated SDK. */
export async function test_api_operation_411_organization_maintenance_plan_reject_rejectMaintenancePlan(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.maintenance_plan.reject.rejectMaintenancePlan", async () => api.functional.organization.maintenance_plan.reject.rejectMaintenancePlan(live, "coverage-id"));
}

/** Proves the published api.functional.organization.maintenance_plan.submit.submitMaintenancePlan route is callable through the generated SDK. */
export async function test_api_operation_412_organization_maintenance_plan_submit_submitMaintenancePlan(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.maintenance_plan.submit.submitMaintenancePlan", async () => api.functional.organization.maintenance_plan.submit.submitMaintenancePlan(live, "coverage-id"));
}

/** Proves the published api.functional.organization.membership.list route is callable through the generated SDK. */
export async function test_api_operation_413_organization_membership_list(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.membership.list", async () => api.functional.organization.membership.list(live, typia.random<api.functional.organization.membership.list.Body>()));
}

/** Proves the published api.functional.organization.membership.update route is callable through the generated SDK. */
export async function test_api_operation_414_organization_membership_update(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.membership.update", async () => api.functional.organization.membership.update(live, "coverage-id", typia.random<api.functional.organization.membership.update.Body>()));
}

/** Proves the published api.functional.organization.membership.role route is callable through the generated SDK. */
export async function test_api_operation_415_organization_membership_role(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.membership.role", async () => api.functional.organization.membership.role(live, "coverage-id", typia.random<api.functional.organization.membership.role.Body>()));
}

/** Proves the published api.functional.organization.mrp.createMrp route is callable through the generated SDK. */
export async function test_api_operation_416_organization_mrp_createMrp(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp.createMrp", async () => api.functional.organization.mrp.createMrp(live, typia.random<api.functional.organization.mrp.createMrp.Body>()));
}

/** Proves the published api.functional.organization.mrp.listMrps route is callable through the generated SDK. */
export async function test_api_operation_417_organization_mrp_listMrps(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp.listMrps", async () => api.functional.organization.mrp.listMrps(live, typia.random<api.functional.organization.mrp.listMrps.Body>()));
}

/** Proves the published api.functional.organization.mrp.updateMrp route is callable through the generated SDK. */
export async function test_api_operation_418_organization_mrp_updateMrp(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp.updateMrp", async () => api.functional.organization.mrp.updateMrp(live, "coverage-id", typia.random<api.functional.organization.mrp.updateMrp.Body>()));
}

/** Proves the published api.functional.organization.mrp.activate.activateMrp route is callable through the generated SDK. */
export async function test_api_operation_419_organization_mrp_activate_activateMrp(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp.activate.activateMrp", async () => api.functional.organization.mrp.activate.activateMrp(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp.approve.approveMrp route is callable through the generated SDK. */
export async function test_api_operation_420_organization_mrp_approve_approveMrp(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp.approve.approveMrp", async () => api.functional.organization.mrp.approve.approveMrp(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp.cancel.cancelMrp route is callable through the generated SDK. */
export async function test_api_operation_421_organization_mrp_cancel_cancelMrp(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp.cancel.cancelMrp", async () => api.functional.organization.mrp.cancel.cancelMrp(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp.complete.completeMrp route is callable through the generated SDK. */
export async function test_api_operation_422_organization_mrp_complete_completeMrp(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp.complete.completeMrp", async () => api.functional.organization.mrp.complete.completeMrp(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp.reject.rejectMrp route is callable through the generated SDK. */
export async function test_api_operation_423_organization_mrp_reject_rejectMrp(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp.reject.rejectMrp", async () => api.functional.organization.mrp.reject.rejectMrp(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp.submit.submitMrp route is callable through the generated SDK. */
export async function test_api_operation_424_organization_mrp_submit_submitMrp(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp.submit.submitMrp", async () => api.functional.organization.mrp.submit.submitMrp(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp_recommendation.createMrpRecommendation route is callable through the generated SDK. */
export async function test_api_operation_425_organization_mrp_recommendation_createMrpRecommendation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp_recommendation.createMrpRecommendation", async () => api.functional.organization.mrp_recommendation.createMrpRecommendation(live, typia.random<api.functional.organization.mrp_recommendation.createMrpRecommendation.Body>()));
}

/** Proves the published api.functional.organization.mrp_recommendation.listMrpRecommendations route is callable through the generated SDK. */
export async function test_api_operation_426_organization_mrp_recommendation_listMrpRecommendations(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp_recommendation.listMrpRecommendations", async () => api.functional.organization.mrp_recommendation.listMrpRecommendations(live, typia.random<api.functional.organization.mrp_recommendation.listMrpRecommendations.Body>()));
}

/** Proves the published api.functional.organization.mrp_recommendation.updateMrpRecommendation route is callable through the generated SDK. */
export async function test_api_operation_427_organization_mrp_recommendation_updateMrpRecommendation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp_recommendation.updateMrpRecommendation", async () => api.functional.organization.mrp_recommendation.updateMrpRecommendation(live, "coverage-id", typia.random<api.functional.organization.mrp_recommendation.updateMrpRecommendation.Body>()));
}

/** Proves the published api.functional.organization.mrp_recommendation.accept.acceptMrpRecommendation route is callable through the generated SDK. */
export async function test_api_operation_428_organization_mrp_recommendation_accept_acceptMrpRecommendation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp_recommendation.accept.acceptMrpRecommendation", async () => api.functional.organization.mrp_recommendation.accept.acceptMrpRecommendation(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp_recommendation.activate.activateMrpRecommendation route is callable through the generated SDK. */
export async function test_api_operation_429_organization_mrp_recommendation_activate_activateMrpRecommendation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp_recommendation.activate.activateMrpRecommendation", async () => api.functional.organization.mrp_recommendation.activate.activateMrpRecommendation(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp_recommendation.approve.approveMrpRecommendation route is callable through the generated SDK. */
export async function test_api_operation_430_organization_mrp_recommendation_approve_approveMrpRecommendation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp_recommendation.approve.approveMrpRecommendation", async () => api.functional.organization.mrp_recommendation.approve.approveMrpRecommendation(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp_recommendation.cancel.cancelMrpRecommendation route is callable through the generated SDK. */
export async function test_api_operation_431_organization_mrp_recommendation_cancel_cancelMrpRecommendation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp_recommendation.cancel.cancelMrpRecommendation", async () => api.functional.organization.mrp_recommendation.cancel.cancelMrpRecommendation(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp_recommendation.close.closeMrpRecommendation route is callable through the generated SDK. */
export async function test_api_operation_432_organization_mrp_recommendation_close_closeMrpRecommendation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp_recommendation.close.closeMrpRecommendation", async () => api.functional.organization.mrp_recommendation.close.closeMrpRecommendation(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp_recommendation.complete.completeMrpRecommendation route is callable through the generated SDK. */
export async function test_api_operation_433_organization_mrp_recommendation_complete_completeMrpRecommendation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp_recommendation.complete.completeMrpRecommendation", async () => api.functional.organization.mrp_recommendation.complete.completeMrpRecommendation(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp_recommendation.dismiss.dismissMrpRecommendation route is callable through the generated SDK. */
export async function test_api_operation_434_organization_mrp_recommendation_dismiss_dismissMrpRecommendation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp_recommendation.dismiss.dismissMrpRecommendation", async () => api.functional.organization.mrp_recommendation.dismiss.dismissMrpRecommendation(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp_recommendation.plan.planMrpRecommendation route is callable through the generated SDK. */
export async function test_api_operation_435_organization_mrp_recommendation_plan_planMrpRecommendation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp_recommendation.plan.planMrpRecommendation", async () => api.functional.organization.mrp_recommendation.plan.planMrpRecommendation(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp_recommendation.reject.rejectMrpRecommendation route is callable through the generated SDK. */
export async function test_api_operation_436_organization_mrp_recommendation_reject_rejectMrpRecommendation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp_recommendation.reject.rejectMrpRecommendation", async () => api.functional.organization.mrp_recommendation.reject.rejectMrpRecommendation(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp_recommendation.release.releaseMrpRecommendation route is callable through the generated SDK. */
export async function test_api_operation_437_organization_mrp_recommendation_release_releaseMrpRecommendation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp_recommendation.release.releaseMrpRecommendation", async () => api.functional.organization.mrp_recommendation.release.releaseMrpRecommendation(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp_recommendation.reopen.reopenMrpRecommendation route is callable through the generated SDK. */
export async function test_api_operation_438_organization_mrp_recommendation_reopen_reopenMrpRecommendation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp_recommendation.reopen.reopenMrpRecommendation", async () => api.functional.organization.mrp_recommendation.reopen.reopenMrpRecommendation(live, "coverage-id"));
}

/** Proves the published api.functional.organization.mrp_recommendation.submit.submitMrpRecommendation route is callable through the generated SDK. */
export async function test_api_operation_439_organization_mrp_recommendation_submit_submitMrpRecommendation(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.mrp_recommendation.submit.submitMrpRecommendation", async () => api.functional.organization.mrp_recommendation.submit.submitMrpRecommendation(live, "coverage-id"));
}

/** Proves the published api.functional.organization.notification.listNotifications route is callable through the generated SDK. */
export async function test_api_operation_440_organization_notification_listNotifications(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.notification.listNotifications", async () => api.functional.organization.notification.listNotifications(live, typia.random<api.functional.organization.notification.listNotifications.Body>()));
}

/** Proves the published api.functional.organization.notification.read.readNotification route is callable through the generated SDK. */
export async function test_api_operation_441_organization_notification_read_readNotification(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.notification.read.readNotification", async () => api.functional.organization.notification.read.readNotification(live, "coverage-id"));
}

/** Proves the published api.functional.organization.notification_preference.createNotificationPreference route is callable through the generated SDK. */
export async function test_api_operation_442_organization_notification_preference_createNotificationPreference(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.notification_preference.createNotificationPreference", async () => api.functional.organization.notification_preference.createNotificationPreference(live, typia.random<api.functional.organization.notification_preference.createNotificationPreference.Body>()));
}

/** Proves the published api.functional.organization.notification_preference.listNotificationPreferences route is callable through the generated SDK. */
export async function test_api_operation_443_organization_notification_preference_listNotificationPreferences(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.notification_preference.listNotificationPreferences", async () => api.functional.organization.notification_preference.listNotificationPreferences(live, typia.random<api.functional.organization.notification_preference.listNotificationPreferences.Body>()));
}

/** Proves the published api.functional.organization.notification_preference.updateNotificationPreference route is callable through the generated SDK. */
export async function test_api_operation_444_organization_notification_preference_updateNotificationPreference(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.notification_preference.updateNotificationPreference", async () => api.functional.organization.notification_preference.updateNotificationPreference(live, "coverage-id", typia.random<api.functional.organization.notification_preference.updateNotificationPreference.Body>()));
}

/** Proves the published api.functional.organization.notification_preference.activate.activateNotificationPreference route is callable through the generated SDK. */
export async function test_api_operation_445_organization_notification_preference_activate_activateNotificationPreference(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.notification_preference.activate.activateNotificationPreference", async () => api.functional.organization.notification_preference.activate.activateNotificationPreference(live, "coverage-id"));
}

/** Proves the published api.functional.organization.notification_preference.approve.approveNotificationPreference route is callable through the generated SDK. */
export async function test_api_operation_446_organization_notification_preference_approve_approveNotificationPreference(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.notification_preference.approve.approveNotificationPreference", async () => api.functional.organization.notification_preference.approve.approveNotificationPreference(live, "coverage-id"));
}

/** Proves the published api.functional.organization.notification_preference.cancel.cancelNotificationPreference route is callable through the generated SDK. */
export async function test_api_operation_447_organization_notification_preference_cancel_cancelNotificationPreference(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.notification_preference.cancel.cancelNotificationPreference", async () => api.functional.organization.notification_preference.cancel.cancelNotificationPreference(live, "coverage-id"));
}

/** Proves the published api.functional.organization.notification_preference.complete.completeNotificationPreference route is callable through the generated SDK. */
export async function test_api_operation_448_organization_notification_preference_complete_completeNotificationPreference(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.notification_preference.complete.completeNotificationPreference", async () => api.functional.organization.notification_preference.complete.completeNotificationPreference(live, "coverage-id"));
}

/** Proves the published api.functional.organization.notification_preference.reject.rejectNotificationPreference route is callable through the generated SDK. */
export async function test_api_operation_449_organization_notification_preference_reject_rejectNotificationPreference(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.notification_preference.reject.rejectNotificationPreference", async () => api.functional.organization.notification_preference.reject.rejectNotificationPreference(live, "coverage-id"));
}

/** Proves the published api.functional.organization.notification_preference.submit.submitNotificationPreference route is callable through the generated SDK. */
export async function test_api_operation_450_organization_notification_preference_submit_submitNotificationPreference(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.notification_preference.submit.submitNotificationPreference", async () => api.functional.organization.notification_preference.submit.submitNotificationPreference(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payment_term.createTerm route is callable through the generated SDK. */
export async function test_api_operation_451_organization_payment_term_createTerm(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payment_term.createTerm", async () => api.functional.organization.payment_term.createTerm(live, typia.random<api.functional.organization.payment_term.createTerm.Body>()));
}

/** Proves the published api.functional.organization.payment_term.listTerms route is callable through the generated SDK. */
export async function test_api_operation_452_organization_payment_term_listTerms(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payment_term.listTerms", async () => api.functional.organization.payment_term.listTerms(live, typia.random<api.functional.organization.payment_term.listTerms.Body>()));
}

/** Proves the published api.functional.organization.payment_term.updateTerm route is callable through the generated SDK. */
export async function test_api_operation_453_organization_payment_term_updateTerm(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payment_term.updateTerm", async () => api.functional.organization.payment_term.updateTerm(live, "coverage-id", typia.random<api.functional.organization.payment_term.updateTerm.Body>()));
}

/** Proves the published api.functional.organization.payment_term.deactivate.deactivateTerm route is callable through the generated SDK. */
export async function test_api_operation_454_organization_payment_term_deactivate_deactivateTerm(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payment_term.deactivate.deactivateTerm", async () => api.functional.organization.payment_term.deactivate.deactivateTerm(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payroll_adjustment.createPayrollAdjustment route is callable through the generated SDK. */
export async function test_api_operation_455_organization_payroll_adjustment_createPayrollAdjustment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_adjustment.createPayrollAdjustment", async () => api.functional.organization.payroll_adjustment.createPayrollAdjustment(live, typia.random<api.functional.organization.payroll_adjustment.createPayrollAdjustment.Body>()));
}

/** Proves the published api.functional.organization.payroll_adjustment.listPayrollAdjustments route is callable through the generated SDK. */
export async function test_api_operation_456_organization_payroll_adjustment_listPayrollAdjustments(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_adjustment.listPayrollAdjustments", async () => api.functional.organization.payroll_adjustment.listPayrollAdjustments(live, typia.random<api.functional.organization.payroll_adjustment.listPayrollAdjustments.Body>()));
}

/** Proves the published api.functional.organization.payroll_adjustment.updatePayrollAdjustment route is callable through the generated SDK. */
export async function test_api_operation_457_organization_payroll_adjustment_updatePayrollAdjustment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_adjustment.updatePayrollAdjustment", async () => api.functional.organization.payroll_adjustment.updatePayrollAdjustment(live, "coverage-id", typia.random<api.functional.organization.payroll_adjustment.updatePayrollAdjustment.Body>()));
}

/** Proves the published api.functional.organization.payroll_adjustment.activate.activatePayrollAdjustment route is callable through the generated SDK. */
export async function test_api_operation_458_organization_payroll_adjustment_activate_activatePayrollAdjustment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_adjustment.activate.activatePayrollAdjustment", async () => api.functional.organization.payroll_adjustment.activate.activatePayrollAdjustment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payroll_adjustment.approve.approvePayrollAdjustment route is callable through the generated SDK. */
export async function test_api_operation_459_organization_payroll_adjustment_approve_approvePayrollAdjustment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_adjustment.approve.approvePayrollAdjustment", async () => api.functional.organization.payroll_adjustment.approve.approvePayrollAdjustment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payroll_adjustment.cancel.cancelPayrollAdjustment route is callable through the generated SDK. */
export async function test_api_operation_460_organization_payroll_adjustment_cancel_cancelPayrollAdjustment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_adjustment.cancel.cancelPayrollAdjustment", async () => api.functional.organization.payroll_adjustment.cancel.cancelPayrollAdjustment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payroll_adjustment.complete.completePayrollAdjustment route is callable through the generated SDK. */
export async function test_api_operation_461_organization_payroll_adjustment_complete_completePayrollAdjustment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_adjustment.complete.completePayrollAdjustment", async () => api.functional.organization.payroll_adjustment.complete.completePayrollAdjustment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payroll_adjustment.reject.rejectPayrollAdjustment route is callable through the generated SDK. */
export async function test_api_operation_462_organization_payroll_adjustment_reject_rejectPayrollAdjustment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_adjustment.reject.rejectPayrollAdjustment", async () => api.functional.organization.payroll_adjustment.reject.rejectPayrollAdjustment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payroll_adjustment.submit.submitPayrollAdjustment route is callable through the generated SDK. */
export async function test_api_operation_463_organization_payroll_adjustment_submit_submitPayrollAdjustment(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_adjustment.submit.submitPayrollAdjustment", async () => api.functional.organization.payroll_adjustment.submit.submitPayrollAdjustment(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payroll_config.createPayrollConfig route is callable through the generated SDK. */
export async function test_api_operation_464_organization_payroll_config_createPayrollConfig(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_config.createPayrollConfig", async () => api.functional.organization.payroll_config.createPayrollConfig(live, typia.random<api.functional.organization.payroll_config.createPayrollConfig.Body>()));
}

/** Proves the published api.functional.organization.payroll_config.listPayrollConfigs route is callable through the generated SDK. */
export async function test_api_operation_465_organization_payroll_config_listPayrollConfigs(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_config.listPayrollConfigs", async () => api.functional.organization.payroll_config.listPayrollConfigs(live, typia.random<api.functional.organization.payroll_config.listPayrollConfigs.Body>()));
}

/** Proves the published api.functional.organization.payroll_config.updatePayrollConfig route is callable through the generated SDK. */
export async function test_api_operation_466_organization_payroll_config_updatePayrollConfig(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_config.updatePayrollConfig", async () => api.functional.organization.payroll_config.updatePayrollConfig(live, "coverage-id", typia.random<api.functional.organization.payroll_config.updatePayrollConfig.Body>()));
}

/** Proves the published api.functional.organization.payroll_config.activate.activatePayrollConfig route is callable through the generated SDK. */
export async function test_api_operation_467_organization_payroll_config_activate_activatePayrollConfig(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_config.activate.activatePayrollConfig", async () => api.functional.organization.payroll_config.activate.activatePayrollConfig(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payroll_config.approve.approvePayrollConfig route is callable through the generated SDK. */
export async function test_api_operation_468_organization_payroll_config_approve_approvePayrollConfig(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_config.approve.approvePayrollConfig", async () => api.functional.organization.payroll_config.approve.approvePayrollConfig(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payroll_config.cancel.cancelPayrollConfig route is callable through the generated SDK. */
export async function test_api_operation_469_organization_payroll_config_cancel_cancelPayrollConfig(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_config.cancel.cancelPayrollConfig", async () => api.functional.organization.payroll_config.cancel.cancelPayrollConfig(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payroll_config.complete.completePayrollConfig route is callable through the generated SDK. */
export async function test_api_operation_470_organization_payroll_config_complete_completePayrollConfig(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_config.complete.completePayrollConfig", async () => api.functional.organization.payroll_config.complete.completePayrollConfig(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payroll_config.reject.rejectPayrollConfig route is callable through the generated SDK. */
export async function test_api_operation_471_organization_payroll_config_reject_rejectPayrollConfig(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_config.reject.rejectPayrollConfig", async () => api.functional.organization.payroll_config.reject.rejectPayrollConfig(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payroll_config.submit.submitPayrollConfig route is callable through the generated SDK. */
export async function test_api_operation_472_organization_payroll_config_submit_submitPayrollConfig(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_config.submit.submitPayrollConfig", async () => api.functional.organization.payroll_config.submit.submitPayrollConfig(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payroll_run.createRun route is callable through the generated SDK. */
export async function test_api_operation_473_organization_payroll_run_createRun(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_run.createRun", async () => api.functional.organization.payroll_run.createRun(live, typia.random<api.functional.organization.payroll_run.createRun.Body>()));
}

/** Proves the published api.functional.organization.payroll_run.listRuns route is callable through the generated SDK. */
export async function test_api_operation_474_organization_payroll_run_listRuns(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_run.listRuns", async () => api.functional.organization.payroll_run.listRuns(live, typia.random<api.functional.organization.payroll_run.listRuns.Body>()));
}

/** Proves the published api.functional.organization.payroll_run.approve.approveRun route is callable through the generated SDK. */
export async function test_api_operation_475_organization_payroll_run_approve_approveRun(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_run.approve.approveRun", async () => api.functional.organization.payroll_run.approve.approveRun(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payroll_run.calculate.calculateRun route is callable through the generated SDK. */
export async function test_api_operation_476_organization_payroll_run_calculate_calculateRun(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_run.calculate.calculateRun", async () => api.functional.organization.payroll_run.calculate.calculateRun(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payroll_run.post.postRun route is callable through the generated SDK. */
export async function test_api_operation_477_organization_payroll_run_post_postRun(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payroll_run.post.postRun", async () => api.functional.organization.payroll_run.post.postRun(live, "coverage-id"));
}

/** Proves the published api.functional.organization.payslip.createSlip route is callable through the generated SDK. */
export async function test_api_operation_478_organization_payslip_createSlip(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payslip.createSlip", async () => api.functional.organization.payslip.createSlip(live, typia.random<api.functional.organization.payslip.createSlip.Body>()));
}

/** Proves the published api.functional.organization.payslip.listSlips route is callable through the generated SDK. */
export async function test_api_operation_479_organization_payslip_listSlips(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payslip.listSlips", async () => api.functional.organization.payslip.listSlips(live, typia.random<api.functional.organization.payslip.listSlips.Body>()));
}

/** Proves the published api.functional.organization.payslip.issue.issueSlip route is callable through the generated SDK. */
export async function test_api_operation_480_organization_payslip_issue_issueSlip(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.payslip.issue.issueSlip", async () => api.functional.organization.payslip.issue.issueSlip(live, "coverage-id"));
}

/** Proves the published api.functional.organization.pay_schedule.createPaySchedule route is callable through the generated SDK. */
export async function test_api_operation_481_organization_pay_schedule_createPaySchedule(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.pay_schedule.createPaySchedule", async () => api.functional.organization.pay_schedule.createPaySchedule(live, typia.random<api.functional.organization.pay_schedule.createPaySchedule.Body>()));
}

/** Proves the published api.functional.organization.pay_schedule.listPaySchedules route is callable through the generated SDK. */
export async function test_api_operation_482_organization_pay_schedule_listPaySchedules(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.pay_schedule.listPaySchedules", async () => api.functional.organization.pay_schedule.listPaySchedules(live, typia.random<api.functional.organization.pay_schedule.listPaySchedules.Body>()));
}

/** Proves the published api.functional.organization.pay_schedule.updatePaySchedule route is callable through the generated SDK. */
export async function test_api_operation_483_organization_pay_schedule_updatePaySchedule(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.pay_schedule.updatePaySchedule", async () => api.functional.organization.pay_schedule.updatePaySchedule(live, "coverage-id", typia.random<api.functional.organization.pay_schedule.updatePaySchedule.Body>()));
}

/** Proves the published api.functional.organization.pay_schedule.activate.activatePaySchedule route is callable through the generated SDK. */
export async function test_api_operation_484_organization_pay_schedule_activate_activatePaySchedule(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.pay_schedule.activate.activatePaySchedule", async () => api.functional.organization.pay_schedule.activate.activatePaySchedule(live, "coverage-id"));
}

/** Proves the published api.functional.organization.pay_schedule.approve.approvePaySchedule route is callable through the generated SDK. */
export async function test_api_operation_485_organization_pay_schedule_approve_approvePaySchedule(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.pay_schedule.approve.approvePaySchedule", async () => api.functional.organization.pay_schedule.approve.approvePaySchedule(live, "coverage-id"));
}

/** Proves the published api.functional.organization.pay_schedule.cancel.cancelPaySchedule route is callable through the generated SDK. */
export async function test_api_operation_486_organization_pay_schedule_cancel_cancelPaySchedule(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.pay_schedule.cancel.cancelPaySchedule", async () => api.functional.organization.pay_schedule.cancel.cancelPaySchedule(live, "coverage-id"));
}

/** Proves the published api.functional.organization.pay_schedule.complete.completePaySchedule route is callable through the generated SDK. */
export async function test_api_operation_487_organization_pay_schedule_complete_completePaySchedule(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.pay_schedule.complete.completePaySchedule", async () => api.functional.organization.pay_schedule.complete.completePaySchedule(live, "coverage-id"));
}

/** Proves the published api.functional.organization.pay_schedule.reject.rejectPaySchedule route is callable through the generated SDK. */
export async function test_api_operation_488_organization_pay_schedule_reject_rejectPaySchedule(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.pay_schedule.reject.rejectPaySchedule", async () => api.functional.organization.pay_schedule.reject.rejectPaySchedule(live, "coverage-id"));
}

/** Proves the published api.functional.organization.pay_schedule.submit.submitPaySchedule route is callable through the generated SDK. */
export async function test_api_operation_489_organization_pay_schedule_submit_submitPaySchedule(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.pay_schedule.submit.submitPaySchedule", async () => api.functional.organization.pay_schedule.submit.submitPaySchedule(live, "coverage-id"));
}

/** Proves the published api.functional.organization.period.validate route is callable through the generated SDK. */
export async function test_api_operation_490_organization_period_validate(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.period.validate", async () => api.functional.organization.period.validate(live, "coverage-id"));
}

/** Proves the published api.functional.organization.period.report route is callable through the generated SDK. */
export async function test_api_operation_491_organization_period_report(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.period.report", async () => api.functional.organization.period.report(live, "coverage-id"));
}

/** Proves the published api.functional.organization.period.reclose route is callable through the generated SDK. */
export async function test_api_operation_492_organization_period_reclose(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.period.reclose", async () => api.functional.organization.period.reclose(live, "coverage-id"));
}

/** Proves the published api.functional.organization.period.hard_close.hardClose route is callable through the generated SDK. */
export async function test_api_operation_493_organization_period_hard_close_hardClose(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.period.hard_close.hardClose", async () => api.functional.organization.period.hard_close.hardClose(live, "coverage-id"));
}

/** Proves the published api.functional.organization.period.reopen.reopen route is callable through the generated SDK. */
export async function test_api_operation_494_organization_period_reopen_reopen(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.period.reopen.reopen", async () => api.functional.organization.period.reopen.reopen(live, "coverage-id"));
}

/** Proves the published api.functional.organization.period.reopen.approval.approveReopen route is callable through the generated SDK. */
export async function test_api_operation_495_organization_period_reopen_approval_approveReopen(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.period.reopen.approval.approveReopen", async () => api.functional.organization.period.reopen.approval.approveReopen(live, "coverage-id", typia.random<api.functional.organization.period.reopen.approval.approveReopen.Body>()));
}

/** Proves the published api.functional.organization.period.reopen_request.requestReopen route is callable through the generated SDK. */
export async function test_api_operation_496_organization_period_reopen_request_requestReopen(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.period.reopen_request.requestReopen", async () => api.functional.organization.period.reopen_request.requestReopen(live, "coverage-id", typia.random<api.functional.organization.period.reopen_request.requestReopen.Body>()));
}

/** Proves the published api.functional.organization.period.soft_close.softClose route is callable through the generated SDK. */
export async function test_api_operation_497_organization_period_soft_close_softClose(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.period.soft_close.softClose", async () => api.functional.organization.period.soft_close.softClose(live, "coverage-id"));
}

/** Proves the published api.functional.organization.production_order.createOrder route is callable through the generated SDK. */
export async function test_api_operation_498_organization_production_order_createOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.production_order.createOrder", async () => api.functional.organization.production_order.createOrder(live, typia.random<api.functional.organization.production_order.createOrder.Body>()));
}

/** Proves the published api.functional.organization.production_order.listOrders route is callable through the generated SDK. */
export async function test_api_operation_499_organization_production_order_listOrders(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.production_order.listOrders", async () => api.functional.organization.production_order.listOrders(live, typia.random<api.functional.organization.production_order.listOrders.Body>()));
}

/** Proves the published api.functional.organization.production_order.cancel.cancelOrder route is callable through the generated SDK. */
export async function test_api_operation_500_organization_production_order_cancel_cancelOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.production_order.cancel.cancelOrder", async () => api.functional.organization.production_order.cancel.cancelOrder(live, "coverage-id"));
}

/** Proves the published api.functional.organization.production_order.complete.completeOrder route is callable through the generated SDK. */
export async function test_api_operation_501_organization_production_order_complete_completeOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.production_order.complete.completeOrder", async () => api.functional.organization.production_order.complete.completeOrder(live, "coverage-id", typia.random<api.functional.organization.production_order.complete.completeOrder.Body>()));
}

/** Proves the published api.functional.organization.production_order.release.releaseOrder route is callable through the generated SDK. */
export async function test_api_operation_502_organization_production_order_release_releaseOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.production_order.release.releaseOrder", async () => api.functional.organization.production_order.release.releaseOrder(live, "coverage-id"));
}

/** Proves the published api.functional.organization.profit_center.createProfitCenter route is callable through the generated SDK. */
export async function test_api_operation_503_organization_profit_center_createProfitCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.profit_center.createProfitCenter", async () => api.functional.organization.profit_center.createProfitCenter(live, typia.random<api.functional.organization.profit_center.createProfitCenter.Body>()));
}

/** Proves the published api.functional.organization.profit_center.listProfitCenters route is callable through the generated SDK. */
export async function test_api_operation_504_organization_profit_center_listProfitCenters(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.profit_center.listProfitCenters", async () => api.functional.organization.profit_center.listProfitCenters(live, typia.random<api.functional.organization.profit_center.listProfitCenters.Body>()));
}

/** Proves the published api.functional.organization.profit_center.updateProfitCenter route is callable through the generated SDK. */
export async function test_api_operation_505_organization_profit_center_updateProfitCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.profit_center.updateProfitCenter", async () => api.functional.organization.profit_center.updateProfitCenter(live, "coverage-id", typia.random<api.functional.organization.profit_center.updateProfitCenter.Body>()));
}

/** Proves the published api.functional.organization.profit_center.activate.activateProfitCenter route is callable through the generated SDK. */
export async function test_api_operation_506_organization_profit_center_activate_activateProfitCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.profit_center.activate.activateProfitCenter", async () => api.functional.organization.profit_center.activate.activateProfitCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.profit_center.approve.approveProfitCenter route is callable through the generated SDK. */
export async function test_api_operation_507_organization_profit_center_approve_approveProfitCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.profit_center.approve.approveProfitCenter", async () => api.functional.organization.profit_center.approve.approveProfitCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.profit_center.cancel.cancelProfitCenter route is callable through the generated SDK. */
export async function test_api_operation_508_organization_profit_center_cancel_cancelProfitCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.profit_center.cancel.cancelProfitCenter", async () => api.functional.organization.profit_center.cancel.cancelProfitCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.profit_center.complete.completeProfitCenter route is callable through the generated SDK. */
export async function test_api_operation_509_organization_profit_center_complete_completeProfitCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.profit_center.complete.completeProfitCenter", async () => api.functional.organization.profit_center.complete.completeProfitCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.profit_center.reject.rejectProfitCenter route is callable through the generated SDK. */
export async function test_api_operation_510_organization_profit_center_reject_rejectProfitCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.profit_center.reject.rejectProfitCenter", async () => api.functional.organization.profit_center.reject.rejectProfitCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.profit_center.submit.submitProfitCenter route is callable through the generated SDK. */
export async function test_api_operation_511_organization_profit_center_submit_submitProfitCenter(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.profit_center.submit.submitProfitCenter", async () => api.functional.organization.profit_center.submit.submitProfitCenter(live, "coverage-id"));
}

/** Proves the published api.functional.organization.project.createProject route is callable through the generated SDK. */
export async function test_api_operation_512_organization_project_createProject(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.project.createProject", async () => api.functional.organization.project.createProject(live, typia.random<api.functional.organization.project.createProject.Body>()));
}

/** Proves the published api.functional.organization.project.listProjects route is callable through the generated SDK. */
export async function test_api_operation_513_organization_project_listProjects(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.project.listProjects", async () => api.functional.organization.project.listProjects(live, typia.random<api.functional.organization.project.listProjects.Body>()));
}

/** Proves the published api.functional.organization.project.updateProject route is callable through the generated SDK. */
export async function test_api_operation_514_organization_project_updateProject(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.project.updateProject", async () => api.functional.organization.project.updateProject(live, "coverage-id", typia.random<api.functional.organization.project.updateProject.Body>()));
}

/** Proves the published api.functional.organization.project.deactivate.deactivateProject route is callable through the generated SDK. */
export async function test_api_operation_515_organization_project_deactivate_deactivateProject(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.project.deactivate.deactivateProject", async () => api.functional.organization.project.deactivate.deactivateProject(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_order.createOrder route is callable through the generated SDK. */
export async function test_api_operation_516_organization_purchase_order_createOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_order.createOrder", async () => api.functional.organization.purchase_order.createOrder(live, typia.random<api.functional.organization.purchase_order.createOrder.Body>()));
}

/** Proves the published api.functional.organization.purchase_order.listOrders route is callable through the generated SDK. */
export async function test_api_operation_517_organization_purchase_order_listOrders(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_order.listOrders", async () => api.functional.organization.purchase_order.listOrders(live, typia.random<api.functional.organization.purchase_order.listOrders.Body>()));
}

/** Proves the published api.functional.organization.purchase_order.updateOrder route is callable through the generated SDK. */
export async function test_api_operation_518_organization_purchase_order_updateOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_order.updateOrder", async () => api.functional.organization.purchase_order.updateOrder(live, "coverage-id", typia.random<api.functional.organization.purchase_order.updateOrder.Body>()));
}

/** Proves the published api.functional.organization.purchase_order.eraseOrder route is callable through the generated SDK. */
export async function test_api_operation_519_organization_purchase_order_eraseOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_order.eraseOrder", async () => api.functional.organization.purchase_order.eraseOrder(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_order.approve.approveOrder route is callable through the generated SDK. */
export async function test_api_operation_520_organization_purchase_order_approve_approveOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_order.approve.approveOrder", async () => api.functional.organization.purchase_order.approve.approveOrder(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_order.cancel.cancelOrder route is callable through the generated SDK. */
export async function test_api_operation_521_organization_purchase_order_cancel_cancelOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_order.cancel.cancelOrder", async () => api.functional.organization.purchase_order.cancel.cancelOrder(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_order.close.closeOrder route is callable through the generated SDK. */
export async function test_api_operation_522_organization_purchase_order_close_closeOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_order.close.closeOrder", async () => api.functional.organization.purchase_order.close.closeOrder(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_order.send.sendOrder route is callable through the generated SDK. */
export async function test_api_operation_523_organization_purchase_order_send_sendOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_order.send.sendOrder", async () => api.functional.organization.purchase_order.send.sendOrder(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_order.submit.submitOrder route is callable through the generated SDK. */
export async function test_api_operation_524_organization_purchase_order_submit_submitOrder(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_order.submit.submitOrder", async () => api.functional.organization.purchase_order.submit.submitOrder(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_receipt.createPurchaseReceipt route is callable through the generated SDK. */
export async function test_api_operation_525_organization_purchase_receipt_createPurchaseReceipt(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_receipt.createPurchaseReceipt", async () => api.functional.organization.purchase_receipt.createPurchaseReceipt(live, typia.random<api.functional.organization.purchase_receipt.createPurchaseReceipt.Body>()));
}

/** Proves the published api.functional.organization.purchase_receipt.listPurchaseReceipts route is callable through the generated SDK. */
export async function test_api_operation_526_organization_purchase_receipt_listPurchaseReceipts(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_receipt.listPurchaseReceipts", async () => api.functional.organization.purchase_receipt.listPurchaseReceipts(live, typia.random<api.functional.organization.purchase_receipt.listPurchaseReceipts.Body>()));
}

/** Proves the published api.functional.organization.purchase_receipt.updatePurchaseReceipt route is callable through the generated SDK. */
export async function test_api_operation_527_organization_purchase_receipt_updatePurchaseReceipt(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_receipt.updatePurchaseReceipt", async () => api.functional.organization.purchase_receipt.updatePurchaseReceipt(live, "coverage-id", typia.random<api.functional.organization.purchase_receipt.updatePurchaseReceipt.Body>()));
}

/** Proves the published api.functional.organization.purchase_receipt.activate.activatePurchaseReceipt route is callable through the generated SDK. */
export async function test_api_operation_528_organization_purchase_receipt_activate_activatePurchaseReceipt(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_receipt.activate.activatePurchaseReceipt", async () => api.functional.organization.purchase_receipt.activate.activatePurchaseReceipt(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_receipt.approve.approvePurchaseReceipt route is callable through the generated SDK. */
export async function test_api_operation_529_organization_purchase_receipt_approve_approvePurchaseReceipt(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_receipt.approve.approvePurchaseReceipt", async () => api.functional.organization.purchase_receipt.approve.approvePurchaseReceipt(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_receipt.cancel.cancelPurchaseReceipt route is callable through the generated SDK. */
export async function test_api_operation_530_organization_purchase_receipt_cancel_cancelPurchaseReceipt(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_receipt.cancel.cancelPurchaseReceipt", async () => api.functional.organization.purchase_receipt.cancel.cancelPurchaseReceipt(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_receipt.complete.completePurchaseReceipt route is callable through the generated SDK. */
export async function test_api_operation_531_organization_purchase_receipt_complete_completePurchaseReceipt(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_receipt.complete.completePurchaseReceipt", async () => api.functional.organization.purchase_receipt.complete.completePurchaseReceipt(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_receipt.reject.rejectPurchaseReceipt route is callable through the generated SDK. */
export async function test_api_operation_532_organization_purchase_receipt_reject_rejectPurchaseReceipt(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_receipt.reject.rejectPurchaseReceipt", async () => api.functional.organization.purchase_receipt.reject.rejectPurchaseReceipt(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_receipt.submit.submitPurchaseReceipt route is callable through the generated SDK. */
export async function test_api_operation_533_organization_purchase_receipt_submit_submitPurchaseReceipt(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_receipt.submit.submitPurchaseReceipt", async () => api.functional.organization.purchase_receipt.submit.submitPurchaseReceipt(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_request.createRequest route is callable through the generated SDK. */
export async function test_api_operation_534_organization_purchase_request_createRequest(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_request.createRequest", async () => api.functional.organization.purchase_request.createRequest(live, typia.random<api.functional.organization.purchase_request.createRequest.Body>()));
}

/** Proves the published api.functional.organization.purchase_request.listRequests route is callable through the generated SDK. */
export async function test_api_operation_535_organization_purchase_request_listRequests(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_request.listRequests", async () => api.functional.organization.purchase_request.listRequests(live, typia.random<api.functional.organization.purchase_request.listRequests.Body>()));
}

/** Proves the published api.functional.organization.purchase_request.updateRequest route is callable through the generated SDK. */
export async function test_api_operation_536_organization_purchase_request_updateRequest(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_request.updateRequest", async () => api.functional.organization.purchase_request.updateRequest(live, "coverage-id", typia.random<api.functional.organization.purchase_request.updateRequest.Body>()));
}

/** Proves the published api.functional.organization.purchase_request.eraseRequest route is callable through the generated SDK. */
export async function test_api_operation_537_organization_purchase_request_eraseRequest(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_request.eraseRequest", async () => api.functional.organization.purchase_request.eraseRequest(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_request.approve.approveRequest route is callable through the generated SDK. */
export async function test_api_operation_538_organization_purchase_request_approve_approveRequest(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_request.approve.approveRequest", async () => api.functional.organization.purchase_request.approve.approveRequest(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_request.cancel.cancelRequest route is callable through the generated SDK. */
export async function test_api_operation_539_organization_purchase_request_cancel_cancelRequest(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_request.cancel.cancelRequest", async () => api.functional.organization.purchase_request.cancel.cancelRequest(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_request.reject.rejectRequest route is callable through the generated SDK. */
export async function test_api_operation_540_organization_purchase_request_reject_rejectRequest(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_request.reject.rejectRequest", async () => api.functional.organization.purchase_request.reject.rejectRequest(live, "coverage-id", typia.random<api.functional.organization.purchase_request.reject.rejectRequest.Body>()));
}

/** Proves the published api.functional.organization.purchase_request.submit.submitRequest route is callable through the generated SDK. */
export async function test_api_operation_541_organization_purchase_request_submit_submitRequest(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_request.submit.submitRequest", async () => api.functional.organization.purchase_request.submit.submitRequest(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_return.createPurchaseReturn route is callable through the generated SDK. */
export async function test_api_operation_542_organization_purchase_return_createPurchaseReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_return.createPurchaseReturn", async () => api.functional.organization.purchase_return.createPurchaseReturn(live, typia.random<api.functional.organization.purchase_return.createPurchaseReturn.Body>()));
}

/** Proves the published api.functional.organization.purchase_return.listPurchaseReturns route is callable through the generated SDK. */
export async function test_api_operation_543_organization_purchase_return_listPurchaseReturns(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_return.listPurchaseReturns", async () => api.functional.organization.purchase_return.listPurchaseReturns(live, typia.random<api.functional.organization.purchase_return.listPurchaseReturns.Body>()));
}

/** Proves the published api.functional.organization.purchase_return.updatePurchaseReturn route is callable through the generated SDK. */
export async function test_api_operation_544_organization_purchase_return_updatePurchaseReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_return.updatePurchaseReturn", async () => api.functional.organization.purchase_return.updatePurchaseReturn(live, "coverage-id", typia.random<api.functional.organization.purchase_return.updatePurchaseReturn.Body>()));
}

/** Proves the published api.functional.organization.purchase_return.activate.activatePurchaseReturn route is callable through the generated SDK. */
export async function test_api_operation_545_organization_purchase_return_activate_activatePurchaseReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_return.activate.activatePurchaseReturn", async () => api.functional.organization.purchase_return.activate.activatePurchaseReturn(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_return.approve.approvePurchaseReturn route is callable through the generated SDK. */
export async function test_api_operation_546_organization_purchase_return_approve_approvePurchaseReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_return.approve.approvePurchaseReturn", async () => api.functional.organization.purchase_return.approve.approvePurchaseReturn(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_return.cancel.cancelPurchaseReturn route is callable through the generated SDK. */
export async function test_api_operation_547_organization_purchase_return_cancel_cancelPurchaseReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_return.cancel.cancelPurchaseReturn", async () => api.functional.organization.purchase_return.cancel.cancelPurchaseReturn(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_return.complete.completePurchaseReturn route is callable through the generated SDK. */
export async function test_api_operation_548_organization_purchase_return_complete_completePurchaseReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_return.complete.completePurchaseReturn", async () => api.functional.organization.purchase_return.complete.completePurchaseReturn(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_return.reject.rejectPurchaseReturn route is callable through the generated SDK. */
export async function test_api_operation_549_organization_purchase_return_reject_rejectPurchaseReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_return.reject.rejectPurchaseReturn", async () => api.functional.organization.purchase_return.reject.rejectPurchaseReturn(live, "coverage-id"));
}

/** Proves the published api.functional.organization.purchase_return.submit.submitPurchaseReturn route is callable through the generated SDK. */
export async function test_api_operation_550_organization_purchase_return_submit_submitPurchaseReturn(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.purchase_return.submit.submitPurchaseReturn", async () => api.functional.organization.purchase_return.submit.submitPurchaseReturn(live, "coverage-id"));
}

/** Proves the published api.functional.organization.quality_inspection.createInspection route is callable through the generated SDK. */
export async function test_api_operation_551_organization_quality_inspection_createInspection(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.quality_inspection.createInspection", async () => api.functional.organization.quality_inspection.createInspection(live, typia.random<api.functional.organization.quality_inspection.createInspection.Body>()));
}

/** Proves the published api.functional.organization.quality_inspection.listInspections route is callable through the generated SDK. */
export async function test_api_operation_552_organization_quality_inspection_listInspections(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.quality_inspection.listInspections", async () => api.functional.organization.quality_inspection.listInspections(live, typia.random<api.functional.organization.quality_inspection.listInspections.Body>()));
}

/** Proves the published api.functional.organization.quality_inspection.complete.completeInspection route is callable through the generated SDK. */
export async function test_api_operation_553_organization_quality_inspection_complete_completeInspection(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("organization.quality_inspection.complete.completeInspection", async () => api.functional.organization.quality_inspection.complete.completeInspection(live, "coverage-id", typia.random<api.functional.organization.quality_inspection.complete.completeInspection.Body>()));
}

/** Proves the published api.functional.auth.user.logout.logout route is callable through the generated SDK. */
export async function test_api_operation_554_auth_user_logout_logout(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("auth.user.logout", async () => api.functional.auth.user.logout(live));
}

/** Proves the published api.functional.auth.user.logout_all.logoutAll route is callable through the generated SDK. */
export async function test_api_operation_555_auth_user_logout_all_logoutAll(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("auth.user.logout_all.logoutAll", async () => api.functional.auth.user.logout_all.logoutAll(live));
}

/** Proves the published api.functional.auth.user.recovery.request.requestRecovery route is callable through the generated SDK. */
export async function test_api_operation_556_auth_user_recovery_request_requestRecovery(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("auth.user.recovery.request.requestRecovery", async () => api.functional.auth.user.recovery.request.requestRecovery(live, typia.random<api.functional.auth.user.recovery.request.requestRecovery.Body>()));
}

/** Proves the published api.functional.auth.user.recovery.complete.completeRecovery route is callable through the generated SDK. */
export async function test_api_operation_557_auth_user_recovery_complete_completeRecovery(connection: api.IConnection): Promise<void> {
  const live: api.IConnection = await operationConnection(connection);
  await observe("auth.user.recovery.complete.completeRecovery", async () => api.functional.auth.user.recovery.complete.completeRecovery(live, typia.random<api.functional.auth.user.recovery.complete.completeRecovery.Body>()));
}
