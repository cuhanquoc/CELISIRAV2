import { useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal, X, ChevronDown, ArrowUpRight, Heart, Star } from "lucide-react";
import { ALL_PRODUCTS } from "../data/products";
import type { Product } from "../data/products";
import { PageTransition } from "../components/PageTransition";
import { SiteFooter } from "../components/SiteFooter";
import { useWishlist } from "../context/WishlistContext";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const COLLECTION_META: Record<string, { title: string; subtitle: string; image: string }> = {
  all: {
    title: "All Styles",
    subtitle: "The complete Celisira edit — every drop, every season.",
    image: "https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
  },
  dresses: {
    title: "Dresses",
    subtitle: "From effortless daywear to evening elegance — find your signature dress.",
    image: "https://images.unsplash.com/photo-1767687700398-b2052993fb56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
  },
  "new-arrivals": {
    title: "New Arrivals",
    subtitle: "Fresh from the studio — the latest additions to the Celisira world.",
    image: "https://images.unsplash.com/photo-1746730921745-5f6afa4c56c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
  },
  sale: {
    title: "Sale",
    subtitle: "Last chance to own a piece of the collection — up to 60% off.",
    image: "https://images.unsplash.com/photo-1741816219965-c85341184d68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
  },
  resort: {
    title: "Resort Edit",
    subtitle: "Sun, sea, and effortless style. The vacation wardrobe you've been dreaming of.",
    image: "https://images.unsplash.com/photo-1773099217427-77bba76cf0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
  },
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "new-arrivals", label: "New In" },
  { id: "sale", label: "Sale" },
  { id: "dresses", label: "Dresses" },
  { id: "resort", label: "Resort" },
  { id: "under50", label: "Under $50" },
];

const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "newest", label: "Newest" },
  { id: "rating", label: "Best Rated" },
];

// ─── PRODUCT GRID CARD ────────────────────────────────────────────────────────

