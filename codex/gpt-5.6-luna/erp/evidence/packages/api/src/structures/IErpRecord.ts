import { tags } from "typia";

/**
 * Shared wire shape for organization-scoped ERP records.
 */
export interface IErpRecord {
  /** Aggregate-specific fields retained by the domain record. */
  attributes: null | Record<string, unknown>;
  /** id.
 * @evidence prisma:addresses.id Carries the persisted id column.
 * @evidenceReview prisma:addresses.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:contacts.id Carries the persisted id column.
 * @evidenceReview prisma:contacts.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:attachments.id Carries the persisted id column.
 * @evidenceReview prisma:attachments.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:comments.id Carries the persisted id column.
 * @evidenceReview prisma:comments.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tags.id Carries the persisted id column.
 * @evidenceReview prisma:tags.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_fields.id Carries the persisted id column.
 * @evidenceReview prisma:custom_fields.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_field_values.id Carries the persisted id column.
 * @evidenceReview prisma:custom_field_values.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:currencies.id Carries the persisted id column.
 * @evidenceReview prisma:currencies.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:exchange_rates.id Carries the persisted id column.
 * @evidenceReview prisma:exchange_rates.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payment_terms.id Carries the persisted id column.
 * @evidenceReview prisma:payment_terms.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_jurisdictions.id Carries the persisted id column.
 * @evidenceReview prisma:tax_jurisdictions.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_codes.id Carries the persisted id column.
 * @evidenceReview prisma:tax_codes.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_rates.id Carries the persisted id column.
 * @evidenceReview prisma:tax_rates.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:units_of_measure.id Carries the persisted id column.
 * @evidenceReview prisma:units_of_measure.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:document_number_sequences.id Carries the persisted id column.
 * @evidenceReview prisma:document_number_sequences.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_calendars.id Carries the persisted id column.
 * @evidenceReview prisma:fiscal_calendars.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notification_preferences.id Carries the persisted id column.
 * @evidenceReview prisma:notification_preferences.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:ledger_accounts.id Carries the persisted id column.
 * @evidenceReview prisma:ledger_accounts.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_entries.id Carries the persisted id column.
 * @evidenceReview prisma:journal_entries.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_lines.id Carries the persisted id column.
 * @evidenceReview prisma:journal_lines.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_periods.id Carries the persisted id column.
 * @evidenceReview prisma:fiscal_periods.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:closing_snapshots.id Carries the persisted id column.
 * @evidenceReview prisma:closing_snapshots.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_accounts.id Carries the persisted id column.
 * @evidenceReview prisma:bank_accounts.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_transactions.id Carries the persisted id column.
 * @evidenceReview prisma:bank_transactions.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_reconciliations.id Carries the persisted id column.
 * @evidenceReview prisma:bank_reconciliations.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_returns.id Carries the persisted id column.
 * @evidenceReview prisma:tax_returns.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendors.id Carries the persisted id column.
 * @evidenceReview prisma:vendors.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_requests.id Carries the persisted id column.
 * @evidenceReview prisma:purchase_requests.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_request_lines.id Carries the persisted id column.
 * @evidenceReview prisma:purchase_request_lines.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_orders.id Carries the persisted id column.
 * @evidenceReview prisma:purchase_orders.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_order_lines.id Carries the persisted id column.
 * @evidenceReview prisma:purchase_order_lines.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipts.id Carries the persisted id column.
 * @evidenceReview prisma:purchase_receipts.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipt_lines.id Carries the persisted id column.
 * @evidenceReview prisma:purchase_receipt_lines.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_returns.id Carries the persisted id column.
 * @evidenceReview prisma:purchase_returns.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_return_lines.id Carries the persisted id column.
 * @evidenceReview prisma:purchase_return_lines.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bills.id Carries the persisted id column.
 * @evidenceReview prisma:vendor_bills.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bill_lines.id Carries the persisted id column.
 * @evidenceReview prisma:vendor_bill_lines.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payments.id Carries the persisted id column.
 * @evidenceReview prisma:vendor_payments.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payment_allocations.id Carries the persisted id column.
 * @evidenceReview prisma:vendor_payment_allocations.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_credits.id Carries the persisted id column.
 * @evidenceReview prisma:vendor_credits.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:items.id Carries the persisted id column.
 * @evidenceReview prisma:items.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouses.id Carries the persisted id column.
 * @evidenceReview prisma:warehouses.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:storage_locations.id Carries the persisted id column.
 * @evidenceReview prisma:storage_locations.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_movements.id Carries the persisted id column.
 * @evidenceReview prisma:stock_movements.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_lots.id Carries the persisted id column.
 * @evidenceReview prisma:inventory_lots.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:item_serials.id Carries the persisted id column.
 * @evidenceReview prisma:item_serials.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouse_transfers.id Carries the persisted id column.
 * @evidenceReview prisma:warehouse_transfers.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cycle_counts.id Carries the persisted id column.
 * @evidenceReview prisma:cycle_counts.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_adjustments.id Carries the persisted id column.
 * @evidenceReview prisma:inventory_adjustments.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customers.id Carries the persisted id column.
 * @evidenceReview prisma:customers.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_prices.id Carries the persisted id column.
 * @evidenceReview prisma:sales_prices.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quotes.id Carries the persisted id column.
 * @evidenceReview prisma:sales_quotes.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quote_lines.id Carries the persisted id column.
 * @evidenceReview prisma:sales_quote_lines.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_orders.id Carries the persisted id column.
 * @evidenceReview prisma:sales_orders.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_order_lines.id Carries the persisted id column.
 * @evidenceReview prisma:sales_order_lines.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_allocations.id Carries the persisted id column.
 * @evidenceReview prisma:stock_allocations.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipments.id Carries the persisted id column.
 * @evidenceReview prisma:shipments.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipment_lines.id Carries the persisted id column.
 * @evidenceReview prisma:shipment_lines.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoices.id Carries the persisted id column.
 * @evidenceReview prisma:sales_invoices.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoice_lines.id Carries the persisted id column.
 * @evidenceReview prisma:sales_invoice_lines.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customer_payments.id Carries the persisted id column.
 * @evidenceReview prisma:customer_payments.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_returns.id Carries the persisted id column.
 * @evidenceReview prisma:sales_returns.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_return_lines.id Carries the persisted id column.
 * @evidenceReview prisma:sales_return_lines.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:credit_memos.id Carries the persisted id column.
 * @evidenceReview prisma:credit_memos.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employees.id Carries the persisted id column.
 * @evidenceReview prisma:employees.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:departments.id Carries the persisted id column.
 * @evidenceReview prisma:departments.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employment_contracts.id Carries the persisted id column.
 * @evidenceReview prisma:employment_contracts.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:projects.id Carries the persisted id column.
 * @evidenceReview prisma:projects.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:project_members.id Carries the persisted id column.
 * @evidenceReview prisma:project_members.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tasks.id Carries the persisted id column.
 * @evidenceReview prisma:tasks.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timelogs.id Carries the persisted id column.
 * @evidenceReview prisma:timelogs.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timesheets.id Carries the persisted id column.
 * @evidenceReview prisma:timesheets.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_configurations.id Carries the persisted id column.
 * @evidenceReview prisma:payroll_configurations.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:pay_schedules.id Carries the persisted id column.
 * @evidenceReview prisma:pay_schedules.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_runs.id Carries the persisted id column.
 * @evidenceReview prisma:payroll_runs.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payslips.id Carries the persisted id column.
 * @evidenceReview prisma:payslips.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:budgets.id Carries the persisted id column.
 * @evidenceReview prisma:budgets.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cost_centers.id Carries the persisted id column.
 * @evidenceReview prisma:cost_centers.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:profit_centers.id Carries the persisted id column.
 * @evidenceReview prisma:profit_centers.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:allocation_rules.id Carries the persisted id column.
 * @evidenceReview prisma:allocation_rules.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_categories.id Carries the persisted id column.
 * @evidenceReview prisma:asset_categories.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fixed_assets.id Carries the persisted id column.
 * @evidenceReview prisma:fixed_assets.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_schedules.id Carries the persisted id column.
 * @evidenceReview prisma:depreciation_schedules.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_runs.id Carries the persisted id column.
 * @evidenceReview prisma:depreciation_runs.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_transfers.id Carries the persisted id column.
 * @evidenceReview prisma:asset_transfers.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_impairments.id Carries the persisted id column.
 * @evidenceReview prisma:asset_impairments.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_disposals.id Carries the persisted id column.
 * @evidenceReview prisma:asset_disposals.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bill_of_materials.id Carries the persisted id column.
 * @evidenceReview prisma:bill_of_materials.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bom_versions.id Carries the persisted id column.
 * @evidenceReview prisma:bom_versions.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_versions.id Carries the persisted id column.
 * @evidenceReview prisma:routing_versions.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_operations.id Carries the persisted id column.
 * @evidenceReview prisma:routing_operations.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:work_centers.id Carries the persisted id column.
 * @evidenceReview prisma:work_centers.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:machines.id Carries the persisted id column.
 * @evidenceReview prisma:machines.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_runs.id Carries the persisted id column.
 * @evidenceReview prisma:mrp_runs.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_recommendations.id Carries the persisted id column.
 * @evidenceReview prisma:mrp_recommendations.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_orders.id Carries the persisted id column.
 * @evidenceReview prisma:production_orders.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_order_operations.id Carries the persisted id column.
 * @evidenceReview prisma:production_order_operations.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_plans.id Carries the persisted id column.
 * @evidenceReview prisma:inspection_plans.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_orders.id Carries the persisted id column.
 * @evidenceReview prisma:inspection_orders.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_quarantines.id Carries the persisted id column.
 * @evidenceReview prisma:stock_quarantines.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:quality_dispositions.id Carries the persisted id column.
 * @evidenceReview prisma:quality_dispositions.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:equipment.id Carries the persisted id column.
 * @evidenceReview prisma:equipment.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_plans.id Carries the persisted id column.
 * @evidenceReview prisma:maintenance_plans.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_orders.id Carries the persisted id column.
 * @evidenceReview prisma:maintenance_orders.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_cases.id Carries the persisted id column.
 * @evidenceReview prisma:service_cases.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_orders.id Carries the persisted id column.
 * @evidenceReview prisma:service_orders.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_workflows.id Carries the persisted id column.
 * @evidenceReview prisma:approval_workflows.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_requests.id Carries the persisted id column.
 * @evidenceReview prisma:approval_requests.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:audit_events.id Carries the persisted id column.
 * @evidenceReview prisma:audit_events.id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notifications.id Carries the persisted id column.
 * @evidenceReview prisma:notifications.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** organizationId.
 * @evidence prisma:addresses.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:addresses.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:contacts.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:contacts.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:attachments.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:attachments.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:comments.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:comments.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tags.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:tags.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_fields.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:custom_fields.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_field_values.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:custom_field_values.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:currencies.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:currencies.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:exchange_rates.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:exchange_rates.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payment_terms.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:payment_terms.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_jurisdictions.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:tax_jurisdictions.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_codes.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:tax_codes.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_rates.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:tax_rates.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:units_of_measure.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:units_of_measure.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:document_number_sequences.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:document_number_sequences.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_calendars.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:fiscal_calendars.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notification_preferences.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:notification_preferences.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:ledger_accounts.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:ledger_accounts.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_entries.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:journal_entries.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_lines.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:journal_lines.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_periods.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:fiscal_periods.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:closing_snapshots.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:closing_snapshots.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_accounts.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:bank_accounts.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_transactions.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:bank_transactions.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_reconciliations.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:bank_reconciliations.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_returns.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:tax_returns.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendors.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:vendors.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_requests.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:purchase_requests.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_request_lines.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:purchase_request_lines.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_orders.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:purchase_orders.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_order_lines.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:purchase_order_lines.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipts.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:purchase_receipts.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipt_lines.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:purchase_receipt_lines.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_returns.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:purchase_returns.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_return_lines.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:purchase_return_lines.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bills.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:vendor_bills.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bill_lines.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:vendor_bill_lines.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payments.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:vendor_payments.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payment_allocations.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:vendor_payment_allocations.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_credits.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:vendor_credits.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:items.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:items.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouses.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:warehouses.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:storage_locations.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:storage_locations.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_movements.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:stock_movements.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_lots.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:inventory_lots.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:item_serials.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:item_serials.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouse_transfers.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:warehouse_transfers.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cycle_counts.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:cycle_counts.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_adjustments.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:inventory_adjustments.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customers.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:customers.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_prices.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:sales_prices.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quotes.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:sales_quotes.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quote_lines.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:sales_quote_lines.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_orders.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:sales_orders.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_order_lines.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:sales_order_lines.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_allocations.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:stock_allocations.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipments.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:shipments.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipment_lines.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:shipment_lines.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoices.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:sales_invoices.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoice_lines.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:sales_invoice_lines.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customer_payments.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:customer_payments.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_returns.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:sales_returns.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_return_lines.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:sales_return_lines.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:credit_memos.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:credit_memos.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employees.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:employees.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:departments.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:departments.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employment_contracts.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:employment_contracts.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:projects.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:projects.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:project_members.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:project_members.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tasks.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:tasks.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timelogs.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:timelogs.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timesheets.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:timesheets.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_configurations.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:payroll_configurations.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:pay_schedules.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:pay_schedules.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_runs.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:payroll_runs.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payslips.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:payslips.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:budgets.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:budgets.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cost_centers.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:cost_centers.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:profit_centers.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:profit_centers.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:allocation_rules.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:allocation_rules.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_categories.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:asset_categories.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fixed_assets.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:fixed_assets.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_schedules.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:depreciation_schedules.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_runs.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:depreciation_runs.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_transfers.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:asset_transfers.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_impairments.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:asset_impairments.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_disposals.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:asset_disposals.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bill_of_materials.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:bill_of_materials.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bom_versions.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:bom_versions.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_versions.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:routing_versions.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_operations.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:routing_operations.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:work_centers.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:work_centers.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:machines.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:machines.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_runs.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:mrp_runs.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_recommendations.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:mrp_recommendations.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_orders.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:production_orders.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_order_operations.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:production_order_operations.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_plans.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:inspection_plans.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_orders.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:inspection_orders.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_quarantines.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:stock_quarantines.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:quality_dispositions.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:quality_dispositions.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:equipment.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:equipment.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_plans.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:maintenance_plans.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_orders.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:maintenance_orders.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_cases.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:service_cases.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_orders.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:service_orders.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_workflows.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:approval_workflows.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_requests.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:approval_requests.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:audit_events.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:audit_events.organization_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notifications.organization_id Carries the persisted organization_id column.
 * @evidenceReview prisma:notifications.organization_id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId: string & tags.Format<"uuid">;
  /** name.
 * @evidence prisma:addresses.name Carries the persisted name column.
 * @evidenceReview prisma:addresses.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:contacts.name Carries the persisted name column.
 * @evidenceReview prisma:contacts.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:attachments.name Carries the persisted name column.
 * @evidenceReview prisma:attachments.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:comments.name Carries the persisted name column.
 * @evidenceReview prisma:comments.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tags.name Carries the persisted name column.
 * @evidenceReview prisma:tags.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_fields.name Carries the persisted name column.
 * @evidenceReview prisma:custom_fields.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_field_values.name Carries the persisted name column.
 * @evidenceReview prisma:custom_field_values.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:currencies.name Carries the persisted name column.
 * @evidenceReview prisma:currencies.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:exchange_rates.name Carries the persisted name column.
 * @evidenceReview prisma:exchange_rates.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payment_terms.name Carries the persisted name column.
 * @evidenceReview prisma:payment_terms.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_jurisdictions.name Carries the persisted name column.
 * @evidenceReview prisma:tax_jurisdictions.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_codes.name Carries the persisted name column.
 * @evidenceReview prisma:tax_codes.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_rates.name Carries the persisted name column.
 * @evidenceReview prisma:tax_rates.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:units_of_measure.name Carries the persisted name column.
 * @evidenceReview prisma:units_of_measure.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:document_number_sequences.name Carries the persisted name column.
 * @evidenceReview prisma:document_number_sequences.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_calendars.name Carries the persisted name column.
 * @evidenceReview prisma:fiscal_calendars.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notification_preferences.name Carries the persisted name column.
 * @evidenceReview prisma:notification_preferences.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:ledger_accounts.name Carries the persisted name column.
 * @evidenceReview prisma:ledger_accounts.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_entries.name Carries the persisted name column.
 * @evidenceReview prisma:journal_entries.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_lines.name Carries the persisted name column.
 * @evidenceReview prisma:journal_lines.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_periods.name Carries the persisted name column.
 * @evidenceReview prisma:fiscal_periods.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:closing_snapshots.name Carries the persisted name column.
 * @evidenceReview prisma:closing_snapshots.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_accounts.name Carries the persisted name column.
 * @evidenceReview prisma:bank_accounts.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_transactions.name Carries the persisted name column.
 * @evidenceReview prisma:bank_transactions.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_reconciliations.name Carries the persisted name column.
 * @evidenceReview prisma:bank_reconciliations.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_returns.name Carries the persisted name column.
 * @evidenceReview prisma:tax_returns.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendors.name Carries the persisted name column.
 * @evidenceReview prisma:vendors.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_requests.name Carries the persisted name column.
 * @evidenceReview prisma:purchase_requests.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_request_lines.name Carries the persisted name column.
 * @evidenceReview prisma:purchase_request_lines.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_orders.name Carries the persisted name column.
 * @evidenceReview prisma:purchase_orders.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_order_lines.name Carries the persisted name column.
 * @evidenceReview prisma:purchase_order_lines.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipts.name Carries the persisted name column.
 * @evidenceReview prisma:purchase_receipts.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipt_lines.name Carries the persisted name column.
 * @evidenceReview prisma:purchase_receipt_lines.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_returns.name Carries the persisted name column.
 * @evidenceReview prisma:purchase_returns.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_return_lines.name Carries the persisted name column.
 * @evidenceReview prisma:purchase_return_lines.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bills.name Carries the persisted name column.
 * @evidenceReview prisma:vendor_bills.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bill_lines.name Carries the persisted name column.
 * @evidenceReview prisma:vendor_bill_lines.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payments.name Carries the persisted name column.
 * @evidenceReview prisma:vendor_payments.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payment_allocations.name Carries the persisted name column.
 * @evidenceReview prisma:vendor_payment_allocations.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_credits.name Carries the persisted name column.
 * @evidenceReview prisma:vendor_credits.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:items.name Carries the persisted name column.
 * @evidenceReview prisma:items.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouses.name Carries the persisted name column.
 * @evidenceReview prisma:warehouses.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:storage_locations.name Carries the persisted name column.
 * @evidenceReview prisma:storage_locations.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_movements.name Carries the persisted name column.
 * @evidenceReview prisma:stock_movements.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_lots.name Carries the persisted name column.
 * @evidenceReview prisma:inventory_lots.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:item_serials.name Carries the persisted name column.
 * @evidenceReview prisma:item_serials.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouse_transfers.name Carries the persisted name column.
 * @evidenceReview prisma:warehouse_transfers.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cycle_counts.name Carries the persisted name column.
 * @evidenceReview prisma:cycle_counts.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_adjustments.name Carries the persisted name column.
 * @evidenceReview prisma:inventory_adjustments.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customers.name Carries the persisted name column.
 * @evidenceReview prisma:customers.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_prices.name Carries the persisted name column.
 * @evidenceReview prisma:sales_prices.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quotes.name Carries the persisted name column.
 * @evidenceReview prisma:sales_quotes.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quote_lines.name Carries the persisted name column.
 * @evidenceReview prisma:sales_quote_lines.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_orders.name Carries the persisted name column.
 * @evidenceReview prisma:sales_orders.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_order_lines.name Carries the persisted name column.
 * @evidenceReview prisma:sales_order_lines.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_allocations.name Carries the persisted name column.
 * @evidenceReview prisma:stock_allocations.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipments.name Carries the persisted name column.
 * @evidenceReview prisma:shipments.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipment_lines.name Carries the persisted name column.
 * @evidenceReview prisma:shipment_lines.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoices.name Carries the persisted name column.
 * @evidenceReview prisma:sales_invoices.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoice_lines.name Carries the persisted name column.
 * @evidenceReview prisma:sales_invoice_lines.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customer_payments.name Carries the persisted name column.
 * @evidenceReview prisma:customer_payments.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_returns.name Carries the persisted name column.
 * @evidenceReview prisma:sales_returns.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_return_lines.name Carries the persisted name column.
 * @evidenceReview prisma:sales_return_lines.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:credit_memos.name Carries the persisted name column.
 * @evidenceReview prisma:credit_memos.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employees.name Carries the persisted name column.
 * @evidenceReview prisma:employees.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:departments.name Carries the persisted name column.
 * @evidenceReview prisma:departments.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employment_contracts.name Carries the persisted name column.
 * @evidenceReview prisma:employment_contracts.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:projects.name Carries the persisted name column.
 * @evidenceReview prisma:projects.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:project_members.name Carries the persisted name column.
 * @evidenceReview prisma:project_members.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tasks.name Carries the persisted name column.
 * @evidenceReview prisma:tasks.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timelogs.name Carries the persisted name column.
 * @evidenceReview prisma:timelogs.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timesheets.name Carries the persisted name column.
 * @evidenceReview prisma:timesheets.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_configurations.name Carries the persisted name column.
 * @evidenceReview prisma:payroll_configurations.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:pay_schedules.name Carries the persisted name column.
 * @evidenceReview prisma:pay_schedules.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_runs.name Carries the persisted name column.
 * @evidenceReview prisma:payroll_runs.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payslips.name Carries the persisted name column.
 * @evidenceReview prisma:payslips.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:budgets.name Carries the persisted name column.
 * @evidenceReview prisma:budgets.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cost_centers.name Carries the persisted name column.
 * @evidenceReview prisma:cost_centers.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:profit_centers.name Carries the persisted name column.
 * @evidenceReview prisma:profit_centers.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:allocation_rules.name Carries the persisted name column.
 * @evidenceReview prisma:allocation_rules.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_categories.name Carries the persisted name column.
 * @evidenceReview prisma:asset_categories.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fixed_assets.name Carries the persisted name column.
 * @evidenceReview prisma:fixed_assets.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_schedules.name Carries the persisted name column.
 * @evidenceReview prisma:depreciation_schedules.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_runs.name Carries the persisted name column.
 * @evidenceReview prisma:depreciation_runs.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_transfers.name Carries the persisted name column.
 * @evidenceReview prisma:asset_transfers.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_impairments.name Carries the persisted name column.
 * @evidenceReview prisma:asset_impairments.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_disposals.name Carries the persisted name column.
 * @evidenceReview prisma:asset_disposals.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bill_of_materials.name Carries the persisted name column.
 * @evidenceReview prisma:bill_of_materials.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bom_versions.name Carries the persisted name column.
 * @evidenceReview prisma:bom_versions.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_versions.name Carries the persisted name column.
 * @evidenceReview prisma:routing_versions.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_operations.name Carries the persisted name column.
 * @evidenceReview prisma:routing_operations.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:work_centers.name Carries the persisted name column.
 * @evidenceReview prisma:work_centers.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:machines.name Carries the persisted name column.
 * @evidenceReview prisma:machines.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_runs.name Carries the persisted name column.
 * @evidenceReview prisma:mrp_runs.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_recommendations.name Carries the persisted name column.
 * @evidenceReview prisma:mrp_recommendations.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_orders.name Carries the persisted name column.
 * @evidenceReview prisma:production_orders.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_order_operations.name Carries the persisted name column.
 * @evidenceReview prisma:production_order_operations.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_plans.name Carries the persisted name column.
 * @evidenceReview prisma:inspection_plans.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_orders.name Carries the persisted name column.
 * @evidenceReview prisma:inspection_orders.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_quarantines.name Carries the persisted name column.
 * @evidenceReview prisma:stock_quarantines.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:quality_dispositions.name Carries the persisted name column.
 * @evidenceReview prisma:quality_dispositions.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:equipment.name Carries the persisted name column.
 * @evidenceReview prisma:equipment.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_plans.name Carries the persisted name column.
 * @evidenceReview prisma:maintenance_plans.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_orders.name Carries the persisted name column.
 * @evidenceReview prisma:maintenance_orders.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_cases.name Carries the persisted name column.
 * @evidenceReview prisma:service_cases.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_orders.name Carries the persisted name column.
 * @evidenceReview prisma:service_orders.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_workflows.name Carries the persisted name column.
 * @evidenceReview prisma:approval_workflows.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_requests.name Carries the persisted name column.
 * @evidenceReview prisma:approval_requests.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:audit_events.name Carries the persisted name column.
 * @evidenceReview prisma:audit_events.name Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notifications.name Carries the persisted name column.
 * @evidenceReview prisma:notifications.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: null | string;
  /** status.
 * @evidence prisma:addresses.status Carries the persisted status column.
 * @evidenceReview prisma:addresses.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:contacts.status Carries the persisted status column.
 * @evidenceReview prisma:contacts.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:attachments.status Carries the persisted status column.
 * @evidenceReview prisma:attachments.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:comments.status Carries the persisted status column.
 * @evidenceReview prisma:comments.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tags.status Carries the persisted status column.
 * @evidenceReview prisma:tags.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_fields.status Carries the persisted status column.
 * @evidenceReview prisma:custom_fields.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_field_values.status Carries the persisted status column.
 * @evidenceReview prisma:custom_field_values.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:currencies.status Carries the persisted status column.
 * @evidenceReview prisma:currencies.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:exchange_rates.status Carries the persisted status column.
 * @evidenceReview prisma:exchange_rates.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payment_terms.status Carries the persisted status column.
 * @evidenceReview prisma:payment_terms.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_jurisdictions.status Carries the persisted status column.
 * @evidenceReview prisma:tax_jurisdictions.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_codes.status Carries the persisted status column.
 * @evidenceReview prisma:tax_codes.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_rates.status Carries the persisted status column.
 * @evidenceReview prisma:tax_rates.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:units_of_measure.status Carries the persisted status column.
 * @evidenceReview prisma:units_of_measure.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:document_number_sequences.status Carries the persisted status column.
 * @evidenceReview prisma:document_number_sequences.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_calendars.status Carries the persisted status column.
 * @evidenceReview prisma:fiscal_calendars.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notification_preferences.status Carries the persisted status column.
 * @evidenceReview prisma:notification_preferences.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:ledger_accounts.status Carries the persisted status column.
 * @evidenceReview prisma:ledger_accounts.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_entries.status Carries the persisted status column.
 * @evidenceReview prisma:journal_entries.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_lines.status Carries the persisted status column.
 * @evidenceReview prisma:journal_lines.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_periods.status Carries the persisted status column.
 * @evidenceReview prisma:fiscal_periods.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:closing_snapshots.status Carries the persisted status column.
 * @evidenceReview prisma:closing_snapshots.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_accounts.status Carries the persisted status column.
 * @evidenceReview prisma:bank_accounts.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_transactions.status Carries the persisted status column.
 * @evidenceReview prisma:bank_transactions.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_reconciliations.status Carries the persisted status column.
 * @evidenceReview prisma:bank_reconciliations.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_returns.status Carries the persisted status column.
 * @evidenceReview prisma:tax_returns.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendors.status Carries the persisted status column.
 * @evidenceReview prisma:vendors.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_requests.status Carries the persisted status column.
 * @evidenceReview prisma:purchase_requests.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_request_lines.status Carries the persisted status column.
 * @evidenceReview prisma:purchase_request_lines.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_orders.status Carries the persisted status column.
 * @evidenceReview prisma:purchase_orders.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_order_lines.status Carries the persisted status column.
 * @evidenceReview prisma:purchase_order_lines.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipts.status Carries the persisted status column.
 * @evidenceReview prisma:purchase_receipts.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipt_lines.status Carries the persisted status column.
 * @evidenceReview prisma:purchase_receipt_lines.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_returns.status Carries the persisted status column.
 * @evidenceReview prisma:purchase_returns.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_return_lines.status Carries the persisted status column.
 * @evidenceReview prisma:purchase_return_lines.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bills.status Carries the persisted status column.
 * @evidenceReview prisma:vendor_bills.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bill_lines.status Carries the persisted status column.
 * @evidenceReview prisma:vendor_bill_lines.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payments.status Carries the persisted status column.
 * @evidenceReview prisma:vendor_payments.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payment_allocations.status Carries the persisted status column.
 * @evidenceReview prisma:vendor_payment_allocations.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_credits.status Carries the persisted status column.
 * @evidenceReview prisma:vendor_credits.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:items.status Carries the persisted status column.
 * @evidenceReview prisma:items.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouses.status Carries the persisted status column.
 * @evidenceReview prisma:warehouses.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:storage_locations.status Carries the persisted status column.
 * @evidenceReview prisma:storage_locations.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_movements.status Carries the persisted status column.
 * @evidenceReview prisma:stock_movements.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_lots.status Carries the persisted status column.
 * @evidenceReview prisma:inventory_lots.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:item_serials.status Carries the persisted status column.
 * @evidenceReview prisma:item_serials.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouse_transfers.status Carries the persisted status column.
 * @evidenceReview prisma:warehouse_transfers.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cycle_counts.status Carries the persisted status column.
 * @evidenceReview prisma:cycle_counts.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_adjustments.status Carries the persisted status column.
 * @evidenceReview prisma:inventory_adjustments.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customers.status Carries the persisted status column.
 * @evidenceReview prisma:customers.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_prices.status Carries the persisted status column.
 * @evidenceReview prisma:sales_prices.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quotes.status Carries the persisted status column.
 * @evidenceReview prisma:sales_quotes.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quote_lines.status Carries the persisted status column.
 * @evidenceReview prisma:sales_quote_lines.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_orders.status Carries the persisted status column.
 * @evidenceReview prisma:sales_orders.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_order_lines.status Carries the persisted status column.
 * @evidenceReview prisma:sales_order_lines.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_allocations.status Carries the persisted status column.
 * @evidenceReview prisma:stock_allocations.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipments.status Carries the persisted status column.
 * @evidenceReview prisma:shipments.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipment_lines.status Carries the persisted status column.
 * @evidenceReview prisma:shipment_lines.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoices.status Carries the persisted status column.
 * @evidenceReview prisma:sales_invoices.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoice_lines.status Carries the persisted status column.
 * @evidenceReview prisma:sales_invoice_lines.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customer_payments.status Carries the persisted status column.
 * @evidenceReview prisma:customer_payments.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_returns.status Carries the persisted status column.
 * @evidenceReview prisma:sales_returns.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_return_lines.status Carries the persisted status column.
 * @evidenceReview prisma:sales_return_lines.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:credit_memos.status Carries the persisted status column.
 * @evidenceReview prisma:credit_memos.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employees.status Carries the persisted status column.
 * @evidenceReview prisma:employees.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:departments.status Carries the persisted status column.
 * @evidenceReview prisma:departments.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employment_contracts.status Carries the persisted status column.
 * @evidenceReview prisma:employment_contracts.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:projects.status Carries the persisted status column.
 * @evidenceReview prisma:projects.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:project_members.status Carries the persisted status column.
 * @evidenceReview prisma:project_members.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tasks.status Carries the persisted status column.
 * @evidenceReview prisma:tasks.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timelogs.status Carries the persisted status column.
 * @evidenceReview prisma:timelogs.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timesheets.status Carries the persisted status column.
 * @evidenceReview prisma:timesheets.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_configurations.status Carries the persisted status column.
 * @evidenceReview prisma:payroll_configurations.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:pay_schedules.status Carries the persisted status column.
 * @evidenceReview prisma:pay_schedules.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_runs.status Carries the persisted status column.
 * @evidenceReview prisma:payroll_runs.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payslips.status Carries the persisted status column.
 * @evidenceReview prisma:payslips.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:budgets.status Carries the persisted status column.
 * @evidenceReview prisma:budgets.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cost_centers.status Carries the persisted status column.
 * @evidenceReview prisma:cost_centers.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:profit_centers.status Carries the persisted status column.
 * @evidenceReview prisma:profit_centers.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:allocation_rules.status Carries the persisted status column.
 * @evidenceReview prisma:allocation_rules.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_categories.status Carries the persisted status column.
 * @evidenceReview prisma:asset_categories.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fixed_assets.status Carries the persisted status column.
 * @evidenceReview prisma:fixed_assets.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_schedules.status Carries the persisted status column.
 * @evidenceReview prisma:depreciation_schedules.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_runs.status Carries the persisted status column.
 * @evidenceReview prisma:depreciation_runs.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_transfers.status Carries the persisted status column.
 * @evidenceReview prisma:asset_transfers.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_impairments.status Carries the persisted status column.
 * @evidenceReview prisma:asset_impairments.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_disposals.status Carries the persisted status column.
 * @evidenceReview prisma:asset_disposals.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bill_of_materials.status Carries the persisted status column.
 * @evidenceReview prisma:bill_of_materials.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bom_versions.status Carries the persisted status column.
 * @evidenceReview prisma:bom_versions.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_versions.status Carries the persisted status column.
 * @evidenceReview prisma:routing_versions.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_operations.status Carries the persisted status column.
 * @evidenceReview prisma:routing_operations.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:work_centers.status Carries the persisted status column.
 * @evidenceReview prisma:work_centers.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:machines.status Carries the persisted status column.
 * @evidenceReview prisma:machines.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_runs.status Carries the persisted status column.
 * @evidenceReview prisma:mrp_runs.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_recommendations.status Carries the persisted status column.
 * @evidenceReview prisma:mrp_recommendations.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_orders.status Carries the persisted status column.
 * @evidenceReview prisma:production_orders.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_order_operations.status Carries the persisted status column.
 * @evidenceReview prisma:production_order_operations.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_plans.status Carries the persisted status column.
 * @evidenceReview prisma:inspection_plans.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_orders.status Carries the persisted status column.
 * @evidenceReview prisma:inspection_orders.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_quarantines.status Carries the persisted status column.
 * @evidenceReview prisma:stock_quarantines.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:quality_dispositions.status Carries the persisted status column.
 * @evidenceReview prisma:quality_dispositions.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:equipment.status Carries the persisted status column.
 * @evidenceReview prisma:equipment.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_plans.status Carries the persisted status column.
 * @evidenceReview prisma:maintenance_plans.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_orders.status Carries the persisted status column.
 * @evidenceReview prisma:maintenance_orders.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_cases.status Carries the persisted status column.
 * @evidenceReview prisma:service_cases.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_orders.status Carries the persisted status column.
 * @evidenceReview prisma:service_orders.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_workflows.status Carries the persisted status column.
 * @evidenceReview prisma:approval_workflows.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_requests.status Carries the persisted status column.
 * @evidenceReview prisma:approval_requests.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:audit_events.status Carries the persisted status column.
 * @evidenceReview prisma:audit_events.status Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notifications.status Carries the persisted status column.
 * @evidenceReview prisma:notifications.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status: null | string;
  /** description.
 * @evidence prisma:addresses.description Carries the persisted description column.
 * @evidenceReview prisma:addresses.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:contacts.description Carries the persisted description column.
 * @evidenceReview prisma:contacts.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:attachments.description Carries the persisted description column.
 * @evidenceReview prisma:attachments.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:comments.description Carries the persisted description column.
 * @evidenceReview prisma:comments.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tags.description Carries the persisted description column.
 * @evidenceReview prisma:tags.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_fields.description Carries the persisted description column.
 * @evidenceReview prisma:custom_fields.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_field_values.description Carries the persisted description column.
 * @evidenceReview prisma:custom_field_values.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:currencies.description Carries the persisted description column.
 * @evidenceReview prisma:currencies.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:exchange_rates.description Carries the persisted description column.
 * @evidenceReview prisma:exchange_rates.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payment_terms.description Carries the persisted description column.
 * @evidenceReview prisma:payment_terms.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_jurisdictions.description Carries the persisted description column.
 * @evidenceReview prisma:tax_jurisdictions.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_codes.description Carries the persisted description column.
 * @evidenceReview prisma:tax_codes.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_rates.description Carries the persisted description column.
 * @evidenceReview prisma:tax_rates.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:units_of_measure.description Carries the persisted description column.
 * @evidenceReview prisma:units_of_measure.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:document_number_sequences.description Carries the persisted description column.
 * @evidenceReview prisma:document_number_sequences.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_calendars.description Carries the persisted description column.
 * @evidenceReview prisma:fiscal_calendars.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notification_preferences.description Carries the persisted description column.
 * @evidenceReview prisma:notification_preferences.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:ledger_accounts.description Carries the persisted description column.
 * @evidenceReview prisma:ledger_accounts.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_entries.description Carries the persisted description column.
 * @evidenceReview prisma:journal_entries.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_lines.description Carries the persisted description column.
 * @evidenceReview prisma:journal_lines.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_periods.description Carries the persisted description column.
 * @evidenceReview prisma:fiscal_periods.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:closing_snapshots.description Carries the persisted description column.
 * @evidenceReview prisma:closing_snapshots.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_accounts.description Carries the persisted description column.
 * @evidenceReview prisma:bank_accounts.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_transactions.description Carries the persisted description column.
 * @evidenceReview prisma:bank_transactions.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_reconciliations.description Carries the persisted description column.
 * @evidenceReview prisma:bank_reconciliations.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_returns.description Carries the persisted description column.
 * @evidenceReview prisma:tax_returns.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendors.description Carries the persisted description column.
 * @evidenceReview prisma:vendors.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_requests.description Carries the persisted description column.
 * @evidenceReview prisma:purchase_requests.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_request_lines.description Carries the persisted description column.
 * @evidenceReview prisma:purchase_request_lines.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_orders.description Carries the persisted description column.
 * @evidenceReview prisma:purchase_orders.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_order_lines.description Carries the persisted description column.
 * @evidenceReview prisma:purchase_order_lines.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipts.description Carries the persisted description column.
 * @evidenceReview prisma:purchase_receipts.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipt_lines.description Carries the persisted description column.
 * @evidenceReview prisma:purchase_receipt_lines.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_returns.description Carries the persisted description column.
 * @evidenceReview prisma:purchase_returns.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_return_lines.description Carries the persisted description column.
 * @evidenceReview prisma:purchase_return_lines.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bills.description Carries the persisted description column.
 * @evidenceReview prisma:vendor_bills.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bill_lines.description Carries the persisted description column.
 * @evidenceReview prisma:vendor_bill_lines.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payments.description Carries the persisted description column.
 * @evidenceReview prisma:vendor_payments.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payment_allocations.description Carries the persisted description column.
 * @evidenceReview prisma:vendor_payment_allocations.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_credits.description Carries the persisted description column.
 * @evidenceReview prisma:vendor_credits.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:items.description Carries the persisted description column.
 * @evidenceReview prisma:items.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouses.description Carries the persisted description column.
 * @evidenceReview prisma:warehouses.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:storage_locations.description Carries the persisted description column.
 * @evidenceReview prisma:storage_locations.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_movements.description Carries the persisted description column.
 * @evidenceReview prisma:stock_movements.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_lots.description Carries the persisted description column.
 * @evidenceReview prisma:inventory_lots.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:item_serials.description Carries the persisted description column.
 * @evidenceReview prisma:item_serials.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouse_transfers.description Carries the persisted description column.
 * @evidenceReview prisma:warehouse_transfers.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cycle_counts.description Carries the persisted description column.
 * @evidenceReview prisma:cycle_counts.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_adjustments.description Carries the persisted description column.
 * @evidenceReview prisma:inventory_adjustments.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customers.description Carries the persisted description column.
 * @evidenceReview prisma:customers.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_prices.description Carries the persisted description column.
 * @evidenceReview prisma:sales_prices.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quotes.description Carries the persisted description column.
 * @evidenceReview prisma:sales_quotes.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quote_lines.description Carries the persisted description column.
 * @evidenceReview prisma:sales_quote_lines.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_orders.description Carries the persisted description column.
 * @evidenceReview prisma:sales_orders.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_order_lines.description Carries the persisted description column.
 * @evidenceReview prisma:sales_order_lines.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_allocations.description Carries the persisted description column.
 * @evidenceReview prisma:stock_allocations.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipments.description Carries the persisted description column.
 * @evidenceReview prisma:shipments.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipment_lines.description Carries the persisted description column.
 * @evidenceReview prisma:shipment_lines.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoices.description Carries the persisted description column.
 * @evidenceReview prisma:sales_invoices.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoice_lines.description Carries the persisted description column.
 * @evidenceReview prisma:sales_invoice_lines.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customer_payments.description Carries the persisted description column.
 * @evidenceReview prisma:customer_payments.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_returns.description Carries the persisted description column.
 * @evidenceReview prisma:sales_returns.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_return_lines.description Carries the persisted description column.
 * @evidenceReview prisma:sales_return_lines.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:credit_memos.description Carries the persisted description column.
 * @evidenceReview prisma:credit_memos.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employees.description Carries the persisted description column.
 * @evidenceReview prisma:employees.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:departments.description Carries the persisted description column.
 * @evidenceReview prisma:departments.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employment_contracts.description Carries the persisted description column.
 * @evidenceReview prisma:employment_contracts.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:projects.description Carries the persisted description column.
 * @evidenceReview prisma:projects.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:project_members.description Carries the persisted description column.
 * @evidenceReview prisma:project_members.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tasks.description Carries the persisted description column.
 * @evidenceReview prisma:tasks.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timelogs.description Carries the persisted description column.
 * @evidenceReview prisma:timelogs.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timesheets.description Carries the persisted description column.
 * @evidenceReview prisma:timesheets.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_configurations.description Carries the persisted description column.
 * @evidenceReview prisma:payroll_configurations.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:pay_schedules.description Carries the persisted description column.
 * @evidenceReview prisma:pay_schedules.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_runs.description Carries the persisted description column.
 * @evidenceReview prisma:payroll_runs.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payslips.description Carries the persisted description column.
 * @evidenceReview prisma:payslips.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:budgets.description Carries the persisted description column.
 * @evidenceReview prisma:budgets.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cost_centers.description Carries the persisted description column.
 * @evidenceReview prisma:cost_centers.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:profit_centers.description Carries the persisted description column.
 * @evidenceReview prisma:profit_centers.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:allocation_rules.description Carries the persisted description column.
 * @evidenceReview prisma:allocation_rules.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_categories.description Carries the persisted description column.
 * @evidenceReview prisma:asset_categories.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fixed_assets.description Carries the persisted description column.
 * @evidenceReview prisma:fixed_assets.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_schedules.description Carries the persisted description column.
 * @evidenceReview prisma:depreciation_schedules.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_runs.description Carries the persisted description column.
 * @evidenceReview prisma:depreciation_runs.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_transfers.description Carries the persisted description column.
 * @evidenceReview prisma:asset_transfers.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_impairments.description Carries the persisted description column.
 * @evidenceReview prisma:asset_impairments.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_disposals.description Carries the persisted description column.
 * @evidenceReview prisma:asset_disposals.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bill_of_materials.description Carries the persisted description column.
 * @evidenceReview prisma:bill_of_materials.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bom_versions.description Carries the persisted description column.
 * @evidenceReview prisma:bom_versions.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_versions.description Carries the persisted description column.
 * @evidenceReview prisma:routing_versions.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_operations.description Carries the persisted description column.
 * @evidenceReview prisma:routing_operations.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:work_centers.description Carries the persisted description column.
 * @evidenceReview prisma:work_centers.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:machines.description Carries the persisted description column.
 * @evidenceReview prisma:machines.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_runs.description Carries the persisted description column.
 * @evidenceReview prisma:mrp_runs.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_recommendations.description Carries the persisted description column.
 * @evidenceReview prisma:mrp_recommendations.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_orders.description Carries the persisted description column.
 * @evidenceReview prisma:production_orders.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_order_operations.description Carries the persisted description column.
 * @evidenceReview prisma:production_order_operations.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_plans.description Carries the persisted description column.
 * @evidenceReview prisma:inspection_plans.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_orders.description Carries the persisted description column.
 * @evidenceReview prisma:inspection_orders.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_quarantines.description Carries the persisted description column.
 * @evidenceReview prisma:stock_quarantines.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:quality_dispositions.description Carries the persisted description column.
 * @evidenceReview prisma:quality_dispositions.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:equipment.description Carries the persisted description column.
 * @evidenceReview prisma:equipment.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_plans.description Carries the persisted description column.
 * @evidenceReview prisma:maintenance_plans.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_orders.description Carries the persisted description column.
 * @evidenceReview prisma:maintenance_orders.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_cases.description Carries the persisted description column.
 * @evidenceReview prisma:service_cases.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_orders.description Carries the persisted description column.
 * @evidenceReview prisma:service_orders.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_workflows.description Carries the persisted description column.
 * @evidenceReview prisma:approval_workflows.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_requests.description Carries the persisted description column.
 * @evidenceReview prisma:approval_requests.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:audit_events.description Carries the persisted description column.
 * @evidenceReview prisma:audit_events.description Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notifications.description Carries the persisted description column.
 * @evidenceReview prisma:notifications.description Read the DTO property and compared its type with the cited Prisma column.
   */
  description: null | string;
  /** referenceId.
 * @evidence prisma:addresses.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:addresses.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:contacts.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:contacts.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:attachments.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:attachments.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:comments.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:comments.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tags.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:tags.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_fields.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:custom_fields.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_field_values.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:custom_field_values.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:currencies.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:currencies.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:exchange_rates.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:exchange_rates.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payment_terms.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:payment_terms.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_jurisdictions.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:tax_jurisdictions.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_codes.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:tax_codes.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_rates.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:tax_rates.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:units_of_measure.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:units_of_measure.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:document_number_sequences.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:document_number_sequences.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_calendars.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:fiscal_calendars.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notification_preferences.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:notification_preferences.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:ledger_accounts.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:ledger_accounts.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_entries.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:journal_entries.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_lines.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:journal_lines.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_periods.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:fiscal_periods.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:closing_snapshots.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:closing_snapshots.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_accounts.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:bank_accounts.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_transactions.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:bank_transactions.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_reconciliations.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:bank_reconciliations.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_returns.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:tax_returns.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendors.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:vendors.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_requests.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:purchase_requests.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_request_lines.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:purchase_request_lines.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_orders.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:purchase_orders.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_order_lines.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:purchase_order_lines.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipts.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:purchase_receipts.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipt_lines.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:purchase_receipt_lines.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_returns.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:purchase_returns.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_return_lines.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:purchase_return_lines.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bills.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:vendor_bills.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bill_lines.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:vendor_bill_lines.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payments.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:vendor_payments.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payment_allocations.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:vendor_payment_allocations.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_credits.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:vendor_credits.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:items.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:items.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouses.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:warehouses.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:storage_locations.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:storage_locations.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_movements.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:stock_movements.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_lots.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:inventory_lots.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:item_serials.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:item_serials.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouse_transfers.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:warehouse_transfers.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cycle_counts.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:cycle_counts.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_adjustments.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:inventory_adjustments.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customers.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:customers.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_prices.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:sales_prices.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quotes.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:sales_quotes.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quote_lines.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:sales_quote_lines.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_orders.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:sales_orders.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_order_lines.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:sales_order_lines.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_allocations.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:stock_allocations.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipments.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:shipments.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipment_lines.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:shipment_lines.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoices.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:sales_invoices.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoice_lines.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:sales_invoice_lines.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customer_payments.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:customer_payments.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_returns.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:sales_returns.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_return_lines.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:sales_return_lines.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:credit_memos.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:credit_memos.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employees.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:employees.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:departments.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:departments.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employment_contracts.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:employment_contracts.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:projects.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:projects.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:project_members.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:project_members.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tasks.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:tasks.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timelogs.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:timelogs.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timesheets.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:timesheets.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_configurations.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:payroll_configurations.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:pay_schedules.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:pay_schedules.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_runs.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:payroll_runs.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payslips.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:payslips.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:budgets.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:budgets.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cost_centers.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:cost_centers.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:profit_centers.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:profit_centers.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:allocation_rules.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:allocation_rules.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_categories.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:asset_categories.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fixed_assets.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:fixed_assets.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_schedules.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:depreciation_schedules.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_runs.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:depreciation_runs.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_transfers.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:asset_transfers.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_impairments.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:asset_impairments.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_disposals.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:asset_disposals.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bill_of_materials.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:bill_of_materials.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bom_versions.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:bom_versions.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_versions.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:routing_versions.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_operations.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:routing_operations.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:work_centers.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:work_centers.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:machines.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:machines.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_runs.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:mrp_runs.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_recommendations.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:mrp_recommendations.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_orders.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:production_orders.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_order_operations.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:production_order_operations.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_plans.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:inspection_plans.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_orders.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:inspection_orders.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_quarantines.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:stock_quarantines.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:quality_dispositions.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:quality_dispositions.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:equipment.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:equipment.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_plans.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:maintenance_plans.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_orders.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:maintenance_orders.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_cases.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:service_cases.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_orders.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:service_orders.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_workflows.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:approval_workflows.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_requests.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:approval_requests.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:audit_events.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:audit_events.reference_id Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notifications.reference_id Carries the persisted reference_id column.
 * @evidenceReview prisma:notifications.reference_id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId: null | (string & tags.Format<"uuid">);
  /** quantity.
 * @evidence prisma:addresses.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:addresses.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:contacts.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:contacts.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:attachments.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:attachments.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:comments.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:comments.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tags.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:tags.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_fields.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:custom_fields.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_field_values.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:custom_field_values.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:currencies.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:currencies.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:exchange_rates.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:exchange_rates.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payment_terms.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:payment_terms.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_jurisdictions.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:tax_jurisdictions.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_codes.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:tax_codes.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_rates.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:tax_rates.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:units_of_measure.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:units_of_measure.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:document_number_sequences.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:document_number_sequences.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_calendars.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:fiscal_calendars.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notification_preferences.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:notification_preferences.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:ledger_accounts.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:ledger_accounts.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_entries.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:journal_entries.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_lines.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:journal_lines.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_periods.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:fiscal_periods.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:closing_snapshots.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:closing_snapshots.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_accounts.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:bank_accounts.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_transactions.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:bank_transactions.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_reconciliations.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:bank_reconciliations.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_returns.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:tax_returns.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendors.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:vendors.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_requests.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:purchase_requests.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_request_lines.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:purchase_request_lines.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_orders.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:purchase_orders.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_order_lines.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:purchase_order_lines.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipts.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:purchase_receipts.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipt_lines.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:purchase_receipt_lines.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_returns.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:purchase_returns.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_return_lines.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:purchase_return_lines.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bills.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:vendor_bills.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bill_lines.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:vendor_bill_lines.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payments.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:vendor_payments.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payment_allocations.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:vendor_payment_allocations.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_credits.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:vendor_credits.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:items.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:items.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouses.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:warehouses.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:storage_locations.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:storage_locations.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_movements.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:stock_movements.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_lots.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:inventory_lots.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:item_serials.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:item_serials.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouse_transfers.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:warehouse_transfers.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cycle_counts.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:cycle_counts.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_adjustments.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:inventory_adjustments.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customers.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:customers.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_prices.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:sales_prices.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quotes.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:sales_quotes.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quote_lines.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:sales_quote_lines.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_orders.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:sales_orders.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_order_lines.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:sales_order_lines.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_allocations.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:stock_allocations.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipments.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:shipments.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipment_lines.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:shipment_lines.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoices.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:sales_invoices.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoice_lines.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:sales_invoice_lines.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customer_payments.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:customer_payments.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_returns.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:sales_returns.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_return_lines.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:sales_return_lines.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:credit_memos.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:credit_memos.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employees.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:employees.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:departments.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:departments.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employment_contracts.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:employment_contracts.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:projects.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:projects.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:project_members.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:project_members.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tasks.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:tasks.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timelogs.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:timelogs.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timesheets.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:timesheets.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_configurations.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:payroll_configurations.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:pay_schedules.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:pay_schedules.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_runs.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:payroll_runs.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payslips.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:payslips.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:budgets.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:budgets.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cost_centers.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:cost_centers.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:profit_centers.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:profit_centers.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:allocation_rules.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:allocation_rules.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_categories.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:asset_categories.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fixed_assets.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:fixed_assets.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_schedules.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:depreciation_schedules.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_runs.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:depreciation_runs.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_transfers.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:asset_transfers.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_impairments.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:asset_impairments.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_disposals.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:asset_disposals.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bill_of_materials.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:bill_of_materials.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bom_versions.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:bom_versions.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_versions.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:routing_versions.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_operations.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:routing_operations.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:work_centers.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:work_centers.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:machines.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:machines.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_runs.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:mrp_runs.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_recommendations.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:mrp_recommendations.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_orders.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:production_orders.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_order_operations.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:production_order_operations.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_plans.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:inspection_plans.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_orders.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:inspection_orders.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_quarantines.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:stock_quarantines.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:quality_dispositions.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:quality_dispositions.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:equipment.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:equipment.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_plans.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:maintenance_plans.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_orders.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:maintenance_orders.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_cases.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:service_cases.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_orders.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:service_orders.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_workflows.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:approval_workflows.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_requests.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:approval_requests.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:audit_events.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:audit_events.quantity Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notifications.quantity Carries the persisted quantity column.
 * @evidenceReview prisma:notifications.quantity Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity: null | number;
  /** amount.
 * @evidence prisma:addresses.amount Carries the persisted amount column.
 * @evidenceReview prisma:addresses.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:contacts.amount Carries the persisted amount column.
 * @evidenceReview prisma:contacts.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:attachments.amount Carries the persisted amount column.
 * @evidenceReview prisma:attachments.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:comments.amount Carries the persisted amount column.
 * @evidenceReview prisma:comments.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tags.amount Carries the persisted amount column.
 * @evidenceReview prisma:tags.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_fields.amount Carries the persisted amount column.
 * @evidenceReview prisma:custom_fields.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_field_values.amount Carries the persisted amount column.
 * @evidenceReview prisma:custom_field_values.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:currencies.amount Carries the persisted amount column.
 * @evidenceReview prisma:currencies.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:exchange_rates.amount Carries the persisted amount column.
 * @evidenceReview prisma:exchange_rates.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payment_terms.amount Carries the persisted amount column.
 * @evidenceReview prisma:payment_terms.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_jurisdictions.amount Carries the persisted amount column.
 * @evidenceReview prisma:tax_jurisdictions.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_codes.amount Carries the persisted amount column.
 * @evidenceReview prisma:tax_codes.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_rates.amount Carries the persisted amount column.
 * @evidenceReview prisma:tax_rates.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:units_of_measure.amount Carries the persisted amount column.
 * @evidenceReview prisma:units_of_measure.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:document_number_sequences.amount Carries the persisted amount column.
 * @evidenceReview prisma:document_number_sequences.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_calendars.amount Carries the persisted amount column.
 * @evidenceReview prisma:fiscal_calendars.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notification_preferences.amount Carries the persisted amount column.
 * @evidenceReview prisma:notification_preferences.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:ledger_accounts.amount Carries the persisted amount column.
 * @evidenceReview prisma:ledger_accounts.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_entries.amount Carries the persisted amount column.
 * @evidenceReview prisma:journal_entries.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_lines.amount Carries the persisted amount column.
 * @evidenceReview prisma:journal_lines.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_periods.amount Carries the persisted amount column.
 * @evidenceReview prisma:fiscal_periods.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:closing_snapshots.amount Carries the persisted amount column.
 * @evidenceReview prisma:closing_snapshots.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_accounts.amount Carries the persisted amount column.
 * @evidenceReview prisma:bank_accounts.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_transactions.amount Carries the persisted amount column.
 * @evidenceReview prisma:bank_transactions.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_reconciliations.amount Carries the persisted amount column.
 * @evidenceReview prisma:bank_reconciliations.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_returns.amount Carries the persisted amount column.
 * @evidenceReview prisma:tax_returns.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendors.amount Carries the persisted amount column.
 * @evidenceReview prisma:vendors.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_requests.amount Carries the persisted amount column.
 * @evidenceReview prisma:purchase_requests.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_request_lines.amount Carries the persisted amount column.
 * @evidenceReview prisma:purchase_request_lines.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_orders.amount Carries the persisted amount column.
 * @evidenceReview prisma:purchase_orders.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_order_lines.amount Carries the persisted amount column.
 * @evidenceReview prisma:purchase_order_lines.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipts.amount Carries the persisted amount column.
 * @evidenceReview prisma:purchase_receipts.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipt_lines.amount Carries the persisted amount column.
 * @evidenceReview prisma:purchase_receipt_lines.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_returns.amount Carries the persisted amount column.
 * @evidenceReview prisma:purchase_returns.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_return_lines.amount Carries the persisted amount column.
 * @evidenceReview prisma:purchase_return_lines.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bills.amount Carries the persisted amount column.
 * @evidenceReview prisma:vendor_bills.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bill_lines.amount Carries the persisted amount column.
 * @evidenceReview prisma:vendor_bill_lines.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payments.amount Carries the persisted amount column.
 * @evidenceReview prisma:vendor_payments.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payment_allocations.amount Carries the persisted amount column.
 * @evidenceReview prisma:vendor_payment_allocations.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_credits.amount Carries the persisted amount column.
 * @evidenceReview prisma:vendor_credits.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:items.amount Carries the persisted amount column.
 * @evidenceReview prisma:items.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouses.amount Carries the persisted amount column.
 * @evidenceReview prisma:warehouses.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:storage_locations.amount Carries the persisted amount column.
 * @evidenceReview prisma:storage_locations.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_movements.amount Carries the persisted amount column.
 * @evidenceReview prisma:stock_movements.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_lots.amount Carries the persisted amount column.
 * @evidenceReview prisma:inventory_lots.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:item_serials.amount Carries the persisted amount column.
 * @evidenceReview prisma:item_serials.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouse_transfers.amount Carries the persisted amount column.
 * @evidenceReview prisma:warehouse_transfers.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cycle_counts.amount Carries the persisted amount column.
 * @evidenceReview prisma:cycle_counts.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_adjustments.amount Carries the persisted amount column.
 * @evidenceReview prisma:inventory_adjustments.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customers.amount Carries the persisted amount column.
 * @evidenceReview prisma:customers.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_prices.amount Carries the persisted amount column.
 * @evidenceReview prisma:sales_prices.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quotes.amount Carries the persisted amount column.
 * @evidenceReview prisma:sales_quotes.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quote_lines.amount Carries the persisted amount column.
 * @evidenceReview prisma:sales_quote_lines.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_orders.amount Carries the persisted amount column.
 * @evidenceReview prisma:sales_orders.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_order_lines.amount Carries the persisted amount column.
 * @evidenceReview prisma:sales_order_lines.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_allocations.amount Carries the persisted amount column.
 * @evidenceReview prisma:stock_allocations.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipments.amount Carries the persisted amount column.
 * @evidenceReview prisma:shipments.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipment_lines.amount Carries the persisted amount column.
 * @evidenceReview prisma:shipment_lines.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoices.amount Carries the persisted amount column.
 * @evidenceReview prisma:sales_invoices.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoice_lines.amount Carries the persisted amount column.
 * @evidenceReview prisma:sales_invoice_lines.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customer_payments.amount Carries the persisted amount column.
 * @evidenceReview prisma:customer_payments.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_returns.amount Carries the persisted amount column.
 * @evidenceReview prisma:sales_returns.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_return_lines.amount Carries the persisted amount column.
 * @evidenceReview prisma:sales_return_lines.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:credit_memos.amount Carries the persisted amount column.
 * @evidenceReview prisma:credit_memos.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employees.amount Carries the persisted amount column.
 * @evidenceReview prisma:employees.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:departments.amount Carries the persisted amount column.
 * @evidenceReview prisma:departments.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employment_contracts.amount Carries the persisted amount column.
 * @evidenceReview prisma:employment_contracts.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:projects.amount Carries the persisted amount column.
 * @evidenceReview prisma:projects.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:project_members.amount Carries the persisted amount column.
 * @evidenceReview prisma:project_members.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tasks.amount Carries the persisted amount column.
 * @evidenceReview prisma:tasks.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timelogs.amount Carries the persisted amount column.
 * @evidenceReview prisma:timelogs.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timesheets.amount Carries the persisted amount column.
 * @evidenceReview prisma:timesheets.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_configurations.amount Carries the persisted amount column.
 * @evidenceReview prisma:payroll_configurations.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:pay_schedules.amount Carries the persisted amount column.
 * @evidenceReview prisma:pay_schedules.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_runs.amount Carries the persisted amount column.
 * @evidenceReview prisma:payroll_runs.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payslips.amount Carries the persisted amount column.
 * @evidenceReview prisma:payslips.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:budgets.amount Carries the persisted amount column.
 * @evidenceReview prisma:budgets.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cost_centers.amount Carries the persisted amount column.
 * @evidenceReview prisma:cost_centers.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:profit_centers.amount Carries the persisted amount column.
 * @evidenceReview prisma:profit_centers.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:allocation_rules.amount Carries the persisted amount column.
 * @evidenceReview prisma:allocation_rules.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_categories.amount Carries the persisted amount column.
 * @evidenceReview prisma:asset_categories.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fixed_assets.amount Carries the persisted amount column.
 * @evidenceReview prisma:fixed_assets.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_schedules.amount Carries the persisted amount column.
 * @evidenceReview prisma:depreciation_schedules.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_runs.amount Carries the persisted amount column.
 * @evidenceReview prisma:depreciation_runs.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_transfers.amount Carries the persisted amount column.
 * @evidenceReview prisma:asset_transfers.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_impairments.amount Carries the persisted amount column.
 * @evidenceReview prisma:asset_impairments.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_disposals.amount Carries the persisted amount column.
 * @evidenceReview prisma:asset_disposals.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bill_of_materials.amount Carries the persisted amount column.
 * @evidenceReview prisma:bill_of_materials.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bom_versions.amount Carries the persisted amount column.
 * @evidenceReview prisma:bom_versions.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_versions.amount Carries the persisted amount column.
 * @evidenceReview prisma:routing_versions.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_operations.amount Carries the persisted amount column.
 * @evidenceReview prisma:routing_operations.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:work_centers.amount Carries the persisted amount column.
 * @evidenceReview prisma:work_centers.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:machines.amount Carries the persisted amount column.
 * @evidenceReview prisma:machines.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_runs.amount Carries the persisted amount column.
 * @evidenceReview prisma:mrp_runs.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_recommendations.amount Carries the persisted amount column.
 * @evidenceReview prisma:mrp_recommendations.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_orders.amount Carries the persisted amount column.
 * @evidenceReview prisma:production_orders.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_order_operations.amount Carries the persisted amount column.
 * @evidenceReview prisma:production_order_operations.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_plans.amount Carries the persisted amount column.
 * @evidenceReview prisma:inspection_plans.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_orders.amount Carries the persisted amount column.
 * @evidenceReview prisma:inspection_orders.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_quarantines.amount Carries the persisted amount column.
 * @evidenceReview prisma:stock_quarantines.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:quality_dispositions.amount Carries the persisted amount column.
 * @evidenceReview prisma:quality_dispositions.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:equipment.amount Carries the persisted amount column.
 * @evidenceReview prisma:equipment.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_plans.amount Carries the persisted amount column.
 * @evidenceReview prisma:maintenance_plans.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_orders.amount Carries the persisted amount column.
 * @evidenceReview prisma:maintenance_orders.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_cases.amount Carries the persisted amount column.
 * @evidenceReview prisma:service_cases.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_orders.amount Carries the persisted amount column.
 * @evidenceReview prisma:service_orders.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_workflows.amount Carries the persisted amount column.
 * @evidenceReview prisma:approval_workflows.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_requests.amount Carries the persisted amount column.
 * @evidenceReview prisma:approval_requests.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:audit_events.amount Carries the persisted amount column.
 * @evidenceReview prisma:audit_events.amount Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notifications.amount Carries the persisted amount column.
 * @evidenceReview prisma:notifications.amount Read the DTO property and compared its type with the cited Prisma column.
   */
  amount: null | number;
  /** createdAt.
 * @evidence prisma:addresses.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:addresses.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:contacts.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:contacts.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:attachments.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:attachments.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:comments.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:comments.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tags.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:tags.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_fields.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:custom_fields.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_field_values.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:custom_field_values.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:currencies.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:currencies.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:exchange_rates.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:exchange_rates.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payment_terms.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:payment_terms.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_jurisdictions.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:tax_jurisdictions.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_codes.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:tax_codes.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_rates.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:tax_rates.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:units_of_measure.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:units_of_measure.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:document_number_sequences.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:document_number_sequences.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_calendars.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:fiscal_calendars.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notification_preferences.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:notification_preferences.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:ledger_accounts.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:ledger_accounts.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_entries.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:journal_entries.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_lines.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:journal_lines.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_periods.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:fiscal_periods.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:closing_snapshots.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:closing_snapshots.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_accounts.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:bank_accounts.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_transactions.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:bank_transactions.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_reconciliations.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:bank_reconciliations.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_returns.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:tax_returns.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendors.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:vendors.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_requests.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:purchase_requests.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_request_lines.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:purchase_request_lines.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_orders.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:purchase_orders.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_order_lines.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:purchase_order_lines.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipts.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:purchase_receipts.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipt_lines.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:purchase_receipt_lines.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_returns.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:purchase_returns.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_return_lines.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:purchase_return_lines.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bills.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:vendor_bills.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bill_lines.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:vendor_bill_lines.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payments.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:vendor_payments.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payment_allocations.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:vendor_payment_allocations.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_credits.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:vendor_credits.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:items.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:items.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouses.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:warehouses.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:storage_locations.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:storage_locations.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_movements.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:stock_movements.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_lots.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:inventory_lots.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:item_serials.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:item_serials.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouse_transfers.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:warehouse_transfers.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cycle_counts.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:cycle_counts.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_adjustments.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:inventory_adjustments.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customers.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:customers.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_prices.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:sales_prices.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quotes.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:sales_quotes.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quote_lines.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:sales_quote_lines.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_orders.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:sales_orders.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_order_lines.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:sales_order_lines.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_allocations.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:stock_allocations.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipments.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:shipments.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipment_lines.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:shipment_lines.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoices.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:sales_invoices.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoice_lines.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:sales_invoice_lines.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customer_payments.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:customer_payments.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_returns.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:sales_returns.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_return_lines.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:sales_return_lines.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:credit_memos.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:credit_memos.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employees.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:employees.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:departments.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:departments.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employment_contracts.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:employment_contracts.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:projects.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:projects.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:project_members.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:project_members.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tasks.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:tasks.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timelogs.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:timelogs.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timesheets.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:timesheets.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_configurations.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:payroll_configurations.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:pay_schedules.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:pay_schedules.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_runs.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:payroll_runs.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payslips.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:payslips.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:budgets.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:budgets.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cost_centers.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:cost_centers.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:profit_centers.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:profit_centers.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:allocation_rules.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:allocation_rules.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_categories.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:asset_categories.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fixed_assets.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:fixed_assets.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_schedules.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:depreciation_schedules.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_runs.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:depreciation_runs.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_transfers.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:asset_transfers.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_impairments.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:asset_impairments.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_disposals.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:asset_disposals.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bill_of_materials.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:bill_of_materials.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bom_versions.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:bom_versions.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_versions.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:routing_versions.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_operations.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:routing_operations.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:work_centers.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:work_centers.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:machines.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:machines.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_runs.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:mrp_runs.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_recommendations.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:mrp_recommendations.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_orders.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:production_orders.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_order_operations.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:production_order_operations.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_plans.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:inspection_plans.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_orders.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:inspection_orders.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_quarantines.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:stock_quarantines.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:quality_dispositions.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:quality_dispositions.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:equipment.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:equipment.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_plans.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:maintenance_plans.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_orders.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:maintenance_orders.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_cases.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:service_cases.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_orders.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:service_orders.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_workflows.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:approval_workflows.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_requests.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:approval_requests.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:audit_events.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:audit_events.created_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notifications.created_at Carries the persisted created_at column.
 * @evidenceReview prisma:notifications.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
 * @evidence prisma:addresses.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:addresses.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:contacts.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:contacts.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:attachments.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:attachments.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:comments.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:comments.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tags.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:tags.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_fields.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:custom_fields.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_field_values.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:custom_field_values.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:currencies.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:currencies.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:exchange_rates.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:exchange_rates.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payment_terms.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:payment_terms.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_jurisdictions.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:tax_jurisdictions.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_codes.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:tax_codes.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_rates.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:tax_rates.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:units_of_measure.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:units_of_measure.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:document_number_sequences.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:document_number_sequences.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_calendars.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:fiscal_calendars.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notification_preferences.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:notification_preferences.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:ledger_accounts.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:ledger_accounts.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_entries.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:journal_entries.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_lines.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:journal_lines.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_periods.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:fiscal_periods.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:closing_snapshots.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:closing_snapshots.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_accounts.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:bank_accounts.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_transactions.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:bank_transactions.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_reconciliations.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:bank_reconciliations.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_returns.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:tax_returns.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendors.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:vendors.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_requests.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:purchase_requests.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_request_lines.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:purchase_request_lines.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_orders.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:purchase_orders.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_order_lines.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:purchase_order_lines.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipts.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:purchase_receipts.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipt_lines.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:purchase_receipt_lines.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_returns.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:purchase_returns.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_return_lines.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:purchase_return_lines.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bills.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:vendor_bills.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bill_lines.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:vendor_bill_lines.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payments.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:vendor_payments.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payment_allocations.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:vendor_payment_allocations.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_credits.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:vendor_credits.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:items.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:items.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouses.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:warehouses.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:storage_locations.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:storage_locations.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_movements.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:stock_movements.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_lots.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:inventory_lots.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:item_serials.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:item_serials.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouse_transfers.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:warehouse_transfers.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cycle_counts.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:cycle_counts.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_adjustments.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:inventory_adjustments.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customers.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:customers.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_prices.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:sales_prices.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quotes.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:sales_quotes.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quote_lines.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:sales_quote_lines.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_orders.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:sales_orders.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_order_lines.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:sales_order_lines.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_allocations.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:stock_allocations.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipments.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:shipments.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipment_lines.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:shipment_lines.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoices.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:sales_invoices.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoice_lines.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:sales_invoice_lines.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customer_payments.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:customer_payments.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_returns.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:sales_returns.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_return_lines.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:sales_return_lines.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:credit_memos.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:credit_memos.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employees.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:employees.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:departments.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:departments.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employment_contracts.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:employment_contracts.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:projects.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:projects.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:project_members.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:project_members.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tasks.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:tasks.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timelogs.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:timelogs.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timesheets.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:timesheets.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_configurations.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:payroll_configurations.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:pay_schedules.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:pay_schedules.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_runs.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:payroll_runs.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payslips.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:payslips.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:budgets.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:budgets.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cost_centers.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:cost_centers.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:profit_centers.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:profit_centers.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:allocation_rules.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:allocation_rules.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_categories.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:asset_categories.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fixed_assets.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:fixed_assets.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_schedules.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:depreciation_schedules.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_runs.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:depreciation_runs.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_transfers.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:asset_transfers.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_impairments.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:asset_impairments.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_disposals.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:asset_disposals.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bill_of_materials.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:bill_of_materials.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bom_versions.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:bom_versions.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_versions.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:routing_versions.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_operations.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:routing_operations.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:work_centers.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:work_centers.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:machines.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:machines.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_runs.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:mrp_runs.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_recommendations.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:mrp_recommendations.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_orders.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:production_orders.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_order_operations.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:production_order_operations.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_plans.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:inspection_plans.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_orders.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:inspection_orders.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_quarantines.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:stock_quarantines.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:quality_dispositions.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:quality_dispositions.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:equipment.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:equipment.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_plans.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:maintenance_plans.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_orders.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:maintenance_orders.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_cases.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:service_cases.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_orders.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:service_orders.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_workflows.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:approval_workflows.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_requests.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:approval_requests.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:audit_events.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:audit_events.updated_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notifications.updated_at Carries the persisted updated_at column.
 * @evidenceReview prisma:notifications.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: null | (string & tags.Format<"date-time">);
  /** deletedAt.
 * @evidence prisma:addresses.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:addresses.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:contacts.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:contacts.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:attachments.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:attachments.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:comments.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:comments.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tags.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:tags.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_fields.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:custom_fields.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:custom_field_values.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:custom_field_values.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:currencies.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:currencies.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:exchange_rates.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:exchange_rates.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payment_terms.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:payment_terms.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_jurisdictions.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:tax_jurisdictions.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_codes.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:tax_codes.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_rates.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:tax_rates.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:units_of_measure.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:units_of_measure.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:document_number_sequences.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:document_number_sequences.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_calendars.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:fiscal_calendars.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notification_preferences.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:notification_preferences.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:ledger_accounts.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:ledger_accounts.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_entries.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:journal_entries.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:journal_lines.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:journal_lines.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fiscal_periods.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:fiscal_periods.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:closing_snapshots.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:closing_snapshots.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_accounts.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:bank_accounts.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_transactions.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:bank_transactions.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bank_reconciliations.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:bank_reconciliations.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tax_returns.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:tax_returns.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendors.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:vendors.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_requests.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:purchase_requests.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_request_lines.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:purchase_request_lines.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_orders.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:purchase_orders.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_order_lines.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:purchase_order_lines.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipts.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:purchase_receipts.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_receipt_lines.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:purchase_receipt_lines.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_returns.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:purchase_returns.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:purchase_return_lines.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:purchase_return_lines.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bills.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:vendor_bills.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_bill_lines.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:vendor_bill_lines.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payments.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:vendor_payments.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_payment_allocations.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:vendor_payment_allocations.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:vendor_credits.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:vendor_credits.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:items.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:items.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouses.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:warehouses.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:storage_locations.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:storage_locations.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_movements.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:stock_movements.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_lots.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:inventory_lots.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:item_serials.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:item_serials.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:warehouse_transfers.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:warehouse_transfers.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cycle_counts.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:cycle_counts.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inventory_adjustments.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:inventory_adjustments.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customers.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:customers.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_prices.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:sales_prices.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quotes.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:sales_quotes.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_quote_lines.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:sales_quote_lines.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_orders.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:sales_orders.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_order_lines.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:sales_order_lines.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_allocations.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:stock_allocations.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipments.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:shipments.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:shipment_lines.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:shipment_lines.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoices.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:sales_invoices.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_invoice_lines.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:sales_invoice_lines.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:customer_payments.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:customer_payments.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_returns.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:sales_returns.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:sales_return_lines.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:sales_return_lines.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:credit_memos.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:credit_memos.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employees.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:employees.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:departments.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:departments.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:employment_contracts.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:employment_contracts.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:projects.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:projects.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:project_members.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:project_members.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:tasks.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:tasks.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timelogs.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:timelogs.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:timesheets.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:timesheets.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_configurations.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:payroll_configurations.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:pay_schedules.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:pay_schedules.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payroll_runs.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:payroll_runs.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:payslips.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:payslips.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:budgets.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:budgets.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:cost_centers.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:cost_centers.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:profit_centers.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:profit_centers.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:allocation_rules.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:allocation_rules.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_categories.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:asset_categories.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:fixed_assets.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:fixed_assets.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_schedules.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:depreciation_schedules.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:depreciation_runs.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:depreciation_runs.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_transfers.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:asset_transfers.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_impairments.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:asset_impairments.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:asset_disposals.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:asset_disposals.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bill_of_materials.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:bill_of_materials.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:bom_versions.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:bom_versions.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_versions.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:routing_versions.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:routing_operations.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:routing_operations.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:work_centers.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:work_centers.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:machines.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:machines.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_runs.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:mrp_runs.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:mrp_recommendations.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:mrp_recommendations.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_orders.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:production_orders.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:production_order_operations.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:production_order_operations.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_plans.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:inspection_plans.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:inspection_orders.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:inspection_orders.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:stock_quarantines.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:stock_quarantines.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:quality_dispositions.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:quality_dispositions.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:equipment.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:equipment.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_plans.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:maintenance_plans.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:maintenance_orders.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:maintenance_orders.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_cases.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:service_cases.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:service_orders.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:service_orders.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_workflows.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:approval_workflows.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:approval_requests.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:approval_requests.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:audit_events.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:audit_events.deleted_at Read the DTO property and compared its type with the cited Prisma column.
 * @evidence prisma:notifications.deleted_at Carries the persisted deleted_at column.
 * @evidenceReview prisma:notifications.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | (string & tags.Format<"date-time">);
}
