import { cn } from "@/lib/utils";

export default function ProductCardSkeleton({ className }) {
  return (
    <div className={cn("block", className)}>
      <div className="aspect-square shimmer rounded-md" />
      <div className="mt-3.5 space-y-2">
        <div className="h-2.5 w-16 shimmer rounded" />
        <div className="h-3 w-32 shimmer rounded" />
        <div className="h-3 w-20 shimmer rounded" />
      </div>
    </div>
  );
}