"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUIStore } from "@/store/uiStore";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeSearch]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (!q.trim()) { setResults([]); return; }
    const lower = q.toLowerCase();
    setResults(
      products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(lower) ||
            p.category.toLowerCase().includes(lower) ||
            p.tags.some((t) => t.toLowerCase().includes(lower)) ||
            p.fabric.toLowerCase().includes(lower)
        )
        .slice(0, 8)
    );
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-beige-50/95 backdrop-blur-sm flex flex-col"
        >
          {/* Search bar */}
          <div className="flex items-center gap-4 px-6 py-5 border-b border-beige-200 max-w-screen-md mx-auto w-full">
            <Search className="w-5 h-5 text-charcoal-500 flex-shrink-0" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for tops, bottoms, styles..."
              className="flex-1 bg-transparent text-lg font-sans text-charcoal placeholder:text-charcoal-500/50 focus:outline-none"
            />
            <button
              onClick={closeSearch}
              className="p-2 hover:bg-beige-200 transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto px-6 py-6 max-w-screen-md mx-auto w-full">
            {query && results.length === 0 && (
              <p className="text-sm text-charcoal-500 text-center py-12">
                No results for &quot;{query}&quot;
              </p>
            )}

            {results.length > 0 && (
              <>
                <p className="text-xs uppercase tracking-widest text-charcoal-500 mb-4">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
                <div className="flex flex-col gap-2">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-4 p-3 hover:bg-beige-100 transition-colors group"
                    >
                      <div className="relative w-14 h-20 flex-shrink-0 bg-beige-200 overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div>
                        <p className="font-sans text-sm font-medium text-charcoal group-hover:text-sienna transition-colors">
                          {product.name}
                        </p>
                        <p className="text-xs text-charcoal-500 uppercase tracking-wide mt-0.5">
                          {product.category}
                        </p>
                        <p className="text-sm font-medium text-charcoal mt-1">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {!query && (
              <div>
                <p className="text-xs uppercase tracking-widest text-charcoal-500 mb-4">
                  Popular
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Cargo Pants", "Essential Tee", "Linen", "Oversized", "Sale"].map(
                    (term) => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="px-4 py-2 text-xs uppercase tracking-widest border border-beige-300 hover:border-charcoal hover:bg-charcoal hover:text-white transition-all"
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
