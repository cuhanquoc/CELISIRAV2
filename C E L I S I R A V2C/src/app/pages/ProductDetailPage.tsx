import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft, ChevronRight, Heart, Star, X,
  ShoppingBag, ArrowRight, Ruler, ChevronDown, Check, Share2,
  RotateCcw, Truck, Shield, Plus, Minus, MapPin, Package, Globe,
  Facebook, Mail, ArrowUp,
} from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "../data/products";
import type { Product } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { PageTransition } from "../components/PageTransition";
import { SiteFooter } from "../components/SiteFooter";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type SectionId = "overview" | "description" | "specifications";

// ─── MAGNIFIER COMPONENT (Desktop only) ───────────────────────────────────────

function Magnifier({ src, alt }: { src: string; alt: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const magnifierHeight = 220;
  const magnifierWidth = 220;
  const zoomLevel = 2.5;

  return (
    <div
      className="relative w-full h-full cursor-zoom-in overflow-hidden"
      onMouseEnter={(e) => {
        const elem = e.currentTarget;
        const { width, height } = elem.getBoundingClientRect();
        setSize([width, height]);
        setShowMagnifier(true);
      }}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={(e) => {
        const elem = e.currentTarget;
        const { top, left } = elem.getBoundingClientRect();
        const x = e.pageX - left - window.scrollX;
        const y = e.pageY - top - window.scrollY;
        setPosition({ x, y });
      }}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      {showMagnifier && (
        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            height: `${magnifierHeight}px`,
            width: `${magnifierWidth}px`,
            top: `${position.y - magnifierHeight / 2}px`,
            left: `${position.x - magnifierWidth / 2}px`,
            opacity: "1",
            border: "1px solid rgba(255,255,255,0.5)",
            backgroundColor: "white",
            backgroundImage: `url('${src}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
            backgroundPosition: `-${position.x * zoomLevel - magnifierWidth / 2}px -${position.y * zoomLevel - magnifierHeight / 2}px`,
            borderRadius: "50%",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            zIndex: 50,
          }}
        />
      )}
    </div>
  );
}

// ─── DESKTOP FLOATING NAV ─────────────────────────────────────────────────────

function FloatingNav({ activeSection, onNavigate }: { activeSection: SectionId; onNavigate: (id: SectionId) => void }) {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 hidden lg:block">
      <div className="bg-[#0C0C0B]/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex items-center gap-1">
        {(["overview", "description", "specifications"] as SectionId[]).map((id) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`px-8 py-3 rounded-full text-[10px] font-bold tracking-[0.25em] uppercase transition-all duration-300 relative ${
              activeSection === id ? "text-black" : "text-white/50 hover:text-white"
            }`}
          >
            {activeSection === id && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-white rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{id}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── MOBILE STICKY TAB NAV ───────────────────────────────────────────────────

function MobileStickyTabs({ activeSection, onNavigate }: { activeSection: SectionId; onNavigate: (id: SectionId) => void }) {
  return (
    <div className="lg:hidden sticky top-[60px] z-30 bg-white border-b border-[#E5E2D9] shadow-sm">
      <div className="flex items-center p-1.5">
        {(["overview", "description", "specifications"] as SectionId[]).map((id) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex-1 py-3 rounded-full text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300 relative ${
              activeSection === id ? "text-white" : "text-[#8C8880]"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {activeSection === id && (
              <motion.div
                layoutId="mobile-active-pill"
                className="absolute inset-0 bg-[#0C0C0B] rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{id}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── HIGHLIGHTS SECTION ───────────────────────────────────────────────────────

function HighlightsSection({ product }: { product: Product }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const imgScale = useTransform(scrollYProgress, [0.1, 0.4], [0.85, 1]);
  const imgOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);

  const point1X = useTransform(scrollYProgress, [0.3, 0.5], [-100, 0]);
  const point1Opacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);
  const line1Width = useTransform(scrollYProgress, [0.4, 0.55], ["0px", "180px"]);

  const point2X = useTransform(scrollYProgress, [0.5, 0.7], [100, 0]);
  const point2Opacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
  const line2Width = useTransform(scrollYProgress, [0.6, 0.75], ["0px", "200px"]);

  const highlights = [
    { title: "Minimalist Design", desc: "Clean lines and a refined silhouette that speaks to modern luxury.", img: product.images[1] || product.images[0] },
    { title: "Lightweight Cotton-Blend Fabric", desc: "Breathable and soft material, ideal for layering during spring, summer evenings, or fall.", img: product.images[2] || product.images[0] },
  ];

  return (
    <section ref={containerRef} className="relative bg-[#050505] overflow-hidden">
      {/* ── MOBILE Product Highlights ── */}
      <div className="lg:hidden py-16 px-5">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[36px] font-bold text-white mb-10"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Product Highlights
        </motion.h2>

        <div className="space-y-6">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative rounded-[16px] overflow-hidden bg-white/5 border border-white/10"
            >
              <div className="absolute top-5 left-5 z-10">
                <h4 className="text-white text-[18px] font-bold mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{h.title}</h4>
              </div>
              <div className="aspect-[4/3] relative">
                <img src={h.img} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
              </div>
              <div className="p-5">
                <p className="text-white/60 text-[14px] leading-relaxed text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>{h.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── DESKTOP Specifications ── */}
      <div className="hidden lg:block relative min-h-[150vh] py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(191,155,94,0.08) 0%, rgba(0,0,0,1) 85%)" }} />

        <motion.h2
          style={{ opacity: titleOpacity, fontFamily: "'Cormorant Garamond', serif" }}
          className="text-[64px] font-bold text-white mb-20 tracking-tight text-center relative z-20"
        >
          Luxe Specifications
        </motion.h2>

        <div className="relative w-full max-w-7xl mx-auto flex justify-center items-center h-[850px]">
          <motion.div
            style={{ x: point1X, opacity: point1Opacity }}
            className="absolute left-[2%] top-[25%] flex items-center gap-10 z-30"
          >
            <div className="text-right w-[260px]">
              <h4 className="text-white text-[22px] font-bold mb-3 uppercase tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>Artisanal Form</h4>
              <p className="text-white/40 text-[15px] leading-relaxed mb-8">Each curve is meticulously draped to ensure a fluid silhouette that adapts to every movement.</p>
              <div className="relative inline-block">
                <div className="w-[160px] h-[160px] rounded-[8px] overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] bg-white/5">
                  <img src={product.images[1] || product.images[0]} className="w-full h-full object-cover" />
                </div>
                <motion.div
                  style={{ width: line1Width }}
                  className="absolute top-1/2 left-full h-[1px] bg-[#BF9B5E] origin-left"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            style={{ scale: imgScale, opacity: imgOpacity }}
            className="relative w-[600px] aspect-[4/5] rounded-[4px] overflow-hidden z-10 shadow-[0_0_150px_rgba(0,0,0,0.9)] border border-white/5"
          >
            <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            style={{ x: point2X, opacity: point2Opacity }}
            className="absolute right-[2%] bottom-[20%] flex items-center gap-10 z-30"
          >
            <div className="relative flex items-center">
              <motion.div
                style={{ width: line2Width }}
                className="absolute top-1/2 right-full h-[1px] bg-[#BF9B5E] origin-right"
              />
              <div className="text-left w-[300px] pl-12 border-l border-[#BF9B5E]/30 py-4">
                <h4 className="text-white text-[22px] font-bold mb-3 uppercase tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>Sourced Perfection</h4>
                <p className="text-white/40 text-[16px] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Crafted from our signature linen-silk blend, offering breathability with a subtle luminescence that captures every light.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-20 right-20 z-20">
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-6 text-[#BF9B5E]"
          >
            <span className="text-[11px] tracking-[0.5em] uppercase font-bold vertical-text">Scroll Down</span>
            <ArrowRight size={28} className="rotate-90" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── DESKTOP RELATED CARD ────────────────────────────────────────────────────

function RelatedCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="flex gap-5 p-3 rounded-[4px] bg-white/50 hover:bg-white border border-[#E5E2D9] hover:border-[#BF9B5E] transition-all duration-500 shadow-sm hover:shadow-md">
        <div className="w-24 h-28 rounded-[2px] overflow-hidden flex-shrink-0">
          <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div className="flex flex-col justify-center py-1">
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#0C0C0B] mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{product.name}</p>
          <p className="text-[11px] text-[#8C8880] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>{product.subtitle}</p>
          <p className="text-[16px] font-bold text-[#BF9B5E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>${product.price}</p>
        </div>
      </div>
    </Link>
  );
}

// ─── MOBILE RELATED CARD ─────────────────────────────────────────────────────

function MobileRelatedCard({ product }: { product: Product }) {
  return (
    <Link to={`/products/${product.slug}`} className="flex-shrink-0 w-[160px] group">
      <motion.div
        className="rounded-[12px] overflow-hidden bg-[#F0EDE8] mb-3 aspect-[3/4] relative"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <img src={product.images[0]} className="w-full h-full object-cover" />
      </motion.div>
      <p className="text-[13px] font-bold text-center text-[#0C0C0B] mb-0.5 line-clamp-2 leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>{product.name}</p>
      <p className="text-[13px] text-center text-[#0C0C0B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>${product.price.toLocaleString()}.00 USD</p>
    </Link>
  );
}

// ─── ACCORDION ────────────────────────────────────────────────────────────────

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10 last:border-0">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-7 text-left group"
      >
        <span className="text-white text-[16px] lg:text-[16px] font-bold tracking-[0.15em] lg:tracking-[0.25em] uppercase group-hover:text-[#BF9B5E] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {title}
        </span>
        <div className={`w-9 h-9 rounded-full border border-white/20 flex items-center justify-center transition-all duration-500 ${open ? "bg-[#BF9B5E] border-[#BF9B5E] text-black" : "text-white group-hover:border-[#BF9B5E] group-hover:text-[#BF9B5E]"}`}>
          {open ? <X size={16} /> : <Plus size={16} />}
        </div>
      </motion.button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-10 text-white/50 text-[15px] leading-relaxed max-w-xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── SOCIAL ICONS ────────────────────────────────────────────────────────────

function SocialIcons() {
  const icons = [
    { Icon: Facebook, label: "Facebook" },
    { Icon: () => <span className="text-[16px] font-black">𝕏</span>, label: "X" },
    { Icon: () => <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-.99-.19-1.47-.35-.6-.2-1.07-.3-1.03-.64.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>, label: "Telegram" },
    { Icon: () => <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5.16-1.35A9.93 9.93 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fillRule="evenodd"/></svg>, label: "WhatsApp" },
    { Icon: Mail, label: "Email" },
  ];

  return (
    <div className="flex items-center gap-4">
      <span className="text-[13px] font-bold text-[#0C0C0B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Social:</span>
      {icons.map((item, i) => (
        <motion.button
          key={item.label}
          whileTap={{ scale: 0.85 }}
          whileHover={{ y: -2 }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#0C0C0B] hover:text-[#BF9B5E] transition-colors"
        >
          <item.Icon size={18} />
        </motion.button>
      ))}
    </div>
  );
}

// ─── SCROLL TO TOP BUTTON ────────────────────────────────────────────────────

function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="lg:hidden fixed bottom-20 right-4 z-40 w-11 h-11 rounded-full bg-white border border-[#E5E2D9] shadow-lg flex items-center justify-center"
        >
          <ArrowUp size={18} className="text-[#0C0C0B]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── MAIN PDP ────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug ?? "");
  const related = getRelatedProducts(slug ?? "", 4);
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [addedState, setAddedState] = useState<"idle" | "added">("idle");
  const [sizeError, setSizeError] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [mobileMainImg, setMobileMainImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [mobileRelatedScroll, setMobileRelatedScroll] = useState(0);
  const relatedScrollRef = useRef<HTMLDivElement>(null);

  const overviewRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const specificationsRef = useRef<HTMLDivElement>(null);

  const [emblaRef] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      if (specificationsRef.current && scrollPos >= specificationsRef.current.offsetTop) {
        setActiveSection("specifications");
      } else if (descriptionRef.current && scrollPos >= descriptionRef.current.offsetTop) {
        setActiveSection("description");
      } else {
        setActiveSection("overview");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateToSection = (id: SectionId) => {
    // Mobile uses refs, desktop uses IDs
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      const el = document.getElementById(`desktop-${id}`);
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
    } else {
      const refs = { overview: overviewRef, description: descriptionRef, specifications: specificationsRef };
      const target = refs[id].current;
      if (target) window.scrollTo({ top: target.offsetTop - 130, behavior: "smooth" });
    }
  };

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700 }}>Product not found</p>
        <Link to="/collections/all" className="mt-4 underline text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Browse all products</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    const variant = product.variants[selectedVariant];
    addItem(product, selectedSize, variant.id, variant.label, variant.color);
    setAddedState("added");
    setTimeout(() => setAddedState("idle"), 2500);
  };

  const scrollRelated = (dir: number) => {
    if (relatedScrollRef.current) {
      relatedScrollRef.current.scrollBy({ left: dir * 180, behavior: "smooth" });
    }
  };

  const stockLeft = 13;

  return (
    <PageTransition>
      <div className="bg-[#F8F6F1] min-h-screen">
        {/* Desktop floating nav */}
        <FloatingNav activeSection={activeSection} onNavigate={navigateToSection} />
        <ScrollToTop />

        {/* Spacer for fixed nav */}
        <div className="h-[60px] lg:h-[56px]" />

        {/* ════════════════════════════════════════════════════════════════
            MOBILE LAYOUT
           ════════════════════════════════════════════════════════════════ */}
        <div className="lg:hidden">
          <div ref={overviewRef}>
            {/* ── Mobile Main Image ── */}
            <motion.div
              className="relative bg-[#ECECEC] overflow-hidden"
              style={{ aspectRatio: "3/4" }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={mobileMainImg}
                  src={product.images[mobileMainImg]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                />
              </AnimatePresence>
            </motion.div>

            {/* ── Mobile Thumbnail Strip ── */}
            <div className="flex gap-1 p-1 bg-white">
              {product.images.slice(0, 4).map((img, i) => (
                <motion.button
                  key={i}
                  onClick={() => setMobileMainImg(i)}
                  className={`flex-1 aspect-[3/4] rounded-[4px] overflow-hidden border-2 transition-all ${
                    mobileMainImg === i ? "border-[#0C0C0B]" : "border-transparent opacity-60"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>

            {/* ── Mobile Product Info ── */}
            <div className="px-5 pt-7 pb-4 bg-white">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[24px] font-bold text-[#0C0C0B] mb-2 leading-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {product.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-[22px] font-bold text-[#0C0C0B] mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                ${product.price.toLocaleString()}.00 USD
              </motion.p>
              <p className="text-[13px] text-[#8C8880]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Taxes included. <span className="underline">Shipping</span> calculated at checkout.
              </p>

              <div className="mt-1 h-[3px] w-full bg-[#E5E2D9] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#BF9B5E] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "70%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            {/* ── Color Selector ── */}
            <div className="px-5 py-5 bg-white border-t border-[#F0EDE8]">
              <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#0C0C0B] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Color : <span className="font-normal text-[#8C8880]">{product.variants[selectedVariant]?.label}</span>
              </p>
              <div className="flex gap-3">
                {product.variants.map((v, i) => (
                  <motion.button
                    key={v.id}
                    onClick={() => setSelectedVariant(i)}
                    whileTap={{ scale: 0.9 }}
                    className={`w-12 h-14 rounded-[4px] overflow-hidden border-2 transition-all ${
                      selectedVariant === i ? "border-[#0C0C0B] shadow-md" : "border-[#E5E2D9] opacity-50"
                    }`}
                  >
                    <img src={v.thumb} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* ── Size Selector ── */}
            <div className="px-5 py-5 bg-white border-t border-[#F0EDE8]">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#0C0C0B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Size : <span className="font-normal text-[#8C8880]">{selectedSize || "—"}</span>
                </p>
                <button className="flex items-center gap-1.5 text-[13px] font-bold text-[#0C0C0B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Size chart <Ruler size={16} />
                </button>
              </div>
              <div className="flex gap-3">
                {product.sizes.slice(0, 3).map((size) => (
                  <motion.button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    whileTap={{ scale: 0.93 }}
                    className={`flex-1 h-14 rounded-[4px] border-2 flex items-center justify-center text-[14px] font-bold transition-all ${
                      selectedSize === size
                        ? "bg-[#0C0C0B] text-white border-[#0C0C0B]"
                        : "border-[#E5E2D9] text-[#0C0C0B]"
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
              <AnimatePresence>
                {sizeError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[#C4302B] text-[11px] mt-3 font-bold"
                  >
                    Please select a size
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* ── Quantity ── */}
            <div className="px-5 py-5 bg-white border-t border-[#F0EDE8]">
              <p className="text-[13px] font-bold text-[#0C0C0B] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Quantity</p>
              <div className="inline-flex items-center border-2 border-[#E5E2D9] rounded-[4px] overflow-hidden">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 h-14 flex items-center justify-center text-[#0C0C0B] hover:bg-[#F0EDE8] transition-colors"
                >
                  <Minus size={18} />
                </motion.button>
                <span className="w-14 h-14 flex items-center justify-center text-[18px] font-bold border-x-2 border-[#E5E2D9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-14 h-14 flex items-center justify-center text-[#0C0C0B] hover:bg-[#F0EDE8] transition-colors"
                >
                  <Plus size={18} />
                </motion.button>
              </div>

              {/* Stock urgency */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 mt-5"
              >
                <span className="w-5 h-5 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#C4302B] text-[10px]">!</span>
                <p className="text-[13px] text-[#0C0C0B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Hurry, only <span className="font-bold">{stockLeft}</span> item left in stock!
                </p>
              </motion.div>
            </div>

            {/* ── Pickup Info ── */}
            <div className="mx-5 my-4 p-5 bg-[#ECFDF5] rounded-[8px] border border-[#D1FAE5]">
              <div className="flex gap-4">
                <Package size={22} className="text-[#059669] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[13px] font-bold text-[#0C0C0B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Pickup available at California Warehouse</p>
                      <p className="text-[12px] text-[#8C8880] mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Usually ready in 24 hours</p>
                    </div>
                    <button className="text-[12px] underline text-[#0C0C0B] flex-shrink-0 ml-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Check availability at other stores
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Delivery & Returns ── */}
            <div className="px-5 py-5 bg-white border-t border-[#F0EDE8]">
              <div className="flex items-center divide-x divide-[#E5E2D9]">
                <div className="flex items-center gap-3 pr-6 flex-1">
                  <Truck size={22} className="text-[#0C0C0B] flex-shrink-0" />
                  <span className="text-[13px] text-[#0C0C0B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Free delivery within 2 days</span>
                </div>
                <div className="flex items-center gap-3 pl-6 flex-1">
                  <Globe size={22} className="text-[#0C0C0B] flex-shrink-0" />
                  <span className="text-[13px] text-[#0C0C0B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Free + easy returns</span>
                </div>
              </div>
            </div>

            {/* ── Social Share ── */}
            <div className="px-5 py-5 bg-white border-t border-[#F0EDE8]">
              <SocialIcons />
            </div>

            {/* ── CTAs ── */}
            <div className="px-5 py-6 bg-white space-y-4 border-t border-[#F0EDE8]">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="w-full bg-[#0C0C0B] text-white py-5 rounded-full text-[15px] font-bold tracking-[0.08em] shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {addedState === "added" ? "✓ Added to Cart" : "Add to cart"}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full bg-[#0C0C0B] text-white py-5 rounded-full text-[15px] font-bold tracking-[0.08em]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Buy it now
              </motion.button>
            </div>

            {/* ── PAIRS WELL WITH (mobile carousel) ── */}
            <div className="px-5 py-8 bg-white border-t border-[#F0EDE8]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[18px] font-black uppercase tracking-[0.08em] text-[#0C0C0B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Pairs Well With</h3>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => scrollRelated(-1)}
                    className="w-10 h-10 rounded-full bg-[#E5E2D9] flex items-center justify-center hover:bg-[#0C0C0B] hover:text-white transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => scrollRelated(1)}
                    className="w-10 h-10 rounded-full bg-[#0C0C0B] text-white flex items-center justify-center"
                  >
                    <ChevronRight size={18} />
                  </motion.button>
                </div>
              </div>
              <div ref={relatedScrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
                {related.map((p) => <MobileRelatedCard key={p.id} product={p} />)}
              </div>
            </div>
          </div>

          {/* ── Mobile Sticky Tabs ── */}
          <MobileStickyTabs activeSection={activeSection} onNavigate={navigateToSection} />

          {/* ── DESCRIPTION SECTION (Mobile) ── */}
          <div ref={descriptionRef}>
            <section className="bg-[#050505] py-12 px-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[22px] font-bold text-white uppercase tracking-[0.1em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Description</h2>
                  <button className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white">
                    <X size={16} />
                  </button>
                </div>
                <p className="text-white/60 text-[15px] leading-relaxed mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {product.description}
                </p>
              </motion.div>

              <div className="space-y-0">
                <Accordion title="International Shipping Available">
                  <p>We ship to over 40 countries worldwide with express options available. Standard delivery takes 5-8 business days, while express options arrive within 2-3 days.</p>
                </Accordion>
                <Accordion title="Premium Fabrics">
                  <p>Woven from 100% fine Belgian Linen with a silk-satin lining. The fabric is treated with a natural enzyme wash to provide a soft, lived-in feel from the very first wear.</p>
                </Accordion>
                <Accordion title="Discover Your Perfect Size">
                  <p>Our detailed size guide helps you find the perfect fit. Each garment includes measurements for chest, waist, and length to ensure your ideal silhouette.</p>
                </Accordion>
              </div>

              {/* Large product image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mt-8 rounded-[16px] overflow-hidden aspect-[4/5] relative"
              >
                <img src={product.images[2] || product.images[0]} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </motion.div>
            </section>
          </div>

          {/* ── SPECIFICATIONS (Mobile) ── */}
          <div ref={specificationsRef}>
            <HighlightsSection product={product} />
          </div>

          {/* ── More to Explore ── */}
          <section className="py-10 px-5 bg-[#F8F6F1]">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[32px] font-bold text-[#0C0C0B] mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              More to Explore
            </motion.h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1">
              {related.map((p, i) => (
                <Link key={p.id} to={`/products/${p.slug}`} className="flex-shrink-0 w-[75vw] max-w-[320px] group">
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="rounded-[16px] overflow-hidden bg-[#ECECEC] aspect-[3/4] relative mb-4"
                  >
                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm flex items-center justify-between">
                      <span className="text-[12px] font-bold uppercase tracking-[0.1em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Quick View</span>
                      <Plus size={18} />
                    </div>
                  </motion.div>
                  <p className="text-[14px] font-bold text-center text-[#0C0C0B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{p.name}</p>
                  <p className="text-[14px] text-center text-[#0C0C0B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>${p.price.toLocaleString()}.00 USD</p>
                  <div className="flex justify-center gap-1.5 mt-2">
                    {p.variants.slice(0, 5).map((v) => (
                      <div key={v.id} className="w-6 h-7 rounded-[2px] overflow-hidden border border-[#E5E2D9]">
                        <img src={v.thumb} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            DESKTOP LAYOUT (unchanged)
           ════════════════════════════════════════════════════════════════ */}
        <div className="hidden lg:block">
          <section id="desktop-overview" className="lg:min-h-[calc(100vh-56px)] lg:flex">
            {/* DESKTOP GALLERY */}
            <div className="flex flex-1 items-start">
              <div className="w-1/2 sticky top-[56px] h-[calc(100vh-56px)] p-0 bg-white">
                <Magnifier src={product.images[0]} alt={product.name} />
              </div>
              <div className="w-1/2 flex flex-col gap-1 p-1 pr-0">
                {product.images.slice(1).map((img, i) => (
                  <div key={i} className="aspect-[4/5] bg-[#F0EDE8] rounded-[2px] overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="h-[20vh]" />
              </div>
            </div>

            {/* PRODUCT INFO PANEL */}
            <div className="w-[520px] sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto px-16 py-12 bg-[#F8F6F1]">
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "#BF9B5E" : "none"} stroke={i < Math.floor(product.rating) ? "#BF9B5E" : "#DDD9D0"} strokeWidth={1.5} />
                  ))}
                </div>
                <span className="text-[#8C8880] text-[12px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{product.rating} / 5.0</span>
              </div>

              <h1 className="text-[52px] font-bold leading-[1.0] text-[#0C0C0B] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{product.name}</h1>
              <p className="text-[15px] text-[#8C8880] mb-10 font-medium tracking-wide leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{product.subtitle}</p>

              <div className="flex items-baseline gap-6 mb-12">
                <span className="text-[42px] font-bold text-[#0C0C0B]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>${product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <span className="text-[22px] line-through text-[#A0998F] font-light" style={{ fontFamily: "'DM Sans', sans-serif" }}>${product.originalPrice.toLocaleString()}</span>
                )}
              </div>

              <div className="space-y-12">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#0C0C0B] mb-5">Select Color — <span className="text-[#BF9B5E]">{product.variants[selectedVariant]?.label}</span></p>
                  <div className="flex gap-4">
                    {product.variants.map((v, i) => (
                      <button key={v.id} onClick={() => setSelectedVariant(i)} className={`w-16 h-20 rounded-[2px] border-2 transition-all duration-500 overflow-hidden ${selectedVariant === i ? "border-[#0C0C0B] scale-105" : "border-transparent opacity-40 hover:opacity-100"}`}>
                        <img src={v.thumb} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-5">
                    <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#0C0C0B]">Select Size — {selectedSize || "None"}</p>
                    <button className="flex items-center gap-2 text-[11px] font-bold tracking-[0.25em] uppercase text-[#BF9B5E] hover:text-[#0C0C0B] transition-colors">Size chart <Ruler size={14} /></button>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {product.sizes.map((size) => (
                      <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }} className={`min-w-[64px] h-16 rounded-[2px] border-2 flex items-center justify-center text-[13px] font-bold transition-all duration-300 ${selectedSize === size ? "bg-[#0C0C0B] text-white border-[#0C0C0B]" : "border-[#E5E2D9] text-[#0C0C0B] hover:border-[#BF9B5E]"}`}>{size}</button>
                    ))}
                  </div>
                  {sizeError && <p className="text-[#C4302B] text-[10px] mt-3 font-black uppercase tracking-[0.3em] animate-pulse">Required : Please select a size</p>}
                </div>

                <div className="space-y-4 pt-6 border-t border-[#E5E2D9]">
                  <motion.button whileTap={{ scale: 0.98 }} onClick={handleAddToCart} className="w-full bg-[#0C0C0B] text-white py-7 rounded-full text-[12px] font-bold tracking-[0.3em] uppercase hover:bg-black transition-all shadow-[0_15px_40px_rgba(0,0,0,0.2)]">
                    {addedState === "added" ? "✓ Item added to Bag" : "Add to shopping bag"}
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.98 }} className="w-full border-2 border-[#0C0C0B] text-[#0C0C0B] py-7 rounded-full text-[12px] font-bold tracking-[0.3em] uppercase hover:bg-[#0C0C0B] hover:text-white transition-all">Buy it now</motion.button>
                </div>

                {/* Pairs Well With (Desktop only) */}
                <div className="pt-12 border-t border-[#E5E2D9]">
                  <h4 className="text-[11px] tracking-[0.4em] uppercase font-bold text-[#8C8880] mb-8">Pairs Well With</h4>
                  <div className="space-y-5">
                    {related.slice(0, 3).map((p) => <RelatedCard key={p.id} product={p} />)}
                  </div>
                </div>

                <div className="bg-[#F3F0E8] p-8 rounded-[4px] space-y-5 border border-[#E5E2D9]">
                  <div className="flex gap-5">
                    <Shield size={24} className="text-[#BF9B5E] flex-shrink-0" />
                    <div>
                      <p className="text-[13px] font-bold text-[#0C0C0B] uppercase tracking-widest mb-1.5">Quality Assurance</p>
                      <p className="text-[12px] text-[#8C8880] leading-relaxed">Each Celisira piece undergoes a rigorous 12-point inspection at our boutique workshop before being numbered and shipped.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DESKTOP DESCRIPTION SECTION */}
          <section id="desktop-description" className="bg-[#050505] py-40 px-24">
            <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-32 items-center">
              <div className="lg:w-[45%]">
                <div className="space-y-4">
                  <Accordion title="The Aesthetic Narrative" defaultOpen>
                    <p className="text-[18px] font-light leading-relaxed mb-8 italic text-[#BF9B5E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      "A study in understated opulence, designed for the woman whose presence is felt through grace, not noise."
                    </p>
                    <p className="leading-relaxed text-[16px]">This garment is an exploration of geometry and softness. We've utilized traditional tailoring techniques combined with laser-cutting technology to achieve edges that are both sharp and seamless.</p>
                  </Accordion>
                  <Accordion title="Premium Fabric Edit"><p>Woven from 100% fine Belgian Linen with a silk-satin lining. The fabric is treated with a natural enzyme wash to provide a soft, lived-in feel from the very first wear while retaining its structural integrity.</p></Accordion>
                  <Accordion title="Ethical Production"><p>Proudly produced in Portugal within a family-owned atelier. We prioritize small-batch manufacturing to eliminate overstock and minimize environmental footprint, ensuring every artisan is compensated with a living wage.</p></Accordion>
                </div>
              </div>
              <div className="lg:w-[55%]">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="relative rounded-[4px] overflow-hidden aspect-[16/11] shadow-[0_60px_120px_rgba(0,0,0,0.8)]">
                  <img src={product.images[2] || product.images[0]} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </motion.div>
              </div>
            </div>
          </section>

          {/* DESKTOP SPECIFICATIONS */}
          <div id="desktop-specifications">
            <HighlightsSection product={product} />
          </div>
        </div>

        <SiteFooter />
      </div>
    </PageTransition>
  );
}