import { CheckCircle, XCircle, Trophy, RotateCcw, Home, ChevronDown, ChevronUp } from 'lucide-react'
import type { ExamResult, PageType } from '../types'
import { useState } from 'react'

interface ExamResultPageProps {
  result: ExamResult
  onNavigate: (page: PageType) => void
}

const normalizeAnswer = (a: number | number[] | null): number[] => {
  if (a === null) return []
  return Array.isArray(a) ? a : [a]
}

function checkCorrect(q: { correctAnswer: number | number[] }, ans: { selectedAnswer: number | number[] | null }): boolean {
  const sel  = normalizeAnswer(ans.selectedAnswer).sort((a, b) => a - b)
  const corr = normalizeAnswer(q.correctAnswer as number | number[]).sort((a, b) => a - b)
  if (sel.length !== corr.length) return false
  return sel.every((v, i) => v === corr[i])
}

export default function ExamResultPage({ result, onNavigate }: ExamResultPageProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}분 ${s}초`
  }

  const wrongCount = result.questions.length - result.score

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className={`rounded-2xl p-8 text-center text-white mb-8 shadow-lg ${
          result.passed ? 'bg-gradient-to-br from-green-600 to-green-700' : 'bg-gradient-to-br from-red-600 to-red-700'
        }`}>
          <div className="flex items-center justify-center mb-4">
            {result.passed ? <Trophy size={64} className="text-yellow-300" /> : <XCircle size={64} className="text-red-200" />}
          </div>
          <h1 className="text-4xl font-bold mb-2">{result.passed ? '합격' : '불합격'}</h1>
          <p className="text-white/80 text-lg mb-6">
            {result.passed ? '축하합니다! FIFA 에이전트 모의고사를 통과했습니다.' : '아쉽습니다. 조금 더 공부하고 다시 도전해 보세요!'}
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-4"><div className="text-3xl font-bold">{result.score}</div><div className="text-white/70 text-sm">정답</div></div>
            <div className="bg-white/10 rounded-xl p-4"><div className="text-3xl font-bold">{wrongCount}</div><div className="text-white/70 text-sm">오답</div></div>
            <div className="bg-white/10 rounded-xl p-4"><div className="text-3xl font-bold">{Math.round((result.score / result.questions.length) * 100)}%</div><div className="text-white/70 text-sm">정답률</div></div>
          </div>
          <div className="mt-4 bg-white/10 rounded-xl p-4 flex items-center justify-center gap-2 text-white/80 text-sm">
            <span>소요 시간: {formatTime(result.timeSpent)}</span>
            <span>·</span>
            <span>합격 기준: 15문제 이상</span>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <div className={`flex-1 rounded-xl p-4 text-center ${result.passed ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
            <div className={`text-2xl font-bold ${result.passed ? 'text-green-700' : 'text-gray-400'}`}>{result.score}/20</div>
            <div className="text-sm text-gray-500 mt-1">득점</div>
          </div>
          <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">15/20</div>
            <div className="text-sm text-gray-500 mt-1">합격 기준</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5">문제별 결과</h2>
          <div className="space-y-3">
            {result.questions.map((q, i) => {
              const answer   = result.answers[i]
              const correct  = checkCorrect(q, answer)
              const isExpanded = expandedQuestion === i
              const corrIdxs = normalizeAnswer(q.correctAnswer as number | number[])
              const selIdxs  = normalizeAnswer(answer?.selectedAnswer ?? null)
              const isMultiQ = Array.isArray(q.correctAnswer) && (q.correctAnswer as number[]).length > 1

              return (
                <div key={q.id} className={`rounded-xl border-2 overflow-hidden ${correct ? 'border-green-200' : 'border-red-200'}`}>
                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : i)}
                    className={`w-full flex items-center gap-3 p-4 text-left ${correct ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'} transition-colors`}
                  >
                    <div className="flex-shrink-0">
                      {correct ? <CheckCircle size={22} className="text-green-600" /> : <XCircle size={22} className="text-red-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-gray-500">Q{i + 1}</span>
                        <span className="text-xs bg-white/70 px-2 py-0.5 rounded-full text-gray-600">{q.category}</span>
                        {isMultiQ && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">복수 정답</span>}
                      </div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{q.text}</p>
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-white border-t border-gray-100">
                      <p className="text-gray-900 text-sm leading-relaxed mb-4">{q.text}</p>
                      {isMultiQ && (
                        <p className="text-xs text-purple-700 font-medium mb-3">
                          정답: {corrIdxs.map((idx) => String.fromCharCode(65 + idx)).join(', ')}
                          &nbsp;·&nbsp;내 선택: {selIdxs.length ? selIdxs.map((idx) => String.fromCharCode(65 + idx)).join(', ') : '없음'}
                        </p>
                      )}
                      <div className="space-y-2 mb-4">
                        {q.options.map((opt, j) => {
                          const isSelected = selIdxs.includes(j)
                          const isAnswer   = corrIdxs.includes(j)
                          return (
                            <div
                              key={j}
                              className={`flex items-start gap-3 p-3 rounded-lg text-sm ${
                                isAnswer ? 'bg-green-50 border border-green-200 text-green-800'
                                  : isSelected ? 'bg-red-50 border border-red-200 text-red-800'
                                  : 'bg-gray-50 text-gray-600'
                              }`}
                            >
                              <span className={`font-bold flex-shrink-0 ${isAnswer ? 'text-green-600' : isSelected ? 'text-red-500' : 'text-gray-400'}`}>
                                {String.fromCharCode(65 + j)}.
                              </span>
                              <span>{opt}</span>
                              {isAnswer && <span className="ml-auto flex-shrink-0 text-xs font-bold text-green-600">정답</span>}
                              {isSelected && !isAnswer && <span className="ml-auto flex-shrink-0 text-xs font-bold text-red-500">내 답</span>}
                            </div>
                          )
                        })}
                      </div>
                      {q.explanation && (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                          <p className="text-xs font-bold text-blue-700 mb-1">해설</p>
                          <p className="text-sm text-blue-800 leading-relaxed">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => onNavigate('exam')}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
            <RotateCcw size={18} /> 다시 도전하기
          </button>
          <button onClick={() => onNavigate('home')}
            className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition-colors">
            <Home size={18} /> 홈으로
          </button>
        </div>

        {!result.passed && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h3 className="font-bold text-amber-900 mb-2">학습 조언</h3>
            <p className="text-amber-800 text-sm leading-relaxed">
              현재 점수 <strong>{result.score * 5}점</strong> / 100점 — 합격까지 <strong>{75 - result.score * 5}점</strong> 더 필요합니다.
              커뮤니티에서 합격자들의 공부 방법을 참고해 보세요.
            </p>
            <button onClick={() => onNavigate('study')} className="mt-3 text-sm font-semibold text-amber-700 hover:underline">
              커뮤니티 공부 팁 보기 →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
