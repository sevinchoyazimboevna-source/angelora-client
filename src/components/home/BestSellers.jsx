// @ts-nocheck
import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBestSellers, selectBestSellers, selectBestSellersStatus } from "@/store/products";
import ProductCard from "@/components/product/ProductCard";
import ProductGridSkeleton from "@/components/skeletons/ProductGridSkeleton";
import Reveal from "@/components/common/Reveal";
import Container from "@/components/layout/Container";

export default function BestSellers() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectBestSellers);
  const status = useAppSelector(selectBestSellersStatus);
  const ref = useRef(null);

  useEffect(() => {
    dispatch(fetchBestSellers());
  }, [dispatch]);
  const scroll = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };
  return (
    <section className="py-20 lg:py-28">
      <Container size="wide">
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Most desired</div>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-medium tracking-tight">Best sellers</h2>
            </div>
            <div className="hidden gap-2 sm:flex">
              <button onClick={() => scroll(-1)} aria-label="Previous" className="grid h-10 w-10 place-items-center rounded-full border border-border hover:border-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button onClick={() => scroll(1)} aria-label="Next" className="grid h-10 w-10 place-items-center rounded-full border border-border hover:border-foreground transition-colors">
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </Reveal>
      </Container>
      <div ref={ref} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:px-8 lg:px-12 pb-2">
        {status === "loading" || status === "idle" ? (
          <ProductGridSkeleton count={4} className="flex gap-4 w-full" />
        ) : (
          products.map((p, i) => (
            <div key={p.id} className="w-[78%] shrink-0 snap-start sm:w-[42%] lg:w-[26%]">
              <ProductCard product={p} variant="standard" index={i} />
            </div>
          ))
        )}
        <div className="w-1 shrink-0" aria-hidden />
      </div>
    </section>
  );
}