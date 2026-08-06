
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IOrganization } from "@benchmark/erp-api";
import { OrganizationProvider } from "../providers/OrganizationProvider";

/** Publishes tenant creation. */
@Controller("organization")
export class OrganizationCreateController {



  /**
   * Create an organization and become its first Owner.
   * @param headers Signed-in global User credentials.
   * @param input Organization identity and defaults.
   * @returns The created organization.
   * @tag Organization
   */
  @core.TypedRoute.Post()

  public async create(@core.TypedBody() input: IOrganization.ICreate): Promise<IOrganization> {
    return OrganizationProvider.create({ input });
  }
}
