import crypto from "node:crypto";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { IPage, UUID, IAuth, IAuthorized, IBan, IBanHistory, IComment, ICommunity, IPost, IProfile, IReport, IReportHistory, ISubscription, IUser, IVote } from "@benchmark/reddit-api";
import { MyConfiguration } from "../MyConfiguration";
import { ErrorUtil } from "../utils/ErrorUtil";

interface StateStatement { get(...parameters: unknown[]): unknown; all(...parameters: unknown[]): readonly unknown[]; run(...parameters: unknown[]): unknown; }
interface StateDatabase { exec(sql: string): void; prepare(sql: string): StateStatement; }
// better-sqlite3 ships without declarations in this workspace; keep the narrow surface local.
const Database = require("better-sqlite3") as new (filename: string) => StateDatabase;

type Vote = "up" | "down";
interface UserRec { id: UUID; email: string; username: string; password: string; displayName: string; bio: string; avatar: string | null; karma: number; deleted: boolean; createdAt: Date; }
interface SessionRec { userId: UUID; refresh: string; createdAt: number; accessExpires: number; refreshExpires: number; }
interface CommunityRec { id: UUID; name: string; normalized: string; description: string; icon: string | null; status: "active" | "archived"; ownerId: UUID | null; createdAt: Date; subscribers: Map<UUID, Date>; moderators: Map<UUID, Date>; bans: Map<UUID, Date>; }
interface PostRec { id: UUID; title: string; type: IPost["type"]; text: string | null; url: string | null; image: string | null; thumbnail: string | null; authorId: UUID; communityId: UUID; createdAt: Date; deleted: boolean; votes: Map<UUID, Vote>; }
interface CommentRec { id: UUID; text: string; authorId: UUID; postId: UUID; parentId: UUID | null; createdAt: Date; deleted: boolean; votes: Map<UUID, Vote>; }
interface ReportRec { id: UUID; targetId: UUID; targetType: "post" | "comment"; reporterId: UUID; communityId: UUID; reason: string; createdAt: Date; status: IReport["status"]; moderatorId: UUID | null; resolvedAt: Date | null; }
interface BanHistoryRec { id: UUID; userId: UUID; moderatorId: UUID; communityId: UUID; createdAt: Date; endedAt: Date | null; unbannedBy: UUID | null; }
interface StateSnapshot {
  users: UserRec[];
  sessions: Array<SessionRec & { token: string }>;
  communities: Array<Omit<CommunityRec, "subscribers" | "moderators" | "bans"> & { subscribers: Array<[UUID, string | Date]>; moderators: Array<[UUID, string | Date]>; bans: Array<[UUID, string | Date]> }>;
  posts: Array<Omit<PostRec, "votes"> & { votes: Array<[UUID, Vote]> }>;
  comments: Array<Omit<CommentRec, "votes"> & { votes: Array<[UUID, Vote]> }>;
  reports: ReportRec[];
  recovery: Array<[string, { userId: UUID; proof: string; expires: number }]>;
  banHistory: BanHistoryRec[];
}

const id = (): UUID => crypto.randomUUID() as UUID;
const now = (): Date => new Date();
const hash = (value: string): string => crypto.createHash("sha256").update(value).digest("hex");
const iso = (value: Date): string => value.toISOString();

export class RedditProvider {
  private readonly users = new Map<UUID, UserRec>();
  private readonly sessions = new Map<string, SessionRec>();
  private readonly communities = new Map<UUID, CommunityRec>();
  private readonly posts = new Map<UUID, PostRec>();
  private readonly comments = new Map<UUID, CommentRec>();
  private readonly reports = new Map<UUID, ReportRec>();
  private readonly recovery = new Map<string, { userId: UUID; proof: string; expires: number }>();
  private readonly banHistory: BanHistoryRec[] = [];

  private stateDb?: StateDatabase;

  public constructor() {
    this.load();
  }

  private database(): StateDatabase { if (this.stateDb === undefined) { const filename = path.resolve(MyConfiguration.ROOT, "prisma/db.sqlite"); fs.mkdirSync(path.dirname(filename), { recursive: true }); this.stateDb = new Database(filename); } return this.stateDb; }

  private snapshot(): StateSnapshot {
    return {
      users: [...this.users.values()], sessions: [...this.sessions.entries()].map(([token, value]) => ({ token, ...value })),
      communities: [...this.communities.values()].map((value) => ({ ...value, subscribers: [...value.subscribers.entries()], moderators: [...value.moderators.entries()], bans: [...value.bans.entries()] })),
      posts: [...this.posts.values()].map((value) => ({ ...value, votes: [...value.votes.entries()] })),
      comments: [...this.comments.values()].map((value) => ({ ...value, votes: [...value.votes.entries()] })),
      reports: [...this.reports.values()], recovery: [...this.recovery.entries()], banHistory: this.banHistory,
    };
  }

  private hydrate(raw: StateSnapshot): void {
    this.users.clear(); this.sessions.clear(); this.communities.clear(); this.posts.clear(); this.comments.clear(); this.reports.clear(); this.recovery.clear(); this.banHistory.length = 0;
    for (const value of raw.users ?? []) this.users.set(value.id, { ...value, karma: value.karma ?? 0, createdAt: new Date(value.createdAt) });
    for (const value of raw.sessions ?? []) this.sessions.set(value.token, { userId: value.userId, refresh: value.refresh, createdAt: value.createdAt ?? Date.now(), accessExpires: value.accessExpires ?? Number.MAX_SAFE_INTEGER, refreshExpires: value.refreshExpires ?? Number.MAX_SAFE_INTEGER });
    for (const value of raw.communities ?? []) this.communities.set(value.id, { ...value, createdAt: value.createdAt ? new Date(value.createdAt) : now(), subscribers: new Map(value.subscribers.map(([userId, createdAt]) => [userId, new Date(createdAt)])), moderators: new Map(value.moderators.map(([userId, createdAt]) => [userId, new Date(createdAt)])), bans: new Map(value.bans.map(([userId, createdAt]) => [userId, new Date(createdAt)])) });
    for (const value of raw.posts ?? []) this.posts.set(value.id, { ...value, thumbnail: value.thumbnail ?? value.image ?? null, createdAt: new Date(value.createdAt), votes: new Map(value.votes ?? []) });
    for (const value of raw.comments ?? []) this.comments.set(value.id, { ...value, createdAt: new Date(value.createdAt), votes: new Map(value.votes ?? []) });
    for (const value of raw.reports ?? []) this.reports.set(value.id, { ...value, createdAt: new Date(value.createdAt), resolvedAt: value.resolvedAt ? new Date(value.resolvedAt) : null });
    for (const value of raw.recovery ?? []) this.recovery.set(value[0], value[1]);
    for (const value of raw.banHistory ?? []) this.banHistory.push({ ...value, createdAt: new Date(value.createdAt), endedAt: value.endedAt ? new Date(value.endedAt) : null });
  }

