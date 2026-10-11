"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useFilterStore } from "@/store/filterStore";
import type { Size, Fit } from "@/types";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
const FITS: Fit[] = ["Slim", "Regular", "Oversized"];
const COLORS = [
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Charcoal", hex: "#1A1A1A" },
  { name: "Rust", hex: "#C4622D" },
  { name: "Sage", hex: "#8CAE8C" },
  { name: "Stone", hex: "#928E85" },
  { name: "White", hex: "#FAFAFA" },
  { name: "Oat", hex: "#D4BBAA" },
  { name: "Navy", hex: "#1B2A4A" },
  { name: "Olive", hex: "#6B6E3E" },
  { name: "Forest", hex: "#2C3E2D" },
];

const MIN_PRICE = 0;
const MAX_PRICE = 6000;

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-beige-200 pb-4 mb-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-2 text-xs uppercase tracking-widest font-medium text-charcoal hover:text-sienna transition-colors"
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
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterPanel() {
  const {
    sizes,
    toggleSize,
    colors,
    toggleColor,
    priceRange,
    setPriceRange,
    fits,
    toggleFit,
    inStockOnly,
    setInStockOnly,
    clearFilters,
    activeFilterCount,
  } = useFilterStore();

  const count = activeFilterCount();

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs uppercase tracking-widest font-medium text-charcoal">
          Filters{count > 0 && ` (${count})`}
        </h2>
        {count > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs uppercase tracking-wide text-sienna hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Size */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                "w-10 h-10 text-xs font-medium border transition-all",
                sizes.includes(size)
                  ? "bg-charcoal text-white border-charcoal"
                  : "border-beige-300 text-charcoal hover:border-charcoal"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-3">
          {COLORS.map((color) => (
            <button
              key={color.name}
              title={color.name}
              onClick={() => toggleColor(color.name)}
              className={cn(
                "w-7 h-7 rounded-full border-2 transition-all hover:scale-110",
                colors.includes(color.name)
                  ? "border-charcoal scale-110"
                  : "border-transparent"
              )}
              style={{ backgroundColor: color.hex, boxShadow: "0 0 0 1px #D5CEC0" }}
              aria-label={color.name}
              aria-pressed={colors.includes(color.name)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-charcoal-500">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={100}
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([
                  Math.min(+e.target.value, priceRange[1] - 100),
                  priceRange[1],
                ])
              }
              className="w-full accent-sienna"
            />
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={100}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([
                  priceRange[0],
                  Math.max(+e.target.value, priceRange[0] + 100),
                ])
              }
              className="w-full accent-sienna"
            />
          </div>
        </div>
      </FilterSection>

      {/* Fit */}
      <FilterSection title="Fit">
        <div className="flex flex-col gap-2">
          {FITS.map((fit) => (
            <label
              key={fit}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                onClick={() => toggleFit(fit)}
                className={cn(
                  "w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer",
                  fits.includes(fit)
                    ? "bg-charcoal border-charcoal"
                    : "border-beige-300 group-hover:border-charcoal"
                )}
              >
                {fits.includes(fit) && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span
                className="text-xs uppercase tracking-widest text-charcoal"
                onClick={() => toggleFit(fit)}
              >
                {fit}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* In Stock */}
      <FilterSection title="Availability" defaultOpen={false}>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setInStockOnly(!inStockOnly)}
            className={cn(
              "w-10 h-5 rounded-full transition-colors relative",
              inStockOnly ? "bg-sienna" : "bg-beige-300"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                inStockOnly ? "left-5" : "left-0.5"
              )}
            />
          </div>
          <span className="text-xs uppercase tracking-widest text-charcoal">
            In Stock Only
          </span>
        </label>
      </FilterSection>
    </aside>
  );
}
