import { MessageCircle, Phone, Clock, MapPin } from 'lucide-react'
import { SITE, LOCATIONS } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '상담 신청',
  description: '풋볼아이 상담 신청. 카카오 채널, 네이버 톡톡, 전화로 편하게 문의하세요.',
}

export default function ContactPage() {
  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-slate-900 to-green-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">상담 신청</h1>
          <p className="text-xl text-slate-300">편하신 방법으로 언제든 문의해 주세요</p>
        </div>
      </div>

      <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <a
            href={SITE.kakaoChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 bg-yellow-400 rounded-2xl hover:bg-yellow-300 transition-colors text-center"
          >
            <MessageCircle className="w-12 h-12 text-yellow-900 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-yellow-900 mb-2">카카오 채널 상담</h2>
            <p className="text-yellow-800 text-sm mb-4">가장 빠른 응답을 원하신다면 카카오 채널을 이용해 주세요.</p>
            <span className="inline-block px-6 py-2.5 bg-yellow-900 text-yellow-100 font-semibold rounded-xl group-hover:bg-yellow-800 transition-colors text-sm">
              카카오로 상담하기
            </span>
          </a>

          <a
            href={SITE.naverTalk}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 bg-green-500 rounded-2xl hover:bg-green-400 transition-colors text-center"
          >
            <MessageCircle className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">네이버 톡톡 상담</h2>
            <p className="text-green-100 text-sm mb-4">네이버 계정으로 편리하게 상담하실 수 있습니다.</p>
            <span className="inline-block px-6 py-2.5 bg-white text-green-700 font-semibold rounded-xl group-hover:bg-green-50 transition-colors text-sm">
              네이버 톡톡으로 상담하기
            </span>
          </a>
        </div>

        <div className="bg-slate-50 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            상담 운영시간
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4">
              <p className="font-semibold text-slate-900 mb-1">카카오 채널 / 네이버 톡톡</p>
              <p className="text-slate-600 text-sm">월 ~ 토 10:00 ~ 21:00</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="font-semibold text-slate-900 mb-1">전화 상담</p>
              <p className="text-slate-600 text-sm">월 ~ 토 10:00 ~ 21:00</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">지점별 전화 문의</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {LOCATIONS.map((loc) => (
              <a
                key={loc.id}
                href={`tel:${loc.phone}`}
                className="flex items-center gap-4 p-5 bg-white border border-slate-200 rounded-2xl hover:border-green-300 hover:bg-green-50/30 transition-colors group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{loc.name}</p>
                  <p className="text-green-600 font-mono text-lg">{loc.phone}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3 h-3" />
                    {loc.address}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