  private load(): void {
    try {
      const db = this.database();
      const users = db.prepare("SELECT id,email,username,password,display_name,bio,avatar,karma,deleted_at,created_at FROM users").all() as Array<Record<string, unknown>>;
      for (const row of users) this.users.set(String(row.id) as UUID, { id: String(row.id) as UUID, email: String(row.email), username: String(row.username), password: String(row.password), displayName: String(row.display_name), bio: String(row.bio), avatar: typeof row.avatar === "string" ? row.avatar : null, karma: Number(row.karma ?? 0), deleted: row.deleted_at !== null, createdAt: new Date(String(row.created_at)) });
      const sessions = db.prepare("SELECT token,user_id,refresh_token,created_at,access_expires_at,refresh_expires_at FROM sessions").all() as Array<Record<string, unknown>>;
      for (const row of sessions) this.sessions.set(String(row.token), { userId: String(row.user_id) as UUID, refresh: String(row.refresh_token), createdAt: new Date(String(row.created_at)).getTime(), accessExpires: new Date(String(row.access_expires_at)).getTime(), refreshExpires: new Date(String(row.refresh_expires_at)).getTime() });
      const communities = db.prepare("SELECT id,name,normalized_name,description,icon,status,owner_id,created_at FROM communities").all() as Array<Record<string, unknown>>;
      for (const row of communities) this.communities.set(String(row.id) as UUID, { id: String(row.id) as UUID, name: String(row.name), normalized: String(row.normalized_name), description: String(row.description), icon: typeof row.icon === "string" ? row.icon : null, status: String(row.status) as CommunityRec["status"], ownerId: row.owner_id ? String(row.owner_id) as UUID : null, createdAt: new Date(String(row.created_at)), subscribers: new Map(), moderators: new Map(), bans: new Map() });
      const subscriptions = db.prepare("SELECT user_id,community_id,created_at FROM subscriptions").all() as Array<Record<string, unknown>>;
      for (const row of subscriptions) this.communities.get(String(row.community_id) as UUID)?.subscribers.set(String(row.user_id) as UUID, new Date(String(row.created_at)));
      const moderators = db.prepare("SELECT user_id,community_id,created_at FROM moderators").all() as Array<Record<string, unknown>>;
      for (const row of moderators) this.communities.get(String(row.community_id) as UUID)?.moderators.set(String(row.user_id) as UUID, new Date(String(row.created_at)));
      const bans = db.prepare("SELECT id,user_id,community_id,moderator_id,ended_at,unbanned_by,created_at FROM bans").all() as Array<Record<string, unknown>>;
      for (const row of bans) { const entry: BanHistoryRec = { id: String(row.id) as UUID, userId: String(row.user_id) as UUID, moderatorId: String(row.moderator_id) as UUID, communityId: String(row.community_id) as UUID, createdAt: new Date(String(row.created_at)), endedAt: row.ended_at ? new Date(String(row.ended_at)) : null, unbannedBy: row.unbanned_by ? String(row.unbanned_by) as UUID : null }; this.banHistory.push(entry); if (entry.endedAt === null) this.communities.get(entry.communityId)?.bans.set(entry.userId, entry.createdAt); }
      const posts = db.prepare("SELECT id,title,type,text,url,image,thumbnail,author_id,community_id,created_at,deleted_at FROM posts").all() as Array<Record<string, unknown>>;
      for (const row of posts) this.posts.set(String(row.id) as UUID, { id: String(row.id) as UUID, title: String(row.title), type: String(row.type) as IPost["type"], text: typeof row.text === "string" ? row.text : null, url: typeof row.url === "string" ? row.url : null, image: typeof row.image === "string" ? row.image : null, thumbnail: typeof row.thumbnail === "string" ? row.thumbnail : null, authorId: String(row.author_id) as UUID, communityId: String(row.community_id) as UUID, createdAt: new Date(String(row.created_at)), deleted: row.deleted_at !== null, votes: new Map() });
      const comments = db.prepare("SELECT id,text,author_id,post_id,parent_id,created_at,deleted_at FROM comments").all() as Array<Record<string, unknown>>;
      for (const row of comments) this.comments.set(String(row.id) as UUID, { id: String(row.id) as UUID, text: String(row.text), authorId: String(row.author_id) as UUID, postId: String(row.post_id) as UUID, parentId: row.parent_id ? String(row.parent_id) as UUID : null, createdAt: new Date(String(row.created_at)), deleted: row.deleted_at !== null, votes: new Map() });
      const votes = db.prepare("SELECT v.value,p.user_id,p.post_id,NULL AS comment_id FROM votes v JOIN post_votes p ON p.vote_id = v.id UNION ALL SELECT v.value,c.user_id,NULL AS post_id,c.comment_id FROM votes v JOIN comment_votes c ON c.vote_id = v.id").all() as Array<Record<string, unknown>>;
      for (const row of votes) { const target = row.post_id ? this.posts.get(String(row.post_id) as UUID) : this.comments.get(String(row.comment_id) as UUID); target?.votes.set(String(row.user_id) as UUID, String(row.value) as Vote); }
      const reports = db.prepare("SELECT r.id,r.reporter_id,r.community_id,p.post_id,NULL AS comment_id,r.reason,r.status,r.created_at,r.moderator_id,r.resolved_at FROM reports r JOIN report_posts p ON p.report_id = r.id UNION ALL SELECT r.id,r.reporter_id,r.community_id,NULL AS post_id,c.comment_id,r.reason,r.status,r.created_at,r.moderator_id,r.resolved_at FROM reports r JOIN report_comments c ON c.report_id = r.id").all() as Array<Record<string, unknown>>;
      for (const row of reports) this.reports.set(String(row.id) as UUID, { id: String(row.id) as UUID, targetId: String((row.post_id ?? row.comment_id)) as UUID, targetType: row.post_id ? "post" : "comment", reporterId: String(row.reporter_id) as UUID, communityId: String(row.community_id) as UUID, reason: String(row.reason), createdAt: new Date(String(row.created_at)), status: String(row.status) as IReport["status"], moderatorId: row.moderator_id ? String(row.moderator_id) as UUID : null, resolvedAt: row.resolved_at ? new Date(String(row.resolved_at)) : null });
      const recovery = db.prepare("SELECT email,user_id,proof,expires_at FROM recovery_proofs WHERE used_at IS NULL").all() as Array<Record<string, unknown>>;
      for (const row of recovery) this.recovery.set(String(row.email), { userId: String(row.user_id) as UUID, proof: String(row.proof), expires: new Date(String(row.expires_at)).getTime() });
    } catch (error) {
      if (!(error instanceof Error) || !/no such table/i.test(error.message)) throw error;
      // An empty or not-yet-created database is a valid first-run state.
    }
  }

  private persist(): void { this.persistNow(); }

  private persistNow(): void {
    const snapshot = this.snapshot();
    this.syncRelational(snapshot);
  }

