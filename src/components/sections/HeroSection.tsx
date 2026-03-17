import Link from 'next/link'
import { ChevronRight, Star } from 'lucide-react'
import { SITE } from '@/lib/constants'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-green-950 to-slate-900">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            시흥 No.1 유소년 축구교실
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            <span className="text-green-400">{SITE.slogan.split(',')[0]},</span>
            <br />
            {SITE.slogan.split(',')[1]}
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed">
            보여주기식 훈련이 아닌, 성장에 집중한 체계적인 프로그램을 제공합니다.<br className="hidden sm:block" />
            취미반 · 엘리트반 · 선수반 — 아이에게 맞는 반을 찾아보세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold text-lg rounded-xl hover:bg-green-400 transition-all hover:scale-105 shadow-lg shadow-green-500/30"
            >
              무료 체험 신청하기
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold text-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              프로그램 알아보기
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {[
              { label: '누적 수강생', value: '500+명' },
              { label: '지도 경력', value: '15년+' },
              { label: '운영 지점', value: '2개' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-green-400">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40C1200 0 240 80 0 40L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
