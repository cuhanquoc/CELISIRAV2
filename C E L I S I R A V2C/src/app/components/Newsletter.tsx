import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state !== "idle") return;
    setState("loading");
    setTimeout(() => {
      setState("done");
    }, 1200);
  };

  return (
    <section className="bg-[#0C0C0B] py-16 px-5 overflow-hidden relative">
      {/* Decorative blur blobs */}
      <div
        className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-[0.07] blur-3xl pointer-events-none"
        style={{ background: "#BF9B5E" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full opacity-[0.05] blur-3xl pointer-events-none"
        style={{ background: "#BF9B5E" }}
      />

      <div className="max-w-lg mx-auto relative z-10">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="flex justify-center mb-6"
        >
          <div className="w-12 h-12 rounded-full border border-[#BF9B5E]/40 flex items-center justify-center">
            <Sparkles size={18} className="text-[#BF9B5E]" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-white mb-3"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.6rem, 11vw, 4.5rem)",
            fontWeight: 700,
            lineHeight: 1.0,
          }}
        >
          Join The
          <br />
          <em className="italic" style={{ color: "#BF9B5E" }}>
            Inner Circle.
          </em>
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-center text-white/55 mb-8"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(12px, 3.5vw, 14px)",
            fontWeight: 300,
            lineHeight: 1.65,
          }}
        >
          Be the first to know about new drops, exclusive offers, and styling
          inspiration — straight to your inbox.
        </motion.p>

        {/* Perks */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.22 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {["Early Access to New Drops", "15% Off First Order", "Styling Tips & Lookbooks"].map(
            (perk, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.28 + i * 0.07 }}
                className="text-[10px] tracking-wider text-white/60 border border-white/15 px-3 py-1.5 rounded-full"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {perk}
              </motion.span>
            )
          )}
        </motion.div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {state === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              className="text-center py-6"
            >
              <motion.div
                animate={{ rotate: [0, 14, -14, 10, -10, 6, -6, 0] }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-3xl mb-3"
              >
                🎉
              </motion.div>
              <p
                className="text-white font-semibold mb-1"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16 }}
              >
                Welcome to the inner circle!
              </p>
              <p
                className="text-white/50"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}
              >
                Check your inbox for your 15% off code.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.45 }}
              onSubmit={handleSubmit}
              className="relative"
            >
              <motion.div
                className="flex items-center border rounded-full overflow-hidden pr-1.5 pl-5 py-1.5 gap-2"
                animate={{
                  borderColor: focused ? "#BF9B5E" : "rgba(255,255,255,0.18)",
                  boxShadow: focused ? "0 0 0 3px rgba(191,155,94,0.15)" : "none",
                }}
                transition={{ duration: 0.25 }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent text-white outline-none placeholder-white/35 py-2"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}
                  required
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-[#BF9B5E] text-[#0C0C0B] px-5 py-3 rounded-full text-xs font-bold tracking-widest uppercase flex-shrink-0 relative overflow-hidden"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {state === "loading" ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-[#0C0C0B]/30 border-t-[#0C0C0B] rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                    />
                  ) : (
                    <>
                      <span>Join</span>
                      <ArrowRight size={13} />
                    </>
                  )}
                </motion.button>
              </motion.div>

              <p
                className="text-center text-white/30 mt-3"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.06em" }}
              >
                No spam, ever. Unsubscribe anytime.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}