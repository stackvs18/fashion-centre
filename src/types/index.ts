// ─── Product ─────────────────────────────────────────────────────────────────
export type Category = "tops" | "bottoms";

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type Fit = "Slim" | "Regular" | "Oversized";

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;           // in ₹
  originalPrice?: number;  // for sale items
  category: Category;
  images: string[];        // array of 4 image URLs
  sizes: Size[];
  colors: ColorOption[];
  fit: Fit;
  fabric: string;
  tags: string[];
  inStock: boolean;
  isNew: boolean;
  isSale: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  product: Product;
  size: Size;
  color: ColorOption;
  quantity: number;
}

// ─── Filter / Sort ───────────────────────────────────────────────────────────
export type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "best-sellers"
  | "most-reviewed";

export interface FilterState {
  sizes: Size[];
  colors: string[];       // color names
  priceRange: [number, number];
  fits: Fit[];
  inStockOnly: boolean;
  sort: SortOption;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderItem {
  product: Omit<Product, "images"> & { image: string };
  size: Size;
  color: ColorOption;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  trackingId?: string;
}

// ─── Address ─────────────────────────────────────────────────────────────────
export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// ─── Wishlist ────────────────────────────────────────────────────────────────
export interface WishlistItem {
  productId: string;
  addedAt: string;
}