function GridCard({ product, index }: { product: Product; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [burst, setBurst] = useState(false);
  const { isWishlisted, toggle } = useWishlist();
  const liked = isWishlisted(product.id);

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!liked) {
      setBurst(true);
      setTimeout(() => setBurst(false), 600);
    }
    toggle({
      id: product.id,
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      originalPrice: product.originalPrice,
      badge: product.badge,
      images: product.images,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => { setHovered(true); setImgIdx(1); }}
      onHoverEnd={() => { setHovered(false); setImgIdx(0); }}
      className="group cursor-pointer"
    >
      {/* Image */}
      <Link to={`/products/${product.slug}`}>
        <div
          className="relative overflow-hidden rounded-[16px] mb-3"
          style={{ aspectRatio: "3/4" }}
        >
          {/* Images crossfade */}
          {product.images.slice(0, 2).map((img, i) => (
            <motion.img
              key={i}
              src={img}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ opacity: imgIdx === i ? 1 : 0, scale: hovered && i === 1 ? 1.04 : 1 }}
              transition={{ duration: 0.4 }}
            />
          ))}

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-10">
              <span
                className="text-[9px] font-black tracking-[0.16em] uppercase px-2.5 py-1 rounded-full"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: product.badge === "SALE" ? "#0C0C0B" : "#fff",
                  color: product.badge === "SALE" ? "#fff" : "#0C0C0B",
                }}
              >
                {product.badge === "SALE" ? `-${discount}%` : "NEW"}
              </span>
            </div>
          )}

          {/* Wishlist */}
          <motion.button
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-sm overflow-visible"
            whileTap={{ scale: 0.85 }}
            onClick={handleWishlist}
            animate={{ opacity: hovered || liked ? 1 : 0, scale: hovered || liked ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {/* Burst particles */}
            <AnimatePresence>
              {burst && (
                <>
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-red-400 pointer-events-none"
                      initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                      animate={{
                        scale: [0, 1, 0],
                        x: Math.cos((i / 5) * Math.PI * 2) * 14,
                        y: Math.sin((i / 5) * Math.PI * 2) * 14,
                        opacity: [1, 1, 0],
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
            <motion.div
              animate={liked ? { scale: [1, 1.4, 0.9, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Heart
                size={14}
                fill={liked ? "#ef4444" : "none"}
                stroke={liked ? "#ef4444" : "#0C0C0B"}
                strokeWidth={2}
              />
            </motion.div>
          </motion.button>

          {/* Quick view pill */}
          <motion.div
            className="absolute bottom-3 left-3 right-3 z-10"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: hovered ? 0 : 8, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="w-full py-2.5 bg-white/90 backdrop-blur-sm rounded-full text-center flex items-center justify-center gap-1.5"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}
            >
              <ArrowUpRight size={12} />
              VIEW DETAILS
            </div>
          </motion.div>
        </div>
      </Link>

      {/* Info */}
      <div className="px-0.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className="text-[#0C0C0B] leading-tight"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}
            >
              {product.name}
            </p>
            <p
              className="text-[#8C8880] mt-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 400 }}
            >
              {product.subtitle}
            </p>
          </div>
          {/* Tiny rating */}
          <div className="flex items-center gap-0.5 flex-shrink-0 mt-0.5">
            <Star size={10} fill="#BF9B5E" stroke="none" />
            <span
              className="text-[#8C8880]"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10 }}
            >
              {product.rating}
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mt-1.5">
          <span
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 700, color: "#0C0C0B" }}
          >
            ${product.price}
          </span>
          {product.originalPrice > product.price && (
            <span
              className="line-through"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#A0998F" }}
            >
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Color dots */}
        <div className="flex items-center gap-1.5 mt-2">
          {product.variants.map((v) => (
            <div
              key={v.id}
              className="w-3.5 h-3.5 rounded-full border border-white shadow-sm ring-1 ring-[#E5E2D9]"
              style={{ background: v.color }}
              title={v.label}
            />
          ))}
          {product.variants.length > 3 && (
            <span
              className="text-[#8C8880]"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10 }}
            >
              +{product.variants.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function CollectionPage() {
  const { slug = "all" } = useParams<{ slug: string }>();
  const meta = COLLECTION_META[slug] ?? COLLECTION_META["all"];

  const [activeFilter, setActiveFilter] = useState(slug === "all" ? "all" : slug);
  const [sort, setSort] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let products = [...ALL_PRODUCTS];

    if (activeFilter === "under50") {
      products = products.filter((p) => p.price < 50);
    } else if (activeFilter !== "all") {
      if (activeFilter === "new-arrivals") products = products.filter((p) => p.isNew);
      else if (activeFilter === "sale") products = products.filter((p) => p.badge === "SALE");
      else products = products.filter((p) => p.collection === activeFilter);
    }

    switch (sort) {
      case "price-asc": return products.sort((a, b) => a.price - b.price);
      case "price-desc": return products.sort((a, b) => b.price - a.price);
      case "rating": return products.sort((a, b) => b.rating - a.rating);
      case "newest": return products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default: return products;
    }
  }, [activeFilter, sort]);

  return (
    <PageTransition>
      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ height: "42vh", minHeight: 240 }}>
        <motion.img
          src={meta.image}
          alt={meta.title}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/55" />

        <div className="relative z-10 h-full flex flex-col justify-end px-5 pb-8 max-w-screen-xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-3">
            <Link
              to="/"
              className="text-white/60 hover:text-white/90 transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.1em" }}
            >
              Home
            </Link>
            <span className="text-white/40" style={{ fontSize: 10 }}>›</span>
            <span
              className="text-white/80"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.1em" }}
            >
              {meta.title}
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-white"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.4rem, 10vw, 5rem)",
              fontWeight: 700,
              lineHeight: 1.0,
            }}
          >
            {meta.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-white/65 mt-2 max-w-md"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300, lineHeight: 1.6 }}
          >
            {meta.subtitle}
          </motion.p>
        </div>
      </div>

      {/* Filters + Sort bar */}
      <div className="sticky top-[56px] lg:top-[56px] z-20 bg-[#F8F6F1]/95 backdrop-blur-md border-b border-[#E5E2D9]">
        <div className="flex items-center gap-3 px-5 py-3 max-w-screen-xl mx-auto">
          {/* Filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
            {FILTERS.map((f) => (
              <motion.button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                whileTap={{ scale: 0.94 }}
                className="flex-shrink-0 px-3.5 py-1.5 rounded-full border transition-all"
                animate={{
                  background: activeFilter === f.id ? "#0C0C0B" : "rgba(0,0,0,0)",
                  borderColor: activeFilter === f.id ? "#0C0C0B" : "#D5D2CB",
                  color: activeFilter === f.id ? "#fff" : "#5C5850",
                }}
                transition={{ duration: 0.2 }}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em" }}
              >
                {f.label}
              </motion.button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-[#E5E2D9] flex-shrink-0" />

          {/* Sort dropdown */}
          <div className="relative flex-shrink-0">
            <motion.button
              onClick={() => setSortOpen((v) => !v)}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 text-[#5C5850] hover:text-[#0C0C0B] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600 }}
            >
              <SlidersHorizontal size={13} />
              <span>Sort</span>
              <motion.span animate={{ rotate: sortOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={12} />
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-[#E5E2D9] overflow-hidden z-30 min-w-[180px]"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <motion.button
                      key={opt.id}
                      onClick={() => { setSort(opt.id); setSortOpen(false); }}
                      whileHover={{ backgroundColor: "#F8F6F1" }}
                      className="w-full px-4 py-3 text-left flex items-center justify-between"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}
                    >
                      <span style={{ color: sort === opt.id ? "#0C0C0B" : "#5C5850", fontWeight: sort === opt.id ? 700 : 400 }}>
                        {opt.label}
                      </span>
                      {sort === opt.id && <span className="text-[#BF9B5E] text-xs">✓</span>}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="px-5 py-4 max-w-screen-xl mx-auto">
        <p
          className="text-[#8C8880]"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}
        >
          {filtered.length} {filtered.length === 1 ? "style" : "styles"} found
        </p>
      </div>

      {/* Products Grid */}
      <div className="px-4 pb-24 max-w-screen-xl mx-auto">
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={activeFilter + sort}
              className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4"
            >
              {filtered.map((product, i) => (
                <GridCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <p
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 600, color: "#0C0C0B" }}
              >
                No styles found
              </p>
              <p
                className="text-[#8C8880] mt-2"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}
              >
                Try a different filter
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFilter("all")}
                className="mt-6 px-6 py-3 bg-[#0C0C0B] text-white rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <X size={12} /> Clear Filter
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SiteFooter />
    </PageTransition>
  );
}