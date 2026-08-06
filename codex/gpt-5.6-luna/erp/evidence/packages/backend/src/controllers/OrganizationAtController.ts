
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth, IOrganization } from "@benchmark/erp-api";
import { OrganizationProvider } from "../providers/OrganizationProvider";

/** Publishes tenant detail reads. */
@Controller("organization-detail")
export class OrganizationAtController {
/**
   * Read one organization visible through the current user's membership.
   * @param headers Organization-context credentials.
   * @param id Organization identifier.
   * @returns Current organization configuration.
   * @tag Organization
 * @evidence prisma:organizations Exposes the persisted organizations record through this operation.
*/
  @core.TypedRoute.Get(":id")
  public async at(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedParam("id") id: string): Promise<IOrganization> {
    return OrganizationProvider.at({ headers, id });
  }
}
