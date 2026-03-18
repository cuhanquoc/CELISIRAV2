import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Sophie Laurent",
    handle: "@sophielaurent",
    avatar: "https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100",
    rating: 5,
    product: "Arden Dress™",
    text: "Honestly the most beautiful dress I've ever owned. The fabric feels so luxurious and the fit is absolutely perfect. I get compliments every time I wear it.",
    date: "March 2025",
    verified: true,
  },
  {
    id: 2,
    name: "Mia Chen",
    handle: "@miachen.style",
    avatar: "https://images.unsplash.com/photo-1758900727878-f7c5e90ed171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100",
    rating: 5,
    product: "Aurelie Dress™",
    text: "I wore this to my sister's wedding and literally every person asked where I got it. Celisira never misses. The quality is unreal for the price.",
    date: "February 2025",
    verified: true,
  },
  {
    id: 3,
    name: "Isabella Rossi",
    handle: "@bella.rossi",
    avatar: "https://images.unsplash.com/photo-1746730921745-5f6afa4c56c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100",
    rating: 5,
    product: "Azure Dress™",
    text: "The linen is so soft and it photographs beautifully. Packaging was stunning too — felt like opening a gift to myself. Will be ordering again.",
    date: "March 2025",
    verified: true,
  },
  {
    id: 4,
    name: "Amara Osei",
    handle: "@amaraosei",
    avatar: "https://images.unsplash.com/photo-1761637782890-9edea22a83fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100",
    rating: 5,
    product: "Soleil Maxi",
    text: "My third Celisira order and each time better than the last. This brand genuinely cares about quality. Perfect for my holiday in Greece — I felt like a goddess.",
    date: "January 2025",
    verified: true,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          fill={i < rating ? "#BF9B5E" : "none"}
          stroke={i < rating ? "#BF9B5E" : "#DDD9D0"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <section className="bg-white py-14 overflow-hidden">
      {/* Header */}
      <div className="px-5 mb-8">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-[#BF9B5E] text-[10px] tracking-[0.25em] uppercase font-medium mb-2"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Real women, real stories
        </motion.p>
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
          What She Said
        </motion.h2>

        {/* Overall rating */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mt-3"
        >
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="#BF9B5E" stroke="none" />
            ))}
          </div>
          <span
            className="text-[#8C8880]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}
          >
            4.9 · 1,240 verified reviews
          </span>
        </motion.div>
      </div>

      {/* Cards horizontal scroll */}
      <div className="flex gap-4 px-5 overflow-x-auto snap-x snap-mandatory pb-3 no-scrollbar">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            className="flex-shrink-0 w-[82vw] max-w-[320px] snap-start bg-[#F8F6F1] rounded-[20px] p-5 cursor-pointer relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            animate={{
              y: activeCard === review.id ? -4 : 0,
              boxShadow:
                activeCard === review.id
                  ? "0 16px 40px rgba(0,0,0,0.12)"
                  : "0 2px 8px rgba(0,0,0,0.04)",
            }}
            onHoverStart={() => setActiveCard(review.id)}
            onHoverEnd={() => setActiveCard(null)}
            onTapStart={() => setActiveCard(review.id)}
            onTap={() => setActiveCard(null)}
          >
            {/* Quote icon */}
            <Quote size={24} className="text-[#BF9B5E]/40 mb-3" strokeWidth={1.5} />

            {/* Stars + product */}
            <div className="flex items-center justify-between mb-3">
              <StarRating rating={review.rating} />
              <span
                className="text-[10px] text-[#8C8880]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {review.product}
              </span>
            </div>

            {/* Review text */}
            <p
              className="text-[#3C3830] leading-relaxed mb-5"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 300,
                lineHeight: 1.65,
              }}
            >
              "{review.text}"
            </p>

            {/* Reviewer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p
                    className="font-semibold text-[#0C0C0B]"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}
                  >
                    {review.name}
                  </p>
                  <p
                    className="text-[#8C8880]"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10 }}
                  >
                    {review.handle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {review.verified && (
                  <span
                    className="text-[9px] tracking-wider text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>

            {/* Date */}
            <p
              className="text-[#B0A898] mt-2.5 text-right"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10 }}
            >
              {review.date}
            </p>
          </motion.div>
        ))}
      </div>

      {/* All reviews CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mt-8"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="text-[11px] tracking-[0.18em] uppercase font-semibold border-b border-[#0C0C0B] pb-0.5"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          See All 1,240 Reviews →
        </motion.button>
      </motion.div>
    </section>
  );
}