import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IPage, IShoppingCancellationRequest, IShoppingCart, IShoppingCustomer, IShoppingOrder, IShoppingRefundRequest, IShoppingReview, IShoppingWishlist } from "@benchmark/shopping-api";

import { ShoppingCustomerProvider } from "../providers/ShoppingCustomerProvider";
import { ShoppingCustomerCommerceProvider } from "../providers/ShoppingCustomerCommerceProvider";
import { ShoppingAuthProvider } from "../providers/ShoppingAuthProvider";
import { ShoppingSessionProvider } from "../providers/ShoppingSessionProvider";
import { ShoppingOrderProvider } from "../providers/ShoppingOrderProvider";
import { ShoppingAfterSalesProvider } from "../providers/ShoppingAfterSalesProvider";

/** Publishes customer-owned profile, address, cart, order, request, and review operations. */
@Controller("shopping/customer")
export class ShoppingCustomerController {
  /** Read the acting customer's profile.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-customer-profile-model Publishes the customer-profile model.
 * @evidenceReview docs/analysis/02-domain-model.md#req-customer-profile-domain-customer-profile-model Reviewed the authenticated owner projection and profile relation.
 * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-customer-profile-operations Publishes the customer-profile operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-customer-profile-functions-customer-profile-operations Reviewed profile read/update ownership and response shape.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-1-require-registration-for-every-feature This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-1-require-registration-for-every-feature Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-2-limit-customer-owned-activity This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-access-boundaries-2-limit-customer-owned-activity Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-1-define-customer-profile-information This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-customer-profile-domain-1-define-customer-profile-information Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-2-relate-a-profile-to-its-customer This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-customer-profile-domain-2-relate-a-profile-to-its-customer Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-1-view-the-customer-profile This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-customer-profile-functions-1-view-the-customer-profile Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_customers This operation exposes the persisted model shopping_customers.
 * @evidenceReview prisma:shopping_customers Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_customer_profiles This operation exposes the persisted model shopping_customer_profiles.
 * @evidenceReview prisma:shopping_customer_profiles Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Get("profile/read")
  public async profile(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders): Promise<IShoppingCustomer> { return ShoppingCustomerProvider.at(await ShoppingSessionProvider.customer(headers.Authorization)); }
  /** Edit the acting customer's profile.
   * @evidence docs/analysis/03-functional-requirements.md#req-customer-profile-functions-2-edit-the-customer-profile Updates the acting customer's profile.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-customer-profile-functions-2-edit-the-customer-profile Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-1-define-customer-profile-information Persists customer profile information.
 * @evidenceReview docs/analysis/02-domain-model.md#req-customer-profile-domain-1-define-customer-profile-information Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-2-relate-a-profile-to-its-customer Keeps the profile owned by the acting customer.
 * @evidenceReview docs/analysis/02-domain-model.md#req-customer-profile-domain-2-relate-a-profile-to-its-customer Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("profile/update")
  public async profileUpdate(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingCustomer.IProfileUpdate): Promise<IShoppingCustomer> { return ShoppingCustomerProvider.update(await ShoppingSessionProvider.customer(headers.Authorization), input); }
  /** Change the acting customer's password and revoke other sessions.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-6-change-the-customer-password Requires the current password and rotates sessions.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-6-change-the-customer-password Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("password/update")
  public async passwordUpdate(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingCustomer.IPasswordUpdate): Promise<IShoppingCustomer.IResult> { return ShoppingAuthProvider.customerPassword(headers.Authorization, input); }
  /** Request a customer recovery challenge.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-7-recover-customer-access Starts customer access recovery.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-7-recover-customer-access Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence prisma:shopping_delivery_challenges Persists the hashed customer recovery challenge at this operation boundary.
   * @evidenceReview prisma:shopping_delivery_challenges Read the recovery provider path and confirmed this operation writes only the hashed challenge record.
   */
  @core.TypedRoute.Post("recover/request")
  public async recover(@core.TypedBody() input: IShoppingCustomer.IRecover): Promise<IShoppingCustomer.IResult> { return ShoppingAuthProvider.customerRecover(input); }
  /** Complete customer recovery from a delivered challenge.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-7-recover-customer-access Completes customer access recovery.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-7-recover-customer-access Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("recover/complete")
  public async recoverComplete(@core.TypedBody() input: IShoppingCustomer.IRecoverComplete): Promise<IShoppingCustomer.IResult> { return ShoppingAuthProvider.customerRecoverComplete(input); }
  /** Permanently close the acting customer account.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-customer-and-seller-account-oversight Separates customer self-closure from administrator account oversight.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-user-oversight-customer-and-seller-account-oversight Reviewed the authenticated self-service closure boundary.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-customer-closure-and-retention-policies Applies customer closure and retention policy.
 * @evidenceReview docs/analysis/04-business-rules.md#req-customer-account-policies-customer-closure-and-retention-policies Reviewed password proof, removal of working state, retained orders, and session termination.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-4-anonymize-retained-customer-reviews Anonymizes retained customer reviews at closure.
 * @evidenceReview docs/analysis/04-business-rules.md#req-customer-account-policies-4-anonymize-retained-customer-reviews Reviewed the transaction's anonymized review update and retained rating/text.
   * @evidence docs/analysis/01-actors-and-auth.md#req-customer-identity-8-delete-a-customer-account Closes the authenticated customer account.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-customer-identity-8-delete-a-customer-account Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/02-domain-model.md#req-customer-profile-domain-3-remove-profile-data-at-customer-closure Removes live profile data during closure.
 * @evidenceReview docs/analysis/02-domain-model.md#req-customer-profile-domain-3-remove-profile-data-at-customer-closure Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Delete("account/erase")
  public async accountErase(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingCustomer.IClose): Promise<IShoppingCustomer.IResult> { return ShoppingAuthProvider.customerClose(headers.Authorization, input); }
  /** List saved shipping addresses.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-shipping-address-model Publishes the saved-address model.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipping-address-domain-shipping-address-model Reviewed the customer relation and complete destination projection.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-shipping-address-operations Publishes the shipping-address operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-address-functions-shipping-address-operations Reviewed list, create, update, default, and delete routes.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-shipping-address-policies Applies the saved-address policy family.
 * @evidenceReview docs/analysis/04-business-rules.md#req-address-policies-shipping-address-policies Reviewed ownership, completeness, and default handling across the provider.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-1-define-shipping-address-information This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipping-address-domain-1-define-shipping-address-information Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-2-relate-addresses-to-a-customer This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipping-address-domain-2-relate-addresses-to-a-customer Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-1-list-saved-addresses This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-address-functions-1-list-saved-addresses Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_customer_addresses This operation exposes the persisted model shopping_customer_addresses.
 * @evidenceReview prisma:shopping_customer_addresses Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Patch("address/list")
  public async addressIndex(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingCustomer.IRequest): Promise<IPage<IShoppingCustomer.IAddress>> { return ShoppingCustomerCommerceProvider.addressIndex(await ShoppingSessionProvider.customer(headers.Authorization), input); }
  /** Add a saved shipping address.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-2-add-a-shipping-address Adds a customer-owned address.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-address-functions-2-add-a-shipping-address Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-address-policies-1-require-a-complete-shipping-address Validates the complete address.
 * @evidenceReview docs/analysis/04-business-rules.md#req-address-policies-1-require-a-complete-shipping-address Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("address/create")
  public async addressCreate(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingCustomer.IAddressCreate): Promise<IShoppingCustomer.IAddress> { return ShoppingCustomerCommerceProvider.addressCreate(await ShoppingSessionProvider.customer(headers.Authorization), input); }
  /** Read one saved address.
   * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-4-preserve-the-purchased-shipping-destination Exposes the saved destination used by checkout.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipping-address-domain-4-preserve-the-purchased-shipping-destination Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Get("address/detail/:id")
  public async addressAt(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingCustomer.IAddress> { return ShoppingCustomerCommerceProvider.addressAt(await ShoppingSessionProvider.customer(headers.Authorization), id); }
  /** Edit a saved address.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-3-edit-a-saved-address Updates an owned address.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-address-functions-3-edit-a-saved-address Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("address/update/:id")
  public async addressUpdate(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingCustomer.IAddressUpdate): Promise<IShoppingCustomer.IAddress> { return ShoppingCustomerCommerceProvider.addressUpdate(await ShoppingSessionProvider.customer(headers.Authorization), id, input); }
  /** Delete a saved address.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-4-delete-a-saved-address Deletes an owned address.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-address-functions-4-delete-a-saved-address Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-address-policies-4-clear-a-removed-default-without-automatic-replacement Clears a removed default without replacement.
 * @evidenceReview docs/analysis/04-business-rules.md#req-address-policies-4-clear-a-removed-default-without-automatic-replacement Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Delete("address/delete/:id")
  public async addressErase(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingCustomer.IResult> { return ShoppingCustomerCommerceProvider.addressErase(await ShoppingSessionProvider.customer(headers.Authorization), id); }
  /** Make one owned address the default.
   * @evidence docs/analysis/02-domain-model.md#req-shipping-address-domain-3-designate-one-default-address Designates the owned default address.
 * @evidenceReview docs/analysis/02-domain-model.md#req-shipping-address-domain-3-designate-one-default-address Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/03-functional-requirements.md#req-shipping-address-functions-5-set-the-default-address Sets the default address.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-shipping-address-functions-5-set-the-default-address Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("address/default/:id")
  public async addressDefault(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingCustomer.IAddress> { return ShoppingCustomerCommerceProvider.addressDefault(await ShoppingSessionProvider.customer(headers.Authorization), id); }
  /** Read the acting customer's cart.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-shopping-cart-model Publishes the shopping-cart model.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-shopping-cart-model Reviewed the customer-owned cart and variant line projection.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-shopping-cart-operations Publishes the shopping-cart operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cart-functions-shopping-cart-operations Reviewed the cart read, line mutation, and removal routes.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-cart-quantity-and-availability-policies Applies cart quantity and availability policy.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-cart-quantity-and-availability-policies Reviewed current price, shortage, seller eligibility, and ownership behavior.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-3-present-cart-line-values This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-3-present-cart-line-values Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-4-calculate-the-cart-total This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-4-calculate-the-cart-total Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-cart-domain-5-expose-cart-availability-problems This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-5-expose-cart-availability-problems Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-2-view-the-shopping-cart This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cart-functions-2-view-the-shopping-cart Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-4-expose-current-cart-price-and-availability This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-4-expose-current-cart-price-and-availability Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_carts This operation exposes the persisted model shopping_carts.
 * @evidenceReview prisma:shopping_carts Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_cart_lines This operation exposes the persisted model shopping_cart_lines.
 * @evidenceReview prisma:shopping_cart_lines Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Get("cart/read")
  public async cart(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders): Promise<IShoppingCart> { return ShoppingCustomerCommerceProvider.cart(await ShoppingSessionProvider.customer(headers.Authorization)); }
  /** Add or merge a cart variant line.
   * @evidence docs/analysis/02-domain-model.md#req-cart-domain-1-relate-a-cart-to-its-customer-and-variants Creates a customer-owned cart line.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-1-relate-a-cart-to-its-customer-and-variants Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/02-domain-model.md#req-cart-domain-2-keep-one-line-per-variant Merges repeated additions for one variant.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cart-domain-2-keep-one-line-per-variant Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-1-add-a-variant-to-the-cart Adds a variant to the cart.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cart-functions-1-add-a-variant-to-the-cart Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-cart-policies-1-require-a-positive-whole-unit-cart-quantity Validates a positive quantity.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-1-require-a-positive-whole-unit-cart-quantity Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-cart-policies-2-merge-repeated-variant-additions Merges repeated variant additions.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-2-merge-repeated-variant-additions Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-cart-policies-3-admit-only-a-purchasable-live-variant Requires a purchasable live variant.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-3-admit-only-a-purchasable-live-variant Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("cart/create")
  public async cartCreate(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingCart.ICreate): Promise<IShoppingCart> { return ShoppingCustomerCommerceProvider.cartCreate(await ShoppingSessionProvider.customer(headers.Authorization), input); }
  /** Change a cart line quantity.
   * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-3-change-cart-quantity Changes a cart line quantity.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cart-functions-3-change-cart-quantity Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-cart-policies-1-require-a-positive-whole-unit-cart-quantity Validates a positive quantity.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-1-require-a-positive-whole-unit-cart-quantity Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Put("cart/update/:id")
  public async cartUpdate(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingCart.IUpdate): Promise<IShoppingCart> { return ShoppingCustomerCommerceProvider.cartUpdate(await ShoppingSessionProvider.customer(headers.Authorization), id, input); }
  /** Remove one cart line.
   * @evidence docs/analysis/03-functional-requirements.md#req-cart-functions-4-remove-a-cart-line Removes a cart line.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cart-functions-4-remove-a-cart-line Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Delete("cart/delete/:id")
  public async cartErase(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingCart> { return ShoppingCustomerCommerceProvider.cartErase(await ShoppingSessionProvider.customer(headers.Authorization), id); }
  /** List the acting customer's wishlist.
 * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-4-order-wishlist-entries-for-paging This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-wishlist-domain-4-order-wishlist-entries-for-paging Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-2-view-the-wishlist This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-wishlist-functions-2-view-the-wishlist Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-1-keep-wishlist-changes-within-the-owning-customer This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-wishlist-policies-1-keep-wishlist-changes-within-the-owning-customer Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_wishlist_entries This operation exposes the persisted model shopping_wishlist_entries.
 * @evidenceReview prisma:shopping_wishlist_entries Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Patch("wishlist/list")
  public async wishlistIndex(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingWishlist.IRequest): Promise<IPage<IShoppingWishlist>> { return ShoppingCustomerCommerceProvider.wishlistIndex(await ShoppingSessionProvider.customer(headers.Authorization), input); }
  /** Save a product to the wishlist.
   * @evidence docs/analysis/02-domain-model.md#req-wishlist-domain-wishlist-model Publishes the wishlist model relation.
   * @evidenceReview docs/analysis/02-domain-model.md#req-wishlist-domain-wishlist-model Reviewed the customer-product relation and idempotent save.
   * @evidence docs/analysis/03-functional-requirements.md#req-wishlist-functions-wishlist-operations Publishes the wishlist operation family.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-wishlist-functions-wishlist-operations Reviewed create, list, and delete ownership routes.
   * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-wishlist-membership-policies Applies wishlist membership policy.
   * @evidenceReview docs/analysis/04-business-rules.md#req-wishlist-policies-wishlist-membership-policies Reviewed idempotency and nonreserving product membership.
   * @tag Wishlist */
  @core.TypedRoute.Post("wishlist/create")
  public async wishlistCreate(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingWishlist.ICreate): Promise<IShoppingWishlist> { return ShoppingCustomerCommerceProvider.wishlistCreate(await ShoppingSessionProvider.customer(headers.Authorization), input); }
  /** Remove a wishlist entry.
   * @evidence docs/analysis/04-business-rules.md#req-wishlist-policies-wishlist-membership-policies Retires only the acting customer's saved entry.
   * @evidenceReview docs/analysis/04-business-rules.md#req-wishlist-policies-wishlist-membership-policies Reviewed the customer ownership guard and deletion boundary.
   * @tag Wishlist */
  @core.TypedRoute.Delete("wishlist/delete/:id")
  public async wishlistErase(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingCustomer.IResult> { return ShoppingCustomerCommerceProvider.wishlistErase(await ShoppingSessionProvider.customer(headers.Authorization), id); }
  /** List the acting customer's orders.
   * @evidence docs/analysis/02-domain-model.md#req-order-domain-order-model Publishes the retained order model.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-domain-order-model Reviewed customer ownership, item aggregation, and immutable order facts.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-order-item-states Publishes item-scoped order state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-item-lifecycle-order-item-states Reviewed the item status projection and live fulfillment relation.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-derived-order-states Publishes the derived order status.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-lifecycle-derived-order-states Reviewed status derivation from all item states.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-customer-order-history Publishes customer order history.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-history-functions-customer-order-history Reviewed customer scope, status filtering, and retained presentation.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-order-composition-pricing-and-status-policies Applies order composition, pricing, and status policy.
 * @evidenceReview docs/analysis/04-business-rules.md#req-order-policies-order-composition-pricing-and-status-policies Reviewed purchase-time item facts and derived status.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-1-keep-commercial-history-through-retirement Preserves commercial history after live retirement.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-history-continuity-1-keep-commercial-history-through-retirement Reviewed the order projection's independent retained evidence.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-commercial-history-and-privacy-continuity Applies history and privacy continuity.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-history-continuity-commercial-history-and-privacy-continuity Reviewed customer-scoped history access and purchase-time facts.
   * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-1-list-customer-orders Lists the acting customer's retained orders.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-history-functions-1-list-customer-orders Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Patch("order/list")
  public async orderIndex(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingOrder.IRequest): Promise<IPage<IShoppingOrder>> { return ShoppingOrderProvider.index(await ShoppingSessionProvider.customer(headers.Authorization), input); }
  /** Read one retained customer order.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-1-define-order-information This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-domain-1-define-order-information Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-2-relate-an-order-to-its-customer-and-items This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-domain-2-relate-an-order-to-its-customer-and-items Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-4-allow-multi-seller-orders This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-domain-4-allow-multi-seller-orders Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-order-domain-5-relate-items-to-fulfillment-and-after-sales-records This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-domain-5-relate-items-to-fulfillment-and-after-sales-records Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-1-begin-items-in-paid-status This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-item-lifecycle-1-begin-items-in-paid-status Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-2-transition-paid-items-to-shipped This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-item-lifecycle-2-transition-paid-items-to-shipped Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-3-transition-shipped-items-to-delivered This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-item-lifecycle-3-transition-shipped-items-to-delivered Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-4-transition-an-item-to-cancelled This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-item-lifecycle-4-transition-an-item-to-cancelled Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-5-transition-an-item-to-refunded This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-item-lifecycle-5-transition-an-item-to-refunded Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-order-item-lifecycle-6-preserve-item-facts-across-status-changes This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-item-lifecycle-6-preserve-item-facts-across-status-changes Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-1-derive-paid-order-status This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-lifecycle-1-derive-paid-order-status Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-2-derive-shipped-order-status This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-lifecycle-2-derive-shipped-order-status Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-3-derive-delivered-order-status This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-lifecycle-3-derive-delivered-order-status Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-4-derive-cancelled-order-status This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-lifecycle-4-derive-cancelled-order-status Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-5-derive-refunded-order-status This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-lifecycle-5-derive-refunded-order-status Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-order-lifecycle-6-derive-partially-completed-status This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-order-lifecycle-6-derive-partially-completed-status Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-2-view-order-details This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-history-functions-2-view-order-details Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-history-functions-3-view-order-shipments This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-order-history-functions-3-view-order-shipments Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-1-calculate-the-fixed-purchase-total This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-order-policies-1-calculate-the-fixed-purchase-total Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-3-keep-fulfillment-and-resolution-item-scoped This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-order-policies-3-keep-fulfillment-and-resolution-item-scoped Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-4-derive-the-complete-overall-order-status This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-order-policies-4-derive-the-complete-overall-order-status Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-order-policies-5-present-orders-from-purchase-time-evidence This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-order-policies-5-present-orders-from-purchase-time-evidence Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-customer-account-policies-3-retain-the-commercial-order-graph This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-customer-account-policies-3-retain-the-commercial-order-graph Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-history-continuity-2-keep-past-order-presentation-stable This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-history-continuity-2-keep-past-order-presentation-stable Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_orders This operation exposes the persisted model shopping_orders.
 * @evidenceReview prisma:shopping_orders Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_order_items This operation exposes the persisted model shopping_order_items.
 * @evidenceReview prisma:shopping_order_items Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_order_item_snapshots This operation exposes the persisted model shopping_order_item_snapshots.
 * @evidenceReview prisma:shopping_order_item_snapshots Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Get("order/detail/:id")
  public async orderAt(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingOrder> { return ShoppingOrderProvider.at(await ShoppingSessionProvider.customer(headers.Authorization), id); }
  /** Start checkout and create the successful paid order.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-checkout-and-order-placement-journey Publishes the checkout and order-placement journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-checkout-journey-checkout-and-order-placement-journey Reviewed address ownership, eligible lines, payment attempt, and atomic order creation.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-4-recover-from-payment-failure Publishes the gateway failure boundary.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-checkout-journey-4-recover-from-payment-failure Reviewed the payment-attempt failure path and clean cart-preserving outcome.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-6-commit-stock-and-cart-effects Commits stock and cart effects with the successful order.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-checkout-journey-6-commit-stock-and-cart-effects Reviewed the transaction covering order items, purchase snapshots, movements, and cart removal.
 * @evidence docs/analysis/04-business-rules.md#req-cart-policies-5-exclude-ineligible-lines-from-checkout Excludes unavailable cart lines while retaining them for correction.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cart-policies-5-exclude-ineligible-lines-from-checkout Reviewed the eligible-line filter and selected-line transaction.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-3-fix-the-purchase-shipping-address Captures the selected owned address into the order.
 * @evidenceReview docs/analysis/04-business-rules.md#req-checkout-policies-3-fix-the-purchase-shipping-address Reviewed the address ownership check and immutable order destination copy.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-checkout-payment-and-order-creation-policies Applies checkout payment and order-creation policy.
 * @evidenceReview docs/analysis/04-business-rules.md#req-checkout-policies-checkout-payment-and-order-creation-policies Reviewed revalidation, idempotency, and atomic commit.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-4-recover-cleanly-from-unsuccessful-payment Applies clean payment-failure recovery.
 * @evidenceReview docs/analysis/04-business-rules.md#req-checkout-policies-4-recover-cleanly-from-unsuccessful-payment Reviewed the terminal failed attempt and preserved selected cart lines.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-1-expose-one-complete-successful-purchase-outcome Exposes one complete successful purchase outcome.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-1-expose-one-complete-successful-purchase-outcome Reviewed the order, item, movement, snapshot, and cart effects.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-2-preserve-a-clean-state-after-payment-failure Preserves a clean state after payment failure.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-2-preserve-a-clean-state-after-payment-failure Reviewed the failed payment attempt's no-order/no-movement path.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-purchase-and-resolution-consistency Applies purchase consistency.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-purchase-consistency-purchase-and-resolution-consistency Reviewed the transaction and idempotency boundary.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-1-start-checkout This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-checkout-journey-1-start-checkout Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-2-review-the-order-summary This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-checkout-journey-2-review-the-order-summary Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-3-confirm-and-initiate-payment This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-checkout-journey-3-confirm-and-initiate-payment Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-checkout-journey-5-create-the-paid-order This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-checkout-journey-5-create-the-paid-order Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-address-policies-5-use-only-a-current-owned-address-at-checkout This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-address-policies-5-use-only-a-current-owned-address-at-checkout Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-1-require-purchasable-lines-and-an-owned-address This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-checkout-policies-1-require-purchasable-lines-and-an-owned-address Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-2-refresh-material-purchase-facts-before-charge This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-checkout-policies-2-refresh-material-purchase-facts-before-charge Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-5-make-gateway-success-idempotent This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-checkout-policies-5-make-gateway-success-idempotent Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-checkout-policies-6-commit-the-successful-purchase-atomically This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-checkout-policies-6-commit-the-successful-purchase-atomically Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_payment_attempts This operation exposes the persisted model shopping_payment_attempts.
 * @evidenceReview prisma:shopping_payment_attempts Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("checkout/execute")
  public async checkout(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingOrder.ICheckout): Promise<IShoppingOrder> { return ShoppingOrderProvider.checkout(await ShoppingSessionProvider.customer(headers.Authorization), input); }
  /** Request cancellation of one paid item.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-cancellation-request-lifecycle Publishes the cancellation-request lifecycle.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cancellation-domain-cancellation-request-lifecycle Reviewed request creation, customer ownership, and pending uniqueness.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-order-item-cancellation-journey Publishes the order-item cancellation journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cancellation-functions-order-item-cancellation-journey Reviewed the paid-item gate and request provider delegation.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-cancellation-eligibility-and-resolution-policies Applies cancellation eligibility and resolution policy.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cancellation-policies-cancellation-eligibility-and-resolution-policies Reviewed paid-item eligibility and one-pending-request behavior.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-1-open-a-cancellation-request This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cancellation-domain-1-open-a-cancellation-request Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-cancellation-domain-5-relate-cancellation-participants-and-target This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-cancellation-domain-5-relate-cancellation-participants-and-target Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-1-request-item-cancellation This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cancellation-functions-1-request-item-cancellation Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-1-admit-a-cancellation-request-for-a-paid-item This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cancellation-policies-1-admit-a-cancellation-request-for-a-paid-item Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-cancellation-policies-2-keep-one-pending-cancellation-decision-per-item This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-cancellation-policies-2-keep-one-pending-cancellation-decision-per-item Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_cancellation_requests This operation exposes the persisted model shopping_cancellation_requests.
 * @evidenceReview prisma:shopping_cancellation_requests Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("cancellation/create")
  public async cancellationCreate(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingCancellationRequest.ICreate): Promise<IShoppingCancellationRequest> { return ShoppingAfterSalesProvider.cancellationCreate(await ShoppingSessionProvider.customer(headers.Authorization), input); }
  /** List the acting customer's cancellation requests.
   * @evidence docs/analysis/03-functional-requirements.md#req-cancellation-functions-2-list-pending-cancellations Lists the acting customer's pending cancellations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-cancellation-functions-2-list-pending-cancellations Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Patch("cancellation/list")
  public async cancellationIndex(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingCancellationRequest.IRequest): Promise<IPage<IShoppingCancellationRequest>> { return ShoppingAfterSalesProvider.cancellationIndex(await ShoppingSessionProvider.customer(headers.Authorization), input); }
  /** Request a refund of one delivered item.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-refund-request-lifecycle Publishes the refund-request lifecycle.
 * @evidenceReview docs/analysis/02-domain-model.md#req-refund-domain-refund-request-lifecycle Reviewed delivered-item ownership, deadline, and pending uniqueness.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-delivered-item-refund-journey Publishes the delivered-item refund journey.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-refund-functions-delivered-item-refund-journey Reviewed the seven-day eligibility boundary and request creation.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-refund-eligibility-and-resolution-policies Applies refund eligibility and resolution policy.
 * @evidenceReview docs/analysis/04-business-rules.md#req-refund-policies-refund-eligibility-and-resolution-policies Reviewed delivery, deadline, seller scope, and atomic decision delegation.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-1-open-a-refund-request This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-refund-domain-1-open-a-refund-request Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-refund-domain-5-relate-refund-participants-and-target This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-refund-domain-5-relate-refund-participants-and-target Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-1-request-an-item-refund This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-refund-functions-1-request-an-item-refund Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-1-admit-a-timely-refund-request-for-a-delivered-item This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-refund-policies-1-admit-a-timely-refund-request-for-a-delivered-item Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-2-close-the-refund-window-after-seven-days This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-refund-policies-2-close-the-refund-window-after-seven-days Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-refund-policies-3-keep-one-pending-refund-decision-per-item This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-refund-policies-3-keep-one-pending-refund-decision-per-item Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_refund_requests This operation exposes the persisted model shopping_refund_requests.
 * @evidenceReview prisma:shopping_refund_requests Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("refund/create")
  public async refundCreate(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingRefundRequest.ICreate): Promise<IShoppingRefundRequest> { return ShoppingAfterSalesProvider.refundCreate(await ShoppingSessionProvider.customer(headers.Authorization), input); }
  /** List the acting customer's refund requests.
   * @evidence docs/analysis/03-functional-requirements.md#req-refund-functions-2-list-pending-refunds Lists the acting customer's pending refunds.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-refund-functions-2-list-pending-refunds Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Patch("refund/list")
  public async refundIndex(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingRefundRequest.IRequest): Promise<IPage<IShoppingRefundRequest>> { return ShoppingAfterSalesProvider.refundIndex(await ShoppingSessionProvider.customer(headers.Authorization), input); }
  /** Publish a verified product review.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-review-publication-and-retirement Publishes the review publication and retirement lifecycle.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-review-publication-and-retirement Reviewed verified delivery, live review projection, and author mutation routes.
 * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-review-operations Publishes the review operation family.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-review-functions-review-operations Reviewed create, update, delete, and product-list routes.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-review-eligibility-ordering-and-rating-policies Applies review eligibility, ordering, and rating policy.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-review-eligibility-ordering-and-rating-policies Reviewed delivered purchase, normalized rating, duplicate tuple, and publication ordering guards.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-1-define-review-information This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-1-define-review-information Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-2-relate-a-review-to-its-purchase This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-2-relate-a-review-to-its-purchase Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-review-domain-3-limit-reviews-per-purchase This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-domain-3-limit-reviews-per-purchase Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-1-publish-an-eligible-review This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-1-publish-an-eligible-review Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-1-require-a-verified-delivered-purchase This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-1-require-a-verified-delivered-purchase Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence docs/analysis/04-business-rules.md#req-review-policies-2-validate-review-rating-and-optional-text This operation represents the behavior defined by this unit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-2-validate-review-rating-and-optional-text Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
 * @evidence prisma:shopping_reviews This operation exposes the persisted model shopping_reviews.
 * @evidenceReview prisma:shopping_reviews Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Post("review/create")
  public async reviewCreate(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedBody() input: IShoppingReview.ICreate): Promise<IShoppingReview> { return ShoppingAfterSalesProvider.reviewCreate(await ShoppingSessionProvider.customer(headers.Authorization), input); }
  /** Edit an authored review.
   * @evidence docs/analysis/04-business-rules.md#req-review-policies-5-order-live-reviews-by-publication-time Preserves original publication ordering during edit.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-5-order-live-reviews-by-publication-time Reviewed the update path leaves published_at unchanged.
   * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-2-edit-a-published-review Edits a published authored review.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-2-edit-a-published-review Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-2-edit-an-authored-review Updates the author's review.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-review-functions-2-edit-an-authored-review Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-review-policies-4-keep-review-mutation-with-the-author Restricts mutation to the author.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-4-keep-review-mutation-with-the-author Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence prisma:shopping_review_snapshots Persists immutable review edit evidence.
   * @evidenceReview prisma:shopping_review_snapshots Read the review update transaction and confirmed the before-and-after snapshot is created with the edit.
   */
  @core.TypedRoute.Put("review/update/:id")
  public async reviewUpdate(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IShoppingReview.IUpdate): Promise<IShoppingReview> { return ShoppingAfterSalesProvider.reviewUpdate(await ShoppingSessionProvider.customer(headers.Authorization), id, input); }
  /** Retire an authored review.
   * @evidence docs/analysis/04-business-rules.md#req-review-policies-7-anonymize-retained-reviews-after-account-deletion Keeps deletion separate from account-closure anonymization.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-7-anonymize-retained-reviews-after-account-deletion Reviewed the author-only retirement path and retained review identity.
   * @evidence docs/analysis/02-domain-model.md#req-review-lifecycle-3-delete-a-published-review Retires the authored review.
 * @evidenceReview docs/analysis/02-domain-model.md#req-review-lifecycle-3-delete-a-published-review Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/03-functional-requirements.md#req-review-functions-3-delete-an-authored-review Deletes the authored review.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-review-functions-3-delete-an-authored-review Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   * @evidence docs/analysis/04-business-rules.md#req-review-policies-4-keep-review-mutation-with-the-author Restricts mutation to the author.
 * @evidenceReview docs/analysis/04-business-rules.md#req-review-policies-4-keep-review-mutation-with-the-author Reviewed the cited requirement against this controller's actor guard, provider delegation, and response shape.
   */
  @core.TypedRoute.Delete("review/delete/:id")
  public async reviewErase(@core.TypedHeaders() headers: IShoppingCustomer.IHeaders, @core.TypedParam("id") id: string): Promise<IShoppingCustomer.IResult> { return ShoppingAfterSalesProvider.reviewErase(await ShoppingSessionProvider.customer(headers.Authorization), id); }
}
