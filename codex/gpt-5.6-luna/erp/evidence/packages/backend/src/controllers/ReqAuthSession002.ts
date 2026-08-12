import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_session_002")
export class ReqAuthSession002 {
  /**
   * Publishes the req_auth_session_002 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout Owns the authentication requirement family.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-002-continues-an-eligible-current-session-without-re-entering-credentials Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-002-continues-an-eligible-current-session-without-re-entering-credentials Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:sessions Uses the persisted sessions state for this operation.
 * @evidenceReview prisma:sessions Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:users Uses the persisted users state for this operation.
 * @evidenceReview prisma:users Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_session_002
   * @path POST /auth/req_auth_session_002
   * @accessor api.functional.auth.req_auth_session_002
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_session_002(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_session_002", input });
  }
}
