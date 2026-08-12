import type { IErpRecord, IErpRequest } from "@benchmark/erp-api";
import { randomUUID } from "node:crypto";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { OrganizationProvider } from "./OrganizationProvider";
import { RuleEngine } from "./RuleEngine";

type PersistedRecord = {
  id: string;
  organization_id: string;
  name: string | null;
  status: string | null;
  description: string | null;
  reference_id: string | null;
  quantity: { toString(): string } | null;
  amount: { toString(): string } | null;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
  attributes: string | null;
};

type CreateData = {
  id: string;
  organization_id: string;
  name: string;
  status: string;
  description: string | null;
  reference_id: string | null;
  quantity: number | null;
  amount: number | null;
  created_at: Date;
  updated_at: null;
  deleted_at: Date | null;
  attributes: string | null;
};

type UpdateData = {
  name?: string | null;
  status?: string | null;
  description?: string | null;
  reference_id?: string | null;
  quantity?: number | null;
  amount?: number | null;
  updated_at: Date;
  deleted_at?: Date | null;
  attributes?: string | null;
};

/** Executes the shared persisted command boundary used by ERP operations. */
export namespace ErpProvider {
  const organizationId = "00000000-0000-4000-8000-000000000001";

  /**
   * Maps an operation family to its durable aggregate.
   *
   * Report, journey, organization, and stock-view commands intentionally use
   * audit_events until their aggregate-specific read/write contracts exist.
   */
  const modelByFamily: Readonly<Record<string, string>> = {
    "req_fun_account": "ledger_accounts",
    "req_fun_address": "addresses",
    "req_fun_allocation": "stock_allocations",
    "req_fun_allocation_rule": "allocation_rules",
    "req_fun_approval": "approval_requests",
    "req_fun_asset_journey": "fixed_assets",
    "req_fun_attachment": "attachments",
    "req_fun_audit": "audit_events",
    "req_fun_bank_account": "bank_accounts",
    "req_fun_bank_transaction": "bank_transactions",
    "req_fun_bom": "bill_of_materials",
    "req_fun_budget": "budgets",
    "req_fun_comment": "comments",
    "req_fun_contact": "contacts",
    "req_fun_contract": "employment_contracts",
    "req_fun_cost_center": "cost_centers",
    "req_fun_credit_memo": "credit_memos",
    "req_fun_currency": "currencies",
    "req_fun_customer": "customers",
    "req_fun_customer_payment": "customer_payments",
    "req_fun_customfield": "custom_fields",
    "req_fun_cycle_count": "cycle_counts",
    "req_fun_department": "departments",
    "req_fun_doc_number": "document_number_sequences",
    "req_fun_employee": "employees",
    "req_fun_equipment": "equipment",
    "req_fun_exchange_rate": "exchange_rates",
    "req_fun_fiscal_calendar": "fiscal_calendars",
    "req_fun_inspection": "inspection_orders",
    "req_fun_inspection_plan": "inspection_plans",
    "req_fun_inventory_adjustment": "inventory_adjustments",
    "req_fun_item": "items",
    "req_fun_journal": "journal_entries",
    "req_fun_location": "storage_locations",
    "req_fun_machine": "machines",
    "req_fun_maintenance_order": "maintenance_orders",
    "req_fun_maintenance_plan": "maintenance_plans",
    "req_fun_mrp": "mrp_runs",
    "req_fun_mrp_recommendation": "mrp_recommendations",
    "req_fun_notification": "notifications",
    "req_fun_notification_preference": "notification_preferences",
    "req_fun_org": "audit_events",
    "req_fun_pay_schedule": "pay_schedules",
    "req_fun_payment_term": "payment_terms",
    "req_fun_payroll_config": "payroll_configurations",
    "req_fun_payroll_run": "payroll_runs",
    "req_fun_payslip": "payslips",
    "req_fun_period_close": "fiscal_periods",
    "req_fun_production_order": "production_orders",
    "req_fun_profit_center": "profit_centers",
    "req_fun_project": "projects",
    "req_fun_purchase_order": "purchase_orders",
    "req_fun_purchase_receipt": "purchase_receipts",
    "req_fun_purchase_request": "purchase_requests",
    "req_fun_purchase_return": "purchase_returns",
    "req_fun_quarantine": "stock_quarantines",
    "req_fun_reconciliation": "bank_reconciliations",
    "req_fun_report_fin": "audit_events",
    "req_fun_report_hr": "audit_events",
    "req_fun_report_inv": "audit_events",
    "req_fun_report_mfg": "audit_events",
    "req_fun_report_proc": "audit_events",
    "req_fun_report_qms": "audit_events",
    "req_fun_report_sales": "audit_events",
    "req_fun_routing": "routing_versions",
    "req_fun_sales_invoice": "sales_invoices",
    "req_fun_sales_order": "sales_orders",
    "req_fun_sales_price": "sales_prices",
    "req_fun_sales_quote": "sales_quotes",
    "req_fun_sales_return": "sales_returns",
    "req_fun_service_case": "service_cases",
    "req_fun_service_order": "service_orders",
    "req_fun_shipment": "shipments",
    "req_fun_stock_quarantine": "stock_quarantines",
    "req_fun_stock_view": "audit_events",
    "req_fun_tag": "tags",
    "req_fun_task": "tasks",
    "req_fun_tax_code": "tax_codes",
    "req_fun_tax_jurisdiction": "tax_jurisdictions",
    "req_fun_tax_return": "tax_returns",
    "req_fun_timelog": "timelogs",
    "req_fun_timesheet": "timesheets",
    "req_fun_transfer": "warehouse_transfers",
    "req_fun_uom": "units_of_measure",
    "req_fun_vendor": "vendors",
    "req_fun_vendor_bill": "vendor_bills",
    "req_fun_vendor_credit": "vendor_credits",
    "req_fun_vendor_payment": "vendor_payments",
    "req_fun_warehouse": "warehouses",
    "req_fun_work_center": "work_centers",
    "req_fun_workflow": "approval_workflows",
  };

  /** Assigns secondary persisted aggregates to the operation that owns them. */
  const modelByOperation: Readonly<Record<string, string>> = {
    "req_fun_customfield_002": "custom_field_values",
    "req_fun_journal_002": "journal_lines",
    "req_fun_period_close_002": "closing_snapshots",
    "req_fun_tax_code_002": "tax_rates",
    "req_fun_item_003": "item_serials",
    "req_fun_stock_view_003": "inventory_lots",
    "req_fun_project_003": "project_members",
    "req_fun_purchase_request_002": "purchase_request_lines",
    "req_fun_purchase_order_002": "purchase_order_lines",
    "req_fun_purchase_receipt_002": "purchase_receipt_lines",
    "req_fun_purchase_return_002": "purchase_return_lines",
    "req_fun_vendor_bill_002": "vendor_bill_lines",
    "req_fun_vendor_payment_002": "vendor_payment_allocations",
    "req_fun_sales_quote_002": "sales_quote_lines",
    "req_fun_sales_order_002": "sales_order_lines",
    "req_fun_sales_invoice_002": "sales_invoice_lines",
    "req_fun_sales_return_002": "sales_return_lines",
    "req_fun_shipment_002": "shipment_lines",
    "req_fun_asset_journey_002": "asset_categories",
    "req_fun_asset_journey_003": "depreciation_schedules",
    "req_fun_asset_journey_004": "depreciation_runs",
    "req_fun_asset_journey_005": "asset_transfers",
    "req_fun_asset_journey_007": "asset_impairments",
    "req_fun_asset_journey_008": "asset_disposals",
    "req_fun_bom_002": "bom_versions",
    "req_fun_routing_003": "routing_operations",
    "req_fun_production_order_002": "production_order_operations",
    "req_fun_stock_view_004": "stock_movements",
    "req_fun_inspection_007": "quality_dispositions",
  };

