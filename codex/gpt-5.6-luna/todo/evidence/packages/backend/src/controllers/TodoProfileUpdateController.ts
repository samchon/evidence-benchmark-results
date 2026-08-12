import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoProfile } from "@benchmark/todo-api";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { ProfileProvider } from "../providers/ProfileProvider";

/** Private profile update operation. */
@Controller("todo/user/profile/update-operation")
export class TodoProfileUpdateController {
  /**
   * Replace only the authenticated user's normalized display name.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-2-edit-the-display-name Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-2-edit-the-display-name Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_profiles Updates only the owned display name.
   * @evidenceReview prisma:todo_profiles Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Put()
  public async update(
    @UserAuth() user: UserPayload,
    @core.TypedBody() body: ITodoProfile.IUpdate,
  ): Promise<ITodoProfile> {
    return ProfileProvider.update({ user, body });
  }
}
