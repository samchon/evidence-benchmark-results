import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import type { Request } from "express";
import type { IAuth, IEntity } from "@benchmark/todo-api";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Authentication, session, and account-security business rules. */
export namespace AuthProvider {
  /** Authenticated request identity attached by the guard. */
  export interface Payload extends IEntity {
    sessionId: string;
  }

  /** Reads the guard-produced actor from a request. */
  export function request(req: Request): Payload {
    const payload = (req as Request & { user?: Payload }).user;
    if (payload === undefined) throw ErrorUtil.unauthorized("Authentication is required.");
    return payload;
  }

  /** Registers the account, profile, empty collection, and first session atomically. */
  export async function join(body: IAuth.IJoin): Promise<IAuth.IAuthorized> {
    const email = canonical(body.email);
    const displayName = body.displayName.trim();
    if (displayName.length === 0 || displayName.length > 100)
      throw ErrorUtil.unprocessable("Display name must contain 1 to 100 characters.");
    if (body.password.length < 8 || body.password.length > 128)
      throw ErrorUtil.unprocessable("Password must contain 8 to 128 characters.");
    const account = await MyGlobal.prisma.$transaction(async (tx) => {
      const exists = await tx.todo_accounts.findUnique({ where: { email } });
      if (exists !== null) throw ErrorUtil.conflict("An account already uses this email.");
      return tx.todo_accounts.create({
        data: {
          id: randomUUID(), email, password_hash: hash(body.password), created_at: new Date(),
          profile: { create: { id: randomUUID(), display_name: displayName, created_at: new Date(), updated_at: new Date() } },
        },
      });
    });
    return issue(account.id);
  }

  /** Authenticates an account without disclosing which credential failed. */
  export async function login(body: IAuth.ILogin): Promise<IAuth.IAuthorized> {
    const account = await MyGlobal.prisma.todo_accounts.findUnique({ where: { email: canonical(body.email) } });
    if (account === null || !verify(body.password, account.password_hash))
      throw ErrorUtil.unauthorized("Invalid credentials.");
    return issue(account.id);
  }

  /** Continues one valid session and rotates its refresh proof. */
  export async function refresh(body: IAuth.IRefresh): Promise<IAuth.IAuthorized> {
    const session = await MyGlobal.prisma.todo_sessions.findUnique({ where: { refresh_token_hash: digest(body.refreshToken) } });
    if (session === null || session.revoked_at !== null || session.expires_at <= new Date())
      throw ErrorUtil.unauthorized("The session is no longer valid.");
    return issue(session.todo_account_id, session.id);
  }

  /** Revokes only the current device session. */
  export async function logout(actor: Payload): Promise<void> {
    await MyGlobal.prisma.todo_sessions.updateMany({ where: { id: actor.sessionId, todo_account_id: actor.id, revoked_at: null }, data: { revoked_at: new Date() } });
  }

  /** Revokes every session for the current account. */
  export async function logoutAll(actor: Payload): Promise<void> {
    await MyGlobal.prisma.todo_sessions.updateMany({ where: { todo_account_id: actor.id, revoked_at: null }, data: { revoked_at: new Date() } });
  }

