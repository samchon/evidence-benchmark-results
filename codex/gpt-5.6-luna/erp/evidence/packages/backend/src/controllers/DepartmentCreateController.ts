import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IDepartment } from "@benchmark/erp-api"; import { HRMasterProvider } from "../providers/HRMasterProvider";
/** Creates a department.
*/ @Controller("department-create") export class DepartmentCreateController {
/**
 * @evidence prisma:departments Exposes the persisted departments record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IDepartment.ICreate): Promise<IDepartment> { return HRMasterProvider.departmentCreate(headers, input); } }
