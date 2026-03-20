import Image from 'next/image'
import { MapPin, Phone, Clock, ExternalLink, MessageCircle } from 'lucide-react'
import { LOCATIONS, SITE } from '@/lib/constants'
import type { Metadata } from 'next'

const MAP_IMAGES: Record<string, string> = {
  eungye: '/maps/eungye-map.png',
  baegod: '/maps/baegod-map.jpg',
}

export function generateStaticParams() {
  return LOCATIONS.map((loc) => ({ id: loc.id }))
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const loc = LOCATIONS.find((l) => l.id === params.id)
  if (!loc) return {}
  return {
    title: `${loc.name} | 지점 안내`,
    description: `풋볼아이 ${loc.name} 안내. ${loc.address}. 네이버 예약 가능.`,
    keywords: [`시흥 축구교실 ${loc.name}`, `풋볼아이 ${loc.name}`, `${loc.name} 유소년 축구`],
  }
}

export default function LocationPage({ params }: { params: { id: string } }) {
  const loc = LOCATIONS.find((l) => l.id === params.id)
  if (!loc) return <div className="pt-16 min-h-screen flex items-center justify-center"><p>지점 정보를 찾을 수 없습니다.</p></div>

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: `풋볼아이 ${loc.name}`,
    url: `https://www.footballeye.co.kr/locations/${loc.id}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc.address,
      addressLocality: '시흥시',
      addressRegion: '경기도',
      addressCountry: 'KR',
    },
    telephone: loc.phone,
    openingHours: 'Mo-Sa 10:00-21:00',
  }

  return (
    <div className="pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gradient-to-br from-slate-900 to-green-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-green-300 mb-2">지점 안내</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">풋볼아이 {loc.name}</h1>
          <p className="text-xl text-slate-300">{loc.address}</p>
        </div>
      </div>

      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="rounded-2xl overflow-hidden h-80 mb-6 border border-slate-200 relative">
              {MAP_IMAGES[loc.id] ? (
                <Image
                  src={MAP_IMAGES[loc.id]}
                  alt={`풋볼아이 ${loc.name} 지도`}
                  fill
                  className="object-cover"
                />
              ) : (
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent('풋볼아이 ' + loc.name + ' ' + loc.address)}&output=embed&z=17&hl=ko`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title={`풋볼아이 ${loc.name} 지도`}
              />
              )}
            </div>

            <div className="space-y-4 bg-white border border-slate-100 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">주소</p>
                  <p className="text-slate-900 font-medium">{loc.address}</p>
                  <div className="flex gap-2 mt-2">
                    <a href={loc.mapUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full hover:bg-green-100">
                      네이버 지도
                    </a>
                    <a href={loc.kakaoMapUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full hover:bg-yellow-100">
                      카카오 지도
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">전화번호</p>
                  <a href={`tel:${loc.phone}`} className="text-slate-900 font-medium hover:text-green-600 transition-colors">{loc.phone}</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">운영 시간</p>
                  <p className="text-slate-900 font-medium">{loc.hours}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">체험 수업 예약</h2>
            <div className="space-y-4 mb-8">
              <a
                href={loc.naverBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-green-50 border-2 border-green-200 rounded-2xl hover:border-green-400 transition-colors group"
              >
                <div>
                  <p className="font-bold text-slate-900">네이버 예약으로 신청</p>
                  <p className="text-sm text-slate-500 mt-0.5">실시간 가능 날짜 확인 후 예약</p>
                </div>
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white group-hover:bg-green-700 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
              <a
                href={SITE.kakaoChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-yellow-50 border-2 border-yellow-200 rounded-2xl hover:border-yellow-400 transition-colors group"
              >
                <div>
                  <p className="font-bold text-slate-900">카카오 채널 상담</p>
                  <p className="text-sm text-slate-500 mt-0.5">궁금한 점을 바로 물어보세요</p>
                </div>
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-yellow-900 group-hover:bg-yellow-300 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </div>
              </a>
              <a
                href={SITE.naverTalk}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl hover:border-green-300 transition-colors group"
              >
                <div>
                  <p className="font-bold text-slate-900">네이버 톡톡 상담</p>
                  <p className="text-sm text-slate-500 mt-0.5">네이버로 편리하게 상담</p>
                </div>
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white group-hover:bg-green-600 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </div>
              </a>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 mb-3">시설 안내</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {['전용 훈련 그라운드', '대기실 (학부모용)', '안전 펜스 설치', '주차 공간 완비'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
