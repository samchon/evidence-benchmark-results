import * as core from "@nestia/core";
import { Controller, Headers, Post, Put } from "@nestjs/common";
import type { IAuth } from "@benchmark/reddit2-api";
import crypto from "node:crypto";

import { MyGlobal } from "../MyGlobal";
import { AuthUtil } from "../utils/AuthUtil";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Publishes account, session, and password lifecycle operations. */
@Controller("auth/user")
export class AuthController {
  /**
   * Register a new account, profile, and authenticated session.
   *
   * @param body Registration credentials.
   * @returns The new identity and bearer material.
   * @setHeader token.access Authorization
   */
 /**
  * @evidence prisma:users Persists and reads the users state required by this operation.
  * @evidence prisma:sessions Persists and reads the sessions state required by this operation.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-account-provisioning-and-login The public join operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-001-register-a-user-account The public join operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-001-maintain-concurrent-sessions The public join operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-profile-003-establish-initial-profile-values The public join operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-identity-account-identity-rules The public join operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-identity-001-enforce-case-insensitive-email-and-username-uniqueness The public join operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-identity-002-require-complete-registration-credentials The public join operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-identity-003-reserve-deleted-account-identifiers The public join operation implements this requirement.
 */
  @Post("join/execute")
   public async join(@core.TypedBody() body: IAuth.IJoin): Promise<IAuth.IAuthorized> {
    const email = body.email.trim();
    const username = body.username.trim();
    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = username.toLowerCase();
    const conflict = await MyGlobal.prisma.users.findFirst({ where: { OR: [{ email_normalized: normalizedEmail }, { username_normalized: normalizedUsername }] } });
    if (conflict !== null) throw ErrorUtil.conflict("Email or username is unavailable.");
    const user = await MyGlobal.prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        email,
        email_normalized: normalizedEmail,
        username,
        username_normalized: normalizedUsername,
        password_hash: AuthUtil.hashPassword(body.password),
        created_at: new Date(),
        profile: { create: { id: crypto.randomUUID(), display_name: username, bio: "", karma: 0, created_at: new Date() } },
      },
      select: { id: true, username: true },
    });
    return AuthUtil.createSession(user);
  }

  /**
   * Log in with an active account's email and password.
   *
   * @param body Login credentials.
   * @returns New session bearer material.
   * @setHeader token.access Authorization
   */
 /**
  * @evidence prisma:users Persists and reads the users state required by this operation.
  * @evidence prisma:recovery_proofs Persists and reads the recovery_proofs state required by this operation.
  * @evidence prisma:sessions Persists and reads the sessions state required by this operation.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-account-provisioning-and-login The public login operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-003-log-in-with-credentials The public login operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-004-refuse-ineligible-login The public login operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-001-maintain-concurrent-sessions The public login operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-identity-account-identity-rules The login operation reads the normalized, active identity established by registration.
 */
  @Post("login/execute")
   public async login(@core.TypedBody() body: IAuth.ILogin): Promise<IAuth.IAuthorized> {
    const user = await MyGlobal.prisma.users.findFirst({ where: { email_normalized: body.email.trim().toLowerCase(), deleted_at: null }, select: { id: true, username: true, password_hash: true } });
    if (user === null || !AuthUtil.verifyPassword(body.password, user.password_hash)) throw ErrorUtil.unauthorized("Invalid credentials.");
    return AuthUtil.createSession(user);
  }

  /** Continue a still-live session using its refresh token. */
 /**
  * @evidence prisma:users Persists and reads the users state required by this operation.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle The public refresh operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-002-continue-an-authenticated-session The public refresh operation implements this requirement.
 */
  @Post("refresh/execute")
   public async refresh(@core.TypedBody() body: IAuth.IRefresh): Promise<IAuth.IAuthorized> {
    const parts = body.refreshToken.split(".");
    if (parts.length !== 2) throw ErrorUtil.unauthorized("Invalid refresh token.");
    const [encoded, signature] = parts;
    if (encoded === undefined || signature === undefined) throw ErrorUtil.unauthorized("Invalid refresh token.");
    const expected = crypto.createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(encoded).digest("base64url");
    if (signature !== expected) throw ErrorUtil.unauthorized("Invalid refresh token.");
    let decoded: { sub: string; sid: string; username: string; kind: string; exp: number };
    try { decoded = JSON.parse(Buffer.from(encoded.replaceAll("-", "+").replaceAll("_", "/"), "base64").toString("utf8")) as typeof decoded; } catch { throw ErrorUtil.unauthorized("Invalid refresh token."); }
    if (decoded.kind !== "refresh" || typeof decoded.sub !== "string" || typeof decoded.sid !== "string" || typeof decoded.exp !== "number" || !Number.isFinite(decoded.exp) || decoded.exp <= Date.now()) throw ErrorUtil.unauthorized("Invalid refresh token.");
    const session = await MyGlobal.prisma.sessions.findFirst({ where: { id: decoded.sid, user_id: decoded.sub, revoked_at: null, expires_at: { gt: new Date() }, refresh_token_hash: crypto.createHash("sha256").update(body.refreshToken).digest("hex"), user: { deleted_at: null } }, select: { id: true, expires_at: true, user: { select: { id: true, username: true } } } });
    if (session === null) throw ErrorUtil.unauthorized("Invalid refresh token.");
    return AuthUtil.authorized({ id: session.user.id, sessionId: session.id, username: session.user.username }, session.expires_at);
  }

  /** Revoke only the current session. */
 /**
  * @evidence prisma:users Persists and reads the users state required by this operation.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle The public logout operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-003-log-out-the-current-session The public logout operation implements this requirement.
 */
  @Post("logout/execute")
   public async logout(@Headers("authorization") authorization: string | undefined): Promise<boolean> {
    const actor = await AuthUtil.authorize(authorization);
    await MyGlobal.prisma.sessions.updateMany({ where: { id: actor.sessionId, user_id: actor.id, revoked_at: null }, data: { revoked_at: new Date() } });
    return true;
  }

  /** Revoke every active session for the current account. */
 /**
  * @evidence prisma:users Persists and reads the users state required by this operation.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle The public logoutAll operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-004-revoke-all-active-sessions The public logoutAll operation implements this requirement.
 */
  @Post("logout-all/execute")
   public async logoutAll(@Headers("authorization") authorization: string | undefined): Promise<boolean> {
    const actor = await AuthUtil.authorize(authorization);
    await MyGlobal.prisma.sessions.updateMany({ where: { user_id: actor.id, revoked_at: null }, data: { revoked_at: new Date() } });
    return true;
  }

  /** Change the current password and revoke every other session. */
 /**
  * @evidence prisma:users Persists and reads the users state required by this operation.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle The public changePassword operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-001-change-the-current-password The public changePassword operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-001-keep-credentials-and-email-private The public changePassword operation implements this requirement.
 */
  @Put("password/execute")
   public async changePassword(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: IAuth.IChangePassword): Promise<boolean> {
    const actor = await AuthUtil.authorize(authorization);
    const user = await MyGlobal.prisma.users.findUniqueOrThrow({ where: { id: actor.id }, select: { password_hash: true } });
    if (!AuthUtil.verifyPassword(body.currentPassword, user.password_hash) || body.currentPassword === body.newPassword) throw ErrorUtil.forbidden("Current password is invalid.");
    await MyGlobal.prisma.$transaction([MyGlobal.prisma.users.update({ where: { id: actor.id }, data: { password_hash: AuthUtil.hashPassword(body.newPassword) } }), MyGlobal.prisma.sessions.updateMany({ where: { user_id: actor.id, id: { not: actor.sessionId }, revoked_at: null }, data: { revoked_at: new Date() } })]);
    return true;
  }

  /** Request neutral one-time recovery proof. */
 /**
  * @evidence prisma:users Persists and reads the users state required by this operation.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle The public recoveryRequest operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-002-recover-a-forgotten-password The public recoveryRequest operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-001-keep-credentials-and-email-private The public recoveryRequest operation implements this requirement.
 */
  @Post("recovery/request/execute")
   public async recoveryRequest(@core.TypedBody() body: IAuth.IRecoveryRequest): Promise<boolean> {
    const user = await MyGlobal.prisma.users.findFirst({ where: { email_normalized: body.email.trim().toLowerCase(), deleted_at: null }, select: { id: true } });
    if (user === null) return true;
    const proof = crypto.randomBytes(24).toString("hex");
    await MyGlobal.prisma.recovery_proofs.create({ data: { id: crypto.randomUUID(), user_id: user.id, token_hash: crypto.createHash("sha256").update(proof).digest("hex"), created_at: new Date(), expires_at: new Date(Date.now() + 15 * 60 * 1000) } });
    return true;
  }

  /** Complete password recovery with the latest proof. */
 /**
  * @evidence prisma:users Persists and reads the users state required by this operation.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle The public recoveryComplete operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-002-recover-a-forgotten-password The public recoveryComplete operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-004-revoke-all-active-sessions The public recoveryComplete operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-001-keep-credentials-and-email-private The public recoveryComplete operation implements this requirement.
 */
  @Post("recovery/complete/execute")
   public async recoveryComplete(@core.TypedBody() body: IAuth.IRecoveryComplete): Promise<boolean> {
    const user = await MyGlobal.prisma.users.findFirst({ where: { email_normalized: body.email.trim().toLowerCase(), deleted_at: null }, select: { id: true } });
    if (user === null) throw ErrorUtil.unauthorized("Recovery proof is invalid.");
    const proof = await MyGlobal.prisma.recovery_proofs.findFirst({ where: { user_id: user.id, token_hash: crypto.createHash("sha256").update(body.proof).digest("hex"), used_at: null, expires_at: { gt: new Date() } }, orderBy: { created_at: "desc" } });
    if (proof === null) throw ErrorUtil.unauthorized("Recovery proof is invalid.");
    await MyGlobal.prisma.$transaction([MyGlobal.prisma.users.update({ where: { id: user.id }, data: { password_hash: AuthUtil.hashPassword(body.newPassword) } }), MyGlobal.prisma.recovery_proofs.update({ where: { id: proof.id }, data: { used_at: new Date() } }), MyGlobal.prisma.sessions.updateMany({ where: { user_id: user.id, revoked_at: null }, data: { revoked_at: new Date() } })]);
    return true;
  }

  /** Permanently delete the current account and dependent state. */
 /**
  * @evidence prisma:users Persists and reads the users state required by this operation.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle The public erase operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-003-delete-a-user-account The public erase operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-004-apply-permanent-deleted-account-status The public erase operation implements this requirement.
  * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-004-revoke-all-active-sessions The public erase operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-community-ownership-lifecycle The public erase operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-001-maintain-active-community-ownership The public erase operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-002-transfer-ownership-after-owner-deletion The public erase operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-003-archive-an-ownerless-community The public erase operation implements this requirement.
  * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-004-enforce-archived-community-read-only-state The public erase operation implements this requirement.
  * @evidence docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted The public erase operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views The public erase operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-001-keep-credentials-and-email-private The public erase operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private The public erase operation implements this requirement.
  * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy The public erase operation removes account and moderation-private state.
 */
  @Post("erase/execute")
  public async erase(@Headers("authorization") authorization: string | undefined, @core.TypedBody() body: IAuth.IDelete): Promise<boolean> {
    const actor = await AuthUtil.authorize(authorization);
    const user = await MyGlobal.prisma.users.findUniqueOrThrow({ where: { id: actor.id }, select: { password_hash: true } });
    if (!AuthUtil.verifyPassword(body.password, user.password_hash)) throw ErrorUtil.forbidden("Password confirmation failed.");
    const owned = await MyGlobal.prisma.communities.findMany({ where: { owner_id: actor.id }, select: { id: true } });
    await MyGlobal.prisma.$transaction(async (tx) => {
      for (const community of owned) {
        const moderator = await tx.moderators.findFirst({ where: { community_id: community.id, user_id: { not: actor.id }, revoked_at: null, user: { deleted_at: null } }, orderBy: [{ created_at: "asc" }, { user_id: "asc" }] });
        const subscriber = moderator === null ? await tx.subscriptions.findFirst({ where: { community_id: community.id, user_id: { not: actor.id }, ended_at: null, user: { deleted_at: null } }, orderBy: [{ created_at: "asc" }, { user_id: "asc" }] }) : null;
        const successor = moderator?.user_id ?? subscriber?.user_id;
        await tx.communities.update({ where: { id: community.id }, data: successor === undefined ? { owner_id: null, status: "archived" } : { owner_id: successor } });
      }
      const authoredPosts = await tx.posts.findMany({ where: { author_id: actor.id }, select: { id: true } });
      const authoredComments = await tx.comments.findMany({ where: { author_id: actor.id }, select: { id: true } });
      const affectedVotes = await tx.votes.findMany({
        where: {
          OR: [
            { user_id: actor.id },
            { post: { author_id: actor.id } },
            { comment: { author_id: actor.id } },
          ],
        },
        include: {
          post: { select: { author_id: true } },
          comment: { select: { author_id: true } },
        },
      });
      for (const vote of affectedVotes) {
        const targetAuthor = vote.post?.author_id ?? vote.comment?.author_id;
        if (targetAuthor !== undefined && targetAuthor !== actor.id) {
          await tx.profiles.updateMany({ where: { user_id: targetAuthor }, data: { karma: { decrement: vote.value } } });
        }
      }
      await tx.votes.deleteMany({ where: { user_id: actor.id } });
      if (authoredPosts.length > 0) await tx.posts.deleteMany({ where: { id: { in: authoredPosts.map((post) => post.id) } } });
      if (authoredComments.length > 0) {
        await tx.votes.deleteMany({ where: { comment_id: { in: authoredComments.map((comment) => comment.id) } } });
        await tx.comments.updateMany({ where: { id: { in: authoredComments.map((comment) => comment.id) } }, data: { text: null, deleted_at: new Date() } });
      }
      await tx.sessions.updateMany({ where: { user_id: actor.id, revoked_at: null }, data: { revoked_at: new Date() } });
      await tx.recovery_proofs.deleteMany({ where: { user_id: actor.id } });
      await tx.reports.deleteMany({ where: { reporter_id: actor.id, status: "unresolved" } });
      await tx.bans.updateMany({ where: { user_id: actor.id, ended_at: null }, data: { ended_at: new Date() } });
      await tx.moderators.updateMany({ where: { user_id: actor.id, revoked_at: null }, data: { revoked_at: new Date() } });
      await tx.subscriptions.updateMany({ where: { user_id: actor.id, ended_at: null }, data: { ended_at: new Date() } });
      await tx.profiles.deleteMany({ where: { user_id: actor.id } });
      await tx.users.update({ where: { id: actor.id }, data: { deleted_at: new Date(), password_hash: crypto.randomUUID(), email: `deleted-${actor.id}@invalid.local`, username: `deleted_${actor.id.replaceAll("-", "").slice(0, 24)}` } });
    });
    return true;
  }
}

