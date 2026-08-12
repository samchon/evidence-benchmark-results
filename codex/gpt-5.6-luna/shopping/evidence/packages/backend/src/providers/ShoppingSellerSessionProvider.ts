import crypto from "node:crypto";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Resolves a seller access token to its live seller session. */
export namespace ShoppingSellerSessionProvider {
  /** Returns the authenticated seller identifier. */
  export async function seller(authorization: string): Promise<string> {
    const token = authorization.replace(/^Bearer\s+/i, "");
    const [body, signature] = token.split(".");
    if (body === undefined || signature === undefined) throw ErrorUtil.unauthorized("Authentication is required.");
    const expected = crypto.createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url");
    if (signature !== expected) throw ErrorUtil.unauthorized("Authentication is required.");
    let payload: { type?: string; actorId?: string; sessionId?: string };
    try { payload = JSON.parse(Buffer.from(body, "base64url").toString()) as { type?: string; actorId?: string; sessionId?: string }; } catch { throw ErrorUtil.unauthorized("Authentication is required."); }
    if (payload.type !== "seller" || payload.actorId === undefined || payload.sessionId === undefined) throw ErrorUtil.unauthorized("Authentication is required.");
    const session = await MyGlobal.prisma.shopping_seller_sessions.findFirst({ where: { id: payload.sessionId, seller_id: payload.actorId, revoked_at: null, expired_at: { gt: new Date() } }, select: { seller_id: true } });
    if (session === null) throw ErrorUtil.unauthorized("The seller session is no longer valid.");
    if (await MyGlobal.prisma.shopping_sellers.findFirst({ where: { id: payload.actorId, deleted_at: null, login_status: "active" }, select: { id: true } }) === null)
      throw ErrorUtil.unauthorized("The seller session is no longer valid.");
    return session.seller_id;
  }
}
