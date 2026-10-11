"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

function CartSidebarContent({ onClose }: { onClose: () => void }) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const subtotal = total();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-16 gap-4">
        <ShoppingBag className="w-12 h-12 text-beige-300" />
        <p className="font-sans text-sm uppercase tracking-widest text-charcoal-500">
          Your bag is empty
        </p>
        <Button variant="outline" size="sm" onClick={onClose}>
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-4 px-6 py-4 border-b border-beige-200"
            >
              <div className="relative w-20 h-28 flex-shrink-0 bg-beige-200 overflow-hidden">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <Link
                    href={`/product/${item.product.slug}`}
                    onClick={onClose}
                    className="font-sans text-sm font-medium text-charcoal hover:text-sienna transition-colors line-clamp-2"
                  >
                    {item.product.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-charcoal-500 hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex gap-3 mt-1.5 text-xs text-charcoal-500 uppercase tracking-wide">
                  <span>{item.size}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-beige-300 inline-block"
                      style={{ backgroundColor: item.color.hex }}
                    />
                    {item.color.name}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  {/* Qty stepper */}
                  <div className="flex items-center border border-beige-300">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="w-7 h-7 flex items-center justify-center hover:bg-beige-200 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-7 h-7 flex items-center justify-center hover:bg-beige-200 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-sm font-medium text-charcoal">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-beige-200 p-6 flex flex-col gap-4">
        <div className="flex justify-between text-sm">
          <span className="text-charcoal-500">Subtotal</span>
          <span className="font-medium text-charcoal">{formatPrice(subtotal)}</span>
        </div>
        <p className="text-xs text-charcoal-500">
          Shipping & taxes calculated at checkout
        </p>
        <Link href="/checkout" onClick={onClose}>
          <Button fullWidth size="lg">
            Checkout
          </Button>
        </Link>
        <Link href="/cart" onClick={onClose}>
          <Button variant="outline" fullWidth size="sm">
            View Full Cart
          </Button>
        </Link>
        <button
          onClick={clearCart}
          className="text-xs text-charcoal-500 hover:text-red-500 transition-colors underline underline-offset-2 text-center"
        >
          Clear cart
        </button>
      </div>
    </>
  );
}

export function CartSidebar() {
  const { isOpen, closeCart, itemCount } = useCartStore();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm"
              onClick={closeCart}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-beige-50 flex flex-col max-h-[90dvh] rounded-t-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-beige-200">
                <h2 className="font-sans text-sm uppercase tracking-widest font-medium">
                  Your Bag ({itemCount()})
                </h2>
                <button onClick={closeCart} className="p-1.5 hover:bg-beige-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <CartSidebarContent onClose={closeCart} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] bg-beige-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-beige-200">
              <h2 className="font-sans text-sm uppercase tracking-widest font-medium">
                Your Bag ({itemCount()})
              </h2>
              <button onClick={closeCart} className="p-1.5 hover:bg-beige-200 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <CartSidebarContent onClose={closeCart} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
