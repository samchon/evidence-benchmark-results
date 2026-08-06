
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth, IContact, IPage } from "@benchmark/erp-api";
import { ContactProvider } from "../providers/ContactProvider";

/** Publishes contact discovery. */
@Controller("contact-search")
export class ContactIndexController {



  /**
   * Find contacts by communication identity.
   * @param headers Organization-context credentials.
   * @param input Contact filters.
   * @returns Contacts visible in the selected organization.
   * @tag Contact
   */
  @core.TypedRoute.Patch()

  public async index(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IContact.IRequest): Promise<IPage<IContact>> { return ContactProvider.index({ headers, input }); }
}
