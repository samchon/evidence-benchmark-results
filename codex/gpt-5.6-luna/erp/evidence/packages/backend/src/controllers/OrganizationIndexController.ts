
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth, IOrganization, IPage } from "@benchmark/erp-api";
import { OrganizationProvider } from "../providers/OrganizationProvider";

/** Publishes membership-scoped organization discovery. */
@Controller("organization-search")
export class OrganizationIndexController {



  /**
   * List organizations in which the signed-in user has an active membership.
   * @param headers Global credentials.
   * @param input Pagination and optional name search.
   * @returns Active membership organizations only.
   * @tag Organization
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-007-select-the-active-organization-after-login Lists only selectable active memberships.
   */
  @core.TypedRoute.Patch()

  public async index(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IOrganization.IRequest): Promise<IPage<IOrganization>> {
    return OrganizationProvider.index({ headers, input });
  }
}
