"use client";

const ITEMS = [
  "★ FREE SHIPPING ABOVE ₹999",
  "NEW DROP: SPRING COLLECTION",
  "FASHION",
  "SHOP NOW",
  "USE CODE FIRST10 FOR 10% OFF",
  "FASHION",
  "PREMIUM QUALITY EVERYDAY WEAR",
  "FASHION",
];

export function MarqueeStrip() {
  const content = [...ITEMS, ...ITEMS]; // duplicate for seamless loop

  return (
    <div
      className="h-8 bg-charcoal text-beige-100 overflow-hidden flex items-center select-none"
      aria-hidden="true"
    >
      <div className="flex animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
        {content.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center px-6 text-[11px] tracking-widest font-sans font-medium uppercase"
          >
            {item}
            <span className="ml-6 w-1 h-1 rounded-full bg-sienna inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}
