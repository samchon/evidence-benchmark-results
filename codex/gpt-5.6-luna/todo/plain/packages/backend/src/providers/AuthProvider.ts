import { ErrorUtil } from "../utils/ErrorUtil";
import { MyGlobal } from "../MyGlobal";
import type { IUser } from "@benchmark/todo-api";
import { Prisma } from "@prisma/sdk";
import { createHash, createHmac, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

/** Authenticated identity attached to a protected request. */
export interface UserPayload {
  /** Account identifier. */
  id: string;
  /** Session identifier. */
  session_id: string;
  /** Discriminator used by the user guard. */
  type: "user";
}

/** Account, session, password, and recovery business logic. */
export namespace AuthProvider {
  const userSelect = () => ({
    select: {
      id: true,
      profile: { select: { id: true, display_name: true } },
    },
  } satisfies Prisma.todo_usersFindManyArgs);

  /** Registers an account, profile, and first authenticated session atomically. */
  export async function join(props: { body: IUser.IJoin }): Promise<IUser.IAuthorized> {
    const email = canonicalEmail(props.body.email);
    validateEmail(email);
    const displayName = normalizeDisplayName(props.body.displayName);
    validatePassword(props.body.password, "body.password");
    const existing = await MyGlobal.prisma.todo_users.findUnique({ where: { email } });
    if (existing !== null) throw ErrorUtil.conflict("That email is already registered.");
    const passwordHash = await hashPassword(props.body.password);
    const now = new Date();
    const userId = randomUUID();
    return MyGlobal.prisma.$transaction(async (tx) => {
      await tx.todo_users.create({
        data: {
          id: userId,
          email,
          password_hash: passwordHash,
          created_at: now,
          profile: {
            create: { id: randomUUID(), display_name: displayName, created_at: now },
          },
        },
      });
      const user = await tx.todo_users.findUniqueOrThrow({ where: { id: userId }, ...userSelect() });
      return issue({ user, userId, database: tx });
    });
  }

  /** Creates a new independent session after generic credential verification. */
  export async function login(props: { body: IUser.ILogin }): Promise<IUser.IAuthorized> {
    const email = canonicalEmail(props.body.email);
    if (isValidEmail(email) === false)
      throw ErrorUtil.unauthorized("Invalid email or password.");
    const user = await MyGlobal.prisma.todo_users.findUnique({ where: { email }, include: { profile: true } });
    if (user === null || !(await verifyPassword(props.body.password, user.password_hash)))
      throw ErrorUtil.unauthorized("Invalid email or password.");
    return issue({ user: { id: user.id, profile: user.profile }, userId: user.id });
  }

  /** Rotates a valid refresh token without changing its session identity. */
  export async function refresh(props: { body: IUser.IRefresh }): Promise<IUser.IAuthorized> {
    const payload = verifyToken(props.body.refreshToken, "refresh");
    const session = await MyGlobal.prisma.todo_sessions.findUnique({
      where: { id: payload.session_id },
      include: { user: { include: { profile: true } } },
    });
    if (session === null || session.todo_user_id !== payload.user_id || session.revoked_at !== null || session.expires_at <= new Date())
      throw ErrorUtil.unauthorized("The session is no longer valid.");
    if (!safeEqual(session.refresh_hash, digest(props.body.refreshToken)))
      throw ErrorUtil.unauthorized("The session is no longer valid.");
    return issue({
      user: { id: session.user.id, profile: session.user.profile },
      userId: session.user.id,
      sessionId: session.id,
    });
  }

  /** Validates a bearer access token and its live database session. */
  export async function authorize(header: string | undefined): Promise<UserPayload> {
    if (header === undefined || !header.startsWith("Bearer ")) throw ErrorUtil.unauthorized("Authentication is required.");
    const payload = verifyToken(header.slice("Bearer ".length), "access");
    const session = await MyGlobal.prisma.todo_sessions.findUnique({ where: { id: payload.session_id } });
    if (session === null || session.todo_user_id !== payload.user_id || session.revoked_at !== null || session.expires_at <= new Date())
      throw ErrorUtil.unauthorized("The session is no longer valid.");
    return { id: payload.user_id, session_id: payload.session_id, type: "user" };
  }

  /** Ends the current session only. */
  export async function logout(props: { user: UserPayload }): Promise<{ success: true }> {
    await MyGlobal.prisma.todo_sessions.updateMany({ where: { id: props.user.session_id, todo_user_id: props.user.id, revoked_at: null }, data: { revoked_at: new Date() } });
    return { success: true };
  }

  /** Ends all sessions for the current account. */
  export async function logoutAll(props: { user: UserPayload }): Promise<{ success: true }> {
    await MyGlobal.prisma.todo_sessions.updateMany({ where: { todo_user_id: props.user.id, revoked_at: null }, data: { revoked_at: new Date() } });
    return { success: true };
  }

  /** Changes the password and invalidates every prior session atomically. */
  export async function changePassword(props: { user: UserPayload; body: IUser.IChangePassword }): Promise<{ success: true }> {
    const user = await MyGlobal.prisma.todo_users.findUnique({ where: { id: props.user.id } });
    if (user === null || !(await verifyPassword(props.body.currentPassword, user.password_hash))) throw ErrorUtil.unauthorized("The current password is incorrect.");
    validatePassword(props.body.newPassword, "body.newPassword");
    if (await verifyPassword(props.body.newPassword, user.password_hash)) throw ErrorUtil.unprocessable("The new password must differ from the current password.");
    const passwordHash = await hashPassword(props.body.newPassword);
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.todo_users.update({ where: { id: user.id }, data: { password_hash: passwordHash } }),
      MyGlobal.prisma.todo_sessions.updateMany({ where: { todo_user_id: user.id, revoked_at: null }, data: { revoked_at: new Date() } }),
    ]);
    return { success: true };
  }

  /** Records a non-disclosing recovery effect when the email exists. */
  export async function requestRecovery(props: { body: IUser.IRecoveryRequest }): Promise<{ success: true }> {
    const email = canonicalEmail(props.body.email);
    validateEmail(email);
    const user = await MyGlobal.prisma.todo_users.findUnique({ where: { email } });
    if (user === null) return { success: true };
    const proof = randomBytes(24).toString("hex");
    const now = new Date();
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.todo_recovery_requests.create({ data: { id: randomUUID(), todo_user_id: user.id, email, proof_hash: digest(proof), expires_at: new Date(now.getTime() + 15 * 60_000), created_at: now } }),
      MyGlobal.prisma.todo_delivery_effects.create({ data: { id: randomUUID(), todo_user_id: user.id, recipient: email, kind: "password-recovery", payload: JSON.stringify({ proof }), created_at: now } }),
    ]);
    return { success: true };
  }

  /** Consumes a recorded recovery proof and replaces the credential. */
  export async function confirmRecovery(props: { body: IUser.IRecoveryConfirm }): Promise<IUser.IAuthorized> {
    const email = canonicalEmail(props.body.email);
    validateEmail(email);
    validatePassword(props.body.newPassword, "body.newPassword");
    const request = await MyGlobal.prisma.todo_recovery_requests.findFirst({ where: { email, consumed_at: null, expires_at: { gt: new Date() } }, orderBy: [{ created_at: "desc" }, { id: "asc" }], include: { user: { include: { profile: true } } } });
    if (request === null || !safeEqual(request.proof_hash, digest(props.body.proof))) throw ErrorUtil.unauthorized("The recovery proof is invalid.");
    const passwordHash = await hashPassword(props.body.newPassword);
    const now = new Date();
    return MyGlobal.prisma.$transaction(async (tx) => {
      const consumed = await tx.todo_recovery_requests.updateMany({ where: { id: request.id, consumed_at: null, expires_at: { gt: now } }, data: { consumed_at: now } });
      if (consumed.count !== 1) throw ErrorUtil.unauthorized("The recovery proof is invalid.");
      await tx.todo_users.update({ where: { id: request.todo_user_id }, data: { password_hash: passwordHash } });
      await tx.todo_sessions.updateMany({ where: { todo_user_id: request.todo_user_id, revoked_at: null }, data: { revoked_at: now } });
      return issue({ user: { id: request.user.id, profile: request.user.profile }, userId: request.user.id, database: tx });
    });
  }

  /** Permanently removes the account and all cascaded private state. */
  export async function deleteAccount(props: { user: UserPayload; body: IUser.IDeleteAccount }): Promise<{ success: true }> {
    const user = await MyGlobal.prisma.todo_users.findUnique({ where: { id: props.user.id } });
    if (user === null || !(await verifyPassword(props.body.currentPassword, user.password_hash))) throw ErrorUtil.unauthorized("The current password is incorrect.");
    await MyGlobal.prisma.todo_users.delete({ where: { id: user.id } });
    return { success: true };
  }

  /** Reads the current private profile. */
  export async function profile(props: { user: UserPayload }): Promise<IUser> {
    const row = await MyGlobal.prisma.todo_profiles.findUnique({ where: { todo_user_id: props.user.id } });
    if (row === null) throw ErrorUtil.notFound("The profile is unavailable.");
    return { id: row.id, displayName: row.display_name };
  }

  /** Replaces the current private display name. */
  export async function updateProfile(props: { user: UserPayload; displayName: string }): Promise<IUser> {
    const displayName = normalizeDisplayName(props.displayName);
    const row = await MyGlobal.prisma.todo_profiles.update({ where: { todo_user_id: props.user.id }, data: { display_name: displayName } });
    return { id: row.id, displayName: row.display_name };
  }

  function canonicalEmail(value: string): string { return value.trim().toLowerCase(); }
  function validateEmail(value: string): void { if (isValidEmail(value) === false) throw ErrorUtil.unprocessable("email must be a valid email address."); }
  function isValidEmail(value: string): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
  function normalizeDisplayName(value: string): string { const result = value.trim(); if (result.length < 1 || result.length > 100) throw ErrorUtil.unprocessable("displayName must contain 1 to 100 characters after trimming."); return result; }
  function validatePassword(value: string, accessor: string): void { if (value.length < 8 || value.length > 128) throw ErrorUtil.unprocessable({ message: "Password must contain 8 to 128 characters.", accessor }); }
  async function hashPassword(value: string): Promise<string> { const salt = randomBytes(16); const key = (await scrypt(value, salt, 64)) as Buffer; return `scrypt$${salt.toString("base64")}$${key.toString("base64")}`; }
  async function verifyPassword(value: string, encoded: string): Promise<boolean> { const [, saltText, keyText] = encoded.split("$"); if (saltText === undefined || keyText === undefined) return false; const key = (await scrypt(value, Buffer.from(saltText, "base64"), 64)) as Buffer; return safeEqual(keyText, key.toString("base64")); }
  function digest(value: string): string { return createHash("sha256").update(value).digest("hex"); }
  function safeEqual(left: string, right: string): boolean { const a = Buffer.from(left); const b = Buffer.from(right); return a.length === b.length && timingSafeEqual(a, b); }

  async function issue(props: { user: { id: string; profile: { id: string; display_name: string } | null }; userId: string; sessionId?: string; database?: Prisma.TransactionClient | typeof MyGlobal.prisma }): Promise<IUser.IAuthorized> {
    if (props.user.profile === null) throw ErrorUtil.internal("The account profile is unavailable.");
    const now = Math.floor(Date.now() / 1000);
    const accessExpiresAt = now + Number(MyGlobal.env.JWT_ACCESS_TTL_SECONDS);
    const refreshExpiresAt = new Date((now + Number(MyGlobal.env.JWT_REFRESH_TTL_SECONDS)) * 1000);
    const sessionId = props.sessionId ?? randomUUID();
    const database = props.database ?? MyGlobal.prisma;
    const refreshToken = sign({ user_id: props.userId, session_id: sessionId, type: "refresh", exp: Math.floor(refreshExpiresAt.getTime() / 1000) });
    if (props.sessionId === undefined) await database.todo_sessions.create({ data: { id: sessionId, todo_user_id: props.userId, refresh_hash: digest(refreshToken), created_at: new Date(), expires_at: refreshExpiresAt } });
    else await database.todo_sessions.update({ where: { id: sessionId }, data: { refresh_hash: digest(refreshToken), expires_at: refreshExpiresAt } });
    const accessToken = `Bearer ${sign({ user_id: props.userId, session_id: sessionId, type: "access", exp: accessExpiresAt })}`;
    return {
      accessToken,
      refreshToken,
      accessExpiresAt: new Date(accessExpiresAt * 1000).toISOString(),
      user: { id: props.user.profile.id, displayName: props.user.profile.display_name },
      token: { access: accessToken, refresh: refreshToken },
    };
  }

  function sign(payload: { user_id: string; session_id: string; type: "access" | "refresh"; exp: number }): string { const head = encode({ alg: "HS256", typ: "JWT" }); const body = encode(payload); const input = `${head}.${body}`; return `${input}.${createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(input).digest("base64url")}`; }
  function verifyToken(token: string, expected: "access" | "refresh"): { user_id: string; session_id: string } { const [head, body, signature] = token.split("."); if (head === undefined || body === undefined || signature === undefined) throw ErrorUtil.unauthorized("The token is invalid."); const input = `${head}.${body}`; const actual = createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(input).digest("base64url"); if (!safeEqual(actual, signature)) throw ErrorUtil.unauthorized("The token is invalid."); try { const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { user_id?: unknown; session_id?: unknown; type?: unknown; exp?: unknown }; if (payload.user_id === undefined || payload.session_id === undefined || payload.type !== expected || typeof payload.exp !== "number" || payload.exp <= Math.floor(Date.now() / 1000)) throw new Error("The token payload is invalid."); return { user_id: String(payload.user_id), session_id: String(payload.session_id) }; } catch { throw ErrorUtil.unauthorized("The token is invalid."); } }
  function encode(value: object): string { return Buffer.from(JSON.stringify(value)).toString("base64url"); }
}
