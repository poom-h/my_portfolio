'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { Experience } from '@/types/portfolio'

const TYPE_COLORS: Record<string, string> = {
  'Full-time':  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Internship': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Freelance':  'bg-violet-500/10 text-violet-400 border-violet-500/20',
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Present'
  const [year, month] = dateStr.split('-')
  const d = new Date(parseInt(year), parseInt(month) - 1)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

interface Props {
  experiences: Experience[]
}

export default function ExperienceSection({ experiences }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="experience" ref={ref} className="py-24 px-6">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">Where I&apos;ve worked</p>
          <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">Experience</h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-indigo-500/50 via-[#2d2d4a] to-transparent md:left-[50%]" />

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`relative pl-12 md:pl-0 md:w-[46%] ${
                  i % 2 === 0 ? 'md:ml-0 md:pr-10' : 'md:ml-[54%] md:pl-10'
                }`}
              >
                {/* Dot */}
                <div className={`absolute top-5 w-3 h-3 rounded-full border-2 border-indigo-500 bg-[#0a0a0f] left-[9px] md:left-auto ${
                  i % 2 === 0 ? 'md:-right-[31px]' : 'md:-left-[30px]'
                }`} />

                <div className="rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] p-5 hover:border-indigo-500/30 transition-colors">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-100">{exp.role}</h3>
                      <p className="text-sm font-medium text-indigo-400">{exp.company}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{exp.location}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${TYPE_COLORS[exp.employment_type] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                        {exp.employment_type}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <ul className="space-y-1.5 mb-4">
                    {exp.description.map((d, di) => (
                      <li key={di} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-500" />
                        {d}
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tech_stack.map(t => (
                      <span key={t} className="rounded-md bg-[#1e1e33] px-2 py-0.5 text-[10px] text-slate-400 border border-[#2d2d4a]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
