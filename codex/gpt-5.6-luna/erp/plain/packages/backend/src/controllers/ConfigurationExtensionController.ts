import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { ConfigurationExtensionProvider } from "../providers/ConfigurationExtensionProvider";

/** Number sequences, fiscal calendars, and notification preferences. */
@Controller("erp/config-ext")
@UseGuards(ErpAuthGuard)
export class ConfigurationExtensionController {
  @core.TypedRoute.Post("document-number") public async numberCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IDocumentNumber.ICreate): Promise<api.IDocumentNumber> { return ConfigurationExtensionProvider.numberCreate({ actor, body }); }
  @core.TypedRoute.Patch("document-number") public async numberIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IDocumentNumber.IIndex): Promise<api.IPage<api.IDocumentNumber>> { return ConfigurationExtensionProvider.numberIndex({ actor, input }); }
  @core.TypedRoute.Post("document-number/issue") public async numberIssue(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IDocumentNumber.IIssue): Promise<api.IDocumentNumber.IIssued> { return ConfigurationExtensionProvider.numberIssue({ actor, body }); }
  @core.TypedRoute.Post("fiscal-year") public async fiscalYearCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IFiscalYear.ICreate): Promise<api.IFiscalYear> { return ConfigurationExtensionProvider.fiscalYearCreate({ actor, body }); }
  @core.TypedRoute.Patch("fiscal-year") public async fiscalYearIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IFiscalYear.IIndex): Promise<api.IPage<api.IFiscalYear>> { return ConfigurationExtensionProvider.fiscalYearIndex({ actor, input }); }
  @core.TypedRoute.Get("notification-preference") public async preferenceAt(@ErpAuth() actor: ErpPayload): Promise<api.INotificationPreference> { return ConfigurationExtensionProvider.preferenceAt({ actor }); }
  @core.TypedRoute.Put("notification-preference") public async preferenceUpdate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.INotificationPreference.IUpdate): Promise<api.INotificationPreference> { return ConfigurationExtensionProvider.preferenceUpdate({ actor, body }); }
}
