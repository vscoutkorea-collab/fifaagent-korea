export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CalendarCheck, LineChart, Calendar, Bell, LogOut } from 'lucide-react'

export default async function PortalDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal')

  const quickLinks = [
    { icon: CalendarCheck, label: '출결 확인', href: '/portal/attendance', color: 'bg-blue-50 text-blue-600', desc: '이번 달 출석 현황' },
    { icon: LineChart, label: '성장 리포트', href: '/portal/report', color: 'bg-green-50 text-green-600', desc: '분기별 성장 기록' },
    { icon: Calendar, label: '수업 일정', href: '/portal/schedule', color: 'bg-purple-50 text-purple-600', desc: '이번 주 수업 일정' },
    { icon: Bell, label: '공지사항', href: '/news', color: 'bg-orange-50 text-orange-600', desc: '최신 공지 확인' },
  ]

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-slate-500 text-sm">환영합니다</p>
            <h1 className="text-2xl font-bold text-slate-900">{user.email}</h1>
          </div>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-slate-900 text-sm">{item.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              이번 달 출결 현황
            </h2>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                <div key={d} className="text-xs text-slate-400 py-1">{d}</div>
              ))}
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                <div
                  key={day}
                  className={`text-xs py-1 rounded-full ${
                    [3, 6, 10, 13, 17, 20, 24, 27].includes(day)
                      ? 'bg-green-500 text-white font-medium'
                      : [8].includes(day)
                      ? 'bg-red-100 text-red-500'
                      : 'text-slate-600'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> 출석</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-100 inline-block" /> 결석</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-green-600" />
              최근 성장 리포트
            </h2>
            <div className="space-y-3">
              {[
                { label: '드리블', value: 75 },
                { label: '패스', value: 68 },
                { label: '슈팅', value: 80 },
                { label: '팀워크', value: 90 },
                { label: '체력', value: 72 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 w-14">{item.label}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-8 text-right">{item.value}</span>
                </div>
              ))}
            </div>
            <Link href="/portal/report" className="block text-center text-sm text-green-600 font-medium mt-4 hover:underline">
              전체 리포트 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
