import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IBom } from "@benchmark/erp-api"; import { ManufacturingProvider } from "../providers/ManufacturingProvider";
/** Creates a draft bill of materials.
*/ @Controller("bom-create") export class BomCreateController {
/**
 * @evidence prisma:boms Exposes the persisted boms record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IBom.ICreate): Promise<IBom> { return ManufacturingProvider.bomCreate(h, input); } }