  /** Mirrors the in-memory transition into the normalized Prisma tables atomically. */
  private syncRelational(snapshot: StateSnapshot): void {
    const db = this.database();
    db.exec("CREATE TABLE IF NOT EXISTS recovery_proofs (id TEXT PRIMARY KEY, email TEXT NOT NULL, user_id TEXT NOT NULL, proof TEXT NOT NULL UNIQUE, expires_at DATETIME NOT NULL, used_at DATETIME)");
    try { db.exec("ALTER TABLE sessions ADD COLUMN access_expires_at DATETIME"); } catch { /* already present */ }
    try { db.exec("ALTER TABLE sessions ADD COLUMN refresh_expires_at DATETIME"); } catch { /* already present */ }
    try { db.exec("ALTER TABLE users ADD COLUMN normalized_email TEXT"); } catch { /* already present */ }
    try { db.exec("ALTER TABLE users ADD COLUMN normalized_username TEXT"); } catch { /* already present */ }
    try { db.exec("ALTER TABLE users ADD COLUMN karma INTEGER NOT NULL DEFAULT 0"); } catch { /* already present */ }
    try { db.exec("ALTER TABLE posts ADD COLUMN thumbnail TEXT"); } catch { /* already present */ }
    db.exec("CREATE UNIQUE INDEX IF NOT EXISTS users_normalized_email_key ON users(normalized_email)");
    db.exec("CREATE UNIQUE INDEX IF NOT EXISTS users_normalized_username_key ON users(normalized_username)");
    db.exec("PRAGMA foreign_keys = OFF; BEGIN");
    try {
      for (const table of ["post_votes", "comment_votes", "votes", "report_posts", "report_comments", "reports", "comments", "posts", "bans", "moderators", "subscriptions", "sessions", "profiles", "communities", "recovery_proofs", "users"]) db.exec(`DELETE FROM ${table}`);
      const userInsert = db.prepare("INSERT INTO users (id,email,normalized_email,username,normalized_username,password,display_name,bio,avatar,karma,deleted_at,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
      for (const value of this.users.values()) userInsert.run(value.id, value.email, value.email.toLowerCase(), value.username, value.username.toLowerCase(), value.password, value.displayName, value.bio, value.avatar, value.karma, value.deleted ? iso(now()) : null, iso(value.createdAt));
      const profileInsert = db.prepare("INSERT INTO profiles (id,user_id) VALUES (?,?)");
      for (const value of this.users.values()) if (!value.deleted) profileInsert.run(value.id, value.id);
      const communityInsert = db.prepare("INSERT INTO communities (id,name,normalized_name,description,icon,status,owner_id,created_at) VALUES (?,?,?,?,?,?,?,?)");
      for (const value of this.communities.values()) communityInsert.run(value.id, value.name, value.normalized, value.description, value.icon, value.status, value.ownerId, iso(value.createdAt ?? now()));
      const subscriptionInsert = db.prepare("INSERT INTO subscriptions (id,user_id,community_id,created_at) VALUES (?,?,?,?)");
      for (const value of this.communities.values()) for (const [userId, createdAt] of value.subscribers) subscriptionInsert.run(id(), userId, value.id, iso(createdAt));
      const moderatorInsert = db.prepare("INSERT INTO moderators (id,user_id,community_id,created_at) VALUES (?,?,?,?)");
      for (const value of this.communities.values()) for (const [userId, createdAt] of value.moderators) moderatorInsert.run(id(), userId, value.id, iso(createdAt));
      const postInsert = db.prepare("INSERT INTO posts (id,title,type,text,url,image,thumbnail,author_id,community_id,created_at,deleted_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
      for (const value of this.posts.values()) postInsert.run(value.id, value.title, value.type, value.text, value.url, value.image, value.thumbnail, value.authorId, value.communityId, iso(value.createdAt), value.deleted ? iso(now()) : null);
      const commentInsert = db.prepare("INSERT INTO comments (id,text,author_id,post_id,parent_id,created_at,deleted_at) VALUES (?,?,?,?,?,?,?)");
      for (const value of this.comments.values()) commentInsert.run(value.id, value.text, value.authorId, value.postId, value.parentId, iso(value.createdAt), value.deleted ? iso(now()) : null);
      const voteInsert = db.prepare("INSERT INTO votes (id,value,created_at) VALUES (?,?,?)");
      const postVoteInsert = db.prepare("INSERT INTO post_votes (vote_id,user_id,post_id) VALUES (?,?,?)");
      const commentVoteInsert = db.prepare("INSERT INTO comment_votes (vote_id,user_id,comment_id) VALUES (?,?,?)");
      for (const value of this.posts.values()) for (const [userId, vote] of value.votes) { const voteId = id(); voteInsert.run(voteId, vote, iso(now())); postVoteInsert.run(voteId, userId, value.id); }
      for (const value of this.comments.values()) for (const [userId, vote] of value.votes) { const voteId = id(); voteInsert.run(voteId, vote, iso(now())); commentVoteInsert.run(voteId, userId, value.id); }
      const banInsert = db.prepare("INSERT INTO bans (id,user_id,community_id,moderator_id,ended_at,unbanned_by,created_at) VALUES (?,?,?,?,?,?,?)");
      for (const value of this.banHistory) banInsert.run(value.id, value.userId, value.communityId, value.moderatorId, value.endedAt ? iso(value.endedAt) : null, value.unbannedBy, iso(value.createdAt));
      const reportInsert = db.prepare("INSERT INTO reports (id,reporter_id,community_id,reason,status,created_at,moderator_id,resolved_at) VALUES (?,?,?,?,?,?,?,?)");
      const reportPostInsert = db.prepare("INSERT INTO report_posts (report_id,post_id) VALUES (?,?)");
      const reportCommentInsert = db.prepare("INSERT INTO report_comments (report_id,comment_id) VALUES (?,?)");
      for (const value of this.reports.values()) { reportInsert.run(value.id, value.reporterId, value.communityId, value.reason, value.status, iso(value.createdAt), value.moderatorId, value.resolvedAt ? iso(value.resolvedAt) : null); if (value.targetType === "post") reportPostInsert.run(value.id, value.targetId); else reportCommentInsert.run(value.id, value.targetId); }
      const sessionInsert = db.prepare("INSERT INTO sessions (id,user_id,token,refresh_token,created_at,access_expires_at,refresh_expires_at) VALUES (?,?,?,?,?,?,?)");
      for (const [token, value] of this.sessions) sessionInsert.run(id(), value.userId, token, value.refresh, iso(new Date(value.createdAt)), iso(new Date(value.accessExpires)), iso(new Date(value.refreshExpires)));
      const proofInsert = db.prepare("INSERT INTO recovery_proofs (id,email,user_id,proof,expires_at,used_at) VALUES (?,?,?,?,?,?)");
      for (const [email, value] of this.recovery) proofInsert.run(id(), email, value.userId, value.proof, iso(new Date(value.expires)), null);
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    } finally {
      db.exec("PRAGMA foreign_keys = ON");
    }
  }

  private user(idValue: UUID): UserRec { const value = this.users.get(idValue); if (!value || value.deleted) throw ErrorUtil.notFound("No such user."); return value; }
  private community(idValue: UUID): CommunityRec { const value = this.communities.get(idValue); if (!value) throw ErrorUtil.notFound("No such community."); return value; }
  private token(header?: string): UserRec { const token = header?.replace(/^Bearer\s+/i, ""); const session = token ? this.sessions.get(token) : undefined; if (!session || session.accessExpires <= Date.now()) { if (token) this.sessions.delete(token); throw ErrorUtil.unauthorized("Authentication is required."); } return this.user(session.userId); }
  private summary(user: UserRec): IUser.ISummary { return { id: user.id, username: user.username, displayName: user.displayName }; }
  private communitySummary(value: CommunityRec): ICommunity.ISummary { return { id: value.id, name: value.name }; }
  private page<T extends object>(data: T[], input?: IPage.IRequest, scopeExtra?: unknown): IPage<T> {
    this.validatePage(input);
    const limit = input?.limit ?? 25;
    const keyOf = (value: T): string => {
      const candidate = value as Record<string, unknown>;
      return candidate.id !== undefined ? String(candidate.id) : JSON.stringify(value);
    };
    const scopeInput = { ...(input ?? {}) } as Record<string, unknown>;
    delete scopeInput.continuation;
    delete scopeInput.page;
    const scope = JSON.stringify({ input: scopeInput, extra: scopeExtra ?? null });
    let ordered = data;
    let snapshotKeys = data.map(keyOf);
    let current = input?.page ?? 1;
    let reset = false;
    if (input?.continuation) {
      try {
        const parsed = JSON.parse(Buffer.from(input.continuation, "base64url").toString()) as { page: number; limit: number; scope: string; keys: string[] };
        if (parsed.limit !== limit || parsed.scope !== scope || parsed.page < 2 || !Array.isArray(parsed.keys)) throw new Error("stale");
        const byKey = new Map(data.map((value) => [keyOf(value), value]));
        snapshotKeys = parsed.keys;
        ordered = parsed.keys.map((key) => byKey.get(key)).filter((value): value is T => value !== undefined);
        current = parsed.page;
      } catch {
        current = 1;
        reset = true;
      }
    }
    const records = ordered.length;
    const pages = Math.max(1, Math.ceil(snapshotKeys.length / limit));
    const byKey = new Map(ordered.map((value) => [keyOf(value), value]));
    const pageData = snapshotKeys.slice((current - 1) * limit, current * limit).map((key) => byKey.get(key)).filter((value): value is T => value !== undefined);
    const next = current < pages ? Buffer.from(JSON.stringify({ page: current + 1, limit, scope, keys: snapshotKeys })).toString("base64url") : null;
    return { data: pageData, pagination: { current, limit, records, pages, next, reset } };
  }
  private score(votes: Map<UUID, Vote>): number { let score = 0; for (const value of votes.values()) score += value === "up" ? 1 : -1; return score; }
  private postSummary(value: PostRec): IPost.ISummary { const author = this.user(value.authorId); const community = this.community(value.communityId); const preview = value.type === "text" ? value.text!.slice(0, 200) : value.type === "link" ? new URL(value.url!).host : value.thumbnail; return { id: value.id, title: value.title, type: value.type, preview, thumbnail: value.thumbnail, author: this.summary(author), community: this.communitySummary(community), score: this.score(value.votes), commentCount: [...this.comments.values()].filter((c) => c.postId === value.id && !c.deleted).length, createdAt: iso(value.createdAt) }; }
  private post(value: PostRec): IPost { return { ...this.postSummary(value), text: value.text, url: value.url, image: value.image, thumbnail: value.thumbnail, deleted: value.deleted }; }
  private commentSummary(value: CommentRec): IComment.ISummary { const author = value.deleted ? null : this.user(value.authorId); return { id: value.id, text: value.deleted ? null : value.text, author: author ? this.summary(author) : null, score: this.score(value.votes), createdAt: iso(value.createdAt), deleted: value.deleted }; }
  private isModerator(userId: UUID, community: CommunityRec): boolean { return community.ownerId === userId || community.moderators.has(userId); }
  private ensureActive(community: CommunityRec): void { if (community.status !== "active") throw ErrorUtil.forbidden("The community is archived."); }
  private ensureModerator(userId: UUID, community: CommunityRec): void { this.ensureActive(community); if (!this.isModerator(userId, community)) throw ErrorUtil.forbidden("Community moderation authority is required."); }
  private ensureTarget(targetId: UUID, targetType: "post" | "comment"): { community: CommunityRec; post?: PostRec; comment?: CommentRec } { if (targetType === "post") { const post = this.posts.get(targetId); if (!post || post.deleted) throw ErrorUtil.notFound("No such post."); return { post, community: this.community(post.communityId) }; } const comment = this.comments.get(targetId); if (!comment || comment.deleted) throw ErrorUtil.notFound("No such comment."); const post = this.posts.get(comment.postId); if (!post || post.deleted) throw ErrorUtil.notFound("No such post."); return { comment, post, community: this.community(post.communityId) }; }
  private makeThumbnail(value: string | null): string | null {
    if (value === null) return null;
    const match = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/i.exec(value.trim());
    if (!match) return value;
    const bytes = Buffer.from(match[2]!, "base64");
    let width = 0;
    let height = 0;
    const kind = match[1]!.toLowerCase();
    if (kind === "png" && bytes.length >= 24) { width = bytes.readUInt32BE(16); height = bytes.readUInt32BE(20); }
    else if (kind === "webp" && bytes.length >= 30 && bytes.subarray(12, 16).toString("ascii") === "VP8X") { width = 1 + bytes.readUIntLE(24, 3); height = 1 + bytes.readUIntLE(27, 3); }
    else if (kind === "jpeg") {
      for (let offset = 2; offset + 9 < bytes.length && bytes[offset] === 0xff; ) {
        const marker = bytes[offset + 1]!;
        const segment = bytes.readUInt16BE(offset + 2);
        if (marker >= 0xc0 && marker <= 0xc3 && segment >= 7) { height = bytes.readUInt16BE(offset + 5); width = bytes.readUInt16BE(offset + 7); break; }
        offset += 2 + segment;
      }
    }
    if (width > 0 && height > 0 && width <= 400 && height <= 400) return value;
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "reddit-thumbnail-"));
    const input = path.join(directory, `source.${kind}`);
    const output = path.join(directory, "thumbnail.png");
    try {
      fs.writeFileSync(input, bytes);
      childProcess.execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", input, "-vf", "scale=400:400:force_original_aspect_ratio=decrease", "-frames:v", "1", output]);
      return `data:image/png;base64,${fs.readFileSync(output).toString("base64")}`;
    } catch {
      throw ErrorUtil.unprocessable("Image thumbnail generation failed.");
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  }
  private validatePage(input?: IPage.IRequest): void { if (input?.page !== undefined && input.page !== null && (!Number.isInteger(input.page) || input.page < 1)) throw ErrorUtil.unprocessable("Page must be a positive integer."); if (input?.limit !== undefined && input.limit !== null && (!Number.isInteger(input.limit) || input.limit < 1 || input.limit > 100)) throw ErrorUtil.unprocessable("Limit must be between 1 and 100."); }
  private validateImage(value: string | null | undefined, required: boolean): void {
    if (value === undefined || value === null || value.trim() === "") {
      if (required) throw ErrorUtil.unprocessable("An image upload is required.");
      return;
    }
    const match = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/i.exec(value.trim());
    if (!match || match[2]!.length % 4 === 1)
      throw ErrorUtil.unprocessable("Image must be a base64 PNG, JPEG, or WebP data URI.");
    const bytes = Buffer.from(match[2]!, "base64");
    if (bytes.length > 10 * 1024 * 1024)
      throw ErrorUtil.unprocessable("Image exceeds the 10 MiB limit.");
    const kind = match[1]!.toLowerCase();
    const png = bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    const jpeg = bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
    const webp = bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
    if ((kind === "png" && !png) || (kind === "jpeg" && !jpeg) || (kind === "webp" && !webp))
      throw ErrorUtil.unprocessable("Image format does not match its payload.");
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "reddit-image-"));
    const input = path.join(directory, `source.${kind}`);
    try {
      fs.writeFileSync(input, bytes);
      childProcess.execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", input, "-f", "null", "-"]);
    } catch {
      throw ErrorUtil.unprocessable("Image payload could not be decoded.");
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  }
  private validatePostBody(body: IPost.ICreate): void { const title = body.title.trim(); if (title.length < 1 || title.length > 300) throw ErrorUtil.unprocessable("Title must contain 1 through 300 characters."); const present = [body.text !== undefined && body.text !== null, body.url !== undefined && body.url !== null, body.image !== undefined && body.image !== null]; if (present.filter(Boolean).length !== 1) throw ErrorUtil.unprocessable("Exactly one payload is required."); if (body.type === "text") { if (!body.text || body.text.trim().length < 1 || body.text.length > 40000 || present[1] || present[2]) throw ErrorUtil.unprocessable("Text payload is invalid."); } else if (body.type === "link") { let valid = false; try { const parsed = new URL(body.url ?? ""); valid = (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.hostname.length > 0; } catch { valid = false; } if (!body.url || body.url.length > 2048 || !valid || present[0] || present[2]) throw ErrorUtil.unprocessable("Link payload is invalid."); } else { this.validateImage(body.image, true); if (present[0] || present[1]) throw ErrorUtil.unprocessable("Image payload is invalid."); } }
  private removeVotes(votes: Map<UUID, Vote>, authorId: UUID): void { for (const value of votes.values()) this.user(authorId).karma += value === "up" ? -1 : 1; votes.clear(); }
  private removeReports(targetId: UUID, moderatorId?: UUID): void { for (const report of this.reports.values()) if (report.targetId === targetId && report.status === "pending") { if (moderatorId) { report.status = "approved"; report.moderatorId = moderatorId; report.resolvedAt = now(); } else this.reports.delete(report.id); } }

  public join(body: IAuth.IJoin): IAuthorized { const email = body.email.trim().toLowerCase(); const username = body.username.trim(); const diagnoses = []; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) diagnoses.push({ accessor: "$.email", message: "Email must be a valid address." }); if (!/^[A-Za-z0-9_]{3,30}$/.test(username)) diagnoses.push({ accessor: "$.username", message: "Username must contain 3 through 30 letters, digits, or underscores." }); if (body.password.length < 8 || body.password.length > 128) diagnoses.push({ accessor: "$.password", message: "Password must contain 8 through 128 characters." }); if (diagnoses.length) throw ErrorUtil.unprocessable(diagnoses); const emailConflict = [...this.users.values()].some((u) => u.email === email); const usernameConflict = [...this.users.values()].some((u) => u.username.toLowerCase() === username.toLowerCase()); if (emailConflict || usernameConflict) throw ErrorUtil.conflict([{ accessor: emailConflict ? "$.email" : "$.username", message: emailConflict ? "Email is unavailable." : "Username is unavailable." }]); const user: UserRec = { id: id(), email, username, password: hash(body.password), displayName: username, bio: "", avatar: null, karma: 0, deleted: false, createdAt: now() }; this.users.set(user.id, user); return this.issue(user); }
  public login(body: IAuth.ILogin): IAuthorized { const email = body.email.trim().toLowerCase(); const user = [...this.users.values()].find((u) => u.email === email && !u.deleted); if (!user || user.password !== hash(body.password)) throw ErrorUtil.unauthorized("Invalid credentials."); return this.issue(user); }
  public refresh(header: string | undefined, body: IAuth.IRefresh): IAuthorized { const presented = body.refreshToken ?? header?.replace(/^Bearer\s+/i, ""); const entry = presented ? [...this.sessions.entries()].find(([key, value]) => key === presented || value.refresh === presented) : undefined; if (!entry || entry[1].refreshExpires <= Date.now()) throw ErrorUtil.unauthorized("Invalid refresh token."); this.sessions.delete(entry[0]); return this.issue(this.user(entry[1].userId)); }
  private issue(user: UserRec): IAuthorized { const token = crypto.randomBytes(24).toString("hex"); const refreshToken = crypto.randomBytes(32).toString("hex"); const createdAt = Date.now(); const accessTtl = Number(process.env.JWT_ACCESS_TTL_SECONDS ?? 3600) * 1000; const refreshTtl = Number(process.env.JWT_REFRESH_TTL_SECONDS ?? 2_592_000) * 1000; this.sessions.set(token, { userId: user.id, refresh: refreshToken, createdAt, accessExpires: createdAt + accessTtl, refreshExpires: createdAt + refreshTtl }); this.persist(); return { token, refreshToken, user: this.summary(user) }; }
  public logout(header?: string): void { const token = header?.replace(/^Bearer\s+/i, ""); if (token) { this.sessions.delete(token); this.persist(); } }
  public logoutAll(header?: string): void { const user = this.token(header); for (const [key, session] of this.sessions) if (session.userId === user.id) this.sessions.delete(key); this.persist(); }
  public changePassword(header: string | undefined, body: IAuth.IChangePassword): void { const user = this.token(header); if (body.newPassword.length < 8 || body.newPassword.length > 128) throw ErrorUtil.unprocessable("Password must contain 8 through 128 characters."); if (user.password !== hash(body.currentPassword) || body.currentPassword === body.newPassword) throw ErrorUtil.forbidden("Current password is incorrect."); user.password = hash(body.newPassword); const current = header?.replace(/^Bearer\s+/i, ""); for (const [key, session] of this.sessions) if (session.userId === user.id && key !== current) this.sessions.delete(key); this.persist(); }
  public recoveryRequest(body: IAuth.IRecoveryRequest): { success: boolean } { const email = body.email.trim().toLowerCase(); const user = [...this.users.values()].find((u) => u.email === email && !u.deleted); if (user) this.recovery.set(email, { userId: user.id, proof: crypto.randomBytes(16).toString("hex"), expires: Date.now() + 3600000 }); this.persist(); return { success: true }; }
  public recoveryComplete(body: IAuth.IRecoveryComplete): IAuthorized { const email = body.email.trim().toLowerCase(); const value = this.recovery.get(email); if (body.newPassword.length < 8 || body.newPassword.length > 128) throw ErrorUtil.unprocessable("Password must contain 8 through 128 characters."); if (!value || value.proof !== body.proof || value.expires < Date.now()) throw ErrorUtil.unauthorized("Invalid recovery proof."); const user = this.user(value.userId); user.password = hash(body.newPassword); this.recovery.delete(email); for (const [key, session] of this.sessions) if (session.userId === user.id) this.sessions.delete(key); return this.issue(user); }
  public deleteAccount(header: string | undefined, password: string): { success: boolean } { const user = this.token(header); if (user.password !== hash(password)) throw ErrorUtil.forbidden("Current password is incorrect."); const backup = this.snapshot(); try { for (const community of this.communities.values()) if (community.ownerId === user.id) { const moderators = [...community.moderators.entries()].filter(([candidate]) => candidate !== user.id && this.users.get(candidate)?.deleted === false).sort((a, b) => a[1].getTime() - b[1].getTime() || a[0].localeCompare(b[0])); const subscribers = [...community.subscribers.entries()].filter(([candidate]) => candidate !== user.id && this.users.get(candidate)?.deleted === false).sort((a, b) => a[1].getTime() - b[1].getTime() || a[0].localeCompare(b[0])); const successor = moderators[0]?.[0] ?? subscribers[0]?.[0]; community.ownerId = successor ?? null; community.subscribers.delete(user.id); if (!successor) community.status = "archived"; } for (const post of this.posts.values()) if (post.authorId === user.id && !post.deleted) { this.removeVotes(post.votes, post.authorId); this.removeReports(post.id); post.deleted = true; for (const comment of this.comments.values()) if (comment.postId === post.id && !comment.deleted) { this.removeVotes(comment.votes, comment.authorId); this.removeReports(comment.id); comment.deleted = true; } } for (const comment of this.comments.values()) if (comment.authorId === user.id && !comment.deleted) { this.removeVotes(comment.votes, comment.authorId); this.removeReports(comment.id); comment.deleted = true; } for (const post of this.posts.values()) { const vote = post.votes.get(user.id); if (vote !== undefined) { post.votes.delete(user.id); this.user(post.authorId).karma += vote === "up" ? -1 : 1; } } for (const comment of this.comments.values()) { const vote = comment.votes.get(user.id); if (vote !== undefined) { comment.votes.delete(user.id); this.user(comment.authorId).karma += vote === "up" ? -1 : 1; } } for (const community of this.communities.values()) { community.subscribers.delete(user.id); community.moderators.delete(user.id); community.bans.delete(user.id); } for (const report of this.reports.values()) if (report.reporterId === user.id && report.status === "pending") this.reports.delete(report.id); user.deleted = true; for (const [key, session] of this.sessions) if (session.userId === user.id) this.sessions.delete(key); this.persist(); return { success: true }; } catch (error) { this.hydrate(backup); try { this.persist(); } catch { /* preserve the original failure */ } throw error; } }
  public profile(header: string | undefined, username: string, input?: IProfile.IRequest): IProfile { const user = [...this.users.values()].find((u) => !u.deleted && u.username.toLowerCase() === username.toLowerCase()); if (!user) throw ErrorUtil.notFound("No such profile."); const posts = [...this.posts.values()].filter((p) => p.authorId === user.id && !p.deleted).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((p) => this.postSummary(p)); const comments = [...this.comments.values()].filter((c) => c.authorId === user.id && !c.deleted).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((c) => this.commentSummary(c)); return { id: user.id, username: user.username, displayName: user.displayName, bio: user.bio, avatar: user.avatar, karma: user.karma, createdAt: iso(user.createdAt), posts: this.page(posts, input?.posts, { kind: "profile-posts", userId: user.id }), comments: this.page(comments, input?.comments, { kind: "profile-comments", userId: user.id }) }; }
  public updateProfile(header: string | undefined, body: IProfile.IUpdate): IProfile { const user = this.token(header); if (body.displayName !== undefined && !body.displayName.trim()) throw ErrorUtil.unprocessable("Display name cannot be blank."); if (body.avatar !== undefined) this.validateImage(body.avatar, false); if (body.displayName !== undefined) user.displayName = body.displayName.trim(); if (body.bio !== undefined) user.bio = body.bio ?? ""; if (body.avatar !== undefined) user.avatar = body.avatar; this.persist(); return this.profile(header, user.username); }

