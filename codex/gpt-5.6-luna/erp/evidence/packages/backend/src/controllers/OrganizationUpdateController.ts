
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth, IOrganization } from "@benchmark/erp-api";
import { OrganizationProvider } from "../providers/OrganizationProvider";

/** Publishes Owner organization configuration updates. */
@Controller("organization-update")
export class OrganizationUpdateController {



  /**
   * Update organization configuration as its Owner.
   * @param headers Owner credentials.
   * @param id Organization identifier.
   * @param input Mutable configuration fields.
   * @returns Updated organization.
   * @tag Organization
   */
  @core.TypedRoute.Put(":id")

  public async update(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IOrganization.IUpdate): Promise<IOrganization> {
    return OrganizationProvider.update({ headers, id, input });
  }
}
