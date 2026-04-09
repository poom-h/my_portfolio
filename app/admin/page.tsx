'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/dashboard')
    } else {
      setError('Incorrect password')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] p-8"
      >
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
            P
          </div>
          <h1 className="text-sm font-semibold text-slate-100">poom.dev</h1>
        </div>

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          required
          className="mb-3 w-full rounded-lg border border-[#2d2d4a] bg-[#1a1a2e] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
        />

        {error && <p className="mb-3 text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Verifying…' : 'Enter'}
        </button>
      </form>
    </div>
  )
}
