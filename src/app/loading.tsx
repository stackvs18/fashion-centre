import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="space-y-4 mb-12">
        <div className="h-3 w-32 bg-beige-200 animate-pulse" />
        <div className="h-10 w-64 bg-beige-200 animate-pulse" />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