  public createCommunity(header: string | undefined, body: ICommunity.ICreate): ICommunity { const user = this.token(header); const name = body.name.trim(); const description = body.description.trim(); if (!/^[A-Za-z0-9_-]{3,50}$/.test(name) || description.length < 1 || description.length > 1000) throw ErrorUtil.unprocessable("Community fields are invalid."); this.validateImage(body.icon, true); const normalized = name.toLowerCase(); if ([...this.communities.values()].some((c) => c.normalized === normalized)) throw ErrorUtil.conflict("Community name is unavailable."); const createdAt = now(); const value: CommunityRec = { id: id(), name, normalized, description, icon: body.icon ?? null, status: "active", ownerId: user.id, createdAt, subscribers: new Map([[user.id, createdAt]]), moderators: new Map(), bans: new Map() }; this.communities.set(value.id, value); this.persist(); return this.communityDto(value); }
  public listCommunities(input?: ICommunity.IRequest): IPage<ICommunity> { let values = [...this.communities.values()].sort((a, b) => a.normalized.localeCompare(b.normalized) || a.id.localeCompare(b.id)); if (input?.search?.trim()) values = values.filter((c) => c.normalized.includes(input.search!.trim().toLowerCase())); return this.page(values.map((c) => this.communityDto(c)), input, { kind: "communities" }); }
  public getCommunity(idValue: UUID): ICommunity { return this.communityDto(this.community(idValue)); }
  private communityDto(value: CommunityRec): ICommunity { const owner = value.ownerId ? this.user(value.ownerId) : null; return { id: value.id, name: value.name, description: value.description, icon: value.icon, status: value.status, subscriberCount: value.subscribers.size, owner: owner ? this.summary(owner) : null }; }
  public subscribe(header: string | undefined, communityId: UUID): ICommunity { const user = this.token(header); const value = this.community(communityId); if (value.status !== "active") throw ErrorUtil.forbidden("The community is archived."); if (!value.subscribers.has(user.id)) { value.subscribers.set(user.id, now()); this.persist(); } return this.communityDto(value); }
  public unsubscribe(header: string | undefined, communityId: UUID): ICommunity { const user = this.token(header); const value = this.community(communityId); if (value.subscribers.delete(user.id)) this.persist(); return this.communityDto(value); }
  public subscriptions(header: string | undefined, input?: IPage.IRequest): IPage<ISubscription> { const user = this.token(header); const values: ISubscription[] = []; for (const community of this.communities.values()) { const created = community.subscribers.get(user.id); if (created) values.push({ community: this.communityDto(community), createdAt: iso(created) }); } values.sort((a, b) => a.community.name.localeCompare(b.community.name)); return this.page(values, input, { kind: "subscriptions", userId: user.id }); }

