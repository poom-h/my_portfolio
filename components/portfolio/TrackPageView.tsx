'use client'

import { useEffect } from 'react'

function getDevice(): 'mobile' | 'tablet' | 'desktop' {
  const w = window.innerWidth
  if (w < 768)  return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

function getOrCreateSession(): string {
  const key = 'poom_sid'
  let sid = sessionStorage.getItem(key)
  if (!sid) {
    sid = crypto.randomUUID()
    sessionStorage.setItem(key, sid)
  }
  return sid
}

export default function TrackPageView() {
  useEffect(() => {
    // Fire and forget — never block the page
    try {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path:       window.location.pathname,
          referrer:   document.referrer || null,
          session_id: getOrCreateSession(),
          device:     getDevice(),
        }),
        // Use keepalive so the request survives if the user navigates away
        keepalive: true,
      }).catch(() => {/* silently ignore */})
    } catch {
      // Never throw — tracking must never affect UX
    }
  }, [])

  return null
}
