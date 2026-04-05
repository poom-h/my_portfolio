'use client'

import { useState, useTransition } from 'react'
import { Check, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateProfile } from '@/lib/actions/profile'
import type { Profile } from '@/types/portfolio'

export default function ProfileAdminClient({ initialProfile }: { initialProfile: Profile }) {
  const [form, setForm] = useState<Profile>(initialProfile)
  const [saved, setSaved] = useState(false)
  const [pending, startTransition] = useTransition()

  const f = (key: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }))

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateProfile({
          name:         form.name,
          tagline:      form.tagline,
          bio:          form.bio,
          email:        form.email,
          phone:        form.phone,
          location:     form.location,
          github_url:   form.github_url,
          linkedin_url: form.linkedin_url,
          open_to_work: form.open_to_work,
        })
        setSaved(true)
        toast.success('Profile saved!')
        setTimeout(() => setSaved(false), 2000)
      } catch {
        toast.error('Failed to save profile')
      }
    })
  }

  const Field = ({
    label,
    k,
    multiline = false,
    placeholder = '',
  }: {
    label: string
    k: keyof Profile
    multiline?: boolean
    placeholder?: string
  }) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-400">{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          value={(form[k] as string) ?? ''}
          onChange={f(k)}
          className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none resize-none"
          placeholder={placeholder}
        />
      ) : (
        <input
          value={(form[k] as string) ?? ''}
          onChange={f(k)}
          className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
          placeholder={placeholder}
        />
      )}
    </div>
  )

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Profile</h1>
          <p className="text-sm text-slate-400 mt-1">Your public identity</p>
        </div>
        <button
          onClick={handleSave}
          disabled={pending}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
        >
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      <div className="rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] p-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full Name"    k="name"         placeholder="Poom Hirunwiwatkul" />
          <Field label="Location"     k="location"     placeholder="Bangkok, Thailand" />
          <Field label="Email"        k="email"        placeholder="you@example.com" />
          <Field label="Phone"        k="phone"        placeholder="+66 xx-xxx-xxxx" />
          <Field label="GitHub URL"   k="github_url"   placeholder="https://github.com/..." />
          <Field label="LinkedIn URL" k="linkedin_url" placeholder="https://linkedin.com/in/..." />
        </div>
        <Field label="Tagline" k="tagline" placeholder="ML Engineer · Data Engineer · Agentic AI" />
        <Field label="Bio"     k="bio"     multiline placeholder="Short bio shown on the hero section..." />

        <div className="flex items-center gap-3 pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.open_to_work}
              onChange={e => setForm(p => ({ ...p, open_to_work: e.target.checked }))}
              className="h-4 w-4 rounded accent-indigo-500"
            />
            <span className="text-sm text-slate-300">Show &ldquo;Open to opportunities&rdquo; badge</span>
          </label>
        </div>
      </div>
    </div>
  )
}
