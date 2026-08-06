import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, INotificationPreference } from "@benchmark/erp-api"; import { ObservabilityProvider } from "../providers/ObservabilityProvider";
/** Reads the selected membership notification preference.
*/ @Controller("notification-preference") export class NotificationPreferenceController {
/**
 * @evidence prisma:notification_preferences Exposes the persisted notification_preferences record through this operation.
 */
  @core.TypedRoute.Get()
  public async preference(@core.TypedHeaders() headers: IAuth.IHeaders): Promise<INotificationPreference> { return ObservabilityProvider.preference(headers); } }
