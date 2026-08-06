import crypto from "node:crypto";
import type { IAuth } from "@benchmark/reddit2-api";
import type { tags } from "typia";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "./ErrorUtil";

/** Authentication hashing, token, and actor-resolution helpers. */
export namespace AuthUtil {
  /** Narrowed authenticated user carried by controller calls. */
  export interface Payload {
    id: string & tags.Format<"uuid">;
    sessionId: string & tags.Format<"uuid">;
    username: string;
  }

  /** Hashes a password using a per-value salt. */
  export function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex");
    const digest = crypto.scryptSync(password, salt, 32).toString("hex");
    return `${salt}:${digest}`;
  }

  /** Checks a password against a stored salted hash. */
  export function verifyPassword(password: string, stored: string): boolean {
    const [salt, digest] = stored.split(":");
    if (salt === undefined || digest === undefined) return false;
    try {
      const actual = crypto.scryptSync(password, salt, 32).toString("hex");
      const expected = Buffer.from(digest, "hex");
      const candidate = Buffer.from(actual, "hex");
      return expected.length === candidate.length && crypto.timingSafeEqual(candidate, expected);
    } catch {
      return false;
    }
  }

  /** Produces a compact signed token for one session. */
  export function issue(
    payload: Payload,
    kind: "access" | "refresh",
    expiresAt: Date,
  ): string {
    const body = Buffer.from(
      JSON.stringify({
        sub: payload.id,
        sid: payload.sessionId,
        username: payload.username,
        kind,
        exp: expiresAt.getTime(),
      }),
    ).toString("base64url");
    const signature = crypto
      .createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY)
      .update(body)
      .digest("base64url");
    return `${body}.${signature}`;
  }

  /** Resolves and validates a bearer access token against live session state. */
  export async function authorize(
    header: string | undefined,
  ): Promise<Payload> {
    if (header?.startsWith("Bearer ") !== true)
      throw ErrorUtil.unauthorized("Authentication is required.");
    const token = header.slice(7);
    const [body, signature] = token.split(".");
    if (body === undefined || signature === undefined)
      throw ErrorUtil.unauthorized("Authentication is required.");
    const expected = crypto
      .createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY)
      .update(body)
      .digest("base64url");
    if (signature !== expected) throw ErrorUtil.unauthorized("Authentication is required.");
    let decoded: { sub: string; sid: string; username: string; kind: string; exp: number };
    try {
      decoded = JSON.parse(Buffer.from(body.replaceAll("-", "+").replaceAll("_", "/"), "base64").toString("utf8")) as typeof decoded;
    } catch {
      throw ErrorUtil.unauthorized("Authentication is required.");
    }
    if (decoded.kind !== "access" || typeof decoded.sub !== "string" || typeof decoded.sid !== "string" || typeof decoded.exp !== "number" || !Number.isFinite(decoded.exp) || decoded.exp <= Date.now())
      throw ErrorUtil.unauthorized("Authentication is required.");
    const session = await MyGlobal.prisma.sessions.findFirst({
      where: {
        id: decoded.sid,
        user_id: decoded.sub,
        revoked_at: null,
        expires_at: { gt: new Date() },
        user: { deleted_at: null },
      },
      select: { user: { select: { id: true, username: true } } },
    });
    if (session === null) throw ErrorUtil.unauthorized("Authentication is required.");
    return { id: session.user.id, sessionId: decoded.sid, username: session.user.username };
  }

  /** Creates access and refresh material for an existing session. */
  export function authorized(
    payload: Payload,
    sessionExpires: Date,
  ): IAuth.IAuthorized {
    const accessExpires = new Date(
      Date.now() + Number(MyGlobal.env.JWT_ACCESS_TTL_SECONDS) * 1000,
    );
    return {
      id: payload.id,
      username: payload.username,
      token: { access: `Bearer ${issue(payload, "access", accessExpires)}`, refresh: issue(payload, "refresh", sessionExpires) },
    };
  }

  /** Opens a new persistent session and returns its bearer material. */
  export async function createSession(user: {
    id: string;
    username: string;
  }): Promise<IAuth.IAuthorized> {
    const now = new Date();
    const expires = new Date(
      now.getTime() + Number(MyGlobal.env.JWT_REFRESH_TTL_SECONDS) * 1000,
    );
    const sessionId = crypto.randomUUID();
    const payload = { id: user.id, sessionId, username: user.username } as Payload;
    const refreshToken = issue(payload, "refresh", expires);
    await MyGlobal.prisma.sessions.create({
      data: {
        id: sessionId,
        user_id: user.id,
        refresh_token_hash: crypto.createHash("sha256").update(refreshToken).digest("hex"),
        created_at: now,
        expires_at: expires,
      },
    });
    return {
      id: user.id,
      username: user.username,
      token: { access: `Bearer ${issue(payload, "access", new Date(Date.now() + Number(MyGlobal.env.JWT_ACCESS_TTL_SECONDS) * 1000))}`, refresh: refreshToken },
    };
  }
}
