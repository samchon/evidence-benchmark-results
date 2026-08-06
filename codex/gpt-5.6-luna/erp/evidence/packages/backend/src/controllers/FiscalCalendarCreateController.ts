import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IFiscalCalendar } from "@benchmark/erp-api"; import { AccountingSetupProvider } from "../providers/AccountingSetupProvider";
/** Creates a fiscal calendar with twelve open periods.
*/ @Controller("fiscal-calendar-create") export class FiscalCalendarCreateController {
/**
 * @evidence prisma:fiscal_calendars Exposes the persisted fiscal_calendars record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IFiscalCalendar.ICreate): Promise<IFiscalCalendar> { return AccountingSetupProvider.calendarCreate(headers, input); } }
