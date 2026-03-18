import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { Link } from "react-router";
import {
  X, ChevronLeft, ChevronRight, Minus, Plus, ArrowRight,
  MapPin, Truck, Home, Heart, Check, ShoppingBag, ExternalLink, Star
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { ALL_PRODUCTS } from "../data/products";
import type { Product } from "../data/products";

// ─── BADGE ────────────────────────────────────────────────────────────────────

function Badge({ type }: { type: "SALE" | "NEW" }) {
  if (type === "SALE") {
    return (
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-white/60 animate-ping" style={{ animationDuration: "2.4s" }} />
        <span className="relative text-[10px] font-black tracking-[0.15em] px-2.5 py-1 rounded-full bg-black text-white block">SALE</span>
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden rounded-full">
      <span className="text-[10px] font-black tracking-[0.15em] px-2.5 py-1 rounded-full bg-white text-black block">NEW</span>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)" }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", repeatDelay: 1.5 }}
      />
    </div>
  );
}

// ─── WISHLIST HEART ───────────────────────────────────────────────────────────

function WishlistHeart({ product }: { product: Product }) {
  const { isWishlisted, toggle } = useWishlist();
  const [burst, setBurst] = useState(false);
  const liked = isWishlisted(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!liked) {
      setBurst(true);
      setTimeout(() => setBurst(false), 600);
    }
    toggle(product);
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-sm"
    >
      <AnimatePresence>
        {burst && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-red-400"
                style={{ top: "50%", left: "50%" }}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i / 6) * Math.PI * 2) * 18,
                  y: Math.sin((i / 6) * Math.PI * 2) * 18,
                  opacity: [1, 1, 0],
                }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
      <motion.div animate={liked ? { scale: [1, 1.45, 0.9, 1.1, 1] } : { scale: 1 }}>
        <Heart size={17} strokeWidth={2.2} fill={liked ? "#ef4444" : "none"} stroke={liked ? "#ef4444" : "currentColor"} />
      </motion.div>
    </button>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function TrendingProducts() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const trending = ALL_PRODUCTS.slice(0, 6);

  return (
    <section className="bg-white py-20 overflow-hidden">
      <div className="px-6 mb-12 max-w-screen-xl mx-auto flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-px bg-[#BF9B5E]" />
            <span className="text-[#BF9B5E] text-[10px] tracking-[0.3em] uppercase font-bold">Trending Now</span>
          </div>
          <h2 className="text-[42px] font-bold leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Curated For You.</h2>
        </div>
        <Link to="/collections/all" className="hidden sm:flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#0C0C0B] hover:text-[#BF9B5E] transition-colors mb-2">
          View All Styles <ArrowRight size={14} />
        </Link>
      </div>

      <div className="relative group">
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-6 no-scrollbar snap-x snap-mandatory pb-8"
        >
          {trending.map((product, i) => (
            <div key={product.id} className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start">
              <Link to={`/products/${product.slug}`} className="block">
                <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden mb-4 bg-gray-50 group/card">
                  <img src={product.images[0]} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700" />
                  {product.badge && (
                    <div className="absolute top-4 left-4">
                      <Badge type={product.badge as any} />
                    </div>
                  )}
                  <WishlistHeart product={product} />
                  
                  {/* Quick info overlay */}
                  <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-300">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Quick View</p>
                        <p className="text-[12px] font-bold text-[#0C0C0B] uppercase tracking-wide">Details & Sizing</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              <div className="px-1">
                <div className="flex justify-between items-start mb-1">
                  <Link to={`/products/${product.slug}`} className="hover:text-[#BF9B5E] transition-colors">
                    <h3 className="text-[15px] font-bold uppercase tracking-wide">{product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-1">
                    <Star size={10} fill="#BF9B5E" stroke="none" />
                    <span className="text-[11px] font-bold text-[#8C8880]">{product.rating}</span>
                  </div>
                </div>
                <p className="text-[12px] text-[#8C8880] mb-3">{product.subtitle}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[18px] font-bold text-[#0C0C0B]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>${product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-[13px] line-through text-[#A0998F]">${product.originalPrice}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
