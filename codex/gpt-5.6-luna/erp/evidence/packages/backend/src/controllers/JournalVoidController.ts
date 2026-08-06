
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IJournal } from "@benchmark/erp-api"; import { JournalProvider as P } from "../providers/JournalProvider";


 @Controller("journal-void") export class JournalVoidController { /** Voids an eligible journal while preserving its source lines.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-journal-009-a-finance-manager-voids-an-eligible-journal Voids an eligible journal through a preserving correction.
 */
  @core.TypedRoute.Post(":id")
  public async void(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedParam("id") id:string):Promise<IJournal>{return P.voidEntry(h,id);} }
