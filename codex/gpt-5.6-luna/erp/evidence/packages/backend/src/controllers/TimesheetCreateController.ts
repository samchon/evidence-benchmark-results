import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ITimesheet } from "@benchmark/erp-api"; import { ProjectWorkProvider } from "../providers/ProjectWorkProvider";
/** Creates a draft timesheet.
*/ @Controller("timesheet-create") export class TimesheetCreateController {
/**
 * @evidence prisma:timesheets Exposes the persisted timesheets record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: ITimesheet.ICreate): Promise<ITimesheet> { return ProjectWorkProvider.timesheetCreate(h, input); } }
