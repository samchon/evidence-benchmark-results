import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IAuth,IProjectMember}from"@benchmark/erp-api";import{PeopleProjectProvider as P}from"../providers/PeopleProjectProvider";@Controller("project-member-create")export class ProjectMemberCreateController{
/**
  * @evidence prisma:project_members Exposes the persisted project_members record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IProjectMember.ICreate):Promise<IProjectMember>{return P.memberCreate(h,i);}}
