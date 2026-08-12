import type {
  IAuth,
  IBan,
  IComment,
  ICommunity,
  IEntity,
  IPage,
  IPost,
  IProfile,
  IReport,
  ISubscription,
  IMedia,
  IModerationHistory,
  IProfileUpdate,
  ICommunityCreate,
  ICommunityRequest,
  IVoteRequest,
  IReportCreate,
  IVote,
} from "@benchmark/reddit-api";
import { Prisma } from "@prisma/sdk";
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { deflateSync, inflateSync } from "node:zlib";
import { MyGlobal } from "../MyGlobal";
import { AuthUtil, type AuthPayload } from "../utils/AuthUtil";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Authenticated identity accepted by protected provider operations. */
export interface Actor {
  id: string;
  session_id: string;
}

/** Requirement-derived account, community, content, and moderation behavior. */
export namespace RedditProvider {
  export async function join(body: IAuth.IJoin): Promise<IAuth.IAuthorized> {
    const email = body.email.trim();
    const username = body.username.trim();
    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = username.toLowerCase();
    const diagnoses = [];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) diagnoses.push({ message: "Email is invalid.", accessor: "body.email" });
    if (!/^[A-Za-z0-9_]{3,30}$/.test(username)) diagnoses.push({ message: "Username must contain 3 through 30 letters, digits, or underscores.", accessor: "body.username" });
    if (body.password.length < 8 || body.password.length > 128) diagnoses.push({ message: "Password must contain 8 through 128 characters.", accessor: "body.password" });
    if (diagnoses.length) throw ErrorUtil.unprocessable(diagnoses);
    const conflicts = await MyGlobal.prisma.users.findMany({ where: { OR: [{ email_normalized: normalizedEmail }, { username_normalized: normalizedUsername }] }, select: { email_normalized: true, username_normalized: true } });
    if (conflicts.length !== 0) {
      const result = [];
      if (conflicts.some((conflict) => conflict.email_normalized === normalizedEmail)) result.push({ message: "Email is unavailable.", accessor: "body.email" });
      if (conflicts.some((conflict) => conflict.username_normalized === normalizedUsername)) result.push({ message: "Username is unavailable.", accessor: "body.username" });
      throw ErrorUtil.conflict(result);
    }
    const user = await MyGlobal.prisma.$transaction(async (tx) => {
      const created = await tx.users.create({ data: { id: randomUUID(), email_normalized: normalizedEmail, username, username_normalized: normalizedUsername, password_hash: AuthUtil.hashPassword(body.password), created_at: new Date(), updated_at: new Date(), profile: { create: { id: randomUUID(), display_name: username, bio: "", created_at: new Date(), updated_at: new Date() } } }, select: { id: true, username: true } });
      const session = await tx.sessions.create({ data: { id: randomUUID(), user_id: created.id, created_at: new Date(), last_used_at: new Date() }, select: { id: true } });
      return { ...created, session_id: session.id };
    });
    return authorized(user.id, user.username, user.session_id);
  }

  export async function login(body: IAuth.ILogin): Promise<IAuth.IAuthorized> {
    const user = await MyGlobal.prisma.users.findUnique({ where: { email_normalized: body.email.trim().toLowerCase() }, select: { id: true, username: true, password_hash: true, deleted_at: true } });
    if (user === null || user.deleted_at !== null || !AuthUtil.verifyPassword(body.password, user.password_hash)) throw ErrorUtil.unauthorized("Email or password is incorrect.");
    const session = await MyGlobal.prisma.sessions.create({ data: { id: randomUUID(), user_id: user.id, created_at: new Date(), last_used_at: new Date() }, select: { id: true } });
    return authorized(user.id, user.username, session.id);
  }

  export async function refresh(body: IAuth.IRefresh): Promise<IAuth.IAuthorized> {
    const payload = AuthUtil.fromBearer(body.refreshToken);
    if (payload === null || payload.kind !== "refresh" || payload.exp <= Math.floor(Date.now() / 1000)) throw ErrorUtil.unauthorized("Refresh proof is invalid.");
    const session = await MyGlobal.prisma.sessions.findFirst({ where: { id: payload.session_id, user_id: payload.id, revoked_at: null }, select: { id: true, user: { select: { id: true, username: true, deleted_at: true } } } });
    if (session === null || session.user.deleted_at !== null) throw ErrorUtil.unauthorized("Session is no longer active.");
    await MyGlobal.prisma.sessions.update({ where: { id: session.id }, data: { last_used_at: new Date() } });
    return authorized(session.user.id, session.user.username, session.id);
  }

  export async function logout(payload: AuthPayload | null): Promise<boolean> {
    const actor = await current(payload);
    await MyGlobal.prisma.sessions.updateMany({ where: { id: actor.session_id, user_id: actor.id, revoked_at: null }, data: { revoked_at: new Date() } }); return true;
  }

  export async function logoutAll(payload: AuthPayload | null): Promise<boolean> {
    const actor = await current(payload);
    await MyGlobal.prisma.sessions.updateMany({ where: { user_id: actor.id, revoked_at: null }, data: { revoked_at: new Date() } }); return true;
  }

  export async function changePassword(payload: AuthPayload | null, body: IAuth.IPassword): Promise<boolean> {
    validatePassword(body.newPassword, "body.newPassword");
    const actor = await current(payload);
    const user = await MyGlobal.prisma.users.findUniqueOrThrow({ where: { id: actor.id }, select: { password_hash: true } });
    if (!AuthUtil.verifyPassword(body.currentPassword, user.password_hash) || AuthUtil.verifyPassword(body.newPassword, user.password_hash)) throw ErrorUtil.forbidden("Current password confirmation failed.");
    await MyGlobal.prisma.$transaction([MyGlobal.prisma.users.update({ where: { id: actor.id }, data: { password_hash: AuthUtil.hashPassword(body.newPassword), updated_at: new Date() } }), MyGlobal.prisma.sessions.updateMany({ where: { user_id: actor.id, id: { not: actor.session_id }, revoked_at: null }, data: { revoked_at: new Date() } })]); return true;
  }

  export async function recoveryRequest(body: IAuth.IRecoveryRequest): Promise<boolean> {
    const user = await MyGlobal.prisma.users.findUnique({ where: { email_normalized: body.email.trim().toLowerCase() }, select: { id: true, email_normalized: true, deleted_at: true } });
    if (user === null || user.deleted_at !== null) return true;
    const proof = randomBytes(32).toString("base64url");
    await MyGlobal.prisma.$transaction([MyGlobal.prisma.recovery_proofs.updateMany({ where: { user_id: user.id, used_at: null }, data: { used_at: new Date() } }), MyGlobal.prisma.recovery_proofs.create({ data: { id: randomUUID(), user_id: user.id, proof_hash: AuthUtil.hashPassword(proof), proof_payload: proof, created_at: new Date(), expires_at: new Date(Date.now() + 15 * 60_000), recipient_email: user.email_normalized } })]);
    // Delivery is represented by the persisted proof boundary; the secret is never returned.
    return true;
  }

  export async function recoveryComplete(body: IAuth.IRecoveryComplete): Promise<boolean> {
    validatePassword(body.newPassword, "body.newPassword");
    const proofs = await MyGlobal.prisma.recovery_proofs.findMany({ where: { used_at: null, expires_at: { gt: new Date() } }, orderBy: { created_at: "desc" }, select: { id: true, user_id: true, proof_hash: true, user: { select: { id: true, deleted_at: true } } } });
    const proof = proofs.find((item) => item.user.deleted_at === null && AuthUtil.verifyPassword(body.proof, item.proof_hash));
    if (proof === undefined) throw ErrorUtil.forbidden("Recovery proof is invalid, expired, used, or superseded.");
    await MyGlobal.prisma.$transaction(async (tx) => {
      const usedAt = new Date();
      const claimed = await tx.recovery_proofs.updateMany({ where: { id: proof.id, user_id: proof.user_id, used_at: null, expires_at: { gt: usedAt } }, data: { used_at: usedAt } });
      if (claimed.count !== 1) throw ErrorUtil.forbidden("Recovery proof is invalid, expired, used, or superseded.");
      const updated = await tx.users.updateMany({ where: { id: proof.user_id, deleted_at: null }, data: { password_hash: AuthUtil.hashPassword(body.newPassword), updated_at: usedAt } });
      if (updated.count !== 1) throw ErrorUtil.forbidden("Recovery proof is invalid, expired, used, or superseded.");
      await tx.sessions.updateMany({ where: { user_id: proof.user_id, revoked_at: null }, data: { revoked_at: usedAt } });
    }); return true;
  }

  export async function deleteAccount(payload: AuthPayload | null, password: string): Promise<boolean> {
    const actor = await current(payload);
    const user = await MyGlobal.prisma.users.findUniqueOrThrow({ where: { id: actor.id }, select: { password_hash: true } });
    if (!AuthUtil.verifyPassword(password, user.password_hash)) throw ErrorUtil.forbidden("Current password confirmation failed.");
    await MyGlobal.prisma.$transaction(async (tx) => {
      const owned = await tx.communities.findMany({ where: { owner_id: actor.id, status: "active" }, select: { id: true } });
      for (const community of owned) {
        const successor = await tx.moderators.findFirst({ where: { community_id: community.id, user_id: { not: actor.id }, user: { deleted_at: null } }, orderBy: [{ created_at: "asc" }, { user_id: "asc" }], select: { user_id: true } }) ?? await tx.subscriptions.findFirst({ where: { community_id: community.id, user_id: { not: actor.id }, ended_at: null, user: { deleted_at: null } }, orderBy: [{ activated_at: "asc" }, { user_id: "asc" }], select: { user_id: true } });
        await tx.communities.update({ where: { id: community.id }, data: successor === null ? { owner_id: null, status: "archived", updated_at: new Date() } : { owner_id: successor.user_id, updated_at: new Date() } });
      }
      const authoredComments = await tx.comments.findMany({ where: { author_id: actor.id }, select: { id: true, replies: { select: { id: true } } } });
      for (const comment of authoredComments) {
        await tx.moderation_histories.updateMany({ where: { target_comment_id: comment.id }, data: { target_comment_id: null, target_description: null } });
        if (comment.replies.length === 0) await tx.comments.delete({ where: { id: comment.id } });
        else await tx.comments.update({ where: { id: comment.id }, data: { author_id: null, text: null, deleted_at: new Date() } });
        await tx.votes.deleteMany({ where: { comment_id: comment.id } });
        await tx.reports.deleteMany({ where: { comment_id: comment.id } });
      }
      const authoredPosts = await tx.posts.findMany({ where: { author_id: actor.id }, select: { id: true } });
      for (const post of authoredPosts) {
        const comments = await tx.comments.findMany({ where: { post_id: post.id }, select: { id: true } });
        await tx.moderation_histories.updateMany({ where: { target_post_id: post.id }, data: { target_post_id: null, target_description: null } });
        if (comments.length !== 0) await tx.moderation_histories.updateMany({ where: { target_comment_id: { in: comments.map((comment) => comment.id) } }, data: { target_comment_id: null, target_description: null } });
        await tx.posts.delete({ where: { id: post.id } });
      }
      await tx.votes.deleteMany({ where: { user_id: actor.id } });
      await tx.profiles.deleteMany({ where: { user_id: actor.id } });
      await tx.sessions.deleteMany({ where: { user_id: actor.id } });
      await tx.recovery_proofs.deleteMany({ where: { user_id: actor.id } });
      await tx.subscriptions.deleteMany({ where: { user_id: actor.id } });
      await tx.moderators.deleteMany({ where: { user_id: actor.id } });
      await tx.bans.deleteMany({ where: { user_id: actor.id } });
      await tx.bans.updateMany({ where: { actor_id: actor.id }, data: { actor_id: null } });
      await tx.reports.deleteMany({ where: { reporter_id: actor.id } });
      await tx.reports.updateMany({ where: { decided_by_id: actor.id }, data: { decided_by_id: null } });
      await tx.moderation_histories.updateMany({ where: { subject_id: actor.id }, data: { subject_id: null } });
      await tx.moderation_histories.updateMany({ where: { actor_id: actor.id }, data: { actor_id: null } });
      await tx.users.update({ where: { id: actor.id }, data: { deleted_at: new Date(), password_hash: AuthUtil.hashPassword(randomBytes(32).toString("hex")), updated_at: new Date() } });
    }); return true;
  }

  export async function profile(username: string, posts: IPage.IRequest = {}, comments: IPage.IRequest = {}): Promise<IProfile> {
    const user = await MyGlobal.prisma.users.findUnique({ where: { username_normalized: username.trim().toLowerCase() }, select: { id: true, username: true, deleted_at: true, profile: { select: { display_name: true, bio: true, avatar: true } } } });
    if (user === null || user.deleted_at !== null || user.profile === null) throw ErrorUtil.notFound("Profile was not found.");
    return { username: user.username, displayName: user.profile.display_name, bio: user.profile.bio, avatar: mediaOutput(user.profile.avatar), karma: await karma(user.id), posts: await authoredPosts(user.id, posts), comments: await authoredComments(user.id, comments) };
  }

  export async function updateProfile(payload: AuthPayload | null, body: IProfileUpdate): Promise<IProfile> {
    const actor = await current(payload);
    if (body.displayName === null) throw ErrorUtil.unprocessable({ message: "Display name must be omitted or visible text.", accessor: "body.displayName" });
    if (body.displayName !== undefined && body.displayName.trim().length === 0) throw ErrorUtil.unprocessable({ message: "Display name cannot be blank.", accessor: "body.displayName" });
    const avatar = body.avatar === undefined || body.avatar === null ? body.avatar : await createMedia(body.avatar);
    await MyGlobal.prisma.profiles.update({ where: { user_id: actor.id }, data: { display_name: body.displayName === undefined ? undefined : body.displayName.trim(), bio: body.bio === undefined ? undefined : body.bio ?? "", avatar_media_id: avatar === undefined ? undefined : avatar === null ? null : avatar.id, updated_at: new Date() } });
    const user = await MyGlobal.prisma.users.findUniqueOrThrow({ where: { id: actor.id }, select: { username: true } });
    return profile(user.username);
  }

  export async function createCommunity(payload: AuthPayload | null, body: ICommunityCreate): Promise<ICommunity> {
    const actor = await current(payload);
    const name = body.name.trim();
    const description = body.description.trim();
    if (name.length < 3 || name.length > 50 || !/^[A-Za-z0-9_-]+$/.test(name)) throw ErrorUtil.unprocessable({ message: "Community name must contain 3 through 50 letters, digits, hyphens, or underscores.", accessor: "body.name" });
    if (description.length === 0 || description.length > 1000) throw ErrorUtil.unprocessable({ message: "Description must contain 1 through 1,000 characters.", accessor: "body.description" });
    const existing = await MyGlobal.prisma.communities.findUnique({ where: { name_normalized: name.toLowerCase() }, select: { id: true } });
    if (existing !== null) throw ErrorUtil.conflict("Community name is unavailable.");
    const icon = await createMedia(body.icon);
    const community = await MyGlobal.prisma.$transaction(async (tx) => {
      const created = await tx.communities.create({ data: { id: randomUUID(), name, name_normalized: name.toLowerCase(), description, icon_media_id: icon.id, status: "active", owner_id: actor.id, created_at: new Date(), updated_at: new Date() }, select: { id: true } });
      await tx.subscriptions.create({ data: { id: randomUUID(), user_id: actor.id, community_id: created.id, created_at: new Date(), activated_at: new Date() } });
      await tx.moderators.create({ data: { id: randomUUID(), user_id: actor.id, community_id: created.id, created_at: new Date() } });
      return created;
    });
    return communityAt(community.id);
  }

  export async function communities(input: ICommunityRequest = {}): Promise<IPage<ICommunity>> {
    const search = input.search?.trim().toLowerCase();
    const where: Prisma.communitiesWhereInput = search ? { name_normalized: { contains: search } } : {};
    return page(input, `communities:${search ?? ""}`, () => MyGlobal.prisma.communities.count({ where }), (skip, take) => MyGlobal.prisma.communities.findMany({ where, orderBy: [{ name_normalized: "asc" }, { id: "asc" }], skip, take, select: { id: true } }), async (row) => communityAt(row.id));
  }

  export async function subscribe(payload: AuthPayload | null, id: string): Promise<ICommunity> {
    const actor = await current(payload);
    const community = await MyGlobal.prisma.communities.findUnique({ where: { id }, select: { id: true, status: true } });
    if (community === null) throw ErrorUtil.notFound("Community was not found.");
    if (community.status !== "active") throw ErrorUtil.forbidden("Archived communities do not accept subscriptions.");
    const existing = await MyGlobal.prisma.subscriptions.findUnique({ where: { user_id_community_id: { user_id: actor.id, community_id: id } }, select: { id: true, ended_at: true } });
    if (existing === null) await MyGlobal.prisma.subscriptions.create({ data: { id: randomUUID(), user_id: actor.id, community_id: id, created_at: new Date(), activated_at: new Date() } });
    else if (existing.ended_at !== null) await MyGlobal.prisma.subscriptions.update({ where: { id: existing.id }, data: { ended_at: null, activated_at: new Date() } });
    return communityAt(id);
  }

  export async function unsubscribe(payload: AuthPayload | null, id: string): Promise<ICommunity> {
    const actor = await current(payload);
    const community = await MyGlobal.prisma.communities.findUnique({ where: { id }, select: { id: true } });
    if (community === null) throw ErrorUtil.notFound("Community was not found.");
    await MyGlobal.prisma.subscriptions.updateMany({ where: { user_id: actor.id, community_id: id, ended_at: null }, data: { ended_at: new Date() } });
    return communityAt(id);
  }

  export async function subscriptions(payload: AuthPayload | null, input: IPage.IRequest = {}): Promise<IPage<ISubscription>> {
    const actor = await current(payload);
    return page(input, `subscriptions:${actor.id}`, () => MyGlobal.prisma.subscriptions.count({ where: { user_id: actor.id, ended_at: null } }), (skip, take) => MyGlobal.prisma.subscriptions.findMany({ where: { user_id: actor.id, ended_at: null }, orderBy: [{ community: { name_normalized: "asc" } }, { id: "asc" }], skip, take, select: { id: true, activated_at: true, community_id: true } }), async (row) => ({ id: row.id, activatedAt: row.activated_at.toISOString(), community: await communityAt(row.community_id) }));
  }

  export async function createPost(payload: AuthPayload | null, body: IPost.ICreate): Promise<IPost> {
    const actor = await current(payload);
    const community = await eligibleCommunity(actor.id, body.communityId, true);
    validatePost(body.type, body.title, body.text, body.url, body.image);
    const image = body.image === undefined || body.image === null ? null : await createMedia(body.image, true);
    const post = await MyGlobal.prisma.posts.create({ data: { id: randomUUID(), title: body.title.trim(), type: body.type, text: body.type === "text" ? body.text?.trim() : null, url: body.type === "link" ? body.url?.trim() : null, image_media_id: image?.id ?? null, author_id: actor.id, community_id: community.id, created_at: new Date() }, select: { id: true } });
    return postAt(post.id);
  }

  export async function post(id: string): Promise<IPost> { return postAt(id); }

  export async function feed(payload: AuthPayload | null, kind: "home" | "popular" | "community", communityId: string | null, input: IPost.IRequest = {}): Promise<IPage<IPost.ISummary>> {
    const actor = kind === "home" ? await current(payload) : null;
    if (kind === "community" && communityId !== null && await MyGlobal.prisma.communities.findUnique({ where: { id: communityId }, select: { id: true } }) === null) throw ErrorUtil.notFound("Community was not found.");
    if (input.range !== undefined && input.range !== null && input.sort !== "top") throw ErrorUtil.unprocessable("A top time range requires top sorting.");
    const cursor = input.continuation === undefined || input.continuation === null ? null : decodeFeedCursor(input.continuation);
    const limit = pageSpec(cursor !== null && (input.limit === undefined || input.limit === null) ? { ...input, limit: cursor.limit } : input).limit;
    const sort = input.sort ?? "hot";
    const range = input.range ?? "all";
    const actorId = actor?.id ?? null;
    let reset = false;
    let ids: string[];
    let offset: number;
    if (cursor !== null && cursor.kind === kind && cursor.communityId === communityId && cursor.actorId === actorId && cursor.sort === sort && cursor.range === range && cursor.limit === limit && Number.isInteger(cursor.offset) && cursor.offset >= 0) {
      ids = cursor.ids;
      offset = cursor.offset;
    } else {
      reset = input.continuation !== undefined && input.continuation !== null;
      const posts = await MyGlobal.prisma.posts.findMany({ where: { deleted_at: null, ...(communityId === null ? {} : { community_id: communityId }), ...(actor === null ? {} : { community: { subscriptions: { some: { user_id: actor.id, ended_at: null } } } }) }, select: { id: true, created_at: true }, orderBy: { created_at: "desc" } });
      const sorted = await orderFeed(posts, sort, range);
      ids = sorted.map((item) => item.id);
      // An unusable continuation always starts a fresh traversal at its first
      // page, regardless of any page value supplied alongside the stale token.
      offset = cursor === null && (input.continuation === undefined || input.continuation === null)
        ? Math.max(0, (pageSpec(input).current - 1) * limit)
        : 0;
    }
    const available = await MyGlobal.prisma.posts.findMany({ where: { id: { in: ids }, deleted_at: null }, select: { id: true } });
    const availableIds = new Set(available.map((item) => item.id));
    const selected = ids.slice(offset, offset + limit).filter((id) => availableIds.has(id));
    const nextOffset = offset + limit;
    const continuation = nextOffset < ids.length ? encodeFeedCursor({ kind, communityId, actorId, sort, range, limit, offset: nextOffset, ids }) : null;
    return { data: await Promise.all(selected.map((id) => postSummary(id))), pagination: { ...pageInfo(Math.floor(offset / limit) + 1, limit, ids.length), continuation, ...(reset ? { reset: true } : {}) } };
  }

  export async function updatePost(payload: AuthPayload | null, id: string, body: IPost.IUpdate): Promise<IPost> {
    const actor = await current(payload);
    const post = await MyGlobal.prisma.posts.findUnique({ where: { id }, select: { id: true, author_id: true, type: true, deleted_at: true, community: { select: { status: true } } } });
    if (post === null || post.deleted_at !== null) throw ErrorUtil.notFound("Post was not found.");
    if (post.author_id !== actor.id) throw ErrorUtil.forbidden("Only the post author may edit it.");
    if (post.community.status !== "active") throw ErrorUtil.forbidden("Archived community content cannot be edited.");
    if (body.title === null || body.text === null || body.url === null || body.image === null) throw ErrorUtil.unprocessable("Null is not a valid post edit value; omit unchanged fields.");
    const provided = [body.text !== undefined, body.url !== undefined, body.image !== undefined].filter(Boolean).length;
    if ((post.type === "text" && body.url !== undefined) || (post.type === "link" && (body.text !== undefined || body.image !== undefined)) || (post.type === "image" && (body.text !== undefined || body.url !== undefined)) || provided > 1) throw ErrorUtil.unprocessable("Post type and payload cannot change.");
    if (body.text !== undefined && (body.text.trim().length === 0 || body.text.length > 40000)) throw ErrorUtil.unprocessable("Text payload is invalid.");
    if (body.url !== undefined && !validPostUrl(body.url)) throw ErrorUtil.unprocessable("Link URL is invalid.");
    if (body.title !== undefined && body.title !== null && body.title.trim().length === 0) throw ErrorUtil.unprocessable({ message: "Title cannot be blank.", accessor: "body.title" });
    const image = body.image === undefined ? undefined : await createMedia(body.image, true);
    await MyGlobal.prisma.posts.update({ where: { id }, data: { title: body.title === undefined || body.title === null ? undefined : body.title.trim(), text: post.type === "text" && body.text !== undefined ? body.text.trim() : undefined, url: post.type === "link" && body.url !== undefined ? body.url.trim() : undefined, image_media_id: post.type === "image" && image !== undefined ? image.id : undefined } });
    return postAt(id);
  }

  export async function deleteOwnPost(payload: AuthPayload | null, id: string): Promise<boolean> { const actor = await current(payload); const post = await activePost(id); if (post.author_id !== actor.id) throw ErrorUtil.forbidden("Only the post author may delete it."); await removePost(id); return true; }
  export async function deleteModeratedPost(payload: AuthPayload | null, id: string): Promise<boolean> { const actor = await current(payload); const post = await activePost(id); await assertModerator(actor.id, post.community_id); await MyGlobal.prisma.$transaction(async (tx) => { const comments = await tx.comments.findMany({ where: { post_id: id }, select: { id: true } }); await tx.moderation_histories.create({ data: { id: randomUUID(), community_id: post.community_id, kind: "deleted", target_description: null, target_post_id: null, target_comment_id: null, reason: null, subject_id: post.author_id, actor_id: actor.id, created_at: new Date() } }); await tx.moderation_histories.updateMany({ where: { target_post_id: id }, data: { target_post_id: null, target_description: null } }); if (comments.length !== 0) await tx.moderation_histories.updateMany({ where: { target_comment_id: { in: comments.map((comment) => comment.id) } }, data: { target_comment_id: null, target_description: null } }); await tx.posts.delete({ where: { id } }); }); return true; }

  export async function createComment(payload: AuthPayload | null, body: IComment.ICreate): Promise<IComment> {
    const actor = await current(payload);
    const post = await activePost(body.postId);
    await eligibleCommunity(actor.id, post.community_id, false);
    const text = body.text.trim();
    if (text.length === 0) throw ErrorUtil.unprocessable({ message: "Comment cannot be blank.", accessor: "body.text" });
    if (body.parentId !== undefined && body.parentId !== null) {
      const parent = await MyGlobal.prisma.comments.findUnique({ where: { id: body.parentId }, select: { post_id: true, deleted_at: true } });
      if (parent === null || parent.deleted_at !== null || parent.post_id !== body.postId) throw ErrorUtil.unprocessable("Reply parent is invalid.");
    }
    const comment = await MyGlobal.prisma.comments.create({ data: { id: randomUUID(), text, author_id: actor.id, post_id: body.postId, parent_id: body.parentId ?? null, created_at: new Date() }, select: { id: true } });
    return commentAt(comment.id);
  }

  export async function comments(postId: string, input: IComment.IRequest = {}): Promise<IPage<IComment>> {
    await activePost(postId);
    const sort = input.sort ?? "best";
    const scope = `comments:${postId}`;
    const supplied = input.continuation !== undefined && input.continuation !== null;
    const cursor = supplied ? decodeCommentCursor(input.continuation as string) : null;
    const spec = pageSpec(cursor !== null && (input.limit === undefined || input.limit === null) ? { ...input, limit: cursor.limit } : input);
    const valid = cursor !== null && cursor.scope === scope && cursor.sort === sort && cursor.limit === spec.limit && Number.isInteger(cursor.current) && cursor.current >= 1;
    let ids: string[];
    let current: number;
    if (valid) { ids = cursor.ids; current = cursor.current; }
    else {
      const roots = await MyGlobal.prisma.comments.findMany({ where: { post_id: postId, parent_id: null }, select: { id: true } });
      const trees = await Promise.all(roots.map((root) => commentTree(root.id, sort)));
      trees.sort((a, b) => compareCommentRank(a.rank, b.rank, sort));
      ids = trees.map((tree) => tree.item.id);
      current = supplied ? 1 : spec.current;
    }
    const available = await MyGlobal.prisma.comments.findMany({ where: { id: { in: ids } }, select: { id: true } });
    const availableIds = new Set(available.map((root) => root.id));
    const selected = ids.slice((current - 1) * spec.limit, current * spec.limit).filter((id) => availableIds.has(id));
    const records = ids.length;
    const continuation = current * spec.limit < records ? encodeCommentCursor({ scope, sort, limit: spec.limit, current: current + 1, ids }) : null;
    return { data: await Promise.all(selected.map((id) => commentAt(id, sort))), pagination: pageInfo(current, spec.limit, records, continuation, supplied && !valid) };
  }

  export async function updateComment(payload: AuthPayload | null, id: string, body: IComment.IUpdate): Promise<IComment> { const actor = await current(payload); const comment = await activeComment(id); if (comment.author_id !== actor.id) throw ErrorUtil.forbidden("Only the comment author may edit it."); if (comment.post.community.status !== "active") throw ErrorUtil.forbidden("Archived community content cannot be edited."); if (body.text.trim().length === 0) throw ErrorUtil.unprocessable("Comment cannot be blank."); await MyGlobal.prisma.comments.update({ where: { id }, data: { text: body.text.trim() } }); return commentAt(id); }
  export async function deleteOwnComment(payload: AuthPayload | null, id: string): Promise<boolean> { const actor = await current(payload); const comment = await activeComment(id); if (comment.author_id !== actor.id) throw ErrorUtil.forbidden("Only the comment author may delete it."); await removeComment(id); return true; }
  export async function deleteModeratedComment(payload: AuthPayload | null, id: string): Promise<boolean> { const actor = await current(payload); const comment = await activeComment(id); await assertModerator(actor.id, comment.post.community_id); await MyGlobal.prisma.$transaction(async (tx) => { await tx.moderation_histories.create({ data: { id: randomUUID(), community_id: comment.post.community_id, kind: "deleted", target_description: null, target_post_id: null, target_comment_id: null, reason: null, subject_id: comment.author_id, actor_id: actor.id, created_at: new Date() } }); await tx.moderation_histories.updateMany({ where: { target_comment_id: id }, data: { target_comment_id: null, target_description: null } }); const children = await tx.comments.count({ where: { parent_id: id } }); await tx.votes.deleteMany({ where: { comment_id: id } }); await tx.reports.deleteMany({ where: { comment_id: id } }); if (children === 0) await tx.comments.delete({ where: { id } }); else await tx.comments.update({ where: { id }, data: { text: null, author_id: null, deleted_at: new Date() } }); }); return true; }

  export async function vote(payload: AuthPayload | null, body: IVoteRequest): Promise<IVote> {
    const actor = await current(payload);
    const target = await targetCommunity(body.postId, body.commentId);
    if (target.status !== "active") throw ErrorUtil.forbidden("Archived communities do not accept votes.");
    const where = body.postId ? { user_id_post_id: { user_id: actor.id, post_id: body.postId } } : { user_id_comment_id: { user_id: actor.id, comment_id: body.commentId as string } };
    const existing = await MyGlobal.prisma.votes.findUnique({ where });
    if (existing === null) await MyGlobal.prisma.votes.create({ data: { id: randomUUID(), user_id: actor.id, post_id: body.postId ?? null, comment_id: body.commentId ?? null, value: body.value, created_at: new Date() } });
    else if (existing.value !== body.value) await MyGlobal.prisma.votes.update({ where: { id: existing.id }, data: { value: body.value, created_at: new Date() } });
    return { id: (await MyGlobal.prisma.votes.findUniqueOrThrow({ where })).id, postId: body.postId ?? null, commentId: body.commentId ?? null, value: body.value };
  }

  export async function removeVote(payload: AuthPayload | null, body: IVoteRequest): Promise<boolean> { const actor = await current(payload); const target = await targetCommunity(body.postId, body.commentId); if (target.status !== "active") throw ErrorUtil.forbidden("Archived communities do not accept votes."); await MyGlobal.prisma.votes.deleteMany({ where: { user_id: actor.id, post_id: body.postId ?? undefined, comment_id: body.commentId ?? undefined } }); return true; }
  export async function removeVoteTarget(payload: AuthPayload | null, postId: string | null, commentId: string | null): Promise<boolean> { const actor = await current(payload); const target = await targetCommunity(postId, commentId); if (target.status !== "active") throw ErrorUtil.forbidden("Archived communities do not accept votes."); await MyGlobal.prisma.votes.deleteMany({ where: { user_id: actor.id, post_id: postId ?? undefined, comment_id: commentId ?? undefined } }); return true; }

  export async function report(payload: AuthPayload | null, body: IReportCreate): Promise<IReport> { const actor = await current(payload); const target = await targetCommunity(body.postId, body.commentId); if (target.status !== "active") throw ErrorUtil.forbidden("Archived communities do not accept reports."); const reason = body.reason.trim(); if (reason.length === 0 || reason.length > 2000) throw ErrorUtil.unprocessable("Report reason must contain 1 through 2000 characters."); const existing = await MyGlobal.prisma.reports.findFirst({ where: { reporter_id: actor.id, status: "unresolved", post_id: body.postId ?? undefined, comment_id: body.commentId ?? undefined } }); if (existing !== null) throw ErrorUtil.conflict("An unresolved report already exists for this target."); const created = await MyGlobal.prisma.reports.create({ data: { id: randomUUID(), reporter_id: actor.id, community_id: target.id, post_id: body.postId ?? null, comment_id: body.commentId ?? null, reason, status: "unresolved", created_at: new Date() }, select: { id: true } }); return reportAt(created.id); }
  export async function reports(payload: AuthPayload | null, communityId: string, input: IPage.IRequest = {}): Promise<IPage<IReport>> { const actor = await current(payload); await assertModerator(actor.id, communityId); return page(input, `reports:${communityId}`, () => MyGlobal.prisma.reports.count({ where: { community_id: communityId, status: "unresolved" } }), (skip, take) => MyGlobal.prisma.reports.findMany({ where: { community_id: communityId, status: "unresolved" }, orderBy: [{ created_at: "desc" }, { id: "desc" }], skip, take, select: { id: true } }), (row) => reportAt(row.id)); }
  export async function decideReport(payload: AuthPayload | null, id: string, decision: "approved" | "dismissed"): Promise<boolean> {
    const actor = await current(payload);
    const report = await MyGlobal.prisma.reports.findUnique({ where: { id }, select: { id: true, status: true, community_id: true, post_id: true, comment_id: true, reporter_id: true, reason: true } });
    if (report === null || report.status !== "unresolved") throw ErrorUtil.notFound("Unresolved report was not found.");
    await assertModerator(actor.id, report.community_id);
    const targetDescription = report.post_id === null ? (await MyGlobal.prisma.comments.findUnique({ where: { id: report.comment_id as string }, select: { text: true } }))?.text ?? null : (await MyGlobal.prisma.posts.findUnique({ where: { id: report.post_id }, select: { title: true } }))?.title ?? null;
    await MyGlobal.prisma.$transaction(async (tx) => {
      const claimed = await tx.reports.updateMany({ where: { id, status: "unresolved" }, data: { status: decision, decided_at: new Date(), decided_by_id: actor.id } });
      if (claimed.count !== 1) throw ErrorUtil.notFound("Unresolved report was not found.");
      await tx.moderation_histories.create({ data: { id: randomUUID(), community_id: report.community_id, kind: decision, target_description: decision === "dismissed" ? targetDescription : null, target_post_id: decision === "dismissed" ? report.post_id : null, target_comment_id: decision === "dismissed" ? report.comment_id : null, reason: report.reason, subject_id: report.reporter_id, actor_id: actor.id, created_at: new Date() } });
      if (decision === "approved") {
        if (report.post_id !== null) { const comments = await tx.comments.findMany({ where: { post_id: report.post_id }, select: { id: true } }); await tx.moderation_histories.updateMany({ where: { target_post_id: report.post_id }, data: { target_post_id: null, target_description: null } }); if (comments.length !== 0) await tx.moderation_histories.updateMany({ where: { target_comment_id: { in: comments.map((comment) => comment.id) } }, data: { target_comment_id: null, target_description: null } }); await tx.posts.delete({ where: { id: report.post_id } }); }
        else if (report.comment_id !== null) {
          const children = await tx.comments.count({ where: { parent_id: report.comment_id } });
          await tx.votes.deleteMany({ where: { comment_id: report.comment_id } });
          await tx.reports.deleteMany({ where: { comment_id: report.comment_id } });
          await tx.moderation_histories.updateMany({ where: { target_comment_id: report.comment_id }, data: { target_comment_id: null, target_description: null } });
          if (children === 0) await tx.comments.delete({ where: { id: report.comment_id } });
          else await tx.comments.update({ where: { id: report.comment_id }, data: { text: null, author_id: null, deleted_at: new Date() } });
        }
        await tx.reports.deleteMany({ where: { post_id: report.post_id ?? undefined, comment_id: report.comment_id ?? undefined, status: "unresolved" } });
      }
    });
    return true;
  }

  export async function assignModerator(payload: AuthPayload | null, communityId: string, userId: string): Promise<boolean> { const actor = await current(payload); await assertOwnerOrModerator(actor.id, communityId); await activeCommunity(communityId); const target = await activeUser(userId); const existing = await MyGlobal.prisma.moderators.findUnique({ where: { user_id_community_id: { user_id: target.id, community_id: communityId } } }); if (existing === null) await MyGlobal.prisma.moderators.create({ data: { id: randomUUID(), user_id: target.id, community_id: communityId, created_at: new Date() } }); return true; }
  export async function removeModerator(payload: AuthPayload | null, communityId: string, userId: string): Promise<boolean> { const actor = await current(payload); const community = await activeCommunity(communityId); if (community.owner_id !== actor.id) throw ErrorUtil.forbidden("Only the community owner may remove moderators."); if (community.owner_id === userId) throw ErrorUtil.forbidden("The owner cannot be removed."); await activeUser(userId); const result = await MyGlobal.prisma.moderators.deleteMany({ where: { community_id: communityId, user_id: userId } }); return result.count === 1; }
  export async function ban(payload: AuthPayload | null, communityId: string, userId: string): Promise<boolean> { const actor = await current(payload); const community = await assertModerator(actor.id, communityId); if (community.owner_id === userId) throw ErrorUtil.forbidden("The community owner cannot be banned."); await activeUser(userId); const existing = await MyGlobal.prisma.bans.findUnique({ where: { user_id_community_id: { user_id: userId, community_id: communityId } } }); if (existing === null) await MyGlobal.prisma.$transaction(async (tx) => { const now = new Date(); await tx.bans.create({ data: { id: randomUUID(), user_id: userId, community_id: communityId, actor_id: actor.id, created_at: now } }); await tx.moderation_histories.create({ data: { id: randomUUID(), community_id: communityId, kind: "banned", target_description: null, reason: null, subject_id: userId, actor_id: actor.id, created_at: now } }); }); else if (existing.ended_at !== null) await MyGlobal.prisma.$transaction(async (tx) => { const now = new Date(); await tx.bans.update({ where: { id: existing.id }, data: { ended_at: null, actor_id: actor.id, created_at: now } }); await tx.moderation_histories.create({ data: { id: randomUUID(), community_id: communityId, kind: "banned", target_description: null, reason: null, subject_id: userId, actor_id: actor.id, created_at: now } }); }); return true; }
  export async function unban(payload: AuthPayload | null, communityId: string, userId: string): Promise<boolean> { const actor = await current(payload); await assertModerator(actor.id, communityId); await activeUser(userId); const existing = await MyGlobal.prisma.bans.findUnique({ where: { user_id_community_id: { user_id: userId, community_id: communityId } }, select: { id: true, ended_at: true } }); if (existing?.ended_at === null) { await MyGlobal.prisma.$transaction(async (tx) => { const now = new Date(); await tx.bans.update({ where: { id: existing.id }, data: { ended_at: now } }); await tx.moderation_histories.create({ data: { id: randomUUID(), community_id: communityId, kind: "unbanned", target_description: null, reason: null, subject_id: userId, actor_id: actor.id, created_at: now } }); }); return true; } return false; }
  export async function banned(payload: AuthPayload | null, communityId: string, input: IPage.IRequest = {}): Promise<IPage<IBan>> { const actor = await current(payload); await assertModerator(actor.id, communityId); return page(input, `bans:${communityId}`, () => MyGlobal.prisma.bans.count({ where: { community_id: communityId, ended_at: null } }), (skip, take) => MyGlobal.prisma.bans.findMany({ where: { community_id: communityId, ended_at: null }, orderBy: [{ created_at: "desc" }, { id: "desc" }], skip, take, select: { id: true, user_id: true, actor_id: true, created_at: true } }), async (row) => ({ id: row.id, userId: row.user_id, username: (await activeUser(row.user_id)).username, actor: row.actor_id === null ? "Deleted user" : (await activeUser(row.actor_id)).username, createdAt: row.created_at.toISOString() })); }
  export async function history(payload: AuthPayload | null, communityId: string, input: IPage.IRequest = {}): Promise<IPage<IModerationHistory>> { const actor = await current(payload); await assertModerator(actor.id, communityId); return page(input, `history:${communityId}`, () => MyGlobal.prisma.moderation_histories.count({ where: { community_id: communityId } }), (skip, take) => MyGlobal.prisma.moderation_histories.findMany({ where: { community_id: communityId }, orderBy: [{ created_at: "desc" }, { id: "desc" }], skip, take, select: { id: true, kind: true, target_description: true, reason: true, subject_id: true, actor_id: true, created_at: true } }), async (row) => { const [subject, actorUser] = await Promise.all([row.subject_id === null ? null : MyGlobal.prisma.users.findUnique({ where: { id: row.subject_id }, select: { username: true, deleted_at: true } }), row.actor_id === null ? null : MyGlobal.prisma.users.findUnique({ where: { id: row.actor_id }, select: { username: true, deleted_at: true } })]); return { id: row.id, kind: row.kind as IModerationHistory["kind"], subject: subject?.deleted_at === null ? subject.username : null, actor: actorUser?.deleted_at === null ? actorUser.username : null, reason: row.reason, target: row.target_description, createdAt: row.created_at.toISOString() }; }); }

  async function current(payload: AuthPayload | null): Promise<Actor> { if (payload === null || payload.kind !== "access" || payload.exp <= Math.floor(Date.now() / 1000)) throw ErrorUtil.unauthorized("Authentication is required."); const session = await MyGlobal.prisma.sessions.findFirst({ where: { id: payload.session_id, user_id: payload.id, revoked_at: null, user: { deleted_at: null } }, select: { id: true, user_id: true } }); if (session === null) throw ErrorUtil.unauthorized("Session is no longer active."); await MyGlobal.prisma.sessions.update({ where: { id: session.id }, data: { last_used_at: new Date() } }); return { id: session.user_id, session_id: session.id }; }
  async function authorized(id: string, username: string, session_id: string): Promise<IAuth.IAuthorized> { const tokens = AuthUtil.issue(id, session_id); return { ...tokens, user: { id, username } }; }
  async function activeUser(id: string) { const user = await MyGlobal.prisma.users.findUnique({ where: { id }, select: { id: true, username: true, deleted_at: true } }); if (user === null || user.deleted_at !== null) throw ErrorUtil.notFound("User was not found."); return user; }
  async function activeCommunity(id: string) { const community = await MyGlobal.prisma.communities.findUnique({ where: { id }, select: { id: true, owner_id: true, status: true } }); if (community === null) throw ErrorUtil.notFound("Community was not found."); if (community.status !== "active") throw ErrorUtil.forbidden("Archived communities are read-only."); return community; }
  async function eligibleCommunity(userId: string, id: string, requireSubscription: boolean) { const community = await activeCommunity(id); const ban = await MyGlobal.prisma.bans.findUnique({ where: { user_id_community_id: { user_id: userId, community_id: id } }, select: { ended_at: true } }); if (ban?.ended_at === null) throw ErrorUtil.forbidden("You are banned from participating in this community."); if (requireSubscription && await MyGlobal.prisma.subscriptions.findUnique({ where: { user_id_community_id: { user_id: userId, community_id: id } }, select: { ended_at: true } }).then((item) => item?.ended_at !== null && item !== undefined)) throw ErrorUtil.forbidden("An active subscription is required."); if (requireSubscription && await MyGlobal.prisma.subscriptions.findUnique({ where: { user_id_community_id: { user_id: userId, community_id: id } } }).then((item) => item === null)) throw ErrorUtil.forbidden("An active subscription is required."); return community; }
  async function assertModerator(userId: string, communityId: string) { const community = await activeCommunity(communityId); if (community.owner_id === userId) return community; if (await MyGlobal.prisma.moderators.findUnique({ where: { user_id_community_id: { user_id: userId, community_id: communityId } } }) === null) throw ErrorUtil.forbidden("Current moderation authority is required."); return community; }
  async function assertOwnerOrModerator(userId: string, communityId: string) { return assertModerator(userId, communityId); }
  async function activePost(id: string) { const post = await MyGlobal.prisma.posts.findUnique({ where: { id }, select: { id: true, author_id: true, community_id: true, deleted_at: true, community: { select: { status: true } } } }); if (post === null || post.deleted_at !== null) throw ErrorUtil.notFound("Post was not found."); return post; }
  async function activeComment(id: string) { const comment = await MyGlobal.prisma.comments.findUnique({ where: { id }, select: { id: true, author_id: true, post_id: true, deleted_at: true, post: { select: { community_id: true, community: { select: { status: true } } } } } }); if (comment === null || comment.deleted_at !== null) throw ErrorUtil.notFound("Comment was not found."); return comment; }
  async function targetCommunity(postId: string | null | undefined, commentId: string | null | undefined) { if ((postId === undefined || postId === null) === (commentId === undefined || commentId === null)) throw ErrorUtil.unprocessable("Exactly one target is required."); if (postId !== undefined && postId !== null) { const post = await activePost(postId); return activeCommunity(post.community_id); } const comment = await activeComment(commentId as string); return activeCommunity(comment.post.community_id); }
  async function removePost(id: string) { await MyGlobal.prisma.$transaction(async (tx) => { const comments = await tx.comments.findMany({ where: { post_id: id }, select: { id: true } }); await tx.moderation_histories.updateMany({ where: { target_post_id: id }, data: { target_post_id: null, target_description: null } }); if (comments.length !== 0) await tx.moderation_histories.updateMany({ where: { target_comment_id: { in: comments.map((comment) => comment.id) } }, data: { target_comment_id: null, target_description: null } }); await tx.posts.delete({ where: { id } }); }); }
  async function removeComment(id: string) { await MyGlobal.prisma.$transaction(async (tx) => { await tx.moderation_histories.updateMany({ where: { target_comment_id: id }, data: { target_comment_id: null, target_description: null } }); const children = await tx.comments.count({ where: { parent_id: id } }); await tx.votes.deleteMany({ where: { comment_id: id } }); await tx.reports.deleteMany({ where: { comment_id: id } }); if (children === 0) await tx.comments.delete({ where: { id } }); else await tx.comments.update({ where: { id }, data: { text: null, author_id: null, deleted_at: new Date() } }); }); }
  async function communityAt(id: string): Promise<ICommunity> { const community = await MyGlobal.prisma.communities.findUnique({ where: { id }, select: { id: true, name: true, description: true, status: true, owner_id: true, icon: true } }); if (community === null) throw ErrorUtil.notFound("Community was not found."); const icon = mediaOutput(community.icon); if (icon === null) throw ErrorUtil.internal("Community icon is missing."); return { id: community.id, name: community.name, description: community.description, status: community.status as "active" | "archived", owner: community.owner_id === null ? null : { id: community.owner_id }, icon, subscriberCount: await MyGlobal.prisma.subscriptions.count({ where: { community_id: id, ended_at: null } }) }; }
  async function postAt(id: string): Promise<IPost> { const post = await MyGlobal.prisma.posts.findUnique({ where: { id }, select: { id: true, title: true, type: true, text: true, url: true, created_at: true, image_media: true, author: { select: { id: true, username: true } }, community_id: true, deleted_at: true } }); if (post === null || post.deleted_at !== null) throw ErrorUtil.notFound("Post was not found."); return { id: post.id, title: post.title, type: post.type as IPost["type"], text: post.text, url: post.url, image: mediaOutput(post.image_media), author: post.author === null ? null : { id: post.author.id, username: post.author.username }, community: await communityAt(post.community_id), score: await score(post.id, "post"), commentCount: await MyGlobal.prisma.comments.count({ where: { post_id: post.id, deleted_at: null } }), createdAt: post.created_at.toISOString() }; }
  async function postSummary(id: string): Promise<IPost.ISummary> { const post = await postAt(id); return { id: post.id, title: post.title, type: post.type, preview: post.type === "text" ? (post.text ?? "").slice(0, 200) : post.type === "link" ? new URL(post.url ?? "https://invalid").hostname : (post.image?.thumbnail ?? ""), author: post.author?.username ?? "Deleted user", community: post.community.name, score: post.score, commentCount: post.commentCount, createdAt: post.createdAt }; }
  async function commentAt(id: string, sort: NonNullable<IComment.IRequest["sort"]> = "best"): Promise<IComment> { return (await commentTree(id, sort)).item; }
  interface CommentRank { score: number; total: number; ratio: number; createdAt: number; id: string; }
  interface CommentTree { item: IComment; rank: CommentRank; }
  async function commentTree(id: string, sort: NonNullable<IComment.IRequest["sort"]>): Promise<CommentTree> {
    const comment = await MyGlobal.prisma.comments.findUnique({ where: { id }, select: { id: true, text: true, deleted_at: true, created_at: true, author: { select: { username: true } }, replies: { select: { id: true } } } });
    if (comment === null) throw ErrorUtil.notFound("Comment was not found.");
    const children = await Promise.all(comment.replies.map((reply) => commentTree(reply.id, sort)));
    children.sort((a, b) => compareCommentRank(a.rank, b.rank, sort));
    const currentScore = await score(comment.id, "comment");
    const total = await MyGlobal.prisma.votes.count({ where: { comment_id: comment.id } });
    const currentRank: CommentRank = { score: currentScore, total, ratio: total / (Math.abs(currentScore) + 1), createdAt: comment.created_at.getTime(), id: comment.id };
    const rank = comment.deleted_at === null || children.length === 0 ? currentRank : children[0]!.rank;
    return { item: { id: comment.id, author: comment.deleted_at === null ? comment.author?.username ?? null : null, text: comment.deleted_at === null ? comment.text : null, score: comment.deleted_at === null ? currentScore : rank.score, createdAt: comment.created_at.toISOString(), replies: children.map((child) => child.item) }, rank };
  }
  function compareCommentRank(a: CommentRank, b: CommentRank, sort: NonNullable<IComment.IRequest["sort"]>): number {
    return sort === "new" ? b.createdAt - a.createdAt || b.id.localeCompare(a.id) : sort === "controversial" ? b.ratio - a.ratio || b.total - a.total || b.createdAt - a.createdAt || b.id.localeCompare(a.id) : b.score - a.score || a.createdAt - b.createdAt || a.id.localeCompare(b.id);
  }
  interface CommentCursor { scope: string; sort: NonNullable<IComment.IRequest["sort"]>; limit: number; current: number; ids: string[]; }
  function encodeCommentCursor(cursor: CommentCursor): string { const body = Buffer.from(JSON.stringify(cursor)).toString("base64url"); return `${body}.${createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url")}`; }
  function decodeCommentCursor(value: string): CommentCursor | null { const [body, signature] = value.split("."); if (body === undefined || signature === undefined) return null; const expected = createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url"); if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null; try { const cursor = JSON.parse(Buffer.from(body, "base64url").toString()) as CommentCursor; return typeof cursor.scope === "string" && Array.isArray(cursor.ids) && cursor.ids.every((id) => typeof id === "string") ? cursor : null; } catch { return null; } }
  async function reportAt(id: string): Promise<IReport> { const report = await MyGlobal.prisma.reports.findUnique({ where: { id }, select: { id: true, post_id: true, comment_id: true, reason: true, status: true, created_at: true, reporter: { select: { username: true } } } }); if (report === null) throw ErrorUtil.notFound("Report was not found."); const target = report.post_id === null ? await MyGlobal.prisma.comments.findUnique({ where: { id: report.comment_id as string }, select: { text: true } }) : await MyGlobal.prisma.posts.findUnique({ where: { id: report.post_id }, select: { title: true } }); return { id: report.id, targetKind: report.post_id === null ? "comment" : "post", targetId: (report.post_id ?? report.comment_id) as string, target: target === null ? null : ("title" in target ? target.title : target.text), reporter: report.reporter?.username ?? "Deleted user", reason: report.reason, createdAt: report.created_at.toISOString(), status: report.status as IReport["status"] }; }
  async function authoredPosts(userId: string, input: IPage.IRequest): Promise<IPage<IPost.ISummary>> { return page(input, `profile-posts:${userId}`, () => MyGlobal.prisma.posts.count({ where: { author_id: userId, deleted_at: null } }), (skip, take) => MyGlobal.prisma.posts.findMany({ where: { author_id: userId, deleted_at: null }, orderBy: [{ created_at: "desc" }, { id: "desc" }], skip, take, select: { id: true } }), (row) => postSummary(row.id)); }
  async function authoredComments(userId: string, input: IPage.IRequest): Promise<IPage<IComment.ISummary>> { return page(input, `profile-comments:${userId}`, () => MyGlobal.prisma.comments.count({ where: { author_id: userId, deleted_at: null } }), (skip, take) => MyGlobal.prisma.comments.findMany({ where: { author_id: userId, deleted_at: null }, orderBy: [{ created_at: "desc" }, { id: "desc" }], skip, take, select: { id: true, post_id: true, text: true, created_at: true } }), async (row) => ({ id: row.id, postId: row.post_id, text: row.text, score: await score(row.id, "comment"), createdAt: row.created_at.toISOString() })); }
  async function karma(userId: string): Promise<number> { const [posts, comments] = await Promise.all([MyGlobal.prisma.votes.aggregate({ where: { post: { author_id: userId, deleted_at: null } }, _sum: { value: true } }), MyGlobal.prisma.votes.aggregate({ where: { comment: { author_id: userId, deleted_at: null } }, _sum: { value: true } })]); return (posts._sum.value ?? 0) + (comments._sum.value ?? 0); }
  async function score(id: string, kind: "post" | "comment"): Promise<number> { const result = await MyGlobal.prisma.votes.aggregate({ where: kind === "post" ? { post_id: id } : { comment_id: id }, _sum: { value: true } }); return result._sum.value ?? 0; }
  async function orderFeed(posts: { id: string; created_at: Date }[], sort: NonNullable<IPost.IRequest["sort"]>, range: NonNullable<IPost.IRequest["range"]>) { const snapshot = Date.now(); const cutoff = range === "today" ? 86_400_000 : range === "week" ? 604_800_000 : range === "month" ? 2_592_000_000 : range === "year" ? 31_536_000_000 : Number.POSITIVE_INFINITY; const ranked = await Promise.all(posts.filter((post) => sort !== "top" || snapshot - post.created_at.getTime() <= cutoff).map(async (post) => { const [postScore, total] = await Promise.all([score(post.id, "post"), MyGlobal.prisma.votes.count({ where: { post_id: post.id } })]); const age = Math.max(0, (snapshot - post.created_at.getTime()) / 3_600_000); const hot = Math.log10(Math.max(postScore, 1)) - age / 12.5; const controversial = total / (Math.abs(postScore) + 1); return { ...post, postScore, total, hot, controversial }; })); return ranked.sort((a, b) => sort === "new" ? b.created_at.getTime() - a.created_at.getTime() || b.id.localeCompare(a.id) : sort === "top" ? b.postScore - a.postScore || b.created_at.getTime() - a.created_at.getTime() || b.id.localeCompare(a.id) : sort === "controversial" ? b.controversial - a.controversial || b.total - a.total || b.created_at.getTime() - a.created_at.getTime() || b.id.localeCompare(a.id) : b.hot - a.hot || b.created_at.getTime() - a.created_at.getTime() || b.id.localeCompare(a.id)); }
  async function createMedia(input: IMedia.ICreate, postImage: boolean = false): Promise<{ id: string }> {
    const accepted = new Set(["image/jpeg", "image/png", "image/webp"]);
    const dataUrl = /^data:([^;,]+);base64,([A-Za-z0-9+/]*={0,2})$/.exec(input.data);
    const payload: string = dataUrl === null ? input.data : dataUrl[2]!;
    if (dataUrl !== null && dataUrl[1] !== input.mimeType) throw ErrorUtil.unprocessable("Image MIME type does not match its data URL.");
    if (payload.length === 0 || payload.length % 4 === 1 || /[^A-Za-z0-9+/=]/.test(payload) || /=[^=]/.test(payload)) throw ErrorUtil.unprocessable("Image data is corrupt.");
    let bytes: Buffer;
    try { bytes = Buffer.from(payload, "base64"); } catch { throw ErrorUtil.unprocessable("Image data is corrupt."); }
    const canonical = bytes.toString("base64").replace(/=+$/, "");
    if (canonical !== payload.replace(/=+$/, "")) throw ErrorUtil.unprocessable("Image data is corrupt.");
    const signature = bytes.toString("hex", 0, 12);
    const signatureValid = input.mimeType === "image/png" ? signature.startsWith("89504e470d0a1a0a") : input.mimeType === "image/jpeg" ? signature.startsWith("ffd8ff") : signature.startsWith("52494646") && bytes.toString("ascii", 8, 12) === "WEBP";
    const dimensions = imageDimensions(input.mimeType, bytes);
    const decodable = input.mimeType === "image/png" ? validPng(bytes) : input.mimeType === "image/jpeg" ? validJpeg(bytes) : validWebp(bytes);
    if (!accepted.has(input.mimeType) || !signatureValid || !decodable || bytes.length > 10 * 1024 * 1024 || dimensions === null || dimensions.width !== input.width || dimensions.height !== input.height) throw ErrorUtil.unprocessable("Image must be a valid JPEG, PNG, or WebP no larger than 10 MiB.");
    return MyGlobal.prisma.media.create({ data: { id: randomUUID(), mime_type: input.mimeType, data: input.data, thumbnail_data: postImage ? thumbnailData(input, bytes, dimensions) : null, width: dimensions.width, height: dimensions.height, created_at: new Date() }, select: { id: true } });
  }
  function thumbnailData(input: IMedia.ICreate, bytes: Buffer, dimensions: { width: number; height: number }): string {
    if (dimensions.width <= 400 && dimensions.height <= 400) return input.data;
    if (input.mimeType === "image/png") {
      const resized = resizePng(bytes, dimensions.width, dimensions.height);
      if (resized !== null) return `data:image/png;base64,${resized.toString("base64")}`;
    }
    return boundedSvgThumbnail(input, dimensions);
  }
  function boundedSvgThumbnail(input: IMedia.ICreate, dimensions: { width: number; height: number }): string {
    const scale = Math.min(1, 400 / dimensions.width, 400 / dimensions.height);
    const width = Math.max(1, Math.round(dimensions.width * scale));
    const height = Math.max(1, Math.round(dimensions.height * scale));
    const source = input.data.startsWith("data:") ? input.data : `data:${input.mimeType};base64,${input.data}`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image href="${source}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"/></svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  }
  function resizePng(bytes: Buffer, width: number, height: number): Buffer | null {
    if (width * height > 16_000_000) return null;
    let offset = 8;
    let bitDepth = 0;
    let colorType = 0;
    let interlace = 0;
    const idat: Buffer[] = [];
    while (offset + 12 <= bytes.length) {
      const length = bytes.readUInt32BE(offset);
      const type = bytes.toString("ascii", offset + 4, offset + 8);
      const data = bytes.subarray(offset + 8, offset + 8 + length);
      if (offset + 12 + length > bytes.length) return null;
      if (type === "IHDR") { bitDepth = data[8]!; colorType = data[9]!; interlace = data[12]!; }
      if (type === "IDAT") idat.push(data);
      offset += length + 12;
      if (type === "IEND") break;
    }
    const bytesPerPixel = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 4 ? 2 : colorType === 0 ? 1 : 0;
    if (bitDepth !== 8 || bytesPerPixel === 0 || interlace !== 0 || idat.length === 0) return null;
    let decoded: Buffer;
    try { decoded = inflateSync(Buffer.concat(idat)); } catch { return null; }
    const stride = width * bytesPerPixel;
    if (decoded.length < (stride + 1) * height) return null;
    const pixels = Buffer.alloc(width * height * 4);
    const previous = Buffer.alloc(stride);
    let source = 0;
    for (let y = 0; y < height; y++) {
      const filter = decoded[source++]!;
      const row = Buffer.from(decoded.subarray(source, source + stride));
      source += stride;
      for (let x = 0; x < stride; x++) {
        const left = x >= bytesPerPixel ? row[x - bytesPerPixel]! : 0;
        const above = previous[x]!;
        const upperLeft = x >= bytesPerPixel ? previous[x - bytesPerPixel]! : 0;
        row[x] = filter === 0 ? row[x]! : filter === 1 ? (row[x]! + left) & 255 : filter === 2 ? (row[x]! + above) & 255 : filter === 3 ? (row[x]! + Math.floor((left + above) / 2)) & 255 : filter === 4 ? (row[x]! + paeth(left, above, upperLeft)) & 255 : 0;
      }
      for (let x = 0; x < width; x++) {
        const sourceIndex = x * bytesPerPixel;
        const targetIndex = (y * width + x) * 4;
        const value = row[sourceIndex]!;
        if (colorType === 6) row.copy(pixels, targetIndex, sourceIndex, sourceIndex + 4);
        else if (colorType === 2) { pixels[targetIndex] = value; pixels[targetIndex + 1] = row[sourceIndex + 1]!; pixels[targetIndex + 2] = row[sourceIndex + 2]!; pixels[targetIndex + 3] = 255; }
        else if (colorType === 4) { pixels[targetIndex] = value; pixels[targetIndex + 1] = value; pixels[targetIndex + 2] = value; pixels[targetIndex + 3] = row[sourceIndex + 1]!; }
        else { pixels[targetIndex] = value; pixels[targetIndex + 1] = value; pixels[targetIndex + 2] = value; pixels[targetIndex + 3] = 255; }
      }
      row.copy(previous);
    }
    const scale = Math.min(1, 400 / width, 400 / height);
    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));
    const raw = Buffer.alloc((targetWidth * 4 + 1) * targetHeight);
    for (let y = 0; y < targetHeight; y++) {
      const targetRow = y * (targetWidth * 4 + 1);
      for (let x = 0; x < targetWidth; x++) {
        const sourceIndex = (Math.min(height - 1, Math.floor(y / scale)) * width + Math.min(width - 1, Math.floor(x / scale))) * 4;
        pixels.copy(raw, targetRow + 1 + x * 4, sourceIndex, sourceIndex + 4);
      }
    }
    const header = Buffer.alloc(13);
    header.writeUInt32BE(targetWidth, 0); header.writeUInt32BE(targetHeight, 4); header[8] = 8; header[9] = 6;
    return Buffer.concat([Buffer.from("89504e470d0a1a0a", "hex"), pngChunk("IHDR", header), pngChunk("IDAT", deflateSync(raw)), pngChunk("IEND", Buffer.alloc(0))]);
  }
  function paeth(left: number, above: number, upperLeft: number): number { const estimate = left + above - upperLeft; const leftDistance = Math.abs(estimate - left); const aboveDistance = Math.abs(estimate - above); const upperLeftDistance = Math.abs(estimate - upperLeft); return leftDistance <= aboveDistance && leftDistance <= upperLeftDistance ? left : aboveDistance <= upperLeftDistance ? above : upperLeft; }
  function pngChunk(type: string, data: Buffer): Buffer { const header = Buffer.alloc(8); header.writeUInt32BE(data.length, 0); header.write(type, 4, "ascii"); const checksum = Buffer.alloc(4); checksum.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, "ascii"), data])), 0); return Buffer.concat([header, data, checksum]); }
  function crc32(data: Buffer): number { let crc = 0xffffffff; for (const value of data) { crc ^= value; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0); } return (crc ^ 0xffffffff) >>> 0; }
  function imageDimensions(mimeType: IMedia["mimeType"], bytes: Buffer): { width: number; height: number } | null {
    if (mimeType === "image/png" && bytes.length >= 24) return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
    if (mimeType === "image/webp") return webpDimensions(bytes);
    if (mimeType === "image/jpeg") {
      let offset = 2;
      while (offset + 9 < bytes.length) {
        if (bytes[offset] !== 0xff) { offset++; continue; }
        const marker = bytes[offset + 1]!;
        const length = bytes.readUInt16BE(offset + 2);
        if (marker >= 0xc0 && marker <= 0xc3 && offset + 8 < bytes.length) return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) };
        offset += 2 + length;
      }
    }
    return null;
  }
  function validPng(bytes: Buffer): boolean {
    if (bytes.length < 33 || bytes.toString("hex", 0, 8) !== "89504e470d0a1a0a") return false;
    let offset = 8;
    let width = 0;
    let height = 0;
    let bitDepth = 0;
    let colorType = 0;
    let interlace = 0;
    let hasIdat = false;
    let hasIend = false;
    let hasPalette = false;
    const idat: Buffer[] = [];
    while (offset + 12 <= bytes.length) {
      const length = bytes.readUInt32BE(offset);
      if (length > bytes.length - offset - 12) return false;
      const type = bytes.toString("ascii", offset + 4, offset + 8);
      const data = bytes.subarray(offset + 8, offset + 8 + length);
      const expected = bytes.readUInt32BE(offset + 8 + length);
      if (crc32(Buffer.concat([Buffer.from(type, "ascii"), data])) !== expected) return false;
      if (width === 0 && type !== "IHDR") return false;
      if (type === "IHDR") {
        if (length !== 13 || width !== 0) return false;
        width = data.readUInt32BE(0);
        height = data.readUInt32BE(4);
        bitDepth = data[8]!;
        colorType = data[9]!;
        interlace = data[12]!;
        const validBitDepth = colorType === 0 ? [1, 2, 4, 8, 16].includes(bitDepth) : colorType === 2 ? [8, 16].includes(bitDepth) : colorType === 3 ? [1, 2, 4, 8].includes(bitDepth) : colorType === 4 || colorType === 6 ? [8, 16].includes(bitDepth) : false;
        if (width === 0 || height === 0 || !validBitDepth || data[10] !== 0 || data[11] !== 0 || (interlace !== 0 && interlace !== 1)) return false;
      } else if (type === "PLTE") {
        if (hasPalette || hasIdat || length === 0 || length % 3 !== 0 || length > 768) return false;
        hasPalette = true;
      } else if (type === "IDAT") {
        hasIdat = true;
        idat.push(data);
      } else if (type === "IEND") {
        if (length !== 0) return false;
        hasIend = true;
        offset += 12;
        break;
      }
      offset += length + 12;
    }
    if (!hasIdat || !hasIend || offset !== bytes.length || width === 0 || height === 0 || colorType === 3 && !hasPalette) return false;
    let decoded: Buffer;
    try { decoded = inflateSync(Buffer.concat(idat)); } catch { return false; }
    if (decoded.length === 0) return false;
    const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 4 ? 2 : 1;
    const bitsPerPixel = channels * bitDepth;
    const passWidth = (start: number, step: number): number => width <= start ? 0 : Math.ceil((width - start) / step);
    const passHeight = (start: number, step: number): number => height <= start ? 0 : Math.ceil((height - start) / step);
    const passes = interlace === 0 ? [{ width, height }] : [[0, 8, 0, 8], [4, 8, 0, 8], [0, 4, 4, 8], [2, 4, 0, 4], [0, 2, 2, 4], [1, 2, 0, 2], [0, 1, 1, 2]].map(([x, dx, y, dy]) => ({ width: passWidth(x!, dx!), height: passHeight(y!, dy!) }));
    let expected = 0;
    for (const pass of passes) expected += (Math.ceil(pass.width * bitsPerPixel / 8) + 1) * pass.height;
    if (decoded.length !== expected) return false;
    let cursor = 0;
    for (const pass of passes) {
      const rowBytes = Math.ceil(pass.width * bitsPerPixel / 8);
      for (let row = 0; row < pass.height; row++) {
        if (decoded[cursor]! > 4) return false;
        cursor += rowBytes + 1;
      }
    }
    return true;
  }
  function validJpeg(bytes: Buffer): boolean {
    if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return false;
    let offset = 2;
    let frame = false;
    let scan = false;
    let entropy = false;
    while (offset < bytes.length) {
      if (bytes[offset++] !== 0xff) return false;
      while (offset < bytes.length && bytes[offset] === 0xff) offset++;
      if (offset >= bytes.length) return false;
      const marker = bytes[offset++]!;
      if (marker === 0x00) return false;
      if (marker === 0xd9) return offset === bytes.length && frame && scan && entropy;
      if (marker === 0xda) {
        if (offset + 2 > bytes.length) return false;
        const length = bytes.readUInt16BE(offset);
        if (length < 2 || offset + length > bytes.length) return false;
        offset += length;
        scan = true;
        while (offset < bytes.length) {
          if (bytes[offset] !== 0xff) { entropy = true; offset++; continue; }
          const markerOffset = offset;
          offset++;
          while (offset < bytes.length && bytes[offset] === 0xff) offset++;
          if (offset >= bytes.length) return false;
          const next = bytes[offset]!;
          if (next === 0x00) { entropy = true; offset++; continue; }
          if (next >= 0xd0 && next <= 0xd7) { offset++; continue; }
          offset = markerOffset;
          break;
        }
        if (offset >= bytes.length || bytes[offset] !== 0xff) return false;
        continue;
      }
      if (marker === 0x01 || marker >= 0xd0 && marker <= 0xd8) continue;
      if (offset + 2 > bytes.length) return false;
      const length = bytes.readUInt16BE(offset);
      if (length < 2 || offset + length > bytes.length) return false;
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        if (length < 8 || bytes.readUInt16BE(offset + 3) === 0 || bytes.readUInt16BE(offset + 5) === 0) return false;
        frame = true;
      }
      offset += length;
    }
    return false;
  }
  function validWebp(bytes: Buffer): boolean { return webpDimensions(bytes) !== null; }
  function webpDimensions(bytes: Buffer): { width: number; height: number } | null {
    if (bytes.length < 20 || bytes.toString("ascii", 0, 4) !== "RIFF" || bytes.readUInt32LE(4) + 8 !== bytes.length || bytes.toString("ascii", 8, 12) !== "WEBP") return null;
    let offset = 12;
    let dimensions: { width: number; height: number } | null = null;
    let image = false;
    while (offset + 8 <= bytes.length) {
      const size = bytes.readUInt32LE(offset + 4);
      if (size > bytes.length - offset - 8) return null;
      const type = bytes.toString("ascii", offset, offset + 4);
      const data = bytes.subarray(offset + 8, offset + 8 + size);
      if (type === "VP8X") { if (size !== 10 || dimensions !== null) return null; dimensions = { width: 1 + data.readUIntLE(4, 3), height: 1 + data.readUIntLE(7, 3) }; }
      if (type === "VP8 ") { if (size <= 10 || data[3] !== 0x9d || data[4] !== 0x01 || data[5] !== 0x2a) return null; if (dimensions === null) dimensions = { width: data.readUInt16LE(6) & 0x3fff, height: data.readUInt16LE(8) & 0x3fff }; image = true; }
      if (type === "VP8L") { if (size <= 5 || data[0] !== 0x2f) return null; if (dimensions === null) dimensions = { width: 1 + ((data[1]! | (data[2]! << 8)) & 0x3fff), height: 1 + (((data[2]! >> 6) | (data[3]! << 2) | ((data[4]! & 0x0f) << 10)) & 0x3fff) }; image = true; }
      offset += 8 + size + (size & 1);
    }
    return offset === bytes.length && dimensions !== null && image ? dimensions : null;
  }
  function mediaOutput(input: { id: string; mime_type: string; data: string; thumbnail_data: string | null; width: number; height: number } | null): IMedia | null { return input === null ? null : { id: input.id, mimeType: input.mime_type as IMedia["mimeType"], data: input.data, thumbnail: input.thumbnail_data, width: input.width, height: input.height }; }
  function validPostUrl(url: string): boolean { if (url.trim().length > 2048) return false; try { const parsed = new URL(url.trim()); return (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.hostname.length > 0; } catch { return false; } }
  function validatePassword(value: string, accessor: string): void { if (value.length < 8 || value.length > 128) throw ErrorUtil.unprocessable({ message: "Password must contain 8 through 128 characters.", accessor }); }
  function validatePost(type: IPost["type"], title: string, text: string | null | undefined, url: string | null | undefined, image: IMedia.ICreate | null | undefined): void { if (title.trim().length < 1 || title.trim().length > 300) throw ErrorUtil.unprocessable({ message: "Title is invalid.", accessor: "body.title" }); const count = [text !== undefined && text !== null, url !== undefined && url !== null, image !== undefined && image !== null].filter(Boolean).length; const validUrl = url !== undefined && url !== null && validPostUrl(url); if (count !== 1 || (type === "text" && (text === undefined || text === null || text.trim().length === 0 || text.length > 40000)) || (type === "link" && !validUrl) || (type === "image" && (image === undefined || image === null))) throw ErrorUtil.unprocessable("Exactly one valid type payload is required."); }
  interface FeedCursor { kind: "home" | "popular" | "community"; communityId: string | null; actorId: string | null; sort: NonNullable<IPost.IRequest["sort"]>; range: NonNullable<IPost.IRequest["range"]>; limit: number; offset: number; ids: string[]; }
  function encodeFeedCursor(cursor: FeedCursor): string { const body = Buffer.from(JSON.stringify(cursor)).toString("base64url"); return `${body}.${createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url")}`; }
  function decodeFeedCursor(value: string): FeedCursor | null { const [body, signature] = value.split("."); if (body === undefined || signature === undefined) return null; const expected = createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url"); if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null; try { const cursor = JSON.parse(Buffer.from(body, "base64url").toString()) as FeedCursor; return (cursor.kind === "home" || cursor.kind === "popular" || cursor.kind === "community") && (cursor.communityId === null || typeof cursor.communityId === "string") && (cursor.actorId === null || typeof cursor.actorId === "string") && Array.isArray(cursor.ids) && cursor.ids.every((id) => typeof id === "string") ? cursor : null; } catch { return null; } }
  function pageSpec(input: IPage.IRequest): { current: number; limit: number } { const current = input.page ?? 1; const limit = input.limit ?? 25; if (!Number.isInteger(current) || current < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) throw ErrorUtil.unprocessable("Page must be at least 1 and limit must be from 1 through 100."); return { current, limit }; }
  interface PageCursor { scope: string; limit: number; current: number; ids: string[]; }
  async function page<T extends object, R extends { id: string }>(input: IPage.IRequest, scope: string, count: () => Promise<number>, rows: (skip: number, take: number) => Promise<R[]>, transform: (row: R) => Promise<T>): Promise<IPage<T>> {
    const supplied = input.continuation !== undefined && input.continuation !== null;
    const cursor = supplied ? decodePageCursor(input.continuation as string) : null;
    const spec = pageSpec(cursor !== null && (input.limit === undefined || input.limit === null) ? { ...input, limit: cursor.limit } : input);
    const valid = cursor !== null && cursor.scope === scope && cursor.limit === spec.limit && Number.isInteger(cursor.current) && cursor.current >= 1 && Array.isArray(cursor.ids);
    const total = await count();
    const all = await rows(0, total);
    const ids = valid ? cursor.ids : all.map((row) => row.id);
    const current = valid ? cursor.current : supplied ? 1 : spec.current;
    const byId = new Map(all.map((row) => [row.id, row]));
    const selected = ids.slice((current - 1) * spec.limit, current * spec.limit).map((id) => byId.get(id)).filter((row): row is R => row !== undefined);
    const records = ids.length;
    const continuation = current * spec.limit < records ? encodePageCursor({ scope, limit: spec.limit, current: current + 1, ids }) : null;
    return { data: await Promise.all(selected.map(transform)), pagination: pageInfo(current, spec.limit, records, continuation, supplied && !valid) };
  }
  function pageInfo(current: number, limit: number, records: number, continuation: string | null = null, reset: boolean = false): IPage.IPagination { return { current, limit, records, pages: Math.ceil(records / limit), continuation, ...(reset ? { reset: true } : {}) }; }
  function encodePageCursor(cursor: PageCursor): string { const body = Buffer.from(JSON.stringify(cursor)).toString("base64url"); return `${body}.${createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url")}`; }
  function decodePageCursor(value: string): PageCursor | null { const [body, signature] = value.split("."); if (body === undefined || signature === undefined) return null; const expected = createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url"); if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null; try { const cursor = JSON.parse(Buffer.from(body, "base64url").toString()) as PageCursor; return typeof cursor.scope === "string" && Number.isInteger(cursor.limit) && Number.isInteger(cursor.current) && Array.isArray(cursor.ids) && cursor.ids.every((id) => typeof id === "string") ? cursor : null; } catch { return null; } }
}
