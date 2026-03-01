import { useState } from 'react'
import { Heart, MessageSquare, Plus, X, ChevronLeft, Send } from 'lucide-react'
import type { StudyPost, StudyComment, RegisteredUser } from '../types'
import { getStudyPosts, saveStudyPosts } from '../data'

interface StudyPageProps {
  currentUser: RegisteredUser | null
}

const CATEGORY_MAP = {
  tip: { label: '시험 팁', color: 'bg-blue-100 text-blue-700' },
  resource: { label: '학습 자료', color: 'bg-green-100 text-green-700' },
  experience: { label: '합격 후기', color: 'bg-yellow-100 text-yellow-700' },
  question: { label: '질문/답변', color: 'bg-purple-100 text-purple-700' },
}

export default function StudyPage({ currentUser }: StudyPageProps) {
  const [posts, setPosts] = useState<StudyPost[]>(getStudyPosts)
  const [selected, setSelected] = useState<StudyPost | null>(null)
  const [filter, setFilter] = useState<StudyPost['category'] | 'all'>('all')
  const [showWriteForm, setShowWriteForm] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'tip' as StudyPost['category'] })
  const [commentText, setCommentText] = useState('')

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.category === filter)

  const handleLike = (postId: string) => {
    const updated = posts.map((p) =>
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    )
    setPosts(updated)
    saveStudyPosts(updated)
    if (selected?.id === postId) {
      setSelected({ ...selected, likes: selected.likes + 1 })
    }
  }

  const handleSubmitPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return
    const post: StudyPost = {
      id: `p_${Date.now()}`,
      author: currentUser ? `${currentUser.lastName}${currentUser.firstName}` : '익명',
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      category: newPost.category,
      likes: 0,
      createdAt: new Date().toISOString().split('T')[0],
      comments: [],
    }
    const updated = [post, ...posts]
    setPosts(updated)
    saveStudyPosts(updated)
    setNewPost({ title: '', content: '', category: 'tip' })
    setShowWriteForm(false)
  }

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return
    const comment: StudyComment = {
      id: `c_${Date.now()}`,
      author: currentUser ? `${currentUser.lastName}${currentUser.firstName}` : '익명',
      content: commentText.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    const updated = posts.map((p) =>
      p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
    )
    setPosts(updated)
    saveStudyPosts(updated)
    if (selected?.id === postId) {
      setSelected({ ...selected, comments: [...selected.comments, comment] })
    }
    setCommentText('')
  }

  if (selected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
          >
            <ChevronLeft size={18} /> 목록으로
          </button>

          <div className="bg-white rounded-2xl p-8 shadow-sm mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_MAP[selected.category].color}`}>
                {CATEGORY_MAP[selected.category].label}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{selected.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
              <span>{selected.author}</span>
              <span>·</span>
              <span>{selected.createdAt}</span>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selected.content}</p>

            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => handleLike(selected.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
              >
                <Heart size={16} className="fill-red-400" />
                <span className="text-sm font-medium">{selected.likes}</span>
              </button>
              <span className="flex items-center gap-2 text-gray-400 text-sm">
                <MessageSquare size={16} /> {selected.comments.length}개 댓글
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">댓글 {selected.comments.length}개</h2>
            <div className="space-y-4 mb-6">
              {selected.comments.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">첫 댓글을 남겨보세요!</p>
              )}
              {selected.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900 text-sm">{comment.author}</span>
                    <span className="text-gray-400 text-xs">{comment.createdAt}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment(selected.id)}
                placeholder={currentUser ? '댓글을 입력하세요...' : '로그인 없이도 댓글을 남길 수 있습니다'}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleAddComment(selected.id)}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">공부 커뮤니티</h1>
            <p className="text-gray-500 mt-1">합격 후기, 공부 팁, 학습 자료를 공유하세요</p>
          </div>
          <button
            onClick={() => setShowWriteForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Plus size={16} /> 글쓰기
          </button>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'all', label: '전체' },
            ...Object.entries(CATEGORY_MAP).map(([k, v]) => ({ id: k, label: v.label })),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as StudyPost['category'] | 'all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">게시물이 없습니다.</div>
          )}
          {filtered.map((post) => (
            <button
              key={post.id}
              onClick={() => setSelected(post)}
              className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_MAP[post.category].color}`}>
                      {CATEGORY_MAP[post.category].label}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-1">{post.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span>{post.author}</span>
                    <span>{post.createdAt}</span>
                    <span className="flex items-center gap-1">
                      <Heart size={12} className="text-red-400" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={12} /> {post.comments.length}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showWriteForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">게시물 작성</h2>
              <button onClick={() => setShowWriteForm(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value as StudyPost['category'] })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(CATEGORY_MAP).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="제목을 입력하세요"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="내용을 입력하세요"
                  rows={8}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowWriteForm(false)}
                  className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmitPost}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  게시하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
