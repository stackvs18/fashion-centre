import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCatalogGrid } from "@/components/home/FeaturedCatalogGrid";
import { FeaturedBanner } from "@/components/home/FeaturedBanner";
import { ReelsSection } from "@/components/home/ReelsSection";
import { CoinAnimationWrapper } from "@/components/home/CoinAnimationWrapper";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCatalogGrid />
      <FeaturedBanner />
      <CoinAnimationWrapper />
      <ReelsSection />
    </>
  );
}
