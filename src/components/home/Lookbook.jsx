// @ts-nocheck
import { Image } from "@/components/ui/image";
import Reveal from "@/components/common/Reveal";
import Container from "@/components/layout/Container";

export default function Lookbook() {
  return (
    <section className="py-20 lg:py-28">
      <Container size="wide">
        <Reveal>
          <div className="mb-12 text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Lookbook</div>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-medium tracking-tight">Worn in the world</h2>
          </div>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal>
            <figure className="relative aspect-[4/5] overflow-hidden rounded-md bg-secondary">
              <Image src="/img/foto1.jpg" alt="Aetheris worn on the hand" fittingType="fill" className="absolute inset-0 h-full w-full" />
              <figcaption className="absolute bottom-5 left-5 text-white">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">Chapter 01</div>
                <div className="font-display text-2xl font-medium">The everyday ring</div>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.1}>
            <figure className="relative aspect-[4/5] overflow-hidden rounded-md bg-secondary">
              <Image src="/img/foto2.jpg" alt="Aetheris pendant worn" fittingType="fill" className="absolute inset-0 h-full w-full" />
              <figcaption className="absolute bottom-5 left-5 text-white">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">Chapter 02</div>
                <div className="font-display text-2xl font-medium">A single line of light</div>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}