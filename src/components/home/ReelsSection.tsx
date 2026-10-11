"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const REELS_DATA = [
  {
    id: "reel1",
    embedUrl: "https://www.youtube.com/embed/HbxonOtJq3I?autoplay=0&mute=1",
    title: "Spring Collection Drop",
  },
  {
    id: "reel2",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1",
    title: "Styling Cargo Pants",
  },
  {
    id: "reel3",
    embedUrl: "https://www.youtube.com/embed/O4irXQhgMqg?autoplay=0&mute=1",
    title: "Behind the Seams",
  },
  {
    id: "reel4",
    embedUrl: "https://www.youtube.com/embed/b7K20PxEMGo?autoplay=0&mute=1",
    title: "Linen Summer Edit",
  },
];

export function ReelsSection() {
  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-charcoal-500 mb-2 font-sans">
              As Seen On
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal">
              Fashion Reels
            </h2>
          </div>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block text-xs uppercase tracking-widest text-charcoal-500 hover:text-sienna transition-colors border-b border-transparent hover:border-sienna pb-0.5"
          >
            Follow Us →
          </a>
        </motion.div>
      </div>

      {/* Horizontal scroll container */}
      <div className="px-4 sm:px-6 lg:px-8 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide scroll-smooth">
        {REELS_DATA.map((reel, i) => (
          <motion.div
            key={reel.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="snap-start flex-shrink-0 w-[70vw] sm:w-[300px] md:w-[260px] lg:w-[280px] aspect-[9/16] bg-charcoal overflow-hidden group relative"
          >
            {/* Skeleton overlay while loading */}
            <div className="absolute inset-0 bg-charcoal-800 animate-pulse" />

            <iframe
              src={reel.embedUrl}
              title={reel.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full z-10"
            />

            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-charcoal/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-beige-50 text-xs font-sans uppercase tracking-widest">
                {reel.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
