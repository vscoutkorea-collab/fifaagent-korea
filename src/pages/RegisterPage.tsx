import { useState } from 'react'
import { Eye, EyeOff, CreditCard, Smartphone, CheckCircle } from 'lucide-react'
import type { PageType, RegisteredUser } from '../types'
import { getUsers, saveUsers, setCurrentUser } from '../data'

interface RegisterPageProps {
  onNavigate: (page: PageType) => void
  onLogin: (user: RegisteredUser) => void
}

type Step = 'form' | 'payment' | 'done'

export default function RegisterPage({ onNavigate, onLogin }: RegisterPageProps) {
  const [step, setStep] = useState<Step>('form')
  const [isLogin, setIsLogin] = useState(false)
  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    phone: '',
    age: '',
    email: '',
    password: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<'kakao' | 'card'>('kakao')
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvc: '', name: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null)
  const [wantExam, setWantExam] = useState(true)

  const handleSubmitForm = () => {
    setError('')
    if (!isLogin) {
      if (!form.lastName || !form.firstName || !form.phone || !form.age || !form.email || !form.password) {
        setError('모든 필드를 입력해 주세요.')
        return
      }
      const users = getUsers()
      const exists = users.find((u) => u.email === form.email)
      if (exists) {
        setError('이미 등록된 이메일입니다.')
        return
      }
      if (isNaN(Number(form.age)) || Number(form.age) < 18) {
        setError('만 18세 이상만 가입할 수 있습니다.')
        return
      }
      const newUser: RegisteredUser = {
        id: `u_${Date.now()}`,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        age: form.age,
        email: form.email,
        hasPaidExam: false,
        createdAt: new Date().toISOString(),
      }
      setRegisteredUser(newUser)
      if (wantExam) {
        setStep('payment')
      } else {
        const updatedUsers = [...users, newUser]
        saveUsers(updatedUsers)
        setCurrentUser(newUser)
        onLogin(newUser)
        onNavigate('home')
      }
    } else {
      if (!form.email || !form.password) {
        setError('이메일과 비밀번호를 입력해 주세요.')
        return
      }
      const users = getUsers()
      const user = users.find((u) => u.email === form.email)
      if (!user) {
        setError('등록되지 않은 이메일입니다.')
        return
      }
      setCurrentUser(user)
      onLogin(user)
      onNavigate('home')
    }
  }

  const handlePayment = () => {
    if (!registeredUser) return
    if (paymentMethod === 'card') {
      if (!cardForm.number || !cardForm.expiry || !cardForm.cvc || !cardForm.name) {
        setError('카드 정보를 모두 입력해 주세요.')
        return
      }
    }
    const paidUser: RegisteredUser = { ...registeredUser, hasPaidExam: true }
    const users = getUsers()
    const updatedUsers = [...users, paidUser]
    saveUsers(updatedUsers)
    setCurrentUser(paidUser)
    onLogin(paidUser)
    setStep('done')
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 shadow-sm max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">결제 완료!</h2>
          <p className="text-gray-500 mb-2">
            <span className="font-semibold text-gray-800">{registeredUser?.lastName}{registeredUser?.firstName}</span>님, 결제가 완료되었습니다.
          </p>
          <p className="text-gray-500 mb-8">모의고사를 바로 시작할 수 있습니다.</p>
          <button
            onClick={() => onNavigate('exam')}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors"
          >
            모의고사 시작하기 →
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full mt-3 py-3 text-gray-500 hover:text-gray-700 text-sm"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">결제하기</h1>
            <p className="text-gray-500 mt-2">모의고사 이용권 - 199,000원</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
            <h2 className="font-bold text-gray-900 mb-4">결제 수단 선택</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('kakao')}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  paymentMethod === 'kakao' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                }`}
              >
                <Smartphone size={24} className="text-yellow-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">카카오페이</p>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <CreditCard size={24} className="text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">신용/체크카드</p>
              </button>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-4 space-y-4">
              <h2 className="font-bold text-gray-900">카드 정보</h2>
              <input
                value={cardForm.name}
                onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                placeholder="카드 소유자 이름"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                value={cardForm.number}
                onChange={(e) => setCardForm({ ...cardForm, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                placeholder="카드 번호 (숫자만)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={cardForm.expiry}
                  onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                  placeholder="MM/YY"
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  value={cardForm.cvc}
                  onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                  placeholder="CVC"
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'kakao' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-3">
                <Smartphone size={24} className="text-yellow-600" />
                <div>
                  <p className="font-semibold text-gray-900">카카오페이로 결제</p>
                  <p className="text-sm text-gray-600 mt-0.5">아래 버튼을 클릭하면 카카오페이 결제가 진행됩니다.</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>모의고사 이용권</span>
              <span>199,000원</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex items-center justify-between font-bold text-gray-900">
              <span>총 결제금액</span>
              <span className="text-blue-700 text-lg">199,000원</span>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4 px-1">{error}</p>}

          <button
            onClick={handlePayment}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-colors"
          >
            {paymentMethod === 'kakao' ? '카카오페이로 199,000원 결제' : '카드로 199,000원 결제'}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">결제 완료 후 즉시 모의고사 이용이 가능합니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{isLogin ? '로그인' : '회원가입'}</h1>
          <p className="text-gray-500 mt-2">
            {isLogin ? '계정에 로그인하여 서비스를 이용하세요' : 'FIFA 에이전트 시험 대비를 시작하세요'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-4">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">성</label>
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    placeholder="홍"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    placeholder="길동"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="010-0000-0000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
                <input
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="만 18세 이상"
                  type="number"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@email.com"
              type="email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <div className="relative">
              <input
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="비밀번호"
                type={showPassword ? 'text' : 'password'}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wantExam}
                  onChange={(e) => setWantExam(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-blue-600"
                />
                <div>
                  <span className="font-medium text-gray-900 text-sm">모의고사 이용권 구매 (199,000원)</span>
                  <p className="text-xs text-gray-500 mt-0.5">회원가입 후 바로 결제를 진행합니다. 체크 해제 시 회원가입만 됩니다.</p>
                </div>
              </label>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSubmitForm}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
          >
            {isLogin ? '로그인' : wantExam ? '회원가입 후 결제하기' : '회원가입'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}{' '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError('') }}
            className="text-blue-600 font-medium hover:underline"
          >
            {isLogin ? '회원가입' : '로그인'}
          </button>
        </p>
      </div>
    </div>
  )
}
