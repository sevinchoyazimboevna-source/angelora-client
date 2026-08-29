import ProductCard from "@/components/product/ProductCard";

export default function ProductGrid({ products, variantMap, className }) {
  return (
    <div className={className}>
      {products.map((p, i) => {
        const variant = variantMap ? variantMap(p, i) : "standard";
        const span = variant === "featured" ? "lg:col-span-2" : "";
        return (
          <ProductCard
            key={p.id}
            product={p}
            variant={variant}
            index={i}
            className={span}
          />
        );
      })}
    </div>
  );
}