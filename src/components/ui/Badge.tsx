"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "new" | "sale" | "bestseller" | "lowstock" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  new:        "bg-charcoal text-white",
  sale:       "bg-sienna text-white",
  bestseller: "bg-beige-300 text-charcoal",
  lowstock:   "bg-amber-100 text-amber-800 border border-amber-300",
  default:    "bg-beige-200 text-charcoal-700",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
