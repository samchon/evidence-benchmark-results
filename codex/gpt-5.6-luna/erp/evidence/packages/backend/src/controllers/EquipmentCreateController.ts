import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IEquipment } from "@benchmark/erp-api"; import { QualityServiceProvider } from "../providers/QualityServiceProvider";
/** Creates a equipment record.
*/ @Controller("equipment-create") export class EquipmentCreateController {
/**
 * @evidence prisma:equipment Exposes the persisted equipment record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IEquipment.ICreate): Promise<IEquipment> { return QualityServiceProvider.equipmentCreate(h, input); } }
