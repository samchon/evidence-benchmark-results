import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IUom } from "@benchmark/erp-api"; import { ReferenceDataProvider } from "../providers/ReferenceDataProvider";
/** Creates a unit of measure.
*/ @Controller("uom-create") export class UomCreateController {
/**
 * @evidence prisma:uoms Exposes the persisted uoms record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IUom.ICreate): Promise<IUom> { return ReferenceDataProvider.uomCreate({ headers, input }); } }
