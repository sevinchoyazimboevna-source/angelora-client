import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectFilters, setSort } from "@/store/filters";
import { SORT_OPTIONS } from "@/data/products";
import { ChevronDown } from "lucide-react";

export default function SortSelect() {
  const dispatch = useAppDispatch();
  const sort = useAppSelector((s) => selectFilters(s).sort);
  return (
    <div className="relative">
      <select
        value={sort}
        onChange={(e) => dispatch(setSort(e.target.value))}
        className="appearance-none rounded-md border border-border bg-background py-2.5 pl-3.5 pr-9 text-sm outline-none focus:border-foreground"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.id} value={o.id}>
            Sort: {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}