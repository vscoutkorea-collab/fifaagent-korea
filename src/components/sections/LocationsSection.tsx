import Link from 'next/link'
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react'
import { LOCATIONS } from '@/lib/constants'

export default function LocationsSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">지점 안내</h2>
          <p className="text-lg text-slate-600">시흥 두 곳과 선수반 전용시설에서 만나보세요</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LOCATIONS.map((loc) => (
            <div key={loc.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className={`h-36 flex items-center justify-center ${
                loc.id === 'pro'
                  ? 'bg-gradient-to-br from-orange-100 to-orange-50'
                  : 'bg-gradient-to-br from-green-100 to-green-50'
              }`}>
                <div className="text-center">
                  <div className="text-4xl mb-1">{loc.id === 'pro' ? '⭐' : '🏟️'}</div>
                  <p className={`font-semibold text-sm ${loc.id === 'pro' ? 'text-orange-700' : 'text-green-700'}`}>
                    {loc.name}
                  </p>
                </div>
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

                {loc.id === 'pro' ? (
                  <div className="space-y-2">
                    <a
                      href="tel:010-9159-3339"
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-orange-500 text-white font-semibold rounded-xl text-sm hover:bg-orange-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      초등부 상담전화
                    </a>
                    <a
                      href="tel:010-2669-6967"
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-orange-100 text-orange-700 font-semibold rounded-xl text-sm hover:bg-orange-200 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      중등부 상담전화
                    </a>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <a
                      href={`tel:${loc.consultPhone}`}
                      className="flex items-center justify-center gap-1.5 flex-1 py-2.5 bg-green-600 text-white font-semibold rounded-xl text-sm hover:bg-green-700 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      상담전화
                    </a>
                    {loc.naverBookingUrl && (
                      <a
                        href={loc.naverBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-200 transition-colors"
                      >
                        네이버 예약
                      </a>
                    )}
                    <Link
                      href={`/locations/${loc.id}`}
                      className="flex items-center gap-1 px-3 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
