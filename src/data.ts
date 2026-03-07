import type { Question, StudyPost, StudyMaterial, RegisteredUser, ExamResult, PaymentRequest, PaymentSettings } from './types'

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'FIFA 풋볼 에이전트 규정(FFAR)에 따르면, 에이전트가 선수의 이전(transfer) 계약에서 받을 수 있는 최대 서비스 수수료율은?',
    options: ['선수 연봉의 3%', '선수 연봉의 5%', '선수 연봉의 10%', '제한 없음'],
    correctAnswer: 0,
    category: '수수료 규정',
    explanation: 'FFAR에 따르면 에이전트의 최대 서비스 수수료는 선수 연봉의 3%로 제한됩니다. 단, 선수와 클럽 양측을 모두 대리하는 경우 총 6%까지 가능합니다.',
  },
  {
    id: 'q2',
    text: 'FIFA 에이전트 자격증을 취득하기 위해 필수적으로 통과해야 하는 것은?',
    options: [
      'FIFA가 주관하는 필기시험',
      '각 국가 협회의 면접 심사',
      '국제 스포츠 관련 대학 학위',
      '5년 이상의 축구 관련 경력',
    ],
    correctAnswer: 0,
    category: '자격 요건',
    explanation: 'FIFA 에이전트 자격증을 취득하려면 FIFA가 주관하는 공식 필기시험에 합격해야 합니다. 대학 학위나 특정 경력은 필수 요건이 아닙니다.',
  },
  {
    id: 'q3',
    text: 'FIFA 에이전트가 선수와 클럽을 동시에 대리(이중 대리)할 경우, 반드시 충족해야 하는 조건은?',
    options: [
      '어떠한 경우에도 이중 대리는 금지된다',
      '수수료를 낮춰 대리해야 한다',
      '선수와 클럽 모두의 서면 동의가 있어야 한다',
      'FIFA 특별 허가증이 필요하다',
    ],
    correctAnswer: 2,
    category: '이해 충돌',
    explanation: '이중 대리는 원칙적으로 금지되지만, 선수와 클럽 양측 모두의 서면 동의가 있는 경우 예외적으로 허용될 수 있습니다.',
  },
  {
    id: 'q4',
    text: '미성년자 선수(만 18세 미만)를 대리할 때 FIFA 에이전트가 반드시 준수해야 할 사항은?',
    options: [
      '미성년자 선수는 어떠한 경우에도 대리할 수 없다',
      '부모 또는 법적 보호자의 서면 동의가 필요하다',
      '별도의 미성년자 에이전트 자격증이 필요하다',
      '국가 협회의 특별 허가를 받아야 한다',
    ],
    correctAnswer: 1,
    category: '미성년자 보호',
    explanation: '미성년자 선수를 대리하려면 반드시 부모 또는 법적 보호자의 서면 동의를 받아야 합니다. 미성년자 보호는 FIFA 규정에서 매우 중요하게 다루어집니다.',
  },
  {
    id: 'q5',
    text: 'FIFA 에이전트 자격증의 유효 기간은?',
    options: ['6개월', '1년', '2년', '평생 유효'],
    correctAnswer: 1,
    category: '자격 요건',
    explanation: 'FIFA 에이전트 자격증은 1년간 유효하며, 매년 갱신해야 합니다. 갱신 시에는 연간 등록 수수료 납부 및 요건 충족 여부를 확인합니다.',
  },
  {
    id: 'q6',
    text: 'FIFA 에이전트와 선수 간의 대리 계약(Representation Contract)에 반드시 포함되어야 하는 내용이 아닌 것은?',
    options: ['에이전트의 수수료율', '계약 기간', '대리 서비스의 범위', '에이전트의 이전 고객 목록'],
    correctAnswer: 3,
    category: '계약 요건',
    explanation: '대리 계약에는 수수료율, 계약 기간, 서비스 범위 등이 반드시 포함되어야 합니다. 에이전트의 이전 고객 목록은 필수 기재 사항이 아닙니다.',
  },
  {
    id: 'q7',
    text: 'FIFA 에이전트 등록 요건으로 올바르지 않은 것은?',
    options: [
      '형사 전과 기록이 없어야 한다',
      '전문직 배상책임보험에 가입해야 한다',
      '관련 분야 대학 학위를 소지해야 한다',
      'FIFA 에이전트 시험에 합격해야 한다',
    ],
    correctAnswer: 2,
    category: '자격 요건',
    explanation: 'FIFA 에이전트 자격 취득에 대학 학위는 필수 요건이 아닙니다. 시험 합격, 청렴도 기준 충족, 전문직 배상책임보험 가입 등이 주요 요건입니다.',
  },
  {
    id: 'q8',
    text: 'FIFA 에이전트가 수수료를 받을 수 있는 올바른 방법은?',
    options: [
      '현금으로만 수령해야 한다',
      '투명하고 추적 가능한 금융 거래를 통해서만 받아야 한다',
      '클럽을 통해서만 받아야 한다',
      '선수 계좌를 통해서만 받아야 한다',
    ],
    correctAnswer: 1,
    category: '수수료 규정',
    explanation: 'FFAR은 모든 수수료가 투명하고 추적 가능한 방식(계좌 이체 등)으로 이루어질 것을 요구합니다. 현금 거래 등 불투명한 방식은 금지됩니다.',
  },
  {
    id: 'q9',
    text: 'FIFA 에이전트와 선수 간 대리 계약의 최대 기간은?',
    options: ['1년', '2년', '3년', '5년'],
    correctAnswer: 1,
    category: '계약 요건',
    explanation: 'FFAR에 따르면 에이전트와 선수 간의 대리 계약 기간은 최대 2년입니다.',
  },
  {
    id: 'q10',
    text: '국제 이적 시 반드시 필요한 서류로, 선수의 이전 클럽이 발행하는 문서는?',
    options: [
      '국제 이적 증명서 (ITC)',
      '선수 등록 확인서',
      'FIFA 이적 허가서',
      '국가 협회 승인서',
    ],
    correctAnswer: 0,
    category: '이적 규정',
    explanation: '국제 이적(다른 국가의 클럽으로 이적)이 이루어지려면 반드시 국제 이적 증명서(ITC, International Transfer Certificate)가 필요합니다.',
  },
  {
    id: 'q11',
    text: 'FIFA 에이전트가 미등록 중개인을 활용하거나 협력하는 경우 어떤 결과가 발생하는가?',
    options: [
      '경고 처분만 받는다',
      '일시적 자격 정지',
      '징계 절차가 개시되고 자격 취소 가능성이 있다',
      '벌금만 부과된다',
    ],
    correctAnswer: 2,
    category: '징계 규정',
    explanation: 'FIFA 에이전트가 미등록 중개인과 협력하는 것은 FFAR의 심각한 위반입니다. 이 경우 징계 절차가 개시되고 자격 취소까지 이어질 수 있습니다.',
  },
  {
    id: 'q12',
    text: 'FIFA 에이전트 시험에 응시하기 위한 최소 연령 요건은?',
    options: ['만 16세', '만 18세', '만 21세', '연령 제한 없음'],
    correctAnswer: 1,
    category: '자격 요건',
    explanation: 'FIFA 에이전트 시험에 응시하려면 만 18세 이상이어야 합니다.',
  },
  {
    id: 'q13',
    text: '에이전트의 "성실 의무(Duty of Loyalty)"에 대한 올바른 설명은?',
    options: [
      '에이전트는 클럽의 이익을 최우선으로 해야 한다',
      '에이전트는 자신이 대리하는 고객의 최선의 이익을 위해 행동해야 한다',
      '에이전트는 FIFA의 지시에 우선적으로 따라야 한다',
      '에이전트는 국가 협회의 이익을 대변해야 한다',
    ],
    correctAnswer: 1,
    category: '에이전트 의무',
    explanation: '성실 의무(Duty of Loyalty)는 에이전트가 자신이 대리하는 고객(선수 또는 클럽)의 최선의 이익을 위해 행동해야 한다는 의무입니다.',
  },
  {
    id: 'q14',
    text: 'FIFA 에이전트는 자신의 활동 내역을 어디에 보고해야 하는가?',
    options: [
      'FIFA에만 보고',
      '해당 국가 축구 협회에만 보고',
      'FIFA와 해당 국가 축구 협회 모두에 보고',
      '보고 의무 없음',
    ],
    correctAnswer: 2,
    category: '보고 의무',
    explanation: 'FFAR에 따라 에이전트는 FIFA와 해당 국가 축구 협회 모두에 활동 내역을 보고해야 합니다. 투명성은 FFAR의 핵심 원칙 중 하나입니다.',
  },
  {
    id: 'q15',
    text: 'FIFA 에이전트 규정에서 "약탈적 영입(Poaching)"이란 무엇인가?',
    options: [
      '미성년자 선수를 대리하는 행위',
      '다른 에이전트와 유효한 계약 중인 선수에게 접근하여 계약을 유도하는 행위',
      '부상 선수를 이적시키는 행위',
      '복수의 선수를 동시에 대리하는 행위',
    ],
    correctAnswer: 1,
    category: '금지 행위',
    explanation: '약탈적 영입(Poaching)은 다른 에이전트와 유효한 계약 관계에 있는 선수에게 접근하여 계약 변경을 유도하는 행위로, FFAR에 의해 금지됩니다.',
  },
  {
    id: 'q16',
    text: 'FIFA 에이전트 자격증 갱신에 필요한 것은?',
    options: [
      '매년 재시험 응시',
      '연간 등록 수수료 납부 및 자격 요건 충족 확인',
      '추가 교육 과정 이수 필수',
      '새로운 클라이언트 확보 증명',
    ],
    correctAnswer: 1,
    category: '자격 요건',
    explanation: '에이전트 자격증 갱신을 위해서는 연간 등록 수수료를 납부하고 지속적으로 자격 요건을 충족하고 있음을 확인해야 합니다. 매년 재시험을 볼 필요는 없습니다.',
  },
  {
    id: 'q17',
    text: 'FIFA FFAR 하에서 클럽이 선수의 에이전트 수수료를 대신 지불하는 것은 허용되는가?',
    options: [
      '절대 허용되지 않는다',
      '허용되며, 이 경우 클럽 측 서비스 수수료로 간주된다',
      'FIFA의 특별 승인이 필요하다',
      '선수 연봉의 1.5%를 초과하지 않는 경우에만 허용된다',
    ],
    correctAnswer: 1,
    category: '수수료 규정',
    explanation: '클럽이 선수의 에이전트 수수료를 대신 지불하는 것은 허용됩니다. 이 경우 해당 금액은 클럽 측 서비스에 대한 수수료로 처리되며 관련 규정이 적용됩니다.',
  },
  {
    id: 'q18',
    text: 'FIFA 에이전트 규정에서 정의하는 "에이전트 서비스"에 해당하는 것은?',
    options: [
      '선수의 훈련 계획 수립',
      '선수와 클럽 간의 계약 체결을 위한 중개 및 협상',
      '클럽의 마케팅 전략 개발',
      '선수의 신체 컨디션 관리',
    ],
    correctAnswer: 1,
    category: '에이전트 서비스',
    explanation: '에이전트 서비스의 핵심은 선수와 클럽 간의 계약 체결을 위한 중개 및 협상 활동입니다. 훈련, 마케팅, 컨디션 관리 등은 에이전트의 주요 규제 서비스에 해당하지 않습니다.',
  },
  {
    id: 'q19',
    text: 'FIFA 에이전트가 협박이나 강압으로 계약을 체결한 경우 어떤 결과가 발생하는가?',
    options: [
      '계약은 유효하지만 수수료가 절반으로 감액된다',
      '계약은 무효이며 에이전트 자격이 취소될 수 있다',
      '해당 클럽에 징계가 주어진다',
      '선수에게 위약금이 부과된다',
    ],
    correctAnswer: 1,
    category: '징계 규정',
    explanation: '강압이나 협박으로 체결된 계약은 무효가 되며, 해당 에이전트는 징계 절차를 통해 자격이 취소될 수 있습니다.',
  },
  {
    id: 'q20',
    text: 'FIFA 에이전트 규정에 따라 에이전트가 체결한 모든 대리 계약은 어디에 등록되어야 하는가?',
    options: [
      'FIFA 공식 웹사이트',
      '해당 국가 축구 협회',
      '양 클럽의 공식 사이트',
      '국제 스포츠 중재 재판소 (CAS)',
    ],
    correctAnswer: 1,
    category: '보고 의무',
    explanation: '에이전트가 체결한 대리 계약은 반드시 해당 국가 축구 협회에 등록되어야 합니다. 이는 FFAR의 투명성 요건의 핵심 부분입니다.',
  },
]

