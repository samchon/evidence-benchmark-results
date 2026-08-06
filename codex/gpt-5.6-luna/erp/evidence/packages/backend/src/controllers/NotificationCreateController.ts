import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, INotification } from "@benchmark/erp-api"; import { ApprovalProvider } from "../providers/ApprovalProvider";
/** Creates a user notification.
*/ @Controller("notification-create") export class NotificationCreateController {
/**
 * @evidence prisma:notifications Exposes the persisted notifications record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: INotification.ICreate): Promise<INotification> { return ApprovalProvider.notificationCreate(h, input); } }