  /** Replaces a password only after proving the current secret. */
  export async function changePassword(actor: Payload, body: IAuth.IChangePassword): Promise<void> {
    const account = await MyGlobal.prisma.todo_accounts.findUnique({ where: { id: actor.id } });
    if (account === null || !verify(body.currentPassword, account.password_hash))
      throw ErrorUtil.unauthorized("The current password is incorrect.");
    if (body.currentPassword === body.newPassword || body.newPassword.length < 8 || body.newPassword.length > 128)
      throw ErrorUtil.unprocessable("The new password is not accepted.");
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.todo_accounts.update({ where: { id: actor.id }, data: { password_hash: hash(body.newPassword) } }),
      MyGlobal.prisma.todo_sessions.updateMany({ where: { todo_account_id: actor.id, revoked_at: null }, data: { revoked_at: new Date() } }),
    ]);
  }

  /** Recovers a credential after the email identity is supplied. */
  export async function recover(body: IAuth.IRecover): Promise<void> {
    const account = await MyGlobal.prisma.todo_accounts.findUnique({ where: { email: canonical(body.email) } });
    if (account === null) return;
    if (body.newPassword.length < 8 || body.newPassword.length > 128)
      throw ErrorUtil.unprocessable("The new password is not accepted.");
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.todo_accounts.update({ where: { id: account.id }, data: { password_hash: hash(body.newPassword) } }),
      MyGlobal.prisma.todo_sessions.updateMany({ where: { todo_account_id: account.id, revoked_at: null }, data: { revoked_at: new Date() } }),
    ]);
  }

  /** Permanently deletes the account and every owned dependent through cascades. */
  export async function erase(actor: Payload, body: IAuth.IDeleteAccount): Promise<void> {
    const account = await MyGlobal.prisma.todo_accounts.findUnique({ where: { id: actor.id } });
    if (account === null || !verify(body.currentPassword, account.password_hash))
      throw ErrorUtil.unauthorized("The current password is incorrect.");
    await MyGlobal.prisma.todo_accounts.delete({ where: { id: actor.id } });
  }

  /** Validates and decodes a bearer access token. */
  export async function authorize(header: string | undefined): Promise<Payload> {
    if (header === undefined || !header.startsWith("Bearer ")) throw ErrorUtil.unauthorized("Authentication is required.");
    const token = header.slice(7);
    const [body, signature] = token.split(".");
    if (body === undefined || signature === undefined || !safeEqual(signature, sign(body))) throw ErrorUtil.unauthorized("Authentication is required.");
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { sub: string; sid: string; exp: number };
    if (parsed.exp <= Math.floor(Date.now() / 1000)) throw ErrorUtil.unauthorized("Authentication is required.");
    const session = await MyGlobal.prisma.todo_sessions.findUnique({ where: { id: parsed.sid } });
    if (session === null || session.todo_account_id !== parsed.sub || session.revoked_at !== null || session.expires_at <= new Date()) throw ErrorUtil.unauthorized("Authentication is required.");
    return { id: session.todo_account_id, sessionId: session.id };
  }

  function canonical(email: string): string { return email.trim().toLowerCase(); }
  function hash(value: string): string { const salt = randomBytes(16).toString("hex"); return `${salt}:${scryptSync(value, salt, 32).toString("hex")}`; }
  function verify(value: string, stored: string): boolean { const [salt, expected] = stored.split(":"); if (salt === undefined || expected === undefined) return false; const actual = scryptSync(value, salt, 32); return safeEqual(actual.toString("hex"), expected); }
  function digest(value: string): string { return createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(value).digest("hex"); }
  function sign(value: string): string { return createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(value).digest("base64url"); }
  function safeEqual(a: string, b: string): boolean { const aa = Buffer.from(a); const bb = Buffer.from(b); return aa.length === bb.length && timingSafeEqual(aa, bb); }
  async function issue(accountId: string, existingSessionId?: string): Promise<IAuth.IAuthorized> {
    const now = new Date(); const accessExpiry = new Date(now.getTime() + Number(MyGlobal.env.JWT_ACCESS_TTL_SECONDS) * 1000); const refreshExpiry = new Date(now.getTime() + Number(MyGlobal.env.JWT_REFRESH_TTL_SECONDS) * 1000); const refresh = randomBytes(32).toString("base64url");
    const session = existingSessionId === undefined
      ? await MyGlobal.prisma.todo_sessions.create({ data: { id: randomUUID(), todo_account_id: accountId, refresh_token_hash: digest(refresh), created_at: now, expires_at: refreshExpiry } })
      : await MyGlobal.prisma.todo_sessions.update({ where: { id: existingSessionId }, data: { refresh_token_hash: digest(refresh), expires_at: refreshExpiry, revoked_at: null } });
    const payload = Buffer.from(JSON.stringify({ sub: accountId, sid: session.id, exp: Math.floor(accessExpiry.getTime() / 1000) })).toString("base64url");
    return { token: { access: `${payload}.${sign(payload)}`, refresh }, accessTokenExpiresAt: accessExpiry.toISOString(), refreshTokenExpiresAt: refreshExpiry.toISOString() };
  }
}
