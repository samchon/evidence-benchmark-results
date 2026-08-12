import type { tags } from "typia";

/** Authenticated user identity resolved from a live session. */
export interface UserPayload {
  /** Account UUID. */
  id: string & tags.Format<"uuid">;
  /** Session UUID that issued the bearer token. */
  session_id: string & tags.Format<"uuid">;
  /** Discriminator for the sole credentialed actor. */
  type: "user";
}
