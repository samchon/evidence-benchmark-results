import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IFiscalPeriodReopenRequest } from "@benchmark/erp-api"; import { FiscalPeriodReopenProvider as P } from "../providers/FiscalPeriodReopenProvider";
/** Applies an approved reopen request and records the audit event.
*/ @Controller("fiscal-period-reopen-request-apply") export class FiscalPeriodReopenRequestApplyController {
/**
 * @evidence prisma:fiscal_periods Exposes the persisted fiscal_periods record through this operation.
 * @evidence prisma:period_reopen_requests Exposes the persisted period_reopen_requests record through this operation.
 */
  @core.TypedRoute.Post(":id")
  public async apply(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedParam("id") id: string): Promise<IFiscalPeriodReopenRequest> { return P.apply(h, id); } }
