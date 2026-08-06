import * as core from "@nestia/core";
import { Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { IProfile, IProfileUpdate } from "@benchmark/todo-api";
import { AuthGuard } from "../guards/AuthGuard";
import { AuthProvider } from "../providers/AuthProvider";
import { ProfileProvider } from "../providers/ProfileProvider";

/** Display-name edit operation. */
@Controller("todo-profile-update")
@UseGuards(AuthGuard)
export class ProfileUpdateController {
  /**
   * @evidence docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Changes only the private display identity.
   * @evidence docs/analysis/02-domain-model.md#req-dom-profile-1-define-the-user-profile Maintains the profile display name.
   * @evidence docs/analysis/02-domain-model.md#req-dom-profile-2-bind-one-private-profile-to-each-account Updates the current owner's profile.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Implements the profile surface.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-2-edit-the-display-name Replaces the private display name.
   * @evidence docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Applies display-name normalization.
   * @evidence docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Applies the one-to-100-character bound.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses the authenticated account boundary.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires a valid session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Updates only the current owner's profile.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps profile data private.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Updates no other account profile.
   * @evidence prisma:todo_profiles Updates the owned profile.
   */
  @core.TypedRoute.Put()
  public async update(@Req() req: Request, @core.TypedBody() body: IProfileUpdate): Promise<IProfile> { return ProfileProvider.update(AuthProvider.request(req), body); }
}
