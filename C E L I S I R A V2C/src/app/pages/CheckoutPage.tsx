import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight, ArrowLeft, Check, Lock, CreditCard,
  Truck, MapPin, User, Mail, Phone, Package, Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { PageTransition } from "../components/PageTransition";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Step = "shipping" | "payment" | "confirmation";

interface ShippingForm {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  shippingMethod: "standard" | "express";
}

interface PaymentForm {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

// ─── STEP INDICATOR ──────────────────────────────────────────────────────────

const STEPS: { id: Step; label: string }[] = [
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "confirmation", label: "Confirmed" },
];

function StepBar({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              {/* Circle */}
              <motion.div
                animate={{
                  background: done ? "#0C0C0B" : active ? "#BF9B5E" : "#E5E2D9",
                  scale: active ? 1.12 : 1,
                  boxShadow: active ? "0 0 0 4px rgba(191,155,94,0.18)" : "0 0 0 0px rgba(191,155,94,0)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
              >
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    >
                      <Check size={13} strokeWidth={3} className="text-white" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="number"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      className="text-[11px] font-black"
                      style={{ color: active ? "#fff" : "#A0998F" }}
                    >
                      {i + 1}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Label */}
              <motion.span
                animate={{
                  color: active ? "#0C0C0B" : done ? "#0C0C0B" : "#A0998F",
                  fontWeight: active ? 700 : done ? 600 : 400,
                }}
                className="text-[9px] tracking-[0.14em] uppercase whitespace-nowrap"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {step.label}
              </motion.span>
            </div>

            {/* Connector line with animated fill */}
            {i < STEPS.length - 1 && (
              <div
                className="w-16 sm:w-28 h-[2px] mx-2 mb-5 rounded-full overflow-hidden"
                style={{ background: "#E5E2D9" }}
              >
                <motion.div
                  className="h-full rounded-full origin-left"
                  style={{ background: "linear-gradient(90deg, #0C0C0B 0%, #3C3830 100%)" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: done ? 1 : active ? 0.5 : 0 }}
                  transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1], delay: done ? 0.1 : 0 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── FORM FIELD ───────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  half,
  required,
  pattern,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  half?: boolean;
  required?: boolean;
  pattern?: string;
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={half ? "flex-1 min-w-0" : "w-full"}>
      <label
        className="block text-[10px] tracking-[0.18em] uppercase mb-1.5 font-semibold"
        style={{ fontFamily: "'DM Sans', sans-serif", color: focused ? "#BF9B5E" : "#8C8880" }}
      >
        {label}{required && <span className="text-[#BF9B5E] ml-0.5">*</span>}
      </label>
      <motion.div
        animate={{ borderColor: focused ? "#BF9B5E" : "#E5E2D9" }}
        className="rounded-xl border overflow-hidden"
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={maxLength}
          pattern={pattern}
          className="w-full px-4 py-3.5 bg-white outline-none text-sm"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#0C0C0B" }}
        />
      </motion.div>
    </div>
  );
}

// ─── ORDER SUMMARY MINI ───────────────────────────────────────────────────────

function OrderSummaryMini({ shipping }: { shipping: number }) {
  const { items, subtotal } = useCart();
  const total = subtotal + shipping;

  return (
    <div className="bg-[#F0EDE8] rounded-2xl p-5 space-y-3">
      <p
        className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#8C8880] mb-4"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Order Summary
      </p>
      {items.map((item) => (
        <div key={item.cartId} className="flex items-center gap-3">
          <div className="relative w-12 h-14 rounded-xl overflow-hidden flex-shrink-0">
            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
            <div
              className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-[#0C0C0B] text-white flex items-center justify-center"
              style={{ width: 18, height: 18, fontSize: 9, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}
            >
              {item.quantity}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {item.product.name}
            </p>
            <p className="text-[10px] text-[#8C8880]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {item.variantLabel} · Size {item.size}
            </p>
          </div>
          <span className="text-xs font-bold flex-shrink-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            ${(item.product.price * item.quantity).toFixed(2)}
          </span>
        </div>
      ))}
      <div className="h-px bg-[#E5E2D9] my-2" />
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-[#8C8880]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-[#8C8880]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-emerald-600 font-semibold" : ""}>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-[#E5E2D9]">
          <span className="font-bold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Total</span>
          <span
            className="font-bold"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700 }}
          >
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 1: SHIPPING ─────────────────────────────────────────────────────────

function ShippingStep({
  form,
  onChange,
  onNext,
}: {
  form: ShippingForm;
  onChange: (key: keyof ShippingForm, value: string) => void;
  onNext: () => void;
}) {
  const shippingCost = form.shippingMethod === "express" ? 14.99 : 0;
  const canProceed = form.email && form.firstName && form.lastName && form.address && form.city && form.zip;

  return (
    <div className="space-y-8">
      {/* Contact */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Mail size={14} className="text-[#BF9B5E]" />
          <h3 className="text-sm font-bold tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Contact
          </h3>
        </div>
        <div className="space-y-3">
          <Field label="Email address" value={form.email} onChange={(v) => onChange("email", v)} type="email" placeholder="you@example.com" required />
          <Field label="Phone (optional)" value={form.phone} onChange={(v) => onChange("phone", v)} type="tel" placeholder="+1 (555) 000-0000" />
        </div>
      </div>

      {/* Shipping address */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={14} className="text-[#BF9B5E]" />
          <h3 className="text-sm font-bold tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Shipping Address
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex gap-3">
            <Field label="First name" value={form.firstName} onChange={(v) => onChange("firstName", v)} placeholder="Jane" required half />
            <Field label="Last name" value={form.lastName} onChange={(v) => onChange("lastName", v)} placeholder="Doe" required half />
          </div>
          <Field label="Address" value={form.address} onChange={(v) => onChange("address", v)} placeholder="123 Blossom Ave" required />
          <div className="flex gap-3">
            <Field label="City" value={form.city} onChange={(v) => onChange("city", v)} placeholder="Los Angeles" required half />
            <Field label="ZIP / Postcode" value={form.zip} onChange={(v) => onChange("zip", v)} placeholder="90001" required half maxLength={10} />
          </div>
          <div className="flex gap-3">
            <Field label="State / Province" value={form.state} onChange={(v) => onChange("state", v)} placeholder="CA" half />
            <Field label="Country" value={form.country} onChange={(v) => onChange("country", v)} placeholder="United States" required half />
          </div>
        </div>
      </div>

      {/* Shipping method */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Truck size={14} className="text-[#BF9B5E]" />
          <h3 className="text-sm font-bold tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Delivery
          </h3>
        </div>
        <div className="space-y-2">
          {[
            { id: "standard", label: "Standard Shipping", sublabel: "5–7 business days", price: "FREE" },
            { id: "express", label: "Express Shipping", sublabel: "2–3 business days", price: "$14.99" },
          ].map((opt) => (
            <motion.button
              key={opt.id}
              onClick={() => onChange("shippingMethod", opt.id)}
              whileTap={{ scale: 0.99 }}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-colors text-left ${
                form.shippingMethod === opt.id
                  ? "border-[#0C0C0B] bg-[#0C0C0B]/[0.03]"
                  : "border-[#E5E2D9] hover:border-[#BF9B5E]"
              }`}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    background: form.shippingMethod === opt.id ? "#0C0C0B" : "#fff",
                    borderColor: form.shippingMethod === opt.id ? "#0C0C0B" : "#D0CCC4",
                  }}
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                >
                  <AnimatePresence>
                    {form.shippingMethod === opt.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-1.5 h-1.5 rounded-full bg-white"
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
                <div>
                  <p className="text-sm font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{opt.label}</p>
                  <p className="text-[11px] text-[#8C8880]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{opt.sublabel}</p>
                </div>
              </div>
              <span
                className="font-bold text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif", color: opt.price === "FREE" ? "#059669" : "#0C0C0B" }}
              >
                {opt.price}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <OrderSummaryMini shipping={shippingCost} />

      {/* CTA */}
      <motion.button
        onClick={onNext}
        disabled={!canProceed}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-full bg-[#0C0C0B] text-white text-sm font-black tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <motion.div
          className="absolute inset-0 bg-[#BF9B5E]"
          initial={{ x: "-101%" }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        />
        <span className="relative z-10">Continue to Payment</span>
        <ChevronRight size={14} className="relative z-10" />
      </motion.button>
    </div>
  );
}

// ─── STEP 2: PAYMENT ─────────────────────────────────────────────────────────

function formatCardNumber(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})/g, "$1 ").trim();
}

function formatExpiry(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

function PaymentStep({
  form,
  onChange,
  onNext,
  onBack,
  shipping,
}: {
  form: PaymentForm;
  onChange: (key: keyof PaymentForm, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  shipping: number;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const canProceed = form.cardNumber.replace(/\s/g, "").length === 16 && form.cardName && form.expiry.length === 5 && form.cvv.length >= 3;

  const handleSubmit = () => {
    if (!canProceed) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onNext();
    }, 1800);
  };

  // Detect card type from first digit
  const firstDigit = form.cardNumber.replace(/\s/g, "")[0];
  const cardType = firstDigit === "4" ? "VISA" : firstDigit === "5" ? "MC" : firstDigit === "3" ? "AMEX" : "CARD";

  return (
    <div className="space-y-8">
      {/* Card preview */}
      <motion.div
        className="relative h-44 rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0C0C0B 0%, #2C2B28 40%, #BF9B5E 100%)" }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 70% 30%, rgba(191,155,94,0.6) 0%, transparent 60%)" }} />

        <div className="absolute top-5 left-6 right-6 flex items-start justify-between">
          <span className="text-white/60 text-[10px] tracking-[0.22em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Celisira
          </span>
          <span className="text-white/80 text-xs font-bold tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {cardType}
          </span>
        </div>

        {/* Chip */}
        <div className="absolute top-14 left-6">
          <div className="w-9 h-6 rounded-md" style={{ background: "linear-gradient(135deg, #D4A843 0%, #F0C060 50%, #C8962E 100%)" }} />
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <p
            className="text-white text-lg tracking-[0.22em] tabular-nums mb-2"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, letterSpacing: "0.18em" }}
          >
            {form.cardNumber || "•••• •••• •••• ••••"}
          </p>
          <div className="flex justify-between">
            <span className="text-white/70 text-[11px] uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {form.cardName || "Your Name"}
            </span>
            <span className="text-white/70 text-[11px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {form.expiry || "MM/YY"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Card fields */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={14} className="text-[#BF9B5E]" />
          <h3 className="text-sm font-bold tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Card Details
          </h3>
        </div>
        <div className="space-y-3">
          <Field
            label="Card number"
            value={form.cardNumber}
            onChange={(v) => onChange("cardNumber", formatCardNumber(v))}
            placeholder="1234 5678 9012 3456"
            required
            maxLength={19}
          />
          <Field
            label="Name on card"
            value={form.cardName}
            onChange={(v) => onChange("cardName", v)}
            placeholder="Jane Doe"
            required
          />
          <div className="flex gap-3">
            <Field
              label="Expiry"
              value={form.expiry}
              onChange={(v) => onChange("expiry", formatExpiry(v))}
              placeholder="MM/YY"
              required
              half
              maxLength={5}
            />
            <Field
              label="CVV"
              value={form.cvv}
              onChange={(v) => onChange("cvv", v.replace(/\D/g, "").slice(0, 4))}
              placeholder="•••"
              required
              half
              type="password"
              maxLength={4}
            />
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
        <Lock size={14} className="text-emerald-600 flex-shrink-0" />
        <p className="text-xs text-emerald-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Your payment info is encrypted with 256-bit SSL. We never store card details.
        </p>
      </div>

      {/* Summary */}
      <OrderSummaryMini shipping={shipping} />

      {/* CTAs */}
      <div className="space-y-3">
        <motion.button
          onClick={handleSubmit}
          disabled={!canProceed || isProcessing}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-full bg-[#0C0C0B] text-white text-sm font-black tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                />
                <span>Processing...</span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Lock size={13} />
                <span>Place Order</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          onClick={onBack}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3.5 rounded-full border-2 border-[#E5E2D9] text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:border-[#0C0C0B] transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#8C8880" }}
        >
          <ArrowLeft size={14} />
          <span>Back to Shipping</span>
        </motion.button>
      </div>
    </div>
  );
}

// ─── STEP 3: CONFIRMATION ─────────────────────────────────────────────────────

function ConfirmationStep({ orderNumber, shipping }: { orderNumber: string; shipping: number }) {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const total = subtotal + shipping;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-center space-y-8"
    >
      {/* Success animation */}
      <div className="flex justify-center">
        <motion.div
          className="relative w-28 h-28 rounded-full bg-[#0C0C0B] flex items-center justify-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.1 }}
        >
          {/* Ripple rings */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-[#0C0C0B]"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1 + i * 0.35, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.4, ease: "easeOut" }}
            />
          ))}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.3 }}
          >
            <Check size={36} strokeWidth={3} className="text-white" />
          </motion.div>
        </motion.div>
      </div>

      {/* Heading */}
      <div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-[10px] tracking-[0.25em] uppercase text-[#BF9B5E] mb-2"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Order Confirmed
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2rem, 8vw, 3.2rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            color: "#0C0C0B",
          }}
        >
          Thank you,<br />
          <em className="italic" style={{ color: "#BF9B5E" }}>beautiful.</em>
        </motion.h2>
      </div>

      {/* Order details */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-[#F0EDE8] rounded-2xl p-6 text-left space-y-4"
      >
        <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-[#8C8880] font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <Package size={12} className="text-[#BF9B5E]" />
          Order #{orderNumber}
        </div>

        {items.map((item) => (
          <div key={item.cartId} className="flex items-center gap-3">
            <div className="w-12 h-14 rounded-xl overflow-hidden flex-shrink-0">
              <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.product.name}</p>
              <p className="text-[11px] text-[#8C8880]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.variantLabel} · {item.size} · Qty {item.quantity}</p>
            </div>
            <span className="text-xs font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}

        <div className="h-px bg-[#E5E2D9]" />
        <div className="flex justify-between">
          <span className="font-bold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Total paid</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 700 }}>${total.toFixed(2)}</span>
        </div>
      </motion.div>

      {/* Delivery info */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-3"
      >
        {[
          { icon: Mail, text: "Confirmation email sent to your inbox" },
          { icon: Truck, text: "Estimated delivery: March 22–26, 2026" },
          { icon: Sparkles, text: "Track your order with code #" + orderNumber },
        ].map(({ icon: Icon, text }, i) => (
          <div key={i} className="flex items-center gap-3 text-sm text-[#5C5850]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <Icon size={14} className="text-[#BF9B5E] flex-shrink-0" />
            <span>{text}</span>
          </div>
        ))}
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-3"
      >
        <motion.button
          onClick={() => { clearCart(); navigate("/"); }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-full bg-[#0C0C0B] text-white text-sm font-black tracking-widest uppercase relative overflow-hidden group"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <motion.div
            className="absolute inset-0 bg-[#BF9B5E]"
            initial={{ x: "-101%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          />
          <span className="relative z-10">Continue Shopping</span>
        </motion.button>
        <Link
          to="/collections/all"
          className="block py-3.5 text-center text-sm text-[#8C8880] hover:text-[#0C0C0B] transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Browse new arrivals →
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("shipping");
  const [orderNumber] = useState(() => Math.random().toString(36).slice(2, 9).toUpperCase());

  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    shippingMethod: "standard",
  });

  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const updateShipping = useCallback(
    (key: keyof ShippingForm, value: string) =>
      setShippingForm((prev) => ({ ...prev, [key]: value })),
    []
  );

  const updatePayment = useCallback(
    (key: keyof PaymentForm, value: string) =>
      setPaymentForm((prev) => ({ ...prev, [key]: value })),
    []
  );

  const shippingCost = shippingForm.shippingMethod === "express" ? 14.99 : 0;

  // Redirect if cart is empty and not on confirmation
  if (items.length === 0 && step !== "confirmation") {
    return (
      <PageTransition>
        <div className="min-h-screen pt-[90px] pb-[100px] flex flex-col items-center justify-center px-5" style={{ background: "#F8F6F1" }}>
          <div className="text-center">
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: "#0C0C0B" }}>
              Your bag is empty
            </p>
            <p className="text-[#8C8880] mt-2 mb-6 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Add something beautiful before checking out.
            </p>
            <motion.button
              onClick={() => navigate("/")}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 bg-[#0C0C0B] text-white rounded-full text-xs font-black tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Shop Now
            </motion.button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-[90px] pb-[100px]" style={{ background: "#F8F6F1" }}>
        {/* Header */}
        <div className="px-5 pt-6 pb-2 max-w-xl mx-auto">
          {step !== "confirmation" && (
            <motion.button
              onClick={() => navigate(-1)}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-1.5 text-[#8C8880] text-xs tracking-widest uppercase mb-6 hover:text-[#0C0C0B] transition-colors"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              ← Back
            </motion.button>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <Link to="/" className="inline-block mb-4">
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 24,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#0C0C0B",
                }}
              >
                Celisira
              </span>
            </Link>
            {step !== "confirmation" && (
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#8C8880]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Secure Checkout
              </p>
            )}
          </motion.div>

          <StepBar current={step} />
        </div>

        {/* Step Content */}
        <div className="px-5 max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            {step === "shipping" && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <User size={15} className="text-[#BF9B5E]" />
                  <h2 className="font-bold tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
                    Contact & Shipping
                  </h2>
                </div>
                <ShippingStep form={shippingForm} onChange={updateShipping} onNext={() => setStep("payment")} />
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              >
                <PaymentStep
                  form={paymentForm}
                  onChange={updatePayment}
                  onNext={() => setStep("confirmation")}
                  onBack={() => setStep("shipping")}
                  shipping={shippingCost}
                />
              </motion.div>
            )}

            {step === "confirmation" && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              >
                <ConfirmationStep orderNumber={orderNumber} shipping={shippingCost} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}