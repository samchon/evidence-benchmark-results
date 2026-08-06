import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IProject } from "@benchmark/erp-api"; import { ProjectWorkProvider } from "../providers/ProjectWorkProvider";
/** Creates a planned project.
*/ @Controller("project-create") export class ProjectCreateController {
/**
 * @evidence prisma:projects Exposes the persisted projects record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IProject.ICreate): Promise<IProject> { return ProjectWorkProvider.projectCreate(h, input); } }
