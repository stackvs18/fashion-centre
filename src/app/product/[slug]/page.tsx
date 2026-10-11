import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products, getProductBySlug } from "@/data/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfoPanel } from "@/components/product/ProductInfoPanel";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductCard } from "@/components/product/ProductCard";

// Generate static pages for all 20 products at build time
export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

// Dynamic metadata per product
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name}`,
    description: product.description,
    keywords: [product.name, "FASHION", product.category, ...product.tags],
    openGraph: {
      title: `${product.name} | FASHION`,
      description: product.description,
      images: [{ url: product.images[0], width: 800, height: 1067, alt: product.name }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  // Related products: same category, excluding current
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // You May Also Like: opposite category
  const crossSell = products
    .filter((p) => p.category !== product.category && (p.isBestSeller || p.isNew))
    .slice(0, 4);

  return (
    <div>
      {/* ── Product Hero ──────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left: Image gallery */}
          <div className="md:sticky md:top-24">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Right: Product info */}
          <ProductInfoPanel product={product} />
        </div>
      </section>

      {/* ── Reviews ───────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ProductReviews product={product} />
      </section>

      {/* ── Related Products ──────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-beige-100 py-16">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.4em] text-charcoal-500 mb-2">
                More from {product.category === "tops" ? "Tops" : "Bottoms"}
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal">
                You May Also Like
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Cross-sell ────────────────────────────────────────────── */}
      {crossSell.length > 0 && (
        <section className="py-16">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.4em] text-charcoal-500 mb-2">
                Complete the Look
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal">
                Pair It With
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {crossSell.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
