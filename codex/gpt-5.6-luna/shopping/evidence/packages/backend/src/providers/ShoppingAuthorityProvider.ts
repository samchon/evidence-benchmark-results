import { ShoppingSessionProvider } from "./ShoppingSessionProvider";
import { ShoppingSellerSessionProvider } from "./ShoppingSellerSessionProvider";

/** Resolves a bearer session to the existing customer or seller authority. */
export namespace ShoppingAuthorityProvider {
  export interface IActor { type: "customer" | "seller"; id: string; }

  export async function actor(authorization: string): Promise<IActor> {
    try { return { type: "customer", id: await ShoppingSessionProvider.customer(authorization) }; } catch { return { type: "seller", id: await ShoppingSellerSessionProvider.seller(authorization) }; }
  }
}
