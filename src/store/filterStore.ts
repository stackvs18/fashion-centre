"use client";

import { create } from "zustand";
import type { FilterState, Size, Fit, SortOption } from "@/types";

interface FilterStore extends FilterState {
  setSize: (sizes: Size[]) => void;
  toggleSize: (size: Size) => void;
  setColors: (colors: string[]) => void;
  toggleColor: (color: string) => void;
  setPriceRange: (range: [number, number]) => void;
  toggleFit: (fit: Fit) => void;
  setInStockOnly: (value: boolean) => void;
  setSort: (sort: SortOption) => void;
  clearFilters: () => void;
  activeFilterCount: () => number;
}

const DEFAULT_PRICE_RANGE: [number, number] = [0, 10000];

const defaults: FilterState = {
  sizes: [],
  colors: [],
  priceRange: DEFAULT_PRICE_RANGE,
  fits: [],
  inStockOnly: false,
  sort: "newest",
};

export const useFilterStore = create<FilterStore>()((set, get) => ({
  ...defaults,

  setSize: (sizes) => set({ sizes }),
  toggleSize: (size) =>
    set((s) => ({
      sizes: s.sizes.includes(size)
        ? s.sizes.filter((x) => x !== size)
        : [...s.sizes, size],
    })),

  setColors: (colors) => set({ colors }),
  toggleColor: (color) =>
    set((s) => ({
      colors: s.colors.includes(color)
        ? s.colors.filter((x) => x !== color)
        : [...s.colors, color],
    })),

  setPriceRange: (priceRange) => set({ priceRange }),

  toggleFit: (fit) =>
    set((s) => ({
      fits: s.fits.includes(fit)
        ? s.fits.filter((x) => x !== fit)
        : [...s.fits, fit],
    })),

  setInStockOnly: (inStockOnly) => set({ inStockOnly }),
  setSort: (sort) => set({ sort }),

  clearFilters: () => set(defaults),

  activeFilterCount: () => {
    const s = get();
    let count = 0;
    if (s.sizes.length) count++;
    if (s.colors.length) count++;
    if (s.fits.length) count++;
    if (s.inStockOnly) count++;
    if (
      s.priceRange[0] !== DEFAULT_PRICE_RANGE[0] ||
      s.priceRange[1] !== DEFAULT_PRICE_RANGE[1]
    )
      count++;
    return count;
  },
}));
