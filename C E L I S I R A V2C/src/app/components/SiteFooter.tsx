import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Instagram, Facebook, Youtube, ChevronDown, ChevronRight } from "lucide-react";

const footerLinks = {
  Shop: ["New Arrivals", "Dresses", "Accessories", "Sale", "Gift Cards"],
  Help: ["FAQ", "Shipping & Returns", "Size Guide", "Track Order", "Contact Us"],
  Company: ["Our Story", "Sustainability", "Press", "Careers", "Affiliates"],
};

const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

function FooterAccordion({ title, links }: { title: string; links: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#E5E2D9] sm:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 sm:hidden"
      >
        <span
          className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#0C0C0B]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {title}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown size={14} className="text-[#8C8880]" />
        </motion.div>
      </button>

      <div className="hidden sm:block">
        <p
          className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#0C0C0B] mb-5"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {title}
        </p>
      </div>

      <AnimatePresence>
        {(isOpen || typeof window !== "undefined" && window.innerWidth >= 640) && (
          <motion.ul
            initial={isOpen ? { height: 0, opacity: 0 } : false}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden sm:!h-auto sm:!opacity-100 space-y-3 pb-5 sm:pb-0"
          >
            {links.map((link) => (
              <li key={link}>
                <motion.a
                  href="#"
                  whileHover={{ x: 3, color: "#BF9B5E" }}
                  className="block text-[#5C5850] hover:text-[#BF9B5E] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 300 }}
                >
                  {link}
                </motion.a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#F8F6F1] border-t border-[#E5E2D9] pt-4">
      {/* Trust badges — refined mobile view */}
      <div className="border-b border-[#E5E2D9] py-6 px-5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-10 min-w-max mx-auto lg:justify-center">
          {[
            { icon: "🚚", text: "Free Shipping $50+" },
            { icon: "↩", text: "30-Day Returns" },
            { icon: "🔒", text: "Secure Checkout" },
            { icon: "🌿", text: "Sustainably Made" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 flex-shrink-0">
              <span className="text-[16px]">{item.icon}</span>
              <span
                className="text-[10px] tracking-[0.08em] uppercase font-semibold text-[#5C5850] whitespace-nowrap"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-12 max-w-screen-xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-12 mb-16">
          {/* Logo + tagline */}
          <div className="max-w-xs">
            <span
              className="block text-[32px] tracking-[0.25em] font-semibold uppercase text-[#0C0C0B] mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Celisira
            </span>
            <p
              className="text-[#8C8880] mb-6"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 300,
                lineHeight: 1.7,
              }}
            >
              Effortless elegance for the modern woman. Handcrafted with intention, designed to be worn across seasons.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-4">
              {socials.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.1, borderColor: "#BF9B5E" }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full border border-[#E5E2D9] flex items-center justify-center hover:border-[#BF9B5E] transition-colors"
                >
                  <Icon size={16} strokeWidth={1.5} className="text-[#5C5850]" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links grid — Accordion on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-12 lg:flex lg:gap-20">
            {Object.entries(footerLinks).map(([section, links]) => (
              <FooterAccordion key={section} title={section} links={links} />
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#E5E2D9] pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p
            className="text-[#A0998F] text-[11px] tracking-wide"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            © 2026 Celisira. All rights reserved. Built for elegance.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[#A0998F] hover:text-[#BF9B5E] transition-colors text-[11px] tracking-wide"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
