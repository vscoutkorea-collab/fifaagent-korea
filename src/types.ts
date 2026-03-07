export type PageType =
  | 'home'
  | 'exam'
  | 'exam-result'
  | 'admin'
  | 'pricing'
  | 'study'
  | 'register'
  | 'payment'
  | 'mypage'

export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number | number[]
  category: string
  explanation: string
  createdAt?: string
}

export interface UserAnswer {
  questionId: string
  selectedAnswer: number | number[] | null   // 단수: number, 복수: number[]
}

export interface ExamResult {
  answers: UserAnswer[]
  questions: Question[]
  score: number
  passed: boolean
  completedAt: string
  timeSpent: number
}

export interface RegisteredUser {
  id: string
  firstName: string
  lastName: string
  phone: string
  age: string
  email: string
  hasPaidExam: boolean
  createdAt: string
  paidPlan?: 'standard' | 'premium'
  paidAt?: string
}

export interface StudyPost {
  id: string
  author: string
  title: string
  content: string
  category: 'tip' | 'resource' | 'experience' | 'question' | 'notice'
  likes: number
  createdAt: string
  comments: StudyComment[]
  pinned?: boolean
}

export interface StudyComment {
  id: string
  author: string
  content: string
  createdAt: string
}

export interface StudyMaterial {
  id: string
  name: string
  type: string
  content: string
  uploadedAt: string
}

export interface PaymentRequest {
  id: string
  userId?: string
  depositorName: string
  phone: string
  plan: 'standard' | 'premium'
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  note?: string
  cashReceiptType?: 'none' | 'personal' | 'business'
  cashReceiptNumber?: string
}

export interface PaymentSettings {
  kakaoPayQrImage: string
  kakaoPayLink: string
  bankName: string
  accountNumber: string
  accountHolder: string
}
