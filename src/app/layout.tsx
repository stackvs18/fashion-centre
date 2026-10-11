import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Cormorant_Garamond } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { MarqueeStrip } from "@/components/layout/MarqueeStrip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/layout/CartSidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { CookieConsent } from "@/components/layout/CookieConsent";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fashion.in"),
  title: {
    default: "FASHION — Premium Everyday Clothing",
    template: "%s | FASHION",
  },
  description:
    "FASHION is a new-age premium clothing brand offering curated tops and bottoms for those who dress intentionally. Free shipping above ₹999.",
  keywords: ["FASHION", "premium clothing", "tops", "bottoms", "fashion", "streetwear", "India"],
  authors: [{ name: "FASHION" }],
  creator: "FASHION",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://fashion.in",
    siteName: "FASHION",
    title: "FASHION — Premium Everyday Clothing",
    description:
      "New-age premium clothing brand. Curated tops and bottoms for those who dress intentionally.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FASHION — Premium Everyday Clothing",
    description: "Curated tops and bottoms for those who dress intentionally.",
    creator: "@fashion",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full`}
    >
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-full flex flex-col bg-beige-50 font-sans antialiased">
        {/* Marquee above navbar */}
        <MarqueeStrip />

        {/* Sticky navbar */}
        <Navbar />

        {/* Page content */}
        <main className="flex-1 pb-16 md:pb-0">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Overlays & Global UI */}
        <CartSidebar />
        <SearchOverlay />
        <BottomNav />
        <CookieConsent />

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "0",
              fontFamily: "var(--font-inter)",
            },
          }}
        />
      </body>
    </html>
  );
}