export const SAMPLE_STUDY_POSTS: StudyPost[] = [
  {
    id: 'p1',
    author: '김준혁',
    title: '[합격 후기] 3개월 공부 후 1회 합격! 공부 방법 공유합니다',
    content: `안녕하세요! 지난달 FIFA 에이전트 시험에 합격한 김준혁입니다.\n\n저는 약 3개월 준비했고 1회 만에 합격했습니다. 공부 방법을 공유드릴게요.\n\n1. FIFA 공식 규정집(FFAR) 정독: 가장 중요합니다. 최소 3번은 읽으세요.\n2. 과거 기출 문제 풀이: 기출 패턴 파악이 핵심입니다.\n3. 수수료 규정, 계약 요건, 미성년자 보호 규정 집중 공부\n4. 영어 원문 이해: 번역본과 함께 영어 원문도 읽어두면 좋습니다.\n\n시험은 20문제 중 15문제 이상 맞춰야 합격이고, 오픈북이라 당황하지 마세요. 단, 시간이 충분하지 않으니 사전 준비가 필수입니다!`,
    category: 'experience',
    likes: 47,
    createdAt: '2026-02-15',
    comments: [
      { id: 'c1', author: '이민수', content: '합격 축하드려요! 영어 실력이 어느 정도여야 할까요?', createdAt: '2026-02-16' },
      { id: 'c2', author: '김준혁', content: '중학교 영어 수준이면 충분합니다. 법률 용어만 따로 정리해두세요!', createdAt: '2026-02-16' },
    ],
  },
  {
    id: 'p2',
    author: '박소연',
    title: 'FFAR 핵심 요약: 수수료 규정 정리',
    content: `FFAR 수수료 규정 핵심 정리입니다.\n\n【서비스 수수료 상한】\n- 선수 대리: 연봉의 최대 3%\n- 클럽 대리: 이전료의 최대 3%\n- 양측 대리(이해충돌 동의): 합산 최대 6%\n\n【수수료 지급 방식】\n- 반드시 추적 가능한 금융 거래로만 지급\n- 현금 거래 금지\n- 분할 지급 가능 (계약 기간에 따라)\n\n【수수료 미적용 케이스】\n- 선수가 최저 임금 이하를 받는 경우 일부 예외 적용\n\n시험에 자주 출제되는 부분이니 꼭 숙지하세요!`,
    category: 'tip',
    likes: 89,
    createdAt: '2026-02-20',
    comments: [
      { id: 'c3', author: '최동혁', content: '정리 감사합니다! 이 내용이 시험에 자주 나오나요?', createdAt: '2026-02-21' },
      { id: 'c4', author: '박소연', content: '네, 수수료 관련 문제가 3~4문제 정도 나오는 편입니다!', createdAt: '2026-02-21' },
    ],
  },
  {
    id: 'p3',
    author: '이성훈',
    title: '추천 공부 자료 목록 (공식 자료 + 참고 자료)',
    content: `FIFA 에이전트 시험 준비에 도움이 되는 자료 목록입니다.\n\n【공식 자료 (필수)】\n1. FIFA Football Agent Regulations (FFAR) - FIFA 공식 사이트에서 무료 다운로드\n2. FIFA Statutes - FIFA 윤리 강령 포함\n3. Regulations on the Status and Transfer of Players (RSTP)\n\n【참고 자료】\n- FIFA 공식 유튜브 채널의 에이전트 관련 영상\n- 각 국가 협회 홈페이지의 에이전트 등록 안내\n\n【공부 팁】\n특히 FFAR은 영어 원문을 기준으로 공부하되, 한국 협회에서 제공하는 한국어 번역본도 함께 활용하면 좋습니다.`,
    category: 'resource',
    likes: 62,
    createdAt: '2026-02-25',
    comments: [],
  },
  {
    id: 'p4',
    author: '홍길동',
    title: '질문 - 이중 대리 허용 요건이 정확히 어떻게 되나요?',
    content: `안녕하세요. 공부 중에 이중 대리(선수+클럽 동시 대리)에 관한 부분이 헷갈려서 질문드립니다.\n\n1. 이중 대리 자체가 완전 금지인가요, 아니면 조건부 허용인가요?\n2. 만약 허용된다면 어떤 조건이 필요한가요?\n3. 이중 대리 시 수수료는 어떻게 계산되나요?\n\n아시는 분 답변 부탁드립니다!`,
    category: 'question',
    likes: 23,
    createdAt: '2026-02-28',
    comments: [
      { id: 'c5', author: '박소연', content: '조건부 허용입니다! 선수와 클럽 양측 모두의 서면 동의가 있어야 하고, 이 경우 총 수수료는 최대 6%까지 가능합니다.', createdAt: '2026-02-28' },
      { id: 'c6', author: '김준혁', content: '추가로 - 이중 대리는 시험에서 자주 다루는 주제이니 FFAR 해당 조항을 꼭 읽어보세요!', createdAt: '2026-03-01' },
    ],
  },
]

