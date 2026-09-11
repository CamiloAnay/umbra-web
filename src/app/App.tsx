import { Navbar } from '@/shared/ui/organisms/Navbar.tsx'
import { HeroSection } from '@/sections/HeroSection.tsx'
import { ProjectSection } from '@/sections/ProjectSection.tsx'
import { ExperienceSection } from '@/sections/ExperienceSection.tsx'
import { FooterSection } from '@/sections/FooterSection.tsx'
import { StatsSection } from '@/features/stats/ui/StatsSection.tsx'
import { AmenitiesSection } from '@/features/amenities/ui/AmenitiesSection.tsx'
import { TypologiesSection } from '@/features/typologies/ui/TypologiesSection.tsx'
import { LocationSection } from '@/features/location/ui/LocationSection.tsx'
import { ContactSection } from '@/features/lead/ui/ContactSection.tsx'
import { AdminAmenitiesPage } from '@/features/amenities/ui/admin/AdminAmenitiesPage.tsx'
import { useRoute } from './useRoute.ts'

/**
 * Two views: the landing and the administration panel behind /admin.
 *
 * The landing is a composition of sections and nothing else. Each section that
 * needs data fetches its own, so one slow endpoint never holds up the rest of
 * the page, and removing a section is deleting one line here.
 */
export function App() {
  const { route, navigate } = useRoute()

  if (route === 'admin') {
    return <AdminAmenitiesPage onBack={() => navigate('landing')} />
  }

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProjectSection />
        <StatsSection />
        <AmenitiesSection />
        <TypologiesSection />
        <ExperienceSection />
        <LocationSection />
        <ContactSection />
      </main>
      <FooterSection onAdmin={() => navigate('admin')} />
    </>
  )
}
