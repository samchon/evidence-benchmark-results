import * as api from "@benchmark/reddit-api";
import typia from "typia";

let sequence = 0;

/** Authenticates one freshly-created account for a scenario. */
export async function authorize(host: string): Promise<api.IConnection> {
  return (await authorizeDetailed(host)).connection;
}

/** Authenticates one account and retains the public identity for scoped setup. */
export async function authorizeDetailed(host: string): Promise<{ connection: api.IConnection; user: api.IAuth["user"] }> {
  const number = sequence++;
  const connection: api.IConnection = { host };
  const username = `user_${Date.now().toString(36)}_${number}`.slice(0, 30);
  const auth = await api.functional.auth.join(connection, {
    email: `${username}@example.com`,
    username,
    password: "password-123",
  });
  typia.assert(auth);
  return { connection, user: auth.user };
}

/** Authenticates one existing account and returns its reusable test connection. */
export async function loginDetailed(host: string, email: string, password: string): Promise<{ connection: api.IConnection; auth: api.IAuth.IAuthorized }> {
  const connection: api.IConnection = { host };
  const auth = await api.functional.auth.login(connection, { email, password });
  typia.assert(auth);
  return { connection, auth };
}

/** Renews one active session from a refresh proof and returns its reusable test connection. */
export async function refreshDetailed(host: string, refreshToken: string): Promise<{ connection: api.IConnection; auth: api.IAuth.IAuthorized }> {
  const connection: api.IConnection = { host };
  const auth = await api.functional.auth.refresh(connection, { refreshToken });
  typia.assert(auth);
  return { connection, auth };
}

/** A valid image input accepted by the backend media boundary. */
export function image(): api.IMedia.ICreate {
  return { mimeType: "image/png", data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", width: 1, height: 1 };
}

/** Creates an owner, subscriber, post, and comment through public operations. */
export async function scenario(host: string): Promise<Scenario> {
  const ownerAccount = await authorizeDetailed(host);
  const owner = ownerAccount.connection;
  const community = await api.functional.communities.createCommunity(owner, {
    name: `community_${Date.now().toString(36)}_${sequence++}`.slice(0, 50),
    description: "A requirement test community",
    icon: image(),
  });
  typia.assert(community);
  const memberAccount = await authorizeDetailed(host);
  const member = memberAccount.connection;
  const subscribed = await api.functional.community.subscribe.subscribe(member, community.id);
  typia.assert(subscribed);
  const post = await api.functional.posts.createPost(member, {
    communityId: community.id,
    title: "Requirement test post",
    type: "text",
    text: "A persisted text payload",
  });
  typia.assert(post);
  const comment = await api.functional.comments.createComment(owner, {
    postId: post.id,
    text: "A persisted comment",
  });
  typia.assert(comment);
  return { owner, member, community, post, comment, ownerUser: ownerAccount.user, memberUser: memberAccount.user };
}

/** Public state established through the generated API. */
export interface Scenario {
  owner: api.IConnection;
  member: api.IConnection;
  community: api.ICommunity;
  post: api.IPost;
  comment: api.IComment;
  ownerUser: api.IAuth["user"];
  memberUser: api.IAuth["user"];
}
