import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

import { AuthProvider } from "../providers/AuthProvider";
import type { UserPayload } from "./UserPayload";

interface IRequest {
  headers: { authorization?: string | string[] };
}

/** Resolves the authenticated user from the current Authorization bearer token. */
export const UserAuth = createParamDecorator(
  async (_data: unknown, context: ExecutionContext): Promise<UserPayload> => {
    const request: IRequest = context.switchToHttp().getRequest<IRequest>();
    const authorization: string | string[] | undefined =
      request.headers.authorization;
    const value: string | undefined = Array.isArray(authorization)
      ? authorization[0]
      : authorization;
    if (value === undefined || value.startsWith("Bearer ") === false)
      return AuthProvider.authorize({ token: "" });
    return AuthProvider.authorize({ token: value.slice("Bearer ".length) });
  },
);
