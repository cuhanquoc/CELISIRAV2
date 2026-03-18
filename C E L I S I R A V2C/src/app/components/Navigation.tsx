import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router";
import { Search, ShoppingBag, Heart, X, Menu, ChevronRight, ChevronDown, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import logo from "figma:asset/6c00779b48d9e8b3e03e4909ea4efc6d0ee77c16.png";

const navLinks = [
  { label: "Home", href: "/", hasDropdown: true },
  { label: "Catalog", href: "/collections/all", hasDropdown: true },
  { label: "About", href: "/" },
  { label: "Blogs", href: "/" },
  { label: "Privacy", href: "/" },
];

const homeDropdown = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Resort Edit", href: "/collections/resort" },
  { label: "Sale", href: "/collections/sale" },
];

const catalogDropdown = [
  { label: "All Styles", href: "/collections/all" },
  { label: "Dresses", href: "/collections/dresses" },
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Sale", href: "/collections/sale" },
];

const menuCategories = [
  {
    title: "Shop",
    items: [
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Dresses", href: "/collections/dresses" },
      { label: "Resort Edit", href: "/collections/resort" },
      { label: "All Styles", href: "/collections/all" },
      { label: "Sale", href: "/collections/sale" },
    ],
  },
  {
    title: "Discover",
    items: [
      { label: "Our Story", href: "/" },
      { label: "Sustainability", href: "/" },
      { label: "Size Guide", href: "/" },
      { label: "Gift Cards", href: "/" },
    ],
  },
];

function DropdownMenu({ items, onClose }: { items: { label: string; href: string }[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 mt-2 bg-[#1A1A19] border border-white/10 rounded-[4px] shadow-2xl py-2 min-w-[180px] z-50"
    >
      {items.map((item) => (
        <Link
          key={item.label}
          to={item.href}
          onClick={onClose}
          className="block px-5 py-2.5 text-[12px] text-white/70 hover:text-white hover:bg-white/5 tracking-[0.08em] transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {item.label}
        </Link>
      ))}
    </motion.div>
  );
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { itemCount, openDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections/all`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const getDropdownItems = (label: string) => {
    if (label === "Home") return homeDropdown;
    if (label === "Catalog") return catalogDropdown;
    return null;
  };

  return (
    <>
      {/* ─── DESKTOP NAV ─────────────────────────────────────────────── */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-40">
        <motion.div
          className="bg-[#0C0C0B] border-b border-white/5"
          animate={{
            backgroundColor: scrolled ? "rgba(12,12,11,0.97)" : "rgba(12,12,11,1)",
            backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center px-8 h-[56px] max-w-screen-2xl mx-auto">
            {/* Logo + Links */}
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center gap-3 flex-shrink-0">
                <img src={logo} alt="Celisira" className="h-7 w-7 object-contain invert" />
                <span
                  className="text-white text-[18px] tracking-[0.2em] uppercase font-semibold"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Celisira
                </span>
              </Link>

              <nav className="flex items-center gap-7">
                {navLinks.map((link) => (
                  <div key={link.label} className="relative">
                    <Link
                      to={link.href}
                      className="flex items-center gap-1 text-[13px] text-white/80 hover:text-white tracking-[0.04em] transition-colors relative group py-4"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                      onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.label)}
                    >
                      {link.label}
                      {link.hasDropdown && <ChevronDown size={12} className="text-white/40" />}
                      <motion.div
                        className="absolute bottom-3 left-0 h-[1px] bg-white/60"
                        initial={{ scaleX: 0, originX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.25 }}
                        style={{ width: "100%" }}
                      />
                    </Link>
                    <AnimatePresence>
                      {activeDropdown === link.label && link.hasDropdown && (
                        <DropdownMenu
                          items={getDropdownItems(link.label)!}
                          onClose={() => setActiveDropdown(null)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1 ml-auto">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen((v) => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search size={17} strokeWidth={1.8} />
              </motion.button>

              <Link
                to="/account"
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label="Account"
              >
                <User size={17} strokeWidth={1.8} />
              </Link>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={openDrawer}
                className="w-9 h-9 flex items-center justify-center rounded-full relative hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={17} strokeWidth={1.8} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-white text-[#0C0C0B] flex items-center justify-center"
                      style={{ fontSize: "8px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Desktop Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 56, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-[#1A1A19] border-b border-white/5"
            >
              <form onSubmit={handleSearch} className="flex items-center gap-4 px-8 h-full max-w-screen-xl mx-auto">
                <Search size={17} className="text-white/40" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search our collections..."
                  className="flex-1 bg-transparent outline-none text-[14px] text-white placeholder:text-white/30"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X size={18} className="text-white/60 hover:text-white transition-colors" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── MOBILE NAV ──────────────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40">
        <div className="bg-[#0C0C0B] flex items-center justify-between px-5 h-[60px]">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(true)}
              className="w-9 h-9 flex items-center justify-center text-white"
              aria-label="Menu"
            >
              <Menu size={22} strokeWidth={1.8} />
            </motion.button>
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="Celisira" className="h-7 w-7 object-contain invert" />
              <span
                className="text-white text-[20px] tracking-[0.15em] uppercase"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}
              >
                Celisira
              </span>
            </Link>
          </div>

          {/* Right: Search + Cart */}
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen((v) => !v)}
              className="w-10 h-10 flex items-center justify-center text-white"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.8} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={openDrawer}
              className="w-10 h-10 flex items-center justify-center relative text-white"
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 right-0.5 w-[18px] h-[18px] rounded-full bg-white text-[#0C0C0B] flex items-center justify-center border-2 border-[#0C0C0B]"
                    style={{ fontSize: "9px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 52, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-[#1A1A19] border-t border-white/5"
            >
              <form onSubmit={handleSearch} className="flex items-center gap-3 px-5 h-full">
                <Search size={17} className="text-white/40" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 bg-transparent outline-none text-[14px] text-white placeholder:text-white/30"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X size={18} className="text-white/60" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── SLIDE-OUT MENU (Mobile) ─────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 bottom-0 z-50 w-[85vw] max-w-[400px] bg-[#0C0C0B] flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between px-6 h-[60px] border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="Celisira" className="h-6 w-6 object-contain invert" />
                  <span className="text-white text-[16px] tracking-[0.2em] font-semibold uppercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Celisira</span>
                </div>
                <button onClick={() => setMenuOpen(false)} className="text-white/60 hover:text-white"><X size={22} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
                {menuCategories.map((cat, i) => (
                  <div key={i}>
                    <h4 className="text-[10px] tracking-[0.25em] uppercase text-[#BF9B5E] mb-5 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{cat.title}</h4>
                    <div className="space-y-4">
                      {cat.items.map((item, j) => (
                        <Link
                          key={j}
                          to={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between group"
                        >
                          <span className="text-white/80 text-[16px] group-hover:text-white transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.label}</span>
                          <ChevronRight size={14} className="text-white/20 group-hover:text-[#BF9B5E] transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-white/10 flex gap-4">
                <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="flex-1 flex items-center justify-center gap-2 py-3 border border-white/10 rounded-full text-white/70 text-[11px] tracking-[0.15em] uppercase hover:bg-white/5 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <Heart size={14} /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
                <Link to="/account" onClick={() => setMenuOpen(false)} className="flex-1 flex items-center justify-center gap-2 py-3 border border-white/10 rounded-full text-white/70 text-[11px] tracking-[0.15em] uppercase hover:bg-white/5 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <User size={14} /> Account
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
