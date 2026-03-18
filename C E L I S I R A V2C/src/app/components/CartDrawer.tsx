import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2, Tag } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";

export function CartDrawer() {
  const { items, isOpen, closeDrawer, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoFocused, setPromoFocused] = useState(false);
  const navigate = useNavigate();

  const discount = promoApplied ? subtotal * 0.15 : 0;
  const total = subtotal - discount;
  const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 6.99;

  const handlePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toLowerCase() === "celisira15") {
      setPromoApplied(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/45"
            style={{ backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-[#F8F6F1] w-full max-w-[420px] shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-[#E5E2D9] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} strokeWidth={1.8} />
                <span
                  className="font-semibold tracking-[0.06em]"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}
                >
                  Your Bag
                </span>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-5 h-5 rounded-full bg-[#0C0C0B] text-white flex items-center justify-center"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700 }}
                  >
                    {itemCount}
                  </motion.span>
                )}
              </div>
              <motion.button
                whileTap={{ scale: 0.88 }}
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                onClick={closeDrawer}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/6 transition-colors"
              >
                <X size={18} strokeWidth={1.8} />
              </motion.button>
            </div>

            {/* Free shipping progress */}
            {subtotal > 0 && subtotal < 50 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="px-6 py-3 bg-[#0C0C0B] text-white"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-[11px] tracking-wide"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Add{" "}
                    <span className="font-bold text-[#BF9B5E]">
                      ${(50 - subtotal).toFixed(2)}
                    </span>{" "}
                    for free shipping
                  </span>
                  <span
                    className="text-[10px] text-white/50"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {Math.round((subtotal / 50) * 100)}%
                  </span>
                </div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#BF9B5E] rounded-full"
                    animate={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
              </motion.div>
            )}
            {subtotal >= 50 && subtotal > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-6 py-2.5 bg-emerald-600 text-white"
              >
                <p
                  className="text-center text-[11px] font-semibold tracking-wider"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  🎉 You've unlocked free shipping!
                </p>
              </motion.div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <ShoppingBag
                      size={40}
                      strokeWidth={1}
                      className="text-[#D0CCC4] mb-4"
                    />
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 22,
                        fontWeight: 600,
                        color: "#0C0C0B",
                      }}
                    >
                      Your bag is empty
                    </p>
                    <p
                      className="text-[#8C8880] mt-2 mb-6"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}
                    >
                      Add something beautiful to get started
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={closeDrawer}
                      className="px-6 py-3 bg-[#0C0C0B] text-white rounded-full text-xs font-bold tracking-widest uppercase"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Start Shopping
                    </motion.button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.cartId}
                      layout
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 24, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="flex gap-3 bg-white rounded-2xl p-3"
                    >
                      {/* Image */}
                      <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p
                              className="text-[#0C0C0B] leading-tight truncate"
                              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}
                            >
                              {item.product.name}
                            </p>
                            <p
                              className="text-[#8C8880] mt-0.5"
                              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}
                            >
                              {item.variantLabel} · Size {item.size}
                            </p>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => removeItem(item.cartId)}
                            className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={12} className="text-[#B0A898] hover:text-red-400" />
                          </motion.button>
                        </div>

                        {/* Color swatch */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <div
                            className="w-3.5 h-3.5 rounded-full border border-white shadow-sm"
                            style={{ background: item.variantColor }}
                          />
                          <span
                            className="text-[#5C5850]"
                            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10 }}
                          >
                            {item.variantLabel}
                          </span>
                        </div>

                        {/* Qty + Price */}
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-center gap-1 bg-[#F0EDE8] rounded-full px-1 py-0.5">
                            <motion.button
                              whileTap={{ scale: 0.88 }}
                              onClick={() => updateQuantity(item.cartId, -1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                            >
                              <Minus size={10} />
                            </motion.button>
                            <span
                              className="w-5 text-center font-semibold"
                              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}
                            >
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.88 }}
                              onClick={() => updateQuantity(item.cartId, 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white transition-colors"
                            >
                              <Plus size={10} />
                            </motion.button>
                          </div>
                          <span
                            className="font-bold text-[#0C0C0B]"
                            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}
                          >
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer — checkout panel */}
            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-shrink-0 border-t border-[#E5E2D9] px-6 py-5 space-y-4"
              >
                {/* Promo code */}
                <form onSubmit={handlePromo}>
                  <motion.div
                    className="flex items-center border rounded-xl overflow-hidden"
                    animate={{
                      borderColor: promoFocused ? "#BF9B5E" : "#E5E2D9",
                    }}
                  >
                    <Tag size={14} className="ml-3 text-[#A0998F] flex-shrink-0" />
                    <input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      onFocus={() => setPromoFocused(true)}
                      onBlur={() => setPromoFocused(false)}
                      placeholder="Promo code (try CELISIRA15)"
                      disabled={promoApplied}
                      className="flex-1 py-2.5 px-2.5 bg-transparent outline-none text-xs"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                    <button
                      type="submit"
                      disabled={promoApplied || !promoCode.trim()}
                      className="px-3 py-2.5 text-[10px] font-bold tracking-wider uppercase text-[#BF9B5E] disabled:opacity-40 flex-shrink-0"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {promoApplied ? "Applied ✓" : "Apply"}
                    </button>
                  </motion.div>
                </form>

                {/* Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8C8880]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Subtotal
                    </span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif" }}>${subtotal.toFixed(2)}</span>
                  </div>
                  {promoApplied && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex justify-between text-sm text-emerald-600"
                    >
                      <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Discount (CELISIRA15)
                      </span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        -${discount.toFixed(2)}
                      </span>
                    </motion.div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8C8880]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Shipping
                    </span>
                    <span
                      className={shipping === 0 ? "text-emerald-600 font-semibold" : ""}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#E5E2D9] pt-2">
                    <span
                      className="font-bold"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}
                    >
                      Total
                    </span>
                    <motion.span
                      key={total}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-bold"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 20,
                        fontWeight: 700,
                      }}
                    >
                      ${(total + shipping).toFixed(2)}
                    </motion.span>
                  </div>
                </div>

                {/* Checkout button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { closeDrawer(); navigate("/checkout"); }}
                  className="w-full py-4 bg-[#0C0C0B] text-white rounded-full flex items-center justify-center gap-2 relative overflow-hidden group"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-[#BF9B5E]"
                    initial={{ x: "-101%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  />
                  <span className="relative z-10 text-sm font-bold tracking-[0.14em] uppercase">
                    Checkout Securely
                  </span>
                  <motion.span className="relative z-10">
                    <ArrowRight size={14} />
                  </motion.span>
                </motion.button>

                <p
                  className="text-center text-[#A0998F] text-[10px]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  🔒 SSL encrypted · Free 30-day returns
                </p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}