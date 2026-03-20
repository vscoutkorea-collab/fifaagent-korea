import Link from 'next/link'
import { CheckCircle2, MessageCircle, Calendar, Users, Clock, Trophy } from 'lucide-react'
import { SITE } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '엘리트반 | 프로그램',
  description: '풋볼아이 엘리트반. 초등 3학년~중학교. 체계적인 훈련과 대회 참가로 실력을 키우는 프로그램.',
  keywords: ['엘리트 축구교실', '어린이 축구 대회', '시흥 엘리트 축구', '유소년 엘리트'],
}

const details = [
  { icon: Users, label: '대상', value: '초등 3학년 ~ 중학교' },
  { icon: Clock, label: '수업 시간', value: '주 2~3회, 90분' },
  { icon: Trophy, label: '대회 참가', value: '지역 리그 & 지역 대회' },
  { icon: Calendar, label: '모집', value: '연중 수시 모집' },
]

export default function ElitePage() {
  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-green-900 to-green-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block px-3 py-1 bg-green-500/30 rounded-full text-green-200 text-sm font-medium mb-4">
            엘리트반
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">한 단계 위의 축구</h1>
          <p className="text-xl text-green-200 max-w-2xl">
            체계적인 기본기 훈련과 실전 대회로 진짜 실력을 키웁니다.
          </p>
        </div>
      </div>

      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {details.map((d) => {
            const Icon = d.icon
            return (
              <div key={d.label} className="bg-green-50 rounded-2xl p-5 flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">{d.label}</p>
                  <p className="font-bold text-slate-900 text-sm">{d.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">프로그램 특징</h2>
            <ul className="space-y-4">
              {[
                '포지션별 전문 기술 훈련',
                '팀 전술·전략 체계적 교육',
                '지역 리그 및 전국 대회 참가',
                '분기별 개인 성장 리포트 제공',
                '동영상 분석을 통한 피드백',
                '체력 관리 프로그램 포함',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">성장 리포트</h2>
            <div className="bg-slate-50 rounded-2xl p-6">
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                매 분기 코치가 직접 작성한 아이의 성장 리포트를 학부모님께 제공합니다.
                기술 향상도, 태도, 개선 포인트를 구체적으로 확인하세요.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['드리블 능력', '패스 정확도', '슈팅 파워', '팀워크', '체력', '집중력'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${60 + Math.random() * 30}%` }} />
                    </div>
                    <span className="text-xs text-slate-600 w-16">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3">* 예시 리포트입니다</p>
            </div>
          </div>
        </div>

        <div className="bg-green-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">상담 및 체험 신청</h3>
          <p className="text-green-100 mb-6">현재 실력을 코치가 직접 평가하고 맞춤 상담을 제공합니다.</p>
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
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors"
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
