"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useFilterStore } from "@/store/filterStore";
import type { SortOption } from "@/types";
import { cn } from "@/lib/utils";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Best Sellers", value: "best-sellers" },
  { label: "Most Reviewed", value: "most-reviewed" },
];

export function SortDropdown() {
  const [open, setOpen] = useState(false);
  const { sort, setSort } = useFilterStore();
  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sort By";

  return (
    <div className="relative">
      <button
        id="sort-dropdown-btn"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2.5 border border-beige-300 hover:border-charcoal text-xs uppercase tracking-widest text-charcoal transition-colors min-w-[180px] justify-between"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{currentLabel}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <motion.ul
              role="listbox"
              initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-1 z-20 bg-beige-50 border border-beige-200 shadow-lg min-w-[200px] origin-top"
            >
              {SORT_OPTIONS.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={sort === option.value}
                  onClick={() => {
                    setSort(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 text-xs uppercase tracking-widest cursor-pointer transition-colors",
                    sort === option.value
                      ? "bg-beige-200 text-sienna"
                      : "text-charcoal hover:bg-beige-100"
                  )}
                >
                  {option.label}
                  {sort === option.value && (
                    <Check className="w-3.5 h-3.5 text-sienna" />
                  )}
                </li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
