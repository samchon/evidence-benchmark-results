export interface IProcurementDocument { id: string; number: string; status: string; requester_user_id?: string; vendor_id?: string | null; source_request_id?: string | null; source_order_id?: string | null; currency_code: string; total: number; lines_json: string; match_status?: string; dispute_reason?: string | null; amount?: number; allocations_json?: string; created_at: string; updated_at: string; }
export interface IPurchaseRequest extends IProcurementDocument { requester_user_id: string; reason?: string | null; }
export interface IPurchaseOrder extends IProcurementDocument { vendor_id: string; source_request_id?: string | null; notes?: string | null; }
export interface IVendorBill extends IProcurementDocument { vendor_id: string; match_status: string; }
export interface IVendorPayment extends IProcurementDocument { vendor_id: string; amount: number; allocations_json: string; }
export namespace IProcurementDocument {
  export interface ICreate { vendor_id?: string; source_request_id?: string; source_order_id?: string; currency_code?: string; total?: number; lines_json?: string; reason?: string; notes?: string; allocations_json?: string; }
  export interface IUpdate { vendor_id?: string; source_request_id?: string; source_order_id?: string; currency_code?: string; total?: number; lines_json?: string; reason?: string; notes?: string; allocations_json?: string; status?: string; }
  export interface IRequest { page?: number; limit?: number; status?: string | null; vendor_id?: string | null; }
  export interface IReason { reason: string; }
}
export type IPurchaseRequestCreate = IProcurementDocument.ICreate;
export type IPurchaseOrderCreate = IProcurementDocument.ICreate;
export type IVendorBillCreate = IProcurementDocument.ICreate;
export type IVendorPaymentCreate = IProcurementDocument.ICreate;
