import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const tabs = [
  { id: "home", icon: Home, label: "Home", href: "/" },
  { id: "search", icon: Search, label: "Search", href: "/collections/all" },
  { id: "wishlist", icon: Heart, label: "Wishlist", href: "/wishlist" },
  { id: "cart", icon: ShoppingBag, label: "Cart", href: "/" },
  { id: "account", icon: User, label: "Account", href: "/account" },
];

export function BottomNav() {
  const location = useLocation();
  const { itemCount, openDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();

  const getActiveId = () => {
    if (location.pathname === "/") return "home";
    if (location.pathname.startsWith("/collections")) return "search";
    if (location.pathname === "/wishlist") return "wishlist";
    if (location.pathname === "/account") return "account";
    return "home";
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(248,246,241,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(229,226,217,0.8)",
        }}
      />

      <div className="relative flex items-center justify-around px-2 h-[62px]">
        {tabs.map((tab) => {
          const isActive = getActiveId() === tab.id;
          const Icon = tab.icon;
          const isCart = tab.id === "cart";
          const isWishlist = tab.id === "wishlist";

          const content = (
            <motion.div
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative py-1"
              whileTap={{ scale: 0.88 }}
              aria-label={tab.label}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-dot"
                    className="absolute top-1.5 w-1 h-1 rounded-full bg-[#BF9B5E]"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  />
                )}
              </AnimatePresence>

              <div className="relative">
                <motion.div
                  animate={{ y: isActive ? -2 : 0, scale: isActive ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.2 : 1.7}
                    style={{
                      color: isActive ? "#0C0C0B" : "#A0998F",
                      transition: "color 0.2s",
                      fill: isWishlist && wishlistCount > 0 ? "#BF9B5E" : "none",
                    }}
                  />
                </motion.div>

                {isCart && itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#0C0C0B] text-white flex items-center justify-center"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8, fontWeight: 700 }}
                  >
                    {itemCount}
                  </motion.span>
                )}

                {isWishlist && wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#BF9B5E] text-white flex items-center justify-center"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8, fontWeight: 700 }}
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </div>

              <motion.span
                animate={{ color: isActive ? "#0C0C0B" : "#A0998F", fontWeight: isActive ? 600 : 400 }}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                {tab.label}
              </motion.span>
            </motion.div>
          );

          if (isCart) {
            return (
              <button key={tab.id} onClick={openDrawer} className="flex-1 h-full flex items-center justify-center">
                {content}
              </button>
            );
          }

          return (
            <Link key={tab.id} to={tab.href} className="flex-1 h-full flex items-center justify-center">
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}