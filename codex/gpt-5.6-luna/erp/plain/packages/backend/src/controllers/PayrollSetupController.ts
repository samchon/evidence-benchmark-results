import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { PayrollSetupProvider } from "../providers/PayrollSetupProvider";

/** Pay schedules and employee payroll configurations. */
@Controller("erp/payroll-setup")
@UseGuards(ErpAuthGuard)
export class PayrollSetupController {
  @core.TypedRoute.Post("schedule") public async scheduleCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IPaySchedule.ICreate): Promise<api.IPaySchedule> { return PayrollSetupProvider.scheduleCreate({ actor, body }); }
  @core.TypedRoute.Patch("schedule") public async scheduleIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IPaySchedule>> { return PayrollSetupProvider.scheduleIndex({ actor, input }); }
  @core.TypedRoute.Put("schedule/:id") public async scheduleUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IPaySchedule.IUpdate): Promise<api.IPaySchedule> { return PayrollSetupProvider.scheduleUpdate({ actor, id, body }); }
  @core.TypedRoute.Post("configuration") public async configurationCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IPayrollConfiguration.ICreate): Promise<api.IPayrollConfiguration> { return PayrollSetupProvider.configurationCreate({ actor, body }); }
  @core.TypedRoute.Patch("configuration") public async configurationIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { employeeId?: string }): Promise<api.IPage<api.IPayrollConfiguration>> { return PayrollSetupProvider.configurationIndex({ actor, input }); }
  @core.TypedRoute.Put("configuration/:id") public async configurationUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IPayrollConfiguration.IUpdate): Promise<api.IPayrollConfiguration> { return PayrollSetupProvider.configurationUpdate({ actor, id, body }); }
}
