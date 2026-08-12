import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { tags } from "typia";
import { RedditProvider } from "../providers/RedditProvider";

/** Supplies the bearer-authenticated platform user to protected controllers. */
export namespace RedditAuth {
  /** Minimal identity carried from the current session. */
  export interface Payload {
    /** Authenticated account identifier. */
    id: string & tags.Format<"uuid">;
    /** Current session identifier. */
    session_id: string & tags.Format<"uuid">;
    /** Actor discriminator. */
    type: "user";
  }

  /** Extracts the bearer token for provider authorization. */
  export const decorator = createParamDecorator(
    async (_data: unknown, context: ExecutionContext): Promise<Payload> => {
      const request = context.switchToHttp().getRequest<{
        headers: { authorization?: string | string[] };
      }>();
      const header = request.headers.authorization;
      const authorization = Array.isArray(header) ? header[0] : header;
      if (authorization === undefined || !authorization.startsWith("Bearer "))
        throw RedditProvider.unauthorized();
      return RedditProvider.authenticate(authorization.slice("Bearer ".length));
    },
  );
}
