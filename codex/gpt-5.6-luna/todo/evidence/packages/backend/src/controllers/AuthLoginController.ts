import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth } from "@benchmark/todo-api";
import { AuthProvider } from "../providers/AuthProvider";

/** Login operation. */
@Controller("todo-auth-login")
export class AuthLoginController {
  /**
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Authenticates the account-entry operation.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-2-log-in-with-email-and-password Authenticates the supplied account credentials.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Applies the login credential rules.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Matches the canonical email identity.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Applies the password boundary.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-3-conceal-login-credential-failure Returns one generic failure outcome.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Establishes owner-scoped authority after login.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Leaves private capabilities behind a session.
   * @evidence prisma:todo_accounts Reads the credential identity.
   * @evidence prisma:todo_sessions Creates a new authenticated session.
   * @setHeader token.access Authorization
   */
  @core.TypedRoute.Post()
  public async login(@core.TypedBody() body: IAuth.ILogin): Promise<IAuth.IAuthorized> { return AuthProvider.login(body); }
}
