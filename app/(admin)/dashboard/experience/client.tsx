'use client'

import { useState, useTransition } from 'react'
import { Plus, Pencil, Trash2, X, Check, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { createExperience, updateExperience, deleteExperience } from '@/lib/actions/experience'
import type { Experience } from '@/types/portfolio'

const EMP_TYPES = ['Full-time', 'Internship', 'Freelance', 'Contract']

const TYPE_COLORS: Record<string, string> = {
  'Full-time':  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Internship': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Freelance':  'bg-violet-500/10 text-violet-400 border-violet-500/20',
}

function ExperienceForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Experience>
  onSave: (data: Omit<Experience, 'id'>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    company:         initial?.company         ?? '',
    role:            initial?.role            ?? '',
    employment_type: initial?.employment_type ?? 'Full-time',
    location:        initial?.location        ?? '',
    start_date:      initial?.start_date      ?? '',
    end_date:        initial?.end_date        ?? '',
    description:     (initial?.description    ?? []).join('\n'),
    tech_stack:      (initial?.tech_stack     ?? []).join(', '),
    sort_order:      initial?.sort_order      ?? 0,
  })

  const toPayload = (): Omit<Experience, 'id'> => ({
    company:         form.company,
    role:            form.role,
    employment_type: form.employment_type,
    location:        form.location,
    start_date:      form.start_date,
    end_date:        form.end_date || null,
    description:     form.description.split('\n').map(s => s.trim()).filter(Boolean),
    tech_stack:      form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
    sort_order:      form.sort_order,
  })

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-[#0f0f1a] p-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Company</label>
          <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="e.g. RPI AI LAB" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Role</label>
          <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="e.g. ML Engineer" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Type</label>
          <select value={form.employment_type} onChange={e => setForm(f => ({ ...f, employment_type: e.target.value }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none">
            {EMP_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Location</label>
          <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="Bangkok, Thailand" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Start (YYYY-MM)</label>
          <input value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="2024-01" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">End (YYYY-MM or blank = Present)</label>
          <input value={form.end_date ?? ''} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="Leave blank for Present" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-400">Description (one bullet per line)</label>
        <textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none resize-none" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-400">Tech Stack (comma-separated)</label>
        <input value={form.tech_stack} onChange={e => setForm(f => ({ ...f, tech_stack: e.target.value }))}
          className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="Python, LangChain, AWS" />
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button onClick={() => onSave(toPayload())}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors">
          <Check size={13} /> Save
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-1.5 rounded-xl border border-[#2d2d4a] px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors">
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  )
}

export default function ExperienceAdminClient({ initialItems }: { initialItems: Experience[] }) {
  const [items, setItems]   = useState<Experience[]>(initialItems)
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const handleAdd = (data: Omit<Experience, 'id'>) => {
    if (!data.company?.trim()) { toast.error('Company is required'); return }
    const optimistic: Experience = { id: crypto.randomUUID(), ...data }
    setItems(prev => [...prev, optimistic])
    setAdding(false)
    startTransition(async () => {
      try {
        await createExperience(data)
        toast.success('Experience added!')
      } catch {
        setItems(prev => prev.filter(e => e.id !== optimistic.id))
        toast.error('Failed to save experience')
      }
    })
  }

  const handleEdit = (id: string, data: Omit<Experience, 'id'>) => {
    setItems(prev => prev.map(e => e.id === id ? { id, ...data } : e))
    setEditId(null)
    startTransition(async () => {
      try {
        await updateExperience(id, data)
        toast.success('Updated!')
      } catch {
        toast.error('Failed to update experience')
      }
    })
  }

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(e => e.id !== id))
    startTransition(async () => {
      try {
        await deleteExperience(id)
        toast.success('Deleted')
      } catch {
        toast.error('Failed to delete experience')
      }
    })
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Experience</h1>
          <p className="text-sm text-slate-400 mt-1">{items.length} positions</p>
        </div>
        <button onClick={() => { setAdding(true); setEditId(null) }} disabled={pending}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50">
          <Plus size={15} /> Add
        </button>
      </div>

      {adding && (
        <div className="mb-6">
          <ExperienceForm onSave={handleAdd} onCancel={() => setAdding(false)} />
        </div>
      )}

      <div className="space-y-3">
        {items.sort((a, b) => a.sort_order - b.sort_order).map(exp => (
          <div key={exp.id} className="rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] overflow-hidden">
            {editId === exp.id ? (
              <div className="p-4">
                <ExperienceForm initial={exp} onSave={d => handleEdit(exp.id, d)} onCancel={() => setEditId(null)} />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-100">{exp.role}</p>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${TYPE_COLORS[exp.employment_type] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                        {exp.employment_type}
                      </span>
                    </div>
                    <p className="text-sm text-indigo-400 mt-0.5">{exp.company}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{exp.start_date} — {exp.end_date ?? 'Present'}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
                      className="rounded-lg p-1.5 text-slate-500 hover:text-slate-300 transition-colors">
                      {expanded === exp.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button onClick={() => { setEditId(exp.id); setAdding(false) }}
                      className="rounded-lg p-1.5 text-slate-500 hover:text-indigo-400 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(exp.id)}
                      className="rounded-lg p-1.5 text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {expanded === exp.id && (
                  <div className="border-t border-[#1e2035] px-5 py-3 space-y-2">
                    <ul className="space-y-1">
                      {exp.description.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-500" />{d}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.tech_stack.map(t => (
                        <span key={t} className="rounded-md bg-[#1e1e33] px-2 py-0.5 text-[10px] text-slate-400 border border-[#2d2d4a]">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
