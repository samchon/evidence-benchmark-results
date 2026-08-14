import type { tags } from "typia";

export interface IDocumentNumber { id: string & tags.Format<"uuid">; documentType: string; prefix: string; padding: number; nextValue: number; active: boolean; }
export namespace IDocumentNumber {
  export interface ICreate { documentType: string; prefix: string; padding: number & tags.Type<"uint32"> & tags.Minimum<1> & tags.Maximum<12>; nextValue?: number & tags.Type<"uint32"> & tags.Minimum<1>; }
  export interface IIndex { page?: number; limit?: number; documentType?: string; }
  export interface IIssue { documentType: string; }
  export interface IIssued { documentType: string; number: string; }
}

export interface IFiscalYear { id: string & tags.Format<"uuid">; name: string; startsAt: string & tags.Format<"date-time">; endsAt: string & tags.Format<"date-time">; status: "open" | "closed"; periods: IFiscalYear.IPeriod[]; }
export namespace IFiscalYear {
  export interface ICreate { name: string; year: number & tags.Type<"uint32"> & tags.Minimum<1900> & tags.Maximum<3000>; }
  export interface IIndex { page?: number; limit?: number; status?: "open" | "closed"; }
  export interface IPeriod { id: string & tags.Format<"uuid">; name: string; startsAt: string & tags.Format<"date-time">; endsAt: string & tags.Format<"date-time">; status: string; }
}

export interface INotificationPreference { membershipId: string & tags.Format<"uuid">; categories: Record<string, boolean>; delivery: Record<string, boolean>; mandatoryRiskNotices: true; }
export namespace INotificationPreference { export interface IUpdate { categories?: Record<string, boolean>; delivery?: Record<string, boolean>; } }
