import { motion } from "motion/react";

const messages = [
  "FREE SHIPPING ON ORDERS OVER $50",
  "NEW ARRIVALS EVERY FRIDAY",
  "USE CODE CELISIRA15 FOR 15% OFF YOUR FIRST ORDER",
  "HANDCRAFTED WITH INTENTION · EST. 2019",
  "RETURNS WITHIN 30 DAYS — FREE & EASY",
];

const Marquee = () => {
  const text = messages.join("   ·   ");
  return (
    <div className="flex gap-0 whitespace-nowrap">
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          className="flex-shrink-0 pr-8"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {text}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;
        </motion.span>
      ))}
    </div>
  );
};

export function AnnouncementBar() {
  return (
    <div className="bg-[#0C0C0B] text-white overflow-hidden py-2.5">
      <motion.div
        className="flex text-[10px] tracking-[0.18em] font-medium"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
      >
        <Marquee />
        <Marquee />
      </motion.div>
    </div>
  );
}
