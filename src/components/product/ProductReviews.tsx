"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

// Deterministic review generation from product
function generateReviews(product: Product) {
  const NAMES = [
    "Aarav S.", "Priya M.", "Rohan K.", "Ananya B.", "Vikram R.",
    "Neha P.", "Arjun T.", "Kavita L.", "Rajiv D.", "Sunita G.",
    "Karan V.", "Meera C.", "Aditya N.", "Pooja H.", "Sanjay F.",
  ];
  const COMMENTS = [
    "Absolutely love this piece! The fabric quality is outstanding and it fits true to size.",
    "Great quality for the price. The material feels premium and the finish is clean.",
    "Fast delivery and exactly as described. Will definitely buy again from FASHION.",
    "The fit is perfect and the colour is exactly as shown. Very happy with this purchase.",
    "Excellent craftsmanship. I've washed it multiple times and it still looks brand new.",
    "Comfortable, stylish, and well-made. This is my go-to piece for casual outings.",
    "Worth every rupee. The fabric is breathable and the cut is flattering.",
    "Impressed by the quality. The stitching is clean and the material drapes beautifully.",
    "Perfect for layering. The oversized fit is just right, not too baggy.",
    "Loved the packaging too! Very sustainable. The product itself is amazing.",
  ];

  const count = Math.min(product.reviewCount, 8);
  const seed = product.id.charCodeAt(1) || 1;

  return Array.from({ length: count }, (_, i) => ({
    id: `${product.id}-r${i}`,
    name: NAMES[(seed + i * 3) % NAMES.length],
    rating: Math.min(5, Math.max(3, product.rating - (i % 3 === 0 ? 1 : 0) + (i % 5 === 0 ? 0.5 : 0))),
    date: new Date(2025, (seed + i * 2) % 12, ((seed + i * 7) % 28) + 1).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    body: COMMENTS[(seed + i * 4) % COMMENTS.length],
    size: product.sizes[(seed + i) % product.sizes.length],
    helpful: (seed * (i + 1) * 3) % 40,
    verified: i % 3 !== 1,
  }));
}

interface ProductReviewsProps {
  product: Product;
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const reviews = generateReviews(product);
  const visible = showAll ? reviews : reviews.slice(0, 4);

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.floor(r.rating) === star).length,
    pct: Math.round((reviews.filter((r) => Math.floor(r.rating) === star).length / reviews.length) * 100),
  }));

  return (
    <section className="pt-16 border-t border-beige-200">
      <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-10">
        Customer Reviews
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        {/* Summary */}
        <div className="flex flex-col items-center justify-center py-8 bg-beige-100">
          <span className="font-display text-6xl font-bold text-charcoal">
            {product.rating}
          </span>
          <div className="flex gap-1 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  "w-5 h-5",
                  s <= product.rating ? "fill-amber-400 text-amber-400" : "text-beige-300"
                )}
              />
            ))}
          </div>
          <p className="text-xs uppercase tracking-widest text-charcoal-500">
            Based on {product.reviewCount} reviews
          </p>
        </div>

        {/* Star breakdown */}
        <div className="md:col-span-2 flex flex-col justify-center gap-2">
          {ratingBreakdown.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-xs text-charcoal-500 w-4 text-right">{star}</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
              <div className="flex-1 h-2 bg-beige-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: (5 - star) * 0.1 }}
                  className="h-full bg-amber-400"
                />
              </div>
              <span className="text-xs text-charcoal-500 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-6">
        <AnimatePresence>
          {visible.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="pb-6 border-b border-beige-200 last:border-0"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "w-3.5 h-3.5",
                          s <= Math.floor(review.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-beige-200"
                        )}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-charcoal">{review.name}</span>
                    {review.verified && (
                      <span className="text-[10px] uppercase tracking-widest text-green-600 border border-green-200 px-1.5 py-0.5">
                        Verified
                      </span>
                    )}
                    <span className="text-[11px] text-charcoal-500">Size: {review.size}</span>
                  </div>
                </div>
                <span className="text-xs text-charcoal-500 flex-shrink-0">{review.date}</span>
              </div>
              <p className="text-sm text-charcoal-500 leading-relaxed mb-3">
                {review.body}
              </p>
              <button className="flex items-center gap-1.5 text-xs text-charcoal-500 hover:text-sienna transition-colors">
                <ThumbsUp className="w-3 h-3" />
                Helpful ({review.helpful})
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {reviews.length > 4 && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="mt-8 flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal hover:text-sienna transition-colors"
        >
          {showAll ? "Show Less" : `Show All ${reviews.length} Reviews`}
          <motion.div animate={{ rotate: showAll ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-3.5 h-3.5" />
          </motion.div>
        </button>
      )}
    </section>
  );
}
