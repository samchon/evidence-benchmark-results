import type { tags } from "typia";

export interface IDepreciationSchedule { id: string & tags.Format<"uuid">; assetId: string & tags.Format<"uuid">; period: string; openingValue: number; plannedAmount: number; accumulatedAmount: number; closingValue: number; status: "planned" | "posted"; }
export namespace IDepreciationSchedule { export interface ICreate { period: string; } }
export interface IDepreciationRun { id: string & tags.Format<"uuid">; period: string; status: "draft" | "posted"; total: number; postedAt: null | (string & tags.Format<"date-time">); lines: IDepreciationRun.ILine[]; }
export namespace IDepreciationRun { export interface ICreate { period: string; assetIds?: string[] & tags.UniqueItems; } export interface ILine { id: string & tags.Format<"uuid">; scheduleId: string & tags.Format<"uuid">; amount: number; } }