const STORAGE_KEYS = {
  QUESTIONS: 'fifa_questions',
  STUDY_MATERIALS: 'fifa_study_materials',
  USERS: 'fifa_users',
  STUDY_POSTS: 'fifa_study_posts',
  CURRENT_USER: 'fifa_current_user',
  EXAM_RESULT: 'fifa_exam_result',
  PAYMENT_REQUESTS: 'fifa_payment_requests',
  PAYMENT_SETTINGS: 'fifa_payment_settings',
}

export function getQuestions(): Question[] {
  const stored = localStorage.getItem(STORAGE_KEYS.QUESTIONS)
  if (stored) return JSON.parse(stored)
  return []
}

export function saveQuestions(questions: Question[]): void {
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions))
}

const DEFAULT_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'default_study_material_2026',
    name: '2026 FIFA 에이전트 시험 학습자료 (공식)',
    type: 'application/pdf',
    content: '/study-materials.pdf',
    uploadedAt: '2026-01-15T00:00:00.000Z',
  },
]

export function getStudyMaterials(): StudyMaterial[] {
  const stored = localStorage.getItem(STORAGE_KEYS.STUDY_MATERIALS)
  const userMaterials: StudyMaterial[] = stored ? JSON.parse(stored) : []
  const userIds = new Set(userMaterials.map((m) => m.id))
  const defaults = DEFAULT_STUDY_MATERIALS.filter((d) => !userIds.has(d.id))
  return [...defaults, ...userMaterials]
}

