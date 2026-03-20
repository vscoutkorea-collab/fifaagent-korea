import { Calendar, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: '공지사항',
  description: '풋볼아이 공지사항 및 뉴스. 수업 일정, 이벤트, 대회 참가 소식을 확인하세요.',
}

export const revalidate = 60

const categoryColors: Record<string, string> = {
  공지: 'bg-blue-100 text-blue-700',
  이벤트: 'bg-purple-100 text-purple-700',
  대회: 'bg-orange-100 text-orange-700',
  뉴스: 'bg-green-100 text-green-700',
}

export default async function NewsPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-slate-900 to-green-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">공지사항</h1>
          <p className="text-xl text-slate-300">풋볼아이의 소식을 확인하세요</p>
        </div>
      </div>
      <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/news/${post.id}`} className="flex items-start gap-4 group px-5 py-5 rounded-xl border border-slate-200 hover:border-green-300 hover:bg-slate-50 transition-colors block">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[post.category] || 'bg-slate-100 text-slate-600'}`}>
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && <p className="text-sm text-slate-500 mb-2">{post.excerpt}</p>}
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.created_at).toLocaleDateString('ko-KR')}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-green-500 transition-colors mt-1 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
