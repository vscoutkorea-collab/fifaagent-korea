import { CheckCircle, Clock, BookOpen, Award, ChevronRight, Users, FileText } from 'lucide-react'
import type { PageType, RegisteredUser } from '../types'

interface HomePageProps {
  onNavigate: (page: PageType) => void
  currentUser: RegisteredUser | null
}

export default function HomePage({ onNavigate, currentUser }: HomePageProps) {
  const features = [
    {
      icon: <FileText size={28} className="text-blue-600" />,
      title: '실전 모의고사',
      desc: '실제 FIFA 에이전트 시험과 동일한 20문제, 1시간 제한 모의고사',
    },
    {
      icon: <BookOpen size={28} className="text-green-600" />,
      title: '오픈북 지원',
      desc: '시험 중 업로드된 공부자료를 바로 열어볼 수 있는 오픈북 기능',
    },
    {
      icon: <CheckCircle size={28} className="text-purple-600" />,
      title: '즉시 채점 & 해설',
      desc: '시험 완료 후 정답/오답과 상세 해설을 바로 확인',
    },
    {
      icon: <Users size={28} className="text-orange-500" />,
      title: '합격자 커뮤니티',
      desc: '합격 후기, 공부 팁, 학습 자료를 선배 합격자들과 공유',
    },
  ]

  const stats = [
    { value: '95%', label: '모의고사 활용 합격률' },
    { value: '20문제', label: '실전 동일 문항 수' },
    { value: '1시간', label: '실전 동일 시험 시간' },
    { value: '75점', label: '합격 기준점수' },
  ]

  

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-700/50 border border-blue-500/50 rounded-full px-4 py-1.5 text-sm font-medium text-blue-100 mb-6">
            <Award size={14} className="text-yellow-400" />
            <span>한국 No.1 FIFA 에이전트 시험 대비 플랫폼</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            FIFA 에이전트 자격시험,<br />
            <span className="text-yellow-400">모의고사로 완벽 준비</span>
          </h1>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            실전과 동일한 환경의 온라인 모의고사로 FIFA 에이전트 자격시험을 준비하세요.
            오픈북 연습부터 합격의 모든 것을 제공합니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {currentUser?.hasPaidExam ? (
              <button
                onClick={() => onNavigate('exam')}
                className="flex items-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-lg rounded-xl transition-all hover:shadow-lg"
              >
                모의고사 시작하기 <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={() => onNavigate('pricing')}
                className="flex items-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-lg rounded-xl transition-all hover:shadow-lg"
              >
                모의고사 시작하기 <ChevronRight size={20} />
              </button>
            )}
            <button
              onClick={() => onNavigate('study')}
              className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-lg rounded-xl transition-all"
            >
              <BookOpen size={20} />
              커뮤니티 보기
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-blue-700 mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">합격을 위한 모든 기능</h2>
            <p className="text-gray-500 text-lg">FIFA 에이전트 시험에 필요한 모든 것을 한 곳에서</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">시험 안내</h2>
            <p className="text-gray-500">FIFA 에이전트 자격시험의 핵심 정보</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <Clock size={32} className="text-blue-600 mb-3" />
              <h3 className="font-bold text-blue-900 text-lg mb-2">시험 형식</h3>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• 객관식 20문항</li>
                <li>• 제한 시간: 60분</li>
                <li>• 오픈북 허용</li>
                <li>• 합격 기준: 15문제 이상 정답</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
              <BookOpen size={32} className="text-green-600 mb-3" />
              <h3 className="font-bold text-green-900 text-lg mb-2">주요 출제 범위</h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• FIFA 에이전트 규정 (FFAR)</li>
                <li>• 선수 이적 규정 (RSTP)</li>
                <li>• FIFA 윤리 강령</li>
                <li>• 계약 요건 및 수수료 규정</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6">
              <Award size={32} className="text-yellow-600 mb-3" />
              <h3 className="font-bold text-yellow-900 text-lg mb-2">자격 요건</h3>
              <ul className="text-yellow-800 text-sm space-y-1">
                <li>• 학력, 전공, 직업 요건 없음</li>
                <li>• 형사 전과 없음</li>
                <li>• 구단, 클럽, 코치 등 이해관계자는 응시 불가</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-blue-800 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-blue-100 text-lg mb-10">
            공부자료 열람은 무료, 모의고사는 199,000원 단 1회 결제로 이용 가능합니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('study')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-lg rounded-xl transition-all"
            >
              무료 공부자료 보기
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold text-lg rounded-xl transition-all"
            >
              모의고사 구매하기 →
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-white font-bold text-lg mb-1">FIFA에이전트 시험 대비</div>
              <p className="text-sm">FIFA 에이전트 자격증 시험 준비를 위한 온라인 모의고사 플랫폼</p>
            </div>
            <div className="text-sm text-center md:text-right">
              <p>키워드: FIFA 에이전트 | 피파 에이전트 | 축구 에이전트 자격증</p>
              <p className="mt-1">© 2026 FIFA에이전트 시험 대비. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
