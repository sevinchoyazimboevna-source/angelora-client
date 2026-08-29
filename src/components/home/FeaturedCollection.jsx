// @ts-nocheck
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { COLLECTIONS } from "@/data/products";
import Reveal from "@/components/common/Reveal";
import Container from "@/components/layout/Container";
import SectionHeader from "@/components/common/SectionHeader";

// Hardcoded — bosh sahifadagi ajratib ko'rsatilgan kolleksiya, backend'ga bog'liq emas
const collection = COLLECTIONS.find((c) => c.id === "minimal") || COLLECTIONS[0];

export default function FeaturedCollection() {
  return (
    <section className="py-20 lg:py-28">
      <Container size="wide">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <div className="max-w-md">
              <SectionHeader
                eyebrow="Featured Collection"
                title={collection.name}
                description={collection.blurb}
              />
              <Button asChild className="mt-8 h-12 px-8">
                <Link to={`/collections/${collection.id}`}>Discover the collection</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-secondary">
              <Image
                src="/img/fea.jpg"
                alt={collection.name}
                fittingType="fill"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
