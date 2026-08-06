
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, INotification } from "@benchmark/erp-api"; import { ApprovalProvider as P } from "../providers/ApprovalProvider";


 @Controller("notification-dispatch") export class NotificationDispatchController { /** Dispatches a queued notification exactly once.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-notification-003-dispatches-queued-notifications Dispatches queued notifications.
 */
  @core.TypedRoute.Post(":id")
  public async dispatch(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedParam("id") id:string):Promise<INotification>{return P.notificationDispatch(h,id);} }
