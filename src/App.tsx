import { useState, Suspense, lazy } from 'react'
import type { PageType, ExamResult } from './types'
import Navbar from './components/Navbar'
import { getCurrentUser, setCurrentUser } from './data'
import type { RegisteredUser } from './types'

const HomePage       = lazy(() => import('./pages/HomePage'))
const PricingPage    = lazy(() => import('./pages/PricingPage'))
const StudyPage      = lazy(() => import('./pages/StudyPage'))
const RegisterPage   = lazy(() => import('./pages/RegisterPage'))
const AdminPage      = lazy(() => import('./pages/AdminPage'))
const ExamPage       = lazy(() => import('./pages/ExamPage'))
const ExamResultPage = lazy(() => import('./pages/ExamResultPage'))

function PageSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="spinner" />
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState<PageType>('home')
  const [currentUser, setCurrentUserState] = useState<RegisteredUser | null>(getCurrentUser)
  const [examResult, setExamResult] = useState<ExamResult | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const handleLogin = (user: RegisteredUser) => {
    setCurrentUser(user)
    setCurrentUserState(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentUserState(null)
    setPage('home')
  }

  const handleNavigate = (target: PageType) => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setPage(target)
  }

  const handleExamComplete = (result: ExamResult) => {
    setExamResult(result)
    setPage('exam-result')
  }

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} currentUser={currentUser} />
      case 'pricing':
        return <PricingPage onNavigate={handleNavigate} currentUser={currentUser} />
      case 'study':
        return <StudyPage currentUser={currentUser} />
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} onLogin={handleLogin} />
      case 'admin':
        return (
          <AdminPage
            onAdminLogin={() => setIsAdmin(true)}
            onAdminLogout={() => setIsAdmin(false)}
            onNavigate={handleNavigate}
          />
        )
      case 'exam':
        return <ExamPage onComplete={handleExamComplete} onNavigate={handleNavigate} />
      case 'exam-result':
        return examResult ? (
          <ExamResultPage result={examResult} onNavigate={handleNavigate} />
        ) : (
          <HomePage onNavigate={handleNavigate} currentUser={currentUser} />
        )
      default:
        return <HomePage onNavigate={handleNavigate} currentUser={currentUser} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {page !== 'exam' && (
        <Navbar
          currentPage={page}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onLogout={handleLogout}
          isAdmin={isAdmin}
        />
      )}
      <main className="page-enter">
        <Suspense fallback={<PageSpinner />}>
          {renderPage()}
        </Suspense>
      </main>
    </div>
  )
}
