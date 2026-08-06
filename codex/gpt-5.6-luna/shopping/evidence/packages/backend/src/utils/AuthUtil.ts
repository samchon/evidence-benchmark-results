import crypto from "node:crypto";

import { ErrorUtil } from "./ErrorUtil";

/** Encodes and validates the short-lived bearer tokens used by the local API. */
export namespace AuthUtil {
  /** Actor kinds accepted by the authentication boundary. */
  export type Type = "customer" | "seller" | "admin";
  /** Parsed bearer identity. */
  export interface Payload { id: string; sessionId: string; type: Type; }

  /** Creates an opaque access token for one persisted session. */
  export function issue(payload: Payload): string {
    const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
    const signature = crypto.createHmac("sha256", "shopping2-local-secret").update(body).digest("base64url");
    return `${body}.${signature}`;
  }

  /** Parses a bearer token and throws a public 401 on malformed input. */
  export function parse(value: string | undefined): Payload {
    const token = value?.startsWith("Bearer ") === true ? value.slice(7) : value;
    if (token === undefined) throw ErrorUtil.unauthorized("Authorization is required.");
    const [body, signature] = token.split(".");
    if (body === undefined || signature === undefined) throw ErrorUtil.unauthorized("Authorization is invalid.");
    const expected = crypto.createHmac("sha256", "shopping2-local-secret").update(body).digest("base64url");
    if (signature !== expected) throw ErrorUtil.unauthorized("Authorization is invalid.");
    try {
      const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Payload;
      if (parsed.type !== "customer" && parsed.type !== "seller" && parsed.type !== "admin") throw new Error("invalid actor type");
      return parsed;
    } catch {
      throw ErrorUtil.unauthorized("Authorization is invalid.");
    }
  }
}
