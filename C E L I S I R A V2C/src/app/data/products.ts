// ─── SHARED PRODUCT DATA ─────────────────────────────────────────────────────
// Single source of truth for all pages

export interface ProductVariant {
  id: string;
  label: string;
  color: string;
  thumb: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  badge: "SALE" | "NEW" | null;
  collection: string; // "dresses" | "new-arrivals" | "sale" | "resort"
  images: string[];
  variants: ProductVariant[];
  sizes: string[];
  description: string;
  details: string[];
  care: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
}

export const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
    slug: "arden-dress",
    name: "ARDEN DRESS™",
    subtitle: "Asymmetrical Mini",
    price: 42.99,
    originalPrice: 135.99,
    badge: "SALE",
    collection: "sale",
    isNew: false,
    images: [
      "https://images.unsplash.com/photo-1650813896010-01981783f757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1771150360033-394beed06bbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1624486290495-e0b5476af8f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1494578379344-d6c710382a3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
    ],
    variants: [
      { id: "v1", label: "Mint Green", color: "#B8D4C4", thumb: "https://images.unsplash.com/photo-1650813896010-01981783f757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
      { id: "v2", label: "Sky Blue", color: "#A8C4D8", thumb: "https://images.unsplash.com/photo-1771150360033-394beed06bbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
      { id: "v3", label: "Dusty Rose", color: "#D4B4B4", thumb: "https://images.unsplash.com/photo-1624486290495-e0b5476af8f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "The Arden Dress is an architectural take on the classic mini. Its asymmetrical hem and draped bodice create a silhouette that's effortlessly modern — a dress that does the talking so you don't have to.",
    details: ["100% Premium Viscose", "Asymmetrical hemline", "Concealed back zip", "Lined bodice", "Dry clean recommended", "Portugal Portugal Portugal"],
    care: ["Dry clean only", "Do not bleach", "Do not tumble dry", "Iron on low heat through cloth"],
    rating: 4.8,
    reviewCount: 142,
  },
  {
    id: 2,
    slug: "aurelie-dress",
    name: "AURELIE DRESS™",
    subtitle: "Summer Maxi",
    price: 48.99,
    originalPrice: 59.99,
    badge: null,
    collection: "dresses",
    isNew: false,
    images: [
      "https://images.unsplash.com/photo-1746730921745-5f6afa4c56c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1677083969178-270d54394133?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1650813896010-01981783f757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
    ],
    variants: [
      { id: "v1", label: "Ivory", color: "#F0EBE0", thumb: "https://images.unsplash.com/photo-1746730921745-5f6afa4c56c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
      { id: "v2", label: "Champagne", color: "#D4C4A4", thumb: "https://images.unsplash.com/photo-1677083969178-270d54394133?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Soft, flowing, and endlessly graceful — the Aurelie Maxi was designed for every golden moment. Cut from our signature deadstock fabric, it drapes beautifully and moves like water.",
    details: ["95% Tencel, 5% Elastane", "Maxi length", "Adjustable tie straps", "Fully lined", "Portugal Portugal Portugal"],
    care: ["Machine wash cold, gentle cycle", "Lay flat to dry", "Cool iron if needed", "Do not bleach"],
    rating: 4.9,
    reviewCount: 231,
  },
  {
    id: 3,
    slug: "azure-dress",
    name: "AZURE DRESS™",
    subtitle: "Floral Midi",
    price: 42.99,
    originalPrice: 89.99,
    badge: "NEW",
    collection: "new-arrivals",
    isNew: true,
    images: [
      "https://images.unsplash.com/photo-1713314597034-165452e12fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1624486290495-e0b5476af8f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1771150360033-394beed06bbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
    ],
    variants: [
      { id: "v1", label: "Ocean Blue", color: "#7FA8C8", thumb: "https://images.unsplash.com/photo-1713314597034-165452e12fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
      { id: "v2", label: "Blush", color: "#E4C4C0", thumb: "https://images.unsplash.com/photo-1624486290495-e0b5476af8f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
      { id: "v3", label: "Sage", color: "#A8BCA8", thumb: "https://images.unsplash.com/photo-1771150360033-394beed06bbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Inspired by morning gardens, the Azure Midi brings botanical beauty to everyday dressing. The floral print is hand-drawn, digitally printed on our softest modal fabric.",
    details: ["100% LENZING™ ECOVERO™ Modal", "Midi length — approx 42\"", "Button-through front", "Elasticated waist", "Portugal Portugal Portugal"],
    care: ["Hand wash cold", "Do not wring", "Dry in shade", "Warm iron if needed"],
    rating: 4.7,
    reviewCount: 89,
  },
  {
    id: 4,
    slug: "celeste-dress",
    name: "CELESTE DRESS™",
    subtitle: "Satin Evening",
    price: 64.99,
    originalPrice: 120.00,
    badge: "SALE",
    collection: "sale",
    isNew: false,
    images: [
      "https://images.unsplash.com/photo-1677083969178-270d54394133?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1746730921745-5f6afa4c56c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1713314597034-165452e12fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
    ],
    variants: [
      { id: "v1", label: "Mocha", color: "#8C7460", thumb: "https://images.unsplash.com/photo-1677083969178-270d54394133?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
      { id: "v2", label: "Ivory", color: "#F0EBE0", thumb: "https://images.unsplash.com/photo-1746730921745-5f6afa4c56c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "The Celeste is evening glamour distilled. Bias-cut satin slips effortlessly over every curve, catching the light in that way that makes a room notice. This is your statement dress.",
    details: ["100% Acetate satin", "Bias cut for fluid drape", "Adjustable spaghetti straps", "Portugal Portugal Portugal"],
    care: ["Dry clean only", "Store on a padded hanger", "Do not press directly", "Keep away from perfume"],
    rating: 4.9,
    reviewCount: 178,
  },
  {
    id: 5,
    slug: "soleil-maxi",
    name: "SOLEIL MAXI",
    subtitle: "Flowing Linen Dress",
    price: 89.99,
    originalPrice: 149.99,
    badge: "NEW",
    collection: "new-arrivals",
    isNew: true,
    images: [
      "https://images.unsplash.com/photo-1680690653166-1618c3bcdf51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1761637782890-9edea22a83fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1758900727878-f7c5e90ed171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
    ],
    variants: [
      { id: "v1", label: "Natural Linen", color: "#E8DDD0", thumb: "https://images.unsplash.com/photo-1680690653166-1618c3bcdf51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
      { id: "v2", label: "Warm Sand", color: "#C4B8A8", thumb: "https://images.unsplash.com/photo-1761637782890-9edea22a83fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
      { id: "v3", label: "Dusk", color: "#8C7B6C", thumb: "https://images.unsplash.com/photo-1758900727878-f7c5e90ed171?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "The Soleil Maxi is designed for those golden, unhurried days. Cut from 100% enzyme-washed linen, it drapes beautifully and breathes freely — made to be lived in, season after season.",
    details: ["100% Enzyme-washed Linen", "Maxi length — approx 56\"", "Tie shoulder straps", "Portugal Portugal Portugal"],
    care: ["Machine wash 30°C, gentle", "Tumble dry low", "Iron while damp for crisp look", "Gets softer with every wash"],
    rating: 4.9,
    reviewCount: 287,
  },
  {
    id: 6,
    slug: "isle-dress",
    name: "ISLE DRESS™",
    subtitle: "Resort Wrap",
    price: 55.99,
    originalPrice: 55.99,
    badge: null,
    collection: "resort",
    isNew: false,
    images: [
      "https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1741816219965-c85341184d68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1773099217427-77bba76cf0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
    ],
    variants: [
      { id: "v1", label: "Terracotta", color: "#C47850", thumb: "https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
      { id: "v2", label: "Midnight", color: "#2C2C3C", thumb: "https://images.unsplash.com/photo-1741816219965-c85341184d68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "The Isle is your island companion — a classic wrap silhouette re-imagined in our signature fluid crepe. It ties at the waist and adjusts to your shape, making it universally flattering.",
    details: ["100% Recycled Crepe", "Wrap silhouette with adjustable tie", "V-neckline", "Portugal Portugal Portugal"],
    care: ["Machine wash cold", "Line dry in shade", "Avoid direct sunlight when storing", "Do not tumble dry"],
    rating: 4.6,
    reviewCount: 94,
  },
  {
    id: 7,
    slug: "reverie-dress",
    name: "REVERIE DRESS™",
    subtitle: "Ruched Bodycon",
    price: 37.99,
    originalPrice: 75.00,
    badge: "SALE",
    collection: "sale",
    isNew: false,
    images: [
      "https://images.unsplash.com/photo-1741816219965-c85341184d68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1762343291569-680a1efe1fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1650813896010-01981783f757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
    ],
    variants: [
      { id: "v1", label: "Noir", color: "#1C1C1C", thumb: "https://images.unsplash.com/photo-1741816219965-c85341184d68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
      { id: "v2", label: "Cobalt", color: "#3A58A0", thumb: "https://images.unsplash.com/photo-1762343291569-680a1efe1fbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "The Reverie plays with texture and tension. Ruched at the sides for a figure-sculpting effect, this bodycon dress is designed to turn heads with effortless confidence.",
    details: ["92% Polyester, 8% Elastane", "Ruched side seams", "Mini length", "Portugal Portugal Portugal"],
    care: ["Hand wash cold", "Do not wring or twist", "Lay flat to dry", "Cool iron if needed"],
    rating: 4.5,
    reviewCount: 67,
  },
  {
    id: 8,
    slug: "haven-dress",
    name: "HAVEN DRESS™",
    subtitle: "Relaxed Linen Shirt",
    price: 58.99,
    originalPrice: 58.99,
    badge: null,
    collection: "dresses",
    isNew: false,
    images: [
      "https://images.unsplash.com/photo-1729808785139-c8de8eff75d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1773099217427-77bba76cf0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1611048268330-53de574cae3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900",
    ],
    variants: [
      { id: "v1", label: "Oat", color: "#E8E0D0", thumb: "https://images.unsplash.com/photo-1729808785139-c8de8eff75d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
      { id: "v2", label: "Sage", color: "#A0B4A0", thumb: "https://images.unsplash.com/photo-1773099217427-77bba76cf0e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
      { id: "v3", label: "White", color: "#F8F8F4", thumb: "https://images.unsplash.com/photo-1611048268330-53de574cae3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=120" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "The Haven is your easy-living essential. Oversized and relaxed in Belgian linen, it works as a dress or an open shirt layered over your favourite swimwear. Summer sorted.",
    details: ["100% Belgian Linen", "Relaxed oversized fit", "Button-front with collar", "Portugal Portugal Portugal"],
    care: ["Machine wash 40°C", "Tumble dry medium", "Iron while damp", "Gets softer with every wash"],
    rating: 4.8,
    reviewCount: 156,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCollection(slug: string): Product[] {
  if (slug === "all") return ALL_PRODUCTS;
  if (slug === "sale") return ALL_PRODUCTS.filter((p) => p.badge === "SALE");
  if (slug === "new-arrivals") return ALL_PRODUCTS.filter((p) => p.isNew);
  return ALL_PRODUCTS.filter((p) => p.collection === slug);
}

export function getRelatedProducts(currentSlug: string, limit = 4): Product[] {
  const current = getProductBySlug(currentSlug);
  if (!current) return ALL_PRODUCTS.slice(0, limit);
  return ALL_PRODUCTS.filter((p) => p.slug !== currentSlug && (p.collection === current.collection || p.badge === current.badge)).slice(0, limit);
}
