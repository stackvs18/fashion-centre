import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function BottomsLoading() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-12 pb-8 border-b border-beige-200 space-y-3">
        <div className="h-3 w-24 bg-beige-200 animate-pulse" />
        <div className="h-12 w-48 bg-beige-200 animate-pulse" />
        <div className="h-3 w-32 bg-beige-200 animate-pulse" />
      </div>
      <ProductGridSkeleton count={12} />
    </div>
  );
}
