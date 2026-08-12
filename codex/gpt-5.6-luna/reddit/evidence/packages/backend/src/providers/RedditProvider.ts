import crypto from "node:crypto";
import type {
  IPage,
  IRedditBan,
  IRedditComment,
  IRedditCommunity,
  IRedditModerationAction,
  IRedditModeratorAssignment,
  IRedditPost,
  IRedditReport,
  IRedditSubscription,
  IRedditUser,
  IRedditVote,
} from "@benchmark/reddit-api";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Implements the Reddit domain behind the generated controller contract. */
export namespace RedditProvider {
  export interface IAuthPayload {
    id: string;
    session_id: string;
    type: "user";
  }

  /** Produces the standard refusal used when no bearer session is supplied. */
  export function unauthorized(): ReturnType<typeof ErrorUtil.unauthorized> {
    return ErrorUtil.unauthorized("Authentication is required.");
  }

  type UserWithProfile = {
    id: string;
    username: string;
    karma: number;
    profile: {
      display_name: string;
      bio: string;
      avatar: string | null;
    } | null;
  };

  const now = (): Date => new Date();
  const uuid = (): string => crypto.randomUUID();
  const normalized = (value: string): string => value.trim().toLowerCase();

  function hash(value: string): string {
    return crypto.createHash("sha256").update(value).digest("hex");
  }

  function password(value: string): string {
    return crypto.scryptSync(value, "reddit-local-password-salt", 32).toString("hex");
  }

