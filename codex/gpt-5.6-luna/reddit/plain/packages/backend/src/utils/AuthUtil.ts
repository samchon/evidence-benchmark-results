import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { ErrorUtil } from "./ErrorUtil";
import { MyGlobal } from "../MyGlobal";

/** Authentication payload carried by an access or refresh token. */
export interface AuthPayload {
  /** User identifier. */
  id: string;
  /** Session identifier. */
  session_id: string;
  /** Token kind. */
  kind: "access" | "refresh";
  /** Expiration epoch seconds. */
  exp: number;
}

/** Implements password hashing and statelessly signed session material. */
export namespace AuthUtil {
  /** Hashes a password with a per-value salt. */
  export function hashPassword(password: string): string {
    const salt = randomBytes(16).toString("hex");
    return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
  }

  /** Compares a plaintext password to a stored hash. */
  export function verifyPassword(password: string, stored: string): boolean {
    const [salt, expected] = stored.split(":");
    if (salt === undefined || expected === undefined) return false;
    const actual = scryptSync(password, salt, 64).toString("hex");
    return actual.length === expected.length && timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
  }

  /** Issues an access and refresh token pair for one session. */
  export function issue(id: string, session_id: string) {
    return {
      accessToken: sign({ id, session_id, kind: "access", exp: now() + Number(MyGlobal.env.JWT_ACCESS_TTL_SECONDS) }),
      refreshToken: sign({ id, session_id, kind: "refresh", exp: now() + Number(MyGlobal.env.JWT_REFRESH_TTL_SECONDS) }),
    };
  }

  /** Decodes a bearer token without consulting mutable account state. */
  export function fromBearer(value: string | undefined): AuthPayload | null {
    if (value === undefined) return null;
    const token = value.startsWith("Bearer ") ? value.slice(7) : value;
    return decode(token);
  }

  /** Requires a well-formed bearer token. */
  export function requireBearer(value: string | undefined): AuthPayload {
    const payload = fromBearer(value);
    if (payload === null || payload.kind !== "access" || payload.exp <= now())
      throw ErrorUtil.unauthorized("Authentication is required.");
    return payload;
  }

  function sign(payload: AuthPayload): string {
    const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url");
    return `${body}.${signature}`;
  }

  function decode(token: string): AuthPayload | null {
    const [body, signature] = token.split(".");
    if (body === undefined || signature === undefined) return null;
    const expected = createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url");
    if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    try {
      const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as AuthPayload;
      return payload.kind !== "access" && payload.kind !== "refresh" ? null : payload;
    } catch {
      return null;
    }
  }

  function now(): number {
    return Math.floor(Date.now() / 1000);
  }
}
