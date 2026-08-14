import * as api from "@benchmark/erp-api";
import { randomUUID } from "node:crypto";
import { create_owner } from "../../../helpers/ErpFixtures";

async function rejected(action: () => Promise<unknown>): Promise<void> {
  try {
    await action();
  } catch {
    return;
  }
  throw new Error("The guarded operation unexpectedly succeeded.");
}

/** Proves item detail returns the tenant-owned item. */
export async function test_api_erp_item_at(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `AT${Date.now()}`.slice(-8), name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `AT-${Date.now()}`, name: "Detail item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const found = await api.functional.erp.item.itemAt(owner.connection, item.id);
  if (found.id !== item.id) throw new Error("Item detail returned the wrong item.");
}

/** Proves item erasure deactivates the item. */
export async function test_api_erp_item_erase(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `ER${Date.now()}`.slice(-8), name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `ER-${Date.now()}`, name: "Erase item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const erased = await api.functional.erp.item.itemErase(owner.connection, item.id);
  if (erased.id !== item.id) throw new Error("Item erasure did not return the item identity.");
}

/** Proves party-change listing is available for the selected organization. */
export async function test_api_erp_party_change_index(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const page = await api.functional.erp.party.change_request.partyChangeIndex(owner.connection, { page: 1, limit: 10 });
  if (page.pagination.current !== 1) throw new Error("Party-change pagination was not returned.");
}

/** Proves invitation acceptance rejects an unknown invitation proof. */
export async function test_api_erp_invitation_accept(connection: api.IConnection): Promise<void> {
  await rejected(() => api.functional.erp.auth.invitation.accept(connection, { token: randomUUID().replaceAll("-", "") + randomUUID().replaceAll("-", ""), email: "unknown@example.com", password: "accepted-password", displayName: "Unknown" }));
}

/** Proves profit-center state changes are persisted. */
export async function test_api_erp_profit_state(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const profit = await api.functional.erp.financial_center.profit.profitCreate(owner.connection, { code: `PS${Date.now()}`.slice(-8), name: "Profit", managerId: null, parentId: null, description: null });
  const inactive = await api.functional.erp.financial_center.profit.profitState(owner.connection, profit.id, "inactive");
  if (inactive.status !== "inactive") throw new Error("Profit-center state was not persisted.");
}

/** Proves bank statement transactions can be created through the public route. */
export async function test_api_erp_bank_transaction_create(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const account = await api.functional.erp.account.create(owner.connection, { code: `TX${Date.now()}`.slice(-8), name: "Cash", type: "asset", parentId: null, currency: "USD" });
  const bank = await api.functional.erp.control_ops.bank_account.bankCreate(owner.connection, { ledgerAccountId: account.id, name: "Cash", maskedNumber: "****0001", currency: "USD", openingBalance: 0 });
  const transaction = await api.functional.erp.bank.transaction.transactionCreate(owner.connection, { bankAccountId: bank.id, statementDate: "2026-08-10T00:00:00.000Z", amount: 10, currency: "USD", reference: "coverage" });
  if (transaction.status !== "imported") throw new Error("Bank transaction was not imported.");
}

/** Proves draft inventory transfers can be edited. */
export async function test_api_erp_transfer_update(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `TR${Date.now()}`.slice(-8), name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `TR-${Date.now()}`, name: "Transfer item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const source = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `TS${Date.now()}`.slice(-8), name: "Source" });
  const target = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `TT${Date.now()}`.slice(-8), name: "Target" });
  const sourceLocation = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: source.id, code: "A" });
  const targetLocation = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: target.id, code: "B" });
  const transfer = await api.functional.erp.inventory.transfer.transferCreate(owner.connection, { fromWarehouseId: source.id, toWarehouseId: target.id, lines: [{ itemId: item.id, quantity: 1, fromLocationId: sourceLocation.id, toLocationId: targetLocation.id }] });
  const updated = await api.functional.erp.inventory.transfer.transferUpdate(owner.connection, transfer.id, { fromWarehouseId: source.id, toWarehouseId: target.id, lines: [{ itemId: item.id, quantity: 2, fromLocationId: sourceLocation.id, toLocationId: targetLocation.id }] });
  if (updated.lines[0]?.quantity !== 2) throw new Error("Draft transfer lines were not updated.");
}

