
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

/** Publishes refresh-token session continuation. */
@Controller("auth/user-refresh")
export class AuthUserRefreshController {



  /**
   * Continue an eligible current session without re-entering credentials.
   * @param input Refresh credential.
   * @returns Rotated access and refresh credentials.
   * @tag Authentication
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout Rechecks account and membership eligibility before continuation.
   */
  @core.TypedRoute.Post()

  public async refresh(@core.TypedBody() input: IAuth.IRefresh): Promise<IAuth.IAuthorized> {
    return AuthProvider.refresh({ input });
  }
}
