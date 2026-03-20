import Link from 'next/link'
import { Star, Quote } from 'lucide-react'
import { reviews } from '@/lib/reviews'

export default function ReviewsSection() {
  const preview = reviews.slice(0, 6)
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">수강생 후기</h2>
          <p className="text-lg text-slate-600">풋볼아이와 함께한 아이들과 학부모님들의 생생한 이야기</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {preview.map((review) => (
            <div key={review.id} className="bg-slate-50 rounded-2xl p-6 relative">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-slate-200" />
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{review.avatar}</div>
                <div>
                  <p className="font-semibold text-slate-900">{review.name}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{review.program}</span>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-colors"
          >
            후기 더 보기
          </Link>
        </div>
      </div>
    </section>
  )
}
