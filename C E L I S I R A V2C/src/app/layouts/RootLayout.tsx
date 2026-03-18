import React from "react";
import { Outlet, useLocation, useOutlet } from "react-router";
import { AnimatePresence } from "motion/react";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { Navigation } from "../components/Navigation";
import { BottomNav } from "../components/BottomNav";
import { CartDrawer } from "../components/CartDrawer";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";

// AnimatedOutlet — clones the current outlet element with a key based on pathname
function AnimatedOutlet() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {element &&
        React.cloneElement(element, {
          key: location.pathname,
        } as React.HTMLAttributes<Element>)}
    </AnimatePresence>
  );
}

export function RootLayout() {
  return (
    <WishlistProvider>
      <CartProvider>
        <div
          className="relative min-h-screen flex flex-col"
          style={{ background: "#F8F6F1", fontFamily: "'DM Sans', sans-serif" }}
        >
          <div className="flex-shrink-0">
            <AnnouncementBar />
            <Navigation />
          </div>
          <main className="flex-grow">
            <AnimatedOutlet />
          </main>
          <BottomNav />
          <CartDrawer />
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}