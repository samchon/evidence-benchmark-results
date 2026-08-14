import type * as api from "@benchmark/erp-api";
import { randomUUID } from "node:crypto";
import { AuthProvider } from "./AuthProvider";
import { ErrorUtil } from "../utils/ErrorUtil";
import { MyGlobal } from "../MyGlobal";
import { JournalProvider } from "./JournalProvider";
import { AllocationProvider } from "./AllocationProvider";
import { ControlOperationsProvider } from "./ControlOperationsProvider";
import type { ErpPayload } from "../decorators/ErpAuth";
import type { Prisma } from "@prisma/sdk";
import type { credit_memos, purchase_returns, sales_returns, vendor_bills } from "../prisma/client";
type FinanceId = { actor: ErpPayload; id: string }; type FinanceBody<T> = { actor: ErpPayload; body: T }; type FinanceIdBody<T> = FinanceId & { body: T }; type FinanceInput<T> = { actor: ErpPayload; input: T }; type BillTransition = FinanceId & { status: "approved" | "rejected" | "disputed" }; type BillRow = vendor_bills; type PurchaseReturnRow = purchase_returns; type SalesReturnRow = sales_returns; type CreditMemoRow = credit_memos;
/** Vendor bills, purchase returns, sales returns, and credit memos. */
export namespace ExtendedFinanceProvider {
    export async function billCreate(p: FinanceBody<api.IVendorBill.ICreate>) {
        const org = await AuthProvider.organizationId(p.actor);
        const vendor = await MyGlobal.prisma.parties.findFirst({ where: { id: p.body.vendorId, organization_id: org, kind: "vendor", status: "active" } });
        if (vendor === null)
            throw ErrorUtil.notFound("No active vendor exists in the active organization.");
        const id = randomUUID();
        const total = p.body.lines.reduce((sum, line) => sum + line.amount + line.taxAmount, 0);
        const row = await MyGlobal.prisma.$transaction(async (tx) => {
            await validateBillLines(tx, org, vendor.id, p.body.lines);
            const bill = await tx.vendor_bills.create({ data: { id, organization_id: org, vendor_id: vendor.id, number: `BILL-${Date.now()}-${randomUUID().slice(0, 6)}`, status: "draft", currency: p.body.currency, total, created_at: new Date(), posted_at: null } });
            for (const line of p.body.lines)
                await tx.vendor_bill_lines.create({ data: { id: randomUUID(), bill_id: id, purchase_order_line_id: line.purchaseOrderLineId ?? null, item_id: line.itemId, quantity: line.quantity, amount: line.amount, tax_amount: line.taxAmount, created_at: new Date() } });
            return bill;
        });
        return billDto(row, await billLines(id));
    }
    export async function billIndex(p: FinanceInput<api.IPage.IRequest>) { const org = await AuthProvider.organizationId(p.actor); const page = p.input.page ?? 1; const limit = p.input.limit || 100; const where = { organization_id: org }; const [records, rows] = await Promise.all([MyGlobal.prisma.vendor_bills.count({ where }), MyGlobal.prisma.vendor_bills.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { created_at: "desc" } })]); return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: await Promise.all(rows.map(async (r) => billDto(r, await billLines(r.id)))) }; }
    export async function billUpdate(p: FinanceIdBody<api.IVendorBill.IUpdate>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.vendor_bills.findFirst({ where: { id: p.id, organization_id: org, status: "draft" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a draft vendor bill can be edited.");
        await MyGlobal.prisma.$transaction(async (tx) => {
            const lines = p.body.lines;
            const total = lines === undefined ? row.total : lines.reduce((sum, line) => sum + line.amount + line.taxAmount, 0);
            await tx.vendor_bills.update({ where: { id: row.id }, data: { currency: p.body.currency ?? row.currency, total } });
            if (lines !== undefined) {
                await validateBillLines(tx, org, row.vendor_id, lines);
                await tx.vendor_bill_lines.deleteMany({ where: { bill_id: row.id } });
                for (const line of lines)
                    await tx.vendor_bill_lines.create({ data: { id: randomUUID(), bill_id: row.id, purchase_order_line_id: line.purchaseOrderLineId ?? null, item_id: line.itemId, quantity: line.quantity, amount: line.amount, tax_amount: line.taxAmount, created_at: new Date() } });
            }
        });
        const updated = await MyGlobal.prisma.vendor_bills.findUniqueOrThrow({ where: { id: row.id } });
        return billDto(updated, await billLines(updated.id));
    }
    export async function billTransition(p: BillTransition) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.vendor_bills.findFirst({ where: { id: p.id, organization_id: org, status: "draft" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a draft vendor bill can be resolved.");

        if (p.status === "approved") {
            const match = await billMatch({ actor: p.actor, id: row.id });
            if (match.status === "variance") {
                const approved = await MyGlobal.prisma.approvals.findFirst({ where: { organization_id: org, target_type: "vendor_bill_variance", target_id: row.id, status: "approved" } });
                if (approved === null) {
                    const pending = await MyGlobal.prisma.approvals.findFirst({ where: { organization_id: org, target_type: "vendor_bill_variance", target_id: row.id, status: "pending" } });
                    if (pending === null)
                        await ControlOperationsProvider.approvalCreate({ actor: p.actor, body: { targetType: "vendor_bill_variance", targetId: row.id, facts: { amount: match.totalVariance, currency: row.currency } } });
                    throw ErrorUtil.conflict("A vendor-bill variance requires completed approval before it can be approved.");
                }
            }
        }
        const updated = await MyGlobal.prisma.vendor_bills.update({ where: { id: row.id }, data: { status: p.status } });
        return billDto(updated, await billLines(updated.id));
    }
    export async function billPost(p: FinanceId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.vendor_bills.findFirst({ where: { id: p.id, organization_id: org, status: "approved" } });
        if (row === null)
            throw ErrorUtil.conflict("Only an approved vendor bill can be posted.");
        const now = new Date();
        const updated = await MyGlobal.prisma.$transaction(async (tx) => {
            const tax = (await tx.vendor_bill_lines.findMany({ where: { bill_id: row.id }, select: { tax_amount: true } })).reduce((sum, line) => sum + line.tax_amount, 0);
            if (tax > 0)
                await JournalProvider.createPostedWithTax(tx, org, "vendor_bill", row.id, now, `Vendor bill ${row.number}`, "5000", "2000", "1200", row.total, tax, row.currency, true);
            else
                await JournalProvider.createPosted(tx, org, "vendor_bill", row.id, now, `Vendor bill ${row.number}`, "5000", "2000", row.total, row.currency);
            return tx.vendor_bills.update({ where: { id: row.id }, data: { status: "posted", posted_at: now } });
        });
        return billDto(updated, await billLines(updated.id));
    }
    export async function billMatch(p: FinanceId): Promise<api.IVendorBillMatch> {
        const org = await AuthProvider.organizationId(p.actor);
        const bill = await MyGlobal.prisma.vendor_bills.findFirst({ where: { id: p.id, organization_id: org } });
        if (bill === null)
            throw ErrorUtil.notFound("No vendor bill exists in the active organization.");
        const lines = await MyGlobal.prisma.vendor_bill_lines.findMany({ where: { bill_id: bill.id }, orderBy: { created_at: "asc" } });
        const output = [];
        const priorBills = await MyGlobal.prisma.vendor_bills.findMany({ where: { organization_id: org, id: { not: bill.id } }, select: { id: true } });
        for (const line of lines) {
            const source = line.purchase_order_line_id === null ? null : await MyGlobal.prisma.purchase_order_lines.findUnique({ where: { id: line.purchase_order_line_id } });
            const receiptIds = source === null ? [] : (await MyGlobal.prisma.purchase_receipts.findMany({ where: { organization_id: org, order_id: source.order_id, status: "posted" }, select: { id: true } })).map((receipt) => receipt.id);
            const receipts = source === null ? [] : await MyGlobal.prisma.purchase_receipt_lines.findMany({ where: { order_line_id: source.id, receipt_id: { in: receiptIds } }, select: { accepted_quantity: true } });
            const billed = source === null ? line.quantity : ((await MyGlobal.prisma.vendor_bill_lines.aggregate({ _sum: { quantity: true }, where: { purchase_order_line_id: source.id, bill_id: { in: priorBills.map((prior) => prior.id) } } }))._sum.quantity ?? 0) + line.quantity;
            const received = receipts.reduce((sum, receipt) => sum + receipt.accepted_quantity, 0);
            const ordered = source?.ordered_quantity ?? 0;
            const unitPrice = source?.unit_price ?? 0;
            const billedUnitPrice = line.quantity === 0 ? 0 : line.amount / line.quantity;
            const quantityVariance = line.purchase_order_line_id === null ? line.quantity : Math.max(0, billed - received);
            const priceVariance = source === null ? line.amount : Math.max(0, line.amount - line.quantity * unitPrice);
            output.push({ billLineId: line.id, purchaseOrderLineId: line.purchase_order_line_id, orderedQuantity: ordered, receivedQuantity: received, billedQuantity: billed, unitPrice, billedUnitPrice, quantityVariance, priceVariance, eligible: source !== null && billed <= received && Math.abs(priceVariance) < 0.000001 });
        }
        const totalVariance = output.reduce((sum, line) => sum + line.quantityVariance + line.priceVariance, 0);
        return { billId: bill.id, status: totalVariance === 0 && output.every((line) => line.eligible) ? "matched" : "variance", totalVariance, lines: output };
    }
    export async function purchaseReturnCreate(p: FinanceBody<api.IPurchaseReturn.ICreate>) {
        const org = await AuthProvider.organizationId(p.actor);

        const receipt = await MyGlobal.prisma.purchase_receipts.findFirst({ where: { id: p.body.receiptId, organization_id: org, status: "posted" } });
        if (receipt === null)
            throw ErrorUtil.conflict("A purchase return requires a posted receipt.");
        if (p.body.lines.length === 0)
            throw ErrorUtil.unprocessable("A purchase return requires at least one line.");
        const id = randomUUID();
        const row = await MyGlobal.prisma.$transaction(async (tx) => {
            const result = await tx.purchase_returns.create({ data: { id, organization_id: org, receipt_id: receipt.id, number: `PRTN-${Date.now()}-${randomUUID().slice(0, 6)}`, status: "draft", created_at: new Date(), posted_at: null } });
            const order = await tx.purchase_orders.findFirst({ where: { id: receipt.order_id, organization_id: org } });
            if (order === null)
                throw ErrorUtil.conflict("The receipt's purchase order is outside the active organization.");
            for (const line of p.body.lines) {
                const source = await tx.purchase_order_lines.findFirst({ where: { id: line.orderLineId, order_id: order.id } });
                const location = await tx.locations.findFirst({ where: { id: line.locationId, warehouse_id: line.warehouseId, active: true } });
                const receiptLine = source === null ? null : await tx.purchase_receipt_lines.findFirst({ where: { receipt_id: receipt.id, order_line_id: source.id, warehouse_id: line.warehouseId, location_id: line.locationId, lot_id: line.lotId ?? null, serial_code: line.serialCode ?? null } });
                const prior = source === null ? 0 : (await tx.purchase_return_lines.aggregate({ _sum: { quantity: true }, where: { order_line_id: source.id } }))._sum.quantity ?? 0;
                if (source === null || receiptLine === null || location === null || line.quantity <= 0 || line.quantity > receiptLine.accepted_quantity || line.quantity > source.received_quantity - prior || receiptLine.serial_code !== null && line.quantity !== 1)
                    throw ErrorUtil.conflict("Purchase return exceeds the received quantity, receipt remainder, or uses an inactive location.");
                await tx.purchase_return_lines.create({ data: { id: randomUUID(), return_id: id, order_line_id: source.id, quantity: line.quantity, warehouse_id: line.warehouseId, location_id: line.locationId, lot_id: line.lotId ?? null, serial_code: line.serialCode ?? null, created_at: new Date() } });
            }
            return result;
        });
        return purchaseReturnDto(row, await purchaseReturnLines(id));
    }
    export async function purchaseReturnPost(p: FinanceId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.purchase_returns.findFirst({ where: { id: p.id, organization_id: org, status: "draft" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a draft purchase return can be posted.");
        const now = new Date();
        await MyGlobal.prisma.$transaction(async (tx) => {
            const claimed = await tx.purchase_returns.updateMany({ where: { id: row.id, organization_id: org, status: "draft" }, data: { status: "posting" } });
            if (claimed.count !== 1)
                throw ErrorUtil.conflict("The purchase return was already posted or is being posted.");
            const lines = await tx.purchase_return_lines.findMany({ where: { return_id: row.id } });
            if (lines.length === 0)
                throw ErrorUtil.conflict("A purchase return requires at least one line.");
            for (const line of lines) {
                const source = await tx.purchase_order_lines.findUniqueOrThrow({ where: { id: line.order_line_id } });
                const organization = await tx.organizations.findUniqueOrThrow({ where: { id: org }, select: { negative_stock_allowed: true } });
                if (!organization.negative_stock_allowed) {
                    const available = await AllocationProvider.availabilityTracking(org, source.item_id, line.warehouse_id, line.location_id, line.lot_id ?? null, line.serial_code ?? null, tx);
                    if (line.quantity > available.available)
                        throw ErrorUtil.conflict("Purchase return exceeds eligible available stock at the return location.");
                }
                const changed = await tx.purchase_order_lines.updateMany({ where: { id: source.id, received_quantity: { gte: line.quantity } }, data: { received_quantity: { decrement: line.quantity } } });
                if (changed.count !== 1)
                    throw ErrorUtil.conflict("The purchase return quantity exceeds the current received remainder.");
                await tx.stock_movements.create({ data: { id: randomUUID(), organization_id: org, item_id: source.item_id, warehouse_id: line.warehouse_id, location_id: line.location_id, type: "purchase_return", quantity: -line.quantity, unit_cost: source.unit_price, lot_id: line.lot_id, serial_code: line.serial_code, source_type: "purchase_return", source_id: row.id, operator_membership_id: p.actor.membership_id ?? null, created_at: now } });
            }
            const orderId = (await tx.purchase_receipts.findUniqueOrThrow({ where: { id: row.receipt_id }, select: { order_id: true } })).order_id;
            const sourceLines = await tx.purchase_order_lines.findMany({ where: { order_id: orderId }, select: { ordered_quantity: true, received_quantity: true } });
            const orderStatus = sourceLines.length > 0 && sourceLines.every((line) => line.received_quantity >= line.ordered_quantity) ? "received" : sourceLines.some((line) => line.received_quantity > 0) ? "partial" : "sent";
            await tx.purchase_orders.update({ where: { id: orderId }, data: { status: orderStatus, updated_at: now } });
            await tx.purchase_returns.update({ where: { id: row.id }, data: { status: "posted", posted_at: now } });
        });
        const updated = await MyGlobal.prisma.purchase_returns.findUniqueOrThrow({ where: { id: row.id } });
        return purchaseReturnDto(updated, await purchaseReturnLines(row.id));
    }
    export async function salesReturnCreate(p: FinanceBody<api.ISalesReturn.ICreate>) {
        const org = await AuthProvider.organizationId(p.actor);
        const customer = await MyGlobal.prisma.parties.findFirst({ where: { id: p.body.customerId, organization_id: org, kind: "customer", status: "active" } });
        if (customer === null)
            throw ErrorUtil.notFound("No active customer exists in the active organization.");
        if (p.body.lines.length === 0)
            throw ErrorUtil.unprocessable("A sales return requires at least one line.");
        const id = randomUUID();
        const row = await MyGlobal.prisma.$transaction(async (tx) => {
            const result = await tx.sales_returns.create({ data: { id, organization_id: org, customer_id: customer.id, number: `SRTN-${Date.now()}-${randomUUID().slice(0, 6)}`, status: "draft", created_at: new Date(), received_at: null } });
            for (const line of p.body.lines) {
                const source = await tx.shipment_lines.findUnique({ where: { id: line.shipmentLineId } });
                const shipment = source === null ? null : await tx.shipments.findFirst({ where: { id: source.shipment_id, organization_id: org, status: { in: ["shipped", "delivered"] } } });
                const order = shipment === null ? null : await tx.sales_orders.findFirst({ where: { id: shipment.order_id, organization_id: org, customer_id: customer.id } });
                const location = await tx.locations.findFirst({ where: { id: line.locationId, warehouse_id: line.warehouseId, active: true } });
                const prior = source === null ? 0 : (await tx.sales_return_lines.aggregate({ _sum: { quantity: true }, where: { shipment_line_id: source.id } }))._sum.quantity ?? 0;
                if (source === null || shipment === null || order === null || location === null || line.quantity <= 0 || line.quantity > source.quantity - prior || source.serial_code !== null && line.quantity !== 1 || (line.lotId !== undefined && line.lotId !== source.lot_id) || (line.serialCode !== undefined && line.serialCode !== source.serial_code))
                    throw ErrorUtil.conflict("Sales return exceeds the shipped remainder, mismatches tracking evidence, or uses an inactive location.");
                await tx.sales_return_lines.create({ data: { id: randomUUID(), return_id: id, shipment_line_id: source.id, item_id: source.item_id, quantity: line.quantity, restock: line.restock, warehouse_id: line.warehouseId, location_id: line.locationId, lot_id: source.lot_id, serial_code: source.serial_code, created_at: new Date() } });
            }
            return result;
        });
        return salesReturnDto(row, await salesReturnLines(id));
    }
    export async function salesReturnReceive(p: FinanceId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.sales_returns.findFirst({ where: { id: p.id, organization_id: org, status: "approved" } });
        if (row === null)
            throw ErrorUtil.conflict("Only an approved sales return can be received.");
        const lines = await MyGlobal.prisma.sales_return_lines.findMany({ where: { return_id: row.id } });
        await MyGlobal.prisma.$transaction(async (tx) => {
            let revenueReversal = 0;
            let cogsReversal = 0;
            for (const line of lines) {
                const shipmentLine = await tx.shipment_lines.findUniqueOrThrow({ where: { id: line.shipment_line_id } });
                const orderLine = await tx.sales_order_lines.findUniqueOrThrow({ where: { id: shipmentLine.order_line_id }, select: { unit_price: true } });
                const saleAmount = line.quantity * orderLine.unit_price;
                revenueReversal += saleAmount;
                const sourceMovement = await tx.stock_movements.findFirst({ where: { organization_id: org, source_type: "shipment", source_id: shipmentLine.shipment_id, item_id: line.item_id, type: "sales_shipment" }, select: { unit_cost: true } });
                const cost = line.restock ? line.quantity * (sourceMovement?.unit_cost ?? 0) : 0;
                cogsReversal += cost;
                if (line.restock)
                    await tx.stock_movements.create({ data: { id: randomUUID(), organization_id: org, item_id: line.item_id, warehouse_id: line.warehouse_id, location_id: line.location_id, type: "sales_return", quantity: line.quantity, unit_cost: sourceMovement?.unit_cost ?? 0, lot_id: line.lot_id, serial_code: line.serial_code, source_type: "sales_return", source_id: row.id, operator_membership_id: p.actor.membership_id ?? null, created_at: new Date() } });
            }
            const currency = (await tx.organizations.findUniqueOrThrow({ where: { id: org }, select: { base_currency: true } })).base_currency;
            if (revenueReversal > 0 || cogsReversal > 0)
                await JournalProvider.createPostedLines(tx, org, "sales_return", row.id, new Date(), `Sales return ${row.number}`, [{ accountCode: "4000", debit: revenueReversal, credit: 0 }, { accountCode: "1300", debit: cogsReversal, credit: 0 }, { accountCode: "1100", debit: 0, credit: revenueReversal }, { accountCode: "6000", debit: 0, credit: cogsReversal }], currency);
            await tx.sales_returns.update({ where: { id: row.id }, data: { status: "received", received_at: new Date() } });
        });
        const updated = await MyGlobal.prisma.sales_returns.findUniqueOrThrow({ where: { id: row.id } });
        return salesReturnDto(updated, await salesReturnLines(row.id));
    }
    export async function salesReturnApprove(p: FinanceId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.sales_returns.findFirst({ where: { id: p.id, organization_id: org, status: "draft" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a draft sales return can be approved.");

        return salesReturnDto(await MyGlobal.prisma.sales_returns.update({ where: { id: row.id }, data: { status: "approved" } }), await salesReturnLines(row.id));
    }
    export async function creditMemoCreate(p: FinanceBody<api.ICreditMemo.ICreate>) {
        const org = await AuthProvider.organizationId(p.actor);
        const customer = await MyGlobal.prisma.parties.findFirst({ where: { id: p.body.customerId, organization_id: org, kind: "customer", status: "active" } });
        if (customer === null)
            throw ErrorUtil.notFound("No active customer exists in the active organization.");
        if (!Number.isFinite(p.body.total) || p.body.total <= 0)
            throw ErrorUtil.unprocessable("A credit memo requires a positive finite amount.");
        if (p.body.invoiceId === undefined && p.body.salesReturnId === undefined && p.body.reason === "return")
            throw ErrorUtil.unprocessable("A return credit memo requires a sales return source.");
        if (p.body.invoiceId !== undefined && p.body.invoiceId !== null && await MyGlobal.prisma.sales_invoices.findFirst({ where: { id: p.body.invoiceId, organization_id: org, customer_id: customer.id, status: { not: "void" } } }) === null)
            throw ErrorUtil.conflict("The credit memo invoice must belong to the active customer.");
        if (p.body.salesReturnId !== undefined && p.body.salesReturnId !== null && await MyGlobal.prisma.sales_returns.findFirst({ where: { id: p.body.salesReturnId, organization_id: org, customer_id: customer.id, status: { in: ["received", "refunded"] } } }) === null)
            throw ErrorUtil.conflict("The credit memo return must belong to the active customer and be received.");
        const id = randomUUID();
        await MyGlobal.prisma.$transaction(async (tx) => { await tx.credit_memos.create({ data: { id, organization_id: org, customer_id: customer.id, number: `CM-${Date.now()}-${randomUUID().slice(0, 6)}`, status: "draft", total: p.body.total, reason: p.body.reason, created_at: new Date(), posted_at: null } }); await tx.credit_memo_lines.create({ data: { id: randomUUID(), memo_id: id, invoice_id: p.body.invoiceId ?? null, sales_return_id: p.body.salesReturnId ?? null, amount: p.body.total, created_at: new Date() } }); });
        return creditMemoView(org, id);
    }
    export async function creditMemoIndex(p: FinanceInput<api.IPage.IRequest>) { const org = await AuthProvider.organizationId(p.actor); const page = p.input.page ?? 1; const limit = p.input.limit || 100; const [records, rows] = await Promise.all([MyGlobal.prisma.credit_memos.count({ where: { organization_id: org } }), MyGlobal.prisma.credit_memos.findMany({ where: { organization_id: org }, skip: (page - 1) * limit, take: limit, orderBy: { created_at: "desc" } })]); return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: await Promise.all(rows.map((row) => creditMemoView(org, row.id))) }; }
    export async function creditMemoPost(p: FinanceId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.credit_memos.findFirst({ where: { id: p.id, organization_id: org, status: "draft" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a draft credit memo can be posted.");
        const organization = await MyGlobal.prisma.organizations.findUniqueOrThrow({ where: { id: org }, select: { base_currency: true } });
        const now = new Date();
        await MyGlobal.prisma.$transaction(async (tx) => { await JournalProvider.createPosted(tx, org, "credit_memo", row.id, now, `Credit memo ${row.number}`, "4000", "1100", row.total, organization.base_currency); await tx.credit_memos.update({ where: { id: row.id }, data: { status: "posted", posted_at: now } }); });
        return creditMemoView(org, row.id);
    }
    export async function creditMemoApply(p: FinanceIdBody<api.ICreditMemo.IApply>) {
        const org = await AuthProvider.organizationId(p.actor);
        if (!Number.isFinite(p.body.amount) || p.body.amount <= 0)
            throw ErrorUtil.unprocessable("A credit memo application must be positive and finite.");
        const memo = await MyGlobal.prisma.credit_memos.findFirst({ where: { id: p.id, organization_id: org, status: { in: ["posted", "partially_applied"] } } });
        const invoice = await MyGlobal.prisma.sales_invoices.findFirst({ where: { id: p.body.invoiceId, organization_id: org, customer_id: memo?.customer_id, status: { not: "void" } } });
        if (memo === null || invoice === null)
            throw ErrorUtil.notFound("The credit memo and invoice must belong to the active customer.");
        const applied = (await MyGlobal.prisma.credit_memo_applications.aggregate({ _sum: { amount: true }, where: { memo_id: memo.id } }))._sum.amount ?? 0;
        const invoiceApplied = (await MyGlobal.prisma.credit_memo_applications.aggregate({ _sum: { amount: true }, where: { organization_id: org, invoice_id: invoice.id } }))._sum.amount ?? 0;
        const paymentApplied = (await MyGlobal.prisma.payment_allocations.aggregate({ _sum: { amount: true }, where: { organization_id: org, invoice_id: invoice.id } }))._sum.amount ?? 0;
        if (p.body.amount > memo.total - applied || p.body.amount > invoice.total - invoiceApplied - paymentApplied)
            throw ErrorUtil.conflict("The credit memo application exceeds the remaining memo or invoice balance.");
        await MyGlobal.prisma.$transaction(async (tx) => { await tx.credit_memo_applications.create({ data: { id: randomUUID(), organization_id: org, memo_id: memo.id, invoice_id: invoice.id, amount: p.body.amount, created_at: new Date() } }); await tx.credit_memos.update({ where: { id: memo.id }, data: { status: p.body.amount + applied >= memo.total ? "applied" : "partially_applied" } }); });
        return creditMemoView(org, memo.id);
    }
    export async function creditMemoRefund(p: FinanceIdBody<api.ICreditMemo.IRefundRequest>) {
        const org = await AuthProvider.organizationId(p.actor);
        const memo = await MyGlobal.prisma.credit_memos.findFirst({ where: { id: p.id, organization_id: org, status: { in: ["posted", "partially_applied"] } } });
        if (memo === null)
            throw ErrorUtil.notFound("No refundable credit memo exists in the active organization.");
        const applied = (await MyGlobal.prisma.credit_memo_applications.aggregate({ _sum: { amount: true }, where: { memo_id: memo.id } }))._sum.amount ?? 0;
        const refunded = (await MyGlobal.prisma.credit_memo_refunds.aggregate({ _sum: { amount: true }, where: { memo_id: memo.id } }))._sum.amount ?? 0;
        const amount = p.body.amount ?? memo.total - applied - refunded;
        if (!Number.isFinite(amount) || amount <= 0 || amount > memo.total - applied - refunded)
            throw ErrorUtil.conflict("The credit memo refund exceeds its remaining balance.");

        const organization = await MyGlobal.prisma.organizations.findUniqueOrThrow({ where: { id: org }, select: { base_currency: true } });
        if (p.body.bankAccountId !== undefined && p.body.bankAccountId !== null && await MyGlobal.prisma.bank_accounts.findFirst({ where: { id: p.body.bankAccountId, organization_id: org, active: true, currency: organization.base_currency } }) === null)
            throw ErrorUtil.conflict("The refund bank account must be active and use the organization currency.");
        const now = new Date();
        await MyGlobal.prisma.$transaction(async (tx) => { const paymentId = randomUUID(); await tx.payments.create({ data: { id: paymentId, organization_id: org, party_id: memo.customer_id, direction: "outbound", amount, currency: organization.base_currency, status: "posted", bank_account_id: p.body.bankAccountId ?? null, created_at: now, posted_at: now } }); const refundId = randomUUID(); await tx.credit_memo_refunds.create({ data: { id: refundId, organization_id: org, memo_id: memo.id, amount, bank_account_id: p.body.bankAccountId ?? null, payment_id: paymentId, created_at: now } }); await JournalProvider.createPosted(tx, org, "credit_memo_refund", refundId, now, `Credit memo refund ${memo.number}`, "1100", "1000", amount, organization.base_currency); await tx.credit_memos.update({ where: { id: memo.id }, data: { status: amount + applied + refunded >= memo.total ? "settled" : "partially_applied" } }); });
        return creditMemoView(org, memo.id);
    }
    export async function creditMemoVoid(p: FinanceId) {
        const org = await AuthProvider.organizationId(p.actor);
        const memo = await MyGlobal.prisma.credit_memos.findFirst({ where: { id: p.id, organization_id: org, status: "posted" } });
        if (memo === null)
            throw ErrorUtil.conflict("Only an unused posted credit memo can be voided.");
        const applications = await MyGlobal.prisma.credit_memo_applications.count({ where: { memo_id: memo.id } });
        const refunds = await MyGlobal.prisma.credit_memo_refunds.count({ where: { memo_id: memo.id } });
        if (applications > 0 || refunds > 0)
            throw ErrorUtil.conflict("A credit memo with applications or refunds cannot be voided.");
        await MyGlobal.prisma.credit_memos.update({ where: { id: memo.id }, data: { status: "void" } });
        return creditMemoView(org, memo.id);
    }
    export async function salesReturnUpdate(p: FinanceIdBody<api.ISalesReturn.IUpdate>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.sales_returns.findFirst({ where: { id: p.id, organization_id: org, status: "draft" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a draft sales return can be edited.");
        await MyGlobal.prisma.$transaction(async (tx) => {
            await tx.sales_return_lines.deleteMany({ where: { return_id: row.id } });
            for (const line of p.body.lines) {
                const source = await tx.shipment_lines.findUnique({ where: { id: line.shipmentLineId } });
                const shipment = source === null ? null : await tx.shipments.findFirst({ where: { id: source.shipment_id, organization_id: org, status: "shipped" } });
                if (source === null || shipment === null || line.quantity <= 0 || line.quantity > source.quantity || source.serial_code !== null && line.quantity !== 1 || (line.lotId !== undefined && line.lotId !== source.lot_id) || (line.serialCode !== undefined && line.serialCode !== source.serial_code))
                    throw ErrorUtil.conflict("Sales return exceeds the shipped quantity or mismatches tracking evidence.");
                const prior = await tx.sales_return_lines.aggregate({ _sum: { quantity: true }, where: { shipment_line_id: source.id, return_id: { not: row.id } } });
                if ((prior._sum.quantity ?? 0) + line.quantity > source.quantity)
                    throw ErrorUtil.conflict("Sales return exceeds the remaining returnable quantity.");
                await tx.sales_return_lines.create({ data: { id: randomUUID(), return_id: row.id, shipment_line_id: source.id, item_id: source.item_id, quantity: line.quantity, restock: line.restock, warehouse_id: line.warehouseId, location_id: line.locationId, lot_id: source.lot_id, serial_code: source.serial_code, created_at: new Date() } });
            }
        });
        return salesReturnDto(row, await salesReturnLines(row.id));
    }
    export async function salesReturnReject(p: FinanceId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.sales_returns.findFirst({ where: { id: p.id, organization_id: org, status: "draft" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a draft sales return can be rejected.");
        return salesReturnDto(await MyGlobal.prisma.sales_returns.update({ where: { id: row.id }, data: { status: "cancelled" } }), await salesReturnLines(row.id));
    }
    export async function salesReturnRefund(p: FinanceIdBody<api.ISalesReturn.IRefund>) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.sales_returns.findFirst({ where: { id: p.id, organization_id: org, status: "received" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a received sales return can be refunded.");
        const memo = await MyGlobal.prisma.credit_memos.findFirst({ where: { id: p.body.creditMemoId, organization_id: org, customer_id: row.customer_id, status: { in: ["posted", "partially_applied", "applied", "settled"] } } });
        if (memo === null)
            throw ErrorUtil.conflict("Refund requires a posted credit memo for the return customer.");
        const linked = await MyGlobal.prisma.credit_memo_lines.findFirst({ where: { memo_id: memo.id, sales_return_id: row.id } });
        if (linked === null)
            throw ErrorUtil.conflict("The refund credit memo must be linked to this sales return.");
        if (memo.status === "posted" || memo.status === "partially_applied")
            await creditMemoRefund({ actor: p.actor, id: memo.id, body: {} });
        return salesReturnDto(await MyGlobal.prisma.sales_returns.update({ where: { id: row.id }, data: { status: "refunded" } }), await salesReturnLines(row.id));
    }
    async function validateBillLines(tx: Prisma.TransactionClient, organizationId: string, vendorId: string, lines: api.IVendorBill.ICreate.ILine[]) {
        if (lines.length === 0)
            throw ErrorUtil.unprocessable("A vendor bill requires at least one line.");
        for (const line of lines) {
            if (!Number.isFinite(line.quantity) || line.quantity <= 0 || !Number.isFinite(line.amount) || line.amount < 0 || !Number.isFinite(line.taxAmount) || line.taxAmount < 0)
                throw ErrorUtil.unprocessable("Vendor-bill quantities and amounts must be finite and valid.");
            if (line.purchaseOrderLineId === undefined || line.purchaseOrderLineId === null)
                continue;
            const source = await tx.purchase_order_lines.findUnique({ where: { id: line.purchaseOrderLineId } });
            const order = source === null ? null : await tx.purchase_orders.findFirst({ where: { id: source.order_id, organization_id: organizationId, vendor_id: vendorId } });
            if (source === null || order === null)
                throw ErrorUtil.conflict("A vendor-bill source line must belong to the selected vendor and organization.");
            if (source.item_id !== line.itemId)
                throw ErrorUtil.conflict("A vendor-bill item must match its purchase-order source line.");
        }
    }
    export async function salesReturnCancel(p: FinanceId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.sales_returns.findFirst({ where: { id: p.id, organization_id: org, status: { in: ["draft", "approved"] } } });
        if (row === null)
            throw ErrorUtil.conflict("Only a draft or approved sales return can be cancelled.");
        return salesReturnDto(await MyGlobal.prisma.sales_returns.update({ where: { id: row.id }, data: { status: "cancelled" } }), await salesReturnLines(row.id));
    }
    async function billLines(id: string) { const rows = await MyGlobal.prisma.vendor_bill_lines.findMany({ where: { bill_id: id }, orderBy: { created_at: "asc" } }); return rows.map((r) => ({ id: r.id, purchaseOrderLineId: r.purchase_order_line_id, itemId: r.item_id, quantity: r.quantity, amount: r.amount, taxAmount: r.tax_amount })); }
    async function purchaseReturnLines(id: string) { const rows = await MyGlobal.prisma.purchase_return_lines.findMany({ where: { return_id: id }, orderBy: { created_at: "asc" } }); return rows.map((r) => ({ id: r.id, orderLineId: r.order_line_id, quantity: r.quantity, warehouseId: r.warehouse_id, locationId: r.location_id, lotId: r.lot_id, serialCode: r.serial_code })); }
    async function salesReturnLines(id: string) { const rows = await MyGlobal.prisma.sales_return_lines.findMany({ where: { return_id: id }, orderBy: { created_at: "asc" } }); return rows.map((r) => ({ id: r.id, shipmentLineId: r.shipment_line_id, itemId: r.item_id, quantity: r.quantity, restock: r.restock, warehouseId: r.warehouse_id, locationId: r.location_id, lotId: r.lot_id, serialCode: r.serial_code })); }
    function billDto(r: BillRow, lines: api.IVendorBill.ILine[]) { return { id: r.id, number: r.number, vendorId: r.vendor_id, status: r.status, currency: r.currency, total: r.total, lines, postedAt: r.posted_at?.toISOString() ?? null }; }
    function purchaseReturnDto(r: PurchaseReturnRow, lines: api.IPurchaseReturn.ILine[]) { return { id: r.id, number: r.number, receiptId: r.receipt_id, status: r.status, lines, postedAt: r.posted_at?.toISOString() ?? null }; }
    function salesReturnDto(r: SalesReturnRow, lines: api.ISalesReturn.ILine[]) { return { id: r.id, number: r.number, customerId: r.customer_id, status: r.status, lines, receivedAt: r.received_at?.toISOString() ?? null }; }
    async function creditMemoView(organizationId: string, id: string): Promise<api.ICreditMemo> {
        const row = await MyGlobal.prisma.credit_memos.findFirst({ where: { id, organization_id: organizationId } });
        if (row === null)
            throw ErrorUtil.notFound("No credit memo exists in the active organization.");
        const [lines, applications, refunds] = await Promise.all([MyGlobal.prisma.credit_memo_lines.findMany({ where: { memo_id: id }, orderBy: { created_at: "asc" } }), MyGlobal.prisma.credit_memo_applications.findMany({ where: { memo_id: id }, orderBy: { created_at: "asc" } }), MyGlobal.prisma.credit_memo_refunds.findMany({ where: { memo_id: id }, orderBy: { created_at: "asc" } })]);
        const applied = applications.reduce((sum, application) => sum + application.amount, 0);
        const refunded = refunds.reduce((sum, refund) => sum + refund.amount, 0);
        return { id: row.id, number: row.number, customerId: row.customer_id, status: row.status, total: row.total, reason: row.reason as api.ICreditMemo["reason"], remainingAmount: Math.max(0, row.total - applied - refunded), postedAt: row.posted_at?.toISOString() ?? null, lines: lines.map((line) => ({ id: line.id, invoiceId: line.invoice_id, salesReturnId: line.sales_return_id, amount: line.amount })), applications: applications.map((application) => ({ id: application.id, invoiceId: application.invoice_id, amount: application.amount })), refunds: refunds.map((refund) => ({ id: refund.id, amount: refund.amount, bankAccountId: refund.bank_account_id, refundedAt: refund.created_at.toISOString() })) };
    }
}
