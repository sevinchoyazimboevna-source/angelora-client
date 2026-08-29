import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectProducts, selectProductsStatus, selectRelatedProducts, selectProductsByCategory, fetchProductById, selectProductDetail } from "@/store/products";
import { addRecentlyViewed } from "@/store/recentlyViewed";
import { selectRecentlyViewedIds } from "@/store/recentlyViewed";
import { addToCart } from "@/store/cart";
import { useToast } from "@/components/ui/use-toast";
import { Image } from "@/components/ui/image";
import Rating from "@/components/product/Rating";
import MetalSwatch from "@/components/product/MetalSwatch";
import WishlistButton from "@/components/product/WishlistButton";
import ProductCard from "@/components/product/ProductCard";
import ProductDetailSkeleton from "@/components/skeletons/ProductDetailSkeleton";
import ErrorState from "@/components/common/ErrorState";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { Minus, Plus, ShoppingBag, ChevronRight, ZoomIn } from "lucide-react";

export default function ProductDetail() {
  const { productId } = useParams();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const products = useAppSelector(selectProducts);
  const status = useAppSelector(selectProductsStatus);
  const detail = useAppSelector(selectProductDetail);
  const fromList = products.find((p) => p.slug === productId || p.id === productId);
  // Ro'yxatda (birinchi sahifada) topilmasa — backend'dan /product/:id orqali alohida so'raymiz
  const product = fromList || (detail.item && (detail.item.slug === productId || detail.item.id === productId) ? detail.item : null);
  const related = useAppSelector((s) => selectRelatedProducts(s, product));
  const recentlyViewedIds = useAppSelector(selectRecentlyViewedIds);
  const crossCategory = useAppSelector((s) => {
    if (!product) return [];
    const others = selectProductsByCategory(s, null).filter((p) => p.category !== product.category && p.id !== product.id);
    return others.slice(0, 3);
  });

  const [activeImg, setActiveImg] = useState(0);
  const [metal, setMetal] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const imgRef = useRef(null);

  useEffect(() => {
    if (product) {
      setMetal(product.metals[0]);
      setSize(product.sizes ? product.sizes[0] : null);
      setActiveImg(0);
      setQty(1);
      dispatch(addRecentlyViewed(product.id));
      window.scrollTo({ top: 0 });
    } else if (status === "succeeded" && productId) {
      // Bosh sahifa ro'yxatida yo'q — backend'dan bevosita so'raymiz
      dispatch(fetchProductById(productId));
    }
  }, [product?.id, status, productId]);

  if (status === "loading" || (!product && detail.status === "loading")) return <Container size="wide" className="py-16"><ProductDetailSkeleton /></Container>;
  if (status === "succeeded" && !product && detail.status === "failed")
    return (
      <Container className="py-20">
        <ErrorState title="Piece not found" message="This piece may have been moved or is no longer available." />
      </Container>
    );
  if (!product) return <Container className="py-16"><ProductDetailSkeleton /></Container>;

  const handleAdd = () => {
    dispatch(addToCart({ productId: product.id, name: product.name, slug: product.slug, image: product.images[0], price: product.price, metal, size, qty }));
    toast({ description: `${product.name} added to bag` });
  };

  const completeLook = crossCategory.slice(0, 2);
  const recent = recentlyViewedIds
    .filter((id) => id !== product.id)
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div className="py-8 lg:py-12">
      <Container size="wide">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/jewelry" className="hover:text-foreground">Jewelry</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="capitalize">{product.category}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div
              ref={imgRef}
              onMouseEnter={() => setZoom((z) => ({ ...z, on: true }))}
              onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setZoom((z) => ({ ...z, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }));
              }}
              className="relative aspect-square overflow-hidden rounded-md bg-secondary"
            >
              <Image
                src={product.images[activeImg]}
                alt={product.name}
                fittingType="fill"
                className="absolute inset-0 h-full w-full transition-transform duration-300 ease-lux"
                style={zoom.on ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-[10px] uppercase tracking-wide text-muted-foreground backdrop-blur-sm">
                <ZoomIn className="h-3 w-3" /> Hover to zoom
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative aspect-square overflow-hidden rounded-md bg-secondary ring-1 transition-all ${activeImg === i ? "ring-foreground" : "ring-border hover:ring-foreground/40"}`}
                >
                  <Image src={img} alt={`${product.name} view ${i + 1}`} fittingType="fill" className="absolute inset-0 h-full w-full" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:py-2">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">{product.category}</span>
              {product.badge && (
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]">{product.badge}</span>
              )}
            </div>
            <h1 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">{product.name}</h1>
            <div className="mt-4 flex items-center gap-4">
              <Rating value={product.rating} count={product.reviewCount} />
              <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <span className="text-3xl font-medium tabular-nums">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through tabular-nums">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>

            <div className="mt-8 space-y-6">
              {/* Metal */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Metal</span>
                  <span className="text-sm">{metal}</span>
                </div>
                <div className="flex gap-4">
                  {product.metals.map((m) => (
                    <MetalSwatch key={m} metal={m} selected={metal === m} onClick={() => setMetal(m)} />
                  ))}
                </div>
              </div>

              {/* Size */}
              {product.sizes && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Size</span>
                    <button className="text-xs text-accent hover:underline">Size guide</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`min-w-11 border px-3.5 py-2 text-sm tabular-nums transition-colors ${size === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center justify-between rounded-md border border-border sm:w-32">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center text-muted-foreground hover:text-foreground" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
                  <span className="tabular-nums">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(99, q + 1))} className="grid h-12 w-12 place-items-center text-muted-foreground hover:text-foreground" aria-label="Increase"><Plus className="h-4 w-4" /></button>
                </div>
                <Button onClick={handleAdd} size="lg" className="h-12 flex-1">
                  <ShoppingBag className="mr-2 h-4 w-4" /> Add to Bag
                </Button>
                <WishlistButton productId={product.id} className="h-12 w-12 rounded-md border border-border" size={20} />
              </div>

              {/* Quick specs */}
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-y border-border py-5 text-sm">
                <div><dt className="text-muted-foreground">Material</dt><dd className="mt-0.5">{product.material}</dd></div>
                <div><dt className="text-muted-foreground">Stone</dt><dd className="mt-0.5">{product.stone === "None" ? "—" : product.stone}</dd></div>
                <div><dt className="text-muted-foreground">Color</dt><dd className="mt-0.5">{product.color}</dd></div>
                <div><dt className="text-muted-foreground">Metal</dt><dd className="mt-0.5">{product.metal}</dd></div>
              </dl>
            </div>

            {/* Accordion */}
            <Accordion type="single" defaultValue="description" className="mt-6">
              <AccordionItem value="description">
                <AccordionTrigger>Description</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{product.description}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="materials">
                <AccordionTrigger>Materials & Details</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{product.details}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{product.shipping}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="care">
                <AccordionTrigger>Care Guide</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{product.care}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Complete the look */}
        {completeLook.length > 0 && (
          <section className="mt-24 border-t border-border pt-16">
            <h2 className="font-display text-3xl font-medium tracking-tight">Complete the look</h2>
            <p className="mt-2 text-muted-foreground">Pair this piece with a curated selection.</p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              <ProductCard product={product} variant="editorial" />
              {completeLook.map((p) => (
                <ProductCard key={p.id} product={p} variant="standard" />
              ))}
            </div>
          </section>
        )}

        {/* You may also like */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="font-display text-3xl font-medium tracking-tight">You may also like</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Recently viewed */}
        {recent.length > 0 && (
          <section className="mt-24">
            <h2 className="font-display text-3xl font-medium tracking-tight">Recently viewed</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {recent.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}