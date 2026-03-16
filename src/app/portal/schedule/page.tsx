export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ChevronLeft, Clock, MapPin } from 'lucide-react'

const schedule = [
  { date: '2024-07-08', day: '월', time: '16:00 - 17:30', program: '엘리트반', location: '은계점', coach: '김철수', status: 'upcoming' },
  { date: '2024-07-10', day: '수', time: '16:00 - 17:30', program: '엘리트반', location: '은계점', coach: '김철수', status: 'upcoming' },
  { date: '2024-07-13', day: '토', time: '10:00 - 12:00', program: '엘리트반 특훈', location: '은계점', coach: '김철수', status: 'upcoming' },
  { date: '2024-07-15', day: '월', time: '16:00 - 17:30', program: '엘리트반', location: '은계점', coach: '김철수', status: 'upcoming' },
  { date: '2024-07-03', day: '수', time: '16:00 - 17:30', program: '엘리트반', location: '은계점', coach: '김철수', status: 'completed' },
  { date: '2024-07-01', day: '월', time: '16:00 - 17:30', program: '엘리트반', location: '은계점', coach: '김철수', status: 'completed' },
]

export default async function SchedulePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal')

  const upcoming = schedule.filter((s) => s.status === 'upcoming')
  const past = schedule.filter((s) => s.status === 'completed')

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/portal/dashboard" className="flex items-center gap-1 text-slate-500 hover:text-slate-700 text-sm mb-6">
          <ChevronLeft className="w-4 h-4" />
          대시보드로 돌아가기
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-8">수업 일정</h1>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">예정된 수업</h2>
          <div className="space-y-3">
            {upcoming.map((item, idx) => (
              <div key={idx} className="bg-white border-l-4 border-green-500 rounded-r-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-900">{item.date}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{item.day}요일</span>
                    </div>
                    <p className="font-semibold text-slate-800">{item.program}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>
                    </div>
                  </div>
                  <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full font-medium">예정</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-700 mb-4">지난 수업</h2>
          <div className="space-y-3">
            {past.map((item, idx) => (
              <div key={idx} className="bg-white border-l-4 border-slate-200 rounded-r-2xl p-4 opacity-70">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-700">{item.date}</span>
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{item.day}요일</span>
                    </div>
                    <p className="font-semibold text-slate-700">{item.program}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-medium">완료</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