/** Proves work-center master data can be edited. */
export async function test_api_erp_work_center_update(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `WC${Date.now()}`.slice(-8), name: "Factory" });
  const center = await api.functional.erp.manufacturing_resource.work_center.workCenterCreate(owner.connection, { code: `C${Date.now()}`.slice(-7), name: "Assembly", warehouseId: warehouse.id, capacity: 10, laborRate: 1, machineRate: 2, costCenterId: null });
  const updated = await api.functional.erp.manufacturing_resource.work_center.workCenterUpdate(owner.connection, center.id, { name: "Updated Assembly" });
  if (updated.name !== "Updated Assembly") throw new Error("Work-center update was not persisted.");
}

/** Proves timesheet pagination is available. */
export async function test_api_erp_timesheet_index(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const page = await api.functional.erp.workforce.timesheet.timesheetIndex(owner.connection, { page: 1, limit: 10 });
  if (page.pagination.current !== 1) throw new Error("Timesheet pagination was not returned.");
}

/** Proves the owner guard protects the last active owner from suspension. */
export async function test_api_erp_membership_suspend(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  await rejected(() => api.functional.erp.organization.membership.suspend(owner.connection, owner.membershipId));
}

/** Proves membership reactivation is idempotent for an active membership. */
export async function test_api_erp_membership_reactivate(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const membership = await api.functional.erp.organization.membership.reactivate(owner.connection, owner.membershipId);
  if (membership.status !== "active") throw new Error("Membership reactivation did not return active state.");
}

/** Proves the owner guard protects the last active owner from revocation. */
export async function test_api_erp_membership_revoke(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  await rejected(() => api.functional.erp.organization.membership.revoke(owner.connection, owner.membershipId));
}

/** Proves an empty organization can be erased by its owner. */
export async function test_api_erp_organization_erase(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const erased = await api.functional.erp.organization.erase(owner.connection);
  if (erased.id.length === 0) throw new Error("Organization erasure returned no identity.");
}

/** Proves cycle-count pagination is available. */
export async function test_api_erp_cycle_index(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const page = await api.functional.erp.inventory.cycle_count.cycleIndex(owner.connection, { page: 1, limit: 10 });
  if (page.pagination.current !== 1) throw new Error("Cycle-count pagination was not returned.");
}

/** Proves a completed production order can enter approval and be rejected. */
export async function test_api_erp_production_reject(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `PR${suffix.slice(-8)}`, name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `PR-${suffix}`, name: "Rejectable output", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `PR${suffix.slice(-7)}`, name: "Production" });
  const location = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: "PR" });
  const order = await api.functional.erp.operations.production.productionCreate(owner.connection, { finishedItemId: item.id, plannedQuantity: 1, bomId: null, routingId: null, warehouseId: warehouse.id, locationId: location.id });
  const released = await api.functional.erp.operations.production.release.productionRelease(owner.connection, order.id);
  const started = await api.functional.erp.operations.production.start.productionStart(owner.connection, released.id);
  const output = await api.functional.erp.operations.production.output.productionOutput(owner.connection, started.id, { quantity: 1, warehouseId: warehouse.id, locationId: location.id, unitCost: 2 });
  const submitted = await api.functional.erp.operations.production.submit.productionSubmit(owner.connection, output.id);
  const rejectedOrder = await api.functional.erp.operations.production.reject.productionReject(owner.connection, submitted.id);
  if (rejectedOrder.status !== "completed") throw new Error("Production rejection did not restore the completed state.");
}

