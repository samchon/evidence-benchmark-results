import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import type { IAuth, IResult } from "@benchmark/todo-api";
import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { tags } from "typia";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Authenticated private account payload. */
export interface UserPayload {
  id: string & tags.Format<"uuid">;
  session_id: string & tags.Format<"uuid">;
  type: "user";
}

/** Resolves the bearer session behind a protected request. */
export const UserAuth = createParamDecorator(
  async (_data: unknown, context: ExecutionContext): Promise<UserPayload> => {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined> }>();
    const value = request.headers.authorization;
    if (value === undefined || !value.startsWith("Bearer "))
      throw ErrorUtil.unauthorized("Authentication is required.");
    return AuthProvider.authorize({ token: value.slice(7) });
  },
);

const recoveryProofs = new Map<string, string>();

function canonicalEmail(value: string, invalidStatus: "unprocessable" | "unauthorized" = "unprocessable"): string {
  const email = value.trim().toLowerCase();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) === false)
    throw (invalidStatus === "unauthorized" ? ErrorUtil.unauthorized("Invalid email or password.") : ErrorUtil.unprocessable("Email must be a valid address."));
  return email;
}

/** Account/session authorization and credential lifecycle rules. */
export namespace AuthProvider {
  export function hashPassword(password: string): string {
    const salt = randomBytes(16).toString("hex");
    return `${salt}:${scryptSync(password, salt, 32).toString("hex")}`;
  }
  export function verifyPassword(password: string, encoded: string): boolean {
    const [salt, expected] = encoded.split(":");
    if (salt === undefined || expected === undefined) return false;
    const actual = scryptSync(password, salt, 32);
    const target = Buffer.from(expected, "hex");
    return target.length === actual.length && timingSafeEqual(target, actual);
  }
  function sign(payload: { id: string; sessionId: string; type: "access" | "refresh"; exp: number; version: number }): string {
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(encoded).digest("base64url");
    return `${encoded}.${signature}`;
  }
  function read(token: string): { id: string; sessionId: string; type: "access" | "refresh"; exp: number; version: number } {
    const [encoded, signature] = token.split(".");
    if (encoded === undefined || signature === undefined) throw ErrorUtil.unauthorized("Invalid authentication token.");
    const expected = createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(encoded).digest("base64url");
    if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected)))
      throw ErrorUtil.unauthorized("Invalid authentication token.");
    let parsed: unknown;
    try { parsed = JSON.parse(Buffer.from(encoded, "base64url").toString()); } catch { throw ErrorUtil.unauthorized("Invalid authentication token."); }
    if (typeof parsed !== "object" || parsed === null) throw ErrorUtil.unauthorized("Invalid authentication token.");
    const value = parsed as Record<string, unknown>;
    if (typeof value.id !== "string" || typeof value.sessionId !== "string" || (value.type !== "access" && value.type !== "refresh") || typeof value.exp !== "number" || typeof value.version !== "number" || value.exp < Date.now())
      throw ErrorUtil.unauthorized("Invalid authentication token.");
    return value as { id: string; sessionId: string; type: "access" | "refresh"; exp: number; version: number };
  }
  export async function authorize(props: { token: string; refresh?: boolean }): Promise<UserPayload> {
    const payload = read(props.token.startsWith("Bearer ") ? props.token.slice(7) : props.token);
    if (payload.type !== (props.refresh ? "refresh" : "access")) throw ErrorUtil.unauthorized("Invalid authentication token.");
    const session = await MyGlobal.prisma.user_sessions.findFirst({ where: { id: payload.sessionId, user_account_id: payload.id, credential_version: payload.version } });
    if (session === null) throw ErrorUtil.unauthorized("Session is no longer valid.");
    return { id: payload.id as UserPayload["id"], session_id: payload.sessionId as UserPayload["session_id"], type: "user" };
  }
  export async function issue(account: { id: string; credential_version: number; profile: { display_name: string } }, sessionId: string = randomUUID()): Promise<IAuth.IAuthorized> {
    if (await MyGlobal.prisma.user_sessions.findUnique({ where: { id: sessionId } }) === null)
      await MyGlobal.prisma.user_sessions.create({ data: { id: sessionId, user_account_id: account.id, credential_version: account.credential_version, created_at: new Date() } });
    const accessTtl = Number(MyGlobal.env.JWT_ACCESS_TTL_SECONDS);
    const refreshTtl = Number(MyGlobal.env.JWT_REFRESH_TTL_SECONDS);
    const accessToken = `Bearer ${sign({ id: account.id, sessionId, type: "access", exp: Date.now() + accessTtl * 1000, version: account.credential_version })}`;
    const refreshToken = `Bearer ${sign({ id: account.id, sessionId, type: "refresh", exp: Date.now() + refreshTtl * 1000, version: account.credential_version })}`;
    return {
      id: account.id as IAuth.IAuthorized["id"],
      accessToken,
      refreshToken,
      token: { access: accessToken, refresh: refreshToken },
      expiresIn: accessTtl,
      profile: { displayName: account.profile.display_name },
    };
  }
  export async function join(input: IAuth): Promise<IAuth.IAuthorized> {
    const email = canonicalEmail(input.email);
    const displayName = input.displayName.trim();
    if (displayName.length < 1 || displayName.length > 100) throw ErrorUtil.unprocessable("Display name must contain 1 through 100 characters.");
    if (await MyGlobal.prisma.user_accounts.findUnique({ where: { email } })) throw ErrorUtil.conflict("An account already uses this email.");
    const account = await MyGlobal.prisma.$transaction(async (tx) => {
      const id = randomUUID();
      return tx.user_accounts.create({ data: { id, email, password_hash: hashPassword(input.password), credential_version: 1, created_at: new Date(), profile: { create: { id: randomUUID(), display_name: displayName, created_at: new Date() } } }, select: { id: true, credential_version: true, profile: { select: { display_name: true } } } });
    });
    if (account.profile === null) throw ErrorUtil.internal("Account profile is missing.");
    return issue({ ...account, profile: account.profile });
  }
  export async function login(input: IAuth.ILogin): Promise<IAuth.IAuthorized> {
    const email = canonicalEmail(input.email, "unauthorized");
    const account = await MyGlobal.prisma.user_accounts.findUnique({ where: { email }, select: { id: true, password_hash: true, credential_version: true, profile: { select: { display_name: true } } } });
    if (account === null || !verifyPassword(input.password, account.password_hash)) throw ErrorUtil.unauthorized("Invalid email or password.");
    if (account.profile === null) throw ErrorUtil.internal("Account profile is missing.");
    return issue({ ...account, profile: account.profile });
  }
  export async function refresh(input: IAuth.IRefresh): Promise<IAuth.IAuthorized> {
    const actor = await authorize({ token: input.refreshToken, refresh: true });
    const account = await MyGlobal.prisma.user_accounts.findUniqueOrThrow({ where: { id: actor.id }, select: { id: true, credential_version: true, profile: { select: { display_name: true } } } });
    if (account.profile === null) throw ErrorUtil.internal("Account profile is missing.");
    return issue({ ...account, profile: account.profile }, actor.session_id);
  }
  export async function logout(actor: UserPayload): Promise<IResult> { await MyGlobal.prisma.user_sessions.deleteMany({ where: { id: actor.session_id, user_account_id: actor.id } }); return { success: true }; }
  export async function logoutAll(actor: UserPayload): Promise<IResult> { await MyGlobal.prisma.user_sessions.deleteMany({ where: { user_account_id: actor.id } }); return { success: true }; }
  export async function changePassword(actor: UserPayload, input: IAuth.IChangePassword): Promise<IResult> {
    const account = await MyGlobal.prisma.user_accounts.findUniqueOrThrow({ where: { id: actor.id } });
    if (!verifyPassword(input.currentPassword, account.password_hash)) throw ErrorUtil.forbidden("Current password is incorrect.");
    if (verifyPassword(input.newPassword, account.password_hash)) throw ErrorUtil.unprocessable("New password must differ from the current password.");
    await MyGlobal.prisma.$transaction(async (tx) => { await tx.user_accounts.update({ where: { id: actor.id }, data: { password_hash: hashPassword(input.newPassword), credential_version: { increment: 1 } } }); await tx.user_sessions.deleteMany({ where: { user_account_id: actor.id } }); });
    return { success: true };
  }
  export async function deleteAccount(actor: UserPayload, input: IAuth.IDeleteAccount): Promise<IResult> {
    const account = await MyGlobal.prisma.user_accounts.findUniqueOrThrow({ where: { id: actor.id } });
    if (!verifyPassword(input.currentPassword, account.password_hash)) throw ErrorUtil.forbidden("Current password is incorrect.");
    await MyGlobal.prisma.user_accounts.delete({ where: { id: actor.id } });
    return { success: true };
  }
  export async function recoverStart(input: IAuth.IRecoverStart): Promise<{ proof: string }> {
    const email = canonicalEmail(input.email);
    const account = await MyGlobal.prisma.user_accounts.findUnique({ where: { email } });
    // This local proof stands in for the external email-control step and has a uniform shape for unknown email.
    const proof = `${randomUUID()}.${randomBytes(18).toString("hex")}`;
    if (account !== null) recoveryProofs.set(proof, account.id);
    return { proof };
  }
  export async function recover(input: IAuth.IRecoverPassword): Promise<IResult> {
    const email = canonicalEmail(input.email);
    const id = recoveryProofs.get(input.proof);
    const account = id === undefined ? null : await MyGlobal.prisma.user_accounts.findFirst({ where: { id, email } });
    if (account === null) throw ErrorUtil.unauthorized("Recovery proof is invalid.");
    recoveryProofs.delete(input.proof);
    await MyGlobal.prisma.$transaction(async (tx) => { await tx.user_accounts.update({ where: { id: account.id }, data: { password_hash: hashPassword(input.newPassword), credential_version: { increment: 1 } } }); await tx.user_sessions.deleteMany({ where: { user_account_id: account.id } }); });
    return { success: true };
  }
}
