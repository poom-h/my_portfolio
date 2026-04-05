'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { MapPin, Mail, Phone, Coffee, Code2, Brain } from 'lucide-react'
import type { Profile, Certificate } from '@/types/portfolio'

const INTERESTS = [
  { icon: Brain,  label: 'AI / ML Research' },
  { icon: Code2,  label: 'Software Development' },
  { icon: Coffee, label: 'Food Exploration & Cooking' },
]

const LANGUAGES = [
  { lang: 'Thai',    level: 'Native' },
  { lang: 'English', level: 'Fluent' },
]

interface Props {
  profile: Profile
  certificates: Certificate[]
}

export default function AboutSection({ profile, certificates }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [imgError, setImgError] = useState(false)

  return (
    <section id="about" ref={ref} className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">Get to know me</p>
          <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">About Me</h2>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left — Avatar + quick facts */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 blur-lg" />
              <div className="relative h-64 w-64 overflow-hidden rounded-2xl border border-[#2d2d4a]">
                {!imgError ? (
                  <Image
                    src="/avatar.jpg"
                    alt={profile.name}
                    fill
                    sizes="256px"
                    className="object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-700 text-6xl font-bold text-white">
                    P
                  </div>
                )}
              </div>
            </div>

            {/* Contact info */}
            <div className="w-full space-y-2 rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] p-5">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin size={14} className="text-indigo-400 shrink-0" />
                {profile.location}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Mail size={14} className="text-indigo-400 shrink-0" />
                {profile.email}
              </div>
              {profile.phone && (
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <Phone size={14} className="text-indigo-400 shrink-0" />
                  {profile.phone}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right — Bio, certs, interests, languages */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-7"
          >
            {/* Bio */}
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-100">Who I Am</h3>
              {profile.bio.split('\n').filter(Boolean).map((para, i) => (
                <p key={i} className={`text-sm leading-relaxed text-slate-400 ${i > 0 ? 'mt-3' : ''}`}>
                  {para}
                </p>
              ))}
            </div>

            {/* Certificates */}
            {certificates.length > 0 && (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-slate-100">Certifications</h3>
                <div className="space-y-2">
                  {certificates.map(cert => (
                    <div key={cert.id} className="flex items-start gap-3 rounded-xl border border-[#2d2d4a] bg-[#0f0f1a] px-4 py-3">
                      <span className="mt-0.5 text-base">🏅</span>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{cert.name}</p>
                        <p className="text-xs text-slate-500">{cert.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests + Languages */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-100">Interests</h3>
                <div className="space-y-1.5">
                  {INTERESTS.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-xs text-slate-400">
                      <Icon size={12} className="text-indigo-400 shrink-0" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-100">Languages</h3>
                <div className="space-y-1.5">
                  {LANGUAGES.map(({ lang, level }) => (
                    <div key={lang} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{lang}</span>
                      <span className="text-slate-500">{level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
