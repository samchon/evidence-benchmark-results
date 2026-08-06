import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IServiceCase } from "@benchmark/erp-api"; import { QualityServiceProvider } from "../providers/QualityServiceProvider";
/** Creates a service-case record.
*/ @Controller("service-case-create") export class ServiceCaseCreateController {
/**
 * @evidence prisma:service_cases Exposes the persisted service_cases record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IServiceCase.ICreate): Promise<IServiceCase> { return QualityServiceProvider.serviceCaseCreate(h, input); } }
