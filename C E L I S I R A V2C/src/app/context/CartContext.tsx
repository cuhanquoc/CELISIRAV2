import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Product } from "../data/products";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface CartItem {
  cartId: string; // unique per item (productId + size + variantId)
  product: Product;
  size: string;
  variantId: string;
  variantLabel: string;
  variantColor: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (product: Product, size: string, variantId: string, variantLabel: string, variantColor: string) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = useCallback(() => setIsOpen(true), []);
  const closeDrawer = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    (product: Product, size: string, variantId: string, variantLabel: string, variantColor: string) => {
      const cartId = `${product.id}-${size}-${variantId}`;
      setItems((prev) => {
        const existing = prev.find((i) => i.cartId === cartId);
        if (existing) {
          return prev.map((i) =>
            i.cartId === cartId ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [
          ...prev,
          { cartId, product, size, variantId, variantLabel, variantColor, quantity: 1 },
        ];
      });
      // Auto-open drawer after short delay
      setTimeout(() => setIsOpen(true), 200);
    },
    []
  );

  const removeItem = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.cartId === cartId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openDrawer,
        closeDrawer,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
