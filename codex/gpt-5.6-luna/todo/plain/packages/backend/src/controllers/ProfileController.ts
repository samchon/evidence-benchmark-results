import type * as api from "@benchmark/todo-api";
import { Controller } from "@nestjs/common";
import * as core from "@nestia/core";
import { UserAuth, type UserPayload } from "../auth/AuthProvider";
import { ProfileProvider } from "../providers/ProfileProvider";

/** Current user's private profile. */
@Controller("profile")
export class ProfileController {
  /**
   * Read the display name for the authenticated account.
   * @param actor Authenticated caller whose private profile is read.
   * @returns The caller's current display name only.
   * @throws 401 when unauthenticated; 404 when the account profile is absent.
   * @tag Profile
   */
  @core.TypedRoute.Get()
  public async at(@UserAuth() actor: UserPayload): Promise<api.IProfile> { return ProfileProvider.at(actor); }

  /**
   * Replace only the authenticated account's display name.
   * @param actor Authenticated caller whose private profile is changed.
   * @param input Trimmed display-name replacement.
   * @returns The updated private display name.
   * @throws 401 when unauthenticated; 422 for an empty or overlong name.
   * @tag Profile
   */
  @core.TypedRoute.Put()
  public async update(@UserAuth() actor: UserPayload, @core.TypedBody() input: api.IProfile.IUpdate): Promise<api.IProfile> { return ProfileProvider.update(actor, input); }
}
