import Link from 'next/link'
import { Phone, MessageCircle, MapPin, Clock, Instagram, Youtube } from 'lucide-react'
import { SITE, LOCATIONS } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">FE</span>
              </div>
              <span className="font-bold text-xl text-white">{SITE.name}</span>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">{SITE.slogan}</p>
            <div className="flex items-center gap-3">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 rounded-lg hover:bg-green-600 transition-colors"
                aria-label="인스타그램"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SITE.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 rounded-lg hover:bg-red-600 transition-colors"
                aria-label="유튜브"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">프로그램</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/programs/hobby" className="hover:text-green-400 transition-colors">취미반</Link></li>
              <li><Link href="/programs/elite" className="hover:text-green-400 transition-colors">엘리트반</Link></li>
              <li><Link href="/programs/pro" className="hover:text-green-400 transition-colors">선수반</Link></li>
              <li><Link href="/about" className="hover:text-green-400 transition-colors">풋볼아이 소개</Link></li>
              <li><Link href="/reviews" className="hover:text-green-400 transition-colors">수강생 후기</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">지점 안내</h3>
            <div className="space-y-4">
              {LOCATIONS.map((loc) => (
                <div key={loc.id}>
                  <p className="text-white text-sm font-medium mb-1">{loc.name}</p>
                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{loc.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 flex-shrink-0" />
                      <a href={`tel:${loc.phone}`} className="hover:text-green-400 transition-colors">{loc.phone}</a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span>{loc.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">상담 문의</h3>
            <div className="space-y-3">
              <a
                href={SITE.kakaoChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-yellow-900 rounded-lg text-sm font-medium hover:bg-yellow-300 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                카카오 채널 상담
              </a>
              <a
                href={SITE.naverTalk}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                네이버 톡톡 상담
              </a>
              <p className="text-xs text-slate-500">상담 운영시간: 10:00 ~ 21:00</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2024 풋볼아이. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/faq" className="hover:text-slate-300 transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">상담 신청</Link>
            <Link href="/portal" className="hover:text-slate-300 transition-colors">학부모 포털</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
