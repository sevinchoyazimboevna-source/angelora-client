import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectFilters,
  toggleFacet,
  setPriceRange,
  setCategory,
  resetFilters,
  selectActiveFilterCount,
} from "@/store/filters";
import { selectCategories } from "@/store/products";
import { FACETS, MATERIAL_LABELS } from "@/data/products";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const FACET_GROUPS = [
  { key: "material", label: "Material" },
];

function Group({ label, children }) {
  return (
    <div className="border-b border-border py-5">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</h4>
      <div className="mt-3.5">{children}</div>
    </div>
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm">
      <span
        className={cn(
          "grid h-4 w-4 place-items-center rounded-sm border transition-colors",
          checked ? "border-foreground bg-foreground text-background" : "border-border"
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 6.5L5 9.5L10 3" />
          </svg>
        )}
      </span>
      <span className={cn(checked ? "text-foreground" : "text-muted-foreground")}>{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );
}

export default function FiltersPanel({ onClose }) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const categories = useAppSelector(selectCategories);
  const activeCount = useAppSelector(selectActiveFilterCount);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-4 lg:hidden">
        <span className="font-heading text-sm font-semibold uppercase tracking-[0.14em]">Filters {activeCount > 0 && `(${activeCount})`}</span>
        <button onClick={onClose} aria-label="Close filters"><X className="h-5 w-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 lg:px-0">
        <Group label="Category">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => dispatch(setCategory(null))}
              className={cn("text-left text-sm py-1.5", !filters.category ? "text-foreground font-medium" : "text-muted-foreground")}
            >
              All categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => dispatch(setCategory(c.id))}
                className={cn("text-left text-sm py-1.5", filters.category === c.id ? "text-foreground font-medium" : "text-muted-foreground")}
              >
                {c.name}
              </button>
            ))}
          </div>
        </Group>

        <Group label="Price">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Min</label>
              <input
                type="number"
                min={0}
                value={filters.priceRange[0]}
                onChange={(e) => dispatch(setPriceRange([Number(e.target.value) || 0, filters.priceRange[1]]))}
                className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Max</label>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => dispatch(setPriceRange([filters.priceRange[0], Number(e.target.value) || 0]))}
                className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>
          </div>
        </Group>

        {FACET_GROUPS.map((g) => (
          <Group key={g.key} label={g.label}>
            <div className="flex flex-col">
              {FACETS[g.key].map((val) => (
                <Checkbox
                  key={val}
                  label={MATERIAL_LABELS[val] || val}
                  checked={filters[g.key].includes(val)}
                  onChange={() => dispatch(toggleFacet({ key: g.key, value: val }))}
                />
              ))}
            </div>
          </Group>
        ))}
      </div>

      <div className="border-t border-border p-4">
        <Button variant="outline" className="w-full" onClick={() => dispatch(resetFilters())}>
          Clear all filters
        </Button>
      </div>
    </div>
  );
}