
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, INotification } from "@benchmark/erp-api"; import { ApprovalProvider as P } from "../providers/ApprovalProvider";


 @Controller("notification-retry") export class NotificationRetryController { /** Requeues a failed notification without duplicating its source event.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-notification-004-retries-failed-delivery-without-duplicating-the-originating-event Retries failed delivery without duplicating the event.
 */
  @core.TypedRoute.Post(":id")
  public async retry(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedParam("id") id:string):Promise<INotification>{return P.notificationRetry(h,id);} }
