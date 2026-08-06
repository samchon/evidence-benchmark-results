
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAddress, IAuth, IPage } from "@benchmark/erp-api";
import { AddressProvider } from "../providers/AddressProvider";

/** Publishes address discovery. */
@Controller("address-search")
export class AddressIndexController {



  /**
   * Find addresses available for a relationship purpose.
   * @param headers Organization-context credentials.
   * @param input Optional address search.
   * @returns Reusable active addresses in the selected organization.
   * @tag Address
   */
  @core.TypedRoute.Patch()

  public async index(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IAddress.IRequest): Promise<IPage<IAddress>> {
    return AddressProvider.index({ headers, input });
  }
}
