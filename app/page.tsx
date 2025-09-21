import { MarketingHeader } from '@/components/marketing/layout/MarketingHeader'
import { MarketingFooter } from '@/components/marketing/layout/MarketingFooter'
import { HeroSection } from '@/components/marketing/sections/HeroSection'
import { FeaturesGrid } from '@/components/marketing/sections/FeaturesGrid'
import { SocialProofSection } from '@/components/marketing/sections/SocialProofSection'
import { PlatformsSection } from '@/components/marketing/sections/PlatformsSection'
import { TestimonialsSection } from '@/components/marketing/sections/TestimonialsSection'
import { PricingPreview } from '@/components/marketing/sections/PricingPreview'
import { CTASection } from '@/components/marketing/sections/CTASection'
import { StatsSection } from '@/components/marketing/sections/StatsSection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />
      
      <main>
        <HeroSection />
        <SocialProofSection />
        <FeaturesGrid />
        <StatsSection />
        <PlatformsSection />
        <TestimonialsSection />
        <PricingPreview />
        <CTASection />
      </main>

      <MarketingFooter />
    </div>
  )
}