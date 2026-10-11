"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  images: string[];
  alt: string;
  priority?: boolean;
  featured?: boolean;
}

export function ProductCarousel({
  images,
  alt,
  priority = false,
  featured = false,
}: ProductCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [dragStart, setDragStart] = useState(0);

  const paginate = useCallback(
    (dir: number) => {
      setDirection(dir);
      setCurrent((c) => (c + dir + images.length) % images.length);
    },
    [images.length]
  );

  const handleDragStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientX);
  };

  const handleDragEnd = (e: React.TouchEvent) => {
    const diff = dragStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) paginate(diff > 0 ? 1 : -1);
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-beige-100 group",
        featured ? "aspect-[3/4] md:aspect-[2/3]" : "aspect-[3/4]"
      )}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
    >
      <AnimatePresence custom={direction} initial={false} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[current]}
            alt={`${alt} — view ${current + 1}`}
            className="absolute inset-0 w-full h-full object-cover object-top"
            loading={priority && current === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        </motion.div>
      </AnimatePresence>

      {/* Arrow buttons (desktop hover) */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); paginate(-1); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-beige-50/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-beige-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4 text-charcoal" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); paginate(1); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-beige-50/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-beige-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4 text-charcoal" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={cn(
                "rounded-full transition-all duration-300",
                i === current
                  ? "w-4 h-1.5 bg-beige-50"
                  : "w-1.5 h-1.5 bg-beige-50/50"
              )}
              aria-label={`View image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
