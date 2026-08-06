import type { tags } from "typia";
import type { IPage } from "../typings";
/** Organization-scoped external vendor. */
/**
 * @evidence prisma:vendors Exposes the persisted vendors record.
 */
export interface IVendor {
  /** @evidence prisma:vendors.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:vendors.code Carries the persisted code value. */
  code: string;
/** @evidence prisma:vendors.legal_name Carries the persisted legalName value. */
  legalName: string;
/** @evidence prisma:vendors.display_name Carries the persisted displayName value. */
  displayName: null | string;
  /** @evidence prisma:vendors.email Carries the persisted email value. */
  email: null | string;
  /** @evidence prisma:vendors.phone Carries the persisted phone value. */
  phone: null | string;
/** @evidence prisma:vendors.tax_registration Carries the persisted taxRegistration value. */
  taxRegistration: null | string;
/** @evidence prisma:vendors.currency_id Carries the persisted currencyId value. */
  currencyId: null | string;
/** @evidence prisma:vendors.payment_term_id Carries the persisted paymentTermId value. */
  paymentTermId: null | string;
/** @evidence prisma:vendors.risk_classification Carries the persisted riskClassification value. */
  riskClassification: null | string;
  /** @evidence prisma:vendors.notes Carries the persisted notes value. */
  notes: null | string;
/** @evidence prisma:vendors.bank_account_reference Carries the persisted bankAccountReference value. */
  bankAccountReference: null | string;
  /** @evidence prisma:vendors.active Carries the persisted active value. */
  active: boolean;
/** @evidence prisma:vendors.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:vendors.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IVendor { export interface ICreate { code: string & tags.MinLength<1>; legalName: string & tags.MinLength<1>; displayName?: null | string; email?: null | string; phone?: null | string; taxRegistration?: null | string; currencyId?: null | string; paymentTermId?: null | string; riskClassification?: null | string; notes?: null | string; } export interface IUpdate extends Partial<Omit<ICreate, "code">> {} export interface IRequest extends IPage.IRequest { search?: string; includeInactive?: boolean; } }
