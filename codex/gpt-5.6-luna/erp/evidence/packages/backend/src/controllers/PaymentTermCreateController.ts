import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IPaymentTerm } from "@benchmark/erp-api"; import { ReferenceDataProvider } from "../providers/ReferenceDataProvider";
/** Creates a payment term.
*/ @Controller("payment-term-create") export class PaymentTermCreateController {
/**
 * @evidence prisma:payment_terms Exposes the persisted payment_terms record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IPaymentTerm.ICreate): Promise<IPaymentTerm> { return ReferenceDataProvider.termCreate({ headers, input }); } }
