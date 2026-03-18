import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Package, Heart, MapPin, CreditCard,
  ChevronRight, ArrowRight, Star, RotateCcw,
  Truck, Check, Clock, Settings, LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useWishlist } from "../context/WishlistContext";
import { PageTransition } from "../components/PageTransition";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type OrderStatus = "delivered" | "shipped" | "processing" | "cancelled";

interface MockOrderItem {
  name: string;
  subtitle: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

interface MockOrder {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: MockOrderItem[];
  tracking?: string;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const MOCK_ORDERS: MockOrder[] = [
  {
    id: "CLS-8F3A2X",
    date: "March 12, 2026",
    status: "delivered",
    total: 91.98,
    tracking: "1Z999AA10123456784",
    items: [
      {
        name: "ARDEN DRESS™",
        subtitle: "Asymmetrical Mini",
        price: 42.99,
        quantity: 1,
        size: "S",
        color: "Mint Green",
        image: "https://images.unsplash.com/photo-1650813896010-01981783f757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
      {
        name: "AZURE DRESS™",
        subtitle: "Floral Midi",
        price: 48.99,
        quantity: 1,
        size: "M",
        color: "Ocean Blue",
        image: "https://images.unsplash.com/photo-1713314597034-165452e12fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
    ],
  },
  {
    id: "CLS-2K9P4M",
    date: "February 28, 2026",
    status: "shipped",
    total: 64.99,
    tracking: "1Z999AA10123456799",
    items: [
      {
        name: "CELESTE DRESS™",
        subtitle: "Satin Evening",
        price: 64.99,
        quantity: 1,
        size: "XS",
        color: "Mocha",
        image: "https://images.unsplash.com/photo-1677083969178-270d54394133?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
    ],
  },
  {
    id: "CLS-7R1V6N",
    date: "January 15, 2026",
    status: "delivered",
    total: 97.98,
    tracking: "1Z999AA10123456712",
    items: [
      {
        name: "AURELIE DRESS™",
        subtitle: "Summer Maxi",
        price: 48.99,
        quantity: 1,
        size: "S",
        color: "Ivory",
        image: "https://images.unsplash.com/photo-1746730921745-5f6afa4c56c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
      {
        name: "ARDEN DRESS™",
        subtitle: "Asymmetrical Mini",
        price: 48.99,
        quantity: 1,
        size: "S",
        color: "Sky Blue",
        image: "https://images.unsplash.com/photo-1771150360033-394beed06bbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
    ],
  },
];

const MOCK_PROFILE = {
  name: "Celisira Member",
  email: "hello@celisira.com",
  joinDate: "December 2024",
  totalOrders: 3,
  totalSpent: 254.95,
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: typeof Check }> = {
  delivered: { label: "Delivered", color: "#059669", bg: "#ECFDF5", icon: Check },
  shipped: { label: "Shipped", color: "#2563EB", bg: "#EFF6FF", icon: Truck },
  processing: { label: "Processing", color: "#D97706", bg: "#FFFBEB", icon: Clock },
  cancelled: { label: "Cancelled", color: "#DC2626", bg: "#FEF2F2", icon: RotateCcw },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider"
      style={{ color: cfg.color, background: cfg.bg, fontFamily: "'DM Sans', sans-serif" }}
    >
      <Icon size={9} strokeWidth={3} />
      {cfg.label}
    </span>
  );
}

// ─── ORDER CARD ───────────────────────────────────────────────────────────────

function OrderCard({ order, index }: { order: MockOrder; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm"
    >
      {/* Header row */}
      <motion.button
        onClick={() => setExpanded((v) => !v)}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          {/* Stacked product thumbnails */}
          <div className="relative w-12 h-14 flex-shrink-0">
            {order.items.slice(0, 2).map((item, i) => (
              <div
                key={i}
                className="absolute rounded-xl overflow-hidden border-2 border-white"
                style={{
                  width: 40,
                  height: 48,
                  left: i * 8,
                  top: i * 4,
                  zIndex: order.items.length - i,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                }}
              >
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
            ))}
            {order.items.length > 2 && (
              <div
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#0C0C0B] text-white flex items-center justify-center z-10"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 8, fontWeight: 700 }}
              >
                +{order.items.length - 2}
              </div>
            )}
          </div>

          <div>
            <p className="font-bold text-[#0C0C0B] text-[13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Order #{order.id}
            </p>
            <p className="text-[#8C8880] text-[11px] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {order.date} · {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <StatusBadge status={order.status} />
          <span
            className="font-bold text-[#0C0C0B]"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700 }}
          >
            ${order.total.toFixed(2)}
          </span>
        </div>
      </motion.button>

      {/* Expanded items */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#F0EDE8] px-4 py-4 space-y-3">
              {order.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {item.name}
                    </p>
                    <p className="text-[10px] text-[#8C8880]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {item.color} · Size {item.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-[12px] font-bold flex-shrink-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </motion.div>
              ))}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#F0EDE8]">
                {order.status === "delivered" && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 py-2.5 rounded-xl bg-[#0C0C0B] text-white text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <Star size={10} />
                    Leave Review
                  </motion.button>
                )}
                {(order.status === "shipped" || order.status === "processing") && order.tracking && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 py-2.5 rounded-xl border border-[#0C0C0B] text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <Truck size={10} />
                    Track Order
                  </motion.button>
                )}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-2.5 rounded-xl border border-[#E5E2D9] text-[#8C8880] text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 hover:border-[#BF9B5E] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <RotateCcw size={10} />
                  Reorder
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand chevron indicator */}
      <div className="flex justify-center pb-2">
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronRight size={12} className="text-[#BF9B5E] rotate-90" />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── NAV TABS ─────────────────────────────────────────────────────────────────

type Tab = "orders" | "wishlist" | "addresses" | "settings";

const TABS: { id: Tab; label: string; icon: typeof Package }[] = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "settings", label: "Settings", icon: Settings },
];

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const { items: wishlistItems, remove } = useWishlist();
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen pt-[90px] pb-[100px]" style={{ background: "#F8F6F1" }}>

        {/* ── PROFILE HERO ── */}
        <div className="relative overflow-hidden mb-0">
          {/* Warm gradient header */}
          <div
            className="px-5 pt-8 pb-16"
            style={{ background: "linear-gradient(135deg, #0C0C0B 0%, #2C2A26 60%, rgba(191,155,94,0.2) 100%)" }}
          >
            <div className="max-w-screen-lg mx-auto flex items-start justify-between">
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-[10px] tracking-[0.25em] uppercase text-[#BF9B5E] mb-2"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  My Account
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(2rem, 8vw, 3.2rem)",
                    fontWeight: 700,
                    lineHeight: 1.0,
                  }}
                >
                  Hello,<br />
                  <em className="italic" style={{ color: "#BF9B5E" }}>gorgeous.</em>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/50 mt-2 text-xs"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {MOCK_PROFILE.email} · Member since {MOCK_PROFILE.joinDate}
                </motion.p>
              </div>

