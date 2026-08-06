import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth } from "@benchmark/erp-api";
import { OrganizationProvider } from "../providers/OrganizationProvider";

/** Retires an eligible organization while preserving its audit history. */
@Controller("organization-delete")
export class OrganizationDeleteController {
  @core.TypedRoute.Delete(":id")
  public async remove(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedParam("id") id: string): Promise<{ success: true }> {
    return OrganizationProvider.remove({ headers, id });
  }
}
