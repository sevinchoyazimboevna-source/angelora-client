import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductGridSkeleton({ count = 8, className }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}