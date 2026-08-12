import type * as api from "@benchmark/todo-api";
import { TypedBody, TypedRoute } from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";

import { UserAuth, UserGuard } from "../decorators/UserAuth";
import { AuthProvider, type UserPayload } from "../providers/AuthProvider";

/** The authenticated account's private one-to-one profile. */
@Controller("todo/user/profile")
@UseGuards(UserGuard)
export class ProfileController {
  /**
   * Return the current account's private display profile.
   *
   * @returns The authenticated owner's profile
   * @tag Profile
   */
  @TypedRoute.Get()
  public async at(@UserAuth() user: UserPayload): Promise<api.IUser> {
    return AuthProvider.profile({ user });
  }

  /**
   * Replace only the current account's display name.
   * Refuses a blank or overlong trimmed name.
   *
   * @param body Replacement display name
   * @returns The updated private profile
   * @tag Profile
   */
  @TypedRoute.Put()
  public async update(@UserAuth() user: UserPayload, @TypedBody() body: api.IUser.IUpdateProfile): Promise<api.IUser> {
    return AuthProvider.updateProfile({ user, displayName: body.displayName });
  }
}
