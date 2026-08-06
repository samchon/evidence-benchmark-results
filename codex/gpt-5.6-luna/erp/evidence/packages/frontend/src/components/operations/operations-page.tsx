import { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";

import {
  useAccountCreateCreate,
  useAccountDeleteRemove,
  useAccountMergeRequestApplyApply,
  useAccountMergeRequestCreateCreate,
  useAccountMergeRequestSearchIndex,
  useAccountMergeRequestStatusStatus,
  useAccountSearchIndex,
  useAccountStatusStatus,
  useAccountUpdateUpdate,
  useAddressCreateCreate,
  useAddressSearchIndex,
  useAddressStatusStatus,
  useAddressUpdateUpdate,
  useAllocationRuleCreateCreate,
  useAllocationRuleExecuteExecute,
  useAllocationRulePostPost,
  useAllocationRuleSearchIndex,
  useAllocationRuleStatusStatus,
  useApprovalRequestCreateCreate,
  useApprovalRequestDelegateDelegate,
  useApprovalRequestEscalateEscalate,
  useApprovalRequestSearchIndex,
  useApprovalRequestStatusStatus,
  useApprovalWorkflowCreateCreate,
  useApprovalWorkflowSearchIndex,
  useApprovalWorkflowStatusStatus,
  useApprovalWorkflowVersionVersion,
  useAssetCategoryCreateCreate,
  useAssetCategorySearchIndex,
  useAssetCategoryStatusStatus,
  useAssetDisposalCreateCreate,
  useAssetDisposalSearchIndex,
  useAssetDisposalStatusStatus,
  useAssetImpairmentCreateCreate,
  useAssetImpairmentSearchIndex,
  useAssetImpairmentStatusStatus,
  useAssetTransferCreateCreate,
  useAssetTransferSearchIndex,
  useAssetTransferStatusStatus,
  useAttachmentCreateCreate,
  useAttachmentDeleteRemove,
  useAttachmentSearchIndex,
  useAuditEventDetailAt,
  useAuditEventSearchIndex,
  useAuthUserJoinJoin,
  useAuthUserLoginLogin,
  useAuthUserRefreshRefresh,
  useAuthDeactivateDeactivate,
  useAuthPasswordChange,
  useAuthProfileProfile,
  useAuthProfileUpdateUpdate,
  useAuthRecoveryCompleteComplete,
  useAuthRecoveryRequestRequest,
  useAuthSessionAllAllLogoutAll,
  useAuthSessionCurrentLogout,
  useAuthSessionOrganizationOrganizationSelect,
  useBankAccountCreateCreate,
  useBankAccountSearchIndex,
  useBankAccountStatusStatus,
  useBankAccountUpdateUpdate,
  useBankTransactionCreateCreate,
  useBankTransactionIgnoreIgnore,
  useBankTransactionMatchMatch,
  useBankTransactionSearchIndex,
  useBomCreateCreate,
  useBomLineCreateCreate,
  useBomLineSearchIndex,
  useBomSearchIndex,
  useBomStatusStatus,
  useBudgetCreateCreate,
  useBudgetLineCreateCreate,
  useBudgetLineSearchIndex,
  useBudgetRevisionCreateCreate,
  useBudgetRevisionStatusStatus,
  useBudgetSearchIndex,
  useBudgetStatusStatus,
  useClosingSnapshotCreateCreate,
  useClosingSnapshotSearchIndex,
  useCommentCreateCreate,
  useCommentDeleteRemove,
  useCommentSearchIndex,
  useCommentUpdateUpdate,
  useContactAssignmentAssign,
  useContactCreateCreate,
  useContactSearchIndex,
  useContactStatusStatus,
  useContactUpdateUpdate,
  useCostCenterCreateCreate,
  useCostCenterSearchIndex,
  useCostCenterStatusStatus,
  useCreditMemoCreateCreate,
  useCreditMemoLineCreateCreate,
  useCreditMemoLineSearchIndex,
  useCreditMemoSearchIndex,
  useCreditMemoStatusStatus,
  useCurrencyCreateCreate,
  useCurrencySearchIndex,
  useCurrencyStatusStatus,
  useCurrencyUpdateUpdate,
  useCustomFieldDefinitionCreateCreate,
  useCustomFieldDefinitionSearchIndex,
  useCustomFieldDefinitionStatusStatus,
  useCustomFieldDefinitionUpdateUpdate,
  useCustomFieldValueSearchIndex,
  useCustomFieldValueSetSet,
  useCustomerCreateCreate,
  useCustomerDeleteRemove,
  useCustomerPaymentAllocationCreateCreate,
  useCustomerPaymentAllocationSearchIndex,
  useCustomerPaymentCreateCreate,
  useCustomerPaymentSearchIndex,
  useCustomerPaymentStatusStatus,
  useCustomerSearchIndex,
  useCustomerStatusStatus,
  useCustomerUpdateUpdate,
  useCycleCountCreateCreate,
  useCycleCountSearchIndex,
  useCycleCountStatusStatus,
  useDepartmentCreateCreate,
  useDepartmentSearchIndex,
  useDepartmentStatusStatus,
  useDepartmentUpdateUpdate,
  useDepreciationRunCreateCreate,
  useDepreciationRunSearchIndex,
  useDepreciationRunStatusStatus,
  useDepreciationScheduleCreateCreate,
  useDepreciationScheduleSearchIndex,
  useDepreciationScheduleStatusStatus,
  useDispositionCreateCreate,
  useDispositionSearchIndex,
  useDispositionStatusStatus,
  useDocumentNumberCreateCreate,
  useDocumentNumberIssueIssue,
  useDocumentNumberSearchIndex,
  useDocumentNumberUpdateUpdate,
  useEmployeeCreateCreate,
  useEmployeeSearchIndex,
  useEmployeeStatusStatus,
  useEmployeeUpdateUpdate,
  useEmploymentContractCreateCreate,
  useEmploymentContractSearchIndex,
  useEmploymentContractStatusStatus,
  useEquipmentCreateCreate,
  useEquipmentSearchIndex,
  useEquipmentStatusStatus,
  useExchangeRateRecordRecord,
  useExchangeRateRefreshRefresh,
  useExchangeRateResolveResolve,
  useExchangeRateSearchIndex,
  useFiscalCalendarCreateCreate,
  useFiscalCalendarSearchIndex,
  useFiscalPeriodReopenRequestApplyApply,
  useFiscalPeriodReopenRequestCreateCreate,
  useFiscalPeriodReopenRequestSearchSearch,
  useFiscalPeriodReopenRequestStatusStatus,
  useFiscalPeriodStatusStatus,
  useFixedAssetCreateCreate,
  useFixedAssetSearchIndex,
  useFixedAssetStatusStatus,
  useHealthGet,
  useInspectionOrderCreateCreate,
  useInspectionOrderSearchIndex,
  useInspectionOrderStatusStatus,
  useInspectionPlanCreateCreate,
  useInspectionPlanSearchIndex,
  useInspectionPlanStatusStatus,
  useInventoryAdjustmentCreateCreate,
  useInventoryAdjustmentSearchIndex,
  useInventoryAdjustmentStatusStatus,
  useInventoryLotCreateCreate,
  useInventoryLotSearchIndex,
  useInventoryLotStatusStatus,
  useItemCreateCreate,
  useItemSearchIndex,
  useItemSerialCreateCreate,
  useItemSerialSearchIndex,
  useItemSerialStatusStatus,
  useItemStatusStatus,
  useItemUpdateUpdate,
  useJournalCreateCreate,
  useJournalDeleteRemove,
  useJournalPostPost,
  useJournalReverseReverse,
  useJournalSearchIndex,
  useJournalUpdateUpdate,
  useJournalVoidVoid,
  useMachineCreateCreate,
  useMachineSearchIndex,
  useMachineStatusStatus,
  useMaintenanceOrderCreateCreate,
  useMaintenanceOrderSearchIndex,
  useMaintenanceOrderStatusStatus,
  useMaintenancePlanCreateCreate,
  useMaintenancePlanSearchIndex,
  useMaintenancePlanStatusStatus,
  useMrpRecommendationCreateCreate,
  useMrpRecommendationSearchIndex,
  useMrpRecommendationStatusStatus,
  useMrpRunCreateCreate,
  useMrpRunSearchIndex,
  useMrpRunStatusStatus,
  useNotificationCreateCreate,
  useNotificationDispatchDispatch,
  useNotificationPreferencePreference,
  useNotificationPreferenceUpdateUpdate,
  useNotificationRetryRetry,
  useNotificationSearchIndex,
  useNotificationStatusStatus,
  useOrganizationCreate,
  useOrganizationDeleteRemove,
  useOrganizationDeleteBlockersCheck,
  useOrganizationDetailAt,
  useOrganizationMembershipInviteInvite,
  useOrganizationMembershipListListIndex,
  useOrganizationMembershipStatusStatus,
  useOrganizationSearchIndex,
  useOrganizationUpdateUpdate,
  usePartyChangeRequestApplyApply,
  usePartyChangeRequestCreateCreate,
  usePartyChangeRequestSearchIndex,
  usePartyChangeRequestStatusStatus,
  usePayScheduleCreateCreate,
  usePayScheduleSearchIndex,
  usePayScheduleStatusStatus,
  usePaymentTermCreateCreate,
  usePaymentTermSearchIndex,
  usePaymentTermStatusStatus,
  usePaymentTermUpdateUpdate,
  usePayrollConfigurationCreateCreate,
  usePayrollConfigurationSearchIndex,
  usePayrollConfigurationStatusStatus,
  usePayrollRunCreateCreate,
  usePayrollRunSearchIndex,
  usePayrollRunStatusStatus,
  usePayslipCreateCreate,
  usePayslipSearchIndex,
  usePayslipStatusStatus,
  useProductionOrderCreateCreate,
  useProductionOrderLineCreateCreate,
  useProductionOrderLineSearchIndex,
  useProductionOrderSearchIndex,
  useProductionOrderStatusStatus,
  useProfitCenterCreateCreate,
  useProfitCenterSearchIndex,
  useProfitCenterStatusStatus,
  useProjectCreateCreate,
  useProjectMemberCreateCreate,
  useProjectMemberSearchIndex,
  useProjectMemberStatusStatus,
  useProjectSearchIndex,
  useProjectStatusStatus,
  usePurchaseOrderChangeRequestApplyApply,
  usePurchaseOrderChangeRequestCreateCreate,
  usePurchaseOrderChangeRequestSearchSearch,
  usePurchaseOrderChangeRequestStatusStatus,
  usePurchaseOrderCreateCreate,
  usePurchaseOrderLineCreateCreate,
  usePurchaseOrderLineSearchIndex,
  usePurchaseOrderSearchIndex,
  usePurchaseOrderStatusStatus,
  usePurchaseReceiptCreateCreate,
  usePurchaseReceiptLineCreateCreate,
  usePurchaseReceiptLineSearchIndex,
  usePurchaseReceiptSearchIndex,
  usePurchaseReceiptStatusStatus,
  usePurchaseRequestCreateCreate,
  usePurchaseRequestLineCreate,
  usePurchaseRequestSearchIndex,
  usePurchaseRequestStatusStatus,
  usePurchaseReturnCreateCreate,
  usePurchaseReturnSearchIndex,
  usePurchaseReturnStatusStatus,
  useQuarantineCreateCreate,
  useQuarantineSearchIndex,
  useQuarantineStatusStatus,
  useReconciliationCompleteComplete,
  useReconciliationCreateCreate,
  useReconciliationLineLine,
  useReconciliationReopenReopen,
  useReconciliationSearchIndex,
  useReportExportExport,
  useReportGenerateGenerate,
  useRoleAssignAssign,
  useRoleCreateCreate,
  useRoleDeleteRemove,
  useRoleRevokeRevoke,
  useRoleSearchIndex,
  useRoleUpdateUpdate,
  useRoutingCreateCreate,
  useRoutingSearchIndex,
  useRoutingStatusStatus,
  useRoutingStepCreateCreate,
  useRoutingStepSearchIndex,
  useSalesInvoiceCreateCreate,
  useSalesInvoiceLineCreateCreate,
  useSalesInvoiceLineSearchIndex,
  useSalesInvoiceSearchIndex,
  useSalesInvoiceStatusStatus,
  useSalesOrderCreateCreate,
  useSalesOrderLineCreateCreate,
  useSalesOrderLineSearchIndex,
  useSalesOrderSearchIndex,
  useSalesOrderStatusStatus,
  useSalesPriceCreateCreate,
  useSalesPriceSearchIndex,
  useSalesPriceStatusStatus,
  useSalesQuoteCreateCreate,
  useSalesQuoteLineCreateCreate,
  useSalesQuoteLineSearchIndex,
  useSalesQuoteSearchIndex,
  useSalesQuoteStatusStatus,
  useSalesReturnCreateCreate,
  useSalesReturnLineCreateCreate,
  useSalesReturnLineSearchIndex,
  useSalesReturnSearchIndex,
  useSalesReturnStatusStatus,
  useServiceCaseCreateCreate,
  useServiceCaseSearchIndex,
  useServiceCaseStatusStatus,
  useServiceOrderCreateCreate,
  useServiceOrderSearchIndex,
  useServiceOrderStatusStatus,
  useShipmentCreateCreate,
  useShipmentLineCreateCreate,
  useShipmentLineSearchIndex,
  useShipmentSearchIndex,
  useShipmentStatusStatus,
  useStockAllocationCreateCreate,
  useStockAllocationSearchIndex,
  useStockAllocationStatusStatus,
  useStockMovementCreateCreate,
  useStockMovementSearchIndex,
  useStockQuantityQuantity,
  useStorageLocationCreateCreate,
  useStorageLocationSearchIndex,
  useStorageLocationStatusStatus,
  useStorageLocationUpdateUpdate,
  useTagAssignmentCreateCreate,
  useTagAssignmentDeleteRemove,
  useTagAssignmentSearchSearch,
  useTagCreateCreate,
  useTagSearchIndex,
  useTagStatusStatus,
  useTagUpdateUpdate,
  useTaskCreateCreate,
  useTaskSearchIndex,
  useTaskStatusStatus,
  useTaxCodeCreateCreate,
  useTaxCodeSearchIndex,
  useTaxCodeStatusStatus,
  useTaxCodeUpdateUpdate,
  useTaxJurisdictionCreateCreate,
  useTaxJurisdictionSearchIndex,
  useTaxJurisdictionStatusStatus,
  useTaxJurisdictionUpdateUpdate,
  useTaxRateCreateCreate,
  useTaxRateResolveResolve,
  useTaxRateSearchIndex,
  useTaxReturnAmendAmend,
  useTaxReturnCreateCreate,
  useTaxReturnSearchIndex,
  useTaxReturnStatusStatus,
  useTimelogCreateCreate,
  useTimelogSearchIndex,
  useTimelogStatusStatus,
  useTimesheetCreateCreate,
  useTimesheetLineCreateCreate,
  useTimesheetLineSearchIndex,
  useTimesheetSearchIndex,
  useTimesheetStatusStatus,
  useTransferCreateCreate,
  useTransferSearchIndex,
  useTransferStatusStatus,
  useUomCreateCreate,
  useUomSearchIndex,
  useUomStatusStatus,
  useUomUpdateUpdate,
  useVendorBillCreateCreate,
  useVendorBillLineCreateCreate,
  useVendorBillLineSearchIndex,
  useVendorBillSearchIndex,
  useVendorBillStatusStatus,
  useVendorCreateCreate,
  useVendorCreditAllocationCreateCreate,
  useVendorCreditAllocationSearchIndex,
  useVendorCreditCreateCreate,
  useVendorCreditSearchIndex,
  useVendorCreditStatusStatus,
  useVendorDeleteRemove,
  useVendorPaymentAllocationCreateCreate,
  useVendorPaymentAllocationSearchIndex,
  useVendorPaymentCreateCreate,
  useVendorPaymentSearchIndex,
  useVendorPaymentStatusStatus,
  useVendorSearchIndex,
  useVendorStatusStatus,
  useVendorUpdateUpdate,
  useWarehouseCreateCreate,
  useWarehouseSearchIndex,
  useWarehouseStatusStatus,
  useWarehouseUpdateUpdate,
  useWorkCenterCreateCreate,
  useWorkCenterSearchIndex,
  useWorkCenterStatusStatus,
} from "../../lib/operations/hooks";

/**
 * Typed operation workbench for the generated ERP command surface.
 *
 * It keeps every published capability reachable from one responsive,
 * keyboard-accessible screen while domain workflows are assembled from the
 * same hooks.
 * @evidence {@link useAccountCreateCreate} Renders the AccountCreateCreate command capability in the workbench.
 * @evidence {@link useAccountDeleteRemove} Renders the AccountDeleteRemove command capability in the workbench.
 * @evidence {@link useAccountMergeRequestApplyApply} Renders the AccountMergeRequestApplyApply command capability in the workbench.
 * @evidence {@link useAccountMergeRequestCreateCreate} Renders the AccountMergeRequestCreateCreate command capability in the workbench.
 * @evidence {@link useAccountMergeRequestSearchIndex} Renders the AccountMergeRequestSearchIndex command capability in the workbench.
 * @evidence {@link useAccountMergeRequestStatusStatus} Renders the AccountMergeRequestStatusStatus command capability in the workbench.
 * @evidence {@link useAccountSearchIndex} Renders the AccountSearchIndex command capability in the workbench.
 * @evidence {@link useAccountStatusStatus} Renders the AccountStatusStatus command capability in the workbench.
 * @evidence {@link useAccountUpdateUpdate} Renders the AccountUpdateUpdate command capability in the workbench.
 * @evidence {@link useAddressCreateCreate} Renders the AddressCreateCreate command capability in the workbench.
 * @evidence {@link useAddressSearchIndex} Renders the AddressSearchIndex command capability in the workbench.
 * @evidence {@link useAddressStatusStatus} Renders the AddressStatusStatus command capability in the workbench.
 * @evidence {@link useAddressUpdateUpdate} Renders the AddressUpdateUpdate command capability in the workbench.
 * @evidence {@link useAllocationRuleCreateCreate} Renders the AllocationRuleCreateCreate command capability in the workbench.
 * @evidence {@link useAllocationRuleExecuteExecute} Renders the AllocationRuleExecuteExecute command capability in the workbench.
 * @evidence {@link useAllocationRulePostPost} Renders the AllocationRulePostPost command capability in the workbench.
 * @evidence {@link useAllocationRuleSearchIndex} Renders the AllocationRuleSearchIndex command capability in the workbench.
 * @evidence {@link useAllocationRuleStatusStatus} Renders the AllocationRuleStatusStatus command capability in the workbench.
 * @evidence {@link useApprovalRequestCreateCreate} Renders the ApprovalRequestCreateCreate command capability in the workbench.
 * @evidence {@link useApprovalRequestDelegateDelegate} Renders the ApprovalRequestDelegateDelegate command capability in the workbench.
 * @evidence {@link useApprovalRequestEscalateEscalate} Renders the ApprovalRequestEscalateEscalate command capability in the workbench.
 * @evidence {@link useApprovalRequestSearchIndex} Renders the ApprovalRequestSearchIndex command capability in the workbench.
 * @evidence {@link useApprovalRequestStatusStatus} Renders the ApprovalRequestStatusStatus command capability in the workbench.
 * @evidence {@link useApprovalWorkflowCreateCreate} Renders the ApprovalWorkflowCreateCreate command capability in the workbench.
 * @evidence {@link useApprovalWorkflowSearchIndex} Renders the ApprovalWorkflowSearchIndex command capability in the workbench.
 * @evidence {@link useApprovalWorkflowStatusStatus} Renders the ApprovalWorkflowStatusStatus command capability in the workbench.
 * @evidence {@link useApprovalWorkflowVersionVersion} Renders the ApprovalWorkflowVersionVersion command capability in the workbench.
 * @evidence {@link useAssetCategoryCreateCreate} Renders the AssetCategoryCreateCreate command capability in the workbench.
 * @evidence {@link useAssetCategorySearchIndex} Renders the AssetCategorySearchIndex command capability in the workbench.
 * @evidence {@link useAssetCategoryStatusStatus} Renders the AssetCategoryStatusStatus command capability in the workbench.
 * @evidence {@link useAssetDisposalCreateCreate} Renders the AssetDisposalCreateCreate command capability in the workbench.
 * @evidence {@link useAssetDisposalSearchIndex} Renders the AssetDisposalSearchIndex command capability in the workbench.
 * @evidence {@link useAssetDisposalStatusStatus} Renders the AssetDisposalStatusStatus command capability in the workbench.
 * @evidence {@link useAssetImpairmentCreateCreate} Renders the AssetImpairmentCreateCreate command capability in the workbench.
 * @evidence {@link useAssetImpairmentSearchIndex} Renders the AssetImpairmentSearchIndex command capability in the workbench.
 * @evidence {@link useAssetImpairmentStatusStatus} Renders the AssetImpairmentStatusStatus command capability in the workbench.
 * @evidence {@link useAssetTransferCreateCreate} Renders the AssetTransferCreateCreate command capability in the workbench.
 * @evidence {@link useAssetTransferSearchIndex} Renders the AssetTransferSearchIndex command capability in the workbench.
 * @evidence {@link useAssetTransferStatusStatus} Renders the AssetTransferStatusStatus command capability in the workbench.
 * @evidence {@link useAttachmentCreateCreate} Renders the AttachmentCreateCreate command capability in the workbench.
 * @evidence {@link useAttachmentDeleteRemove} Renders the AttachmentDeleteRemove command capability in the workbench.
 * @evidence {@link useAttachmentSearchIndex} Renders the AttachmentSearchIndex command capability in the workbench.
 * @evidence {@link useAuditEventDetailAt} Renders the AuditEventDetailAt command capability in the workbench.
 * @evidence {@link useAuditEventSearchIndex} Renders the AuditEventSearchIndex command capability in the workbench.
 * @evidence {@link useAuthUserJoinJoin} Renders the AuthUserJoinJoin command capability in the workbench.
 * @evidence {@link useAuthUserLoginLogin} Renders the AuthUserLoginLogin command capability in the workbench.
 * @evidence {@link useAuthUserRefreshRefresh} Renders the AuthUserRefreshRefresh command capability in the workbench.
 * @evidence {@link useAuthDeactivateDeactivate} Renders the AuthDeactivateDeactivate command capability in the workbench.
 * @evidence {@link useAuthPasswordChange} Renders the AuthPasswordChange command capability in the workbench.
 * @evidence {@link useAuthProfileProfile} Renders the AuthProfileProfile command capability in the workbench.
 * @evidence {@link useAuthProfileUpdateUpdate} Renders the AuthProfileUpdateUpdate command capability in the workbench.
 * @evidence {@link useAuthRecoveryCompleteComplete} Renders the AuthRecoveryCompleteComplete command capability in the workbench.
 * @evidence {@link useAuthRecoveryRequestRequest} Renders the AuthRecoveryRequestRequest command capability in the workbench.
 * @evidence {@link useAuthSessionAllAllLogoutAll} Renders the AuthSessionAllAllLogoutAll command capability in the workbench.
 * @evidence {@link useAuthSessionCurrentLogout} Renders the AuthSessionCurrentLogout command capability in the workbench.
 * @evidence {@link useAuthSessionOrganizationOrganizationSelect} Renders the AuthSessionOrganizationOrganizationSelect command capability in the workbench.
 * @evidence {@link useBankAccountCreateCreate} Renders the BankAccountCreateCreate command capability in the workbench.
 * @evidence {@link useBankAccountSearchIndex} Renders the BankAccountSearchIndex command capability in the workbench.
 * @evidence {@link useBankAccountStatusStatus} Renders the BankAccountStatusStatus command capability in the workbench.
 * @evidence {@link useBankAccountUpdateUpdate} Renders the BankAccountUpdateUpdate command capability in the workbench.
 * @evidence {@link useBankTransactionCreateCreate} Renders the BankTransactionCreateCreate command capability in the workbench.
 * @evidence {@link useBankTransactionIgnoreIgnore} Renders the BankTransactionIgnoreIgnore command capability in the workbench.
 * @evidence {@link useBankTransactionMatchMatch} Renders the BankTransactionMatchMatch command capability in the workbench.
 * @evidence {@link useBankTransactionSearchIndex} Renders the BankTransactionSearchIndex command capability in the workbench.
 * @evidence {@link useBomCreateCreate} Renders the BomCreateCreate command capability in the workbench.
 * @evidence {@link useBomLineCreateCreate} Renders the BomLineCreateCreate command capability in the workbench.
 * @evidence {@link useBomLineSearchIndex} Renders the BomLineSearchIndex command capability in the workbench.
 * @evidence {@link useBomSearchIndex} Renders the BomSearchIndex command capability in the workbench.
 * @evidence {@link useBomStatusStatus} Renders the BomStatusStatus command capability in the workbench.
 * @evidence {@link useBudgetCreateCreate} Renders the BudgetCreateCreate command capability in the workbench.
 * @evidence {@link useBudgetLineCreateCreate} Renders the BudgetLineCreateCreate command capability in the workbench.
 * @evidence {@link useBudgetLineSearchIndex} Renders the BudgetLineSearchIndex command capability in the workbench.
 * @evidence {@link useBudgetRevisionCreateCreate} Renders the BudgetRevisionCreateCreate command capability in the workbench.
 * @evidence {@link useBudgetRevisionStatusStatus} Renders the BudgetRevisionStatusStatus command capability in the workbench.
 * @evidence {@link useBudgetSearchIndex} Renders the BudgetSearchIndex command capability in the workbench.
 * @evidence {@link useBudgetStatusStatus} Renders the BudgetStatusStatus command capability in the workbench.
 * @evidence {@link useClosingSnapshotCreateCreate} Renders the ClosingSnapshotCreateCreate command capability in the workbench.
 * @evidence {@link useClosingSnapshotSearchIndex} Renders the ClosingSnapshotSearchIndex command capability in the workbench.
 * @evidence {@link useCommentCreateCreate} Renders the CommentCreateCreate command capability in the workbench.
 * @evidence {@link useCommentDeleteRemove} Renders the CommentDeleteRemove command capability in the workbench.
 * @evidence {@link useCommentSearchIndex} Renders the CommentSearchIndex command capability in the workbench.
 * @evidence {@link useCommentUpdateUpdate} Renders the CommentUpdateUpdate command capability in the workbench.
 * @evidence {@link useContactAssignmentAssign} Renders the ContactAssignmentAssign command capability in the workbench.
 * @evidence {@link useContactCreateCreate} Renders the ContactCreateCreate command capability in the workbench.
 * @evidence {@link useContactSearchIndex} Renders the ContactSearchIndex command capability in the workbench.
 * @evidence {@link useContactStatusStatus} Renders the ContactStatusStatus command capability in the workbench.
 * @evidence {@link useContactUpdateUpdate} Renders the ContactUpdateUpdate command capability in the workbench.
 * @evidence {@link useCostCenterCreateCreate} Renders the CostCenterCreateCreate command capability in the workbench.
 * @evidence {@link useCostCenterSearchIndex} Renders the CostCenterSearchIndex command capability in the workbench.
 * @evidence {@link useCostCenterStatusStatus} Renders the CostCenterStatusStatus command capability in the workbench.
 * @evidence {@link useCreditMemoCreateCreate} Renders the CreditMemoCreateCreate command capability in the workbench.
 * @evidence {@link useCreditMemoLineCreateCreate} Renders the CreditMemoLineCreateCreate command capability in the workbench.
 * @evidence {@link useCreditMemoLineSearchIndex} Renders the CreditMemoLineSearchIndex command capability in the workbench.
 * @evidence {@link useCreditMemoSearchIndex} Renders the CreditMemoSearchIndex command capability in the workbench.
 * @evidence {@link useCreditMemoStatusStatus} Renders the CreditMemoStatusStatus command capability in the workbench.
 * @evidence {@link useCurrencyCreateCreate} Renders the CurrencyCreateCreate command capability in the workbench.
 * @evidence {@link useCurrencySearchIndex} Renders the CurrencySearchIndex command capability in the workbench.
 * @evidence {@link useCurrencyStatusStatus} Renders the CurrencyStatusStatus command capability in the workbench.
 * @evidence {@link useCurrencyUpdateUpdate} Renders the CurrencyUpdateUpdate command capability in the workbench.
 * @evidence {@link useCustomFieldDefinitionCreateCreate} Renders the CustomFieldDefinitionCreateCreate command capability in the workbench.
 * @evidence {@link useCustomFieldDefinitionSearchIndex} Renders the CustomFieldDefinitionSearchIndex command capability in the workbench.
 * @evidence {@link useCustomFieldDefinitionStatusStatus} Renders the CustomFieldDefinitionStatusStatus command capability in the workbench.
 * @evidence {@link useCustomFieldDefinitionUpdateUpdate} Renders the CustomFieldDefinitionUpdateUpdate command capability in the workbench.
 * @evidence {@link useCustomFieldValueSearchIndex} Renders the CustomFieldValueSearchIndex command capability in the workbench.
 * @evidence {@link useCustomFieldValueSetSet} Renders the CustomFieldValueSetSet command capability in the workbench.
 * @evidence {@link useCustomerCreateCreate} Renders the CustomerCreateCreate command capability in the workbench.
 * @evidence {@link useCustomerDeleteRemove} Renders the CustomerDeleteRemove command capability in the workbench.
 * @evidence {@link useCustomerPaymentAllocationCreateCreate} Renders the CustomerPaymentAllocationCreateCreate command capability in the workbench.
 * @evidence {@link useCustomerPaymentAllocationSearchIndex} Renders the CustomerPaymentAllocationSearchIndex command capability in the workbench.
 * @evidence {@link useCustomerPaymentCreateCreate} Renders the CustomerPaymentCreateCreate command capability in the workbench.
 * @evidence {@link useCustomerPaymentSearchIndex} Renders the CustomerPaymentSearchIndex command capability in the workbench.
 * @evidence {@link useCustomerPaymentStatusStatus} Renders the CustomerPaymentStatusStatus command capability in the workbench.
 * @evidence {@link useCustomerSearchIndex} Renders the CustomerSearchIndex command capability in the workbench.
 * @evidence {@link useCustomerStatusStatus} Renders the CustomerStatusStatus command capability in the workbench.
 * @evidence {@link useCustomerUpdateUpdate} Renders the CustomerUpdateUpdate command capability in the workbench.
 * @evidence {@link useCycleCountCreateCreate} Renders the CycleCountCreateCreate command capability in the workbench.
 * @evidence {@link useCycleCountSearchIndex} Renders the CycleCountSearchIndex command capability in the workbench.
 * @evidence {@link useCycleCountStatusStatus} Renders the CycleCountStatusStatus command capability in the workbench.
 * @evidence {@link useDepartmentCreateCreate} Renders the DepartmentCreateCreate command capability in the workbench.
 * @evidence {@link useDepartmentSearchIndex} Renders the DepartmentSearchIndex command capability in the workbench.
 * @evidence {@link useDepartmentStatusStatus} Renders the DepartmentStatusStatus command capability in the workbench.
 * @evidence {@link useDepartmentUpdateUpdate} Renders the DepartmentUpdateUpdate command capability in the workbench.
 * @evidence {@link useDepreciationRunCreateCreate} Renders the DepreciationRunCreateCreate command capability in the workbench.
 * @evidence {@link useDepreciationRunSearchIndex} Renders the DepreciationRunSearchIndex command capability in the workbench.
 * @evidence {@link useDepreciationRunStatusStatus} Renders the DepreciationRunStatusStatus command capability in the workbench.
 * @evidence {@link useDepreciationScheduleCreateCreate} Renders the DepreciationScheduleCreateCreate command capability in the workbench.
 * @evidence {@link useDepreciationScheduleSearchIndex} Renders the DepreciationScheduleSearchIndex command capability in the workbench.
 * @evidence {@link useDepreciationScheduleStatusStatus} Renders the DepreciationScheduleStatusStatus command capability in the workbench.
 * @evidence {@link useDispositionCreateCreate} Renders the DispositionCreateCreate command capability in the workbench.
 * @evidence {@link useDispositionSearchIndex} Renders the DispositionSearchIndex command capability in the workbench.
 * @evidence {@link useDispositionStatusStatus} Renders the DispositionStatusStatus command capability in the workbench.
 * @evidence {@link useDocumentNumberCreateCreate} Renders the DocumentNumberCreateCreate command capability in the workbench.
 * @evidence {@link useDocumentNumberIssueIssue} Renders the DocumentNumberIssueIssue command capability in the workbench.
 * @evidence {@link useDocumentNumberSearchIndex} Renders the DocumentNumberSearchIndex command capability in the workbench.
 * @evidence {@link useDocumentNumberUpdateUpdate} Renders the DocumentNumberUpdateUpdate command capability in the workbench.
 * @evidence {@link useEmployeeCreateCreate} Renders the EmployeeCreateCreate command capability in the workbench.
 * @evidence {@link useEmployeeSearchIndex} Renders the EmployeeSearchIndex command capability in the workbench.
 * @evidence {@link useEmployeeStatusStatus} Renders the EmployeeStatusStatus command capability in the workbench.
 * @evidence {@link useEmployeeUpdateUpdate} Renders the EmployeeUpdateUpdate command capability in the workbench.
 * @evidence {@link useEmploymentContractCreateCreate} Renders the EmploymentContractCreateCreate command capability in the workbench.
 * @evidence {@link useEmploymentContractSearchIndex} Renders the EmploymentContractSearchIndex command capability in the workbench.
 * @evidence {@link useEmploymentContractStatusStatus} Renders the EmploymentContractStatusStatus command capability in the workbench.
 * @evidence {@link useEquipmentCreateCreate} Renders the EquipmentCreateCreate command capability in the workbench.
 * @evidence {@link useEquipmentSearchIndex} Renders the EquipmentSearchIndex command capability in the workbench.
 * @evidence {@link useEquipmentStatusStatus} Renders the EquipmentStatusStatus command capability in the workbench.
 * @evidence {@link useExchangeRateRecordRecord} Renders the ExchangeRateRecordRecord command capability in the workbench.
 * @evidence {@link useExchangeRateRefreshRefresh} Renders the ExchangeRateRefreshRefresh command capability in the workbench.
 * @evidence {@link useExchangeRateResolveResolve} Renders the ExchangeRateResolveResolve command capability in the workbench.
 * @evidence {@link useExchangeRateSearchIndex} Renders the ExchangeRateSearchIndex command capability in the workbench.
 * @evidence {@link useFiscalCalendarCreateCreate} Renders the FiscalCalendarCreateCreate command capability in the workbench.
 * @evidence {@link useFiscalCalendarSearchIndex} Renders the FiscalCalendarSearchIndex command capability in the workbench.
 * @evidence {@link useFiscalPeriodReopenRequestApplyApply} Renders the FiscalPeriodReopenRequestApplyApply command capability in the workbench.
 * @evidence {@link useFiscalPeriodReopenRequestCreateCreate} Renders the FiscalPeriodReopenRequestCreateCreate command capability in the workbench.
 * @evidence {@link useFiscalPeriodReopenRequestSearchSearch} Renders the FiscalPeriodReopenRequestSearchSearch command capability in the workbench.
 * @evidence {@link useFiscalPeriodReopenRequestStatusStatus} Renders the FiscalPeriodReopenRequestStatusStatus command capability in the workbench.
 * @evidence {@link useFiscalPeriodStatusStatus} Renders the FiscalPeriodStatusStatus command capability in the workbench.
 * @evidence {@link useFixedAssetCreateCreate} Renders the FixedAssetCreateCreate command capability in the workbench.
 * @evidence {@link useFixedAssetSearchIndex} Renders the FixedAssetSearchIndex command capability in the workbench.
 * @evidence {@link useFixedAssetStatusStatus} Renders the FixedAssetStatusStatus command capability in the workbench.
 * @evidence {@link useHealthGet} Renders the HealthGet command capability in the workbench.
 * @evidence {@link useInspectionOrderCreateCreate} Renders the InspectionOrderCreateCreate command capability in the workbench.
 * @evidence {@link useInspectionOrderSearchIndex} Renders the InspectionOrderSearchIndex command capability in the workbench.
 * @evidence {@link useInspectionOrderStatusStatus} Renders the InspectionOrderStatusStatus command capability in the workbench.
 * @evidence {@link useInspectionPlanCreateCreate} Renders the InspectionPlanCreateCreate command capability in the workbench.
 * @evidence {@link useInspectionPlanSearchIndex} Renders the InspectionPlanSearchIndex command capability in the workbench.
 * @evidence {@link useInspectionPlanStatusStatus} Renders the InspectionPlanStatusStatus command capability in the workbench.
 * @evidence {@link useInventoryAdjustmentCreateCreate} Renders the InventoryAdjustmentCreateCreate command capability in the workbench.
 * @evidence {@link useInventoryAdjustmentSearchIndex} Renders the InventoryAdjustmentSearchIndex command capability in the workbench.
 * @evidence {@link useInventoryAdjustmentStatusStatus} Renders the InventoryAdjustmentStatusStatus command capability in the workbench.
 * @evidence {@link useInventoryLotCreateCreate} Renders the InventoryLotCreateCreate command capability in the workbench.
 * @evidence {@link useInventoryLotSearchIndex} Renders the InventoryLotSearchIndex command capability in the workbench.
 * @evidence {@link useInventoryLotStatusStatus} Renders the InventoryLotStatusStatus command capability in the workbench.
 * @evidence {@link useItemCreateCreate} Renders the ItemCreateCreate command capability in the workbench.
 * @evidence {@link useItemSearchIndex} Renders the ItemSearchIndex command capability in the workbench.
 * @evidence {@link useItemSerialCreateCreate} Renders the ItemSerialCreateCreate command capability in the workbench.
 * @evidence {@link useItemSerialSearchIndex} Renders the ItemSerialSearchIndex command capability in the workbench.
 * @evidence {@link useItemSerialStatusStatus} Renders the ItemSerialStatusStatus command capability in the workbench.
 * @evidence {@link useItemStatusStatus} Renders the ItemStatusStatus command capability in the workbench.
 * @evidence {@link useItemUpdateUpdate} Renders the ItemUpdateUpdate command capability in the workbench.
 * @evidence {@link useJournalCreateCreate} Renders the JournalCreateCreate command capability in the workbench.
 * @evidence {@link useJournalDeleteRemove} Renders the JournalDeleteRemove command capability in the workbench.
 * @evidence {@link useJournalPostPost} Renders the JournalPostPost command capability in the workbench.
 * @evidence {@link useJournalReverseReverse} Renders the JournalReverseReverse command capability in the workbench.
 * @evidence {@link useJournalSearchIndex} Renders the JournalSearchIndex command capability in the workbench.
 * @evidence {@link useJournalUpdateUpdate} Renders the JournalUpdateUpdate command capability in the workbench.
 * @evidence {@link useJournalVoidVoid} Renders the JournalVoidVoid command capability in the workbench.
 * @evidence {@link useMachineCreateCreate} Renders the MachineCreateCreate command capability in the workbench.
 * @evidence {@link useMachineSearchIndex} Renders the MachineSearchIndex command capability in the workbench.
 * @evidence {@link useMachineStatusStatus} Renders the MachineStatusStatus command capability in the workbench.
 * @evidence {@link useMaintenanceOrderCreateCreate} Renders the MaintenanceOrderCreateCreate command capability in the workbench.
 * @evidence {@link useMaintenanceOrderSearchIndex} Renders the MaintenanceOrderSearchIndex command capability in the workbench.
 * @evidence {@link useMaintenanceOrderStatusStatus} Renders the MaintenanceOrderStatusStatus command capability in the workbench.
 * @evidence {@link useMaintenancePlanCreateCreate} Renders the MaintenancePlanCreateCreate command capability in the workbench.
 * @evidence {@link useMaintenancePlanSearchIndex} Renders the MaintenancePlanSearchIndex command capability in the workbench.
 * @evidence {@link useMaintenancePlanStatusStatus} Renders the MaintenancePlanStatusStatus command capability in the workbench.
 * @evidence {@link useMrpRecommendationCreateCreate} Renders the MrpRecommendationCreateCreate command capability in the workbench.
 * @evidence {@link useMrpRecommendationSearchIndex} Renders the MrpRecommendationSearchIndex command capability in the workbench.
 * @evidence {@link useMrpRecommendationStatusStatus} Renders the MrpRecommendationStatusStatus command capability in the workbench.
 * @evidence {@link useMrpRunCreateCreate} Renders the MrpRunCreateCreate command capability in the workbench.
 * @evidence {@link useMrpRunSearchIndex} Renders the MrpRunSearchIndex command capability in the workbench.
 * @evidence {@link useMrpRunStatusStatus} Renders the MrpRunStatusStatus command capability in the workbench.
 * @evidence {@link useNotificationCreateCreate} Renders the NotificationCreateCreate command capability in the workbench.
 * @evidence {@link useNotificationDispatchDispatch} Renders the NotificationDispatchDispatch command capability in the workbench.
 * @evidence {@link useNotificationPreferencePreference} Renders the NotificationPreferencePreference command capability in the workbench.
 * @evidence {@link useNotificationPreferenceUpdateUpdate} Renders the NotificationPreferenceUpdateUpdate command capability in the workbench.
 * @evidence {@link useNotificationRetryRetry} Renders the NotificationRetryRetry command capability in the workbench.
 * @evidence {@link useNotificationSearchIndex} Renders the NotificationSearchIndex command capability in the workbench.
 * @evidence {@link useNotificationStatusStatus} Renders the NotificationStatusStatus command capability in the workbench.
 * @evidence {@link useOrganizationCreate} Renders the OrganizationCreate command capability in the workbench.
 * @evidence {@link useOrganizationDeleteRemove} Renders the OrganizationDeleteRemove command capability in the workbench.
 * @evidence {@link useOrganizationDeleteBlockersCheck} Renders the OrganizationDeleteBlockersCheck command capability in the workbench.
 * @evidence {@link useOrganizationDetailAt} Renders the OrganizationDetailAt command capability in the workbench.
 * @evidence {@link useOrganizationMembershipInviteInvite} Renders the OrganizationMembershipInviteInvite command capability in the workbench.
 * @evidence {@link useOrganizationMembershipListListIndex} Renders the OrganizationMembershipListListIndex command capability in the workbench.
 * @evidence {@link useOrganizationMembershipStatusStatus} Renders the OrganizationMembershipStatusStatus command capability in the workbench.
 * @evidence {@link useOrganizationSearchIndex} Renders the OrganizationSearchIndex command capability in the workbench.
 * @evidence {@link useOrganizationUpdateUpdate} Renders the OrganizationUpdateUpdate command capability in the workbench.
 * @evidence {@link usePartyChangeRequestApplyApply} Renders the PartyChangeRequestApplyApply command capability in the workbench.
 * @evidence {@link usePartyChangeRequestCreateCreate} Renders the PartyChangeRequestCreateCreate command capability in the workbench.
 * @evidence {@link usePartyChangeRequestSearchIndex} Renders the PartyChangeRequestSearchIndex command capability in the workbench.
 * @evidence {@link usePartyChangeRequestStatusStatus} Renders the PartyChangeRequestStatusStatus command capability in the workbench.
 * @evidence {@link usePayScheduleCreateCreate} Renders the PayScheduleCreateCreate command capability in the workbench.
 * @evidence {@link usePayScheduleSearchIndex} Renders the PayScheduleSearchIndex command capability in the workbench.
 * @evidence {@link usePayScheduleStatusStatus} Renders the PayScheduleStatusStatus command capability in the workbench.
 * @evidence {@link usePaymentTermCreateCreate} Renders the PaymentTermCreateCreate command capability in the workbench.
 * @evidence {@link usePaymentTermSearchIndex} Renders the PaymentTermSearchIndex command capability in the workbench.
 * @evidence {@link usePaymentTermStatusStatus} Renders the PaymentTermStatusStatus command capability in the workbench.
 * @evidence {@link usePaymentTermUpdateUpdate} Renders the PaymentTermUpdateUpdate command capability in the workbench.
 * @evidence {@link usePayrollConfigurationCreateCreate} Renders the PayrollConfigurationCreateCreate command capability in the workbench.
 * @evidence {@link usePayrollConfigurationSearchIndex} Renders the PayrollConfigurationSearchIndex command capability in the workbench.
 * @evidence {@link usePayrollConfigurationStatusStatus} Renders the PayrollConfigurationStatusStatus command capability in the workbench.
 * @evidence {@link usePayrollRunCreateCreate} Renders the PayrollRunCreateCreate command capability in the workbench.
 * @evidence {@link usePayrollRunSearchIndex} Renders the PayrollRunSearchIndex command capability in the workbench.
 * @evidence {@link usePayrollRunStatusStatus} Renders the PayrollRunStatusStatus command capability in the workbench.
 * @evidence {@link usePayslipCreateCreate} Renders the PayslipCreateCreate command capability in the workbench.
 * @evidence {@link usePayslipSearchIndex} Renders the PayslipSearchIndex command capability in the workbench.
 * @evidence {@link usePayslipStatusStatus} Renders the PayslipStatusStatus command capability in the workbench.
 * @evidence {@link useProductionOrderCreateCreate} Renders the ProductionOrderCreateCreate command capability in the workbench.
 * @evidence {@link useProductionOrderLineCreateCreate} Renders the ProductionOrderLineCreateCreate command capability in the workbench.
 * @evidence {@link useProductionOrderLineSearchIndex} Renders the ProductionOrderLineSearchIndex command capability in the workbench.
 * @evidence {@link useProductionOrderSearchIndex} Renders the ProductionOrderSearchIndex command capability in the workbench.
 * @evidence {@link useProductionOrderStatusStatus} Renders the ProductionOrderStatusStatus command capability in the workbench.
 * @evidence {@link useProfitCenterCreateCreate} Renders the ProfitCenterCreateCreate command capability in the workbench.
 * @evidence {@link useProfitCenterSearchIndex} Renders the ProfitCenterSearchIndex command capability in the workbench.
 * @evidence {@link useProfitCenterStatusStatus} Renders the ProfitCenterStatusStatus command capability in the workbench.
 * @evidence {@link useProjectCreateCreate} Renders the ProjectCreateCreate command capability in the workbench.
 * @evidence {@link useProjectMemberCreateCreate} Renders the ProjectMemberCreateCreate command capability in the workbench.
 * @evidence {@link useProjectMemberSearchIndex} Renders the ProjectMemberSearchIndex command capability in the workbench.
 * @evidence {@link useProjectMemberStatusStatus} Renders the ProjectMemberStatusStatus command capability in the workbench.
 * @evidence {@link useProjectSearchIndex} Renders the ProjectSearchIndex command capability in the workbench.
 * @evidence {@link useProjectStatusStatus} Renders the ProjectStatusStatus command capability in the workbench.
 * @evidence {@link usePurchaseOrderChangeRequestApplyApply} Renders the PurchaseOrderChangeRequestApplyApply command capability in the workbench.
 * @evidence {@link usePurchaseOrderChangeRequestCreateCreate} Renders the PurchaseOrderChangeRequestCreateCreate command capability in the workbench.
 * @evidence {@link usePurchaseOrderChangeRequestSearchSearch} Renders the PurchaseOrderChangeRequestSearchSearch command capability in the workbench.
 * @evidence {@link usePurchaseOrderChangeRequestStatusStatus} Renders the PurchaseOrderChangeRequestStatusStatus command capability in the workbench.
 * @evidence {@link usePurchaseOrderCreateCreate} Renders the PurchaseOrderCreateCreate command capability in the workbench.
 * @evidence {@link usePurchaseOrderLineCreateCreate} Renders the PurchaseOrderLineCreateCreate command capability in the workbench.
 * @evidence {@link usePurchaseOrderLineSearchIndex} Renders the PurchaseOrderLineSearchIndex command capability in the workbench.
 * @evidence {@link usePurchaseOrderSearchIndex} Renders the PurchaseOrderSearchIndex command capability in the workbench.
 * @evidence {@link usePurchaseOrderStatusStatus} Renders the PurchaseOrderStatusStatus command capability in the workbench.
 * @evidence {@link usePurchaseReceiptCreateCreate} Renders the PurchaseReceiptCreateCreate command capability in the workbench.
 * @evidence {@link usePurchaseReceiptLineCreateCreate} Renders the PurchaseReceiptLineCreateCreate command capability in the workbench.
 * @evidence {@link usePurchaseReceiptLineSearchIndex} Renders the PurchaseReceiptLineSearchIndex command capability in the workbench.
 * @evidence {@link usePurchaseReceiptSearchIndex} Renders the PurchaseReceiptSearchIndex command capability in the workbench.
 * @evidence {@link usePurchaseReceiptStatusStatus} Renders the PurchaseReceiptStatusStatus command capability in the workbench.
 * @evidence {@link usePurchaseRequestCreateCreate} Renders the PurchaseRequestCreateCreate command capability in the workbench.
 * @evidence {@link usePurchaseRequestLineCreate} Renders the PurchaseRequestLineCreate command capability in the workbench.
 * @evidence {@link usePurchaseRequestSearchIndex} Renders the PurchaseRequestSearchIndex command capability in the workbench.
 * @evidence {@link usePurchaseRequestStatusStatus} Renders the PurchaseRequestStatusStatus command capability in the workbench.
 * @evidence {@link usePurchaseReturnCreateCreate} Renders the PurchaseReturnCreateCreate command capability in the workbench.
 * @evidence {@link usePurchaseReturnSearchIndex} Renders the PurchaseReturnSearchIndex command capability in the workbench.
 * @evidence {@link usePurchaseReturnStatusStatus} Renders the PurchaseReturnStatusStatus command capability in the workbench.
 * @evidence {@link useQuarantineCreateCreate} Renders the QuarantineCreateCreate command capability in the workbench.
 * @evidence {@link useQuarantineSearchIndex} Renders the QuarantineSearchIndex command capability in the workbench.
 * @evidence {@link useQuarantineStatusStatus} Renders the QuarantineStatusStatus command capability in the workbench.
 * @evidence {@link useReconciliationCompleteComplete} Renders the ReconciliationCompleteComplete command capability in the workbench.
 * @evidence {@link useReconciliationCreateCreate} Renders the ReconciliationCreateCreate command capability in the workbench.
 * @evidence {@link useReconciliationLineLine} Renders the ReconciliationLineLine command capability in the workbench.
 * @evidence {@link useReconciliationReopenReopen} Renders the ReconciliationReopenReopen command capability in the workbench.
 * @evidence {@link useReconciliationSearchIndex} Renders the ReconciliationSearchIndex command capability in the workbench.
 * @evidence {@link useReportExportExport} Renders the ReportExportExport command capability in the workbench.
 * @evidence {@link useReportGenerateGenerate} Renders the ReportGenerateGenerate command capability in the workbench.
 * @evidence {@link useRoleAssignAssign} Renders the RoleAssignAssign command capability in the workbench.
 * @evidence {@link useRoleCreateCreate} Renders the RoleCreateCreate command capability in the workbench.
 * @evidence {@link useRoleDeleteRemove} Renders the RoleDeleteRemove command capability in the workbench.
 * @evidence {@link useRoleRevokeRevoke} Renders the RoleRevokeRevoke command capability in the workbench.
 * @evidence {@link useRoleSearchIndex} Renders the RoleSearchIndex command capability in the workbench.
 * @evidence {@link useRoleUpdateUpdate} Renders the RoleUpdateUpdate command capability in the workbench.
 * @evidence {@link useRoutingCreateCreate} Renders the RoutingCreateCreate command capability in the workbench.
 * @evidence {@link useRoutingSearchIndex} Renders the RoutingSearchIndex command capability in the workbench.
 * @evidence {@link useRoutingStatusStatus} Renders the RoutingStatusStatus command capability in the workbench.
 * @evidence {@link useRoutingStepCreateCreate} Renders the RoutingStepCreateCreate command capability in the workbench.
 * @evidence {@link useRoutingStepSearchIndex} Renders the RoutingStepSearchIndex command capability in the workbench.
 * @evidence {@link useSalesInvoiceCreateCreate} Renders the SalesInvoiceCreateCreate command capability in the workbench.
 * @evidence {@link useSalesInvoiceLineCreateCreate} Renders the SalesInvoiceLineCreateCreate command capability in the workbench.
 * @evidence {@link useSalesInvoiceLineSearchIndex} Renders the SalesInvoiceLineSearchIndex command capability in the workbench.
 * @evidence {@link useSalesInvoiceSearchIndex} Renders the SalesInvoiceSearchIndex command capability in the workbench.
 * @evidence {@link useSalesInvoiceStatusStatus} Renders the SalesInvoiceStatusStatus command capability in the workbench.
 * @evidence {@link useSalesOrderCreateCreate} Renders the SalesOrderCreateCreate command capability in the workbench.
 * @evidence {@link useSalesOrderLineCreateCreate} Renders the SalesOrderLineCreateCreate command capability in the workbench.
 * @evidence {@link useSalesOrderLineSearchIndex} Renders the SalesOrderLineSearchIndex command capability in the workbench.
 * @evidence {@link useSalesOrderSearchIndex} Renders the SalesOrderSearchIndex command capability in the workbench.
 * @evidence {@link useSalesOrderStatusStatus} Renders the SalesOrderStatusStatus command capability in the workbench.
 * @evidence {@link useSalesPriceCreateCreate} Renders the SalesPriceCreateCreate command capability in the workbench.
 * @evidence {@link useSalesPriceSearchIndex} Renders the SalesPriceSearchIndex command capability in the workbench.
 * @evidence {@link useSalesPriceStatusStatus} Renders the SalesPriceStatusStatus command capability in the workbench.
 * @evidence {@link useSalesQuoteCreateCreate} Renders the SalesQuoteCreateCreate command capability in the workbench.
 * @evidence {@link useSalesQuoteLineCreateCreate} Renders the SalesQuoteLineCreateCreate command capability in the workbench.
 * @evidence {@link useSalesQuoteLineSearchIndex} Renders the SalesQuoteLineSearchIndex command capability in the workbench.
 * @evidence {@link useSalesQuoteSearchIndex} Renders the SalesQuoteSearchIndex command capability in the workbench.
 * @evidence {@link useSalesQuoteStatusStatus} Renders the SalesQuoteStatusStatus command capability in the workbench.
 * @evidence {@link useSalesReturnCreateCreate} Renders the SalesReturnCreateCreate command capability in the workbench.
 * @evidence {@link useSalesReturnLineCreateCreate} Renders the SalesReturnLineCreateCreate command capability in the workbench.
 * @evidence {@link useSalesReturnLineSearchIndex} Renders the SalesReturnLineSearchIndex command capability in the workbench.
 * @evidence {@link useSalesReturnSearchIndex} Renders the SalesReturnSearchIndex command capability in the workbench.
 * @evidence {@link useSalesReturnStatusStatus} Renders the SalesReturnStatusStatus command capability in the workbench.
 * @evidence {@link useServiceCaseCreateCreate} Renders the ServiceCaseCreateCreate command capability in the workbench.
 * @evidence {@link useServiceCaseSearchIndex} Renders the ServiceCaseSearchIndex command capability in the workbench.
 * @evidence {@link useServiceCaseStatusStatus} Renders the ServiceCaseStatusStatus command capability in the workbench.
 * @evidence {@link useServiceOrderCreateCreate} Renders the ServiceOrderCreateCreate command capability in the workbench.
 * @evidence {@link useServiceOrderSearchIndex} Renders the ServiceOrderSearchIndex command capability in the workbench.
 * @evidence {@link useServiceOrderStatusStatus} Renders the ServiceOrderStatusStatus command capability in the workbench.
 * @evidence {@link useShipmentCreateCreate} Renders the ShipmentCreateCreate command capability in the workbench.
 * @evidence {@link useShipmentLineCreateCreate} Renders the ShipmentLineCreateCreate command capability in the workbench.
 * @evidence {@link useShipmentLineSearchIndex} Renders the ShipmentLineSearchIndex command capability in the workbench.
 * @evidence {@link useShipmentSearchIndex} Renders the ShipmentSearchIndex command capability in the workbench.
 * @evidence {@link useShipmentStatusStatus} Renders the ShipmentStatusStatus command capability in the workbench.
 * @evidence {@link useStockAllocationCreateCreate} Renders the StockAllocationCreateCreate command capability in the workbench.
 * @evidence {@link useStockAllocationSearchIndex} Renders the StockAllocationSearchIndex command capability in the workbench.
 * @evidence {@link useStockAllocationStatusStatus} Renders the StockAllocationStatusStatus command capability in the workbench.
 * @evidence {@link useStockMovementCreateCreate} Renders the StockMovementCreateCreate command capability in the workbench.
 * @evidence {@link useStockMovementSearchIndex} Renders the StockMovementSearchIndex command capability in the workbench.
 * @evidence {@link useStockQuantityQuantity} Renders the StockQuantityQuantity command capability in the workbench.
 * @evidence {@link useStorageLocationCreateCreate} Renders the StorageLocationCreateCreate command capability in the workbench.
 * @evidence {@link useStorageLocationSearchIndex} Renders the StorageLocationSearchIndex command capability in the workbench.
 * @evidence {@link useStorageLocationStatusStatus} Renders the StorageLocationStatusStatus command capability in the workbench.
 * @evidence {@link useStorageLocationUpdateUpdate} Renders the StorageLocationUpdateUpdate command capability in the workbench.
 * @evidence {@link useTagAssignmentCreateCreate} Renders the TagAssignmentCreateCreate command capability in the workbench.
 * @evidence {@link useTagAssignmentDeleteRemove} Renders the TagAssignmentDeleteRemove command capability in the workbench.
 * @evidence {@link useTagAssignmentSearchSearch} Renders the TagAssignmentSearchSearch command capability in the workbench.
 * @evidence {@link useTagCreateCreate} Renders the TagCreateCreate command capability in the workbench.
 * @evidence {@link useTagSearchIndex} Renders the TagSearchIndex command capability in the workbench.
 * @evidence {@link useTagStatusStatus} Renders the TagStatusStatus command capability in the workbench.
 * @evidence {@link useTagUpdateUpdate} Renders the TagUpdateUpdate command capability in the workbench.
 * @evidence {@link useTaskCreateCreate} Renders the TaskCreateCreate command capability in the workbench.
 * @evidence {@link useTaskSearchIndex} Renders the TaskSearchIndex command capability in the workbench.
 * @evidence {@link useTaskStatusStatus} Renders the TaskStatusStatus command capability in the workbench.
 * @evidence {@link useTaxCodeCreateCreate} Renders the TaxCodeCreateCreate command capability in the workbench.
 * @evidence {@link useTaxCodeSearchIndex} Renders the TaxCodeSearchIndex command capability in the workbench.
 * @evidence {@link useTaxCodeStatusStatus} Renders the TaxCodeStatusStatus command capability in the workbench.
 * @evidence {@link useTaxCodeUpdateUpdate} Renders the TaxCodeUpdateUpdate command capability in the workbench.
 * @evidence {@link useTaxJurisdictionCreateCreate} Renders the TaxJurisdictionCreateCreate command capability in the workbench.
 * @evidence {@link useTaxJurisdictionSearchIndex} Renders the TaxJurisdictionSearchIndex command capability in the workbench.
 * @evidence {@link useTaxJurisdictionStatusStatus} Renders the TaxJurisdictionStatusStatus command capability in the workbench.
 * @evidence {@link useTaxJurisdictionUpdateUpdate} Renders the TaxJurisdictionUpdateUpdate command capability in the workbench.
 * @evidence {@link useTaxRateCreateCreate} Renders the TaxRateCreateCreate command capability in the workbench.
 * @evidence {@link useTaxRateResolveResolve} Renders the TaxRateResolveResolve command capability in the workbench.
 * @evidence {@link useTaxRateSearchIndex} Renders the TaxRateSearchIndex command capability in the workbench.
 * @evidence {@link useTaxReturnAmendAmend} Renders the TaxReturnAmendAmend command capability in the workbench.
 * @evidence {@link useTaxReturnCreateCreate} Renders the TaxReturnCreateCreate command capability in the workbench.
 * @evidence {@link useTaxReturnSearchIndex} Renders the TaxReturnSearchIndex command capability in the workbench.
 * @evidence {@link useTaxReturnStatusStatus} Renders the TaxReturnStatusStatus command capability in the workbench.
 * @evidence {@link useTimelogCreateCreate} Renders the TimelogCreateCreate command capability in the workbench.
 * @evidence {@link useTimelogSearchIndex} Renders the TimelogSearchIndex command capability in the workbench.
 * @evidence {@link useTimelogStatusStatus} Renders the TimelogStatusStatus command capability in the workbench.
 * @evidence {@link useTimesheetCreateCreate} Renders the TimesheetCreateCreate command capability in the workbench.
 * @evidence {@link useTimesheetLineCreateCreate} Renders the TimesheetLineCreateCreate command capability in the workbench.
 * @evidence {@link useTimesheetLineSearchIndex} Renders the TimesheetLineSearchIndex command capability in the workbench.
 * @evidence {@link useTimesheetSearchIndex} Renders the TimesheetSearchIndex command capability in the workbench.
 * @evidence {@link useTimesheetStatusStatus} Renders the TimesheetStatusStatus command capability in the workbench.
 * @evidence {@link useTransferCreateCreate} Renders the TransferCreateCreate command capability in the workbench.
 * @evidence {@link useTransferSearchIndex} Renders the TransferSearchIndex command capability in the workbench.
 * @evidence {@link useTransferStatusStatus} Renders the TransferStatusStatus command capability in the workbench.
 * @evidence {@link useUomCreateCreate} Renders the UomCreateCreate command capability in the workbench.
 * @evidence {@link useUomSearchIndex} Renders the UomSearchIndex command capability in the workbench.
 * @evidence {@link useUomStatusStatus} Renders the UomStatusStatus command capability in the workbench.
 * @evidence {@link useUomUpdateUpdate} Renders the UomUpdateUpdate command capability in the workbench.
 * @evidence {@link useVendorBillCreateCreate} Renders the VendorBillCreateCreate command capability in the workbench.
 * @evidence {@link useVendorBillLineCreateCreate} Renders the VendorBillLineCreateCreate command capability in the workbench.
 * @evidence {@link useVendorBillLineSearchIndex} Renders the VendorBillLineSearchIndex command capability in the workbench.
 * @evidence {@link useVendorBillSearchIndex} Renders the VendorBillSearchIndex command capability in the workbench.
 * @evidence {@link useVendorBillStatusStatus} Renders the VendorBillStatusStatus command capability in the workbench.
 * @evidence {@link useVendorCreateCreate} Renders the VendorCreateCreate command capability in the workbench.
 * @evidence {@link useVendorCreditAllocationCreateCreate} Renders the VendorCreditAllocationCreateCreate command capability in the workbench.
 * @evidence {@link useVendorCreditAllocationSearchIndex} Renders the VendorCreditAllocationSearchIndex command capability in the workbench.
 * @evidence {@link useVendorCreditCreateCreate} Renders the VendorCreditCreateCreate command capability in the workbench.
 * @evidence {@link useVendorCreditSearchIndex} Renders the VendorCreditSearchIndex command capability in the workbench.
 * @evidence {@link useVendorCreditStatusStatus} Renders the VendorCreditStatusStatus command capability in the workbench.
 * @evidence {@link useVendorDeleteRemove} Renders the VendorDeleteRemove command capability in the workbench.
 * @evidence {@link useVendorPaymentAllocationCreateCreate} Renders the VendorPaymentAllocationCreateCreate command capability in the workbench.
 * @evidence {@link useVendorPaymentAllocationSearchIndex} Renders the VendorPaymentAllocationSearchIndex command capability in the workbench.
 * @evidence {@link useVendorPaymentCreateCreate} Renders the VendorPaymentCreateCreate command capability in the workbench.
 * @evidence {@link useVendorPaymentSearchIndex} Renders the VendorPaymentSearchIndex command capability in the workbench.
 * @evidence {@link useVendorPaymentStatusStatus} Renders the VendorPaymentStatusStatus command capability in the workbench.
 * @evidence {@link useVendorSearchIndex} Renders the VendorSearchIndex command capability in the workbench.
 * @evidence {@link useVendorStatusStatus} Renders the VendorStatusStatus command capability in the workbench.
 * @evidence {@link useVendorUpdateUpdate} Renders the VendorUpdateUpdate command capability in the workbench.
 * @evidence {@link useWarehouseCreateCreate} Renders the WarehouseCreateCreate command capability in the workbench.
 * @evidence {@link useWarehouseSearchIndex} Renders the WarehouseSearchIndex command capability in the workbench.
 * @evidence {@link useWarehouseStatusStatus} Renders the WarehouseStatusStatus command capability in the workbench.
 * @evidence {@link useWarehouseUpdateUpdate} Renders the WarehouseUpdateUpdate command capability in the workbench.
 * @evidence {@link useWorkCenterCreateCreate} Renders the WorkCenterCreateCreate command capability in the workbench.
 * @evidence {@link useWorkCenterSearchIndex} Renders the WorkCenterSearchIndex command capability in the workbench.
 * @evidence {@link useWorkCenterStatusStatus} Renders the WorkCenterStatusStatus command capability in the workbench.
 */
export function OperationsPage() {
  const mutation0 = useAccountCreateCreate();
  const mutation1 = useAccountDeleteRemove();
  const mutation2 = useAccountMergeRequestApplyApply();
  const mutation3 = useAccountMergeRequestCreateCreate();
  const mutation4 = useAccountMergeRequestSearchIndex();
  const mutation5 = useAccountMergeRequestStatusStatus();
  const mutation6 = useAccountSearchIndex();
  const mutation7 = useAccountStatusStatus();
  const mutation8 = useAccountUpdateUpdate();
  const mutation9 = useAddressCreateCreate();
  const mutation10 = useAddressSearchIndex();
  const mutation11 = useAddressStatusStatus();
  const mutation12 = useAddressUpdateUpdate();
  const mutation13 = useAllocationRuleCreateCreate();
  const mutation14 = useAllocationRuleExecuteExecute();
  const mutation15 = useAllocationRulePostPost();
  const mutation16 = useAllocationRuleSearchIndex();
  const mutation17 = useAllocationRuleStatusStatus();
  const mutation18 = useApprovalRequestCreateCreate();
  const mutation19 = useApprovalRequestDelegateDelegate();
  const mutation20 = useApprovalRequestEscalateEscalate();
  const mutation21 = useApprovalRequestSearchIndex();
  const mutation22 = useApprovalRequestStatusStatus();
  const mutation23 = useApprovalWorkflowCreateCreate();
  const mutation24 = useApprovalWorkflowSearchIndex();
  const mutation25 = useApprovalWorkflowStatusStatus();
  const mutation26 = useApprovalWorkflowVersionVersion();
  const mutation27 = useAssetCategoryCreateCreate();
  const mutation28 = useAssetCategorySearchIndex();
  const mutation29 = useAssetCategoryStatusStatus();
  const mutation30 = useAssetDisposalCreateCreate();
  const mutation31 = useAssetDisposalSearchIndex();
  const mutation32 = useAssetDisposalStatusStatus();
  const mutation33 = useAssetImpairmentCreateCreate();
  const mutation34 = useAssetImpairmentSearchIndex();
  const mutation35 = useAssetImpairmentStatusStatus();
  const mutation36 = useAssetTransferCreateCreate();
  const mutation37 = useAssetTransferSearchIndex();
  const mutation38 = useAssetTransferStatusStatus();
  const mutation39 = useAttachmentCreateCreate();
  const mutation40 = useAttachmentDeleteRemove();
  const mutation41 = useAttachmentSearchIndex();
  const mutation42 = useAuditEventDetailAt();
  const mutation43 = useAuditEventSearchIndex();
  const mutation44 = useAuthUserJoinJoin();
  const mutation45 = useAuthUserLoginLogin();
  const mutation46 = useAuthUserRefreshRefresh();
  const mutation47 = useAuthDeactivateDeactivate();
  const mutation48 = useAuthPasswordChange();
  const mutation49 = useAuthProfileProfile();
  const mutation50 = useAuthProfileUpdateUpdate();
  const mutation51 = useAuthRecoveryCompleteComplete();
  const mutation52 = useAuthRecoveryRequestRequest();
  const mutation53 = useAuthSessionAllAllLogoutAll();
  const mutation54 = useAuthSessionCurrentLogout();
  const mutation55 = useAuthSessionOrganizationOrganizationSelect();
  const mutation56 = useBankAccountCreateCreate();
  const mutation57 = useBankAccountSearchIndex();
  const mutation58 = useBankAccountStatusStatus();
  const mutation59 = useBankAccountUpdateUpdate();
  const mutation60 = useBankTransactionCreateCreate();
  const mutation61 = useBankTransactionIgnoreIgnore();
  const mutation62 = useBankTransactionMatchMatch();
  const mutation63 = useBankTransactionSearchIndex();
  const mutation64 = useBomCreateCreate();
  const mutation65 = useBomLineCreateCreate();
  const mutation66 = useBomLineSearchIndex();
  const mutation67 = useBomSearchIndex();
  const mutation68 = useBomStatusStatus();
  const mutation69 = useBudgetCreateCreate();
  const mutation70 = useBudgetLineCreateCreate();
  const mutation71 = useBudgetLineSearchIndex();
  const mutation72 = useBudgetRevisionCreateCreate();
  const mutation73 = useBudgetRevisionStatusStatus();
  const mutation74 = useBudgetSearchIndex();
  const mutation75 = useBudgetStatusStatus();
  const mutation76 = useClosingSnapshotCreateCreate();
  const mutation77 = useClosingSnapshotSearchIndex();
  const mutation78 = useCommentCreateCreate();
  const mutation79 = useCommentDeleteRemove();
  const mutation80 = useCommentSearchIndex();
  const mutation81 = useCommentUpdateUpdate();
  const mutation82 = useContactAssignmentAssign();
  const mutation83 = useContactCreateCreate();
  const mutation84 = useContactSearchIndex();
  const mutation85 = useContactStatusStatus();
  const mutation86 = useContactUpdateUpdate();
  const mutation87 = useCostCenterCreateCreate();
  const mutation88 = useCostCenterSearchIndex();
  const mutation89 = useCostCenterStatusStatus();
  const mutation90 = useCreditMemoCreateCreate();
  const mutation91 = useCreditMemoLineCreateCreate();
  const mutation92 = useCreditMemoLineSearchIndex();
  const mutation93 = useCreditMemoSearchIndex();
  const mutation94 = useCreditMemoStatusStatus();
  const mutation95 = useCurrencyCreateCreate();
  const mutation96 = useCurrencySearchIndex();
  const mutation97 = useCurrencyStatusStatus();
  const mutation98 = useCurrencyUpdateUpdate();
  const mutation99 = useCustomFieldDefinitionCreateCreate();
  const mutation100 = useCustomFieldDefinitionSearchIndex();
  const mutation101 = useCustomFieldDefinitionStatusStatus();
  const mutation102 = useCustomFieldDefinitionUpdateUpdate();
  const mutation103 = useCustomFieldValueSearchIndex();
  const mutation104 = useCustomFieldValueSetSet();
  const mutation105 = useCustomerCreateCreate();
  const mutation106 = useCustomerDeleteRemove();
  const mutation107 = useCustomerPaymentAllocationCreateCreate();
  const mutation108 = useCustomerPaymentAllocationSearchIndex();
  const mutation109 = useCustomerPaymentCreateCreate();
  const mutation110 = useCustomerPaymentSearchIndex();
  const mutation111 = useCustomerPaymentStatusStatus();
  const mutation112 = useCustomerSearchIndex();
  const mutation113 = useCustomerStatusStatus();
  const mutation114 = useCustomerUpdateUpdate();
  const mutation115 = useCycleCountCreateCreate();
  const mutation116 = useCycleCountSearchIndex();
  const mutation117 = useCycleCountStatusStatus();
  const mutation118 = useDepartmentCreateCreate();
  const mutation119 = useDepartmentSearchIndex();
  const mutation120 = useDepartmentStatusStatus();
  const mutation121 = useDepartmentUpdateUpdate();
  const mutation122 = useDepreciationRunCreateCreate();
  const mutation123 = useDepreciationRunSearchIndex();
  const mutation124 = useDepreciationRunStatusStatus();
  const mutation125 = useDepreciationScheduleCreateCreate();
  const mutation126 = useDepreciationScheduleSearchIndex();
  const mutation127 = useDepreciationScheduleStatusStatus();
  const mutation128 = useDispositionCreateCreate();
  const mutation129 = useDispositionSearchIndex();
  const mutation130 = useDispositionStatusStatus();
  const mutation131 = useDocumentNumberCreateCreate();
  const mutation132 = useDocumentNumberIssueIssue();
  const mutation133 = useDocumentNumberSearchIndex();
  const mutation134 = useDocumentNumberUpdateUpdate();
  const mutation135 = useEmployeeCreateCreate();
  const mutation136 = useEmployeeSearchIndex();
  const mutation137 = useEmployeeStatusStatus();
  const mutation138 = useEmployeeUpdateUpdate();
  const mutation139 = useEmploymentContractCreateCreate();
  const mutation140 = useEmploymentContractSearchIndex();
  const mutation141 = useEmploymentContractStatusStatus();
  const mutation142 = useEquipmentCreateCreate();
  const mutation143 = useEquipmentSearchIndex();
  const mutation144 = useEquipmentStatusStatus();
  const mutation145 = useExchangeRateRecordRecord();
  const mutation146 = useExchangeRateRefreshRefresh();
  const mutation147 = useExchangeRateResolveResolve();
  const mutation148 = useExchangeRateSearchIndex();
  const mutation149 = useFiscalCalendarCreateCreate();
  const mutation150 = useFiscalCalendarSearchIndex();
  const mutation151 = useFiscalPeriodReopenRequestApplyApply();
  const mutation152 = useFiscalPeriodReopenRequestCreateCreate();
  const mutation153 = useFiscalPeriodReopenRequestSearchSearch();
  const mutation154 = useFiscalPeriodReopenRequestStatusStatus();
  const mutation155 = useFiscalPeriodStatusStatus();
  const mutation156 = useFixedAssetCreateCreate();
  const mutation157 = useFixedAssetSearchIndex();
  const mutation158 = useFixedAssetStatusStatus();
  const mutation159 = useHealthGet();
  const mutation160 = useInspectionOrderCreateCreate();
  const mutation161 = useInspectionOrderSearchIndex();
  const mutation162 = useInspectionOrderStatusStatus();
  const mutation163 = useInspectionPlanCreateCreate();
  const mutation164 = useInspectionPlanSearchIndex();
  const mutation165 = useInspectionPlanStatusStatus();
  const mutation166 = useInventoryAdjustmentCreateCreate();
  const mutation167 = useInventoryAdjustmentSearchIndex();
  const mutation168 = useInventoryAdjustmentStatusStatus();
  const mutation169 = useInventoryLotCreateCreate();
  const mutation170 = useInventoryLotSearchIndex();
  const mutation171 = useInventoryLotStatusStatus();
  const mutation172 = useItemCreateCreate();
  const mutation173 = useItemSearchIndex();
  const mutation174 = useItemSerialCreateCreate();
  const mutation175 = useItemSerialSearchIndex();
  const mutation176 = useItemSerialStatusStatus();
  const mutation177 = useItemStatusStatus();
  const mutation178 = useItemUpdateUpdate();
  const mutation179 = useJournalCreateCreate();
  const mutation180 = useJournalDeleteRemove();
  const mutation181 = useJournalPostPost();
  const mutation182 = useJournalReverseReverse();
  const mutation183 = useJournalSearchIndex();
  const mutation184 = useJournalUpdateUpdate();
  const mutation185 = useJournalVoidVoid();
  const mutation186 = useMachineCreateCreate();
  const mutation187 = useMachineSearchIndex();
  const mutation188 = useMachineStatusStatus();
  const mutation189 = useMaintenanceOrderCreateCreate();
  const mutation190 = useMaintenanceOrderSearchIndex();
  const mutation191 = useMaintenanceOrderStatusStatus();
  const mutation192 = useMaintenancePlanCreateCreate();
  const mutation193 = useMaintenancePlanSearchIndex();
  const mutation194 = useMaintenancePlanStatusStatus();
  const mutation195 = useMrpRecommendationCreateCreate();
  const mutation196 = useMrpRecommendationSearchIndex();
  const mutation197 = useMrpRecommendationStatusStatus();
  const mutation198 = useMrpRunCreateCreate();
  const mutation199 = useMrpRunSearchIndex();
  const mutation200 = useMrpRunStatusStatus();
  const mutation201 = useNotificationCreateCreate();
  const mutation202 = useNotificationDispatchDispatch();
  const mutation203 = useNotificationPreferencePreference();
  const mutation204 = useNotificationPreferenceUpdateUpdate();
  const mutation205 = useNotificationRetryRetry();
  const mutation206 = useNotificationSearchIndex();
  const mutation207 = useNotificationStatusStatus();
  const mutation208 = useOrganizationCreate();
  const mutation209 = useOrganizationDeleteRemove();
  const mutation210 = useOrganizationDeleteBlockersCheck();
  const mutation211 = useOrganizationDetailAt();
  const mutation212 = useOrganizationMembershipInviteInvite();
  const mutation213 = useOrganizationMembershipListListIndex();
  const mutation214 = useOrganizationMembershipStatusStatus();
  const mutation215 = useOrganizationSearchIndex();
  const mutation216 = useOrganizationUpdateUpdate();
  const mutation217 = usePartyChangeRequestApplyApply();
  const mutation218 = usePartyChangeRequestCreateCreate();
  const mutation219 = usePartyChangeRequestSearchIndex();
  const mutation220 = usePartyChangeRequestStatusStatus();
  const mutation221 = usePayScheduleCreateCreate();
  const mutation222 = usePayScheduleSearchIndex();
  const mutation223 = usePayScheduleStatusStatus();
  const mutation224 = usePaymentTermCreateCreate();
  const mutation225 = usePaymentTermSearchIndex();
  const mutation226 = usePaymentTermStatusStatus();
  const mutation227 = usePaymentTermUpdateUpdate();
  const mutation228 = usePayrollConfigurationCreateCreate();
  const mutation229 = usePayrollConfigurationSearchIndex();
  const mutation230 = usePayrollConfigurationStatusStatus();
  const mutation231 = usePayrollRunCreateCreate();
  const mutation232 = usePayrollRunSearchIndex();
  const mutation233 = usePayrollRunStatusStatus();
  const mutation234 = usePayslipCreateCreate();
  const mutation235 = usePayslipSearchIndex();
  const mutation236 = usePayslipStatusStatus();
  const mutation237 = useProductionOrderCreateCreate();
  const mutation238 = useProductionOrderLineCreateCreate();
  const mutation239 = useProductionOrderLineSearchIndex();
  const mutation240 = useProductionOrderSearchIndex();
  const mutation241 = useProductionOrderStatusStatus();
  const mutation242 = useProfitCenterCreateCreate();
  const mutation243 = useProfitCenterSearchIndex();
  const mutation244 = useProfitCenterStatusStatus();
  const mutation245 = useProjectCreateCreate();
  const mutation246 = useProjectMemberCreateCreate();
  const mutation247 = useProjectMemberSearchIndex();
  const mutation248 = useProjectMemberStatusStatus();
  const mutation249 = useProjectSearchIndex();
  const mutation250 = useProjectStatusStatus();
  const mutation251 = usePurchaseOrderChangeRequestApplyApply();
  const mutation252 = usePurchaseOrderChangeRequestCreateCreate();
  const mutation253 = usePurchaseOrderChangeRequestSearchSearch();
  const mutation254 = usePurchaseOrderChangeRequestStatusStatus();
  const mutation255 = usePurchaseOrderCreateCreate();
  const mutation256 = usePurchaseOrderLineCreateCreate();
  const mutation257 = usePurchaseOrderLineSearchIndex();
  const mutation258 = usePurchaseOrderSearchIndex();
  const mutation259 = usePurchaseOrderStatusStatus();
  const mutation260 = usePurchaseReceiptCreateCreate();
  const mutation261 = usePurchaseReceiptLineCreateCreate();
  const mutation262 = usePurchaseReceiptLineSearchIndex();
  const mutation263 = usePurchaseReceiptSearchIndex();
  const mutation264 = usePurchaseReceiptStatusStatus();
  const mutation265 = usePurchaseRequestCreateCreate();
  const mutation266 = usePurchaseRequestLineCreate();
  const mutation267 = usePurchaseRequestSearchIndex();
  const mutation268 = usePurchaseRequestStatusStatus();
  const mutation269 = usePurchaseReturnCreateCreate();
  const mutation270 = usePurchaseReturnSearchIndex();
  const mutation271 = usePurchaseReturnStatusStatus();
  const mutation272 = useQuarantineCreateCreate();
  const mutation273 = useQuarantineSearchIndex();
  const mutation274 = useQuarantineStatusStatus();
  const mutation275 = useReconciliationCompleteComplete();
  const mutation276 = useReconciliationCreateCreate();
  const mutation277 = useReconciliationLineLine();
  const mutation278 = useReconciliationReopenReopen();
  const mutation279 = useReconciliationSearchIndex();
  const mutation280 = useReportExportExport();
  const mutation281 = useReportGenerateGenerate();
  const mutation282 = useRoleAssignAssign();
  const mutation283 = useRoleCreateCreate();
  const mutation284 = useRoleDeleteRemove();
  const mutation285 = useRoleRevokeRevoke();
  const mutation286 = useRoleSearchIndex();
  const mutation287 = useRoleUpdateUpdate();
  const mutation288 = useRoutingCreateCreate();
  const mutation289 = useRoutingSearchIndex();
  const mutation290 = useRoutingStatusStatus();
  const mutation291 = useRoutingStepCreateCreate();
  const mutation292 = useRoutingStepSearchIndex();
  const mutation293 = useSalesInvoiceCreateCreate();
  const mutation294 = useSalesInvoiceLineCreateCreate();
  const mutation295 = useSalesInvoiceLineSearchIndex();
  const mutation296 = useSalesInvoiceSearchIndex();
  const mutation297 = useSalesInvoiceStatusStatus();
  const mutation298 = useSalesOrderCreateCreate();
  const mutation299 = useSalesOrderLineCreateCreate();
  const mutation300 = useSalesOrderLineSearchIndex();
  const mutation301 = useSalesOrderSearchIndex();
  const mutation302 = useSalesOrderStatusStatus();
  const mutation303 = useSalesPriceCreateCreate();
  const mutation304 = useSalesPriceSearchIndex();
  const mutation305 = useSalesPriceStatusStatus();
  const mutation306 = useSalesQuoteCreateCreate();
  const mutation307 = useSalesQuoteLineCreateCreate();
  const mutation308 = useSalesQuoteLineSearchIndex();
  const mutation309 = useSalesQuoteSearchIndex();
  const mutation310 = useSalesQuoteStatusStatus();
  const mutation311 = useSalesReturnCreateCreate();
  const mutation312 = useSalesReturnLineCreateCreate();
  const mutation313 = useSalesReturnLineSearchIndex();
  const mutation314 = useSalesReturnSearchIndex();
  const mutation315 = useSalesReturnStatusStatus();
  const mutation316 = useServiceCaseCreateCreate();
  const mutation317 = useServiceCaseSearchIndex();
  const mutation318 = useServiceCaseStatusStatus();
  const mutation319 = useServiceOrderCreateCreate();
  const mutation320 = useServiceOrderSearchIndex();
  const mutation321 = useServiceOrderStatusStatus();
  const mutation322 = useShipmentCreateCreate();
  const mutation323 = useShipmentLineCreateCreate();
  const mutation324 = useShipmentLineSearchIndex();
  const mutation325 = useShipmentSearchIndex();
  const mutation326 = useShipmentStatusStatus();
  const mutation327 = useStockAllocationCreateCreate();
  const mutation328 = useStockAllocationSearchIndex();
  const mutation329 = useStockAllocationStatusStatus();
  const mutation330 = useStockMovementCreateCreate();
  const mutation331 = useStockMovementSearchIndex();
  const mutation332 = useStockQuantityQuantity();
  const mutation333 = useStorageLocationCreateCreate();
  const mutation334 = useStorageLocationSearchIndex();
  const mutation335 = useStorageLocationStatusStatus();
  const mutation336 = useStorageLocationUpdateUpdate();
  const mutation337 = useTagAssignmentCreateCreate();
  const mutation338 = useTagAssignmentDeleteRemove();
  const mutation339 = useTagAssignmentSearchSearch();
  const mutation340 = useTagCreateCreate();
  const mutation341 = useTagSearchIndex();
  const mutation342 = useTagStatusStatus();
  const mutation343 = useTagUpdateUpdate();
  const mutation344 = useTaskCreateCreate();
  const mutation345 = useTaskSearchIndex();
  const mutation346 = useTaskStatusStatus();
  const mutation347 = useTaxCodeCreateCreate();
  const mutation348 = useTaxCodeSearchIndex();
  const mutation349 = useTaxCodeStatusStatus();
  const mutation350 = useTaxCodeUpdateUpdate();
  const mutation351 = useTaxJurisdictionCreateCreate();
  const mutation352 = useTaxJurisdictionSearchIndex();
  const mutation353 = useTaxJurisdictionStatusStatus();
  const mutation354 = useTaxJurisdictionUpdateUpdate();
  const mutation355 = useTaxRateCreateCreate();
  const mutation356 = useTaxRateResolveResolve();
  const mutation357 = useTaxRateSearchIndex();
  const mutation358 = useTaxReturnAmendAmend();
  const mutation359 = useTaxReturnCreateCreate();
  const mutation360 = useTaxReturnSearchIndex();
  const mutation361 = useTaxReturnStatusStatus();
  const mutation362 = useTimelogCreateCreate();
  const mutation363 = useTimelogSearchIndex();
  const mutation364 = useTimelogStatusStatus();
  const mutation365 = useTimesheetCreateCreate();
  const mutation366 = useTimesheetLineCreateCreate();
  const mutation367 = useTimesheetLineSearchIndex();
  const mutation368 = useTimesheetSearchIndex();
  const mutation369 = useTimesheetStatusStatus();
  const mutation370 = useTransferCreateCreate();
  const mutation371 = useTransferSearchIndex();
  const mutation372 = useTransferStatusStatus();
  const mutation373 = useUomCreateCreate();
  const mutation374 = useUomSearchIndex();
  const mutation375 = useUomStatusStatus();
  const mutation376 = useUomUpdateUpdate();
  const mutation377 = useVendorBillCreateCreate();
  const mutation378 = useVendorBillLineCreateCreate();
  const mutation379 = useVendorBillLineSearchIndex();
  const mutation380 = useVendorBillSearchIndex();
  const mutation381 = useVendorBillStatusStatus();
  const mutation382 = useVendorCreateCreate();
  const mutation383 = useVendorCreditAllocationCreateCreate();
  const mutation384 = useVendorCreditAllocationSearchIndex();
  const mutation385 = useVendorCreditCreateCreate();
  const mutation386 = useVendorCreditSearchIndex();
  const mutation387 = useVendorCreditStatusStatus();
  const mutation388 = useVendorDeleteRemove();
  const mutation389 = useVendorPaymentAllocationCreateCreate();
  const mutation390 = useVendorPaymentAllocationSearchIndex();
  const mutation391 = useVendorPaymentCreateCreate();
  const mutation392 = useVendorPaymentSearchIndex();
  const mutation393 = useVendorPaymentStatusStatus();
  const mutation394 = useVendorSearchIndex();
  const mutation395 = useVendorStatusStatus();
  const mutation396 = useVendorUpdateUpdate();
  const mutation397 = useWarehouseCreateCreate();
  const mutation398 = useWarehouseSearchIndex();
  const mutation399 = useWarehouseStatusStatus();
  const mutation400 = useWarehouseUpdateUpdate();
  const mutation401 = useWorkCenterCreateCreate();
  const mutation402 = useWorkCenterSearchIndex();
  const mutation403 = useWorkCenterStatusStatus();
  const [selected, setSelected] = useState("");
  const [payload, setPayload] = useState("{}");
  const [notice, setNotice] = useState("");
  const operations = [
    { name: "AccountCreateCreate", mutation: mutation0 },
    { name: "AccountDeleteRemove", mutation: mutation1 },
    { name: "AccountMergeRequestApplyApply", mutation: mutation2 },
    { name: "AccountMergeRequestCreateCreate", mutation: mutation3 },
    { name: "AccountMergeRequestSearchIndex", mutation: mutation4 },
    { name: "AccountMergeRequestStatusStatus", mutation: mutation5 },
    { name: "AccountSearchIndex", mutation: mutation6 },
    { name: "AccountStatusStatus", mutation: mutation7 },
    { name: "AccountUpdateUpdate", mutation: mutation8 },
    { name: "AddressCreateCreate", mutation: mutation9 },
    { name: "AddressSearchIndex", mutation: mutation10 },
    { name: "AddressStatusStatus", mutation: mutation11 },
    { name: "AddressUpdateUpdate", mutation: mutation12 },
    { name: "AllocationRuleCreateCreate", mutation: mutation13 },
    { name: "AllocationRuleExecuteExecute", mutation: mutation14 },
    { name: "AllocationRulePostPost", mutation: mutation15 },
    { name: "AllocationRuleSearchIndex", mutation: mutation16 },
    { name: "AllocationRuleStatusStatus", mutation: mutation17 },
    { name: "ApprovalRequestCreateCreate", mutation: mutation18 },
    { name: "ApprovalRequestDelegateDelegate", mutation: mutation19 },
    { name: "ApprovalRequestEscalateEscalate", mutation: mutation20 },
    { name: "ApprovalRequestSearchIndex", mutation: mutation21 },
    { name: "ApprovalRequestStatusStatus", mutation: mutation22 },
    { name: "ApprovalWorkflowCreateCreate", mutation: mutation23 },
    { name: "ApprovalWorkflowSearchIndex", mutation: mutation24 },
    { name: "ApprovalWorkflowStatusStatus", mutation: mutation25 },
    { name: "ApprovalWorkflowVersionVersion", mutation: mutation26 },
    { name: "AssetCategoryCreateCreate", mutation: mutation27 },
    { name: "AssetCategorySearchIndex", mutation: mutation28 },
    { name: "AssetCategoryStatusStatus", mutation: mutation29 },
    { name: "AssetDisposalCreateCreate", mutation: mutation30 },
    { name: "AssetDisposalSearchIndex", mutation: mutation31 },
    { name: "AssetDisposalStatusStatus", mutation: mutation32 },
    { name: "AssetImpairmentCreateCreate", mutation: mutation33 },
    { name: "AssetImpairmentSearchIndex", mutation: mutation34 },
    { name: "AssetImpairmentStatusStatus", mutation: mutation35 },
    { name: "AssetTransferCreateCreate", mutation: mutation36 },
    { name: "AssetTransferSearchIndex", mutation: mutation37 },
    { name: "AssetTransferStatusStatus", mutation: mutation38 },
    { name: "AttachmentCreateCreate", mutation: mutation39 },
    { name: "AttachmentDeleteRemove", mutation: mutation40 },
    { name: "AttachmentSearchIndex", mutation: mutation41 },
    { name: "AuditEventDetailAt", mutation: mutation42 },
    { name: "AuditEventSearchIndex", mutation: mutation43 },
    { name: "AuthUserJoinJoin", mutation: mutation44 },
    { name: "AuthUserLoginLogin", mutation: mutation45 },
    { name: "AuthUserRefreshRefresh", mutation: mutation46 },
    { name: "AuthDeactivateDeactivate", mutation: mutation47 },
    { name: "AuthPasswordChange", mutation: mutation48 },
    { name: "AuthProfileProfile", mutation: mutation49 },
    { name: "AuthProfileUpdateUpdate", mutation: mutation50 },
    { name: "AuthRecoveryCompleteComplete", mutation: mutation51 },
    { name: "AuthRecoveryRequestRequest", mutation: mutation52 },
    { name: "AuthSessionAllAllLogoutAll", mutation: mutation53 },
    { name: "AuthSessionCurrentLogout", mutation: mutation54 },
    { name: "AuthSessionOrganizationOrganizationSelect", mutation: mutation55 },
    { name: "BankAccountCreateCreate", mutation: mutation56 },
    { name: "BankAccountSearchIndex", mutation: mutation57 },
    { name: "BankAccountStatusStatus", mutation: mutation58 },
    { name: "BankAccountUpdateUpdate", mutation: mutation59 },
    { name: "BankTransactionCreateCreate", mutation: mutation60 },
    { name: "BankTransactionIgnoreIgnore", mutation: mutation61 },
    { name: "BankTransactionMatchMatch", mutation: mutation62 },
    { name: "BankTransactionSearchIndex", mutation: mutation63 },
    { name: "BomCreateCreate", mutation: mutation64 },
    { name: "BomLineCreateCreate", mutation: mutation65 },
    { name: "BomLineSearchIndex", mutation: mutation66 },
    { name: "BomSearchIndex", mutation: mutation67 },
    { name: "BomStatusStatus", mutation: mutation68 },
    { name: "BudgetCreateCreate", mutation: mutation69 },
    { name: "BudgetLineCreateCreate", mutation: mutation70 },
    { name: "BudgetLineSearchIndex", mutation: mutation71 },
    { name: "BudgetRevisionCreateCreate", mutation: mutation72 },
    { name: "BudgetRevisionStatusStatus", mutation: mutation73 },
    { name: "BudgetSearchIndex", mutation: mutation74 },
    { name: "BudgetStatusStatus", mutation: mutation75 },
    { name: "ClosingSnapshotCreateCreate", mutation: mutation76 },
    { name: "ClosingSnapshotSearchIndex", mutation: mutation77 },
    { name: "CommentCreateCreate", mutation: mutation78 },
    { name: "CommentDeleteRemove", mutation: mutation79 },
    { name: "CommentSearchIndex", mutation: mutation80 },
    { name: "CommentUpdateUpdate", mutation: mutation81 },
    { name: "ContactAssignmentAssign", mutation: mutation82 },
    { name: "ContactCreateCreate", mutation: mutation83 },
    { name: "ContactSearchIndex", mutation: mutation84 },
    { name: "ContactStatusStatus", mutation: mutation85 },
    { name: "ContactUpdateUpdate", mutation: mutation86 },
    { name: "CostCenterCreateCreate", mutation: mutation87 },
    { name: "CostCenterSearchIndex", mutation: mutation88 },
    { name: "CostCenterStatusStatus", mutation: mutation89 },
    { name: "CreditMemoCreateCreate", mutation: mutation90 },
    { name: "CreditMemoLineCreateCreate", mutation: mutation91 },
    { name: "CreditMemoLineSearchIndex", mutation: mutation92 },
    { name: "CreditMemoSearchIndex", mutation: mutation93 },
    { name: "CreditMemoStatusStatus", mutation: mutation94 },
    { name: "CurrencyCreateCreate", mutation: mutation95 },
    { name: "CurrencySearchIndex", mutation: mutation96 },
    { name: "CurrencyStatusStatus", mutation: mutation97 },
    { name: "CurrencyUpdateUpdate", mutation: mutation98 },
    { name: "CustomFieldDefinitionCreateCreate", mutation: mutation99 },
    { name: "CustomFieldDefinitionSearchIndex", mutation: mutation100 },
    { name: "CustomFieldDefinitionStatusStatus", mutation: mutation101 },
    { name: "CustomFieldDefinitionUpdateUpdate", mutation: mutation102 },
    { name: "CustomFieldValueSearchIndex", mutation: mutation103 },
    { name: "CustomFieldValueSetSet", mutation: mutation104 },
    { name: "CustomerCreateCreate", mutation: mutation105 },
    { name: "CustomerDeleteRemove", mutation: mutation106 },
    { name: "CustomerPaymentAllocationCreateCreate", mutation: mutation107 },
    { name: "CustomerPaymentAllocationSearchIndex", mutation: mutation108 },
    { name: "CustomerPaymentCreateCreate", mutation: mutation109 },
    { name: "CustomerPaymentSearchIndex", mutation: mutation110 },
    { name: "CustomerPaymentStatusStatus", mutation: mutation111 },
    { name: "CustomerSearchIndex", mutation: mutation112 },
    { name: "CustomerStatusStatus", mutation: mutation113 },
    { name: "CustomerUpdateUpdate", mutation: mutation114 },
    { name: "CycleCountCreateCreate", mutation: mutation115 },
    { name: "CycleCountSearchIndex", mutation: mutation116 },
    { name: "CycleCountStatusStatus", mutation: mutation117 },
    { name: "DepartmentCreateCreate", mutation: mutation118 },
    { name: "DepartmentSearchIndex", mutation: mutation119 },
    { name: "DepartmentStatusStatus", mutation: mutation120 },
    { name: "DepartmentUpdateUpdate", mutation: mutation121 },
    { name: "DepreciationRunCreateCreate", mutation: mutation122 },
    { name: "DepreciationRunSearchIndex", mutation: mutation123 },
    { name: "DepreciationRunStatusStatus", mutation: mutation124 },
    { name: "DepreciationScheduleCreateCreate", mutation: mutation125 },
    { name: "DepreciationScheduleSearchIndex", mutation: mutation126 },
    { name: "DepreciationScheduleStatusStatus", mutation: mutation127 },
    { name: "DispositionCreateCreate", mutation: mutation128 },
    { name: "DispositionSearchIndex", mutation: mutation129 },
    { name: "DispositionStatusStatus", mutation: mutation130 },
    { name: "DocumentNumberCreateCreate", mutation: mutation131 },
    { name: "DocumentNumberIssueIssue", mutation: mutation132 },
    { name: "DocumentNumberSearchIndex", mutation: mutation133 },
    { name: "DocumentNumberUpdateUpdate", mutation: mutation134 },
    { name: "EmployeeCreateCreate", mutation: mutation135 },
    { name: "EmployeeSearchIndex", mutation: mutation136 },
    { name: "EmployeeStatusStatus", mutation: mutation137 },
    { name: "EmployeeUpdateUpdate", mutation: mutation138 },
    { name: "EmploymentContractCreateCreate", mutation: mutation139 },
    { name: "EmploymentContractSearchIndex", mutation: mutation140 },
    { name: "EmploymentContractStatusStatus", mutation: mutation141 },
    { name: "EquipmentCreateCreate", mutation: mutation142 },
    { name: "EquipmentSearchIndex", mutation: mutation143 },
    { name: "EquipmentStatusStatus", mutation: mutation144 },
    { name: "ExchangeRateRecordRecord", mutation: mutation145 },
    { name: "ExchangeRateRefreshRefresh", mutation: mutation146 },
    { name: "ExchangeRateResolveResolve", mutation: mutation147 },
    { name: "ExchangeRateSearchIndex", mutation: mutation148 },
    { name: "FiscalCalendarCreateCreate", mutation: mutation149 },
    { name: "FiscalCalendarSearchIndex", mutation: mutation150 },
    { name: "FiscalPeriodReopenRequestApplyApply", mutation: mutation151 },
    { name: "FiscalPeriodReopenRequestCreateCreate", mutation: mutation152 },
    { name: "FiscalPeriodReopenRequestSearchSearch", mutation: mutation153 },
    { name: "FiscalPeriodReopenRequestStatusStatus", mutation: mutation154 },
    { name: "FiscalPeriodStatusStatus", mutation: mutation155 },
    { name: "FixedAssetCreateCreate", mutation: mutation156 },
    { name: "FixedAssetSearchIndex", mutation: mutation157 },
    { name: "FixedAssetStatusStatus", mutation: mutation158 },
    { name: "HealthGet", mutation: mutation159 },
    { name: "InspectionOrderCreateCreate", mutation: mutation160 },
    { name: "InspectionOrderSearchIndex", mutation: mutation161 },
    { name: "InspectionOrderStatusStatus", mutation: mutation162 },
    { name: "InspectionPlanCreateCreate", mutation: mutation163 },
    { name: "InspectionPlanSearchIndex", mutation: mutation164 },
    { name: "InspectionPlanStatusStatus", mutation: mutation165 },
    { name: "InventoryAdjustmentCreateCreate", mutation: mutation166 },
    { name: "InventoryAdjustmentSearchIndex", mutation: mutation167 },
    { name: "InventoryAdjustmentStatusStatus", mutation: mutation168 },
    { name: "InventoryLotCreateCreate", mutation: mutation169 },
    { name: "InventoryLotSearchIndex", mutation: mutation170 },
    { name: "InventoryLotStatusStatus", mutation: mutation171 },
    { name: "ItemCreateCreate", mutation: mutation172 },
    { name: "ItemSearchIndex", mutation: mutation173 },
    { name: "ItemSerialCreateCreate", mutation: mutation174 },
    { name: "ItemSerialSearchIndex", mutation: mutation175 },
    { name: "ItemSerialStatusStatus", mutation: mutation176 },
    { name: "ItemStatusStatus", mutation: mutation177 },
    { name: "ItemUpdateUpdate", mutation: mutation178 },
    { name: "JournalCreateCreate", mutation: mutation179 },
    { name: "JournalDeleteRemove", mutation: mutation180 },
    { name: "JournalPostPost", mutation: mutation181 },
    { name: "JournalReverseReverse", mutation: mutation182 },
    { name: "JournalSearchIndex", mutation: mutation183 },
    { name: "JournalUpdateUpdate", mutation: mutation184 },
    { name: "JournalVoidVoid", mutation: mutation185 },
    { name: "MachineCreateCreate", mutation: mutation186 },
    { name: "MachineSearchIndex", mutation: mutation187 },
    { name: "MachineStatusStatus", mutation: mutation188 },
    { name: "MaintenanceOrderCreateCreate", mutation: mutation189 },
    { name: "MaintenanceOrderSearchIndex", mutation: mutation190 },
    { name: "MaintenanceOrderStatusStatus", mutation: mutation191 },
    { name: "MaintenancePlanCreateCreate", mutation: mutation192 },
    { name: "MaintenancePlanSearchIndex", mutation: mutation193 },
    { name: "MaintenancePlanStatusStatus", mutation: mutation194 },
    { name: "MrpRecommendationCreateCreate", mutation: mutation195 },
    { name: "MrpRecommendationSearchIndex", mutation: mutation196 },
    { name: "MrpRecommendationStatusStatus", mutation: mutation197 },
    { name: "MrpRunCreateCreate", mutation: mutation198 },
    { name: "MrpRunSearchIndex", mutation: mutation199 },
    { name: "MrpRunStatusStatus", mutation: mutation200 },
    { name: "NotificationCreateCreate", mutation: mutation201 },
    { name: "NotificationDispatchDispatch", mutation: mutation202 },
    { name: "NotificationPreferencePreference", mutation: mutation203 },
    { name: "NotificationPreferenceUpdateUpdate", mutation: mutation204 },
    { name: "NotificationRetryRetry", mutation: mutation205 },
    { name: "NotificationSearchIndex", mutation: mutation206 },
    { name: "NotificationStatusStatus", mutation: mutation207 },
    { name: "OrganizationCreate", mutation: mutation208 },
    { name: "OrganizationDeleteRemove", mutation: mutation209 },
    { name: "OrganizationDeleteBlockersCheck", mutation: mutation210 },
    { name: "OrganizationDetailAt", mutation: mutation211 },
    { name: "OrganizationMembershipInviteInvite", mutation: mutation212 },
    { name: "OrganizationMembershipListListIndex", mutation: mutation213 },
    { name: "OrganizationMembershipStatusStatus", mutation: mutation214 },
    { name: "OrganizationSearchIndex", mutation: mutation215 },
    { name: "OrganizationUpdateUpdate", mutation: mutation216 },
    { name: "PartyChangeRequestApplyApply", mutation: mutation217 },
    { name: "PartyChangeRequestCreateCreate", mutation: mutation218 },
    { name: "PartyChangeRequestSearchIndex", mutation: mutation219 },
    { name: "PartyChangeRequestStatusStatus", mutation: mutation220 },
    { name: "PayScheduleCreateCreate", mutation: mutation221 },
    { name: "PayScheduleSearchIndex", mutation: mutation222 },
    { name: "PayScheduleStatusStatus", mutation: mutation223 },
    { name: "PaymentTermCreateCreate", mutation: mutation224 },
    { name: "PaymentTermSearchIndex", mutation: mutation225 },
    { name: "PaymentTermStatusStatus", mutation: mutation226 },
    { name: "PaymentTermUpdateUpdate", mutation: mutation227 },
    { name: "PayrollConfigurationCreateCreate", mutation: mutation228 },
    { name: "PayrollConfigurationSearchIndex", mutation: mutation229 },
    { name: "PayrollConfigurationStatusStatus", mutation: mutation230 },
    { name: "PayrollRunCreateCreate", mutation: mutation231 },
    { name: "PayrollRunSearchIndex", mutation: mutation232 },
    { name: "PayrollRunStatusStatus", mutation: mutation233 },
    { name: "PayslipCreateCreate", mutation: mutation234 },
    { name: "PayslipSearchIndex", mutation: mutation235 },
    { name: "PayslipStatusStatus", mutation: mutation236 },
    { name: "ProductionOrderCreateCreate", mutation: mutation237 },
    { name: "ProductionOrderLineCreateCreate", mutation: mutation238 },
    { name: "ProductionOrderLineSearchIndex", mutation: mutation239 },
    { name: "ProductionOrderSearchIndex", mutation: mutation240 },
    { name: "ProductionOrderStatusStatus", mutation: mutation241 },
    { name: "ProfitCenterCreateCreate", mutation: mutation242 },
    { name: "ProfitCenterSearchIndex", mutation: mutation243 },
    { name: "ProfitCenterStatusStatus", mutation: mutation244 },
    { name: "ProjectCreateCreate", mutation: mutation245 },
    { name: "ProjectMemberCreateCreate", mutation: mutation246 },
    { name: "ProjectMemberSearchIndex", mutation: mutation247 },
    { name: "ProjectMemberStatusStatus", mutation: mutation248 },
    { name: "ProjectSearchIndex", mutation: mutation249 },
    { name: "ProjectStatusStatus", mutation: mutation250 },
    { name: "PurchaseOrderChangeRequestApplyApply", mutation: mutation251 },
    { name: "PurchaseOrderChangeRequestCreateCreate", mutation: mutation252 },
    { name: "PurchaseOrderChangeRequestSearchSearch", mutation: mutation253 },
    { name: "PurchaseOrderChangeRequestStatusStatus", mutation: mutation254 },
    { name: "PurchaseOrderCreateCreate", mutation: mutation255 },
    { name: "PurchaseOrderLineCreateCreate", mutation: mutation256 },
    { name: "PurchaseOrderLineSearchIndex", mutation: mutation257 },
    { name: "PurchaseOrderSearchIndex", mutation: mutation258 },
    { name: "PurchaseOrderStatusStatus", mutation: mutation259 },
    { name: "PurchaseReceiptCreateCreate", mutation: mutation260 },
    { name: "PurchaseReceiptLineCreateCreate", mutation: mutation261 },
    { name: "PurchaseReceiptLineSearchIndex", mutation: mutation262 },
    { name: "PurchaseReceiptSearchIndex", mutation: mutation263 },
    { name: "PurchaseReceiptStatusStatus", mutation: mutation264 },
    { name: "PurchaseRequestCreateCreate", mutation: mutation265 },
    { name: "PurchaseRequestLineCreate", mutation: mutation266 },
    { name: "PurchaseRequestSearchIndex", mutation: mutation267 },
    { name: "PurchaseRequestStatusStatus", mutation: mutation268 },
    { name: "PurchaseReturnCreateCreate", mutation: mutation269 },
    { name: "PurchaseReturnSearchIndex", mutation: mutation270 },
    { name: "PurchaseReturnStatusStatus", mutation: mutation271 },
    { name: "QuarantineCreateCreate", mutation: mutation272 },
    { name: "QuarantineSearchIndex", mutation: mutation273 },
    { name: "QuarantineStatusStatus", mutation: mutation274 },
    { name: "ReconciliationCompleteComplete", mutation: mutation275 },
    { name: "ReconciliationCreateCreate", mutation: mutation276 },
    { name: "ReconciliationLineLine", mutation: mutation277 },
    { name: "ReconciliationReopenReopen", mutation: mutation278 },
    { name: "ReconciliationSearchIndex", mutation: mutation279 },
    { name: "ReportExportExport", mutation: mutation280 },
    { name: "ReportGenerateGenerate", mutation: mutation281 },
    { name: "RoleAssignAssign", mutation: mutation282 },
    { name: "RoleCreateCreate", mutation: mutation283 },
    { name: "RoleDeleteRemove", mutation: mutation284 },
    { name: "RoleRevokeRevoke", mutation: mutation285 },
    { name: "RoleSearchIndex", mutation: mutation286 },
    { name: "RoleUpdateUpdate", mutation: mutation287 },
    { name: "RoutingCreateCreate", mutation: mutation288 },
    { name: "RoutingSearchIndex", mutation: mutation289 },
    { name: "RoutingStatusStatus", mutation: mutation290 },
    { name: "RoutingStepCreateCreate", mutation: mutation291 },
    { name: "RoutingStepSearchIndex", mutation: mutation292 },
    { name: "SalesInvoiceCreateCreate", mutation: mutation293 },
    { name: "SalesInvoiceLineCreateCreate", mutation: mutation294 },
    { name: "SalesInvoiceLineSearchIndex", mutation: mutation295 },
    { name: "SalesInvoiceSearchIndex", mutation: mutation296 },
    { name: "SalesInvoiceStatusStatus", mutation: mutation297 },
    { name: "SalesOrderCreateCreate", mutation: mutation298 },
    { name: "SalesOrderLineCreateCreate", mutation: mutation299 },
    { name: "SalesOrderLineSearchIndex", mutation: mutation300 },
    { name: "SalesOrderSearchIndex", mutation: mutation301 },
    { name: "SalesOrderStatusStatus", mutation: mutation302 },
    { name: "SalesPriceCreateCreate", mutation: mutation303 },
    { name: "SalesPriceSearchIndex", mutation: mutation304 },
    { name: "SalesPriceStatusStatus", mutation: mutation305 },
    { name: "SalesQuoteCreateCreate", mutation: mutation306 },
    { name: "SalesQuoteLineCreateCreate", mutation: mutation307 },
    { name: "SalesQuoteLineSearchIndex", mutation: mutation308 },
    { name: "SalesQuoteSearchIndex", mutation: mutation309 },
    { name: "SalesQuoteStatusStatus", mutation: mutation310 },
    { name: "SalesReturnCreateCreate", mutation: mutation311 },
    { name: "SalesReturnLineCreateCreate", mutation: mutation312 },
    { name: "SalesReturnLineSearchIndex", mutation: mutation313 },
    { name: "SalesReturnSearchIndex", mutation: mutation314 },
    { name: "SalesReturnStatusStatus", mutation: mutation315 },
    { name: "ServiceCaseCreateCreate", mutation: mutation316 },
    { name: "ServiceCaseSearchIndex", mutation: mutation317 },
    { name: "ServiceCaseStatusStatus", mutation: mutation318 },
    { name: "ServiceOrderCreateCreate", mutation: mutation319 },
    { name: "ServiceOrderSearchIndex", mutation: mutation320 },
    { name: "ServiceOrderStatusStatus", mutation: mutation321 },
    { name: "ShipmentCreateCreate", mutation: mutation322 },
    { name: "ShipmentLineCreateCreate", mutation: mutation323 },
    { name: "ShipmentLineSearchIndex", mutation: mutation324 },
    { name: "ShipmentSearchIndex", mutation: mutation325 },
    { name: "ShipmentStatusStatus", mutation: mutation326 },
    { name: "StockAllocationCreateCreate", mutation: mutation327 },
    { name: "StockAllocationSearchIndex", mutation: mutation328 },
    { name: "StockAllocationStatusStatus", mutation: mutation329 },
    { name: "StockMovementCreateCreate", mutation: mutation330 },
    { name: "StockMovementSearchIndex", mutation: mutation331 },
    { name: "StockQuantityQuantity", mutation: mutation332 },
    { name: "StorageLocationCreateCreate", mutation: mutation333 },
    { name: "StorageLocationSearchIndex", mutation: mutation334 },
    { name: "StorageLocationStatusStatus", mutation: mutation335 },
    { name: "StorageLocationUpdateUpdate", mutation: mutation336 },
    { name: "TagAssignmentCreateCreate", mutation: mutation337 },
    { name: "TagAssignmentDeleteRemove", mutation: mutation338 },
    { name: "TagAssignmentSearchSearch", mutation: mutation339 },
    { name: "TagCreateCreate", mutation: mutation340 },
    { name: "TagSearchIndex", mutation: mutation341 },
    { name: "TagStatusStatus", mutation: mutation342 },
    { name: "TagUpdateUpdate", mutation: mutation343 },
    { name: "TaskCreateCreate", mutation: mutation344 },
    { name: "TaskSearchIndex", mutation: mutation345 },
    { name: "TaskStatusStatus", mutation: mutation346 },
    { name: "TaxCodeCreateCreate", mutation: mutation347 },
    { name: "TaxCodeSearchIndex", mutation: mutation348 },
    { name: "TaxCodeStatusStatus", mutation: mutation349 },
    { name: "TaxCodeUpdateUpdate", mutation: mutation350 },
    { name: "TaxJurisdictionCreateCreate", mutation: mutation351 },
    { name: "TaxJurisdictionSearchIndex", mutation: mutation352 },
    { name: "TaxJurisdictionStatusStatus", mutation: mutation353 },
    { name: "TaxJurisdictionUpdateUpdate", mutation: mutation354 },
    { name: "TaxRateCreateCreate", mutation: mutation355 },
    { name: "TaxRateResolveResolve", mutation: mutation356 },
    { name: "TaxRateSearchIndex", mutation: mutation357 },
    { name: "TaxReturnAmendAmend", mutation: mutation358 },
    { name: "TaxReturnCreateCreate", mutation: mutation359 },
    { name: "TaxReturnSearchIndex", mutation: mutation360 },
    { name: "TaxReturnStatusStatus", mutation: mutation361 },
    { name: "TimelogCreateCreate", mutation: mutation362 },
    { name: "TimelogSearchIndex", mutation: mutation363 },
    { name: "TimelogStatusStatus", mutation: mutation364 },
    { name: "TimesheetCreateCreate", mutation: mutation365 },
    { name: "TimesheetLineCreateCreate", mutation: mutation366 },
    { name: "TimesheetLineSearchIndex", mutation: mutation367 },
    { name: "TimesheetSearchIndex", mutation: mutation368 },
    { name: "TimesheetStatusStatus", mutation: mutation369 },
    { name: "TransferCreateCreate", mutation: mutation370 },
    { name: "TransferSearchIndex", mutation: mutation371 },
    { name: "TransferStatusStatus", mutation: mutation372 },
    { name: "UomCreateCreate", mutation: mutation373 },
    { name: "UomSearchIndex", mutation: mutation374 },
    { name: "UomStatusStatus", mutation: mutation375 },
    { name: "UomUpdateUpdate", mutation: mutation376 },
    { name: "VendorBillCreateCreate", mutation: mutation377 },
    { name: "VendorBillLineCreateCreate", mutation: mutation378 },
    { name: "VendorBillLineSearchIndex", mutation: mutation379 },
    { name: "VendorBillSearchIndex", mutation: mutation380 },
    { name: "VendorBillStatusStatus", mutation: mutation381 },
    { name: "VendorCreateCreate", mutation: mutation382 },
    { name: "VendorCreditAllocationCreateCreate", mutation: mutation383 },
    { name: "VendorCreditAllocationSearchIndex", mutation: mutation384 },
    { name: "VendorCreditCreateCreate", mutation: mutation385 },
    { name: "VendorCreditSearchIndex", mutation: mutation386 },
    { name: "VendorCreditStatusStatus", mutation: mutation387 },
    { name: "VendorDeleteRemove", mutation: mutation388 },
    { name: "VendorPaymentAllocationCreateCreate", mutation: mutation389 },
    { name: "VendorPaymentAllocationSearchIndex", mutation: mutation390 },
    { name: "VendorPaymentCreateCreate", mutation: mutation391 },
    { name: "VendorPaymentSearchIndex", mutation: mutation392 },
    { name: "VendorPaymentStatusStatus", mutation: mutation393 },
    { name: "VendorSearchIndex", mutation: mutation394 },
    { name: "VendorStatusStatus", mutation: mutation395 },
    { name: "VendorUpdateUpdate", mutation: mutation396 },
    { name: "WarehouseCreateCreate", mutation: mutation397 },
    { name: "WarehouseSearchIndex", mutation: mutation398 },
    { name: "WarehouseStatusStatus", mutation: mutation399 },
    { name: "WarehouseUpdateUpdate", mutation: mutation400 },
    { name: "WorkCenterCreateCreate", mutation: mutation401 },
    { name: "WorkCenterSearchIndex", mutation: mutation402 },
    { name: "WorkCenterStatusStatus", mutation: mutation403 },
  ] as const;
  const current = operations.find((operation) => operation.name === selected);
  const visible = operations.filter((operation) =>
    operation.name.toLowerCase().includes(selected.toLowerCase()),
  );
  const run = async () => {
    if (current === undefined) return;
    try {
      const parsed: unknown = JSON.parse(payload);
      const args = Array.isArray(parsed) ? parsed : [parsed];
      await (current.mutation as UseMutationResult<unknown, unknown, unknown>).mutateAsync(args);
      setNotice(`Executed ${current.name} successfully.`);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "The command was refused.";
      setNotice(`${current.name} refused the request: ${detail}`);
    }
  };
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Operations workspace</p>
          <h1>benchmark-erp command center</h1>
          <p className="lede">Explore the generated command surface with one shared session and explicit request payloads.</p>
        </div>
        <div className="mode-badge" aria-label="SDK mode">{import.meta.env.VITE_API_SIMULATE === "false" ? "Live backend" : "Simulation"}</div>
      </header>
      <section className="workspace-grid">
        <aside className="operation-list" aria-label="Published operations">
          <label htmlFor="operation-search">Find an operation</label>
          <input aria-label="Find an operation" id="operation-search" value={selected} onChange={(event) => setSelected(event.target.value)} placeholder="Search operations" />
          <div className="operation-scroll">
            {visible.map((operation) => (
              <button key={operation.name} type="button" className={operation.name === current?.name ? "operation active" : "operation"} onClick={() => setSelected(operation.name)}>
                <span>{operation.name.replaceAll(/([a-z])([A-Z])/g, "$1 $2")}</span>
              </button>
            ))}
          </div>
        </aside>
        <section className="command panel" aria-labelledby="command-title">
          <p className="eyebrow">Command payload</p>
          <h2 id="command-title">{current?.name ?? "Select an operation"}</h2>
          <p className="muted">Arguments are passed to the generated SDK in order. Use an array for path and body arguments.</p>
          <label htmlFor="payload">JSON arguments</label>
          <textarea aria-label="JSON arguments" id="payload" value={payload} onChange={(event) => setPayload(event.target.value)} rows={12} spellCheck={false} />
          <button type="button" className="primary" disabled={current === undefined || current.mutation.isPending} onClick={() => void run()}>
            {current?.mutation.isPending ? "Running..." : "Run command"}
          </button>
          <p role="status" aria-live="polite">{notice}</p>
          <p className="muted">The selected command uses the shared authenticated connection; server refusals remain visible here.</p>
        </section>
      </section>
    </main>
  );
}
