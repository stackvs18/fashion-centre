"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, ShoppingBag, Heart, Share2, ChevronDown,
  Truck, RefreshCcw, Shield, Ruler,
} from "lucide-react";
import { ProductGallery } from "./ProductGallery";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, cn } from "@/lib/utils";
import type { Product, Size, ColorOption } from "@/types";
import toast from "react-hot-toast";

const SIZE_GUIDE: Record<string, { chest: string; waist: string; hip: string }> = {
  XS: { chest: "84–88", waist: "68–72", hip: "88–92" },
  S:  { chest: "88–92", waist: "72–76", hip: "92–96" },
  M:  { chest: "92–97", waist: "76–81", hip: "96–101" },
  L:  { chest: "97–102", waist: "81–86", hip: "101–106" },
  XL: { chest: "102–108", waist: "86–92", hip: "106–112" },
  XXL:{ chest: "108–116", waist: "92–100", hip: "112–120" },
};

const CARE_ICONS: { label: string; icon: string }[] = [
  { label: "Machine wash 30°C", icon: "⟳" },
  { label: "Do not tumble dry", icon: "✕" },
  { label: "Do not bleach", icon: "△" },
  { label: "Cool iron only", icon: "≈" },
  { label: "Dry clean permitted", icon: "○" },
];

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <button className="flex items-center gap-2 group">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={cn(
              "w-4 h-4",
              s <= Math.floor(rating)
                ? "fill-amber-400 text-amber-400"
                : s - 0.5 <= rating
                ? "fill-amber-400/50 text-amber-400"
                : "text-beige-300"
            )}
          />
        ))}
      </div>
      <span className="text-xs uppercase tracking-widest text-charcoal-500 group-hover:text-sienna transition-colors">
        {rating} ({count} reviews)
      </span>
    </button>
  );
}

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-beige-200">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-xs uppercase tracking-widest font-medium text-charcoal hover:text-sienna transition-colors"
      >
        {title}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm text-charcoal-500 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ProductInfoPanelProps {
  product: Product;
}

