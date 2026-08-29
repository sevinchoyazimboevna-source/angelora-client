import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectWishlistIds } from "@/store/wishlist";
import { removeFromWishlist } from "@/store/wishlist";
import { selectProducts } from "@/store/products";
import { addToCart } from "@/store/cart";
import { useToast } from "@/components/ui/use-toast";
import { Image } from "@/components/ui/image";
import Rating from "@/components/product/Rating";
import EmptyState from "@/components/common/EmptyState";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

export default function Wishlist() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const ids = useAppSelector(selectWishlistIds);
  const products = useAppSelector(selectProducts);
  const items = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);

  const addAll = () => {
    items.forEach((p) =>
      dispatch(addToCart({ productId: p.id, name: p.name, slug: p.slug, image: p.images[0], price: p.price, metal: p.metals[0], size: p.sizes ? p.sizes[0] : null, qty: 1 }))
    );
    toast({ description: `${items.length} item${items.length === 1 ? "" : "s"} added to bag` });
  };

  return (
    <Container size="wide" className="py-12 lg:py-16">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Saved</div>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Wishlist</h1>
          <p className="mt-2 text-muted-foreground">{items.length} saved piece{items.length === 1 ? "" : "s"}</p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" onClick={addAll}>
            <ShoppingBag className="mr-2 h-4 w-4" /> Add all to bag
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is waiting for something beautiful"
          description="Save the pieces you love and revisit them anytime."
          actionLabel="Explore Jewelry"
          actionTo="/jewelry"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {items.map((p) => (
            <div key={p.id} className="group">
              <Link to={`/product/${p.slug}`} className="relative block aspect-square overflow-hidden rounded-md bg-secondary">
                <Image src={p.images[0]} alt={p.name} fittingType="fill" className="absolute inset-0 h-full w-full transition-transform duration-500 ease-lux group-hover:scale-105" />
              </Link>
              <div className="mt-3 space-y-1">
                <Rating value={p.rating} count={p.reviewCount} size={11} showCount={false} />
                <Link to={`/product/${p.slug}`} className="block font-heading text-sm font-medium hover:text-accent transition-colors">{p.name}</Link>
                <span className="text-sm font-medium tabular-nums">{formatPrice(p.price)}</span>
                <div className="flex items-center gap-3 pt-2">
                  <Button size="sm" className="h-8 px-3" onClick={() => { dispatch(addToCart({ productId: p.id, name: p.name, slug: p.slug, image: p.images[0], price: p.price, metal: p.metals[0], size: p.sizes ? p.sizes[0] : null, qty: 1 })); toast({ description: `${p.name} added to bag` }); }}>
                    Add to bag
                  </Button>
                  <button onClick={() => dispatch(removeFromWishlist(p.id))} className="text-xs text-muted-foreground hover:text-foreground">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}