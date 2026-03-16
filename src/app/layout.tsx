import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingCTA from '@/components/layout/FloatingCTA'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.footballeye.co.kr'),
  title: {
    default: '풋볼아이 축구교실 | 시흥 은계·배곧 유소년 축구',
    template: '%s | 풋볼아이 축구교실',
  },
  description:
    '시흥 은계·배곧 유소년 축구교실 풋볼아이. 취미반·엘리트반·선수반 운영. 체계적인 훈련 프로그램, 개인 성장 리포트, 스페인 유소년 연계. 무료 체험 신청 가능.',
  keywords: [
    '축구교실', '유소년 축구', '시흥 축구', '은계 축구교실', '배곧 축구교실',
    '풋볼아이', '어린이 축구', '초등 축구', '취미 축구', '엘리트 축구',
  ],
  authors: [{ name: '풋볼아이' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://www.footballeye.co.kr',
    siteName: '풋볼아이 축구교실',
    title: '풋볼아이 축구교실 | 시흥 은계·배곧 유소년 축구',
    description: '시흥 은계·배곧 유소년 축구교실 풋볼아이. 취미반·엘리트반·선수반 운영.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '풋볼아이 축구교실',
    description: '시흥 은계·배곧 유소년 축구교실',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    other: { 'naver-site-verification': 'YOUR_NAVER_VERIFICATION_CODE' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="canonical" href="https://www.footballeye.co.kr" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  )
}
