import { Star, Quote } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '수강생 후기',
  description: '풋볼아이 수강생과 학부모님들의 생생한 후기. 아이들의 성장 스토리를 확인하세요.',
}

const reviews = [
  { id: 1, name: 'a33******', program: '선수반', location: '은계점', rating: 5, period: '네이버 방문자 리뷰', text: '아이들을 항상 세심히 잘 챙겨주시고 사비를 털어 간식도 든든히 챙겨주시는 이지환 코치님!! 넘 감사드리고 앞으로도 쭉 잘 부탁드립니다~♡', avatar: '👧' },
  { id: 2, name: 'jia******', program: '선수반', location: '은계점', rating: 5, period: '네이버 방문자 리뷰', text: '풋볼아이에서 선수반으로 축구를 배운 지도 2년이 되어가네요. 이지환 코치님의 세심한 지도와 아이들을 먼저 생각하고 노력하시는 모습을 통해서 아이가 크게 성장하고 있습니다.', avatar: '👦' },
  { id: 3, name: 'koo******', program: '취미반', location: '은계점', rating: 5, period: '네이버 방문자 리뷰', text: '소문듣고 찾아간 풋볼아이 다닐수록 점점 더 재미있어하고 좋아하네요 체계적이고 흥미유발로 재미있게 가르쳐주시는 열정가득한 이지환코치님을 만나 감사합니다! 풋볼아이 적극추천!', avatar: '👧' },
  { id: 4, name: 'jyuiop3', program: '취미반', location: '은계점', rating: 5, period: '네이버 방문자 리뷰', text: '축구가 좋와서 다니기 시작했는데 이지환 코치님 덕분에 축구를 제대로 배우며 즐기고 있습니다 풋볼아이 전용 야외구장이 있어서 뛸수있는 기회가 많아 아이가 너무 좋와하네요^^', avatar: '👦' },
  { id: 5, name: '에너지69', program: '선수반', location: '은계점', rating: 5, period: '네이버 방문자 리뷰', text: '다른클럽 다니다가 아이가 축구선수가 꿈이라서 알아보다 시흥에서 유일한 1종클럽이라 옮겼는데 몇개월사이에 아이 실력이 많이 늘었어요~', avatar: '👧' },
  { id: 6, name: '김말이96', program: '취미반', location: '은계점', rating: 5, period: '네이버 방문자 리뷰', text: '아이가 축구가는걸 넘 좋아해요 코치님들도 너무다친절하시고 잘 지도해주셔서 너무 만족합니다. ^^ 추천합니다 풋볼아이', avatar: '👦' },
  { id: 7, name: '마스타구니', program: '취미반', location: '은계점', rating: 5, period: '네이버 방문자 리뷰', text: '1년넘게 꾸준히 잘다니고있어요~~ 코치님들이 아이들한테 친절하고 잘가르쳐주세요~~ 항상 즐겁게 축구 하러갑니다~', avatar: '👧' },
  { id: 8, name: 'sela7921', program: '취미반', location: '은계점', rating: 5, period: '네이버 방문자 리뷰', text: '소개로 다니게 되었는데 아이가 정말 좋아하네요. 진작 보내지 못한게 미안할 정도로 재미있어하고 좋아합니다. 코치님들도 친절하시고 좋아요.', avatar: '👦' },
  { id: 9, name: 'lllijiiilllli', program: '취미반', location: '은계점', rating: 5, period: '네이버 방문자 리뷰', text: '주변 엄마들 입소문에 방문했어요 아이가 친구들과 축구를 하는데 체계적으로 배우면 좋을 듯 하여 상담했는데 코치님이 친절하게 잘 설명해주시고 아이들 훈련하는 모습도 볼 수 있어 좋았어요.', avatar: '👧' },
  { id: 10, name: '두산맘22', program: '취미반', location: '은계점', rating: 5, period: '네이버 방문자 리뷰', text: '정말 재밉고 좋아요', avatar: '👦' },
  { id: 11, name: '냉냉이16', program: '취미반', location: '은계점', rating: 5, period: '네이버 방문자 리뷰', text: '항상 열정가득 쌤들 덕분에 축구 가는날만 기다린답니다♡', avatar: '👧' },
  { id: 12, name: '푸푸푸푸', program: '취미반', location: '은계점', rating: 5, period: '네이버 방문자 리뷰', text: '평판이 좋아서 등록했는데 축구장이 넓고 쾌적하고, 선생님의 아이들 통솔이 우수하고 안전하게 운영됩니다. 아이의 축구 실력 향상을 기대합니다.', avatar: '👦' },
  { id: 13, name: 'SOOKSOOK', program: '엘리트반', location: '은계점', rating: 5, period: '네이버 방문자 리뷰', text: '열정적인 코치님들과 체계적인 수업방식이 너무 좋더라고요~ 이왕 배우는거 제대로 배우자가 목표인데 축구는 확실히 풋볼아이 입니다! 강추~~합니다!', avatar: '👧' },
  { id: 14, name: 'eun****', program: '취미반', location: '은계점', rating: 5, period: '네이버 방문자 리뷰', text: '아이도 좋아하고 있고 선생님도 지도 잘해주시고 굿입니다. 스케쥴만 맞으면 다른 요일도 더 보내고 싶네요.', avatar: '👦' },
  { id: 15, name: 'xpi****', program: '취미반', location: '은계점', rating: 5, period: '네이버 방문자 리뷰', text: '코치님들이 너무 친절하시고 좋으셔서 아이가 코치님들을 너무 좋아합니다~ 또한 매일 가고싶다고 할 정도로 너무나 좋아하는 축구교실이에요~', avatar: '👧' },
  { id: 16, name: '지랭S2', program: '선수반', location: '은계점', rating: 5, period: '네이버 방문자 리뷰', text: '코치님들의 열정적인 지도로 아들의 축구 실력이 눈에 띄게 향상됐고, 자신감 증대 및 건강한 운동 습관도 형성됐어요. 실내구장에 부모님 대기공간이 있어 수업 모습을 관찰할 수 있고, 취미반과 선수반을 체계적으로 구분하여 운영합니다.', avatar: '👦' },
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
