export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronLeft, TrendingUp } from 'lucide-react'

const reports = [
  {
    quarter: '2024년 2분기',
    date: '2024-06-30',
    coach: '김철수 감독',
    skills: [
      { label: '드리블', prev: 60, curr: 75 },
      { label: '패스 정확도', prev: 55, curr: 68 },
      { label: '슈팅', prev: 70, curr: 80 },
      { label: '팀워크', prev: 80, curr: 90 },
      { label: '체력', prev: 65, curr: 72 },
      { label: '집중력', prev: 70, curr: 78 },
    ],
    comment: '이번 분기 전반적으로 고르게 성장했습니다. 특히 팀워크와 슈팅 능력이 눈에 띄게 향상되었어요. 다음 분기에는 드리블 돌파 능력 향상에 집중할 예정입니다.',
    nextGoal: '드리블 돌파 능력 향상, 왼발 패스 강화',
  },
  {
    quarter: '2024년 1분기',
    date: '2024-03-31',
    coach: '이영희 코치',
    skills: [
      { label: '드리블', prev: 45, curr: 60 },
      { label: '패스 정확도', prev: 40, curr: 55 },
      { label: '슈팅', prev: 55, curr: 70 },
      { label: '팀워크', prev: 70, curr: 80 },
      { label: '체력', prev: 50, curr: 65 },
      { label: '집중력', prev: 60, curr: 70 },
    ],
    comment: '처음 등록 이후 빠른 적응을 보여줬습니다. 기초 기술이 탄탄하게 잡혔고, 수업 태도도 매우 좋습니다. 앞으로가 더 기대됩니다!',
    nextGoal: '패스 정확도 향상, 포지션 이해 높이기',
  },
]

export default async function ReportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal')

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/portal/dashboard" className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-sm mb-6">
          <ChevronLeft className="w-4 h-4" />
          대시보드로 돌아가기
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-8">성장 리포트</h1>

        <div className="space-y-8">
          {reports.map((report, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{report.quarter}</h2>
                  <p className="text-sm text-slate-400">{report.date} · {report.coach}</p>
                </div>
                {idx === 0 && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">최신</span>
                )}
              </div>

              <div className="space-y-4 mb-6">
                {report.skills.map((skill) => (
                  <div key={skill.label} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-20">{skill.label}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-3 relative">
                      <div className="bg-slate-300 h-3 rounded-full" style={{ width: `${skill.prev}%` }} />
                      <div className="bg-green-500 h-3 rounded-full absolute top-0 left-0 transition-all" style={{ width: `${skill.curr}%` }} />
                    </div>
                    <div className="flex items-center gap-1 text-xs w-16 text-right">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-green-600 font-medium">+{skill.curr - skill.prev}</span>
                      <span className="text-slate-400">→{skill.curr}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-slate-700 mb-1">코치 코멘트</p>
                <p className="text-sm text-slate-600 leading-relaxed">{report.comment}</p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm font-medium text-green-800 mb-1">다음 분기 목표</p>
                <p className="text-sm text-green-700">{report.nextGoal}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
