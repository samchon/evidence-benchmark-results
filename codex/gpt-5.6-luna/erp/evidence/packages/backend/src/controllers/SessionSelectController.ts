
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth, IMembership } from "@benchmark/erp-api";
import { SessionProvider } from "../providers/SessionProvider";

/** Publishes explicit active-organization selection. */
@Controller("auth-session-organization")
export class SessionSelectController {



  /**
   * Select an active organization membership for this session.
   * @param headers Current access credentials.
   * @param input Membership to select.
   * @returns The selected membership.
   * @tag Session
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Covers the authenticated account-management operations.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-007-select-the-active-organization-after-login Establishes the organization boundary for later work.
   */
  @core.TypedRoute.Put("organization")

  public async select(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IMembership.ISelect): Promise<IMembership> {
    return SessionProvider.select({ headers, input });
  }
}
