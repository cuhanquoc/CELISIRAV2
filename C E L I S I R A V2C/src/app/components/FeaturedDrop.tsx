import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, Heart, Star } from "lucide-react";

const product = {
  label: "Drop of the Season",
  name: "SOLEIL MAXI",
  subtitle: "Flowing Linen Dress",
  price: 89.99,
  originalPrice: 149.99,
  rating: 4.9,
  reviews: 287,
  description:
    "The Soleil Maxi is designed for those golden, unhurried days. Cut from 100% enzyme-washed linen, it drapes beautifully and breathes freely — made to be lived in.",
  images: [
    "https://images.unsplash.com/photo-1680690653166-1618c3bcdf51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
    "https://images.unsplash.com/photo-1761637782890-9edea22a83fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
  ],
  colors: ["#E8DDD0", "#C4B8A8", "#8C7B6C", "#D4C4B0"],
  sizes: ["XS", "S", "M", "L", "XL"],
};

export function FeaturedDrop() {
  const [imgIdx, setImgIdx] = useState(0);
  const [liked, setLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState("S");
  const [addedState, setAddedState] = useState<"idle" | "done">("idle");

  const handleAdd = () => {
    if (addedState !== "idle") return;
    setAddedState("done");
    setTimeout(() => setAddedState("idle"), 2500);
  };

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <section className="bg-[#F8F6F1] py-14">
      {/* Header */}
      <div className="px-5 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex items-center gap-2 mb-2"
        >
          <div className="w-5 h-px bg-[#BF9B5E]" />
          <span
            className="text-[#BF9B5E] text-[10px] tracking-[0.25em] uppercase font-medium"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {product.label}
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.4rem, 10vw, 4rem)",
            fontWeight: 700,
            lineHeight: 1.0,
            color: "#0C0C0B",
          }}
        >
          The One
          <br />
          <em className="italic">Everyone's Wearing.</em>
        </motion.h2>
      </div>

      {/* Product layout */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-screen-xl mx-auto">
        {/* Image */}
        <div className="relative px-4 lg:px-0 lg:w-1/2">
          <motion.div
            className="relative rounded-[22px] overflow-hidden"
            style={{ aspectRatio: "3/4" }}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={imgIdx}
                src={product.images[imgIdx]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>

            {/* Discount badge */}
            <div className="absolute top-4 left-4 z-10">
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                whileInView={{ scale: 1, rotate: -6 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.3 }}
                className="w-14 h-14 rounded-full bg-[#0C0C0B] flex flex-col items-center justify-center"
              >
                <span
                  className="text-white font-black leading-none"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16 }}
                >
                  -{discount}%
                </span>
              </motion.div>
            </div>

            {/* Wishlist */}
            <motion.button
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-sm"
              whileTap={{ scale: 0.88 }}
              onClick={() => setLiked((v) => !v)}
            >
              <motion.div
                animate={liked ? { scale: [1, 1.4, 0.9, 1.1, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                <Heart
                  size={16}
                  fill={liked ? "#ef4444" : "none"}
                  stroke={liked ? "#ef4444" : "#0C0C0B"}
                  strokeWidth={2}
                />
              </motion.div>
            </motion.button>

            {/* Image thumbs */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
              {product.images.map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl overflow-hidden"
                  animate={{ opacity: i === imgIdx ? 1 : 0.55, scale: i === imgIdx ? 1 : 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{ boxShadow: i === imgIdx ? "0 0 0 2px #fff, 0 0 0 4px #0C0C0B" : "0 2px 8px rgba(0,0,0,0.2)" }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <div className="px-5 lg:px-8 lg:w-1/2 flex flex-col justify-center">
          {/* Rating */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1.5 mb-4"
          >
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                fill="#BF9B5E"
                stroke="none"
                className={i === 4 ? "opacity-60" : ""}
              />
            ))}
            <span
              className="text-[#8C8880] ml-1"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}
            >
              {product.rating} ({product.reviews} reviews)
            </span>
          </motion.div>

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.5 }}
          >
            <Link to="/products/soleil-maxi" className="hover:opacity-80 transition-opacity block">
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2rem, 8vw, 3rem)",
                  fontWeight: 700,
                  lineHeight: 1.0,
                  color: "#0C0C0B",
                }}
              >
                {product.name}
              </h3>
            </Link>
            <p
              className="text-[#8C8880] mt-1"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 400 }}
            >
              {product.subtitle}
            </p>
          </motion.div>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14 }}
            className="flex items-baseline gap-3 mt-4 mb-5"
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.8rem, 7vw, 2.4rem)",
                fontWeight: 700,
                color: "#0C0C0B",
              }}
            >
              ${product.price}
            </span>
            <span
              className="line-through"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#A0998F" }}
            >
              ${product.originalPrice}
            </span>
            <span
              className="text-[#C4302B] font-bold"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: "0.06em" }}
            >
              Save {discount}%
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="mb-6"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 300,
              color: "#5C5850",
              lineHeight: 1.7,
              maxWidth: 420,
            }}
          >
            {product.description}
          </motion.p>

          {/* Size selector */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.22 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span
                className="text-[10px] tracking-[0.18em] uppercase font-bold text-[#0C0C0B]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Size
              </span>
              <button
                className="text-[10px] tracking-widest uppercase text-[#BF9B5E] font-medium underline underline-offset-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Size Guide
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size) => {
                const active = selectedSize === size;
                return (
                  <motion.button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    whileTap={{ scale: 0.93 }}
                    className="w-11 h-11 rounded-xl border text-sm font-medium transition-colors relative overflow-hidden"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      borderColor: active ? "#0C0C0B" : "#DDD9D0",
                      background: active ? "#0C0C0B" : "transparent",
                      color: active ? "#fff" : "#0C0C0B",
                    }}
                  >
                    {size}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.28 }}
            className="flex flex-col gap-3"
          >
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-full border-2 border-[#0C0C0B] relative overflow-hidden"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <motion.div
                className="absolute inset-0 bg-[#0C0C0B]"
                initial={{ x: "-101%" }}
                animate={{ x: addedState === "done" ? "0%" : "-101%" }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              />
              <span
                className="relative z-10 text-sm font-bold tracking-[0.14em] uppercase transition-colors duration-300"
                style={{ color: addedState === "done" ? "#fff" : "#0C0C0B" }}
              >
                {addedState === "done" ? "✓ Added to Cart" : "Add to Cart"}
              </span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-full bg-[#0C0C0B] text-white flex items-center justify-center gap-2 group"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <span className="text-sm font-bold tracking-[0.14em] uppercase">Buy It Now</span>
              <motion.span
                animate={{ x: 0 }}
                whileHover={{ x: 3 }}
                className="group-hover:translate-x-1 transition-transform"
              >
                <ArrowRight size={14} />
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}