              {/* Avatar */}
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.15 }}
                className="w-14 h-14 rounded-full bg-[#BF9B5E]/20 border-2 border-[#BF9B5E]/40 flex items-center justify-center flex-shrink-0"
              >
                <User size={24} className="text-[#BF9B5E]" />
              </motion.div>
            </div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex gap-6 mt-6 max-w-screen-lg mx-auto"
            >
              {[
                { label: "Total Orders", value: MOCK_PROFILE.totalOrders },
                { label: "Total Spent", value: `$${MOCK_PROFILE.totalSpent.toFixed(2)}` },
                { label: "Wishlist", value: wishlistItems.length },
              ].map((stat, i) => (
                <div key={i}>
                  <p
                    className="text-white"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, lineHeight: 1 }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-white/45 mt-0.5"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.1em" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Curved bottom */}
          <div
            className="h-8 -mt-1"
            style={{ background: "#F8F6F1", borderRadius: "50% 50% 0 0 / 30px 30px 0 0", marginTop: -28 }}
          />
        </div>

        {/* ── TAB BAR ── */}
        <div className="px-5 -mt-2 max-w-screen-lg mx-auto">
          <div className="flex gap-1 bg-[#F0EDE8] rounded-2xl p-1 mb-6">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-2.5 rounded-xl relative"
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <motion.div
                    className="relative z-10 flex flex-col sm:flex-row items-center gap-1"
                    animate={{ color: isActive ? "#0C0C0B" : "#A0998F" }}
                  >
                    <Icon size={14} strokeWidth={isActive ? 2.2 : 1.7} />
                    <span
                      className="relative z-10"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 9,
                        fontWeight: isActive ? 700 : 500,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {tab.label}
                    </span>
                  </motion.div>
                </motion.button>
              );
            })}
          </div>

          {/* ── ORDERS TAB ── */}
          <AnimatePresence mode="wait">
            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#8C8880] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {MOCK_ORDERS.length} Orders
                  </p>
                  <Link
                    to="/collections/all"
                    className="flex items-center gap-1 text-[10px] tracking-widest uppercase text-[#BF9B5E] hover:text-[#0C0C0B] transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Shop More <ArrowRight size={10} />
                  </Link>
                </div>
                {MOCK_ORDERS.map((order, i) => (
                  <OrderCard key={order.id} order={order} index={i} />
                ))}
              </motion.div>
            )}

            {/* ── WISHLIST TAB ── */}
            {activeTab === "wishlist" && (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                {wishlistItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-[#F0EDE8] flex items-center justify-center mb-4">
                      <Heart size={24} strokeWidth={1.2} className="text-[#BF9B5E]" />
                    </div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#0C0C0B" }}>
                      Nothing saved yet
                    </p>
                    <p className="text-[#8C8880] mt-1 mb-5 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Tap the heart on any piece to save it here
                    </p>
                    <Link
                      to="/collections/all"
                      className="px-6 py-3 bg-[#0C0C0B] text-white rounded-full text-xs font-bold tracking-widest uppercase"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Browse Collection
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {wishlistItems.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.88 }}
                          transition={{ delay: i * 0.05, duration: 0.35 }}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm group"
                          layout
                        >
                          <Link to={`/products/${item.slug}`}>
                            <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                              <motion.img
                                src={item.images[0]}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                              />
                              {item.badge && (
                                <span
                                  className="absolute top-2.5 left-2.5 text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full"
                                  style={{
                                    background: item.badge === "SALE" ? "#0C0C0B" : "#fff",
                                    color: item.badge === "SALE" ? "#fff" : "#0C0C0B",
                                    fontFamily: "'DM Sans', sans-serif",
                                  }}
                                >
                                  {item.badge}
                                </span>
                              )}
                              <motion.button
                                onClick={(e) => { e.preventDefault(); remove(item.id); }}
                                whileTap={{ scale: 0.88 }}
                                whileHover={{ rotate: 90 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </motion.button>
                            </div>
                          </Link>
                          <div className="p-3">
                            <p className="text-[11px] font-semibold truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                              {item.name}
                            </p>
                            <p className="font-bold mt-0.5" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 700 }}>
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── ADDRESSES TAB ── */}
            {activeTab === "addresses" && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {[
                  { label: "Home", address: "123 Blossom Avenue", city: "Los Angeles, CA 90001", country: "United States", isDefault: true },
                  { label: "Work", address: "456 Fashion Blvd, Suite 12", city: "Beverly Hills, CA 90210", country: "United States", isDefault: false },
                ].map((addr, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-white rounded-2xl p-5 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F0EDE8] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin size={14} className="text-[#BF9B5E]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[12px] font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {addr.label}
                          </p>
                          {addr.isDefault && (
                            <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#0C0C0B] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#5C5850]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {addr.address}
                        </p>
                        <p className="text-[11px] text-[#8C8880]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {addr.city}
                        </p>
                        <p className="text-[11px] text-[#8C8880]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {addr.country}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="text-[10px] font-bold tracking-widest uppercase text-[#BF9B5E] hover:text-[#0C0C0B] transition-colors flex-shrink-0 mt-1"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Edit
                    </motion.button>
                  </motion.div>
                ))}

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-[#D5D2CB] text-[#8C8880] text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:border-[#BF9B5E] hover:text-[#BF9B5E] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  + Add Address
                </motion.button>
              </motion.div>
            )}

            {/* ── SETTINGS TAB ── */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {[
                  { icon: User, label: "Personal Details", sub: "Name, email, phone" },
                  { icon: CreditCard, label: "Payment Methods", sub: "Saved cards & billing" },
                  { icon: Package, label: "Order Preferences", sub: "Packaging, gift notes" },
                ].map((item, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm group hover:shadow-md transition-shadow text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F0EDE8] flex items-center justify-center">
                        <item.icon size={15} className="text-[#BF9B5E]" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {item.label}
                        </p>
                        <p className="text-[11px] text-[#8C8880]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {item.sub}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      className="text-[#BF9B5E]"
                    >
                      <ChevronRight size={15} />
                    </motion.div>
                  </motion.button>
                ))}

                {/* Sign out */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-[#E5E2D9] text-[#8C8880] text-sm hover:border-red-200 hover:text-red-400 transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: "0.06em" }}
                >
                  <LogOut size={14} />
                  Sign Out
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
