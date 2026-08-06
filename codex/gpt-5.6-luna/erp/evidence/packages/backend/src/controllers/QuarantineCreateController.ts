import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IQuarantine } from "@benchmark/erp-api"; import { QualityServiceProvider } from "../providers/QualityServiceProvider";
/** Creates a quarantine record.
*/ @Controller("quarantine-create") export class QuarantineCreateController {
/**
 * @evidence prisma:quarantines Exposes the persisted quarantines record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IQuarantine.ICreate): Promise<IQuarantine> { return QualityServiceProvider.quarantineCreate(h, input); } }
