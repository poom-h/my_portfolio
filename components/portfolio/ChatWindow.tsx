'use client'

// TODO: Requires GROQ_API_KEY in .env.local — see app/api/chat/route.ts for setup.

import { useState, useRef, useEffect } from 'react'
import { Send, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const GREETING = "Hey 👋 I'm Poom — well, an AI version of me. Ask me anything about my work, skills, projects, or what I'm currently building."

const SUGGESTIONS = [
  "What projects are you working on?",
  "What's your tech stack?",
  "Are you open to work?",
]

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages]   = useState<Message[]>([{ role: 'assistant', content: GREETING }])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [thinking, setThinking]   = useState(false)
  const [imgError, setImgError]   = useState(false)
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const inputRef                  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  async function send(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: msg }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setThinking(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.filter(m => !(m.role === 'assistant' && m.content === GREETING)),
        }),
      })

      if (!res.ok || !res.body) throw new Error('Failed')

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantMsg = ''
      let firstChunk   = true

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        if (firstChunk) {
          setThinking(false)
          firstChunk = false
          setMessages(prev => [...prev, { role: 'assistant', content: '' }])
        }

        assistantMsg += decoder.decode(value, { stream: true })
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: assistantMsg },
        ])
      }
    } catch {
      setThinking(false)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Hmm, something went wrong on my end. Try again in a sec!" },
      ])
    } finally {
      setLoading(false)
      setThinking(false)
      inputRef.current?.focus()
    }
  }

  return (
    <>
      {/* ── Header ── */}
      <div className="flex items-center gap-3 border-b border-[#2d2d4a] bg-[#0d0d1a] px-4 py-3">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-indigo-500/40">
          {!imgError ? (
            <Image
              src="/avatar.jpg"
              alt="Poom"
              fill
              sizes="36px"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-700 text-xs font-bold text-white">
              P
            </div>
          )}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0d0d1a] bg-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-100">Poom Hirunwiwatkul</p>
          <p className="text-[11px] text-emerald-400">AI version · always online</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ maxHeight: '380px' }}>

        {/* Suggestion chips — only when no user message yet */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 pb-1"
          >
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-[#2d2d4a] bg-[#161625] px-3 py-1.5 text-[11px] text-slate-400 hover:border-indigo-500/50 hover:text-slate-200 transition-all"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}

        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Avatar next to Poom's messages */}
            {m.role === 'assistant' && (
              <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-[#2d2d4a] mb-0.5">
                {!imgError ? (
                  <Image src="/avatar.jpg" alt="Poom" fill sizes="24px" className="object-cover" onError={() => setImgError(true)} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-700 text-[9px] font-bold text-white">P</div>
                )}
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-[#1a1a2e] text-slate-200 rounded-bl-sm border border-[#2d2d4a]'
              }`}
            >
              {m.content}
            </div>
          </motion.div>
        ))}

        {/* Thinking indicator — shown before first streaming chunk */}
        <AnimatePresence>
          {thinking && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-2"
            >
              <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-[#2d2d4a]">
                {!imgError ? (
                  <Image src="/avatar.jpg" alt="Poom" fill sizes="24px" className="object-cover" onError={() => setImgError(true)} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-700 text-[9px] font-bold text-white">P</div>
                )}
              </div>
              <div className="rounded-2xl rounded-bl-sm border border-[#2d2d4a] bg-[#1a1a2e] px-4 py-3">
                <span className="flex gap-1.5 items-center">
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="border-t border-[#2d2d4a] bg-[#0d0d1a] p-3 flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask me anything..."
          disabled={loading}
          className="flex-1 rounded-xl bg-[#161625] px-3.5 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 border border-[#2d2d4a] focus:outline-none focus:border-indigo-500/60 transition-colors disabled:opacity-50"
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || loading}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
        >
          <Send size={15} />
        </button>
      </div>
    </>
  )
}
