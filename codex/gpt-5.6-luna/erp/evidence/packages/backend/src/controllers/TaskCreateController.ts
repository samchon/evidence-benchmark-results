import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ITask } from "@benchmark/erp-api"; import { ProjectWorkProvider } from "../providers/ProjectWorkProvider";
/** Creates an open project task.
*/ @Controller("task-create") export class TaskCreateController {
/**
 * @evidence prisma:tasks Exposes the persisted tasks record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: ITask.ICreate): Promise<ITask> { return ProjectWorkProvider.taskCreate(h, input); } }
