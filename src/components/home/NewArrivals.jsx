// @ts-nocheck
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNewArrivals, selectNewArrivals, selectNewArrivalsStatus } from "@/store/products";
import ProductCard from "@/components/product/ProductCard";
import ProductGridSkeleton from "@/components/skeletons/ProductGridSkeleton";
import Reveal from "@/components/common/Reveal";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/common/SectionHeader";

export default function NewArrivals() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectNewArrivals);
  const status = useAppSelector(selectNewArrivalsStatus);

  useEffect(() => {
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  return (
    <section className="py-20 lg:py-28">
      <Container size="wide">
        <Reveal>
          <SectionHeader
            eyebrow="Just landed"
            title="New arrivals"
            description="The latest additions to the Aetheris atelier — fresh cuts, new metals."
            action={<Link to="/jewelry?sort=newest" className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">View all →</Link>}
          />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {status === "loading" || products.length === 0 ? (
            <ProductGridSkeleton count={4} className="col-span-full grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4" />
          ) : (
            products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
          )}
        </div>
      </Container>
    </section>
  );
}