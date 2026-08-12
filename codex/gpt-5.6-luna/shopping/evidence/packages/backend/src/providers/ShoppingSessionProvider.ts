import crypto from "node:crypto";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Resolves a current customer session from an issued bearer token. */
export namespace ShoppingSessionProvider {
  /** Reads the customer id from a bearer access token. */
  export async function customer(authorization: string): Promise<string> {
    const token = authorization.replace(/^Bearer\s+/i, "");
    const parts = token.split(".");
    if (parts.length !== 2) throw ErrorUtil.unauthorized("Authentication is required.");
    const expected = crypto.createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(parts[0]!).digest("base64url");
    if (parts[1] !== expected) throw ErrorUtil.unauthorized("Authentication is required.");
    let parsed: { type?: string; actorId?: string; sessionId?: string };
    try { parsed = JSON.parse(Buffer.from(parts[0]!, "base64url").toString()) as { type?: string; actorId?: string; sessionId?: string }; } catch { throw ErrorUtil.unauthorized("Authentication is required."); }
    if (parsed.type !== "customer" || parsed.actorId === undefined || parsed.sessionId === undefined) throw ErrorUtil.unauthorized("Authentication is required.");
    const session = await MyGlobal.prisma.shopping_customer_sessions.findFirst({ where: { id: parsed.sessionId, customer_id: parsed.actorId, revoked_at: null, expired_at: { gt: new Date() } }, select: { customer_id: true } });
    if (session === null) throw ErrorUtil.unauthorized("The customer session is no longer valid.");
    if (await MyGlobal.prisma.shopping_customers.findFirst({ where: { id: parsed.actorId, deleted_at: null, login_status: "active" }, select: { id: true } }) === null)
      throw ErrorUtil.unauthorized("The customer session is no longer valid.");
    return session.customer_id;
  }
}
