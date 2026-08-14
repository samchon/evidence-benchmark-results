import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { ServiceOrderProvider } from "../providers/ServiceOrderProvider";

/** Customer service-order lifecycle. */
@Controller("erp/service-order")
@UseGuards(ErpAuthGuard)
export class ServiceOrderController {
  @core.TypedRoute.Post() public async create(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IServiceOrder.ICreate): Promise<api.IServiceOrder> { return ServiceOrderProvider.create({ actor, body }); }
  @core.TypedRoute.Patch() public async index(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IServiceOrder>> { return ServiceOrderProvider.index({ actor, input }); }
  @core.TypedRoute.Put(":id") public async update(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IServiceOrder.IUpdate): Promise<api.IServiceOrder> { return ServiceOrderProvider.update({ actor, id, body }); }
  @core.TypedRoute.Put(":id/assign") public async assign(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IServiceOrder> { return ServiceOrderProvider.assign({ actor, id }); }
  @core.TypedRoute.Put(":id/start") public async start(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IServiceOrder> { return ServiceOrderProvider.start({ actor, id }); }
  @core.TypedRoute.Put(":id/complete") public async complete(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IServiceOrder> { return ServiceOrderProvider.complete({ actor, id }); }
  @core.TypedRoute.Put(":id/cancel") public async cancel(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IServiceOrder> { return ServiceOrderProvider.cancel({ actor, id }); }
  @core.TypedRoute.Post(":id/part") public async part(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IServiceOrder.IPart): Promise<api.IServiceOrder> { return ServiceOrderProvider.part({ actor, id, body }); }
  @core.TypedRoute.Post(":id/labor") public async labor(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: { hours: number; rate?: number }): Promise<api.IServiceOrder> { return ServiceOrderProvider.labor({ actor, id, body }); }
  @core.TypedRoute.Put(":id/invoice") public async invoice(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IServiceOrder> { return ServiceOrderProvider.invoice({ actor, id }); }
  @core.TypedRoute.Put(":id/warranty-expense") public async warrantyExpense(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IServiceOrder> { return ServiceOrderProvider.warrantyExpense({ actor, id }); }
}