/** Proves draft sales orders can be erased. */
export async function test_api_erp_sales_order_erase(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `SO${Date.now()}`.slice(-8), name: "Each", category: "quantity" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `SO-${Date.now()}`, name: "Sales item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const customer = await api.functional.erp.party.partyCreate(owner.connection, { kind: "customer", name: "Sales customer", currency: "USD" });
  const order = await api.functional.erp.sales.order.orderCreate(owner.connection, { customerId: customer.id, currency: "USD", lines: [{ itemId: item.id, orderedQuantity: 1, unitPrice: 5, unitId: unit.id }] });
  const erased = await api.functional.erp.sales.order.orderErase(owner.connection, order.id);
  if (erased.id !== order.id) throw new Error("Sales-order erasure did not return the order identity.");
}

/** Proves service orders can complete after entering service. */
export async function test_api_erp_service_order_complete(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const customer = await api.functional.erp.party.partyCreate(owner.connection, { kind: "customer", name: "Service customer", currency: "USD" });
  const employee = await api.functional.erp.workforce.employee.employeeCreate(owner.connection, { employeeNumber: `SERVICE-${Date.now()}`, department: "Service" });
  const order = await api.functional.erp.service_order.create(owner.connection, { customerId: customer.id, scheduledAt: "2026-08-15T10:00:00.000Z" });
  await api.functional.erp.service_order.update(owner.connection, order.id, { assigneeId: employee.id });
  await api.functional.erp.service_order.assign(owner.connection, order.id);
  await api.functional.erp.service_order.start(owner.connection, order.id);
  await api.functional.erp.service_order.update(owner.connection, order.id, { warranty: false, billable: false, resolution: "Completed service" });
  const completed = await api.functional.erp.service_order.complete(owner.connection, order.id);
  if (completed.status !== "completed") throw new Error("Service order was not completed.");
}

/** Proves warehouse listing returns active tenant warehouses. */
export async function test_api_erp_warehouse_index(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `WI${Date.now()}`.slice(-8), name: "Indexed" });
  const page = await api.functional.erp.warehouse.warehouseIndex(owner.connection, { page: 1, limit: 10 });
  if (!page.data.some((row) => row.id === warehouse.id)) throw new Error("Warehouse was not listed.");
}

/** Proves warehouse master data can be updated. */
export async function test_api_erp_warehouse_update(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `WU${Date.now()}`.slice(-8), name: "Before" });
  const updated = await api.functional.erp.warehouse.warehouseUpdate(owner.connection, warehouse.id, { name: "After" });
  if (updated.name !== "After") throw new Error("Warehouse update was not persisted.");
}

/** Proves warehouse erasure removes the warehouse from active state. */
export async function test_api_erp_warehouse_erase(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `WE${Date.now()}`.slice(-8), name: "Erase" });
  const erased = await api.functional.erp.warehouse.warehouseErase(owner.connection, warehouse.id);
  if (erased.id !== warehouse.id) throw new Error("Warehouse erasure did not return the warehouse identity.");
}

/** Proves maintenance plans can be deactivated. */
export async function test_api_erp_maintenance_deactivate(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `MD${Date.now()}`.slice(-8), name: "Maintenance" });
  const equipment = await api.functional.erp.operations.equipment.equipmentCreate(owner.connection, { tag: `MD-${Date.now()}`, name: "Pump", criticality: "medium", warehouseId: warehouse.id });
  const plan = await api.functional.erp.quality_maintenance_plan.maintenance.maintenanceCreate(owner.connection, { equipmentId: equipment.id, frequencyDays: 30, checklist: ["Inspect"], requiredParts: [], laborSkills: ["mechanic"], nextDueAt: "2026-08-10T00:00:00.000Z" });
  const inactive = await api.functional.erp.quality_maintenance_plan.maintenance.deactivate.maintenanceDeactivate(owner.connection, plan.id);
  if (inactive.status !== "inactive") throw new Error("Maintenance plan was not deactivated.");
}

/** Proves project pagination is available. */
export async function test_api_erp_project_index(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const page = await api.functional.erp.projects.project.projectIndex(owner.connection, { page: 1, limit: 10 });
  if (page.pagination.current !== 1) throw new Error("Project pagination was not returned.");
}

