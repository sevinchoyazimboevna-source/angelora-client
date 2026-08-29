import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectCartItems,
  selectCartSummary,
  updateQty,
  removeFromCart,
  applyDiscount,
  removeDiscount,
} from "@/store/cart";
import { useToast } from "@/components/ui/use-toast";
import { Image } from "@/components/ui/image";
import EmptyState from "@/components/common/EmptyState";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useState } from "react";

export default function Cart() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const items = useAppSelector(selectCartItems);
  const summary = useAppSelector(selectCartSummary);
  const [code, setCode] = useState("");

  const apply = () => {
    dispatch(applyDiscount(code));
    toast({ description: "Discount applied" });
  };

  return (
    <Container size="wide" className="py-12 lg:py-16">
      <div className="mb-10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Your selection</div>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Shopping Bag</h1>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Discover pieces made to be remembered."
          actionLabel="Explore Jewelry"
          actionTo="/jewelry"
        />
      ) : (
        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          {/* Items */}
          <div className="divide-y divide-border border-y border-border">
            {items.map((item) => (
              <div key={item.key} className="flex gap-4 py-6 sm:gap-6">
                <Link to={`/product/${item.slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md bg-secondary sm:h-32 sm:w-28">
                  <Image src={item.image} alt={item.name} fittingType="fill" className="absolute inset-0 h-full w-full" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link to={`/product/${item.slug}`} className="font-heading text-base font-medium hover:text-accent transition-colors">{item.name}</Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.metal}{item.size ? ` · Size ${item.size}` : ""}
                      </p>
                    </div>
                    <span className="font-medium tabular-nums">{formatPrice(item.price * item.qty)}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center rounded-md border border-border">
                      <button onClick={() => dispatch(updateQty({ key: item.key, qty: item.qty - 1 }))} className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="w-8 text-center text-sm tabular-nums">{item.qty}</span>
                      <button onClick={() => dispatch(updateQty({ key: item.key, qty: item.qty + 1 }))} className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <button onClick={() => { dispatch(removeFromCart(item.key)); toast({ description: "Removed from bag" }); }} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-md border border-border p-6">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.14em]">Order Summary</h2>

              {/* Discount */}
              <div className="mt-5">
                {summary.discount > 0 ? (
                  <div className="flex items-center justify-between rounded-md bg-secondary px-3 py-2.5 text-sm">
                    <span className="flex items-center gap-2"><Tag className="h-3.5 w-3.5 text-accent" /> Code applied</span>
                    <span className="flex items-center gap-2 font-medium">−{formatPrice(summary.discount)}
                      <button onClick={() => dispatch(removeDiscount())} aria-label="Remove discount"><X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" /></button>
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code" className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-foreground" />
                    <Button variant="outline" onClick={apply}>Apply</Button>
                  </div>
                )}
                <p className="mt-2 text-[11px] text-muted-foreground">Try ANGELORA10 or WELCOME</p>
              </div>

              <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                <Row label="Subtotal" value={formatPrice(summary.subtotal)} />
                {summary.discount > 0 && <Row label="Discount" value={`−${formatPrice(summary.discount)}`} accent />}
                <Row label="Shipping" value={summary.shipping === 0 ? "Free" : formatPrice(summary.shipping)} />
                <Row label="Tax (est.)" value={formatPrice(summary.tax)} />
                {summary.remainingForFreeShipping > 0 && (
                  <p className="text-[11px] text-muted-foreground">Add {formatPrice(summary.remainingForFreeShipping)} more for free shipping.</p>
                )}
              </dl>
              <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5">
                <span className="font-heading text-sm font-semibold uppercase tracking-[0.14em]">Total</span>
                <span className="text-2xl font-medium tabular-nums">{formatPrice(summary.total)}</span>
              </div>
              <Button asChild size="lg" className="mt-6 h-12 w-full">
                <Link to="/checkout">Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Link to="/jewelry" className="mt-4 block text-center text-xs text-muted-foreground hover:text-foreground">Continue shopping</Link>
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
}

function Row({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={accent ? "font-medium text-accent tabular-nums" : "tabular-nums"}>{value}</dd>
    </div>
  );
}