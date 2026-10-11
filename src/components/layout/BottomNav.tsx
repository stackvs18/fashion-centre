"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

const BOTTOM_NAV = [
  { icon: Home, label: "Home", href: "/" },
  { icon: LayoutGrid, label: "Shop", href: "/tops" },
  { icon: Search, label: "Search", href: null, action: "search" },
  { icon: ShoppingBag, label: "Cart", href: null, action: "cart" },
  { icon: User, label: "Account", href: "/account" },
];

export function BottomNav() {
  const pathname = usePathname();
  const toggleCart = useCartStore((s) => s.toggleCart);
  const itemCount = useCartStore((s) => s.itemCount());
  const openSearch = useUIStore((s) => s.openSearch);

  const handleAction = (action?: string) => {
    if (action === "cart") toggleCart();
    if (action === "search") openSearch();
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-beige-50 border-t border-beige-200 safe-bottom">
      <div className="flex items-center">
        {BOTTOM_NAV.map((item) => {
          const isActive = item.href ? pathname === item.href : false;
          const Icon = item.icon;

          const content = (
            <div className={cn(
              "flex flex-col items-center gap-0.5 py-2 px-1 transition-colors",
              isActive ? "text-sienna" : "text-charcoal-500"
            )}>
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                {item.action === "cart" && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-sienna text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] uppercase tracking-wider font-medium">
                {item.label}
              </span>
            </div>
          );

          if (item.href) {
            return (
              <Link key={item.label} href={item.href} className="flex-1 flex justify-center">
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => handleAction(item.action)}
              className="flex-1 flex justify-center"
              aria-label={item.label}
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
