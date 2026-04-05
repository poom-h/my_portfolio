'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { Skill } from '@/types/portfolio'

const CATEGORY_COLORS: Record<string, string> = {
  'AI & ML':          'from-indigo-500 to-violet-500',
  'Frameworks':       'from-violet-500 to-purple-500',
  'Languages':        'from-purple-500 to-pink-500',
  'Data Engineering': 'from-blue-500 to-indigo-500',
  'Cloud & MLOps':    'from-cyan-500 to-blue-500',
}

const CATEGORY_BG: Record<string, string> = {
  'AI & ML':          'border-indigo-500/20 bg-indigo-500/5',
  'Frameworks':       'border-violet-500/20 bg-violet-500/5',
  'Languages':        'border-purple-500/20 bg-purple-500/5',
  'Data Engineering': 'border-blue-500/20 bg-blue-500/5',
  'Cloud & MLOps':    'border-cyan-500/20 bg-cyan-500/5',
}

interface Props {
  skills: Skill[]
}

export default function SkillsSection({ skills }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const categories = Array.from(new Set(skills.map(s => s.category)))

  return (
    <section id="skills" ref={ref} className="py-24 px-6 bg-[#0d0d16]">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">What I work with</p>
          <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">Skills &amp; Stack</h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, ci) => {
            const catSkills = skills
              .filter(s => s.category === cat)
              .sort((a, b) => a.sort_order - b.sort_order)

            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: ci * 0.08 }}
                className={`rounded-2xl border p-5 ${CATEGORY_BG[cat] ?? 'border-[#2d2d4a] bg-[#0f0f1a]'}`}
              >
                <h3 className="mb-4 text-sm font-semibold text-slate-200">{cat}</h3>
                <div className="space-y-3">
                  {catSkills.map((skill, si) => (
                    <div key={skill.id}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs text-slate-300">{skill.name}</span>
                        <span className="text-[10px] text-slate-500">{skill.proficiency}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1e1e33]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.proficiency}%` } : {}}
                          transition={{ duration: 0.8, delay: ci * 0.08 + si * 0.05, ease: 'easeOut' }}
                          className={`h-full rounded-full bg-gradient-to-r ${CATEGORY_COLORS[cat] ?? 'from-indigo-500 to-violet-500'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
