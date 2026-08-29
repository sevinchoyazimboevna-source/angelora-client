// @ts-nocheck
import { Image } from "@/components/ui/image";
import Reveal from "@/components/common/Reveal";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/common/SectionHeader";
import { Gem, Sparkles, ShieldCheck, Compass } from "lucide-react";

const PILLARS = [
  {
    icon: Gem,
    title: "Ethically sourced",
    desc: "Every diamond is conflict-free and fully traceable to its origin.",
  },
  {
    icon: Sparkles,
    title: "Hand-finished",
    desc: "Each piece is polished and set by a single master jeweler.",
  },
  {
    icon: ShieldCheck,
    title: "Lifetime guarantee",
    desc: "We stand behind our craft for the life of the piece.",
  },
  {
    icon: Compass,
    title: "Made to endure",
    desc: "Solid precious metals and stones built for generations.",
  },
];

export default function About() {
  return (
    <div>
      {/* ABOUT HERO VIDEO */}
      <section className="relative h-[56vh] min-h-[380px] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/angelora1.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 to-foreground/10" />

        {/* Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
            Our atelier
          </div>

          <h1 className="mt-3 max-w-3xl font-display text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
            The architecture of radiance
          </h1>

          <p className="mt-4 max-w-lg text-white/80">
            Aetheris was founded on a single belief — that jewelry should be
            engineered like architecture and felt like memory.
          </p>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <Container size="wide" className="py-20 lg:py-28">
        <Reveal>
          <SectionHeader
            align="center"
            eyebrow="Our philosophy"
            title="Precision, made personal"
            description="We treat every viewport as a curated gallery — using light, surgical typography, and vast negative space to elevate jewelry from objects to artifacts."
          />
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="flex h-full flex-col gap-4 bg-background p-8">
                <p.icon
                  className="h-8 w-8 text-accent"
                  strokeWidth={1.25}
                />

                <h3 className="font-heading text-base font-medium">
                  {p.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* CONTACT */}
      <section className="px-5 pb-8 sm:px-8 lg:px-12">
        <Reveal>
          <div className="grid items-center gap-10 rounded-md bg-secondary/60 p-8 sm:p-14 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                Contact
              </div>

              <h2 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
                Visit the atelier
              </h2>

              <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
                By appointment only. Our specialists will guide you through
                each piece, or commission something entirely your own.
              </p>

              <dl className="mt-8 space-y-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Address</dt>
                  <dd className="mt-1">12 Rue de la Paix, 75002 Paris</dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Hours</dt>
                  <dd className="mt-1">Mon–Sat, 10:00–19:00</dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="mt-1">concierge@aetheris.com</dd>
                </div>
              </dl>
            </div>

            {/* GALLERY IMAGE */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-background">
              <Image
                src="/img/foto4.jpg"
                alt="Aetheris gallery"
                fittingType="fill"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}