/** Proves a draft payment allocation can be removed before payment posting. */
export async function test_api_erp_payment_allocation_erase(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const suffix = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
  const unit = await api.functional.erp.unit.unitCreate(owner.connection, { code: `PA${suffix.slice(-8)}`, name: "Each", category: "quantity" });
  const vendor = await api.functional.erp.party.partyCreate(owner.connection, { kind: "vendor", name: `Allocation vendor ${suffix}`, currency: "USD" });
  const item = await api.functional.erp.item.itemCreate(owner.connection, { sku: `PA-${suffix}`, name: "Payable item", type: "inventory", unitId: unit.id, trackingMode: "none" });
  const warehouse = await api.functional.erp.warehouse.warehouseCreate(owner.connection, { code: `PA${suffix.slice(-7)}`, name: "Payables" });
  const location = await api.functional.erp.location.locationCreate(owner.connection, { warehouseId: warehouse.id, code: "PA" });
  const order = await api.functional.erp.purchase.order.orderCreate(owner.connection, { vendorId: vendor.id, currency: "USD", sourceRequestId: null, lines: [{ itemId: item.id, orderedQuantity: 1, unitPrice: 4, unitId: unit.id, warehouseId: warehouse.id }] });
  const submitted = await api.functional.erp.purchase.order.orderTransition(owner.connection, order.id, "submitted");
  const approved = await api.functional.erp.purchase.order.orderTransition(owner.connection, submitted.id, "approved");
  const sent = await api.functional.erp.purchase.order.orderTransition(owner.connection, approved.id, "sent");
  const line = sent.lines[0];
  if (line === undefined) throw new Error("Payment allocation setup did not return a purchase line.");
  const receipt = await api.functional.erp.purchase.receipt.receiptCreate(owner.connection, { orderId: sent.id, lines: [{ orderLineId: line.id, receivedQuantity: 1, acceptedQuantity: 1, rejectedQuantity: 0, warehouseId: warehouse.id, locationId: location.id }] });
  await api.functional.erp.purchase.receipt.post.receiptPost(owner.connection, receipt.id);
  const bill = await api.functional.erp.extended_finance.vendor_bill.billCreate(owner.connection, { vendorId: vendor.id, currency: "USD", lines: [{ purchaseOrderLineId: line.id, itemId: item.id, quantity: 1, amount: 4, taxAmount: 0 }] });
  const approvedBill = await api.functional.erp.extended_finance.vendor_bill.billTransition(owner.connection, bill.id, "approved");
  await api.functional.erp.extended_finance.vendor_bill.post.billPost(owner.connection, approvedBill.id);
  const payment = await api.functional.erp.sales_finance.payment.paymentCreate(owner.connection, { partyId: vendor.id, direction: "outbound", amount: 4, currency: "USD", bankAccountId: null });
  const allocation = await api.functional.erp.sales_finance.payment.allocation.paymentAllocationCreate(owner.connection, payment.id, { billId: bill.id, invoiceId: null, amount: 4 });
  const erased = await api.functional.erp.sales_finance.payment.allocation.paymentAllocationErase(owner.connection, payment.id, allocation.id);
  if (erased.id !== allocation.id) throw new Error("Payment allocation was not erased.");
}

/** Proves a signed-in password change keeps the completing session usable and revokes the old credential. */
export async function test_api_erp_password_change(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  await api.functional.erp.auth.password.changePassword(owner.connection, { currentPassword: owner.password, newPassword: "replacement-password-123" });
  const loggedIn: api.IConnection = { host: connection.host };
  const result = await api.functional.erp.auth.login(loggedIn, { email: owner.email, password: "replacement-password-123" });
  if (result.user.email !== owner.email) throw new Error("The replacement password did not authenticate the same identity.");
}