  /**
   * Read operations never manufacture durable rows. The operation list is
   * derived from the requirement verbs and kept explicit so a command cannot
   * silently turn a search or report into a write.
   */
  const readOperations = new Set<string>([
    "req_fun_org_002",
    "req_fun_org_004",
    "req_fun_address_002",
    "req_fun_contact_002",
    "req_fun_attachment_002",
    "req_fun_comment_002",
    "req_fun_tag_004",
    "req_fun_customfield_004",
    "req_fun_currency_003",
    "req_fun_exchange_rate_002",
    "req_fun_payment_term_003",
    "req_fun_tax_jurisdiction_003",
    "req_fun_uom_003",
    "req_fun_doc_number_002",
    "req_fun_fiscal_calendar_002",
    "req_fun_notification_preference_001",
    "req_fun_account_003",
    "req_fun_journal_007",
    "req_fun_period_close_002",
    "req_fun_period_close_005",
    "req_fun_bank_account_002",
    "req_fun_bank_transaction_003",
    "req_fun_tax_return_005",
    "req_fun_vendor_003",
    "req_fun_purchase_receipt_004",
    "req_fun_vendor_bill_010",
    "req_fun_vendor_payment_004",
    "req_fun_vendor_credit_004",
    "req_fun_item_002",
    "req_fun_warehouse_002",
    "req_fun_location_002",
    "req_fun_stock_view_001",
    "req_fun_stock_view_002",
    "req_fun_stock_view_005",
    "req_fun_transfer_004",
    "req_fun_inventory_adjustment_005",
    "req_fun_customer_003",
    "req_fun_sales_order_007",
    "req_fun_allocation_004",
    "req_fun_shipment_007",
    "req_fun_sales_invoice_009",
    "req_fun_customer_payment_006",
    "req_fun_credit_memo_004",
    "req_fun_employee_002",
    "req_fun_employee_008",
    "req_fun_department_002",
    "req_fun_contract_003",
    "req_fun_project_002",
    "req_fun_task_003",
    "req_fun_timelog_005",
    "req_fun_timesheet_006",
    "req_fun_payroll_config_002",
    "req_fun_payroll_run_011",
    "req_fun_payslip_001",
    "req_fun_payslip_002",
    "req_fun_payslip_003",
    "req_fun_budget_007",
    "req_fun_cost_center_002",
    "req_fun_profit_center_002",
    "req_fun_allocation_rule_002",
    "req_fun_allocation_rule_005",
    "req_fun_asset_journey_006",
    "req_fun_asset_journey_012",
    "req_fun_bom_002",
    "req_fun_routing_002",
    "req_fun_work_center_002",
    "req_fun_machine_002",
    "req_fun_production_order_005",
    "req_fun_production_order_012",
    "req_fun_inspection_plan_003",
    "req_fun_inspection_001",
    "req_fun_inspection_009",
    "req_fun_equipment_002",
    "req_fun_maintenance_plan_003",
    "req_fun_maintenance_plan_004",
    "req_fun_maintenance_order_010",
    "req_fun_service_case_002",
    "req_fun_service_order_012",
    "req_fun_workflow_005",
    "req_fun_approval_002",
    "req_fun_approval_010",
    "req_fun_audit_002",
    "req_fun_audit_003",
    "req_fun_audit_004",
    "req_fun_notification_005",
    "req_fun_report_fin_001",
    "req_fun_report_fin_002",
    "req_fun_report_fin_003",
    "req_fun_report_fin_004",
    "req_fun_report_fin_005",
    "req_fun_report_fin_006",
    "req_fun_report_fin_007",
    "req_fun_report_fin_008",
    "req_fun_report_fin_009",
    "req_fun_report_fin_010",
    "req_fun_report_fin_011",
    "req_fun_report_proc_001",
    "req_fun_report_proc_002",
    "req_fun_report_proc_003",
    "req_fun_report_proc_004",
    "req_fun_report_proc_005",
    "req_fun_report_proc_006",
    "req_fun_report_inv_001",
    "req_fun_report_inv_002",
    "req_fun_report_inv_003",
    "req_fun_report_inv_004",
    "req_fun_report_inv_005",
    "req_fun_report_inv_006",
    "req_fun_report_inv_007",
    "req_fun_report_inv_008",
    "req_fun_report_sales_001",
    "req_fun_report_sales_002",
    "req_fun_report_sales_003",
    "req_fun_report_sales_004",
    "req_fun_report_sales_005",
    "req_fun_report_sales_006",
    "req_fun_report_hr_001",
    "req_fun_report_hr_002",
    "req_fun_report_hr_003",
    "req_fun_report_hr_004",
    "req_fun_report_hr_005",
    "req_fun_report_hr_006",
    "req_fun_report_hr_007",
    "req_fun_report_mfg_001",
    "req_fun_report_mfg_002",
    "req_fun_report_mfg_003",
    "req_fun_report_mfg_004",
    "req_fun_report_mfg_005",
    "req_fun_report_mfg_006",
    "req_fun_report_mfg_007",
    "req_fun_report_qms_001",
    "req_fun_report_qms_002",
    "req_fun_report_qms_003",
    "req_fun_report_qms_004",
    "req_fun_report_qms_005",
    "req_fun_report_qms_006",
    "req_fun_report_qms_007",
    "req_fun_report_qms_008",
    "req_jrn_p2prod_004",
    "req_fun_mrp_recommendation_001",
    "req_fun_pay_schedule_004",
    "req_fun_stock_quarantine_002",
  ]);

  /** Persists one operation result in the operation family's aggregate. */
  export async function execute(props: {
    operation: string;
    input: IErpRequest;
  }): Promise<IErpRecord> {
    const family = props.operation.replace(/_\d+$/, "");
    if (family === "req_fun_org")
      return OrganizationProvider.execute({
        ...props.input,
        name: props.operation,
      });
    if (
      props.input.organizationId !== null &&
      props.input.organizationId !== undefined &&
      props.input.organizationId !== organizationId
    )
      throw ErrorUtil.forbidden(
        "The selected organization is not active for this connection.",
      );
    const model = modelByOperation[props.operation] ?? modelByFamily[family] ?? "audit_events";
    if (props.operation === "req_fun_account_001") {
      const result = await seedStandardAccounts();
      await recordAudit(props.operation, result.id, props.input);
      return result;
    }
    if (family.startsWith("req_fun_report_"))
      return buildReport(family, props.input);
    if (readOperations.has(props.operation)) {
      const row = await find(model, props.input.id ?? null);
      return row === null ? emptyRecord(props.operation, props.input.id) : toRecord(row);
    }
    const id = props.input.id ?? randomUUID();
    if (props.input.id !== null && props.input.id !== undefined) {
      const existing = await find(model, props.input.id);
      if (existing !== null) {
        const attributes = RuleEngine.validate({
          operation: props.operation,
          status: props.input.status,
          quantity: props.input.quantity,
          attributes: props.input.attributes,
          existing,
        });
        const result = await update(model, existing.id, props.input, attributes);
        if (model !== "audit_events") await recordAudit(props.operation, result.id, props.input, existing, result);
        return result;
      }
    }
    const attributes = RuleEngine.validate({
      operation: props.operation,
      status: props.input.status,
      quantity: props.input.quantity,
      attributes: props.input.attributes,
    });
    const data: CreateData = {
      id,
      organization_id: organizationId,
      name: props.input.name ?? props.operation,
      status: props.input.status ?? "active",
      description: props.input.description ?? null,
      reference_id: props.input.referenceId ?? null,
      quantity: props.input.quantity ?? null,
      amount: props.input.amount ?? null,
      created_at: new Date(),
      updated_at: null,
      deleted_at:
        props.input.status === "inactive" || props.input.status === "deleted"
          ? new Date()
          : null,
      attributes: serializeAttributes(attributes),
    };

    const result = await persist(model, data);
    if (model !== "audit_events") await recordAudit(props.operation, result.id, props.input, null, result);
    return result;
  }

