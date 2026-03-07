import { useEffect } from 'react'
import { CheckCircle, Clock, XCircle, User, CreditCard, Building2, Trophy, ChevronRight } from 'lucide-react'
import type { PageType, RegisteredUser } from '../types'
import { getPaymentRequests, getPaymentSettings, getCurrentUser, getUsers, saveUsers, setCurrentUser } from '../data'

interface MyPageProps {
  onNavigate: (page: PageType) => void
  currentUser: RegisteredUser | null
  onLogout: () => void
  onUserRefresh: (user: RegisteredUser) => void
}

const PLAN_LABEL: Record<string, string> = { standard: '스탠다드', premium: '프리미엄' }

function formatAmount(n: number) {
  return n.toLocaleString('ko-KR') + '원'
}

export default function MyPage({ onNavigate, currentUser, onLogout, onUserRefresh }: MyPageProps) {
  useEffect(() => {
    const fresh = getCurrentUser()
    if (!fresh) return

    // 결제 승인됐는데 hasPaidExam이 false인 경우 자동 동기화
    if (!fresh.hasPaidExam) {
      const reqs = getPaymentRequests()
      const approved = reqs.find(
        (r) => r.status === 'approved' && (r.phone === fresh.phone || r.userId === fresh.id)
      )
      if (approved) {
        const updated = { ...fresh, hasPaidExam: true, paidPlan: approved.plan, paidAt: approved.createdAt }
        const allUsers = getUsers()
        saveUsers(allUsers.map((u) => u.id === fresh.id ? updated : u))
        setCurrentUser(updated)
        onUserRefresh(updated)
        return
      }
    }

    onUserRefresh(fresh)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm max-w-sm w-full text-center">
          <User size={40} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h2>
          <p className="text-gray-500 text-sm mb-6">마이페이지를 이용하려면 로그인해 주세요.</p>
          <button onClick={() => onNavigate('register')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
            로그인 / 회원가입
          </button>
        </div>
      </div>
    )
  }

  const settings = getPaymentSettings()
  const myRequests = getPaymentRequests()
    .filter((r) => r.phone === currentUser.phone || r.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const latestReq = myRequests[0]
  const isApproved = currentUser.hasPaidExam

  const statusConfig = {
    pending:  { icon: <Clock size={18} className="text-amber-500" />, label: '입금 확인 중', color: 'bg-amber-100 text-amber-700' },
    approved: { icon: <CheckCircle size={18} className="text-green-500" />, label: '승인 완료', color: 'bg-green-100 text-green-700' },
    rejected: { icon: <XCircle size={18} className="text-red-500" />, label: '거절됨', color: 'bg-red-100 text-red-700' },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">마이페이지</h1>

        {/* 회원 정보 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={28} className="text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{currentUser.lastName}{currentUser.firstName}</p>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
            </div>
            {isApproved && (
              <span className="ml-auto text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                {(currentUser as any).paidPlan === 'premium' ? '프리미엄' : '스탠다드'} 이용 중
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-400 text-xs mb-0.5">연락처</p>
              <p className="font-medium text-gray-900">{currentUser.phone}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-gray-400 text-xs mb-0.5">나이</p>
              <p className="font-medium text-gray-900">{currentUser.age}세</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 col-span-2">
              <p className="text-gray-400 text-xs mb-0.5">가입일</p>
              <p className="font-medium text-gray-900">{new Date(currentUser.createdAt).toLocaleDateString('ko-KR')}</p>
            </div>
          </div>
        </div>

        {/* 이용 상태 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-yellow-500" /> 모의고사 이용 상태
          </h2>
          {isApproved ? (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={20} className="text-green-500" />
                <span className="font-bold text-green-800">이용 중</span>
              </div>
              <div className="space-y-1.5 text-sm text-green-800">
                <div className="flex justify-between">
                  <span>플랜</span>
                  <span className="font-semibold">{PLAN_LABEL[(currentUser as any).paidPlan] ?? '스탠다드'}</span>
                </div>
                {(currentUser as any).paidAt && (
                  <div className="flex justify-between">
                    <span>결제 시작일</span>
                    <span className="font-semibold">{new Date((currentUser as any).paidAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                )}
              </div>
              <button onClick={() => onNavigate('exam')}
                className="mt-4 w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1">
                모의고사 시작 <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-gray-500 text-sm mb-3">
                {latestReq?.status === 'pending' ? '입금 확인 중입니다. 승인 후 이용 가능합니다.' : '아직 모의고사를 구매하지 않았습니다.'}
              </p>
              {!latestReq || latestReq.status === 'rejected' ? (
                <button onClick={() => onNavigate('pricing')}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors">
                  모의고사 구매하기
                </button>
              ) : latestReq.status === 'pending' && (
                <span className="inline-flex items-center gap-1.5 text-amber-600 text-sm font-medium">
                  <Clock size={15} /> 관리자 승인 대기 중
                </span>
              )}
            </div>
          )}
        </div>

        {/* 결제 내역 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-blue-600" /> 결제 내역
          </h2>
          {myRequests.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">결제 내역이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {myRequests.map((req) => {
                const sc = statusConfig[req.status]
                return (
                  <div key={req.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${sc.color}`}>
                        {sc.icon} {sc.label}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between"><span className="text-gray-500">플랜</span><span className="font-semibold">{PLAN_LABEL[req.plan]}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">금액</span><span className="font-semibold text-blue-700">{formatAmount(req.amount)}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">입금자명</span><span className="font-semibold">{req.depositorName}</span></div>
                      {req.cashReceiptType && req.cashReceiptType !== 'none' && (
                        <div className="flex justify-between pt-1.5 border-t border-gray-100">
                          <span className="text-gray-500">현금영수증</span>
                          <span className="font-semibold">{req.cashReceiptType === 'personal' ? '소득공제' : '지출증빙'} · {req.cashReceiptNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 입금 대기 중 계좌 정보 재표시 */}
        {latestReq && latestReq.status === 'pending' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 size={18} className="text-blue-600" /> 입금 계좌 정보
            </h2>
            <div className="bg-blue-50 rounded-xl p-4 space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">은행</span><span className="font-bold text-gray-900">{settings.bankName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">계좌번호</span><span className="font-bold text-gray-900 tracking-wider">{settings.accountNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">예금주</span><span className="font-bold text-gray-900">{settings.accountHolder}</span></div>
              <div className="flex justify-between pt-2 border-t border-blue-200">
                <span className="text-gray-500">입금 금액</span>
                <span className="font-bold text-blue-600 text-base">{formatAmount(latestReq.amount)}</span>
              </div>
            </div>
          </div>
        )}

        <button onClick={onLogout}
          className="w-full py-3 border border-gray-200 text-gray-500 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          로그아웃
        </button>
      </div>
    </div>
  )
}
