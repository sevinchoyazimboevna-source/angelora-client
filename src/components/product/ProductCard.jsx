import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Image } from "@/components/ui/image";
import Rating from "./Rating";
import WishlistButton from "./WishlistButton";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/cart";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/contexts/ModalContext";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import QuickView from "./QuickView";

const VARIANTS = {
  standard: "standard",
  editorial: "editorial",
  featured: "featured",
  horizontal: "horizontal",
};

export default function ProductCard({ product, variant = "standard", className, index = 0 }) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const modal = useModal();

  const quickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0],
        price: product.price,
        metal: product.metals[0],
        size: product.sizes ? product.sizes[0] : null,
        qty: 1,
      })
    );
    toast({ description: `${product.name} added to bag` });
  };

  const openQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let closeFn;
    const content = <QuickView productId={product.id} onClose={() => closeFn && closeFn()} />;
    closeFn = modal.openCustom(content);
  };

  if (variant === VARIANTS.horizontal) {
    return (
      <Link to={`/product/${product.slug}`} className={cn("group flex gap-4", className)}>
        <div className="relative w-24 shrink-0 overflow-hidden rounded-md bg-secondary">
          <Image
            src={product.images[0]}
            alt={product.name}
            fittingType="fill"
            className="aspect-square transition-transform duration-500 ease-lux group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center gap-1 py-1">
          <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{product.category}</span>
          <span className="font-heading text-sm font-medium leading-tight group-hover:text-accent transition-colors">
            {product.name}
          </span>
          <Rating value={product.rating} count={product.reviewCount} size={12} />
          <span className="text-sm font-medium tabular-nums">{formatPrice(product.price)}</span>
        </div>
      </Link>
    );
  }

  if (variant === VARIANTS.featured) {
    return (
      <Link
        to={`/product/${product.slug}`}
        className={cn(
          "group relative col-span-2 block aspect-[16/9] overflow-hidden rounded-md bg-secondary",
          className
        )}
      >
        <Image
          src={product.images[2] || product.images[0]}
          alt={product.name}
          fittingType="fill"
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-lux group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-foreground/10 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 text-white">
          {product.badge && (
            <span className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
              {product.badge}
            </span>
          )}
          <h3 className="font-display text-2xl sm:text-3xl font-medium leading-tight">{product.name}</h3>
          <p className="mt-1 text-sm text-white/75">{formatPrice(product.price)}</p>
          <span className="mt-4 inline-flex w-fit items-center text-xs font-medium uppercase tracking-[0.16em] underline-offset-4 group-hover:underline">
            Discover
          </span>
        </div>
      </Link>
    );
  }

  if (variant === VARIANTS.editorial) {
    return (
      <Link to={`/product/${product.slug}`} className={cn("group block", className)}>
        <div className="relative overflow-hidden rounded-md bg-secondary aspect-[4/5]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fittingType="fill"
            className="absolute inset-0 h-full w-full transition-transform duration-700 ease-lux group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <WishlistButton productId={product.id} className="bg-background/80 backdrop-blur-sm p-2 rounded-full" />
          </div>
          {product.badge && (
            <span className="absolute top-3 left-3 bg-background/85 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
              {product.badge}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{product.category}</span>
            <h3 className="font-display text-xl font-medium leading-tight mt-1">{product.name}</h3>
          </div>
          <span className="text-sm font-medium tabular-nums">{formatPrice(product.price)}</span>
        </div>
      </Link>
    );
  }

  // standard
  return (
    <Link to={`/product/${product.slug}`} className={cn("group block", className)}>
      <div className="relative overflow-hidden rounded-md bg-secondary aspect-square">
        <Image
          src={product.images[0]}
          alt={product.name}
          fittingType="fill"
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-lux group-hover:scale-105"
        />
        <Image
          src={product.images[1] || product.images[0]}
          alt=""
          fittingType="fill"
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 ease-lux group-hover:opacity-100"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <WishlistButton productId={product.id} className="bg-background/80 backdrop-blur-sm p-2 rounded-full" />
        </div>
        {product.badge && (
          <span className="absolute top-3 left-3 bg-background/85 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
            {product.badge}
          </span>
        )}
        {product.compareAtPrice && (
          <span className="absolute bottom-3 left-3 bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-foreground">
            Save {formatPrice(product.compareAtPrice - product.price)}
          </span>
        )}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 translate-y-2 transition-all duration-300 ease-lux group-hover:opacity-100 group-hover:translate-y-0">
          <button
            onClick={quickAdd}
            className="flex-1 bg-background/95 backdrop-blur-sm py-2.5 text-xs font-medium uppercase tracking-[0.14em] hover:bg-foreground hover:text-background transition-colors ease-lux"
          >
            Quick Add
          </button>
          <button
            onClick={openQuickView}
            aria-label="Quick view"
            className="bg-background/95 backdrop-blur-sm px-3 py-2.5 text-xs font-medium uppercase tracking-[0.14em] hover:bg-foreground hover:text-background transition-colors ease-lux"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="mt-3.5 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{product.category}</span>
          <Rating value={product.rating} count={product.reviewCount} size={11} showCount={false} />
        </div>
        <h3 className="font-heading text-sm font-medium leading-tight group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium tabular-nums">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-muted-foreground line-through tabular-nums">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}