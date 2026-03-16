export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function AttendancePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal')

  const attendanceDays = [3, 6, 10, 13, 17, 20, 24, 27]
  const absentDays = [8]

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/portal/dashboard" className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-sm mb-6">
          <ChevronLeft className="w-4 h-4" />
          대시보드로 돌아가기
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-8">출결 확인</h1>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h2 className="text-lg font-bold text-slate-900">2024년 7월</h2>
            <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
              <div key={d} className="text-xs font-medium text-slate-400 py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {[...Array(6)].map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                className={`text-sm py-2 rounded-xl font-medium ${
                  attendanceDays.includes(day)
                    ? 'bg-green-500 text-white'
                    : absentDays.includes(day)
                    ? 'bg-red-100 text-red-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '출석', value: attendanceDays.length, color: 'bg-green-500 text-white' },
            { label: '결석', value: absentDays.length, color: 'bg-red-100 text-red-600' },
            { label: '출석률', value: `${Math.round((attendanceDays.length / (attendanceDays.length + absentDays.length)) * 100)}%`, color: 'bg-blue-50 text-blue-600' },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl p-5 text-center ${stat.color}`}>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm mt-1 opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
