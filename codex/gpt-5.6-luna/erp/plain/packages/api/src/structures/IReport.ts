export interface IReport { report_type: string; generated_at: string; organization_id: string; filters: Record<string, unknown>; rows: Array<Record<string, unknown>>; }
export namespace IReport { export interface IRequest { from?: string; to?: string; currency_code?: string; dimensions?: Record<string, string>; } }
