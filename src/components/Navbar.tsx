import { useState } from 'react'
import type { PageType } from '../types'
import type { RegisteredUser } from '../types'
import { Menu, X, Trophy, ChevronDown, FlaskConical } from 'lucide-react'

interface NavbarProps {
  currentPage: PageType
  onNavigate: (page: PageType) => void
  currentUser: RegisteredUser | null
  onLogout: () => void
  isAdmin: boolean
}

export default function Navbar({ currentPage, onNavigate, currentUser, onLogout, isAdmin }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navItems: { label: string; page: PageType }[] = [
    { label: '홈', page: 'home' },
    { label: '요금안내', page: 'pricing' },
    { label: '커뮤니티', page: 'study' },
    { label: '관리자', page: 'admin' },
  ]

  const canAccessExam = currentUser?.hasPaidExam || isAdmin

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 font-bold text-xl text-blue-700 hover:text-blue-800"
          >
            <Trophy size={24} className="text-yellow-500" />
            <span>FIFA에이전트 시험</span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === item.page
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => onNavigate('exam')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm font-medium transition-colors"
              >
                <FlaskConical size={14} />
                모의고사 미리보기
              </button>
            )}

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700"
                >
                  <span>{currentUser.lastName}{currentUser.firstName}님</span>
                  {currentUser.hasPaidExam && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">이용 중</span>
                  )}
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                    {canAccessExam && (
                      <button
                        onClick={() => { onNavigate('exam'); setUserMenuOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        모의고사 시작
                      </button>
                    )}
                    {!currentUser.hasPaidExam && !isAdmin && (
                      <button
                        onClick={() => { onNavigate('pricing'); setUserMenuOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        모의고사 구매하기
                      </button>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={() => { onLogout(); setUserMenuOpen(false) }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  로그인
                </button>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                >
                  시작하기
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => { onNavigate(item.page); setMobileOpen(false) }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium ${
                currentPage === item.page ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            {isAdmin && (
              <button
                onClick={() => { onNavigate('exam'); setMobileOpen(false) }}
                className="w-full px-4 py-3 rounded-lg bg-purple-100 text-purple-700 text-sm font-medium flex items-center gap-2"
              >
                <FlaskConical size={15} /> 모의고사 미리보기 (관리자)
              </button>
            )}
            {currentUser ? (
              <>
                <p className="px-4 py-2 text-sm text-gray-500">{currentUser.lastName}{currentUser.firstName}님</p>
                {canAccessExam && !isAdmin && (
                  <button
                    onClick={() => { onNavigate('exam'); setMobileOpen(false) }}
                    className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium"
                  >
                    모의고사 시작
                  </button>
                )}
                <button
                  onClick={() => { onLogout(); setMobileOpen(false) }}
                  className="w-full px-4 py-3 rounded-lg text-red-600 text-sm font-medium hover:bg-red-50"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <button
                onClick={() => { onNavigate('register'); setMobileOpen(false) }}
                className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium"
              >
                회원가입 / 로그인
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
