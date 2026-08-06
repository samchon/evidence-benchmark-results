
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth, IContact } from "@benchmark/erp-api";
import { ContactProvider } from "../providers/ContactProvider";

/** Publishes contact communication-detail updates. */
@Controller("contact-update")
export class ContactUpdateController {



  /**
   * Update a contact's communication details.
   * @param headers Organization-context credentials.
   * @param id Contact identifier.
   * @param input Mutable communication fields.
   * @returns Updated contact.
   * @tag Contact
   */
  @core.TypedRoute.Put(":id")

  public async update(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IContact.IUpdate): Promise<IContact> { return ContactProvider.update({ headers, id, input }); }
}
