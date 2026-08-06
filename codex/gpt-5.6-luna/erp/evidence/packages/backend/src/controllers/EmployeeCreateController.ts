import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IEmployee } from "@benchmark/erp-api"; import { HRMasterProvider } from "../providers/HRMasterProvider";
/** Creates an organization employee record.
*/ @Controller("employee-create") export class EmployeeCreateController {
/**
 * @evidence prisma:employees Exposes the persisted employees record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IEmployee.ICreate): Promise<IEmployee> { return HRMasterProvider.employeeCreate(headers, input); } }
