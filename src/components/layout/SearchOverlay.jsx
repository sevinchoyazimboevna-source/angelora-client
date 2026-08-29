import { useEffect, useMemo, useState } from "react";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Image } from "@/components/ui/image";
import { useAppSelector } from "@/store/hooks";
import { selectProducts } from "@/store/products";
import { loadState, saveState } from "@/lib/storage";
import { formatPrice } from "@/lib/format";
import Container from "./Container";

const POPULAR = ["Diamond ring", "Gold necklace", "Pearl earrings", "Tennis bracelet"];

export default function SearchOverlay({ open, onClose, onNavigate }) {
  const products = useAppSelector(selectProducts);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(() => loadState("recentSearches", []));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter((p) => `${p.name} ${p.category} ${p.material} ${p.stone}`.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, products]);

  const commitSearch = (term) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, 5);
    setRecent(next);
    saveState("recentSearches", next);
  };

  const pick = (term) => {
    setQuery(term);
    commitSearch(term);
  };

  const go = (slug) => {
    commitSearch(query);
    onNavigate(`/product/${slug}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50"
        >
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-[6px]" onClick={onClose} />
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-0 bg-background shadow-[0_24px_60px_-24px_rgba(0,0,0,0.25)]"
          >
            <Container size="wide" className="py-5">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <Search className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && commitSearch(query)}
                  placeholder="Search for rings, necklaces, diamonds…"
                  className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                />
                <button onClick={onClose} aria-label="Close search" className="p-1.5 text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
                {/* Suggestions */}
                <div className="space-y-6">
                  {recent.length > 0 && (
                    <div>
                      <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> Recent
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <button key={r} onClick={() => pick(r)} className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-foreground transition-colors">
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      <TrendingUp className="h-3.5 w-3.5" /> Popular
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.map((r) => (
                        <button key={r} onClick={() => pick(r)} className="rounded-full bg-secondary px-3 py-1.5 text-sm hover:bg-muted transition-colors">
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div>
                  <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {query ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Start typing to search"}
                  </div>
                  {results.length > 0 ? (
                    <div className="divide-y divide-border border-y border-border">
                      {results.map((p) => (
                        <button key={p.id} onClick={() => go(p.slug)} className="flex w-full items-center gap-4 py-3 text-left hover:bg-secondary/60 transition-colors px-2">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-secondary">
                            <Image src={p.images[0]} alt={p.name} fittingType="fill" className="absolute inset-0 h-full w-full" />
                          </div>
                          <div className="flex-1">
                            <div className="font-heading text-sm font-medium">{p.name}</div>
                            <div className="text-xs text-muted-foreground capitalize">{p.category} · {p.metal}</div>
                          </div>
                          <div className="text-sm font-medium tabular-nums">{formatPrice(p.price)}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    query && (
                      <p className="py-8 text-sm text-muted-foreground">No pieces match “{query}”. Try another term.</p>
                    )
                  )}
                </div>
              </div>
            </Container>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}