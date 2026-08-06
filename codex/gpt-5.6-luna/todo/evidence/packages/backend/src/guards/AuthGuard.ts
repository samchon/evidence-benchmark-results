import { Injectable, type CanActivate, type ExecutionContext } from "@nestjs/common";
import type { Request } from "express";

import { AuthProvider } from "../providers/AuthProvider";

/** Resolves and validates the bearer session for protected controllers. */
@Injectable()
export class AuthGuard implements CanActivate {
  /** Attaches the owner-scoped session payload to the request. */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    (request as Request & { user?: AuthProvider.Payload }).user = await AuthProvider.authorize(request.header("authorization"));
    return true;
  }
}
