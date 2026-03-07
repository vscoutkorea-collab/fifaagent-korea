import { useState, useEffect, useRef, useCallback } from 'react'
import { BookOpen, Languages, Clock, AlertCircle, ChevronLeft, ChevronRight, X, Send, FileText } from 'lucide-react'
import type { ExamResult, UserAnswer, PageType } from '../types'
import { getRandomExamQuestions, getStudyMaterials } from '../data'
import type { Question, StudyMaterial } from '../types'

interface ExamPageProps {
  onComplete: (result: ExamResult) => void
  onNavigate: (page: PageType) => void
}

const EXAM_DURATION = 60 * 60

/** 복수 정답 여부 */
const isMulti = (q: Question) => Array.isArray(q.correctAnswer)

/** 정답 배열 정규화 */
const normalizeAnswer = (a: number | number[] | null): number[] => {
  if (a === null) return []
  return Array.isArray(a) ? a : [a]
}

/** 채점: 복수 정답은 선택한 셋이 정답 셋과 완전히 일치해야 정답 */
function isCorrect(q: Question, ans: UserAnswer): boolean {
  const sel  = normalizeAnswer(ans.selectedAnswer).sort((a, b) => a - b)
  const corr = normalizeAnswer(q.correctAnswer as number | number[]).sort((a, b) => a - b)
  if (sel.length !== corr.length) return false
  return sel.every((v, i) => v === corr[i])
}

