// @ts-nocheck
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const EASE = [0.22, 1, 0.36, 1];

export default function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden">

      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/angelora5.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/25 via-foreground/10 to-foreground/45" />

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80"
        >
          The Architecture of Radiance
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="mt-5 max-w-4xl font-display text-5xl font-medium leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl"
        >
          Jewelry made to be remembered.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="mt-6 max-w-md text-base text-white/80 leading-relaxed"
        >
          Precision-set diamonds and gold, engineered in our atelier to endure for generations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="h-12 px-8 bg-white text-foreground hover:bg-white/90"
          >
            <Link to="/jewelry">
              Explore Collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 px-8 border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link to="/jewelry?sort=best-selling">
              Best Sellers
            </Link>
          </Button>
        </motion.div>

      </div>
    </section>
  );
}