import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectOrders, fetchOrders } from "@/store/orders";
import EmptyState from "@/components/common/EmptyState";
import { formatDate, formatPrice } from "@/lib/format";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  Pending: "bg-secondary text-muted-foreground",
  Processing: "bg-accent/10 text-accent",
  Shipped: "bg-foreground/10 text-foreground",
  Delivered: "bg-accent text-accent-foreground",
  Cancelled: "bg-destructive/10 text-destructive",
};

export default function Orders() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrders);
  const status = useAppSelector((state) => state.orders.status);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (status === "loading" && orders.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">Loading your orders…</div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="When you place an order it will appear here."
        actionLabel="Explore Jewelry"
        actionTo="/jewelry"
      />
    );
  }
  return (
    <div>
      <h2 className="font-display text-2xl font-medium tracking-tight">Your orders</h2>
      <p className="mt-2 text-sm text-muted-foreground">{orders.length} order{orders.length === 1 ? "" : "s"}</p>
      <div className="mt-8 space-y-4">
        {orders.map((o) => (
          <Link key={o.id} to={`/account/orders/${o.id}`} className="block rounded-md border border-border p-5 transition-colors hover:border-foreground/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-heading text-sm font-medium">{o.number}</div>
                <div className="text-xs text-muted-foreground">{formatDate(o.date)}</div>
              </div>
              <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]", STATUS_STYLES[o.status])}>{o.status}</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex -space-x-3">
                {o.items.slice(0, 3).map((it, i) => (
                  <div key={i} className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-background bg-secondary">
                    {it.image && <img src={it.image} alt="" className="absolute inset-0 h-full w-full object-cover" />}
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{o.items.length} item{o.items.length === 1 ? "" : "s"}</span>
              <span className="ml-auto font-medium tabular-nums">{formatPrice(o.total)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}