  function sign(payload: IAuthPayload, ttl: number): string {
    const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + ttl * 1000 })).toString("base64url");
    const signature = crypto.createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url");
    return `${body}.${signature}`;
  }

  function signPageCursor(payload: { page: number; limit: number; scope: string; snapshot: number; items?: string[] }): string {
    const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = crypto.createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url");
    return `${body}.${signature}`;
  }

  function readPageCursor(token: string): { page: number; limit: number; scope: string; snapshot: number; items?: string[] } | null {
    try {
      const [body, signature] = token.split(".");
      if (body === undefined || signature === undefined) return null;
      const expected = crypto.createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url");
      if (signature.length !== expected.length || crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) === false) return null;
      const parsed: unknown = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
      if (typeof parsed !== "object" || parsed === null) return null;
      const value = parsed as { page?: unknown; limit?: unknown; scope?: unknown; snapshot?: unknown; items?: unknown };
      return typeof value.page === "number" && Number.isSafeInteger(value.page) && value.page >= 1 &&
        typeof value.limit === "number" && Number.isSafeInteger(value.limit) && value.limit >= 1 && value.limit <= 100 &&
        typeof value.scope === "string" && typeof value.snapshot === "number" && Number.isSafeInteger(value.snapshot) && value.snapshot > 0
        ? { page: value.page, limit: value.limit, scope: value.scope, snapshot: value.snapshot, items: value.items === undefined ? undefined : Array.isArray(value.items) && value.items.every((item): item is string => typeof item === "string") ? value.items : undefined }
        : null;
    } catch {
      return null;
    }
  }

  function verify(token: string): IAuthPayload {
    const [body, signature] = token.split(".");
    if (body === undefined || signature === undefined)
      throw ErrorUtil.unauthorized("Authentication is required.");
    const expected = crypto.createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url");
    if (signature.length !== expected.length || crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) === false)
      throw ErrorUtil.unauthorized("The access token is invalid.");
    const parsed: unknown = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof parsed !== "object" || parsed === null || !("id" in parsed) || !("session_id" in parsed) || !("exp" in parsed))
      throw ErrorUtil.unauthorized("The access token is invalid.");
    const value = parsed as { id: unknown; session_id: unknown; exp: unknown };
    if (typeof value.id !== "string" || typeof value.session_id !== "string" || typeof value.exp !== "number" || value.exp <= Date.now())
      throw ErrorUtil.unauthorized("The access token is expired.");
    return { id: value.id, session_id: value.session_id, type: "user" };
  }

  export async function authenticate(token: string): Promise<IAuthPayload> {
    const payload = verify(token);
    const session = await MyGlobal.prisma.reddit_user_sessions.findFirst({
      where: { id: payload.session_id, user_id: payload.id, revoked_at: null, expires_at: { gt: now() } },
    });
    if (session === null) throw ErrorUtil.unauthorized("The session is no longer active.");
    const user = await MyGlobal.prisma.reddit_users.findUnique({ where: { id: payload.id } });
    if (user === null || user.deleted_at !== null) throw ErrorUtil.unauthorized("The account is no longer active.");
    return payload;
  }

  function summary(user: UserWithProfile): IRedditUser.ISummary {
    return {
      id: user.id,
      username: user.username,
      displayName: user.profile?.display_name ?? user.username,
      avatar: user.profile?.avatar ?? null,
    };
  }

  async function userWithProfile(id: string): Promise<UserWithProfile> {
    const user = await MyGlobal.prisma.reddit_users.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (user === null) throw ErrorUtil.notFound("The account was not found.");
    return user;
  }

  function text(value: string, field: string, minimum: number, maximum: number): string {
    const trimmed = value.trim();
    if (trimmed.length < minimum || trimmed.length > maximum)
      throw ErrorUtil.badRequest(`${field} must contain ${minimum} through ${maximum} visible characters.`);
    return trimmed;
  }

  interface ImageData {
    value: string;
    mime: "jpeg" | "png" | "webp";
    width: number;
    height: number;
  }

  function image(value: string | null, field: string): string | null {
    if (value === null) return null;
    const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(value);
    if (match === null) throw ErrorUtil.badRequest(`${field} must be a JPEG, PNG, or WebP data image.`);
    const encoded = match[2];
    if (encoded === undefined) throw ErrorUtil.badRequest(`${field} is malformed.`);
    const bytes = Buffer.from(encoded, "base64");
    if (bytes.byteLength === 0 || bytes.toString("base64").replace(/=+$/, "") !== encoded.replace(/=+$/, ""))
      throw ErrorUtil.badRequest(`${field} is malformed.`);
    if (bytes.byteLength > 10 * 1024 * 1024)
      throw ErrorUtil.badRequest(`${field} must not exceed 10 MiB.`);
    const mime = match[1];
    if (mime !== "jpeg" && mime !== "png" && mime !== "webp") throw ErrorUtil.badRequest(`${field} has an unsupported image format.`);
    const metadata = imageMetadata(bytes, mime);
    if (metadata === null) throw ErrorUtil.badRequest(`${field} does not contain a valid ${mime.toUpperCase()} image.`);
    return value;
  }

  function imageMetadata(bytes: Buffer, mime: string): Omit<ImageData, "value" | "mime"> | null {
    if (mime === "png") {
      if (bytes.length < 24 || !Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).equals(bytes.subarray(0, 8)) || bytes.toString("ascii", 12, 16) !== "IHDR") return null;
      const width = bytes.readUInt32BE(16);
      const height = bytes.readUInt32BE(20);
      return width > 0 && height > 0 ? { width, height } : null;
    }
    if (mime === "webp") {
      if (bytes.length < 16 || bytes.toString("ascii", 0, 4) !== "RIFF" || bytes.toString("ascii", 8, 12) !== "WEBP") return null;
      let offset = 12;
      while (offset + 8 <= bytes.length) {
        const kind = bytes.toString("ascii", offset, offset + 4);
        const size = bytes.readUInt32LE(offset + 4);
        const data = offset + 8;
        if (data + size > bytes.length) return null;
        if (kind === "VP8X" && size >= 10 && ((bytes[data] ?? 0) & 0x02) !== 0) {
          const width = 1 + (bytes[data + 4] ?? 0) + ((bytes[data + 5] ?? 0) << 8) + ((bytes[data + 6] ?? 0) << 16);
          const height = 1 + (bytes[data + 7] ?? 0) + ((bytes[data + 8] ?? 0) << 8) + ((bytes[data + 9] ?? 0) << 16);
          return { width, height };
        }
        if (kind === "VP8 " && size >= 10 && bytes[data + 3] === 0x9d && bytes[data + 4] === 0x01 && bytes[data + 5] === 0x2a) {
          return { width: bytes.readUInt16LE(data + 6) & 0x3fff, height: bytes.readUInt16LE(data + 8) & 0x3fff };
        }
        offset = data + size + (size % 2);
      }
      return null;
    }
    if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
    let offset = 2;
    while (offset + 3 < bytes.length) {
      if (bytes[offset] !== 0xff) return null;
      while (offset < bytes.length && bytes[offset] === 0xff) offset += 1;
      const marker = bytes[offset];
      offset += 1;
      if (marker === undefined) return null;
      if (marker === 0xd9 || marker === 0xda) break;
      if (offset + 1 >= bytes.length) return null;
      const length = bytes.readUInt16BE(offset);
      if (length < 2 || offset + length > bytes.length) return null;
      if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
        if (length < 7) return null;
        const height = bytes.readUInt16BE(offset + 3);
        const width = bytes.readUInt16BE(offset + 5);
        return width > 0 && height > 0 ? { width, height } : null;
      }
      offset += length;
    }
    return null;
  }

  function imageInfo(value: string, field: string): ImageData {
    const match = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(value);
    if (match === null || match[2] === undefined) throw ErrorUtil.badRequest(`${field} is malformed.`);
    const bytes = Buffer.from(match[2], "base64");
    const mime = match[1];
    if (mime !== "jpeg" && mime !== "png" && mime !== "webp") throw ErrorUtil.badRequest(`${field} is malformed.`);
    const metadata = imageMetadata(bytes, mime);
    if (metadata === null) throw ErrorUtil.badRequest(`${field} is malformed.`);
    return { value, mime, ...metadata };
  }

  function thumbnail(value: string | null, field: string): string | null {
    if (value === null) return null;
    const source = imageInfo(value, field);
    const scale = Math.min(1, 400 / Math.max(source.width, source.height));
    const width = Math.max(1, Math.round(source.width * scale));
    const height = Math.max(1, Math.round(source.height * scale));
    const x = Math.floor((400 - width) / 2);
    const y = Math.floor((400 - height) / 2);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><image href="${source.value}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="none"/></svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }

  function validateEmail(value: string): string {
    const email = value.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) === false)
      throw ErrorUtil.badRequest("The email address is invalid.");
    return email;
  }

  function textValue(value: string, field: string): string {
    return text(value, field, 1, 40000);
  }

  interface PageState { current: number; limit: number; snapshot: number; reset: boolean; scope: string; items?: string[]; }

  function pageScope(input: IPage.IRequest, owner: string): string {
    const request = { ...input, page: undefined, limit: undefined, cursor: undefined };
    return `${owner}:${JSON.stringify(request)}`;
  }

  function pageInput(input: IPage.IRequest, owner = "shared"): PageState {
    const cursor = input.cursor === undefined || input.cursor === null ? null : readPageCursor(input.cursor);
    const scope = pageScope(input, owner);
    const requestedLimit = input.limit ?? null;
    const requestedPage = input.page ?? null;
    if (input.cursor !== undefined && input.cursor !== null && (cursor === null || cursor.scope !== scope || (requestedLimit !== null && requestedLimit !== cursor.limit) || (requestedPage !== null && requestedPage !== cursor.page)))
      return { current: 1, limit: requestedLimit ?? 25, snapshot: Date.now(), reset: true, scope };
    return { current: requestedPage ?? cursor?.page ?? 1, limit: requestedLimit ?? cursor?.limit ?? 25, snapshot: cursor?.snapshot ?? Date.now(), reset: false, scope, items: cursor?.items };
  }

  function page<T extends object>(data: T[], total: number, input: IPage.IRequest, owner = "shared", items?: string[]): IPage<T> {
    const state = pageInput(input, owner);
    const { current, limit } = state;
    return {
      data,
      pagination: { current, limit, records: total, pages: Math.max(1, Math.ceil(total / limit)) },
      next: current * limit < (items?.length ?? total) ? signPageCursor({ page: current + 1, limit, scope: state.scope, snapshot: state.snapshot, items: items ?? state.items }) : null,
      reset: state.reset,
    };
  }

  function authorized(user: UserWithProfile, sessionId: string, refreshToken: string): IRedditUser.IAuthorized {
    const accessTtl = Number(MyGlobal.env.JWT_ACCESS_TTL_SECONDS);
    const payload: IAuthPayload = { id: user.id, session_id: sessionId, type: "user" };
    return { accessToken: sign(payload, accessTtl), refreshToken, user: summary(user) };
  }

  export async function join(input: IRedditUser.IJoin): Promise<IRedditUser.IAuthorized> {
    const emailValue = validateEmail(input.email);
    const email = normalized(emailValue);
    const username = text(input.username, "Username", 3, 30);
    if (/^[A-Za-z0-9_]+$/.test(username) === false) throw ErrorUtil.badRequest("Username contains unsupported characters.");
    if (input.password.length < 8 || input.password.length > 128) throw ErrorUtil.badRequest("Password must contain 8 through 128 characters.");
    const [emailConflict, usernameConflict] = await Promise.all([
      MyGlobal.prisma.reddit_users.findUnique({ where: { email_normalized: email } }),
      MyGlobal.prisma.reddit_users.findUnique({ where: { username_normalized: normalized(username) } }),
    ]);
    if (emailConflict !== null || usernameConflict !== null) {
      const unavailable = [emailConflict === null ? null : "email", usernameConflict === null ? null : "username"].filter((value): value is string => value !== null);
      throw ErrorUtil.conflict(`The ${unavailable.join(" and ")} is unavailable.`);
    }
    const id = uuid();
    const created = now();
    const user = await MyGlobal.prisma.$transaction(async (tx) => {
      const account = await tx.reddit_users.create({
        data: { id, email: emailValue, email_normalized: email, username, username_normalized: normalized(username), password_hash: password(input.password), karma: 0, created_at: created, updated_at: created },
        include: { profile: true },
      });
      await tx.reddit_profiles.create({ data: { id: uuid(), user_id: id, display_name: username, bio: "", avatar: null, avatar_thumbnail: null, created_at: created, updated_at: created } });
      return account;
    });
    const sessionId = uuid();
    const refreshToken = sign({ id: user.id, session_id: sessionId, type: "user" }, Number(MyGlobal.env.JWT_REFRESH_TTL_SECONDS));
    await MyGlobal.prisma.reddit_user_sessions.create({ data: { id: sessionId, user_id: user.id, refresh_token_hash: hash(refreshToken), expires_at: new Date(Date.now() + Number(MyGlobal.env.JWT_REFRESH_TTL_SECONDS) * 1000), created_at: now() } });
    return authorized(await userWithProfile(user.id), sessionId, refreshToken);
  }

  export async function login(input: IRedditUser.ILogin): Promise<IRedditUser.IAuthorized> {
    const user = await MyGlobal.prisma.reddit_users.findUnique({ where: { email_normalized: normalized(validateEmail(input.email)) } });
    if (user === null || user.deleted_at !== null || user.password_hash !== password(input.password)) throw ErrorUtil.unauthorized("The credentials are invalid.");
    const sessionId = uuid();
    const refreshToken = sign({ id: user.id, session_id: sessionId, type: "user" }, Number(MyGlobal.env.JWT_REFRESH_TTL_SECONDS));
    await MyGlobal.prisma.reddit_user_sessions.create({ data: { id: sessionId, user_id: user.id, refresh_token_hash: hash(refreshToken), expires_at: new Date(Date.now() + Number(MyGlobal.env.JWT_REFRESH_TTL_SECONDS) * 1000), created_at: now() } });
    return authorized(await userWithProfile(user.id), sessionId, refreshToken);
  }

  export async function refresh(input: IRedditUser.IRefresh): Promise<IRedditUser.IAuthorized> {
    const payload = verify(input.refreshToken);
    const session = await MyGlobal.prisma.reddit_user_sessions.findUnique({ where: { id: payload.session_id } });
    if (session === null || session.revoked_at !== null || session.expires_at <= now() || session.refresh_token_hash !== hash(input.refreshToken)) throw ErrorUtil.unauthorized("The refresh token is invalid.");
    const next = sign(payload, Number(MyGlobal.env.JWT_REFRESH_TTL_SECONDS));
    await MyGlobal.prisma.reddit_user_sessions.update({ where: { id: session.id }, data: { refresh_token_hash: hash(next), expires_at: new Date(Date.now() + Number(MyGlobal.env.JWT_REFRESH_TTL_SECONDS) * 1000) } });
    return authorized(await userWithProfile(payload.id), payload.session_id, next);
  }

  export async function passwordUpdate(actor: IAuthPayload, input: IRedditUser.IPasswordUpdate): Promise<void> {
    const user = await MyGlobal.prisma.reddit_users.findUnique({ where: { id: actor.id } });
    if (user === null || user.password_hash !== password(input.currentPassword)) throw ErrorUtil.unauthorized("The current password is invalid.");
    if (input.currentPassword === input.newPassword) throw ErrorUtil.badRequest("The new password must differ from the current password.");
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.reddit_users.update({ where: { id: actor.id }, data: { password_hash: password(input.newPassword), updated_at: now() } }),
      MyGlobal.prisma.reddit_user_sessions.updateMany({ where: { user_id: actor.id, id: { not: actor.session_id }, revoked_at: null }, data: { revoked_at: now() } }),
    ]);
  }

  export async function recoveryRequest(input: IRedditUser.IRecoveryRequest): Promise<void> {
    const user = await MyGlobal.prisma.reddit_users.findUnique({ where: { email_normalized: normalized(input.email) } });
    if (user === null || user.deleted_at !== null) return;
    const proof = crypto.randomBytes(24).toString("base64url");
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.reddit_recovery_proofs.updateMany({ where: { user_id: user.id, used_at: null }, data: { used_at: now() } }),
      MyGlobal.prisma.reddit_recovery_proofs.create({ data: { id: uuid(), user_id: user.id, proof_hash: hash(proof), expires_at: new Date(Date.now() + 15 * 60 * 1000), created_at: now() } }),
      MyGlobal.prisma.reddit_effects.create({ data: { id: uuid(), user_id: user.id, recipient: user.email, kind: "password-recovery", payload: JSON.stringify({ proof }), created_at: now() } }),
    ]);
  }

  export async function recoveryComplete(input: IRedditUser.IRecoveryComplete): Promise<void> {
    const user = await MyGlobal.prisma.reddit_users.findUnique({ where: { email_normalized: normalized(input.email) } });
    if (user === null || user.deleted_at !== null) throw ErrorUtil.unauthorized("The recovery proof is invalid.");
    const proof = await MyGlobal.prisma.reddit_recovery_proofs.findFirst({ where: { user_id: user.id, proof_hash: hash(input.proof), used_at: null, expires_at: { gt: now() } }, orderBy: { created_at: "desc" } });
    if (proof === null) throw ErrorUtil.unauthorized("The recovery proof is invalid.");
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.reddit_recovery_proofs.update({ where: { id: proof.id }, data: { used_at: now() } }),
      MyGlobal.prisma.reddit_users.update({ where: { id: user.id }, data: { password_hash: password(input.newPassword), updated_at: now() } }),
      MyGlobal.prisma.reddit_user_sessions.updateMany({ where: { user_id: user.id, revoked_at: null }, data: { revoked_at: now() } }),
    ]);
  }

  export async function logout(actor: IAuthPayload): Promise<void> { await MyGlobal.prisma.reddit_user_sessions.update({ where: { id: actor.session_id }, data: { revoked_at: now() } }); }
  export async function logoutAll(actor: IAuthPayload): Promise<void> { await MyGlobal.prisma.reddit_user_sessions.updateMany({ where: { user_id: actor.id, revoked_at: null }, data: { revoked_at: now() } }); }

  export async function erase(actor: IAuthPayload, input: IRedditUser.ILogin): Promise<void> {
    const user = await MyGlobal.prisma.reddit_users.findUnique({ where: { id: actor.id } });
    if (user === null || user.password_hash !== password(input.password)) throw ErrorUtil.unauthorized("The password is invalid.");
    const timestamp = now();
    await MyGlobal.prisma.$transaction(async (tx) => {
      const votes = await tx.reddit_votes.findMany({ where: { user_id: actor.id } });
      for (const vote of votes) {
        if (vote.post_id !== null) {
          const post = await tx.reddit_posts.findUnique({ where: { id: vote.post_id } });
          if (post !== null) {
            await tx.reddit_posts.update({ where: { id: post.id }, data: { score: { decrement: vote.value } } });
            await tx.reddit_users.update({ where: { id: post.author_id }, data: { karma: { decrement: vote.value } } });
          }
        }
        if (vote.comment_id !== null) {
          const comment = await tx.reddit_comments.findUnique({ where: { id: vote.comment_id } });
          if (comment !== null) {
            await tx.reddit_comments.update({ where: { id: comment.id }, data: { score: { decrement: vote.value } } });
            if (comment.author_id !== null) await tx.reddit_users.update({ where: { id: comment.author_id }, data: { karma: { decrement: vote.value } } });
          }
        }
      }
      await tx.reddit_votes.deleteMany({ where: { user_id: actor.id } });
      const authoredPosts = await tx.reddit_posts.findMany({
        where: { author_id: actor.id, deleted_at: null },
        include: { votes: true, comments: { include: { votes: true } } },
      });
      const authoredPostIds = new Set(authoredPosts.map((post) => post.id));
      for (const post of authoredPosts) {
        for (const vote of post.votes) {
          if (vote.user_id !== actor.id) await tx.reddit_users.update({ where: { id: post.author_id }, data: { karma: { decrement: vote.value } } });
        }
        for (const comment of post.comments) {
          if (comment.author_id !== null && comment.author_id !== actor.id)
            for (const vote of comment.votes)
              if (vote.user_id !== actor.id) await tx.reddit_users.update({ where: { id: comment.author_id }, data: { karma: { decrement: vote.value } } });
          await tx.reddit_votes.deleteMany({ where: { comment_id: comment.id } });
          await tx.reddit_reports.deleteMany({ where: { comment_id: comment.id, outcome: null } });
          await tx.reddit_comments.update({ where: { id: comment.id }, data: { text: null, deleted: true, author_id: null, score: 0, deleted_at: timestamp, updated_at: timestamp } });
        }
        await tx.reddit_votes.deleteMany({ where: { post_id: post.id } });
        await tx.reddit_reports.deleteMany({ where: { post_id: post.id, outcome: null } });
        await tx.reddit_posts.update({ where: { id: post.id }, data: { deleted_at: timestamp, updated_at: timestamp, score: 0, comment_count: 0 } });
      }
      const authoredComments = await tx.reddit_comments.findMany({
        where: { author_id: actor.id, deleted: false },
        include: { votes: true, post: { select: { author_id: true } } },
      });
      for (const comment of authoredComments) {
        if (authoredPostIds.has(comment.post_id)) continue;
        await tx.reddit_votes.deleteMany({ where: { comment_id: comment.id } });
        await tx.reddit_reports.deleteMany({ where: { comment_id: comment.id, outcome: null } });
        await tx.reddit_comments.update({ where: { id: comment.id }, data: { text: null, deleted: true, author_id: null, score: 0, deleted_at: timestamp, updated_at: timestamp } });
        await tx.reddit_posts.update({ where: { id: comment.post_id }, data: { comment_count: { decrement: 1 } } });
      }
      await tx.reddit_reports.deleteMany({ where: { reporter_id: actor.id, outcome: null } });
      await tx.reddit_reports.updateMany({ where: { reporter_id: actor.id, outcome: { not: null } }, data: { reporter_id: null } });
      await tx.reddit_reports.updateMany({ where: { moderator_id: actor.id, outcome: { not: null } }, data: { moderator_id: null } });
      await tx.reddit_moderation_actions.updateMany({ where: { reporter_id: actor.id }, data: { reporter_id: null } });
      await tx.reddit_moderation_actions.updateMany({ where: { moderator_id: actor.id }, data: { moderator_id: null } });
      await tx.reddit_user_sessions.updateMany({ where: { user_id: actor.id, revoked_at: null }, data: { revoked_at: timestamp } });
      await tx.reddit_profiles.deleteMany({ where: { user_id: actor.id } });
      await tx.reddit_subscriptions.updateMany({ where: { user_id: actor.id, active: true }, data: { active: false, ended_at: timestamp } });
      await tx.reddit_moderator_assignments.updateMany({ where: { user_id: actor.id, active: true }, data: { active: false, revoked_at: timestamp } });
      await tx.reddit_bans.updateMany({ where: { user_id: actor.id, active: true }, data: { active: false, ended_at: timestamp } });
      await tx.reddit_bans.updateMany({ where: { moderator_id: actor.id, active: true }, data: { active: false, ended_at: timestamp } });
      const owned = await tx.reddit_communities.findMany({ where: { owner_id: actor.id } });
      for (const community of owned) {
        const successorModerator = await tx.reddit_moderator_assignments.findFirst({ where: { community_id: community.id, active: true, user_id: { not: actor.id }, user: { deleted_at: null } }, orderBy: [{ started_at: "asc" }, { user_id: "asc" }] });
        const successor = successorModerator === null
          ? await tx.reddit_subscriptions.findFirst({ where: { community_id: community.id, active: true, user_id: { not: actor.id }, user: { deleted_at: null } }, orderBy: [{ started_at: "asc" }, { user_id: "asc" }] })
          : successorModerator;
        if (successor === null) {
          await tx.reddit_communities.update({ where: { id: community.id }, data: { owner_id: null, status: "archived", updated_at: timestamp } });
        } else {
          await tx.reddit_communities.update({ where: { id: community.id }, data: { owner_id: successor.user_id, updated_at: timestamp } });
        }
      }
      await tx.reddit_users.update({ where: { id: actor.id }, data: { deleted_at: timestamp, updated_at: timestamp } });
    });
  }

  export async function updateProfile(actor: IAuthPayload, input: IRedditUser.IUpdate): Promise<IRedditUser> {
    const existing = await userWithProfile(actor.id);
    const displayName = input.displayName === undefined || input.displayName === null ? existing.profile?.display_name ?? existing.username : text(input.displayName, "Display name", 1, 200);
    const avatar = image(input.avatar === undefined ? existing.profile?.avatar ?? null : input.avatar, "Avatar");
    const profile = await MyGlobal.prisma.reddit_profiles.update({ where: { user_id: actor.id }, data: { display_name: displayName, bio: input.bio === undefined || input.bio === null ? existing.profile?.bio ?? "" : input.bio, avatar, avatar_thumbnail: thumbnail(avatar, "Avatar"), updated_at: now() } });
    return profileOutput({ ...existing, profile });
  }

  export async function profile(username: string): Promise<IRedditUser> {
    const user = await MyGlobal.prisma.reddit_users.findFirst({ where: { username_normalized: normalized(username), deleted_at: null }, include: { profile: true } });
    if (user === null) throw ErrorUtil.notFound("The profile was not found.");
    return profileOutput(user);
  }

  async function profileOutput(user: UserWithProfile): Promise<IRedditUser> {
    const [posts, comments] = await Promise.all([
      MyGlobal.prisma.reddit_posts.findMany({ where: { author_id: user.id, deleted_at: null }, include: { author: { include: { profile: true } }, community: true }, orderBy: { created_at: "desc" } }),
      MyGlobal.prisma.reddit_comments.findMany({ where: { author_id: user.id }, include: { author: { include: { profile: true } } }, orderBy: { created_at: "desc" } }),
    ]);
    return {
      id: user.id,
      username: user.username,
      displayName: user.profile?.display_name ?? user.username,
      bio: user.profile?.bio ?? "",
      avatar: user.profile?.avatar ?? null,
      karma: user.karma,
      posts: page(await Promise.all(posts.map(postSummary)), posts.length, {}),
      comments: page(comments.map((row) => ({ id: row.id, author: row.author === null ? null : summary(row.author), text: row.deleted ? null : row.text, deleted: row.deleted, score: row.score, createdAt: row.created_at.toISOString() })), comments.length, {}),
    };
  }

  export async function communityIndex(input: IRedditCommunity.IRequest): Promise<IPage<IRedditCommunity.ISummary>> {
    const { current, limit } = pageInput(input, "community");
    const where = { ...(input.search === undefined || input.search === null || input.search.trim() === "" ? {} : { name_normalized: { contains: normalized(input.search) } }), created_at: { lte: new Date(pageInput(input, "community").snapshot) } };
    const [rows, total] = await Promise.all([MyGlobal.prisma.reddit_communities.findMany({ where, orderBy: [{ name_normalized: "asc" }, { id: "asc" }], skip: (current - 1) * limit, take: limit }), MyGlobal.prisma.reddit_communities.count({ where })]);
    const data = await Promise.all(rows.map((row) => communitySummary(row)));
    return page(data, total, input, "community");
  }

  async function communitySummary(row: { id: string; name: string; description: string; icon: string; status: string }): Promise<IRedditCommunity.ISummary> {
    const subscriberCount = await MyGlobal.prisma.reddit_subscriptions.count({ where: { community_id: row.id, active: true } });
    return { id: row.id, name: row.name, description: row.description, icon: row.icon, status: row.status === "archived" ? "archived" : "active", subscriberCount };
  }

  export async function communityAt(id: string): Promise<IRedditCommunity> {
    const row = await MyGlobal.prisma.reddit_communities.findUnique({ where: { id } });
    if (row === null) throw ErrorUtil.notFound("The community was not found.");
    const base = await communitySummary(row);
    const owner = row.owner_id === null ? null : await userWithProfile(row.owner_id);
    return { ...base, owner: owner === null ? null : { id: owner.id, username: owner.username } };
  }

  export async function communityCreate(actor: IAuthPayload, input: IRedditCommunity.ICreate): Promise<IRedditCommunity> {
    const name = text(input.name, "Community name", 3, 50);
    if (/^[A-Za-z0-9_-]+$/.test(name) === false) throw ErrorUtil.badRequest("Community name contains unsupported characters.");
    const description = text(input.description, "Community description", 1, 1000);
    const icon = image(input.icon, "Community icon");
    if (icon === null) throw ErrorUtil.badRequest("A community icon is required.");
    const conflict = await MyGlobal.prisma.reddit_communities.findUnique({ where: { name_normalized: normalized(name) } });
    if (conflict !== null) throw ErrorUtil.conflict("The community name is already reserved.");
    const created = now();
    const row = await MyGlobal.prisma.$transaction(async (tx) => {
      const community = await tx.reddit_communities.create({ data: { id: uuid(), name, name_normalized: normalized(name), description, icon, status: "active", owner_id: actor.id, created_at: created, updated_at: created } });
      await tx.reddit_subscriptions.create({ data: { id: uuid(), user_id: actor.id, community_id: community.id, active: true, started_at: created, ended_at: null, created_at: created } });
      await tx.reddit_moderator_assignments.create({ data: { id: uuid(), user_id: actor.id, community_id: community.id, active: true, started_at: created, revoked_at: null, created_at: created } });
      return community;
    });
    return communityAt(row.id);
  }

  export async function subscriptionIndex(actor: IAuthPayload, input: IPage.IRequest): Promise<IPage<IRedditSubscription>> {
    const { current, limit } = pageInput(input, `subscriptions:${actor.id}`);
    const where = { user_id: actor.id, active: true, started_at: { lte: new Date(pageInput(input, `subscriptions:${actor.id}`).snapshot) } };
    const [rows, total] = await Promise.all([MyGlobal.prisma.reddit_subscriptions.findMany({ where, include: { community: true }, orderBy: [{ community: { name_normalized: "asc" } }, { community_id: "asc" }], skip: (current - 1) * limit, take: limit }), MyGlobal.prisma.reddit_subscriptions.count({ where })]);
    const data = await Promise.all(rows.map(async (row) => ({ id: row.id, community: { id: row.community.id, name: row.community.name, description: row.community.description, icon: row.community.icon, status: row.community.status === "archived" ? "archived" as const : "active" as const, subscriberCount: await MyGlobal.prisma.reddit_subscriptions.count({ where: { community_id: row.community_id, active: true } }) }, active: row.active, startedAt: row.started_at.toISOString() })));
    return page(data, total, input, `subscriptions:${actor.id}`);
  }

  export async function subscriptionCreate(actor: IAuthPayload, communityId: string): Promise<IRedditSubscription> {
    const community = await MyGlobal.prisma.reddit_communities.findUnique({ where: { id: communityId } });
    if (community === null || community.status !== "active") throw ErrorUtil.notFound("The community is not active.");
    const row = await MyGlobal.prisma.reddit_subscriptions.update({ where: { user_id_community_id: { user_id: actor.id, community_id: communityId } }, data: { active: true, ended_at: null, started_at: now() }, include: { community: true } }).catch(async () => MyGlobal.prisma.reddit_subscriptions.create({ data: { id: uuid(), user_id: actor.id, community_id: communityId, active: true, started_at: now(), ended_at: null, created_at: now() }, include: { community: true } }));
    return { id: row.id, community: { id: row.community.id, name: row.community.name, description: row.community.description, icon: row.community.icon, status: row.community.status === "archived" ? "archived" : "active", subscriberCount: await MyGlobal.prisma.reddit_subscriptions.count({ where: { community_id: row.community.id, active: true } }) }, active: row.active, startedAt: row.started_at.toISOString() };
  }

  export async function subscriptionErase(actor: IAuthPayload, communityId: string): Promise<void> {
    await MyGlobal.prisma.reddit_subscriptions.updateMany({ where: { user_id: actor.id, community_id: communityId, active: true }, data: { active: false, ended_at: now() } });
  }

  interface PostRow {
    id: string;
    title: string;
    type: string;
    text: string | null;
    url: string | null;
    image: string | null;
    thumbnail: string | null;
    score: number;
    comment_count: number;
    created_at: Date;
    deleted_at: Date | null;
    votes?: Array<{ value: number; user_id: string }>;
    author: UserWithProfile;
    community: { id: string; name: string; description: string; icon: string; status: string };
  }

  async function postCommunity(row: PostRow): Promise<IRedditCommunity.ISummary> {
    return {
      id: row.community.id,
      name: row.community.name,
      description: row.community.description,
      icon: row.community.icon,
      status: row.community.status === "archived" ? "archived" : "active",
      subscriberCount: await MyGlobal.prisma.reddit_subscriptions.count({ where: { community_id: row.community.id, active: true } }),
    };
  }

  async function postSummary(row: PostRow): Promise<IRedditPost.ISummary> {
    return {
      id: row.id,
      title: row.title,
      author: summary(row.author),
      community: await postCommunity(row),
      preview: row.type === "text" ? (row.text ?? "").slice(0, 200) : row.type === "link" ? (() => { try { return new URL(row.url ?? "").hostname; } catch { return row.url ?? ""; } })() : row.thumbnail ?? row.image ?? "",
      score: row.score,
      commentCount: row.comment_count,
      createdAt: row.created_at.toISOString(),
    };
  }

  async function postOutput(row: PostRow): Promise<IRedditPost> {
    if (row.deleted_at !== null) throw ErrorUtil.notFound("The post was not found.");
    const type = row.type === "link" || row.type === "image" ? row.type : "text";
    return {
      ...(await postSummary(row)),
      type,
      text: row.text,
      url: row.url,
      image: row.image,
    };
  }

  async function postRow(id: string): Promise<PostRow> {
    const row = await MyGlobal.prisma.reddit_posts.findUnique({ where: { id }, include: { author: { include: { profile: true } }, community: true, votes: true } });
    if (row === null || row.deleted_at !== null) throw ErrorUtil.notFound("The post was not found.");
    return row;
  }

  function validatePost(input: IRedditPost.ICreate | IRedditPost.IUpdate, type?: string): { type: string; text: string | null; url: string | null; image: string | null } {
    const selected = type ?? ("type" in input ? input.type : undefined);
    if (selected === undefined) throw ErrorUtil.badRequest("The post type is required.");
    const title = "title" in input && input.title !== undefined && input.title !== null ? text(input.title, "Post title", 1, 300) : null;
    const textPayload = input.text === undefined || input.text === null ? null : text(input.text, "Post text", 1, 40000);
    const url = input.url ?? null;
    const imagePayload = image(input.image ?? null, "Post image");
    const count = [textPayload, url, imagePayload].filter((value) => value !== null).length;
    const expected = selected === "text" ? textPayload : selected === "link" ? url : imagePayload;
    if (count !== 1 || expected === null) throw ErrorUtil.badRequest("Exactly one payload matching the post type is required.");
    if (selected === "link") {
      try {
        const parsed = new URL(url ?? "");
        if ((parsed.protocol !== "http:" && parsed.protocol !== "https:") || parsed.hostname === "") throw new Error("invalid");
      } catch { throw ErrorUtil.badRequest("Link posts require an absolute HTTP(S) URL."); }
    }
    if ((selected !== "text" && textPayload !== null) || (selected !== "link" && url !== null) || (selected !== "image" && imagePayload !== null)) throw ErrorUtil.badRequest("The payload does not match the selected post type.");
    return { type: selected, text: selected === "text" ? textPayload : null, url: selected === "link" ? url : null, image: selected === "image" ? imagePayload : null };
  }

  export async function postCreate(actor: IAuthPayload, communityId: string, input: IRedditPost.ICreate): Promise<IRedditPost> {
    const community = await MyGlobal.prisma.reddit_communities.findUnique({ where: { id: communityId } });
    if (community === null) throw ErrorUtil.notFound("The community was not found.");
    if (community.status !== "active") throw ErrorUtil.gone("Archived communities are read-only.");
    const subscription = await MyGlobal.prisma.reddit_subscriptions.findUnique({ where: { user_id_community_id: { user_id: actor.id, community_id: communityId } } });
    if (subscription?.active !== true) throw ErrorUtil.forbidden("An active subscription is required.");
    const ban = await MyGlobal.prisma.reddit_bans.findUnique({ where: { community_id_user_id: { community_id: communityId, user_id: actor.id } } });
    if (ban?.active === true) throw ErrorUtil.forbidden("Banned users cannot create posts.");
    const payload = validatePost(input);
    const created = now();
    const id = uuid();
    await MyGlobal.prisma.reddit_posts.create({ data: { id, author_id: actor.id, community_id: communityId, title: text(input.title, "Post title", 1, 300), type: payload.type, text: payload.text, url: payload.url, image: payload.image, thumbnail: thumbnail(payload.image, "Post image"), score: 0, comment_count: 0, created_at: created, updated_at: created, deleted_at: null } });
    return postOutput(await postRow(id));
  }

  export async function postAt(id: string): Promise<IRedditPost> { return postOutput(await postRow(id)); }

  export async function postUpdate(actor: IAuthPayload, id: string, input: IRedditPost.IUpdate): Promise<IRedditPost> {
    const row = await postRow(id);
    if (row.author.id !== actor.id) throw ErrorUtil.forbidden("Only the author may edit this post.");
    const title = input.title === undefined || input.title === null ? row.title : text(input.title, "Post title", 1, 300);
    const hasPayload = input.text !== undefined || input.url !== undefined || input.image !== undefined;
    const payload = hasPayload ? validatePost(input, row.type) : { type: row.type, text: row.text, url: row.url, image: row.image };
    await MyGlobal.prisma.reddit_posts.update({ where: { id }, data: { title, text: payload.text, url: payload.url, image: payload.image, thumbnail: thumbnail(payload.image, "Post image"), updated_at: now() } });
    return postAt(id);
  }

  async function deletePostContent(postId: string, timestamp: Date, keepReportId?: string): Promise<void> {
    const post = await MyGlobal.prisma.reddit_posts.findUnique({ where: { id: postId }, include: { votes: true, comments: { include: { votes: true } } } });
    if (post === null || post.deleted_at !== null) throw ErrorUtil.notFound("The post was not found.");
    await MyGlobal.prisma.$transaction(async (tx) => {
      for (const vote of post.votes) await tx.reddit_users.update({ where: { id: post.author_id }, data: { karma: { decrement: vote.value } } });
      await tx.reddit_votes.deleteMany({ where: { post_id: postId } });
      for (const comment of post.comments) {
        if (comment.author_id !== null) for (const vote of comment.votes) await tx.reddit_users.update({ where: { id: comment.author_id }, data: { karma: { decrement: vote.value } } });
        await tx.reddit_votes.deleteMany({ where: { comment_id: comment.id } });
        await tx.reddit_comments.update({ where: { id: comment.id }, data: { text: null, deleted: true, author_id: null, score: 0, deleted_at: timestamp, updated_at: timestamp } });
      }
      await tx.reddit_reports.deleteMany({ where: { post_id: postId, outcome: null, ...(keepReportId === undefined ? {} : { id: { not: keepReportId } }) } });
      await tx.reddit_posts.update({ where: { id: postId }, data: { deleted_at: timestamp, updated_at: timestamp, score: 0, comment_count: 0 } });
    });
  }

  export async function postErase(actor: IAuthPayload, id: string): Promise<void> {
    const row = await postRow(id);
    if (row.author.id !== actor.id) throw ErrorUtil.forbidden("Only the author may delete this post.");
    await deletePostContent(id, now());
  }

  async function feed(input: IRedditPost.IRequest, communityId?: string, userId?: string): Promise<IPage<IRedditPost.ISummary>> {
    const state = pageInput(input, `feed:${communityId ?? "popular"}:${userId ?? "public"}`);
    const { current, limit } = state;
    const sort = input.sort ?? "hot";
    const range = input.range ?? "all";
    if (sort === "top" && ["today", "week", "month", "year", "all"].includes(range) === false) throw ErrorUtil.badRequest("The top-feed range is invalid.");
    if (sort !== "top" && input.range !== undefined && input.range !== null) throw ErrorUtil.badRequest("A top-feed range requires top sorting.");
    if (["hot", "new", "top", "controversial"].includes(sort) === false) throw ErrorUtil.badRequest("The feed sort is invalid.");
    const where = { deleted_at: null, ...(communityId === undefined ? {} : { community_id: communityId }), ...(userId === undefined ? {} : { community: { subscriptions: { some: { user_id: userId, active: true } } } }) };
    const rows = await MyGlobal.prisma.reddit_posts.findMany({ where: { ...where, created_at: { lte: new Date(state.snapshot) } }, include: { author: { include: { profile: true } }, community: true, votes: true } });
    const snapshot = state.snapshot;
    const cutoff = range === "today" ? 24 : range === "week" ? 24 * 7 : range === "month" ? 24 * 30 : range === "year" ? 24 * 365 : undefined;
    const ranked = rows.filter((row) => sort !== "top" || cutoff === undefined || snapshot - row.created_at.getTime() <= cutoff * 60 * 60 * 1000).sort((left, right) => {
      const leftVotes = left.votes.reduce((total, vote) => total + (vote.value === 1 ? 1 : 0), 0);
      const rightVotes = right.votes.reduce((total, vote) => total + (vote.value === 1 ? 1 : 0), 0);
      const leftTotal = left.votes.length;
      const rightTotal = right.votes.length;
      const leftRank = sort === "hot" ? Math.log10(Math.max(left.score, 1)) - (snapshot - left.created_at.getTime()) / 3600000 / 12.5 : sort === "controversial" ? leftTotal / (Math.abs(left.score) + 1) : 0;
      const rightRank = sort === "hot" ? Math.log10(Math.max(right.score, 1)) - (snapshot - right.created_at.getTime()) / 3600000 / 12.5 : sort === "controversial" ? rightTotal / (Math.abs(right.score) + 1) : 0;
      if (sort === "top" && left.score !== right.score) return right.score - left.score;
      if (sort === "new" || sort === "hot" && leftRank === rightRank) {
        if (left.created_at.getTime() !== right.created_at.getTime()) return right.created_at.getTime() - left.created_at.getTime();
      } else if (leftRank !== rightRank) return rightRank - leftRank;
      if (sort === "controversial" && leftTotal !== rightTotal) return rightTotal - leftTotal;
      if (sort === "controversial" && leftVotes !== rightVotes) return rightVotes - leftVotes;
      return right.id.localeCompare(left.id);
    });
    const owner = `feed:${communityId ?? "popular"}:${userId ?? "public"}`;
    const byId = new Map(ranked.map((row) => [row.id, row]));
    const ordered: PostRow[] = state.items === undefined ? ranked : state.items.map((id) => byId.get(id) as PostRow | undefined).filter((row): row is PostRow => row !== undefined);
    const selected: PostRow[] = state.items === undefined ? ordered.slice((current - 1) * limit, current * limit) : state.items.slice((current - 1) * limit, current * limit).map((id) => byId.get(id) as PostRow | undefined).filter((row): row is PostRow => row !== undefined);
    return page(await Promise.all(selected.map(postSummary)), ordered.length, input, owner, state.items ?? ordered.map((row) => row.id));
  }

  export async function feedHome(actor: IAuthPayload, input: IRedditPost.IRequest): Promise<IPage<IRedditPost.ISummary>> { return feed(input, undefined, actor.id); }
  export async function feedPopular(input: IRedditPost.IRequest): Promise<IPage<IRedditPost.ISummary>> { return feed(input); }
  export async function feedCommunity(communityId: string, input: IRedditPost.IRequest): Promise<IPage<IRedditPost.ISummary>> { if (await MyGlobal.prisma.reddit_communities.findUnique({ where: { id: communityId } }) === null) throw ErrorUtil.notFound("The community was not found."); return feed(input, communityId); }

  interface CommentRow {
    id: string; author_id: string | null; post_id: string; parent_id: string | null; text: string | null; score: number; deleted: boolean; created_at: Date;
    author: UserWithProfile | null; replies: CommentRow[]; votes?: Array<{ value: number }>;
  }

  function commentOutput(row: CommentRow): IRedditComment {
    return { id: row.id, author: row.deleted || row.author === null ? null : summary(row.author), text: row.deleted ? null : row.text, deleted: row.deleted, score: row.score, createdAt: row.created_at.toISOString(), replies: row.replies.map(commentOutput) };
  }

  async function commentWrite(actor: IAuthPayload, postId: string, parentId: string | null, text: string): Promise<IRedditComment> {
    const post = await postRow(postId);
    if (post.community.status !== "active") throw ErrorUtil.gone("Archived communities are read-only.");
    const content = textValue(text, "Comment text");
    const ban = await MyGlobal.prisma.reddit_bans.findUnique({ where: { community_id_user_id: { community_id: post.community.id, user_id: actor.id } } });
    if (ban?.active === true) throw ErrorUtil.forbidden("Banned users cannot comment.");
    if (parentId !== null) { const parent = await MyGlobal.prisma.reddit_comments.findUnique({ where: { id: parentId } }); if (parent === null || parent.post_id !== postId || parent.deleted) throw ErrorUtil.badRequest("The reply parent is unavailable."); }
    const created = now();
    const row = await MyGlobal.prisma.reddit_comments.create({ data: { id: uuid(), author_id: actor.id, post_id: postId, parent_id: parentId, text: content, score: 0, deleted: false, created_at: created, updated_at: created, deleted_at: null } });
    await MyGlobal.prisma.reddit_posts.update({ where: { id: postId }, data: { comment_count: { increment: 1 } } });
    return { id: row.id, author: summary(await userWithProfile(actor.id)), text: row.text, deleted: false, score: 0, createdAt: created.toISOString(), replies: [] };
  }

  export async function commentCreate(actor: IAuthPayload, postId: string, input: IRedditComment.ICreate): Promise<IRedditComment> { return commentWrite(actor, postId, null, input.text); }
  export async function commentReply(actor: IAuthPayload, parentId: string, input: IRedditComment.IReply): Promise<IRedditComment> { const parent = await MyGlobal.prisma.reddit_comments.findUnique({ where: { id: parentId } }); if (parent === null) throw ErrorUtil.notFound("The comment was not found."); return commentWrite(actor, parent.post_id, parentId, input.text); }
  export async function commentIndex(postId: string, input: IRedditComment.IRequest): Promise<IPage<IRedditComment>> {
    await postRow(postId);
    const owner = `comments:${postId}`;
    const { current, limit } = pageInput(input, owner);
    const snapshot = pageInput(input, owner).snapshot;
    const rows = await MyGlobal.prisma.reddit_comments.findMany({ where: { post_id: postId, created_at: { lte: new Date(snapshot) } }, include: { author: { include: { profile: true } }, votes: true }, orderBy: { created_at: "asc" } });
    const nodes = rows.map((row): CommentRow => ({ ...row, replies: [] }));
    const byId = new Map(nodes.map((node) => [node.id, node]));
    for (const node of nodes) if (node.parent_id !== null) byId.get(node.parent_id)?.replies.push(node);
    const sort = input.sort ?? "best";
    if (["best", "new", "controversial"].includes(sort) === false) throw ErrorUtil.badRequest("The comment sort is invalid.");
    const compare = (left: CommentRow, right: CommentRow): number => {
      const leftVotes = left.votes?.length ?? 0;
      const rightVotes = right.votes?.length ?? 0;
      const leftRank = sort === "controversial" ? leftVotes / (Math.abs(left.score) + 1) : left.score;
      const rightRank = sort === "controversial" ? rightVotes / (Math.abs(right.score) + 1) : right.score;
      if (sort === "new" && left.created_at.getTime() !== right.created_at.getTime()) return right.created_at.getTime() - left.created_at.getTime();
      if (sort !== "new" && leftRank !== rightRank) return rightRank - leftRank;
      if (sort === "controversial" && leftVotes !== rightVotes) return rightVotes - leftVotes;
      if (left.created_at.getTime() !== right.created_at.getTime()) return left.created_at.getTime() - right.created_at.getTime();
      return right.id.localeCompare(left.id);
    };
    const order = (items: CommentRow[]): void => { items.sort(compare); for (const item of items) order(item.replies); };
    const roots = nodes.filter((node) => node.parent_id === null);
    order(roots);
    const visible = (node: CommentRow): CommentRow | null => {
      node.replies = node.replies.map(visible).filter((child): child is CommentRow => child !== null);
      return node.deleted && node.replies.length === 0 ? null : node;
    };
    const visibleRoots = roots.map(visible).filter((root): root is CommentRow => root !== null);
    return page(visibleRoots.slice((current - 1) * limit, current * limit).map(commentOutput), visibleRoots.length, input, owner);
  }

  async function deleteCommentContent(id: string, timestamp: Date, keepReportId?: string): Promise<void> {
    const row = await MyGlobal.prisma.reddit_comments.findUnique({ where: { id }, include: { post: { include: { community: true } }, votes: true } });
    if (row === null || row.deleted) throw ErrorUtil.notFound("The comment was not found.");
    if (row.post.community.status !== "active") throw ErrorUtil.gone("Archived communities are read-only.");
    await MyGlobal.prisma.$transaction(async (tx) => {
      if (row.author_id !== null) for (const vote of row.votes) await tx.reddit_users.update({ where: { id: row.author_id }, data: { karma: { decrement: vote.value } } });
      await tx.reddit_votes.deleteMany({ where: { comment_id: id } });
      await tx.reddit_reports.deleteMany({ where: { comment_id: id, outcome: null, ...(keepReportId === undefined ? {} : { id: { not: keepReportId } }) } });
      await tx.reddit_comments.update({ where: { id }, data: { text: null, deleted: true, author_id: null, score: 0, deleted_at: timestamp, updated_at: timestamp } });
      await tx.reddit_posts.update({ where: { id: row.post_id }, data: { comment_count: { decrement: 1 } } });
    });
  }

  export async function commentUpdate(actor: IAuthPayload, id: string, input: IRedditComment.IUpdate): Promise<IRedditComment> { const row = await MyGlobal.prisma.reddit_comments.findUnique({ where: { id }, include: { post: { include: { community: true } } } }); if (row === null || row.deleted) throw ErrorUtil.notFound("The comment was not found."); if (row.post.community.status !== "active") throw ErrorUtil.gone("Archived communities are read-only."); if (row.author_id !== actor.id) throw ErrorUtil.forbidden("Only the author may edit this comment."); await MyGlobal.prisma.reddit_comments.update({ where: { id }, data: { text: textValue(input.text, "Comment text"), updated_at: now() } }); const result = await commentIndex(row.post_id, {}); const updated = result.data.find((item) => item.id === id); if (updated === undefined) throw ErrorUtil.internal("The updated comment could not be read."); return updated; }
  export async function commentErase(actor: IAuthPayload, id: string): Promise<void> { const row = await MyGlobal.prisma.reddit_comments.findUnique({ where: { id } }); if (row === null || row.deleted) throw ErrorUtil.notFound("The comment was not found."); if (row.author_id !== actor.id) throw ErrorUtil.forbidden("Only the author may delete this comment."); await deleteCommentContent(id, now()); }

  async function vote(actor: IAuthPayload, target: { postId?: string; commentId?: string }, value: -1 | 1): Promise<IRedditVote> {
    const authorId = target.postId === undefined
      ? (await MyGlobal.prisma.reddit_comments.findUnique({ where: { id: target.commentId }, include: { post: { include: { community: true } } } }).then((row) => {
        if (row === null || row.deleted) throw ErrorUtil.notFound("The comment was not found.");
        if (row.post.community.status !== "active") throw ErrorUtil.gone("Archived communities are read-only.");
        return row.author_id;
      }))
      : (await postRow(target.postId)).author.id;
    if (authorId === null) throw ErrorUtil.notFound("The content author was not found.");
    const where = target.postId === undefined ? { user_id: actor.id, comment_id: target.commentId } : { user_id: actor.id, post_id: target.postId };
    const existing = await MyGlobal.prisma.reddit_votes.findFirst({ where });
    if (existing !== null && existing.value === value) return { id: existing.id, value: value, createdAt: existing.created_at.toISOString() };
    const delta = existing === null ? value : value - existing.value;
    const timestamp = now();
    const row = await MyGlobal.prisma.$transaction(async (tx) => {
      const next = existing === null
        ? await tx.reddit_votes.create({ data: { id: uuid(), user_id: actor.id, post_id: target.postId ?? null, comment_id: target.commentId ?? null, value, created_at: timestamp } })
        : await tx.reddit_votes.update({ where: { id: existing.id }, data: { value, created_at: timestamp } });
      if (target.postId !== undefined) await tx.reddit_posts.update({ where: { id: target.postId }, data: { score: { increment: delta } } });
      else await tx.reddit_comments.update({ where: { id: target.commentId }, data: { score: { increment: delta } } });
      await tx.reddit_users.update({ where: { id: authorId }, data: { karma: { increment: delta } } });
      return next;
    });
    return { id: row.id, value: row.value === 1 ? 1 : -1, createdAt: row.created_at.toISOString() };
  }
  export async function votePost(actor: IAuthPayload, postId: string, input: IRedditVote.IRequest): Promise<IRedditVote> { return vote(actor, { postId }, input.value); }
  export async function voteComment(actor: IAuthPayload, commentId: string, input: IRedditVote.IRequest): Promise<IRedditVote> { return vote(actor, { commentId }, input.value); }
  export async function voteErasePost(actor: IAuthPayload, postId: string): Promise<void> { const post = await postRow(postId); if (post.community.status !== "active") throw ErrorUtil.gone("Archived communities are read-only."); const row = await MyGlobal.prisma.reddit_votes.findFirst({ where: { user_id: actor.id, post_id: postId } }); if (row !== null) await MyGlobal.prisma.$transaction([MyGlobal.prisma.reddit_votes.delete({ where: { id: row.id } }), MyGlobal.prisma.reddit_posts.update({ where: { id: postId }, data: { score: { decrement: row.value } } }), MyGlobal.prisma.reddit_users.update({ where: { id: post.author.id }, data: { karma: { decrement: row.value } } })]); }
  export async function voteEraseComment(actor: IAuthPayload, commentId: string): Promise<void> { const comment = await MyGlobal.prisma.reddit_comments.findUnique({ where: { id: commentId }, include: { post: { include: { community: true } } } }); if (comment === null || comment.deleted) throw ErrorUtil.notFound("The comment was not found."); if (comment.post.community.status !== "active") throw ErrorUtil.gone("Archived communities are read-only."); const row = await MyGlobal.prisma.reddit_votes.findFirst({ where: { user_id: actor.id, comment_id: commentId } }); if (row !== null) await MyGlobal.prisma.$transaction([MyGlobal.prisma.reddit_votes.delete({ where: { id: row.id } }), MyGlobal.prisma.reddit_comments.update({ where: { id: commentId }, data: { score: { decrement: row.value } } }), MyGlobal.prisma.reddit_users.update({ where: { id: comment.author_id ?? actor.id }, data: { karma: { decrement: row.value } } })]); }

  async function moderate(communityId: string, actorId: string): Promise<{ id: string; owner_id: string | null; status: string }> {
    const community = await MyGlobal.prisma.reddit_communities.findUnique({ where: { id: communityId } });
    if (community === null) throw ErrorUtil.notFound("The community was not found.");
    if (community.status !== "active") throw ErrorUtil.gone("Archived communities are read-only.");
    if (community.owner_id !== actorId && await MyGlobal.prisma.reddit_moderator_assignments.findUnique({ where: { user_id_community_id: { user_id: actorId, community_id: communityId } } }).then((assignment) => assignment?.active !== true)) throw ErrorUtil.forbidden("Moderation authority is required.");
    return community;
  }

  async function assignmentOutput(row: { id: string; active: boolean; started_at: Date; user: UserWithProfile }): Promise<IRedditModeratorAssignment> {
    return { id: row.id, user: summary(row.user), active: row.active, startedAt: row.started_at.toISOString() };
  }

  export async function moderatorAppoint(actor: IAuthPayload, communityId: string, userId: string): Promise<IRedditModeratorAssignment> {
    const community = await moderate(communityId, actor.id);
    const target = await MyGlobal.prisma.reddit_users.findUnique({ where: { id: userId }, include: { profile: true } });
    if (target === null || target.deleted_at !== null) throw ErrorUtil.notFound("The moderator account was not found.");
    const existing = await MyGlobal.prisma.reddit_moderator_assignments.findUnique({ where: { user_id_community_id: { user_id: userId, community_id: communityId } }, include: { user: { include: { profile: true } } } });
    const started = now();
    const row = existing === null ? await MyGlobal.prisma.reddit_moderator_assignments.create({ data: { id: uuid(), user_id: userId, community_id: community.id, active: true, started_at: started, revoked_at: null, created_at: started }, include: { user: { include: { profile: true } } } }) : await MyGlobal.prisma.reddit_moderator_assignments.update({ where: { id: existing.id }, data: { active: true, revoked_at: null, started_at: existing.active ? existing.started_at : started }, include: { user: { include: { profile: true } } } });
    return assignmentOutput(row);
  }

  export async function moderatorRemove(actor: IAuthPayload, communityId: string, userId: string): Promise<void> {
    const community = await moderate(communityId, actor.id);
    if (community.owner_id !== actor.id) throw ErrorUtil.forbidden("Only the owner may remove moderators.");
    if (userId === community.owner_id) throw ErrorUtil.forbidden("The owner assignment is protected.");
    await MyGlobal.prisma.reddit_moderator_assignments.updateMany({ where: { user_id: userId, community_id: communityId, active: true }, data: { active: false, revoked_at: now() } });
  }

  async function banOutput(row: { id: string; activated_at: Date; user: UserWithProfile; moderator: UserWithProfile }): Promise<IRedditBan> { return { id: row.id, user: summary(row.user), moderator: summary(row.moderator), activatedAt: row.activated_at.toISOString() }; }

  export async function ban(actor: IAuthPayload, communityId: string, userId: string): Promise<IRedditBan> {
    const community = await moderate(communityId, actor.id);
    if (userId === community.owner_id) throw ErrorUtil.forbidden("The community owner cannot be banned.");
    const target = await MyGlobal.prisma.reddit_users.findUnique({ where: { id: userId } });
    if (target === null || target.deleted_at !== null) throw ErrorUtil.notFound("The ban target was not found.");
    const existing = await MyGlobal.prisma.reddit_bans.findUnique({ where: { community_id_user_id: { community_id: communityId, user_id: userId } } });
    if (existing?.active === true) {
      const current = await MyGlobal.prisma.reddit_bans.findUnique({ where: { id: existing.id }, include: { user: { include: { profile: true } }, moderator: { include: { profile: true } } } });
      if (current === null) throw ErrorUtil.internal("The active ban could not be read.");
      return banOutput(current);
    }
    const row = existing === null ? await MyGlobal.prisma.reddit_bans.create({ data: { id: uuid(), community_id: communityId, user_id: userId, moderator_id: actor.id, active: true, activated_at: now(), ended_at: null, created_at: now() }, include: { user: { include: { profile: true } }, moderator: { include: { profile: true } } } }) : await MyGlobal.prisma.reddit_bans.update({ where: { id: existing.id }, data: { active: true, moderator_id: actor.id, activated_at: now(), ended_at: null }, include: { user: { include: { profile: true } }, moderator: { include: { profile: true } } } });
    return banOutput(row);
  }
  export async function unban(actor: IAuthPayload, communityId: string, userId: string): Promise<void> { await moderate(communityId, actor.id); const target = await MyGlobal.prisma.reddit_users.findUnique({ where: { id: userId } }); if (target === null || target.deleted_at !== null) throw ErrorUtil.notFound("The ban target was not found."); await MyGlobal.prisma.reddit_bans.updateMany({ where: { community_id: communityId, user_id: userId, active: true }, data: { active: false, ended_at: now() } }); }
  export async function bans(actor: IAuthPayload, communityId: string, input: IPage.IRequest): Promise<IPage<IRedditBan>> { await moderate(communityId, actor.id); const owner = `bans:${communityId}`; const { current, limit } = pageInput(input, owner); const where = { community_id: communityId, active: true, activated_at: { lte: new Date(pageInput(input, owner).snapshot) } }; const [rows, total] = await Promise.all([MyGlobal.prisma.reddit_bans.findMany({ where, include: { user: { include: { profile: true } }, moderator: { include: { profile: true } } }, orderBy: [{ activated_at: "desc" }, { id: "desc" }], skip: (current - 1) * limit, take: limit }), MyGlobal.prisma.reddit_bans.count({ where })]); return page(await Promise.all(rows.map(banOutput)), total, input, owner); }

  async function reportOutput(row: { id: string; reason: string; outcome: string | null; created_at: Date; reporter: UserWithProfile | null; post: PostRow | null; comment: { id: string; text: string | null; deleted: boolean; score: number; created_at: Date; author: UserWithProfile | null } | null }): Promise<IRedditReport> {
    return { id: row.id, targetType: row.post === null ? "comment" : "post", post: row.post === null ? null : await postOutput(row.post), comment: row.comment === null ? null : { id: row.comment.id, author: row.comment.deleted || row.comment.author === null ? null : summary(row.comment.author), text: row.comment.deleted ? null : row.comment.text, deleted: row.comment.deleted, score: row.comment.score, createdAt: row.comment.created_at.toISOString(), replies: [] }, reporter: row.reporter === null ? null : summary(row.reporter), reason: row.reason, outcome: row.outcome === null ? null : row.outcome === "approved" ? "approved" : "dismissed", createdAt: row.created_at.toISOString() };
  }

  export async function reportCreate(actor: IAuthPayload, communityId: string, input: IRedditReport.ICreate): Promise<IRedditReport> {
    const community = await MyGlobal.prisma.reddit_communities.findUnique({ where: { id: communityId } });
    if (community === null) throw ErrorUtil.notFound("The community was not found.");
    if (community.status !== "active") throw ErrorUtil.gone("Archived communities are read-only.");
    if (input.reason.trim().length < 1 || input.reason.trim().length > 2000) throw ErrorUtil.badRequest("The report reason must contain 1 through 2000 visible characters.");
    if (input.targetType === "post") {
      const target = await MyGlobal.prisma.reddit_posts.findUnique({ where: { id: input.targetId }, include: { community: true } });
      if (target === null || target.deleted_at !== null || target.community.id !== communityId) throw ErrorUtil.notFound("The report target was not found.");
    } else {
      const target = await MyGlobal.prisma.reddit_comments.findUnique({ where: { id: input.targetId }, include: { post: { include: { community: true } } } });
      if (target === null || target.deleted || target.post.deleted_at !== null || target.post.community.id !== communityId) throw ErrorUtil.notFound("The report target was not found.");
    }
    const duplicate = await MyGlobal.prisma.reddit_reports.findFirst({ where: { reporter_id: actor.id, community_id: communityId, ...(input.targetType === "post" ? { post_id: input.targetId } : { comment_id: input.targetId }), outcome: null } });
    if (duplicate !== null) throw ErrorUtil.conflict("An unresolved report already exists for this target.");
    const row = await MyGlobal.prisma.reddit_reports.create({ data: { id: uuid(), reporter_id: actor.id, community_id: communityId, post_id: input.targetType === "post" ? input.targetId : null, comment_id: input.targetType === "comment" ? input.targetId : null, reason: input.reason.trim(), outcome: null, moderator_id: null, decided_at: null, created_at: now() }, include: { reporter: { include: { profile: true } }, post: { include: { author: { include: { profile: true } }, community: true } }, comment: { include: { author: { include: { profile: true } } } } } });
    return reportOutput(row);
  }

  export async function reports(actor: IAuthPayload, communityId: string, input: IPage.IRequest): Promise<IPage<IRedditReport>> { await moderate(communityId, actor.id); const owner = `reports:${communityId}`; const { current, limit } = pageInput(input, owner); const where = { community_id: communityId, outcome: null, created_at: { lte: new Date(pageInput(input, owner).snapshot) } }; const [rows, total] = await Promise.all([MyGlobal.prisma.reddit_reports.findMany({ where, include: { reporter: { include: { profile: true } }, post: { include: { author: { include: { profile: true } }, community: true } }, comment: { include: { author: { include: { profile: true } } } } }, orderBy: [{ created_at: "desc" }, { id: "desc" }], skip: (current - 1) * limit, take: limit }), MyGlobal.prisma.reddit_reports.count({ where })]); return page(await Promise.all(rows.map(reportOutput)), total, input, owner); }

  export async function history(actor: IAuthPayload, communityId: string, input: IPage.IRequest): Promise<IPage<IRedditModerationAction>> { await moderate(communityId, actor.id); const owner = `history:${communityId}`; const { current, limit } = pageInput(input, owner); const where = { community_id: communityId, decided_at: { lte: new Date(pageInput(input, owner).snapshot) } }; const [rows, total] = await Promise.all([MyGlobal.prisma.reddit_moderation_actions.findMany({ where, include: { moderator: { include: { profile: true } } }, orderBy: [{ decided_at: "desc" }, { id: "desc" }], skip: (current - 1) * limit, take: limit }), MyGlobal.prisma.reddit_moderation_actions.count({ where })]); const data = await Promise.all(rows.map(async (row) => ({ id: row.id, outcome: row.outcome === "approved" ? "approved" as const : "dismissed" as const, targetType: row.target_type === "post" ? "post" as const : "comment" as const, reporter: null, moderator: row.moderator === null ? null : summary(row.moderator), reason: row.reason, decidedAt: row.decided_at.toISOString() }))); return page(data, total, input, owner); }

  async function resolveReport(actor: IAuthPayload, communityId: string, reportId: string, outcome: "approved" | "dismissed"): Promise<void> {
    await moderate(communityId, actor.id);
    const report = await MyGlobal.prisma.reddit_reports.findUnique({ where: { id: reportId } });
    if (report === null || report.community_id !== communityId || report.outcome !== null) throw ErrorUtil.conflict("The report is no longer unresolved.");
    if (report.post_id !== null) await postRow(report.post_id);
    if (report.comment_id !== null) {
      const comment = await MyGlobal.prisma.reddit_comments.findUnique({ where: { id: report.comment_id } });
      if (comment === null || comment.deleted) throw ErrorUtil.conflict("The reported target is no longer available.");
    }
    const decided = now();
    if (outcome === "approved" && report.post_id !== null) await deletePostContent(report.post_id, decided, report.id);
    if (outcome === "approved" && report.comment_id !== null) await deleteCommentContent(report.comment_id, decided, report.id);
    await MyGlobal.prisma.$transaction(async (tx) => {
      await tx.reddit_reports.update({ where: { id: report.id }, data: { outcome, moderator_id: actor.id, decided_at: decided } });
      await tx.reddit_moderation_actions.create({ data: { id: uuid(), community_id: communityId, moderator_id: actor.id, reporter_id: report.reporter_id, outcome, target_type: report.post_id === null ? "comment" : "post", target_id: report.post_id ?? report.comment_id ?? "", target_description: null, reason: report.reason, decided_at: decided, created_at: decided } });
    });
  }
  export async function reportApprove(actor: IAuthPayload, communityId: string, reportId: string): Promise<void> { return resolveReport(actor, communityId, reportId, "approved"); }
  export async function reportDismiss(actor: IAuthPayload, communityId: string, reportId: string): Promise<void> { return resolveReport(actor, communityId, reportId, "dismissed"); }

  export async function moderationDeletePost(actor: IAuthPayload, communityId: string, postId: string): Promise<void> { await moderate(communityId, actor.id); const row = await postRow(postId); if (row.community.id !== communityId) throw ErrorUtil.notFound("The post was not found in this community."); await deletePostContent(postId, now()); }
  export async function moderationDeleteComment(actor: IAuthPayload, communityId: string, commentId: string): Promise<void> { await moderate(communityId, actor.id); const row = await MyGlobal.prisma.reddit_comments.findUnique({ where: { id: commentId }, include: { post: true } }); if (row === null || row.post.community_id !== communityId) throw ErrorUtil.notFound("The comment was not found in this community."); await deleteCommentContent(commentId, now()); }
}
