export interface IItem {
  id: string; sku: string; name: string; description?: string | null; item_type: string; unit_id: string;
  purchase_price?: number | null; sales_price?: number | null; tax_code_id?: string | null; status: string;
  tracking_mode: string; costing_method: string; planning_json?: string | null; preferred_vendor_id?: string | null;
  created_at: string; updated_at: string;
}
export namespace IItem { export interface ICreate { sku: string; name: string; item_type: string; unit_id: string; description?: string; purchase_price?: number; sales_price?: number; tax_code_id?: string; tracking_mode?: string; costing_method?: string; planning_json?: string; preferred_vendor_id?: string; } export interface IUpdate { sku?: string; name?: string; item_type?: string; unit_id?: string; description?: string; purchase_price?: number; sales_price?: number; tax_code_id?: string; status?: string; tracking_mode?: string; costing_method?: string; planning_json?: string; preferred_vendor_id?: string; } export interface IRequest { page?: number; limit?: number; search?: string | null; status?: string | null; item_type?: string | null; } }
