'use client'

import { useState, useTransition } from 'react'
import { Plus, Pencil, Trash2, X, Check, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { createProject, updateProject, deleteProject } from '@/lib/actions/projects'
import type { Project } from '@/types/portfolio'

function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<Project>
  onSave: (data: Omit<Project, 'id'>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    title:       initial?.title       ?? '',
    subtitle:    initial?.subtitle    ?? '',
    description: initial?.description ?? '',
    tech_stack:  (initial?.tech_stack ?? []).join(', '),
    github_url:  initial?.github_url  ?? '',
    demo_url:    initial?.demo_url    ?? '',
    featured:    initial?.featured    ?? false,
    year:        initial?.year        ?? new Date().getFullYear(),
    sort_order:  initial?.sort_order  ?? 0,
  })

  const toPayload = (): Omit<Project, 'id'> => ({
    title:       form.title,
    subtitle:    form.subtitle,
    description: form.description,
    tech_stack:  form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
    github_url:  form.github_url || undefined,
    demo_url:    form.demo_url   || undefined,
    featured:    form.featured,
    year:        form.year,
    sort_order:  form.sort_order,
  })

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-[#0f0f1a] p-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-slate-400">Title</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="Project title" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-slate-400">Subtitle</label>
          <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="e.g. Production LLM Application" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-slate-400">Description</label>
          <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none resize-none" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-slate-400">Tech Stack (comma-separated)</label>
          <input value={form.tech_stack} onChange={e => setForm(f => ({ ...f, tech_stack: e.target.value }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="Python, LangChain, FastAPI" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">GitHub URL</label>
          <input value={form.github_url} onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="https://github.com/..." />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Demo URL</label>
          <input value={form.demo_url} onChange={e => setForm(f => ({ ...f, demo_url: e.target.value }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" placeholder="https://..." />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Year</label>
          <input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-400">Sort Order</label>
          <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
            className="w-full rounded-xl border border-[#2d2d4a] bg-[#161625] px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none" />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
          className="h-4 w-4 rounded accent-indigo-500" />
        <span className="text-sm text-slate-300">Featured project</span>
      </label>
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

export default function ProjectsAdminClient({ initialItems }: { initialItems: Project[] }) {
  const [items, setItems]   = useState<Project[]>(initialItems)
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const handleAdd = (data: Omit<Project, 'id'>) => {
    if (!data.title?.trim()) { toast.error('Title is required'); return }
    const optimistic: Project = { id: crypto.randomUUID(), ...data }
    setItems(prev => [...prev, optimistic])
    setAdding(false)
    startTransition(async () => {
      try {
        await createProject(data)
        toast.success('Project added!')
      } catch {
        setItems(prev => prev.filter(p => p.id !== optimistic.id))
        toast.error('Failed to save project')
      }
    })
  }

  const handleEdit = (id: string, data: Omit<Project, 'id'>) => {
    setItems(prev => prev.map(p => p.id === id ? { id, ...data } : p))
    setEditId(null)
    startTransition(async () => {
      try {
        await updateProject(id, data)
        toast.success('Updated!')
      } catch {
        toast.error('Failed to update project')
      }
    })
  }

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(p => p.id !== id))
    startTransition(async () => {
      try {
        await deleteProject(id)
        toast.success('Deleted')
      } catch {
        toast.error('Failed to delete project')
      }
    })
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Projects</h1>
          <p className="text-sm text-slate-400 mt-1">{items.length} projects · {items.filter(p => p.featured).length} featured</p>
        </div>
        <button onClick={() => { setAdding(true); setEditId(null) }} disabled={pending}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50">
          <Plus size={15} /> Add Project
        </button>
      </div>

      {adding && (
        <div className="mb-6">
          <ProjectForm onSave={handleAdd} onCancel={() => setAdding(false)} />
        </div>
      )}

      <div className="space-y-3">
        {items.sort((a, b) => a.sort_order - b.sort_order).map(project => (
          <div key={project.id} className="rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] overflow-hidden">
            {editId === project.id ? (
              <div className="p-4">
                <ProjectForm initial={project} onSave={d => handleEdit(project.id, d)} onCancel={() => setEditId(null)} />
              </div>
            ) : (
              <div className="flex items-start gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-slate-100">{project.title}</p>
                    {project.featured && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] text-amber-400">
                        <Star size={9} /> Featured
                      </span>
                    )}
                    <span className="text-xs text-slate-600">{project.year}</span>
                  </div>
                  <p className="text-xs text-indigo-400 mt-0.5">{project.subtitle}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{project.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.tech_stack.map(t => (
                      <span key={t} className="rounded-md bg-[#1e1e33] px-2 py-0.5 text-[10px] text-slate-400 border border-[#2d2d4a]">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => { setEditId(project.id); setAdding(false) }}
                    className="rounded-lg p-1.5 text-slate-500 hover:text-indigo-400 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(project.id)}
                    className="rounded-lg p-1.5 text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
