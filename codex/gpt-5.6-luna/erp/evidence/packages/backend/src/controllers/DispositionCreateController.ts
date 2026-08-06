import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IDisposition } from "@benchmark/erp-api"; import { QualityServiceProvider } from "../providers/QualityServiceProvider";
/** Creates a disposition record.
*/ @Controller("disposition-create") export class DispositionCreateController {
/**
 * @evidence prisma:dispositions Exposes the persisted dispositions record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IDisposition.ICreate): Promise<IDisposition> { return QualityServiceProvider.dispositionCreate(h, input); } }
