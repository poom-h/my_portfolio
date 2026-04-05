'use client'

import { useState, useTransition } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { createEducation, updateEducation, deleteEducation } from '@/lib/actions/education'
import type { Education } from '@/types/portfolio'

function EducationForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Education>
  onSave: (d: Omit<Education, 'id'>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    degree:      initial?.degree      ?? '',
    major:       initial?.major       ?? '',
    institution: initial?.institution ?? '',
    location:    initial?.location    ?? '',
    start_year:  initial?.start_year  ?? 2020,
    end_year:    initial?.end_year    ?? 2024,
    grade:       initial?.grade       ?? '',
    sort_order:  initial?.sort_order  ?? 0,
  })

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-[#0f0f1a] p-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {([['degree','Degree','e.g. BSc'],['major','Major','Computer Science and AI'],['institution','Institution','University of Sheffield'],['location','Location','Sheffield, England'],['grade','Grade / Honours','First Class Honours']] as const).map(([key, label, ph]) => (
          <div key={key}>
            <label className="mb-1 block text-xs font-medium text-slate-400">{label}</label>
            <input value={form[key as keyof typeof form] as string} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder={ph} />
          </div>
        ))}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Start Year</label>
          <input type="number" value={form.start_year} onChange={e => setForm(f => ({ ...f, start_year: parseInt(e.target.value) }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">End Year</label>
          <input type="number" value={form.end_year} onChange={e => setForm(f => ({ ...f, end_year: parseInt(e.target.value) }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave({ ...form, grade: form.grade || undefined })}
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

export default function EducationAdminClient({ initialItems }: { initialItems: Education[] }) {
  const [items, setItems]   = useState<Education[]>(initialItems)
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const handleAdd = (data: Omit<Education, 'id'>) => {
    const optimistic: Education = { id: crypto.randomUUID(), ...data }
    setItems(prev => [...prev, optimistic])
    setAdding(false)
    startTransition(async () => {
      try {
        await createEducation(data)
        toast.success('Added!')
      } catch {
        setItems(prev => prev.filter(e => e.id !== optimistic.id))
        toast.error('Failed to save')
      }
    })
  }

  const handleEdit = (id: string, data: Omit<Education, 'id'>) => {
    setItems(prev => prev.map(e => e.id === id ? { id, ...data } : e))
    setEditId(null)
    startTransition(async () => {
      try {
        await updateEducation(id, data)
        toast.success('Updated!')
      } catch {
        toast.error('Failed to update')
      }
    })
  }

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(e => e.id !== id))
    startTransition(async () => {
      try {
        await deleteEducation(id)
        toast.success('Deleted')
      } catch {
        toast.error('Failed to delete')
      }
    })
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Education</h1>
          <p className="text-sm text-slate-400 mt-1">{items.length} entries</p>
        </div>
        <button onClick={() => { setAdding(true); setEditId(null) }} disabled={pending}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50">
          <Plus size={15} /> Add
        </button>
      </div>

      {adding && <div className="mb-6"><EducationForm onSave={handleAdd} onCancel={() => setAdding(false)} /></div>}

      <div className="space-y-3">
        {items.sort((a, b) => a.sort_order - b.sort_order).map(edu => (
          <div key={edu.id} className="rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] overflow-hidden">
            {editId === edu.id ? (
              <div className="p-4">
                <EducationForm initial={edu} onSave={d => handleEdit(edu.id, d)} onCancel={() => setEditId(null)} />
              </div>
            ) : (
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-100">{edu.degree} — {edu.major}</p>
                  <p className="text-sm text-indigo-400 mt-0.5">{edu.institution}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500">{edu.start_year} — {edu.end_year}</span>
                    {edu.grade && <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] text-indigo-300">{edu.grade}</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditId(edu.id); setAdding(false) }} className="rounded-lg p-1.5 text-slate-500 hover:text-indigo-400 transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(edu.id)} className="rounded-lg p-1.5 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
