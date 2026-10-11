import type { Product, Category, ColorOption, Fit, Size } from "@/types";

/**
 * Generates a data URI for a labeled placeholder image.
 * The image is white with product info text and a colored border matching
 * the product's primary color.
 *
 * @param label     e.g. "Image 1"
 * @param product   e.g. "Jeans"
 * @param colorHex  e.g. "#1B2A4A"
 * @param colorName e.g. "Navy"
 */
function makePlaceholder(
  label: string,
  product: string,
  colorHex: string,
  colorName: string
): string {
  // Sanitize for SVG text content
  const safe = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1067" viewBox="0 0 800 1067">
  <rect width="800" height="1067" fill="#FAFAF8"/>
  <rect x="0" y="0" width="800" height="12" fill="${colorHex}"/>
  <rect x="0" y="1055" width="800" height="12" fill="${colorHex}"/>
  <rect x="0" y="0" width="12" height="1067" fill="${colorHex}"/>
  <rect x="788" y="0" width="12" height="1067" fill="${colorHex}"/>
  <rect x="60" y="60" width="680" height="947" fill="none" stroke="${colorHex}" stroke-width="1" stroke-dasharray="6 6" opacity="0.4"/>
  <text x="400" y="460" font-family="Georgia, serif" font-size="96" font-weight="700" fill="${colorHex}" text-anchor="middle" opacity="0.12">F</text>
  <text x="400" y="540" font-family="system-ui, sans-serif" font-size="28" font-weight="600" fill="#1A1A1A" text-anchor="middle" letter-spacing="2">${safe(label)}</text>
  <text x="400" y="590" font-family="system-ui, sans-serif" font-size="20" fill="#6B6B6B" text-anchor="middle" letter-spacing="1">${safe(product)}</text>
  <rect x="350" y="618" width="100" height="2" fill="${colorHex}" opacity="0.6"/>
  <circle cx="400" cy="648" r="10" fill="${colorHex}" opacity="0.15"/>
  <circle cx="400" cy="648" r="7" fill="${colorHex}" opacity="0.25"/>
  <circle cx="400" cy="648" r="4" fill="${colorHex}"/>
  <text x="400" y="690" font-family="system-ui, sans-serif" font-size="14" fill="${colorHex}" text-anchor="middle" letter-spacing="3">${safe(colorName.toUpperCase())}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Builds an array of 4 placeholder image URIs for a given product.
 */
function makeImages(
  productName: string,
  colors: ColorOption[]
): [string, string, string, string] {
  const primaryColor = colors[0];
  return [
    makePlaceholder("Image 1", productName, primaryColor.hex, primaryColor.name),
    makePlaceholder(
      "Image 2",
      productName,
      colors[1]?.hex ?? primaryColor.hex,
      colors[1]?.name ?? primaryColor.name
    ),
    makePlaceholder(
      "Image 3",
      productName,
      colors[2]?.hex ?? primaryColor.hex,
      colors[2]?.name ?? primaryColor.name
    ),
    makePlaceholder(
      "Image 4",
      productName,
      primaryColor.hex,
      primaryColor.name
    ),
  ];
}

const COLORS: ColorOption[][] = [
  [
    { name: "Ivory",    hex: "#FFFFF0" },
    { name: "Charcoal", hex: "#1A1A1A" },
    { name: "Sage",     hex: "#8CAE8C" },
  ],
  [
    { name: "Stone", hex: "#928E85" },
    { name: "Rust",  hex: "#C4622D" },
    { name: "Black", hex: "#0D0D0D" },
  ],
  [
    { name: "Oat",  hex: "#D4BBAA" },
    { name: "Navy", hex: "#1B2A4A" },
  ],
  [
    { name: "White",     hex: "#FAFAFA" },
    { name: "Olive",     hex: "#6B6E3E" },
    { name: "Terracotta",hex: "#BE6A50" },
  ],
  [
    { name: "Ecru",     hex: "#C2B280" },
    { name: "Graphite", hex: "#4A4A4A" },
  ],
  [
    { name: "Sand",     hex: "#C2A882" },
    { name: "Forest",   hex: "#2C3E2D" },
    { name: "Burgundy", hex: "#6E1F2A" },
  ],
  [
    { name: "Cream", hex: "#FFFDD0" },
    { name: "Taupe", hex: "#8B8070" },
  ],
  [
    { name: "Slate",  hex: "#6E7B8B" },
    { name: "Bone",   hex: "#E8E0D5" },
    { name: "Sienna", hex: "#A0522D" },
  ],
  [
    { name: "Chalk", hex: "#F2EFE4" },
    { name: "Ink",   hex: "#1C1C3A" },
  ],
  [
    { name: "Linen", hex: "#FAF0E6" },
    { name: "Moss",  hex: "#6B7C5B" },
    { name: "Blush", hex: "#DE9898" },
  ],
];

const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
const FITS: Fit[] = ["Slim", "Regular", "Oversized"];
const FABRICS = [
  "100% Cotton",
  "Linen Blend",
  "Cotton-Poly Blend",
  "100% Linen",
  "Bamboo Cotton",
  "French Terry",
];

export const products: Product[] = [
  // ─── TOPS (10) ──────────────────────────────────────────────────────────
  {
    id: "t001",
    slug: "fashion-essential-crew-tee",
    name: "Essential Crew Tee",
    description:
      "The cornerstone of any wardrobe. Our Essential Crew Tee is crafted from 180gsm Supima cotton with a boxy silhouette that drapes perfectly. Pre-washed for immediate comfort.",
    price: 1299,
    category: "tops",
    images: makeImages("Essential Crew Tee", COLORS[0]),
    sizes: SIZES,
    colors: COLORS[0],
    fit: "Regular",
    fabric: FABRICS[0],
    tags: ["essentials", "tee", "bestseller"],
    inStock: true,
    isNew: false,
    isSale: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 342,
  },
  {
    id: "t002",
    slug: "fashion-linen-button-down",
    name: "Linen Button-Down",
    description:
      "Summer-ready linen shirt with a relaxed fit and subtle texture. Garment-washed for a lived-in feel. Features a camp collar and chest pocket.",
    price: 2499,
    originalPrice: 3199,
    category: "tops",
    images: makeImages("Linen Button-Down", COLORS[1]),
    sizes: ["S", "M", "L", "XL"],
    colors: COLORS[1],
    fit: "Oversized",
    fabric: FABRICS[3],
    tags: ["linen", "summer", "sale"],
    inStock: true,
    isNew: false,
    isSale: true,
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 189,
  },
  {
    id: "t003",
    slug: "fashion-oversized-graphic-tee",
    name: "Oversized Graphic Tee",
    description:
      "Drop-shoulder silhouette with FASHION archival print on the chest. Made from heavyweight 220gsm cotton for structure and longevity.",
    price: 1699,
    category: "tops",
    images: makeImages("Oversized Graphic Tee", COLORS[2]),
    sizes: SIZES,
    colors: COLORS[2],
    fit: "Oversized",
    fabric: FABRICS[0],
    tags: ["graphic", "streetwear", "new"],
    inStock: true,
    isNew: true,
    isSale: false,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 98,
  },
  {
    id: "t004",
    slug: "fashion-polo-collar-tee",
    name: "Polo Collar Tee",
    description:
      "A refined take on the classic polo. Knit collar, two-button placket, and slightly cropped body. Pairs with everything.",
    price: 1899,
    category: "tops",
    images: makeImages("Polo Collar Tee", COLORS[3]),
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: COLORS[3],
    fit: "Slim",
    fabric: FABRICS[2],
    tags: ["polo", "preppy", "bestseller"],
    inStock: true,
    isNew: false,
    isSale: false,
    isBestSeller: true,
    rating: 4.5,
    reviewCount: 215,
  },
  {
    id: "t005",
    slug: "fashion-french-terry-sweatshirt",
    name: "French Terry Sweatshirt",
    description:
      "Loopback French terry sweatshirt with a relaxed boxy fit. Ribbed cuffs and hem, no drawstring. The perfect off-duty layer.",
    price: 2999,
    category: "tops",
    images: makeImages("French Terry Sweatshirt", COLORS[4]),
    sizes: SIZES,
    colors: COLORS[4],
    fit: "Oversized",
    fabric: FABRICS[5],
    tags: ["sweatshirt", "loungewear", "new"],
    inStock: true,
    isNew: true,
    isSale: false,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 67,
  },
  {
    id: "t006",
    slug: "fashion-bamboo-longline-tee",
    name: "Bamboo Longline Tee",
    description:
      "An extended-length silhouette in ultra-soft bamboo cotton blend. Naturally breathable, moisture-wicking, and incredibly lightweight.",
    price: 1599,
    originalPrice: 1999,
    category: "tops",
    images: makeImages("Bamboo Longline Tee", COLORS[5]),
    sizes: SIZES,
    colors: COLORS[5],
    fit: "Regular",
    fabric: FABRICS[4],
    tags: ["bamboo", "sustainable", "sale"],
    inStock: true,
    isNew: false,
    isSale: true,
    isBestSeller: false,
    rating: 4.4,
    reviewCount: 143,
  },
  {
    id: "t007",
    slug: "fashion-camp-collar-shirt",
    name: "Camp Collar Shirt",
    description:
      "A Cuban-inspired camp collar shirt in a lightweight woven fabric. Short-sleeve cut, straight hem, and relaxed through the body.",
    price: 2199,
    category: "tops",
    images: makeImages("Camp Collar Shirt", COLORS[6]),
    sizes: ["S", "M", "L", "XL"],
    colors: COLORS[6],
    fit: "Regular",
    fabric: FABRICS[1],
    tags: ["camp collar", "resort", "summer"],
    inStock: true,
    isNew: true,
    isSale: false,
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 54,
  },
  {
    id: "t008",
    slug: "fashion-henley-tee",
    name: "Henley Tee",
    description:
      "Three-button henley with a slim, flattering fit. Washed 100% cotton that gets better with every wash.",
    price: 1399,
    category: "tops",
    images: makeImages("Henley Tee", COLORS[7]),
    sizes: SIZES,
    colors: COLORS[7],
    fit: "Slim",
    fabric: FABRICS[0],
    tags: ["henley", "slim", "essentials"],
    inStock: true,
    isNew: false,
    isSale: false,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 278,
  },
  {
    id: "t009",
    slug: "fashion-zip-up-hoodie",
    name: "Zip-Up Hoodie",
    description:
      "Full-zip fleece hoodie with a kangaroo split pocket and lined hood. A wardrobe anchor for cooler months.",
    price: 3499,
    category: "tops",
    images: makeImages("Zip-Up Hoodie", COLORS[8]),
    sizes: SIZES,
    colors: COLORS[8],
    fit: "Regular",
    fabric: FABRICS[5],
    tags: ["hoodie", "outerwear", "new"],
    inStock: true,
    isNew: true,
    isSale: false,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 41,
  },
  {
    id: "t010",
    slug: "fashion-linen-tee",
    name: "Linen Tee",
    description:
      "A linen-cotton blend tee with a relaxed, slightly boxy fit. Natural texture, breathable and perfect for warm days.",
    price: 1499,
    originalPrice: 1799,
    category: "tops",
    images: makeImages("Linen Tee", COLORS[9]),
    sizes: SIZES,
    colors: COLORS[9],
    fit: "Regular",
    fabric: FABRICS[1],
    tags: ["linen", "summer", "sale"],
    inStock: false,
    isNew: false,
    isSale: true,
    isBestSeller: false,
    rating: 4.3,
    reviewCount: 112,
  },

  // ─── BOTTOMS (10) ────────────────────────────────────────────────────────
  {
    id: "b001",
    slug: "fashion-cargo-pants",
    name: "Cargo Pants",
    description:
      "Technical ripstop cargo pants with six utility pockets and a tapered, relaxed leg. Adjustable waist tab at back.",
    price: 3299,
    category: "bottoms",
    images: makeImages("Cargo Pants", COLORS[0]),
    sizes: SIZES,
    colors: COLORS[0],
    fit: "Regular",
    fabric: FABRICS[2],
    tags: ["cargo", "utility", "bestseller"],
    inStock: true,
    isNew: false,
    isSale: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 389,
  },
  {
    id: "b002",
    slug: "fashion-wide-leg-trousers",
    name: "Wide Leg Trousers",
    description:
      "Fluid wide-leg trousers in a premium viscose blend. High rise, full length, and an elastic-free waistband for a clean drape.",
    price: 2799,
    originalPrice: 3499,
    category: "bottoms",
    images: makeImages("Wide Leg Trousers", COLORS[1]),
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: COLORS[1],
    fit: "Oversized",
    fabric: FABRICS[1],
    tags: ["wide-leg", "trousers", "sale"],
    inStock: true,
    isNew: false,
    isSale: true,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 201,
  },
  {
    id: "b003",
    slug: "fashion-jogger-pants",
    name: "Jogger Pants",
    description:
      "Premium French terry joggers with a tapered leg, ribbed cuffs, and deep side pockets. The essential casual bottom.",
    price: 2499,
    category: "bottoms",
    images: makeImages("Jogger Pants", COLORS[2]),
    sizes: SIZES,
    colors: COLORS[2],
    fit: "Regular",
    fabric: FABRICS[5],
    tags: ["jogger", "loungewear", "new"],
    inStock: true,
    isNew: true,
    isSale: false,
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 88,
  },
  {
    id: "b004",
    slug: "fashion-slim-chino",
    name: "Slim Chino",
    description:
      "Classic slim-fit chino cut from a cotton-stretch twill. Five-pocket styling, clean finish, and subtle texture.",
    price: 2999,
    category: "bottoms",
    images: makeImages("Slim Chino", COLORS[3]),
    sizes: SIZES,
    colors: COLORS[3],
    fit: "Slim",
    fabric: FABRICS[2],
    tags: ["chino", "slim", "bestseller"],
    inStock: true,
    isNew: false,
    isSale: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 312,
  },
  {
    id: "b005",
    slug: "fashion-linen-shorts",
    name: "Linen Shorts",
    description:
      "Mid-length linen shorts with a drawstring waist and two side pockets. Breathable and easy, perfect for warm weather.",
    price: 1799,
    originalPrice: 2199,
    category: "bottoms",
    images: makeImages("Linen Shorts", COLORS[4]),
    sizes: SIZES,
    colors: COLORS[4],
    fit: "Regular",
    fabric: FABRICS[3],
    tags: ["linen", "shorts", "summer", "sale"],
    inStock: true,
    isNew: false,
    isSale: true,
    isBestSeller: false,
    rating: 4.5,
    reviewCount: 167,
  },
  {
    id: "b006",
    slug: "fashion-pleated-trousers",
    name: "Pleated Trousers",
    description:
      "Double-pleated formal trousers in a structured wool-blend fabric. A statement piece with heritage tailoring details.",
    price: 3799,
    category: "bottoms",
    images: makeImages("Pleated Trousers", COLORS[5]),
    sizes: ["S", "M", "L", "XL"],
    colors: COLORS[5],
    fit: "Regular",
    fabric: FABRICS[2],
    tags: ["formal", "pleated", "new"],
    inStock: true,
    isNew: true,
    isSale: false,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 45,
  },
  {
    id: "b007",
    slug: "fashion-track-pants",
    name: "Track Pants",
    description:
      "Athletic-inspired track pants with side tape detailing and a straight leg. Lightweight, moisture-wicking fabric.",
    price: 2299,
    category: "bottoms",
    images: makeImages("Track Pants", COLORS[6]),
    sizes: SIZES,
    colors: COLORS[6],
    fit: "Regular",
    fabric: FABRICS[2],
    tags: ["track", "athletic", "streetwear"],
    inStock: true,
    isNew: false,
    isSale: false,
    isBestSeller: false,
    rating: 4.4,
    reviewCount: 93,
  },
  {
    id: "b008",
    slug: "fashion-relaxed-denim",
    name: "Relaxed Denim",
    description:
      "Non-stretch 12oz Japanese selvedge denim in a relaxed straight leg. Raw hem, polished silver hardware.",
    price: 4999,
    category: "bottoms",
    images: makeImages("Relaxed Denim", COLORS[7]),
    sizes: SIZES,
    colors: COLORS[7],
    fit: "Regular",
    fabric: FABRICS[0],
    tags: ["denim", "selvedge", "premium"],
    inStock: true,
    isNew: true,
    isSale: false,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 28,
  },
  {
    id: "b009",
    slug: "fashion-sweat-shorts",
    name: "Sweat Shorts",
    description:
      "Mid-length sweat shorts in a premium fleece terry with elasticated waistband and raw hem. Relaxed, lived-in look.",
    price: 1599,
    originalPrice: 1999,
    category: "bottoms",
    images: makeImages("Sweat Shorts", COLORS[8]),
    sizes: SIZES,
    colors: COLORS[8],
    fit: "Oversized",
    fabric: FABRICS[5],
    tags: ["shorts", "sweat", "loungewear", "sale"],
    inStock: true,
    isNew: false,
    isSale: true,
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 134,
  },
  {
    id: "b010",
    slug: "fashion-barrel-leg-denim",
    name: "Barrel Leg Denim",
    description:
      "On-trend barrel-leg silhouette in a soft stretch denim. High rise, full length with frayed hem detail.",
    price: 3599,
    category: "bottoms",
    images: makeImages("Barrel Leg Denim", COLORS[9]),
    sizes: ["XS", "S", "M", "L"],
    colors: COLORS[9],
    fit: "Oversized",
    fabric: FABRICS[0],
    tags: ["denim", "barrel-leg", "new", "bestseller"],
    inStock: true,
    isNew: true,
    isSale: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 72,
  },
];

export const getFeaturedProducts = () =>
  products.filter((p) => p.isBestSeller || p.isNew).slice(0, 8);

export const getProductsByCategory = (category: Category) =>
  products.filter((p) => p.category === category);

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);
