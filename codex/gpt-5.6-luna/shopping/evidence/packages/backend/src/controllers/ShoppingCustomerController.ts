import { TypedBody, TypedHeaders, TypedParam, TypedRoute as Route } from "@nestia/core";
import { Controller } from "@nestjs/common";
import type * as api from "@benchmark/shopping2-api";
import type { tags } from "typia";

import { ShoppingProvider } from "../providers/ShoppingProvider";
import { AuthUtil } from "../utils/AuthUtil";

/** Customer-owned profile, address, and catalog-support operations. */
@Controller("shopping/customer")
export class ShoppingCustomerController {
  /**
   * View the acting customer's profile.
   * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-customer-profile-model This controller operation realizes the customer profile domain customer profile model contract through profile.
   * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-3-remove-profile-data-at-customer-closure This controller operation realizes the customer profile domain 3 remove profile data at customer closure contract through profile.
   * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-1-view-the-customer-profile This controller operation realizes the customer profile functions 1 view the customer profile contract through profile.
   * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-2-remove-working-personal-customer-state This controller operation realizes the customer account policies 2 remove working personal customer state contract through profile.
   * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-3-retain-the-commercial-order-graph This controller operation realizes the customer account policies 3 retain the commercial order graph contract through profile.
   * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-2-relate-a-profile-to-its-customer This controller operation realizes the customer profile domain 2 relate a profile to its customer contract through profile.
   * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-1-authenticate-irreversible-customer-closure This controller operation realizes the customer account policies 1 authenticate irreversible customer closure contract through profile.
   * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-customer-closure-and-retention-policies This controller operation realizes the customer account policies customer closure and retention policies contract through profile.
   * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-5-keep-customer-closure-permanent This controller operation realizes the customer account policies 5 keep customer closure permanent contract through profile.
   * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-1-define-customer-profile-information This controller operation realizes the customer profile domain 1 define customer profile information contract through profile.
   * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-customer-profile-operations Reads the self-scoped profile.
   * @evidence prisma:shopping_customer_profiles Exposes persisted profile values.
   */
  @Route.Get("profile/view")
  public async profile(@TypedHeaders() headers: { authorization?: string }): Promise<api.IShoppingCustomer.IProfile> { return ShoppingProvider.customerProfile(AuthUtil.parse(headers.authorization).id); }
  /**
   * Edit the acting customer's profile.
   * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-2-edit-the-customer-profile Updates only the profile values.
   * @evidence prisma:shopping_customer_profiles Persists the edit.
   */
  @Route.Put("profile/update")
  public async updateProfile(@TypedHeaders() headers: { authorization?: string }, @TypedBody() body: api.IShoppingCustomer.IProfileUpdate): Promise<api.IShoppingCustomer.IProfile> { return ShoppingProvider.updateCustomerProfile(AuthUtil.parse(headers.authorization).id, body); }
  /**
   * List the acting customer's saved addresses.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-1-list-saved-addresses Returns owned destinations only.
   * @evidence prisma:shopping_shipping_addresses Reads persisted address rows.
   */
  @Route.Patch("address/list")
  public async addresses(@TypedHeaders() headers: { authorization?: string }, @TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IShoppingCustomer.IAddress>> { const data = await ShoppingProvider.addresses(AuthUtil.parse(headers.authorization).id); const limit = input.limit ?? 100; const current = input.page ?? 1; return { pagination: { current, limit, records: data.length, pages: limit === 0 ? 1 : Math.max(1, Math.ceil(data.length / limit)) }, data: limit === 0 ? data : data.slice((current - 1) * limit, current * limit) }; }
  /**
   * Add a complete saved destination.
   * @evidence docs/analysis/04-business-rules.md#req-address-policies-2-enforce-address-ownership This controller operation realizes the address policies 2 enforce address ownership contract through createAddress.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-2-add-a-shipping-address Persists one customer-owned address.
   * @evidence prisma:shopping_shipping_addresses Creates the destination row.
   */
  @Route.Post("address/create")
  public async createAddress(@TypedHeaders() headers: { authorization?: string }, @TypedBody() body: api.IShoppingCustomer.IAddressCreate): Promise<api.IShoppingCustomer.IAddress> { return ShoppingProvider.createAddress(AuthUtil.parse(headers.authorization).id, body); }
  /**
   * Replace one owned saved destination.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-3-edit-a-saved-address Preserves ownership and default state.
   * @evidence prisma:shopping_shipping_addresses Updates the row.
   */
  @Route.Put("address/:id/update")
  public async updateAddress(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">, @TypedBody() body: api.IShoppingCustomer.IAddressUpdate): Promise<api.IShoppingCustomer.IAddress> { return ShoppingProvider.updateAddress(AuthUtil.parse(headers.authorization).id, id, body); }
  /**
   * Delete one owned saved destination.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-4-delete-a-saved-address Removes only the retained address.
   * @evidence prisma:shopping_shipping_addresses Deletes the row while order copies remain.
   */
  @Route.Delete("address/:id/delete")
  public async deleteAddress(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingResult> { return ShoppingProvider.deleteAddress(AuthUtil.parse(headers.authorization).id, id); }
  /**
   * Select the sole default destination.
   * @evidence docs/analysis/04-business-rules.md#req-address-policies-4-clear-a-removed-default-without-automatic-replacement This controller operation realizes the address policies 4 clear a removed default without automatic replacement contract through setDefault.
   * @evidence docs/analysis/04-business-rules.md#req-address-policies-3-keep-at-most-one-default-address This controller operation realizes the address policies 3 keep at most one default address contract through setDefault.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-5-set-the-default-address Transfers the designation atomically.
   * @evidence prisma:shopping_shipping_addresses Maintains at most one default.
   */
  @Route.Put("address/:id/default")
  public async setDefault(@TypedHeaders() headers: { authorization?: string }, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IShoppingCustomer.IAddress> { return ShoppingProvider.setDefaultAddress(AuthUtil.parse(headers.authorization).id, id); }
}
