'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { SITE } from '@/lib/constants'

const navItems = [
  { label: '풋볼아이', href: '/about' },
  {
    label: '프로그램',
    href: '/programs',
    children: [
      { label: '취미반', href: '/programs/hobby' },
      { label: '엘리트반', href: '/programs/elite' },
      { label: '선수반', href: '/programs/pro' },
    ],
  },
  {
    label: '지점 안내',
    href: '/locations',
    children: [
      { label: '은계점', href: '/locations/eungye' },
      { label: '배곧점', href: '/locations/baegod' },
    ],
  },
  { label: '코치 소개', href: '/about#coaches' },
  { label: '수강생 후기', href: '/reviews' },
  { label: '공지사항', href: '/news' },
  { label: 'FAQ', href: '/faq' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">FE</span>
            </div>
            <span className="font-bold text-xl text-slate-900">{SITE.name}</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.href} className="relative group">
                {item.children ? (
                  <button
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-green-600 transition-colors rounded-md hover:bg-green-50"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      pathname === item.href
                        ? 'text-green-600 bg-green-50'
                        : 'text-slate-700 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
                {item.children && (
                  <div
                    className="absolute top-full left-0 pt-1 hidden group-hover:block"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <div className="bg-white rounded-lg shadow-lg border border-slate-100 py-1 min-w-[140px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/portal"
              className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              학부모 포털
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              무료 체험 신청
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-md text-slate-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="메뉴"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <div key={item.href}>
              {item.children ? (
                <div>
                  <button
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700"
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openDropdown === item.label && (
                    <div className="pl-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 text-sm text-slate-600 hover:text-green-600"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="block px-3 py-2 text-sm font-medium text-slate-700 hover:text-green-600"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <div className="pt-3 space-y-2 border-t border-slate-100">
            <Link
              href="/portal"
              className="block w-full text-center px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg"
            >
              학부모 포털
            </Link>
            <Link
              href="/contact"
              className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg"
            >
              무료 체험 신청
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
