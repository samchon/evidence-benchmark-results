import * as api from "@benchmark/erp-api";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiConnection } from "@/lib/client";
import { useSession } from "@/lib/session-hooks";

export const erpKeys = {
  organization: ["erp", "organization"] as const,
  profile: ["erp", "profile"] as const,
  accounts: (search: string, page: number) => ["erp", "accounts", search, page] as const,
  journals: (page: number) => ["erp", "journals", page] as const,
  audit: (page: number) => ["erp", "audit", page] as const,
  approvals: (page: number) => ["erp", "approvals", page] as const,
  approvalHistory: (id: string | null) => ["erp", "approval-history", id] as const,
  report: (kind: string, filters: Record<string, unknown>) => ["erp", "report", kind, filters] as const,
};

export function useOrganization() {
  const { status } = useSession();
  return useQuery(queryOptions({
    queryKey: erpKeys.organization,
    queryFn: () => api.functional.erp.organization.at(apiConnection),
    enabled: status === "authenticated",
  }));
}

export function useProfile() {
  const { status } = useSession();
  return useQuery(queryOptions({
    queryKey: erpKeys.profile,
    queryFn: () => api.functional.erp.auth.profile.profile(apiConnection),
    enabled: status === "authenticated",
  }));
}

export function useAccounts(search: string, page: number) {
  const { status } = useSession();
  return useQuery(queryOptions({
    queryKey: erpKeys.accounts(search, page),
    queryFn: () => api.functional.erp.account.index(apiConnection, { page, limit: 12, search: search || null }),
    enabled: status === "authenticated",
  }));
}

export function useJournals(page: number) {
  const { status } = useSession();
  return useQuery(queryOptions({
    queryKey: erpKeys.journals(page),
    queryFn: () => api.functional.erp.journal.index(apiConnection, { page, limit: 12 }),
    enabled: status === "authenticated",
  }));
}

export function useAudit(page: number) {
  const { status } = useSession();
  return useQuery(queryOptions({
    queryKey: erpKeys.audit(page),
    queryFn: () => api.functional.erp.control.audit.auditIndex(apiConnection, { page, limit: 8 }),
    enabled: status === "authenticated",
  }));
}

export function useApprovals(page: number) {
  const { status } = useSession();
  return useQuery(queryOptions({
    queryKey: erpKeys.approvals(page),
    queryFn: () => api.functional.erp.control_ops.approval.approvalIndex(apiConnection, { page, limit: 12 }),
    enabled: status === "authenticated",
  }));
}

export function useApprovalHistory(id: string | null) {
  const { status } = useSession();
  return useQuery(queryOptions({
    queryKey: erpKeys.approvalHistory(id),
    queryFn: () => api.functional.erp.control_ops.approval.history.approvalHistory(apiConnection, id as string),
    enabled: status === "authenticated" && id !== null,
  }));
}

export function useApprovalActions() {
  const client = useQueryClient();
  const resolve = useMutation({
    mutationFn: (input: { id: string; action: "approved" | "rejected" | "changes"; reason?: string }) => api.functional.erp.control_ops.approval.approvalResolve(apiConnection, input.id, input.action, { reason: input.reason ?? null }),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["erp", "approvals"] });
      void client.invalidateQueries({ queryKey: ["erp", "audit"] });
      void client.invalidateQueries({ queryKey: ["erp", "approval-history"] });
    },
  });
  const delegate = useMutation({
    mutationFn: (input: { id: string; delegateTo: string }) => api.functional.erp.control_ops.approval.delegate.approvalDelegate(apiConnection, input.id, { delegateTo: input.delegateTo }),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["erp", "approvals"] });
      void client.invalidateQueries({ queryKey: ["erp", "approval-history"] });
    },
  });
  const escalate = useMutation({
    mutationFn: (id: string) => api.functional.erp.control_ops.approval.escalate.approvalEscalate(apiConnection, id),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["erp", "approvals"] });
      void client.invalidateQueries({ queryKey: ["erp", "approval-history"] });
    },
  });
  return { resolve, delegate, escalate };
}

export function useReport(kind: api.IReport.IRequest["kind"], filters: Omit<api.IReport.IRequest, "kind"> = {}) {
  const { status } = useSession();
  return useQuery(queryOptions({
    queryKey: erpKeys.report(kind, filters),
    queryFn: () => api.functional.erp.control.report.report(apiConnection, { kind, ...filters }),
    enabled: status === "authenticated",
  }));
}

export function useReportExport() {
  return useMutation({
    mutationFn: (input: api.IReport.IRequest) => api.functional.erp.control.report._export.reportExport(apiConnection, input),
  });
}

export function useMrpRuns() {
  const { status } = useSession();
  return useQuery(queryOptions({
    queryKey: ["erp", "mrp-runs"] as const,
    queryFn: () => api.functional.erp.mrp.run.runIndex(apiConnection, { page: 1, limit: 10 }),
    enabled: status === "authenticated",
  }));
}

export function useMrpRecommendations(runId: string | null) {
  const { status } = useSession();
  return useQuery(queryOptions({
    queryKey: ["erp", "mrp-recommendations", runId] as const,
    queryFn: () => api.functional.erp.mrp.run.recommendation.recommendationIndex(apiConnection, runId as string, { page: 1, limit: 50, status: "open" }),
    enabled: status === "authenticated" && runId !== null,
  }));
}

export function useMrpActions() {
  const client = useQueryClient();
  const run = useMutation({
    mutationFn: (body: api.IMrpRun.ICreate) => api.functional.erp.mrp.run.runCreate(apiConnection, body),
    onSuccess: () => { void client.invalidateQueries({ queryKey: ["erp", "mrp-runs"] }); void client.invalidateQueries({ queryKey: ["erp", "report", "mrp_recommendations"] }); },
  });
  const acceptPurchase = useMutation({
    mutationFn: (id: string) => api.functional.erp.mrp.recommendation.accept_purchase.recommendationPurchase(apiConnection, id),
    onSuccess: (recommendation) => { void client.invalidateQueries({ queryKey: ["erp", "mrp-recommendations", recommendation.runId] }); void client.invalidateQueries({ queryKey: ["erp", "report", "mrp_recommendations"] }); },
  });
  const acceptProduction = useMutation({
    mutationFn: (id: string) => api.functional.erp.mrp.recommendation.accept_production.recommendationProduction(apiConnection, id),
    onSuccess: (recommendation) => { void client.invalidateQueries({ queryKey: ["erp", "mrp-recommendations", recommendation.runId] }); void client.invalidateQueries({ queryKey: ["erp", "report", "mrp_recommendations"] }); },
  });
  const dismiss = useMutation({
    mutationFn: (input: { id: string; reason: string }) => api.functional.erp.mrp.recommendation.dismiss.recommendationDismiss(apiConnection, input.id, { reason: input.reason }),
    onSuccess: (recommendation) => { void client.invalidateQueries({ queryKey: ["erp", "mrp-recommendations", recommendation.runId] }); void client.invalidateQueries({ queryKey: ["erp", "report", "mrp_recommendations"] }); },
  });
  return { run, acceptPurchase, acceptProduction, dismiss };
}

export function useAuthActions() {
  const { setAuth, setSelectedMembershipId, clearAuth } = useSession();
  const client = useQueryClient();
  const login = useMutation({
    mutationFn: (body: api.IUser.ILogin) => api.functional.erp.auth.login(apiConnection, body),
    onSuccess: (result) => setAuth(result),
  });
  const createOrganization = useMutation({
    mutationFn: (body: api.IOrganization.ICreate) => api.functional.erp.auth.organization(apiConnection, body),
    onSuccess: (result) => setAuth(result),
  });
  const acceptInvitation = useMutation({
    mutationFn: (body: api.IUser.IAcceptInvitation) => api.functional.erp.auth.invitation.accept(apiConnection, body),
    onSuccess: (result) => setAuth(result),
  });
  const selectMembership = useMutation({
    mutationFn: (membershipId: string) => api.functional.erp.auth.membership.select(apiConnection, membershipId),
    onSuccess: (membership) => { client.clear(); setSelectedMembershipId(membership.id); },
  });
  const changePassword = useMutation({
    mutationFn: (body: api.IUser.IChangePassword) => api.functional.erp.auth.password.changePassword(apiConnection, body),
  });
  const deactivateAccount = useMutation({
    mutationFn: (body: { currentPassword: string }) => api.functional.erp.auth.account.deactivate.deactivateAccount(apiConnection, body),
    onSuccess: () => { clearAuth(); client.clear(); },
  });
  const recoveryRequest = useMutation({
    mutationFn: (body: api.IUser.IRecoveryRequest) => api.functional.erp.auth.recovery.request.recoveryRequest(apiConnection, body),
  });
  const invite = useMutation({
    mutationFn: (body: api.IOrganization.IInvite) => api.functional.erp.organization.invitation.invite(apiConnection, body),
  });
  const updateOrganization = useMutation({
    mutationFn: (body: api.IOrganization.IUpdate) => api.functional.erp.organization.update(apiConnection, body),
    onSuccess: () => client.invalidateQueries({ queryKey: erpKeys.organization }),
  });
  const updateProfile = useMutation({
    mutationFn: (body: api.IUser.IUpdate) => api.functional.erp.auth.profile.updateProfile(apiConnection, body),
    onSuccess: () => client.invalidateQueries({ queryKey: erpKeys.profile }),
  });
  const logout = useMutation({
    mutationFn: () => api.functional.erp.auth.session.logout(apiConnection),
    onSuccess: () => { clearAuth(); client.clear(); },
  });
  const logoutAll = useMutation({
    mutationFn: () => api.functional.erp.auth.sessions.logoutAll(apiConnection),
    onSuccess: () => { clearAuth(); client.clear(); },
  });
  return { login, createOrganization, acceptInvitation, selectMembership, changePassword, deactivateAccount, recoveryRequest, invite, updateOrganization, updateProfile, logout, logoutAll };
}

export function useAccountActions() {
  const client = useQueryClient();
  const create = useMutation({
    mutationFn: (body: api.IAccount.ICreate) => api.functional.erp.account.create(apiConnection, body),
    onSuccess: () => client.invalidateQueries({ queryKey: ["erp", "accounts"] }),
  });
  const update = useMutation({
    mutationFn: (input: { id: string; body: api.IAccount.IUpdate }) => api.functional.erp.account.update(apiConnection, input.id, input.body),
    onSuccess: () => client.invalidateQueries({ queryKey: ["erp", "accounts"] }),
  });
  const erase = useMutation({
    mutationFn: (id: string) => api.functional.erp.account.erase(apiConnection, id),
    onSuccess: () => client.invalidateQueries({ queryKey: ["erp", "accounts"] }),
  });
  return { create, update, erase };
}

export function useJournalActions() {
  const client = useQueryClient();
  const create = useMutation({
    mutationFn: (body: api.IJournal.ICreate) => api.functional.erp.journal.create(apiConnection, body),
    onSuccess: () => client.invalidateQueries({ queryKey: ["erp", "journals"] }),
  });
  const post = useMutation({
    mutationFn: (id: string) => api.functional.erp.journal.post(apiConnection, id),
    onSuccess: () => client.invalidateQueries({ queryKey: ["erp", "journals"] }),
  });
  const update = useMutation({
    mutationFn: (input: { id: string; body: api.IJournal.IUpdate }) => api.functional.erp.journal.update(apiConnection, input.id, input.body),
    onSuccess: () => client.invalidateQueries({ queryKey: ["erp", "journals"] }),
  });
  const erase = useMutation({
    mutationFn: (id: string) => api.functional.erp.journal.erase(apiConnection, id),
    onSuccess: () => client.invalidateQueries({ queryKey: ["erp", "journals"] }),
  });
  const reverse = useMutation({
    mutationFn: (input: { id: string; body: api.IJournal.IReverse }) => api.functional.erp.journal.reverse(apiConnection, input.id, input.body),
    onSuccess: () => client.invalidateQueries({ queryKey: ["erp", "journals"] }),
  });
  const voidEntry = useMutation({
    mutationFn: (input: { id: string; reason: string }) => api.functional.erp.journal._void.voidEntry(apiConnection, input.id, { reason: input.reason }),
    onSuccess: () => client.invalidateQueries({ queryKey: ["erp", "journals"] }),
  });
  return { create, post, update, erase, reverse, voidEntry };
}


type ErpAccessorArgs<T> = T extends (connection: api.IConnection, ...args: infer A) => any ? A : never;

export function useGeneratedErpAccountAt() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.account.at>) => api.functional.erp.account.at(apiConnection, ...args),
  });
}

export function useGeneratedErpAccountCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.account.create>) => api.functional.erp.account.create(apiConnection, ...args),
  });
}

export function useGeneratedErpAccountErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.account.erase>) => api.functional.erp.account.erase(apiConnection, ...args),
  });
}

export function useGeneratedErpAccountIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.account.index>) => api.functional.erp.account.index(apiConnection, ...args),
  });
}

export function useGeneratedErpAccountMergeMergeExecute() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.account.merge.mergeExecute>) => api.functional.erp.account.merge.mergeExecute(apiConnection, ...args),
  });
}

export function useGeneratedErpAccountMergeRequestMergeRequest() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.account.merge_request.mergeRequest>) => api.functional.erp.account.merge_request.mergeRequest(apiConnection, ...args),
  });
}

export function useGeneratedErpAccountUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.account.update>) => api.functional.erp.account.update(apiConnection, ...args),
  });
}

export function useGeneratedErpAddressAddressAt() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.address.addressAt>) => api.functional.erp.address.addressAt(apiConnection, ...args),
  });
}

export function useGeneratedErpAddressAddressCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.address.addressCreate>) => api.functional.erp.address.addressCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpAddressAddressErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.address.addressErase>) => api.functional.erp.address.addressErase(apiConnection, ...args),
  });
}

export function useGeneratedErpAddressAddressIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.address.addressIndex>) => api.functional.erp.address.addressIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpAddressAddressUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.address.addressUpdate>) => api.functional.erp.address.addressUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpAllocationAvailabilityAvailabilityAt() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.allocation.availability.availabilityAt>) => api.functional.erp.allocation.availability.availabilityAt(apiConnection, ...args),
  });
}

export function useGeneratedErpAllocationCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.allocation.create>) => api.functional.erp.allocation.create(apiConnection, ...args),
  });
}

export function useGeneratedErpAllocationIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.allocation.index>) => api.functional.erp.allocation.index(apiConnection, ...args),
  });
}

export function useGeneratedErpAllocationRelease() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.allocation.release>) => api.functional.erp.allocation.release(apiConnection, ...args),
  });
}

export function useGeneratedErpAllocationRuleActivate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.allocation_rule.activate>) => api.functional.erp.allocation_rule.activate(apiConnection, ...args),
  });
}

export function useGeneratedErpAllocationRuleCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.allocation_rule.create>) => api.functional.erp.allocation_rule.create(apiConnection, ...args),
  });
}

export function useGeneratedErpAllocationRuleDeactivate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.allocation_rule.deactivate>) => api.functional.erp.allocation_rule.deactivate(apiConnection, ...args),
  });
}

export function useGeneratedErpAllocationRuleExecute() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.allocation_rule.execute>) => api.functional.erp.allocation_rule.execute(apiConnection, ...args),
  });
}

export function useGeneratedErpAllocationRuleExecutionPost() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.allocation_rule.execution.post>) => api.functional.erp.allocation_rule.execution.post(apiConnection, ...args),
  });
}

export function useGeneratedErpAllocationRuleIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.allocation_rule.index>) => api.functional.erp.allocation_rule.index(apiConnection, ...args),
  });
}

export function useGeneratedErpAllocationRuleUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.allocation_rule.update>) => api.functional.erp.allocation_rule.update(apiConnection, ...args),
  });
}

export function useGeneratedErpAuthAccountDeactivateDeactivateAccount() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.auth.account.deactivate.deactivateAccount>) => api.functional.erp.auth.account.deactivate.deactivateAccount(apiConnection, ...args),
  });
}

export function useGeneratedErpAuthInvitationAccept() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.auth.invitation.accept>) => api.functional.erp.auth.invitation.accept(apiConnection, ...args),
  });
}

export function useGeneratedErpAuthLogin() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.auth.login>) => api.functional.erp.auth.login(apiConnection, ...args),
  });
}

export function useGeneratedErpAuthMembershipSelect() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.auth.membership.select>) => api.functional.erp.auth.membership.select(apiConnection, ...args),
  });
}

export function useGeneratedErpAuthOrganization() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.auth.organization>) => api.functional.erp.auth.organization(apiConnection, ...args),
  });
}

export function useGeneratedErpAuthPasswordChangePassword() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.auth.password.changePassword>) => api.functional.erp.auth.password.changePassword(apiConnection, ...args),
  });
}

export function useGeneratedErpAuthProfileProfile() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.auth.profile.profile>) => api.functional.erp.auth.profile.profile(apiConnection, ...args),
  });
}

export function useGeneratedErpAuthProfileUpdateProfile() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.auth.profile.updateProfile>) => api.functional.erp.auth.profile.updateProfile(apiConnection, ...args),
  });
}

export function useGeneratedErpAuthRecoveryCompleteRecoveryComplete() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.auth.recovery.complete.recoveryComplete>) => api.functional.erp.auth.recovery.complete.recoveryComplete(apiConnection, ...args),
  });
}

export function useGeneratedErpAuthRecoveryRequestRecoveryRequest() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.auth.recovery.request.recoveryRequest>) => api.functional.erp.auth.recovery.request.recoveryRequest(apiConnection, ...args),
  });
}

export function useGeneratedErpAuthRefresh() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.auth.refresh>) => api.functional.erp.auth.refresh(apiConnection, ...args),
  });
}

