import Image from 'next/image'
import { CheckCircle2, Award, Globe, Heart } from 'lucide-react'
import { COACHES } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '풋볼아이 소개',
  description: '풋볼아이의 브랜드 스토리, 교육 철학, 코치 소개. 15년 이상의 전문 지도 경력.',
}

const values = [
  { icon: Heart, title: '즐거움', desc: '축구가 즐거워야 실력이 늘고, 인성도 자랍니다.' },
  { icon: Award, title: '전문성', desc: '자격증과 경험을 갖춘 코치진의 체계적인 지도.' },
  { icon: CheckCircle2, title: '체계', desc: '수준별·나이별 맞춤 커리큘럼으로 빠른 성장.' },
  { icon: Globe, title: '글로벌', desc: '스페인 유소년 연계 등 세계와 연결되는 경험.' },
]

export default function AboutPage() {
  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-slate-900 to-green-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">풋볼아이 소개</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            시작은 놀이로, 완성은 교육으로 — 아이의 성장을 함께하는 파트너
          </p>
        </div>
      </div>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">우리의 이야기</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-base">
              <p>
                풋볼아이는 "모든 아이들이 축구를 통해 성장할 수 있다"는 믿음으로 시작되었습니다.
                단순히 기술을 가르치는 것이 아니라, 팀워크·규칙 준수·끈기를 통해 아이의 인성과 자신감을 함께 키웁니다.
              </p>
              <p>
                15년 이상의 지도 경력을 바탕으로 시흥 은계·배곧 두 곳에서 운영 중이며,
                취미반부터 선수반까지 아이의 수준과 목표에 맞는 다양한 프로그램을 제공하고 있습니다.
              </p>
              <p>
                국내 리그 참가부터 스페인 유소년 연계 프로그램까지,
                아이들이 더 넓은 세계를 경험할 수 있도록 문을 열어두고 있습니다.
              </p>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-80 bg-gradient-to-br from-green-100 to-green-50">
            {/* 사진 파일을 /public/about-main.jpg 에 넣으면 자동 표시됩니다 */}
            <Image
              src="/about-main.jpg"
              alt="풋볼아이 훈련 현장"
              fill
              className="object-cover"
              onError={() => {}}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-green-50/80">
              <div className="text-center">
                <div className="text-6xl mb-3">⚽</div>
                <p className="text-green-700 font-semibold">풋볼아이 훈련 현장</p>
                <p className="text-green-500 text-xs mt-1">/public/about-main.jpg 로 교체</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">우리의 가치</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon
              return (
                <div key={v.title} className="text-center p-6 bg-slate-50 rounded-2xl flex flex-col items-center">
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed break-keep">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div id="coaches">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">코치 소개</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COACHES.map((coach) => (
              <div key={coach.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex gap-5">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <Image
                    src={coach.image}
                    alt={coach.name}
                    fill
                    className="object-cover"
                    onError={() => {}}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-3xl">👤</div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{coach.name}</h3>
                  <p className="text-sm text-green-600 font-medium mb-3">{coach.role}</p>
                  <ul className="space-y-1 mb-3">
                    {coach.career.map((c) => (
                      <li key={c} className="text-xs text-slate-500 flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-slate-400 rounded-full flex-shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-slate-600 italic leading-relaxed break-keep">"{coach.message}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
