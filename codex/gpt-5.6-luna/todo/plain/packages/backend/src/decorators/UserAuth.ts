import { createParamDecorator, type ExecutionContext, type CanActivate, Injectable } from "@nestjs/common";
import type { Request } from "express";

import { AuthProvider, type UserPayload } from "../providers/AuthProvider";

type AuthenticatedRequest = Request & { user?: UserPayload };

/** Resolves the authenticated account attached by UserGuard. */
export const UserAuth = createParamDecorator((_data: unknown, context: ExecutionContext): UserPayload => {
  const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
  if (request.user === undefined) throw new Error("UserGuard did not attach a user payload.");
  return request.user;
});

/** Checks the bearer token and attaches its live session identity. */
@Injectable()
export class UserGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    request.user = await AuthProvider.authorize(request.headers.authorization);
    return true;
  }
}