export function useGeneratedErpAuthSessionLogout() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.auth.session.logout>) => api.functional.erp.auth.session.logout(apiConnection, ...args),
  });
}

export function useGeneratedErpAuthSessionsLogoutAll() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.auth.sessions.logoutAll>) => api.functional.erp.auth.sessions.logoutAll(apiConnection, ...args),
  });
}

export function useGeneratedErpBankReconciliationCompleteReconciliationComplete() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.bank.reconciliation.complete.reconciliationComplete>) => api.functional.erp.bank.reconciliation.complete.reconciliationComplete(apiConnection, ...args),
  });
}

export function useGeneratedErpBankReconciliationLineReconciliationLine() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.bank.reconciliation.line.reconciliationLine>) => api.functional.erp.bank.reconciliation.line.reconciliationLine(apiConnection, ...args),
  });
}

export function useGeneratedErpBankReconciliationReconciliationCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.bank.reconciliation.reconciliationCreate>) => api.functional.erp.bank.reconciliation.reconciliationCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpBankReconciliationReopenReconciliationReopen() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.bank.reconciliation.reopen.reconciliationReopen>) => api.functional.erp.bank.reconciliation.reopen.reconciliationReopen(apiConnection, ...args),
  });
}

export function useGeneratedErpBankReconciliationReopenRequestReconciliationReopenRequest() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.bank.reconciliation.reopen_request.reconciliationReopenRequest>) => api.functional.erp.bank.reconciliation.reopen_request.reconciliationReopenRequest(apiConnection, ...args),
  });
}

export function useGeneratedErpBankTransactionImportTransactionImport() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.bank.transaction._import.transactionImport>) => api.functional.erp.bank.transaction._import.transactionImport(apiConnection, ...args),
  });
}

export function useGeneratedErpBankTransactionMatchTransactionMatch() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.bank.transaction.match.transactionMatch>) => api.functional.erp.bank.transaction.match.transactionMatch(apiConnection, ...args),
  });
}

export function useGeneratedErpBankTransactionTransactionCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.bank.transaction.transactionCreate>) => api.functional.erp.bank.transaction.transactionCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpBankTransactionTransactionIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.bank.transaction.transactionIndex>) => api.functional.erp.bank.transaction.transactionIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpBankTransactionTransactionResolve() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.bank.transaction.transactionResolve>) => api.functional.erp.bank.transaction.transactionResolve(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigCurrencyCurrencyCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.currency.currencyCreate>) => api.functional.erp.config.currency.currencyCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigCurrencyCurrencyErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.currency.currencyErase>) => api.functional.erp.config.currency.currencyErase(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigCurrencyCurrencyIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.currency.currencyIndex>) => api.functional.erp.config.currency.currencyIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigCurrencyCurrencyUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.currency.currencyUpdate>) => api.functional.erp.config.currency.currencyUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigExchangeRateRateCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.exchange_rate.rateCreate>) => api.functional.erp.config.exchange_rate.rateCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigExchangeRateRateIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.exchange_rate.rateIndex>) => api.functional.erp.config.exchange_rate.rateIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigPaymentTermTermCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.payment_term.termCreate>) => api.functional.erp.config.payment_term.termCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigPaymentTermTermErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.payment_term.termErase>) => api.functional.erp.config.payment_term.termErase(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigPaymentTermTermIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.payment_term.termIndex>) => api.functional.erp.config.payment_term.termIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigPaymentTermTermUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.payment_term.termUpdate>) => api.functional.erp.config.payment_term.termUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigTaxCodeTaxCodeCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.tax_code.taxCodeCreate>) => api.functional.erp.config.tax_code.taxCodeCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigTaxCodeTaxCodeErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.tax_code.taxCodeErase>) => api.functional.erp.config.tax_code.taxCodeErase(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigTaxCodeTaxCodeIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.tax_code.taxCodeIndex>) => api.functional.erp.config.tax_code.taxCodeIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigTaxCodeTaxCodeUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.tax_code.taxCodeUpdate>) => api.functional.erp.config.tax_code.taxCodeUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigTaxJurisdictionJurisdictionCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.tax_jurisdiction.jurisdictionCreate>) => api.functional.erp.config.tax_jurisdiction.jurisdictionCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigTaxJurisdictionJurisdictionErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.tax_jurisdiction.jurisdictionErase>) => api.functional.erp.config.tax_jurisdiction.jurisdictionErase(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigTaxJurisdictionJurisdictionIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.tax_jurisdiction.jurisdictionIndex>) => api.functional.erp.config.tax_jurisdiction.jurisdictionIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigTaxJurisdictionJurisdictionUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.tax_jurisdiction.jurisdictionUpdate>) => api.functional.erp.config.tax_jurisdiction.jurisdictionUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigTaxRateResolveTaxRateResolve() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.tax_rate.resolve.taxRateResolve>) => api.functional.erp.config.tax_rate.resolve.taxRateResolve(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigTaxRateTaxRateCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config.tax_rate.taxRateCreate>) => api.functional.erp.config.tax_rate.taxRateCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigExtDocumentNumberIssueNumberIssue() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config_ext.document_number.issue.numberIssue>) => api.functional.erp.config_ext.document_number.issue.numberIssue(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigExtDocumentNumberNumberCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config_ext.document_number.numberCreate>) => api.functional.erp.config_ext.document_number.numberCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigExtDocumentNumberNumberIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config_ext.document_number.numberIndex>) => api.functional.erp.config_ext.document_number.numberIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigExtFiscalYearFiscalYearCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config_ext.fiscal_year.fiscalYearCreate>) => api.functional.erp.config_ext.fiscal_year.fiscalYearCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigExtFiscalYearFiscalYearIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config_ext.fiscal_year.fiscalYearIndex>) => api.functional.erp.config_ext.fiscal_year.fiscalYearIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigExtNotificationPreferencePreferenceAt() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config_ext.notification_preference.preferenceAt>) => api.functional.erp.config_ext.notification_preference.preferenceAt(apiConnection, ...args),
  });
}

export function useGeneratedErpConfigExtNotificationPreferencePreferenceUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.config_ext.notification_preference.preferenceUpdate>) => api.functional.erp.config_ext.notification_preference.preferenceUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpContactContactCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.contact.contactCreate>) => api.functional.erp.contact.contactCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpContactContactErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.contact.contactErase>) => api.functional.erp.contact.contactErase(apiConnection, ...args),
  });
}

export function useGeneratedErpContactContactIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.contact.contactIndex>) => api.functional.erp.contact.contactIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpContactContactUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.contact.contactUpdate>) => api.functional.erp.contact.contactUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpControlAuditAuditAt() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control.audit.auditAt>) => api.functional.erp.control.audit.auditAt(apiConnection, ...args),
  });
}

export function useGeneratedErpControlAuditAuditIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control.audit.auditIndex>) => api.functional.erp.control.audit.auditIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpControlReportExportReportExport() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control.report._export.reportExport>) => api.functional.erp.control.report._export.reportExport(apiConnection, ...args),
  });
}

export function useGeneratedErpControlReportReport() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control.report.report>) => api.functional.erp.control.report.report(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsApprovalApprovalCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.approval.approvalCreate>) => api.functional.erp.control_ops.approval.approvalCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsApprovalApprovalIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.approval.approvalIndex>) => api.functional.erp.control_ops.approval.approvalIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsApprovalApprovalResolve() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.approval.approvalResolve>) => api.functional.erp.control_ops.approval.approvalResolve(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsApprovalDelegateApprovalDelegate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.approval.delegate.approvalDelegate>) => api.functional.erp.control_ops.approval.delegate.approvalDelegate(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsApprovalEscalateApprovalEscalate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.approval.escalate.approvalEscalate>) => api.functional.erp.control_ops.approval.escalate.approvalEscalate(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsApprovalHistoryApprovalHistory() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.approval.history.approvalHistory>) => api.functional.erp.control_ops.approval.history.approvalHistory(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsBankAccountBankCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.bank_account.bankCreate>) => api.functional.erp.control_ops.bank_account.bankCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsBankAccountBankErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.bank_account.bankErase>) => api.functional.erp.control_ops.bank_account.bankErase(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsBankAccountBankIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.bank_account.bankIndex>) => api.functional.erp.control_ops.bank_account.bankIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsBankAccountBankUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.bank_account.bankUpdate>) => api.functional.erp.control_ops.bank_account.bankUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsNotificationDispatchNotificationDispatch() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.notification.dispatch.notificationDispatch>) => api.functional.erp.control_ops.notification.dispatch.notificationDispatch(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsNotificationNotificationIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.notification.notificationIndex>) => api.functional.erp.control_ops.notification.notificationIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsNotificationRetryNotificationRetry() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.notification.retry.notificationRetry>) => api.functional.erp.control_ops.notification.retry.notificationRetry(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsPeriodHardClosePeriodHardClose() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.period.hard_close.periodHardClose>) => api.functional.erp.control_ops.period.hard_close.periodHardClose(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsPeriodPeriodCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.period.periodCreate>) => api.functional.erp.control_ops.period.periodCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsPeriodPeriodIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.period.periodIndex>) => api.functional.erp.control_ops.period.periodIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsPeriodReopenPeriodReopen() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.period.reopen.periodReopen>) => api.functional.erp.control_ops.period.reopen.periodReopen(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsPeriodReopenRequestPeriodReopenRequest() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.period.reopen_request.periodReopenRequest>) => api.functional.erp.control_ops.period.reopen_request.periodReopenRequest(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsPeriodSnapshotPeriodSnapshot() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.period.snapshot.periodSnapshot>) => api.functional.erp.control_ops.period.snapshot.periodSnapshot(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsPeriodSoftClosePeriodSoftClose() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.period.soft_close.periodSoftClose>) => api.functional.erp.control_ops.period.soft_close.periodSoftClose(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsPeriodValidatePeriodValidate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.period.validate.periodValidate>) => api.functional.erp.control_ops.period.validate.periodValidate(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsWorkflowWorkflowCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.workflow.workflowCreate>) => api.functional.erp.control_ops.workflow.workflowCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsWorkflowWorkflowIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.workflow.workflowIndex>) => api.functional.erp.control_ops.workflow.workflowIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpControlOpsWorkflowWorkflowUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.control_ops.workflow.workflowUpdate>) => api.functional.erp.control_ops.workflow.workflowUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpCustomFieldDefinitionDeactivateDefinitionDeactivate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.custom_field.definition.deactivate.definitionDeactivate>) => api.functional.erp.custom_field.definition.deactivate.definitionDeactivate(apiConnection, ...args),
  });
}

export function useGeneratedErpCustomFieldDefinitionDefinitionCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.custom_field.definition.definitionCreate>) => api.functional.erp.custom_field.definition.definitionCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpCustomFieldDefinitionDefinitionIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.custom_field.definition.definitionIndex>) => api.functional.erp.custom_field.definition.definitionIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpCustomFieldDefinitionDefinitionUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.custom_field.definition.definitionUpdate>) => api.functional.erp.custom_field.definition.definitionUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpCustomFieldValueValueIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.custom_field.value.valueIndex>) => api.functional.erp.custom_field.value.valueIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpCustomFieldValueValueSet() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.custom_field.value.valueSet>) => api.functional.erp.custom_field.value.valueSet(apiConnection, ...args),
  });
}

export function useGeneratedErpDepreciationAssetScheduleScheduleCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.depreciation.asset.schedule.scheduleCreate>) => api.functional.erp.depreciation.asset.schedule.scheduleCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpDepreciationAssetScheduleScheduleIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.depreciation.asset.schedule.scheduleIndex>) => api.functional.erp.depreciation.asset.schedule.scheduleIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpDepreciationRunPostRunPost() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.depreciation.run.post.runPost>) => api.functional.erp.depreciation.run.post.runPost(apiConnection, ...args),
  });
}

export function useGeneratedErpDepreciationRunRunCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.depreciation.run.runCreate>) => api.functional.erp.depreciation.run.runCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinanceCreditMemoCreditMemoCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.credit_memo.creditMemoCreate>) => api.functional.erp.extended_finance.credit_memo.creditMemoCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinanceCreditMemoPostCreditMemoPost() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.credit_memo.post.creditMemoPost>) => api.functional.erp.extended_finance.credit_memo.post.creditMemoPost(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinancePurchaseReturnPostPurchaseReturnPost() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.purchase_return.post.purchaseReturnPost>) => api.functional.erp.extended_finance.purchase_return.post.purchaseReturnPost(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinancePurchaseReturnPurchaseReturnCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.purchase_return.purchaseReturnCreate>) => api.functional.erp.extended_finance.purchase_return.purchaseReturnCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinanceSalesReturnApproveSalesReturnApprove() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.sales_return.approve.salesReturnApprove>) => api.functional.erp.extended_finance.sales_return.approve.salesReturnApprove(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinanceSalesReturnCancelSalesReturnCancel() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.sales_return.cancel.salesReturnCancel>) => api.functional.erp.extended_finance.sales_return.cancel.salesReturnCancel(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinanceSalesReturnReceiveSalesReturnReceive() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.sales_return.receive.salesReturnReceive>) => api.functional.erp.extended_finance.sales_return.receive.salesReturnReceive(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinanceSalesReturnRefundSalesReturnRefund() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.sales_return.refund.salesReturnRefund>) => api.functional.erp.extended_finance.sales_return.refund.salesReturnRefund(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinanceSalesReturnRejectSalesReturnReject() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.sales_return.reject.salesReturnReject>) => api.functional.erp.extended_finance.sales_return.reject.salesReturnReject(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinanceSalesReturnSalesReturnCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.sales_return.salesReturnCreate>) => api.functional.erp.extended_finance.sales_return.salesReturnCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinanceSalesReturnSalesReturnUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.sales_return.salesReturnUpdate>) => api.functional.erp.extended_finance.sales_return.salesReturnUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinanceVendorBillBillCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.vendor_bill.billCreate>) => api.functional.erp.extended_finance.vendor_bill.billCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinanceVendorBillBillIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.vendor_bill.billIndex>) => api.functional.erp.extended_finance.vendor_bill.billIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinanceVendorBillBillTransition() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.vendor_bill.billTransition>) => api.functional.erp.extended_finance.vendor_bill.billTransition(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinanceVendorBillBillUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.vendor_bill.billUpdate>) => api.functional.erp.extended_finance.vendor_bill.billUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinanceVendorBillMatchBillMatch() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.vendor_bill.match.billMatch>) => api.functional.erp.extended_finance.vendor_bill.match.billMatch(apiConnection, ...args),
  });
}

export function useGeneratedErpExtendedFinanceVendorBillPostBillPost() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.extended_finance.vendor_bill.post.billPost>) => api.functional.erp.extended_finance.vendor_bill.post.billPost(apiConnection, ...args),
  });
}

export function useGeneratedErpFinancialCenterCostCostCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.financial_center.cost.costCreate>) => api.functional.erp.financial_center.cost.costCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpFinancialCenterCostCostIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.financial_center.cost.costIndex>) => api.functional.erp.financial_center.cost.costIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpFinancialCenterCostCostState() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.financial_center.cost.costState>) => api.functional.erp.financial_center.cost.costState(apiConnection, ...args),
  });
}

export function useGeneratedErpFinancialCenterCostCostUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.financial_center.cost.costUpdate>) => api.functional.erp.financial_center.cost.costUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpFinancialCenterProfitProfitCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.financial_center.profit.profitCreate>) => api.functional.erp.financial_center.profit.profitCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpFinancialCenterProfitProfitIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.financial_center.profit.profitIndex>) => api.functional.erp.financial_center.profit.profitIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpFinancialCenterProfitProfitState() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.financial_center.profit.profitState>) => api.functional.erp.financial_center.profit.profitState(apiConnection, ...args),
  });
}

export function useGeneratedErpFinancialCenterProfitProfitUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.financial_center.profit.profitUpdate>) => api.functional.erp.financial_center.profit.profitUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpInteractionAttachmentAttachmentCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.interaction.attachment.attachmentCreate>) => api.functional.erp.interaction.attachment.attachmentCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpInteractionAttachmentAttachmentErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.interaction.attachment.attachmentErase>) => api.functional.erp.interaction.attachment.attachmentErase(apiConnection, ...args),
  });
}

export function useGeneratedErpInteractionAttachmentAttachmentIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.interaction.attachment.attachmentIndex>) => api.functional.erp.interaction.attachment.attachmentIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpInteractionCommentCommentCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.interaction.comment.commentCreate>) => api.functional.erp.interaction.comment.commentCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpInteractionCommentCommentErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.interaction.comment.commentErase>) => api.functional.erp.interaction.comment.commentErase(apiConnection, ...args),
  });
}

export function useGeneratedErpInteractionCommentCommentIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.interaction.comment.commentIndex>) => api.functional.erp.interaction.comment.commentIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpInteractionCommentCommentUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.interaction.comment.commentUpdate>) => api.functional.erp.interaction.comment.commentUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpInteractionTagAssignTagAssign() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.interaction.tag.assign.tagAssign>) => api.functional.erp.interaction.tag.assign.tagAssign(apiConnection, ...args),
  });
}

export function useGeneratedErpInteractionTagAssignTagUnassign() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.interaction.tag.assign.tagUnassign>) => api.functional.erp.interaction.tag.assign.tagUnassign(apiConnection, ...args),
  });
}

export function useGeneratedErpInteractionTagTagCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.interaction.tag.tagCreate>) => api.functional.erp.interaction.tag.tagCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpInteractionTagTagErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.interaction.tag.tagErase>) => api.functional.erp.interaction.tag.tagErase(apiConnection, ...args),
  });
}

export function useGeneratedErpInteractionTagTagIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.interaction.tag.tagIndex>) => api.functional.erp.interaction.tag.tagIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpInteractionTagTagUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.interaction.tag.tagUpdate>) => api.functional.erp.interaction.tag.tagUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryAdjustmentAdjustmentCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.adjustment.adjustmentCreate>) => api.functional.erp.inventory.adjustment.adjustmentCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryAdjustmentPostAdjustmentPost() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.adjustment.post.adjustmentPost>) => api.functional.erp.inventory.adjustment.post.adjustmentPost(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryAdjustmentReverseAdjustmentReverse() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.adjustment.reverse.adjustmentReverse>) => api.functional.erp.inventory.adjustment.reverse.adjustmentReverse(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryAdjustmentTransitionAdjustmentTransition() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.adjustment.transition.adjustmentTransition>) => api.functional.erp.inventory.adjustment.transition.adjustmentTransition(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryCycleCountApproveCycleApprove() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.cycle_count.approve.cycleApprove>) => api.functional.erp.inventory.cycle_count.approve.cycleApprove(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryCycleCountCycleCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.cycle_count.cycleCreate>) => api.functional.erp.inventory.cycle_count.cycleCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryCycleCountCycleIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.cycle_count.cycleIndex>) => api.functional.erp.inventory.cycle_count.cycleIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryCycleCountPerformCyclePerform() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.cycle_count.perform.cyclePerform>) => api.functional.erp.inventory.cycle_count.perform.cyclePerform(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryCycleCountPostCyclePost() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.cycle_count.post.cyclePost>) => api.functional.erp.inventory.cycle_count.post.cyclePost(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryCycleCountRejectCycleReject() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.cycle_count.reject.cycleReject>) => api.functional.erp.inventory.cycle_count.reject.cycleReject(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryCycleCountSubmitCycleSubmit() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.cycle_count.submit.cycleSubmit>) => api.functional.erp.inventory.cycle_count.submit.cycleSubmit(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryTransferCancelTransferCancel() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.transfer.cancel.transferCancel>) => api.functional.erp.inventory.transfer.cancel.transferCancel(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryTransferReceiveTransferReceive() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.transfer.receive.transferReceive>) => api.functional.erp.inventory.transfer.receive.transferReceive(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryTransferShipTransferShip() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.transfer.ship.transferShip>) => api.functional.erp.inventory.transfer.ship.transferShip(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryTransferTransferCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.transfer.transferCreate>) => api.functional.erp.inventory.transfer.transferCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryTransferTransferIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.transfer.transferIndex>) => api.functional.erp.inventory.transfer.transferIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpInventoryTransferTransferUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.inventory.transfer.transferUpdate>) => api.functional.erp.inventory.transfer.transferUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpItemItemAt() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.item.itemAt>) => api.functional.erp.item.itemAt(apiConnection, ...args),
  });
}

export function useGeneratedErpItemItemCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.item.itemCreate>) => api.functional.erp.item.itemCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpItemItemErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.item.itemErase>) => api.functional.erp.item.itemErase(apiConnection, ...args),
  });
}

export function useGeneratedErpItemItemIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.item.itemIndex>) => api.functional.erp.item.itemIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpItemItemUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.item.itemUpdate>) => api.functional.erp.item.itemUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpJournalVoidVoidEntry() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.journal._void.voidEntry>) => api.functional.erp.journal._void.voidEntry(apiConnection, ...args),
  });
}

export function useGeneratedErpJournalAdjust() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.journal.adjust>) => api.functional.erp.journal.adjust(apiConnection, ...args),
  });
}

export function useGeneratedErpJournalAt() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.journal.at>) => api.functional.erp.journal.at(apiConnection, ...args),
  });
}

export function useGeneratedErpJournalCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.journal.create>) => api.functional.erp.journal.create(apiConnection, ...args),
  });
}

export function useGeneratedErpJournalErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.journal.erase>) => api.functional.erp.journal.erase(apiConnection, ...args),
  });
}

export function useGeneratedErpJournalIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.journal.index>) => api.functional.erp.journal.index(apiConnection, ...args),
  });
}

export function useGeneratedErpJournalPost() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.journal.post>) => api.functional.erp.journal.post(apiConnection, ...args),
  });
}

export function useGeneratedErpJournalReverse() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.journal.reverse>) => api.functional.erp.journal.reverse(apiConnection, ...args),
  });
}

export function useGeneratedErpJournalUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.journal.update>) => api.functional.erp.journal.update(apiConnection, ...args),
  });
}

export function useGeneratedErpLocationLocationCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.location.locationCreate>) => api.functional.erp.location.locationCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpLocationLocationErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.location.locationErase>) => api.functional.erp.location.locationErase(apiConnection, ...args),
  });
}

export function useGeneratedErpLocationLocationIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.location.locationIndex>) => api.functional.erp.location.locationIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpLocationLocationUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.location.locationUpdate>) => api.functional.erp.location.locationUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpManufacturingResourceMachineEquipmentMachineLink() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.manufacturing_resource.machine.equipment.machineLink>) => api.functional.erp.manufacturing_resource.machine.equipment.machineLink(apiConnection, ...args),
  });
}

export function useGeneratedErpManufacturingResourceMachineMachineCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.manufacturing_resource.machine.machineCreate>) => api.functional.erp.manufacturing_resource.machine.machineCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpManufacturingResourceMachineMachineIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.manufacturing_resource.machine.machineIndex>) => api.functional.erp.manufacturing_resource.machine.machineIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpManufacturingResourceMachineMachineUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.manufacturing_resource.machine.machineUpdate>) => api.functional.erp.manufacturing_resource.machine.machineUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpManufacturingResourceMachineRetireMachineRetire() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.manufacturing_resource.machine.retire.machineRetire>) => api.functional.erp.manufacturing_resource.machine.retire.machineRetire(apiConnection, ...args),
  });
}

export function useGeneratedErpManufacturingResourceWorkCenterWorkCenterCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.manufacturing_resource.work_center.workCenterCreate>) => api.functional.erp.manufacturing_resource.work_center.workCenterCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpManufacturingResourceWorkCenterWorkCenterIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.manufacturing_resource.work_center.workCenterIndex>) => api.functional.erp.manufacturing_resource.work_center.workCenterIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpManufacturingResourceWorkCenterWorkCenterState() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.manufacturing_resource.work_center.workCenterState>) => api.functional.erp.manufacturing_resource.work_center.workCenterState(apiConnection, ...args),
  });
}

export function useGeneratedErpManufacturingResourceWorkCenterWorkCenterUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.manufacturing_resource.work_center.workCenterUpdate>) => api.functional.erp.manufacturing_resource.work_center.workCenterUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpMrpRecommendationRecommendationState() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.mrp.recommendation.recommendationState>) => api.functional.erp.mrp.recommendation.recommendationState(apiConnection, ...args),
  });
}

export function useGeneratedErpMrpRunRecommendationRecommendationIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.mrp.run.recommendation.recommendationIndex>) => api.functional.erp.mrp.run.recommendation.recommendationIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpMrpRunRunCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.mrp.run.runCreate>) => api.functional.erp.mrp.run.runCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpMrpRunRunIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.mrp.run.runIndex>) => api.functional.erp.mrp.run.runIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsAssetAssetCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.asset.assetCreate>) => api.functional.erp.operations.asset.assetCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsAssetAssetIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.asset.assetIndex>) => api.functional.erp.operations.asset.assetIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsAssetAssetUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.asset.assetUpdate>) => api.functional.erp.operations.asset.assetUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsBomActivateBomActivate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.bom.activate.bomActivate>) => api.functional.erp.operations.bom.activate.bomActivate(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsBomBomCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.bom.bomCreate>) => api.functional.erp.operations.bom.bomCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsBomBomIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.bom.bomIndex>) => api.functional.erp.operations.bom.bomIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsBudgetActivateBudgetActivate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.budget.activate.budgetActivate>) => api.functional.erp.operations.budget.activate.budgetActivate(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsBudgetBudgetCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.budget.budgetCreate>) => api.functional.erp.operations.budget.budgetCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsBudgetBudgetIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.budget.budgetIndex>) => api.functional.erp.operations.budget.budgetIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsBudgetCloseBudgetClose() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.budget.close.budgetClose>) => api.functional.erp.operations.budget.close.budgetClose(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsEquipmentEquipmentCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.equipment.equipmentCreate>) => api.functional.erp.operations.equipment.equipmentCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsEquipmentEquipmentIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.equipment.equipmentIndex>) => api.functional.erp.operations.equipment.equipmentIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsEquipmentEquipmentState() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.equipment.equipmentState>) => api.functional.erp.operations.equipment.equipmentState(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsEquipmentEquipmentUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.equipment.equipmentUpdate>) => api.functional.erp.operations.equipment.equipmentUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsInspectionInspectionCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.inspection.inspectionCreate>) => api.functional.erp.operations.inspection.inspectionCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsInspectionInspectionFinalize() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.inspection.inspectionFinalize>) => api.functional.erp.operations.inspection.inspectionFinalize(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsInspectionPartialAcceptInspectionPartialAccept() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.inspection.partial_accept.inspectionPartialAccept>) => api.functional.erp.operations.inspection.partial_accept.inspectionPartialAccept(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsInspectionResultsInspectionResults() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.inspection.results.inspectionResults>) => api.functional.erp.operations.inspection.results.inspectionResults(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsInspectionStartInspectionStart() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.inspection.start.inspectionStart>) => api.functional.erp.operations.inspection.start.inspectionStart(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsInspectionWaiveInspectionWaive() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.inspection.waive.inspectionWaive>) => api.functional.erp.operations.inspection.waive.inspectionWaive(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsMaintenanceAssignMaintenanceAssign() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.maintenance.assign.maintenanceAssign>) => api.functional.erp.operations.maintenance.assign.maintenanceAssign(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsMaintenanceCancelMaintenanceCancel() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.maintenance.cancel.maintenanceCancel>) => api.functional.erp.operations.maintenance.cancel.maintenanceCancel(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsMaintenanceCompleteMaintenanceComplete() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.maintenance.complete.maintenanceComplete>) => api.functional.erp.operations.maintenance.complete.maintenanceComplete(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsMaintenanceDowntimeMaintenanceDowntime() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.maintenance.downtime.maintenanceDowntime>) => api.functional.erp.operations.maintenance.downtime.maintenanceDowntime(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsMaintenanceLaborMaintenanceLabor() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.maintenance.labor.maintenanceLabor>) => api.functional.erp.operations.maintenance.labor.maintenanceLabor(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsMaintenanceLaborPostMaintenanceLaborPost() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.maintenance.labor.post.maintenanceLaborPost>) => api.functional.erp.operations.maintenance.labor.post.maintenanceLaborPost(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsMaintenanceMaintenanceCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.maintenance.maintenanceCreate>) => api.functional.erp.operations.maintenance.maintenanceCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsMaintenanceMaintenanceUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.maintenance.maintenanceUpdate>) => api.functional.erp.operations.maintenance.maintenanceUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsMaintenancePartMaintenancePart() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.maintenance.part.maintenancePart>) => api.functional.erp.operations.maintenance.part.maintenancePart(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsMaintenanceStartMaintenanceStart() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.maintenance.start.maintenanceStart>) => api.functional.erp.operations.maintenance.start.maintenanceStart(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsProductionApproveProductionApprove() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.production.approve.productionApprove>) => api.functional.erp.operations.production.approve.productionApprove(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsProductionCancelProductionCancel() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.production.cancel.productionCancel>) => api.functional.erp.operations.production.cancel.productionCancel(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsProductionCloseProductionClose() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.production.close.productionClose>) => api.functional.erp.operations.production.close.productionClose(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsProductionConsumeProductionConsume() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.production.consume.productionConsume>) => api.functional.erp.operations.production.consume.productionConsume(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsProductionOutputProductionOutput() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.production.output.productionOutput>) => api.functional.erp.operations.production.output.productionOutput(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsProductionProductionCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.production.productionCreate>) => api.functional.erp.operations.production.productionCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsProductionProductionIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.production.productionIndex>) => api.functional.erp.operations.production.productionIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsProductionProductionUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.production.productionUpdate>) => api.functional.erp.operations.production.productionUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsProductionRejectProductionReject() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.production.reject.productionReject>) => api.functional.erp.operations.production.reject.productionReject(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsProductionReleaseProductionRelease() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.production.release.productionRelease>) => api.functional.erp.operations.production.release.productionRelease(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsProductionScrapProductionScrap() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.production.scrap.productionScrap>) => api.functional.erp.operations.production.scrap.productionScrap(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsProductionStartProductionStart() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.production.start.productionStart>) => api.functional.erp.operations.production.start.productionStart(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsProductionSubmitProductionSubmit() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.production.submit.productionSubmit>) => api.functional.erp.operations.production.submit.productionSubmit(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsRoutingActivateRoutingActivate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.routing.activate.routingActivate>) => api.functional.erp.operations.routing.activate.routingActivate(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsRoutingRoutingCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.routing.routingCreate>) => api.functional.erp.operations.routing.routingCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsRoutingRoutingIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.routing.routingIndex>) => api.functional.erp.operations.routing.routingIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsServiceServiceCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.service.serviceCreate>) => api.functional.erp.operations.service.serviceCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsServiceServiceIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.service.serviceIndex>) => api.functional.erp.operations.service.serviceIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsServiceServiceState() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.service.serviceState>) => api.functional.erp.operations.service.serviceState(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationsServiceServiceUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.operations.service.serviceUpdate>) => api.functional.erp.operations.service.serviceUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpOrganizationAt() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.organization.at>) => api.functional.erp.organization.at(apiConnection, ...args),
  });
}

export function useGeneratedErpOrganizationDeletionCheckDeletionCheck() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.organization.deletion_check.deletionCheck>) => api.functional.erp.organization.deletion_check.deletionCheck(apiConnection, ...args),
  });
}

export function useGeneratedErpOrganizationErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.organization.erase>) => api.functional.erp.organization.erase(apiConnection, ...args),
  });
}

export function useGeneratedErpOrganizationInvitationInvite() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.organization.invitation.invite>) => api.functional.erp.organization.invitation.invite(apiConnection, ...args),
  });
}

export function useGeneratedErpOrganizationMembershipMemberships() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.organization.membership.memberships>) => api.functional.erp.organization.membership.memberships(apiConnection, ...args),
  });
}

export function useGeneratedErpOrganizationMembershipReactivate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.organization.membership.reactivate>) => api.functional.erp.organization.membership.reactivate(apiConnection, ...args),
  });
}

export function useGeneratedErpOrganizationMembershipRevoke() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.organization.membership.revoke>) => api.functional.erp.organization.membership.revoke(apiConnection, ...args),
  });
}

export function useGeneratedErpOrganizationMembershipSuspend() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.organization.membership.suspend>) => api.functional.erp.organization.membership.suspend(apiConnection, ...args),
  });
}

export function useGeneratedErpOrganizationRoleCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.organization.role.create>) => api.functional.erp.organization.role.create(apiConnection, ...args),
  });
}

export function useGeneratedErpOrganizationRoleErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.organization.role.erase>) => api.functional.erp.organization.role.erase(apiConnection, ...args),
  });
}

export function useGeneratedErpOrganizationRoleIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.organization.role.index>) => api.functional.erp.organization.role.index(apiConnection, ...args),
  });
}

export function useGeneratedErpOrganizationRoleMembershipAssign() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.organization.role.membership.assign>) => api.functional.erp.organization.role.membership.assign(apiConnection, ...args),
  });
}

export function useGeneratedErpOrganizationRoleMembershipRevoke() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.organization.role.membership.revoke>) => api.functional.erp.organization.role.membership.revoke(apiConnection, ...args),
  });
}

export function useGeneratedErpOrganizationRoleUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.organization.role.update>) => api.functional.erp.organization.role.update(apiConnection, ...args),
  });
}

export function useGeneratedErpOrganizationUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.organization.update>) => api.functional.erp.organization.update(apiConnection, ...args),
  });
}

export function useGeneratedErpPartyChangeRequestApplyPartyChangeApply() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.party.change_request.apply.partyChangeApply>) => api.functional.erp.party.change_request.apply.partyChangeApply(apiConnection, ...args),
  });
}

export function useGeneratedErpPartyChangeRequestPartyChangeCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.party.change_request.partyChangeCreate>) => api.functional.erp.party.change_request.partyChangeCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpPartyChangeRequestPartyChangeIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.party.change_request.partyChangeIndex>) => api.functional.erp.party.change_request.partyChangeIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpPartyChangeRequestTransitionPartyChangeResolve() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.party.change_request.transition.partyChangeResolve>) => api.functional.erp.party.change_request.transition.partyChangeResolve(apiConnection, ...args),
  });
}

export function useGeneratedErpPartyPartyAt() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.party.partyAt>) => api.functional.erp.party.partyAt(apiConnection, ...args),
  });
}

export function useGeneratedErpPartyPartyCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.party.partyCreate>) => api.functional.erp.party.partyCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpPartyPartyErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.party.partyErase>) => api.functional.erp.party.partyErase(apiConnection, ...args),
  });
}

export function useGeneratedErpPartyPartyIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.party.partyIndex>) => api.functional.erp.party.partyIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpPartyPartyUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.party.partyUpdate>) => api.functional.erp.party.partyUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpPayrollSetupConfigurationConfigurationCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.payroll_setup.configuration.configurationCreate>) => api.functional.erp.payroll_setup.configuration.configurationCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpPayrollSetupConfigurationConfigurationIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.payroll_setup.configuration.configurationIndex>) => api.functional.erp.payroll_setup.configuration.configurationIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpPayrollSetupConfigurationConfigurationUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.payroll_setup.configuration.configurationUpdate>) => api.functional.erp.payroll_setup.configuration.configurationUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpPayrollSetupScheduleScheduleCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.payroll_setup.schedule.scheduleCreate>) => api.functional.erp.payroll_setup.schedule.scheduleCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpPayrollSetupScheduleScheduleIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.payroll_setup.schedule.scheduleIndex>) => api.functional.erp.payroll_setup.schedule.scheduleIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpPayrollSetupScheduleScheduleUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.payroll_setup.schedule.scheduleUpdate>) => api.functional.erp.payroll_setup.schedule.scheduleUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpProjectsDepartmentDeactivateDepartmentDeactivate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.projects.department.deactivate.departmentDeactivate>) => api.functional.erp.projects.department.deactivate.departmentDeactivate(apiConnection, ...args),
  });
}

export function useGeneratedErpProjectsDepartmentDepartmentCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.projects.department.departmentCreate>) => api.functional.erp.projects.department.departmentCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpProjectsDepartmentDepartmentIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.projects.department.departmentIndex>) => api.functional.erp.projects.department.departmentIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpProjectsDepartmentManagerDepartmentManager() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.projects.department.manager.departmentManager>) => api.functional.erp.projects.department.manager.departmentManager(apiConnection, ...args),
  });
}

export function useGeneratedErpProjectsProjectManagerProjectManager() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.projects.project.manager.projectManager>) => api.functional.erp.projects.project.manager.projectManager(apiConnection, ...args),
  });
}

export function useGeneratedErpProjectsProjectMemberMemberCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.projects.project.member.memberCreate>) => api.functional.erp.projects.project.member.memberCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpProjectsProjectMemberMemberErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.projects.project.member.memberErase>) => api.functional.erp.projects.project.member.memberErase(apiConnection, ...args),
  });
}

export function useGeneratedErpProjectsProjectMemberMemberIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.projects.project.member.memberIndex>) => api.functional.erp.projects.project.member.memberIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpProjectsProjectMemberMemberUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.projects.project.member.memberUpdate>) => api.functional.erp.projects.project.member.memberUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpProjectsProjectProjectCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.projects.project.projectCreate>) => api.functional.erp.projects.project.projectCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpProjectsProjectProjectIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.projects.project.projectIndex>) => api.functional.erp.projects.project.projectIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpProjectsProjectProjectUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.projects.project.projectUpdate>) => api.functional.erp.projects.project.projectUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpProjectsProjectTaskTaskIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.projects.project.task.taskIndex>) => api.functional.erp.projects.project.task.taskIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpProjectsTaskHistoryTaskHistory() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.projects.task.history.taskHistory>) => api.functional.erp.projects.task.history.taskHistory(apiConnection, ...args),
  });
}

export function useGeneratedErpProjectsTaskTaskCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.projects.task.taskCreate>) => api.functional.erp.projects.task.taskCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpProjectsTaskTaskUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.projects.task.taskUpdate>) => api.functional.erp.projects.task.taskUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseOrderChangeRequestOrderChangeRequest() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.order.change_request.orderChangeRequest>) => api.functional.erp.purchase.order.change_request.orderChangeRequest(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseOrderOrderAt() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.order.orderAt>) => api.functional.erp.purchase.order.orderAt(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseOrderOrderCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.order.orderCreate>) => api.functional.erp.purchase.order.orderCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseOrderOrderErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.order.orderErase>) => api.functional.erp.purchase.order.orderErase(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseOrderOrderIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.order.orderIndex>) => api.functional.erp.purchase.order.orderIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseOrderOrderTransition() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.order.orderTransition>) => api.functional.erp.purchase.order.orderTransition(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseOrderOrderUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.order.orderUpdate>) => api.functional.erp.purchase.order.orderUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseOrderChangeApplyOrderChangeApply() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.order_change.apply.orderChangeApply>) => api.functional.erp.purchase.order_change.apply.orderChangeApply(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseReceiptPostReceiptPost() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.receipt.post.receiptPost>) => api.functional.erp.purchase.receipt.post.receiptPost(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseReceiptReceiptAt() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.receipt.receiptAt>) => api.functional.erp.purchase.receipt.receiptAt(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseReceiptReceiptCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.receipt.receiptCreate>) => api.functional.erp.purchase.receipt.receiptCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseRequestRequestAt() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.request.requestAt>) => api.functional.erp.purchase.request.requestAt(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseRequestRequestCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.request.requestCreate>) => api.functional.erp.purchase.request.requestCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseRequestRequestErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.request.requestErase>) => api.functional.erp.purchase.request.requestErase(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseRequestRequestIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.request.requestIndex>) => api.functional.erp.purchase.request.requestIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseRequestRequestTransition() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.request.requestTransition>) => api.functional.erp.purchase.request.requestTransition(apiConnection, ...args),
  });
}

export function useGeneratedErpPurchaseRequestRequestUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.purchase.request.requestUpdate>) => api.functional.erp.purchase.request.requestUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpQualityMaintenancePlanInspectionDeactivateInspectionDeactivate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.quality_maintenance_plan.inspection.deactivate.inspectionDeactivate>) => api.functional.erp.quality_maintenance_plan.inspection.deactivate.inspectionDeactivate(apiConnection, ...args),
  });
}

export function useGeneratedErpQualityMaintenancePlanInspectionInspectionCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.quality_maintenance_plan.inspection.inspectionCreate>) => api.functional.erp.quality_maintenance_plan.inspection.inspectionCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpQualityMaintenancePlanInspectionInspectionIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.quality_maintenance_plan.inspection.inspectionIndex>) => api.functional.erp.quality_maintenance_plan.inspection.inspectionIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpQualityMaintenancePlanInspectionInspectionUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.quality_maintenance_plan.inspection.inspectionUpdate>) => api.functional.erp.quality_maintenance_plan.inspection.inspectionUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpQualityMaintenancePlanMaintenanceDeactivateMaintenanceDeactivate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.quality_maintenance_plan.maintenance.deactivate.maintenanceDeactivate>) => api.functional.erp.quality_maintenance_plan.maintenance.deactivate.maintenanceDeactivate(apiConnection, ...args),
  });
}

export function useGeneratedErpQualityMaintenancePlanMaintenanceGenerateMaintenanceGenerate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.quality_maintenance_plan.maintenance.generate.maintenanceGenerate>) => api.functional.erp.quality_maintenance_plan.maintenance.generate.maintenanceGenerate(apiConnection, ...args),
  });
}

export function useGeneratedErpQualityMaintenancePlanMaintenanceMaintenanceCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.quality_maintenance_plan.maintenance.maintenanceCreate>) => api.functional.erp.quality_maintenance_plan.maintenance.maintenanceCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpQualityMaintenancePlanMaintenanceMaintenanceIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.quality_maintenance_plan.maintenance.maintenanceIndex>) => api.functional.erp.quality_maintenance_plan.maintenance.maintenanceIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpQualityMaintenancePlanMaintenanceMaintenanceUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.quality_maintenance_plan.maintenance.maintenanceUpdate>) => api.functional.erp.quality_maintenance_plan.maintenance.maintenanceUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpQuarantineCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.quarantine.create>) => api.functional.erp.quarantine.create(apiConnection, ...args),
  });
}

export function useGeneratedErpQuarantineDisposition() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.quarantine.disposition>) => api.functional.erp.quarantine.disposition(apiConnection, ...args),
  });
}

export function useGeneratedErpQuarantineIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.quarantine.index>) => api.functional.erp.quarantine.index(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesOrderApproveOrderApprove() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales.order.approve.orderApprove>) => api.functional.erp.sales.order.approve.orderApprove(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesOrderOrderAt() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales.order.orderAt>) => api.functional.erp.sales.order.orderAt(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesOrderOrderCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales.order.orderCreate>) => api.functional.erp.sales.order.orderCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesOrderOrderErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales.order.orderErase>) => api.functional.erp.sales.order.orderErase(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesOrderOrderIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales.order.orderIndex>) => api.functional.erp.sales.order.orderIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesOrderOrderUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales.order.orderUpdate>) => api.functional.erp.sales.order.orderUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesOrderTransitionOrderTransition() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales.order.transition.orderTransition>) => api.functional.erp.sales.order.transition.orderTransition(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesShipmentCancelShipmentCancel() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales.shipment.cancel.shipmentCancel>) => api.functional.erp.sales.shipment.cancel.shipmentCancel(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesShipmentDeliverShipmentDeliver() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales.shipment.deliver.shipmentDeliver>) => api.functional.erp.sales.shipment.deliver.shipmentDeliver(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesShipmentPackShipmentPack() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales.shipment.pack.shipmentPack>) => api.functional.erp.sales.shipment.pack.shipmentPack(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesShipmentPickShipmentPick() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales.shipment.pick.shipmentPick>) => api.functional.erp.sales.shipment.pick.shipmentPick(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesShipmentPostShipmentPost() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales.shipment.post.shipmentPost>) => api.functional.erp.sales.shipment.post.shipmentPost(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesShipmentShipmentCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales.shipment.shipmentCreate>) => api.functional.erp.sales.shipment.shipmentCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinanceInvoiceVoidInvoiceVoid() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.invoice._void.invoiceVoid>) => api.functional.erp.sales_finance.invoice._void.invoiceVoid(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinanceInvoiceApproveInvoiceApprove() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.invoice.approve.invoiceApprove>) => api.functional.erp.sales_finance.invoice.approve.invoiceApprove(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinanceInvoiceInvoiceCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.invoice.invoiceCreate>) => api.functional.erp.sales_finance.invoice.invoiceCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinanceInvoiceInvoiceUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.invoice.invoiceUpdate>) => api.functional.erp.sales_finance.invoice.invoiceUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinanceInvoicePostInvoicePost() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.invoice.post.invoicePost>) => api.functional.erp.sales_finance.invoice.post.invoicePost(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinanceInvoiceSendInvoiceSend() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.invoice.send.invoiceSend>) => api.functional.erp.sales_finance.invoice.send.invoiceSend(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinanceInvoiceSubmitInvoiceSubmit() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.invoice.submit.invoiceSubmit>) => api.functional.erp.sales_finance.invoice.submit.invoiceSubmit(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinancePaymentAllocationPaymentAllocationCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.payment.allocation.paymentAllocationCreate>) => api.functional.erp.sales_finance.payment.allocation.paymentAllocationCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinancePaymentAllocationPaymentAllocationErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.payment.allocation.paymentAllocationErase>) => api.functional.erp.sales_finance.payment.allocation.paymentAllocationErase(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinancePaymentAllocationPaymentAllocationIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.payment.allocation.paymentAllocationIndex>) => api.functional.erp.sales_finance.payment.allocation.paymentAllocationIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinancePaymentAllocationPaymentAllocationUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.payment.allocation.paymentAllocationUpdate>) => api.functional.erp.sales_finance.payment.allocation.paymentAllocationUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinancePaymentPaymentCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.payment.paymentCreate>) => api.functional.erp.sales_finance.payment.paymentCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinancePaymentPaymentIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.payment.paymentIndex>) => api.functional.erp.sales_finance.payment.paymentIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinancePaymentPostPaymentPost() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.payment.post.paymentPost>) => api.functional.erp.sales_finance.payment.post.paymentPost(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinanceQuoteConvertQuoteConvert() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.quote.convert.quoteConvert>) => api.functional.erp.sales_finance.quote.convert.quoteConvert(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinanceQuoteQuoteCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.quote.quoteCreate>) => api.functional.erp.sales_finance.quote.quoteCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinanceQuoteQuoteIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.quote.quoteIndex>) => api.functional.erp.sales_finance.quote.quoteIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesFinanceQuoteQuoteTransition() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_finance.quote.quoteTransition>) => api.functional.erp.sales_finance.quote.quoteTransition(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesPriceCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_price.create>) => api.functional.erp.sales_price.create(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesPriceDeactivate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_price.deactivate>) => api.functional.erp.sales_price.deactivate(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesPriceIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_price.index>) => api.functional.erp.sales_price.index(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesPriceResolve() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_price.resolve>) => api.functional.erp.sales_price.resolve(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesQuoteConvert() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_quote.convert>) => api.functional.erp.sales_quote.convert(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesQuoteCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_quote.create>) => api.functional.erp.sales_quote.create(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesQuoteIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_quote.index>) => api.functional.erp.sales_quote.index(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesQuoteState() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_quote.state>) => api.functional.erp.sales_quote.state(apiConnection, ...args),
  });
}

export function useGeneratedErpSalesQuoteUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.sales_quote.update>) => api.functional.erp.sales_quote.update(apiConnection, ...args),
  });
}

export function useGeneratedErpServiceOrderAssign() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.service_order.assign>) => api.functional.erp.service_order.assign(apiConnection, ...args),
  });
}

export function useGeneratedErpServiceOrderCancel() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.service_order.cancel>) => api.functional.erp.service_order.cancel(apiConnection, ...args),
  });
}

export function useGeneratedErpServiceOrderComplete() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.service_order.complete>) => api.functional.erp.service_order.complete(apiConnection, ...args),
  });
}

export function useGeneratedErpServiceOrderCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.service_order.create>) => api.functional.erp.service_order.create(apiConnection, ...args),
  });
}

export function useGeneratedErpServiceOrderIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.service_order.index>) => api.functional.erp.service_order.index(apiConnection, ...args),
  });
}

export function useGeneratedErpServiceOrderStart() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.service_order.start>) => api.functional.erp.service_order.start(apiConnection, ...args),
  });
}

export function useGeneratedErpServiceOrderUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.service_order.update>) => api.functional.erp.service_order.update(apiConnection, ...args),
  });
}

export function useGeneratedErpStockBalanceBalanceIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.stock.balance.balanceIndex>) => api.functional.erp.stock.balance.balanceIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpStockMovementMovementIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.stock.movement.movementIndex>) => api.functional.erp.stock.movement.movementIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpTaxReturnAmend() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.tax_return.amend>) => api.functional.erp.tax_return.amend(apiConnection, ...args),
  });
}

export function useGeneratedErpTaxReturnApprove() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.tax_return.approve>) => api.functional.erp.tax_return.approve(apiConnection, ...args),
  });
}

export function useGeneratedErpTaxReturnCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.tax_return.create>) => api.functional.erp.tax_return.create(apiConnection, ...args),
  });
}

export function useGeneratedErpTaxReturnFile() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.tax_return.file>) => api.functional.erp.tax_return.file(apiConnection, ...args),
  });
}

export function useGeneratedErpTaxReturnIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.tax_return.index>) => api.functional.erp.tax_return.index(apiConnection, ...args),
  });
}

export function useGeneratedErpTaxReturnReconcile() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.tax_return.reconcile>) => api.functional.erp.tax_return.reconcile(apiConnection, ...args),
  });
}

export function useGeneratedErpUnitUnitCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.unit.unitCreate>) => api.functional.erp.unit.unitCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpUnitUnitErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.unit.unitErase>) => api.functional.erp.unit.unitErase(apiConnection, ...args),
  });
}

export function useGeneratedErpUnitUnitIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.unit.unitIndex>) => api.functional.erp.unit.unitIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpUnitUnitUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.unit.unitUpdate>) => api.functional.erp.unit.unitUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpVendorCreditApply() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.vendor_credit.apply>) => api.functional.erp.vendor_credit.apply(apiConnection, ...args),
  });
}

export function useGeneratedErpVendorCreditCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.vendor_credit.create>) => api.functional.erp.vendor_credit.create(apiConnection, ...args),
  });
}

export function useGeneratedErpVendorCreditIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.vendor_credit.index>) => api.functional.erp.vendor_credit.index(apiConnection, ...args),
  });
}

export function useGeneratedErpVendorCreditRefund() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.vendor_credit.refund>) => api.functional.erp.vendor_credit.refund(apiConnection, ...args),
  });
}

export function useGeneratedErpWarehouseWarehouseAt() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.warehouse.warehouseAt>) => api.functional.erp.warehouse.warehouseAt(apiConnection, ...args),
  });
}

export function useGeneratedErpWarehouseWarehouseCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.warehouse.warehouseCreate>) => api.functional.erp.warehouse.warehouseCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpWarehouseWarehouseErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.warehouse.warehouseErase>) => api.functional.erp.warehouse.warehouseErase(apiConnection, ...args),
  });
}

export function useGeneratedErpWarehouseWarehouseIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.warehouse.warehouseIndex>) => api.functional.erp.warehouse.warehouseIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpWarehouseWarehouseUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.warehouse.warehouseUpdate>) => api.functional.erp.warehouse.warehouseUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforceContractContractCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.contract.contractCreate>) => api.functional.erp.workforce.contract.contractCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforceContractContractIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.contract.contractIndex>) => api.functional.erp.workforce.contract.contractIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforceEmployeeEmployeeCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.employee.employeeCreate>) => api.functional.erp.workforce.employee.employeeCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforceEmployeeEmployeeIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.employee.employeeIndex>) => api.functional.erp.workforce.employee.employeeIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforceEmployeeEmployeeUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.employee.employeeUpdate>) => api.functional.erp.workforce.employee.employeeUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforcePayrollAdjustPayrollAdjust() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.payroll.adjust.payrollAdjust>) => api.functional.erp.workforce.payroll.adjust.payrollAdjust(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforcePayrollApprovePayrollApprove() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.payroll.approve.payrollApprove>) => api.functional.erp.workforce.payroll.approve.payrollApprove(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforcePayrollCalculatePayrollCalculate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.payroll.calculate.payrollCalculate>) => api.functional.erp.workforce.payroll.calculate.payrollCalculate(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforcePayrollPayPayrollPay() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.payroll.pay.payrollPay>) => api.functional.erp.workforce.payroll.pay.payrollPay(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforcePayrollPayrollCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.payroll.payrollCreate>) => api.functional.erp.workforce.payroll.payrollCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforcePayrollPayrollIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.payroll.payrollIndex>) => api.functional.erp.workforce.payroll.payrollIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforcePayrollPostPayrollPost() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.payroll.post.payrollPost>) => api.functional.erp.workforce.payroll.post.payrollPost(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforcePayrollPublishPayrollPublish() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.payroll.publish.payrollPublish>) => api.functional.erp.workforce.payroll.publish.payrollPublish(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforcePayrollReversePayrollReverse() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.payroll.reverse.payrollReverse>) => api.functional.erp.workforce.payroll.reverse.payrollReverse(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforcePayslipPayslipAt() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.payslip.payslipAt>) => api.functional.erp.workforce.payslip.payslipAt(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforcePayslipPayslipIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.payslip.payslipIndex>) => api.functional.erp.workforce.payslip.payslipIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforceTimelogTimelogCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.timelog.timelogCreate>) => api.functional.erp.workforce.timelog.timelogCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforceTimelogTimelogErase() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.timelog.timelogErase>) => api.functional.erp.workforce.timelog.timelogErase(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforceTimelogTimelogIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.timelog.timelogIndex>) => api.functional.erp.workforce.timelog.timelogIndex(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforceTimelogTimelogUpdate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.timelog.timelogUpdate>) => api.functional.erp.workforce.timelog.timelogUpdate(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforceTimesheetApproveTimesheetApprove() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.timesheet.approve.timesheetApprove>) => api.functional.erp.workforce.timesheet.approve.timesheetApprove(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforceTimesheetRejectTimesheetReject() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.timesheet.reject.timesheetReject>) => api.functional.erp.workforce.timesheet.reject.timesheetReject(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforceTimesheetReopenTimesheetReopen() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.timesheet.reopen.timesheetReopen>) => api.functional.erp.workforce.timesheet.reopen.timesheetReopen(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforceTimesheetSubmitTimesheetSubmit() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.timesheet.submit.timesheetSubmit>) => api.functional.erp.workforce.timesheet.submit.timesheetSubmit(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforceTimesheetTimesheetCreate() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.timesheet.timesheetCreate>) => api.functional.erp.workforce.timesheet.timesheetCreate(apiConnection, ...args),
  });
}

export function useGeneratedErpWorkforceTimesheetTimesheetIndex() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.erp.workforce.timesheet.timesheetIndex>) => api.functional.erp.workforce.timesheet.timesheetIndex(apiConnection, ...args),
  });
}

export function useGeneratedHealthGet() {
  return useMutation({
    mutationFn: (args: ErpAccessorArgs<typeof api.functional.health.get>) => api.functional.health.get(apiConnection, ...args),
  });
}

