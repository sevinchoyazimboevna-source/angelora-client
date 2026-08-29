// @ts-nocheck
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { CATEGORIES } from "@/data/products";
import Reveal from "@/components/common/Reveal";
import Container from "@/components/layout/Container";

export default function CategoryShowcase() {
  // Hardcoded — categories backend'dan kelmaydi
  const categories = CATEGORIES;
  return (
    <section className="py-20 lg:py-28">
      <Container size="wide">
        <Reveal>
          <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Shop by Category</div>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-medium tracking-tight">Find your form</h2>
            </div>
            <Link to="/jewelry" className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
              View all jewelry →
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.06}>
              <Link
                to={`/jewelry?category=${cat.id}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-md bg-secondary"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fittingType="fill"
                  className="absolute inset-0 h-full w-full transition-transform duration-700 ease-lux group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <h3 className="font-display text-xl font-medium">{cat.name}</h3>
                  <motion.p
                    initial={false}
                    className="mt-0.5 text-xs text-white/0 group-hover:text-white/80 transition-colors duration-300"
                  >
                    {cat.blurb}
                  </motion.p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}