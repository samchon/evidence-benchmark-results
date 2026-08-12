import * as api from "@benchmark/reddit-api";

/** Shared live setup for generated-accessor backend journeys. */
export namespace RedditJourney {
  let serial = 0;

  export interface IActor {
    connection: api.IConnection;
    email: string;
    password: string;
    authorized: api.IRedditUser.IAuthorized;
    user: api.IRedditUser.ISummary;
  }

  export function authorize(connection: api.IConnection, accessToken: string): void {
    connection.headers = { ...connection.headers, Authorization: `Bearer ${accessToken}` };
  }

  export async function actor(base: api.IConnection): Promise<IActor> {
    serial += 1;
    const email = `evidence${serial}@example.com`;
    const password = "correct-horse-battery-staple";
    const connection: api.IConnection = { host: base.host };
    const authorized = await api.functional.auth.user.join(connection, {
      email,
      username: `evidence_${serial}`,
      password,
    });
    authorize(connection, authorized.accessToken);
    return { connection, email, password, authorized, user: authorized.user };
  }

  export async function community(actor: IActor): Promise<api.IRedditCommunity> {
    return api.functional.community.create(actor.connection, {
      name: `community_${actor.user.username.slice("evidence_".length)}`,
      description: "A community used by a live backend journey.",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    });
  }

  export async function post(actor: IActor, community: api.IRedditCommunity): Promise<api.IRedditPost> {
    return api.functional.post.community.create(actor.connection, community.id, {
      title: "A live evidence post",
      type: "text",
      text: "A post created by the backend journey.",
    });
  }

  export async function comment(actor: IActor, post: api.IRedditPost): Promise<api.IRedditComment> {
    return api.functional.comment.post.create(actor.connection, post.id, {
      text: "A live evidence comment.",
    });
  }
}
