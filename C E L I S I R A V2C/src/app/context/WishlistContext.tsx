import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  badge: "SALE" | "NEW" | null;
  images: string[];
}

interface WishlistContextType {
  items: WishlistItem[];
  isWishlisted: (productId: number) => boolean;
  toggle: (product: WishlistItem) => void;
  remove: (productId: number) => void;
  count: number;
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "celisira_wishlist_v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items]);

  const isWishlisted = useCallback(
    (productId: number) => items.some((p) => p.id === productId),
    [items]
  );

  const toggle = useCallback((product: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  }, []);

  const remove = useCallback((productId: number) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const count = items.length;

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggle, remove, count }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
