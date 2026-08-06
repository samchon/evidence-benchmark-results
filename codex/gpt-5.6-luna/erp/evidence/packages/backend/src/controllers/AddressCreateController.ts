
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAddress, IAuth } from "@benchmark/erp-api";
import { AddressProvider } from "../providers/AddressProvider";

/** Publishes address creation for the selected organization. */
@Controller("address-create")
export class AddressCreateController {
/**
   * Create an address for the active organization.
   * @param headers Organization-context credentials.
   * @param input Address identity and postal fields.
   * @returns Created reusable address.
   * @tag Address
 * @evidence prisma:addresses Exposes the persisted addresses record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IAddress.ICreate): Promise<IAddress> {
    return AddressProvider.create({ headers, input });
  }
}
