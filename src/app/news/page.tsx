import { Calendar, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '공지사항',
  description: '풋볼아이 공지사항 및 뉴스. 수업 일정, 이벤트, 대회 참가 소식을 확인하세요.',
}

const posts = [
  { id: 1, category: '공지', title: '2024년 하반기 수업 일정 안내', date: '2024-07-01', excerpt: '2024년 하반기 취미반·엘리트반·선수반 수업 일정을 안내드립니다.', isNew: true },
  { id: 2, category: '이벤트', title: '여름방학 특별 집중 훈련 캠프 모집', date: '2024-06-20', excerpt: '7월 말~8월 초 진행되는 여름방학 특별 캠프 참가자를 모집합니다.', isNew: true },
  { id: 3, category: '대회', title: '경기도 유소년 축구 대회 참가 결과', date: '2024-06-10', excerpt: '지난 주 개최된 경기도 유소년 축구 대회에서 좋은 성과를 거뒀습니다.' },
  { id: 4, category: '공지', title: '6월 지점별 휴무 안내', date: '2024-06-01', excerpt: '6월 중 지점별 휴무 일정을 안내드립니다. 확인 후 일정 조율 부탁드립니다.' },
  { id: 5, category: '뉴스', title: '스페인 유소년 클럽 MOU 체결', date: '2024-05-15', excerpt: '풋볼아이가 스페인 유소년 클럽과 공식 MOU를 체결하였습니다.' },
  { id: 6, category: '공지', title: '신규 입회 서류 안내 (2024년)', date: '2024-05-01', excerpt: '신규 등록 시 필요한 서류 목록 및 제출 방법을 안내드립니다.' },
]

const categoryColors: Record<string, string> = {
  공지: 'bg-blue-100 text-blue-700',
  이벤트: 'bg-purple-100 text-purple-700',
  대회: 'bg-orange-100 text-orange-700',
  뉴스: 'bg-green-100 text-green-700',
}

export default function NewsPage() {
  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-slate-900 to-green-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">공지사항</h1>
          <p className="text-xl text-slate-300">풋볼아이의 소식을 확인하세요</p>
        </div>
      </div>
      <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="divide-y divide-slate-100">
          {posts.map((post) => (
            <div key={post.id} className="py-6 flex items-start gap-4 group cursor-pointer hover:bg-slate-50 -mx-4 px-4 rounded-xl transition-colors">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[post.category] || 'bg-slate-100 text-slate-600'}`}>
                    {post.category}
                  </span>
                  {post.isNew && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">NEW</span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-green-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-500 mb-2">{post.excerpt}</p>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-green-500 transition-colors mt-1 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
