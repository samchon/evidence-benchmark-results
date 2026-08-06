import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ITimesheetLine } from "@benchmark/erp-api"; import { DocumentLineProvider as P } from "../providers/DocumentLineProvider"; @Controller("timesheet-line-create") export class TimesheetLineCreateController {
/**
  * @evidence prisma:timesheet_lines Exposes the persisted timesheet_lines record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:ITimesheetLine.ICreate):Promise<ITimesheetLine>{return P.timesheetLineCreate(h,i);} }
