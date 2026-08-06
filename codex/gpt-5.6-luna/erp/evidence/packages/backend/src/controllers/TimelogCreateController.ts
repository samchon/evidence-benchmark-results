import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ITimelog } from "@benchmark/erp-api"; import { ProjectWorkProvider } from "../providers/ProjectWorkProvider";
/** Records a draft time entry.
*/ @Controller("timelog-create") export class TimelogCreateController {
/**
 * @evidence prisma:timelogs Exposes the persisted timelogs record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: ITimelog.ICreate): Promise<ITimelog> { return ProjectWorkProvider.timelogCreate(h, input); } }
