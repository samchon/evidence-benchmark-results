import type * as api from "@benchmark/todo-api";
import { Controller } from "@nestjs/common";
import * as core from "@nestia/core";
import { AuthProvider, UserAuth, type UserPayload } from "../auth/AuthProvider";

/** Public and private account-security operations. */
@Controller("auth/user")
export class AuthController {
  /**
   * Register a private account and issue its first session.
   * @param input Email, password, and initial display name.
   * @returns The new private session and profile display name.
   * @throws 409 for a duplicate canonical email; 422 for invalid input.
   * @setHeader token.access Authorization
   * @tag Auth
   */
  @core.TypedRoute.Post("join")
  public async join(@core.TypedBody() input: api.IAuth): Promise<api.IAuth.IAuthorized> { return AuthProvider.join(input); }

  /**
   * Authenticate an existing account without revealing credential failure details.
   * @param input Existing email and password.
   * @returns A new session for the authenticated account.
   * @throws 401 for either an unknown email or an incorrect password.
   * @setHeader token.access Authorization
   * @tag Auth
   */
  @core.TypedRoute.Post("login")
  public async login(@core.TypedBody() input: api.IAuth.ILogin): Promise<api.IAuth.IAuthorized> { return AuthProvider.login(input); }

  /**
   * Continue a valid session by exchanging its refresh token.
   * @param input Previously issued refresh token.
   * @returns Refreshed tokens for the same account and session.
   * @throws 401 when the token is missing, expired, invalid, or revoked.
   * @setHeader token.access Authorization
   * @tag Auth
   */
  @core.TypedRoute.Post("refresh")
  public async refresh(@core.TypedBody() input: api.IAuth.IRefresh): Promise<api.IAuth.IAuthorized> { return AuthProvider.refresh(input); }

  /**
   * End only the current authenticated session.
   * @param actor Authenticated caller resolved from the bearer access token.
   * @returns A success marker after the current session is revoked.
   * @throws 401 when no valid caller session is present.
   * @tag Auth
   */
  @core.TypedRoute.Post("logout")
  public async logout(@UserAuth() actor: UserPayload): Promise<{ success: true }> { return AuthProvider.logout(actor); }

  /**
   * End every session belonging to the current account.
   * @param actor Authenticated caller whose account sessions are revoked.
   * @returns A success marker after all account sessions are revoked.
   * @throws 401 when no valid caller session is present.
   * @tag Auth
   */
  @core.TypedRoute.Post("logout-all")
  public async logoutAll(@UserAuth() actor: UserPayload): Promise<{ success: true }> { return AuthProvider.logoutAll(actor); }

  /**
   * Replace the current password and invalidate all old sessions.
   * @param actor Authenticated caller whose credential is changed.
   * @param input Current password and accepted replacement password.
   * @returns A success marker after the credential transaction commits.
   * @throws 401 when unauthenticated; 403 for a wrong current password; 422 for invalid or reused input.
   * @tag Auth
   */
  @core.TypedRoute.Put("password")
  public async changePassword(@UserAuth() actor: UserPayload, @core.TypedBody() input: api.IAuth.IChangePassword): Promise<{ success: true }> { return AuthProvider.changePassword(actor, input); }

  /**
   * Start non-disclosing forgotten-password recovery.
   * @param input Email identity requesting an out-of-band recovery proof.
   * @returns A proof-shaped response with no account-existence signal.
   * @throws 422 for an invalid email value.
   * @tag Auth
   */
  @core.TypedRoute.Post("recover/start")
  public async recoverStart(@core.TypedBody() input: api.IAuth.IRecoverStart): Promise<{ proof: string }> { return AuthProvider.recoverStart(input); }

  /**
   * Complete forgotten-password recovery with the proven email identity.
   * @param input Registered email, one-time proof, and replacement password.
   * @returns A success marker after credential and session invalidation commit.
   * @throws 401 for an invalid or reused proof; 422 for an invalid replacement.
   * @tag Auth
   */
  @core.TypedRoute.Post("recover")
  public async recover(@core.TypedBody() input: api.IAuth.IRecoverPassword): Promise<{ success: true }> { return AuthProvider.recover(input); }

  /**
   * Permanently delete the current account and all owned private data.
   * @param actor Authenticated caller whose account is removed.
   * @param input Current password confirmation.
   * @returns A success marker after cascading account deletion commits.
   * @throws 401 when unauthenticated; 403 for a wrong current password.
   * @tag Auth
   */
  @core.TypedRoute.Delete("account")
  public async deleteAccount(@UserAuth() actor: UserPayload, @core.TypedBody() input: api.IAuth.IDeleteAccount): Promise<{ success: true }> { return AuthProvider.deleteAccount(actor, input); }
}
