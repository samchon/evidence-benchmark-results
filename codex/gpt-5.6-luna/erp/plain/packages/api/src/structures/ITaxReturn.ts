import type { tags } from "typia";

export interface ITaxReturn { id: string & tags.Format<"uuid">; jurisdictionId: string & tags.Format<"uuid">; period: string; status: "draft" | "prepared" | "approved" | "filed" | "amended"; totalTax: number; originalReturnId: null | (string & tags.Format<"uuid">); filedAt: null | (string & tags.Format<"date-time">); lines: ITaxReturn.ILine[]; }
export namespace ITaxReturn {
  export interface ILine { id: string & tags.Format<"uuid">; taxCodeId: string & tags.Format<"uuid">; amount: number; reconciledAmount: number; }
  export interface ICreate { jurisdictionId: string & tags.Format<"uuid">; period: string; }
  export interface IAmend { jurisdictionId: string & tags.Format<"uuid">; period: string; lines: ILineCreate[]; }
  export interface IReject { reason: string & tags.MinLength<1>; }
  export interface ILineCreate { taxCodeId: string & tags.Format<"uuid">; amount: number; reconciledAmount?: number; }
  export interface IIndex { page?: number; limit?: number; jurisdictionId?: string & tags.Format<"uuid">; period?: string; }
}
