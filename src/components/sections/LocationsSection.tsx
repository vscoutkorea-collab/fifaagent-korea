import Link from 'next/link'
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react'
import { LOCATIONS } from '@/lib/constants'

export default function LocationsSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">지점 안내</h2>
          <p className="text-lg text-slate-600">시흥 두 곳에서 만나보세요</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LOCATIONS.map((loc) => (
            <div key={loc.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-2">🏟️</div>
                  <p className="text-green-700 font-semibold">{loc.name} 시설</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{loc.name}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>{loc.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <a href={`tel:${loc.phone}`} className="hover:text-green-600 transition-colors">{loc.phone}</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{loc.hours}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a
                    href={loc.naverBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2.5 bg-green-600 text-white font-semibold rounded-xl text-sm hover:bg-green-700 transition-colors"
                  >
                    네이버 예약
                  </a>
                  <Link
                    href={`/locations/${loc.id}`}
                    className="flex items-center gap-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors"
                  >
                    상세 정보
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
