'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ArrowDown, Download } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import type { Profile, Certificate } from '@/types/portfolio'

const NeuralNetworkCanvas = dynamic(
  () => import('@/components/portfolio/NeuralNetworkCanvas'),
  { ssr: false }
)

interface SelectedNode {
  id: string
  type: 'skill' | 'project'
  label: string
}

/** Shorten a long cert name to a compact hero badge label */
function certBadge(name: string) {
  return name
    .replace(/Certified\s*/i, '')
    .replace(/\s*[-–]\s*Associate/i, '')
    .replace(/\s*Associate$/i, '')
    .split(' ')
    .slice(0, 4)
    .join(' ')
}

interface Props {
  profile: Profile
  certificates: Certificate[]
}

export default function HeroClient({ profile, certificates }: Props) {
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null)
  const [imgError, setImgError] = useState(false)

  // Derive short handle from URL (e.g. "https://github.com/poom-h" → "poom-h")
  const githubHandle   = profile.github_url.replace(/.*github\.com\//, '')
  const linkedinHandle = profile.linkedin_url.replace(/.*linkedin\.com\/in\//, '').replace(/\/$/, '')

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0f]">

      {/* Neural network background */}
      <div className="absolute inset-0">
        <NeuralNetworkCanvas
          onNodeClick={(node) =>
            setSelectedNode({ id: node.id, type: node.type, label: node.label })
          }
        />
      </div>

      {/* Radial dimmer so text is readable */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_20%,#0a0a0f_90%)]" />

      {/* ── HERO CONTENT ── */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24">
        <div className="flex w-full max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">

          {/* ── LEFT: Text ── */}
          <motion.div
            className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Open to work pill */}
            {profile.open_to_work && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Open to opportunities
              </div>
            )}

            {/* Greeting */}
            <p className="mb-1 text-base font-medium text-slate-400">
              Hi there, I&apos;m
            </p>

            {/* Name */}
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-50 sm:text-6xl lg:text-7xl">
              {profile.name.split(' ')[0]}
              <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                {profile.name.split(' ').slice(1).join(' ')}
              </span>
            </h1>

            {/* Tagline */}
            <p className="mt-3 text-lg font-semibold text-indigo-300 sm:text-xl">
              {profile.tagline}
            </p>

            {/* Location */}
            {profile.location && (
              <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {profile.location}
              </div>
            )}

            {/* Bio */}
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-base">
              {profile.bio}
            </p>

            {/* Cert badges */}
            {certificates.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {certificates.map(cert => (
                  <span
                    key={cert.id}
                    className="rounded-full border border-[#2d2d4a] bg-[#161625] px-3 py-1 text-[11px] font-medium text-slate-300"
                  >
                    🏅 {certBadge(cert.name)}
                  </span>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500"
              >
                View Projects
              </button>
              <a
                href="/CV_DATASCI_v2.pdf"
                download
                className="inline-flex h-11 items-center gap-2 rounded-full border border-[#2d2d4a] bg-[#0f0f1a]/60 px-6 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:text-slate-100"
              >
                <Download size={14} />
                Resume
              </a>
            </div>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-2">
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-[#2d2d4a] bg-[#0f0f1a]/60 px-4 py-2 text-xs font-medium text-slate-400 transition-all hover:border-indigo-500/40 hover:text-slate-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                {githubHandle}
              </a>
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-[#2d2d4a] bg-[#0f0f1a]/60 px-4 py-2 text-xs font-medium text-slate-400 transition-all hover:border-indigo-500/40 hover:text-slate-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                {linkedinHandle}
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 rounded-full border border-[#2d2d4a] bg-[#0f0f1a]/60 px-4 py-2 text-xs font-medium text-slate-400 transition-all hover:border-indigo-500/40 hover:text-slate-200"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                Email
              </a>
            </div>
          </motion.div>

          {/* ── RIGHT: Avatar ── */}
          <motion.div
            className="relative flex-shrink-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          >
            {/* Glow ring */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-purple-500/30 blur-xl" />

            {/* Spinning dashed ring */}
            <div className="absolute -inset-1 rounded-full border border-dashed border-indigo-500/30 animate-spin" style={{ animationDuration: '20s' }} />

            {/* Avatar */}
            <div className="relative h-56 w-56 overflow-hidden rounded-full border-2 border-indigo-500/40 sm:h-64 sm:w-64">
              {!imgError ? (
                <Image
                  src="/avatar.jpg"
                  alt={profile.name}
                  fill
                  sizes="(max-width: 640px) 224px, 256px"
                  className="object-cover"
                  onError={() => setImgError(true)}
                  priority
                  loading="eager"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-700 text-5xl font-bold text-white">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Floating stat cards */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -left-8 top-8 rounded-xl border border-[#2d2d4a] bg-[#0f0f1a]/90 px-3 py-2 text-center backdrop-blur-sm"
            >
              <p className="text-lg font-bold text-indigo-400">2+</p>
              <p className="text-[10px] text-slate-400">Yrs Experience</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -right-8 bottom-10 rounded-xl border border-[#2d2d4a] bg-[#0f0f1a]/90 px-3 py-2 text-center backdrop-blur-sm"
            >
              <p className="text-lg font-bold text-violet-400">10+</p>
              <p className="text-[10px] text-slate-400">AI Projects</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
              className="absolute -right-6 top-4 rounded-xl border border-[#2d2d4a] bg-[#0f0f1a]/90 px-3 py-2 text-center backdrop-blur-sm"
            >
              <p className="text-lg font-bold text-emerald-400">2x</p>
              <p className="text-[10px] text-slate-400">AWS &amp; Databricks</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600"
        >
          <span className="text-[11px] tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}>
            <ArrowDown size={14} />
          </motion.div>
        </motion.div>
      </div>

      {/* Node info panel */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-6 top-1/2 z-20 -translate-y-1/2 w-52 rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a]/90 p-4 backdrop-blur-md"
        >
          <p className="text-[10px] font-medium uppercase tracking-widest text-indigo-400">
            {selectedNode.type}
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-100">{selectedNode.label}</p>
          <button
            onClick={() => setSelectedNode(null)}
            className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Dismiss
          </button>
        </motion.div>
      )}
    </div>
  )
}
