import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { ProjectsProvider } from "../providers/ProjectsProvider";

/** Department, project membership, and task operations. */
@Controller("erp/projects")
@UseGuards(ErpAuthGuard)
export class ProjectsController {
  @core.TypedRoute.Post("department") public async departmentCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IDepartment.ICreate): Promise<api.IDepartment> { return ProjectsProvider.departmentCreate({ actor, body }); }
  @core.TypedRoute.Patch("department") public async departmentIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IDepartment.IIndex): Promise<api.IPage<api.IDepartment>> { return ProjectsProvider.departmentIndex({ actor, input }); }
  @core.TypedRoute.Put("department/:id") public async departmentUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IDepartment.IUpdate): Promise<api.IDepartment> { return ProjectsProvider.departmentUpdate({ actor, id, body }); }
  @core.TypedRoute.Put("department/:id/deactivate") public async departmentDeactivate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IDepartment> { return ProjectsProvider.departmentDeactivate({ actor, id }); }
  @core.TypedRoute.Put("department/:id/manager") public async departmentManager(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IManagerAssignment): Promise<api.IDepartment> { return ProjectsProvider.departmentManager({ actor, id, body }); }
  @core.TypedRoute.Post("project") public async projectCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IProject.ICreate): Promise<api.IProject> { return ProjectsProvider.projectCreate({ actor, body }); }
  @core.TypedRoute.Patch("project") public async projectIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IProject.IIndex): Promise<api.IPage<api.IProject>> { return ProjectsProvider.projectIndex({ actor, input }); }
  @core.TypedRoute.Put("project/:id") public async projectUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IProject.IUpdate): Promise<api.IProject> { return ProjectsProvider.projectUpdate({ actor, id, body }); }
  @core.TypedRoute.Put("project/:id/manager") public async projectManager(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IManagerAssignment): Promise<api.IProject> { return ProjectsProvider.projectManager({ actor, id, body }); }
  @core.TypedRoute.Post("project/:id/member") public async memberCreate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IProjectMember.ICreate): Promise<api.IProjectMember> { return ProjectsProvider.memberCreateSafe({ actor, id, body }); }
  @core.TypedRoute.Put("project/member/:id") public async memberUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IProjectMember.IUpdate): Promise<api.IProjectMember> { return ProjectsProvider.memberUpdateSafe({ actor, id, body }); }
  @core.TypedRoute.Delete("project/member/:id") public async memberErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return ProjectsProvider.memberEraseSafe({ actor, id }); }
  @core.TypedRoute.Patch("project/:id/member") public async memberIndex(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IProjectMember>> { return ProjectsProvider.memberIndex({ actor, id, input }); }
  @core.TypedRoute.Post("task") public async taskCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ITask.ICreate): Promise<api.ITask> { return ProjectsProvider.taskCreateSafe({ actor, body }); }
  @core.TypedRoute.Patch("project/:id/task") public async taskIndex(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.ITask>> { return ProjectsProvider.taskIndex({ actor, id, input }); }
  @core.TypedRoute.Put("task/:id") public async taskUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ITask.IUpdate): Promise<api.ITask> { return ProjectsProvider.taskUpdateSafe({ actor, id, body }); }
  @core.TypedRoute.Get("task/:id/history") public async taskHistory(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITaskHistory[]> { return ProjectsProvider.taskHistory({ actor, id }); }
}
