
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth, IContact } from "@benchmark/erp-api";
import { ContactProvider } from "../providers/ContactProvider";

/** Publishes contact creation. */
@Controller("contact-create")
export class ContactCreateController {



  /**
   * Create a contact in the active organization.
   * @param headers Organization-context credentials.
   * @param input Contact identity and communication details.
   * @returns Created contact.
   * @tag Contact
   */
  @core.TypedRoute.Post()

  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IContact.ICreate): Promise<IContact> { return ContactProvider.create({ headers, input }); }
}
