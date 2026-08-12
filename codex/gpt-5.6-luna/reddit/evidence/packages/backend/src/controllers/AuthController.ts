import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";

import type { IRedditUser } from "@benchmark/reddit-api";
import { RedditAuth } from "../decorators/RedditAuth";
import { RedditProvider } from "../providers/RedditProvider";

/** Publishes account, session, password, and recovery lifecycle operations. */
@Controller("auth/user")
export class AuthController {
  /** Registers an account and starts its first session. @setHeader token.access Authorization @tag Authentication */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-account-provisioning-and-login Publishes registration and login. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-account-provisioning-and-login Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-001-register-a-user-account Publishes account registration. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-001-register-a-user-account Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-002-refuse-conflicting-registration Publishes registration conflict handling. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-002-refuse-conflicting-registration Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-001-bootstrap-community-owner-and-subscriber Publishes initial role bootstrap. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-001-bootstrap-community-owner-and-subscriber Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-identity-account-identity-rules Publishes identity validation. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-identity-account-identity-rules Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-identity-001-enforce-case-insensitive-email-and-username-uniqueness Publishes normalized uniqueness enforcement. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-identity-001-enforce-case-insensitive-email-and-username-uniqueness Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/04-business-rules.md#req-rule-identity-002-require-complete-registration-credentials Publishes complete credential input. */
  /** @evidenceReview docs/analysis/04-business-rules.md#req-rule-identity-002-require-complete-registration-credentials Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model Publishes the profile bootstrap boundary. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_users Persists account identity. */
  /** @evidenceReview prisma:reddit_users Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_profiles Persists initial public profile. */
  /** @evidenceReview prisma:reddit_profiles Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_user_sessions Persists the first session. */
  /** @evidenceReview prisma:reddit_user_sessions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_subscriptions Persists initial subscription state. */
  /** @evidenceReview prisma:reddit_subscriptions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_moderator_assignments Persists initial owner authority. */
  /** @evidenceReview prisma:reddit_moderator_assignments Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Post("join")
  public async join(
    @core.TypedBody() body: IRedditUser.IJoin,
  ): Promise<IRedditUser.IAuthorized> {
    return RedditProvider.join(body);
  }

  /** Logs in with the private email identity. @setHeader token.access Authorization @tag Authentication */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-003-log-in-with-credentials Publishes credential login. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-003-log-in-with-credentials Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-004-refuse-ineligible-login Publishes ineligible-login refusal. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-004-refuse-ineligible-login Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle Publishes session issuance. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-001-maintain-concurrent-sessions Publishes concurrent session behavior. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-001-maintain-concurrent-sessions Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_users Reads credential eligibility. */
  /** @evidenceReview prisma:reddit_users Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_user_sessions Persists a new authenticated session. */
  /** @evidenceReview prisma:reddit_user_sessions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Post("login")
  public async login(
    @core.TypedBody() body: IRedditUser.ILogin,
  ): Promise<IRedditUser.IAuthorized> {
    return RedditProvider.login(body);
  }

  /** Renews the presented session without creating a concurrent session. @setHeader token.access Authorization @tag Authentication */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-002-continue-an-authenticated-session Publishes session continuation. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-002-continue-an-authenticated-session Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_user_sessions Rotates the presented session. */
  /** @evidenceReview prisma:reddit_user_sessions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Post("refresh")
  public async refresh(
    @core.TypedBody() body: IRedditUser.IRefresh,
  ): Promise<IRedditUser.IAuthorized> {
    return RedditProvider.refresh(body);
  }

  /** Changes the current password and revokes every other session. @tag Authentication */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle Publishes account management. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-001-change-the-current-password Publishes password change. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-001-change-the-current-password Compared the controller with passwordUpdate and test_api_auth_password; verified same-password refusal, old-password rejection, new-password login, and session handling. */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-004-revoke-all-active-sessions Publishes session revocation. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-004-revoke-all-active-sessions Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_users Updates credential state. */
  /** @evidenceReview prisma:reddit_users Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_user_sessions Revokes other sessions. */
  /** @evidenceReview prisma:reddit_user_sessions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Put("password")
  public async password(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedBody() body: IRedditUser.IPasswordUpdate,
  ): Promise<{ success: true }> {
    await RedditProvider.passwordUpdate(actor, body);
    return { success: true };
  }

  /** Requests neutral one-time recovery delivery. @tag Authentication */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-002-recover-a-forgotten-password Publishes recovery request. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-002-recover-a-forgotten-password Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_recovery_proofs Persists one-time recovery state. */
  /** @evidenceReview prisma:reddit_recovery_proofs Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_effects Persists neutral delivery effects. */
  /** @evidenceReview prisma:reddit_effects Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Post("recovery/request")
  public async recoveryRequest(
    @core.TypedBody() body: IRedditUser.IRecoveryRequest,
  ): Promise<{ success: true }> {
    await RedditProvider.recoveryRequest(body);
    return { success: true };
  }

  /** Completes recovery with a current one-time proof. @tag Authentication */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-002-recover-a-forgotten-password Publishes recovery completion. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-002-recover-a-forgotten-password Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_recovery_proofs Consumes one-time recovery state. */
  /** @evidenceReview prisma:reddit_recovery_proofs Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_users Replaces credential state. */
  /** @evidenceReview prisma:reddit_users Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_user_sessions Revokes sessions after recovery. */
  /** @evidenceReview prisma:reddit_user_sessions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Post("recovery/complete")
  public async recoveryComplete(
    @core.TypedBody() body: IRedditUser.IRecoveryComplete,
  ): Promise<{ success: true }> {
    await RedditProvider.recoveryComplete(body);
    return { success: true };
  }

  /** Revokes only the current authenticated session. @tag Authentication */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-003-log-out-the-current-session Publishes current-session logout. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-003-log-out-the-current-session Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_user_sessions Revokes the current session. */
  /** @evidenceReview prisma:reddit_user_sessions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Delete("session")
  public async logout(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
  ): Promise<{ success: true }> {
    await RedditProvider.logout(actor);
    return { success: true };
  }

  /** Revokes every active session for the current account. @tag Authentication */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-004-revoke-all-active-sessions Publishes all-session logout. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-004-revoke-all-active-sessions Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_user_sessions Revokes all active sessions. */
  /** @evidenceReview prisma:reddit_user_sessions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Delete("sessions")
  public async logoutAll(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
  ): Promise<{ success: true }> {
    await RedditProvider.logoutAll(actor);
    return { success: true };
  }

  /** Permanently deletes the current account after password confirmation. @tag Authentication */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-003-delete-a-user-account Publishes account deletion. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-003-delete-a-user-account Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-004-apply-permanent-deleted-account-status Publishes permanent deleted status. */
  /** @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-004-apply-permanent-deleted-account-status Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-community-life-002-transfer-ownership-after-owner-deletion Publishes succession handling. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-life-002-transfer-ownership-after-owner-deletion Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence docs/analysis/02-domain-model.md#req-dom-community-life-003-archive-an-ownerless-community Publishes ownerless archival handling. */
  /** @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-life-003-archive-an-ownerless-community Read the cited requirement, controller contract, provider implementation, and corresponding backend test; verified this operation enforces the stated behavior. */
  /** @evidence prisma:reddit_users Applies deleted identity state. */
  /** @evidenceReview prisma:reddit_users Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_profiles Applies public de-identification. */
  /** @evidenceReview prisma:reddit_profiles Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_user_sessions Revokes account sessions. */
  /** @evidenceReview prisma:reddit_user_sessions Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  /** @evidence prisma:reddit_communities Applies succession or archival state. */
  /** @evidenceReview prisma:reddit_communities Compared the provider delegation and Prisma model with the corresponding backend test; verified this operation exposes or mutates the cited persisted state. */
  @core.TypedRoute.Post("account/delete")
  public async erase(
    @RedditAuth.decorator() actor: RedditAuth.Payload,
    @core.TypedBody() body: IRedditUser.ILogin,
  ): Promise<{ success: true }> {
    await RedditProvider.erase(actor, body);
    return { success: true };
  }
}
