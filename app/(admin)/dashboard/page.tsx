import { Cpu, Briefcase, FolderKanban, GraduationCap, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getSkills }      from '@/lib/actions/skills'
import { getExperiences } from '@/lib/actions/experience'
import { getProjects }    from '@/lib/actions/projects'
import { getEducation }   from '@/lib/actions/education'
import { skills as s0, experiences as e0, projects as p0, education as ed0 } from '@/lib/data/portfolio'

export default async function DashboardPage() {
  // Fetch real counts from Supabase; fall back to static seed counts on error
  const [skills, experiences, projects, education] = await Promise.all([
    getSkills()      .catch(() => s0),
    getExperiences() .catch(() => e0),
    getProjects()    .catch(() => p0),
    getEducation()   .catch(() => ed0),
  ])

  const CARDS = [
    { label: 'Skills',      count: skills.length,      icon: Cpu,           href: '/dashboard/skills',     color: 'text-indigo-400',  bg: 'bg-indigo-500/10' },
    { label: 'Experience',  count: experiences.length, icon: Briefcase,     href: '/dashboard/experience', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Projects',    count: projects.length,    icon: FolderKanban,  href: '/dashboard/projects',   color: 'text-violet-400',  bg: 'bg-violet-500/10' },
    { label: 'Education',   count: education.length,   icon: GraduationCap, href: '/dashboard/education',  color: 'text-cyan-400',    bg: 'bg-cyan-500/10' },
  ]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your portfolio content</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {CARDS.map(({ label, count, icon: Icon, href, color, bg }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] p-5 hover:border-indigo-500/40 transition-colors"
          >
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-slate-100">{count}</p>
            <p className="text-sm text-slate-400">{label}</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-slate-500 group-hover:text-indigo-400 transition-colors">
              Manage <ArrowRight size={11} />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] p-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Quick Actions</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {CARDS.map(({ label, href, icon: Icon, color }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 rounded-xl border border-[#2d2d4a] px-4 py-3 text-sm text-slate-400 hover:border-indigo-500/30 hover:text-slate-200 transition-colors"
            >
              <Icon size={15} className={color} />
              Add / Edit {label}
              <ArrowRight size={13} className="ml-auto" />
            </Link>
          ))}
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 rounded-xl border border-[#2d2d4a] px-4 py-3 text-sm text-slate-400 hover:border-indigo-500/30 hover:text-slate-200 transition-colors"
          >
            Edit Profile &amp; Bio
            <ArrowRight size={13} className="ml-auto" />
          </Link>
        </div>
      </div>
    </div>
  )
}
