import { Truck, ShieldCheck, Package, RefreshCw, Gem } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import Container from "@/components/layout/Container";

const ITEMS = [
  { icon: Truck, title: "Free Shipping", desc: "Complimentary insured delivery worldwide." },
  { icon: ShieldCheck, title: "Secure Payment", desc: "Encrypted checkout with trusted providers." },
  { icon: Package, title: "Premium Packaging", desc: "Each piece arrives in our signature case." },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day returns, no questions asked." },
  { icon: Gem, title: "Authentic Materials", desc: "Certified diamonds and solid precious metals." },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28">
      <
// @ts-ignore
      Container size="wide">
        <
// @ts-ignore
        Reveal>
          <div className="mb-12 text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">The Aetheris standard</div>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-medium tracking-tight">Why choose us</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
          {ITEMS.map((item, i) => (
            <
// @ts-ignore
            Reveal key={item.title} delay={i * 0.05}>
              <div className="flex h-full flex-col items-center gap-3 bg-background px-5 py-10 text-center">
                <item.icon className="h-7 w-7 text-accent" strokeWidth={1.25} />
                <h3 className="font-heading text-sm font-medium">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}    