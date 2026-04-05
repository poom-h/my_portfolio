'use client'

import { useState, useTransition } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { createSkill, updateSkill, deleteSkill } from '@/lib/actions/skills'
import type { Skill } from '@/types/portfolio'

const CATEGORIES = ['AI & ML', 'Frameworks', 'Languages', 'Data Engineering', 'Cloud & MLOps']

function SkillForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Skill>
  onSave: (data: Partial<Skill>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    name:        initial?.name        ?? '',
    category:    initial?.category    ?? CATEGORIES[0],
    proficiency: initial?.proficiency ?? 80,
    sort_order:  initial?.sort_order  ?? 0,
  })

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-[#0f0f1a] p-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Name</label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
            placeholder="e.g. PyTorch"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Category</label>
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Proficiency: {form.proficiency}%</label>
          <input
            type="range" min={1} max={100}
            value={form.proficiency}
            onChange={e => setForm(f => ({ ...f, proficiency: parseInt(e.target.value) }))}
            className="w-full accent-indigo-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Sort Order</label>
          <input
            type="number"
            value={form.sort_order}
            onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          <Check size={13} /> Save
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-xl border border-[#2d2d4a] px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  )
}

export default function SkillsAdminClient({ initialItems }: { initialItems: Skill[] }) {
  const [items, setItems]       = useState<Skill[]>(initialItems)
  const [adding, setAdding]     = useState(false)
  const [editId, setEditId]     = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const grouped = CATEGORIES.map(cat => ({
    cat,
    skills: items.filter(s => s.category === cat).sort((a, b) => a.sort_order - b.sort_order),
  })).filter(g => g.skills.length > 0)

  const handleAdd = (data: Partial<Skill>) => {
    if (!data.name?.trim()) { toast.error('Name is required'); return }
    const optimistic: Skill = {
      id: crypto.randomUUID(),
      name: data.name!,
      category: data.category!,
      proficiency: data.proficiency!,
      sort_order: data.sort_order!,
    }
    setItems(prev => [...prev, optimistic])
    setAdding(false)
    startTransition(async () => {
      try {
        await createSkill({
          name:        data.name!,
          category:    data.category!,
          proficiency: data.proficiency!,
          sort_order:  data.sort_order!,
        })
        toast.success('Skill added!')
      } catch {
        setItems(prev => prev.filter(s => s.id !== optimistic.id))
        toast.error('Failed to save skill')
      }
    })
  }

  const handleEdit = (id: string, data: Partial<Skill>) => {
    if (!data.name?.trim()) { toast.error('Name is required'); return }
    setItems(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
    setEditId(null)
    startTransition(async () => {
      try {
        await updateSkill(id, {
          name:        data.name!,
          category:    data.category!,
          proficiency: data.proficiency!,
          sort_order:  data.sort_order!,
        })
        toast.success('Skill updated!')
      } catch {
        toast.error('Failed to update skill')
      }
    })
  }

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(s => s.id !== id))
    startTransition(async () => {
      try {
        await deleteSkill(id)
        toast.success('Skill deleted')
      } catch {
        toast.error('Failed to delete skill')
      }
    })
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Skills</h1>
          <p className="text-sm text-slate-400 mt-1">{items.length} skills across {grouped.length} categories</p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditId(null) }}
          disabled={pending}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
        >
          <Plus size={15} /> Add Skill
        </button>
      </div>

      {adding && (
        <div className="mb-6">
          <SkillForm onSave={handleAdd} onCancel={() => setAdding(false)} />
        </div>
      )}

      <div className="space-y-6">
        {grouped.map(({ cat, skills: catSkills }) => (
          <div key={cat} className="rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] overflow-hidden">
            <div className="border-b border-[#2d2d4a] px-5 py-3">
              <h2 className="text-sm font-semibold text-slate-300">{cat}</h2>
            </div>
            <div className="divide-y divide-[#1e2035]">
              {catSkills.map(skill => (
                <div key={skill.id}>
                  {editId === skill.id ? (
                    <div className="p-4">
                      <SkillForm
                        initial={skill}
                        onSave={data => handleEdit(skill.id, data)}
                        onCancel={() => setEditId(null)}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 px-5 py-3 hover:bg-[#161625] transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-200">{skill.name}</p>
                        <div className="mt-1.5 flex items-center gap-3">
                          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[#1e1e33]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">{skill.proficiency}%</span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-600">#{skill.sort_order}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setEditId(skill.id); setAdding(false) }}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-[#1e1e33] hover:text-indigo-400 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-[#1e1e33] hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
