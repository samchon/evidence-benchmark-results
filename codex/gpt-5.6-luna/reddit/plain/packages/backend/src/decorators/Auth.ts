import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { AuthUtil, type AuthPayload } from "../utils/AuthUtil";

/** Resolves the signed session identity from the Authorization header. */
export const Auth = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthPayload | null => {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string } }>();
    return AuthUtil.fromBearer(request.headers.authorization);
  },
);
