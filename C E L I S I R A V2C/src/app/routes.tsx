import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "collections/:slug", Component: CollectionPage },
      { path: "collections", Component: CollectionPage },
      { path: "products/:slug", Component: ProductDetailPage },
      { path: "wishlist", Component: WishlistPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "account", Component: AccountPage },
    ],
  },
]);