
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth, IContact } from "@benchmark/erp-api";
import { ContactProvider } from "../providers/ContactProvider";

/** Publishes contact activation and deactivation. */
@Controller("contact-status")
export class ContactStatusController {



  /**
   * Deactivate or reactivate a contact without erasing history.
   * @param headers Organization-context credentials.
   * @param id Contact identifier.
   * @param input New active state.
   * @returns Updated contact.
   * @tag Contact
   */
  @core.TypedRoute.Put(":id")

  public async status(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: { active: boolean }): Promise<IContact> { return ContactProvider.status({ headers, id, active: input.active }); }
}
