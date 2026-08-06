import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth } from "@benchmark/todo-api";
import { AuthProvider } from "../providers/AuthProvider";

/** Registration operation. */
@Controller("todo-auth-join")
export class AuthJoinController {
  /**
   * Registration operation.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Covers the published operation contract.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-1-register-a-private-account Creates account state.
   * @evidence docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Creates the private profile alongside the account.
   * @evidence docs/analysis/02-domain-model.md#req-dom-profile-2-bind-one-private-profile-to-each-account Creates the one-to-one profile relationship.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Validates registration credentials.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Canonicalizes the registration identity.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Applies the registration password boundary.
   * @evidence docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Validates the initial display name.
   * @evidence docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Applies the initial name normalization and bound.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Begins the authenticated owner boundary.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Provides the unauthenticated registration entry point.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Establishes a private account boundary.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Returns no other account information.
   * @evidence prisma:todo_accounts Creates the account row.
   * @evidence prisma:todo_profiles Creates the paired profile row.
   * @evidence prisma:todo_sessions Creates the first session row.
   * @setHeader token.access Authorization
   */
  @core.TypedRoute.Post()
  public async join(@core.TypedBody() body: IAuth.IJoin): Promise<IAuth.IAuthorized> { return AuthProvider.join(body); }
}
