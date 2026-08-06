
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

/** Publishes invitation acceptance and first-account provisioning. */
@Controller("auth/user-join")
export class AuthUserJoinController {
/**
   * Accept an Owner-issued invitation and establish the recipient identity.
   * @param input Invitation proof and first-account credentials.
   * @returns A signed-in session without an organization context.
   * @tag Authentication
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Establishes a global identity only from an active matching invitation.
 * @evidence prisma:users Exposes the persisted users record through this operation.
*/
  @core.TypedRoute.Post()
  public async join(@core.TypedBody() input: IAuth.IJoin): Promise<IAuth.IAuthorized> {
    return AuthProvider.join({ input });
  }
}
