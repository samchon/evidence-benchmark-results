import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IPayrollConfiguration } from "@benchmark/erp-api"; import { PayrollProvider } from "../providers/PayrollProvider";
/** Creates payroll configuration.
*/ @Controller("payroll-configuration-create") export class PayrollConfigurationCreateController {
/**
 * @evidence prisma:payroll_configurations Exposes the persisted payroll_configurations record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IPayrollConfiguration.ICreate): Promise<IPayrollConfiguration> { return PayrollProvider.configurationCreate(h, input); } }
