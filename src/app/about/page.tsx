import type { Metadata } from "next";
import { motion } from "framer-motion";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "FASHION — our story, values, and vision for a new kind of premium everyday clothing brand.",
};

const VALUES = [
  {
    icon: "◆",
    title: "Intentional Design",
    body: "Every silhouette is considered, every detail deliberate. We don't follow trends — we design pieces that belong in your wardrobe for years.",
  },
  {
    icon: "◇",
    title: "Honest Pricing",
    body: "Premium quality shouldn't cost a fortune. We cut out middlemen and unnecessary markup to deliver exceptional value directly to you.",
  },
  {
    icon: "○",
    title: "Sustainable Approach",
    body: "We work with ethical factories, use natural fibers wherever possible, and actively reduce waste in our supply chain — because we owe it to the planet.",
  },
  {
    icon: "△",
    title: "Community First",
    body: "FASHION was built with and for a community of people who care about how they look, what they wear, and who made it.",
  },
];

const PRESS = ["Vogue India", "GQ", "Hypebeast", "Architectural Digest", "Elle"];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden bg-charcoal">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=85"
          alt="FASHION studio"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-beige-300 text-xs uppercase tracking-[0.4em] mb-4">Our Story</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-beige-50 leading-tight">
            Made with
            <br />
            <span className="text-sienna-light italic">Purpose.</span>
          </h1>
        </div>
      </section>

      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Story */}
        <section className="py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-charcoal-500 mb-4">The Brand</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal leading-tight mb-6">
              Why we started FASHION
            </h2>
            <div className="space-y-4 text-charcoal-500 text-sm leading-relaxed">
              <p>
                FASHION was born out of frustration. We were tired of choosing between clothes that
                looked great but fell apart, or sturdy basics that looked boring. We believed you
                shouldn&apos;t have to compromise.
              </p>
              <p>
                In 2024, a small team of designers, fabric obsessives, and community builders came
                together with one goal: build a clothing brand that values you as much as you value
                what you wear.
              </p>
              <p>
                Every FASHION piece is designed in India, tested rigorously, and made in factories
                where workers are paid fairly and treated well. That&apos;s not a marketing line —
                it&apos;s the only way we know how to operate.
              </p>
            </div>
          </div>
          <div className="relative aspect-square bg-beige-200 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85"
              alt="FASHION brand"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Founder */}
        <section className="py-20 border-t border-beige-200">
          <p className="text-xs uppercase tracking-[0.4em] text-charcoal-500 mb-8 text-center">Founder&apos;s Note</p>
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 bg-beige-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
                alt="Founder"
                className="w-full h-full object-cover"
              />
            </div>
            <blockquote className="font-display text-2xl md:text-3xl text-charcoal leading-relaxed italic mb-6">
              &ldquo;We set out to build the kind of brand we always wanted to buy from — transparent,
              quality-obsessed, and genuinely community-driven.&rdquo;
            </blockquote>
            <p className="text-sm text-charcoal-500">— Rohan Mehta, Founder & Creative Director</p>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 border-t border-beige-200">
          <p className="text-xs uppercase tracking-[0.4em] text-charcoal-500 mb-4 text-center">What We Stand For</p>
          <h2 className="font-display text-4xl font-bold text-charcoal text-center mb-14">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {VALUES.map((v) => (
              <div key={v.title} className="p-8 bg-beige-100">
                <div className="text-2xl text-sienna mb-4">{v.icon}</div>
                <h3 className="font-display text-xl font-bold text-charcoal mb-3">{v.title}</h3>
                <p className="text-sm text-charcoal-500 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Press */}
        <section className="py-20 border-t border-beige-200 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-charcoal-500 mb-10">As Featured In</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {PRESS.map((name) => (
              <span key={name} className="font-display text-xl font-bold text-charcoal-500/40 hover:text-charcoal transition-colors cursor-default">
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* Sustainability */}
        <section className="py-20 border-t border-beige-200 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] bg-beige-200 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=85"
              alt="Sustainability"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-charcoal-500 mb-4">Sustainability</p>
            <h2 className="font-display text-4xl font-bold text-charcoal leading-tight mb-6">
              Our pledge to the planet
            </h2>
            <div className="space-y-4 text-sm text-charcoal-500 leading-relaxed">
              <p>We use natural fibers — cotton, linen, bamboo — as our primary materials. These are biodegradable, gentler on the environment, and better for your skin.</p>
              <p>Our packaging is 100% recyclable and plastic-free. We&apos;re on track to achieve carbon-neutral shipping by 2026.</p>
              <p>For every 100 units sold, we plant a tree. It&apos;s a small gesture, but one we&apos;re committed to scaling.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
