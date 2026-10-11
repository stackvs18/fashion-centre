"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { FilterPanel } from "@/components/product/FilterPanel";
import { SortDropdown } from "@/components/product/SortDropdown";
import { ActiveFilterChips } from "@/components/product/ActiveFilterChips";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useFilterStore } from "@/store/filterStore";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { getProductsByCategory } from "@/data/products";
import type { Category, Product } from "@/types";

const PAGE_SIZE = 12;

interface CatalogLayoutProps {
  category: Category;
  title: string;
  subtitle: string;
}

function applyFilters(products: Product[], filters: ReturnType<typeof useFilterStore.getState>): Product[] {
  let result = [...products];

  if (filters.sizes.length)
    result = result.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
  if (filters.colors.length)
    result = result.filter((p) => p.colors.some((c) => filters.colors.includes(c.name)));
  if (filters.fits.length)
    result = result.filter((p) => filters.fits.includes(p.fit));
  if (filters.inStockOnly)
    result = result.filter((p) => p.inStock);

  result = result.filter(
    (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
  );

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "best-sellers":
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
      break;
    case "most-reviewed":
      result.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "newest":
    default:
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
  }

  return result;
}

export function CatalogLayout({ category, title, subtitle }: CatalogLayoutProps) {
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const filters = useFilterStore();
  const allProducts = useMemo(() => getProductsByCategory(category), [category]);
  const filtered = useMemo(() => applyFilters(allProducts, filters), [allProducts, filters]);
  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters.sizes, filters.colors, filters.fits, filters.inStockOnly, filters.priceRange, filters.sort]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);
          setTimeout(() => {
            setPage((p) => p + 1);
            setLoading(false);
          }, 600);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 md:mb-12 pb-8 border-b border-beige-200"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-charcoal-500 mb-2 font-sans">
          {subtitle}
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-charcoal">
          {title}
        </h1>
        <p className="mt-3 text-charcoal-500 text-sm">
          {filtered.length} styles available
        </p>
      </motion.div>

      <div className="flex gap-8 md:gap-12">
        {/* Filter sidebar — desktop only */}
        {!isMobile && (
          <div className="hidden md:block sticky top-24 self-start">
            <FilterPanel />
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 gap-4">
            {/* Mobile filter trigger */}
            <button
              id="mobile-filter-btn"
              onClick={() => setFilterSheetOpen(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-beige-300 text-xs uppercase tracking-widest hover:border-charcoal transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {filters.activeFilterCount() > 0 && (
                <span className="w-4 h-4 rounded-full bg-sienna text-white text-[9px] flex items-center justify-center">
                  {filters.activeFilterCount()}
                </span>
              )}
            </button>

            <div className="ml-auto">
              <SortDropdown />
            </div>
          </div>

          {/* Active filter chips */}
          <div className="mb-4">
            <ActiveFilterChips />
          </div>

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-2xl font-display text-charcoal mb-3">No results found</p>
              <p className="text-sm text-charcoal-500">
                Try adjusting your filters.
              </p>
              <button
                onClick={filters.clearFilters}
                className="mt-6 text-xs uppercase tracking-widest underline text-sienna"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {visible.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                  >
                    <ProductCard
                      product={product}
                      priority={i < 4}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Infinite scroll sentinel */}
              <div ref={sentinelRef} className="mt-8">
                {loading && <ProductGridSkeleton count={4} />}
              </div>

              {!hasMore && filtered.length > 0 && (
                <p className="text-center text-xs uppercase tracking-widest text-charcoal-500 py-12">
                  You&apos;ve seen everything — {filtered.length} styles
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter bottom sheet */}
      <BottomSheet
        isOpen={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        title="Filter"
      >
        <FilterPanel />
        <button
          onClick={() => setFilterSheetOpen(false)}
          className="w-full mt-6 py-3 bg-charcoal text-beige-50 text-xs uppercase tracking-widest font-medium hover:bg-sienna transition-colors"
        >
          Show {filtered.length} Results
        </button>
      </BottomSheet>
    </div>
  );
}
