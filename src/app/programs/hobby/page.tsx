import Link from 'next/link'
import { CheckCircle2, MessageCircle, Calendar, Users, Clock } from 'lucide-react'
import { SITE } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '취미반 | 프로그램',
  description: '풋볼아이 취미반. 7세~초등 6학년 대상. 기초부터 즐겁게 배우는 유소년 축구 프로그램.',
  keywords: ['취미 축구교실', '어린이 축구', '시흥 취미 축구', '유소년 축구'],
}

const details = [
  { icon: Users, label: '대상', value: '만 6세(7세) ~ 초등 6학년' },
  { icon: Clock, label: '수업 시간', value: '주 2~3회, 1시간 30분' },
  { icon: Calendar, label: '모집', value: '연중 수시 모집' },
]

const curriculum = [
  { week: '1~4주', title: '기초 체력 & 볼 감각', items: ['스트레칭·준비운동', '볼 터치·드리블 기초', '즐거운 미니 게임'] },
  { week: '5~8주', title: '패스 & 슈팅', items: ['인사이드·아웃사이드 패스', '슈팅 자세 교정', '2v2 미니 경기'] },
  { week: '9~12주', title: '포지션 이해 & 팀플레이', items: ['공격·수비 기본 개념', '팀 전술 이해', '팀 경기 실전'] },
]

export default function HobbyPage() {
  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block px-3 py-1 bg-blue-500/30 rounded-full text-blue-200 text-sm font-medium mb-4">
            취미반
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">즐겁게 시작하는 축구</h1>
          <p className="text-xl text-blue-200 max-w-2xl">
            처음이어도 괜찮아요. 놀이처럼 즐기면서 자연스럽게 실력이 늘어납니다.
          </p>
        </div>
      </div>

      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {details.map((d) => {
            const Icon = d.icon
            return (
              <div key={d.label} className="bg-blue-50 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{d.label}</p>
                  <p className="font-bold text-slate-900">{d.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">프로그램 특징</h2>
            <ul className="space-y-4">
              {['게임·놀이 중심의 즐거운 수업', '개인 수준에 맞는 맞춤 지도', '기초 기술부터 팀워크까지', '안전하고 체계적인 훈련 환경', '소규모 클래스 (8~12명)'].map((f) => (
                <li key={f} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">커리큘럼</h2>
            <div className="space-y-4">
              {curriculum.map((c) => (
                <div key={c.week} className="border border-blue-100 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">{c.week}</span>
                    <span className="font-semibold text-slate-900">{c.title}</span>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {c.items.map((item) => (
                      <li key={item} className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">무료 체험 수업 신청</h3>
          <p className="text-blue-100 mb-6">첫 수업은 무료로 체험해 보세요. 부담 없이 시작하세요!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={SITE.kakaoChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 text-yellow-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              카카오로 신청
            </a>
            <a
              href={SITE.naverTalk}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              네이버 톡톡으로 신청
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
