import { Check, X, ChevronRight, Crown } from 'lucide-react'
import type { PageType, RegisteredUser } from '../types'

interface PricingPageProps {
  onNavigate: (page: PageType) => void
  currentUser: RegisteredUser | null
}

export default function PricingPage({ onNavigate, currentUser }: PricingPageProps) {
  const freeFeatures = [
    '커뮤니티 게시판 열람',
    '합격 후기 & 공부 팁 열람',
    '시험 안내 및 출제 범위 확인',
    'FIFA 공식 자료 링크 제공',
  ]

  const standardFeatures = [
    '실전 모의고사 (20문항, 60분)',
    '오픈북 학습자료 열람 기능',
    'DeepL 번역기 바로가기 제공',
    '즉시 채점',
    '합격/불합격 판정',
    '무제한 반복 응시 가능',
  ]

  const standardNotIncluded = [
    '환불 불가 (서비스 이용 후)',
    '오프라인 강의 포함 안 됨',
  ]

  const premiumFeatures = [
    '실전 모의고사 (20문항, 60분)',
    '오픈북 학습자료 열람 기능',
    'DeepL 번역기 바로가기 제공',
    '즉시 채점',
    '합격/불합격 판정',
    '1년간 무제한 반복 응시',
    '매년 새로운 문제 추가',
  ]

  const premiumNotIncluded = [
    '환불 불가 (서비스 이용 후)',
    '오프라인 강의 포함 안 됨',
  ]

  const handleStartExam = () => {
    if (!currentUser) {
      onNavigate('register')
      return
    }
    if (currentUser.hasPaidExam) {
      onNavigate('exam')
      return
    }
    onNavigate('payment')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">요금 안내</h1>
          <p className="text-gray-500 text-lg">FIFA 에이전트 시험 준비에 필요한 모든 것을 합리적인 가격으로</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* 무료 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="mb-6">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">무료</span>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-5xl font-bold text-gray-900">0원</span>
              </div>
              <p className="text-gray-500 mt-2 text-sm">회원가입 없이 이용 가능</p>
            </div>

            <div className="space-y-3 mb-8">
              {freeFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check size={18} className="text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('study')}
              className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              커뮤니티 바로가기
            </button>
          </div>

          {/* 스탠다드 */}
          <div className="bg-blue-700 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full">
              인기
            </div>

            <div className="mb-6">
              <span className="text-sm font-semibold text-blue-200 uppercase tracking-wider">스탠다드</span>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-5xl font-bold">129,000원</span>
              </div>
              <p className="text-blue-200 mt-2 text-sm">1회 결제, 2026년 피파 에이전트 시험이 끝날 때까지 무제한 반복 응시</p>
            </div>

            <div className="space-y-3 mb-4">
              {standardFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check size={18} className="text-yellow-400 flex-shrink-0" />
                  <span className="text-blue-100 text-sm">{f}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-8">
              {standardNotIncluded.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <X size={18} className="text-blue-400 flex-shrink-0" />
                  <span className="text-blue-300 text-sm">{f}</span>
                </div>
              ))}
            </div>

            {currentUser?.hasPaidExam ? (
              <button
                onClick={() => onNavigate('exam')}
                className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold transition-colors flex items-center justify-center gap-2"
              >
                모의고사 시작하기 <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleStartExam}
                className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold transition-colors flex items-center justify-center gap-2"
              >
                {currentUser ? '지금 결제하기' : '회원가입 후 결제하기'}
                <ChevronRight size={18} />
              </button>
            )}
          </div>

          {/* 프리미엄 */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden border-2 border-yellow-400">
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
              <Crown size={12} /> 프리미엄
            </div>

            <div className="mb-6">
              <span className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">프리미엄</span>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-5xl font-bold">199,000원</span>
              </div>
              <p className="text-gray-300 mt-2 text-sm">1회 결제, 1년간 무제한 반복 응시</p>
            </div>

            <div className="space-y-3 mb-4">
              {premiumFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check size={18} className="text-yellow-400 flex-shrink-0" />
                  <span className="text-gray-200 text-sm">{f}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-8">
              {premiumNotIncluded.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <X size={18} className="text-gray-500 flex-shrink-0" />
                  <span className="text-gray-400 text-sm">{f}</span>
                </div>
              ))}
            </div>

            {currentUser?.hasPaidExam ? (
              <button
                onClick={() => onNavigate('exam')}
                className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold transition-colors flex items-center justify-center gap-2"
              >
                모의고사 시작하기 <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleStartExam}
                className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold transition-colors flex items-center justify-center gap-2"
              >
                {currentUser ? '지금 결제하기' : '회원가입 후 결제하기'}
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">자주 묻는 질문</h2>
          <div className="space-y-6">
            {[
              {
                q: '모의고사는 몇 번이나 응시할 수 있나요?',
                a: '스탠다드 플랜은 2026년 피파 에이전트 시험이 끝날 때까지 무제한 반복 응시할 수 있습니다. 프리미엄 플랜은 영구적으로 무제한 응시 가능하며 매년 새로운 문제가 추가됩니다.',
              },
              {
                q: '오픈북은 어떻게 사용하나요?',
                a: '시험 중 상단의 "오픈북" 버튼을 클릭하면 관리자가 업로드한 학습 자료를 팝업 창으로 확인할 수 있습니다.',
              },
              {
                q: 'DeepL 번역기는 어떻게 사용하나요?',
                a: '시험 중 "번역기" 버튼을 클릭하면 DeepL 번역기가 새 탭에서 열립니다. 영어 문제 해석 시 활용하세요.',
              },
              {
                q: '합격 기준이 어떻게 되나요?',
                a: '20문제 중 15문제(75%) 이상 정답을 맞추면 합격입니다. 실제 FIFA 에이전트 시험과 동일한 기준입니다.',
              },
              {
                q: '결제 후 환불이 가능한가요?',
                a: '서비스 특성상 결제 후 환불은 불가능합니다. 단, 서비스 이용 전(모의고사 미응시 상태)에는 고객센터에 문의해 주세요.',
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <h3 className="font-semibold text-gray-900 mb-2">Q. {faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            궁금한 점이 있으신가요?{' '}
            <a href="mailto:contact@fifaagent-exam.kr" className="text-blue-600 font-medium hover:underline">
              contact@fifaagent-exam.kr
            </a>
            로 문의해 주세요.
          </p>
        </div>
      </div>
    </div>
  )
}
