'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Cpu, Briefcase, FolderKanban,
  GraduationCap, User, ExternalLink, ChevronRight
} from 'lucide-react'

const NAV = [
  { label: 'Dashboard',  href: '/dashboard',            icon: LayoutDashboard },
  { label: 'Profile',    href: '/dashboard/profile',    icon: User },
  { label: 'Skills',     href: '/dashboard/skills',     icon: Cpu },
  { label: 'Experience', href: '/dashboard/experience', icon: Briefcase },
  { label: 'Projects',   href: '/dashboard/projects',   icon: FolderKanban },
  { label: 'Education',  href: '/dashboard/education',  icon: GraduationCap },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-[#1e2035] bg-[#0a0a0f]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-[#1e2035] px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">P</div>
        <div>
          <p className="text-sm font-semibold text-slate-100">poom.dev</p>
          <p className="text-[10px] text-slate-500">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-indigo-500/15 text-indigo-300'
                  : 'text-slate-400 hover:bg-[#161625] hover:text-slate-200'
              }`}
            >
              <Icon size={16} className={active ? 'text-indigo-400' : 'text-slate-500'} />
              {label}
              {active && <ChevronRight size={13} className="ml-auto text-indigo-500" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#1e2035] p-4 space-y-1">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ExternalLink size={13} />
          View Portfolio
        </a>
      </div>
    </aside>
  )
}
