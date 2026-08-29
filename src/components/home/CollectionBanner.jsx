// @ts-nocheck
import { Link } from "react-router-dom";
import Reveal from "@/components/common/Reveal";
import { Button } from "@/components/ui/button";

export default function CollectionBanner() {
  return (
    <section className="px-5 sm:px-8 lg:px-12">
      <Reveal>
        <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden rounded-md">

          {/* Background Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source
              src="/videos/angelora8.mp4"
              type="video/mp4"
            />
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/55 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 text-white sm:px-16 lg:px-20">

            <h2 className="max-w-xl font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
              Timeless pieces. Modern elegance.
            </h2>

            <p className="mt-4 max-w-sm text-white/80">
              An edit of our most enduring designs — quietly luxurious,
              made to be lived in.
            </p>

            <div className="mt-8">
              <Button
                asChild
                className="h-12 px-8 bg-white text-foreground hover:bg-white/90"
              >
                <Link to="/collections">
                  Explore Collection
                </Link>
              </Button>
            </div>

          </div>
        </div>
      </Reveal>
    </section>
  );
}