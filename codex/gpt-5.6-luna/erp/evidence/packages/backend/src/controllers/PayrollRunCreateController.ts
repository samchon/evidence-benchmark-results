import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IPayrollRun } from "@benchmark/erp-api"; import { PayrollProvider } from "../providers/PayrollProvider";
/** Starts a payroll run for a locked period.
*/ @Controller("payroll-run-create") export class PayrollRunCreateController {
/**
 * @evidence prisma:payroll_runs Exposes the persisted payroll_runs record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IPayrollRun.ICreate): Promise<IPayrollRun> { return PayrollProvider.runCreate(h, input); } }
