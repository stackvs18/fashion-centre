"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home",         href: "/" },
  { label: "Tops",         href: "/tops" },
  { label: "Bottoms",      href: "/bottoms" },
  { label: "New Arrivals", href: "/tops" },
  { label: "Sale",         href: "/bottoms" },
  { label: "About",        href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isScrolled, direction } = useScrollDirection();
  const itemCount   = useCartStore((s) => s.itemCount());
  const toggleCart  = useCartStore((s) => s.toggleCart);
  const { openSearch, isMobileMenuOpen, openMobileMenu, closeMobileMenu } =
    useUIStore();

  /* 
   * Close mobile menu when resizing above md breakpoint (768px).
   * This prevents the drawer staying open when DevTools resize changes 
   * the viewport to desktop width while drawer is open.
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen, closeMobileMenu]);

  const navbarHidden = direction === "down" && isScrolled;

  return (
    <>
      <motion.header
        animate={{ y: navbarHidden ? "-100%" : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          isScrolled
            ? "py-2 border-b border-beige-200 backdrop-blur-md bg-beige-50/90 shadow-sm"
            : "py-4 bg-beige-50 border-b border-beige-200"
        )}
      >
        {/*
         * Layout strategy: three-column grid (left | center | right).
         * This prevents the absolute-positioned logo from ever overlapping
         * the nav links at any viewport width.
         */}
        <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-[1fr_auto_1fr] items-center gap-2">

          {/* ── LEFT: hamburger (mobile) + nav links (desktop) ─── */}
          <div className="flex items-center gap-5 min-w-0">
            {/* Mobile hamburger — shown below md */}
            <button
              id="mobile-menu-btn"
              onClick={openMobileMenu}
              className="md:hidden p-2 -ml-2 hover:bg-beige-200 transition-colors flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-charcoal" />
            </button>

            {/* Desktop left nav links — shown at md+ */}
            <div className="hidden md:flex items-center gap-7">
              {NAV_LINKS.slice(0, 3).map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={cn(
                    "text-xs font-sans font-medium uppercase tracking-widest transition-colors duration-200 whitespace-nowrap",
                    pathname === link.href
                      ? "text-sienna"
                      : "text-charcoal hover:text-sienna"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── CENTER: Logo (always perfectly centered) ─────────── */}
          <Link
            href="/"
            className="font-display text-2xl md:text-3xl font-bold text-charcoal tracking-tight hover:text-sienna transition-colors whitespace-nowrap"
          >
            FASHION
          </Link>

          {/* ── RIGHT: right nav links (desktop) + icon buttons ──── */}
          <div className="flex items-center justify-end gap-1 md:gap-1.5 min-w-0">
            {/* Desktop right nav links */}
            <div className="hidden md:flex items-center gap-7 mr-2">
              {NAV_LINKS.slice(3).map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={cn(
                    "text-xs font-sans font-medium uppercase tracking-widest transition-colors duration-200 whitespace-nowrap",
                    pathname === link.href
                      ? "text-sienna"
                      : "text-charcoal hover:text-sienna"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <button
              id="search-btn"
              onClick={openSearch}
              className="p-2.5 hover:bg-beige-200 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-charcoal" />
            </button>

            <Link
              href="/account"
              id="account-btn"
              className="p-2.5 hover:bg-beige-200 transition-colors hidden sm:flex items-center"
              aria-label="Account"
            >
              <User className="w-4 h-4 text-charcoal" />
            </Link>

            <button
              id="wishlist-btn"
              className="p-2.5 hover:bg-beige-200 transition-colors hidden sm:flex items-center"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4 text-charcoal" />
            </button>

            <button
              id="cart-btn"
              onClick={toggleCart}
              className="relative p-2.5 hover:bg-beige-200 transition-colors"
              aria-label={`Cart (${itemCount} items)`}
            >
              <ShoppingBag className="w-4 h-4 text-charcoal" />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-sienna text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ── Mobile Full-Screen Drawer ────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm bg-beige-50 flex flex-col shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-beige-200">
                <span className="font-display text-2xl font-bold text-charcoal">
                  FASHION
                </span>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 hover:bg-beige-200 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto py-4">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.045 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "flex items-center px-6 py-4 text-sm uppercase tracking-widest font-medium border-b border-beige-200/60 transition-colors",
                        pathname === link.href
                          ? "text-sienna bg-sienna-50"
                          : "text-charcoal hover:text-sienna hover:bg-beige-100"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Social icons */}
              <div className="px-6 py-6 border-t border-beige-200">
                <p className="text-xs uppercase tracking-widest text-charcoal-500 mb-4">
                  Follow Us
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:text-sienna transition-colors"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:text-sienna transition-colors"
                    aria-label="X"
                  >
                    <XIcon />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
