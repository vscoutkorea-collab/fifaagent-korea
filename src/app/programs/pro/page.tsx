import { CheckCircle2, MessageCircle, Star } from 'lucide-react'
import { SITE } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '선수반 | 프로그램',
  description: '풋볼아이 선수반. 프로를 목표로 하는 초등·중등부 전문 엘리트 트레이닝. 스페인 유소년 연계.',
  keywords: ['유소년 선수반', '축구 선수 트레이닝', '스페인 유소년 축구', '시흥 선수반'],
}

const tracks = [
  {
    grade: '초등부',
    age: '초등 1~6학년',
    focus: '기본기 완성 + 포지션 발굴',
    schedule: '주 4~5회',
  },
  {
    grade: '중등부',
    age: '중학교 1~3학년',
    focus: '전술 이해 + 체력 강화',
    schedule: '주 5~6회',
  },
]

export default function ProPage() {
  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-orange-900 to-orange-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/30 rounded-full text-orange-200 text-sm font-medium mb-4">
            <Star className="w-3 h-3 fill-current" />
            선수반
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">프로를 향한 길</h1>
          <p className="text-xl text-orange-200 max-w-2xl">
            전문 트레이닝부터 해외 연계까지. 선수의 꿈을 현실로 만들어 드립니다.
          </p>
        </div>
      </div>

      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {tracks.map((track) => (
            <div key={track.grade} className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-orange-900 mb-4">{track.grade}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">대상</span><span className="font-medium text-slate-900">{track.age}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">집중 훈련</span><span className="font-medium text-slate-900">{track.focus}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">훈련 일정</span><span className="font-medium text-slate-900">{track.schedule}</span></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">훈련 프로그램</h2>
            <ul className="space-y-4">
              {[
                '전문 포지션별 심화 훈련',
                '체력·스피드·민첩성 강화',
                '영상 분석을 통한 전술 교육',
                '국내 리그 및 전국 규모 대회 참가',
                '스페인 유소년 클럽 연계 프로그램',
                '진학·진로 컨설팅 지원',
                '개인 맞춤 훈련 로드맵',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">스페인 연계 프로그램</h2>
            <div className="bg-slate-900 rounded-2xl p-6 text-white">
              <div className="text-3xl mb-3">🇪🇸</div>
              <h3 className="font-bold text-lg mb-2">스페인 유소년 클럽 연계</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                선수반 우수 선수를 스페인 유소년 클럽과 연계하여 단기 훈련 및 체류 프로그램을 운영합니다.
                세계 수준의 축구를 직접 경험하세요.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><span className="text-orange-400">✓</span> 스페인 현지 클럽 훈련 참가</li>
                <li className="flex items-center gap-2"><span className="text-orange-400">✓</span> 현지 코치진 지도</li>
                <li className="flex items-center gap-2"><span className="text-orange-400">✓</span> 사전 언어·문화 교육 제공</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-orange-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">선수반 입단 상담</h3>
          <p className="text-orange-100 mb-6">입단 테스트와 상담을 통해 맞춤 훈련 계획을 제공합니다.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={SITE.kakaoChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 text-yellow-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              카카오로 문의
            </a>
            <a
              href={SITE.naverTalk}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-orange-700 font-bold rounded-xl hover:bg-orange-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              네이버 톡톡으로 문의
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
