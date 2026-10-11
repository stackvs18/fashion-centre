import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-sienna mb-4">404</p>
      <h1 className="font-display text-5xl md:text-7xl font-bold text-charcoal mb-4">
        Product not found
      </h1>
      <p className="text-charcoal-500 text-sm mb-8 max-w-sm leading-relaxed">
        The product you&#39;re looking for doesn&#39;t exist or may have been removed.
        Explore our full collection below.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/tops">
          <Button size="lg">Shop Tops</Button>
        </Link>
        <Link href="/bottoms">
          <Button variant="outline" size="lg">Shop Bottoms</Button>
        </Link>
      </div>
    </div>
  );
}