export default function ExamPage({ onComplete, onNavigate }: ExamPageProps) {
  const [questions] = useState<Question[]>(() => getRandomExamQuestions(20))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<UserAnswer[]>(() =>
    Array.from({ length: 20 }, () => ({ questionId: '', selectedAnswer: null }))
  )
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION)
  const [showOpenBook, setShowOpenBook] = useState(false)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [materials] = useState<StudyMaterial[]>(getStudyMaterials)
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null)
  const [startTime] = useState(Date.now())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const initialAnswers = questions.map((q) => ({ questionId: q.id, selectedAnswer: null }))
    setAnswers(initialAnswers)
  }, [questions])

  const handleSubmit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    const score = answers.reduce((acc, ans, i) => {
      const q = questions[i]
      return q && isCorrect(q, ans) ? acc + 1 : acc
    }, 0)
    const result: ExamResult = {
      answers,
      questions,
      score,
      passed: score >= 15,
      completedAt: new Date().toISOString(),
      timeSpent,
    }
    onComplete(result)
  }, [answers, questions, startTime, onComplete])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); handleSubmit(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [handleSubmit])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  /** 단수: 선택 토글. 복수: 체크 추가/제거 */
  const handleAnswer = (optIdx: number) => {
    const q = questions[currentIndex]
    if (!q) return
    setAnswers((prev) => {
      const updated = [...prev]
      const cur = updated[currentIndex]
      if (isMulti(q)) {
        const sel = normalizeAnswer(cur.selectedAnswer)
        const next = sel.includes(optIdx)
          ? sel.filter((v) => v !== optIdx)
          : [...sel, optIdx]
        updated[currentIndex] = { ...cur, selectedAnswer: next.length ? next : null }
      } else {
        updated[currentIndex] = { ...cur, selectedAnswer: optIdx }
      }
      return updated
    })
  }

  const currentQ = questions[currentIndex]
  const currentAnswer = answers[currentIndex]
  const selectedSet  = new Set(normalizeAnswer(currentAnswer?.selectedAnswer ?? null))
  const answeredCount = answers.filter((a) => a.selectedAnswer !== null && normalizeAnswer(a.selectedAnswer).length > 0).length
  const isWarning = timeLeft <= 300

  if (!currentQ) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
        <AlertCircle size={40} className="text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">등록된 문제가 없습니다</h2>
        <p className="text-gray-500 text-sm mb-6">관리자가 아직 문제를 등록하지 않았습니다.<br />잠시 후 다시 시도해 주세요.</p>
        <button onClick={() => onNavigate('home')}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
          홈으로 돌아가기
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className={`flex items-center justify-between px-4 py-3 ${isWarning ? 'bg-red-900' : 'bg-gray-800'} text-white`}>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('home')} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300">
            <X size={18} />
          </button>
          <span className="text-sm font-medium text-gray-300">FIFA 에이전트 모의고사</span>
          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{answeredCount}/{questions.length} 응답</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.open('https://www.deepl.com/ko/translator', '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
          >
            <Languages size={15} /> 번역기
          </button>
          <button
            onClick={() => {
              const mat = materials[0]
              if (mat) {
                window.open(mat.content, '_blank', 'noopener,noreferrer')
              } else {
                setShowOpenBook(true)
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
          >
            <BookOpen size={15} /> 오픈북
          </button>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono font-bold ${isWarning ? 'bg-red-600 animate-pulse' : 'bg-white/10'}`}>
            <Clock size={15} />{formatTime(timeLeft)}
          </div>
          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Send size={15} /> 제출
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block w-56 bg-gray-800 p-4 overflow-y-auto flex-shrink-0">
          <p className="text-gray-400 text-xs font-medium mb-3 uppercase tracking-wider">문제 목록</p>
          <div className="grid grid-cols-4 gap-1.5">
            {questions.map((_, i) => {
              const ans = answers[i]
              const isAnswered = ans?.selectedAnswer !== null && normalizeAnswer(ans.selectedAnswer).length > 0
              const isCurrent = i === currentIndex
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-full aspect-square rounded-lg text-xs font-bold transition-colors ${
                    isCurrent ? 'bg-blue-600 text-white' : isAnswered ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-gray-400"><div className="w-3 h-3 rounded bg-green-600" /> 응답 완료</div>
            <div className="flex items-center gap-2 text-xs text-gray-400"><div className="w-3 h-3 rounded bg-gray-600" /> 미응답</div>
            <div className="flex items-center gap-2 text-xs text-gray-400"><div className="w-3 h-3 rounded bg-blue-600" /> 현재 문제</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-4">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Q{currentIndex + 1} / {questions.length}
                </span>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{currentQ.category}</span>
                {isMulti(currentQ) && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">복수 선택</span>
                )}
              </div>

              <p className="text-gray-900 text-lg leading-relaxed font-medium mb-8">
                {currentQ.text}
                {!isMulti(currentQ) && (
                  <span className="ml-2 text-sm font-normal text-gray-400">(Select One)</span>
                )}
              </p>

              {isMulti(currentQ) && (
                <p className="text-sm text-purple-600 mb-4 font-medium">
                  해당하는 항목을 모두 선택하세요 (복수 정답)
                </p>
              )}

              <div className="space-y-3">
                {currentQ.options.map((opt, i) => {
                  const selected = selectedSet.has(i)
                  const multi    = isMulti(currentQ)
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selected
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {multi ? (
                          <span className={`flex-shrink-0 w-7 h-7 rounded-md border-2 flex items-center justify-center text-sm font-bold ${
                            selected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-gray-400'
                          }`}>
                            {selected ? '✓' : String.fromCharCode(65 + i)}
                          </span>
                        ) : (
                          <span className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                            selected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-gray-400'
                          }`}>
                            {String.fromCharCode(65 + i)}
                          </span>
                        )}
                        <span className="leading-relaxed">{opt}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} /> 이전
              </button>

              <div className="md:hidden flex gap-1">
                {questions.map((_, i) => {
                  const ans = answers[i]
                  const isAnswered = ans?.selectedAnswer !== null && normalizeAnswer(ans.selectedAnswer).length > 0
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === currentIndex ? 'bg-blue-600' : isAnswered ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  )
                })}
              </div>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  다음 <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
                >
                  <Send size={16} /> 제출하기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showOpenBook && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full md:rounded-2xl md:max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <BookOpen size={20} className="text-green-600" />
                <h2 className="font-bold text-gray-900">오픈북 자료</h2>
              </div>
              <button onClick={() => { setShowOpenBook(false); setSelectedMaterial(null) }} className="p-1.5 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            {materials.length === 0 ? (
              <div className="flex-1 flex items-center justify-center flex-col gap-3 text-gray-400 p-8">
                <FileText size={40} />
                <p className="font-medium">업로드된 학습자료가 없습니다</p>
              </div>
            ) : (
              <div className="flex flex-1 overflow-hidden">
                <div className="w-48 border-r border-gray-100 p-3 overflow-y-auto flex-shrink-0">
                  {materials.map((mat) => (
                    <button key={mat.id} onClick={() => setSelectedMaterial(mat)}
                      className={`w-full text-left p-3 rounded-xl text-sm mb-1 transition-colors ${selectedMaterial?.id === mat.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                      <FileText size={14} className="inline mr-1.5" />
                      <span className="truncate block">{mat.name}</span>
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {!selectedMaterial ? (
                    <div className="flex items-center justify-center h-full text-gray-400"><p>자료를 선택하세요</p></div>
                  ) : selectedMaterial.type === 'text/plain' ? (
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedMaterial.content}</pre>
                  ) : selectedMaterial.type === 'application/pdf' ? (
                    <iframe src={selectedMaterial.content} className="w-full h-full min-h-96" title={selectedMaterial.name} />
                  ) : (
                    <img src={selectedMaterial.content} alt={selectedMaterial.name} className="max-w-full h-auto" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Send size={20} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">시험 제출</h3>
            </div>
            {answeredCount < questions.length && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-800">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{questions.length - answeredCount}개 문제에 아직 답하지 않았습니다.</span>
              </div>
            )}
            <p className="text-gray-600 text-sm mb-5">
              {answeredCount}/{questions.length}개 문제에 답했습니다. 제출하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50">취소</button>
              <button onClick={handleSubmit}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">제출하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
