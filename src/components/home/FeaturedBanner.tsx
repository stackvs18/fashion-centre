"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const BANNERS = [
  {
    id: "b1",
    label: "New Arrivals",
    title: "The Linen Edit",
    sub: "Effortless summer staples crafted from 100% European linen.",
    cta: "Shop Now",
    href: "/tops",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=85",
    align: "left" as const,
    dark: false,
  },
  {
    id: "b2",
    label: "Bestsellers",
    title: "Iconic Bottoms",
    sub: "The cargo pants everyone is talking about. Shop before they sell out.",
    cta: "Shop Bottoms",
    href: "/bottoms",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1200&q=85",
    align: "right" as const,
    dark: true,
  },
];

export function FeaturedBanner() {
  return (
    <section className="py-8 md:py-12 space-y-4 md:space-y-6">
      {BANNERS.map((banner, i) => (
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: i * 0.1 }}
          className="relative h-[60vw] max-h-[480px] min-h-[300px] overflow-hidden"
        >
          {/* Background */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={banner.image}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-700"
          />
          <div
            className={`absolute inset-0 ${
              banner.dark
                ? "bg-gradient-to-r from-charcoal/80 to-charcoal/20"
                : "bg-gradient-to-l from-charcoal/70 to-charcoal/10"
            }`}
          />

          {/* Content */}
          <div
            className={`relative z-10 h-full flex flex-col justify-center px-8 md:px-16 ${
              banner.align === "right" ? "items-start" : "items-end text-right"
            } md:${banner.align === "right" ? "items-start" : "items-end"}`}
          >
            <div className={`max-w-xs md:max-w-sm ${banner.align === "left" ? "ml-auto" : ""}`}>
              <span className="inline-block text-[10px] uppercase tracking-[0.4em] text-beige-300 mb-3 font-sans">
                {banner.label}
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-beige-50 leading-tight mb-4">
                {banner.title}
              </h2>
              <p className="text-beige-200 text-sm leading-relaxed mb-6">
                {banner.sub}
              </p>
              <Link
                href={banner.href}
                className="inline-block px-6 py-3 text-xs uppercase tracking-widest font-medium bg-beige-50 text-charcoal hover:bg-sienna hover:text-white transition-all duration-300"
              >
                {banner.cta}
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
