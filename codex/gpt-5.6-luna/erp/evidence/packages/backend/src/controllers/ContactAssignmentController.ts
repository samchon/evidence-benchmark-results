import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IContact } from "@benchmark/erp-api"; import { ContactProvider } from "../providers/ContactProvider";
/** Assigns a contact to a vendor or customer and manages primary designation.
*/ @Controller("contact-assignment") export class ContactAssignmentController {
/**
 * @evidence prisma:contacts Exposes the persisted contacts record through this operation.
 */
  @core.TypedRoute.Put(":id")
  public async assign(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IContact.IAssign): Promise<IContact.IAssignment> { return ContactProvider.assign({ headers, id, input }); } }
