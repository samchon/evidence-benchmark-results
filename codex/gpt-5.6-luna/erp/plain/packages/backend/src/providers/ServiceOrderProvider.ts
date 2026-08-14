import type * as api from "@benchmark/erp-api";
import { randomUUID } from "node:crypto";
import { AuthProvider } from "./AuthProvider";
import { AllocationProvider } from "./AllocationProvider";
import type { ErpPayload } from "../decorators/ErpAuth";
import { ErrorUtil } from "../utils/ErrorUtil";
import { MyGlobal } from "../MyGlobal";
import { JournalProvider } from "./JournalProvider";

/** Customer-facing service-order execution and settlement. */
export namespace ServiceOrderProvider {
  export async function create(p: { actor: ErpPayload; body: api.IServiceOrder.ICreate }): Promise<api.IServiceOrder> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    const customer = await MyGlobal.prisma.parties.findFirst({ where: { id: p.body.customerId, organization_id: organizationId, kind: "customer", status: "active" } });
    if (customer === null) throw ErrorUtil.notFound("No active customer exists in the active organization.");
    if (p.body.caseId !== undefined && p.body.caseId !== null && await MyGlobal.prisma.service_cases.findFirst({ where: { id: p.body.caseId, organization_id: organizationId, customer_id: customer.id } }) === null) throw ErrorUtil.notFound("No matching service case exists in the active organization.");
    if (p.body.itemId !== undefined && p.body.itemId !== null && await MyGlobal.prisma.items.findFirst({ where: { id: p.body.itemId, organization_id: organizationId, active: true } }) === null) throw ErrorUtil.notFound("No active service item exists in the active organization.");
    return details(await MyGlobal.prisma.service_orders.create({ data: { id: randomUUID(), organization_id: organizationId, customer_id: customer.id, case_id: p.body.caseId ?? null, service_type: p.body.serviceType ?? "repair", item_id: p.body.itemId ?? null, serial_number: p.body.serialNumber ?? null, status: "draft", warranty: null, billable: null, assignee_id: null, scheduled_at: p.body.scheduledAt ? new Date(p.body.scheduledAt) : null, work_notes: null, resolution: null, invoice_id: null, warranty_expense_journal_id: null, created_at: new Date(), updated_at: new Date() } }));
  }

  export async function index(p: { actor: ErpPayload; input: api.IPage.IRequest }): Promise<api.IPage<api.IServiceOrder>> {
    const organizationId = await AuthProvider.organizationId(p.actor); const page = p.input.page ?? 1; const limit = p.input.limit || 100; const where = { organization_id: organizationId };
    const [records, rows] = await Promise.all([MyGlobal.prisma.service_orders.count({ where }), MyGlobal.prisma.service_orders.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { created_at: "desc" } })]);
    return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: await Promise.all(rows.map(details)) };
  }

  export async function update(p: { actor: ErpPayload; id: string; body: api.IServiceOrder.IUpdate }): Promise<api.IServiceOrder> {
    const organizationId = await AuthProvider.organizationId(p.actor); const row = await MyGlobal.prisma.service_orders.findFirst({ where: { id: p.id, organization_id: organizationId } });
    if (row === null) throw ErrorUtil.notFound("No service order exists in the active organization.");
    if (p.body.status !== undefined && p.body.status !== row.status) throw ErrorUtil.conflict("Service-order lifecycle changes must use the lifecycle command.");
    if (["completed", "invoiced"].includes(row.status) && (p.body.warranty !== undefined || p.body.billable !== undefined || p.body.resolution !== undefined || p.body.workNotes !== undefined || p.body.assigneeId !== undefined || p.body.scheduledAt !== undefined)) throw ErrorUtil.conflict("A completed service order is immutable.");
    if (p.body.assigneeId !== undefined && p.body.assigneeId !== null && await MyGlobal.prisma.employees.findFirst({ where: { id: p.body.assigneeId, organization_id: organizationId, status: "active" } }) === null) throw ErrorUtil.notFound("No active assignee exists in the active organization.");
    if (p.body.warranty === true && p.body.billable === true) throw ErrorUtil.conflict("A service order cannot be both warranty and billable.");
    if (p.body.status === "completed" && ((p.body.warranty ?? row.warranty) === null || (p.body.billable ?? row.billable) === null || (p.body.resolution ?? row.resolution)?.trim() === "")) throw ErrorUtil.conflict("Warranty, billing, and resolution decisions are required before completion.");
    return details(await MyGlobal.prisma.service_orders.update({ where: { id: row.id }, data: { status: p.body.status ?? row.status, warranty: p.body.warranty === undefined ? row.warranty : p.body.warranty, billable: p.body.billable === undefined ? row.billable : p.body.billable, assignee_id: p.body.assigneeId === undefined ? row.assignee_id : p.body.assigneeId, scheduled_at: p.body.scheduledAt === undefined ? row.scheduled_at : p.body.scheduledAt === null ? null : new Date(p.body.scheduledAt), work_notes: p.body.workNotes === undefined ? row.work_notes : p.body.workNotes, resolution: p.body.resolution === undefined ? row.resolution : p.body.resolution, updated_at: new Date() } }));
  }

  export async function part(p: { actor: ErpPayload; id: string; body: api.IServiceOrder.IPart }): Promise<api.IServiceOrder> {
    const organizationId = await AuthProvider.organizationId(p.actor); validatePositive(p.body.quantity, "Service part quantity"); validateNonNegative(p.body.unitCost, "Service part cost");
    const order = await MyGlobal.prisma.service_orders.findFirst({ where: { id: p.id, organization_id: organizationId, status: "started" } }); if (order === null) throw ErrorUtil.conflict("Parts can be consumed only by a started service order.");
    const item = await MyGlobal.prisma.items.findFirst({ where: { id: p.body.itemId, organization_id: organizationId, active: true } }); if (item === null) throw ErrorUtil.notFound("No active service part item exists in the active organization."); if (item.type === "service") throw ErrorUtil.unprocessable("Service items cannot create stock movements."); AllocationProvider.validateTracking(item.tracking_mode, p.body.lotId ?? null, p.body.serialCode ?? null, p.body.quantity);
    const location = await MyGlobal.prisma.locations.findFirst({ where: { id: p.body.locationId, warehouse_id: p.body.warehouseId, active: true } }); if (location === null) throw ErrorUtil.notFound("The service part location is not active in the warehouse.");
    const now = new Date(); await MyGlobal.prisma.$transaction(async (tx) => { const available = await AllocationProvider.availabilityTracking(organizationId, item.id, p.body.warehouseId, p.body.locationId, p.body.lotId ?? null, p.body.serialCode ?? null, tx); if (p.body.quantity > available.available) throw ErrorUtil.conflict("Service part consumption exceeds eligible available stock."); await tx.stock_movements.create({ data: { id: randomUUID(), organization_id: organizationId, item_id: item.id, warehouse_id: p.body.warehouseId, location_id: p.body.locationId, type: "service_consumption", quantity: -p.body.quantity, unit_cost: p.body.unitCost, lot_id: p.body.lotId ?? null, serial_code: p.body.serialCode ?? null, source_type: "service_order", source_id: order.id, operator_membership_id: p.actor.membership_id ?? null, created_at: now } }); await tx.service_order_parts.create({ data: { id: randomUUID(), organization_id: organizationId, service_order_id: order.id, item_id: item.id, quantity: p.body.quantity, warehouse_id: p.body.warehouseId, location_id: p.body.locationId, lot_id: p.body.lotId ?? null, serial_code: p.body.serialCode ?? null, unit_cost: p.body.unitCost, created_at: now } }); });
    return details(order);
  }

  export async function labor(p: { actor: ErpPayload; id: string; body: { hours: number; rate?: number } }): Promise<api.IServiceOrder> {
    const organizationId = await AuthProvider.organizationId(p.actor); validatePositive(p.body.hours, "Service labor hours"); validateNonNegative(p.body.rate ?? 0, "Service labor rate"); const order = await MyGlobal.prisma.service_orders.findFirst({ where: { id: p.id, organization_id: organizationId, status: "started" } }); if (order === null) throw ErrorUtil.conflict("Labor can be recorded only on a started service order."); await MyGlobal.prisma.service_order_labor.create({ data: { id: randomUUID(), organization_id: organizationId, service_order_id: order.id, hours: p.body.hours, rate: p.body.rate ?? 0, created_at: new Date() } }); return details(order);
  }

  export async function invoice(p: { actor: ErpPayload; id: string }): Promise<api.IServiceOrder> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    const id = randomUUID();
    await MyGlobal.prisma.$transaction(async (tx) => {
      const order = await tx.service_orders.findFirst({ where: { id: p.id, organization_id: organizationId, status: "completed", billable: true, invoice_id: null } });
      if (order === null) throw ErrorUtil.conflict("Only a completed billable service order without an invoice can be invoiced.");
      if (order.item_id === null) throw ErrorUtil.conflict("A billable service order requires an item for its invoice.");
      const item = await tx.items.findFirst({ where: { id: order.item_id, organization_id: organizationId, active: true, type: "service" } });
      if (item === null) throw ErrorUtil.conflict("A billable service order invoice requires an active service item.");
      const parts = await tx.service_order_parts.findMany({ where: { service_order_id: order.id } });
      const labor = await tx.service_order_labor.findMany({ where: { service_order_id: order.id } });
      const total = parts.reduce((sum, row) => sum + row.quantity * row.unit_cost, 0) + labor.reduce((sum, row) => sum + row.hours * row.rate, 0);
      const now = new Date();
      const claimed = await tx.service_orders.updateMany({ where: { id: order.id, organization_id: organizationId, status: "completed", billable: true, invoice_id: null }, data: { invoice_id: id, updated_at: now } });
      if (claimed.count !== 1) throw ErrorUtil.conflict("The service order was already invoiced.");
      const currency = (await tx.organizations.findUniqueOrThrow({ where: { id: organizationId }, select: { base_currency: true } })).base_currency;
      await tx.sales_invoices.create({ data: { id, organization_id: organizationId, customer_id: order.customer_id, number: `SVC-${Date.now()}-${randomUUID().slice(0, 6)}`, status: "posted", currency, total, due_at: null, created_at: now, posted_at: now } });
      await tx.sales_invoice_lines.create({ data: { id: randomUUID(), invoice_id: id, order_line_id: null, shipment_line_id: null, service_order_id: order.id, item_id: item.id, quantity: 1, amount: total, tax_amount: 0, created_at: now } });
      await JournalProvider.createPosted(tx, organizationId, "service_invoice", order.id, now, `Service invoice ${order.id}`, "1100", "4000", total, currency, p.actor.membership_id);
      await tx.service_orders.update({ where: { id: order.id }, data: { status: "invoiced", updated_at: now } });
    });
    return details(await MyGlobal.prisma.service_orders.findUniqueOrThrow({ where: { id: p.id } }));
  }

  export async function warrantyExpense(p: { actor: ErpPayload; id: string }): Promise<api.IServiceOrder> {
    const organizationId = await AuthProvider.organizationId(p.actor); const order = await MyGlobal.prisma.service_orders.findFirst({ where: { id: p.id, organization_id: organizationId, status: "completed", warranty: true, billable: false, warranty_expense_journal_id: null } }); if (order === null) throw ErrorUtil.conflict("Only completed non-billable warranty work without an expense posting can be posted."); const parts = await MyGlobal.prisma.service_order_parts.findMany({ where: { service_order_id: order.id } }); const labor = await MyGlobal.prisma.service_order_labor.findMany({ where: { service_order_id: order.id } }); const total = parts.reduce((sum, row) => sum + row.quantity * row.unit_cost, 0) + labor.reduce((sum, row) => sum + row.hours * row.rate, 0); const now = new Date(); let journalId = ""; await MyGlobal.prisma.$transaction(async (tx) => { const currency = (await tx.organizations.findUniqueOrThrow({ where: { id: organizationId }, select: { base_currency: true } })).base_currency; journalId = await JournalProvider.createPosted(tx, organizationId, "service_warranty", order.id, now, `Warranty service ${order.id}`, "5000", "2000", total, currency, p.actor.membership_id); await tx.service_orders.update({ where: { id: order.id }, data: { warranty_expense_journal_id: journalId || null, updated_at: now } }); }); return details(await MyGlobal.prisma.service_orders.findUniqueOrThrow({ where: { id: order.id } }));
  }

  async function state(p: { actor: ErpPayload; id: string }, expected: api.IServiceOrder["status"], next: api.IServiceOrder["status"]): Promise<api.IServiceOrder> { const organizationId = await AuthProvider.organizationId(p.actor); const row = await MyGlobal.prisma.service_orders.findFirst({ where: { id: p.id, organization_id: organizationId, status: expected } }); if (row === null) throw ErrorUtil.conflict(`Only a ${expected} service order can become ${next}.`); if (next === "assigned" && (row.assignee_id === null || row.scheduled_at === null)) throw ErrorUtil.conflict("A service order must be assigned and scheduled before it starts execution."); if (next === "completed" && (row.warranty === null || row.billable === null || row.resolution?.trim() === "" || row.resolution === null)) throw ErrorUtil.conflict("Warranty, billing, and resolution decisions are required before completion."); return details(await MyGlobal.prisma.service_orders.update({ where: { id: row.id }, data: { status: next, updated_at: new Date() } })); }
  export async function assign(p: { actor: ErpPayload; id: string }): Promise<api.IServiceOrder> { return state(p, "draft", "assigned"); }
  export async function start(p: { actor: ErpPayload; id: string }): Promise<api.IServiceOrder> { return state(p, "assigned", "started"); }
  export async function complete(p: { actor: ErpPayload; id: string }): Promise<api.IServiceOrder> { return state(p, "started", "completed"); }
  export async function cancel(p: { actor: ErpPayload; id: string }): Promise<api.IServiceOrder> { const organizationId = await AuthProvider.organizationId(p.actor); const row = await MyGlobal.prisma.service_orders.findFirst({ where: { id: p.id, organization_id: organizationId, status: { in: ["draft", "assigned"] } } }); if (row === null) throw ErrorUtil.conflict("Only a draft or assigned service order can be cancelled."); return details(await MyGlobal.prisma.service_orders.update({ where: { id: row.id }, data: { status: "cancelled", updated_at: new Date() } })); }

  async function details(row: { id: string; customer_id: string; case_id: string | null; service_type: string; item_id: string | null; serial_number: string | null; status: string; warranty: boolean | null; billable: boolean | null; assignee_id: string | null; scheduled_at: Date | null; work_notes: string | null; resolution: string | null; invoice_id: string | null; warranty_expense_journal_id: string | null }): Promise<api.IServiceOrder> { const [parts, labor] = await Promise.all([MyGlobal.prisma.service_order_parts.findMany({ where: { service_order_id: row.id }, orderBy: { created_at: "asc" } }), MyGlobal.prisma.service_order_labor.findMany({ where: { service_order_id: row.id }, orderBy: { created_at: "asc" } })]); return { id: row.id, customerId: row.customer_id, caseId: row.case_id, serviceType: row.service_type, itemId: row.item_id, serialNumber: row.serial_number, status: row.status as api.IServiceOrder["status"], warranty: row.warranty, billable: row.billable, assigneeId: row.assignee_id, scheduledAt: row.scheduled_at?.toISOString() ?? null, workNotes: row.work_notes, resolution: row.resolution, parts: parts.map((part) => ({ itemId: part.item_id, quantity: part.quantity, warehouseId: part.warehouse_id, locationId: part.location_id, lotId: part.lot_id, serialCode: part.serial_code, unitCost: part.unit_cost })), labor: labor.map((entry) => ({ id: entry.id, hours: entry.hours, rate: entry.rate })), invoiceId: row.invoice_id, warrantyExpenseJournalId: row.warranty_expense_journal_id }; }
  function validatePositive(value: number, label: string): void { if (!Number.isFinite(value) || value <= 0) throw ErrorUtil.unprocessable(`${label} must be positive and finite.`); }
  function validateNonNegative(value: number, label: string): void { if (!Number.isFinite(value) || value < 0) throw ErrorUtil.unprocessable(`${label} must be finite and non-negative.`); }
}


