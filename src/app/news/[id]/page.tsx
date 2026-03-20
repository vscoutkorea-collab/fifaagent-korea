import { Calendar, ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

const categoryColors: Record<string, string> = {
  공지: 'bg-blue-100 text-blue-700',
  이벤트: 'bg-purple-100 text-purple-700',
  대회: 'bg-orange-100 text-orange-700',
  뉴스: 'bg-green-100 text-green-700',
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = await createClient()
  const { data } = await supabase.from('news').select('title, excerpt').eq('id', params.id).single()
  return { title: data?.title || '공지사항', description: data?.excerpt || '' }
}

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('news')
    .select('*')
    .eq('id', params.id)
    .eq('is_published', true)
    .single()

  if (!post) notFound()

  return (
    <div className="pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/news" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" />
          공지사항 목록
        </Link>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[post.category] || 'bg-slate-100 text-slate-600'}`}>
              {post.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">{post.title}</h1>
          <div className="flex items-center gap-1 text-xs text-slate-400 mb-8 pb-8 border-b border-slate-100">
            <Calendar className="w-3 h-3" />
            {new Date(post.created_at).toLocaleDateString('ko-KR')}
          </div>
          {post.excerpt && (
            <p className="text-slate-600 font-medium mb-6 leading-relaxed">{post.excerpt}</p>
          )}
          {post.content && (
            <div className="text-slate-700 leading-relaxed whitespace-pre-line">{post.content}</div>
          )}
        </div>
      </div>
    </div>
  )
}