  async function persist(model: string, data: CreateData): Promise<IErpRecord> {
    switch (model) {
      case "addresses":
        return toRecord(await MyGlobal.prisma.addresses.create({ data }));
      case "contacts":
        return toRecord(await MyGlobal.prisma.contacts.create({ data }));
      case "attachments":
        return toRecord(await MyGlobal.prisma.attachments.create({ data }));
      case "comments":
        return toRecord(await MyGlobal.prisma.comments.create({ data }));
      case "tags":
        return toRecord(await MyGlobal.prisma.tags.create({ data }));
      case "custom_fields":
        return toRecord(await MyGlobal.prisma.custom_fields.create({ data }));
      case "custom_field_values":
        return toRecord(await MyGlobal.prisma.custom_field_values.create({ data }));
      case "currencies":
        return toRecord(await MyGlobal.prisma.currencies.create({ data }));
      case "exchange_rates":
        return toRecord(await MyGlobal.prisma.exchange_rates.create({ data }));
      case "payment_terms":
        return toRecord(await MyGlobal.prisma.payment_terms.create({ data }));
      case "tax_jurisdictions":
        return toRecord(await MyGlobal.prisma.tax_jurisdictions.create({ data }));
      case "tax_codes":
        return toRecord(await MyGlobal.prisma.tax_codes.create({ data }));
      case "tax_rates":
        return toRecord(await MyGlobal.prisma.tax_rates.create({ data }));
      case "units_of_measure":
        return toRecord(await MyGlobal.prisma.units_of_measure.create({ data }));
      case "document_number_sequences":
        return toRecord(await MyGlobal.prisma.document_number_sequences.create({ data }));
      case "fiscal_calendars":
        return toRecord(await MyGlobal.prisma.fiscal_calendars.create({ data }));
      case "notification_preferences":
        return toRecord(await MyGlobal.prisma.notification_preferences.create({ data }));
      case "ledger_accounts":
        return toRecord(await MyGlobal.prisma.ledger_accounts.create({ data }));
      case "journal_entries":
        return toRecord(await MyGlobal.prisma.journal_entries.create({ data }));
      case "journal_lines":
        return toRecord(await MyGlobal.prisma.journal_lines.create({ data }));
      case "fiscal_periods":
        return toRecord(await MyGlobal.prisma.fiscal_periods.create({ data }));
      case "closing_snapshots":
        return toRecord(await MyGlobal.prisma.closing_snapshots.create({ data }));
      case "bank_accounts":
        return toRecord(await MyGlobal.prisma.bank_accounts.create({ data }));
      case "bank_transactions":
        return toRecord(await MyGlobal.prisma.bank_transactions.create({ data }));
      case "bank_reconciliations":
        return toRecord(await MyGlobal.prisma.bank_reconciliations.create({ data }));
      case "tax_returns":
        return toRecord(await MyGlobal.prisma.tax_returns.create({ data }));
      case "vendors":
        return toRecord(await MyGlobal.prisma.vendors.create({ data }));
      case "purchase_requests":
        return toRecord(await MyGlobal.prisma.purchase_requests.create({ data }));
      case "purchase_request_lines":
        return toRecord(await MyGlobal.prisma.purchase_request_lines.create({ data }));
      case "purchase_orders":
        return toRecord(await MyGlobal.prisma.purchase_orders.create({ data }));
      case "purchase_order_lines":
        return toRecord(await MyGlobal.prisma.purchase_order_lines.create({ data }));
      case "purchase_receipts":
        return toRecord(await MyGlobal.prisma.purchase_receipts.create({ data }));
      case "purchase_receipt_lines":
        return toRecord(await MyGlobal.prisma.purchase_receipt_lines.create({ data }));
      case "purchase_returns":
        return toRecord(await MyGlobal.prisma.purchase_returns.create({ data }));
      case "purchase_return_lines":
        return toRecord(await MyGlobal.prisma.purchase_return_lines.create({ data }));
      case "vendor_bills":
        return toRecord(await MyGlobal.prisma.vendor_bills.create({ data }));
      case "vendor_bill_lines":
        return toRecord(await MyGlobal.prisma.vendor_bill_lines.create({ data }));
      case "vendor_payments":
        return toRecord(await MyGlobal.prisma.vendor_payments.create({ data }));
      case "vendor_payment_allocations":
        return toRecord(await MyGlobal.prisma.vendor_payment_allocations.create({ data }));
      case "vendor_credits":
        return toRecord(await MyGlobal.prisma.vendor_credits.create({ data }));
      case "items":
        return toRecord(await MyGlobal.prisma.items.create({ data }));
      case "warehouses":
        return toRecord(await MyGlobal.prisma.warehouses.create({ data }));
      case "storage_locations":
        return toRecord(await MyGlobal.prisma.storage_locations.create({ data }));
      case "stock_movements":
        return toRecord(await MyGlobal.prisma.stock_movements.create({ data }));
      case "inventory_lots":
        return toRecord(await MyGlobal.prisma.inventory_lots.create({ data }));
      case "item_serials":
        return toRecord(await MyGlobal.prisma.item_serials.create({ data }));
      case "warehouse_transfers":
        return toRecord(await MyGlobal.prisma.warehouse_transfers.create({ data }));
      case "cycle_counts":
        return toRecord(await MyGlobal.prisma.cycle_counts.create({ data }));
      case "inventory_adjustments":
        return toRecord(await MyGlobal.prisma.inventory_adjustments.create({ data }));
      case "customers":
        return toRecord(await MyGlobal.prisma.customers.create({ data }));
      case "sales_prices":
        return toRecord(await MyGlobal.prisma.sales_prices.create({ data }));
      case "sales_quotes":
        return toRecord(await MyGlobal.prisma.sales_quotes.create({ data }));
      case "sales_quote_lines":
        return toRecord(await MyGlobal.prisma.sales_quote_lines.create({ data }));
      case "sales_orders":
        return toRecord(await MyGlobal.prisma.sales_orders.create({ data }));
      case "sales_order_lines":
        return toRecord(await MyGlobal.prisma.sales_order_lines.create({ data }));
      case "stock_allocations":
        return toRecord(await MyGlobal.prisma.stock_allocations.create({ data }));
      case "shipments":
        return toRecord(await MyGlobal.prisma.shipments.create({ data }));
      case "shipment_lines":
        return toRecord(await MyGlobal.prisma.shipment_lines.create({ data }));
      case "sales_invoices":
        return toRecord(await MyGlobal.prisma.sales_invoices.create({ data }));
      case "sales_invoice_lines":
        return toRecord(await MyGlobal.prisma.sales_invoice_lines.create({ data }));
      case "customer_payments":
        return toRecord(await MyGlobal.prisma.customer_payments.create({ data }));
      case "sales_returns":
        return toRecord(await MyGlobal.prisma.sales_returns.create({ data }));
      case "sales_return_lines":
        return toRecord(await MyGlobal.prisma.sales_return_lines.create({ data }));
      case "credit_memos":
        return toRecord(await MyGlobal.prisma.credit_memos.create({ data }));
      case "employees":
        return toRecord(await MyGlobal.prisma.employees.create({ data }));
      case "departments":
        return toRecord(await MyGlobal.prisma.departments.create({ data }));
      case "employment_contracts":
        return toRecord(await MyGlobal.prisma.employment_contracts.create({ data }));
      case "projects":
        return toRecord(await MyGlobal.prisma.projects.create({ data }));
      case "project_members":
        return toRecord(await MyGlobal.prisma.project_members.create({ data }));
      case "tasks":
        return toRecord(await MyGlobal.prisma.tasks.create({ data }));
      case "timelogs":
        return toRecord(await MyGlobal.prisma.timelogs.create({ data }));
      case "timesheets":
        return toRecord(await MyGlobal.prisma.timesheets.create({ data }));
      case "payroll_configurations":
        return toRecord(await MyGlobal.prisma.payroll_configurations.create({ data }));
      case "pay_schedules":
        return toRecord(await MyGlobal.prisma.pay_schedules.create({ data }));
      case "payroll_runs":
        return toRecord(await MyGlobal.prisma.payroll_runs.create({ data }));
      case "payslips":
        return toRecord(await MyGlobal.prisma.payslips.create({ data }));
      case "budgets":
        return toRecord(await MyGlobal.prisma.budgets.create({ data }));
      case "cost_centers":
        return toRecord(await MyGlobal.prisma.cost_centers.create({ data }));
      case "profit_centers":
        return toRecord(await MyGlobal.prisma.profit_centers.create({ data }));
      case "allocation_rules":
        return toRecord(await MyGlobal.prisma.allocation_rules.create({ data }));
      case "asset_categories":
        return toRecord(await MyGlobal.prisma.asset_categories.create({ data }));
      case "fixed_assets":
        return toRecord(await MyGlobal.prisma.fixed_assets.create({ data }));
      case "depreciation_schedules":
        return toRecord(await MyGlobal.prisma.depreciation_schedules.create({ data }));
      case "depreciation_runs":
        return toRecord(await MyGlobal.prisma.depreciation_runs.create({ data }));
      case "asset_transfers":
        return toRecord(await MyGlobal.prisma.asset_transfers.create({ data }));
      case "asset_impairments":
        return toRecord(await MyGlobal.prisma.asset_impairments.create({ data }));
      case "asset_disposals":
        return toRecord(await MyGlobal.prisma.asset_disposals.create({ data }));
      case "bill_of_materials":
        return toRecord(await MyGlobal.prisma.bill_of_materials.create({ data }));
      case "bom_versions":
        return toRecord(await MyGlobal.prisma.bom_versions.create({ data }));
      case "routing_versions":
        return toRecord(await MyGlobal.prisma.routing_versions.create({ data }));
      case "routing_operations":
        return toRecord(await MyGlobal.prisma.routing_operations.create({ data }));
      case "work_centers":
        return toRecord(await MyGlobal.prisma.work_centers.create({ data }));
      case "machines":
        return toRecord(await MyGlobal.prisma.machines.create({ data }));
      case "mrp_runs":
        return toRecord(await MyGlobal.prisma.mrp_runs.create({ data }));
      case "mrp_recommendations":
        return toRecord(await MyGlobal.prisma.mrp_recommendations.create({ data }));
      case "production_orders":
        return toRecord(await MyGlobal.prisma.production_orders.create({ data }));
      case "production_order_operations":
        return toRecord(await MyGlobal.prisma.production_order_operations.create({ data }));
      case "inspection_plans":
        return toRecord(await MyGlobal.prisma.inspection_plans.create({ data }));
      case "inspection_orders":
        return toRecord(await MyGlobal.prisma.inspection_orders.create({ data }));
      case "stock_quarantines":
        return toRecord(await MyGlobal.prisma.stock_quarantines.create({ data }));
      case "quality_dispositions":
        return toRecord(await MyGlobal.prisma.quality_dispositions.create({ data }));
      case "equipment":
        return toRecord(await MyGlobal.prisma.equipment.create({ data }));
      case "maintenance_plans":
        return toRecord(await MyGlobal.prisma.maintenance_plans.create({ data }));
      case "maintenance_orders":
        return toRecord(await MyGlobal.prisma.maintenance_orders.create({ data }));
      case "service_cases":
        return toRecord(await MyGlobal.prisma.service_cases.create({ data }));
      case "service_orders":
        return toRecord(await MyGlobal.prisma.service_orders.create({ data }));
      case "approval_workflows":
        return toRecord(await MyGlobal.prisma.approval_workflows.create({ data }));
      case "approval_requests":
        return toRecord(await MyGlobal.prisma.approval_requests.create({ data }));
      case "audit_events":
        return toRecord(await MyGlobal.prisma.audit_events.create({ data }));
      case "notifications":
        return toRecord(await MyGlobal.prisma.notifications.create({ data }));
      default:
        throw new Error(`Unsupported ERP persistence model: ${model}`);
    }
  }

