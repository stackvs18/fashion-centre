"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { getFeaturedProducts } from "@/data/products";
import toast from "react-hot-toast";

const PROMO_CODES: Record<string, number> = {
  FASHION10: 10,
  FIRST10: 10,
  SAVE20: 20,
};

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState<string | null>(null);

  const subtotal = total();
  const shipping = subtotal >= 999 ? 0 : 99;
  const discountAmount = Math.round(subtotal * (discount / 100));
  const orderTotal = subtotal + shipping - discountAmount;

  const upsell = getFeaturedProducts().slice(0, 4);

  const applyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (PROMO_CODES[code]) {
      setDiscount(PROMO_CODES[code]);
      setPromoApplied(code);
      toast.success(`Promo code applied! ${PROMO_CODES[code]}% off`);
    } else {
      toast.error("Invalid promo code");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-beige-300 mb-6" />
        <h1 className="font-display text-4xl font-bold text-charcoal mb-3">
          Your bag is empty
        </h1>
        <p className="text-charcoal-500 text-sm mb-8 max-w-sm">
          Looks like you haven&apos;t added anything yet. Explore our latest
          collection.
        </p>
        <div className="flex gap-4">
          <Link href="/tops">
            <Button>Shop Tops</Button>
          </Link>
          <Link href="/bottoms">
            <Button variant="outline">Shop Bottoms</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal">
          Your Bag
        </h1>
        <p className="text-charcoal-500 text-sm mt-2">
          {items.reduce((s, i) => s + i.quantity, 0)} items
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-5 py-6 border-b border-beige-200"
              >
                {/* Product Image */}
                <div className="relative w-24 h-32 sm:w-32 sm:h-44 flex-shrink-0 bg-beige-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between gap-3">
                      <h3 className="font-sans font-medium text-charcoal text-sm sm:text-base">
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-charcoal-500 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-3 mt-1.5 text-xs text-charcoal-500 uppercase tracking-wide">
                      <span>{item.size}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-beige-300 inline-block"
                          style={{ backgroundColor: item.color.hex }}
                        />
                        {item.color.name}
                      </span>
                      <span>·</span>
                      <span>{item.product.fabric}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Qty stepper */}
                    <div className="flex items-center border border-beige-300">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-beige-200 transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-beige-200 transition-colors"
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-medium text-charcoal text-sm sm:text-base">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-charcoal-500">
                          {formatPrice(item.product.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={() => {
              clearCart();
              toast("Cart cleared", { icon: "🗑️" });
            }}
            className="mt-4 text-xs uppercase tracking-widest text-charcoal-500 hover:text-red-500 transition-colors underline underline-offset-2"
          >
            Clear cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-beige-100 p-6 sticky top-24">
            <h2 className="font-sans text-sm uppercase tracking-widest font-medium text-charcoal mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between text-charcoal-500">
                <span>Subtotal</span>
                <span className="text-charcoal font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sienna">
                  <span>Discount ({discount}%)</span>
                  <span>−{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-charcoal-500">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : "text-charcoal font-medium"}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-charcoal-500/70">
                  Add {formatPrice(999 - subtotal)} more for free shipping
                </p>
              )}
            </div>

            {/* Promo code */}
            {!promoApplied ? (
              <div className="mb-6">
                <label className="text-xs uppercase tracking-widest text-charcoal-500 block mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal-500" />
                    <input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                      placeholder="FASHION10"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-beige-300 bg-beige-50 focus:border-charcoal focus:outline-none placeholder:text-charcoal-500/40 uppercase tracking-wider"
                    />
                  </div>
                  <button
                    onClick={applyPromo}
                    className="px-4 py-2.5 bg-charcoal text-beige-50 text-xs uppercase tracking-widest hover:bg-sienna transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6 flex items-center justify-between py-2.5 px-3 bg-green-50 border border-green-200">
                <span className="text-xs text-green-700 uppercase tracking-widest">
                  {promoApplied} — {discount}% off
                </span>
                <button
                  onClick={() => {
                    setPromoApplied(null);
                    setDiscount(0);
                    setPromoCode("");
                  }}
                  className="text-xs text-green-700 hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-baseline py-4 border-t border-beige-200 mb-6">
              <span className="text-sm uppercase tracking-widest font-medium text-charcoal">
                Total
              </span>
              <span className="font-display text-2xl font-bold text-charcoal">
                {formatPrice(orderTotal)}
              </span>
            </div>

            <Link href="/checkout">
              <Button fullWidth size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Proceed to Checkout
              </Button>
            </Link>

            <div className="mt-4 flex gap-2 justify-center">
              <Link href="/tops">
                <Button variant="ghost" size="sm">Continue Shopping</Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-6 pt-6 border-t border-beige-200 grid grid-cols-3 gap-3 text-center">
              {["Free Returns", "Secure Payment", "Authentic"].map((t) => (
                <div key={t} className="text-[10px] uppercase tracking-wider text-charcoal-500">
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upsell */}
      <section className="mt-20">
        <h2 className="font-display text-3xl font-bold text-charcoal mb-8">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {upsell.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
