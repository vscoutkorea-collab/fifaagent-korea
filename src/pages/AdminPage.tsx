import { useState, useRef, useCallback } from 'react'
import {
  Lock, Plus, Trash2, Upload, FileText, Users, AlertCircle, X,
  Download, Eye, Image, CheckCircle, Clock, Loader, ChevronDown,
  ChevronUp, RotateCcw, FlaskConical
} from 'lucide-react'
import type { Question, RegisteredUser, StudyMaterial } from '../types'
import type { PageType } from '../types'
import { getQuestions, saveQuestions, getUsers, getStudyMaterials, saveStudyMaterials } from '../data'

const ADMIN_PASSWORD = 'fifaadmin2024'

type AdminTab = 'questions' | 'text-input' | 'image-upload' | 'materials' | 'users'

/* ────────────────────────────────────────
   OCR 파싱 유틸리티
   지원 형식:
   1. 체크마크형 (✓/√/V + 채워진 라디오)  - Image 1 스타일
   2. Moodle 형식 (초록 배경 + Correct 레이블) - Image 2/3 스타일
   3. 체크박스형 (☑/☐)                   - Image 3 Q12 스타일
───────────────────────────────────────── */
interface ParsedQuestion {
  text: string
  options: [string, string, string, string]
  correctAnswer: number
  category: string
  explanation: string
  multipleCorrect?: number[]
  selectOneOrMore?: boolean
}

/** 체크/선택 상태를 나타내는 기호 집합 */
const CHECKED_SYMBOLS_RE =
  /[✓✔☑✅√✗✘✱✲⊙◉●◈◆■▪⬤⚫🔘]/u

/** 빈(미선택) 상태 기호 */
const EMPTY_SYMBOLS_RE = /[○◯◎☐□○◌]/u

/**
 * 줄 맨 앞에 등장하는 prefix 를 보고 "이 보기가 정답인가" 판단
 *
 * 탐지 전략:
 * 1. 유니코드 체크마크 / 채워진 원 / 채워진 사각형
 * 2. OCR 이 ✓ → 'v'/'V'  또는  '/' 로 잘못 읽는 경우
 * 3. 스크린샷에서 Moodle 의 체크된 라디오버튼이 '●' 나 '(●)' 로 찍히는 경우
 * 4. 빈 라디오 '○' 만 있으면 정답 아님
 */
function isCheckedPrefix(prefix: string): boolean {
  if (!prefix) return false
  const p = prefix.trim()
  if (!p) return false

  // 명시적 체크마크 기호
  if (CHECKED_SYMBOLS_RE.test(p)) return true

  // OCR 오인식: ✓ → 'v' 또는 'V' (단독)
  if (/^[vV]$/.test(p)) return true

  // OCR 오인식: ✓ → '/' 또는 '\' (단독)
  if (/^[/\\]$/.test(p)) return true

  // 완전히 빈 원만 있으면 정답 아님
  if (EMPTY_SYMBOLS_RE.test(p) && !CHECKED_SYMBOLS_RE.test(p)) return false

  return false
}

/** 노이즈 줄 필터 */
const NOISE_LINE_RE = /^(not\s+yet\s+answered|answered|marked\s+out|flag\s+question|edit\s+question|your\s+answer|correct\s+answer|점수|배점|남은|time\s+left|finish\s+attempt|quiz\s+navigation|page\s+\d|\d+\s*\/\s*\d+\s*pt|question$|q$)/i

/**
 * OCR 원문 → 문제/보기/정답 파싱
 *
 * 핵심 전략:
 *  1. "Select one[or more]:" 키워드로 문제부 / 보기부 1차 분리
 *     (공백 없는 "Selectone:" 도 처리)
 *  2. 보기부 전체를 한 줄로 펼친 뒤 a. b. c. d. 위치를 순서대로 스캔
 *     → OCR 이 줄바꿈 없이 한 줄에 몰아쓰는 경우도 대응
 *  3. 각 옵션 앞 최대 25자 prefix 에서 체크 기호를 검사해 정답 판별
 */
function parseQuestionText(raw: string): Partial<ParsedQuestion> {
  const normalized = raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')

  const result: Partial<ParsedQuestion> = {
    text: '',
    options: ['', '', '', ''],
    correctAnswer: -1,
    category: '',
    explanation: '',
    selectOneOrMore: false,
  }

  // ── Step 1: "Select one[or more]:" 으로 문제 / 보기 분리 ─────
  // "Selectone:" (공백 없음) 도 허용
  const selectMatch = normalized.match(/Select\s*one(?:\s+or\s+more)?\s*[:：]/i)
  result.selectOneOrMore = selectMatch ? /or\s+more/i.test(selectMatch[0]) : false

  let questionRaw: string
  let optionsRaw: string

  if (selectMatch?.index !== undefined) {
    questionRaw = normalized.slice(0, selectMatch.index)
    optionsRaw  = normalized.slice(selectMatch.index + selectMatch[0].length)
  } else {
    // "Select one:" 없으면 첫 번째 "a. " 위치로 분리
    const aMatch = normalized.match(/(?<![A-Za-z])a\s*[.)]\s+[A-Z]/i)
    if (aMatch?.index !== undefined) {
      questionRaw = normalized.slice(0, aMatch.index)
      optionsRaw  = normalized.slice(aMatch.index)
    } else {
      questionRaw = normalized
      optionsRaw  = ''
    }
  }

  // ── Step 2: 문제 텍스트 정리 ──────────────────────────────────
  const questionLines = questionRaw
    .split('\n')
    .map((l) => l.trim())
    .filter(
      (l) =>
        l &&
        !NOISE_LINE_RE.test(l) &&
        !/^\d+$/.test(l) &&
        !/^[🚩⚑🏁★☆✦✧]+$/.test(l)
    )
    .map((l) => l.replace(/^\d+[\.\)]\s*/, ''))

  result.text = questionLines.join(' ').trim()

  // 정답 명시 줄 ("정답: B") 처리
  for (const l of questionLines) {
    const am = l.match(/^(?:정답|답|answer)\s*[:：]\s*([A-Da-d①②③④1-4])/i)
    if (am) {
      const map: Record<string, number> = { A:0,B:1,C:2,D:3,'①':0,'②':1,'③':2,'④':3,'1':0,'2':1,'3':2,'4':3 }
      result.correctAnswer = map[am[1].toUpperCase()] ?? -1
    }
  }

  // ── Step 3: 보기 추출 ─────────────────────────────────────────
  if (!optionsRaw.trim()) return result

  // 보기부를 단일 줄로 펼침 (OCR 이 한 줄로 쭉 이어 쓴 경우도 대응)
  const flat = optionsRaw.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()

  // Moodle "Correct" 레이블 위치 확인
  const moodleCorrectIdx = (() => {
    const m = flat.match(/\bCorrect\b/i)
    return m?.index ?? -1
  })()

  // a → b → c → d 순서로 스캔해 각 보기의 시작 인덱스를 찾는다
  type Boundary = { letterIdx: number; textStart: number; prefixStart: number }
  const boundaries: Boundary[] = []
  const LETTERS = ['A', 'B', 'C', 'D']
  let searchFrom = 0

  for (let li = 0; li < 4; li++) {
    const letter = LETTERS[li]
    // 패턴: [letter][.) ][대문자로 시작하는 텍스트]
    // 'searchFrom' 이후에서만 검색해 순서 보장
    const re = new RegExp(`(?<![A-Za-z])${letter}\\s*[.)]\\s+(?=[A-Za-z])`, 'gi')
    re.lastIndex = searchFrom
    const m = re.exec(flat)
    if (m) {
      boundaries.push({
        letterIdx: li,
        textStart: m.index + m[0].length,
        prefixStart: Math.max(searchFrom, m.index - 25),
      })
      searchFrom = m.index + 1
    }
  }

  // 각 보기 텍스트 추출
  for (let i = 0; i < boundaries.length; i++) {
    const b    = boundaries[i]
    const end  = i + 1 < boundaries.length ? boundaries[i + 1].prefixStart : flat.length
    const text = flat.slice(b.textStart, end).trim()

    // 정답 여부: prefix 에 체크 기호가 있거나 Moodle "Correct" 가 이 보기 직전에 있는지
    const prefix  = flat.slice(b.prefixStart, b.textStart)
    const correct =
      isCheckedPrefix(prefix) ||
      (moodleCorrectIdx >= 0 &&
        moodleCorrectIdx >= b.prefixStart - 40 &&
        moodleCorrectIdx < b.textStart)

    ;(result.options as string[])[b.letterIdx] = text
    if (correct && result.correctAnswer === -1) result.correctAnswer = b.letterIdx
  }

  // 보기를 못 찾았으면 (boundaries 0개) 줄 단위 파싱으로 폴백
  if (boundaries.length === 0) {
    let markNext = false
    let lastIdx  = -1
    for (const line of optionsRaw.split('\n').map((l) => l.trim()).filter(Boolean)) {
      if (/^correct\b/i.test(line) && line.length < 20) { markNext = true; continue }
      if (NOISE_LINE_RE.test(line)) continue
      const om = line.match(
        /^([○◯◎☐□◌✓✔☑✅√✗✘✱✲⊙◉●◈◆■▪⬤⚫🔘vV\/\\©®~@•\s]*)\s*([a-dA-D①②③④])\s*[.)]\s*(.*)/u
      )
      if (om) {
        const map: Record<string, number> = { A:0,B:1,C:2,D:3,'①':0,'②':1,'③':2,'④':3 }
        const idx = map[om[2].toUpperCase()] ?? -1
        if (idx >= 0) {
          let correct = isCheckedPrefix(om[1])
          if (!correct && markNext) { correct = true; markNext = false }
          ;(result.options as string[])[idx] = om[3].trim()
          if (correct && result.correctAnswer === -1) result.correctAnswer = idx
          lastIdx = idx
        }
      } else if (lastIdx >= 0) {
        ;(result.options as string[])[lastIdx] += ' ' + line
      }
    }
  }

  // 복수 정답 감지 (체크 기호가 여러 보기에 있는 경우)
  const checkedIdxs: number[] = []
  for (let i = 0; i < boundaries.length; i++) {
    const b      = boundaries[i]
    const prefix = flat.slice(b.prefixStart, b.textStart)
    if (isCheckedPrefix(prefix)) checkedIdxs.push(b.letterIdx)
  }
  if (checkedIdxs.length > 1) {
    result.correctAnswer   = checkedIdxs[0]
    result.multipleCorrect = checkedIdxs
  }

  return result
}

