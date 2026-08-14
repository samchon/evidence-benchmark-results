import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { WorkforceProvider } from "../providers/WorkforceProvider";

/** Employee, timesheet, and payroll operations. */
@Controller("erp/workforce")
@UseGuards(ErpAuthGuard)
export class WorkforceController {
  @core.TypedRoute.Post("employee") public async employeeCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IEmployee.ICreate): Promise<api.IEmployee> { return WorkforceProvider.employeeCreate({ actor, body }); }
  @core.TypedRoute.Patch("employee") public async employeeIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IEmployee.IIndex): Promise<api.IPage<api.IEmployee>> { return WorkforceProvider.employeeIndex({ actor, input }); }
  @core.TypedRoute.Put("employee/:id") public async employeeUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IEmployee.IUpdate): Promise<api.IEmployee> { return WorkforceProvider.employeeUpdate({ actor, id, body }); }
  @core.TypedRoute.Post("contract") public async contractCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IEmploymentContract.ICreate): Promise<api.IEmploymentContract> { return WorkforceProvider.contractCreate({ actor, body }); }
  @core.TypedRoute.Patch("contract") public async contractIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IEmploymentContract.IIndex): Promise<api.IPage<api.IEmploymentContract>> { return WorkforceProvider.contractIndex({ actor, input }); }
  @core.TypedRoute.Post("timelog") public async timelogCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ITimelog.ICreate): Promise<api.ITimelog> { return WorkforceProvider.timelogCreate({ actor, body }); }
  @core.TypedRoute.Patch("timelog") public async timelogIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.ITimelog.IIndex): Promise<api.IPage<api.ITimelog>> { return WorkforceProvider.timelogIndex({ actor, input }); }
  @core.TypedRoute.Put("timelog/:id") public async timelogUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ITimelog.IUpdate): Promise<api.ITimelog> { return WorkforceProvider.timelogUpdate({ actor, id, body }); }
  @core.TypedRoute.Delete("timelog/:id") public async timelogErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return WorkforceProvider.timelogErase({ actor, id }); }
  @core.TypedRoute.Post("timesheet") public async timesheetCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: { employeeId: string & tags.Format<"uuid">; weekStart: string & tags.Format<"date-time"> }): Promise<api.ITimesheet> { return WorkforceProvider.timesheetCreate({ actor, body }); }
  @core.TypedRoute.Patch("timesheet") public async timesheetIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.ITimesheet>> { return WorkforceProvider.timesheetIndex({ actor, input }); }
  @core.TypedRoute.Put("timesheet/:id/submit") public async timesheetSubmit(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITimesheet> { return WorkforceProvider.timesheetSubmit({ actor, id }); }
  @core.TypedRoute.Put("timesheet/:id/approve") public async timesheetApprove(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITimesheet> { return WorkforceProvider.timesheetApprove({ actor, id }); }
  @core.TypedRoute.Put("timesheet/:id/reject") public async timesheetReject(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ITimesheet.IReject): Promise<api.ITimesheet> { return WorkforceProvider.timesheetReject({ actor, id, reason: body.reason }); }
  @core.TypedRoute.Put("timesheet/:id/reopen") public async timesheetReopen(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITimesheet> { return WorkforceProvider.timesheetReopen({ actor, id }); }
  @core.TypedRoute.Post("payroll") public async payrollCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IPayrollRun.ICreate): Promise<api.IPayrollRun> { return WorkforceProvider.payrollCreate({ actor, body }); }
  @core.TypedRoute.Patch("payroll") public async payrollIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IPayrollRun>> { return WorkforceProvider.payrollIndex({ actor, input }); }
  @core.TypedRoute.Put("payroll/:id/approve") public async payrollApprove(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IPayrollRun> { return WorkforceProvider.payrollApprove({ actor, id }); }
  @core.TypedRoute.Put("payroll/:id/post") public async payrollPost(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IPayrollRun> { return WorkforceProvider.payrollPost({ actor, id }); }
  @core.TypedRoute.Put("payroll/:id/pay") public async payrollPay(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IPayrollRun.IPay): Promise<api.IPayrollRun> { return WorkforceProvider.payrollPaySafe({ actor, id, body }); }
  @core.TypedRoute.Put("payroll/:id/reverse") public async payrollReverse(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IPayrollRun> { return WorkforceProvider.payrollReverse({ actor, id }); }
  @core.TypedRoute.Post("payroll/:id/adjust") public async payrollAdjust(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IPayrollRun.IAdjustment): Promise<api.IPayrollRun> { return WorkforceProvider.payrollAdjust({ actor, id, body }); }
  @core.TypedRoute.Put("payroll/:id/calculate") public async payrollCalculate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IPayrollRun> { return WorkforceProvider.payrollCalculateSafe({ actor, id }); }
  @core.TypedRoute.Put("payroll/:id/publish") public async payrollPublish(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IPayrollRun> { return WorkforceProvider.payrollPublish({ actor, id }); }
  @core.TypedRoute.Patch("payslip") public async payslipIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPayslip.IIndex): Promise<api.IPage<api.IPayslip>> { return WorkforceProvider.payslipIndex({ actor, input }); }
  @core.TypedRoute.Get("payslip/:id") public async payslipAt(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IPayslip> { return WorkforceProvider.payslipAt({ actor, id }); }
}
