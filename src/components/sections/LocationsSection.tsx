import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Clock } from 'lucide-react'
import { LOCATIONS } from '@/lib/constants'

const LOCATION_IMAGES: Record<string, string> = {
  baegod: '/images/baegod-location.jpeg',
  eungye: '/images/eungye-location.jpeg',
  'pro-elementary': '/images/pro-location.jpeg',
  'pro-middle': '/images/pro-location.jpeg',
}

export default function LocationsSection() {
  const regularLocs = LOCATIONS.filter((l) => l.id !== 'pro-elementary' && l.id !== 'pro-middle')
  const proElementary = LOCATIONS.find((l) => l.id === 'pro-elementary')
  const proMiddle = LOCATIONS.find((l) => l.id === 'pro-middle')

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">지점 안내</h2>
          <p className="text-lg text-slate-600">시흥 은계점, 배곧점과 선수반 전용시설에서 만나보세요</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {regularLocs.map((loc) => (
            <div key={loc.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-48 relative overflow-hidden">
                <Image src={LOCATION_IMAGES[loc.id]} alt={loc.name} fill className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-3">{loc.name}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>{loc.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{loc.hours}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${loc.consultPhone}`}
                    className="flex items-center justify-center gap-1.5 flex-1 py-2.5 bg-green-600 text-white font-semibold rounded-xl text-sm hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    상담전화
                  </a>
                  {loc.naverBookingUrl && (
                    <Link
                      href={`/locations/${loc.id}`}
                      className="flex items-center justify-center gap-1.5 flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-200 transition-colors"
                    >
                      체험 수업 예약
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}

          {proElementary && proMiddle && (
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-48 relative overflow-hidden">
                <Image src={LOCATION_IMAGES['pro-elementary']} alt="선수반 전용시설" fill className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-3">선수반 전용시설</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>{proElementary.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{proElementary.hours}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <a
                    href={`tel:${proElementary.consultPhone}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    전화상담 (초등부)
                  </a>
                  <a
                    href={`tel:${proMiddle.consultPhone}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-orange-100 text-orange-700 font-semibold rounded-xl text-sm hover:bg-orange-200 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    전화상담 (중등부)
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
