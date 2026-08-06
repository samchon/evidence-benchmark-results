
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth } from "@benchmark/erp-api";
import { SessionProvider } from "../providers/SessionProvider";

/** Publishes current-session logout. */
@Controller("auth-session-current")
export class SessionLogoutController {



  /**
   * End the current session only.
   * @param headers Current access credentials.
   * @returns Acknowledgement of revocation.
   * @tag Session
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-003-logs-out-the-current-session-without-ending-other-active-sessions Revokes only the current session.
   */
  @core.TypedRoute.Delete()

  public async logout(@core.TypedHeaders() headers: IAuth.IHeaders): Promise<boolean> {
    await SessionProvider.logout({ headers });
    return true;
  }
}
