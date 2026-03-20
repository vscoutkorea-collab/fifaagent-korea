import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { SITE } from '@/lib/constants'

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-600 to-green-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6">
          <img src="/emblem.png" alt="풋볼아이 앰블럼" className="w-20 h-20 object-contain mx-auto" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          지금 무료 체험 수업을 신청하세요
        </h2>
        <p className="text-lg text-green-100 mb-10 leading-relaxed">
          부담 없이 체험하고, 아이에게 맞는 반을 찾아드립니다.<br className="hidden sm:block" />
          카카오 채널 또는 네이버 톡톡으로 간편하게 신청하세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={SITE.kakaoChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 text-yellow-900 font-bold text-lg rounded-xl hover:bg-yellow-300 transition-all hover:scale-105 shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            카카오 채널 상담
          </a>
          <a
            href={SITE.naverTalk}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-700 font-bold text-lg rounded-xl hover:bg-green-50 transition-all hover:scale-105 shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            네이버 톡톡 상담
          </a>
        </div>
        <p className="mt-6 text-green-200 text-sm">상담 운영시간: 월~토 10:00 ~ 21:00</p>
      </div>
    </section>
  )
}
