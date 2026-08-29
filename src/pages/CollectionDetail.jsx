import { useParams, Link, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCollectionById, selectProductsByCollection, selectProductsStatus } from "@/store/products";
import { setCollection, setCategory } from "@/store/filters";
import { Image } from "@/components/ui/image";
import ProductCard from "@/components/product/ProductCard";
import ProductGridSkeleton from "@/components/skeletons/ProductGridSkeleton";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export default function CollectionDetail() {
  const { collectionId } = useParams();
  const dispatch = useAppDispatch();
  const collection = useAppSelector((s) => selectCollectionById(s, collectionId));
  const products = useAppSelector((s) => selectProductsByCollection(s, collectionId));
  const status = useAppSelector(selectProductsStatus);

  if (!collection) return <Navigate to="/collections" replace />;

  return (
    <div>
      <section className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
        <Image src={collection.image} alt={collection.name} fittingType="fill" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 to-foreground/15" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">Collection</div>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-6xl">{collection.name}</h1>
          <p className="mt-4 max-w-lg text-white/80">{collection.blurb}</p>
        </div>
      </section>

      <Container size="wide" className="py-14">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{products.length} pieces</p>
          <Button asChild variant="outline">
            <Link to="/jewelry" onClick={() => { dispatch(setCollection(null)); dispatch(setCategory(null)); }}>
              View all jewelry
            </Link>
          </Button>
        </div>
        {status === "loading" ? (
          <ProductGridSkeleton count={6} className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3" />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} variant={i % 5 === 2 ? "editorial" : "standard"} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}