import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Check, CreditCard, Lock, Truck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCartItems, selectCartSummary, clearCart } from "@/store/cart";
import { placeOrder, fetchOrders } from "@/store/orders";
import { api } from "@/api/restClient";
import { updateProfile } from "@/store/profile";
import { useToast } from "@/components/ui/use-toast";
import { Image } from "@/components/ui/image";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const STEPS = ["shipping", "delivery", "payment", "review"];
const STEP_LABELS = { shipping: "Shipping", delivery: "Delivery", payment: "Payment", review: "Review" };

const COUNTRIES = ["France", "United States", "United Kingdom", "Germany", "Japan", "Italy", "Spain", "Canada"];
const DELIVERY = [
  { id: "standard", label: "Standard", desc: "3–5 business days", price: 0 },
  { id: "express", label: "Express", desc: "1–2 business days", price: 35 },
];

export default function Checkout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const items = useAppSelector(selectCartItems);
  const summary = useAppSelector(selectCartSummary);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "", phone: "",
    country: "France", city: "", address: "",
  });
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState({ method: "card", card: "", expiry: "", cvc: "", name: "" });
  const [errors, setErrors] = useState({});

  if (items.length === 0) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-display text-3xl font-medium">Your bag is empty</h1>
        <Button asChild className="mt-6"><Link to="/jewelry">Explore Jewelry</Link></Button>
      </Container>
    );
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validateShipping = () => {
    const e = {};
    ["firstName", "city", "address"].forEach((k) => { if (!form[k]) e[k] = "Required"; });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 0 && !validateShipping()) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const place = async () => {
    const orderItems = items.map((i) => ({ productId: i.productId, name: i.name, image: i.image, price: i.price, qty: i.qty, metal: i.metal, size: i.size }));
    const total = summary.total + (delivery === "express" ? 35 : 0);
    const payload = { items: orderItems, total, shipping: form, delivery, payment: { method: payment.method, last4: payment.card.slice(-4) } };
    // Backend /order/create expects the body to be an array of order items directly —
    // { productId, itemPrice, itemQuantity } — not the wrapped local payload above.
    const backendPayload = items.map((i) => ({
      productId: i.productId,
      itemPrice: i.price,
      itemQuantity: i.qty,
    }));
    try {
      await api.orders.create(backendPayload);
      dispatch(fetchOrders());
    } catch (error) {
      // Keep the storefront usable when the optional order endpoint is not yet enabled.
      console.warn("Order REST endpoint unavailable; saved locally.", error.message);
      dispatch(placeOrder(payload));
    }
    dispatch(updateProfile({ firstName: form.firstName, phone: form.phone }));
    dispatch(clearCart());
    toast({ description: "Order placed successfully" });
    navigate("/account/orders");
  };

  return (
    <Container size="wide" className="py-12 lg:py-16">
      <div className="mb-10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Checkout</div>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Complete your order</h1>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div>
          {/* Stepper */}
          <ol className="mb-10 flex items-center gap-2">
            {STEPS.map((s, i) => (
              <li key={s} className="flex flex-1 items-center gap-2">
                <span className={cn("grid h-7 w-7 place-items-center rounded-full text-xs font-medium transition-colors", i < step ? "bg-foreground text-background" : i === step ? "bg-accent text-accent-foreground" : "border border-border text-muted-foreground")}>
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className={cn("text-xs font-medium uppercase tracking-[0.12em]", i === step ? "text-foreground" : "text-muted-foreground")}>{STEP_LABELS[s]}</span>
                {i < STEPS.length - 1 && <span className="mx-1 h-px flex-1 bg-border" />}
              </li>
            ))}
          </ol>

          {/* Completed shipping summary */}
          {step > 0 && (
            <button onClick={() => setStep(0)} className="mb-6 flex w-full items-center justify-between rounded-md border border-border px-4 py-3 text-left text-sm">
              <span><span className="text-muted-foreground">Ship to </span>{form.firstName} — {form.address}, {form.city}</span>
              <span className="text-accent">Edit</span>
            </button>
          )}
          {step > 1 && (
            <button onClick={() => setStep(1)} className="mb-6 flex w-full items-center justify-between rounded-md border border-border px-4 py-3 text-left text-sm">
              <span><span className="text-muted-foreground">Delivery </span>{DELIVERY.find((d) => d.id === delivery)?.label}</span>
              <span className="text-accent">Edit</span>
            </button>
          )}

          {/* Step content */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-heading text-lg font-medium">Shipping information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name" value={form.firstName} onChange={(v) => set("firstName", v)} error={errors.firstName} />
                <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
                <div className="space-y-1.5">
                  <Label>Country</Label>
                  <select value={form.country} onChange={(e) => set("country", e.target.value)} className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-foreground">
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <Field label="City" value={form.city} onChange={(v) => set("city", v)} error={errors.city} />
                <div className="sm:col-span-2"><Field label="Address" value={form.address} onChange={(v) => set("address", v)} error={errors.address} /></div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-medium">Delivery method</h2>
              {DELIVERY.map((d) => (
                <button key={d.id} onClick={() => setDelivery(d.id)} className={cn("flex w-full items-center justify-between rounded-md border px-4 py-4 text-left transition-colors", delivery === d.id ? "border-foreground" : "border-border hover:border-foreground/40")}>
                  <span className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                    <span>
                      <span className="block font-medium">{d.label}</span>
                      <span className="text-sm text-muted-foreground">{d.desc}</span>
                    </span>
                  </span>
                  <span className="text-sm font-medium">{d.price === 0 ? "Free" : formatPrice(d.price)}</span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-medium">Payment</h2>
              <div className="flex gap-3">
                {["card", "paypal"].map((m) => (
                  <button key={m} onClick={() => setPayment((p) => ({ ...p, method: m }))} className={cn("flex flex-1 items-center gap-2 rounded-md border px-4 py-3 text-sm capitalize transition-colors", payment.method === m ? "border-foreground" : "border-border")}>
                    {m === "card" ? <CreditCard className="h-4 w-4" /> : <span className="text-xs font-semibold">PP</span>}
                    {m === "card" ? "Credit card" : "PayPal"}
                  </button>
                ))}
              </div>
              {payment.method === "card" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label>Card number</Label>
                    <Input inputMode="numeric" placeholder="4242 4242 4242 4242" value={payment.card} onChange={(e) => setPayment((p) => ({ ...p, card: e.target.value }))} className="h-11" />
                  </div>
                  <Field label="Name on card" value={payment.name} onChange={(v) => setPayment((p) => ({ ...p, name: v }))} />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5"><Label>Expiry</Label><Input placeholder="MM/YY" value={payment.expiry} onChange={(e) => setPayment((p) => ({ ...p, expiry: e.target.value }))} className="h-11" /></div>
                    <div className="space-y-1.5"><Label>CVC</Label><Input placeholder="123" value={payment.cvc} onChange={(e) => setPayment((p) => ({ ...p, cvc: e.target.value }))} className="h-11" /></div>
                  </div>
                </div>
              ) : (
                <p className="rounded-md bg-secondary px-4 py-6 text-sm text-muted-foreground">You’ll be redirected to PayPal to complete your purchase securely.</p>
              )}
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="h-3.5 w-3.5" /> Payments are encrypted and secure. This is a demo — no real charge is made.</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-heading text-lg font-medium">Review your order</h2>
              <div className="rounded-md border border-border divide-y divide-border">
                {items.map((i) => (
                  <div key={i.key} className="flex items-center gap-4 p-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                      <Image src={i.image} alt={i.name} fittingType="fill" className="absolute inset-0 h-full w-full" />
                    </div>
                    <div className="flex-1">
                      <div className="font-heading text-sm font-medium">{i.name}</div>
                      <div className="text-xs text-muted-foreground">{i.metal}{i.size ? ` · Size ${i.size}` : ""} · Qty {i.qty}</div>
                    </div>
                    <span className="text-sm font-medium tabular-nums">{formatPrice(i.price * i.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-md border border-border p-4 text-sm">
                <div className="font-medium">Shipping to</div>
                <p className="mt-1 text-muted-foreground">{form.firstName}, {form.address}, {form.city}, {form.country}</p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="mt-8 flex items-center justify-between">
            {step > 0 ? (
              <Button variant="outline" onClick={back}>Back</Button>
            ) : (
              <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground">← Back to bag</Link>
            )}
            {step < STEPS.length - 1 ? (
              <Button onClick={next} size="lg" className="h-12 px-8">Continue</Button>
            ) : (
              <Button onClick={place} size="lg" className="h-12 px-8">Pay {formatPrice(summary.total + (delivery === "express" ? 35 : 0))}</Button>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-md border border-border p-6">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.14em]">Order Summary</h2>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
              {items.map((i) => (
                <div key={i.key} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <Image src={i.image} alt={i.name} fittingType="fill" className="absolute inset-0 h-full w-full" />
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium leading-tight">{i.name}</div>
                    <div className="text-xs text-muted-foreground">Qty {i.qty}</div>
                  </div>
                  <span className="text-sm tabular-nums">{formatPrice(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <dl className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">{formatPrice(summary.subtotal)}</dd></div>
              {summary.discount > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">Discount</dt><dd className="tabular-nums text-accent">−{formatPrice(summary.discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd className="tabular-nums">{(summary.shipping + (delivery === "express" ? 35 : 0)) === 0 ? "Free" : formatPrice(summary.shipping + (delivery === "express" ? 35 : 0))}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Tax</dt><dd className="tabular-nums">{formatPrice(summary.tax)}</dd></div>
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
              <span className="font-heading text-sm font-semibold uppercase tracking-[0.14em]">Total</span>
              <span className="text-xl font-medium tabular-nums">{formatPrice(summary.total + (delivery === "express" ? 35 : 0))}</span>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}

function Field({ label, value, onChange, error, type = "text" }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cn("h-11", error && "border-destructive")} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}