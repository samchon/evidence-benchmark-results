import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoProfile } from "@benchmark/todo-api";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { ProfileProvider } from "../providers/ProfileProvider";

/** Private profile inspection operation. */
@Controller("todo/user/profile/view")
export class TodoProfileAtController {
  /**
   * View the one profile attached to the authenticated account.
   * @evidence docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/02-domain-model.md#req-dom-profile-1-define-the-user-profile Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-1-define-the-user-profile Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/02-domain-model.md#req-dom-profile-2-bind-one-private-profile-to-each-account Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-2-bind-one-private-profile-to-each-account Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-1-view-the-current-users-profile Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-1-view-the-current-users-profile Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Supports the requirement.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Supports the requirement.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_profiles Reads the current private profile.
   * @evidenceReview prisma:todo_profiles Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_users Enforces account ownership.
   * @evidenceReview prisma:todo_users Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Get()
  public async at(@UserAuth() user: UserPayload): Promise<ITodoProfile> {
    return ProfileProvider.at({ user });
  }
}
