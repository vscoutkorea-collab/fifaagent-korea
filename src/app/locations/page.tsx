import Link from 'next/link'
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react'
import { LOCATIONS } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '지점 안내',
  description: '풋볼아이 은계점·배곧점 지점 안내. 시흥 두 곳에서 만나보세요.',
}

export default function LocationsPage() {
  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-slate-900 to-green-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">지점 안내</h1>
          <p className="text-xl text-slate-300">시흥 두 곳에서 풋볼아이를 만나보세요</p>
        </div>
      </div>
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {LOCATIONS.map((loc) => (
            <div key={loc.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-56 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">🏟️</div>
                  <p className="text-green-700 font-semibold">{loc.name}</p>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{loc.name}</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 text-slate-600">
                    <MapPin className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>{loc.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <a href={`tel:${loc.phone}`} className="hover:text-green-600 transition-colors">{loc.phone}</a>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>{loc.hours}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a
                    href={loc.naverBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
                  >
                    네이버 예약
                  </a>
                  <Link
                    href={`/locations/${loc.id}`}
                    className="flex items-center gap-1 px-5 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    상세 정보
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
