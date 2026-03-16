import { Star, Quote } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '수강생 후기',
  description: '풋볼아이 수강생과 학부모님들의 생생한 후기. 아이들의 성장 스토리를 확인하세요.',
}

const reviews = [
  { id: 1, name: '김민준 학부모', program: '취미반', location: '은계점', rating: 5, period: '6개월째 수강 중', text: '처음엔 축구에 관심이 없던 아이가 이제는 주말에 빨리 수업 가고 싶다고 할 정도로 좋아해요. 코치님들이 정말 열정적으로 지도해 주세요!', avatar: '👦' },
  { id: 2, name: '이서연 학부모', program: '엘리트반', location: '배곧점', rating: 5, period: '1년째 수강 중', text: '분기별로 성장 리포트를 받으니까 아이가 어떻게 발전하고 있는지 구체적으로 알 수 있어서 너무 좋아요. 다른 친구들한테도 적극 추천해요!', avatar: '👧' },
  { id: 3, name: '박현우 학부모', program: '선수반', location: '은계점', rating: 5, period: '2년째 수강 중', text: '선수반 들어온 후 실력이 눈에 띄게 늘었어요. 코치님이 장점은 살려주고 약점은 꼼꼼히 잡아주세요. 스페인 프로그램도 기대됩니다!', avatar: '👦' },
  { id: 4, name: '최지현 학부모', program: '취미반', location: '배곧점', rating: 5, period: '3개월째 수강 중', text: '학원 다니는 게 처음이라 걱정했는데 코치님들이 너무 친절하게 케어해 주셔서 아이도 금방 적응했어요. 시설도 깨끗하고 안전해요.', avatar: '👧' },
  { id: 5, name: '정태양 학부모', program: '엘리트반', location: '은계점', rating: 5, period: '8개월째 수강 중', text: '무료 체험 수업이 있어서 부담 없이 시작할 수 있었어요. 체험 때부터 전문적인 코칭을 받아서 바로 등록했습니다. 아이가 너무 좋아해요!', avatar: '👦' },
  { id: 6, name: '강소율 학부모', program: '취미반', location: '배곧점', rating: 5, period: '5개월째 수강 중', text: '카카오 채널로 언제든 질문할 수 있어서 학부모 입장에서 소통이 편해요. 수업 내용도 사진으로 공유해 주셔서 안심이 됩니다.', avatar: '👧' },
  { id: 7, name: '윤재원 학부모', program: '선수반', location: '은계점', rating: 5, period: '1년 6개월째 수강 중', text: '선발 절차부터 입단 후 훈련까지 모든 게 체계적이에요. 아이가 목표의식이 생겨서 공부도 더 열심히 하더라고요. 정말 감사합니다.', avatar: '👦' },
  { id: 8, name: '한미래 학부모', program: '엘리트반', location: '배곧점', rating: 5, period: '4개월째 수강 중', text: '대회 참가 경험이 아이에게 정말 소중한 추억이 됐어요. 이기고 지는 것보다 함께하는 과정에서 많이 성장하는 것 같아요.', avatar: '👧' },
]

export default function ReviewsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: reviews.map((r, i) => ({
      '@type': 'Review',
      position: i + 1,
      author: { '@type': 'Person', name: r.name },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.text,
      itemReviewed: { '@type': 'SportsOrganization', name: '풋볼아이 축구교실' },
    })),
  }

  return (
    <div className="pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bg-gradient-to-br from-slate-900 to-green-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">수강생 후기</h1>
          <p className="text-xl text-slate-300">풋볼아이와 함께한 아이들과 학부모님들의 이야기</p>
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold">4.9</div>
              <div className="flex justify-center gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-slate-400 text-sm mt-1">평균 평점</p>
            </div>
            <div className="w-px h-12 bg-slate-600" />
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <p className="text-slate-400 text-sm mt-1">누적 수강생</p>
            </div>
            <div className="w-px h-12 bg-slate-600" />
            <div className="text-center">
              <div className="text-3xl font-bold">98%</div>
              <p className="text-slate-400 text-sm mt-1">재등록률</p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-100" />
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{review.avatar}</div>
                <div>
                  <p className="font-semibold text-slate-900">{review.name}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{review.program}</span>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{review.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-1">
                {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-xs text-slate-400 mb-3">{review.period}</p>
              <p className="text-slate-700 text-sm leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
