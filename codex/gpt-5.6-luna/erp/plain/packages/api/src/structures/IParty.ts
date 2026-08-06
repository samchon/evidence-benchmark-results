export interface IParty {
  id: string;
  name: string;
  tax_identity?: string | null;
  status: string;
  currency_code?: string | null;
  payment_term_id?: string | null;
  country_code?: string | null;
  risk_level?: string | null;
  credit_limit?: number | null;
  created_at: string;
  updated_at: string;
}
export namespace IParty { export interface ICreate { name: string; tax_identity?: string; currency_code?: string; payment_term_id?: string; country_code?: string; risk_level?: string; credit_limit?: number; } export interface IUpdate { name?: string; tax_identity?: string; currency_code?: string; payment_term_id?: string; country_code?: string; risk_level?: string; credit_limit?: number; status?: string; } export interface IRequest { page?: number; limit?: number; search?: string | null; status?: string | null; } }
export type IVendor = IParty;
export type ICustomer = IParty;
