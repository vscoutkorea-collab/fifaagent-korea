import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PROGRAMS } from '@/lib/constants'

const colorMap: Record<string, { bg: string; border: string; badge: string; btn: string }> = {
  blue: {
    bg: 'from-blue-50 to-white',
    border: 'border-blue-100 hover:border-blue-300',
    badge: 'bg-blue-100 text-blue-700',
    btn: 'bg-blue-600 hover:bg-blue-700',
  },
  green: {
    bg: 'from-green-50 to-white',
    border: 'border-green-100 hover:border-green-300',
    badge: 'bg-green-100 text-green-700',
    btn: 'bg-green-600 hover:bg-green-700',
  },
  orange: {
    bg: 'from-orange-50 to-white',
    border: 'border-orange-100 hover:border-orange-300',
    badge: 'bg-orange-100 text-orange-700',
    btn: 'bg-orange-500 hover:bg-orange-600',
  },
}

export default function ProgramsSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">프로그램 소개</h2>
          <p className="text-lg text-slate-600">아이의 나이와 목표에 맞는 프로그램을 선택하세요</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROGRAMS.map((program) => {
            const colors = colorMap[program.color]
            return (
              <div
                key={program.id}
                className={`relative rounded-2xl border-2 ${colors.border} bg-gradient-to-b ${colors.bg} p-8 transition-all hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="text-4xl mb-4">{program.icon}</div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${colors.badge}`}>
                  {program.target}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{program.name}</h3>
                <p className="text-slate-600 text-sm mb-5 leading-relaxed">{program.description}</p>
                <ul className="space-y-2 mb-6">
                  {program.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/programs/${program.id}`}
                  className={`inline-flex items-center gap-2 px-6 py-3 ${colors.btn} text-white font-semibold rounded-xl transition-colors text-sm`}
                >
                  자세히 보기
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
