import Hero from "@/components/home/Hero";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import BestSellers from "@/components/home/BestSellers";
import NewArrivals from "@/components/home/NewArrivals";
import CollectionBanner from "@/components/home/CollectionBanner";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Lookbook from "@/components/home/Lookbook";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <FeaturedCollection />
      <BestSellers />
      <NewArrivals />
      <CollectionBanner />
      <WhyChooseUs />
      <Lookbook />
      <Newsletter />
    </>
  );
}