'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Phone } from 'lucide-react'
import { SITE } from '@/lib/constants'

export default function FloatingCTA() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      if (scrolled > 0.5 && !sessionStorage.getItem('popup-shown')) {
        setShowPopup(true)
        sessionStorage.setItem('popup-shown', 'true')
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="text-4xl mb-3">⚽</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">무료 체험 수업 신청</h3>
              <p className="text-slate-600 text-sm mb-5">
                첫 방문은 무료로 체험하실 수 있어요.<br />
                지금 바로 신청해 보세요!
              </p>
              <div className="space-y-2">
                <a
                  href={SITE.kakaoChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowPopup(false)}
                  className="block w-full py-3 bg-yellow-400 text-yellow-900 font-semibold rounded-xl hover:bg-yellow-300 transition-colors"
                >
                  카카오로 신청하기
                </a>
                <a
                  href={SITE.naverTalk}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowPopup(false)}
                  className="block w-full py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-400 transition-colors"
                >
                  네이버 톡톡으로 신청하기
                </a>
                <button
                  onClick={() => setShowPopup(false)}
                  className="block w-full py-2 text-sm text-slate-400 hover:text-slate-600"
                >
                  나중에 할게요
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3">
        {isOpen && (
          <div className="flex flex-col gap-2 mb-1">
            <a
              href={SITE.kakaoChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-yellow-400 text-yellow-900 rounded-full shadow-lg text-sm font-semibold hover:bg-yellow-300 transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              카카오 상담
            </a>
            <a
              href={SITE.naverTalk}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-full shadow-lg text-sm font-semibold hover:bg-green-400 transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              네이버 톡톡
            </a>
            <a
              href="tel:031-000-0000"
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-full shadow-lg text-sm font-semibold hover:bg-blue-500 transition-all hover:scale-105"
            >
              <Phone className="w-4 h-4" />
              전화 상담
            </a>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-green-700 transition-all hover:scale-110"
          aria-label="상담하기"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>
    </>
  )
}
