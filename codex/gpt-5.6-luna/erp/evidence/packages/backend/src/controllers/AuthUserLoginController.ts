
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

/** Publishes global User email-and-password login. */
@Controller("auth/user-login")
export class AuthUserLoginController {



  /**
   * Authenticate an active global user and issue an independent session.
   * @param input Global email and password.
   * @returns Access and refresh credentials with no selected organization.
   * @tag Authentication
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Refuses ineligible credentials without revealing the cause.
   */
  @core.TypedRoute.Post()

  public async login(@core.TypedBody() input: IAuth.ILogin): Promise<IAuth.IAuthorized> {
    return AuthProvider.login({ input });
  }
}
