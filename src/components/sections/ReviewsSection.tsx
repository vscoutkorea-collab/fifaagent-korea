import Link from 'next/link'
import { Star, Quote } from 'lucide-react'

const reviews = [
  {
    id: 1,
    name: '김민준 학부모',
    program: '취미반',
    rating: 5,
    text: '처음엔 축구에 관심이 없던 아이가 이제는 주말에 빨리 수업 가고 싶다고 할 정도로 좋아해요. 코치님들이 정말 열정적으로 지도해 주세요!',
    avatar: '👦',
  },
  {
    id: 2,
    name: '이서연 학부모',
    program: '엘리트반',
    rating: 5,
    text: '분기별로 성장 리포트를 받으니까 아이가 어떻게 발전하고 있는지 구체적으로 알 수 있어서 너무 좋아요. 다른 친구들한테도 적극 추천해요!',
    avatar: '👧',
  },
  {
    id: 3,
    name: '박현우 학부모',
    program: '선수반',
    rating: 5,
    text: '선수반 들어온 후 실력이 눈에 띄게 늘었어요. 코치님이 장점은 살려주고 약점은 꼼꼼히 잡아주세요. 스페인 프로그램도 기대됩니다!',
    avatar: '👦',
  },
  {
    id: 4,
    name: '최지현 학부모',
    program: '취미반',
    rating: 5,
    text: '학원 다니는 게 처음이라 걱정했는데 코치님들이 너무 친절하게 케어해 주셔서 아이도 금방 적응했어요. 시설도 깨끗하고 안전해요.',
    avatar: '👧',
  },
  {
    id: 5,
    name: '정태양 학부모',
    program: '엘리트반',
    rating: 5,
    text: '무료 체험 수업이 있어서 부담 없이 시작할 수 있었어요. 체험 때부터 전문적인 코칭을 받아서 바로 등록했습니다. 아이가 너무 좋아해요!',
    avatar: '👦',
  },
  {
    id: 6,
    name: '강소율 학부모',
    program: '취미반',
    rating: 5,
    text: '카카오 채널로 언제든 질문할 수 있어서 학부모 입장에서 소통이 편해요. 수업 내용도 사진으로 공유해 주셔서 안심이 됩니다.',
    avatar: '👧',
  },
]

export default function ReviewsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">수강생 후기</h2>
          <p className="text-lg text-slate-600">풋볼아이와 함께한 아이들과 학부모님들의 생생한 이야기</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {reviews.map((review) => (
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
