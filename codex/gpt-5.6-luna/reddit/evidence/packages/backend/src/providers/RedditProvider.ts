import type { IAuth, IBan, IComment, ICommunity, IPage, IPost, IProfile, IReport, ISubscription, IVote } from "@benchmark/reddit2-api";
import crypto from "node:crypto";
import { MyGlobal } from "../MyGlobal";
import { AuthUtil } from "../utils/AuthUtil";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Owns Reddit business rules, visibility, persistence, and transformations. */
export namespace RedditProvider {
  type Actor = AuthUtil.Payload;
  const now = () => new Date();
  interface Continuation {
    scope: string;
    ids: string[];
    page: number;
    limit: number;
  }
  const sign = (value: string): string => crypto.createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(value).digest("base64url");
  const encodeContinuation = (value: Continuation): string => {
    const body = Buffer.from(JSON.stringify(value)).toString("base64url");
    return `${body}.${sign(body)}`;
  };
  const decodeContinuation = (token: string): Continuation | null => {
    const [body, signature] = token.split(".");
    if (body === undefined || signature === undefined || signature !== sign(body)) return null;
    try {
      const value = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Continuation;
      if (!Array.isArray(value.ids) || typeof value.scope !== "string" || !Number.isInteger(value.page) || !Number.isInteger(value.limit)) return null;
      return value;
    } catch {
      return null;
    }
  };
  const page = <T extends object & { id: string }>(data: T[], input: IPage.IRequest | undefined, scope: string): IPage<T> => {
    const limit = input?.limit ?? 25;
    let current = input?.page ?? 1;
    let ordered = data;
    let reset = false;
    if (input?.continuation !== undefined && input.continuation !== null) {
      const continuation = decodeContinuation(input.continuation);
      if (continuation === null || continuation.scope !== scope || continuation.limit !== limit || continuation.page < 1) {
        current = 1;
        reset = true;
      } else {
        current = continuation.page;
        const byId = new Map(data.map((item) => [item.id, item]));
        ordered = continuation.ids.map((id) => byId.get(id)).filter((item): item is T => item !== undefined);
        if (ordered.length !== continuation.ids.length) {
          current = 1;
          ordered = data;
          reset = true;
        }
      }
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw ErrorUtil.unprocessable("Page size must be between 1 and 100.");
    if (!Number.isInteger(current) || current < 1) throw ErrorUtil.unprocessable("Page number must be at least 1.");
    const records = ordered.length;
    const start = (current - 1) * limit;
    const result = ordered.slice(start, start + limit);
    const next = start + limit < records
      ? encodeContinuation({ scope, ids: ordered.map((item) => item.id), page: current + 1, limit })
      : null;
    return { data: result, pagination: { current, limit, records, pages: Math.max(1, Math.ceil(records / limit)), continuation: next, reset } };
  };
  function validateImageReference(value: string, field: string): void {
    if (/^https?:\/\//i.test(value)) {
      if (!/\.(?:jpe?g|png|webp)(?:[?#].*)?$/i.test(value)) throw ErrorUtil.unprocessable(`${field} must reference a JPEG, PNG, or WebP image.`);
      return;
    }
    const match = /^data:image\/(jpeg|png|webp);base64,([a-z0-9+/=]+)$/i.exec(value);
    if (match === null) throw ErrorUtil.unprocessable(`${field} must be a JPEG, PNG, or WebP data image.`);
    const mime = match[1];
    const encoded = match[2];
    if (mime === undefined || encoded === undefined) throw ErrorUtil.unprocessable(`${field} must be a JPEG, PNG, or WebP data image.`);
    const bytes = Buffer.from(encoded, "base64");
    if (bytes.length > 10 * 1024 * 1024) throw ErrorUtil.unprocessable(`${field} must not exceed 10 MiB.`);
    const valid = mime.toLowerCase() === "jpeg"
      ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
      : mime.toLowerCase() === "png"
        ? bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
        : bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
    if (!valid) throw ErrorUtil.unprocessable(`${field} content does not match its declared image format.`);
  }
  function validateLinkReference(value: string): void {
    if (value.length > 2048) throw ErrorUtil.unprocessable("url must not exceed 2048 characters.");
    try {
      const parsed = new URL(value);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("scheme");
      if (parsed.hostname.length === 0) throw new Error("host");
    } catch {
      throw ErrorUtil.unprocessable("url must be an absolute HTTP or HTTPS URL.");
    }
  }
  async function user(id: string) {
    const value = await MyGlobal.prisma.users.findFirst({ where: { id, deleted_at: null }, select: { id: true, username: true } });
    if (value === null) throw ErrorUtil.notFound("User not found.");
    return value;
  }
  async function community(id: string) {
    const value = await MyGlobal.prisma.communities.findUnique({ where: { id } });
    if (value === null) throw ErrorUtil.notFound("Community not found.");
    return value;
  }
  export async function communityAt(id: string): Promise<ICommunity> {
    return communityDto(await community(id));
  }
  async function authority(actor: Actor, communityId: string) {
    const row = await MyGlobal.prisma.communities.findUnique({ where: { id: communityId }, select: { id: true, owner_id: true, status: true } });
    if (row === null) throw ErrorUtil.notFound("Community not found.");
    if (row.status !== "active") throw ErrorUtil.forbidden("Archived communities are read-only.");
    if (row.owner_id === actor.id) return row;
    const mod = await MyGlobal.prisma.moderators.findFirst({ where: { community_id: communityId, user_id: actor.id, revoked_at: null } });
    if (mod === null) throw ErrorUtil.forbidden("Community authority is required.");
    return row;
  }
  async function owner(actor: Actor, communityId: string) {
    const row = await authority(actor, communityId);
    if (row.owner_id !== actor.id) throw ErrorUtil.forbidden("Only the community owner may perform this action.");
    return row;
  }
  async function banned(userId: string, communityId: string) {
    return (await MyGlobal.prisma.bans.findFirst({ where: { user_id: userId, community_id: communityId, ended_at: null } })) !== null;
  }
  async function communityDto(row: { id: string; name: string; description: string; icon_url: string | null; status: string }) : Promise<ICommunity> {
    const subscriberCount = await MyGlobal.prisma.subscriptions.count({ where: { community_id: row.id, ended_at: null } });
    return { id: row.id, name: row.name, description: row.description, iconUrl: row.icon_url, status: row.status === "archived" ? "archived" : "active", subscriberCount };
  }
  async function postDto(row: { id: string; title: string; type: string; text: string | null; url: string | null; image_url: string | null; created_at: Date; updated_at: Date | null; author: { id: string; username: string }; community: { id: string; name: string }; votes: { value: number }[]; comments: { id: string }[] }): Promise<IPost> {
    return { id: row.id, title: row.title, type: row.type as IPost["type"], text: row.text, url: row.url, imageUrl: row.image_url, author: row.author, community: row.community, score: row.votes.reduce((sum, vote) => sum + vote.value, 0), commentCount: row.comments.length, createdAt: row.created_at.toISOString(), updatedAt: row.updated_at?.toISOString() ?? null };
  }
  async function postSummary(row: Parameters<typeof postDto>[0]): Promise<IPost.ISummary> {
    const full = await postDto(row);
    const linkPreview = (() => {
      if (full.url === null) return "";
      try { return new URL(full.url).hostname; } catch { return full.url; }
    })();
    return { id: full.id, title: full.title, type: full.type, preview: full.type === "text" ? (full.text ?? "").slice(0, 200) : full.type === "link" ? linkPreview : (full.imageUrl ?? ""), author: full.author, community: full.community, score: full.score, commentCount: full.commentCount, createdAt: full.createdAt };
  }
  async function post(id: string) {
    const row = await MyGlobal.prisma.posts.findFirst({ where: { id, deleted_at: null }, include: { author: { select: { id: true, username: true } }, community: { select: { id: true, name: true } }, votes: { select: { value: true } }, comments: { where: { deleted_at: null }, select: { id: true } } } });
    if (row === null) throw ErrorUtil.notFound("Post not found.");
    return row;
  }

  export async function profileAt(props: { username: string; posts?: IPage.IRequest; comments?: IPage.IRequest }): Promise<IProfile> {
    const row = await MyGlobal.prisma.users.findFirst({
      where: { username_normalized: props.username.toLowerCase(), deleted_at: null },
      include: {
        profile: true,
        authored_posts: {
          where: { deleted_at: null },
          include: {
            author: { select: { id: true, username: true } },
            community: { select: { id: true, name: true } },
            votes: { select: { value: true } },
            comments: { where: { deleted_at: null }, select: { id: true } },
          },
          orderBy: { created_at: "desc" },
        },
        authored_comments: { where: { deleted_at: null }, orderBy: { created_at: "desc" } },
      },
    });
    if (row === null || row.profile === null) throw ErrorUtil.notFound("Profile not found.");
    return { id: row.id, username: row.username, displayName: row.profile.display_name, bio: row.profile.bio, avatarUrl: row.profile.avatar_url, karma: row.profile.karma, posts: page(await Promise.all(row.authored_posts.map(postSummary)), props.posts, `profile:${row.id}:posts`), comments: page(row.authored_comments.map((comment) => ({ id: comment.id, text: comment.text, deleted: comment.deleted_at !== null, score: 0, createdAt: comment.created_at.toISOString() })), props.comments, `profile:${row.id}:comments`) };
  }
  export async function profileUpdate(props: { actor: Actor; body: IProfile.IUpdate }): Promise<IProfile> {
    if (props.body.displayName !== undefined && props.body.displayName !== null && props.body.displayName.trim().length === 0) throw ErrorUtil.unprocessable("Display name must not be blank.");
    if (props.body.avatarUrl !== undefined && props.body.avatarUrl !== null) validateImageReference(props.body.avatarUrl, "avatarUrl");
    const row = await MyGlobal.prisma.profiles.update({ where: { user_id: props.actor.id }, data: { ...(props.body.displayName !== undefined && props.body.displayName !== null ? { display_name: props.body.displayName } : {}), ...(props.body.bio !== undefined && props.body.bio !== null ? { bio: props.body.bio } : props.body.bio === null ? { bio: "" } : {}), ...(props.body.avatarUrl !== undefined ? { avatar_url: props.body.avatarUrl } : {}) } });
    return profileAt({ username: props.actor.username, posts: { limit: 25 }, comments: { limit: 25 } }).then((value) => ({ ...value, displayName: row.display_name, bio: row.bio, avatarUrl: row.avatar_url }));
  }

  export async function communityCreate(props: { actor: Actor; body: ICommunity.ICreate }): Promise<ICommunity> {
    const name = props.body.name.trim();
    if (name.length < 3 || name.length > 80 || props.body.description.trim().length === 0 || props.body.description.trim().length > 5000) throw ErrorUtil.unprocessable("Community name or description is invalid.");
    const normalized = name.toLowerCase();
    if (props.body.iconUrl !== undefined && props.body.iconUrl !== null) validateImageReference(props.body.iconUrl, "iconUrl");
    if (await MyGlobal.prisma.communities.findUnique({ where: { name_normalized: normalized } })) throw ErrorUtil.conflict("Community name is unavailable.");
    const created = await MyGlobal.prisma.$transaction(async (tx) => {
      const row = await tx.communities.create({ data: { id: crypto.randomUUID(), name, name_normalized: normalized, description: props.body.description.trim(), icon_url: props.body.iconUrl ?? null, status: "active", owner_id: props.actor.id, created_at: now() } });
      await tx.subscriptions.create({ data: { id: crypto.randomUUID(), user_id: props.actor.id, community_id: row.id, created_at: now() } });
      return row;
    });
    return communityDto(created);
  }
  export async function communities(props: { input: ICommunity.IRequest }): Promise<IPage<ICommunity>> {
    const rows = await MyGlobal.prisma.communities.findMany({ where: props.input.search ? { name_normalized: { contains: props.input.search.trim().toLowerCase() } } : undefined, orderBy: { name_normalized: "asc" } });
    return page(await Promise.all(rows.map(communityDto)), props.input, `communities:${props.input.search?.trim().toLowerCase() ?? ""}`);
  }
  export async function subscribe(props: { actor: Actor; communityId: string }): Promise<ICommunity> {
    const row = await community(props.communityId);
    if (row.status !== "active") throw ErrorUtil.forbidden("Archived communities are read-only.");
    const active = await MyGlobal.prisma.subscriptions.findFirst({ where: { user_id: props.actor.id, community_id: row.id, ended_at: null } });
    if (active === null) await MyGlobal.prisma.subscriptions.create({ data: { id: crypto.randomUUID(), user_id: props.actor.id, community_id: row.id, created_at: now() } });
    return communityDto(row);
  }
  export async function unsubscribe(props: { actor: Actor; communityId: string }): Promise<void> {
    await community(props.communityId);
    await MyGlobal.prisma.subscriptions.updateMany({ where: { user_id: props.actor.id, community_id: props.communityId, ended_at: null }, data: { ended_at: now() } });
  }
  export async function subscriptions(props: { actor: Actor; input: IPage.IRequest }): Promise<IPage<ISubscription>> {
    const rows = await MyGlobal.prisma.subscriptions.findMany({ where: { user_id: props.actor.id, ended_at: null }, include: { community: true }, orderBy: { created_at: "desc" } });
    return page(await Promise.all(rows.map(async (row) => ({ id: row.id, createdAt: row.created_at.toISOString(), community: await communityDto(row.community) }))), props.input, `subscriptions:${props.actor.id}`);
  }

  export async function postCreate(props: { actor: Actor; communityId: string; body: IPost.ICreate }): Promise<IPost> {
    const row = await community(props.communityId);
    if (row.status !== "active" || await banned(props.actor.id, row.id)) throw ErrorUtil.forbidden("Posting is unavailable in this community.");
    const membership = await MyGlobal.prisma.subscriptions.findFirst({ where: { user_id: props.actor.id, community_id: row.id, ended_at: null } });
    if (membership === null) throw ErrorUtil.forbidden("An active subscription is required to post.");
    const body = props.body;
    const title = body.title.trim();
    if (title.length === 0 || title.length > 300) throw ErrorUtil.unprocessable("Title must contain between 1 and 300 characters.");
    const hasText = body.text !== undefined && body.text !== null;
    const hasUrl = body.url !== undefined && body.url !== null;
    const hasImage = body.imageUrl !== undefined && body.imageUrl !== null;
    if (hasImage) validateImageReference(body.imageUrl as string, "imageUrl");
    if (body.type === "link" && hasUrl) validateLinkReference(body.url as string);
    if ((hasText ? 1 : 0) + (hasUrl ? 1 : 0) + (hasImage ? 1 : 0) !== 1 || (body.type === "text" && (!hasText || body.text?.trim().length === 0)) || (body.type === "link" && !hasUrl) || (body.type === "image" && !hasImage)) throw ErrorUtil.unprocessable("Exactly one payload matching the post type is required.");
    const created = await MyGlobal.prisma.posts.create({ data: { id: crypto.randomUUID(), author_id: props.actor.id, community_id: row.id, title, type: body.type, text: body.type === "text" ? body.text ?? null : null, url: body.type === "link" ? body.url ?? null : null, image_url: body.type === "image" ? body.imageUrl ?? null : null, created_at: now() } });
    return postDto(await post(created.id));
  }
  export async function postAt(props: { id: string }): Promise<IPost> { return postDto(await post(props.id)); }
  export async function postUpdate(props: { actor: Actor; id: string; body: IPost.IUpdate }): Promise<IPost> {
    const current = await post(props.id);
    if (current.author_id !== props.actor.id) throw ErrorUtil.forbidden("Only the author may edit this post.");
    if (current.type !== "text" && props.body.text !== undefined || current.type !== "link" && props.body.url !== undefined || current.type !== "image" && props.body.imageUrl !== undefined) throw ErrorUtil.unprocessable("Post edits must preserve the existing payload type.");
    if (current.type === "text" && props.body.text !== undefined && (props.body.text === null || props.body.text.trim().length === 0)) throw ErrorUtil.unprocessable("Text posts require non-empty text.");
    if (props.body.title !== undefined && props.body.title !== null && (props.body.title.trim().length === 0 || props.body.title.trim().length > 300)) throw ErrorUtil.unprocessable("Title must contain between 1 and 300 characters.");
    if (current.type === "link" && props.body.url !== undefined && props.body.url !== null) validateLinkReference(props.body.url);
    if (current.type === "image" && props.body.imageUrl !== undefined && props.body.imageUrl !== null) validateImageReference(props.body.imageUrl, "imageUrl");
    const data = { ...(props.body.title !== undefined && props.body.title !== null ? { title: props.body.title.trim() } : {}), ...(current.type === "text" && props.body.text !== undefined ? { text: props.body.text } : {}), ...(current.type === "link" && props.body.url !== undefined ? { url: props.body.url } : {}), ...(current.type === "image" && props.body.imageUrl !== undefined ? { image_url: props.body.imageUrl } : {}), updated_at: now() };
    await MyGlobal.prisma.posts.update({ where: { id: props.id }, data });
    return postDto(await post(props.id));
  }
  export async function postErase(props: { actor: Actor; id: string; moderator?: boolean }): Promise<void> {
    const current = await post(props.id);
    if (current.author_id !== props.actor.id) {
      if (!props.moderator) throw ErrorUtil.forbidden("Only the author or community moderator may delete this post.");
      await authority(props.actor, current.community_id);
    }
    const votes = await MyGlobal.prisma.votes.findMany({ where: { OR: [{ post_id: props.id }, { comment: { post_id: props.id } }] }, include: { post: { select: { author_id: true } }, comment: { select: { author_id: true } } } });
    await MyGlobal.prisma.$transaction(async (tx) => {
      for (const vote of votes) {
        const authorId = vote.post?.author_id ?? vote.comment?.author_id;
        if (authorId !== undefined) await tx.profiles.update({ where: { user_id: authorId }, data: { karma: { decrement: vote.value } } });
      }
      await tx.posts.delete({ where: { id: props.id } });
    });
  }
  export async function feed(props: { actor?: Actor; communityId?: string; input: IPost.IRequest }): Promise<IPage<IPost.ISummary>> {
    if (props.communityId !== undefined) await community(props.communityId);
    const sort = props.input.sort ?? "hot";
    const range = props.input.range ?? "all";
    if (sort !== "top" && props.input.range !== undefined && props.input.range !== null) throw ErrorUtil.unprocessable("A time range is only valid for Top feeds.");
    const rangeStart = range === "all" ? undefined : new Date(Date.now() - ({ today: 24, week: 24 * 7, month: 24 * 30, year: 24 * 365 }[range] ?? 0) * 60 * 60 * 1000);
    const where: { deleted_at: null; community_id?: string; community?: { subscriptions: { some: { user_id: string; ended_at: null } } } } = props.communityId !== undefined
      ? { deleted_at: null, community_id: props.communityId }
      : props.actor !== undefined
        ? { deleted_at: null, community: { subscriptions: { some: { user_id: props.actor.id, ended_at: null } } } }
        : { deleted_at: null };
    const rows = await MyGlobal.prisma.posts.findMany({ where: rangeStart === undefined ? where : { ...where, created_at: { gte: rangeStart } }, include: { author: { select: { id: true, username: true } }, community: { select: { id: true, name: true } }, votes: { select: { value: true } }, comments: { where: { deleted_at: null }, select: { id: true } } } });
    const summaries = await Promise.all(rows.map(postSummary));
    summaries.sort((left, right) => {
      const score = (value: IPost.ISummary) => sort === "new" ? new Date(value.createdAt).getTime() : sort === "controversial" ? Math.abs(value.score) + value.commentCount : sort === "top" ? value.score : value.score / Math.max(1, (Date.now() - new Date(value.createdAt).getTime()) / 36e5);
      return score(right) - score(left) || right.createdAt.localeCompare(left.createdAt) || left.id.localeCompare(right.id);
    });
    return page(summaries, props.input, `feed:${props.actor?.id ?? "public"}:${props.communityId ?? "all"}:${sort}:${range}`);
  }

  export async function vote(props: { actor: Actor; targetId: string; target: "post" | "comment"; value: IVote.IRequest["value"] }): Promise<IVote> {
    const targetPost = props.target === "post" ? await post(props.targetId) : null;
    const targetComment = props.target === "comment" ? await MyGlobal.prisma.comments.findFirst({ where: { id: props.targetId, deleted_at: null }, include: { post: { select: { community_id: true } } } }) : null;
    const communityId = targetPost?.community_id ?? targetComment?.post.community_id;
    const authorId = targetPost?.author_id ?? targetComment?.author_id;
    if (communityId === undefined || authorId === undefined) throw ErrorUtil.notFound("Target not found.");
    const row = await community(communityId);
    if (row.status !== "active") throw ErrorUtil.forbidden("Archived communities are read-only.");
    const existing = await MyGlobal.prisma.votes.findFirst({ where: props.target === "post" ? { user_id: props.actor.id, post_id: props.targetId } : { user_id: props.actor.id, comment_id: props.targetId } });
    const delta = existing === null ? props.value : props.value - existing.value;
    if (delta !== 0) {
      await MyGlobal.prisma.$transaction(async (tx) => {
        if (existing === null) await tx.votes.create({ data: { id: crypto.randomUUID(), user_id: props.actor.id, ...(props.target === "post" ? { post_id: props.targetId } : { comment_id: props.targetId }), value: props.value, created_at: now() } });
        else await tx.votes.update({ where: { id: existing.id }, data: { value: props.value, updated_at: now() } });
        await tx.profiles.update({ where: { user_id: authorId }, data: { karma: { increment: delta } } });
      });
    }
    const votes = await MyGlobal.prisma.votes.findMany({ where: props.target === "post" ? { post_id: props.targetId } : { comment_id: props.targetId }, select: { value: true } });
    const profile = await MyGlobal.prisma.profiles.findUniqueOrThrow({ where: { user_id: authorId }, select: { karma: true } });
    return { value: props.value, score: votes.reduce((sum, item) => sum + item.value, 0), karma: profile.karma, targetId: props.targetId };
  }
  export async function voteRemove(props: { actor: Actor; targetId: string; target: "post" | "comment" }): Promise<IVote> {
    const targetPost = props.target === "post" ? await post(props.targetId) : null;
    const targetComment = props.target === "comment" ? await MyGlobal.prisma.comments.findFirst({ where: { id: props.targetId, deleted_at: null }, include: { post: { select: { community_id: true } } } }) : null;
    const communityId = targetPost?.community_id ?? targetComment?.post.community_id;
    const authorId = targetPost?.author_id ?? targetComment?.author_id;
    if (communityId === undefined || authorId === undefined) throw ErrorUtil.notFound("Target not found.");
    const row = await community(communityId);
    if (row.status !== "active") throw ErrorUtil.forbidden("Archived communities are read-only.");
    const existing = await MyGlobal.prisma.votes.findFirst({ where: props.target === "post" ? { user_id: props.actor.id, post_id: props.targetId } : { user_id: props.actor.id, comment_id: props.targetId } });
    if (existing !== null) await MyGlobal.prisma.$transaction([MyGlobal.prisma.votes.delete({ where: { id: existing.id } }), MyGlobal.prisma.profiles.update({ where: { user_id: authorId }, data: { karma: { decrement: existing.value } } })]);
    const votes = await MyGlobal.prisma.votes.findMany({ where: props.target === "post" ? { post_id: props.targetId } : { comment_id: props.targetId }, select: { value: true } });
    const profile = await MyGlobal.prisma.profiles.findUniqueOrThrow({ where: { user_id: authorId }, select: { karma: true } });
    return { value: 0, score: votes.reduce((sum, item) => sum + item.value, 0), karma: profile.karma, targetId: props.targetId };
  }

  export async function commentCreate(props: { actor: Actor; postId: string; parentId?: string; body: IComment.ICreate }): Promise<IComment> {
    const target = await post(props.postId);
    if (await banned(props.actor.id, target.community_id)) throw ErrorUtil.forbidden("Banned users cannot comment.");
    const parent = props.parentId ? await MyGlobal.prisma.comments.findFirst({ where: { id: props.parentId, post_id: props.postId, deleted_at: null } }) : null;
    if (props.parentId && parent === null) throw ErrorUtil.notFound("Comment parent not found.");
    const created = await MyGlobal.prisma.comments.create({ data: { id: crypto.randomUUID(), author_id: props.actor.id, post_id: props.postId, parent_id: props.parentId ?? null, text: props.body.text.trim(), created_at: now() } });
    return commentDto(created.id);
  }
  export async function commentReply(props: { actor: Actor; parentId: string; body: IComment.ICreate }): Promise<IComment> {
    const parent = await MyGlobal.prisma.comments.findFirst({ where: { id: props.parentId, deleted_at: null }, select: { post_id: true } });
    if (parent === null) throw ErrorUtil.notFound("Comment parent not found.");
    return commentCreate({ actor: props.actor, postId: parent.post_id, parentId: props.parentId, body: props.body });
  }
  async function commentDto(id: string, sort: IComment.IRequest["sort"] = "new"): Promise<IComment> {
    const row = await MyGlobal.prisma.comments.findUnique({ where: { id }, include: { author: { select: { id: true, username: true } }, votes: { select: { value: true } }, children: { select: { id: true } } } });
    if (row === null) throw ErrorUtil.notFound("Comment not found.");
    const children = await Promise.all(row.children.map((child) => commentDto(child.id, sort)));
    children.sort((left, right) => sort === "best" ? right.score - left.score || left.id.localeCompare(right.id) : sort === "controversial" ? Math.abs(right.score) - Math.abs(left.score) || left.id.localeCompare(right.id) : right.createdAt.localeCompare(left.createdAt) || left.id.localeCompare(right.id));
    return { id: row.id, author: row.deleted_at ? null : row.author, text: row.deleted_at ? null : row.text, deleted: row.deleted_at !== null, score: row.votes.reduce((sum, item) => sum + item.value, 0), createdAt: row.created_at.toISOString(), updatedAt: row.updated_at?.toISOString() ?? null, children };
  }
  export async function comments(props: { postId: string; input: IComment.IRequest }): Promise<IPage<IComment>> {
    await post(props.postId);
    const roots = await MyGlobal.prisma.comments.findMany({ where: { post_id: props.postId, parent_id: null }, orderBy: { created_at: "asc" } });
    const result = await Promise.all(roots.map((root) => commentDto(root.id, props.input.sort ?? "new")));
    const sort = props.input.sort ?? "new";
    result.sort((left, right) => sort === "best" ? right.score - left.score || left.id.localeCompare(right.id) : sort === "controversial" ? Math.abs(right.score) - Math.abs(left.score) || left.id.localeCompare(right.id) : right.createdAt.localeCompare(left.createdAt) || left.id.localeCompare(right.id));
    return page(result, props.input, `comments:${props.postId}:${sort}`);
  }
  export async function commentUpdate(props: { actor: Actor; id: string; body: IComment.IUpdate }): Promise<IComment> {
    const row = await MyGlobal.prisma.comments.findUnique({ where: { id: props.id } });
    if (row === null || row.deleted_at !== null) throw ErrorUtil.notFound("Comment not found.");
    if (row.author_id !== props.actor.id) throw ErrorUtil.forbidden("Only the author may edit this comment.");
    await MyGlobal.prisma.comments.update({ where: { id: props.id }, data: { text: props.body.text.trim(), updated_at: now() } });
    return commentDto(props.id);
  }
  export async function commentErase(props: { actor: Actor; id: string; moderator?: boolean }): Promise<void> {
    const row = await MyGlobal.prisma.comments.findUnique({ where: { id: props.id } });
    if (row === null || row.deleted_at !== null) throw ErrorUtil.notFound("Comment not found.");
    if (row.author_id !== props.actor.id) { if (!props.moderator) throw ErrorUtil.forbidden("Only the author or community moderator may delete this comment."); const target = await MyGlobal.prisma.posts.findUniqueOrThrow({ where: { id: row.post_id }, select: { community_id: true } }); await authority(props.actor, target.community_id); }
    const votes = await MyGlobal.prisma.votes.findMany({ where: { comment_id: props.id }, select: { value: true } });
    await MyGlobal.prisma.$transaction(async (tx) => {
      for (const vote of votes) await tx.profiles.update({ where: { user_id: row.author_id }, data: { karma: { decrement: vote.value } } });
      await tx.votes.deleteMany({ where: { comment_id: props.id } });
      await tx.comments.update({ where: { id: props.id }, data: { text: null, deleted_at: now() } });
    });
  }

  export async function moderatorAdd(props: { actor: Actor; communityId: string; userId: string }): Promise<void> { await authority(props.actor, props.communityId); await user(props.userId); const existing = await MyGlobal.prisma.moderators.findFirst({ where: { community_id: props.communityId, user_id: props.userId, revoked_at: null } }); if (existing === null) await MyGlobal.prisma.moderators.create({ data: { id: crypto.randomUUID(), community_id: props.communityId, user_id: props.userId, created_at: now() } }); }
  export async function moderatorRemove(props: { actor: Actor; communityId: string; userId: string }): Promise<void> { await owner(props.actor, props.communityId); const communityRow = await community(props.communityId); if (communityRow.owner_id === props.userId) throw ErrorUtil.forbidden("The owner cannot be removed."); const row = await MyGlobal.prisma.moderators.findFirst({ where: { community_id: props.communityId, user_id: props.userId, revoked_at: null } }); if (row === null) return; await MyGlobal.prisma.moderators.update({ where: { id: row.id }, data: { revoked_at: now() } }); }
  export async function ban(props: { actor: Actor; communityId: string; userId: string }): Promise<void> { const row = await authority(props.actor, props.communityId); await user(props.userId); if (row.owner_id === props.userId) throw ErrorUtil.forbidden("The owner cannot be banned."); const existing = await MyGlobal.prisma.bans.findFirst({ where: { community_id: props.communityId, user_id: props.userId, ended_at: null } }); if (existing === null) await MyGlobal.prisma.bans.create({ data: { id: crypto.randomUUID(), community_id: props.communityId, user_id: props.userId, actor_id: props.actor.id, created_at: now() } }); }
  export async function unban(props: { actor: Actor; communityId: string; userId: string }): Promise<void> { await authority(props.actor, props.communityId); await MyGlobal.prisma.bans.updateMany({ where: { community_id: props.communityId, user_id: props.userId, ended_at: null }, data: { ended_at: now() } }); }
  export async function bans(props: { actor: Actor; communityId: string; input: IPage.IRequest }): Promise<IPage<IBan>> { await authority(props.actor, props.communityId); const rows = await MyGlobal.prisma.bans.findMany({ where: { community_id: props.communityId, ended_at: null }, include: { user: { select: { id: true, username: true } }, actor: { select: { id: true, username: true } } }, orderBy: { created_at: "desc" } }); return page(rows.map((row) => ({ id: row.id, user: row.user, actor: row.actor, createdAt: row.created_at.toISOString() })), props.input, `bans:${props.communityId}`); }
  export async function reportCreate(props: { actor: Actor; targetId: string; target: "post" | "comment"; body: IReport.ICreate }): Promise<IReport> { const targetPost = props.target === "post" ? await post(props.targetId) : null; const targetComment = props.target === "comment" ? await MyGlobal.prisma.comments.findFirst({ where: { id: props.targetId, deleted_at: null }, include: { post: { select: { community_id: true } } } }) : null; const communityId = targetPost?.community_id ?? targetComment?.post.community_id; if (communityId === undefined) throw ErrorUtil.notFound("Target not found."); const row = await community(communityId); if (row.status !== "active") throw ErrorUtil.forbidden("Archived communities are read-only."); const reason = props.body.reason.trim(); if (reason.length === 0 || reason.length > 2000) throw ErrorUtil.unprocessable("Report reason is invalid."); const duplicate = await MyGlobal.prisma.reports.findFirst({ where: { reporter_id: props.actor.id, status: "unresolved", ...(props.target === "post" ? { post_id: props.targetId } : { comment_id: props.targetId }) } }); if (duplicate !== null) throw ErrorUtil.conflict("An unresolved report already exists."); const created = await MyGlobal.prisma.reports.create({ data: { id: crypto.randomUUID(), reporter_id: props.actor.id, community_id: communityId, ...(props.target === "post" ? { post_id: props.targetId } : { comment_id: props.targetId }), reason, status: "unresolved", created_at: now() }, include: { reporter: { select: { id: true, username: true } } } }); return { id: created.id, targetId: props.targetId, targetType: props.target, reason: created.reason, status: "unresolved", reporter: created.reporter, createdAt: created.created_at.toISOString() }; }
  export async function reports(props: { actor: Actor; communityId: string; input: IPage.IRequest }): Promise<IPage<IReport>> { await authority(props.actor, props.communityId); const rows = await MyGlobal.prisma.reports.findMany({ where: { community_id: props.communityId, status: "unresolved" }, include: { reporter: { select: { id: true, username: true } } }, orderBy: { created_at: "desc" } }); return page(rows.map((row) => ({ id: row.id, targetId: row.post_id !== null ? row.post_id : row.comment_id ?? "", targetType: row.post_id ? "post" as const : "comment" as const, reason: row.reason, status: "unresolved" as const, reporter: row.reporter, createdAt: row.created_at.toISOString() })), props.input, `reports:${props.communityId}`); }
  export async function reportResolve(props: { actor: Actor; id: string; approve: boolean }): Promise<void> {
    const row = await MyGlobal.prisma.reports.findUnique({ where: { id: props.id } });
    if (row === null || row.status !== "unresolved") throw ErrorUtil.notFound("Report is no longer unresolved.");
    await authority(props.actor, row.community_id);
    await MyGlobal.prisma.$transaction(async (tx) => {
      if (props.approve && row.post_id !== null) {
        const votes = await tx.votes.findMany({ where: { OR: [{ post_id: row.post_id }, { comment: { post_id: row.post_id } }] }, include: { post: { select: { author_id: true } }, comment: { select: { author_id: true } } } });
        for (const vote of votes) {
          const authorId = vote.post?.author_id ?? vote.comment?.author_id;
          if (authorId !== undefined) await tx.profiles.update({ where: { user_id: authorId }, data: { karma: { decrement: vote.value } } });
        }
        await tx.posts.delete({ where: { id: row.post_id } });
      } else if (props.approve && row.comment_id !== null) {
        const target = await tx.comments.findUniqueOrThrow({ where: { id: row.comment_id }, select: { author_id: true } });
        const votes = await tx.votes.findMany({ where: { comment_id: row.comment_id }, select: { value: true } });
        for (const vote of votes) await tx.profiles.update({ where: { user_id: target.author_id }, data: { karma: { decrement: vote.value } } });
        await tx.votes.deleteMany({ where: { comment_id: row.comment_id } });
        await tx.comments.update({ where: { id: row.comment_id }, data: { text: null, deleted_at: now() } });
      }
      await tx.reports.update({ where: { id: row.id }, data: { status: props.approve ? "approved" : "dismissed", resolved_at: now(), resolver_id: props.actor.id } });
    });
  }
}
