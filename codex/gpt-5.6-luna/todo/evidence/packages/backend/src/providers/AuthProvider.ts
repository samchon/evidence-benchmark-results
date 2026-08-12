import { createHash, createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import type { ITodoUser } from "@benchmark/todo-api";

import { MyGlobal } from "../MyGlobal";
import type { UserPayload } from "../decorators/UserPayload";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Authentication, credential hashing, and live-session authorization. */
export namespace AuthProvider {
  /** Registers an account, private profile, and first live session atomically. */
  export async function join(props: {
    body: ITodoUser.IJoin;
  }): Promise<ITodoUser.IAuthorized> {
    const email: string = canonicalEmail(props.body.email);
    validateEmail(email);
    const displayName: string = normalizeDisplayName(props.body.displayName);
    validatePassword(props.body.password);
    const exists = await MyGlobal.prisma.todo_users.findUnique({
      where: { email },
      select: { id: true },
    });
    if (exists !== null) throw ErrorUtil.conflict("Email is already registered.");
    const id: string = randomUUID();
    const now: Date = new Date();
    const user = await MyGlobal.prisma.todo_users.create({
      data: {
        id,
        email,
        password_hash: hashPassword(props.body.password),
        created_at: now,
        updated_at: now,
        profile: {
          create: {
            id: randomUUID(),
            display_name: displayName,
            created_at: now,
            updated_at: now,
          },
        },
      },
      select: { id: true },
    });
    return issue(user.id);
  }

  /** Logs in without distinguishing an unknown email from a wrong password. */
  export async function login(props: {
    body: ITodoUser.ILogin;
  }): Promise<ITodoUser.IAuthorized> {
    const email: string = canonicalEmail(props.body.email);
    validateEmail(email);
    const user = await MyGlobal.prisma.todo_users.findUnique({
      where: { email },
      select: { id: true, password_hash: true },
    });
    if (user === null || verifyPassword(props.body.password, user.password_hash) === false)
      throw ErrorUtil.unauthorized("Invalid email or password.");
    return issue(user.id);
  }

  /** Rotates one valid refresh proof into a fresh bearer pair for the same session. */
  export async function refresh(props: {
    body: ITodoUser.IRefresh;
  }): Promise<ITodoUser.IAuthorized> {
    const payload = verify(props.body.refreshToken, "refresh");
    const session = await MyGlobal.prisma.todo_sessions.findFirst({
      where: {
        id: payload.sid,
        refresh_token_hash: digest(props.body.refreshToken),
        revoked_at: null,
        expires_at: { gt: new Date() },
      },
      select: { id: true, todo_user_id: true },
    });
    if (session === null) throw ErrorUtil.unauthorized("The session is no longer valid.");
    return issue(session.todo_user_id, session.id);
  }

  /** Records a non-disclosing recovery delivery for a registered email. */
  export async function recover(props: {
    body: ITodoUser.IRecover;
  }): Promise<true> {
    const email: string = canonicalEmail(props.body.email);
    validateEmail(email);
    const user = await MyGlobal.prisma.todo_users.findUnique({
      where: { email },
      select: { id: true },
    });
    if (user === null) return true;
    const token: string = randomBytes(32).toString("base64url");
    const now: Date = new Date();
    await MyGlobal.prisma.todo_recovery_tokens.create({
      data: {
        id: randomUUID(),
        token_hash: digest(token),
        created_at: now,
        expires_at: new Date(now.getTime() + 15 * 60 * 1000),
        user: { connect: { id: user.id } },
      },
    });
    return true;
  }

  /** Consumes a delivered recovery proof and invalidates every older session. */
  export async function reset(props: {
    body: ITodoUser.IReset;
  }): Promise<true> {
    validatePassword(props.body.newPassword);
    const token = await MyGlobal.prisma.todo_recovery_tokens.findFirst({
      where: {
        token_hash: digest(props.body.token),
        consumed_at: null,
        expires_at: { gt: new Date() },
      },
      select: { id: true, todo_user_id: true },
    });
    if (token === null) throw ErrorUtil.unauthorized("The recovery proof is invalid.");
    const now: Date = new Date();
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.todo_users.update({
        where: { id: token.todo_user_id },
        data: { password_hash: hashPassword(props.body.newPassword), updated_at: now },
      }),
      MyGlobal.prisma.todo_sessions.updateMany({
        where: { todo_user_id: token.todo_user_id, revoked_at: null },
        data: { revoked_at: now },
      }),
      MyGlobal.prisma.todo_recovery_tokens.update({
        where: { id: token.id },
        data: { consumed_at: now },
      }),
    ]);
    return true;
  }

  /** Ends the current session only. */
  export async function logout(props: { user: UserPayload }): Promise<true> {
    await MyGlobal.prisma.todo_sessions.updateMany({
      where: { id: props.user.session_id, todo_user_id: props.user.id, revoked_at: null },
      data: { revoked_at: new Date() },
    });
    return true;
  }

  /** Ends every live session owned by the current account. */
  export async function logoutAll(props: { user: UserPayload }): Promise<true> {
    await MyGlobal.prisma.todo_sessions.updateMany({
      where: { todo_user_id: props.user.id, revoked_at: null },
      data: { revoked_at: new Date() },
    });
    return true;
  }

  /** Changes the known password and invalidates every prior session. */
  export async function changePassword(props: {
    user: UserPayload;
    body: ITodoUser.IChangePassword;
  }): Promise<true> {
    validatePassword(props.body.newPassword);
    const user = await MyGlobal.prisma.todo_users.findUnique({
      where: { id: props.user.id },
      select: { password_hash: true },
    });
    if (user === null || verifyPassword(props.body.currentPassword, user.password_hash) === false)
      throw ErrorUtil.unauthorized("The current password is incorrect.");
    if (verifyPassword(props.body.newPassword, user.password_hash))
      throw ErrorUtil.conflict("The new password must differ from the current password.");
    const now: Date = new Date();
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.todo_users.update({
        where: { id: props.user.id },
        data: { password_hash: hashPassword(props.body.newPassword), updated_at: now },
      }),
      MyGlobal.prisma.todo_sessions.updateMany({
        where: { todo_user_id: props.user.id, revoked_at: null },
        data: { revoked_at: now },
      }),
    ]);
    return true;
  }

  /** Permanently deletes the account and all cascaded private information. */
  export async function erase(props: {
    user: UserPayload;
    body: ITodoUser.IDelete;
  }): Promise<true> {
    const user = await MyGlobal.prisma.todo_users.findUnique({
      where: { id: props.user.id },
      select: { password_hash: true },
    });
    if (user === null || verifyPassword(props.body.password, user.password_hash) === false)
      throw ErrorUtil.unauthorized("The current password is incorrect.");
    await MyGlobal.prisma.todo_users.delete({ where: { id: props.user.id } });
    return true;
  }

  /** Resolves a signed access token against a non-revoked database session. */
  export async function authorize(props: { token: string }): Promise<UserPayload> {
    const payload = verify(props.token, "access");
    const session = await MyGlobal.prisma.todo_sessions.findFirst({
      where: {
        id: payload.sid,
        todo_user_id: payload.uid,
        revoked_at: null,
        expires_at: { gt: new Date() },
      },
      select: { id: true, todo_user_id: true },
    });
    if (session === null) throw ErrorUtil.unauthorized("Authentication is required.");
    return { id: session.todo_user_id, session_id: session.id, type: "user" };
  }

  async function issue(userId: string, existingSessionId?: string): Promise<ITodoUser.IAuthorized> {
    const now: Date = new Date();
    const sessionId: string = existingSessionId ?? randomUUID();
    const refreshToken: string = sign({ uid: userId, sid: sessionId, kind: "refresh", exp: expiry("refresh") });
    const accessExpiry: number = expiry("access");
    const accessToken: string = sign({ uid: userId, sid: sessionId, kind: "access", exp: accessExpiry });
    if (existingSessionId === undefined)
      await MyGlobal.prisma.todo_sessions.create({
        data: {
          id: sessionId,
          refresh_token_hash: digest(refreshToken),
          created_at: now,
          expires_at: new Date(expiry("refresh") * 1000),
          user: { connect: { id: userId } },
        },
      });
    else
      await MyGlobal.prisma.todo_sessions.update({
        where: { id: existingSessionId },
        data: { refresh_token_hash: digest(refreshToken) },
      });
    return {
      id: userId,
      token: {
        access: accessToken,
        refresh: refreshToken,
        expiredAt: new Date(accessExpiry * 1000).toISOString(),
      },
    };
  }

  function canonicalEmail(value: string): string {
    return value.trim().toLowerCase();
  }

  function normalizeDisplayName(value: string): string {
    const result: string = value.trim();
    if (result.length === 0 || result.length > 100)
      throw ErrorUtil.unprocessable("Display name must contain 1 through 100 characters.");
    return result;
  }

  function validateEmail(value: string): void {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) === false)
      throw ErrorUtil.unprocessable("Email must be a valid email address.");
  }

  function validatePassword(value: string): void {
    if (value.length < 8 || value.length > 128)
      throw ErrorUtil.unprocessable("Password must contain 8 through 128 characters.");
  }

  function hashPassword(password: string): string {
    const salt: Buffer = randomBytes(16);
    return `${salt.toString("hex")}:${scryptSync(password, salt, 64).toString("hex")}`;
  }

  function verifyPassword(password: string, stored: string): boolean {
    const [saltHex, hashHex] = stored.split(":");
    if (saltHex === undefined || hashHex === undefined) return false;
    const expected: Buffer = Buffer.from(hashHex, "hex");
    const actual: Buffer = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }

  function digest(value: string): string {
    return createHash("sha256").update(value).digest("hex");
  }

  function sign(payload: Record<string, string | number>): string {
    const body: string = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature: string = createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY)
      .update(body)
      .digest("base64url");
    return `${body}.${signature}`;
  }

  function verify(token: string, kind: "access" | "refresh"): { uid: string; sid: string } {
    const [body, signature] = token.split(".");
    if (body === undefined || signature === undefined) throw ErrorUtil.unauthorized("Authentication is required.");
    const expected: string = createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY)
      .update(body)
      .digest("base64url");
    if (signature !== expected) throw ErrorUtil.unauthorized("Authentication is required.");
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(Buffer.from(body, "base64url").toString()) as Record<string, unknown>;
    } catch {
      throw ErrorUtil.unauthorized("Authentication is required.");
    }
    if (payload.kind !== kind || typeof payload.uid !== "string" || typeof payload.sid !== "string" || typeof payload.exp !== "number" || payload.exp <= Math.floor(Date.now() / 1000))
      throw ErrorUtil.unauthorized("Authentication is required.");
    return { uid: payload.uid, sid: payload.sid };
  }

  function expiry(kind: "access" | "refresh"): number {
    return Math.floor(Date.now() / 1000) + Number(kind === "access" ? MyGlobal.env.JWT_ACCESS_TTL_SECONDS : MyGlobal.env.JWT_REFRESH_TTL_SECONDS);
  }
}
