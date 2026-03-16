'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { FAQS } from '@/lib/constants'

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          }),
        }}
      />
      <div className="bg-gradient-to-br from-slate-900 to-green-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">자주 묻는 질문</h1>
          <p className="text-xl text-slate-300">궁금한 점을 빠르게 확인하세요</p>
        </div>
      </div>
      <div className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                <span className="font-semibold text-slate-900 pr-4">Q. {faq.q}</span>
                {openIdx === idx ? (
                  <ChevronUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4 bg-green-50/50">
                  <p className="text-slate-600 leading-relaxed">A. {faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-10 p-6 bg-green-50 border border-green-200 rounded-2xl text-center">
          <p className="text-slate-700 mb-4">
            더 궁금한 점이 있으신가요? 카카오 채널로 편하게 질문하세요!
          </p>
          <a
            href="https://pf.kakao.com/_footballeye"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-yellow-900 font-bold rounded-xl hover:bg-yellow-300 transition-colors"
          >
            카카오 채널 바로가기
          </a>
        </div>
      </div>
    </div>
  )
}
