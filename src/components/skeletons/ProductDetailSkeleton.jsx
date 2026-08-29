export default function ProductDetailSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="space-y-3">
        <div className="aspect-square shimmer rounded-md" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square shimmer rounded-md" />
          ))}
        </div>
      </div>
      <div className="space-y-5 pt-2">
        <div className="h-3 w-20 shimmer rounded" />
        <div className="h-8 w-3/4 shimmer rounded" />
        <div className="h-4 w-24 shimmer rounded" />
        <div className="h-10 w-32 shimmer rounded" />
        <div className="h-24 w-full shimmer rounded" />
        <div className="h-12 w-full shimmer rounded" />
      </div>
    </div>
  );
}