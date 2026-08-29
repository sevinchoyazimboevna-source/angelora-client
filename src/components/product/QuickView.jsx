import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductById, selectProductDetail } from "@/store/products";
import { addToCart } from "@/store/cart";
import { useEffect, useState } from "react";
import { Image } from "@/components/ui/image";
import Rating from "./Rating";
import MetalSwatch from "./MetalSwatch";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useToast } from "@/components/ui/use-toast";

export default function QuickView({ productId, onClose }) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const detail = useAppSelector(selectProductDetail);
  const [metal, setMetal] = useState(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  const product = detail.item;
  useEffect(() => {
    if (product) {
      setMetal(product.metals[0]);
      setSize(product.sizes ? product.sizes[0] : null);
    }
  }, [product]);

  if (detail.status === "loading" || !product) {
    return <div className="h-[420px] shimmer rounded-md" />;
  }

  const add = () => {
    dispatch(addToCart({ productId: product.id, name: product.name, slug: product.slug, image: product.images[0], price: product.price, metal, size, qty: 1 }));
    toast({ description: `${product.name} added to bag` });
    onClose?.();
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-md bg-secondary">
        <Image src={product.images[0]} alt={product.name} fittingType="fill" className="absolute inset-0 h-full w-full" />
      </div>
      <div className="flex flex-col gap-4 pr-1">
        <div>
          <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{product.category}</span>
          <h3 className="font-display text-2xl font-medium leading-tight mt-1">{product.name}</h3>
          <Rating value={product.rating} count={product.reviewCount} className="mt-2" />
        </div>
        <p className="text-2xl font-medium tabular-nums">{formatPrice(product.price)}</p>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{product.description}</p>
        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Metal</span>
          <div className="flex gap-3">
            {product.metals.map((m) => (
              <MetalSwatch key={m} metal={m} selected={metal === m} onClick={() => setMetal(m)} label={false} />
            ))}
          </div>
        </div>
        {product.sizes && (
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Size</span>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-10 border px-3 py-1.5 text-xs tabular-nums transition-colors ${
                    size === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <Button onClick={add} className="mt-2 h-11">
          Add to Bag — {formatPrice(product.price)}
        </Button>
        <Link to={`/product/${product.slug}`} onClick={onClose} className="text-center text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
          View full details
        </Link>
      </div>
    </div>
  );
}