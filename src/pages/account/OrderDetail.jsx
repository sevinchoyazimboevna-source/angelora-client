import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectOrderById, fetchOrders } from "@/store/orders";
import { Image } from "@/components/ui/image";
import { formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check } from "lucide-react";

const STATUS_STEPS = ["Pending", "Processing", "Delivered"];

export default function OrderDetail() {
  const { orderId } = useParams();
  const dispatch = useAppDispatch();
  const order = useAppSelector((s) => selectOrderById(s, orderId));
  const status = useAppSelector((s) => s.orders.status);

  useEffect(() => {
    if (!order) dispatch(fetchOrders());
  }, [dispatch, order]);

  if (!order) {
    if (status === "loading" || status === "idle") {
      return <div className="py-16 text-center text-sm text-muted-foreground">Loading order…</div>;
    }
    return <Navigate to="/account/orders" replace />;
  }

  const stepIndex = STATUS_STEPS.indexOf(order.status);
  const cancelled = order.status === "Cancelled";

  return (
    <div>
      <Link to="/account/orders" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl font-medium tracking-tight">{order.number}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Placed {formatDate(order.date)}</p>
        </div>
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]", cancelled ? "bg-destructive/10 text-destructive" : "bg-accent text-accent-foreground")}>
          {order.status}
        </span>
      </div>

      {/* Tracker */}
      {!cancelled && (
        <div className="mt-8 flex items-center gap-2">
          {STATUS_STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <span className={cn("grid h-7 w-7 place-items-center rounded-full text-xs", i <= stepIndex ? "bg-foreground text-background" : "border border-border text-muted-foreground")}>
                {i <= stepIndex ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className={cn("text-xs font-medium uppercase tracking-[0.12em]", i <= stepIndex ? "text-foreground" : "text-muted-foreground")}>{s}</span>
              {i < STATUS_STEPS.length - 1 && <span className="mx-1 h-px flex-1 bg-border" />}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.14em]">Items</h3>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {order.items.map((it, i) => (
              <div key={i} className="flex items-center gap-4 py-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                  {it.image ? <Image src={it.image} alt={it.name} fittingType="fill" className="absolute inset-0 h-full w-full" /> : <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">—</div>}
                </div>
                <div className="flex-1">
                  <div className="font-heading text-sm font-medium">{it.name}</div>
                  <div className="text-xs text-muted-foreground">{it.metal}{it.size ? ` · Size ${it.size}` : ""} · Qty {it.qty}</div>
                </div>
                <span className="text-sm font-medium tabular-nums">{formatPrice(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          {order.shipping && (
            <div className="rounded-md border border-border p-5">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Shipping address</h4>
              <p className="mt-3 text-sm leading-relaxed">
                {order.shipping.firstName}<br />
                {order.shipping.address}<br />
                {order.shipping.city}<br />
                {order.shipping.country}
              </p>
            </div>
          )}
          <div className="rounded-md border border-border p-5">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Payment</h4>
            {order.payment ? (
              <p className="mt-3 text-sm">{order.payment.method === "card" ? `Card ending ${order.payment.last4 || "••••"}` : "PayPal"}</p>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">—</p>
            )}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="font-heading text-sm font-semibold uppercase tracking-[0.14em]">Total</span>
              <span className="text-lg font-medium tabular-nums">{formatPrice(order.total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}