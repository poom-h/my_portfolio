'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import ChatWindow from './ChatWindow'

export default function ChatBubble() {
  const [open, setOpen] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-28 right-6 z-50 w-[370px] max-h-[560px] flex flex-col rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] shadow-2xl shadow-black/40 overflow-hidden"
          >
            <ChatWindow onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.button
            key="close"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1e1e33] border border-[#2d2d4a] shadow-lg"
            aria-label="Close chat"
          >
            <X size={20} className="text-slate-300" />
          </motion.button>
        ) : (
          <motion.button
            key="open"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-[#2d2d4a] bg-[#0f0f1a] pl-2 pr-5 py-2 shadow-xl shadow-black/30"
            aria-label="Chat with Poom"
          >
            {/* Avatar */}
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-indigo-500/50">
              {!imgError ? (
                <Image
                  src="/avatar.jpg"
                  alt="Poom"
                  fill
                  sizes="40px"
                  className="object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600 to-violet-700 text-sm font-bold text-white">
                  P
                </div>
              )}
              {/* Live dot */}
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0f0f1a] bg-emerald-400" />
            </div>

            {/* Label */}
            <div className="text-left leading-tight">
              <p className="text-xs font-semibold text-slate-100">Chat with Poom</p>
              <p className="text-[10px] text-emerald-400">AI · Online now</p>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
