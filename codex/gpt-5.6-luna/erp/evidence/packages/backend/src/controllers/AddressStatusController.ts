
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAddress, IAuth } from "@benchmark/erp-api";
import { AddressProvider } from "../providers/AddressProvider";

/** Publishes address activation and retirement. */
@Controller("address-status")
export class AddressStatusController {



  /**
   * Deactivate or reactivate an address for new relationships.
   * @param headers Organization-context credentials.
   * @param id Address identifier.
   * @param input New active state.
   * @returns Updated address.
   * @tag Address
   */
  @core.TypedRoute.Put(":id")

  public async status(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IAddress.IStatus): Promise<IAddress> {
    return AddressProvider.status({ headers, id, input });
  }
}
