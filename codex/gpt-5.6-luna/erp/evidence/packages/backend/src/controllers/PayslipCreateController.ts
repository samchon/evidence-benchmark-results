import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IPayslip } from "@benchmark/erp-api"; import { PayrollProvider } from "../providers/PayrollProvider";
/** Creates a draft payslip for an approved run.
*/ @Controller("payslip-create") export class PayslipCreateController {
/**
 * @evidence prisma:payslips Exposes the persisted payslips record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IPayslip.ICreate): Promise<IPayslip> { return PayrollProvider.payslipCreate(h, input); } }