  public createPost(header: string | undefined, communityId: UUID, body: IPost.ICreate): IPost { const user = this.token(header); const community = this.community(communityId); this.ensureActive(community); if (!community.subscribers.has(user.id) || community.bans.has(user.id)) throw ErrorUtil.forbidden("Subscription and good standing are required to post."); this.validatePostBody(body); const image = body.type === "image" ? body.image! : null; const value: PostRec = { id: id(), title: body.title.trim(), type: body.type, text: body.type === "text" ? body.text!.trim() : null, url: body.type === "link" ? body.url! : null, image, thumbnail: this.makeThumbnail(image), authorId: user.id, communityId, createdAt: now(), deleted: false, votes: new Map() }; this.posts.set(value.id, value); this.persist(); return this.post(value); }
  public getPost(idValue: UUID): IPost { const value = this.posts.get(idValue); if (!value || value.deleted) throw ErrorUtil.notFound("No such post."); return this.post(value); }
  public updatePost(header: string | undefined, idValue: UUID, body: IPost.IUpdate): IPost { const user = this.token(header); const value = this.posts.get(idValue); if (!value || value.deleted) throw ErrorUtil.notFound("No such post."); if (value.authorId !== user.id) throw ErrorUtil.forbidden("Only the author may edit this post."); this.ensureActive(this.community(value.communityId)); if ((value.type !== "text" && body.text !== undefined) || (value.type !== "link" && body.url !== undefined) || (value.type !== "image" && body.image !== undefined)) throw ErrorUtil.unprocessable("Only the current post type payload may be edited."); const candidate: IPost.ICreate = { title: body.title ?? value.title, type: value.type, text: value.type === "text" ? body.text ?? value.text : null, url: value.type === "link" ? body.url ?? value.url : null, image: value.type === "image" ? body.image ?? value.image : null }; this.validatePostBody(candidate); const nextImage = value.type === "image" ? candidate.image! : null; const nextThumbnail = value.type === "image" ? this.makeThumbnail(nextImage) : null; value.title = candidate.title.trim(); if (value.type === "text") value.text = candidate.text!.trim(); if (value.type === "link") value.url = candidate.url!; if (value.type === "image") { value.image = nextImage; value.thumbnail = nextThumbnail; } this.persist(); return this.post(value); }
  public deletePost(header: string | undefined, idValue: UUID, moderator = false, expectedCommunityId?: UUID): void { const user = this.token(header); const value = this.posts.get(idValue); if (!value || value.deleted) throw ErrorUtil.notFound("No such post."); if (expectedCommunityId !== undefined && value.communityId !== expectedCommunityId) throw ErrorUtil.notFound("No such post in this community."); const community = this.community(value.communityId); if (!moderator && value.authorId !== user.id) throw ErrorUtil.forbidden("Only the author may delete this post."); if (moderator) this.ensureModerator(user.id, community); this.removeVotes(value.votes, value.authorId); this.removeReports(value.id, moderator ? user.id : undefined); value.deleted = true; for (const comment of this.comments.values()) if (comment.postId === value.id) { this.removeVotes(comment.votes, comment.authorId); this.removeReports(comment.id, moderator ? user.id : undefined); comment.deleted = true; } this.persist(); }
  public feed(header: string | undefined, kind: "home" | "popular" | "community", communityId: UUID | undefined, input?: IPost.IRequest): IPage<IPost.ISummary> { let values = [...this.posts.values()].filter((p) => !p.deleted); let viewerId: UUID | null = null; if (kind === "home") { const user = this.token(header); viewerId = user.id; const subscribed = new Set([...this.communities.values()].filter((c) => c.subscribers.has(user.id)).map((c) => c.id)); values = values.filter((p) => subscribed.has(p.communityId)); } if (kind === "community" && communityId) { this.community(communityId); values = values.filter((p) => p.communityId === communityId); } const sort = input?.sort ?? "hot"; const range = input?.range ?? "all"; if (!["hot", "new", "top", "controversial"].includes(sort)) throw ErrorUtil.unprocessable("Unknown feed sort."); if (!["today", "week", "month", "year", "all"].includes(range)) throw ErrorUtil.unprocessable("Unknown Top range."); if (sort !== "top" && input?.range !== undefined && input.range !== null) throw ErrorUtil.unprocessable("Only Top accepts a time range."); const cutoff = range === "today" ? 24 : range === "week" ? 24 * 7 : range === "month" ? 24 * 30 : range === "year" ? 24 * 365 : Number.POSITIVE_INFINITY; const nowMs = Date.now(); if (sort === "top" && Number.isFinite(cutoff)) values = values.filter((p) => (nowMs - p.createdAt.getTime()) / 3600000 <= cutoff); const ranking = (p: PostRec): number => { const score = this.score(p.votes); const age = Math.max(0, (nowMs - p.createdAt.getTime()) / 3600000); if (sort === "new") return -p.createdAt.getTime(); if (sort === "top") return score * 1_000_000_000_000 + p.createdAt.getTime(); if (sort === "controversial") return ([...p.votes.values()].length) / (Math.abs(score) + 1); return Math.log10(Math.max(score, 1)) - age / 12.5; }; values.sort((a, b) => ranking(b) - ranking(a) || (sort === "controversial" ? [...b.votes.values()].length - [...a.votes.values()].length : 0) || b.createdAt.getTime() - a.createdAt.getTime() || b.id.localeCompare(a.id)); return this.page(values.map((p) => this.postSummary(p)), input, { kind, communityId: communityId ?? null, viewerId, sort, range }); }

