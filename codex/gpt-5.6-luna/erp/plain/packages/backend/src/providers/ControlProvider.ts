import type * as api from "@benchmark/erp-api";
import { AuthProvider } from "./AuthProvider";
import type { ErpPayload } from "../decorators/ErpAuth";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Immutable audit reads and organization-scoped report projections. */
export namespace ControlProvider {
  export async function auditIndex(p: { actor: ErpPayload; input: api.IAuditEvent.IRequest }): Promise<api.IPage<api.IAuditEvent>> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    const page = p.input.page ?? 1;
    const limit = p.input.limit || 100;
    const where = { organization_id: organizationId, ...(p.input.actorId ? { actor_id: p.input.actorId } : {}), ...(p.input.action ? { action: { contains: p.input.action } } : {}), ...(p.input.targetType ? { target_type: p.input.targetType } : {}), ...(p.input.targetId ? { target_id: p.input.targetId } : {}), ...(p.input.risk ? { risk: p.input.risk } : {}) };
    const [records, rows] = await Promise.all([MyGlobal.prisma.audit_events.count({ where }), MyGlobal.prisma.audit_events.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { created_at: "desc" } })]);
    return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(audit) };
  }

  export async function auditAt(p: { actor: ErpPayload; id: string }): Promise<api.IAuditEvent> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    const row = await MyGlobal.prisma.audit_events.findFirst({ where: { id: p.id, organization_id: organizationId } });
    if (row === null) throw ErrorUtil.notFound("No audit event exists in the active organization.");
    return audit(row);
  }

  export async function report(p: { actor: ErpPayload; input: api.IReport.IRequest }): Promise<api.IReport> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    const reportRoles: Record<string, readonly string[]> = {
      trial_balance: ["Owner", "Finance Manager"], balance_sheet: ["Owner", "Finance Manager"], profit_loss: ["Owner", "Finance Manager"], general_ledger: ["Owner", "Finance Manager"], ar_aging: ["Owner", "Finance Manager", "Sales Manager"], ap_aging: ["Owner", "Finance Manager", "Procurement Manager"], cash_flow: ["Owner", "Finance Manager"], tax_summary: ["Owner", "Finance Manager"], budget_actual: ["Owner", "Finance Manager"],
      purchase_order_status: ["Owner", "Procurement Manager"], vendor_spend: ["Owner", "Procurement Manager", "Finance Manager"], three_way_match: ["Owner", "Procurement Manager", "Finance Manager"], receipts_unbilled: ["Owner", "Procurement Manager"],
      inventory: ["Owner", "Warehouse Manager"], stock_on_hand: ["Owner", "Warehouse Manager"], inventory_valuation: ["Owner", "Warehouse Manager", "Finance Manager"], movement_history: ["Owner", "Warehouse Manager"], slow_moving: ["Owner", "Warehouse Manager"], negative_stock: ["Owner", "Warehouse Manager"], lot_traceability: ["Owner", "Warehouse Manager"],
      sales_summary: ["Owner", "Sales Manager"], sales_backlog: ["Owner", "Sales Manager"], sales_by_customer_item: ["Owner", "Sales Manager"], shipments_uninvoiced: ["Owner", "Sales Manager"], customer_credit_exposure: ["Owner", "Sales Manager", "Finance Manager"],
      headcount: ["Owner", "HR Manager"], contract_history: ["Owner", "HR Manager"], timesheet_status: ["Owner", "HR Manager"], payroll_register: ["Owner", "HR Manager", "Finance Manager"], payslip_history: ["Owner", "HR Manager", "Finance Manager"],
      mrp_recommendations: ["Owner", "Production Manager"], production_order_status: ["Owner", "Production Manager"], material_shortage: ["Owner", "Production Manager"], production_variance: ["Owner", "Production Manager", "Finance Manager"], work_center_utilization: ["Owner", "Production Manager"],
      inspection_failures: ["Owner", "Quality Manager"], quarantined_stock: ["Owner", "Quality Manager", "Warehouse Manager"], maintenance_backlog: ["Owner", "Production Manager"], equipment_downtime: ["Owner", "Production Manager"], service_case_sla: ["Owner", "Sales Manager"], warranty_cost: ["Owner", "Finance Manager", "Sales Manager"],
    };
    await AuthProvider.requireAnyRole(p.actor, reportRoles[p.input.kind] ?? ["Owner"], "The active roles do not authorize this report.");

    const period = p.input.fiscalPeriodId === undefined || p.input.fiscalPeriodId === null
      ? null
      : await MyGlobal.prisma.fiscal_periods.findFirst({ where: { id: p.input.fiscalPeriodId, organization_id: organizationId } });
    if (p.input.fiscalPeriodId !== undefined && p.input.fiscalPeriodId !== null && period === null)
      throw ErrorUtil.notFound("No fiscal period exists in the active organization.");

    const filters = JSON.stringify(p.input);
    const snapshotName = snapshotKind(p.input.kind);
    if (period?.status === "hard_closed" && snapshotName !== null) {
      const snapshot = await MyGlobal.prisma.closing_snapshots.findFirst({ where: { organization_id: organizationId, period_id: period.id, close_cycle: period.close_cycle, kind: snapshotName } });
      if (snapshot === null) throw ErrorUtil.notFound("No closing snapshot exists for this report kind.");
      const payload = JSON.parse(snapshot.payload) as { rows?: Array<{ label: string; value: number }>; debit?: number; credit?: number; journalCount?: number };
      return result(p.input.kind, organizationId, filters, payload.rows ?? [{ label: "posted_debits", value: payload.debit ?? 0 }, { label: "posted_credits", value: payload.credit ?? 0 }, { label: "journal_count", value: payload.journalCount ?? 0 }]);
    }

    let from = p.input.from ? new Date(p.input.from) : undefined;
    let to = p.input.to ? new Date(p.input.to) : undefined;
    if (period !== null) {
      from = from === undefined || from < period.starts_at ? period.starts_at : from;
      to = to === undefined || to > period.ends_at ? period.ends_at : to;
    }
    const dates = from || to ? { created_at: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {};

    if (p.input.kind === "ar_aging" || p.input.kind === "ap_aging") {
      if (p.input.kind === "ar_aging") {
        const invoices = await MyGlobal.prisma.sales_invoices.findMany({ where: { organization_id: organizationId, status: { in: ["posted", "sent", "partial", "overdue"] }, ...(p.input.customerId ? { customer_id: p.input.customerId } : {}), ...(p.input.currency ? { currency: p.input.currency } : {}), ...dates }, select: { id: true, total: true } });
        const allocations = invoices.length === 0 ? [] : await MyGlobal.prisma.payment_allocations.findMany({ where: { organization_id: organizationId, invoice_id: { in: invoices.map((invoice) => invoice.id) } }, select: { invoice_id: true, amount: true } });
        return result(p.input.kind, organizationId, filters, agingRows(invoices, allocations, "invoice_id", "invoice_count"));
      }
      const bills = await MyGlobal.prisma.vendor_bills.findMany({ where: { organization_id: organizationId, status: { in: ["posted", "partial", "disputed"] }, ...(p.input.vendorId ? { vendor_id: p.input.vendorId } : {}), ...(p.input.currency ? { currency: p.input.currency } : {}), ...dates }, select: { id: true, total: true } });
      const allocations = bills.length === 0 ? [] : await MyGlobal.prisma.payment_allocations.findMany({ where: { organization_id: organizationId, bill_id: { in: bills.map((bill) => bill.id) } }, select: { bill_id: true, amount: true } });
      return result(p.input.kind, organizationId, filters, agingRows(bills, allocations, "bill_id", "bill_count"));
    }

    if (["inventory", "stock_on_hand", "inventory_valuation", "movement_history", "slow_moving", "negative_stock", "lot_traceability"].includes(p.input.kind)) {
      const movementWhere = { organization_id: organizationId, ...(p.input.itemId ? { item_id: p.input.itemId } : {}), ...(p.input.warehouseId ? { warehouse_id: p.input.warehouseId } : {}) };
      const movementRows = await MyGlobal.prisma.stock_movements.findMany({ where: { ...movementWhere, ...dates }, select: { item_id: true, warehouse_id: true, location_id: true, lot_id: true, serial_code: true, type: true, quantity: true, unit_cost: true, source_type: true, source_id: true, operator_membership_id: true, created_at: true } });
      const asOfRows = await MyGlobal.prisma.stock_movements.findMany({ where: { ...movementWhere, ...(to ? { created_at: { lte: to } } : {}) }, select: { item_id: true, warehouse_id: true, location_id: true, lot_id: true, serial_code: true, quantity: true, unit_cost: true, created_at: true } });
      const quantity = asOfRows.reduce((sum, row) => sum + row.quantity, 0);
      const value = asOfRows.reduce((sum, row) => sum + row.quantity * row.unit_cost, 0);
      if (p.input.kind === "movement_history") {
        return result(p.input.kind, organizationId, filters, [
          { label: "movement_count", value: movementRows.length },
          ...movementRows.map((row) => ({ label: `movement:${row.type}:${row.item_id}:${row.warehouse_id}:${row.location_id}:${row.lot_id ?? row.serial_code ?? "untracked"}:${row.source_type}:${row.source_id}:${row.operator_membership_id ?? "system"}:${row.created_at.toISOString()}`, value: row.quantity })),
        ]);
      }
      if (p.input.kind === "slow_moving") {
        const slowTo = to ?? new Date();
        const slowFrom = from ?? new Date(slowTo.getTime() - 90 * 24 * 60 * 60 * 1000);
        const recentMovementRows = await MyGlobal.prisma.stock_movements.findMany({ where: { ...movementWhere, created_at: { gte: slowFrom, lte: slowTo } }, select: { item_id: true, warehouse_id: true, location_id: true, lot_id: true, serial_code: true } });
        const movedKeys = new Set(recentMovementRows.map((row) => `${row.item_id}:${row.warehouse_id}:${row.location_id}:${row.lot_id ?? row.serial_code ?? "untracked"}`));
        const balances = new Map<string, number>();
        for (const row of asOfRows) { const key = `${row.item_id}:${row.warehouse_id}:${row.location_id}:${row.lot_id ?? row.serial_code ?? "untracked"}`; balances.set(key, (balances.get(key) ?? 0) + row.quantity); }
        const slow = [...balances.entries()].filter(([key, balance]) => balance > 0 && !movedKeys.has(key));
        return result(p.input.kind, organizationId, filters, [{ label: "slow_moving_items", value: slow.length }, ...slow.map(([label, balance]) => ({ label: `slow_moving:${label}`, value: balance }))]);
      }
      if (p.input.kind === "negative_stock") {
        const byLocation = new Map<string, number>();
        for (const row of asOfRows) { const key = `${row.item_id}:${row.warehouse_id}:${row.location_id}`; byLocation.set(key, (byLocation.get(key) ?? 0) + row.quantity); }
        const negative = [...byLocation.entries()].filter(([, balance]) => balance < 0);
        return result(p.input.kind, organizationId, filters, [{ label: "negative_stock_locations", value: negative.length }, ...negative.map(([label, balance]) => ({ label: `negative_stock:${label}`, value: balance }))]);
      }
      if (p.input.kind === "lot_traceability") {
        return result(p.input.kind, organizationId, filters, movementRows.map((row) => ({ label: `trace:${row.item_id}:${row.warehouse_id}:${row.location_id}:${row.lot_id !== null ? `lot:${row.lot_id}` : row.serial_code !== null ? `serial:${row.serial_code}` : "untracked"}:${row.type}:${row.source_type}:${row.source_id}:${row.created_at.toISOString()}`, value: row.quantity })));
      }
      return result(p.input.kind, organizationId, filters, [{ label: "stock_on_hand", value: quantity }, { label: "inventory_value", value }]);
    }

    if (["sales_summary", "sales_backlog", "sales_by_customer_item", "shipments_uninvoiced", "customer_credit_exposure"].includes(p.input.kind)) {
      const orders = await MyGlobal.prisma.sales_orders.findMany({ where: { organization_id: organizationId, ...(p.input.customerId ? { customer_id: p.input.customerId } : {}), ...(p.input.currency ? { currency: p.input.currency } : {}), ...(p.input.documentStatus ? { status: p.input.documentStatus } : { status: { notIn: ["draft", "cancelled"] } }), ...dates }, select: { id: true, customer_id: true, credit_exposure: true, status: true } });
      const orderById = new Map(orders.map((order) => [order.id, order]));
      const lines = await MyGlobal.prisma.sales_order_lines.findMany({ where: { order_id: { in: orders.map((row) => row.id) }, ...(p.input.itemId ? { item_id: p.input.itemId } : {}) }, select: { id: true, order_id: true, item_id: true, ordered_quantity: true, shipped_quantity: true, invoiced_quantity: true, unit_price: true } });
      if (p.input.kind === "sales_summary") return result(p.input.kind, organizationId, filters, [{ label: "sales_order_count", value: orders.length }, { label: "sales_order_value", value: lines.reduce((sum, row) => sum + row.ordered_quantity * row.unit_price, 0) }]);
      if (p.input.kind === "sales_backlog") return result(p.input.kind, organizationId, filters, [{ label: "sales_backlog_orders", value: orders.filter((order) => order.status !== "closed" && order.status !== "cancelled").length }, { label: "sales_backlog_quantity", value: lines.reduce((sum, row) => sum + Math.max(0, row.ordered_quantity - row.shipped_quantity), 0) }, { label: "sales_backlog_value", value: lines.reduce((sum, row) => sum + Math.max(0, row.ordered_quantity - row.shipped_quantity) * row.unit_price, 0) }]);
      if (p.input.kind === "sales_by_customer_item") {
        const grouped = new Map<string, number>();
        for (const line of lines) { const order = orderById.get(line.order_id); if (order !== undefined) { const key = `${order.customer_id}:${line.item_id}`; grouped.set(key, (grouped.get(key) ?? 0) + line.ordered_quantity * line.unit_price); } }
        return result(p.input.kind, organizationId, filters, [...grouped.entries()].map(([label, value]) => ({ label: `customer_item:${label}`, value })));
      }
      if (p.input.kind === "customer_credit_exposure") return result(p.input.kind, organizationId, filters, [{ label: "customer_credit_exposure", value: orders.reduce((sum, order) => sum + order.credit_exposure, 0) }, { label: "customer_order_count", value: orders.length }]);
      const shipments = await MyGlobal.prisma.shipments.findMany({ where: { organization_id: organizationId, order_id: { in: orders.map((order) => order.id) }, status: p.input.documentStatus ? p.input.documentStatus : { in: ["shipped", "delivered"] }, ...dates }, select: { id: true } });
      const shipmentLines = await MyGlobal.prisma.shipment_lines.findMany({ where: { shipment_id: { in: shipments.map((shipment) => shipment.id) }, ...(p.input.itemId ? { item_id: p.input.itemId } : {}) }, select: { order_line_id: true, quantity: true } });
      const sourceLineIds = [...new Set(shipmentLines.map((line) => line.order_line_id))];
      const sourceLines = sourceLineIds.length === 0 ? [] : await MyGlobal.prisma.sales_order_lines.findMany({ where: { id: { in: sourceLineIds } }, select: { id: true, invoiced_quantity: true } });
      const invoicedByLine = new Map(sourceLines.map((line) => [line.id, line.invoiced_quantity]));
      return result(p.input.kind, organizationId, filters, [{ label: "shipment_count", value: shipments.length }, { label: "uninvoiced_quantity", value: shipmentLines.reduce((sum, line) => sum + Math.max(0, line.quantity - (invoicedByLine.get(line.order_line_id) ?? 0)), 0) }]);
    }

    if (["purchase_order_status", "vendor_spend", "three_way_match", "receipts_unbilled"].includes(p.input.kind)) {
      const orders = await MyGlobal.prisma.purchase_orders.findMany({ where: { organization_id: organizationId, ...(p.input.vendorId ? { vendor_id: p.input.vendorId } : {}), ...(p.input.currency ? { currency: p.input.currency } : {}), ...(p.input.documentStatus ? { status: p.input.documentStatus } : { status: { notIn: ["draft", "cancelled"] } }), ...dates }, select: { id: true, vendor_id: true, status: true } });
      const typedLines = await MyGlobal.prisma.purchase_order_lines.findMany({ where: { order_id: { in: orders.map((order) => order.id) }, ...(p.input.itemId ? { item_id: p.input.itemId } : {}), ...(p.input.warehouseId ? { warehouse_id: p.input.warehouseId } : {}) }, select: { order_id: true, item_id: true, ordered_quantity: true, received_quantity: true, billed_quantity: true, unit_price: true } });
      if (p.input.kind === "purchase_order_status") { const grouped = new Map<string, number>(); for (const order of orders) grouped.set(order.status, (grouped.get(order.status) ?? 0) + 1); return result(p.input.kind, organizationId, filters, [...grouped.entries()].map(([label, value]) => ({ label: `purchase_order_status:${label}`, value }))); }
      if (p.input.kind === "vendor_spend") { const spend = new Map<string, number>(); for (const line of typedLines) { const order = orders.find((candidate) => candidate.id === line.order_id); if (order !== undefined) spend.set(order.vendor_id, (spend.get(order.vendor_id) ?? 0) + line.ordered_quantity * line.unit_price); } return result(p.input.kind, organizationId, filters, [...spend.entries()].map(([label, value]) => ({ label: `vendor_spend:${label}`, value }))); }
      if (p.input.kind === "three_way_match") return result(p.input.kind, organizationId, filters, [{ label: "three_way_match_exceptions", value: typedLines.filter((line) => line.received_quantity !== line.billed_quantity).length }, { label: "three_way_match_quantity_delta", value: typedLines.reduce((sum, line) => sum + Math.abs(line.received_quantity - line.billed_quantity), 0) }]);
      return result(p.input.kind, organizationId, filters, [{ label: "receipts_unbilled_lines", value: typedLines.filter((line) => line.received_quantity > line.billed_quantity).length }, { label: "receipts_unbilled_quantity", value: typedLines.reduce((sum, line) => sum + Math.max(0, line.received_quantity - line.billed_quantity), 0) }]);
    }

    if (["headcount", "contract_history", "timesheet_status", "payroll_register", "payslip_history"].includes(p.input.kind)) {
      const employees = await MyGlobal.prisma.employees.findMany({ where: { organization_id: organizationId, ...(p.input.employeeId ? { id: p.input.employeeId } : {}), ...(p.input.departmentId ? { department_id: p.input.departmentId } : {}), ...(p.input.costCenterId ? { cost_center_id: p.input.costCenterId } : {}), ...(p.input.documentStatus ? { status: p.input.documentStatus } : {}) }, select: { id: true, status: true, hire_date: true, termination_date: true }, });
      const employeeIds = employees.map((employee) => employee.id);
      if (p.input.kind === "headcount") { const asOf = to ?? new Date(); const active = employees.filter((employee) => employee.status === "active" && (employee.hire_date === null || employee.hire_date <= asOf) && (employee.termination_date === null || employee.termination_date > asOf)); return result(p.input.kind, organizationId, filters, [{ label: "headcount", value: active.length }, { label: "employee_records", value: employees.length }]); }
      if (p.input.kind === "contract_history") { const contracts = await MyGlobal.prisma.employment_contracts.findMany({ where: { employee_id: { in: employeeIds }, ...(from || to ? { AND: [{ starts_at: { ...(to ? { lte: to } : {}) } }, { OR: [{ ends_at: null }, { ends_at: { gte: from ?? new Date(0) } }] }] } : {}) }, select: { id: true, rate: true } }); return result(p.input.kind, organizationId, filters, [{ label: "employment_contracts", value: contracts.length }, { label: "contracted_rate", value: contracts.reduce((sum, contract) => sum + contract.rate, 0) }]); }
      if (p.input.kind === "timesheet_status") { const sheets = await MyGlobal.prisma.timesheets.findMany({ where: { organization_id: organizationId, employee_id: { in: employeeIds }, ...(p.input.documentStatus ? { status: p.input.documentStatus } : {}), ...(from || to ? { week_start: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}) }, select: { status: true } }); const grouped = new Map<string, number>(); for (const sheet of sheets) grouped.set(sheet.status, (grouped.get(sheet.status) ?? 0) + 1); return result(p.input.kind, organizationId, filters, [...grouped.entries()].map(([label, value]) => ({ label: `timesheet_status:${label}`, value }))); }
      if (p.input.kind === "payroll_register") { const runs = await MyGlobal.prisma.payroll_runs.findMany({ where: { organization_id: organizationId, ...(p.input.documentStatus ? { status: p.input.documentStatus } : {}), ...dates }, select: { total: true, status: true } }); return result(p.input.kind, organizationId, filters, [{ label: "payroll_run_count", value: runs.length }, { label: "payroll_liability", value: runs.reduce((sum, run) => sum + run.total, 0) }]); }
      const runs = await MyGlobal.prisma.payroll_runs.findMany({ where: { organization_id: organizationId, ...dates }, select: { id: true } }); const slips = await MyGlobal.prisma.payslips.findMany({ where: { payroll_run_id: { in: runs.map((run) => run.id) }, employee_id: { in: employeeIds }, status: "published" }, select: { net: true } }); return result(p.input.kind, organizationId, filters, [{ label: "published_payslips", value: slips.length }, { label: "payslip_net", value: slips.reduce((sum, slip) => sum + slip.net, 0) }]);
    }

    if (["mrp_recommendations", "production_order_status", "material_shortage", "production_variance", "work_center_utilization"].includes(p.input.kind)) {
      if (p.input.kind === "mrp_recommendations" || p.input.kind === "material_shortage") { const recommendations = await MyGlobal.prisma.mrp_recommendations.findMany({ where: { organization_id: organizationId, ...(p.input.itemId ? { item_id: p.input.itemId } : {}), ...(p.input.warehouseId ? { warehouse_id: p.input.warehouseId } : {}), ...(p.input.documentStatus ? { status: p.input.documentStatus } : {}), ...(p.input.kind === "material_shortage" ? { recommendation_type: "shortage" } : {}), ...dates }, select: { quantity: true } }); return result(p.input.kind, organizationId, filters, [{ label: "recommendation_count", value: recommendations.length }, { label: p.input.kind === "material_shortage" ? "material_shortage_quantity" : "recommended_quantity", value: recommendations.reduce((sum, recommendation) => sum + recommendation.quantity, 0) }]); }
      const production = await MyGlobal.prisma.production_orders.findMany({ where: { organization_id: organizationId, ...(p.input.itemId ? { finished_item_id: p.input.itemId } : {}), ...(p.input.warehouseId ? { warehouse_id: p.input.warehouseId } : {}), ...(p.input.costCenterId ? { work_center_id: { in: (await MyGlobal.prisma.work_centers.findMany({ where: { organization_id: organizationId, cost_center_id: p.input.costCenterId }, select: { id: true } })).map((center) => center.id) } } : {}), ...(p.input.documentStatus ? { status: p.input.documentStatus } : {}), ...dates }, select: { status: true, planned_quantity: true, completed_quantity: true, planned_material_cost: true, planned_labor_cost: true, planned_machine_cost: true, planned_overhead_cost: true, actual_material_cost: true, labor_hours: true, labor_cost: true, machine_hours: true, machine_cost: true, overhead_cost: true, variance: true, work_center_id: true } });
      if (p.input.kind === "production_order_status") { const grouped = new Map<string, number>(); for (const order of production) grouped.set(order.status, (grouped.get(order.status) ?? 0) + 1); return result(p.input.kind, organizationId, filters, [...grouped.entries()].map(([label, value]) => ({ label: `production_order_status:${label}`, value }))); }
      if (p.input.kind === "production_variance") return result(p.input.kind, organizationId, filters, [{ label: "production_quantity_variance", value: production.reduce((sum, order) => sum + order.planned_quantity - order.completed_quantity, 0) }, { label: "planned_production_cost", value: production.reduce((sum, order) => sum + order.planned_material_cost + order.planned_labor_cost + order.planned_machine_cost + order.planned_overhead_cost, 0) }, { label: "actual_material_cost", value: production.reduce((sum, order) => sum + order.actual_material_cost, 0) }, { label: "actual_production_cost", value: production.reduce((sum, order) => sum + order.actual_material_cost + order.labor_cost + order.machine_cost + order.overhead_cost, 0) }, { label: "manufacturing_variance", value: production.reduce((sum, order) => sum + order.variance, 0) }]);
      const workCenters = await MyGlobal.prisma.work_centers.findMany({ where: { organization_id: organizationId, ...(p.input.warehouseId ? { warehouse_id: p.input.warehouseId } : {}), ...(p.input.costCenterId ? { cost_center_id: p.input.costCenterId } : {}), status: "active" }, select: { id: true, capacity: true } });
      const capacity = workCenters.reduce((sum, center) => sum + center.capacity, 0);
      const reportedHours = production.filter((order) => order.work_center_id === null || workCenters.some((center) => center.id === order.work_center_id)).reduce((sum, order) => sum + order.machine_hours + order.labor_hours, 0);
      return result(p.input.kind, organizationId, filters, [{ label: "work_center_count", value: workCenters.length }, { label: "available_capacity", value: capacity }, { label: "reported_hours", value: reportedHours }, { label: "utilization_percent", value: capacity === 0 ? 0 : reportedHours / capacity * 100 }]);
    }

    if (["inspection_failures", "quarantined_stock", "maintenance_backlog", "equipment_downtime", "service_case_sla", "warranty_cost"].includes(p.input.kind)) {
      if (p.input.kind === "inspection_failures") { const inspections = await MyGlobal.prisma.inspections.findMany({ where: { organization_id: organizationId, status: "failed", ...(p.input.itemId ? { item_id: p.input.itemId } : {}), ...dates }, select: { rejected_quantity: true } }); return result(p.input.kind, organizationId, filters, [{ label: "inspection_failures", value: inspections.length }, { label: "rejected_quantity", value: inspections.reduce((sum, inspection) => sum + inspection.rejected_quantity, 0) }]); }
      if (p.input.kind === "quarantined_stock") { const quarantines = await MyGlobal.prisma.quarantines.findMany({ where: { organization_id: organizationId, ...(p.input.itemId ? { item_id: p.input.itemId } : {}), ...(p.input.warehouseId ? { warehouse_id: p.input.warehouseId } : {}), status: { in: ["pending_approval", "approved", "rework"] }, ...dates }, select: { quantity: true } }); return result(p.input.kind, organizationId, filters, [{ label: "quarantined_rows", value: quarantines.length }, { label: "quarantined_quantity", value: quarantines.reduce((sum, quarantine) => sum + quarantine.quantity, 0) }]); }
      if (p.input.kind === "maintenance_backlog" || p.input.kind === "equipment_downtime") { const maintenance = await MyGlobal.prisma.maintenance_orders.findMany({ where: { organization_id: organizationId, ...(p.input.employeeId ? { assignee_id: p.input.employeeId } : {}), ...(p.input.costCenterId ? { cost_center_id: p.input.costCenterId } : {}), ...(p.input.documentStatus ? { status: p.input.documentStatus } : {}), ...(p.input.kind === "maintenance_backlog" ? { status: { in: ["draft", "assigned", "started"] } } : {}), ...dates }, select: { downtime_hours: true, total_cost: true } }); return result(p.input.kind, organizationId, filters, [{ label: "maintenance_orders", value: maintenance.length }, { label: p.input.kind === "equipment_downtime" ? "downtime_hours" : "maintenance_cost", value: maintenance.reduce((sum, row) => sum + (p.input.kind === "equipment_downtime" ? row.downtime_hours : row.total_cost), 0) }]); }
      if (p.input.kind === "service_case_sla") { const cases = await MyGlobal.prisma.service_cases.findMany({ where: { organization_id: organizationId, ...(p.input.customerId ? { customer_id: p.input.customerId } : {}), ...(p.input.itemId ? { item_id: p.input.itemId } : {}), ...(p.input.employeeId ? { assignee_id: p.input.employeeId } : {}), ...(p.input.documentStatus ? { status: p.input.documentStatus } : {}), ...dates }, select: { status: true, created_at: true, sla_due_at: true } }); const open = cases.filter((row) => !["resolved", "closed", "cancelled"].includes(row.status)); const resolved = cases.filter((row) => ["resolved", "closed"].includes(row.status)); const now = new Date(); return result(p.input.kind, organizationId, filters, [{ label: "service_cases", value: cases.length }, { label: "service_cases_open", value: open.length }, { label: "service_cases_resolved", value: resolved.length }, { label: "open_case_age_hours", value: open.reduce((sum, row) => sum + Math.max(0, now.getTime() - row.created_at.getTime()) / 3600000, 0) }, { label: "service_cases_within_sla", value: open.filter((row) => row.sla_due_at !== null && row.sla_due_at >= now).length }, { label: "service_cases_breached", value: open.filter((row) => row.sla_due_at !== null && row.sla_due_at < now).length }]); }
      const serviceOrders = await MyGlobal.prisma.service_orders.findMany({ where: { organization_id: organizationId, warranty: true, ...(p.input.customerId ? { customer_id: p.input.customerId } : {}), ...(p.input.itemId ? { item_id: p.input.itemId } : {}), ...(p.input.employeeId ? { assignee_id: p.input.employeeId } : {}), ...dates }, select: { id: true } }); const parts = serviceOrders.length === 0 ? [] : await MyGlobal.prisma.service_order_parts.findMany({ where: { organization_id: organizationId, service_order_id: { in: serviceOrders.map((order) => order.id) }, ...(p.input.itemId ? { item_id: p.input.itemId } : {}) }, select: { quantity: true, unit_cost: true } }); const labor = serviceOrders.length === 0 ? [] : await MyGlobal.prisma.service_order_labor.findMany({ where: { organization_id: organizationId, service_order_id: { in: serviceOrders.map((order) => order.id) } }, select: { hours: true, rate: true } }); return result(p.input.kind, organizationId, filters, [{ label: "warranty_service_orders", value: serviceOrders.length }, { label: "warranty_cost", value: parts.reduce((sum, part) => sum + part.quantity * part.unit_cost, 0) + labor.reduce((sum, row) => sum + row.hours * row.rate, 0) }]);
    }

    const journals = await MyGlobal.prisma.journals.findMany({ where: { organization_id: organizationId, status: "posted", ...(from || to ? { journal_date: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}) }, select: { id: true } });
    const accountIds = await reportAccountIds(organizationId, p.input.accountId);
    const journalLines = await MyGlobal.prisma.journal_lines.findMany({ where: { journal_id: { in: journals.map((journal) => journal.id) }, ...(accountIds === undefined ? {} : { account_id: { in: accountIds } }), ...(p.input.departmentId ? { department_id: p.input.departmentId } : {}), ...(p.input.projectId ? { project_id: p.input.projectId } : {}), ...(p.input.costCenterId ? { cost_center_id: p.input.costCenterId } : {}), ...(p.input.customerId ? { customer_id: p.input.customerId } : {}), ...(p.input.vendorId ? { vendor_id: p.input.vendorId } : {}), ...(p.input.employeeId ? { employee_id: p.input.employeeId } : {}), ...(p.input.itemId ? { item_id: p.input.itemId } : {}), ...(p.input.warehouseId ? { warehouse_id: p.input.warehouseId } : {}), ...(p.input.currency ? { currency: p.input.currency } : {}) }, select: { debit: true, credit: true, base_debit: true, base_credit: true } });
    return result(p.input.kind, organizationId, filters, [{ label: "posted_debits", value: journalLines.reduce((sum, line) => sum + (line.base_debit ?? line.debit), 0) }, { label: "posted_credits", value: journalLines.reduce((sum, line) => sum + (line.base_credit ?? line.credit), 0) }, { label: "journal_count", value: journals.length }]);
  }

  function agingRows(rows: Array<{ id: string; total: number }>, allocations: Array<{ invoice_id?: string | null; bill_id?: string | null; amount: number }>, key: "invoice_id" | "bill_id", countLabel: string): Array<{ label: string; value: number }> {
    const applied = new Map<string, number>();
    for (const allocation of allocations) { const id = allocation[key]; if (id !== undefined && id !== null) applied.set(id, (applied.get(id) ?? 0) + allocation.amount); }
    return [{ label: "outstanding", value: rows.reduce((sum, row) => sum + Math.max(0, row.total - (applied.get(row.id) ?? 0)), 0) }, { label: countLabel, value: rows.length }];
  }

  function result(kind: string, organizationId: string, filters: string, rows: Array<{ label: string; value: number }>): api.IReport { return { kind, organizationId, filters, rows, generatedAt: new Date().toISOString() }; }
  async function reportAccountIds(organizationId: string, accountId: string | null | undefined): Promise<string[] | undefined> {
    if (accountId === undefined || accountId === null) return undefined;
    const accounts = await MyGlobal.prisma.accounts.findMany({ where: { organization_id: organizationId }, select: { id: true, merged_into_id: true } });
    const byId = new Map(accounts.map((account) => [account.id, account.merged_into_id]));
    const terminal = (id: string): string => {
      const seen = new Set<string>();
      let current = id;
      while (byId.get(current) !== undefined && byId.get(current) !== null && !seen.has(current)) {
        seen.add(current);
        current = byId.get(current)!;
      }
      return current;
    };
    const target = terminal(accountId);
    return accounts.filter((account) => terminal(account.id) === target).map((account) => account.id);
  }
  function snapshotKind(kind: api.IReport.IRequest["kind"]): string | null { const map: Partial<Record<api.IReport.IRequest["kind"], string>> = { trial_balance: "trial_balance", balance_sheet: "balance_sheet", profit_loss: "profit_loss", inventory: "inventory_valuation", inventory_valuation: "inventory_valuation", ar_aging: "ar_aging", ap_aging: "ap_aging", cash_flow: "cash_balances", budget_actual: "budget_actual", tax_summary: "tax_summary" }; return map[kind] ?? null; }
  function audit(row: { id: string; actor_id: string; action: string; target_type: string; target_id: string; risk: string; before_value: string | null; after_value: string | null; reason: string | null; ip_address: string | null; user_agent: string | null; created_at: Date }): api.IAuditEvent { return { id: row.id, actorId: row.actor_id, action: row.action, targetType: row.target_type, targetId: row.target_id, risk: row.risk, beforeValue: row.before_value, afterValue: row.after_value, reason: row.reason, ipAddress: row.ip_address, userAgent: row.user_agent, createdAt: row.created_at.toISOString() }; }
}
