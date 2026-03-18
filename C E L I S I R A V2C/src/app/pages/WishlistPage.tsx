import { motion, AnimatePresence } from "motion/react";
import { Heart, X, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { PageTransition } from "../components/PageTransition";

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────

function EmptyWishlist() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      {/* Animated heart */}
      <motion.div
        className="relative mb-8"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <div className="w-24 h-24 rounded-full bg-[#F0EDE8] flex items-center justify-center">
          <Heart size={38} strokeWidth={1.2} className="text-[#BF9B5E]" />
        </div>
        {/* Sparkles orbiting */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
            }}
            animate={{ rotate: [i * 120, i * 120 + 360] }}
            transition={{ repeat: Infinity, duration: 6 + i, ease: "linear" }}
          >
            <motion.div
              style={{ x: 44, y: -44 }}
              animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.8 }}
            >
              <Sparkles size={10} className="text-[#BF9B5E]" />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <h2
        className="mb-3"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(1.8rem, 7vw, 2.8rem)",
          fontWeight: 600,
          color: "#0C0C0B",
          lineHeight: 1.1,
        }}
      >
        Your wishlist awaits
      </h2>
      <p
        className="text-[#8C8880] max-w-xs mb-8"
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.65 }}
      >
        Save pieces that speak to you. They'll be right here when you're ready.
      </p>

      <motion.div whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}>
        <Link
          to="/collections/all"
          className="flex items-center gap-2 px-8 py-4 bg-[#0C0C0B] text-white rounded-full text-xs font-black tracking-widest uppercase relative overflow-hidden group"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <motion.div
            className="absolute inset-0 bg-[#BF9B5E]"
            initial={{ x: "-101%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          />
          <span className="relative z-10">Discover Collection</span>
          <ArrowRight size={14} className="relative z-10" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─── WISHLIST CARD ────────────────────────────────────────────────────────────

function WishlistCard({ item, index }: { item: ReturnType<typeof useWishlist>["items"][0]; index: number }) {
  const { remove } = useWishlist();
  const { addItem, openDrawer } = useCart();

  const handleAddToCart = () => {
    // Add with first size and variant as default
    addItem(
      {
        id: item.id,
        slug: item.slug,
        name: item.name,
        subtitle: item.subtitle,
        price: item.price,
        originalPrice: item.originalPrice,
        badge: item.badge,
        images: item.images,
        variants: [],
        sizes: ["S", "M", "L"],
        description: "",
        details: [],
        care: [],
        rating: 4.8,
        reviewCount: 0,
        collection: "all",
      },
      "M",
      "v1",
      "Default",
      "#BF9B5E"
    );
    openDrawer();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      layout
      className="group relative bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Remove button */}
      <motion.button
        onClick={() => remove(item.id)}
        whileTap={{ scale: 0.88 }}
        whileHover={{ rotate: 90, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-gray-100 flex items-center justify-center shadow-sm"
        aria-label="Remove from wishlist"
      >
        <X size={14} strokeWidth={2} className="text-[#0C0C0B]" />
      </motion.button>

      {/* Badge */}
      {item.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span
            className="text-[9px] font-black tracking-[0.15em] px-2.5 py-1 rounded-full"
            style={{
              background: item.badge === "SALE" ? "#0C0C0B" : "#fff",
              color: item.badge === "SALE" ? "#fff" : "#0C0C0B",
              border: item.badge === "NEW" ? "1px solid #0C0C0B" : "none",
            }}
          >
            {item.badge}
          </span>
        </div>
      )}

      {/* Image */}
      <Link to={`/products/${item.slug}`} className="block">
        <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "3/4" }}>
          <motion.img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link to={`/products/${item.slug}`}>
          <h3 className="text-[13px] tracking-tight leading-snug mb-1 hover:text-[#BF9B5E] transition-colors">
            <span className="font-black">{item.name}</span>
            <span className="text-gray-400 font-normal"> — {item.subtitle}</span>
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-black" style={{ fontSize: 17 }}>${item.price.toFixed(2)}</span>
          {item.originalPrice > item.price && (
            <span className="text-xs line-through text-gray-400">${item.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Add to Cart */}
        <motion.button
          onClick={handleAddToCart}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3 rounded-2xl border-2 border-black text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ x: "-101%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          />
          <ShoppingBag size={12} className="relative z-10 group-hover:text-white transition-colors" />
          <span className="relative z-10 group-hover:text-white transition-colors">Add to Bag</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function WishlistPage() {
  const { items, count } = useWishlist();
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div
        className="min-h-screen pt-[90px] pb-[100px]"
        style={{ background: "#F8F6F1" }}
      >
        {/* Header */}
        <div className="px-5 pt-6 pb-8 max-w-screen-lg mx-auto">
          <motion.button
            onClick={() => navigate(-1)}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-1.5 text-[#8C8880] text-xs tracking-widest uppercase mb-6 hover:text-[#0C0C0B] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            ← Back
          </motion.button>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[#8C8880] text-[10px] tracking-[0.25em] uppercase font-medium mb-2"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Saved Items
          </motion.p>

          <div className="flex items-end justify-between">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.4rem, 10vw, 4rem)",
                fontWeight: 700,
                lineHeight: 1.0,
                color: "#0C0C0B",
              }}
            >
              My<br />
              <em className="italic" style={{ color: "#BF9B5E" }}>Wishlist.</em>
            </motion.h1>

            <AnimatePresence>
              {count > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 mb-1"
                >
                  <Heart size={14} className="text-[#BF9B5E]" fill="#BF9B5E" />
                  <span
                    className="text-[#8C8880] text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {count} {count === 1 ? "piece" : "pieces"} saved
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-px bg-[#E5E2D9] mt-6"
          />
        </div>

        {/* Content */}
        <div className="px-5 max-w-screen-lg mx-auto">
          <AnimatePresence mode="wait">
            {count === 0 ? (
              <EmptyWishlist key="empty" />
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                <AnimatePresence>
                  {items.map((item, i) => (
                    <WishlistCard key={item.id} item={item} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue Shopping */}
          {count > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex justify-center mt-10"
            >
              <Link
                to="/collections/all"
                className="flex items-center gap-2 text-sm text-[#8C8880] hover:text-[#0C0C0B] transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <span>Continue Shopping</span>
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}