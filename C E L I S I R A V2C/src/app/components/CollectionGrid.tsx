import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";

const collections = [
  {
    id: 1,
    name: "Dresses",
    count: "48 styles",
    image: "https://images.unsplash.com/photo-1767687700398-b2052993fb56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    span: "row-span-2",
    tag: "Most Loved",
    slug: "dresses",
  },
  {
    id: 2,
    name: "New Arrivals",
    count: "12 styles",
    image: "https://images.unsplash.com/photo-1746730921745-5f6afa4c56c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    span: "",
    tag: "Just In",
    slug: "new-arrivals",
  },
  {
    id: 3,
    name: "Silk Essentials",
    count: "18 styles",
    image: "https://images.unsplash.com/photo-1766667107727-4638a7c29665?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    span: "",
    tag: "Pure Luxury",
    slug: "silk",
  },
  {
    id: 4,
    name: "Resort Edit",
    count: "24 styles",
    image: "https://images.unsplash.com/photo-1762343291569-680a1efe1fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    span: "",
    tag: "Summer",
    slug: "resort-edit",
  },
  {
    id: 5,
    name: "Minimalist Edit",
    count: "15 styles",
    image: "https://images.unsplash.com/photo-1738743153549-d757530e63cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    span: "lg:col-span-2",
    tag: "Quite Luxury",
    slug: "minimalist",
  },
  {
    id: 6,
    name: "Last Call",
    count: "Up to 60% off",
    image: "https://images.unsplash.com/photo-1773099217427-77bba76cf0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    span: "",
    tag: "Limited",
    accent: "#BF9B5E",
    slug: "sale",
  },
];

function CollectionCard({
  item,
  index,
}: {
  item: (typeof collections)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/collections/${item.slug}`}>
      <motion.div
        /* ↓ rounded-[4px] — editorial sharp corners, luxury-standard */
        className={`relative overflow-hidden rounded-[4px] cursor-pointer ${item.span}`}
        style={{ minHeight: item.span ? 400 : 190 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ delay: index * 0.08, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Image */}
        <motion.img
          src={item.image}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Gradient overlay — clean top, cinematic bottom */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: hovered
              ? "linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.72) 100%)"
              : "linear-gradient(180deg, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.52) 100%)",
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Tag — hairline border pill, refined */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <motion.span
            className="text-white text-[8px] font-semibold tracking-[0.28em] uppercase px-2.5 py-1"
            style={{
              background: item.accent ? item.accent : "rgba(0,0,0,0.38)",
              backdropFilter: "blur(12px)",
              fontFamily: "'DM Sans', sans-serif",
              border: item.accent ? "none" : "1px solid rgba(255,255,255,0.25)",
              borderRadius: 2,
            }}
            animate={{ opacity: hovered ? 1 : 0.85 }}
            transition={{ duration: 0.3 }}
          >
            {item.tag}
          </motion.span>
        </div>

        {/* Text — more generous padding, refined typography */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <motion.p
            className="text-white/60 text-[9px] tracking-[0.32em] uppercase mb-1"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
            animate={{ opacity: hovered ? 0.9 : 0.6 }}
            transition={{ duration: 0.3 }}
          >
            {item.count}
          </motion.p>
          <motion.h3
            animate={{ y: hovered ? -1 : 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.5rem, 5.5vw, 2.2rem)",
              fontWeight: 600,
              color: "white",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            {item.name}
          </motion.h3>

          {/* Hover: reveal thin underline arrow link */}
          <motion.div
            className="flex items-center gap-1.5 mt-2 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: hovered ? 1 : 0, height: hovered ? 18 : 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span
              className="text-white/80 border-b border-white/40 pb-px"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase" }}
            >
              Shop Now
            </span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}

export function CollectionGrid() {
  return (
    /* ↓ More generous padding — luxury needs to breathe */
    <section className="px-5 sm:px-8 py-20 sm:py-28 bg-[#F8F6F1]">
      {/* Header */}
      <div className="mb-10 sm:mb-14">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          /* ↓ More letter-spacing — editorial eyebrow */
          className="text-[#8C8880] text-[9px] tracking-[0.38em] uppercase mb-3"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
        >
          Browse by
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.6rem, 10vw, 4.4rem)",
            fontWeight: 600,
            lineHeight: 0.95,
            color: "#0C0C0B",
            letterSpacing: "-0.02em",
          }}
        >
          Collections
        </motion.h2>
      </div>

      {/* Grid — gap-6 (24px) for luxury breathing space */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 auto-rows-[220px] sm:auto-rows-[260px] lg:auto-rows-[300px]">
        {collections.map((item, i) => (
          <CollectionCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
