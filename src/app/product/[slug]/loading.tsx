export default function ProductLoading() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Gallery skeleton */}
        <div className="flex flex-col-reverse md:flex-row gap-3">
          <div className="flex flex-row md:flex-col gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-16 h-20 md:w-20 md:h-24 bg-beige-200 animate-pulse" />
            ))}
          </div>
          <div className="flex-1 aspect-[3/4] bg-beige-200 animate-pulse" />
        </div>

        {/* Info skeleton */}
        <div className="flex flex-col gap-5">
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-beige-200 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-9 w-3/4 bg-beige-200 animate-pulse" />
            <div className="h-4 w-1/2 bg-beige-200 animate-pulse" />
          </div>
          <div className="h-4 w-36 bg-beige-200 animate-pulse" />
          <div className="h-9 w-32 bg-beige-200 animate-pulse" />
          <hr className="border-beige-200" />
          {/* Color */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-beige-200 animate-pulse" />
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-beige-300 animate-pulse" />
              ))}
            </div>
          </div>
          {/* Size */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-beige-200 animate-pulse" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-12 h-11 bg-beige-200 animate-pulse" />
              ))}
            </div>
          </div>
          {/* CTA */}
          <div className="flex gap-3 mt-2">
            <div className="flex-1 h-12 bg-beige-300 animate-pulse" />
            <div className="w-12 h-12 bg-beige-200 animate-pulse" />
            <div className="w-12 h-12 bg-beige-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
