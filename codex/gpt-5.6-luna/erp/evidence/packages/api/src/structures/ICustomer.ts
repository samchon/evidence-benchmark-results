import type { tags } from "typia";
import type { IPage } from "../typings";
/** Organization-scoped external customer. */
/**
 * @evidence prisma:customers Exposes the persisted customers record.
 */
export interface ICustomer {
  /** @evidence prisma:customers.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:customers.code Carries the persisted code value. */
  code: string;
/** @evidence prisma:customers.legal_name Carries the persisted legalName value. */
  legalName: string;
/** @evidence prisma:customers.display_name Carries the persisted displayName value. */
  displayName: null | string;
  /** @evidence prisma:customers.email Carries the persisted email value. */
  email: null | string;
  /** @evidence prisma:customers.phone Carries the persisted phone value. */
  phone: null | string;
/** @evidence prisma:customers.tax_registration Carries the persisted taxRegistration value. */
  taxRegistration: null | string;
/** @evidence prisma:customers.currency_id Carries the persisted currencyId value. */
  currencyId: null | string;
/** @evidence prisma:customers.payment_term_id Carries the persisted paymentTermId value. */
  paymentTermId: null | string;
/** @evidence prisma:customers.credit_limit Carries the persisted creditLimit value. */
  creditLimit: null | number;
  /** @evidence prisma:customers.notes Carries the persisted notes value. */
  notes: null | string;
  /** @evidence prisma:customers.active Carries the persisted active value. */
  active: boolean;
/** @evidence prisma:customers.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:customers.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ICustomer { export interface ICreate { code: string & tags.MinLength<1>; legalName: string & tags.MinLength<1>; displayName?: null | string; email?: null | string; phone?: null | string; taxRegistration?: null | string; currencyId?: null | string; paymentTermId?: null | string; creditLimit?: null | number; notes?: null | string; } export interface IUpdate extends Partial<Omit<ICreate, "code">> {} export interface IRequest extends IPage.IRequest { search?: string; includeInactive?: boolean; } }