export function useGeneratedErpOperationCatalog() {
  const erpAccountAt = useGeneratedErpAccountAt();
  const erpAccountCreate = useGeneratedErpAccountCreate();
  const erpAccountErase = useGeneratedErpAccountErase();
  const erpAccountIndex = useGeneratedErpAccountIndex();
  const erpAccountMergeMergeExecute = useGeneratedErpAccountMergeMergeExecute();
  const erpAccountMergeRequestMergeRequest = useGeneratedErpAccountMergeRequestMergeRequest();
  const erpAccountUpdate = useGeneratedErpAccountUpdate();
  const erpAddressAddressAt = useGeneratedErpAddressAddressAt();
  const erpAddressAddressCreate = useGeneratedErpAddressAddressCreate();
  const erpAddressAddressErase = useGeneratedErpAddressAddressErase();
  const erpAddressAddressIndex = useGeneratedErpAddressAddressIndex();
  const erpAddressAddressUpdate = useGeneratedErpAddressAddressUpdate();
  const erpAllocationAvailabilityAvailabilityAt = useGeneratedErpAllocationAvailabilityAvailabilityAt();
  const erpAllocationCreate = useGeneratedErpAllocationCreate();
  const erpAllocationIndex = useGeneratedErpAllocationIndex();
  const erpAllocationRelease = useGeneratedErpAllocationRelease();
  const erpAllocationRuleActivate = useGeneratedErpAllocationRuleActivate();
  const erpAllocationRuleCreate = useGeneratedErpAllocationRuleCreate();
  const erpAllocationRuleDeactivate = useGeneratedErpAllocationRuleDeactivate();
  const erpAllocationRuleExecute = useGeneratedErpAllocationRuleExecute();
  const erpAllocationRuleExecutionPost = useGeneratedErpAllocationRuleExecutionPost();
  const erpAllocationRuleIndex = useGeneratedErpAllocationRuleIndex();
  const erpAllocationRuleUpdate = useGeneratedErpAllocationRuleUpdate();
  const erpAuthAccountDeactivateDeactivateAccount = useGeneratedErpAuthAccountDeactivateDeactivateAccount();
  const erpAuthInvitationAccept = useGeneratedErpAuthInvitationAccept();
  const erpAuthLogin = useGeneratedErpAuthLogin();
  const erpAuthMembershipSelect = useGeneratedErpAuthMembershipSelect();
  const erpAuthOrganization = useGeneratedErpAuthOrganization();
  const erpAuthPasswordChangePassword = useGeneratedErpAuthPasswordChangePassword();
  const erpAuthProfileProfile = useGeneratedErpAuthProfileProfile();
  const erpAuthProfileUpdateProfile = useGeneratedErpAuthProfileUpdateProfile();
  const erpAuthRecoveryCompleteRecoveryComplete = useGeneratedErpAuthRecoveryCompleteRecoveryComplete();
  const erpAuthRecoveryRequestRecoveryRequest = useGeneratedErpAuthRecoveryRequestRecoveryRequest();
  const erpAuthRefresh = useGeneratedErpAuthRefresh();
  const erpAuthSessionLogout = useGeneratedErpAuthSessionLogout();
  const erpAuthSessionsLogoutAll = useGeneratedErpAuthSessionsLogoutAll();
  const erpBankReconciliationCompleteReconciliationComplete = useGeneratedErpBankReconciliationCompleteReconciliationComplete();
  const erpBankReconciliationLineReconciliationLine = useGeneratedErpBankReconciliationLineReconciliationLine();
  const erpBankReconciliationReconciliationCreate = useGeneratedErpBankReconciliationReconciliationCreate();
  const erpBankReconciliationReopenReconciliationReopen = useGeneratedErpBankReconciliationReopenReconciliationReopen();
  const erpBankReconciliationReopenRequestReconciliationReopenRequest = useGeneratedErpBankReconciliationReopenRequestReconciliationReopenRequest();
  const erpBankTransactionImportTransactionImport = useGeneratedErpBankTransactionImportTransactionImport();
  const erpBankTransactionMatchTransactionMatch = useGeneratedErpBankTransactionMatchTransactionMatch();
  const erpBankTransactionTransactionCreate = useGeneratedErpBankTransactionTransactionCreate();
  const erpBankTransactionTransactionIndex = useGeneratedErpBankTransactionTransactionIndex();
  const erpBankTransactionTransactionResolve = useGeneratedErpBankTransactionTransactionResolve();
  const erpConfigCurrencyCurrencyCreate = useGeneratedErpConfigCurrencyCurrencyCreate();
  const erpConfigCurrencyCurrencyErase = useGeneratedErpConfigCurrencyCurrencyErase();
  const erpConfigCurrencyCurrencyIndex = useGeneratedErpConfigCurrencyCurrencyIndex();
  const erpConfigCurrencyCurrencyUpdate = useGeneratedErpConfigCurrencyCurrencyUpdate();
  const erpConfigExchangeRateRateCreate = useGeneratedErpConfigExchangeRateRateCreate();
  const erpConfigExchangeRateRateIndex = useGeneratedErpConfigExchangeRateRateIndex();
  const erpConfigPaymentTermTermCreate = useGeneratedErpConfigPaymentTermTermCreate();
  const erpConfigPaymentTermTermErase = useGeneratedErpConfigPaymentTermTermErase();
  const erpConfigPaymentTermTermIndex = useGeneratedErpConfigPaymentTermTermIndex();
  const erpConfigPaymentTermTermUpdate = useGeneratedErpConfigPaymentTermTermUpdate();
  const erpConfigTaxCodeTaxCodeCreate = useGeneratedErpConfigTaxCodeTaxCodeCreate();
  const erpConfigTaxCodeTaxCodeErase = useGeneratedErpConfigTaxCodeTaxCodeErase();
  const erpConfigTaxCodeTaxCodeIndex = useGeneratedErpConfigTaxCodeTaxCodeIndex();
  const erpConfigTaxCodeTaxCodeUpdate = useGeneratedErpConfigTaxCodeTaxCodeUpdate();
  const erpConfigTaxJurisdictionJurisdictionCreate = useGeneratedErpConfigTaxJurisdictionJurisdictionCreate();
  const erpConfigTaxJurisdictionJurisdictionErase = useGeneratedErpConfigTaxJurisdictionJurisdictionErase();
  const erpConfigTaxJurisdictionJurisdictionIndex = useGeneratedErpConfigTaxJurisdictionJurisdictionIndex();
  const erpConfigTaxJurisdictionJurisdictionUpdate = useGeneratedErpConfigTaxJurisdictionJurisdictionUpdate();
  const erpConfigTaxRateResolveTaxRateResolve = useGeneratedErpConfigTaxRateResolveTaxRateResolve();
  const erpConfigTaxRateTaxRateCreate = useGeneratedErpConfigTaxRateTaxRateCreate();
  const erpConfigExtDocumentNumberIssueNumberIssue = useGeneratedErpConfigExtDocumentNumberIssueNumberIssue();
  const erpConfigExtDocumentNumberNumberCreate = useGeneratedErpConfigExtDocumentNumberNumberCreate();
  const erpConfigExtDocumentNumberNumberIndex = useGeneratedErpConfigExtDocumentNumberNumberIndex();
  const erpConfigExtFiscalYearFiscalYearCreate = useGeneratedErpConfigExtFiscalYearFiscalYearCreate();
  const erpConfigExtFiscalYearFiscalYearIndex = useGeneratedErpConfigExtFiscalYearFiscalYearIndex();
  const erpConfigExtNotificationPreferencePreferenceAt = useGeneratedErpConfigExtNotificationPreferencePreferenceAt();
  const erpConfigExtNotificationPreferencePreferenceUpdate = useGeneratedErpConfigExtNotificationPreferencePreferenceUpdate();
  const erpContactContactCreate = useGeneratedErpContactContactCreate();
  const erpContactContactErase = useGeneratedErpContactContactErase();
  const erpContactContactIndex = useGeneratedErpContactContactIndex();
  const erpContactContactUpdate = useGeneratedErpContactContactUpdate();
  const erpControlAuditAuditAt = useGeneratedErpControlAuditAuditAt();
  const erpControlAuditAuditIndex = useGeneratedErpControlAuditAuditIndex();
  const erpControlReportExportReportExport = useGeneratedErpControlReportExportReportExport();
  const erpControlReportReport = useGeneratedErpControlReportReport();
  const erpControlOpsApprovalApprovalCreate = useGeneratedErpControlOpsApprovalApprovalCreate();
  const erpControlOpsApprovalApprovalIndex = useGeneratedErpControlOpsApprovalApprovalIndex();
  const erpControlOpsApprovalApprovalResolve = useGeneratedErpControlOpsApprovalApprovalResolve();
  const erpControlOpsApprovalDelegateApprovalDelegate = useGeneratedErpControlOpsApprovalDelegateApprovalDelegate();
  const erpControlOpsApprovalEscalateApprovalEscalate = useGeneratedErpControlOpsApprovalEscalateApprovalEscalate();
  const erpControlOpsApprovalHistoryApprovalHistory = useGeneratedErpControlOpsApprovalHistoryApprovalHistory();
  const erpControlOpsBankAccountBankCreate = useGeneratedErpControlOpsBankAccountBankCreate();
  const erpControlOpsBankAccountBankErase = useGeneratedErpControlOpsBankAccountBankErase();
  const erpControlOpsBankAccountBankIndex = useGeneratedErpControlOpsBankAccountBankIndex();
  const erpControlOpsBankAccountBankUpdate = useGeneratedErpControlOpsBankAccountBankUpdate();
  const erpControlOpsNotificationDispatchNotificationDispatch = useGeneratedErpControlOpsNotificationDispatchNotificationDispatch();
  const erpControlOpsNotificationNotificationIndex = useGeneratedErpControlOpsNotificationNotificationIndex();
  const erpControlOpsNotificationRetryNotificationRetry = useGeneratedErpControlOpsNotificationRetryNotificationRetry();
  const erpControlOpsPeriodHardClosePeriodHardClose = useGeneratedErpControlOpsPeriodHardClosePeriodHardClose();
  const erpControlOpsPeriodPeriodCreate = useGeneratedErpControlOpsPeriodPeriodCreate();
  const erpControlOpsPeriodPeriodIndex = useGeneratedErpControlOpsPeriodPeriodIndex();
  const erpControlOpsPeriodReopenPeriodReopen = useGeneratedErpControlOpsPeriodReopenPeriodReopen();
  const erpControlOpsPeriodReopenRequestPeriodReopenRequest = useGeneratedErpControlOpsPeriodReopenRequestPeriodReopenRequest();
  const erpControlOpsPeriodSnapshotPeriodSnapshot = useGeneratedErpControlOpsPeriodSnapshotPeriodSnapshot();
  const erpControlOpsPeriodSoftClosePeriodSoftClose = useGeneratedErpControlOpsPeriodSoftClosePeriodSoftClose();
  const erpControlOpsPeriodValidatePeriodValidate = useGeneratedErpControlOpsPeriodValidatePeriodValidate();
  const erpControlOpsWorkflowWorkflowCreate = useGeneratedErpControlOpsWorkflowWorkflowCreate();
  const erpControlOpsWorkflowWorkflowIndex = useGeneratedErpControlOpsWorkflowWorkflowIndex();
  const erpControlOpsWorkflowWorkflowUpdate = useGeneratedErpControlOpsWorkflowWorkflowUpdate();
  const erpCustomFieldDefinitionDeactivateDefinitionDeactivate = useGeneratedErpCustomFieldDefinitionDeactivateDefinitionDeactivate();
  const erpCustomFieldDefinitionDefinitionCreate = useGeneratedErpCustomFieldDefinitionDefinitionCreate();
  const erpCustomFieldDefinitionDefinitionIndex = useGeneratedErpCustomFieldDefinitionDefinitionIndex();
  const erpCustomFieldDefinitionDefinitionUpdate = useGeneratedErpCustomFieldDefinitionDefinitionUpdate();
  const erpCustomFieldValueValueIndex = useGeneratedErpCustomFieldValueValueIndex();
  const erpCustomFieldValueValueSet = useGeneratedErpCustomFieldValueValueSet();
  const erpDepreciationAssetScheduleScheduleCreate = useGeneratedErpDepreciationAssetScheduleScheduleCreate();
  const erpDepreciationAssetScheduleScheduleIndex = useGeneratedErpDepreciationAssetScheduleScheduleIndex();
  const erpDepreciationRunPostRunPost = useGeneratedErpDepreciationRunPostRunPost();
  const erpDepreciationRunRunCreate = useGeneratedErpDepreciationRunRunCreate();
  const erpExtendedFinanceCreditMemoCreditMemoCreate = useGeneratedErpExtendedFinanceCreditMemoCreditMemoCreate();
  const erpExtendedFinanceCreditMemoPostCreditMemoPost = useGeneratedErpExtendedFinanceCreditMemoPostCreditMemoPost();
  const erpExtendedFinancePurchaseReturnPostPurchaseReturnPost = useGeneratedErpExtendedFinancePurchaseReturnPostPurchaseReturnPost();
  const erpExtendedFinancePurchaseReturnPurchaseReturnCreate = useGeneratedErpExtendedFinancePurchaseReturnPurchaseReturnCreate();
  const erpExtendedFinanceSalesReturnApproveSalesReturnApprove = useGeneratedErpExtendedFinanceSalesReturnApproveSalesReturnApprove();
  const erpExtendedFinanceSalesReturnCancelSalesReturnCancel = useGeneratedErpExtendedFinanceSalesReturnCancelSalesReturnCancel();
  const erpExtendedFinanceSalesReturnReceiveSalesReturnReceive = useGeneratedErpExtendedFinanceSalesReturnReceiveSalesReturnReceive();
  const erpExtendedFinanceSalesReturnRefundSalesReturnRefund = useGeneratedErpExtendedFinanceSalesReturnRefundSalesReturnRefund();
  const erpExtendedFinanceSalesReturnRejectSalesReturnReject = useGeneratedErpExtendedFinanceSalesReturnRejectSalesReturnReject();
  const erpExtendedFinanceSalesReturnSalesReturnCreate = useGeneratedErpExtendedFinanceSalesReturnSalesReturnCreate();
  const erpExtendedFinanceSalesReturnSalesReturnUpdate = useGeneratedErpExtendedFinanceSalesReturnSalesReturnUpdate();
  const erpExtendedFinanceVendorBillBillCreate = useGeneratedErpExtendedFinanceVendorBillBillCreate();
  const erpExtendedFinanceVendorBillBillIndex = useGeneratedErpExtendedFinanceVendorBillBillIndex();
  const erpExtendedFinanceVendorBillBillTransition = useGeneratedErpExtendedFinanceVendorBillBillTransition();
  const erpExtendedFinanceVendorBillBillUpdate = useGeneratedErpExtendedFinanceVendorBillBillUpdate();
  const erpExtendedFinanceVendorBillMatchBillMatch = useGeneratedErpExtendedFinanceVendorBillMatchBillMatch();
  const erpExtendedFinanceVendorBillPostBillPost = useGeneratedErpExtendedFinanceVendorBillPostBillPost();
  const erpFinancialCenterCostCostCreate = useGeneratedErpFinancialCenterCostCostCreate();
  const erpFinancialCenterCostCostIndex = useGeneratedErpFinancialCenterCostCostIndex();
  const erpFinancialCenterCostCostState = useGeneratedErpFinancialCenterCostCostState();
  const erpFinancialCenterCostCostUpdate = useGeneratedErpFinancialCenterCostCostUpdate();
  const erpFinancialCenterProfitProfitCreate = useGeneratedErpFinancialCenterProfitProfitCreate();
  const erpFinancialCenterProfitProfitIndex = useGeneratedErpFinancialCenterProfitProfitIndex();
  const erpFinancialCenterProfitProfitState = useGeneratedErpFinancialCenterProfitProfitState();
  const erpFinancialCenterProfitProfitUpdate = useGeneratedErpFinancialCenterProfitProfitUpdate();
  const erpInteractionAttachmentAttachmentCreate = useGeneratedErpInteractionAttachmentAttachmentCreate();
  const erpInteractionAttachmentAttachmentErase = useGeneratedErpInteractionAttachmentAttachmentErase();
  const erpInteractionAttachmentAttachmentIndex = useGeneratedErpInteractionAttachmentAttachmentIndex();
  const erpInteractionCommentCommentCreate = useGeneratedErpInteractionCommentCommentCreate();
  const erpInteractionCommentCommentErase = useGeneratedErpInteractionCommentCommentErase();
  const erpInteractionCommentCommentIndex = useGeneratedErpInteractionCommentCommentIndex();
  const erpInteractionCommentCommentUpdate = useGeneratedErpInteractionCommentCommentUpdate();
  const erpInteractionTagAssignTagAssign = useGeneratedErpInteractionTagAssignTagAssign();
  const erpInteractionTagAssignTagUnassign = useGeneratedErpInteractionTagAssignTagUnassign();
  const erpInteractionTagTagCreate = useGeneratedErpInteractionTagTagCreate();
  const erpInteractionTagTagErase = useGeneratedErpInteractionTagTagErase();
  const erpInteractionTagTagIndex = useGeneratedErpInteractionTagTagIndex();
  const erpInteractionTagTagUpdate = useGeneratedErpInteractionTagTagUpdate();
  const erpInventoryAdjustmentAdjustmentCreate = useGeneratedErpInventoryAdjustmentAdjustmentCreate();
  const erpInventoryAdjustmentPostAdjustmentPost = useGeneratedErpInventoryAdjustmentPostAdjustmentPost();
  const erpInventoryAdjustmentReverseAdjustmentReverse = useGeneratedErpInventoryAdjustmentReverseAdjustmentReverse();
  const erpInventoryAdjustmentTransitionAdjustmentTransition = useGeneratedErpInventoryAdjustmentTransitionAdjustmentTransition();
  const erpInventoryCycleCountApproveCycleApprove = useGeneratedErpInventoryCycleCountApproveCycleApprove();
  const erpInventoryCycleCountCycleCreate = useGeneratedErpInventoryCycleCountCycleCreate();
  const erpInventoryCycleCountCycleIndex = useGeneratedErpInventoryCycleCountCycleIndex();
  const erpInventoryCycleCountPerformCyclePerform = useGeneratedErpInventoryCycleCountPerformCyclePerform();
  const erpInventoryCycleCountPostCyclePost = useGeneratedErpInventoryCycleCountPostCyclePost();
  const erpInventoryCycleCountRejectCycleReject = useGeneratedErpInventoryCycleCountRejectCycleReject();
  const erpInventoryCycleCountSubmitCycleSubmit = useGeneratedErpInventoryCycleCountSubmitCycleSubmit();
  const erpInventoryTransferCancelTransferCancel = useGeneratedErpInventoryTransferCancelTransferCancel();
  const erpInventoryTransferReceiveTransferReceive = useGeneratedErpInventoryTransferReceiveTransferReceive();
  const erpInventoryTransferShipTransferShip = useGeneratedErpInventoryTransferShipTransferShip();
  const erpInventoryTransferTransferCreate = useGeneratedErpInventoryTransferTransferCreate();
  const erpInventoryTransferTransferIndex = useGeneratedErpInventoryTransferTransferIndex();
  const erpInventoryTransferTransferUpdate = useGeneratedErpInventoryTransferTransferUpdate();
  const erpItemItemAt = useGeneratedErpItemItemAt();
  const erpItemItemCreate = useGeneratedErpItemItemCreate();
  const erpItemItemErase = useGeneratedErpItemItemErase();
  const erpItemItemIndex = useGeneratedErpItemItemIndex();
  const erpItemItemUpdate = useGeneratedErpItemItemUpdate();
  const erpJournalVoidVoidEntry = useGeneratedErpJournalVoidVoidEntry();
  const erpJournalAdjust = useGeneratedErpJournalAdjust();
  const erpJournalAt = useGeneratedErpJournalAt();
  const erpJournalCreate = useGeneratedErpJournalCreate();
  const erpJournalErase = useGeneratedErpJournalErase();
  const erpJournalIndex = useGeneratedErpJournalIndex();
  const erpJournalPost = useGeneratedErpJournalPost();
  const erpJournalReverse = useGeneratedErpJournalReverse();
  const erpJournalUpdate = useGeneratedErpJournalUpdate();
  const erpLocationLocationCreate = useGeneratedErpLocationLocationCreate();
  const erpLocationLocationErase = useGeneratedErpLocationLocationErase();
  const erpLocationLocationIndex = useGeneratedErpLocationLocationIndex();
  const erpLocationLocationUpdate = useGeneratedErpLocationLocationUpdate();
  const erpManufacturingResourceMachineEquipmentMachineLink = useGeneratedErpManufacturingResourceMachineEquipmentMachineLink();
  const erpManufacturingResourceMachineMachineCreate = useGeneratedErpManufacturingResourceMachineMachineCreate();
  const erpManufacturingResourceMachineMachineIndex = useGeneratedErpManufacturingResourceMachineMachineIndex();
  const erpManufacturingResourceMachineMachineUpdate = useGeneratedErpManufacturingResourceMachineMachineUpdate();
  const erpManufacturingResourceMachineRetireMachineRetire = useGeneratedErpManufacturingResourceMachineRetireMachineRetire();
  const erpManufacturingResourceWorkCenterWorkCenterCreate = useGeneratedErpManufacturingResourceWorkCenterWorkCenterCreate();
  const erpManufacturingResourceWorkCenterWorkCenterIndex = useGeneratedErpManufacturingResourceWorkCenterWorkCenterIndex();
  const erpManufacturingResourceWorkCenterWorkCenterState = useGeneratedErpManufacturingResourceWorkCenterWorkCenterState();
  const erpManufacturingResourceWorkCenterWorkCenterUpdate = useGeneratedErpManufacturingResourceWorkCenterWorkCenterUpdate();
  const erpMrpRecommendationRecommendationState = useGeneratedErpMrpRecommendationRecommendationState();
  const erpMrpRunRecommendationRecommendationIndex = useGeneratedErpMrpRunRecommendationRecommendationIndex();
  const erpMrpRunRunCreate = useGeneratedErpMrpRunRunCreate();
  const erpMrpRunRunIndex = useGeneratedErpMrpRunRunIndex();
  const erpOperationsAssetAssetCreate = useGeneratedErpOperationsAssetAssetCreate();
  const erpOperationsAssetAssetIndex = useGeneratedErpOperationsAssetAssetIndex();
  const erpOperationsAssetAssetUpdate = useGeneratedErpOperationsAssetAssetUpdate();
  const erpOperationsBomActivateBomActivate = useGeneratedErpOperationsBomActivateBomActivate();
  const erpOperationsBomBomCreate = useGeneratedErpOperationsBomBomCreate();
  const erpOperationsBomBomIndex = useGeneratedErpOperationsBomBomIndex();
  const erpOperationsBudgetActivateBudgetActivate = useGeneratedErpOperationsBudgetActivateBudgetActivate();
  const erpOperationsBudgetBudgetCreate = useGeneratedErpOperationsBudgetBudgetCreate();
  const erpOperationsBudgetBudgetIndex = useGeneratedErpOperationsBudgetBudgetIndex();
  const erpOperationsBudgetCloseBudgetClose = useGeneratedErpOperationsBudgetCloseBudgetClose();
  const erpOperationsEquipmentEquipmentCreate = useGeneratedErpOperationsEquipmentEquipmentCreate();
  const erpOperationsEquipmentEquipmentIndex = useGeneratedErpOperationsEquipmentEquipmentIndex();
  const erpOperationsEquipmentEquipmentState = useGeneratedErpOperationsEquipmentEquipmentState();
  const erpOperationsEquipmentEquipmentUpdate = useGeneratedErpOperationsEquipmentEquipmentUpdate();
  const erpOperationsInspectionInspectionCreate = useGeneratedErpOperationsInspectionInspectionCreate();
  const erpOperationsInspectionInspectionFinalize = useGeneratedErpOperationsInspectionInspectionFinalize();
  const erpOperationsInspectionPartialAcceptInspectionPartialAccept = useGeneratedErpOperationsInspectionPartialAcceptInspectionPartialAccept();
  const erpOperationsInspectionResultsInspectionResults = useGeneratedErpOperationsInspectionResultsInspectionResults();
  const erpOperationsInspectionStartInspectionStart = useGeneratedErpOperationsInspectionStartInspectionStart();
  const erpOperationsInspectionWaiveInspectionWaive = useGeneratedErpOperationsInspectionWaiveInspectionWaive();
  const erpOperationsMaintenanceAssignMaintenanceAssign = useGeneratedErpOperationsMaintenanceAssignMaintenanceAssign();
  const erpOperationsMaintenanceCancelMaintenanceCancel = useGeneratedErpOperationsMaintenanceCancelMaintenanceCancel();
  const erpOperationsMaintenanceCompleteMaintenanceComplete = useGeneratedErpOperationsMaintenanceCompleteMaintenanceComplete();
  const erpOperationsMaintenanceDowntimeMaintenanceDowntime = useGeneratedErpOperationsMaintenanceDowntimeMaintenanceDowntime();
  const erpOperationsMaintenanceLaborMaintenanceLabor = useGeneratedErpOperationsMaintenanceLaborMaintenanceLabor();
  const erpOperationsMaintenanceLaborPostMaintenanceLaborPost = useGeneratedErpOperationsMaintenanceLaborPostMaintenanceLaborPost();
  const erpOperationsMaintenanceMaintenanceCreate = useGeneratedErpOperationsMaintenanceMaintenanceCreate();
  const erpOperationsMaintenanceMaintenanceUpdate = useGeneratedErpOperationsMaintenanceMaintenanceUpdate();
  const erpOperationsMaintenancePartMaintenancePart = useGeneratedErpOperationsMaintenancePartMaintenancePart();
  const erpOperationsMaintenanceStartMaintenanceStart = useGeneratedErpOperationsMaintenanceStartMaintenanceStart();
  const erpOperationsProductionApproveProductionApprove = useGeneratedErpOperationsProductionApproveProductionApprove();
  const erpOperationsProductionCancelProductionCancel = useGeneratedErpOperationsProductionCancelProductionCancel();
  const erpOperationsProductionCloseProductionClose = useGeneratedErpOperationsProductionCloseProductionClose();
  const erpOperationsProductionConsumeProductionConsume = useGeneratedErpOperationsProductionConsumeProductionConsume();
  const erpOperationsProductionOutputProductionOutput = useGeneratedErpOperationsProductionOutputProductionOutput();
  const erpOperationsProductionProductionCreate = useGeneratedErpOperationsProductionProductionCreate();
  const erpOperationsProductionProductionIndex = useGeneratedErpOperationsProductionProductionIndex();
  const erpOperationsProductionProductionUpdate = useGeneratedErpOperationsProductionProductionUpdate();
  const erpOperationsProductionRejectProductionReject = useGeneratedErpOperationsProductionRejectProductionReject();
  const erpOperationsProductionReleaseProductionRelease = useGeneratedErpOperationsProductionReleaseProductionRelease();
  const erpOperationsProductionScrapProductionScrap = useGeneratedErpOperationsProductionScrapProductionScrap();
  const erpOperationsProductionStartProductionStart = useGeneratedErpOperationsProductionStartProductionStart();
  const erpOperationsProductionSubmitProductionSubmit = useGeneratedErpOperationsProductionSubmitProductionSubmit();
  const erpOperationsRoutingActivateRoutingActivate = useGeneratedErpOperationsRoutingActivateRoutingActivate();
  const erpOperationsRoutingRoutingCreate = useGeneratedErpOperationsRoutingRoutingCreate();
  const erpOperationsRoutingRoutingIndex = useGeneratedErpOperationsRoutingRoutingIndex();
  const erpOperationsServiceServiceCreate = useGeneratedErpOperationsServiceServiceCreate();
  const erpOperationsServiceServiceIndex = useGeneratedErpOperationsServiceServiceIndex();
  const erpOperationsServiceServiceState = useGeneratedErpOperationsServiceServiceState();
  const erpOperationsServiceServiceUpdate = useGeneratedErpOperationsServiceServiceUpdate();
  const erpOrganizationAt = useGeneratedErpOrganizationAt();
  const erpOrganizationDeletionCheckDeletionCheck = useGeneratedErpOrganizationDeletionCheckDeletionCheck();
  const erpOrganizationErase = useGeneratedErpOrganizationErase();
  const erpOrganizationInvitationInvite = useGeneratedErpOrganizationInvitationInvite();
  const erpOrganizationMembershipMemberships = useGeneratedErpOrganizationMembershipMemberships();
  const erpOrganizationMembershipReactivate = useGeneratedErpOrganizationMembershipReactivate();
  const erpOrganizationMembershipRevoke = useGeneratedErpOrganizationMembershipRevoke();
  const erpOrganizationMembershipSuspend = useGeneratedErpOrganizationMembershipSuspend();
  const erpOrganizationRoleCreate = useGeneratedErpOrganizationRoleCreate();
  const erpOrganizationRoleErase = useGeneratedErpOrganizationRoleErase();
  const erpOrganizationRoleIndex = useGeneratedErpOrganizationRoleIndex();
  const erpOrganizationRoleMembershipAssign = useGeneratedErpOrganizationRoleMembershipAssign();
  const erpOrganizationRoleMembershipRevoke = useGeneratedErpOrganizationRoleMembershipRevoke();
  const erpOrganizationRoleUpdate = useGeneratedErpOrganizationRoleUpdate();
  const erpOrganizationUpdate = useGeneratedErpOrganizationUpdate();
  const erpPartyChangeRequestApplyPartyChangeApply = useGeneratedErpPartyChangeRequestApplyPartyChangeApply();
  const erpPartyChangeRequestPartyChangeCreate = useGeneratedErpPartyChangeRequestPartyChangeCreate();
  const erpPartyChangeRequestPartyChangeIndex = useGeneratedErpPartyChangeRequestPartyChangeIndex();
  const erpPartyChangeRequestTransitionPartyChangeResolve = useGeneratedErpPartyChangeRequestTransitionPartyChangeResolve();
  const erpPartyPartyAt = useGeneratedErpPartyPartyAt();
  const erpPartyPartyCreate = useGeneratedErpPartyPartyCreate();
  const erpPartyPartyErase = useGeneratedErpPartyPartyErase();
  const erpPartyPartyIndex = useGeneratedErpPartyPartyIndex();
  const erpPartyPartyUpdate = useGeneratedErpPartyPartyUpdate();
  const erpPayrollSetupConfigurationConfigurationCreate = useGeneratedErpPayrollSetupConfigurationConfigurationCreate();
  const erpPayrollSetupConfigurationConfigurationIndex = useGeneratedErpPayrollSetupConfigurationConfigurationIndex();
  const erpPayrollSetupConfigurationConfigurationUpdate = useGeneratedErpPayrollSetupConfigurationConfigurationUpdate();
  const erpPayrollSetupScheduleScheduleCreate = useGeneratedErpPayrollSetupScheduleScheduleCreate();
  const erpPayrollSetupScheduleScheduleIndex = useGeneratedErpPayrollSetupScheduleScheduleIndex();
  const erpPayrollSetupScheduleScheduleUpdate = useGeneratedErpPayrollSetupScheduleScheduleUpdate();
  const erpProjectsDepartmentDeactivateDepartmentDeactivate = useGeneratedErpProjectsDepartmentDeactivateDepartmentDeactivate();
  const erpProjectsDepartmentDepartmentCreate = useGeneratedErpProjectsDepartmentDepartmentCreate();
  const erpProjectsDepartmentDepartmentIndex = useGeneratedErpProjectsDepartmentDepartmentIndex();
  const erpProjectsDepartmentManagerDepartmentManager = useGeneratedErpProjectsDepartmentManagerDepartmentManager();
  const erpProjectsProjectManagerProjectManager = useGeneratedErpProjectsProjectManagerProjectManager();
  const erpProjectsProjectMemberMemberCreate = useGeneratedErpProjectsProjectMemberMemberCreate();
  const erpProjectsProjectMemberMemberErase = useGeneratedErpProjectsProjectMemberMemberErase();
  const erpProjectsProjectMemberMemberIndex = useGeneratedErpProjectsProjectMemberMemberIndex();
  const erpProjectsProjectMemberMemberUpdate = useGeneratedErpProjectsProjectMemberMemberUpdate();
  const erpProjectsProjectProjectCreate = useGeneratedErpProjectsProjectProjectCreate();
  const erpProjectsProjectProjectIndex = useGeneratedErpProjectsProjectProjectIndex();
  const erpProjectsProjectProjectUpdate = useGeneratedErpProjectsProjectProjectUpdate();
  const erpProjectsProjectTaskTaskIndex = useGeneratedErpProjectsProjectTaskTaskIndex();
  const erpProjectsTaskHistoryTaskHistory = useGeneratedErpProjectsTaskHistoryTaskHistory();
  const erpProjectsTaskTaskCreate = useGeneratedErpProjectsTaskTaskCreate();
  const erpProjectsTaskTaskUpdate = useGeneratedErpProjectsTaskTaskUpdate();
  const erpPurchaseOrderChangeRequestOrderChangeRequest = useGeneratedErpPurchaseOrderChangeRequestOrderChangeRequest();
  const erpPurchaseOrderOrderAt = useGeneratedErpPurchaseOrderOrderAt();
  const erpPurchaseOrderOrderCreate = useGeneratedErpPurchaseOrderOrderCreate();
  const erpPurchaseOrderOrderErase = useGeneratedErpPurchaseOrderOrderErase();
  const erpPurchaseOrderOrderIndex = useGeneratedErpPurchaseOrderOrderIndex();
  const erpPurchaseOrderOrderTransition = useGeneratedErpPurchaseOrderOrderTransition();
  const erpPurchaseOrderOrderUpdate = useGeneratedErpPurchaseOrderOrderUpdate();
  const erpPurchaseOrderChangeApplyOrderChangeApply = useGeneratedErpPurchaseOrderChangeApplyOrderChangeApply();
  const erpPurchaseReceiptPostReceiptPost = useGeneratedErpPurchaseReceiptPostReceiptPost();
  const erpPurchaseReceiptReceiptAt = useGeneratedErpPurchaseReceiptReceiptAt();
  const erpPurchaseReceiptReceiptCreate = useGeneratedErpPurchaseReceiptReceiptCreate();
  const erpPurchaseRequestRequestAt = useGeneratedErpPurchaseRequestRequestAt();
  const erpPurchaseRequestRequestCreate = useGeneratedErpPurchaseRequestRequestCreate();
  const erpPurchaseRequestRequestErase = useGeneratedErpPurchaseRequestRequestErase();
  const erpPurchaseRequestRequestIndex = useGeneratedErpPurchaseRequestRequestIndex();
  const erpPurchaseRequestRequestTransition = useGeneratedErpPurchaseRequestRequestTransition();
  const erpPurchaseRequestRequestUpdate = useGeneratedErpPurchaseRequestRequestUpdate();
  const erpQualityMaintenancePlanInspectionDeactivateInspectionDeactivate = useGeneratedErpQualityMaintenancePlanInspectionDeactivateInspectionDeactivate();
  const erpQualityMaintenancePlanInspectionInspectionCreate = useGeneratedErpQualityMaintenancePlanInspectionInspectionCreate();
  const erpQualityMaintenancePlanInspectionInspectionIndex = useGeneratedErpQualityMaintenancePlanInspectionInspectionIndex();
  const erpQualityMaintenancePlanInspectionInspectionUpdate = useGeneratedErpQualityMaintenancePlanInspectionInspectionUpdate();
  const erpQualityMaintenancePlanMaintenanceDeactivateMaintenanceDeactivate = useGeneratedErpQualityMaintenancePlanMaintenanceDeactivateMaintenanceDeactivate();
  const erpQualityMaintenancePlanMaintenanceGenerateMaintenanceGenerate = useGeneratedErpQualityMaintenancePlanMaintenanceGenerateMaintenanceGenerate();
  const erpQualityMaintenancePlanMaintenanceMaintenanceCreate = useGeneratedErpQualityMaintenancePlanMaintenanceMaintenanceCreate();
  const erpQualityMaintenancePlanMaintenanceMaintenanceIndex = useGeneratedErpQualityMaintenancePlanMaintenanceMaintenanceIndex();
  const erpQualityMaintenancePlanMaintenanceMaintenanceUpdate = useGeneratedErpQualityMaintenancePlanMaintenanceMaintenanceUpdate();
  const erpQuarantineCreate = useGeneratedErpQuarantineCreate();
  const erpQuarantineDisposition = useGeneratedErpQuarantineDisposition();
  const erpQuarantineIndex = useGeneratedErpQuarantineIndex();
  const erpSalesOrderApproveOrderApprove = useGeneratedErpSalesOrderApproveOrderApprove();
  const erpSalesOrderOrderAt = useGeneratedErpSalesOrderOrderAt();
  const erpSalesOrderOrderCreate = useGeneratedErpSalesOrderOrderCreate();
  const erpSalesOrderOrderErase = useGeneratedErpSalesOrderOrderErase();
  const erpSalesOrderOrderIndex = useGeneratedErpSalesOrderOrderIndex();
  const erpSalesOrderOrderUpdate = useGeneratedErpSalesOrderOrderUpdate();
  const erpSalesOrderTransitionOrderTransition = useGeneratedErpSalesOrderTransitionOrderTransition();
  const erpSalesShipmentCancelShipmentCancel = useGeneratedErpSalesShipmentCancelShipmentCancel();
  const erpSalesShipmentDeliverShipmentDeliver = useGeneratedErpSalesShipmentDeliverShipmentDeliver();
  const erpSalesShipmentPackShipmentPack = useGeneratedErpSalesShipmentPackShipmentPack();
  const erpSalesShipmentPickShipmentPick = useGeneratedErpSalesShipmentPickShipmentPick();
  const erpSalesShipmentPostShipmentPost = useGeneratedErpSalesShipmentPostShipmentPost();
  const erpSalesShipmentShipmentCreate = useGeneratedErpSalesShipmentShipmentCreate();
  const erpSalesFinanceInvoiceVoidInvoiceVoid = useGeneratedErpSalesFinanceInvoiceVoidInvoiceVoid();
  const erpSalesFinanceInvoiceApproveInvoiceApprove = useGeneratedErpSalesFinanceInvoiceApproveInvoiceApprove();
  const erpSalesFinanceInvoiceInvoiceCreate = useGeneratedErpSalesFinanceInvoiceInvoiceCreate();
  const erpSalesFinanceInvoiceInvoiceUpdate = useGeneratedErpSalesFinanceInvoiceInvoiceUpdate();
  const erpSalesFinanceInvoicePostInvoicePost = useGeneratedErpSalesFinanceInvoicePostInvoicePost();
  const erpSalesFinanceInvoiceSendInvoiceSend = useGeneratedErpSalesFinanceInvoiceSendInvoiceSend();
  const erpSalesFinanceInvoiceSubmitInvoiceSubmit = useGeneratedErpSalesFinanceInvoiceSubmitInvoiceSubmit();
  const erpSalesFinancePaymentAllocationPaymentAllocationCreate = useGeneratedErpSalesFinancePaymentAllocationPaymentAllocationCreate();
  const erpSalesFinancePaymentAllocationPaymentAllocationErase = useGeneratedErpSalesFinancePaymentAllocationPaymentAllocationErase();
  const erpSalesFinancePaymentAllocationPaymentAllocationIndex = useGeneratedErpSalesFinancePaymentAllocationPaymentAllocationIndex();
  const erpSalesFinancePaymentAllocationPaymentAllocationUpdate = useGeneratedErpSalesFinancePaymentAllocationPaymentAllocationUpdate();
  const erpSalesFinancePaymentPaymentCreate = useGeneratedErpSalesFinancePaymentPaymentCreate();
  const erpSalesFinancePaymentPaymentIndex = useGeneratedErpSalesFinancePaymentPaymentIndex();
  const erpSalesFinancePaymentPostPaymentPost = useGeneratedErpSalesFinancePaymentPostPaymentPost();
  const erpSalesFinanceQuoteConvertQuoteConvert = useGeneratedErpSalesFinanceQuoteConvertQuoteConvert();
  const erpSalesFinanceQuoteQuoteCreate = useGeneratedErpSalesFinanceQuoteQuoteCreate();
  const erpSalesFinanceQuoteQuoteIndex = useGeneratedErpSalesFinanceQuoteQuoteIndex();
  const erpSalesFinanceQuoteQuoteTransition = useGeneratedErpSalesFinanceQuoteQuoteTransition();
  const erpSalesPriceCreate = useGeneratedErpSalesPriceCreate();
  const erpSalesPriceDeactivate = useGeneratedErpSalesPriceDeactivate();
  const erpSalesPriceIndex = useGeneratedErpSalesPriceIndex();
  const erpSalesPriceResolve = useGeneratedErpSalesPriceResolve();
  const erpSalesQuoteConvert = useGeneratedErpSalesQuoteConvert();
  const erpSalesQuoteCreate = useGeneratedErpSalesQuoteCreate();
  const erpSalesQuoteIndex = useGeneratedErpSalesQuoteIndex();
  const erpSalesQuoteState = useGeneratedErpSalesQuoteState();
  const erpSalesQuoteUpdate = useGeneratedErpSalesQuoteUpdate();
  const erpServiceOrderAssign = useGeneratedErpServiceOrderAssign();
  const erpServiceOrderCancel = useGeneratedErpServiceOrderCancel();
  const erpServiceOrderComplete = useGeneratedErpServiceOrderComplete();
  const erpServiceOrderCreate = useGeneratedErpServiceOrderCreate();
  const erpServiceOrderIndex = useGeneratedErpServiceOrderIndex();
  const erpServiceOrderStart = useGeneratedErpServiceOrderStart();
  const erpServiceOrderUpdate = useGeneratedErpServiceOrderUpdate();
  const erpStockBalanceBalanceIndex = useGeneratedErpStockBalanceBalanceIndex();
  const erpStockMovementMovementIndex = useGeneratedErpStockMovementMovementIndex();
  const erpTaxReturnAmend = useGeneratedErpTaxReturnAmend();
  const erpTaxReturnApprove = useGeneratedErpTaxReturnApprove();
  const erpTaxReturnCreate = useGeneratedErpTaxReturnCreate();
  const erpTaxReturnFile = useGeneratedErpTaxReturnFile();
  const erpTaxReturnIndex = useGeneratedErpTaxReturnIndex();
  const erpTaxReturnReconcile = useGeneratedErpTaxReturnReconcile();
  const erpUnitUnitCreate = useGeneratedErpUnitUnitCreate();
  const erpUnitUnitErase = useGeneratedErpUnitUnitErase();
  const erpUnitUnitIndex = useGeneratedErpUnitUnitIndex();
  const erpUnitUnitUpdate = useGeneratedErpUnitUnitUpdate();
  const erpVendorCreditApply = useGeneratedErpVendorCreditApply();
  const erpVendorCreditCreate = useGeneratedErpVendorCreditCreate();
  const erpVendorCreditIndex = useGeneratedErpVendorCreditIndex();
  const erpVendorCreditRefund = useGeneratedErpVendorCreditRefund();
  const erpWarehouseWarehouseAt = useGeneratedErpWarehouseWarehouseAt();
  const erpWarehouseWarehouseCreate = useGeneratedErpWarehouseWarehouseCreate();
  const erpWarehouseWarehouseErase = useGeneratedErpWarehouseWarehouseErase();
  const erpWarehouseWarehouseIndex = useGeneratedErpWarehouseWarehouseIndex();
  const erpWarehouseWarehouseUpdate = useGeneratedErpWarehouseWarehouseUpdate();
  const erpWorkforceContractContractCreate = useGeneratedErpWorkforceContractContractCreate();
  const erpWorkforceContractContractIndex = useGeneratedErpWorkforceContractContractIndex();
  const erpWorkforceEmployeeEmployeeCreate = useGeneratedErpWorkforceEmployeeEmployeeCreate();
  const erpWorkforceEmployeeEmployeeIndex = useGeneratedErpWorkforceEmployeeEmployeeIndex();
  const erpWorkforceEmployeeEmployeeUpdate = useGeneratedErpWorkforceEmployeeEmployeeUpdate();
  const erpWorkforcePayrollAdjustPayrollAdjust = useGeneratedErpWorkforcePayrollAdjustPayrollAdjust();
  const erpWorkforcePayrollApprovePayrollApprove = useGeneratedErpWorkforcePayrollApprovePayrollApprove();
  const erpWorkforcePayrollCalculatePayrollCalculate = useGeneratedErpWorkforcePayrollCalculatePayrollCalculate();
  const erpWorkforcePayrollPayPayrollPay = useGeneratedErpWorkforcePayrollPayPayrollPay();
  const erpWorkforcePayrollPayrollCreate = useGeneratedErpWorkforcePayrollPayrollCreate();
  const erpWorkforcePayrollPayrollIndex = useGeneratedErpWorkforcePayrollPayrollIndex();
  const erpWorkforcePayrollPostPayrollPost = useGeneratedErpWorkforcePayrollPostPayrollPost();
  const erpWorkforcePayrollPublishPayrollPublish = useGeneratedErpWorkforcePayrollPublishPayrollPublish();
  const erpWorkforcePayrollReversePayrollReverse = useGeneratedErpWorkforcePayrollReversePayrollReverse();
  const erpWorkforcePayslipPayslipAt = useGeneratedErpWorkforcePayslipPayslipAt();
  const erpWorkforcePayslipPayslipIndex = useGeneratedErpWorkforcePayslipPayslipIndex();
  const erpWorkforceTimelogTimelogCreate = useGeneratedErpWorkforceTimelogTimelogCreate();
  const erpWorkforceTimelogTimelogErase = useGeneratedErpWorkforceTimelogTimelogErase();
  const erpWorkforceTimelogTimelogIndex = useGeneratedErpWorkforceTimelogTimelogIndex();
  const erpWorkforceTimelogTimelogUpdate = useGeneratedErpWorkforceTimelogTimelogUpdate();
  const erpWorkforceTimesheetApproveTimesheetApprove = useGeneratedErpWorkforceTimesheetApproveTimesheetApprove();
  const erpWorkforceTimesheetRejectTimesheetReject = useGeneratedErpWorkforceTimesheetRejectTimesheetReject();
  const erpWorkforceTimesheetReopenTimesheetReopen = useGeneratedErpWorkforceTimesheetReopenTimesheetReopen();
  const erpWorkforceTimesheetSubmitTimesheetSubmit = useGeneratedErpWorkforceTimesheetSubmitTimesheetSubmit();
  const erpWorkforceTimesheetTimesheetCreate = useGeneratedErpWorkforceTimesheetTimesheetCreate();
  const erpWorkforceTimesheetTimesheetIndex = useGeneratedErpWorkforceTimesheetTimesheetIndex();
  const healthGet = useGeneratedHealthGet();
  return {
    erpAccountAt,
    erpAccountCreate,
    erpAccountErase,
    erpAccountIndex,
    erpAccountMergeMergeExecute,
    erpAccountMergeRequestMergeRequest,
    erpAccountUpdate,
    erpAddressAddressAt,
    erpAddressAddressCreate,
    erpAddressAddressErase,
    erpAddressAddressIndex,
    erpAddressAddressUpdate,
    erpAllocationAvailabilityAvailabilityAt,
    erpAllocationCreate,
    erpAllocationIndex,
    erpAllocationRelease,
    erpAllocationRuleActivate,
    erpAllocationRuleCreate,
    erpAllocationRuleDeactivate,
    erpAllocationRuleExecute,
    erpAllocationRuleExecutionPost,
    erpAllocationRuleIndex,
    erpAllocationRuleUpdate,
    erpAuthAccountDeactivateDeactivateAccount,
    erpAuthInvitationAccept,
    erpAuthLogin,
    erpAuthMembershipSelect,
    erpAuthOrganization,
    erpAuthPasswordChangePassword,
    erpAuthProfileProfile,
    erpAuthProfileUpdateProfile,
    erpAuthRecoveryCompleteRecoveryComplete,
    erpAuthRecoveryRequestRecoveryRequest,
    erpAuthRefresh,
    erpAuthSessionLogout,
    erpAuthSessionsLogoutAll,
    erpBankReconciliationCompleteReconciliationComplete,
    erpBankReconciliationLineReconciliationLine,
    erpBankReconciliationReconciliationCreate,
    erpBankReconciliationReopenReconciliationReopen,
    erpBankReconciliationReopenRequestReconciliationReopenRequest,
    erpBankTransactionImportTransactionImport,
    erpBankTransactionMatchTransactionMatch,
    erpBankTransactionTransactionCreate,
    erpBankTransactionTransactionIndex,
    erpBankTransactionTransactionResolve,
    erpConfigCurrencyCurrencyCreate,
    erpConfigCurrencyCurrencyErase,
    erpConfigCurrencyCurrencyIndex,
    erpConfigCurrencyCurrencyUpdate,
    erpConfigExchangeRateRateCreate,
    erpConfigExchangeRateRateIndex,
    erpConfigPaymentTermTermCreate,
    erpConfigPaymentTermTermErase,
    erpConfigPaymentTermTermIndex,
    erpConfigPaymentTermTermUpdate,
    erpConfigTaxCodeTaxCodeCreate,
    erpConfigTaxCodeTaxCodeErase,
    erpConfigTaxCodeTaxCodeIndex,
    erpConfigTaxCodeTaxCodeUpdate,
    erpConfigTaxJurisdictionJurisdictionCreate,
    erpConfigTaxJurisdictionJurisdictionErase,
    erpConfigTaxJurisdictionJurisdictionIndex,
    erpConfigTaxJurisdictionJurisdictionUpdate,
    erpConfigTaxRateResolveTaxRateResolve,
    erpConfigTaxRateTaxRateCreate,
    erpConfigExtDocumentNumberIssueNumberIssue,
    erpConfigExtDocumentNumberNumberCreate,
    erpConfigExtDocumentNumberNumberIndex,
    erpConfigExtFiscalYearFiscalYearCreate,
    erpConfigExtFiscalYearFiscalYearIndex,
    erpConfigExtNotificationPreferencePreferenceAt,
    erpConfigExtNotificationPreferencePreferenceUpdate,
    erpContactContactCreate,
    erpContactContactErase,
    erpContactContactIndex,
    erpContactContactUpdate,
    erpControlAuditAuditAt,
    erpControlAuditAuditIndex,
    erpControlReportExportReportExport,
    erpControlReportReport,
    erpControlOpsApprovalApprovalCreate,
    erpControlOpsApprovalApprovalIndex,
    erpControlOpsApprovalApprovalResolve,
    erpControlOpsApprovalDelegateApprovalDelegate,
    erpControlOpsApprovalEscalateApprovalEscalate,
    erpControlOpsApprovalHistoryApprovalHistory,
    erpControlOpsBankAccountBankCreate,
    erpControlOpsBankAccountBankErase,
    erpControlOpsBankAccountBankIndex,
    erpControlOpsBankAccountBankUpdate,
    erpControlOpsNotificationDispatchNotificationDispatch,
    erpControlOpsNotificationNotificationIndex,
    erpControlOpsNotificationRetryNotificationRetry,
    erpControlOpsPeriodHardClosePeriodHardClose,
    erpControlOpsPeriodPeriodCreate,
    erpControlOpsPeriodPeriodIndex,
    erpControlOpsPeriodReopenPeriodReopen,
    erpControlOpsPeriodReopenRequestPeriodReopenRequest,
    erpControlOpsPeriodSnapshotPeriodSnapshot,
    erpControlOpsPeriodSoftClosePeriodSoftClose,
    erpControlOpsPeriodValidatePeriodValidate,
    erpControlOpsWorkflowWorkflowCreate,
    erpControlOpsWorkflowWorkflowIndex,
    erpControlOpsWorkflowWorkflowUpdate,
    erpCustomFieldDefinitionDeactivateDefinitionDeactivate,
    erpCustomFieldDefinitionDefinitionCreate,
    erpCustomFieldDefinitionDefinitionIndex,
    erpCustomFieldDefinitionDefinitionUpdate,
    erpCustomFieldValueValueIndex,
    erpCustomFieldValueValueSet,
    erpDepreciationAssetScheduleScheduleCreate,
    erpDepreciationAssetScheduleScheduleIndex,
    erpDepreciationRunPostRunPost,
    erpDepreciationRunRunCreate,
    erpExtendedFinanceCreditMemoCreditMemoCreate,
    erpExtendedFinanceCreditMemoPostCreditMemoPost,
    erpExtendedFinancePurchaseReturnPostPurchaseReturnPost,
    erpExtendedFinancePurchaseReturnPurchaseReturnCreate,
    erpExtendedFinanceSalesReturnApproveSalesReturnApprove,
    erpExtendedFinanceSalesReturnCancelSalesReturnCancel,
    erpExtendedFinanceSalesReturnReceiveSalesReturnReceive,
    erpExtendedFinanceSalesReturnRefundSalesReturnRefund,
    erpExtendedFinanceSalesReturnRejectSalesReturnReject,
    erpExtendedFinanceSalesReturnSalesReturnCreate,
    erpExtendedFinanceSalesReturnSalesReturnUpdate,
    erpExtendedFinanceVendorBillBillCreate,
    erpExtendedFinanceVendorBillBillIndex,
    erpExtendedFinanceVendorBillBillTransition,
    erpExtendedFinanceVendorBillBillUpdate,
    erpExtendedFinanceVendorBillMatchBillMatch,
    erpExtendedFinanceVendorBillPostBillPost,
    erpFinancialCenterCostCostCreate,
    erpFinancialCenterCostCostIndex,
    erpFinancialCenterCostCostState,
    erpFinancialCenterCostCostUpdate,
    erpFinancialCenterProfitProfitCreate,
    erpFinancialCenterProfitProfitIndex,
    erpFinancialCenterProfitProfitState,
    erpFinancialCenterProfitProfitUpdate,
    erpInteractionAttachmentAttachmentCreate,
    erpInteractionAttachmentAttachmentErase,
    erpInteractionAttachmentAttachmentIndex,
    erpInteractionCommentCommentCreate,
    erpInteractionCommentCommentErase,
    erpInteractionCommentCommentIndex,
    erpInteractionCommentCommentUpdate,
    erpInteractionTagAssignTagAssign,
    erpInteractionTagAssignTagUnassign,
    erpInteractionTagTagCreate,
    erpInteractionTagTagErase,
    erpInteractionTagTagIndex,
    erpInteractionTagTagUpdate,
    erpInventoryAdjustmentAdjustmentCreate,
    erpInventoryAdjustmentPostAdjustmentPost,
    erpInventoryAdjustmentReverseAdjustmentReverse,
    erpInventoryAdjustmentTransitionAdjustmentTransition,
    erpInventoryCycleCountApproveCycleApprove,
    erpInventoryCycleCountCycleCreate,
    erpInventoryCycleCountCycleIndex,
    erpInventoryCycleCountPerformCyclePerform,
    erpInventoryCycleCountPostCyclePost,
    erpInventoryCycleCountRejectCycleReject,
    erpInventoryCycleCountSubmitCycleSubmit,
    erpInventoryTransferCancelTransferCancel,
    erpInventoryTransferReceiveTransferReceive,
    erpInventoryTransferShipTransferShip,
    erpInventoryTransferTransferCreate,
    erpInventoryTransferTransferIndex,
    erpInventoryTransferTransferUpdate,
    erpItemItemAt,
    erpItemItemCreate,
    erpItemItemErase,
    erpItemItemIndex,
    erpItemItemUpdate,
    erpJournalVoidVoidEntry,
    erpJournalAdjust,
    erpJournalAt,
    erpJournalCreate,
    erpJournalErase,
    erpJournalIndex,
    erpJournalPost,
    erpJournalReverse,
    erpJournalUpdate,
    erpLocationLocationCreate,
    erpLocationLocationErase,
    erpLocationLocationIndex,
    erpLocationLocationUpdate,
    erpManufacturingResourceMachineEquipmentMachineLink,
    erpManufacturingResourceMachineMachineCreate,
    erpManufacturingResourceMachineMachineIndex,
    erpManufacturingResourceMachineMachineUpdate,
    erpManufacturingResourceMachineRetireMachineRetire,
    erpManufacturingResourceWorkCenterWorkCenterCreate,
    erpManufacturingResourceWorkCenterWorkCenterIndex,
    erpManufacturingResourceWorkCenterWorkCenterState,
    erpManufacturingResourceWorkCenterWorkCenterUpdate,
    erpMrpRecommendationRecommendationState,
    erpMrpRunRecommendationRecommendationIndex,
    erpMrpRunRunCreate,
    erpMrpRunRunIndex,
    erpOperationsAssetAssetCreate,
    erpOperationsAssetAssetIndex,
    erpOperationsAssetAssetUpdate,
    erpOperationsBomActivateBomActivate,
    erpOperationsBomBomCreate,
    erpOperationsBomBomIndex,
    erpOperationsBudgetActivateBudgetActivate,
    erpOperationsBudgetBudgetCreate,
    erpOperationsBudgetBudgetIndex,
    erpOperationsBudgetCloseBudgetClose,
    erpOperationsEquipmentEquipmentCreate,
    erpOperationsEquipmentEquipmentIndex,
    erpOperationsEquipmentEquipmentState,
    erpOperationsEquipmentEquipmentUpdate,
    erpOperationsInspectionInspectionCreate,
    erpOperationsInspectionInspectionFinalize,
    erpOperationsInspectionPartialAcceptInspectionPartialAccept,
    erpOperationsInspectionResultsInspectionResults,
    erpOperationsInspectionStartInspectionStart,
    erpOperationsInspectionWaiveInspectionWaive,
    erpOperationsMaintenanceAssignMaintenanceAssign,
    erpOperationsMaintenanceCancelMaintenanceCancel,
    erpOperationsMaintenanceCompleteMaintenanceComplete,
    erpOperationsMaintenanceDowntimeMaintenanceDowntime,
    erpOperationsMaintenanceLaborMaintenanceLabor,
    erpOperationsMaintenanceLaborPostMaintenanceLaborPost,
    erpOperationsMaintenanceMaintenanceCreate,
    erpOperationsMaintenanceMaintenanceUpdate,
    erpOperationsMaintenancePartMaintenancePart,
    erpOperationsMaintenanceStartMaintenanceStart,
    erpOperationsProductionApproveProductionApprove,
    erpOperationsProductionCancelProductionCancel,
    erpOperationsProductionCloseProductionClose,
    erpOperationsProductionConsumeProductionConsume,
    erpOperationsProductionOutputProductionOutput,
    erpOperationsProductionProductionCreate,
    erpOperationsProductionProductionIndex,
    erpOperationsProductionProductionUpdate,
    erpOperationsProductionRejectProductionReject,
    erpOperationsProductionReleaseProductionRelease,
    erpOperationsProductionScrapProductionScrap,
    erpOperationsProductionStartProductionStart,
    erpOperationsProductionSubmitProductionSubmit,
    erpOperationsRoutingActivateRoutingActivate,
    erpOperationsRoutingRoutingCreate,
    erpOperationsRoutingRoutingIndex,
    erpOperationsServiceServiceCreate,
    erpOperationsServiceServiceIndex,
    erpOperationsServiceServiceState,
    erpOperationsServiceServiceUpdate,
    erpOrganizationAt,
    erpOrganizationDeletionCheckDeletionCheck,
    erpOrganizationErase,
    erpOrganizationInvitationInvite,
    erpOrganizationMembershipMemberships,
    erpOrganizationMembershipReactivate,
    erpOrganizationMembershipRevoke,
    erpOrganizationMembershipSuspend,
    erpOrganizationRoleCreate,
    erpOrganizationRoleErase,
    erpOrganizationRoleIndex,
    erpOrganizationRoleMembershipAssign,
    erpOrganizationRoleMembershipRevoke,
    erpOrganizationRoleUpdate,
    erpOrganizationUpdate,
    erpPartyChangeRequestApplyPartyChangeApply,
    erpPartyChangeRequestPartyChangeCreate,
    erpPartyChangeRequestPartyChangeIndex,
    erpPartyChangeRequestTransitionPartyChangeResolve,
    erpPartyPartyAt,
    erpPartyPartyCreate,
    erpPartyPartyErase,
    erpPartyPartyIndex,
    erpPartyPartyUpdate,
    erpPayrollSetupConfigurationConfigurationCreate,
    erpPayrollSetupConfigurationConfigurationIndex,
    erpPayrollSetupConfigurationConfigurationUpdate,
    erpPayrollSetupScheduleScheduleCreate,
    erpPayrollSetupScheduleScheduleIndex,
    erpPayrollSetupScheduleScheduleUpdate,
    erpProjectsDepartmentDeactivateDepartmentDeactivate,
    erpProjectsDepartmentDepartmentCreate,
    erpProjectsDepartmentDepartmentIndex,
    erpProjectsDepartmentManagerDepartmentManager,
    erpProjectsProjectManagerProjectManager,
    erpProjectsProjectMemberMemberCreate,
    erpProjectsProjectMemberMemberErase,
    erpProjectsProjectMemberMemberIndex,
    erpProjectsProjectMemberMemberUpdate,
    erpProjectsProjectProjectCreate,
    erpProjectsProjectProjectIndex,
    erpProjectsProjectProjectUpdate,
    erpProjectsProjectTaskTaskIndex,
    erpProjectsTaskHistoryTaskHistory,
    erpProjectsTaskTaskCreate,
    erpProjectsTaskTaskUpdate,
    erpPurchaseOrderChangeRequestOrderChangeRequest,
    erpPurchaseOrderOrderAt,
    erpPurchaseOrderOrderCreate,
    erpPurchaseOrderOrderErase,
    erpPurchaseOrderOrderIndex,
    erpPurchaseOrderOrderTransition,
    erpPurchaseOrderOrderUpdate,
    erpPurchaseOrderChangeApplyOrderChangeApply,
    erpPurchaseReceiptPostReceiptPost,
    erpPurchaseReceiptReceiptAt,
    erpPurchaseReceiptReceiptCreate,
    erpPurchaseRequestRequestAt,
    erpPurchaseRequestRequestCreate,
    erpPurchaseRequestRequestErase,
    erpPurchaseRequestRequestIndex,
    erpPurchaseRequestRequestTransition,
    erpPurchaseRequestRequestUpdate,
    erpQualityMaintenancePlanInspectionDeactivateInspectionDeactivate,
    erpQualityMaintenancePlanInspectionInspectionCreate,
    erpQualityMaintenancePlanInspectionInspectionIndex,
    erpQualityMaintenancePlanInspectionInspectionUpdate,
    erpQualityMaintenancePlanMaintenanceDeactivateMaintenanceDeactivate,
    erpQualityMaintenancePlanMaintenanceGenerateMaintenanceGenerate,
    erpQualityMaintenancePlanMaintenanceMaintenanceCreate,
    erpQualityMaintenancePlanMaintenanceMaintenanceIndex,
    erpQualityMaintenancePlanMaintenanceMaintenanceUpdate,
    erpQuarantineCreate,
    erpQuarantineDisposition,
    erpQuarantineIndex,
    erpSalesOrderApproveOrderApprove,
    erpSalesOrderOrderAt,
    erpSalesOrderOrderCreate,
    erpSalesOrderOrderErase,
    erpSalesOrderOrderIndex,
    erpSalesOrderOrderUpdate,
    erpSalesOrderTransitionOrderTransition,
    erpSalesShipmentCancelShipmentCancel,
    erpSalesShipmentDeliverShipmentDeliver,
    erpSalesShipmentPackShipmentPack,
    erpSalesShipmentPickShipmentPick,
    erpSalesShipmentPostShipmentPost,
    erpSalesShipmentShipmentCreate,
    erpSalesFinanceInvoiceVoidInvoiceVoid,
    erpSalesFinanceInvoiceApproveInvoiceApprove,
    erpSalesFinanceInvoiceInvoiceCreate,
    erpSalesFinanceInvoiceInvoiceUpdate,
    erpSalesFinanceInvoicePostInvoicePost,
    erpSalesFinanceInvoiceSendInvoiceSend,
    erpSalesFinanceInvoiceSubmitInvoiceSubmit,
    erpSalesFinancePaymentAllocationPaymentAllocationCreate,
    erpSalesFinancePaymentAllocationPaymentAllocationErase,
    erpSalesFinancePaymentAllocationPaymentAllocationIndex,
    erpSalesFinancePaymentAllocationPaymentAllocationUpdate,
    erpSalesFinancePaymentPaymentCreate,
    erpSalesFinancePaymentPaymentIndex,
    erpSalesFinancePaymentPostPaymentPost,
    erpSalesFinanceQuoteConvertQuoteConvert,
    erpSalesFinanceQuoteQuoteCreate,
    erpSalesFinanceQuoteQuoteIndex,
    erpSalesFinanceQuoteQuoteTransition,
    erpSalesPriceCreate,
    erpSalesPriceDeactivate,
    erpSalesPriceIndex,
    erpSalesPriceResolve,
    erpSalesQuoteConvert,
    erpSalesQuoteCreate,
    erpSalesQuoteIndex,
    erpSalesQuoteState,
    erpSalesQuoteUpdate,
    erpServiceOrderAssign,
    erpServiceOrderCancel,
    erpServiceOrderComplete,
    erpServiceOrderCreate,
    erpServiceOrderIndex,
    erpServiceOrderStart,
    erpServiceOrderUpdate,
    erpStockBalanceBalanceIndex,
    erpStockMovementMovementIndex,
    erpTaxReturnAmend,
    erpTaxReturnApprove,
    erpTaxReturnCreate,
    erpTaxReturnFile,
    erpTaxReturnIndex,
    erpTaxReturnReconcile,
    erpUnitUnitCreate,
    erpUnitUnitErase,
    erpUnitUnitIndex,
    erpUnitUnitUpdate,
    erpVendorCreditApply,
    erpVendorCreditCreate,
    erpVendorCreditIndex,
    erpVendorCreditRefund,
    erpWarehouseWarehouseAt,
    erpWarehouseWarehouseCreate,
    erpWarehouseWarehouseErase,
    erpWarehouseWarehouseIndex,
    erpWarehouseWarehouseUpdate,
    erpWorkforceContractContractCreate,
    erpWorkforceContractContractIndex,
    erpWorkforceEmployeeEmployeeCreate,
    erpWorkforceEmployeeEmployeeIndex,
    erpWorkforceEmployeeEmployeeUpdate,
    erpWorkforcePayrollAdjustPayrollAdjust,
    erpWorkforcePayrollApprovePayrollApprove,
    erpWorkforcePayrollCalculatePayrollCalculate,
    erpWorkforcePayrollPayPayrollPay,
    erpWorkforcePayrollPayrollCreate,
    erpWorkforcePayrollPayrollIndex,
    erpWorkforcePayrollPostPayrollPost,
    erpWorkforcePayrollPublishPayrollPublish,
    erpWorkforcePayrollReversePayrollReverse,
    erpWorkforcePayslipPayslipAt,
    erpWorkforcePayslipPayslipIndex,
    erpWorkforceTimelogTimelogCreate,
    erpWorkforceTimelogTimelogErase,
    erpWorkforceTimelogTimelogIndex,
    erpWorkforceTimelogTimelogUpdate,
    erpWorkforceTimesheetApproveTimesheetApprove,
    erpWorkforceTimesheetRejectTimesheetReject,
    erpWorkforceTimesheetReopenTimesheetReopen,
    erpWorkforceTimesheetSubmitTimesheetSubmit,
    erpWorkforceTimesheetTimesheetCreate,
    erpWorkforceTimesheetTimesheetIndex,
    healthGet,
  };
}