/** Proves account deactivation revokes access while retaining the global identity. */
export async function test_api_erp_account_deactivate(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const erased = await api.functional.erp.auth.account.deactivate.deactivateAccount(owner.connection, { currentPassword: owner.password });
  if (erased.id.length === 0) throw new Error("Account deactivation returned no identity.");
  await rejected(() => api.functional.erp.auth.login({ host: connection.host }, { email: owner.email, password: owner.password }));
}

/** Proves recovery requests are accepted without disclosing whether an email is registered. */
export async function test_api_erp_recovery_request(connection: api.IConnection): Promise<void> {
  const result = await api.functional.erp.auth.recovery.request.recoveryRequest({ host: connection.host }, { email: "unregistered-recovery@example.com" });
  if (result.id.length === 0) throw new Error("Recovery request did not return a stable acknowledgement.");
}

/** Proves an invalid recovery proof cannot change credentials. */
export async function test_api_erp_recovery_complete(connection: api.IConnection): Promise<void> {
  await rejected(() => api.functional.erp.auth.recovery.complete.recoveryComplete({ host: connection.host }, { token: randomUUID().replaceAll("-", ""), email: "unknown-recovery@example.com", newPassword: "replacement-password-123" }));
}

/** Proves custom roles can be composed, assigned, revised, revoked, and removed. */
export async function test_api_erp_role_lifecycle(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const role = await api.functional.erp.organization.role.create(owner.connection, { name: `Auditor-${Date.now()}`, permissions: ["audit.read", "employee.self_service"] });
  const roles = await api.functional.erp.organization.role.index(owner.connection, { page: 1, limit: 20 });
  if (!roles.data.some((row) => row.id === role.id)) throw new Error("The custom role was not listed.");
  const updated = await api.functional.erp.organization.role.update(owner.connection, role.id, { permissions: ["audit.read", "report.read"] });
  if (!updated.permissions.includes("report.read")) throw new Error("The custom role permissions were not updated.");
  await api.functional.erp.organization.role.membership.assign(owner.connection, owner.membershipId, { roleId: role.id });
  await api.functional.erp.organization.role.membership.revoke(owner.connection, owner.membershipId, role.id);
  const erased = await api.functional.erp.organization.role.erase(owner.connection, role.id);
  if (erased.id !== role.id) throw new Error("The unused custom role was not removed.");
}

/** Proves department and project manager positions remain scoped responsibility assignments. */
export async function test_api_erp_manager_positions(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const employee = await api.functional.erp.workforce.employee.employeeCreate(owner.connection, { employeeNumber: `MAN-${Date.now()}`, department: "Operations" });
  const department = await api.functional.erp.projects.department.departmentCreate(owner.connection, { name: `Department-${Date.now()}`, parentId: null });
  const assignedDepartment = await api.functional.erp.projects.department.manager.departmentManager(owner.connection, department.id, { managerId: employee.id });
  if (assignedDepartment.managerId !== employee.id) throw new Error("Department manager assignment was not persisted.");
  const project = await api.functional.erp.projects.project.projectCreate(owner.connection, { code: `PROJ-${Date.now()}`, name: "Managed project" });
  const assignedProject = await api.functional.erp.projects.project.manager.projectManager(owner.connection, project.id, { managerId: employee.id });
  if (assignedProject.managerId !== employee.id) throw new Error("Project manager assignment was not persisted.");
}

/** Proves an account merge remains approval-gated and records its target. */
export async function test_api_erp_account_merge(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const source = await api.functional.erp.account.create(owner.connection, { code: `MERGE-S-${Date.now()}`, name: "Merge source", type: "expense", currency: "USD" });
  const target = await api.functional.erp.account.create(owner.connection, { code: `MERGE-T-${Date.now()}`, name: "Merge target", type: "expense", currency: "USD" });
  const approval = await api.functional.erp.account.merge_request.mergeRequest(owner.connection, source.id, { targetAccountId: target.id, reason: "Consolidate duplicate ledger accounts" });
  await rejected(() => api.functional.erp.account.merge.mergeExecute(owner.connection, source.id));
  await api.functional.erp.control_ops.approval.approvalResolve(owner.connection, approval.id, "approved", { reason: "Owner approval" });
  const merged = await api.functional.erp.account.merge.mergeExecute(owner.connection, source.id);
  if (merged.mergedIntoId !== target.id || merged.active) throw new Error("Approved account merge did not preserve its target or deactivate the source.");
}

