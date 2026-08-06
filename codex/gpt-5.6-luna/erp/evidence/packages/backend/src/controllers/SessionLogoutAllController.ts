
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth } from "@benchmark/erp-api";
import { SessionProvider } from "../providers/SessionProvider";

/** Publishes all-session logout. */
@Controller("auth-session-all")
export class SessionLogoutAllController {



  /**
   * Revoke every active session for the current user.
   * @param headers Current access credentials.
   * @returns Acknowledgement of revocation.
   * @tag Session
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-004-revokes-all-of-their-active-sessions-in-one-action Revokes all concurrent sessions in one action.
   */
  @core.TypedRoute.Delete("all")

  public async logoutAll(@core.TypedHeaders() headers: IAuth.IHeaders): Promise<boolean> {
    await SessionProvider.logoutAll({ headers });
    return true;
  }
}
