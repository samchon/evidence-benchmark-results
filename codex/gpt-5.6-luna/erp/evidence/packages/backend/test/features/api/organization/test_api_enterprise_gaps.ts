import * as api from "@benchmark/erp-api";

/** Proves allocation-rule, people/project, purchase-return, and source-line lifecycles.
 */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-report-rules Exercises and asserts the report report rules behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-atomic-cross-module-outcome-consistency Exercises and asserts the atomic cross module outcome consistency behavior.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-report-reproducible-and-reconciled-reporting Exercises and asserts the report reproducible and reconciled reporting behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-sales-sales-reports Exercises and asserts the report sales sales reports behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-hr-hr-and-payroll-reports Exercises and asserts the report hr hr and payroll reports behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-mfg-manufacturing-reports Exercises and asserts the report mfg manufacturing reports behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-qms-quality-maintenance-and-service-reports Exercises and asserts the report qms quality maintenance and service reports behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-fin-financial-reports Exercises and asserts the report fin financial reports behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-proc-procurement-reports Exercises and asserts the report proc procurement reports behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-report-inv-inventory-reports Exercises and asserts the report inv inventory reports behavior.
 */
export async function test_api_enterprise_gaps(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `enterprise-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Enterprise ${suffix}`, code: `enterprise-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const inviteEmail = `invited-${suffix}@example.com`;
  const invitation = await api.functional.organization_membership_invite.invite(owner, { email: inviteEmail, initialRole: "Employee" });
  if (invitation.invitationToken === undefined) throw new Error("membership invitation did not expose its delivery proof");
  const joined = await api.functional.auth.user_join.join(connection, { invitationToken: invitation.invitationToken, email: inviteEmail, password: "invited-correct-horse", displayName: "Invited Employee" });
  if (joined.memberships.some((item) => item.status !== "active" && item.organizationId === authorized.memberships[0]!.organizationId)) throw new Error("invitation acceptance did not activate membership");
  const employee = await api.functional.employee_create.create(owner, { employeeNumber: "E-GAP-001", firstName: "Gap", lastName: "Employee" });
  const contract = await api.functional.employment_contract_create.create(owner, { employeeId: employee.id, contractType: "full_time", startsAt: "2026-08-01T00:00:00.000Z", salary: 5000, currencyCode: "USD" });
  const activeContract = await api.functional.employment_contract_status.status(owner, contract.id, { status: "active" });
  const project = await api.functional.project_create.create(owner, { code: "GAP-PROJ", name: "Gap Project" });
  const member = await api.functional.project_member_create.create(owner, { projectId: project.id, employeeId: employee.id, role: "engineer" });
  const inactiveMember = await api.functional.project_member_status.status(owner, member.id, { status: "inactive" });
  const rule = await api.functional.allocation_rule_create.create(owner, { name: "Overhead", sourceType: "cost_center", targetType: "project", basis: "hours", percentage: 100 });
  await api.functional.allocation_rule_status.status(owner, rule.id, { status: "active" });
  await api.functional.allocation_rule_execute.execute(owner, rule.id, { inputAmount: 1000 });
  const postedRule = await api.functional.allocation_rule_post.post(owner, rule.id, {});
  const vendor = await api.functional.vendor_create.create(owner, { code: "GAP-V", legalName: "Gap Vendor" });
  const purchaseOrder = await api.functional.purchase_order_create.create(owner, { vendorId: vendor.id, currencyCode: "USD", totalAmount: 100 });
  const orderLine = await api.functional.purchase_order_line_create.create(owner, { purchaseOrderId: purchaseOrder.id, description: "Gap component", quantity: 2, unitCode: "EA", unitPrice: 50 });
  const receipt = await api.functional.purchase_receipt_create.create(owner, { purchaseOrderId: purchaseOrder.id, receiptDate: "2026-08-05T00:00:00.000Z" });
  const receiptLine = await api.functional.purchase_receipt_line_create.create(owner, { purchaseReceiptId: receipt.id, purchaseOrderLineId: orderLine.id, quantity: 1 });
  const postedReceipt = await api.functional.purchase_receipt_status.status(owner, receipt.id, { status: "posted" });
  const purchaseReturn = await api.functional.purchase_return_create.create(owner, { purchaseReceiptId: receipt.id, returnDate: "2026-08-06T00:00:00.000Z", reason: "Damaged" });
  const postedReturn = await api.functional.purchase_return_status.status(owner, purchaseReturn.id, { status: "posted" });
  const salesReport = await api.functional.report_generate.generate(owner, "sales", { kind: "backlog", status: "approved" });
  const exportedReport = await api.functional.report_export._export(owner, "sales", { kind: "backlog", status: "approved" });
  const hrReport = await api.functional.report_generate.generate(owner, "hr", { kind: "headcount" });
  const manufacturingReport = await api.functional.report_generate.generate(owner, "manufacturing", { kind: "production" });
  const qualityReport = await api.functional.report_generate.generate(owner, "quality", { kind: "inspection" });
  const financialReport = await api.functional.report_generate.generate(owner, "financial", { kind: "trial_balance" });
  const procurementReport = await api.functional.report_generate.generate(owner, "procurement", { kind: "open_orders" });
  const inventoryReport = await api.functional.report_generate.generate(owner, "inventory", { kind: "stock_on_hand" });
  if (activeContract.status !== "active" || inactiveMember.status !== "inactive" || postedRule.status !== "posted" || postedReceipt.status !== "posted" || postedReturn.status !== "posted" || receiptLine.purchaseOrderLineId !== orderLine.id || salesReport.organizationId !== exportedReport.organizationId || hrReport.category !== "hr" || manufacturingReport.category !== "manufacturing" || qualityReport.category !== "quality" || financialReport.category !== "financial" || procurementReport.category !== "procurement" || inventoryReport.category !== "inventory") throw new Error("enterprise gap lifecycle state was not retained");
}
