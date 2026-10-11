"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { getFeaturedProducts } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";

export function FeaturedCatalogGrid() {
  const featured = getFeaturedProducts();
  const [hero, ...rest] = featured;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between mb-8 md:mb-12"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-charcoal-500 mb-2 font-sans">
            Handpicked for You
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal">
            Featured Pieces
          </h2>
        </div>
        <div className="hidden md:flex gap-4">
          <Link
            href="/tops"
            className="text-xs uppercase tracking-widest text-charcoal-500 hover:text-sienna transition-colors border-b border-transparent hover:border-sienna pb-0.5"
          >
            View Tops →
          </Link>
          <Link
            href="/bottoms"
            className="text-xs uppercase tracking-widest text-charcoal-500 hover:text-sienna transition-colors border-b border-transparent hover:border-sienna pb-0.5"
          >
            View Bottoms →
          </Link>
        </div>
      </motion.div>

      {/* Asymmetric grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Hero card — spans 2 rows on desktop */}
        {hero && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-2 row-span-2"
          >
            <ProductCard product={hero} priority featured />
          </motion.div>
        )}

        {/* Regular cards */}
        {rest.slice(0, 6).map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
          >
            <ProductCard product={product} priority={i < 2} />
          </motion.div>
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="flex gap-4 mt-8 md:hidden">
        <Link
          href="/tops"
          className="flex-1 text-center text-xs uppercase tracking-widest text-charcoal-500 hover:text-sienna transition-colors border border-beige-300 py-3"
        >
          All Tops
        </Link>
        <Link
          href="/bottoms"
          className="flex-1 text-center text-xs uppercase tracking-widest text-charcoal-500 hover:text-sienna transition-colors border border-beige-300 py-3"
        >
          All Bottoms
        </Link>
      </div>
    </section>
  );
}
