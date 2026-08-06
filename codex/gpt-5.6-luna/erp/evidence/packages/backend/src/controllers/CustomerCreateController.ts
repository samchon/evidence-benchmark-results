import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ICustomer } from "@benchmark/erp-api"; import { PartyProvider } from "../providers/PartyProvider";
/** Creates an external customer.
*/ @Controller("customer-create") export class CustomerCreateController {
/**
 * @evidence prisma:customers Exposes the persisted customers record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: ICustomer.ICreate): Promise<ICustomer> { return PartyProvider.customerCreate(headers, input); } }
