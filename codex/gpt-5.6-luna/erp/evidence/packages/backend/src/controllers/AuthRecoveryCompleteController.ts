import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

/** Completes email-bound account recovery and revokes prior sessions. */
@Controller("auth-recovery-complete")
export class AuthRecoveryCompleteController {
  @core.TypedRoute.Post()
  public async complete(@core.TypedBody() input: IAuth.IRecoveryComplete): Promise<{ success: true }> {
    return AuthProvider.completeRecovery({ input });
  }
}
