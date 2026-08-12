import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoUser } from "@benchmark/todo-api";
import { AuthProvider } from "../providers/AuthProvider";

/** Public registration operation. */
@Controller("todo/auth/user/join-operation")
export class TodoAuthJoinController {
  /**
   * Register an account, private profile, and first authenticated session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-1-register-a-private-account Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-1-register-a-private-account Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-2-log-in-with-email-and-password Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-2-log-in-with-email-and-password Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_users Creates the account and session owner.
   * @evidenceReview prisma:todo_users Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_profiles Creates the required private profile.
   * @evidenceReview prisma:todo_profiles Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_sessions Creates the first authenticated session.
   * @evidenceReview prisma:todo_sessions Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Post()
  public async join(
    @core.TypedBody() body: ITodoUser.IJoin,
  ): Promise<ITodoUser.IAuthorized> {
    return AuthProvider.join({ body });
  }
}
