import { useState } from 'react'
import { CreditCard, Building2, QrCode, CheckCircle, Clock, ChevronLeft, Copy, ExternalLink } from 'lucide-react'
import type { PageType, RegisteredUser } from '../types'
import { getPaymentSettings, addPaymentRequest, getPaymentRequests } from '../data'

interface PaymentPageProps {
  onNavigate: (page: PageType) => void
  currentUser: RegisteredUser | null
}

const PLANS = {
  standard: { label: '스탠다드', amount: 129000, desc: '2026년 피파 에이전트 시험 종료 시까지 무제한 응시' },
  premium:  { label: '프리미엄', amount: 199000, desc: '1회 결제 영구 무제한 응시 + 매년 새로운 문제 추가' },
}

function formatAmount(n: number) {
  return n.toLocaleString('ko-KR') + '원'
}

export default function PaymentPage({ onNavigate, currentUser }: PaymentPageProps) {
  const settings = getPaymentSettings()
  const [plan, setPlan]             = useState<'standard' | 'premium'>('standard')
  const [depositorName, setDepositorName] = useState(
    currentUser ? `${currentUser.lastName}${currentUser.firstName}` : ''
  )
  const [phone, setPhone]           = useState(currentUser?.phone ?? '')
  const [submitted, setSubmitted]   = useState(false)
  const [copied, setCopied]         = useState(false)

  const myRequests = getPaymentRequests().filter(
    (r) => currentUser && r.phone === currentUser.phone
  )
  const latestReq = myRequests[0]

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = () => {
    if (!depositorName.trim() || !phone.trim()) return
    addPaymentRequest({
      userId: currentUser?.id,
      depositorName: depositorName.trim(),
      phone: phone.trim(),
      plan,
      amount: PLANS[plan].amount,
    })
    setSubmitted(true)
  }

  if (submitted || (latestReq && latestReq.status === 'pending')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">결제 확인 중</h2>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed">
            입금이 확인되면 관리자가 승인합니다.<br />
            승인 후 모의고사를 바로 이용하실 수 있습니다.<br />
            보통 <strong>1~2시간 내</strong> 처리됩니다.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 mb-6">
            <div className="flex justify-between mb-1">
              <span>입금자명</span>
              <span className="font-semibold">{latestReq?.depositorName ?? depositorName}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>플랜</span>
              <span className="font-semibold">{PLANS[latestReq?.plan ?? plan].label}</span>
            </div>
            <div className="flex justify-between">
              <span>금액</span>
              <span className="font-semibold">{formatAmount(latestReq?.amount ?? PLANS[plan].amount)}</span>
            </div>
          </div>
          <button onClick={() => onNavigate('home')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
            홈으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  if (latestReq?.status === 'approved') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">결제 승인 완료!</h2>
          <p className="text-gray-500 mb-6">모의고사를 이용하실 수 있습니다.</p>
          <button onClick={() => onNavigate('exam')}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors">
            모의고사 시작하기
          </button>
        </div>
      </div>
    )
  }

  const hasSettings = settings.bankName || settings.kakaoPayQrImage

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <button onClick={() => onNavigate('pricing')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <ChevronLeft size={16} /> 요금 안내로 돌아가기
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">결제하기</h1>
        <p className="text-gray-500 text-sm mb-8">아래 계좌로 입금 후 신청하시면 승인 후 이용 가능합니다.</p>

        {/* 플랜 선택 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-blue-600" /> 플랜 선택
          </h2>
          <div className="space-y-3">
            {(Object.entries(PLANS) as [keyof typeof PLANS, typeof PLANS[keyof typeof PLANS]][]).map(([key, val]) => (
              <button key={key} onClick={() => setPlan(key)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${plan === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900">{val.label}</span>
                  <span className={`text-lg font-bold ${plan === key ? 'text-blue-600' : 'text-gray-700'}`}>{formatAmount(val.amount)}</span>
                </div>
                <p className="text-xs text-gray-500">{val.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 결제 방법 */}
        {hasSettings ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 size={18} className="text-blue-600" /> 입금 방법
            </h2>

            {/* 카카오페이 */}
            {(settings.kakaoPayQrImage || settings.kakaoPayLink) && (
              <div className="mb-5 pb-5 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <QrCode size={16} className="text-yellow-500" /> 카카오페이 송금
                </p>
                {settings.kakaoPayQrImage && (
                  <div className="flex justify-center mb-3">
                    <img src={settings.kakaoPayQrImage} alt="카카오페이 QR" className="w-48 h-48 object-contain rounded-xl border border-gray-200" />
                  </div>
                )}
                {settings.kakaoPayLink && (
                  <a href={settings.kakaoPayLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-xl font-semibold text-sm transition-colors">
                    <ExternalLink size={15} /> 카카오페이 송금하기
                  </a>
                )}
              </div>
            )}

            {/* 계좌이체 */}
            {settings.bankName && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Building2 size={16} className="text-blue-500" /> 계좌이체
                </p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">은행</span>
                    <span className="font-semibold text-gray-900">{settings.bankName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">계좌번호</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{settings.accountNumber}</span>
                      <button onClick={() => handleCopy(settings.accountNumber)}
                        className="p-1 rounded hover:bg-gray-200 transition-colors">
                        <Copy size={13} className={copied ? 'text-green-500' : 'text-gray-400'} />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">예금주</span>
                    <span className="font-semibold text-gray-900">{settings.accountHolder}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-500">입금액</span>
                    <span className="font-bold text-blue-600 text-base">{formatAmount(PLANS[plan].amount)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4 text-sm text-amber-800">
            관리자가 아직 결제 정보를 설정하지 않았습니다. 잠시 후 다시 확인해 주세요.
          </div>
        )}

        {/* 신청 정보 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-bold text-gray-900 mb-4">입금 신청 정보</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">입금자명 <span className="text-red-500">*</span></label>
              <input value={depositorName} onChange={(e) => setDepositorName(e.target.value)}
                placeholder="실제 입금하신 이름을 입력해 주세요"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연락처 <span className="text-red-500">*</span></label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <button onClick={handleSubmit}
          disabled={!depositorName.trim() || !phone.trim()}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-colors">
          입금 완료 신청하기
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">입금 후 신청하시면 관리자 확인 후 승인됩니다</p>
      </div>
    </div>
  )
}
