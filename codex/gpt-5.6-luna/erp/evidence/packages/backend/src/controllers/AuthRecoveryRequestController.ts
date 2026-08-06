import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

/** Starts email-bound account recovery. */
@Controller("auth-recovery-request")
export class AuthRecoveryRequestController {
  @core.TypedRoute.Post()
  public async request(@core.TypedBody() input: IAuth.IRecoveryRequest): Promise<IAuth.IRecoveryIssued> {
    return AuthProvider.requestRecovery({ input });
  }
}
