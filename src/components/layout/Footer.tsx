"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronDown } from "lucide-react";

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});
type EmailForm = z.infer<typeof emailSchema>;

const FOOTER_LINKS = {
  "Quick Links": [
    { label: "New Arrivals", href: "/tops" },
    { label: "Tops", href: "/tops" },
    { label: "Bottoms", href: "/bottoms" },
    { label: "Sale", href: "/bottoms" },
    { label: "About Us", href: "/about" },
  ],
  "Customer Service": [
    { label: "Size Guide", href: "/about" },
    { label: "Track Order", href: "/account" },
    { label: "Returns & Exchanges", href: "/privacy" },
    { label: "Shipping Info", href: "/privacy" },
    { label: "Contact Us", href: "/about" },
  ],
};

function AccordionSection({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-beige-300/60 md:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 md:py-0 md:pointer-events-none text-left"
      >
        <p className="text-xs uppercase tracking-widest font-medium text-charcoal">
          {title}
        </p>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-charcoal-500 transition-transform md:hidden",
            open && "rotate-180"
          )}
        />
      </button>
      <ul
        className={cn(
          "overflow-hidden transition-all duration-300 md:!max-h-none md:overflow-visible",
          open ? "max-h-96" : "max-h-0 md:max-h-none"
        )}
      >
        {links.map((link) => (
          <li key={link.label} className="py-1.5 md:py-1">
            <Link
              href={link.href}
              className="text-sm text-charcoal-500 hover:text-sienna transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });

  const onSubmit = async (data: EmailForm) => {
    await new Promise((r) => setTimeout(r, 800));
    console.log("Newsletter signup:", data.email);
    toast.success("You're on the list! Welcome to FASHION.");
    reset();
  };

  return (
    <footer className="bg-beige-100 border-t border-beige-200 mt-auto">
      {/* Main Footer Grid */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-12">

          {/* Brand Column */}
          <div className="py-6 md:py-0 border-b md:border-0 border-beige-300/60">
            <Link href="/" className="font-display text-3xl font-bold text-charcoal block mb-4">
              FASHION
            </Link>
            <p className="text-sm text-charcoal-500 leading-relaxed mb-6 max-w-[240px]">
              New-age premium clothing for those who dress intentionally. Quality
              you feel, design you remember.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-beige-200 hover:bg-charcoal hover:text-white transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-beige-200 hover:bg-charcoal hover:text-white transition-all"
                aria-label="X (Twitter)"
              >
                <XIcon />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-beige-200 hover:bg-charcoal hover:text-white transition-all"
                aria-label="YouTube"
              >
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Quick Links & Customer Service */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <AccordionSection key={title} title={title} links={links} />
          ))}

          {/* Newsletter */}
          <div className="py-6 md:py-0">
            <p className="text-xs uppercase tracking-widest font-medium text-charcoal mb-4">
              Stay in the Loop
            </p>
            <p className="text-sm text-charcoal-500 mb-4">
              New drops, exclusive offers, and zero spam.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
              <input
                {...register("email")}
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 text-sm bg-beige-50 border border-beige-300 focus:border-charcoal focus:outline-none placeholder:text-charcoal-500/50 transition-colors"
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 text-xs uppercase tracking-widest font-medium bg-charcoal text-beige-50 hover:bg-sienna transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-beige-200">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-500">
          <p>© {new Date().getFullYear()} FASHION. All rights reserved.</p>

          {/* Payment icons text */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-charcoal-500">
            <span className="px-2 py-1 border border-beige-300 bg-white">Visa</span>
            <span className="px-2 py-1 border border-beige-300 bg-white">Mastercard</span>
            <span className="px-2 py-1 border border-beige-300 bg-white">UPI</span>
            <span className="px-2 py-1 border border-beige-300 bg-white">Stripe</span>
          </div>

          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-sienna transition-colors">
              Privacy Policy
            </Link>
            <Link href="/privacy" className="hover:text-sienna transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
