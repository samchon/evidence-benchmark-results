import { Navigate, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";

import { useAuth } from "@/lib/auth";
import { AppFrame } from "@/components/app-frame";
import { AuthPage } from "@/components/auth/auth-page";
import { AdminReviewPage as AdminPage } from "@/components/admin/admin-review-page";
import { ApplicationsPage, CatalogPage, CustomerHomePage, OrdersPage, ProductPage, ProfilePage, WishlistPage } from "@/components/customer/customer-pages";
import { OrderDetailPage } from "@/components/customer/order-detail-page";
import { ReviewsPage } from "@/components/customer/reviews-page";
import { CartCheckoutPage } from "@/components/customer/cart-checkout-page";
import { AddressesPage } from "@/components/customer/addresses-page";
import { AccountPage } from "@/components/customer/account-page";
import { SellerPublicPage } from "@/components/customer/seller-public-page";
import { SellerDashboardPage, SellerFulfillmentPage, SellerProfilePage } from "@/components/seller/seller-pages";
import { SellerAccountPage } from "@/components/seller/account-page";
import { ProductWorkbenchPage } from "@/components/seller/product-workbench-page";
import { SellerApplicationsReviewPage } from "@/components/seller/applications-review-page";
import { AppProviders } from "./components/providers/app-providers";
import { GalleryPage } from "@/components/dev/gallery-page";

function ProtectedLayout() {
  const auth = useAuth();
  const location = useLocation();
  if (auth.status === "restoring") return <div className="app-loading" aria-live="polite">Restoring your workspace...</div>;
  if (auth.status === "anonymous") return <Navigate replace to="/login" state={{ from: location }} />;
  return <AppFrame />;
}

function PublicHome() {
  const auth = useAuth();
  if (auth.status === "authenticated") return <Navigate replace to="/app" />;
  return <main className="public-home"><div className="public-top"><span className="brand"><span className="brand-mark">B</span><span><strong>bench / shop</strong><small>commerce desk</small></span></span><div className="button-row"><a className="button button-quiet" href="/login">Sign in</a><a className="button button-primary" href="/register/customer">Create account</a></div></div><section className="hero"><div><p className="eyebrow">A complete commerce record</p><h1>Shop with less guesswork.</h1><p className="hero-copy">Discover products, preserve purchase facts, and give every order a clear next step for the customer and the seller.</p><div className="button-row"><a className="button button-primary" href="/register/customer">Start as a customer</a><a className="button button-quiet" href="/register/seller">Open a seller desk</a></div></div><div className="hero-board"><div className="board-top"><span>Today’s workspace</span><StatusDot label="Live" /></div><div className="hero-order"><span>ORDER / 04172</span><strong>Ready for fulfillment</strong><p>Three items · two sellers · one immutable destination</p></div><div className="hero-stats"><span><strong>12</strong><small>saved products</small></span><span><strong>04</strong><small>open decisions</small></span></div></div></section><section className="public-features"><div><span className="feature-number">01</span><h2>See the current truth</h2><p>Prices, stock, seller state, and unavailable cart lines stay visible until you choose what to do.</p></div><div><span className="feature-number">02</span><h2>Keep history stable</h2><p>Orders preserve what was purchased, even after live profiles, products, or addresses change.</p></div><div><span className="feature-number">03</span><h2>Resolve with confidence</h2><p>Shipping, cancellation, refund, and review journeys expose the business effect they create.</p></div></section></main>;
}

function StatusDot(props: { label: string }) { return <span className="live-dot"><i />{props.label}</span>; }

function WorkspaceHome() {
  const { actorType } = useAuth();
  return actorType === "seller" ? <SellerDashboardPage /> : <CustomerHomePage />;
}

function NotFound() { return <main className="not-found"><p className="eyebrow">404</p><h1>That page is not in this workspace.</h1><a className="button button-primary" href="/app">Return to workspace</a></main>; }

export function App() {
 return <AppProviders><Routes><Route path="/" element={<PublicHome />} /><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/recover" element={<AuthPage mode="recover" />} /><Route path="/register/:kind" element={<RegisterRoute />} /><Route path="/dev/gallery" element={<GalleryPage />} /><Route element={<ProtectedLayout />}><Route path="/app" element={<WorkspaceHome />} /><Route path="/app/catalog" element={<CatalogPage />} /><Route path="/app/product/:id" element={<ProductPage />} /><Route path="/app/seller/:id" element={<SellerPublicPage />} /><Route path="/app/cart" element={<CartCheckoutPage />} /><Route path="/app/orders" element={<OrdersPage />} /><Route path="/app/orders/:id" element={<OrderDetailPage />} /><Route path="/app/profile" element={<ProfilePage />} /><Route path="/app/account" element={<AccountPage />} /><Route path="/app/addresses" element={<AddressesPage />} /><Route path="/app/wishlist" element={<WishlistPage />} /><Route path="/app/applications" element={<ApplicationsPage />} /><Route path="/app/reviews" element={<ReviewsPage />} /><Route path="/app/seller" element={<SellerDashboardPage />} /><Route path="/app/seller/products" element={<ProductWorkbenchPage />} /><Route path="/app/seller/fulfillment" element={<SellerFulfillmentPage />} /><Route path="/app/seller/profile" element={<SellerProfilePage />} /><Route path="/app/seller/applications" element={<SellerApplicationsReviewPage />} /><Route path="/app/seller/account" element={<SellerAccountPage />} /><Route path="/app/admin" element={<AdminPage />} /></Route><Route path="*" element={<NotFound />} /></Routes></AppProviders>;
}

function RegisterRoute() {
  const { kind = "customer" } = useParams<{ kind: string }>();
  return <AuthPage mode="register" initialKind={kind === "seller" ? "seller" : "customer"} key={kind} />;
}
