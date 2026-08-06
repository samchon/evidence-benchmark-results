import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IAuth,IDepreciationSchedule}from"@benchmark/erp-api";import{AssetEventsProvider}from"../providers/AssetEventsProvider";@Controller("depreciation-schedule-create")export class DepreciationScheduleCreateController{
/**
  * @evidence prisma:depreciation_schedules Exposes the persisted depreciation_schedules record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IDepreciationSchedule.ICreate):Promise<IDepreciationSchedule>{return AssetEventsProvider.scheduleCreate(h,i);}}
