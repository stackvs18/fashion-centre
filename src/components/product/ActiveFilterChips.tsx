"use client";

import { X } from "lucide-react";
import { useFilterStore } from "@/store/filterStore";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function ActiveFilterChips() {
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
    activeFilterCount,
  } = useFilterStore();

  const count = activeFilterCount();
  if (count === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {sizes.map((size) => (
        <Chip key={`size-${size}`} label={size} onRemove={() => toggleSize(size)} />
      ))}
      {colors.map((color) => (
        <Chip key={`color-${color}`} label={color} onRemove={() => toggleColor(color)} />
      ))}
      {fits.map((fit) => (
        <Chip key={`fit-${fit}`} label={fit} onRemove={() => toggleFit(fit)} />
      ))}
      {(priceRange[0] !== 0 || priceRange[1] !== 10000) && (
        <Chip
          label={`${formatPrice(priceRange[0])} – ${formatPrice(priceRange[1])}`}
          onRemove={() => setPriceRange([0, 10000])}
        />
      )}
      {inStockOnly && (
        <Chip label="In Stock" onRemove={() => setInStockOnly(false)} />
      )}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 bg-charcoal text-beige-50 text-[10px] uppercase tracking-widest font-medium hover:bg-sienna transition-colors group"
      )}
    >
      {label}
      <X className="w-2.5 h-2.5" />
    </button>
  );
}
