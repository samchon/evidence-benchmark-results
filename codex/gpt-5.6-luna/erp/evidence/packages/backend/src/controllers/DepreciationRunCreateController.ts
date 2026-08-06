import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IDepreciationRun } from "@benchmark/erp-api"; import { AssetProvider } from "../providers/AssetProvider";
/** Creates a depreciation run.
*/ @Controller("depreciation-run-create") export class DepreciationRunCreateController {
/**
 * @evidence prisma:depreciation_runs Exposes the persisted depreciation_runs record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IDepreciationRun.ICreate): Promise<IDepreciationRun> { return AssetProvider.runCreate(h, input); } }