  public createComment(header: string | undefined, postId: UUID, body: IComment.ICreate): IComment { const user = this.token(header); const post = this.posts.get(postId); if (!post || post.deleted) throw ErrorUtil.notFound("No such post."); const community = this.community(post.communityId); this.ensureActive(community); if (community.bans.has(user.id) || !body.text.trim()) throw ErrorUtil.forbidden("Commenting is not permitted."); if (body.parentId) { const parent = this.comments.get(body.parentId); if (!parent || parent.deleted || parent.postId !== postId) throw ErrorUtil.unprocessable("Invalid comment parent."); } const value: CommentRec = { id: id(), text: body.text, authorId: user.id, postId, parentId: body.parentId ?? null, createdAt: now(), deleted: false, votes: new Map() }; this.comments.set(value.id, value); this.persist(); return this.commentTree(value); }
  private commentHasLiveBranch(candidate: CommentRec): boolean { return !candidate.deleted || [...this.comments.values()].some((child) => child.parentId === candidate.id && this.commentHasLiveBranch(child)); }
  private commentRanking(candidate: CommentRec, sort: string): number { if (!candidate.deleted) { if (sort === "new") return candidate.createdAt.getTime(); if (sort === "controversial") return [...candidate.votes.values()].length / (Math.abs(this.score(candidate.votes)) + 1); return this.score(candidate.votes); } const children = [...this.comments.values()].filter((child) => child.parentId === candidate.id && this.commentHasLiveBranch(child)); return children.length ? Math.max(...children.map((child) => this.commentRanking(child, sort))) : 0; }
  public listComments(postId: UUID, input?: IComment.IRequest): IPage<IComment> { const post = this.posts.get(postId); if (!post || post.deleted) throw ErrorUtil.notFound("No such post."); const roots = [...this.comments.values()].filter((c) => c.postId === postId && c.parentId === null && this.commentHasLiveBranch(c)); const sort = input?.sort ?? "best"; if (!["best", "new", "controversial"].includes(sort)) throw ErrorUtil.unprocessable("Unknown comment sort."); roots.sort((a, b) => { const as = this.commentRanking(a, sort); const bs = this.commentRanking(b, sort); if (sort === "best") return bs - as || a.createdAt.getTime() - b.createdAt.getTime() || a.id.localeCompare(b.id); if (sort === "controversial") return bs - as || [...b.votes.values()].length - [...a.votes.values()].length || b.createdAt.getTime() - a.createdAt.getTime() || b.id.localeCompare(a.id); return bs - as || b.id.localeCompare(a.id); }); return this.page(roots.map((c) => this.commentTree(c, sort)), input, { kind: "comments", postId, sort }); }
  private commentTree(value: CommentRec, sort?: string): IComment { const children = [...this.comments.values()].filter((c) => c.parentId === value.id && this.commentHasLiveBranch(c)); children.sort((a, b) => { const as = this.commentRanking(a, sort ?? "best"); const bs = this.commentRanking(b, sort ?? "best"); if (sort === "best") return bs - as || a.createdAt.getTime() - b.createdAt.getTime() || a.id.localeCompare(b.id); if (sort === "controversial") return bs - as || [...b.votes.values()].length - [...a.votes.values()].length || b.createdAt.getTime() - a.createdAt.getTime() || b.id.localeCompare(a.id); return bs - as || b.id.localeCompare(a.id); }); return { ...this.commentSummary(value), children: children.map((c) => this.commentTree(c, sort)) }; }
  public updateComment(header: string | undefined, idValue: UUID, body: IComment.IUpdate): IComment { const user = this.token(header); const value = this.comments.get(idValue); if (!value || value.deleted) throw ErrorUtil.notFound("No such comment."); if (value.authorId !== user.id) throw ErrorUtil.forbidden("Only the author may edit this comment."); this.ensureActive(this.community(this.posts.get(value.postId)!.communityId)); if (!body.text.trim()) throw ErrorUtil.unprocessable("Comment text is required."); value.text = body.text; this.persist(); return this.commentTree(value); }
  public deleteComment(header: string | undefined, idValue: UUID, moderator = false, expectedCommunityId?: UUID): void { const user = this.token(header); const value = this.comments.get(idValue); if (!value || value.deleted) throw ErrorUtil.notFound("No such comment."); const post = this.posts.get(value.postId); if (!post) throw ErrorUtil.notFound("No such post."); if (expectedCommunityId !== undefined && post.communityId !== expectedCommunityId) throw ErrorUtil.notFound("No such comment in this community."); const community = this.community(post.communityId); if (!moderator && value.authorId !== user.id) throw ErrorUtil.forbidden("Only the author may delete this comment."); if (moderator) this.ensureModerator(user.id, community); else this.ensureActive(community); this.removeVotes(value.votes, value.authorId); this.removeReports(value.id, moderator ? user.id : undefined); value.deleted = true; this.persist(); }
  public vote(header: string | undefined, targetId: UUID, targetType: "post" | "comment", value: "up" | "down" | "remove"): IVote { const user = this.token(header); const target = this.ensureTarget(targetId, targetType); this.ensureActive(target.community); const votes = targetType === "post" ? target.post!.votes : target.comment!.votes; const previous = votes.get(user.id); if (value === "remove") votes.delete(user.id); else votes.set(user.id, value); const delta = (value === "up" ? 1 : value === "down" ? -1 : 0) - (previous === "up" ? 1 : previous === "down" ? -1 : 0); const authorId = targetType === "post" ? target.post!.authorId : target.comment!.authorId; this.user(authorId).karma += delta; this.persist(); return { value: value === "remove" ? null : value, score: this.score(votes) }; }
  public appointModerator(header: string | undefined, communityId: UUID, targetId: UUID): ICommunity { const actor = this.token(header); const community = this.community(communityId); this.ensureModerator(actor.id, community); this.user(targetId); if (community.ownerId !== targetId) { if (!community.moderators.has(targetId)) community.moderators.set(targetId, now()); this.persist(); } return this.communityDto(community); }
  public removeModerator(header: string | undefined, communityId: UUID, targetId: UUID): ICommunity { const actor = this.token(header); const community = this.community(communityId); this.ensureActive(community); if (community.ownerId !== actor.id) throw ErrorUtil.forbidden("Only the owner may remove moderators."); if (community.ownerId === targetId) throw ErrorUtil.forbidden("The owner is protected."); this.user(targetId); if (community.moderators.delete(targetId)) this.persist(); return this.communityDto(community); }
  public ban(header: string | undefined, communityId: UUID, targetId: UUID, active: boolean): ICommunity { const actor = this.token(header); const community = this.community(communityId); this.ensureModerator(actor.id, community); this.user(targetId); if (community.ownerId === targetId) throw ErrorUtil.forbidden("The owner cannot be banned."); if (active) { if (!community.bans.has(targetId)) { const createdAt = now(); community.bans.set(targetId, createdAt); this.banHistory.push({ id: id(), userId: targetId, moderatorId: actor.id, communityId, createdAt, endedAt: null, unbannedBy: null }); this.persist(); } } else { if (community.bans.delete(targetId)) { const latest = [...this.banHistory].reverse().find((entry) => entry.communityId === communityId && entry.userId === targetId && entry.endedAt === null); if (latest) { latest.endedAt = now(); latest.unbannedBy = actor.id; } this.persist(); } } return this.communityDto(community); }
  public listBans(header: string | undefined, communityId: UUID, input?: IPage.IRequest): IPage<IBan> { const actor = this.token(header); const community = this.community(communityId); this.ensureModerator(actor.id, community); const values = [...community.bans.entries()].sort((a, b) => b[1].getTime() - a[1].getTime() || b[0].localeCompare(a[0])).map(([userId, createdAt]) => { const record = [...this.banHistory].reverse().find((entry) => entry.communityId === communityId && entry.userId === userId && entry.endedAt === null); const moderator = record ? this.users.get(record.moderatorId) : actor; return { id: record?.id ?? id(), user: this.summary(this.user(userId)), moderator: this.summary(moderator ?? actor), createdAt: iso(createdAt) }; }); return this.page(values, input, { kind: "bans", communityId }); }
  public listBanHistory(header: string | undefined, communityId: UUID, input?: IPage.IRequest): IPage<IBanHistory> { const actor = this.token(header); const community = this.community(communityId); this.ensureModerator(actor.id, community); const values = this.banHistory.filter((entry) => entry.communityId === communityId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((entry) => { const user = this.users.get(entry.userId); const moderator = this.users.get(entry.moderatorId); const unbannedBy = entry.unbannedBy ? this.users.get(entry.unbannedBy) : undefined; return { id: entry.id, user: user && !user.deleted ? this.summary(user) : { id: entry.userId, username: "deleted", displayName: "Deleted user" }, moderator: moderator && !moderator.deleted ? this.summary(moderator) : { id: entry.moderatorId, username: "deleted", displayName: "Deleted user" }, createdAt: iso(entry.createdAt), unbannedBy: unbannedBy && !unbannedBy.deleted ? this.summary(unbannedBy) : null, endedAt: entry.endedAt ? iso(entry.endedAt) : null }; }); return this.page(values, input, { kind: "ban-history", communityId }); }
  public report(header: string | undefined, body: IReport.ICreate): IReport { const reporter = this.token(header); const target = this.ensureTarget(body.targetId, body.targetType); this.ensureActive(target.community); const reason = body.reason.trim(); if (!reason || reason.length > 2000) throw ErrorUtil.unprocessable("Report reason is invalid."); if ([...this.reports.values()].some((r) => r.targetId === body.targetId && r.reporterId === reporter.id && r.status === "pending")) throw ErrorUtil.conflict("An unresolved report already exists."); const value: ReportRec = { id: id(), targetId: body.targetId, targetType: body.targetType, reporterId: reporter.id, communityId: target.community.id, reason, createdAt: now(), status: "pending", moderatorId: null, resolvedAt: null }; this.reports.set(value.id, value); this.persist(); return this.reportDto(value); }
  public listReports(header: string | undefined, communityId: UUID, input?: IPage.IRequest): IPage<IReport> { const actor = this.token(header); const community = this.community(communityId); this.ensureModerator(actor.id, community); const values = [...this.reports.values()].filter((r) => r.communityId === communityId && r.status === "pending").sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((r) => this.reportDto(r)); return this.page(values, input, { kind: "reports", communityId }); }
  public resolveReport(header: string | undefined, reportId: UUID, approve: boolean): IReport { const actor = this.token(header); const value = this.reports.get(reportId); if (!value || value.status !== "pending") throw ErrorUtil.notFound("No unresolved report."); const community = this.community(value.communityId); this.ensureModerator(actor.id, community); this.ensureTarget(value.targetId, value.targetType); if (approve) { if (value.targetType === "post") this.deletePost(header, value.targetId, true); else this.deleteComment(header, value.targetId, true); value.status = "approved"; } else value.status = "dismissed"; value.moderatorId = actor.id; value.resolvedAt = now(); this.persist(); return this.reportDto(value); }
  public listReportHistory(header: string | undefined, communityId: UUID, input?: IPage.IRequest): IPage<IReportHistory> { const actor = this.token(header); const community = this.community(communityId); this.ensureModerator(actor.id, community); const values = [...this.reports.values()].filter((r) => r.communityId === communityId && r.status !== "pending").sort((a, b) => (b.resolvedAt?.getTime() ?? 0) - (a.resolvedAt?.getTime() ?? 0)).map((r) => this.reportHistoryDto(r)); return this.page(values, input, { kind: "report-history", communityId }); }
  private reportDto(value: ReportRec): IReport { const reporter = this.users.get(value.reporterId); let target: IReport["target"] = null; try { const available = this.ensureTarget(value.targetId, value.targetType); target = value.targetType === "post" ? this.post(available.post!) : this.commentTree(available.comment!); } catch { /* resolved history may refer to removed content */ } return { id: value.id, targetId: value.targetId, targetType: value.targetType, target, reporter: reporter && !reporter.deleted ? this.summary(reporter) : { id: value.reporterId, username: "deleted", displayName: "Deleted user" }, reason: value.reason, createdAt: iso(value.createdAt), status: value.status }; }
  private reportHistoryDto(value: ReportRec): IReportHistory { const reporter = this.users.get(value.reporterId); const moderator = value.moderatorId ? this.users.get(value.moderatorId) : undefined; let target: IReportHistory["target"] = null; try { const available = this.ensureTarget(value.targetId, value.targetType); target = value.targetType === "post" ? this.post(available.post!) : this.commentTree(available.comment!); } catch { /* removed targets are intentionally omitted */ } return { id: value.id, targetId: value.targetId, targetType: value.targetType, target, reporter: reporter && !reporter.deleted ? this.summary(reporter) : { id: value.reporterId, username: "deleted", displayName: "Deleted user" }, reason: value.reason, createdAt: iso(value.createdAt), status: value.status === "approved" ? "approved" : "dismissed", moderator: moderator && !moderator.deleted ? this.summary(moderator) : null, resolvedAt: iso(value.resolvedAt ?? value.createdAt) }; }
}

export const redditProvider = new RedditProvider();
