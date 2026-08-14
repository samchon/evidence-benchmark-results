import type { tags } from "typia";

export interface ICurrency { id: string & tags.Format<"uuid">; code: string; name: string; precision: number; active: boolean; }
export namespace ICurrency { export interface ICreate { code: string & tags.MinLength<3> & tags.MaxLength<3>; name: string; precision: number & tags.Type<"uint32">; } export interface IUpdate { name?: string; precision?: number & tags.Type<"uint32">; active?: boolean; } }
export interface IExchangeRate { id: string & tags.Format<"uuid">; sourceCurrency: string; targetCurrency: string; effectiveAt: string & tags.Format<"date-time">; rate: number; origin: string; }
export namespace IExchangeRate { export interface ICreate { sourceCurrency: string; targetCurrency: string; effectiveAt: string & tags.Format<"date-time">; rate: number & tags.Minimum<0>; origin?: string; } }
export interface IPaymentTerm { id: string & tags.Format<"uuid">; name: string; dueDays: number; active: boolean; }
export namespace IPaymentTerm { export interface ICreate { name: string; dueDays: number & tags.Type<"uint32">; } export interface IUpdate { name?: string; dueDays?: number & tags.Type<"uint32">; active?: boolean; } }
export interface ITaxJurisdiction { id: string & tags.Format<"uuid">; name: string; territory: string; active: boolean; }
export namespace ITaxJurisdiction { export interface ICreate { name: string; territory: string; } export interface IUpdate { name?: string; territory?: string; active?: boolean; } }
export interface ITaxCode { id: string & tags.Format<"uuid">; jurisdictionId: string & tags.Format<"uuid">; type: string; name: string; accountId: null | (string & tags.Format<"uuid">); active: boolean; }
export namespace ITaxCode { export interface ICreate { jurisdictionId: string & tags.Format<"uuid">; type: "sales" | "purchase" | "exempt" | "sales_tax" | "output_vat" | "input_vat" | "withholding_tax" | "import_duty" | "payroll_tax"; name: string; accountId?: null | (string & tags.Format<"uuid">); } export interface IUpdate { name?: string; accountId?: null | (string & tags.Format<"uuid">); active?: boolean; } }
export interface ITaxRate { id: string & tags.Format<"uuid">; taxCodeId: string & tags.Format<"uuid">; startsAt: string & tags.Format<"date-time">; endsAt: null | (string & tags.Format<"date-time">); rate: number; }
export namespace ITaxRate { export interface ICreate { taxCodeId: string & tags.Format<"uuid">; startsAt: string & tags.Format<"date-time">; endsAt?: null | (string & tags.Format<"date-time">); rate: number & tags.Minimum<0>; } export interface IResolve { taxCodeId: string & tags.Format<"uuid">; at: string & tags.Format<"date-time">; } }
