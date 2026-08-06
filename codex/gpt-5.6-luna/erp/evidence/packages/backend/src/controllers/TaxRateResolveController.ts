
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ITaxRate } from "@benchmark/erp-api"; import { TaxProvider } from "../providers/TaxProvider";


 @Controller("tax-rate-resolve") export class TaxRateResolveController { /** Resolves the effective tax rate for a posting date.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-tax-code-003-an-tax-code-for-posting-user-resolves Resolves the rate used by a posting user.
 */
  @core.TypedRoute.Patch()
  public async resolve(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:ITaxRate.IResolve):Promise<ITaxRate>{return TaxProvider.rateResolve(h,i);} }
