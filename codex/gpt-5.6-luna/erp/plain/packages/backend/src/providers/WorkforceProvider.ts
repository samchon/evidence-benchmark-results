import type * as api from "@benchmark/erp-api";
import { randomUUID } from "node:crypto";
import { AuthProvider } from "./AuthProvider";
import { ErrorUtil } from "../utils/ErrorUtil";
import { MyGlobal } from "../MyGlobal";
import { JournalProvider } from "./JournalProvider";
import type { ErpPayload } from "../decorators/ErpAuth";
import type { employees, employment_contracts, payslips, payroll_runs, timesheets, timelogs } from "../prisma/client";
type WorkforceId = { actor: ErpPayload; id: string }; type WorkforceBody<T> = { actor: ErpPayload; body: T }; type WorkforceIdBody<T> = WorkforceId & { body: T }; type WorkforceInput<T> = { actor: ErpPayload; input: T }; type TimesheetReject = WorkforceId & { reason: string }; type EmployeeRow = employees; type ContractRow = employment_contracts; type TimelogRow = timelogs; type TimesheetRow = timesheets; type PayrollRow = payroll_runs; type PayslipRow = payslips;
/** Employee, timesheet, and payroll lifecycle operations. */
export namespace WorkforceProvider {
    async function validatePlacement(organizationId: string, departmentId: string | null | undefined, managerId: string | null | undefined, costCenterId: string | null | undefined, hireDate: Date | null | undefined, terminationDate: Date | null | undefined) {
        if (departmentId !== undefined && departmentId !== null && await MyGlobal.prisma.departments.findFirst({ where: { id: departmentId, organization_id: organizationId, active: true } }) === null)
            throw ErrorUtil.notFound("The employee department is not active in the organization.");
        if (costCenterId !== undefined && costCenterId !== null && await MyGlobal.prisma.cost_centers.findFirst({ where: { id: costCenterId, organization_id: organizationId, status: "active" } }) === null)
            throw ErrorUtil.notFound("The employee cost center is not active in the organization.");
        if (managerId !== undefined && managerId !== null && await MyGlobal.prisma.employees.findFirst({ where: { id: managerId, organization_id: organizationId, status: "active" } }) === null)
            throw ErrorUtil.notFound("The employee manager is not active in the organization.");
        if (hireDate !== undefined && hireDate !== null && !Number.isFinite(hireDate.getTime()))
            throw ErrorUtil.unprocessable("Hire date must be valid.");
        if (terminationDate !== undefined && terminationDate !== null && !Number.isFinite(terminationDate.getTime()))
            throw ErrorUtil.unprocessable("Termination date must be valid.");
        if (hireDate !== undefined && hireDate !== null && terminationDate !== undefined && terminationDate !== null && terminationDate < hireDate)
            throw ErrorUtil.unprocessable("Termination date cannot precede hire date.");
    }
    export async function employeeCreate(p: WorkforceBody<api.IEmployee.ICreate>) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        await AuthProvider.requireAnyRole(p.actor, ["Owner", "HR Manager"], "Only an HR Manager may create an employee.");
        const userId = p.body.userId ?? p.actor.id;
        const member = await MyGlobal.prisma.memberships.findFirst({ where: { organization_id: organizationId, user_id: userId, status: "active" } });
        if (member === null)
            throw ErrorUtil.notFound("The employee must reference an active member of the organization.");
        const existing = await MyGlobal.prisma.employees.findFirst({ where: { organization_id: organizationId, user_id: userId } });
        if (existing !== null)
            throw ErrorUtil.conflict("This organization member already has an employee placement.");
        const hireDate = p.body.hireDate === undefined || p.body.hireDate === null ? null : new Date(p.body.hireDate);
        await validatePlacement(organizationId, p.body.departmentId, p.body.managerId, p.body.costCenterId, hireDate, null);
        const row = await MyGlobal.prisma.employees.create({ data: { id: randomUUID(), organization_id: organizationId, user_id: userId, employee_number: p.body.employeeNumber, department: p.body.department ?? null, department_id: p.body.departmentId ?? null, position: p.body.position ?? null, manager_id: p.body.managerId ?? null, cost_center_id: p.body.costCenterId ?? null, employment_type: p.body.employmentType ?? null, status: "active", hire_date: hireDate, termination_date: null, payroll_settings: JSON.stringify(p.body.payrollSettings ?? {}), visibility_scope: p.body.visibilityScope ?? "self_and_hr", created_at: new Date(), updated_at: new Date() } });
        return employee(row);
    }
    export async function employeeIndex(p: WorkforceInput<api.IEmployee.IIndex>) { const organizationId = await AuthProvider.organizationId(p.actor); const canViewAll = await AuthProvider.hasAnyRole(p.actor, ["Owner", "HR Manager"]); const page = p.input.page ?? 1; const limit = p.input.limit || 100; const users = p.input.search === undefined ? [] : await MyGlobal.prisma.users.findMany({ where: { OR: [{ display_name: { contains: p.input.search } }, { email: { contains: p.input.search } }] }, select: { id: true } }); const ownScope = canViewAll ? {} : { user_id: p.actor.id }; const where = { organization_id: organizationId, ...ownScope, ...(p.input.search === undefined ? {} : { OR: [{ employee_number: { contains: p.input.search } }, { user_id: { in: users.map((user) => user.id) } }] }), ...(p.input.departmentId === undefined ? {} : { department_id: p.input.departmentId }), ...(p.input.position === undefined ? {} : { position: { contains: p.input.position } }), ...(p.input.managerId === undefined ? {} : { manager_id: p.input.managerId }), ...(p.input.costCenterId === undefined ? {} : { cost_center_id: p.input.costCenterId }), ...(p.input.employmentType === undefined ? {} : { employment_type: p.input.employmentType }), ...(p.input.status === undefined ? {} : { status: p.input.status }), ...(p.input.visibilityScope === undefined ? {} : { visibility_scope: p.input.visibilityScope }) }; const [records, rows] = await Promise.all([MyGlobal.prisma.employees.count({ where }), MyGlobal.prisma.employees.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { employee_number: "asc" } })]); return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(employee) }; }
    export async function employeeUpdate(p: WorkforceIdBody<api.IEmployee.IUpdate>) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        await AuthProvider.requireAnyRole(p.actor, ["Owner", "HR Manager"], "Only an HR Manager may update an employee.");
        const row = await MyGlobal.prisma.employees.findFirst({ where: { id: p.id, organization_id: organizationId } });
        if (row === null)
            throw ErrorUtil.notFound("No employee exists in the active organization.");
        const hireDate = p.body.hireDate === undefined ? row.hire_date : p.body.hireDate === null ? null : new Date(p.body.hireDate);
        const terminationDate = p.body.terminationDate === undefined ? row.termination_date : p.body.terminationDate === null ? null : new Date(p.body.terminationDate);
        await validatePlacement(organizationId, p.body.departmentId === undefined ? row.department_id : p.body.departmentId, p.body.managerId === undefined ? row.manager_id : p.body.managerId, p.body.costCenterId === undefined ? row.cost_center_id : p.body.costCenterId, hireDate, terminationDate);
        return employee(await MyGlobal.prisma.employees.update({ where: { id: row.id }, data: { department: p.body.department === undefined ? row.department : p.body.department, department_id: p.body.departmentId ?? undefined, position: p.body.position ?? undefined, manager_id: p.body.managerId ?? undefined, cost_center_id: p.body.costCenterId ?? undefined, employment_type: p.body.employmentType ?? undefined, status: p.body.status ?? row.status, hire_date: p.body.hireDate === undefined ? undefined : p.body.hireDate === null ? null : new Date(p.body.hireDate), termination_date: p.body.terminationDate === undefined ? undefined : p.body.terminationDate === null ? null : new Date(p.body.terminationDate), payroll_settings: p.body.payrollSettings === undefined ? undefined : JSON.stringify(p.body.payrollSettings), visibility_scope: p.body.visibilityScope ?? undefined, updated_at: new Date() } }));
    }

    export async function contractCreate(p: WorkforceBody<api.IEmploymentContract.ICreate>) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        const employee = await MyGlobal.prisma.employees.findFirst({ where: { id: p.body.employeeId, organization_id: organizationId } });
        if (employee === null)
            throw ErrorUtil.notFound("No employee exists in the active organization.");
        if (!Number.isFinite(p.body.rate) || p.body.rate < 0)
            throw ErrorUtil.unprocessable("Contract rate must be finite and non-negative.");
        const startsAt = validDate(p.body.startsAt, "Contract start");
        const endsAt = p.body.endsAt === null || p.body.endsAt === undefined ? null : validDate(p.body.endsAt, "Contract end");
        if (endsAt !== null && endsAt < startsAt)
            throw ErrorUtil.unprocessable("A contract cannot end before it starts.");
        const row = await MyGlobal.prisma.$transaction(async (tx) => {
            const active = await tx.employment_contracts.findFirst({ where: { organization_id: organizationId, employee_id: employee.id, status: "active" }, orderBy: { starts_at: "desc" } });
            if (active !== null && active.starts_at < startsAt) {
                const end = new Date(startsAt);
                end.setUTCDate(end.getUTCDate() - 1);
                await tx.employment_contracts.update({ where: { id: active.id }, data: { ends_at: end, status: "ended" } });
            }
            else if (active !== null)
                throw ErrorUtil.conflict("The contract overlaps an existing effective contract.");
            return tx.employment_contracts.create({ data: { id: randomUUID(), organization_id: organizationId, employee_id: employee.id, starts_at: startsAt, ends_at: endsAt, rate: p.body.rate, rate_kind: p.body.rateKind, status: "active", created_by_membership_id: p.actor.membership_id!, created_at: new Date() } });
        });
        return contract(row);
    }
    export async function contractIndex(p: WorkforceInput<api.IEmploymentContract.IIndex>) { const organizationId = await AuthProvider.organizationId(p.actor); const page = p.input.page ?? 1; const limit = p.input.limit ?? 100; const employees = await MyGlobal.prisma.employees.findMany({ where: { organization_id: organizationId, ...(p.input.employeeId === undefined ? {} : { id: p.input.employeeId }) }, select: { id: true } }); const where = { organization_id: organizationId, employee_id: { in: employees.map((row) => row.id) }, ...(p.input.status === undefined ? {} : { status: p.input.status }) }; const [records, rows] = await Promise.all([MyGlobal.prisma.employment_contracts.count({ where }), MyGlobal.prisma.employment_contracts.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { starts_at: "desc" } })]); return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(contract) }; }
    export async function timesheetCreate(p: WorkforceBody<{ employeeId: string; weekStart: string }>) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        const employee = await MyGlobal.prisma.employees.findFirst({ where: { id: p.body.employeeId, organization_id: organizationId, status: "active" } });
        if (employee === null)
            throw ErrorUtil.notFound("No active employee exists in the active organization.");
        await requireTimelogAccess(p.actor, organizationId, employee.id);
        const weekStart = new Date(p.body.weekStart);
        if (!Number.isFinite(weekStart.getTime()))
            throw ErrorUtil.unprocessable("A timesheet requires a valid week start.");
        const row = await MyGlobal.prisma.timesheets.create({ data: { id: randomUUID(), organization_id: organizationId, employee_id: employee.id, week_start: weekStart, status: "draft", rejection_reason: null, created_at: new Date() } });
        return timesheetView(row, organizationId);
    }
    export async function timelogCreate(p: WorkforceBody<api.ITimelog.ICreate>) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        const employee = await MyGlobal.prisma.employees.findFirst({ where: { id: p.body.employeeId, organization_id: organizationId, status: "active" } });
        if (employee === null)
            throw ErrorUtil.notFound("No active employee exists in the active organization.");
        await requireTimelogAccess(p.actor, organizationId, employee.id);
        if (!Number.isFinite(p.body.hours) || p.body.hours <= 0)
            throw ErrorUtil.unprocessable("Timelog hours must be positive and finite.");
        if (p.body.rate !== undefined && p.body.rate !== null && (!Number.isFinite(p.body.rate) || p.body.rate < 0))
            throw ErrorUtil.unprocessable("Timelog rate must be finite and non-negative.");
        const workDate = validDate(p.body.workDate, "Timelog work date");
        const projectRow = await assignedProject(organizationId, employee.id, p.body.project, p.body.taskId, workDate);
        return timelog(await MyGlobal.prisma.timelogs.create({ data: { id: randomUUID(), organization_id: organizationId, employee_id: employee.id, work_date: workDate, hours: p.body.hours, project: projectRow?.code ?? null, task_id: p.body.taskId ?? null, description: p.body.description ?? null, billable: p.body.billable ?? false, rate: p.body.rate ?? null, locked: false, created_at: new Date() } }));
    }
    export async function timelogIndex(p: WorkforceInput<api.ITimelog.IIndex>) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        const own = await MyGlobal.prisma.employees.findFirst({ where: { organization_id: organizationId, user_id: p.actor.id }, select: { id: true } });
        const employeeId = p.input.employeeId ?? own?.id;
        if (employeeId === undefined)

            throw ErrorUtil.forbidden("Timelogs are visible only to an employee or authorized time manager.");
        await requireTimelogAccess(p.actor, organizationId, employeeId);
        const page = p.input.page ?? 1;
        const limit = p.input.limit ?? 100;
        const where = { organization_id: organizationId, employee_id: employeeId, ...(p.input.project === undefined ? {} : { project: p.input.project }), ...(p.input.taskId === undefined ? {} : { task_id: p.input.taskId }), ...(p.input.billable === undefined ? {} : { billable: p.input.billable }), ...(p.input.locked === undefined ? {} : { locked: p.input.locked }) };
        const [records, rows] = await Promise.all([MyGlobal.prisma.timelogs.count({ where }), MyGlobal.prisma.timelogs.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { work_date: "desc" } })]);
        return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(timelog) };
    }
    export async function timelogUpdate(p: WorkforceIdBody<api.ITimelog.IUpdate>) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.timelogs.findFirst({ where: { id: p.id, organization_id: organizationId, locked: false } });
        if (row === null)
            throw ErrorUtil.conflict("Only an unlocked timelog can be edited.");
        await requireTimelogAccess(p.actor, organizationId, row.employee_id);
        if (p.body.hours !== undefined && (!Number.isFinite(p.body.hours) || p.body.hours <= 0))
            throw ErrorUtil.unprocessable("Timelog hours must be positive and finite.");
        if (p.body.rate !== undefined && p.body.rate !== null && (!Number.isFinite(p.body.rate) || p.body.rate < 0))
            throw ErrorUtil.unprocessable("Timelog rate must be finite and non-negative.");
        const workDate = p.body.workDate === undefined ? row.work_date : validDate(p.body.workDate, "Timelog work date");
        const project = p.body.project === undefined ? row.project : p.body.project;
        const taskId = p.body.taskId === undefined ? row.task_id : p.body.taskId;
        const projectRow = await assignedProject(organizationId, row.employee_id, project, taskId, workDate);
        return timelog(await MyGlobal.prisma.timelogs.update({ where: { id: row.id }, data: { work_date: workDate, hours: p.body.hours ?? row.hours, project: projectRow?.code ?? null, task_id: taskId, description: p.body.description === undefined ? row.description : p.body.description, billable: p.body.billable ?? row.billable, rate: p.body.rate === undefined ? row.rate : p.body.rate } }));
    }
    export async function timelogErase(p: WorkforceId) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.timelogs.findFirst({ where: { id: p.id, organization_id: organizationId, locked: false } });
        if (row === null)
            throw ErrorUtil.conflict("Only an unlocked timelog can be removed.");
        await requireTimelogAccess(p.actor, organizationId, row.employee_id);
        await MyGlobal.prisma.timelogs.delete({ where: { id: row.id } });
        return { id: row.id };
    }
    export async function timesheetIndex(p: WorkforceInput<api.IPage.IRequest>) { const organizationId = await AuthProvider.organizationId(p.actor); const own = await MyGlobal.prisma.employees.findFirst({ where: { organization_id: organizationId, user_id: p.actor.id }, select: { id: true } }); const canViewAll = await AuthProvider.hasAnyRole(p.actor, ["Owner", "HR Manager"]); const where = { organization_id: organizationId, ...(canViewAll && own === null ? {} : { employee_id: own?.id ?? "__no_employee__" }) }; const page = p.input.page ?? 1; const limit = p.input.limit || 100; const [records, rows] = await Promise.all([MyGlobal.prisma.timesheets.count({ where }), MyGlobal.prisma.timesheets.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { week_start: "desc" } })]); return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: await Promise.all(rows.map((row) => timesheetView(row, organizationId))) }; }
    export async function timesheetSubmit(p: WorkforceId) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.timesheets.findFirst({ where: { id: p.id, organization_id: organizationId } });
        if (row === null)
            throw ErrorUtil.notFound("No timesheet exists in the active organization.");
        if (row.status !== "draft")
            throw ErrorUtil.conflict("Only a draft timesheet can be submitted.");
        await requireTimelogAccess(p.actor, organizationId, row.employee_id);
        const weekEnd = new Date(row.week_start);
        weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);
        const timeCount = await MyGlobal.prisma.timelogs.count({ where: { organization_id: organizationId, employee_id: row.employee_id, work_date: { gte: row.week_start, lt: weekEnd } } });
        if (timeCount === 0)
            throw ErrorUtil.conflict("An empty timesheet cannot be submitted.");
        const competing = await MyGlobal.prisma.timesheets.count({ where: { organization_id: organizationId, employee_id: row.employee_id, week_start: row.week_start, status: { in: ["submitted", "approved"] }, id: { not: row.id } } });
        if (competing > 0)
            throw ErrorUtil.conflict("Only one submitted or approved timesheet may exist for an employee and week.");
        return timesheetView(await MyGlobal.prisma.timesheets.update({ where: { id: row.id }, data: { status: "submitted" } }), organizationId);
    }
    export async function payrollCreate(p: WorkforceBody<api.IPayrollRun.ICreate>) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        if (!Number.isFinite(p.body.total) || p.body.total < 0)

            throw ErrorUtil.unprocessable("A payroll total must be finite and non-negative.");
        if (p.body.scheduleId !== undefined && p.body.scheduleId !== null && await MyGlobal.prisma.pay_schedules.findFirst({ where: { id: p.body.scheduleId, organization_id: organizationId, active: true } }) === null)
            throw ErrorUtil.notFound("No active payroll schedule exists in the organization.");
        const row = await MyGlobal.prisma.payroll_runs.create({ data: { id: randomUUID(), organization_id: organizationId, period: p.body.period, schedule_id: p.body.scheduleId ?? null, payment_date: p.body.paymentDate === undefined || p.body.paymentDate === null ? null : new Date(p.body.paymentDate), correction_of_id: null, correction_type: null, status: "draft", total: p.body.total, created_at: new Date(), posted_at: null, paid_at: null } });
        return payroll(row);
    }
    export async function payrollIndex(p: WorkforceInput<api.IPage.IRequest>) { const organizationId = await AuthProvider.organizationId(p.actor); const page = p.input.page ?? 1; const limit = p.input.limit || 100; const where = { organization_id: organizationId }; const [records, rows] = await Promise.all([MyGlobal.prisma.payroll_runs.count({ where }), MyGlobal.prisma.payroll_runs.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { created_at: "desc" } })]); return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(payroll) }; }
    export async function payrollApprove(p: WorkforceId) { return payrollState(p, "approved"); }
    export async function payrollPost(p: WorkforceId) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.payroll_runs.findFirst({ where: { id: p.id, organization_id: organizationId } });
        if (row === null)
            throw ErrorUtil.notFound("No payroll run exists in the active organization.");
        if (row.status !== "approved")
            throw ErrorUtil.conflict("Only an approved payroll run can be posted.");
        const now = new Date();
        const updated = await MyGlobal.prisma.$transaction(async (tx) => { await JournalProvider.createPosted(tx, organizationId, "payroll", row.id, now, `Payroll ${row.period}`, "5000", "2000", row.total, (await tx.organizations.findUniqueOrThrow({ where: { id: organizationId }, select: { base_currency: true } })).base_currency); return tx.payroll_runs.update({ where: { id: row.id }, data: { status: "posted", posted_at: now } }); });
        return payroll(updated);
    }
    export async function payrollPay(p: WorkforceIdBody<api.IPayrollRun.IPay>) { return WorkforceProvider.payrollPaySafe(p); }
    export async function payrollReverse(p: WorkforceId) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.payroll_runs.findFirst({ where: { id: p.id, organization_id: organizationId, status: { in: ["posted", "paid"] } } });
        if (row === null)
            throw ErrorUtil.conflict("Only a posted or paid payroll run can be reversed.");
        const now = new Date();
        const reversed = await MyGlobal.prisma.$transaction(async (tx) => {
            const source = await tx.journals.findFirst({ where: { organization_id: organizationId, source_module: "payroll", source_id: row.id, status: "posted" } });
            if (source === null && row.total !== 0)
                throw ErrorUtil.conflict("A posted payroll run cannot be reversed without its source journal.");
            if (source !== null && await tx.journals.findFirst({ where: { organization_id: organizationId, reversal_of_id: source.id } }) !== null)
                throw ErrorUtil.conflict("The payroll source journal has already been reversed.");
            const created = await tx.payroll_runs.create({ data: { id: randomUUID(), organization_id: organizationId, period: `${row.period}-REV`, schedule_id: row.schedule_id, payment_date: null, correction_of_id: row.id, correction_type: "reversal", status: "reversed", total: -row.total, created_at: now, posted_at: now, paid_at: null } });
            if (source !== null) {
                const lines = await tx.journal_lines.findMany({ where: { journal_id: source.id } });
                const reversalId = randomUUID();
                await tx.journals.create({ data: { id: reversalId, organization_id: organizationId, source_module: "payroll_reversal", source_id: created.id, status: "posted", journal_date: now, memo: `Payroll reversal ${row.period}`, created_at: now, posted_at: now, reversal_of_id: source.id, adjustment_of_id: null, void_reason: null } });
                await tx.journal_lines.createMany({ data: lines.map((line) => ({ id: randomUUID(), journal_id: reversalId, account_id: line.account_id, debit: line.credit, credit: line.debit, currency: line.currency, exchange_rate: line.exchange_rate, created_at: now })) });
            }
            if (row.status === "paid") {
                const bankMovement = await tx.bank_transactions.findFirst({ where: { organization_id: organizationId, reference: `PAYROLL-${row.id}`, matched_target_type: "payroll", matched_target_id: row.id, status: "matched" } });
                if (bankMovement === null)
                    throw ErrorUtil.conflict("A paid payroll run cannot be reversed without its bank movement.");
                const payment = await tx.payments.findFirst({ where: { organization_id: organizationId, bank_account_id: bankMovement.bank_account_id, direction: "outbound", amount: row.total, status: "posted" }, orderBy: { posted_at: "desc" } });
                if (payment === null)
                    throw ErrorUtil.conflict("A paid payroll run cannot be reversed without its payment.");
                const paymentJournal = await tx.journals.findFirst({ where: { organization_id: organizationId, source_module: "payroll_payment", source_id: payment.id, status: "posted" } });
                if (paymentJournal === null)
                    throw ErrorUtil.conflict("A paid payroll run cannot be reversed without its payment journal.");
                if (await tx.journals.findFirst({ where: { organization_id: organizationId, reversal_of_id: paymentJournal.id } }) !== null)
                    throw ErrorUtil.conflict("The payroll payment journal has already been reversed.");
                const paymentLines = await tx.journal_lines.findMany({ where: { journal_id: paymentJournal.id } });
                const paymentReversalId = randomUUID();
                await tx.journals.create({ data: { id: paymentReversalId, organization_id: organizationId, source_module: "payroll_payment_reversal", source_id: created.id, status: "posted", journal_date: now, memo: `Payroll payment reversal ${row.period}`, created_at: now, posted_at: now, reversal_of_id: paymentJournal.id, adjustment_of_id: null, void_reason: null } });
                await tx.journal_lines.createMany({ data: paymentLines.map((line) => ({ id: randomUUID(), journal_id: paymentReversalId, account_id: line.account_id, debit: line.credit, credit: line.debit, currency: line.currency, exchange_rate: line.exchange_rate, created_at: now })) });

                await tx.payments.update({ where: { id: payment.id }, data: { status: "reversed" } });
                await tx.bank_transactions.create({ data: { id: randomUUID(), organization_id: organizationId, bank_account_id: bankMovement.bank_account_id, statement_date: now, amount: -bankMovement.amount, currency: bankMovement.currency, reference: `PAYROLL-REVERSAL-${created.id}`, status: "matched", matched_target_type: "payroll_reversal", matched_target_id: created.id, created_at: now } });
            }
            return created;
        });
        return payroll(reversed);
    }
    export async function payrollAdjust(p: WorkforceIdBody<api.IPayrollRun.IAdjustment>) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.payroll_runs.findFirst({ where: { id: p.id, organization_id: organizationId, status: { in: ["posted", "paid"] } } });
        if (row === null)
            throw ErrorUtil.conflict("Only a posted or paid payroll run can receive an adjustment.");
        return payroll(await MyGlobal.prisma.payroll_runs.create({ data: { id: randomUUID(), organization_id: organizationId, period: p.body.period, schedule_id: row.schedule_id, payment_date: p.body.paymentDate === undefined || p.body.paymentDate === null ? null : new Date(p.body.paymentDate), correction_of_id: row.id, correction_type: "adjustment", status: "draft", total: p.body.total, created_at: new Date(), posted_at: null, paid_at: null } }));
    }
    export async function payrollCalculate(p: WorkforceId) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.payroll_runs.findFirst({ where: { id: p.id, organization_id: organizationId, status: "draft" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a draft payroll run can be calculated.");
        const employees = await MyGlobal.prisma.employees.findMany({ where: { organization_id: organizationId, status: "active" } });
        if (employees.length === 0)
            throw ErrorUtil.conflict("Payroll calculation requires at least one active employee.");
        const periodMatch = /^(\d{4})-(\d{2})$/.exec(row.period);
        if (periodMatch === null)
            throw ErrorUtil.unprocessable("Payroll calculation requires a YYYY-MM period.");
        const from = new Date(Date.UTC(Number(periodMatch[1]), Number(periodMatch[2]) - 1, 1));
        const to = new Date(Date.UTC(Number(periodMatch[1]), Number(periodMatch[2]), 1));
        const approvedSheets = await MyGlobal.prisma.timesheets.findMany({ where: { organization_id: organizationId, status: "approved", week_start: { lt: to }, employee_id: { in: employees.map((employee) => employee.id) } }, select: { employee_id: true, week_start: true } });
        const approvedByEmployee = new Map<string, number>();
        for (const sheet of approvedSheets) {
            const weekEnd = new Date(sheet.week_start);
            weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);
            const start = sheet.week_start < from ? from : sheet.week_start;
            const end = weekEnd > to ? to : weekEnd;
            if (start >= end)
                continue;
            const hours = await MyGlobal.prisma.timelogs.aggregate({ where: { organization_id: organizationId, employee_id: sheet.employee_id, locked: true, work_date: { gte: start, lt: end } }, _sum: { hours: true } });
            approvedByEmployee.set(sheet.employee_id, (approvedByEmployee.get(sheet.employee_id) ?? 0) + (hours._sum.hours ?? 0));
        }
        await MyGlobal.prisma.$transaction(async (tx) => {
            const gross = row.total / employees.length;
            for (const employee of employees) {
                const deductions = gross * 0.1;
                await tx.payslips.create({ data: { id: randomUUID(), payroll_run_id: row.id, employee_id: employee.id, gross, deductions, net: gross - deductions, status: "draft", published_at: null, created_at: new Date() } });
            }
            await tx.payroll_runs.update({ where: { id: row.id }, data: { status: "calculated" } });
        });
        return payroll(await MyGlobal.prisma.payroll_runs.findUniqueOrThrow({ where: { id: row.id } }));
    }
    export async function payrollPublish(p: WorkforceId) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.payroll_runs.findFirst({ where: { id: p.id, organization_id: organizationId, status: "posted" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a posted payroll run can publish payslips.");
        const publishedAt = new Date();
        await MyGlobal.prisma.payslips.updateMany({ where: { payroll_run_id: row.id, status: "draft" }, data: { status: "published", published_at: publishedAt } });
        return payroll(row);

    }
    export async function payslipIndex(p: WorkforceInput<api.IPayslip.IIndex>) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        const own = await MyGlobal.prisma.employees.findFirst({ where: { organization_id: organizationId, user_id: p.actor.id } });
        const requested = p.input.employeeId;
        if (requested !== undefined && requested !== own?.id)
            await AuthProvider.requireAnyRole(p.actor, ["Owner", "HR Manager", "Finance Manager"], "Only the subject employee or an authorized payroll role may view payslips.");
        const employeeId = requested ?? own?.id;
        if (employeeId === undefined)
            throw ErrorUtil.forbidden("Payslips are visible only to an employee or an explicitly authorized payroll user.");
        const employee = await MyGlobal.prisma.employees.findFirst({ where: { id: employeeId, organization_id: organizationId } });
        if (employee === null)
            throw ErrorUtil.notFound("No employee exists in the active organization.");
        const runs = await MyGlobal.prisma.payroll_runs.findMany({ where: { organization_id: organizationId }, select: { id: true } });
        const page = p.input.page ?? 1;
        const limit = p.input.limit || 100;
        const where = { employee_id: employeeId, payroll_run_id: { in: runs.map((run) => run.id) }, status: "published" };
        const [records, rows] = await Promise.all([MyGlobal.prisma.payslips.count({ where }), MyGlobal.prisma.payslips.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { created_at: "desc" } })]);
        return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(payslip) };
    }
    export async function payslipAt(p: WorkforceId) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.payslips.findFirst({ where: { id: p.id, status: "published" } });
        if (row === null)
            throw ErrorUtil.notFound("No published payslip exists for the active organization.");
        const run = await MyGlobal.prisma.payroll_runs.findFirst({ where: { id: row.payroll_run_id, organization_id: organizationId } });
        if (run === null)
            throw ErrorUtil.notFound("No published payslip exists for the active organization.");
        const own = await MyGlobal.prisma.employees.findFirst({ where: { id: row.employee_id, organization_id: organizationId, user_id: p.actor.id } });
        if (own === null)
            await AuthProvider.requireAnyRole(p.actor, ["Owner", "HR Manager", "Finance Manager"], "Only the subject employee or an authorized payroll role may view payslips.");
        return payslip(row);
    }
    async function payrollState(p: WorkforceId, status: string) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.payroll_runs.findFirst({ where: { id: p.id, organization_id: organizationId } });
        if (row === null)
            throw ErrorUtil.notFound("No payroll run exists in the active organization.");
        if (row.status !== "draft" && row.status !== "calculated")
            throw ErrorUtil.conflict("Only a draft or calculated payroll run can be approved.");
        return payroll(await MyGlobal.prisma.payroll_runs.update({ where: { id: row.id }, data: { status } }));
    }
    export async function timesheetApprove(p: WorkforceId) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        await AuthProvider.requireAnyRole(p.actor, ["Owner", "HR Manager"], "Only an assigned time approver may approve a timesheet.");
        const row = await MyGlobal.prisma.timesheets.findFirst({ where: { id: p.id, organization_id: organizationId, status: "submitted" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a submitted timesheet can be approved.");
        const weekEnd = new Date(row.week_start);
        weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);
        const updated = await MyGlobal.prisma.$transaction(async (tx) => { await tx.timelogs.updateMany({ where: { organization_id: organizationId, employee_id: row.employee_id, work_date: { gte: row.week_start, lt: weekEnd }, locked: false }, data: { locked: true } }); return tx.timesheets.updateMany({ where: { id: row.id, organization_id: organizationId, status: "submitted" }, data: { status: "approved", rejection_reason: null } }); }).then(async (result) => {
            if (result.count !== 1)
                throw ErrorUtil.conflict("The timesheet changed while it was being approved.");
            return MyGlobal.prisma.timesheets.findUniqueOrThrow({ where: { id: row.id } });
        });
        return timesheetView(updated, organizationId);
    }
    export async function timesheetReject(p: TimesheetReject) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        await AuthProvider.requireAnyRole(p.actor, ["Owner", "HR Manager"], "Only an assigned time approver may reject a timesheet.");
        if (p.reason.trim().length === 0)
            throw ErrorUtil.unprocessable("Timesheet rejection requires a reason.");
        const row = await MyGlobal.prisma.timesheets.findFirst({ where: { id: p.id, organization_id: organizationId, status: "submitted" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a submitted timesheet can be rejected.");
        const updated = await MyGlobal.prisma.timesheets.updateMany({ where: { id: row.id, organization_id: organizationId, status: "submitted" }, data: { status: "rejected", rejection_reason: p.reason } });
        if (updated.count !== 1)
            throw ErrorUtil.conflict("The timesheet changed while it was being rejected.");
        return timesheetView(await MyGlobal.prisma.timesheets.findUniqueOrThrow({ where: { id: row.id } }), organizationId);
    }
    export async function timesheetReopen(p: WorkforceId) {
        const organizationId = await AuthProvider.organizationId(p.actor);
        await AuthProvider.requireAnyRole(p.actor, ["Owner", "HR Manager"], "Only an authorized time manager may reopen a timesheet.");
        const row = await MyGlobal.prisma.timesheets.findFirst({ where: { id: p.id, organization_id: organizationId, status: { in: ["approved", "rejected"] } } });
        if (row === null)
            throw ErrorUtil.conflict("Only an approved or rejected timesheet can be reopened.");
        const weekEnd = new Date(row.week_start);
        weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);
        const updated = await MyGlobal.prisma.$transaction(async (tx) => {
            if (row.status === "approved")
                await tx.timelogs.updateMany({ where: { organization_id: organizationId, employee_id: row.employee_id, work_date: { gte: row.week_start, lt: weekEnd }, locked: true }, data: { locked: false } });
            const changed = await tx.timesheets.updateMany({ where: { id: row.id, organization_id: organizationId, status: { in: ["approved", "rejected"] } }, data: { status: "draft" } });
            if (changed.count !== 1)
                throw ErrorUtil.conflict("The timesheet changed while it was being reopened.");
            return tx.timesheets.findUniqueOrThrow({ where: { id: row.id } });
        });
        return timesheetView(updated, organizationId);
    }
    async function requireTimelogAccess(actor: ErpPayload, organizationId: string, employeeId: string) {
        const own = await MyGlobal.prisma.employees.findFirst({ where: { id: employeeId, organization_id: organizationId, user_id: actor.id } });
        if (own !== null)
            return;
        await AuthProvider.requireAnyRole(actor, ["Owner", "HR Manager"], "Only the employee or an authorized time manager may access this timelog.");
    }
    function employee(row: EmployeeRow): api.IEmployee {
        let payrollSettings: Record<string, unknown> = {};
        try {
            payrollSettings = JSON.parse(row.payroll_settings);
        }
        catch { }
        return { id: row.id, userId: row.user_id, employeeNumber: row.employee_number, department: row.department, departmentId: row.department_id, position: row.position, managerId: row.manager_id, costCenterId: row.cost_center_id, employmentType: row.employment_type as api.IEmployee["employmentType"], status: row.status as api.IEmployee["status"], hireDate: row.hire_date?.toISOString() ?? null, terminationDate: row.termination_date?.toISOString() ?? null, payrollSettings, visibilityScope: row.visibility_scope };
    }
    function contract(row: ContractRow): api.IEmploymentContract { return { id: row.id, organizationId: row.organization_id, employeeId: row.employee_id, startsAt: row.starts_at.toISOString(), endsAt: row.ends_at?.toISOString() ?? null, rate: row.rate, rateKind: row.rate_kind, status: row.status as api.IEmploymentContract["status"], createdByMembershipId: row.created_by_membership_id }; }
    function timelog(row: TimelogRow): api.ITimelog { return { id: row.id, employeeId: row.employee_id, workDate: row.work_date.toISOString(), hours: row.hours, project: row.project, taskId: row.task_id, description: row.description, billable: row.billable, rate: row.rate, locked: row.locked }; }
    async function assignedProject(organizationId: string, employeeId: string, code: string | null | undefined, taskId: string | null | undefined, at: Date) {
        if (code === null || code === undefined) {
            if (taskId !== null && taskId !== undefined)
                throw ErrorUtil.conflict("A task timelog requires its project.");
            return null;
        }
        const project = await MyGlobal.prisma.projects.findFirst({ where: { organization_id: organizationId, code, status: "active" } });
        if (project === null)
            throw ErrorUtil.conflict("Timelog project must be active in the active organization.");
        const assignment = await MyGlobal.prisma.project_members.findFirst({ where: { project_id: project.id, employee_id: employeeId, active: true, starts_at: { lte: at }, OR: [{ ends_at: null }, { ends_at: { gte: at } }] } });

        if (assignment === null)
            throw ErrorUtil.conflict("The employee is not assigned to the timelog project on the work date.");
        if (taskId !== null && taskId !== undefined && await MyGlobal.prisma.tasks.findFirst({ where: { id: taskId, project_id: project.id, status: { not: "cancelled" } } }) === null)
            throw ErrorUtil.conflict("The timelog task must belong to the selected project.");
        return project;
    }
    function validDate(value: string, label: string) {
        const date = new Date(value);
        if (!Number.isFinite(date.getTime()))
            throw ErrorUtil.unprocessable(`${label} must be a valid date.`);
        return date;
    }
    async function timesheetView(row: TimesheetRow, organizationId: string = row.organization_id) { const weekEnd = new Date(row.week_start); weekEnd.setUTCDate(weekEnd.getUTCDate() + 7); const total = await MyGlobal.prisma.timelogs.aggregate({ where: { organization_id: organizationId, employee_id: row.employee_id, work_date: { gte: row.week_start, lt: weekEnd } }, _sum: { hours: true } }); return timesheet(row, total._sum.hours ?? 0); }
    function timesheet(row: TimesheetRow, totalHours = 0) { return { id: row.id, employeeId: row.employee_id, weekStart: row.week_start.toISOString(), status: row.status, totalHours, rejectionReason: row.rejection_reason }; }
    function payroll(row: PayrollRow): api.IPayrollRun { return { id: row.id, period: row.period, status: row.status, total: row.total, scheduleId: row.schedule_id, correctionOfId: row.correction_of_id, correctionType: row.correction_type as api.IPayrollRun["correctionType"], postedAt: row.posted_at?.toISOString() ?? null, paidAt: row.paid_at?.toISOString() ?? null }; }
    function payslip(row: PayslipRow): api.IPayslip { return { id: row.id, payrollRunId: row.payroll_run_id, employeeId: row.employee_id, gross: row.gross, deductions: row.deductions, net: row.net, status: row.status as api.IPayslip["status"], publishedAt: row.published_at?.toISOString() ?? null }; }
}
export namespace WorkforceProvider {
    /** Pays a posted run as one atomic payment and bank movement. */
    export async function payrollPaySafe(p: WorkforceIdBody<api.IPayrollRun.IPay>) {
        const org = await AuthProvider.organizationId(p.actor);
        const organization = await MyGlobal.prisma.organizations.findUniqueOrThrow({ where: { id: org }, select: { base_currency: true } });
        const now = new Date();
        const result = await MyGlobal.prisma.$transaction(async (tx) => {
            const row = await tx.payroll_runs.findFirst({ where: { id: p.id, organization_id: org, status: "posted" } });
            if (row === null)
                throw ErrorUtil.conflict("Only a posted payroll run can be paid.");
            const bank = await tx.bank_accounts.findFirst({ where: { id: p.body.bankAccountId, organization_id: org, active: true }, select: { id: true, currency: true, opening_balance: true } });
            if (bank === null)
                throw ErrorUtil.notFound("No active payroll bank account exists in the organization.");
            if (bank.currency !== organization.base_currency)
                throw ErrorUtil.conflict("The payroll bank account must use the organization base currency.");
            const activity = await tx.bank_transactions.aggregate({ _sum: { amount: true }, where: { organization_id: org, bank_account_id: bank.id } });
            if (bank.opening_balance + (activity._sum.amount ?? 0) < row.total)
                throw ErrorUtil.conflict("The selected payroll bank account cannot cover the payroll payable.");
            const party = (await tx.parties.findFirst({ where: { organization_id: org, kind: "vendor", status: "active" }, orderBy: { created_at: "asc" } })) ?? await tx.parties.create({ data: { id: randomUUID(), organization_id: org, kind: "vendor", name: "Payroll Clearing", tax_identity: null, currency: organization.base_currency, payment_term_id: null, credit_limit: null, status: "active", primary_contact_id: null, billing_address_id: null, shipping_address_id: null, country: null, risk_level: null, notes: "System payroll clearing party", bank_account_reference: null, created_at: now, updated_at: now } });
            const paymentId = randomUUID();
            await tx.payments.create({ data: { id: paymentId, organization_id: org, party_id: party.id, direction: "outbound", amount: row.total, currency: organization.base_currency, bank_account_id: bank.id, status: "posted", created_at: now, posted_at: now } });
            await JournalProvider.createPosted(tx, org, "payroll_payment", paymentId, now, `Payroll payment ${row.period}`, "2000", "1000", row.total, organization.base_currency);
            await tx.bank_transactions.create({ data: { id: randomUUID(), organization_id: org, bank_account_id: bank.id, statement_date: now, amount: -row.total, currency: organization.base_currency, reference: `PAYROLL-${row.id}`, status: "matched", matched_target_type: "payroll", matched_target_id: row.id, created_at: now } });
            const changed = await tx.payroll_runs.updateMany({ where: { id: row.id, organization_id: org, status: "posted" }, data: { status: "paid", paid_at: now } });
            if (changed.count !== 1)
                throw ErrorUtil.conflict("The payroll run changed while it was being paid.");
            return tx.payroll_runs.findUniqueOrThrow({ where: { id: row.id } });
        });
        return { id: result.id, period: result.period, status: result.status, total: result.total, scheduleId: result.schedule_id, correctionOfId: result.correction_of_id, correctionType: result.correction_type as api.IPayrollRun["correctionType"], postedAt: result.posted_at?.toISOString() ?? null, paidAt: result.paid_at?.toISOString() ?? null };
    }
    /** Calculates hourly earnings from locked timelogs in approved sheets and monthly earnings from effective contracts. */
    export async function payrollCalculateSafe(p: WorkforceId) {
        const org = await AuthProvider.organizationId(p.actor);
        const row = await MyGlobal.prisma.payroll_runs.findFirst({ where: { id: p.id, organization_id: org, status: "draft" } });
        if (row === null)
            throw ErrorUtil.conflict("Only a draft payroll run can be calculated.");
        const match = /^(\d{4})-(\d{2})$/.exec(row.period);
        if (match === null)
            throw ErrorUtil.unprocessable("Payroll calculation requires a YYYY-MM period.");
        const from = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
        const to = new Date(Date.UTC(Number(match[1]), Number(match[2]), 1));
        const employees = await MyGlobal.prisma.employees.findMany({ where: { organization_id: org, status: "active" } });

        if (employees.length === 0)
            throw ErrorUtil.conflict("Payroll calculation requires at least one active employee.");
        const sheets = await MyGlobal.prisma.timesheets.findMany({ where: { organization_id: org, status: "approved", week_start: { lt: to }, employee_id: { in: employees.map((employee) => employee.id) } } });
        const hours = new Map<string, number>();
        for (const sheet of sheets) {
            const weekEnd = new Date(sheet.week_start);
            weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);
            if (weekEnd <= from)
                continue;
            const total = await MyGlobal.prisma.timelogs.aggregate({ where: { organization_id: org, employee_id: sheet.employee_id, locked: true, work_date: { gte: sheet.week_start < from ? from : sheet.week_start, lt: weekEnd > to ? to : weekEnd } }, _sum: { hours: true } });
            hours.set(sheet.employee_id, (hours.get(sheet.employee_id) ?? 0) + (total._sum.hours ?? 0));
        }
        const contracts = await MyGlobal.prisma.employment_contracts.findMany({ where: { organization_id: org, employee_id: { in: employees.map((employee) => employee.id) }, starts_at: { lt: to }, OR: [{ ends_at: null }, { ends_at: { gte: from } }] }, orderBy: { starts_at: "desc" } });
        const result = await MyGlobal.prisma.$transaction(async (tx) => {
            let total = 0;
            for (const employee of employees) {
                const contract = contracts.find((candidate) => candidate.employee_id === employee.id && candidate.starts_at <= from && (candidate.ends_at === null || candidate.ends_at >= from));
                const gross = contract === undefined ? (row.total > 0 && employees.length === 1 ? row.total : 0) : contract.rate_kind === "hourly" ? (hours.get(employee.id) ?? 0) * contract.rate : contract.rate;
                const deductions = gross * 0.1;
                total += gross;
                await tx.payslips.create({ data: { id: randomUUID(), payroll_run_id: row.id, employee_id: employee.id, gross, deductions, net: gross - deductions, status: "draft", published_at: null, created_at: new Date() } });
            }
            await tx.payroll_runs.update({ where: { id: row.id }, data: { status: "calculated", total } });
            return tx.payroll_runs.findUniqueOrThrow({ where: { id: row.id } });
        });
        return { id: result.id, period: result.period, status: result.status, total: result.total, scheduleId: result.schedule_id, correctionOfId: result.correction_of_id, correctionType: result.correction_type as api.IPayrollRun["correctionType"], postedAt: result.posted_at?.toISOString() ?? null, paidAt: result.paid_at?.toISOString() ?? null };
    }
}
