import type { Metadata } from 'next'
import ReviewsClient from './ReviewsClient'

export const metadata: Metadata = {
  title: '수강생 후기',
  description: '풋볼아이 수강생과 학부모님들의 생생한 후기. 아이들의 성장 스토리를 확인하세요.',
}

export default function ReviewsPage() {
  return <ReviewsClient />
}
