import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    video: "https://player.vimeo.com/external/371433846.hd.mp4?s=2315190ccebc1947e9003e83d94d2d787c393718&profile_id=175&oauth2_token_id=57447761",
    label: "Spring 2025",
    headline1: "WEAR YOUR",
    headline2: "STORY.",
    sub: "Effortless elegance, crafted for the modern woman.",
    cta: "Discover the Collection",
    accent: "#BF9B5E",
  },
  {
    image: "https://images.unsplash.com/photo-1758900727878-f7c5e90ed171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    label: "Linen Edit",
    headline1: "SIMPLY",
    headline2: "RADIANT.",
    sub: "The new linen collection — breathable, timeless, you.",
    cta: "Shop Linen Edit",
    accent: "#B8A898",
  },
  {
    image: "https://images.unsplash.com/photo-1761637782890-9edea22a83fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    video: "https://player.vimeo.com/external/494163966.hd.mp4?s=784e9089ef0627e74360e7e174e9ef9733a1e27a&profile_id=175&oauth2_token_id=57447761",
    label: "Summer Drop",
    headline1: "GOLDEN",
    headline2: "HOUR.",
    sub: "Dresses that move with you, from sunrise to sunset.",
    cta: "Explore Summer Drop",
    accent: "#BF9B5E",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(() => setCurrent((i) => (i + 1) % slides.length), 6000);
    return () => clearTimeout(timer);
  }, [current, autoplay]);

  const slide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: 580 }}
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {/* Background images/videos with crossfade */}
      {slides.map((s, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: i === current ? 1 : 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        >
          {s.video ? (
            <video
              src={s.video}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover object-center"
              style={{ filter: "brightness(0.9)" }}
            />
          ) : (
            <motion.img
              src={s.image}
              alt={s.headline1 + " " + s.headline2}
              className="w-full h-full object-cover object-center"
              animate={{ scale: i === current ? 1.04 : 1 }}
              transition={{ duration: 7, ease: "linear" }}
            />
          )}
          {/* Gradient overlay — clean top, heavy cinematic bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/82" />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full px-6 pb-28 sm:pb-16 max-w-screen-xl mx-auto sm:justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Collection label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-px bg-white/50" />
              <span
                className="text-white/70 text-[9px] tracking-[0.38em] uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}
              >
                {slide.label}
              </span>
            </motion.div>

            {/* Headline */}
            <div>
              {[slide.headline1, slide.headline2].map((line, li) => (
                <div key={li} className="overflow-hidden">
                  <motion.h1
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + li * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="text-white leading-[0.92] tracking-[-0.01em]"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(4rem, 18vw, 9rem)",
                      fontWeight: 700,
                    }}
                  >
                    {line === slide.headline2 ? (
                      <>
                        <em style={{ fontStyle: "italic", color: slide.accent }}>{line}</em>
                      </>
                    ) : (
                      line
                    )}
                  </motion.h1>
                </div>
              ))}
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46, duration: 0.5 }}
              className="text-white/80 max-w-xs"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(13px, 3.5vw, 16px)",
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              {slide.sub}
            </motion.p>

            {/* CTA — thin border editorial button, more luxury than pill */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.56, duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <Link to="/collections/all">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center gap-3 border border-white/60 text-white px-7 py-3.5 text-[10px] font-semibold tracking-[0.22em] uppercase overflow-hidden relative"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ x: "-101%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
                  />
                  <span className="relative z-10 group-hover:text-[#0C0C0B] transition-colors duration-350">
                    {slide.cta}
                  </span>
                  <motion.span
                    className="relative z-10 group-hover:text-[#0C0C0B] transition-colors duration-350"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <ArrowRight size={13} strokeWidth={1.8} />
                  </motion.span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slide dots */}
        <div className="absolute bottom-20 sm:bottom-10 left-6 flex items-center gap-2 z-10">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => { setCurrent(i); setAutoplay(false); }}
              animate={{
                width: i === current ? 28 : 6,
                backgroundColor: i === current ? "#fff" : "rgba(255,255,255,0.4)",
              }}
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-20 sm:bottom-10 right-6 flex flex-col items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          <div className="w-px h-12 bg-gradient-to-b from-white/0 to-white/60" />
          <span
            className="text-white/50 text-[9px] tracking-[0.22em] uppercase rotate-90 origin-center"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
}