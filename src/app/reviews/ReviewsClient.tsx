'use client'

import { useState } from 'react'
import { Quote } from 'lucide-react'
import { reviews } from '@/lib/reviews'

const PAGE_SIZE = 6

export default function ReviewsClient() {
  const [visible, setVisible] = useState(PAGE_SIZE)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: reviews.map((r, i) => ({
      '@type': 'Review',
      position: i + 1,
      author: { '@type': 'Person', name: r.name },
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
              <div className="text-3xl font-bold">500+</div>
              <p className="text-slate-400 text-sm mt-1">누적 수강생</p>
            </div>
            <div className="w-px h-12 bg-slate-600" />
            <div className="text-center">
              <div className="text-3xl font-bold">98%</div>
              <p className="text-slate-400 text-sm mt-1">재등록률</p>
            </div>
            <div className="w-px h-12 bg-slate-600" />
            <div className="text-center">
              <div className="text-3xl font-bold">{reviews.length}</div>
              <p className="text-slate-400 text-sm mt-1">네이버 방문자 리뷰</p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, visible).map((review) => (
            <div key={review.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-100" />
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{review.avatar}</div>
                <div>
                  <p className="font-semibold text-slate-900">{review.name}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{review.program}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-3">{review.period}</p>
              <p className="text-slate-700 text-sm leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
        {visible < reviews.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisible((v) => Math.min(v + PAGE_SIZE, reviews.length))}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-colors"
            >
              후기 더 보기 ({visible}/{reviews.length})
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
