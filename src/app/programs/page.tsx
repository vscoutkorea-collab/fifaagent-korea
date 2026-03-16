import Link from 'next/link'
import { ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react'
import { PROGRAMS, SITE } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '프로그램 소개',
  description: '풋볼아이 취미반·엘리트반·선수반 프로그램 소개. 아이의 나이와 목표에 맞는 프로그램을 찾아보세요.',
}

export default function ProgramsPage() {
  return (
    <div className="pt-16">
      <div className="bg-gradient-to-br from-slate-900 to-green-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">프로그램 소개</h1>
          <p className="text-xl text-slate-300">아이의 나이와 목표에 맞는 프로그램을 선택하세요</p>
        </div>
      </div>
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8">
          {PROGRAMS.map((program, idx) => (
            <div
              key={program.id}
              className={`flex flex-col lg:flex-row gap-8 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className="w-full lg:w-1/2 bg-slate-50 rounded-2xl h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl mb-3">{program.icon}</div>
                  <p className="text-slate-500 font-medium">{program.name} 수업 현장</p>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                  {program.target}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">{program.name}</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">{program.description}</p>
                <ul className="space-y-3 mb-6">
                  {program.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <Link
                    href={`/programs/${program.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
                  >
                    상세 보기
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href={SITE.kakaoChannel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-yellow-900 font-semibold rounded-xl hover:bg-yellow-300 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    상담 신청
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
