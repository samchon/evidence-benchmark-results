import type * as api from "@benchmark/todo-api";
import { TypedBody, TypedRoute } from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";

import { AuthProvider, type UserPayload } from "../providers/AuthProvider";
import { UserAuth, UserGuard } from "../decorators/UserAuth";

/** Public authentication and protected account-security operations. */
@Controller("todo/auth/user")
export class AuthController {
  /**
   * Register a private account and issue its first session.
   *
   * Duplicate canonical email, credential, and display-name violations are
   * refused without creating any account state.
   *
   * @param body Registration credentials and initial profile name
   * @returns The new authenticated session and private profile
   * @tag Authentication
   * @setHeader token.access Authorization
   */
  @TypedRoute.Post("join")
  public async join(@TypedBody() body: api.IUser.IJoin): Promise<api.IUser.IAuthorized> {
    return AuthProvider.join({ body });
  }

  /**
   * Log in with an existing email and password.
   *
   * Unknown emails and wrong passwords have the same generic refusal.
   *
   * @param body Login credentials
   * @returns A new independent authenticated session
   * @tag Authentication
   * @setHeader token.access Authorization
   */
  @TypedRoute.Post("login")
  public async login(@TypedBody() body: api.IUser.ILogin): Promise<api.IUser.IAuthorized> {
    return AuthProvider.login({ body });
  }

  /**
   * Continue one valid session with its refresh token.
   *
   * @tag Authentication
   * @setHeader token.access Authorization
   */
  @TypedRoute.Post("refresh")
  public async refresh(@TypedBody() body: api.IUser.IRefresh): Promise<api.IUser.IAuthorized> {
    return AuthProvider.refresh({ body });
  }

  /**
   * Start forgotten-password recovery without disclosing account existence.
   *
   * An existing account receives a recorded email effect; the response is
   * identical when no account matches.
   *
   * @param body Email identity to notify when it exists
   * @returns A non-disclosing acknowledgement
   * @tag Authentication
   */
  @TypedRoute.Post("recovery/request")
  public async recoveryRequest(@TypedBody() body: api.IUser.IRecoveryRequest): Promise<api.IOperationResult> {
    return AuthProvider.requestRecovery({ body });
  }

  /**
   * Consume the one-time email proof and issue a replacement session.
   * Refuses an unknown, expired, consumed, or incorrect proof.
   *
   * @param body Email, delivered proof, and replacement password
   * @returns A new authenticated session
   * @tag Authentication
   * @setHeader token.access Authorization
   */
  @TypedRoute.Post("recovery/confirm")
  public async recoveryConfirm(@TypedBody() body: api.IUser.IRecoveryConfirm): Promise<api.IUser.IAuthorized> {
    return AuthProvider.confirmRecovery({ body });
  }
}

/** Authenticated account-management operations. */
@Controller("todo/user")
@UseGuards(UserGuard)
export class AccountController {
  /**
   * End only the current authenticated session; other account sessions remain valid.
   *
   * @returns A successful acknowledgement
   * @tag Authentication
   */
  @TypedRoute.Post("logout")
  public async logout(@UserAuth() user: UserPayload): Promise<api.IOperationResult> {
    return AuthProvider.logout({ user });
  }

  /**
   * End every session belonging to the current account.
   *
   * @returns A successful acknowledgement
   * @tag Authentication
   */
  @TypedRoute.Post("logout-all")
  public async logoutAll(@UserAuth() user: UserPayload): Promise<api.IOperationResult> {
    return AuthProvider.logoutAll({ user });
  }

  /**
   * Replace the password after proving the current password; all sessions end.
   * Refuses an incorrect, reused, or invalid password.
   *
   * @param body Current and replacement passwords
   * @returns A successful acknowledgement
   * @tag Authentication
   */
  @TypedRoute.Put("password")
  public async changePassword(@UserAuth() user: UserPayload, @TypedBody() body: api.IUser.IChangePassword): Promise<api.IOperationResult> {
    return AuthProvider.changePassword({ user, body });
  }

  /**
   * Permanently delete the account, profile, sessions, Todos, trash, and history.
   * Refuses an incorrect current password.
   *
   * @param body Current password confirmation
   * @returns A successful acknowledgement
   * @tag Authentication
   */
  @TypedRoute.Post("account/delete")
  public async deleteAccount(@UserAuth() user: UserPayload, @TypedBody() body: api.IUser.IDeleteAccount): Promise<api.IOperationResult> {
    return AuthProvider.deleteAccount({ user, body });
  }
}
