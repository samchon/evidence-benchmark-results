import * as core from "@nestia/core";
import { Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { IProfile } from "@benchmark/todo-api";
import { AuthGuard } from "../guards/AuthGuard";
import { AuthProvider } from "../providers/AuthProvider";
import { ProfileProvider } from "../providers/ProfileProvider";

/** Current-profile read operation. */
@Controller("todo-profile")
@UseGuards(AuthGuard)
export class ProfileController {
  /**
   * @evidence docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Reads the private display identity.
   * @evidence docs/analysis/02-domain-model.md#req-dom-profile-1-define-the-user-profile Returns the current display name.
   * @evidence docs/analysis/02-domain-model.md#req-dom-profile-2-bind-one-private-profile-to-each-account Resolves the profile from its owner.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Implements the profile surface.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-1-view-the-current-users-profile Returns the current user's profile.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses the authenticated account boundary.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires a valid session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Reads only the current owner's profile.
   * @evidence docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Exposes the normalized profile name.
   * @evidence docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Returns the bounded display name.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps profile data private.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Reads no other account profile.
   * @evidence prisma:todo_profiles Reads the owned profile.
   */
  @core.TypedRoute.Get()
  public async at(@Req() req: Request): Promise<IProfile> { return ProfileProvider.at(AuthProvider.request(req)); }
}
