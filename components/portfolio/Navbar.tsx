'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { label: 'About',      href: '#about' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Education',  href: '#education' },
  { label: 'Contact',    href: '#contact' },
]

export default function Navbar({ email }: { email: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive]     = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section tracking
  useEffect(() => {
    const ids = LINKS.map(l => l.href.slice(1))
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (href: string) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[#1e2035] bg-[#0a0a0f]/90 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-sm font-bold tracking-tight text-slate-100 hover:text-indigo-400 transition-colors"
        >
          poom<span className="text-indigo-400">.</span>dev
        </button>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map(link => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className={`relative px-3 py-1.5 text-sm font-medium transition-colors ${
                active === link.href.slice(1)
                  ? 'text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {active === link.href.slice(1) && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-md bg-indigo-500/10"
                />
              )}
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <a
          href={`mailto:${email}`}
          className="hidden md:inline-flex h-8 items-center gap-2 rounded-full bg-indigo-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          Hire Me
        </a>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="md:hidden rounded-md p-2 text-slate-400 hover:text-slate-200 transition-colors"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#1e2035] bg-[#0a0a0f]/95 backdrop-blur-md"
          >
            <div className="flex flex-col px-6 py-4 gap-1">
              {LINKS.map(link => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={`py-2 text-left text-sm font-medium transition-colors ${
                    active === link.href.slice(1) ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <a
                href={`mailto:${email}`}
                className="mt-2 inline-flex h-9 items-center justify-center rounded-full bg-indigo-600 px-4 text-sm font-semibold text-white"
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
