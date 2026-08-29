import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectFilteredProducts,
  selectPagedProducts,
  selectTotalPages,
  selectFilters,
  setCategory,
  setSort,
  setPage,
} from "@/store/filters";
import { selectProductsStatus } from "@/store/products";
import ProductCard from "@/components/product/ProductCard";
import ProductGridSkeleton from "@/components/skeletons/ProductGridSkeleton";
import FiltersPanel from "@/components/jewelry/FiltersPanel";
import SortSelect from "@/components/jewelry/SortSelect";
import Container from "@/components/layout/Container";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";

export default function Jewelry() {
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  const filters = useAppSelector(selectFilters);
  const status = useAppSelector(selectProductsStatus);
  const filtered = useAppSelector(selectFilteredProducts);
  const paged = useAppSelector(selectPagedProducts);
  const totalPages = useAppSelector(selectTotalPages);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sync URL → Redux on mount / param change
  useEffect(() => {
    const cat = params.get("category");
    const sort = params.get("sort");
    if (cat) dispatch(setCategory(cat));
    if (sort) dispatch(setSort(sort));
     
  }, []);

  // Keep URL in sync with category/sort
  useEffect(() => {
    const next = new URLSearchParams(params);
    if (filters.category) next.set("category", filters.category);
    else next.delete("category");
    if (filters.sort && filters.sort !== "featured") next.set("sort", filters.sort);
    else next.delete("sort");
    setParams(next, { replace: true });
     
  }, [filters.category, filters.sort]);

  const variantFor = (p, i) => {
    if (p.featured && i % 5 === 4) return "featured";
    if (i % 7 === 3) return "editorial";
    return "standard";
  };

  return (
    <div className="py-10 lg:py-14">
      <Container size="wide">
        <div className="mb-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">The Gallery</div>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">All Jewelry</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {filtered.length} piece{filtered.length === 1 ? "" : "s"} — filter by material, metal, stone and more.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block sticky top-24 h-[calc(100vh-7rem)]">
            <FiltersPanel />
          </aside>

          <div>
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between gap-3 border-b border-border pb-4">
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 rounded-md border border-border px-3.5 py-2.5 text-sm lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </button>
              <p className="hidden text-sm text-muted-foreground lg:block">
                Showing {paged.length} of {filtered.length}
              </p>
              <SortSelect />
            </div>

            {/* Grid */}
            {status === "loading" ? (
              <ProductGridSkeleton count={9} className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3" />
            ) : filtered.length === 0 ? (
              <EmptyState
                title="No pieces match your filters"
                description="Try widening your price range or clearing a few filters to see more."
                actionLabel="Clear all filters"
                onAction={() => dispatch({ type: "filters/resetFilters" })}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {paged.map((p, i) => (
                  <ProductCard key={p.id} product={p} variant={variantFor(p, i)} index={i} className={variantFor(p, i) === "featured" ? "col-span-2" : ""} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      dispatch(setPage(i + 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={
                      "h-9 min-w-9 rounded-md border px-3 text-sm transition-colors " +
                      (filters.page === i + 1 ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground")
                    }
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-foreground/30 backdrop-blur-[6px]" onClick={() => setDrawerOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 w-[85%] max-w-sm bg-background"
            >
              <FiltersPanel onClose={() => setDrawerOpen(false)} />
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:hidden">
                <Button className="w-full" onClick={() => setDrawerOpen(false)}>
                  Show {filtered.length} results
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}