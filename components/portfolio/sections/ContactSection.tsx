'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Send, Mail, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Profile } from '@/types/portfolio'

interface Props {
  profile: Profile
}

export default function ContactSection({ profile }: Props) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Placeholder — wire to Supabase or email service later
    await new Promise(r => setTimeout(r, 800))
    toast.success("Message sent! I'll get back to you soon 🚀")
    setForm({ name: '', email: '', message: '' })
    setLoading(false)
  }

  return (
    <section id="contact" ref={ref} className="py-24 px-6 bg-[#0d0d16]">
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">Let&apos;s connect</p>
          <h2 className="text-3xl font-bold text-slate-100 sm:text-4xl">Get In Touch</h2>
          <p className="mt-3 text-sm text-slate-400 max-w-md mx-auto">
            Open to new opportunities, collabs, or just a good AI chat. Drop me a message!
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-5"
          >
            {/* Contact cards */}
            <div className="rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <Mail size={15} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Email</p>
                  <a href={`mailto:${profile.email}`} className="text-sm text-slate-200 hover:text-indigo-400 transition-colors">
                    {profile.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <MapPin size={15} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Location</p>
                  <p className="text-sm text-slate-200">{profile.location}</p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] p-5">
              <p className="mb-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">Find me on</p>
              <div className="flex gap-3">
                <a href={profile.github_url} target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#2d2d4a] py-2.5 text-xs font-medium text-slate-400 hover:border-indigo-500/40 hover:text-slate-200 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GitHub
                </a>
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#2d2d4a] py-2.5 text-xs font-medium text-slate-400 hover:border-indigo-500/40 hover:text-slate-200 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] p-6 space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Hi Poom, I'd love to chat about..."
                className="w-full resize-none rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : (<><Send size={14} /> Send Message</>)}
            </button>
          </motion.form>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center text-xs text-slate-600"
        >
          Built with Next.js · Three.js · Framer Motion · Supabase
          <span className="mx-2">·</span>
          Powered by Claude
        </motion.div>
      </div>
    </section>
  )
}