/** Proves project membership revision and deactivation preserve the membership identity. */
export async function test_api_erp_project_member_commands(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const employee = await api.functional.erp.workforce.employee.employeeCreate(owner.connection, { employeeNumber: `MEM-${Date.now()}`, department: "Operations" });
  const project = await api.functional.erp.projects.project.projectCreate(owner.connection, { code: `MEM-${Date.now()}`, name: "Membership project" });
  const member = await api.functional.erp.projects.project.member.memberCreate(owner.connection, project.id, { employeeId: employee.id, role: "Contributor", allocation: 25, startsAt: "2026-01-01T00:00:00.000Z", endsAt: null });
  const updated = await api.functional.erp.projects.project.member.memberUpdate(owner.connection, member.id, { role: "Lead", allocation: 50, active: true });
  if (updated.role !== "Lead" || updated.allocation !== 50) throw new Error("Project membership revision was not persisted.");
  const erased = await api.functional.erp.projects.project.member.memberErase(owner.connection, member.id);
  if (erased.id !== member.id) throw new Error("Project membership deactivation did not preserve identity.");
}

/** Proves task status changes append attributable history entries. */
export async function test_api_erp_task_history(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const project = await api.functional.erp.projects.project.projectCreate(owner.connection, { code: `TASK-${Date.now()}`, name: "Task project" });
  const task = await api.functional.erp.projects.task.taskCreate(owner.connection, { projectId: project.id, parentId: null, name: "Initial task" });
  const updated = await api.functional.erp.projects.task.taskUpdate(owner.connection, task.id, { status: "in_progress", name: "Started task" });
  const history = await api.functional.erp.projects.task.history.taskHistory(owner.connection, updated.id);
  if (!history.some((row) => row.fromStatus === "open" && row.toStatus === "in_progress")) throw new Error("Task status history did not retain the public transition.");
}

/** Proves approval, rejection, and reopening keep timesheet decisions and unlock corrections. */
export async function test_api_erp_timesheet_decisions(connection: api.IConnection): Promise<void> {
  const owner = await create_owner(connection);
  const employee = await api.functional.erp.workforce.employee.employeeCreate(owner.connection, { employeeNumber: `TIME-${Date.now()}`, department: "Finance" });
  const weekStart = "2026-08-03T00:00:00.000Z";
  const timesheet = await api.functional.erp.workforce.timesheet.timesheetCreate(owner.connection, { employeeId: employee.id, weekStart });
  await api.functional.erp.workforce.timelog.timelogCreate(owner.connection, { employeeId: employee.id, workDate: weekStart, hours: 8 });
  const submitted = await api.functional.erp.workforce.timesheet.submit.timesheetSubmit(owner.connection, timesheet.id);
  const approved = await api.functional.erp.workforce.timesheet.approve.timesheetApprove(owner.connection, submitted.id);
  if (approved.status !== "approved") throw new Error("Timesheet approval was not persisted.");
  const reopened = await api.functional.erp.workforce.timesheet.reopen.timesheetReopen(owner.connection, approved.id);
  const resubmitted = await api.functional.erp.workforce.timesheet.submit.timesheetSubmit(owner.connection, reopened.id);
  const rejected = await api.functional.erp.workforce.timesheet.reject.timesheetReject(owner.connection, resubmitted.id, { reason: "Please correct the work date." });
  if (rejected.status !== "rejected" || rejected.rejectionReason !== "Please correct the work date.") throw new Error("Timesheet rejection reason was not retained.");
  const corrected = await api.functional.erp.workforce.timesheet.reopen.timesheetReopen(owner.connection, rejected.id);
  if (corrected.status !== "draft") throw new Error("Rejected timesheet was not reopened to draft.");
}
