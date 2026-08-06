import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth, IOrganization } from "@benchmark/erp-api";
import { OrganizationProvider } from "../providers/OrganizationProvider";

/** Reports blockers before an Owner requests organization retirement. */
@Controller("organization-delete-blockers")
export class OrganizationDeleteCheckController {
  @core.TypedRoute.Get(":id")
  public async check(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedParam("id") id: string): Promise<IOrganization.IDeleteCheck> {
    return OrganizationProvider.deleteCheck({ headers, id });
  }
}