export function saveStudyMaterials(materials: StudyMaterial[]): void {
  localStorage.setItem(STORAGE_KEYS.STUDY_MATERIALS, JSON.stringify(materials))
}

export function getUsers(): RegisteredUser[] {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS)
  return stored ? JSON.parse(stored) : []
}

export function saveUsers(users: RegisteredUser[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

export function getStudyPosts(): StudyPost[] {
  const stored = localStorage.getItem(STORAGE_KEYS.STUDY_POSTS)
  if (stored) return JSON.parse(stored)
  return []
}

export function saveStudyPosts(posts: StudyPost[]): void {
  localStorage.setItem(STORAGE_KEYS.STUDY_POSTS, JSON.stringify(posts))
}

export function getCurrentUser(): RegisteredUser | null {
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return stored ? JSON.parse(stored) : null
}

export function setCurrentUser(user: RegisteredUser | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

export function getExamResult(): ExamResult | null {
  const stored = localStorage.getItem(STORAGE_KEYS.EXAM_RESULT)
  return stored ? JSON.parse(stored) : null
}

export function saveExamResult(result: ExamResult): void {
  localStorage.setItem(STORAGE_KEYS.EXAM_RESULT, JSON.stringify(result))
}

export function getRandomExamQuestions(count = 20): Question[] {
  const all = getQuestions()
  if (all.length <= count) return [...all]
  const shuffled = [...all].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getPaymentRequests(): PaymentRequest[] {
  const stored = localStorage.getItem(STORAGE_KEYS.PAYMENT_REQUESTS)
  return stored ? JSON.parse(stored) : []
}

export function savePaymentRequests(requests: PaymentRequest[]): void {
  localStorage.setItem(STORAGE_KEYS.PAYMENT_REQUESTS, JSON.stringify(requests))
}

export function addPaymentRequest(req: Omit<PaymentRequest, 'id' | 'createdAt' | 'status'>): PaymentRequest {
  const requests = getPaymentRequests()
  const newReq: PaymentRequest = {
    ...req,
    id: `pay_${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  savePaymentRequests([newReq, ...requests])
  return newReq
}

export function getPaymentSettings(): PaymentSettings {
  const stored = localStorage.getItem(STORAGE_KEYS.PAYMENT_SETTINGS)
  return stored ? JSON.parse(stored) : {
    kakaoPayQrImage: '',
    kakaoPayLink: '',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
  }
}

export function savePaymentSettings(settings: PaymentSettings): void {
  localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(settings))
}