export function ProductInfoPanel({ product }: ProductInfoPanelProps) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const toggleCart = useCartStore((s) => s.toggleCart);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 600);
      toast.error("Please select a size");
      return;
    }
    addItem(product, selectedSize, selectedColor, quantity);
    toast.success(`${product.name} added to bag!`, {
      icon: "🛍️",
      style: {
        background: "#1A1A1A",
        color: "#FAF7F2",
        borderRadius: "0",
        fontSize: "13px",
      },
    });
    toggleCart();
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard", { icon: "🔗" });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-charcoal-500">
        <Link href="/" className="hover:text-sienna transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${product.category}`} className="hover:text-sienna transition-colors capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {product.isNew && <Badge variant="new">New Arrival</Badge>}
        {product.isSale && <Badge variant="sale">Sale</Badge>}
        {product.isBestSeller && <Badge variant="bestseller">Bestseller</Badge>}
        {!product.inStock && <Badge variant="lowstock">Out of Stock</Badge>}
      </div>

      {/* Name */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal leading-tight">
          {product.name}
        </h1>
        <p className="text-xs uppercase tracking-widest text-charcoal-500 mt-2 capitalize">
          {product.fit} Fit · {product.fabric}
        </p>
      </div>

      {/* Rating */}
      <StarRating rating={product.rating} count={product.reviewCount} />

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl font-bold text-charcoal">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-lg text-charcoal-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-sm font-medium text-green-600">
              {discount}% off
            </span>
          </>
        )}
      </div>

      <hr className="border-beige-200" />

      {/* Color selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-widest font-medium text-charcoal">
            Colour: <span className="font-bold">{selectedColor.name}</span>
          </span>
        </div>
        <div className="flex gap-3 flex-wrap">
          {product.colors.map((color) => (
            <button
              key={color.name}
              title={color.name}
              onClick={() => setSelectedColor(color)}
              className={cn(
                "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                selectedColor.name === color.name
                  ? "border-charcoal scale-110 shadow-md"
                  : "border-transparent shadow-sm"
              )}
              style={{
                backgroundColor: color.hex,
                boxShadow:
                  selectedColor.name === color.name
                    ? `0 0 0 2px #FAF7F2, 0 0 0 4px #1A1A1A`
                    : `0 0 0 1px #D5CEC0`,
              }}
              aria-label={color.name}
              aria-pressed={selectedColor.name === color.name}
            />
          ))}
        </div>
      </div>

      {/* Size selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className={cn(
            "text-xs uppercase tracking-widest font-medium transition-colors",
            sizeError ? "text-red-500" : "text-charcoal"
          )}>
            {sizeError ? "Please select a size" : "Select Size"}
          </span>
          <button
            onClick={() => setSizeGuideOpen(true)}
            className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-charcoal-500 hover:text-sienna transition-colors"
          >
            <Ruler className="w-3 h-3" />
            Size Guide
          </button>
        </div>
        <div className={cn("flex flex-wrap gap-2 transition-all duration-300", sizeError && "animate-[shake_0.3s_ease-in-out]")}>
          {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
            const available = product.sizes.includes(size as Size);
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => available && setSelectedSize(size as Size)}
                disabled={!available}
                className={cn(
                  "min-w-[48px] h-11 px-3 text-xs font-medium border transition-all",
                  isSelected
                    ? "bg-charcoal text-white border-charcoal"
                    : available
                    ? "border-beige-300 text-charcoal hover:border-charcoal"
                    : "border-beige-200 text-beige-400 line-through cursor-not-allowed"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <span className="text-xs uppercase tracking-widest font-medium text-charcoal block mb-3">
          Quantity
        </span>
        <div className="flex items-center border border-beige-300 w-fit">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-beige-200 transition-colors text-lg font-light"
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-medium text-charcoal">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-beige-200 transition-colors text-lg font-light"
          >
            +
          </button>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-3">
        <Button
          id={`add-to-bag-${product.id}`}
          size="lg"
          fullWidth
          onClick={handleAddToCart}
          disabled={!product.inStock}
          leftIcon={<ShoppingBag className="w-4 h-4" />}
          className={cn(!product.inStock && "opacity-50 cursor-not-allowed")}
        >
          {product.inStock ? "Add to Bag" : "Out of Stock"}
        </Button>

        <button
          onClick={() => {
            setWishlisted((w) => !w);
            toast(wishlisted ? "Removed from wishlist" : "Added to wishlist", {
              icon: wishlisted ? "🤍" : "❤️",
            });
          }}
          className={cn(
            "w-12 h-12 border flex items-center justify-center transition-all flex-shrink-0",
            wishlisted
              ? "bg-sienna-50 border-sienna text-sienna"
              : "border-beige-300 text-charcoal hover:border-charcoal"
          )}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("w-5 h-5", wishlisted && "fill-sienna")} />
        </button>

        <button
          onClick={handleShare}
          className="w-12 h-12 border border-beige-300 flex items-center justify-center text-charcoal hover:border-charcoal transition-all flex-shrink-0"
          aria-label="Share product"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* USP strip */}
      <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-beige-200">
        {[
          { icon: Truck, label: "Free delivery", sub: "On orders above ₹999" },
          { icon: RefreshCcw, label: "Easy returns", sub: "15-day hassle-free" },
          { icon: Shield, label: "100% authentic", sub: "FASHION certified" },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 text-center">
            <Icon className="w-4 h-4 text-sienna" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-widest font-medium text-charcoal">
              {label}
            </span>
            <span className="text-[10px] text-charcoal-500 leading-tight">{sub}</span>
          </div>
        ))}
      </div>

      {/* Accordion details */}
      <div>
        <AccordionItem title="Product Description">
          <p>{product.description}</p>
          <ul className="mt-3 space-y-1">
            <li>· Fit: {product.fit}</li>
            <li>· Fabric: {product.fabric}</li>
            <li>· Category: {product.category}</li>
            <li>· Tags: {product.tags.join(", ")}</li>
          </ul>
        </AccordionItem>

        <AccordionItem title="Material & Care">
          <p className="mb-3 font-medium">{product.fabric}</p>
          <p className="mb-3">
            We use only ethically sourced materials. This piece is built to last — proper
            care ensures it keeps looking its best.
          </p>
          <div className="flex flex-col gap-1.5">
            {CARE_ICONS.map((c) => (
              <span key={c.label} className="flex items-center gap-2 text-xs">
                <span className="w-4 text-center font-mono text-charcoal">{c.icon}</span>
                {c.label}
              </span>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem title="Shipping & Returns">
          <div className="space-y-2">
            <p>· <strong>Standard Delivery:</strong> 5–7 business days (Free above ₹999)</p>
            <p>· <strong>Express Delivery:</strong> 2–3 business days (₹199)</p>
            <p>· <strong>Overnight:</strong> Next business day (₹399, order before 3 PM)</p>
            <p className="mt-3">
              Returns accepted within 15 days of delivery. Item must be unworn with tags
              attached. Exchange or refund to original payment method.
            </p>
          </div>
        </AccordionItem>
      </div>

      {/* Size Guide Modal */}
      <Modal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        title="Size Guide"
      >
        <p className="text-xs text-charcoal-500 mb-4">
          All measurements in centimeters. For the best fit, compare with your body measurements.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-beige-200">
                <th className="text-left py-2 pr-4 uppercase tracking-widest font-medium text-charcoal">Size</th>
                <th className="text-left py-2 pr-4 uppercase tracking-widest font-medium text-charcoal">Chest</th>
                <th className="text-left py-2 pr-4 uppercase tracking-widest font-medium text-charcoal">Waist</th>
                <th className="text-left py-2 uppercase tracking-widest font-medium text-charcoal">Hip</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(SIZE_GUIDE).map(([size, m]) => (
                <tr
                  key={size}
                  className={cn(
                    "border-b border-beige-200 transition-colors",
                    selectedSize === size && "bg-sienna-50"
                  )}
                >
                  <td className={cn("py-3 pr-4 font-medium", selectedSize === size ? "text-sienna" : "text-charcoal")}>
                    {size}
                  </td>
                  <td className="py-3 pr-4 text-charcoal-500">{m.chest}</td>
                  <td className="py-3 pr-4 text-charcoal-500">{m.waist}</td>
                  <td className="py-3 text-charcoal-500">{m.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-charcoal-500">
          If you're between sizes, we recommend sizing up for a more relaxed fit, or sizing down for a closer fit.
        </p>
      </Modal>
    </div>
  );
}
