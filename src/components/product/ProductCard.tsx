"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import { ProductCarousel } from "./ProductCarousel";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  featured?: boolean;
}

export function ProductCard({ product, priority, featured }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const size = product.sizes[0];
    const color = product.colors[0];
    if (!size || !color) return;
    addItem(product, size, color, 1);
    toast.success(`${product.name} added to bag!`, {
      icon: "🛍️",
      style: {
        background: "#1A1A1A",
        color: "#FAF7F2",
        borderRadius: "0",
        fontSize: "13px",
        letterSpacing: "0.05em",
      },
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setWishlisted((w) => !w);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist", {
      icon: wishlisted ? "🤍" : "❤️",
    });
  };

  return (
    <article className="group flex flex-col gap-3">
      <Link href={`/product/${product.slug}`} className="block relative">
        {/* Image carousel */}
        <ProductCarousel
          images={product.images}
          alt={product.name}
          priority={priority}
          featured={featured}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.isNew && <Badge variant="new">New</Badge>}
          {product.isSale && <Badge variant="sale">Sale</Badge>}
          {product.isBestSeller && !product.isNew && (
            <Badge variant="bestseller">Bestseller</Badge>
          )}
          {!product.inStock && (
            <Badge variant="lowstock">Out of Stock</Badge>
          )}
        </div>

        {/* Wishlist button */}
        <button
          id={`wishlist-${product.id}`}
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-beige-50/90 backdrop-blur-sm flex items-center justify-center hover:bg-beige-50 transition-colors"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "w-3.5 h-3.5 transition-colors",
              wishlisted ? "fill-sienna text-sienna" : "text-charcoal"
            )}
          />
        </button>

        {/* Quick Add overlay (desktop) */}
        {product.inStock && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="hidden md:flex absolute bottom-0 left-0 right-0 z-10"
          >
            <button
              id={`quick-add-${product.id}`}
              onClick={handleQuickAdd}
              className="w-full py-3 bg-charcoal text-beige-50 text-xs uppercase tracking-widest font-medium hover:bg-sienna transition-colors duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100"
            >
              <Plus className="w-3.5 h-3.5" />
              Quick Add
            </button>
          </motion.div>
        )}
      </Link>

      {/* Product info */}
      <div className="flex flex-col gap-1.5">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-sans text-sm font-medium text-charcoal leading-tight hover:text-sienna transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Color swatches */}
        <div className="flex gap-1.5">
          {product.colors.slice(0, 4).map((color) => (
            <div
              key={color.name}
              title={color.name}
              className="w-3.5 h-3.5 rounded-full border border-beige-300 cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: color.hex }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] text-charcoal-500">
              +{product.colors.length - 4}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-charcoal">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-charcoal-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Mobile Quick Add button */}
        {product.inStock && (
          <button
            id={`mobile-quick-add-${product.id}`}
            onClick={handleQuickAdd}
            className="md:hidden mt-1 w-full py-2.5 border border-beige-300 text-xs uppercase tracking-widest text-charcoal hover:bg-charcoal hover:text-white hover:border-charcoal transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-3 h-3" />
            Add to Bag
          </button>
        )}
      </div>
    </article>
  );
}
