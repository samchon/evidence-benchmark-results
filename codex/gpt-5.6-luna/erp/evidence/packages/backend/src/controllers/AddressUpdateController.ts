
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAddress, IAuth } from "@benchmark/erp-api";
import { AddressProvider } from "../providers/AddressProvider";

/** Publishes address revision. */
@Controller("address-update")
export class AddressUpdateController {



  /**
   * Update a reusable address without changing historical selections.
   * @param headers Organization-context credentials.
   * @param id Address identifier.
   * @param input Mutable postal fields.
   * @returns Updated address.
   * @tag Address
   */
  @core.TypedRoute.Put(":id")

  public async update(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IAddress.IUpdate): Promise<IAddress> {
    return AddressProvider.update({ headers, id, input });
  }
}
