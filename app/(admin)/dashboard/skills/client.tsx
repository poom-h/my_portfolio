'use client'

import { useState, useCallback, useTransition, useRef, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Check, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { createSkill, updateSkill, deleteSkill, renameCategory } from '@/lib/actions/skills'
import type { Skill } from '@/types/portfolio'

// ── Category combobox — pick existing or type a new one ─────────────────────
function CategoryCombobox({
  value,
  categories,
  onChange,
}: {
  value: string
  categories: string[]
  onChange: (v: string) => void
}) {
  const [open, setOpen]   = useState(false)
  const [query, setQuery] = useState(value)
  const ref               = useRef<HTMLDivElement>(null)

  const filtered = categories.filter(c =>
    c.toLowerCase().includes(query.toLowerCase())
  )
  const canCreate = query.trim() && !categories.some(
    c => c.toLowerCase() === query.toLowerCase()
  )

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (v: string) => {
    setQuery(v)
    onChange(v)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Pick or type new category..."
          className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 pr-8 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
        />
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>

      {open && (filtered.length > 0 || canCreate) && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-[#2d2d4a] bg-[#161625] shadow-xl overflow-hidden">
          {filtered.map(c => (
            <button
              key={c}
              onMouseDown={() => select(c)}
              className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-[#1e1e33] ${
                c === value ? 'text-indigo-400' : 'text-slate-300'
              }`}
            >
              {c}
            </button>
          ))}
          {canCreate && (
            <button
              onMouseDown={() => select(query.trim())}
              className="w-full border-t border-[#2d2d4a] px-3 py-2 text-left text-sm text-emerald-400 hover:bg-[#1e1e33] transition-colors"
            >
              + Create &ldquo;{query.trim()}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Category header with inline rename ──────────────────────────────────────
function CategoryHeader({
  name,
  onRename,
}: {
  name: string
  onRename: (newName: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue]     = useState(name)

  const commit = () => {
    const trimmed = value.trim()
    if (trimmed && trimmed !== name) onRename(trimmed)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter')  commit()
            if (e.key === 'Escape') { setValue(name); setEditing(false) }
          }}
          className="rounded-lg border border-indigo-500/50 bg-[#161625] px-2 py-0.5 text-sm font-semibold text-slate-100 focus:outline-none focus:border-indigo-400 w-48"
        />
        <button onClick={commit} className="rounded p-1 text-emerald-400 hover:text-emerald-300 transition-colors">
          <Check size={13} />
        </button>
        <button
          onClick={() => { setValue(name); setEditing(false) }}
          className="rounded p-1 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X size={13} />
        </button>
      </div>
    )
  }

  return (
    <div className="group flex items-center gap-2">
      <h2 className="text-sm font-semibold text-slate-300">{name}</h2>
      <button
        onClick={() => { setValue(name); setEditing(true) }}
        className="opacity-0 group-hover:opacity-100 rounded p-1 text-slate-600 hover:text-indigo-400 transition-all"
      >
        <Pencil size={12} />
      </button>
    </div>
  )
}

// ── Skill add/edit form ──────────────────────────────────────────────────────
function SkillForm({
  initial,
  categories,
  onSave,
  onCancel,
}: {
  initial?: Partial<Skill>
  categories: string[]
  onSave: (data: Partial<Skill>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    name:        initial?.name        ?? '',
    category:    initial?.category    ?? (categories[0] ?? ''),
    proficiency: initial?.proficiency ?? 80,
    sort_order:  initial?.sort_order  ?? 0,
  })

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-[#0f0f1a] p-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Skill name</label>
          <input
            autoFocus
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && onSave(form)}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
            placeholder="e.g. PyTorch"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Category
            <span className="ml-1 text-slate-600">(pick or create new)</span>
          </label>
          <CategoryCombobox
            value={form.category}
            categories={categories}
            onChange={v => setForm(f => ({ ...f, category: v }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Proficiency — <span className="text-indigo-400">{form.proficiency}%</span>
          </label>
          <input
            type="range" min={1} max={100}
            value={form.proficiency}
            onChange={e => setForm(f => ({ ...f, proficiency: parseInt(e.target.value) }))}
            className="w-full accent-indigo-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Sort order</label>
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
          <Check size={13} /> Save skill
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

// ── Main client ──────────────────────────────────────────────────────────────
export default function SkillsAdminClient({ initialItems }: { initialItems: Skill[] }) {
  const [items, setItems]          = useState<Skill[]>(initialItems)
  const [addingTo, setAddingTo]    = useState<string | null>(null)
  const [editId, setEditId]        = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  // New category prompt state
  const [addingCat, setAddingCat]  = useState(false)
  const [newCatName, setNewCatName] = useState('')
  // Tracks categories that exist only in UI (no skills yet)
  const [pendingCats, setPendingCats] = useState<string[]>([])

  const categories = Array.from(new Set([
    ...items.map(s => s.category),
    ...pendingCats,
  ]))

  const grouped = categories.map(cat => ({
    cat,
    skills: items.filter(s => s.category === cat).sort((a, b) => a.sort_order - b.sort_order),
  }))

  const handleAdd = useCallback((data: Partial<Skill>) => {
    if (!data.name?.trim()) { toast.error('Name is required'); return }
    if (!data.category?.trim()) { toast.error('Category is required'); return }
    const optimistic: Skill = {
      id: crypto.randomUUID(),
      name:        data.name!,
      category:    data.category!,
      proficiency: data.proficiency!,
      sort_order:  data.sort_order!,
    }
    setItems(prev => [...prev, optimistic])
    setPendingCats(prev => prev.filter(c => c !== data.category))
    setAddingTo(null)
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
  }, [])

  const handleEdit = useCallback((id: string, data: Partial<Skill>) => {
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
  }, [])

  const handleDelete = useCallback((id: string) => {
    setItems(prev => prev.filter(s => s.id !== id))
    startTransition(async () => {
      try {
        await deleteSkill(id)
        toast.success('Skill deleted')
      } catch {
        toast.error('Failed to delete skill')
      }
    })
  }, [])

  const handleCreateCategory = () => {
    const name = newCatName.trim()
    if (!name) { toast.error('Category name is required'); return }
    if (categories.some(c => c.toLowerCase() === name.toLowerCase())) {
      toast.error('Category already exists'); return
    }
    setPendingCats(prev => [...prev, name])
    setAddingTo(name)
    setAddingCat(false)
    setNewCatName('')
  }

  const handleRenameCategory = useCallback((oldName: string, newName: string) => {
    setItems(prev => prev.map(s => s.category === oldName ? { ...s, category: newName } : s))
    startTransition(async () => {
      try {
        await renameCategory(oldName, newName)
        toast.success(`Renamed to "${newName}"`)
      } catch {
        setItems(prev => prev.map(s => s.category === newName ? { ...s, category: oldName } : s))
        toast.error('Failed to rename category')
      }
    })
  }, [])

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Skills</h1>
          <p className="text-sm text-slate-400 mt-1">
            {items.length} skills across {grouped.length} categories
          </p>
        </div>
        <button
          onClick={() => { setAddingCat(true); setEditId(null) }}
          disabled={pending}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
        >
          <Plus size={15} /> Add Category
        </button>
      </div>

      {/* New category prompt */}
      {addingCat && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-indigo-500/30 bg-[#0f0f1a] px-5 py-4">
          <input
            autoFocus
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter')  handleCreateCategory()
              if (e.key === 'Escape') { setAddingCat(false); setNewCatName('') }
            }}
            placeholder="Category name, e.g. DevOps"
            className="flex-1 rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={handleCreateCategory}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            <Check size={13} /> Create
          </button>
          <button
            onClick={() => { setAddingCat(false); setNewCatName('') }}
            className="rounded-xl border border-[#2d2d4a] px-3 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Category groups */}
      <div className="space-y-6">
        {grouped.map(({ cat, skills: catSkills }) => (
          <div key={cat} className="rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] overflow-hidden">
            {/* Editable header */}
            <div className="border-b border-[#2d2d4a] px-5 py-3">
              <CategoryHeader
                name={cat}
                onRename={newName => handleRenameCategory(cat, newName)}
              />
            </div>

            {/* Skill rows */}
            <div className="divide-y divide-[#1e2035]">
              {catSkills.map(skill => (
                <div key={skill.id}>
                  {editId === skill.id ? (
                    <div className="p-4">
                      <SkillForm
                        key={`edit-${skill.id}`}
                        initial={skill}
                        categories={categories}
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
                          onClick={() => { setEditId(skill.id); setAddingTo(null) }}
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

            {/* Inline add within this category */}
            {addingTo === cat ? (
              <div className="border-t border-[#2d2d4a] p-4">
                <SkillForm
                  key={`add-${cat}`}
                  initial={{ category: cat, sort_order: catSkills.length + 1 }}
                  categories={categories}
                  onSave={handleAdd}
                  onCancel={() => {
                    setAddingTo(null)
                    // Remove category if it has no skills yet (was just created)
                    if (catSkills.length === 0) setPendingCats(prev => prev.filter(c => c !== cat))
                  }}
                />
              </div>
            ) : (
              <button
                onClick={() => { setAddingTo(cat); setEditId(null) }}
                className="flex w-full items-center gap-2 border-t border-[#1e2035] px-5 py-2.5 text-xs text-slate-600 hover:bg-[#161625] hover:text-indigo-400 transition-colors"
              >
                <Plus size={12} /> Add skill to {cat}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
