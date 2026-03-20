'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Eye, EyeOff, LogOut } from 'lucide-react'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'footballeye2024'

const CATEGORIES = ['공지', '이벤트', '대회', '뉴스']

type Post = {
  id: number
  category: string
  title: string
  excerpt: string
  content: string
  is_published: boolean
  created_at: string
}

type FormData = {
  category: string
  title: string
  excerpt: string
  content: string
  is_published: boolean
}

const emptyForm: FormData = { category: '공지', title: '', excerpt: '', content: '', is_published: true }

export default function AdminNewsPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [editId, setEditId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const supabase = createClient()

  useEffect(() => {
    if (authed) fetchPosts()
  }, [authed])

  async function fetchPosts() {
    setLoading(true)
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  function login() {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true)
      setPwError(false)
    } else {
      setPwError(true)
    }
  }

  function openNew() {
    setForm(emptyForm)
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(post: Post) {
    setForm({ category: post.category, title: post.title, excerpt: post.excerpt || '', content: post.content || '', is_published: post.is_published })
    setEditId(post.id)
    setShowForm(true)
  }

  async function save() {
    if (!form.title.trim()) { setMsg('제목을 입력하세요.'); return }
    setSaving(true)
    setMsg('')
    if (editId !== null) {
      await supabase.from('news').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editId)
    } else {
      await supabase.from('news').insert(form)
    }
    setSaving(false)
    setShowForm(false)
    setMsg(editId !== null ? '수정 완료!' : '등록 완료!')
    fetchPosts()
    setTimeout(() => setMsg(''), 3000)
  }

  async function togglePublish(post: Post) {
    await supabase.from('news').update({ is_published: !post.is_published }).eq('id', post.id)
    fetchPosts()
  }

  async function deletePost(id: number) {
    if (!confirm('정말 삭제할까요?')) return
    await supabase.from('news').delete().eq('id', id)
    fetchPosts()
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-slate-900 mb-6 text-center">관리자 로그인</h1>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 mb-3"
          />
          {pwError && <p className="text-red-500 text-xs mb-3">비밀번호가 틀렸습니다.</p>}
          <button onClick={login} className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors">
            로그인
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">공지사항 관리</h1>
          <div className="flex gap-2">
            <button onClick={openNew} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors">
              <Plus className="w-4 h-4" /> 새 공지 작성
            </button>
            <button onClick={() => setAuthed(false)} className="flex items-center gap-2 bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-300 transition-colors">
              <LogOut className="w-4 h-4" /> 로그아웃
            </button>
          </div>
        </div>

        {msg && <div className="mb-4 px-4 py-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium">{msg}</div>}

        {showForm && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">{editId !== null ? '공지 수정' : '새 공지 작성'}</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">카테고리</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 mb-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="rounded" />
                    공개
                  </label>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">제목 *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="공지 제목"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">요약 (목록에 표시)</label>
                <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="간단한 요약 문장"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">내용</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={6} placeholder="공지 내용을 입력하세요"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500 resize-none" />
              </div>
              {msg && <p className="text-red-500 text-xs">{msg}</p>}
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">취소</button>
                <button onClick={save} disabled={saving} className="px-6 py-2 text-sm bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50">
                  {saving ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-400">불러오는 중...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">등록된 공지가 없습니다.</div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{post.category}</span>
                    {!post.is_published && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">비공개</span>}
                  </div>
                  <p className="font-semibold text-slate-900 text-sm truncate">{post.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(post.created_at).toLocaleDateString('ko-KR')}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => togglePublish(post)} title={post.is_published ? '비공개로' : '공개로'}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                    {post.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(post)} className="p-2 text-slate-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => deletePost(post.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
