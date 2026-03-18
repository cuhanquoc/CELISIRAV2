import { PageTransition } from "../components/PageTransition";
import { HeroSection } from "../components/HeroSection";
import { CollectionGrid } from "../components/CollectionGrid";
import { TrendingProducts } from "../components/TrendingProducts";
import { BrandStory } from "../components/BrandStory";
import { FeaturedDrop } from "../components/FeaturedDrop";
import { Testimonials } from "../components/Testimonials";
import { Newsletter } from "../components/Newsletter";
import { SiteFooter } from "../components/SiteFooter";

export default function HomePage() {
  return (
    <PageTransition>
      <HeroSection />
      <CollectionGrid />
      <TrendingProducts />
      <BrandStory />
      <FeaturedDrop />
      <Testimonials />
      <Newsletter />
      <SiteFooter />
    </PageTransition>
  );
}
