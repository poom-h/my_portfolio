'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { GraduationCap } from 'lucide-react'
import type { Education } from '@/types/portfolio'

interface Props {
  education: Education[]
}

export default function EducationSection({ education }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="education" ref={ref} className="py-24 px-6">
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">Academic background</p>
          <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">Education</h2>
        </motion.div>

        <div className="space-y-5">
          {education.map((edu, i) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex gap-4 rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] p-6 hover:border-indigo-500/30 transition-colors"
            >
              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <GraduationCap size={20} className="text-indigo-400" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-slate-100">
                      {edu.degree} — {edu.major}
                    </h3>
                    <p className="text-sm font-medium text-indigo-400">{edu.institution}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{edu.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-400">{edu.start_year} — {edu.end_year}</span>
                    {edu.grade && (
                      <div className="mt-1">
                        <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-medium text-indigo-300">
                          {edu.grade}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