  async function find(
    model: string,
    id: string | null,
  ): Promise<PersistedRecord | null> {
    const filter =
      id === null
        ? { organization_id: organizationId }
        : { organization_id: organizationId, id };
    switch (model) {
      case "addresses":
        return (await MyGlobal.prisma.addresses.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "contacts":
        return (await MyGlobal.prisma.contacts.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "attachments":
        return (await MyGlobal.prisma.attachments.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "comments":
        return (await MyGlobal.prisma.comments.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "tags":
        return (await MyGlobal.prisma.tags.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "custom_fields":
        return (await MyGlobal.prisma.custom_fields.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "custom_field_values":
        return (await MyGlobal.prisma.custom_field_values.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "currencies":
        return (await MyGlobal.prisma.currencies.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "exchange_rates":
        return (await MyGlobal.prisma.exchange_rates.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "payment_terms":
        return (await MyGlobal.prisma.payment_terms.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "tax_jurisdictions":
        return (await MyGlobal.prisma.tax_jurisdictions.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "tax_codes":
        return (await MyGlobal.prisma.tax_codes.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "tax_rates":
        return (await MyGlobal.prisma.tax_rates.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "units_of_measure":
        return (await MyGlobal.prisma.units_of_measure.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "document_number_sequences":
        return (await MyGlobal.prisma.document_number_sequences.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "fiscal_calendars":
        return (await MyGlobal.prisma.fiscal_calendars.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "notification_preferences":
        return (await MyGlobal.prisma.notification_preferences.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "ledger_accounts":
        return (await MyGlobal.prisma.ledger_accounts.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "journal_entries":
        return (await MyGlobal.prisma.journal_entries.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "journal_lines":
        return (await MyGlobal.prisma.journal_lines.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "fiscal_periods":
        return (await MyGlobal.prisma.fiscal_periods.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "closing_snapshots":
        return (await MyGlobal.prisma.closing_snapshots.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "bank_accounts":
        return (await MyGlobal.prisma.bank_accounts.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "bank_transactions":
        return (await MyGlobal.prisma.bank_transactions.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "bank_reconciliations":
        return (await MyGlobal.prisma.bank_reconciliations.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "tax_returns":
        return (await MyGlobal.prisma.tax_returns.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "vendors":
        return (await MyGlobal.prisma.vendors.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "purchase_requests":
        return (await MyGlobal.prisma.purchase_requests.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "purchase_request_lines":
        return (await MyGlobal.prisma.purchase_request_lines.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "purchase_orders":
        return (await MyGlobal.prisma.purchase_orders.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "purchase_order_lines":
        return (await MyGlobal.prisma.purchase_order_lines.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "purchase_receipts":
        return (await MyGlobal.prisma.purchase_receipts.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "purchase_receipt_lines":
        return (await MyGlobal.prisma.purchase_receipt_lines.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "purchase_returns":
        return (await MyGlobal.prisma.purchase_returns.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "purchase_return_lines":
        return (await MyGlobal.prisma.purchase_return_lines.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "vendor_bills":
        return (await MyGlobal.prisma.vendor_bills.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "vendor_bill_lines":
        return (await MyGlobal.prisma.vendor_bill_lines.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "vendor_payments":
        return (await MyGlobal.prisma.vendor_payments.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "vendor_payment_allocations":
        return (await MyGlobal.prisma.vendor_payment_allocations.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "vendor_credits":
        return (await MyGlobal.prisma.vendor_credits.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "items":
        return (await MyGlobal.prisma.items.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "warehouses":
        return (await MyGlobal.prisma.warehouses.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "storage_locations":
        return (await MyGlobal.prisma.storage_locations.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "stock_movements":
        return (await MyGlobal.prisma.stock_movements.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "inventory_lots":
        return (await MyGlobal.prisma.inventory_lots.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "item_serials":
        return (await MyGlobal.prisma.item_serials.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "warehouse_transfers":
        return (await MyGlobal.prisma.warehouse_transfers.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "cycle_counts":
        return (await MyGlobal.prisma.cycle_counts.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "inventory_adjustments":
        return (await MyGlobal.prisma.inventory_adjustments.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "customers":
        return (await MyGlobal.prisma.customers.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "sales_prices":
        return (await MyGlobal.prisma.sales_prices.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "sales_quotes":
        return (await MyGlobal.prisma.sales_quotes.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "sales_quote_lines":
        return (await MyGlobal.prisma.sales_quote_lines.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "sales_orders":
        return (await MyGlobal.prisma.sales_orders.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "sales_order_lines":
        return (await MyGlobal.prisma.sales_order_lines.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "stock_allocations":
        return (await MyGlobal.prisma.stock_allocations.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "shipments":
        return (await MyGlobal.prisma.shipments.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "shipment_lines":
        return (await MyGlobal.prisma.shipment_lines.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "sales_invoices":
        return (await MyGlobal.prisma.sales_invoices.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "sales_invoice_lines":
        return (await MyGlobal.prisma.sales_invoice_lines.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "customer_payments":
        return (await MyGlobal.prisma.customer_payments.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "sales_returns":
        return (await MyGlobal.prisma.sales_returns.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "sales_return_lines":
        return (await MyGlobal.prisma.sales_return_lines.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "credit_memos":
        return (await MyGlobal.prisma.credit_memos.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "employees":
        return (await MyGlobal.prisma.employees.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "departments":
        return (await MyGlobal.prisma.departments.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "employment_contracts":
        return (await MyGlobal.prisma.employment_contracts.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "projects":
        return (await MyGlobal.prisma.projects.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "project_members":
        return (await MyGlobal.prisma.project_members.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "tasks":
        return (await MyGlobal.prisma.tasks.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "timelogs":
        return (await MyGlobal.prisma.timelogs.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "timesheets":
        return (await MyGlobal.prisma.timesheets.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "payroll_configurations":
        return (await MyGlobal.prisma.payroll_configurations.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "pay_schedules":
        return (await MyGlobal.prisma.pay_schedules.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "payroll_runs":
        return (await MyGlobal.prisma.payroll_runs.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "payslips":
        return (await MyGlobal.prisma.payslips.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "budgets":
        return (await MyGlobal.prisma.budgets.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "cost_centers":
        return (await MyGlobal.prisma.cost_centers.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "profit_centers":
        return (await MyGlobal.prisma.profit_centers.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "allocation_rules":
        return (await MyGlobal.prisma.allocation_rules.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "asset_categories":
        return (await MyGlobal.prisma.asset_categories.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "fixed_assets":
        return (await MyGlobal.prisma.fixed_assets.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "depreciation_schedules":
        return (await MyGlobal.prisma.depreciation_schedules.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "depreciation_runs":
        return (await MyGlobal.prisma.depreciation_runs.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "asset_transfers":
        return (await MyGlobal.prisma.asset_transfers.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "asset_impairments":
        return (await MyGlobal.prisma.asset_impairments.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "asset_disposals":
        return (await MyGlobal.prisma.asset_disposals.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "bill_of_materials":
        return (await MyGlobal.prisma.bill_of_materials.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "bom_versions":
        return (await MyGlobal.prisma.bom_versions.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "routing_versions":
        return (await MyGlobal.prisma.routing_versions.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "routing_operations":
        return (await MyGlobal.prisma.routing_operations.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "work_centers":
        return (await MyGlobal.prisma.work_centers.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "machines":
        return (await MyGlobal.prisma.machines.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "mrp_runs":
        return (await MyGlobal.prisma.mrp_runs.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "mrp_recommendations":
        return (await MyGlobal.prisma.mrp_recommendations.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "production_orders":
        return (await MyGlobal.prisma.production_orders.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "production_order_operations":
        return (await MyGlobal.prisma.production_order_operations.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "inspection_plans":
        return (await MyGlobal.prisma.inspection_plans.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "inspection_orders":
        return (await MyGlobal.prisma.inspection_orders.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "stock_quarantines":
        return (await MyGlobal.prisma.stock_quarantines.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "quality_dispositions":
        return (await MyGlobal.prisma.quality_dispositions.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "equipment":
        return (await MyGlobal.prisma.equipment.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "maintenance_plans":
        return (await MyGlobal.prisma.maintenance_plans.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "maintenance_orders":
        return (await MyGlobal.prisma.maintenance_orders.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "service_cases":
        return (await MyGlobal.prisma.service_cases.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "service_orders":
        return (await MyGlobal.prisma.service_orders.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "approval_workflows":
        return (await MyGlobal.prisma.approval_workflows.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "approval_requests":
        return (await MyGlobal.prisma.approval_requests.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "audit_events":
        return (await MyGlobal.prisma.audit_events.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      case "notifications":
        return (await MyGlobal.prisma.notifications.findFirst({
          where: filter,
          orderBy: { created_at: "desc" },
        })) as PersistedRecord | null;
      default:
        throw new Error(`Unsupported ERP lookup model: ${model}`);
    }
  }

  async function update(
    model: string,
    id: string,
    input: IErpRequest,
    attributes?: Record<string, unknown>,
  ): Promise<IErpRecord> {
    const data: UpdateData = {
      name: input.name,
      status: input.status,
      description: input.description,
      reference_id: input.referenceId,
      quantity: input.quantity,
      amount: input.amount,
      updated_at: new Date(),
      deleted_at:
        input.status === "inactive" || input.status === "deleted"
          ? new Date()
          : undefined,
      attributes: serializeAttributes(attributes ?? input.attributes),
    };
    switch (model) {
      case "addresses":
        return toRecord(
          (await MyGlobal.prisma.addresses.update({ where: { id }, data })) as PersistedRecord,
        );
      case "contacts":
        return toRecord(
          (await MyGlobal.prisma.contacts.update({ where: { id }, data })) as PersistedRecord,
        );
      case "attachments":
        return toRecord(
          (await MyGlobal.prisma.attachments.update({ where: { id }, data })) as PersistedRecord,
        );
      case "comments":
        return toRecord(
          (await MyGlobal.prisma.comments.update({ where: { id }, data })) as PersistedRecord,
        );
      case "tags":
        return toRecord(
          (await MyGlobal.prisma.tags.update({ where: { id }, data })) as PersistedRecord,
        );
      case "custom_fields":
        return toRecord(
          (await MyGlobal.prisma.custom_fields.update({ where: { id }, data })) as PersistedRecord,
        );
      case "custom_field_values":
        return toRecord(
          (await MyGlobal.prisma.custom_field_values.update({ where: { id }, data })) as PersistedRecord,
        );
      case "currencies":
        return toRecord(
          (await MyGlobal.prisma.currencies.update({ where: { id }, data })) as PersistedRecord,
        );
      case "exchange_rates":
        return toRecord(
          (await MyGlobal.prisma.exchange_rates.update({ where: { id }, data })) as PersistedRecord,
        );
      case "payment_terms":
        return toRecord(
          (await MyGlobal.prisma.payment_terms.update({ where: { id }, data })) as PersistedRecord,
        );
      case "tax_jurisdictions":
        return toRecord(
          (await MyGlobal.prisma.tax_jurisdictions.update({ where: { id }, data })) as PersistedRecord,
        );
      case "tax_codes":
        return toRecord(
          (await MyGlobal.prisma.tax_codes.update({ where: { id }, data })) as PersistedRecord,
        );
      case "tax_rates":
        return toRecord(
          (await MyGlobal.prisma.tax_rates.update({ where: { id }, data })) as PersistedRecord,
        );
      case "units_of_measure":
        return toRecord(
          (await MyGlobal.prisma.units_of_measure.update({ where: { id }, data })) as PersistedRecord,
        );
      case "document_number_sequences":
        return toRecord(
          (await MyGlobal.prisma.document_number_sequences.update({ where: { id }, data })) as PersistedRecord,
        );
      case "fiscal_calendars":
        return toRecord(
          (await MyGlobal.prisma.fiscal_calendars.update({ where: { id }, data })) as PersistedRecord,
        );
      case "notification_preferences":
        return toRecord(
          (await MyGlobal.prisma.notification_preferences.update({ where: { id }, data })) as PersistedRecord,
        );
      case "ledger_accounts":
        return toRecord(
          (await MyGlobal.prisma.ledger_accounts.update({ where: { id }, data })) as PersistedRecord,
        );
      case "journal_entries":
        return toRecord(
          (await MyGlobal.prisma.journal_entries.update({ where: { id }, data })) as PersistedRecord,
        );
      case "journal_lines":
        return toRecord(
          (await MyGlobal.prisma.journal_lines.update({ where: { id }, data })) as PersistedRecord,
        );
      case "fiscal_periods":
        return toRecord(
          (await MyGlobal.prisma.fiscal_periods.update({ where: { id }, data })) as PersistedRecord,
        );
      case "closing_snapshots":
        return toRecord(
          (await MyGlobal.prisma.closing_snapshots.update({ where: { id }, data })) as PersistedRecord,
        );
      case "bank_accounts":
        return toRecord(
          (await MyGlobal.prisma.bank_accounts.update({ where: { id }, data })) as PersistedRecord,
        );
      case "bank_transactions":
        return toRecord(
          (await MyGlobal.prisma.bank_transactions.update({ where: { id }, data })) as PersistedRecord,
        );
      case "bank_reconciliations":
        return toRecord(
          (await MyGlobal.prisma.bank_reconciliations.update({ where: { id }, data })) as PersistedRecord,
        );
      case "tax_returns":
        return toRecord(
          (await MyGlobal.prisma.tax_returns.update({ where: { id }, data })) as PersistedRecord,
        );
      case "vendors":
        return toRecord(
          (await MyGlobal.prisma.vendors.update({ where: { id }, data })) as PersistedRecord,
        );
      case "purchase_requests":
        return toRecord(
          (await MyGlobal.prisma.purchase_requests.update({ where: { id }, data })) as PersistedRecord,
        );
      case "purchase_request_lines":
        return toRecord(
          (await MyGlobal.prisma.purchase_request_lines.update({ where: { id }, data })) as PersistedRecord,
        );
      case "purchase_orders":
        return toRecord(
          (await MyGlobal.prisma.purchase_orders.update({ where: { id }, data })) as PersistedRecord,
        );
      case "purchase_order_lines":
        return toRecord(
          (await MyGlobal.prisma.purchase_order_lines.update({ where: { id }, data })) as PersistedRecord,
        );
      case "purchase_receipts":
        return toRecord(
          (await MyGlobal.prisma.purchase_receipts.update({ where: { id }, data })) as PersistedRecord,
        );
      case "purchase_receipt_lines":
        return toRecord(
          (await MyGlobal.prisma.purchase_receipt_lines.update({ where: { id }, data })) as PersistedRecord,
        );
      case "purchase_returns":
        return toRecord(
          (await MyGlobal.prisma.purchase_returns.update({ where: { id }, data })) as PersistedRecord,
        );
      case "purchase_return_lines":
        return toRecord(
          (await MyGlobal.prisma.purchase_return_lines.update({ where: { id }, data })) as PersistedRecord,
        );
      case "vendor_bills":
        return toRecord(
          (await MyGlobal.prisma.vendor_bills.update({ where: { id }, data })) as PersistedRecord,
        );
      case "vendor_bill_lines":
        return toRecord(
          (await MyGlobal.prisma.vendor_bill_lines.update({ where: { id }, data })) as PersistedRecord,
        );
      case "vendor_payments":
        return toRecord(
          (await MyGlobal.prisma.vendor_payments.update({ where: { id }, data })) as PersistedRecord,
        );
      case "vendor_payment_allocations":
        return toRecord(
          (await MyGlobal.prisma.vendor_payment_allocations.update({ where: { id }, data })) as PersistedRecord,
        );
      case "vendor_credits":
        return toRecord(
          (await MyGlobal.prisma.vendor_credits.update({ where: { id }, data })) as PersistedRecord,
        );
      case "items":
        return toRecord(
          (await MyGlobal.prisma.items.update({ where: { id }, data })) as PersistedRecord,
        );
      case "warehouses":
        return toRecord(
          (await MyGlobal.prisma.warehouses.update({ where: { id }, data })) as PersistedRecord,
        );
      case "storage_locations":
        return toRecord(
          (await MyGlobal.prisma.storage_locations.update({ where: { id }, data })) as PersistedRecord,
        );
      case "stock_movements":
        return toRecord(
          (await MyGlobal.prisma.stock_movements.update({ where: { id }, data })) as PersistedRecord,
        );
      case "inventory_lots":
        return toRecord(
          (await MyGlobal.prisma.inventory_lots.update({ where: { id }, data })) as PersistedRecord,
        );
      case "item_serials":
        return toRecord(
          (await MyGlobal.prisma.item_serials.update({ where: { id }, data })) as PersistedRecord,
        );
      case "warehouse_transfers":
        return toRecord(
          (await MyGlobal.prisma.warehouse_transfers.update({ where: { id }, data })) as PersistedRecord,
        );
      case "cycle_counts":
        return toRecord(
          (await MyGlobal.prisma.cycle_counts.update({ where: { id }, data })) as PersistedRecord,
        );
      case "inventory_adjustments":
        return toRecord(
          (await MyGlobal.prisma.inventory_adjustments.update({ where: { id }, data })) as PersistedRecord,
        );
      case "customers":
        return toRecord(
          (await MyGlobal.prisma.customers.update({ where: { id }, data })) as PersistedRecord,
        );
      case "sales_prices":
        return toRecord(
          (await MyGlobal.prisma.sales_prices.update({ where: { id }, data })) as PersistedRecord,
        );
      case "sales_quotes":
        return toRecord(
          (await MyGlobal.prisma.sales_quotes.update({ where: { id }, data })) as PersistedRecord,
        );
      case "sales_quote_lines":
        return toRecord(
          (await MyGlobal.prisma.sales_quote_lines.update({ where: { id }, data })) as PersistedRecord,
        );
      case "sales_orders":
        return toRecord(
          (await MyGlobal.prisma.sales_orders.update({ where: { id }, data })) as PersistedRecord,
        );
      case "sales_order_lines":
        return toRecord(
          (await MyGlobal.prisma.sales_order_lines.update({ where: { id }, data })) as PersistedRecord,
        );
      case "stock_allocations":
        return toRecord(
          (await MyGlobal.prisma.stock_allocations.update({ where: { id }, data })) as PersistedRecord,
        );
      case "shipments":
        return toRecord(
          (await MyGlobal.prisma.shipments.update({ where: { id }, data })) as PersistedRecord,
        );
      case "shipment_lines":
        return toRecord(
          (await MyGlobal.prisma.shipment_lines.update({ where: { id }, data })) as PersistedRecord,
        );
      case "sales_invoices":
        return toRecord(
          (await MyGlobal.prisma.sales_invoices.update({ where: { id }, data })) as PersistedRecord,
        );
      case "sales_invoice_lines":
        return toRecord(
          (await MyGlobal.prisma.sales_invoice_lines.update({ where: { id }, data })) as PersistedRecord,
        );
      case "customer_payments":
        return toRecord(
          (await MyGlobal.prisma.customer_payments.update({ where: { id }, data })) as PersistedRecord,
        );
      case "sales_returns":
        return toRecord(
          (await MyGlobal.prisma.sales_returns.update({ where: { id }, data })) as PersistedRecord,
        );
      case "sales_return_lines":
        return toRecord(
          (await MyGlobal.prisma.sales_return_lines.update({ where: { id }, data })) as PersistedRecord,
        );
      case "credit_memos":
        return toRecord(
          (await MyGlobal.prisma.credit_memos.update({ where: { id }, data })) as PersistedRecord,
        );
      case "employees":
        return toRecord(
          (await MyGlobal.prisma.employees.update({ where: { id }, data })) as PersistedRecord,
        );
      case "departments":
        return toRecord(
          (await MyGlobal.prisma.departments.update({ where: { id }, data })) as PersistedRecord,
        );
      case "employment_contracts":
        return toRecord(
          (await MyGlobal.prisma.employment_contracts.update({ where: { id }, data })) as PersistedRecord,
        );
      case "projects":
        return toRecord(
          (await MyGlobal.prisma.projects.update({ where: { id }, data })) as PersistedRecord,
        );
      case "project_members":
        return toRecord(
          (await MyGlobal.prisma.project_members.update({ where: { id }, data })) as PersistedRecord,
        );
      case "tasks":
        return toRecord(
          (await MyGlobal.prisma.tasks.update({ where: { id }, data })) as PersistedRecord,
        );
      case "timelogs":
        return toRecord(
          (await MyGlobal.prisma.timelogs.update({ where: { id }, data })) as PersistedRecord,
        );
      case "timesheets":
        return toRecord(
          (await MyGlobal.prisma.timesheets.update({ where: { id }, data })) as PersistedRecord,
        );
      case "payroll_configurations":
        return toRecord(
          (await MyGlobal.prisma.payroll_configurations.update({ where: { id }, data })) as PersistedRecord,
        );
      case "pay_schedules":
        return toRecord(
          (await MyGlobal.prisma.pay_schedules.update({ where: { id }, data })) as PersistedRecord,
        );
      case "payroll_runs":
        return toRecord(
          (await MyGlobal.prisma.payroll_runs.update({ where: { id }, data })) as PersistedRecord,
        );
      case "payslips":
        return toRecord(
          (await MyGlobal.prisma.payslips.update({ where: { id }, data })) as PersistedRecord,
        );
      case "budgets":
        return toRecord(
          (await MyGlobal.prisma.budgets.update({ where: { id }, data })) as PersistedRecord,
        );
      case "cost_centers":
        return toRecord(
          (await MyGlobal.prisma.cost_centers.update({ where: { id }, data })) as PersistedRecord,
        );
      case "profit_centers":
        return toRecord(
          (await MyGlobal.prisma.profit_centers.update({ where: { id }, data })) as PersistedRecord,
        );
      case "allocation_rules":
        return toRecord(
          (await MyGlobal.prisma.allocation_rules.update({ where: { id }, data })) as PersistedRecord,
        );
      case "asset_categories":
        return toRecord(
          (await MyGlobal.prisma.asset_categories.update({ where: { id }, data })) as PersistedRecord,
        );
      case "fixed_assets":
        return toRecord(
          (await MyGlobal.prisma.fixed_assets.update({ where: { id }, data })) as PersistedRecord,
        );
      case "depreciation_schedules":
        return toRecord(
          (await MyGlobal.prisma.depreciation_schedules.update({ where: { id }, data })) as PersistedRecord,
        );
      case "depreciation_runs":
        return toRecord(
          (await MyGlobal.prisma.depreciation_runs.update({ where: { id }, data })) as PersistedRecord,
        );
      case "asset_transfers":
        return toRecord(
          (await MyGlobal.prisma.asset_transfers.update({ where: { id }, data })) as PersistedRecord,
        );
      case "asset_impairments":
        return toRecord(
          (await MyGlobal.prisma.asset_impairments.update({ where: { id }, data })) as PersistedRecord,
        );
      case "asset_disposals":
        return toRecord(
          (await MyGlobal.prisma.asset_disposals.update({ where: { id }, data })) as PersistedRecord,
        );
      case "bill_of_materials":
        return toRecord(
          (await MyGlobal.prisma.bill_of_materials.update({ where: { id }, data })) as PersistedRecord,
        );
      case "bom_versions":
        return toRecord(
          (await MyGlobal.prisma.bom_versions.update({ where: { id }, data })) as PersistedRecord,
        );
      case "routing_versions":
        return toRecord(
          (await MyGlobal.prisma.routing_versions.update({ where: { id }, data })) as PersistedRecord,
        );
      case "routing_operations":
        return toRecord(
          (await MyGlobal.prisma.routing_operations.update({ where: { id }, data })) as PersistedRecord,
        );
      case "work_centers":
        return toRecord(
          (await MyGlobal.prisma.work_centers.update({ where: { id }, data })) as PersistedRecord,
        );
      case "machines":
        return toRecord(
          (await MyGlobal.prisma.machines.update({ where: { id }, data })) as PersistedRecord,
        );
      case "mrp_runs":
        return toRecord(
          (await MyGlobal.prisma.mrp_runs.update({ where: { id }, data })) as PersistedRecord,
        );
      case "mrp_recommendations":
        return toRecord(
          (await MyGlobal.prisma.mrp_recommendations.update({ where: { id }, data })) as PersistedRecord,
        );
      case "production_orders":
        return toRecord(
          (await MyGlobal.prisma.production_orders.update({ where: { id }, data })) as PersistedRecord,
        );
      case "production_order_operations":
        return toRecord(
          (await MyGlobal.prisma.production_order_operations.update({ where: { id }, data })) as PersistedRecord,
        );
      case "inspection_plans":
        return toRecord(
          (await MyGlobal.prisma.inspection_plans.update({ where: { id }, data })) as PersistedRecord,
        );
      case "inspection_orders":
        return toRecord(
          (await MyGlobal.prisma.inspection_orders.update({ where: { id }, data })) as PersistedRecord,
        );
      case "stock_quarantines":
        return toRecord(
          (await MyGlobal.prisma.stock_quarantines.update({ where: { id }, data })) as PersistedRecord,
        );
      case "quality_dispositions":
        return toRecord(
          (await MyGlobal.prisma.quality_dispositions.update({ where: { id }, data })) as PersistedRecord,
        );
      case "equipment":
        return toRecord(
          (await MyGlobal.prisma.equipment.update({ where: { id }, data })) as PersistedRecord,
        );
      case "maintenance_plans":
        return toRecord(
          (await MyGlobal.prisma.maintenance_plans.update({ where: { id }, data })) as PersistedRecord,
        );
      case "maintenance_orders":
        return toRecord(
          (await MyGlobal.prisma.maintenance_orders.update({ where: { id }, data })) as PersistedRecord,
        );
      case "service_cases":
        return toRecord(
          (await MyGlobal.prisma.service_cases.update({ where: { id }, data })) as PersistedRecord,
        );
      case "service_orders":
        return toRecord(
          (await MyGlobal.prisma.service_orders.update({ where: { id }, data })) as PersistedRecord,
        );
      case "approval_workflows":
        return toRecord(
          (await MyGlobal.prisma.approval_workflows.update({ where: { id }, data })) as PersistedRecord,
        );
      case "approval_requests":
        return toRecord(
          (await MyGlobal.prisma.approval_requests.update({ where: { id }, data })) as PersistedRecord,
        );
      case "audit_events":
        return toRecord(
          (await MyGlobal.prisma.audit_events.update({ where: { id }, data })) as PersistedRecord,
        );
      case "notifications":
        return toRecord(
          (await MyGlobal.prisma.notifications.update({ where: { id }, data })) as PersistedRecord,
        );
      default:
        throw new Error(`Unsupported ERP update model: ${model}`);
    }
  }

  async function seedStandardAccounts(): Promise<IErpRecord> {
    const labels = ["Asset", "Liability", "Equity", "Revenue", "Expense"];
    let first: IErpRecord | null = null;
    for (const label of labels) {
      const existing = await MyGlobal.prisma.ledger_accounts.findFirst({
        where: { organization_id: organizationId, name: label },
      });
      const record =
        existing === null
          ? await persist("ledger_accounts", {
              id: randomUUID(),
              organization_id: organizationId,
              name: label,
              status: "active",
              description: "Standard account catalog",
              reference_id: null,
              quantity: null,
              amount: null,
              created_at: new Date(),
              updated_at: null,
              deleted_at: null,
              attributes: null,
            })
          : toRecord(existing);
      first ??= record;
    }
    return first as IErpRecord;
  }

  async function recordAudit(
    operation: string,
    targetId: string,
    input?: IErpRequest,
    before?: PersistedRecord | null,
    after?: IErpRecord,
  ): Promise<void> {
    await MyGlobal.prisma.audit_events.create({
      data: {
        id: randomUUID(),
        organization_id: organizationId,
        name: operation,
        status: "retained",
        description: "Durable operation history",
        reference_id: targetId,
        quantity: null,
        amount: null,
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
        attributes: JSON.stringify({
          actorId: input?.attributes?.actorId ?? null,
          action: operation,
          targetId,
          reason: input?.description ?? null,
          before: before?.attributes ?? null,
          after: after?.attributes ?? null,
          automated: input?.attributes?.automated === true,
        }),
      },
    });
  }

  async function buildReport(
    family: string,
    input: IErpRequest,
  ): Promise<IErpRecord> {
    const sourceModel =
      family === "req_fun_report_fin"
        ? "journal_entries"
        : family === "req_fun_report_inv"
          ? "stock_movements"
          : family === "req_fun_report_proc"
            ? "purchase_orders"
            : family === "req_fun_report_sales"
              ? "sales_invoices"
              : family === "req_fun_report_hr"
                ? "payroll_runs"
                : family === "req_fun_report_mfg"
                  ? "production_orders"
                  : "inspection_orders";
    const rows = await listReportRows(sourceModel);
    const posted = rows.filter((row) =>
      ["posted", "approved", "completed", "filed", "closed"].includes(row.status ?? ""),
    );
    const amount = posted.reduce((sum, row) => sum + Number(row.amount?.toString() ?? 0), 0);
    const quantity = posted.reduce((sum, row) => sum + Number(row.quantity?.toString() ?? 0), 0);
    const now = normalizeDate(new Date().toISOString());
    return {
      id: input.id ?? randomUUID(),
      organizationId,
      name: family,
      status: "report",
      description: "Reconciled organization-scoped report result",
      referenceId: input.referenceId ?? null,
      quantity,
      amount,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      attributes: {
        sourceModel,
        sourceRowCount: rows.length,
        postedRowCount: posted.length,
        generatedAt: now,
        filters: input.attributes ?? null,
      },
    };
  }

  async function listReportRows(model: string): Promise<PersistedRecord[]> {
    switch (model) {
      case "journal_entries":
        return (await MyGlobal.prisma.journal_entries.findMany({ where: { organization_id: organizationId } })) as PersistedRecord[];
      case "stock_movements":
        return (await MyGlobal.prisma.stock_movements.findMany({ where: { organization_id: organizationId } })) as PersistedRecord[];
      case "purchase_orders":
        return (await MyGlobal.prisma.purchase_orders.findMany({ where: { organization_id: organizationId } })) as PersistedRecord[];
      case "sales_invoices":
        return (await MyGlobal.prisma.sales_invoices.findMany({ where: { organization_id: organizationId } })) as PersistedRecord[];
      case "payroll_runs":
        return (await MyGlobal.prisma.payroll_runs.findMany({ where: { organization_id: organizationId } })) as PersistedRecord[];
      case "production_orders":
        return (await MyGlobal.prisma.production_orders.findMany({ where: { organization_id: organizationId } })) as PersistedRecord[];
      case "inspection_orders":
        return (await MyGlobal.prisma.inspection_orders.findMany({ where: { organization_id: organizationId } })) as PersistedRecord[];
      default:
        return [];
    }
  }

  function emptyRecord(
    operation: string,
    id: string | null | undefined,
  ): IErpRecord {
    const now = normalizeDate(new Date().toISOString());
    return {
      id: id ?? randomUUID(),
      organizationId,
      name: operation,
      status: "empty",
      description: null,
      referenceId: null,
      quantity: null,
      amount: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      attributes: null,
    };
  }

  function toRecord(row: PersistedRecord): IErpRecord {
    return {
      id: row.id,
      organizationId: row.organization_id,
      name: row.name,
      status: row.status,
      description: row.description,
      referenceId: row.reference_id,
      quantity: row.quantity === null ? null : Number(row.quantity),
      amount: row.amount === null ? null : Number(row.amount),
      createdAt: normalizeDate(row.created_at.toISOString()),
      updatedAt:
        row.updated_at === null
          ? null
          : normalizeDate(row.updated_at.toISOString()),
      deletedAt:
        row.deleted_at === null
          ? null
          : normalizeDate(row.deleted_at.toISOString()),
      attributes: parseAttributes(row.attributes),
    };
  }

  function serializeAttributes(value: Record<string, unknown> | null | undefined): string | null {
    return value === null || value === undefined ? null : JSON.stringify(value);
  }

  function parseAttributes(value: string | null): Record<string, unknown> | null {
    if (value === null) return null;
    try {
      const parsed: unknown = JSON.parse(value);
      return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : null;
    } catch {
      return null;
    }
  }

  function normalizeDate(value: string): string {
    return value.endsWith("Z") ? `${value.slice(0, -1)}+00:00` : value;
  }
}
