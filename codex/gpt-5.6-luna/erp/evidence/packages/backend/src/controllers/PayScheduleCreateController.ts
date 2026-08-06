import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IPaySchedule } from "@benchmark/erp-api"; import { PayrollProvider } from "../providers/PayrollProvider";
/** Creates a payroll period.
*/ @Controller("pay-schedule-create") export class PayScheduleCreateController {
/**
 * @evidence prisma:pay_schedules Exposes the persisted pay_schedules record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IPaySchedule.ICreate): Promise<IPaySchedule> { return PayrollProvider.scheduleCreate(h, input); } }
