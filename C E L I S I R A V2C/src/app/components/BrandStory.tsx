import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "200+", label: "Unique Designs" },
  { value: "50+", label: "Countries Shipped" },
  { value: "2019", label: "Established" },
  { value: "100%", label: "Free Returns" },
];

export function BrandStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const textX = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section
      ref={containerRef}
      className="bg-[#0C0C0B] text-white overflow-hidden relative"
    >
      <div className="flex flex-col lg:flex-row min-h-[520px] lg:min-h-[680px]">
        {/* Image side */}
        <div className="relative w-full lg:w-1/2 overflow-hidden" style={{ minHeight: 320 }}>
          <motion.img
            src="https://images.unsplash.com/photo-1708515902649-1f5b92fe5098?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900"
            alt="Brand Story"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ y: imageY }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/25" />
          {/* Gold accent line — hairline, more refined */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#BF9B5E]"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            style={{ originY: 0 }}
          />
        </div>

        {/* Text side */}
        <motion.div
          style={{ x: textX }}
          className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-16 lg:px-20 lg:py-28"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-5"
          >
            <div className="w-8 h-px bg-[#BF9B5E]" />
            <span
              className="text-[#BF9B5E] text-[9px] tracking-[0.38em] uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
            >
              Our Story
            </span>
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-5">
            <motion.h2
              initial={{ y: "100%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.6rem, 9vw, 4.5rem)",
                fontWeight: 700,
                lineHeight: 1.0,
              }}
            >
              Crafted With
              <br />
              <em className="italic" style={{ color: "#BF9B5E" }}>
                Intention.
              </em>
            </motion.h2>
          </div>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/65 leading-relaxed mb-8"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(13px, 3.5vw, 15px)",
              fontWeight: 300,
              maxWidth: 420,
            }}
          >
            Celisira was born from a simple belief: every woman deserves to wear something 
            that tells her story. We design with the modern woman in mind — versatile, 
            confident, and effortlessly elegant.
          </motion.p>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.45 }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-2 w-fit mb-12"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <span className="text-[11px] tracking-[0.2em] uppercase font-medium border-b border-white/30 pb-0.5 group-hover:border-[#BF9B5E] group-hover:text-[#BF9B5E] transition-colors duration-300">
              Read Our Story
            </span>
            <motion.span
              animate={{ x: 0 }}
              whileHover={{ x: 3 }}
              className="text-white/50 group-hover:text-[#BF9B5E] transition-colors duration-300"
            >
              <ArrowRight size={13} />
            </motion.span>
          </motion.button>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.45 }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(1.8rem, 6vw, 2.6rem)",
                    fontWeight: 700,
                    color: "#BF9B5E", // Updated to new burnished antique gold
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  className="text-white/50 mt-1"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    fontWeight: 400,
                    letterSpacing: "0.06em",
                  }}
                >
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}