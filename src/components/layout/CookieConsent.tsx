"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = document.cookie
      .split("; ")
      .find((r) => r.startsWith("fashion-cookie-consent="));
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    document.cookie =
      "fashion-cookie-consent=accepted; max-age=31536000; path=/; SameSite=Lax";
    setVisible(false);
  };

  const decline = () => {
    document.cookie =
      "fashion-cookie-consent=declined; max-age=31536000; path=/; SameSite=Lax";
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[400px] z-50 bg-charcoal text-beige-50 p-5 shadow-2xl"
        >
          <p className="text-sm leading-relaxed mb-4">
            We use cookies to improve your experience and analyze site traffic.
            By accepting, you agree to our{" "}
            <a href="/privacy" className="underline hover:text-sienna-light transition-colors">
              Cookie Policy
            </a>
            .
          </p>
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={accept}
              className="flex-1"
            >
              Accept
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={decline}
              className="flex-1 !text-beige-200 hover:!bg-charcoal-700"
            >
              Decline
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
