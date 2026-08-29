import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { useAppSelector } from "@/store/hooks";
import { selectCollections } from "@/store/products";
import Reveal from "@/components/common/Reveal";
import Container from "@/components/layout/Container";

export default function Collections() {
  const collections = useAppSelector(selectCollections);
  return (
    <div className="py-12 lg:py-16">
      <Container size="wide">
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Curated edits</div>
            <h1 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Collections</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Each collection is a study — a single idea explored across metal, stone, and form.
            </p>
          </div>
        </Reveal>
        <div className="space-y-4">
          {collections.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.04}>
              <Link
                to={`/collections/${c.id}`}
                className="group relative block h-[44vh] min-h-[320px] overflow-hidden rounded-md bg-secondary"
              >
                <Image src={c.image} alt={c.name} fittingType="fill" className="absolute inset-0 h-full w-full transition-transform duration-700 ease-lux group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-foreground/55 to-foreground/10" />
                <div className="absolute inset-0 flex flex-col justify-center px-8 text-white sm:px-14">
                  <motion.div initial={false}>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                      Collection {String(i + 1).padStart(2, "0")}
                    </div>
                    <h2 className="mt-2 font-display text-3xl font-medium sm:text-4xl">{c.name}</h2>
                    <p className="mt-2 max-w-sm text-sm text-white/80">{c.blurb}</p>
                    <span className="mt-5 inline-flex w-fit items-center text-xs font-medium uppercase tracking-[0.16em] underline-offset-4 group-hover:underline">
                      Explore →
                    </span>
                  </motion.div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}