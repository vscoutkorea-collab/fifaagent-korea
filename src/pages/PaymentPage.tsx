import { useState } from 'react'
import { Building2, CheckCircle, Clock, ChevronLeft, ChevronRight, Receipt } from 'lucide-react'
import type { PageType, RegisteredUser } from '../types'
import { getPaymentSettings, addPaymentRequest, getPaymentRequests } from '../data'

interface PaymentPageProps {
  onNavigate: (page: PageType) => void
  currentUser: RegisteredUser | null
}

const PLANS = {
  standard: { label: '스탠다드', amount: 129000, desc: '2026년 피파 에이전트 시험 종료 시까지 무제한 응시' },
  premium:  { label: '프리미엄', amount: 199000, desc: '1회 결제 1년간 무제한 응시 + 매년 새로운 문제 추가' },
}

function formatAmount(n: number) {
  return n.toLocaleString('ko-KR') + '원'
}

export default function PaymentPage({ onNavigate, currentUser }: PaymentPageProps) {
  const settings = getPaymentSettings()
  const [step, setStep] = useState<'plan' | 'account' | 'info' | 'done'>('plan')
  const [plan, setPlan] = useState<'standard' | 'premium'>('standard')
  const [depositorName, setDepositorName] = useState(
    currentUser ? `${currentUser.lastName}${currentUser.firstName}` : ''
  )
  const [phone, setPhone] = useState(currentUser?.phone ?? '')
  const [cashReceiptType, setCashReceiptType] = useState<'none' | 'personal' | 'business'>('none')
  const [cashReceiptNumber, setCashReceiptNumber] = useState('')
  const [copied, setCopied] = useState(false)

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
    if (cashReceiptType !== 'none' && !cashReceiptNumber.trim()) return
    addPaymentRequest({
      userId: currentUser?.id,
      depositorName: depositorName.trim(),
      phone: phone.trim(),
      plan,
      amount: PLANS[plan].amount,
      cashReceiptType,
      cashReceiptNumber: cashReceiptType !== 'none' ? cashReceiptNumber.trim() : undefined,
    })
    setStep('done')
  }

  // 이미 대기중/승인된 경우
  if (latestReq && latestReq.status === 'pending' && step !== 'done') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">입금 확인 중</h2>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed">
            입금이 확인되면 관리자가 승인합니다.<br />
            승인 후 모의고사를 바로 이용하실 수 있습니다.<br />
            보통 <strong>1~2시간 내</strong> 처리됩니다.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 mb-6 space-y-1.5 text-left">
            <div className="flex justify-between"><span>입금자명</span><span className="font-semibold">{latestReq.depositorName}</span></div>
            <div className="flex justify-between"><span>플랜</span><span className="font-semibold">{PLANS[latestReq.plan].label}</span></div>
            <div className="flex justify-between"><span>금액</span><span className="font-semibold">{formatAmount(latestReq.amount)}</span></div>
            {latestReq.cashReceiptType && latestReq.cashReceiptType !== 'none' && (
              <div className="flex justify-between pt-1.5 border-t border-gray-200">
                <span>현금영수증</span>
                <span className="font-semibold">{latestReq.cashReceiptType === 'personal' ? '소득공제' : '지출증빙'} · {latestReq.cashReceiptNumber}</span>
              </div>
            )}
          </div>
          <button onClick={() => onNavigate('mypage')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors mb-2">
            마이페이지에서 결제상태 확인
          </button>
          <button onClick={() => onNavigate('home')}
            className="w-full py-3 border border-gray-200 text-gray-600 rounded-xl font-medium text-sm transition-colors hover:bg-gray-50">
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

  // Step: 완료
  if (step === 'done') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">입금 신청 완료!</h2>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed">
            입금 확인 후 관리자가 승인합니다.<br />
            보통 <strong>1~2시간 내</strong> 처리됩니다.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 mb-6 space-y-1.5 text-left">
            <div className="flex justify-between"><span>입금자명</span><span className="font-semibold">{depositorName}</span></div>
            <div className="flex justify-between"><span>플랜</span><span className="font-semibold">{PLANS[plan].label}</span></div>
            <div className="flex justify-between"><span>금액</span><span className="font-semibold text-blue-600">{formatAmount(PLANS[plan].amount)}</span></div>
            {cashReceiptType !== 'none' && (
              <div className="flex justify-between pt-1.5 border-t border-gray-200">
                <span>현금영수증</span>
                <span className="font-semibold">{cashReceiptType === 'personal' ? '소득공제' : '지출증빙'} · {cashReceiptNumber}</span>
              </div>
            )}
          </div>
          <button onClick={() => onNavigate('mypage')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors mb-2">
            마이페이지에서 결제상태 확인
          </button>
          <button onClick={() => onNavigate('home')}
            className="w-full py-3 border border-gray-200 text-gray-600 rounded-xl font-medium text-sm transition-colors hover:bg-gray-50">
            홈으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <button onClick={() => step === 'plan' ? onNavigate('pricing') : setStep(step === 'account' ? 'plan' : 'account')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <ChevronLeft size={16} /> {step === 'plan' ? '요금 안내로 돌아가기' : '이전 단계'}
        </button>

        {/* 단계 표시 */}
        <div className="flex items-center gap-2 mb-8">
          {['플랜 선택', '계좌 확인', '신청 정보'].map((label, i) => {
            const stepKeys = ['plan', 'account', 'info'] as const
            const active = stepKeys[i] === step
            const done = stepKeys.indexOf(step) > i
            return (
              <div key={label} className="flex items-center gap-2">
                {i > 0 && <div className={`flex-1 h-px w-8 ${done ? 'bg-blue-500' : 'bg-gray-200'}`} />}
                <div className={`flex items-center gap-1.5 text-sm font-medium ${active ? 'text-blue-600' : done ? 'text-green-600' : 'text-gray-400'}`}>
                  <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${active ? 'bg-blue-600 text-white' : done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {done ? '✓' : i + 1}
                  </span>
                  {label}
                </div>
              </div>
            )
          })}
        </div>

        {/* Step 1: 플랜 선택 */}
        {step === 'plan' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">플랜을 선택해 주세요</h1>
            <div className="space-y-3 mb-8">
              {(Object.entries(PLANS) as [keyof typeof PLANS, typeof PLANS[keyof typeof PLANS]][]).map(([key, val]) => (
                <button key={key} onClick={() => setPlan(key)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${plan === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900 text-lg">{val.label}</span>
                    <span className={`text-xl font-bold ${plan === key ? 'text-blue-600' : 'text-gray-700'}`}>{formatAmount(val.amount)}</span>
                  </div>
                  <p className="text-sm text-gray-500">{val.desc}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setStep('account')}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
              다음 — 계좌 확인 <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Step 2: 계좌 확인 */}
        {step === 'account' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">아래 계좌로 입금해 주세요</h1>
            <p className="text-gray-500 text-sm mb-6">입금 후 다음 단계에서 신청해 주세요.</p>

            <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={20} className="text-blue-600" />
                <h2 className="font-bold text-gray-900">입금 계좌 정보</h2>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">은행</span>
                  <span className="font-bold text-gray-900 text-lg">{settings.bankName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">계좌번호</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-lg tracking-wider">{settings.accountNumber}</span>
                    <button onClick={() => handleCopy(settings.accountNumber)}
                      className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium transition-colors">
                      {copied ? '복사됨!' : '복사'}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">예금주</span>
                  <span className="font-bold text-gray-900">{settings.accountHolder}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                  <span className="text-sm text-gray-500">입금 금액</span>
                  <span className="font-bold text-blue-600 text-xl">{formatAmount(PLANS[plan].amount)}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
              <strong>주의:</strong> 입금자명을 정확히 입력해 주세요. 다음 단계에서 입력한 이름으로 입금 확인이 진행됩니다.
            </div>

            <button onClick={() => setStep('info')}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
              입금했어요 — 신청 진행 <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Step 3: 신청 정보 */}
        {step === 'info' && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">입금 신청 정보를 입력해 주세요</h1>

            {/* 요약 */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 flex justify-between text-sm">
              <span className="text-gray-600">선택 플랜</span>
              <span className="font-bold text-blue-700">{PLANS[plan].label} · {formatAmount(PLANS[plan].amount)}</span>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm mb-4 space-y-4">
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

            {/* 현금영수증 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Receipt size={18} className="text-green-600" /> 현금영수증 신청
              </h2>
              <div className="space-y-3">
                {([
                  { value: 'none', label: '신청 안 함' },
                  { value: 'personal', label: '소득공제 (개인 주민등록번호 / 휴대폰 번호)' },
                  { value: 'business', label: '지출증빙 (사업자등록번호)' },
                ] as const).map((opt) => (
                  <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
                    <input type="radio" name="cashReceipt" value={opt.value}
                      checked={cashReceiptType === opt.value}
                      onChange={() => setCashReceiptType(opt.value)}
                      className="mt-0.5 accent-blue-600" />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
              {cashReceiptType !== 'none' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {cashReceiptType === 'personal' ? '주민등록번호 또는 휴대폰 번호' : '사업자등록번호'} <span className="text-red-500">*</span>
                  </label>
                  <input value={cashReceiptNumber} onChange={(e) => setCashReceiptNumber(e.target.value)}
                    placeholder={cashReceiptType === 'personal' ? '010-0000-0000' : '000-00-00000'}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
            </div>

            <button onClick={handleSubmit}
              disabled={!depositorName.trim() || !phone.trim() || (cashReceiptType !== 'none' && !cashReceiptNumber.trim())}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-colors">
              입금 완료 신청하기
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">입금 후 신청하시면 관리자 확인 후 승인됩니다</p>
          </>
        )}
      </div>
    </div>
  )
}
