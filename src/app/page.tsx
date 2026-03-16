import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import ProgramsSection from '@/components/sections/ProgramsSection'
import StatsSection from '@/components/sections/StatsSection'
import ReviewsSection from '@/components/sections/ReviewsSection'
import LocationsSection from '@/components/sections/LocationsSection'
import CTASection from '@/components/sections/CTASection'
import JsonLd from '@/components/ui/JsonLd'

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    name: '풋볼아이 축구교실',
    url: 'https://www.footballeye.co.kr',
    logo: 'https://www.footballeye.co.kr/logo.png',
    description: '시흥 은계·배곧 유소년 축구교실. 취미반·엘리트반·선수반 운영.',
    sport: 'Soccer',
    address: [
      {
        '@type': 'PostalAddress',
        addressLocality: '시흥시',
        addressRegion: '경기도',
        addressCountry: 'KR',
        streetAddress: '은계로 000',
        name: '은계점',
      },
      {
        '@type': 'PostalAddress',
        addressLocality: '시흥시',
        addressRegion: '경기도',
        addressCountry: 'KR',
        streetAddress: '배곧1로 000',
        name: '배곧점',
      },
    ],
    openingHours: 'Mo-Sa 10:00-21:00',
    sameAs: [
      'https://instagram.com/footballeye',
      'https://youtube.com/@footballeye',
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <HeroSection />
      <FeaturesSection />
      <ProgramsSection />
      <StatsSection />
      <ReviewsSection />
      <LocationsSection />
      <CTASection />
    </>
  )
}