/* ────────────────────────────────────────
   OCR 항목 타입
───────────────────────────────────────── */
type OcrStatus = 'pending' | 'processing' | 'done' | 'error'

interface OcrItem {
  id: string
  file: File
  preview: string
  status: OcrStatus
  rawText: string
  progress: number
  parsed: Partial<ParsedQuestion>
  isDuplicate: boolean
  selected: boolean
  errorMsg?: string
}

/* ────────────────────────────────────────
   관리자 메인 페이지
───────────────────────────────────────── */
interface AdminPageProps {
  onAdminLogin: () => void
  onAdminLogout: () => void
  onNavigate: (page: PageType) => void
}

export default function AdminPage({ onAdminLogin, onAdminLogout, onNavigate }: AdminPageProps) {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [tab, setTab] = useState<AdminTab>('questions')

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setAuthError('')
      onAdminLogin()
    } else {
      setAuthError('비밀번호가 올바르지 않습니다.')
    }
  }

  const handleLogout = () => {
    setAuthenticated(false)
    onAdminLogout()
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-5">
            <Lock size={28} className="text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">관리자 로그인</h1>
          <p className="text-gray-500 text-sm mb-6">관리자 비밀번호를 입력하세요</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="비밀번호"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          {authError && <p className="text-red-500 text-sm mb-3">{authError}</p>}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            로그인
          </button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'questions'   as AdminTab, label: '문제 관리',       icon: <FileText size={15} /> },
    { id: 'text-input'  as AdminTab, label: '텍스트로 등록',   icon: <Plus size={15} /> },
    { id: 'image-upload'as AdminTab, label: '사진으로 등록',   icon: <Image size={15} /> },
    { id: 'materials'   as AdminTab, label: '학습자료',         icon: <Upload size={15} /> },
    { id: 'users'       as AdminTab, label: '회원 관리',        icon: <Users size={15} /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">관리자 페이지</h1>
            <p className="text-gray-500 text-sm mt-0.5">FIFA 에이전트 시험 콘텐츠 관리</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('exam')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm font-medium rounded-xl transition-colors"
            >
              <FlaskConical size={15} /> 모의고사 미리보기
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              로그아웃
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {tab === 'questions'    && <QuestionsTab />}
        {tab === 'text-input'   && <TextInputTab />}
        {tab === 'image-upload' && <ImageUploadTab />}
        {tab === 'materials'    && <MaterialsTab />}
        {tab === 'users'        && <UsersTab />}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────
   텍스트 직접 입력 탭
   이미지에서 텍스트를 복사해 붙여넣으면
   문제 / 보기 / 정답을 자동으로 분리 저장
───────────────────────────────────────── */
function TextInputTab() {
  const [raw, setRaw]           = useState('')
  const [previews, setPreviews] = useState<Partial<ParsedQuestion>[]>([])
  const [parsed, setParsed]     = useState(false)
  const [result, setResult]     = useState<{ added: number; dup: number; incomplete: number } | null>(null)

  const handleParse = () => {
    if (!raw.trim()) return
    const chunks  = splitIntoQuestions(raw)
    const results = chunks.map((c) => parseQuestionText(c)).filter((p) => p.text?.trim())
    setPreviews(results)
    setParsed(true)
    setResult(null)
  }

  const updatePreview = (
    idx: number,
    field: keyof ParsedQuestion,
    value: string | number,
    optIdx?: number
  ) => {
    setPreviews((prev) =>
      prev.map((p, i) => {
        if (i !== idx) return p
        const next = { ...p }
        if (field === 'options' && optIdx !== undefined) {
          const opts = [...(next.options ?? ['', '', '', ''])] as [string, string, string, string]
          opts[optIdx] = value as string
          next.options = opts
        } else {
          ;(next as Record<string, unknown>)[field] = value
        }
        return next
      })
    )
  }

  const handleSave = () => {
    const existing = getQuestions()
    const toAdd: Question[] = []
    let added = 0, dup = 0, incomplete = 0

    for (const p of previews) {
      if (!p.text?.trim() || p.options?.some((o) => !o.trim()) || (p.correctAnswer ?? -1) < 0) {
        incomplete++; continue
      }
      const norm = p.text.trim().toLowerCase()
      if (existing.some((q) => q.text.trim().toLowerCase() === norm) ||
          toAdd.some((q) => q.text.trim().toLowerCase() === norm)) {
        dup++; continue
      }
      toAdd.push({
        id: `q_txt_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        text: p.text!,
        options: p.options as [string, string, string, string],
        correctAnswer: p.multipleCorrect && p.multipleCorrect.length > 1 ? p.multipleCorrect : p.correctAnswer!,
        category: p.category || '기타',
        explanation: p.explanation || '',
      })
      added++
    }
    if (toAdd.length) saveQuestions([...existing, ...toAdd])
    setResult({ added, dup, incomplete })
    if (added > 0) { setRaw(''); setPreviews([]); setParsed(false) }
  }

  const PLACEHOLDER = `[문제 텍스트를 여기에 붙여넣으세요]

예시 형식:
Within what timeframe does the Agents Chamber determine disputes?
Select one:
a. Disputes that occurred within the last six months.
b. Disputes that occurred within the last two years.
c. Disputes that occurred within the last five years.
d. Disputes that occurred at any time.
Correct
c. Disputes...

──────────────── 여러 문제를 한 번에 붙여넣어도 됩니다 ────────────────`

  return (
    <div>
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-5 border border-gray-100">
        <h2 className="font-bold text-gray-900 text-lg mb-1">텍스트로 문제 등록</h2>
        <p className="text-gray-500 text-sm mb-4">
          이미지에서 텍스트를 복사한 뒤 아래에 붙여넣으세요.
          여러 문제를 한 번에 붙여넣어도 자동으로 분리됩니다.
        </p>

        <textarea
          value={raw}
          onChange={(e) => { setRaw(e.target.value); setParsed(false); setPreviews([]) }}
          rows={12}
          placeholder={PLACEHOLDER}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        />

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={handleParse}
            disabled={!raw.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Eye size={15} /> 분리 미리보기
          </button>
          {parsed && previews.length > 0 && (
            <span className="text-sm text-gray-500">{previews.length}개 문제 감지됨</span>
          )}
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
          <p className="font-semibold mb-1">지원 형식</p>
          <p>• <code className="bg-blue-100 px-1 rounded">Select one:</code> 또는 <code className="bg-blue-100 px-1 rounded">Select one or more:</code> 키워드로 문제·보기 자동 분리</p>
          <p className="mt-0.5">• 정답 표시: <code className="bg-blue-100 px-1 rounded">Correct</code> 레이블 또는 보기 앞 ✓ 기호</p>
          <p className="mt-0.5">• 보기 형식: <code className="bg-blue-100 px-1 rounded">a. 보기내용</code> ~ <code className="bg-blue-100 px-1 rounded">d. 보기내용</code></p>
        </div>
      </div>

      {result && (
        <div className={`rounded-xl p-4 mb-5 flex items-center gap-3 text-sm font-medium ${
          result.added > 0
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-gray-50 border border-gray-200 text-gray-600'
        }`}>
          <CheckCircle size={18} className={result.added > 0 ? 'text-green-600' : 'text-gray-400'} />
          <span>
            {result.added}개 저장 완료
            {result.dup > 0 && ` · 중복 ${result.dup}개 제외`}
            {result.incomplete > 0 && ` · 미완성 ${result.incomplete}개 제외`}
          </span>
        </div>
      )}

      {previews.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">미리보기 — 저장 전 내용을 확인·수정하세요</p>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              <CheckCircle size={15} /> {previews.length}개 저장
            </button>
          </div>

          <div className="space-y-4">
            {previews.map((p, idx) => (
              <TextPreviewCard
                key={idx}
                idx={idx}
                parsed={p}
                onUpdate={(field, value, optIdx) => updatePreview(idx, field, value, optIdx)}
                onRemove={() => setPreviews((prev) => prev.filter((_, i) => i !== idx))}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function TextPreviewCard({
  idx, parsed, onUpdate, onRemove,
}: {
  idx: number
  parsed: Partial<ParsedQuestion>
  onUpdate: (field: keyof ParsedQuestion, value: string | number, optIdx?: number) => void
  onRemove: () => void
}) {
  const noCorrect  = (parsed.correctAnswer ?? -1) < 0
  const incomplete = !parsed.text?.trim() || parsed.options?.some((o) => !o.trim()) || noCorrect

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-2 p-5 ${incomplete ? 'border-orange-300' : 'border-blue-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg">Q{idx + 1}</span>
          {incomplete && (
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
              {noCorrect ? '정답 미설정' : '내용 미완성'}
            </span>
          )}
        </div>
        <button onClick={onRemove} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg">
          <X size={15} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">카테고리</label>
            <input
              value={parsed.category ?? ''}
              onChange={(e) => onUpdate('category', e.target.value)}
              placeholder="예: 이적 규정"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              정답 {noCorrect && <span className="text-orange-500 normal-case">(필수)</span>}
            </label>
            <div className="flex gap-2">
              {['A','B','C','D'].map((ch, i) => (
                <button
                  key={ch}
                  onClick={() => onUpdate('correctAnswer', i)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${
                    parsed.correctAnswer === i
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">문제</label>
          <textarea
            value={parsed.text ?? ''}
            onChange={(e) => onUpdate('text', e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(['A','B','C','D'] as const).map((ch, i) => (
            <div key={ch}>
              <label className={`block text-xs font-semibold mb-1.5 ${parsed.correctAnswer === i ? 'text-green-600' : 'text-gray-500'}`}>
                보기 {ch} {parsed.correctAnswer === i && '✓ 정답'}
              </label>
              <input
                value={parsed.options?.[i] ?? ''}
                onChange={(e) => onUpdate('options', e.target.value, i)}
                placeholder={`보기 ${ch}`}
                className={`w-full border-2 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  parsed.correctAnswer === i ? 'border-green-300 bg-green-50' : 'border-gray-200'
                }`}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">해설 (선택)</label>
          <textarea
            value={parsed.explanation ?? ''}
            onChange={(e) => onUpdate('explanation', e.target.value)}
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────
   GPT-4o Vision API 로 문제 자동 추출
   이미지 → Base64 → OpenAI API → JSON 파싱
───────────────────────────────────────── */
async function fileToBase64(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function extractWithGroqVision(
  file: File | Blob,
  apiKey: string,
  mimeType = 'image/jpeg'
): Promise<Partial<ParsedQuestion>[]> {
  const base64 = await fileToBase64(file)

  const prompt = `Extract all quiz questions from this image.
Return a JSON array. Each element must have EXACTLY these keys:
- "text": full question text (no question number prefix)
- "options": array of exactly 4 strings [optionA, optionB, optionC, optionD] (plain text, no "a." prefix)
- "correctAnswer": 0-based index (0=A,1=B,2=C,3=D) for single answer, OR an array of indices like [0,2] for multiple correct answers.
- "category": "" (empty string)
- "explanation": "" (empty string)
Correct answers are shown by checkmarks ✓ or ☑ or checked/filled checkboxes or highlighted rows (green/blue background).
If TWO OR MORE options are marked correct, set "correctAnswer" to an array of all correct indices, e.g. [0,2].
Return ONLY the raw JSON array, no markdown, no explanation.`

  const models = [
    'meta-llama/llama-4-scout-17b-16e-instruct',
    'llama-3.2-90b-vision-preview',
    'llama-3.2-11b-vision-preview',
  ]

  let lastError = ''
  for (const model of models) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } },
          ],
        }],
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      lastError = (err as { error?: { message?: string } }).error?.message ?? `API ${res.status}`
      if (res.status === 429 || res.status === 404 || res.status === 400) continue
      throw new Error(lastError)
    }

    const json = await res.json() as { choices: { message: { content: string } }[] }
    const raw  = json.choices[0].message.content.trim()
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    const parsed  = JSON.parse(cleaned)
    return Array.isArray(parsed) ? parsed : [parsed]
  }
  throw new Error(lastError || 'Groq 모델 호출 실패')
}

async function extractWithGeminiVision(
  file: File | Blob,
  apiKey: string,
  mimeType = 'image/jpeg'
): Promise<Partial<ParsedQuestion>[]> {
  const base64 = await fileToBase64(file)

  const prompt = `Extract all quiz questions from this image.
Return a JSON array. Each element must have EXACTLY these keys:
- "text": full question text (no question number prefix)
- "options": array of exactly 4 strings [optionA, optionB, optionC, optionD] (plain text, no "a." prefix)
- "correctAnswer": 0-based index (0=A,1=B,2=C,3=D) for single answer, OR an array of indices like [0,2] for multiple correct answers.
- "category": "" (empty string)
- "explanation": "" (empty string)
Correct answers are shown by checkmarks ✓ or ☑ or checked/filled checkboxes or highlighted rows.
If TWO OR MORE options are marked correct, set "correctAnswer" to an array of all correct indices, e.g. [0,2].
Return ONLY the raw JSON array, no markdown, no explanation.`

  // 모델 우선순위: 1.5-flash(v1) → 1.5-flash(v1beta) → 1.5-flash-8b
  const endpoints = [
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${apiKey}`,
  ]

  const body = JSON.stringify({
    contents: [{
      parts: [
        { text: prompt },
        { inline_data: { mime_type: mimeType, data: base64 } },
      ],
    }],
    generationConfig: { temperature: 0, maxOutputTokens: 2000 },
  })

  let lastError = ''
  for (const url of endpoints) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      lastError = (err as { error?: { message?: string } }).error?.message ?? `API ${res.status}`
      // quota 초과(429)나 모델 미발견(404)이면 다음 모델 시도
      if (res.status === 429 || res.status === 404) continue
      throw new Error(lastError)
    }

    const json = await res.json() as { candidates: { content: { parts: { text: string }[] } }[] }
    const raw  = json.candidates[0].content.parts[0].text.trim()
    const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    const parsed  = JSON.parse(cleaned)
    return Array.isArray(parsed) ? parsed : [parsed]
  }

  throw new Error(lastError || '사용 가능한 Gemini 모델을 찾을 수 없습니다.')
}

async function extractWithGPTVision(
  file: File | Blob,
  apiKey: string,
  mimeType = 'image/jpeg'
): Promise<Partial<ParsedQuestion>[]> {
  const base64 = await fileToBase64(file)

  const prompt = `You are extracting quiz questions from an exam screenshot.

Return a JSON array. Each element must have EXACTLY these keys:
- "text": full question text (no question number prefix)
- "options": array of exactly 4 strings [optionA, optionB, optionC, optionD] (plain text, no "a." prefix)
- "correctAnswer": 0-based index (0=A,1=B,2=C,3=D) for single answer, OR an array of indices like [0,2] for multiple correct answers.
- "category": "" (empty string)
- "explanation": "" (empty string)

Correct answers are shown by:
- checkmarks ✓ or ☑ next to an option
- filled/checked checkbox
- highlighted row (green/blue background)

If TWO OR MORE options are marked correct, set "correctAnswer" to an array of all correct indices, e.g. [0,2].
Return ONLY the raw JSON array. No markdown, no explanation.
Example: [{"text":"Q?","options":["A","B","C","D"],"correctAnswer":0,"category":"","explanation":""}]`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}`, detail: 'high' } },
          ],
        },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message ?? `API ${res.status}`)
  }

  const json = await res.json() as { choices: { message: { content: string } }[] }
  const raw  = json.choices[0].message.content.trim()
  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  const parsed  = JSON.parse(cleaned)
  return Array.isArray(parsed) ? parsed : [parsed]
}

/* ────────────────────────────────────────
   OCR 전처리: Canvas API 로 이미지 대비 강화
───────────────────────────────────────── */
async function preprocessImageForOcr(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = document.createElement('img') as HTMLImageElement
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const MAX = 2400
      let w = img.naturalWidth
      let h = img.naturalHeight
      if (w > MAX || h > MAX) {
        const s = MAX / Math.max(w, h)
        w = Math.round(w * s)
        h = Math.round(h * s)
      } else if (w < 1000) {
        const s = 1000 / w
        w = Math.round(w * s)
        h = Math.round(h * s)
      }
      const canvas = document.createElement('canvas')
      canvas.width  = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)

      const id   = ctx.getImageData(0, 0, w, h)
      const d    = id.data
      for (let i = 0; i < d.length; i += 4) {
        const gray    = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
        // 대비 강화: 밝은 픽셀(배경)은 흰색으로, 어두운 픽셀(텍스트)은 더 진하게
        const enhanced = gray > 200 ? 255 : Math.max(0, gray * 0.8)
        d[i] = d[i + 1] = d[i + 2] = Math.round(enhanced)
      }
      ctx.putImageData(id, 0, 0)
      canvas.toBlob(
        (blob) => resolve(blob ?? file),
        'image/png'
      )
    }
    img.onerror = () => resolve(file)
    img.src = url
  })
}

/* ────────────────────────────────────────
   한 OCR 텍스트에서 여러 문제 분리
   "Select one[or more]:" 가 2회 이상 나오면 여러 문제로 분리
───────────────────────────────────────── */
function splitIntoQuestions(raw: string): string[] {
  const selectMatches = [...raw.matchAll(/Select\s*one(?:\s+or\s+more)?\s*[:：]/gi)]
  if (selectMatches.length <= 1) return [raw]

  const splitPoints: number[] = [0]

  for (let i = 1; i < selectMatches.length; i++) {
    const prevEnd     = selectMatches[i - 1].index! + selectMatches[i - 1][0].length
    const currStart   = selectMatches[i].index!
    const between     = raw.slice(prevEnd, currStart)

    // "d." 옵션이 끝나는 위치 뒤를 분리 지점으로 사용
    const dMatches = [...between.matchAll(/[dD]\s*[.)]\s+[^\n]+(\n|$)/gm)]
    if (dMatches.length > 0) {
      const lastD   = dMatches[dMatches.length - 1]
      const afterD  = prevEnd + lastD.index! + lastD[0].length
      // 다음 질문 텍스트의 실제 시작(빈 줄 이후 첫 내용)
      const gap     = raw.slice(afterD, currStart)
      const content = gap.match(/\S/)
      splitPoints.push(content ? afterD + content.index! : afterD)
    } else {
      // fallback: 사이 텍스트의 중반부
      splitPoints.push(prevEnd + Math.floor(between.length * 0.6))
    }
  }
  splitPoints.push(raw.length)

  const chunks: string[] = []
  for (let i = 0; i < splitPoints.length - 1; i++) {
    const chunk = raw.slice(splitPoints[i], splitPoints[i + 1]).trim()
    if (chunk) chunks.push(chunk)
  }
  return chunks.length > 1 ? chunks : [raw]
}

/* ────────────────────────────────────────
   사진 OCR 등록 탭
───────────────────────────────────────── */
function ImageUploadTab() {
  const [items, setItems]       = useState<OcrItem[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [saving, setSaving]     = useState(false)
  const [saveResult, setSaveResult] = useState<{ added: number; dup: number; incomplete: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // API 키 설정
  const [apiKeyInput, setApiKeyInput] = useState(() =>
    localStorage.getItem('groq_key') || localStorage.getItem('gemini_key') || localStorage.getItem('openai_key') || ''
  )
  const [apiProvider, setApiProvider] = useState<'groq' | 'gemini' | 'openai'>(() => {
    if (localStorage.getItem('groq_key'))   return 'groq'
    if (localStorage.getItem('gemini_key')) return 'gemini'
    return 'openai'
  })
  const [showApiSetting, setShowApiSetting] = useState(
    !localStorage.getItem('groq_key') && !localStorage.getItem('gemini_key') && !localStorage.getItem('openai_key')
  )

  const currentKey =
    apiProvider === 'groq'   ? localStorage.getItem('groq_key')   || '' :
    apiProvider === 'gemini' ? localStorage.getItem('gemini_key') || '' :
                               localStorage.getItem('openai_key') || ''

  const saveApiKey = () => {
    const key = apiKeyInput.trim()
    localStorage.removeItem('groq_key')
    localStorage.removeItem('gemini_key')
    localStorage.removeItem('openai_key')
    if (apiProvider === 'groq')        localStorage.setItem('groq_key',   key)
    else if (apiProvider === 'gemini') localStorage.setItem('gemini_key', key)
    else                               localStorage.setItem('openai_key', key)
    setShowApiSetting(false)
  }

  const addFiles = useCallback((files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (!imageFiles.length) return

    const newItems: OcrItem[] = imageFiles.map((file) => ({
      id: `ocr_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as OcrStatus,
      rawText: '',
      progress: 0,
      parsed: { text: '', options: ['', '', '', ''], correctAnswer: -1, category: '', explanation: '' },
      isDuplicate: false,
      selected: true,
    }))

    setItems((prev) => [...prev, ...newItems])
    setSaveResult(null)
    newItems.forEach((item) => processOcr(item))
  }, []) // eslint-disable-line

  const processOcr = async (item: OcrItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'processing', progress: 10 } : i))
    )
    try {
      const existing = getQuestions()
      let parsedList: Partial<ParsedQuestion>[]

      // ── GPT-4o / Gemini Vision (API 키가 있는 경우 우선 사용) ──
      const groqKey   = localStorage.getItem('groq_key')   || ''
      const openaiKey = localStorage.getItem('openai_key') || ''
      const geminiKey = localStorage.getItem('gemini_key') || ''

      if (groqKey || openaiKey || geminiKey) {
        setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, progress: 30 } : i))
        if (groqKey) {
          parsedList = await extractWithGroqVision(item.file, groqKey, item.file.type || 'image/jpeg')
        } else if (geminiKey) {
          parsedList = await extractWithGeminiVision(item.file, geminiKey, item.file.type || 'image/jpeg')
        } else {
          parsedList = await extractWithGPTVision(item.file, openaiKey, item.file.type || 'image/jpeg')
        }
        setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, progress: 90 } : i))
      } else {
        // ── Tesseract 폴백 ──────────────────────────────────────
        let imageInput: File | Blob = item.file
        try { imageInput = await preprocessImageForOcr(item.file) } catch { /* 원본 사용 */ }

        const { createWorker } = await import('tesseract.js')
        const worker = await createWorker(['kor', 'eng'], 1, {
          logger: (m: { status: string; progress: number }) => {
            if (m.status === 'recognizing text') {
              setItems((prev) =>
                prev.map((i) =>
                  i.id === item.id ? { ...i, progress: Math.round(10 + m.progress * 80) } : i
                )
              )
            }
          },
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await worker.setParameters({ tessedit_pageseg_mode: '6' } as any)
        const { data } = await worker.recognize(imageInput)
        await worker.terminate()

        const chunks = splitIntoQuestions(data.text)
        parsedList = chunks.map((c) => parseQuestionText(c)).filter((p) => p.text?.trim())
        if (parsedList.length === 0) parsedList = [parseQuestionText(data.text)]
      }

      // ── 결과 반영 ────────────────────────────────────────────
      // AI가 correctAnswer를 배열로 반환할 경우 정규화
      parsedList = parsedList.map((p) => {
        const ca = (p as Partial<ParsedQuestion> & { correctAnswer?: number | number[] }).correctAnswer
        if (Array.isArray(ca)) {
          return { ...p, correctAnswer: ca[0] ?? -1, multipleCorrect: ca.length > 1 ? ca : undefined }
        }
        return p
      })
      if (parsedList.length === 1) {
        const parsed      = parsedList[0]
        const isDuplicate = !!parsed.text?.trim() &&
          existing.some((q) => q.text.trim().toLowerCase() === parsed.text!.trim().toLowerCase())
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: 'done', progress: 100, rawText: parsed.text ?? '', parsed, isDuplicate }
              : i
          )
        )
      } else {
        const newItems: OcrItem[] = parsedList.map((parsed, idx) => {
          const isDuplicate = !!parsed.text?.trim() &&
            existing.some((q) => q.text.trim().toLowerCase() === parsed.text!.trim().toLowerCase())
          return {
            id: `ocr_${Date.now()}_${idx}_${Math.random().toString(36).slice(2)}`,
            file: item.file,
            preview: item.preview,
            status: 'done' as OcrStatus,
            rawText: parsed.text ?? '',
            progress: 100,
            parsed,
            isDuplicate,
            selected: true,
          }
        })
        setItems((prev) => [
          ...prev.filter((i) => i.id !== item.id),
          ...newItems,
        ])
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '인식에 실패했습니다.'
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, status: 'error', progress: 0, errorMsg: msg }
            : i
        )
      )
    }
  }

  const updateParsed = (
    id: string,
    field: keyof ParsedQuestion | 'toggleMultiCorrect',
    value: string | number,
    optIdx?: number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const parsed = { ...item.parsed }
        if (field === 'options' && optIdx !== undefined) {
          const opts = [...(parsed.options ?? ['', '', '', ''])] as [string, string, string, string]
          opts[optIdx] = value as string
          parsed.options = opts
        } else if (field === 'toggleMultiCorrect') {
          const idx = value as number
          const cur = [...(parsed.multipleCorrect ?? (parsed.correctAnswer !== undefined && parsed.correctAnswer >= 0 ? [parsed.correctAnswer] : []))]
          const pos = cur.indexOf(idx)
          if (pos >= 0) {
            cur.splice(pos, 1)
          } else {
            cur.push(idx)
            cur.sort((a, b) => a - b)
          }
          parsed.multipleCorrect = cur.length > 0 ? cur : []
          parsed.correctAnswer   = cur.length > 0 ? cur[0] : -1
        } else {
          ;(parsed as Record<string, unknown>)[field] = value
          if (field === 'correctAnswer') {
            parsed.multipleCorrect = undefined
          }
        }
        const existing    = getQuestions()
        const isDuplicate = !!parsed.text?.trim() &&
          existing.some((q) => q.text.trim().toLowerCase() === (parsed.text as string).trim().toLowerCase())
        return { ...item, parsed, isDuplicate }
      })
    )
  }

  const handleSaveSelected = () => {
    setSaving(true)
    const toSave = items.filter((i) => i.selected && i.status === 'done' && !i.isDuplicate)
    const existing   = getQuestions()
    const newQs: Question[] = []
    let added = 0, dup = 0, incomplete = 0

    for (const item of toSave) {
      const p = item.parsed
      if (
        !p.text?.trim() ||
        p.options?.some((o) => !o.trim()) ||
        (p.correctAnswer ?? -1) < 0
      ) { incomplete++; continue }

      const norm = p.text.trim().toLowerCase()
      const isDup =
        existing.some((q) => q.text.trim().toLowerCase() === norm) ||
        newQs.some((q) => q.text.trim().toLowerCase() === norm)
      if (isDup) { dup++; continue }

      newQs.push({
        id: `q_img_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        text: p.text!,
        options: p.options as [string, string, string, string],
        correctAnswer: p.multipleCorrect && p.multipleCorrect.length > 1 ? p.multipleCorrect : p.correctAnswer!,
        category: p.category || '기타',
        explanation: p.explanation || '',
      })
      added++
    }

    if (newQs.length) saveQuestions([...existing, ...newQs])
    setSaveResult({ added, dup, incomplete })
    setSaving(false)

    const savedIds = new Set(
      items
        .filter((i) => i.selected && i.status === 'done' && !i.isDuplicate)
        .filter((i) => {
          const p = i.parsed
          return p.text?.trim() && !p.options?.some((o) => !o.trim()) && (p.correctAnswer ?? -1) >= 0
        })
        .map((i) => i.id)
    )
    setItems((prev) => prev.filter((i) => !savedIds.has(i.id)))
  }

  const removeItem = (id: string) => {
    setItems((prev) => {
      const it = prev.find((i) => i.id === id)
      if (it) URL.revokeObjectURL(it.preview)
      return prev.filter((i) => i.id !== id)
    })
  }

  const retryItem = (id: string) => {
    const it = items.find((i) => i.id === id)
    if (it) processOcr(it)
  }

  const selectedCount   = items.filter((i) => i.selected && i.status === 'done' && !i.isDuplicate).length
  const processingCount = items.filter((i) => i.status === 'processing').length

  return (
    <div>
      {/* API 키 설정 배너 */}
      {showApiSetting ? (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="font-semibold text-blue-900 text-sm">AI Vision API 키 설정</p>
              <p className="text-blue-700 text-xs mt-0.5">
                AI가 사진에서 문제·보기·정답을 자동으로 인식합니다. API 키는 이 기기에만 저장됩니다.
              </p>
            </div>
            {currentKey && (
              <button onClick={() => setShowApiSetting(false)} className="text-blue-400 hover:text-blue-600 flex-shrink-0">
                <X size={16} />
              </button>
            )}
          </div>

          {/* 제공사 선택 */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => { setApiProvider('groq'); setApiKeyInput(localStorage.getItem('groq_key') || '') }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${
                apiProvider === 'groq' ? 'border-blue-500 bg-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Groq <span className="text-xs font-normal opacity-80">(무료 추천)</span>
            </button>
            <button
              onClick={() => { setApiProvider('gemini'); setApiKeyInput(localStorage.getItem('gemini_key') || '') }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${
                apiProvider === 'gemini' ? 'border-blue-500 bg-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Gemini <span className="text-xs font-normal opacity-80">(무료)</span>
            </button>
            <button
              onClick={() => { setApiProvider('openai'); setApiKeyInput(localStorage.getItem('openai_key') || '') }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${
                apiProvider === 'openai' ? 'border-blue-500 bg-blue-600 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              OpenAI <span className="text-xs font-normal opacity-80">(유료)</span>
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveApiKey()}
              placeholder={apiProvider === 'groq' ? 'gsk_...' : apiProvider === 'gemini' ? 'AIza...' : 'sk-...'}
              className="flex-1 border border-blue-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              onClick={saveApiKey}
              disabled={!apiKeyInput.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              저장
            </button>
          </div>

          {apiProvider === 'groq' ? (
            <p className="text-xs text-blue-600 mt-2">
              무료 API 키 발급 (가입 즉시 사용):&nbsp;
              <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="underline font-medium">
                console.groq.com/keys
              </a>
            </p>
          ) : apiProvider === 'gemini' ? (
            <p className="text-xs text-blue-600 mt-2">
              무료 API 키:&nbsp;
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-medium">
                aistudio.google.com/app/apikey
              </a>
            </p>
          ) : (
            <p className="text-xs text-blue-500 mt-2">
              API 키:&nbsp;
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="underline">
                platform.openai.com/api-keys
              </a>
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mb-5">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <CheckCircle size={15} className="text-green-600" />
            <span className="font-medium">
              {localStorage.getItem('gemini_key') ? 'Google Gemini Vision 연동됨' : 'GPT-4o Vision 연동됨'}
            </span>
            <span className="text-green-600">— 사진 업로드 시 자동으로 정확하게 인식합니다</span>
          </div>
          <button
            onClick={() => setShowApiSetting(true)}
            className="text-xs text-green-600 hover:underline"
          >
            키 변경
          </button>
        </div>
      )}

      {/* 업로드 영역 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-5 border border-gray-100">
        <h2 className="font-bold text-gray-900 text-lg mb-1">사진으로 문제 등록</h2>
        <p className="text-gray-500 text-sm mb-5">
          {currentKey
            ? 'AI Vision이 문제·보기·정답을 자동으로 인식합니다. 한 장에 여러 문제가 있어도 자동 분리됩니다.'
            : 'API 키를 설정하면 AI Vision으로 정확하게 인식합니다. 현재는 Tesseract OCR을 사용합니다.'}
        </p>

        <div
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Image size={32} className="text-blue-500" />
          </div>
          <p className="font-semibold text-gray-800 text-lg">사진을 드래그하거나 클릭하여 선택</p>
          <p className="text-gray-400 text-sm mt-1">JPG, PNG, WEBP · 여러 장 동시 선택 가능</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
        </div>

        {/* 인식 포맷 안내 */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              title: '체크마크형',
              desc: '정답 보기에 ✓ 또는 채워진 라디오 버튼이 있는 형식',
              color: 'bg-green-50 border-green-200 text-green-800',
            },
            {
              title: 'Moodle 형식',
              desc: '"Correct" 레이블 + 초록 배경으로 표시되는 형식',
              color: 'bg-blue-50 border-blue-200 text-blue-800',
            },
            {
              title: '체크박스형',
              desc: '☑ 체크박스로 정답이 표시되는 형식 (복수 정답 포함)',
              color: 'bg-purple-50 border-purple-200 text-purple-800',
            },
          ].map((f) => (
            <div key={f.title} className={`border rounded-xl p-3 text-sm ${f.color}`}>
              <p className="font-semibold mb-0.5">{f.title}</p>
              <p className="opacity-80">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
          <p className="font-semibold mb-1">촬영 팁</p>
          <p>문제·보기(a/b/c/d)·정답 표시가 모두 보이도록 촬영하세요. 초록 배경(Moodle) 형식은 "정답" 위치를 자동 감지하기 어려울 수 있으니, 인식 후 정답을 직접 확인해 주세요.</p>
        </div>
      </div>

      {/* 저장 결과 */}
      {saveResult && (
        <div className={`rounded-xl p-4 mb-5 flex items-center gap-3 text-sm font-medium ${
          saveResult.added > 0 ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-gray-50 border border-gray-200 text-gray-600'
        }`}>
          <CheckCircle size={18} className={saveResult.added > 0 ? 'text-green-600' : 'text-gray-400'} />
          <span>
            {saveResult.added}개 저장 완료
            {saveResult.dup > 0 && ` · 중복 ${saveResult.dup}개 제외`}
            {saveResult.incomplete > 0 && ` · 내용 미완성 ${saveResult.incomplete}개 제외 (정답 미설정 포함)`}
          </span>
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">
              총 {items.length}장
              {processingCount > 0 && (
                <span className="ml-2 text-blue-600 ocr-processing">({processingCount}장 인식 중...)</span>
              )}
            </p>
            <button
              onClick={handleSaveSelected}
              disabled={selectedCount === 0 || saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {saving ? <Loader size={15} className="animate-spin" /> : <CheckCircle size={15} />}
              선택 항목 저장 ({selectedCount}개)
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <OcrCard
                key={item.id}
                item={item}
                expanded={expandedId === item.id}
                onToggleExpand={() => setExpandedId(expandedId === item.id ? null : item.id)}
                onToggleSelect={() =>
                  setItems((prev) =>
                    prev.map((i) => (i.id === item.id ? { ...i, selected: !i.selected } : i))
                  )
                }
                onRemove={() => removeItem(item.id)}
                onRetry={() => retryItem(item.id)}
                onUpdateParsed={(field, value, optIdx) => updateParsed(item.id, field, value, optIdx)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ────────────────────────────────────────
   OCR 카드
───────────────────────────────────────── */
function OcrCard({
  item, expanded,
  onToggleExpand, onToggleSelect, onRemove, onRetry, onUpdateParsed,
}: {
  item: OcrItem
  expanded: boolean
  onToggleExpand: () => void
  onToggleSelect: () => void
  onRemove: () => void
  onRetry: () => void
  onUpdateParsed: (field: keyof ParsedQuestion | 'toggleMultiCorrect', value: string | number, optIdx?: number) => void
}) {
  const statusInfo = {
    pending:    { label: '대기 중',    cls: 'bg-gray-100 text-gray-500',   icon: <Clock size={14} /> },
    processing: { label: 'OCR 처리 중', cls: 'bg-blue-100 text-blue-700', icon: <Loader size={14} className="animate-spin" /> },
    done:       { label: '인식 완료',  cls: 'bg-green-100 text-green-700', icon: <CheckCircle size={14} /> },
    error:      { label: '인식 실패',  cls: 'bg-red-100 text-red-600',     icon: <AlertCircle size={14} /> },
  }
  const s = statusInfo[item.status]

  const noCorrect = item.status === 'done' && (item.parsed.correctAnswer ?? -1) < 0
  const incomplete = item.status === 'done' && (
    !item.parsed.text?.trim() || item.parsed.options?.some((o) => !o.trim()) || noCorrect
  )
  const hasMultiple = (item.parsed.multipleCorrect?.length ?? 0) > 1

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-2 transition-colors ${
      item.isDuplicate ? 'border-amber-300' :
      incomplete ? 'border-orange-300' :
      item.selected && item.status === 'done' ? 'border-blue-300' : 'border-gray-100'
    }`}>
      {/* 헤더 */}
      <div className="flex items-center gap-3 p-4">
        <input
          type="checkbox"
          checked={item.selected && item.status === 'done' && !item.isDuplicate}
          disabled={item.status !== 'done' || item.isDuplicate}
          onChange={onToggleSelect}
          className="w-4 h-4 accent-blue-600 flex-shrink-0"
        />
        <img src={item.preview} alt="" className="w-16 h-16 object-cover rounded-xl border border-gray-200 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>
              {s.icon}{s.label}
            </span>
            {item.isDuplicate && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">중복</span>
            )}
            {noCorrect && !item.isDuplicate && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                정답 미설정 — 클릭하여 수정
              </span>
            )}
            {hasMultiple && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                복수 정답 감지 ({item.parsed.multipleCorrect?.map((i) => 'ABCD'[i]).join(', ')})
              </span>
            )}
            {item.parsed.selectOneOrMore && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">복수 선택형</span>
            )}
          </div>

          {item.status === 'processing' && (
            <div className="mt-1">
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${item.progress}%` }} />
              </div>
              <p className="text-xs text-blue-600 mt-0.5 tabular-nums">{item.progress}%</p>
            </div>
          )}

          {item.status === 'done' && (
            <p className="text-sm text-gray-700 line-clamp-1">{item.parsed.text || '(문제 텍스트 없음)'}</p>
          )}
          {item.status === 'error' && <p className="text-sm text-red-500">{item.errorMsg}</p>}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {item.status === 'error' && (
            <button onClick={onRetry} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg" title="재시도">
              <RotateCcw size={15} />
            </button>
          )}
          {item.status === 'done' && (
            <button onClick={onToggleExpand} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          )}
          <button onClick={onRemove} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* 편집 영역 */}
      {expanded && item.status === 'done' && (
        <div className="border-t border-gray-100 p-5 space-y-4">
          {item.isDuplicate && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              이미 동일한 문제가 등록되어 있습니다. 문제 내용을 수정하면 재확인됩니다.
            </div>
          )}

          {hasMultiple && (
            <div className="flex items-start gap-2 bg-purple-50 border border-purple-200 rounded-xl p-3 text-sm text-purple-800">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              복수 정답이 감지되었습니다. 아래에서 정답 항목을 모두 선택(체크)해 주세요.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">카테고리</label>
              <input
                value={item.parsed.category ?? ''}
                onChange={(e) => onUpdateParsed('category', e.target.value)}
                placeholder="예: 이적 규정"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                정답 선택 {noCorrect && <span className="text-orange-500 normal-case">(필수)</span>}
                {hasMultiple && <span className="text-purple-600 normal-case ml-1">(복수 선택)</span>}
              </label>
              <div className="flex gap-2">
                {['A', 'B', 'C', 'D'].map((ch, i) => {
                  const isSelected = hasMultiple
                    ? (item.parsed.multipleCorrect ?? []).includes(i)
                    : item.parsed.correctAnswer === i
                  return (
                    <button
                      key={ch}
                      onClick={() => hasMultiple
                        ? onUpdateParsed('toggleMultiCorrect', i)
                        : onUpdateParsed('correctAnswer', i)
                      }
                      className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${
                        isSelected
                          ? 'border-green-500 bg-green-500 text-white shadow-sm'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {ch}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">문제</label>
            <textarea
              value={item.parsed.text ?? ''}
              onChange={(e) => onUpdateParsed('text', e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(['A', 'B', 'C', 'D'] as const).map((ch, i) => {
              const isCorrectOpt = hasMultiple
                ? (item.parsed.multipleCorrect ?? []).includes(i)
                : item.parsed.correctAnswer === i
              return (
                <div key={ch}>
                  <label className={`block text-xs font-semibold mb-1.5 ${isCorrectOpt ? 'text-green-600' : 'text-gray-500'}`}>
                    보기 {ch} {isCorrectOpt && '✓ 정답'}
                  </label>
                  <input
                    value={item.parsed.options?.[i] ?? ''}
                    onChange={(e) => onUpdateParsed('options', e.target.value, i)}
                    placeholder={`보기 ${ch}`}
                    className={`w-full border-2 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isCorrectOpt ? 'border-green-300 bg-green-50' : 'border-gray-200'
                    }`}
                  />
                </div>
              )
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">해설</label>
            <textarea
              value={item.parsed.explanation ?? ''}
              onChange={(e) => onUpdateParsed('explanation', e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <details className="text-xs">
            <summary className="cursor-pointer text-gray-400 hover:text-gray-600 select-none">
              OCR 원본 텍스트 보기
            </summary>
            <pre className="mt-2 bg-gray-50 rounded-xl p-3 text-gray-600 whitespace-pre-wrap leading-relaxed overflow-auto max-h-48">
              {item.rawText}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────
   문제 관리 탭
───────────────────────────────────────── */
function QuestionsTab() {
  const [questions, setQuestions] = useState<Question[]>(getQuestions)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [bulkText, setBulkText] = useState('')
  const [bulkError, setBulkError] = useState('')
  const [bulkPreview, setBulkPreview] = useState<Question[]>([])
  const [form, setForm] = useState({ text: '', options: ['', '', '', ''], correctAnswer: 0, category: '', explanation: '' })
  const [formError, setFormError] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')

  const filtered = searchText
    ? questions.filter(
        (q) => q.text.toLowerCase().includes(searchText.toLowerCase()) ||
               q.category.toLowerCase().includes(searchText.toLowerCase())
      )
    : questions

  const handleAddQuestion = () => {
    setFormError('')
    if (!form.text.trim() || form.options.some((o) => !o.trim()) || !form.category.trim() || !form.explanation.trim()) {
      setFormError('모든 필드를 입력해 주세요.')
      return
    }
    if (questions.some((q) => q.text.trim().toLowerCase() === form.text.trim().toLowerCase())) {
      setFormError('동일한 문제가 이미 존재합니다.')
      return
    }
    const newQ: Question = {
      id: `q_${Date.now()}`,
      text: form.text.trim(),
      options: form.options.map((o) => o.trim()) as [string, string, string, string],
      correctAnswer: form.correctAnswer,
      category: form.category.trim(),
      explanation: form.explanation.trim(),
    }
    const updated = [...questions, newQ]
    setQuestions(updated)
    saveQuestions(updated)
    setForm({ text: '', options: ['', '', '', ''], correctAnswer: 0, category: '', explanation: '' })
    setShowAddForm(false)
  }

  const handleDelete = (id: string) => {
    const updated = questions.filter((q) => q.id !== id)
    setQuestions(updated)
    saveQuestions(updated)
    setDeleteId(null)
  }

  const handleParseBulk = () => {
    setBulkError('')
    setBulkPreview([])
    try {
      const parsed = JSON.parse(bulkText)
      if (!Array.isArray(parsed)) throw new Error('배열 형식이어야 합니다.')
      const newQs: Question[] = []
      const dups: string[] = []
      for (const item of parsed) {
        if (!item.text || !Array.isArray(item.options) || item.options.length !== 4
          || typeof item.correctAnswer !== 'number' || !item.category || !item.explanation) {
          throw new Error('필수 필드 누락 (text, options[4], correctAnswer, category, explanation)')
        }
        const norm = item.text.trim().toLowerCase()
        if (questions.some((q) => q.text.trim().toLowerCase() === norm) ||
            newQs.some((q) => q.text.trim().toLowerCase() === norm)) {
          dups.push(item.text.slice(0, 30) + '...')
          continue
        }
        newQs.push({ id: `q_${Date.now()}_${Math.random()}`, ...item })
      }
      if (dups.length) setBulkError(`중복 ${dups.length}개 제외: ${dups.join(' / ')}`)
      setBulkPreview(newQs)
    } catch (e) {
      setBulkError(e instanceof Error ? e.message : 'JSON 파싱 오류')
    }
  }

  const handleBulkSave = () => {
    const updated = [...questions, ...bulkPreview]
    setQuestions(updated)
    saveQuestions(updated)
    setBulkPreview([])
    setBulkText('')
    setShowBulkUpload(false)
  }

  const downloadTemplate = () => {
    const blob = new Blob([JSON.stringify([{
      text: '문제 내용',
      options: ['보기 1', '보기 2', '보기 3', '보기 4'],
      correctAnswer: 0,
      category: '카테고리',
      explanation: '해설',
    }], null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'questions_template.json'
    a.click()
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <p className="text-gray-500 text-sm">총 <strong className="text-gray-900">{questions.length}</strong>개</p>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="문제 검색..."
            className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBulkUpload(true)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
            <Upload size={14} /> JSON 일괄
          </button>
          <button onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
            <Plus size={14} /> 문제 추가
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl">
            {searchText ? '검색 결과가 없습니다.' : '등록된 문제가 없습니다.'}
          </div>
        )}
        {filtered.map((q, i) => (
          <div key={q.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-400">Q{i + 1}</span>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{q.category}</span>
                </div>
                <p className="text-gray-900 text-sm font-medium leading-relaxed">{q.text}</p>
                <div className="mt-2 space-y-0.5">
                  {q.options.map((opt, j) => (
                    <p key={j} className={`text-xs ${j === q.correctAnswer ? 'text-green-700 font-semibold' : 'text-gray-500'}`}>
                      {j === q.correctAnswer ? '✓ ' : ''}{String.fromCharCode(65 + j)}. {opt}
                    </p>
                  ))}
                </div>
              </div>
              <button onClick={() => setDeleteId(q.id)}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 문제 추가 모달 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto modal-overlay">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl my-4 modal-panel">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">문제 추가</h2>
              <button onClick={() => { setShowAddForm(false); setFormError('') }}><X size={20} className="text-gray-500" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="예: 수수료 규정"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">문제</label>
                <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })}
                  rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              {form.options.map((opt, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    보기 {String.fromCharCode(65 + i)}{i === form.correctAnswer && <span className="text-green-600 ml-1">(정답)</span>}
                  </label>
                  <div className="flex gap-2">
                    <input value={opt} onChange={(e) => {
                      const u = [...form.options]; u[i] = e.target.value; setForm({ ...form, options: u })
                    }} className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button onClick={() => setForm({ ...form, correctAnswer: i })}
                      className={`px-3 rounded-xl text-sm font-medium ${i === form.correctAnswer ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      정답
                    </button>
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">해설</label>
                <textarea value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                  rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              {formError && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle size={14} />{formError}</p>}
              <div className="flex gap-3 justify-end">
                <button onClick={() => { setShowAddForm(false); setFormError('') }}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 text-sm">취소</button>
                <button onClick={handleAddQuestion}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium">저장</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JSON 일괄 업로드 모달 */}
      {showBulkUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto modal-overlay">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-xl my-4 modal-panel">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900">JSON 일괄 업로드</h2>
              <button onClick={() => { setShowBulkUpload(false); setBulkPreview([]); setBulkText(''); setBulkError('') }}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <button onClick={downloadTemplate} className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4">
              <Download size={14} /> JSON 템플릿 다운로드
            </button>
            <textarea value={bulkText} onChange={(e) => { setBulkText(e.target.value); setBulkPreview([]) }}
              placeholder='[{"text":"문제","options":["A","B","C","D"],"correctAnswer":0,"category":"카테고리","explanation":"해설"}]'
              rows={10}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3" />
            {bulkError && (
              <div className="flex items-start gap-2 text-amber-700 bg-amber-50 rounded-xl p-3 mb-3 text-sm">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />{bulkError}
              </div>
            )}
            {bulkPreview.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <p className="text-green-700 font-semibold text-sm mb-1">{bulkPreview.length}개 추가 예정</p>
                {bulkPreview.slice(0, 3).map((q, i) => (
                  <p key={i} className="text-green-700 text-xs truncate">• {q.text}</p>
                ))}
                {bulkPreview.length > 3 && <p className="text-green-600 text-xs mt-0.5">...외 {bulkPreview.length - 3}개</p>}
              </div>
            )}
            <div className="flex gap-3 justify-end">
              {bulkPreview.length === 0 ? (
                <button onClick={handleParseBulk}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded-xl text-sm font-medium">
                  <Eye size={14} /> 미리보기
                </button>
              ) : (
                <button onClick={handleBulkSave}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium">
                  <Upload size={14} /> {bulkPreview.length}개 저장
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full modal-panel">
            <h3 className="font-bold text-gray-900 mb-2">문제를 삭제하시겠습니까?</h3>
            <p className="text-gray-500 text-sm mb-5">이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 text-sm">취소</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium">삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────
   학습자료 탭
───────────────────────────────────────── */
function MaterialsTab() {
  const [materials, setMaterials] = useState<StudyMaterial[]>(getStudyMaterials)
  const [preview, setPreview] = useState<StudyMaterial | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const mat: StudyMaterial = {
          id: `m_${Date.now()}_${Math.random()}`,
          name: file.name,
          type: file.type,
          content: ev.target?.result as string,
          uploadedAt: new Date().toISOString(),
        }
        setMaterials((prev) => { const u = [...prev, mat]; saveStudyMaterials(u); return u })
      }
      if (file.type === 'text/plain') reader.readAsText(file)
      else reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  return (
    <div>
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
        <h2 className="font-bold text-gray-900 mb-2">학습자료 업로드</h2>
        <p className="text-gray-500 text-sm mb-4">시험 중 오픈북으로 열람할 수 있는 자료를 업로드하세요.</p>
        <label className="flex items-center justify-center gap-3 border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl p-8 cursor-pointer hover:bg-blue-100 transition-colors">
          <Upload size={24} className="text-blue-500" />
          <div className="text-center">
            <p className="font-semibold text-blue-700">파일 선택 또는 드래그</p>
            <p className="text-sm text-blue-500 mt-1">PDF, TXT, PNG, JPG · 여러 파일 동시 업로드</p>
          </div>
          <input type="file" multiple accept=".pdf,.txt,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>
      <div className="space-y-3">
        {materials.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl">업로드된 자료가 없습니다.</div>
        )}
        {materials.map((mat) => (
          <div key={mat.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{mat.name}</p>
                <p className="text-xs text-gray-400">{new Date(mat.uploadedAt).toLocaleDateString('ko-KR')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => setPreview(mat)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Eye size={16} /></button>
              <button onClick={() => {
                const u = materials.filter((m) => m.id !== mat.id)
                setMaterials(u); saveStudyMaterials(u)
              }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
      {preview && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 modal-overlay">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col modal-panel">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-gray-900 truncate">{preview.name}</h3>
              <button onClick={() => setPreview(null)}><X size={20} className="text-gray-500" /></button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {preview.type === 'text/plain' ? (
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">{preview.content}</pre>
              ) : preview.type === 'application/pdf' ? (
                <iframe src={preview.content} className="w-full h-[60vh]" title={preview.name} />
              ) : (
                <img src={preview.content} alt={preview.name} className="max-w-full h-auto rounded-lg" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────
   회원 관리 탭
───────────────────────────────────────── */
function UsersTab() {
  const users: RegisteredUser[] = getUsers()
  const paid = users.filter((u) => u.hasPaidExam).length
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: '총 회원', value: users.length, color: 'text-gray-900' },
          { label: '모의고사 구매', value: paid, color: 'text-blue-700' },
          { label: '무료 회원', value: users.length - paid, color: 'text-gray-500' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {users.length === 0 && <div className="text-center py-12 text-gray-400">등록된 회원이 없습니다.</div>}
        <div className="divide-y divide-gray-50">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-semibold text-gray-900">{user.lastName}{user.firstName}</p>
                <p className="text-sm text-gray-500">{user.email} · {user.phone} · {user.age}세</p>
                <p className="text-xs text-gray-400 mt-0.5">가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                user.hasPaidExam ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {user.hasPaidExam ? '모의고사 이용 중' : '무료 회원'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
